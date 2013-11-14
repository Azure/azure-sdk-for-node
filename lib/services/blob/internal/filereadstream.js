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

var fs = require('fs');
var util = require('util');

var azureCommon = require('azure-common');
var Constants = azureCommon.Constants;

var EventEmitter = require('events').EventEmitter;
var bufferSize = Constants.BlobConstants.DEFAULT_WRITE_BLOCK_SIZE_IN_BYTES;

/**
* File read stream
* 1. Calculate md5
* 2. Track reading offset
* 3. Could with customize memory allocator
* 4. Buffer data from file or stream.
* @param {object} options stream.Readable options
*/
function FileReadStream(path, options) {
  EventEmitter.call(this);
  this._streamEnded = false;
  this._fd = null;
  this._fileName = undefined;
  this._highWaterMark = bufferSize;
  this._offset = 0;
  this._paused = undefined;
  this._allocator = null;
  this._init(path, options);
}

util.inherits(FileReadStream, EventEmitter);

/**
* File Read Stream init
*/
FileReadStream.prototype._init = function(path, options) {
  if(!options) {
    options = {};
  }
  this._fileName = path;

  if(options.allocator) {
    this._allocator = options.allocator;
  }

  if(options.highWaterMark) {
    this._highWaterMark = options.highWaterMark;
  }
  this._open();
};

/**
* Open file
*/
FileReadStream.prototype._open = function () {
  var flags = 'r';
  var self = this;
  fs.open(this._fileName, flags, function(error, fd) {
    if (error) {
      self.emit('error', error);
    } else {
      self._fd = fd;
      self.emit('open', fd);
    }
  });
};

/**
* Set memory allocator
*/
FileReadStream.prototype.setMemoryAllocator = function(allocator) {
  this._allocator = allocator;
};

/**
* Get buffer
*/
FileReadStream.prototype._getBuffer = function(size) {
  if(this._allocator && this._allocator.getBufferSync) {
    return this._allocator.getBufferSync(size);
  } else {
    var buffer = new Buffer(size);
    return buffer;
  }
};

/**
* Release buffer
*/
FileReadStream.prototype._releaseBuffer = function(buffer) {
  if(this._allocator && this._allocator.releaseBuffer) {
    this._allocator.releaseBuffer(buffer);
  }
};

/**
* Emit the data from file
*/
FileReadStream.prototype._emitData = function() {
  var self = this;
  if(!this._fd) {
    this.once('open', function() {
      self._emitData();
    });
    return;
  }

  if (this._paused || this._streamEnded) {
    return;
  }
  var buffer = this._getBuffer(this._highWaterMark);
  fs.read(this._fd, buffer, 0, this._highWaterMark, this._offset, function(error, bytesRead, readBuffer) {
    if (error) {
      self.emit('error', error);
      return;
    }

    if(bytesRead === 0) {
      if(!self._streamEnded) {
        self._streamEnded = true;
        self.emit('end');
      }
      return;
    }

    self._offset += bytesRead;
    if(bytesRead == self._highWaterMark) {
      self.emit('data', readBuffer);
    } else {
      self.emit('data', readBuffer.slice(0, bytesRead));
      //Release the current buffer since we created a new one
      self._releaseBuffer(readBuffer);
    }
    buffer = readBuffer = null;
    self._emitData();
  });
};

/**
* Add event listener
*/
FileReadStream.prototype.on = function(event, listener) {
  if(event === 'end' && this._streamEnded) {
    listener(); //Directly call the end listener when stream already ended
  } else {
    EventEmitter.prototype.on.call(this, event, listener);
  }

  if (event === 'data' && this._paused === undefined) {
    this._paused = false;
    this._emitData();
  }
};

/**
* Pause read stream
*/
FileReadStream.prototype.pause = function() {
  this._paused = true;
};

/**
* Resume read stream
*/
FileReadStream.prototype.resume = function() {
  var previousState = this._paused;
  this._paused = false;
  if(previousState === true) {
    //Only start to emit data when it's in pause state
    this._emitData();
  }
};

module.exports = FileReadStream;
