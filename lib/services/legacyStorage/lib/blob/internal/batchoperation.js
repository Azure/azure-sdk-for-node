// 
// Copyright (c) Microsoft and contributors.  All rights reserved.
// 
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//   http://www.apache.org/licenses/LICENSE-2.0
// 
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// 
// See the License for the specific language governing permissions and
// limitations under the License.
// 

var util = require('util');
var http = require('http');
var https = require('https');
var EventEmitter = require('events').EventEmitter;
var os = require('os');

var azureCommon = require('azure-common');
var utils = azureCommon.util;
var Logger = azureCommon.Logger;

var DEFAULT_OPERATION_MEMORY_USAGE = azureCommon.Constants.BlobConstants.DEFAULT_WRITE_BLOCK_SIZE_IN_BYTES;
var DEFAULT_GLOBAL_CONCURRENCY = 5; //Default http connection limitation for nodejs

var SystemTotalMemory = os.totalmem();
var nodeVersion = utils.getNodeVersion();
var enableReuseSocket = nodeVersion.major >= 0 && nodeVersion.minor >= 10;

/**
* Concurrent execute batch operation and call operation callback randomly or in sequence.
* Random mode is for uploading.
*   1. Fire user callback when the operation is done.
* Sequence mode is for downloading.
*   1. Fire user callback when the operation is done and all previous operation and callback has finished.
*   2. BatchOperation guarantee the user callback is fired one by one.
*   3. The next user callback can't be fired util the current one complete.
*/
function BatchOperation(name, options) {
  if (!options) {
    options = {};
  }

  this.name = name;
  this.logger = options.logger || new Logger(Logger.LogLevels.INFO);
  this.operationMemoryUsage = options.operationMemoryUsage || DEFAULT_OPERATION_MEMORY_USAGE;
  this.callbackInorder = options.callbackInorder === true;
  this._currentOperationId = this.callbackInorder ? 1 : -1;
  this.concurrency = DEFAULT_GLOBAL_CONCURRENCY;
  //Total operations count(queued and active and connected)
  this._totalOperation = 0;
  //Action operations count(The operations which are connecting to remote or executing callback or queued for executing)
  this._activeOperation = 0;
  //Queued operations count(The operations which are connecting to remote or queued for executing)
  this._queuedOperation = 0;
  //finished operation should be removed from this array
  this._operations = [];
  this._emitter = null;
  this._enableComplete = false;
  this._ended = false;
  this._error = null;
  this._paused = false;
}

/**
* Operation state
*/
var OperationState = {
  INITED : 'inited',
  QUEUED : 'queued',
  RUNNING : 'running',
  COMPLETE : 'complete',
  CALLBACK : 'callback',
  ERROR : 'error'
};

BatchOperation.OperationState = OperationState;

/**
* Set batch operation concurrency
*/
BatchOperation.prototype.setConcurrency = function(concurrency) {
  if (concurrency) {
    this.concurrency = concurrency;
    http.globalAgent.maxSockets = this.concurrency;
    https.globalAgent.maxSockets = this.concurrency;
  }
};

/**
* Is the workload heavy and It can used to determine whether we could queue operations
*/
BatchOperation.prototype.IsWorkloadHeavy = function() {
  //Only support one batch operation for now.
  //In order to work with the multiple batch operation, we can use global operation track objects
  //BatchOperation acquire a bunch of operation ids from global and allocated ids to RestOperation
  //RestOperation start to run in order of id
  var sharedRequest = 1;
  if(enableReuseSocket) {
    sharedRequest = 5;
  }
  return this._activeOperation >= sharedRequest * this.concurrency ||
    (this._activeOperation >= this.concurrency && this._getApproximateMemoryUsage() > 0.5 * SystemTotalMemory);
};

/**
* get the approximate memory usage for batch operation
*/
BatchOperation.prototype._getApproximateMemoryUsage = function() {
  var currentUsage = process.memoryUsage().rss;
  var futureUsage = this._queuedOperation * this.operationMemoryUsage;
  return currentUsage + futureUsage;
};

/**
* Add a operation into batch operation
*/
BatchOperation.prototype.addOperation = function(operation) {
  this._operations.push(operation);
  operation.status = OperationState.QUEUED;
  operation.operationId = this._getActiveOperationId();
  this._queuedOperation++;
  this.logger.debug(util.format('Add operation %d into batch operation %s.', operation.operationId, this.name));
  //Immediately start the idle operation if workload isn't heavy
  this._runOperation(operation);
  return this.IsWorkloadHeavy();
};

/**
* Enable batch operation complete when there is no operation to run.
*/
BatchOperation.prototype.enableComplete = function() {
  this._enableComplete = true;
  this.logger.debug(util.format('Enable batch operation %s complete', this.name));
  this._tryEmitEndEvent();
};

/**
* Stop firing user call back
*/
BatchOperation.prototype.pause = function() {
  this._paused = true;
};

/**
* Start firing user call back
*/
BatchOperation.prototype.resume = function() {
  if (this._paused) {
    this._paused = false;
    this._fireOperationUserCallback();
  }
};

/**
* Add event listener
*/
BatchOperation.prototype.on = function(event, listener) {
  if(!this._emitter) this._emitter = new EventEmitter();
  if(this._ended && event === 'end') {
    listener();
  } else {
    this._emitter.on(event, listener);
  }
};

/**
* Run operation
*/
BatchOperation.prototype._runOperation = function (operation) {
  this.logger.debug(util.format('Operation %d start to run', operation.operationId));
  var cb = this.getBatchOperationCallback(operation);

  if(this._error) {
    cb(this._error);//Directly call the callback with previous error.
  } else {
    operation.run(cb);
  }

  this._activeOperation++;
};

/**
* Return an general operation call back.
* This callback is used to update the internal status and fire user's callback when operation is complete.
*/
BatchOperation.prototype.getBatchOperationCallback = function (operation) {
  var self = this;
  return function (error) {
    self._queuedOperation--;
    if (error) {
      self.logger.debug(util.format('Operation %d failed. Error %s', operation.operationId, error));
      //Abort the batch operation if one of them failed
      self.abort(error);
    } else {
      self.logger.debug(util.format('Operation %d succeed', operation.operationId));
    }
    operation._callbackArguments = arguments;
    if (self._paused) {
      operation.status = OperationState.CALLBACK;
      self.logger.debug(util.format('Batch operation pasued and Operation %d wait for firing callback', operation.operationId));
    } else if (self.callbackInorder) {
      if(self._currentOperationId === operation.operationId) {
        self._fireOperationUserCallback(operation);
      } else if (self._currentOperationId > operation.operationId) {
        throw new Error('Debug error: current callback operation id can\'t larger than oepration id');
      } else {
        operation.status = OperationState.CALLBACK;
        self.logger.debug(util.format('Operation %d wait for firing callback %s', operation.operationId, self._currentOperationId));
      }
    } else {
      self._fireOperationUserCallback(operation);
    }
    self._tryEmitDrainEvent();
    operation = null;
    self = null;
  };
};

/**
* Abort all the operation
*/
BatchOperation.prototype.abort = function (abortError) {
  if (abortError) {
    //Can't really abort all operations now.
    this._error = abortError;
  }
};

/**
* Fire user's call back
*/
BatchOperation.prototype._fireOperationUserCallback = function (operation) {
  var index = -1;
  if (operation) {
    index = this._operations.indexOf(operation);
  } else if (this.callbackInorder) {
    index = this._getCurrentOperationIndex();
  }
  if(index != -1 && !this._paused) {
    operation = this._operations[index];
    if(operation._userCallback) {
      this.logger.debug(util.format('Fire user call back for operation %d', operation.operationId));
      //Make sure UserCallback is a sync operation in sequence mode.
      //Both async and sync operations are available for random mode.
      operation._fireUserCallback();
    }
    this._operations.splice(index, 1);
    this._activeOperation--;
    operation.status = OperationState.COMPLETE;
    index = operation = null;
    if(this._operations.length === 0) {
      // Emit end event with callbackInorder
      this._tryEmitEndEvent();
    }
    if(this.callbackInorder) {
      this._currentOperationId++;
    }
    this._fireOperationUserCallback();
  } else {
    this._tryEmitDrainEvent();
  }
};

/**
* Try to emit the BatchOperation end event
* End event means all the operation and callback already finished.
*/
BatchOperation.prototype._tryEmitEndEvent = function () {
  if(this._enableComplete  && this._activeOperation === 0 && this._operations.length === 0) {
    this._ended = true;
    if(this._emitter) {
      this.logger.debug(util.format('Batch operation %s emit the end event', this.name));
      var retValue = null;
      this._emitter.emit('end', this._error, retValue);
    }
    return true;
  }
  return false;
};

/**
* Try to emit the drain event
*/
BatchOperation.prototype._tryEmitDrainEvent = function () {
  if(!this._emitter) return false;
  if(!this.IsWorkloadHeavy() || this._activeOperation < this.concurrency) {
    this._emitter.emit('drain');
    return true;
  }
  return false;
};

/**
* Get the current active operation index.
* Only the active operation could call user's callback in sequence model.
* The other finished but not active operations should wait for wake up.
*/
BatchOperation.prototype._getCurrentOperationIndex = function () {
  var operation = null;
  for(var i = 0, len = this._operations.length; i < len; i++) {
    operation = this._operations[i];
    if (this.callbackInorder) {
      //Sequence mode
      if(operation.operationId == this._currentOperationId) {
        if (operation.status === OperationState.CALLBACK) {
          return i;
        } else if (operation.status === OperationState.COMPLETE) {
          this._currentOperationId ++;
          return this._getCurrentOperationIndex();
        } else {
          break;
        }
      }
    } else {
      //Random mode
      if (operation.status === OperationState.CALLBACK) {
        return i;
      }
    }
  }
  return -1;
};

/**
* Get an operation id
*/
BatchOperation.prototype._getActiveOperationId = function() {
  return ++this._totalOperation;
};

/**
* Rest operation in sdk
*/
function RestOperation(serviceClient, operation) {
  this.status = OperationState.Inited;
  this.operationId = -1;
  this._userCallback = arguments[arguments.length - 1];
  this._callbackArguments = null;
  var sliceEnd = arguments.length;
  if(utils.objectIsFunction(this._userCallback)) {
    sliceEnd--;
  } else {
    this._userCallback = null;
  }
  var operationArguments = Array.prototype.slice.call(arguments).slice(2, sliceEnd);
  sliceEnd = null;
  this.run = function(cb) {
    var func = serviceClient[operation];
    if(!func) {
      throw new Error(util.format('Unknown operation %s in serviceclient', operation));
    } else {
      if(!cb) cb = this._userCallback;
      operationArguments.push(cb);
      this.status = OperationState.RUNNING;
      func.apply(serviceClient, operationArguments);
      operationArguments = serviceClient = operation = null;
    }
  };

  this._fireUserCallback = function () {
    if(this._userCallback) {
      this._userCallback.apply(null, this._callbackArguments);
    }
    this._userCallback = this._callbackArguments = null;
  };
}

BatchOperation.RestOperation = RestOperation;

/**
* Common operation wrapper
*/
function CommonOperation(operationFunc, callback) {
  this.status = OperationState.Inited;
  this.operationId = -1;
  this._callbackArguments = null;
  var sliceStart = 2;
  if(utils.objectIsFunction(callback)) {
    this._userCallback = callback;
  } else {
    this._userCallback = null;
    sliceStart = 1;
  }
  var operationArguments = Array.prototype.slice.call(arguments).slice(sliceStart);
  this.run = function(cb) {
    if(!cb) cb = this._userCallback;
    operationArguments.push(cb);
    this.status = OperationState.RUNNING;
    operationFunc.apply(null, operationArguments);
    operationArguments = operationFunc = null;
  };

  this._fireUserCallback = function () {
    if(this._userCallback) {
      this._userCallback.apply(null, this._callbackArguments);
    }
    this._userCallback = this._callbackArguments = null;
  };
}

BatchOperation.CommonOperation = CommonOperation;

/**
* Do nothing and directly call the callback.
* In random mode, the user callback will be called immediately
* In sequence mode, the user callback will be called after the previous callback has been called
*/
BatchOperation.noOperation = function(cb) {
  cb();
};

module.exports = BatchOperation;
