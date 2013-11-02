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
* Chunked memory pool allocator.
* It could dramatically reduce the memory usage.
* However, it can't dramatically reduce the CPU time since GC in v8 is very efficient.
*/
function ChunkAllocator(chunkSize, maxCount) {
  this._pool = [];
  this._requests = [];
  //There is no need to track all allocated buffer for now.
  this._inuse = 0;
  this._chunkSize = chunkSize;
  this._maxCount = maxCount || 10;
  this._extendMemoryPool();
}

/**
* Asynchronously require a buffer.
* Caller should be aware of that the content of buffer is random since the Buffer.fill is Time-consumed opreation.
* @param {function(error, buffer)} callback
*/
ChunkAllocator.prototype.getBuffer = function(size, callback) {
  var buffer = this._getBufferFromPool(size);
  if (buffer) {
    //There is no need to run this callback in nextTick since it's an internal api for now.
    //TODO do some benchmarkes about nextTick;
    this._inuse++;
    callback(null, buffer);
  } else {
    this._requests.push(callback);
  }
};

/**
* Synchronously require a buffer
* Caller should be aware of that the content of buffer is random since the Buffer.fill is Time-consumed opreation.
*/
ChunkAllocator.prototype.getBufferSync = function(size) {
  var buffer = this._getBufferFromPool(size);
  if (buffer === null) {
    //It means the total memory could larger than this._chunkSize * this._maxCount.
    buffer = this._allocateBuffer(size);
  }
  this._inuse++;
  return buffer;
};

/**
* Get buffer from the current memory pool.
*/
ChunkAllocator.prototype._getBufferFromPool = function(size) {
  if(size !== this._chunkSize) {
    //Create a buffer outside of the memory pool.
    return this._allocateBuffer(size);
  } else if(this._pool.length === 0) {
    this._extendMemoryPool();
  }

  if(this._pool.length !== 0) {
    return this._pool.pop();
  } else {
    return null;
  }
};

/**
* Extend the memory pool
*/
ChunkAllocator.prototype._extendMemoryPool = function() {
  var total = this._pool.length + this._inuse;
  if(total >= this._maxCount || total < 0) return;
  var nextSize = Math.min(total * 2, this._maxCount);
  if(nextSize === 0) {
    nextSize = 1;
  }
  var increment = nextSize - total;
  this._addChunk(increment);
};

/**
* Add more chunks into memory pool
*/
ChunkAllocator.prototype._addChunk = function(increment) {
  for(var i = 0; i < increment; i++) {
    var buffer = this._allocateBuffer(this._chunkSize);
    this._pool.push(buffer);
  }
};

/**
* Release buffer
*/
ChunkAllocator.prototype.releaseBuffer = function(buffer) {
  if(buffer.length !== this._chunkSize) {
    //Directly delete the buffer if bufferSize is invalid and wait for GC.
    buffer = null;
    return;
  }

  if (this._requests.length) {
    //Wake up the buffer request.
    var bufferRequest = this._requests.shift();
    bufferRequest(null, buffer);
    return;
  }

  if (this._pool.length < this._maxCount) {
    this._pool.push(buffer);
  } else {
    //The pool is full and wait for GC
    buffer = null;
  }
  this._inuse--;
  if(this._inuse < 0) {
    this._inuse = 0;
  }
};

/**
* Allocate a new buffer
*/
ChunkAllocator.prototype._allocateBuffer = function(size) {
  var buffer = new Buffer(size);
  return buffer;
};

module.exports = ChunkAllocator;
