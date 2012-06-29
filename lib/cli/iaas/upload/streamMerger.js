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
 * This file implements MergeStream class
 * 
 * It creates a ReadableStream-like object that merges two streams 
 * based on bitmap mask for dynamic VHD stream
 * 
 * Not all stream functionality is implemented.
 *  
 */

var events = require('events');
var util = require('util');

var MergeStream = 
  exports.MergeStream = 
    function MergeStream(baseStream, stream, sectorSize, maskBuf, startBit) {
  
  events.EventEmitter.call(this);
  this.readable = true;
  
  var bit = startBit || 0;
  var buffs = [null, null];
  var self = this;
  var error = null;
  
  function processBuffers() {
    if (!buffs[0] || !buffs[1]) {
      return;
    }
    var len0 = Math.floor(buffs[0].length / sectorSize);
    var len1 = Math.floor(buffs[1].length / sectorSize);
    var len = Math.min(len0, len1);
    if (!len) {
      return;
    }
    var outBuf = new Buffer(len * sectorSize);
    
    for (var i = 0; i < len; ++i) {
      var bufferIndex = readBit(maskBuf, bit++);
      var offset = i * sectorSize;
      buffs[bufferIndex].copy(outBuf, offset, offset, offset + sectorSize);
    }
    self.emit('data', outBuf);
    var bytesDone = len * sectorSize;
    for (i = 0; i < 2; ++i) {
      buffs[i] = buffs[i].length === bytesDone ? null : buffs[i].slice(bytesDone);
    }
  }
  
  var endCount = 0;
  var charCount = [0, 0];
  
  function onData(i, data) {
    if (endCount >= 2) {
      throw new Error('Unexpected data after end events');
    }
    if (!data || data.length === 0 || error) {
      return;
    }
    charCount[i] += data.length;
    if (!buffs[i]) {
      buffs[i] = data;
    } else {
      // concatenate buffers
      // TODO be more efficient
      // This case does not normally happen unless streamMergers are chained
      var newBuf = new Buffer(buffs[i].length + data.length);
      buffs[i].copy(newBuf, 0);
      data.copy(newBuf, buffs[i].length);
      buffs[i] = newBuf;
    }
    processBuffers();
  }
  
  baseStream.on('data', function(data) {
    onData(0, data);
  });

  stream.on('data', function(data) {
    onData(1, data);
  });
  
  
  function onError(e) {
    if (error) {
      // only display and return no more than one error
      return;
    }
    error = e;
    self.emit('error', e);
  }
  
  stream.on('error', onError);
  baseStream.on('error', onError);
  
  function onEnd() {
    if (++endCount === 2) {
      if (buffs[0] || buffs[1]) {
        onError('Different stream sizes, or not multiple of ' + sectorSize +
            '\nbase remaining length = ' + (buffs[0] ? buffs[0].length : 0) +
            '\ndiff remaining length = ' + (buffs[1] ? buffs[1].length : 0) +
            '\ncharcounts = ' + util.inspect(charCount) 
        );
        return;
      }
      self.emit('end');
    }
  }

  stream.on('end', onEnd);
  baseStream.on('end', onEnd);
  
};

util.inherits(MergeStream, events.EventEmitter);


/*
 Possible TODO: Implement the following MergeStream.prototype functions:
   resume, setEncoding, pause, destroy, destroySoon and pipe
*/

function readBit(buffer, bit) {
  var element = bit >> 3; // divide by 8 and take int part
  var remainder = bit % 8;
  return (buffer[element] >> (7 - remainder)) & 1;
}
