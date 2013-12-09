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

var azureCommon = require('azure-common');
var Constants = azureCommon.Constants;
var EventEmitter = require('events').EventEmitter;
var BlobConstants = Constants.BlobConstants;

/**
* BlockBlob block range stream
*/
function BlobBlockRangeStream (blobServiceClient, container, blob) {
  this.blobServiceClient = blobServiceClient;
  this.container = container;
  this.blob = blob;
  this._emitter = new EventEmitter();
  this._paused = false;
  this._emittedAll = false;
  this._emittedRangeType = null;
  this._emittedRangeIndex = null;
  this._offset = 0;
  this._rangelist = null;
  this._isEmitting = false;
  this.rangeSize = -1;
}

/**
* Add event listener
*/
BlobBlockRangeStream.prototype.on = function(event, listener) {
  this._emitter.on(event, listener);
};

/**
* Get block list
*/
BlobBlockRangeStream.prototype.list = function(options) {
  if (!options) {
    options = {};
  }

  if (!options.bloblistType) {
    options.bloblistType = BlobConstants.BlockListFilter.ALL;
  }


  var self = this;
  this.blobServiceClient.listBlobBlocks(this.container, this.blob, options.bloblistType, options, function(error, blocklist, response) {
    if (error) throw error;

    var totalSize = parseInt(response.headers[Constants.HeaderConstants.CONTENT_LENGTH_HEADER], 10);
    self.rangeSize = totalSize;
    if (!blocklist.CommittedBlocks) {
      //Convert single block blob to block blob range
      var tempName = 'NODESDK_BLOCKBLOB_RANGESTREAM';
      blocklist.CommittedBlocks = [{Name : tempName, Size : totalSize}];
    }

    self._rangelist = blocklist;
    self._emitBlockList();
    self = blocklist = null;
  });
};

/**
* Emit block range
*/
BlobBlockRangeStream.prototype._emitBlockList = function () {
  if(this._paused || this._emittedAll || this._isEmitting) return;
  this._isEmitting = true;
  try {
    var typeStart = false;
    for(var blockType in this._rangelist) {
      if(this._rangelist.hasOwnProperty(blockType)) {
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
          range['size'] = parseInt(range['Size'], 10);
          range['dataSize'] = range['size'];
          //follow the same naming convention of BlobPangeRanges and json
          delete range['Name'];
          delete range['Size'];
          range['type'] = blockType;
          range['start'] = this._offset;
          this._offset += range['size'];
          range['end'] = this._offset - 1;

          this._emitter.emit('range', range);
        }
        //Remove the used range and don't leak memory
        this._rangelist[blockType] = null;
      }
    }

    this._rangelist = null;
    this._emittedAll = true;
    this._emitter.emit('end');
  } finally {
    this._isEmitting = false;
  }
};

/**
* Pause the stream
*/
BlobBlockRangeStream.prototype.pause = function () {
  this._paused = true;
};

/**
* Resume the stream
*/
BlobBlockRangeStream.prototype.resume = function () {
  this._paused = false;
  if(!this._isEmitting) {
    this._emitBlockList();
  }
};

module.exports = BlobBlockRangeStream;
