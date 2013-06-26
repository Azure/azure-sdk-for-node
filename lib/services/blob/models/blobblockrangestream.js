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

var azure = require('azure');
var EventEmitter = require('events').EventEmitter;
var Constants = azure.Constants;
var BlobConstants = Constants.BlobConstants;

var BlobBlockRangeStream = function(blobServiceClient, container, blob) {
  this.blobServiceClient = blobServiceClient;
  this.container = container;
  this.blob = blob;
  this._emitter = new EventEmitter;
  this._paused = false;
  this._emittedAll = false;
  this._emittedRangeType = null;
  this._emittedRangeIndex = null;
  this._offset = 0;
  this._rangelist = null;
  this._isEmitting = false;
}

BlobBlockRangeStream.prototype.on = function(event, listener) {
  this._emitter.on(event, listener);
}

BlobBlockRangeStream.prototype.list = function(bloblistType, options) {
  if (!bloblistType) {
    bloblistType = BlobConstants.BlockListFilter.ALL;  
  }

  var self = this;
  this.blobServiceClient.listBlobBlocks(this.container, this.blob, bloblistType, function(error, blocklist) {
    if (error) throw error;
    self._rangelist = blocklist;
    self._emitBlockList();
    self = blocklist = null;
  });
}

BlobBlockRangeStream.prototype._emitBlockList = function () {
  if(this._paused || this._emittedAll || this._isEmitting) return;
  this._isEmitting = true;
  try {
    var typeStart = false;
    for(var blockType in this._rangelist) {
      if(this._emittedRangeType === null || typeStart || this._emittedRangeType == blockType) {
        this._emittedRangeType = blockType; 
        typeStart = true;  
      } else if (this._emittedRangeType !== blockType) {
        continue; 
      }

      if(this._paused) {
        return;
      }
      
      var blockList = this._rangelist[blockType];
      var indexStart = false;
      for(var blockIndex = 0, len = blockList.length; blockIndex < len; blockIndex++) {
        if (this._emittedRangeIndex === null || indexStart || this._emittedRangeIndex === blockIndex) {
          this._emittedRangeIndex = blockIndex; 
          indexStart = true;
        } else if (this._emittedRangeIndex !== blockIndex) {
          continue;
        }

        if(this._paused) {
          return;  
        }

        var range = blockList[blockIndex];
        range['name'] = range['Name'];
        range['size'] = parseInt(range['Size']);
        //follow the same naming covention of BlobPangeRanges and json
        delete range['Name'];
        delete range['Size'];
        range['type'] = blockType;
        range['start'] = this._offset;
        this._offset += range['size']; 
        range['end'] = this._offset - 1;

        this._emitter.emit('range', range);
      } 
      
      this._rangelist = null;
      this._emittedAll = true;
      this._emitter.emit('end');
    }
  } finally {
    this._isEmitting = false;  
  }
}

BlobBlockRangeStream.prototype.pause = function () {
  this._paused = true;  
}

BlobBlockRangeStream.prototype.resume = function () {
  this._paused = false;
  if(!this._isEmitting) {    
    this._emitBlockList();
  }
}

module.exports = BlobBlockRangeStream;
