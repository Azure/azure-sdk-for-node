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

/**
 * bufferStream
 * 
 * Creates a writeStream-like object that accumulates results to a buffer
 * 
 */
var events = require('events');

var createBufferWriteStream = 
  exports.createBufferWriteStream = 
    function(callback) {
  
  var ret = new events.EventEmitter();
  ret.writeable = true;
  var buffers = [];
  ret.write = function(buffer, encoding) {
    if (typeof buffer === 'string' || (encoding && encoding !== 'binary')) {
      throw new Error('Strings or non-binary encoding are not supported here - use buffers');
    }
    buffers.push(buffer);
    return true;
  };
  
  var ended = false;
  ret.end = function(buffer) {
    if (ended) {
      return; // make sure callback is called only once
    }
    ended = true;
    if (buffer) {
      ret.write(buffer);
    }
    var n = buffers.length;
    var size = 0;
    for (var i = 0; i < n; ++i) {
      size += buffers[i].length;
    }
    var buf = new Buffer(size);
    var pos = 0;
    for (i = 0; i < n; ++i) {
      buffers[i].copy(buf, pos);
      pos += buffers[i].length;
    }
    buffers = null; // release unneeded data
    callback(null, buf);
    return true;
  };
  ret.destroy = ret.destroySoon = function() { ret.writeable = false; };
  ret.addListener('pipe', function(stream) {
    stream.on('data', ret.write);
    stream.on('end', ret.end);
  });
  return ret;
};
