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

var fs = require('fs');
var crypto = require('crypto');
var azureutil = require('../../../util/util');
var Constants = require('../../../util/constants');
var EventEmitter = require('events').EventEmitter;
var bufferSize = Constants.BlobConstants.DEFAULT_WRITE_BLOCK_SIZE_IN_BYTES;

/**
* ReadStream wrapper
* 1. Calculate md5
* 2. Track reading offset
* 3. FileReadStream could use memory pool for a better performance
*      since ReadStream always create a new buffer.
* @param {object} options stream.Readable options
*/
function FileReadStream(pathOrStream, options) {
  if (!options) {
    options = {};
  }

  if (!options['highWaterMark']) {
    options['highWaterMark'] = bufferSize;
  }


  if(azureutil.objectIsString(pathOrStream)) {
    this._stream = fs.createReadStream(pathOrStream, options);
  } else {
    this._stream = pathOrStream;
  }

  this._calcContentMd5 = options.calcContentMd5;
  this._offset = 0;
  this._dataemitter = null;

  if(this._calcContentMd5) {
    var self = this;
    this.md5hash = crypto.createHash('md5');
    this._streamEnded = false;
    this._stream.on('end', function() {
      self._streamEnded = true;
    });
  }
}

/**
* Get file content md5 when read completely.
*/
FileReadStream.prototype.getContentMd5 = function(encoding) {
  if (!encoding) encoding = 'base64';
  if(!this.md5hash) {
    throw new Error('Can\'t get content md5, please set the calcContentMd5 option for FileReadStream.');
  } else {
    if (this._streamEnded) {
      if (!this._md5sum) {
        this._md5sum = this.md5hash.digest(encoding);
      }
      return this._md5sum;
    } else {
      throw new Error('FileReadStream stil don\'t end');
    }
  }
};

/**
* Add event listener
*/
FileReadStream.prototype.on = function(event, listener) {
  if (event === 'data') {
    this.addDataEventListener(listener);
  } else {
    this._stream.on(event, listener);
  }
};

/**
* Add data event listener
*/
FileReadStream.prototype.addDataEventListener = function(listener) {
  if (!this._dataEmitter) {
    this._initDataEmitter(listener);
  } else {
    this._dataEmitter.on('data', listener);
  }
};

/**
* Init data event emitter
*/
FileReadStream.prototype._initDataEmitter = function(listener) {
  if (!this._dataEmitter) {
    this._dataEmitter = new EventEmitter();
    this._dataEmitter.on('data', listener);
    var self = this;
    this._stream.on('data', function(data) {
      var len = data.length;
      var newOffset = self._offset + len;
      var range = {
        start : self._offset,
        end : newOffset - 1,
        size : len
      };
      if(self.md5hash) {
        self.md5hash.update(data);
      }
      self._offset = newOffset;
      self._dataEmitter.emit('data', data, range);
    });
  }
};

/**
* Pause read stream
*/
FileReadStream.prototype.pause = function() {
  this._stream.pause();
};

/**
* Resume read stream
*/
FileReadStream.prototype.resume = function() {
  this._stream.resume();
};

module.exports = FileReadStream;
