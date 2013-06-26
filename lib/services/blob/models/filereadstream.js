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
var util = require('util');
var azureutil = require('../../util/util');
var bufferSize = 4 * 1024 * 1024;

function FileReadStream(pathOrStream, options) {
  if (!options) {
    options = {};
  }

  if(!options['highWaterMark']) {
      options['highWaterMark'] = bufferSize;
  }

  if(azureutil.objectIsString(
    this._stream = fs.createReadStream(path, options);
  } else {
    this._stream = pathOrStream;  
  }

  this._calcContentMd5 = options.calcContentMd5;

  if(this._calcContentMd5) {
    var self = this;
    this.md5hash = crypto.createHash('md5');
    this._stream.on('data', function(data) {
      self.md5hash.update(data);  
    });
    this._streamEnded = false;
    this._stream.on('end', function() {
      self._streamEnded = true;
    });
  } 
}

FileReadStream.prototype.getContentMd5 = function(encoding) {
  if(!this.md5hash) {
    throw new Error('Can\'t get content md5, please set the calcContentMd5 option for FileReadStream.'); 
  } else {
    if (this._streamEnded) {
      if (!this._md5sum) {
        this._md5sum = this.md5hash.digest(encoding);
      }
      return this._md5sum;  
    } else {
      throw new Error('FileReadStream stil don\'t ended');  
    }
  } 
}

FileReadStream.prototype.on = function(event, listener) {
  this._stream.on(event, listener);  
}

FileReadStream.prototype.pause = function() {
  this._stream.pause();  
}

FileReadStream.prototype.resume = function() {
  this._stream.resume();  
}

module.exports = FileReadStream;
