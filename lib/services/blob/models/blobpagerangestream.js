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

var EventEmitter = require('events').EventEmitter;
var Constants = require('../../../util/constants');

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
  this._rangelist = null;
  this._isEmitting = false;
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
  this.blobServiceClient.listBlobRegions(this.container, this.blob, options.start, options.end, options, function(error, ranges, response) {
    if (error) throw error;
    var totalSize = parseInt(response.headers[Constants.HeaderConstants.CONTENT_LENGTH_HEADER], 10);
    self.rangeSize = totalSize;
    if (!ranges.length || ranges[ranges.length - 1].end != totalSize - 1) {
      //Convert single page blob to page blob range
      //start bigger than end means there is no valid page regions
      ranges.push({start : totalSize, end : totalSize - 1});
    }
    self._rangelist = self.resizeRanges(ranges);
    self._emitPageRange();
    self = ranges = null;
  });
};

/**
* Resize page regions into small pieces which are not larger than 4MB
*/
BlobPageRangeStream.prototype.resizeRanges = function(ranges) {
  var newRanges = [];
  var size = 0;
  var offset = 0;
  var limitedSize = 0;
  var range = null;
  var maxSize = Constants.BlobConstants.DEFAULT_WRITE_PAGE_SIZE_IN_BYTES;
  for(var i = 0, len = ranges.length; i < len; i++) {
    range = ranges[i];
    offset = range.start;
    size = range.end - range.start + 1;
    if (size === 0) {
      //Enqueue the full page instead of empty page regions. See BlobPageRangeStream.prototype.list.
      var fullRange = {type : 'Page', size : 0, start : range.start, end : range.end};
      newRanges.push(fullRange);
    } else {
      while(size > 0) {
        var newRange = {type : 'Page', size : 0, start : -1, end : -1};
        limitedSize = Math.min(size, maxSize);
        newRange.start = offset;
        newRange.size = limitedSize;
        offset += limitedSize;
        newRange.end = offset - 1;
        newRanges.push(newRange);
        size -= limitedSize;
      }
    }
  }
  return newRanges;
};

/**
* Emit page range
*/
BlobPageRangeStream.prototype._emitPageRange = function () {
  if(this._paused || this._emittedAll || this._isEmitting) return;
  this._isEmitting = true;
  try {
    for(var len = this._rangelist.length; this._emittedRangeIndex < len; this._emittedRangeIndex++) {
      if(this._paused) {
        return;
      }
      var range = this._rangelist[this._emittedRangeIndex];
      this._emitter.emit('range', range);
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
