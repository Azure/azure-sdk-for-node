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
var BlobConstants = Constants.BlobConstants;

/**
* PageBlob page range stream
*/
var BlobPageRangeStream = function(blobServiceClient, container, blob) {
  this.blobServiceClient = blobServiceClient;
  this.container = container;
  this.blob = blob;
  this._emitter = new EventEmitter;
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
}

/**
* Get page list
*/
BlobPageRangeStream.prototype.list = function(start, end, options) {
  var self = this;
  this.blobServiceClient.listBlobRegions(this.container, this.blob, start, end, options, function(error, ranges) {
    if (error) throw error;
    self._rangelist = ranges;
    self._emitPageRange();
    self = ranges = null;
  });
}

/**
* Emit page range
*/
BlobPageRangeStream.prototype._emitPageRange = function () {
  if(this._paused || this._emittedAll || this._isEmitting) return;
  this._isEmitting = true;
  try {
    for(len = this._rangelist.length; this._emittedRangeIndex < len; this._emittedRangeIndex++) {
      if(this._paused) {
        return;
      }
      var range = this._rangelist[this._emittedRangeIndex];
      range['type'] = 'Page';
      var size = range.end - range.start + 1; 
      if(size >= 0) {
        range['size'] = size;  
      } else {
        range['size'] = 0;
      }

      this._emitter.emit('range', range);
    } 
      
    this._rangelist = null;
    this._emittedAll = true;
    this._emitter.emit('end');
  } finally {
    this._isEmitting = false;  
  }
}

/**
* Pause the stream
*/
BlobPageRangeStream.prototype.pause = function () {
  this._paused = true;  
}

/**
* Resume the stream
*/
BlobPageRangeStream.prototype.resume = function () {
  this._paused = false;
  if(!this._isEmitting) {    
    this._emitPageRange();
  }
}

module.exports = BlobPageRangeStream;
