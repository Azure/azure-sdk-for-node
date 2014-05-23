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

var ChunkStream = require('./chunkStream');
var EventEmitter = require('events').EventEmitter;
var util = require('util');

/**
*  Chunk stream
*  1. Calculate md5
*  2. Track reading offset
*  3. Work with customize memory allocator
*  4. Buffer data from stream.
*  @param {object} options stream.Readable options
*/
function ChunkStreamWithStream(stream, options) {
  ChunkStream.call(this, options);

  stream.pause(); // Pause stream and wait for data listener. It's useful for node v0.6 and v0.8
  this._stream = stream;
  this._stream.on('end', this.end.bind(this)); // Should catch the end event for node v0.6 and v0.8
}

util.inherits(ChunkStreamWithStream, ChunkStream);

/**
* Add event listener
*/
ChunkStreamWithStream.prototype.on = function(event, listener) {
  if(event === 'end' && this._streamEnded) {
    listener(); //Directly call the end event when stream already ended
  } else {
    EventEmitter.prototype.on.call(this, event, listener);
  }

  if (event === 'data') {
    if (!this._isStreamOpened) {
      this._isStreamOpened = true;
      this._stream.on('data', this._buildChunk.bind(this));
    }
    if (this._paused === undefined) {
      this._stream.resume();
    }
  }
};

/**
* Pause chunk stream
*/
ChunkStreamWithStream.prototype.pause = function () {
  ChunkStream.prototype.pause.call(this);

  this._stream.pause();
};

/**
* Resume read stream
*/
ChunkStreamWithStream.prototype.resume = function() {
  ChunkStream.prototype.resume.call(this);

  this._stream.resume();
};

module.exports = ChunkStreamWithStream;