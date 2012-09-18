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
 * VHDTools
 * 
 * Based on VHD spec: 
 * http://download.microsoft.com/download/f/f/e/ffef50a5-07dd-4cf8-aaa3-442c0673a029/Virtual%20Hard%20Disk%20Format%20Spec_10_18_06.doc
 */

var fs = require('fs');
var path = require('path');
var util = require('util');
var streamMerger = require('./streamMerger');
var events = require('events');

//// VHD format constants
var SECTOR_SIZE = exports.SECTOR_SIZE = 512;  // VHD sector size
var FOOTER_SIZE = exports.FOOTER_SIZE = 512;  // VHD footer size
var HEADER_SIZE = exports.HEADER_SIZE = 1024; // dynamic disk header size
// VHD types
var DISKTYPE_FIXED = exports.DISKTYPE_FIXED = 2;
var DISKTYPE_DYNAMIC = exports.DISKTYPE_DYNAMIC = 3;
var DISKTYPE_DIFFERENCE = exports.DISKTYPE_DIFFERENCE = 4;

// Unlike the above constants, this value is client-settable
// Only 4 letters are allowed
exports.vhdCreatorApplication = 'wa'; // same as CSUpload


// this is a sync function
var getVHDInfo = 
  exports.getVHDInfo =
    function getVHDInfo(fileName, returnNullIfFileDoesNotExist) {
  
  var size = null;
  var error = '';
  try {
    var stat = fs.statSync(fileName);
    size = stat.size;
  } catch (e) {
    error = '\n Error :' + util.inspect(e);
  }
  if (!size) {
    if (returnNullIfFileDoesNotExist) {
      return null;
    }
    throw new Error('File cannot be read: ' + fileName + error); // no file or zero-sized file
  }  
  if (size % SECTOR_SIZE) {
      throw new Error('File size is not a multiple of ' + SECTOR_SIZE + ': ' + size + ' for ' + fileName);
  }
  // We need to leave this file open for dynamic VHDs
  var fd = fs.openSync(fileName, 'r');
  var buf = new Buffer(FOOTER_SIZE);
  var bytesRead = fs.readSync(fd, buf, 0, FOOTER_SIZE, size - FOOTER_SIZE);
  if (bytesRead !== FOOTER_SIZE) {
    throw new Error('File read error :' + fileName + ' , loaded footer size = ' + bytesRead + ' , size = ' + size / 1024 + 'K');
  }
  var footer = createFooter(buf);
  var diffVhd = footer.diskType === DISKTYPE_DIFFERENCE;
  var dynVHD = footer.diskType === DISKTYPE_DYNAMIC || diffVhd; // dynamic or difference
  var vhdInfo = {footer : footer, isDiff : diffVhd};
  var ddHeader = null;
  var indices = null;
  var dynVhdOffset = null;
  var bat = null;
  var sectorsPerBlockBitmap = null;
  if (dynVHD) {
    var buff = new Buffer(HEADER_SIZE);
    bytesRead = fs.readSync(fd, buff, 0, HEADER_SIZE, footer.dataOffset);
    if (bytesRead !== HEADER_SIZE) {
      throw new Error('File read error or wrong header : ' + fileName + ' , loaded header size = ' + bytesRead);
    }
    
    ddHeader = createDDHeader(buff, diffVhd, fd, fileName);
    vhdInfo.ddHeader = ddHeader;
    bat = {}; // More efficient and readable then "new Array(ddHeader.maxTableEntries);"
    var batSize = ddHeader.maxTableEntries * 4;
    var bufBat = new Buffer(batSize);
    bytesRead = fs.readSync(fd, bufBat, 0, batSize, ddHeader.tableOffset);
    if (bytesRead !== batSize) {
        throw new Error('File read error or wrong header : ' + fileName);
    }
 
    sectorsPerBlockBitmap = Math.ceil(ddHeader.blockSize / SECTOR_SIZE / 8 / SECTOR_SIZE);
    
    var totalBlocks = 0;
    indices = [];
    dynVhdOffset = [];
    for(var i = 0; i < ddHeader.maxTableEntries; ++i) {
      var val = bufBat.readUInt32BE(i * 4);
      if (val !== 65536 * 65536 - 1) {
        var dynOffset = (val + sectorsPerBlockBitmap) * SECTOR_SIZE;
        bat[i] = dynOffset;
        indices[totalBlocks] = i;
        dynVhdOffset[totalBlocks] = dynOffset;
        totalBlocks++;
      }
    }
    vhdInfo.totalBlocks = totalBlocks;
    vhdInfo.indices = indices;
    vhdInfo.bat = bat;
    vhdInfo.blocksSize = ddHeader.maxTableEntries * ddHeader.blockSize;
    
    // build fullIndex array that maps block index to the closest base VHD
    buildFullIndices(vhdInfo);
    
    vhdInfo.dynVhdOffset = dynVhdOffset;
    vhdInfo.getDynVhdOffset = function getDynVhdOffset(rawOffset) {
      var blockNumber = Math.floor(rawOffset / ddHeader.blockSize);
      var offset = bat[blockNumber];
      if (!offset) {
        return undefined;
      }
      var offsetInBlock = rawOffset % ddHeader.blockSize;
      return offset + offsetInBlock;
    };
    
    vhdInfo.getDynVhdRangeFromBlockIndex = function getDynVhdRangeFromBlockIndex(blockIndex) {
      var dynOffset = dynVhdOffset[blockIndex];
      if (typeof dynOffset !== 'number') {
        throw new Error('Error in VHD processing - incorrect block index : getDynVhdRangeFromBlockIndex(' + 
            blockIndex + ') : dynOffset = ' + dynOffset);
      }
      var ret = {start: dynOffset, end: dynOffset + ddHeader.blockSize - 1};
      return ret;
    };
    
    footer.convertToFixed();      
  }
  
  vhdInfo.getReadStream = function(streamOptions) {
    var isDiff = false;
    switch(footer.diskType) {
    case DISKTYPE_FIXED:
      return fs.createReadStream(fileName, streamOptions);
    case DISKTYPE_DIFFERENCE:
      isDiff = true;
      break;
    case DISKTYPE_DYNAMIC:
      break;
    default:
      throw new Error('Incorrect DiskType value of ' + footer.diskType);
    }
 
    streamOptions = streamOptions || {};
    var start = streamOptions.start || 0;
    var end = streamOptions.end || footer.currentSize + FOOTER_SIZE - 1;
    if (start % SECTOR_SIZE || (end + 1) % SECTOR_SIZE) { // undefined/null values are OK
      throw new Error('vhdInfo.getReadStream(): ' + 
          'streamOptions.start and end + 1 values should be multiples of ' + 
          SECTOR_SIZE);
    }
    var bufferSize = streamOptions.bufferSize || 65536;
    var buf0 = new Buffer(bufferSize);
    buf0.fill();
    
    var stream = new events.EventEmitter();
    stream.readable = true;
    stream._pos = start;
    
    function nyi() {
      throw new Error('Not Yet Implemented');
    }
    // create underlying file stream
    
    var block0 = Math.floor(start / ddHeader.blockSize);
    var startPosWithinBlock0 = start % ddHeader.blockSize;
    
    process.nextTick(function() {
      if (!createNextStream(block0, startPosWithinBlock0)) {
        stream.emit('end'); // make sure we emit 'end' event if VHD has no data at all
      }
    });
    
    function createNextStream(block, startPosWithinBlock) {
      if (typeof block !== 'number' || block < 0 || block > ddHeader.maxTableEntries) { // ddHeader.maxTableEntries is OK and means footer
        throw new Error('Incorrect request or start value is too large : ' + block);
      }
      startPosWithinBlock = startPosWithinBlock || 0; // this value is used only on the first call
      block--;
      var blockSourceOffset;
      var isInParent = false;
      var fixedStart;
      var fixedEnd;
      var sliceSize;
      
      do {
        block++;
        
        var blockFixedOffset = block * ddHeader.blockSize;
        fixedStart = blockFixedOffset + startPosWithinBlock;
        fixedEnd = Math.min(blockFixedOffset + ddHeader.blockSize - 1, end);
        sliceSize = fixedEnd - fixedStart + 1;
        
        if (block >= ddHeader.maxTableEntries || sliceSize <= 0) {
          stream._fileStream = null;
          fillToPos(fixedEnd + 1);
          return false;
        }
        
        blockSourceOffset = bat[block];
        isInParent = isDiff && (!vhdInfo.isInParent || vhdInfo.isInParent[block]);
        
      } while (blockSourceOffset === undefined && !isInParent);
      
      var parentStream = null;
      if (isInParent) {
        var parentInfo = vhdInfo.ddHeader.parentVhdInfo;
        var parentOptions = {};
        for (var o in streamOptions) parentOptions[o] = streamOptions[o];
        parentOptions.start = fixedStart;
        parentOptions.end = fixedEnd;
        stream._fileStream = parentStream = parentInfo.getReadStream(parentOptions);
      }
      if (blockSourceOffset !== undefined) {
        var options = {};
        for (var oo in streamOptions) options[oo] = streamOptions[oo];

        options.start = blockSourceOffset + startPosWithinBlock;
        options.end = options.start + sliceSize - 1;
        
        stream._fileStream = fs.createReadStream(fileName, options);
        if (isInParent) {
          // merge
          var maskSizeBytes = Math.ceil(ddHeader.blockSize / SECTOR_SIZE / 8);
          var mask = new Buffer(maskSizeBytes);
          var bytesRead = fs.readSync(fd, mask, 0, mask.length, blockSourceOffset - sectorsPerBlockBitmap * SECTOR_SIZE);
          if (bytesRead !== maskSizeBytes) {
            throw new Error('Cannot read bitmap mask for a difference VHD');
          }
          if (!isAll(mask, 0xff)) {
            if (isAll(mask, 0)) {
              stream._fileStream = parentStream;
            } else {
              var startBit = startPosWithinBlock / SECTOR_SIZE; // 1 bit per sector
              var mergedStream = new streamMerger.MergeStream(parentStream, stream._fileStream, SECTOR_SIZE, mask, startBit);
              stream._fileStream = mergedStream;
            }
          }
        }
      }
      
      stream.pause = stream._fileStream.pause;
      stream.resume = stream._fileStream.resume;
      stream.destroy = function() {stream.readable = false; stream._fileStream.destroy();};
      stream.destroySoon = nyi;
      
      stream._fileStream.on('error', function onError(error) {
        stream.readable = false;
        stream.emit('error', error);
      });

      stream._fileStream.on('end', function onEnd() {
        stream._fileStream = null;
        if (!stream.readable || createNextStream(block + 1)) {
          return;
        }
        stream.emit('end');
      });
      
      stream._fileStream.on('data', function onData(data) {
        if (!stream.readable || !data.length) {
          return;
        }
        fillToPos(fixedStart);
        stream.emit('data', data);
        stream._pos += data.length;
      });

      return true;
    } // end createNextStream()
    
    
    stream.setEncoding = nyi;
    
    stream.pipe = function(dest, options) {
      stream.on('data', function(data) {
        dest.write(data); // TODO implement drain/pause
      });
      if (!options || options.end !== false) {
        stream.on('end', function() {
          dest.end();
        });        
      }
    };
        
    function fillToPos(newPos) { // ignores any newPos parameters before current position
      
      if (newPos > footer.currentSize && newPos > stream._pos) {
        fillToPos(footer.currentSize);
        stream.emit('data', footer.buffer.slice(
            stream._pos - footer.currentSize, 
            newPos - footer.currentSize));
        return;
      }
      
      while (newPos > stream._pos) {
        var count = Math.min(newPos - stream._pos, buf0.length);
        stream.emit('data', count === buf0.length ? buf0 : buf0.slice(0, count));
        stream._pos += count;
      }
    }
    
    return stream;
  };
  
  return vhdInfo;
};


function isAll(buf, val) {
  for (var i = 0; i < buf.length; ++i) {
    if (buf[i] !== val) {
      return false;
    }
  }
  return true;
}

function equal(a, b) {
  if (a.length !== b.length) {
    return false;
  }
  for (var i = 0; i < a.length; ++i) {
    if (a[i] !== b[i]) {
      return false;
    }
  }
  return true;
}

function readUInt64BE(buffer, pos) {
  var hi = buffer.readUInt32BE(pos);
  var lo = buffer.readUInt32BE(pos + 4);
  if (hi === 65536 * 65536 - 1 && hi === lo) {
    return -1; // use this value for 0xFFFFFFFFFFFFFFFF, do not throw
  }
  var val = hi * 65536 * 65536 + lo;
  if (val === val + 1) {
    throw new Error('The 64-bit value is too big to be represented in JS :' + val);    
  }
  return val;
}

function createFooter(buf) {
  var footer = {buffer : buf};
  
  var fileFormatVersion = buf.readUInt32BE(12);
  if (fileFormatVersion !== 0x00010000) {
    throw new Error('Unexpected VHD file format version : 0x' + 
        fileFormatVersion.toString(16) + '\n expected : 0x10000');
  }
  footer.dataOffset = readUInt64BE(buf, 16);
  footer.currentSize = readUInt64BE(buf, 48);
  footer.convertedDiskType = footer.diskType = buf.readUInt32BE(60);
  //footer.creatorHostOS = buf.toString(null, 36, 40);
  footer.originalCreatorApplication = footer.creatorApplication = buf.toString(null, 28, 32);
  footer.uniqueID = buf.slice(68, 68 + 16);
  
  function updateCheckSum() {
    footer.buffer.writeUInt32BE(0, 64);
    var checkSum = 0;
    for (var i = 0; i < 255; ++i) {
      checkSum += footer.buffer[i];
    }
    footer.buffer.writeInt32BE(~checkSum, 64);
  }
  
  
  footer.convertToFixed = function() {
    if (footer.convertedDiskType === DISKTYPE_FIXED) {
      return;
    }
    if (footer.diskType !== DISKTYPE_DYNAMIC && footer.diskType !== DISKTYPE_DIFFERENCE) {
      throw new Error('Unsupported disk type :' + footer.diskType);
    }
    
    footer.convertedDiskType = DISKTYPE_FIXED; 
    footer.buffer.writeUInt32BE(footer.convertedDiskType, 60);
    footer.dataOffset = null; // really 0xFFFFFFFFFFFFFFFF which cannot be represented in JS, using null
    footer.buffer.writeInt32BE(-1, 16);
    footer.buffer.writeInt32BE(-1, 20);
    if (exports.vhdCreatorApplication) {
      footer.creatorApplication = (exports.vhdCreatorApplication + '\x00\x00\x00\x00').slice(0, 4); // pad with \0's
      footer.buffer.write(footer.creatorApplication, 28, 4); // don't use 'ascii' encoding to represent 0 right
    }
    updateCheckSum();
  };
  
  return footer;
}

function getParentLocatorEntry(buf, index, fd) {
  if (typeof index !== 'number' || index < 0 || index > 7) {
    throw new Error('Index should be between 0 and 7');
  }
  var offset = 576 + index * 24;
  var ret = {
      platformCode : buf.toString(null, offset, offset + 4),
      platformDataSpace : buf.readUInt32BE(offset + 4), // in sectors
      platformDataLength : buf.readUInt32BE(offset + 8), // in bytes
      platformDataOffset : readUInt64BE(buf, offset + 16) // in bytes
  };
  if (ret.platformDataLength === 0) {
    return null;
  }
  if (fd) {
    // read specified locations
    var newBuf = new Buffer(ret.platformDataLength);
    var bytesRead = fs.readSync(fd, newBuf, 0, newBuf.length, ret.platformDataOffset);
    if (bytesRead !== newBuf.length) {
      throw new Error('Cannot read VHD file @ ' + ret.platformDataOffset + ', size ' + newBuf.length);
    }
    ret.platformData = newBuf.toString('ucs2');
  }
  return ret;
}


function normalizePath(str) {
  // path.join() or path.normalize() will replace '/' with '\\' on Windows, but not vice versa on Unix
  // so we do the other conversion manually and let it convert back on Windows OS
  return path.normalize(str.replace(/\\/g, '/'));
}

function createDDHeader(buf, diffVhd, fd, fileName) {
  var header = {buffer : buf};
  header.tableOffset = readUInt64BE(buf, 16);
  header.headerVersion = buf.readUInt32BE(24);
  header.headerVersionHi = buf.readUInt16BE(24);
  header.headerVersionLo = buf.readUInt16BE(26);
  header.maxTableEntries = buf.readUInt32BE(28);
  header.blockSize = buf.readUInt32BE(32);
  
  if (diffVhd) {
    header.parentUniqueID = buf.slice(40, 40 + 16);
    var sourceFileDir = path.dirname(fileName);
    header.parentLocatorEntries = [];
    var namesTried = [];
    var idMismatch = [];
    
    var tryParentName = function(name) {
      if (!header.parentVhdInfo) {
        for (var i in namesTried) {
          if (name === namesTried[i]) {
            return;
          }
        }
        header.parentName = name;
        namesTried.push(header.parentName);
        header.parentVhdInfo = getVHDInfo(header.parentName, true);
        if (header.parentVhdInfo && !equal(header.parentUniqueID, header.parentVhdInfo.footer.uniqueID)) {
          idMismatch.push(header.parentName);
          header.parentName = null;
          header.parentVhdInfo = null;
        }        
      }
    };
    
    for (var i = 0; i < 8; ++i) {
      var entry = getParentLocatorEntry(buf, i, fd);
      if (entry) {
        header.parentLocatorEntries.push(entry);
        if (!header.parentVhdInfo && entry.platformCode === 'W2ru') {
          // Windows relative path - try it first
          tryParentName(normalizePath(path.join(sourceFileDir, entry.platformData)));
        }
      }
    }
    if (!header.parentVhdInfo) {
      for (i in header.parentLocatorEntries) {
        var entry2 = header.parentLocatorEntries[i];
        if (entry2.platformCode === 'W2ku') {
          // Windows relative path - try it first
          tryParentName(entry2.platformData); // no need to convert absolute Windows path to Unix format - it won't help
        }
      }
    }
    // For difference VHDs - get parent name and locations
    // Convert Unicode buffer to a string
    // For some reason this does not work :
    // header.parentUnicodeName = buf.toString('ucs2', 64, 512);
    header.parentUnicodeName = '';
    for (i = 0; i < 512; i += 2) {
      var code = (buf[64 + i] << 8) + buf[65 + i];
      if (code === 0) {
        break;
      }
      header.parentUnicodeName += String.fromCharCode(code);
    }
    if (header.parentUnicodeName.length && !header.parentVhdInfo) {
      tryParentName(header.parentUnicodeName);
      if (!header.parentVhdInfo) {
        // try source dir at the last resort
        tryParentName(normalizePath(path.join(sourceFileDir, 
            path.basename(normalizePath(header.parentUnicodeName))))); // normalize to get basename work on both OS
      }
    }
    
    if (!header.parentVhdInfo) {
      throw new Error('Error loading parent for difference VHD' + fileName + '\n' + 
          (idMismatch.length ? ' Unique ID field mismatch for VHD parent(s):\n' +
          util.inspect(idMismatch) + 
          '\n Did it change after difference disk creation?'
      : ' Could not locate base VHD ') + '\n\n Base VHD locations tried:\n' + util.inspect(namesTried) + '\n');  
    }

  }
  return header;
}


function mergeIndices(a1, a2) {
  // merge, sort
  var ret = a1.concat(a2);
  ret.sort(function(a, b) { return a - b; });
  for (var i = 1; i < ret.length; ++i) {
    if (ret[i] === ret[i - 1]) {
      ret.splice(i, 1);
      --i; // repeat
    }
  }
  return ret;
}

function buildFullIndices(vhdInfo) {
  if (vhdInfo.footer.diskType === DISKTYPE_FIXED) {
    return;
  }
  if (vhdInfo.footer.diskType === DISKTYPE_DYNAMIC) {
    vhdInfo.fullIndices = vhdInfo.indices;
    if (!vhdInfo.fullIndices) {
      throw new Error('Error: no indices built for dynamic VHD');
    }
    return;
  }
  var parentInfo = vhdInfo.ddHeader.parentVhdInfo;
  var parentFooter = parentInfo.footer;
  var parentType = parentFooter.diskType;
  switch (parentType) {
  case DISKTYPE_FIXED:
    // fixed
    // all indices are there
    // do not use isInParent
    return;
  case DISKTYPE_DYNAMIC:
  case DISKTYPE_DIFFERENCE:
    // dynamic or difference
    // need to join vhdInfo.indices and parentInfo.fullIndices if the latter is present
    if (parentInfo.fullIndices) {
      vhdInfo.isInParent = {};
      for (var i in parentInfo.fullIndices) {
        vhdInfo.isInParent[parentInfo.fullIndices[i]] = true;
      }
      vhdInfo.fullIndices = mergeIndices(vhdInfo.indices, parentInfo.fullIndices);
    }
    return;
  default:
    throw new Error('Incorrect value for parent disk type : ' + parentType);
  }
}

