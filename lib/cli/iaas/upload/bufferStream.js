/**
* Copyright (c) Microsoft Open Technologies, Inc.  All rights reserved.
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*   http://www.apache.org/licenses/LICENSE-2.0
*
* THIS CODE IS PROVIDED ON AN *AS IS* BASIS, WITHOUT WARRANTIES OR
* CONDITIONS OF ANY KIND, EITHER EXPRESS OR IMPLIED, INCLUDING
* WITHOUT LIMITATION ANY IMPLIED WARRANTIES OR CONDITIONS OF TITLE,
* FITNESS FOR A PARTICULAR PURPOSE, MERCHANTABLITY OR NON-INFRINGEMENT.
*
* See the Apache License, Version 2.0 for specific language governing
* permissions and limitations under the License.
*/

/**
 * bufferStream
 * 
 * Creates a writeStream-like object that accumulates results to a buffer
 * 
 */

var createBufferWriteStream = 
  exports.createBufferWriteStream = 
    function(callback) {
  
  var ret = {writeable : true};
  var buffers = [];
  ret.write = function(buffer, encoding) {
    if (typeof buffer === 'string' || (encoding && encoding !== 'binary')) {
      throw new Error('Strings or non-binary encoding are not supported here - use buffers');
    }
    buffers.push(buffer);
    return true;
  };
  
  ret.end = function(buffer) {
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
  //Ignore. We don't send any events (like 'drain') to the stream.
  ret.on = function (event, func) {};
  return ret;
};
