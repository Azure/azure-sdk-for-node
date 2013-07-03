/**
* Copyright (c) Microsoft.  All rights reserved.
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*   http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/

var util = require('util');
var utils = require('./util');
var http = require('http');
var EventEmitter = require('events').EventEmitter;
var Logger = require('../diagnostics/logger');

var DEFAULT_GLOBAL_CONCURRENCY = 5; //Default http connection limitation for nodejs
var globalConcurrency = DEFAULT_GLOBAL_CONCURRENCY;
http.globalAgent.maxSockets = Math.max(globalConcurrency, http.globalAgent.maxSockets);

/**
* Concurrent execute batch operation and call operation callback randomly or in sequence.
*/
function BatchOperation(name, options) {
  if (!options) {
    options = {};
  }

  this.name = name;
  this.logger = options.logger || new Logger(Logger.LogLevels.INFO);
  this.callbackInorder = options.callbackInorder === true;
  this._currentOperationId = this.callbackInorder ? 1 : -1;
  this._totalOperation = 0;
  this._activeOperation = 0;
  this._queuedOperation = 0;
  //finished operation should be removed from this array
  this._operations = [];
  this._emitter = null;
  this._enableComplete = false;
  this._ended = false;
  this._error = null;
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
BatchOperation.setConcurrency = function(concurrency) {
  if (concurrency) {
    globalConcurrency = concurrency;
    http.globalAgent.maxSockets = globalConcurrency;
  }
};

/**
* Is the workload heavy and reach the concurrency limitation
*/
BatchOperation.prototype.IsWorkloadHeavy = function() {
  //Only support one batch operation for now.
  //In order to work with the multiple batch operation, we can use global operation track objects
  //BatchOperation acquire a bunch of operation ids from global and allocated ids to RestOperation
  //RestOperation start to run in order of id
  return this._activeOperation >= globalConcurrency;
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
  this._startIdleOperation();
  return this.IsWorkloadHeavy();
};

/**
* Enable batch operation complete when there is no operation to run.
*/
BatchOperation.prototype.enableComplete = function() {
  this._enableComplete = true;
  this.logger.debug(util.format('Enable batch operation %s complete', this.name));
  //check idle operation
  this._startIdleOperation();
};

/**
* Add event listener
*/
BatchOperation.prototype.on = function(event, listener) {
  if(!this._emitter) this._emitter = new EventEmitter();
  this._emitter.on(event, listener);
};

/**
* Select the idle operation in operation queues to run
*/
BatchOperation.prototype._startIdleOperation = function() {
  if (this.IsWorkloadHeavy()) {
    return;
  }

  if (this._queuedOperation === 0) {
    var ended = this._tryEmitEndEvent();
    if(ended) {
      return;
    }
  } else {
    var operation = null;
    this.logger.debug(util.format('Batch operation %s start idle operation', this.name));

    for(var i = 0, count = this._operations.length; i < count; i ++) {
      operation = this._operations[i];
      if(operation.status == OperationState.QUEUED) {
        this._runOperation(operation);
        if (this.IsWorkloadHeavy()) {
          break;
        }
      }
    }
  }

  if(!this._ended) {
    if (!this.IsWorkloadHeavy() && this._emitter) {
      this.logger.debug(util.format('Batch operation %s emit the drain event', this.name));
      this._emitter.emit('drain');
    }

    this.logger.debug(util.format('Start idle operation finished. Total:%d, Active:%d, Queued:%d',
      this._totalOperation, this._activeOperation, this._queuedOperation));
  }
};

/**
* Run operation
*/
BatchOperation.prototype._runOperation = function (operation) {
  this.logger.debug(util.format('Operation %d start to run', operation.operationId));
  var cb = this.getBatchOperationCallback(operation);
  operation.run(cb);
  this._activeOperation++;
  this._queuedOperation--;
};

/**
* Return an general operation call back.
* This callback is used to update the internal status and fire user's callback when operation is complete.
*/
BatchOperation.prototype.getBatchOperationCallback = function (operation) {
  var self = this;
  return function (error) {
    if (error) {
      self.logger.debug(util.format('Operation %d failed. Error %s', operation.operationId, error));
      //Abort the batch operation if one of them failed
      self.abort(error);
    } else {
      self.logger.debug(util.format('Operation %d succeed', operation.operationId));
    }
    operation._callbackArguments = arguments;
    if(self.callbackInorder) {
      if(self._currentOperationId === operation.operationId) {
        self._fireOperationUserCallback(operation);
      } else if (self._currentOperationId > operation.operationId) {
        throw new Error('Debug error: current callback operation id can\'t larger than oepration id');
      } else {
        operation.status = OperationState.CALLBACK;
        self.logger.debug(util.format('Operation %d wait for firing callback', operation.operationId));
      }
    } else {
      self._fireOperationUserCallback(operation);
    }

    operation = null;
    process.nextTick(function(){
      self._startIdleOperation();
      self = null;
    });
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
  if(index != -1) {
    operation = this._operations[index];
    if(operation._userCallback) {
      this.logger.debug(util.format('Fire user call back for operation %d', operation.operationId));
      operation._fireUserCallback();
    }
    this._operations.splice(index, 1);
    this._activeOperation--;
    operation.status = OperationState.COMPLETE;
    index = operation = null;
    if(this._operations.length === 0) {
      //Emit end event with callbackInorder
      this._tryEmitEndEvent();
    }
    if(this.callbackInorder) {
      var self = this;
      this._currentOperationId++;
      this.logger.debug(util.format('Current Operation id %s', this._currentOperationId));
      process.nextTick(function(){
        self._fireOperationUserCallback();
        self = null;
      });
    }
  }
};

/**
* Try to emit the BatchOperation end event
* End event means all the operation and callback already finished.
*/
BatchOperation.prototype._tryEmitEndEvent = function () {
  if(this._enableComplete && this._emitter && this._activeOperation === 0 && this._operations.length === 0) {
    if(!this._ended) {
      this._ended = true;
      this.logger.debug(util.format('Batch operation %s emit the end event', this.name));
      var retValue = null;
      this._emitter.emit('end', this._error, retValue);
      return true;
    }
  }
  return false;
};

/**
* Get the current active operation index in sequence model.
* Only the active operation could call user's callback in sequence model.
* The other finished but not active operations should wait for wake up.
*/
BatchOperation.prototype._getCurrentOperationIndex = function () {
  var operation = null;
  for(var i = 0, len = this._operations.length; i < len; i++) {
    operation = this._operations[i];
    if(operation.operationId == this._currentOperationId) {
      if (operation.status == OperationState.CALLBACK) {
        return i;
      } else if (operation.status == OperationState.COMPLETE) {
        this._currentOperationId ++;
        return this._getCurrentOperationIndex();
      } else {
        break;
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

module.exports = BatchOperation;
