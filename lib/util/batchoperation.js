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

/**
* Concurrent execute batch rest operation and call operation callback randomly and in sequence.
*
*/
function BatchOperation(name, options) {
  if (!options) {
    options = {};
  }
  
  this.name = name;
  this.logger = options.logger || new Logger(Logger.LogLevels.DEBUG);
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
}

BatchOperation.setConcurrency = function(concurrency) {
  globalConcurrency = concurrency; 
  http.globalAgent.maxSockets = Math.max(globalConcurrency, http.globalAgent.maxSockets);
}

BatchOperation.prototype.IsWorkloadHeavy = function() {
  //Only support one batch operation for now.
  //In order to work with the multiple batch operation, we can use global operation track objects
  //BatchOperation acquire a bunch of operation ids from global and allocated ids to RestOperation
  //RestOperation start to run in order of id
  return this._activeOperation >= globalConcurrency;
}

BatchOperation.prototype.addOperation = function(operation) {
  this._operations.push(operation);
  operation.status = OperationState.QUEUED;
  operation.operationId = this._getActiveOperationId();
  this._queuedOperation ++;
  this._totalOperation++;
  this.logger.debug(util.format('Add operation %d into batch operation %s.', operation.operationId, this.name));
  if(this.IsWorkloadHeavy()) {
    return true;
  } else {
    //Immediately start the idle operation if workload  isn't heavy
    this._startIdleOperation();
    return false;
  }
}

BatchOperation.prototype.enableComplete = function() {
  this._enableComplete = true;
  this.logger.debug(util.format('Enable batch operation %s complete', this.name));
  //check idle operation
  this._startIdleOperation();
}

BatchOperation.prototype.on = function(event, listener) {
  if(!this._emitter) this._emitter = new EventEmitter;  
  this._emitter.on(event, listener);
}


BatchOperation.prototype._startIdleOperation = function() {
  if (this.IsWorkloadHeavy()) {
    return;
  }
  
  if (this._queuedOperation == 0) {
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
}

BatchOperation.prototype._runOperation = function (operation) {
  this.logger.debug(util.format('Operation %d start to run', operation.operationId));
  var cb = this.getRestOperationCallback(operation);
  operation.run(cb);
  this._activeOperation++; 
  this._queuedOperation--;
}

BatchOperation.prototype.getRestOperationCallback = function (operation) {
  var self = this;
  return function (error, retValue) {
    self._activeOperation--;
    if (error) {
      self.logger.debug(util.format('Operation %d failed. Error %s', operation.operationId, error));
    } else {
      self.logger.debug(util.format('Operation %d succeed', operation.operationId));
    }
    operation._callbackArguments = arguments;
    if(self.callbackInorder) {
      if(self._currentOperationId == operation.operationId) {
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
  }
}

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
    operation.status = OperationState.COMPLETE;
    index = operation = null;
    if(this._operations.length == 0) {
      //Emit end event with callbackInorder
      this._tryEmitEndEvent();
    } else if(this.callbackInorder) {
      var self = this;
      this._currentOperationId++;
      process.nextTick(function(){
        self._fireOperationUserCallback();
        self = null;
      });
    }
  }
}

BatchOperation.prototype._tryEmitEndEvent = function () {
  if(this._enableComplete && this._emitter && this._activeOperation == 0 && this._operations.length == 0) {
    if(!this._ended) {
      this._ended = true;
      this.logger.debug(util.format('Batch operation %s emit the end event', this.name));
      this._emitter.emit('end');
      return true;
    } 
  }
  return false;
}

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
}

BatchOperation.prototype._getActiveOperationId() {
  return ++this._totalOperation;
}

var OperationState = {
  INITED : 'Inited',
  QUEUED : 'queued',
  RUNNING : 'running',
  COMPLETE : 'complete',
  CALLBACK : 'callback',
  ERROR : 'error'
};

BatchOperation.OperationState = OperationState;


function RestOperation(serviceClient, operation) {
  this.status = OperationState.Inited;
  this.operationId = -1;
  this._userCallback = arguments[arguments.length - 1];
  this._callbackArguments = null;
  var sliceEnd = arguments.length;
  if(utils.isFunction(this._userCallback)) {
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
  }
  this._fireUserCallback = function () {
    debugger;
    if(this._userCallback) {
      this._userCallback.apply(null, this._callbackArguments);
    }
    this._userCallback = this._callbackArguments = 'x';
  }
}

BatchOperation.RestOperation = RestOperation;

module.exports = BatchOperation;
