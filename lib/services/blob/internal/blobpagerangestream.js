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

/**
* PageBlob page range stream
*/
function BlobPageRangeStream (blobServiceClient, container, blob) {
  this.blobServiceClient = blobServiceClient;
  this.container = container;
  this.blob = blob;
  this.rangeSize = -1;
  this._emitter = new EventEmitter();
  this._paused = false;
  this._emittedAll = false;
  this._emittedRangeIndex = 0;
  this._rangelist = [];
  this._isEmitting = false;
  this._startOffset = 0;
  this._rangeStreamEnded = false;
  this._dataOffset = 0;
}

/**
* Add event listener
*/
BlobPageRangeStream.prototype.on = function(event, listener) {
  this._emitter.on(event, listener);
};

/**
* Get page list
*/
BlobPageRangeStream.prototype.list = function(options) {
  var self = this;
  var start = this._startOffset;
  var singleRangeSize = Constants.BlobConstants.MAX_SINGLE_GET_PAGE_RANGE_SIZE;
  var end = this._startOffset + singleRangeSize - 1;
  //http://blogs.msdn.com/b/windowsazurestorage/archive/2012/03/26/getting-the-page-ranges-of-a-large-page-blob-in-segments.aspx
  this.blobServiceClient.listBlobRegions(this.container, this.blob, start, end, options, function(error, ranges, response) {
    if (error) throw error;
    var totalSize = parseInt(response.headers[Constants.HeaderConstants.CONTENT_LENGTH_HEADER], 10);
    var endOffset = totalSize - 1;
    var rangeEnd = Math.min(end, endOffset);
    self.rangeSize = totalSize;
    if (!ranges.length) {
      //Convert single page blob to page blob range
      //start bigger than end means there is no valid page regions
      ranges.push({start : start, end : rangeEnd, dataSize: 0});
    } else if(ranges[ranges.length - 1].end !== rangeEnd) {
      //Don't forget the zero chunk at the end of range
      ranges.push({start : ranges[ranges.length - 1].end + 1, end : rangeEnd, dataSize: 0});
    }

    if(end >= endOffset) {
      self._rangeStreamEnded = true;
    }
    self.resizeAndSaveRanges(ranges);
    self._startOffset += singleRangeSize;
    self._emitPageRange();
    if(end < endOffset) {
      process.nextTick(function(){
        self.list(options);
        self = ranges = null;
      });
    }
  });
};

/**
* Resize page regions into small pieces which are not larger than 4MB
*/
BlobPageRangeStream.prototype.resizeAndSaveRanges = function(ranges) {
  var rangeList = this._rangelist;
  var offset = 0;
  var range = null;
  for(var i = 0, len = ranges.length; i < len; i++) {
    range = ranges[i];
    offset = range.start;
    if(this._dataOffset != range.start) {
      //Padding zero for empty page range
      var zeroDataRange = {type : 'Page', size : -1, dataSize : 0, start : this._dataOffset, end : range.start - 1};
      this.splitPageRanges(zeroDataRange, rangeList);
    }

    this.splitPageRanges(range, rangeList);
    this._dataOffset = range.end + 1;
  }
};

/**
* Split large ranges into small pieces in order to get rid of OOM
* For example, [0, 10G - 1] => [0, 4M - 1], [4M, 8M - 1] ... [10G - 4M, 10G - 1]
*/
BlobPageRangeStream.prototype.splitPageRanges = function(range, rangeList) {
  var rangeSize = range.end - range.start + 1;
  var offset = range.start;
  var limitedSize = 0;
  var maxSize = Constants.BlobConstants.DEFAULT_WRITE_PAGE_SIZE_IN_BYTES;
  while(rangeSize > 0) {
    var newRange = {type : 'Page', size : 0, dataSize : 0, start : -1, end : -1};
    limitedSize = Math.min(rangeSize, maxSize);
    newRange.start = offset;
    newRange.size = limitedSize;
    if(range.dataSize === 0) {
      newRange.dataSize = 0;
    } else {
      newRange.dataSize = limitedSize;
    }
    offset += limitedSize;
    newRange.end = offset - 1;
    rangeList.push(newRange);
    rangeSize -= limitedSize;
  }
};

/**
* Emit page range
*/
BlobPageRangeStream.prototype._emitPageRange = function () {
  if(this._paused || this._emittedAll || this._isEmitting) return;
  this._isEmitting = true;
  try {
    for(; this._emittedRangeIndex < this._rangelist.length; this._emittedRangeIndex++) {
      if(this._paused) {
        return;
      }
      var range = this._rangelist[this._emittedRangeIndex];
      this._emitter.emit('range', range);
      this._rangelist[this._emittedRangeIndex] = null;
    }

    if(this._rangeStreamEnded) {
      this._rangelist = null;
      this._emittedAll = true;
      this._emitter.emit('end');
    }//Otherwise we should wait for the other getPageRanges
  } finally {
    this._isEmitting = false;
  }
};

/**
* Pause the stream
*/
BlobPageRangeStream.prototype.pause = function () {
  this._paused = true;
};

/**
* Resume the stream
*/
BlobPageRangeStream.prototype.resume = function () {
  this._paused = false;
  if(!this._isEmitting) {
    this._emitPageRange();
  }
};

module.exports = BlobPageRangeStream;
