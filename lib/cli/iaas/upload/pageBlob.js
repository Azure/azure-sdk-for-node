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
 * Implements uploading of a page blob featuring 
 * - conversion of non-fixed VHDs to fixed VHDs on the fly 
 * - multiple parameter-controlled simultaneous uploads
 * - fast speed
 * - simultaneous MD5 hash computation (if CPU is not fully utilized by upload)
 * - error retry
 * - incremental upload
 * - support for using base (aka parent) VHD in the cloud to speed up difference VHD uploads 
 */

var fs = require('fs');
var util = require('util');
var crypto = require('crypto');
var qs = require('qs');
var azure = require('../../../azure');
var BlobServiceEx = require('../blobserviceex');
var jobTracker = require('./jobTracker');
var intSet = require('./intSet');
var blobInfo = require('./blobInfo');
var callbackAggregator = require('../../callbackAggregator');

var blobUtils = require('../../blobUtils');
var splitDestinationUri = blobUtils.splitDestinationUri;
var splitBlobResourceName = blobUtils.splitBlobResourceName;
var SharedAccessSignature = azure.SharedAccessSignature;
var BlobConstants = azure.Constants.BlobConstants;

var http = require('http');
http.globalAgent.maxSockets = Math.max(2048, http.globalAgent.maxSockets);

// compare arrays, strings or buffers
function compare(a, b) { 
  if (!a && !b) {
    return true;
  }
  if (!a || !b || a.length !== b.length) {
    return false;
  }
  for (var i = 0; i < a.length; ++i) {
    if (a[i] !== b[i]) {
      return false;
    }
  }
  return true;
}

// implement right-justification for formatted output
function extendLeftTo(string, size, fixed) {
    var str = fixed !== undefined ? string.toFixed(fixed) : string.toString();
    var newStr = '              ' + str;
    return newStr.slice(-Math.max(size, str.length));
}



var copyBlob =
  exports.copyBlob =
    function copyBlob(sourceUri, sourceAccountKey, destinationUri, destinationAccountKey, callback) {

  var splitDestination = splitDestinationUri(destinationUri);
  if (!splitDestination.accountName || !splitDestination.blobName) {
    throw new Error('Destination is not well formed :' + destinationUri);
  }

  if (sourceAccountKey) {
    sourceUri = signBlobUri(sourceUri, sourceAccountKey);
  }

  // Using default host provided by Node SDK if not specified
  var blobService = azure.createBlobService(splitDestination.accountName, destinationAccountKey, splitDestination.host);
  var container = splitDestination.container || '$root';
  blobService.createContainerIfNotExists(container, function(error1, containerCreated, response1) {
    if (error1) {
      callback(error1, null, response1);
      return;
    }
    var blobServiceEx = new BlobServiceEx(splitDestination.accountName, destinationAccountKey, splitDestination.host);

    blobServiceEx.copyBlobEx(sourceUri, container, splitDestination.blobName, checkStatus);
    
    function checkStatus(error, blob, response) {
      if (!error) {
        var status = response.copyStatus;
        if (status.toLowerCase() !== 'success') {
          setTimeout(function() {
            blobServiceEx.copyBlobStatus(container, splitDestination.blobName, checkStatus);
          }, 3000);
          return;
        }
      }
      callback(error, blob, response);
    }
  });
  
 };

 var signBlobUri =
   exports.signBlobUri =
     function signBlobUri(uri, storageAccountKey) {
   var splitUri = splitDestinationUri(uri);
   if (!splitUri.accountName || !splitUri.blobName) {
     throw new Error('The uri is not well formed :' + uri);
   }

   var leftPadTwo = function (n) {
     return (n < 10 ? '0' : '') + n;
   };

   function _toUTC(date) {
     return (date.getUTCFullYear()+'-'
     + leftPadTwo((date.getUTCMonth()+1))+'-'
     + leftPadTwo(date.getUTCDate())+'T'
     + leftPadTwo(date.getUTCHours())+':'
     + leftPadTwo(date.getUTCMinutes())+':'
     + leftPadTwo(date.getUTCSeconds())+'Z');
   }

   if (storageAccountKey) {
     var startDate = new Date();
     startDate.setMinutes(startDate.getMinutes() - 2);
     var expiryDate = new Date(startDate);
     expiryDate.setMinutes(startDate.getMinutes() + 60);
     var credentials = new SharedAccessSignature(splitUri.accountName, storageAccountKey);
     var sharedAccessPolicy = {
         Id: null,
         AccessPolicy: {
           Permissions: BlobConstants.SharedAccessPermissions.READ,
           Start: _toUTC(startDate),
           Expiry: _toUTC(expiryDate)
         }
       };

       var queryString = credentials.generateSignedQueryString(
         splitUri.resourceName,
         {},
         BlobConstants.ResourceTypes.BLOB,
         sharedAccessPolicy);
       uri = uri + '?' + qs.stringify(queryString);
   }

   return uri;
 };

// UploadPageBlob()
//
// destinationUri may or may not contain the full path
// http:// prefix is optional
// Example:
// 
// myaccount/myfilename.ext
// http://myaccout/myDir/myfile
// http://myAccount.blob.core.azure-preview.com/mydir/myfile
//
// port number and GET parameters are not supported
var uploadPageBlob = 
  exports.uploadPageBlob = 
    function uploadPageBlob(destinationUri, accountKey, fileName, options, callback) {
  
  var splitDestination = splitDestinationUri(destinationUri);
  if (!splitDestination.accountName) {
    throw new Error('Destination is not well formed :' + destinationUri);
  }
  
  // Using default host provided by Node SDK if not specified
  var blobService = azure.createBlobService(splitDestination.accountName, accountKey, splitDestination.host);
  uploadPageBlobFromBlobService(blobService, splitDestination.resourceName, fileName, options, callback);
};

var deleteBlob = 
  exports.deleteBlob =
    function deleteBlob(destinationUri, accountKey, callback) {
  var splitDestination = splitDestinationUri(destinationUri);
  if (!splitDestination.accountName) {
    throw new Error('Destination is not well formed :' + destinationUri);
  }
  
  // Using default host provided by Node SDK if not specified
  var blobService = azure.createBlobService(splitDestination.accountName, accountKey, splitDestination.host);
  var splitName = splitBlobResourceName(splitDestination.resourceName);
  blobService.deleteBlob(splitName.container, splitName.blobName, callback);
};

var uploadPageBlobFromBlobService = 
  exports.uploadPageBlobFromBlobService =
    function uploadPageBlobFromBlobService(blobService, blobResourceName, fileName, options, callback) {
  
  var logger = options.logger || console;
  var logFunc = logger.info || console.log;
  var warnFunc = logger.warn || console.warn;
  var errorFunc = logger.error || console.error;
  var doNothing = function() {};
  var verboseFunc = logger.verbose || (options.verbose ? logFunc : doNothing);
  var sillyFunc =  logger.silly || doNothing;
  var exitWithError = options.exitWithError || function() { 
    throw new Error(util.inspect(arguments));
  };
  
  var skipLine = options.skipLine || function() {
    fs.writeSync(1, '\n'); // just like console.log('');
  };
  
  verboseFunc('Uploading page blob ' + fileName);
  verboseFunc(' to ' +
      blobService.protocol + blobService.storageAccount + '/' + blobService.host + 
      '/' + blobResourceName);
  var startTime = new Date();

  if (!callback) {
    callback = function(error) {
      if (error) {
        errorFunc(util.inspect(error));
      }
    };
  }
  
  var numThreads = options.threads || 128;
  numThreads = Math.floor(numThreads);
  if (numThreads < 1 || numThreads.toString() === 'NaN') {
    throw new Error('Number of parallel connections should be a positive number : '+ options.threads); 
  }
  
  var splitName = splitBlobResourceName(blobResourceName);  
  var container = splitName.container;
  var blobName = splitName.blobName;   
  
  var size = fs.statSync(fileName).size;
  verboseFunc('Max parallel connections = ' + numThreads);
  verboseFunc('File size = ' + size);
  if (size === 0) {
    throw new Error('File cannot be read or has zero size: ' + fileName);
  }
  if (size % 512) {
    throw new Error('file size is not a multiple of 512 (not yet implemented) :' + size);
  }
  var blockSize = Math.min(2 * 1024 * 1024, blobService.writeBlockSizeInBytes);
  blockSize -= (blockSize % 512);
  var dynVHD = false;
  var uploadSize = size;
  var uploadSizeWithFooter = uploadSize;
  var vhdInfo = null;
  if (options.vhd) {
    vhdInfo = require('./vhdTools').getVHDInfo(fileName);
    if (vhdInfo.ddHeader) { // dynamic or difference
      dynVHD = true;
      size = vhdInfo.footer.currentSize; 
      if (vhdInfo.blocksSize !== size) {
        warnFunc('The total size of blocks ' + vhdInfo.blocksSize / 1024 / 1024 + ' Mb is different');
        warnFunc('  from declared VHD size ' + size / 1024 / 1024 + ' Mb');
        size = vhdInfo.blocksSize;
      }
      size += 512; // add footer
      verboseFunc('Dynamic or difference VHD: converting to fixed type');
      verboseFunc('Fixed VHD size = ' + size / 1024 + ' KB');
      var curSize = blockSize;
      blockSize = vhdInfo.ddHeader.blockSize; // should be vhdInfo.ddHeader.blockSize, should divide it
      while (blockSize > curSize) {
          blockSize /= 2;
      }
      if (vhdInfo.fullIndices) {
        uploadSize = vhdInfo.fullIndices.length * vhdInfo.ddHeader.blockSize;         
        uploadSizeWithFooter = uploadSize + 512; // add footer
      } else {
        warnFunc('Warning: difference VHD with fixed [grand]parent ' + fileName);
        uploadSize -= 512; // without footer
      }
    }
	var sizeMB = size / 1024 / 1024;
	logFunc('VHD size : ' + ((sizeMB >= 10240) ? 
      (sizeMB / 1024).toFixed() + ' GB' 
      : sizeMB.toFixed() + ' MB'));
  }
  
  logFunc('Uploading ' + uploadSizeWithFooter / 1024 + ' KB');
  
  while (uploadSize / blockSize < numThreads / 2 && blockSize > 128 * 1024) {
    blockSize /= 2;
  }
      
  verboseFunc('Blob container = ' + container);
  verboseFunc('Blob name = ' + blobName);
  verboseFunc('VHD block size = ' + blockSize / 1024 + ' KB');
  
  var sizeExt = size + 511 - (size + 511) % 512;
  
  var maxIndex = Math.ceil((uploadSize / blockSize) - 1);
  var uploadBlocksPerBATBlocks = dynVHD ? vhdInfo.ddHeader.blockSize / blockSize : null;
  
  var maxRequest = maxIndex + dynVHD;  
  
  // check if we need incremental upload
  
  var uploadedRegions = null;
  // need to finish two things to succeed: md5 (sometimes) and upload (always)
  // use callbackAggregator to track it, without tracking errors for upload
  var md5Agg = callbackAggregator.callbackAndAggregator(function(finished) {
    var alreadyExisted = finished['upload'][1]; // arg 1
    verboseFunc(alreadyExisted ? 'Done - nothing to upload.' : 'Done!');
    callback(null, alreadyExisted);
  });
  
  md5AggUpload = md5Agg.getCallback('upload');
  
  var skipMd5 = options.skipMd5;
  
  if (options.force) {
    // create a container if does not exist only
    blobInfo.getBlobInfo(blobService, container, null, null, true, onGotBlobInfo);
  } else {
    // see if we can do incremental upload
    blobInfo.getBlobInfo(blobService, container, blobName, {start : size - 512, end : size - 1}, true, onGotBlobInfo);
  }
      
  function onGotBlobInfo(error, result) {
    if (error) {
      errorFunc('Cannot access blob /' + blobResourceName + 
          ' or its properties : ' + error.code);
      exitWithError(error);
    } else {
      if (result) {
        uploadedRegions = result.pageRegions;
        if (uploadedRegions && uploadedRegions.length === 0) {
          uploadedRegions = null;
        }
        if (uploadedRegions && result.blobProperties && 
            result.blobProperties.contentLength == size) {
          sillyFunc(''); // skip line for visibility in 'silly' mode
          verboseFunc('Uploading incrementally');
          if (result.blobProperties && result.blobProperties.contentMD5) {
            verboseFunc('Using pre-set MD5 = ' + result.blobProperties.contentMD5);
            skipMd5 = true;
          }
          // check footer (if vhd)
          if (dynVHD) {
            if (!compare(vhdInfo.footer.buffer, result.data)) {
              exitWithError('Files are different - cannot upload incrementally. Use -f option to overwrite.');
            }
          }
          onBlobCreated();
          return;          
        }
      }
      uploadedRegions = null;
    }
    if (options.parentBlob) {
      verboseFunc('Parent blob: ' + options.parentBlob);
      if (!vhdInfo || !vhdInfo.isDiff) {
        exitWithError('Error: base VHD specified for non-difference type VHD: type = ' + vhdInfo.footer.diskType);
      }
      createDiffVHDPageBlob(blobService, container, blobName, options.parentBlob, options.threads, vhdInfo, onBlobCreated);
    } else {
      blobService.createPageBlob(container, blobName, sizeExt, 
        function onCreate(error) {
          if (error) {
            var errorCode = typeof(error) === 'object' ? error.code : undefined;
            errorFunc('Error: blobService.createPageBlob() ended with error code = ' + errorCode);
            if (!errorCode) errorFunc(util.inspect(error));
            callback(error);
            return;
          }
          onBlobCreated();
        });
    }
  }

  function createDiffVHDPageBlob(blobService, container, blobName, baseUri, threads, vhdInfo, callback) {
    
    var splitParentUri = splitDestinationUri(baseUri);
    blobService.copyBlob(splitParentUri.container, splitParentUri.blobName, container, blobName, function(error) {
      if (error) {
        errorFunc('Cannot copy or invalid blob: ' + baseUri + '\nError code ' + error.code);
        errorFunc(util.inspect(error));
        return;
      }
      var footerRegion = {start : size - 512, end : size - 1};
      blobInfo.getBlobInfo(blobService, container, blobName, null, false, function(error, result) {
        if (error || !result) {
          errorFunc(util.inspect(error));
          callback(error); // nothing to do here
          return;
        }
        var deleteRegions = [footerRegion];
        uploadedRegions = result.pageRegions;
        var regionsSet = intSet.createIntSet(uploadedRegions); // this does not copy regions!
        var blockSize = vhdInfo.ddHeader.blockSize;
        
        function process(index) {
          var start = blockSize * index;
          var end = start + blockSize - 1;
          if (regionsSet.intersects(start, end)) {
            // For simplicity and possibly speed,
            // delete the whole block, rather then some uploaded parts
            deleteRegions.push({start : start, end : end});
          }          
        }
        
        if (vhdInfo.bat) { // This is not a Windows file name! :) 'bat' stands for VHD 'Block Allocation Table'
          for (var j in vhdInfo.bat) {
            process(j);
          }
        } else {
          for(var jj = vhdInfo.ddHeader.maxTableEntries; --jj >= 0;) {
            process(jj);
          }
        }
        
        threads = threads || 128;
        threads = Math.min(threads, deleteRegions.length);
        var next = threads;
        var running = threads;
        for (var i = 0;  i < threads; ++i) {
          deleteRegion(i);
        }
        var exiting = false;
        
        function deleteRegion(i) {
          if (exiting) {
            return;
          }
          blobService.clearBlobPages(container, blobName, deleteRegions[i].start, deleteRegions[i].end, function(error, response) {
            if (error) {
              errorFunc('Cannot delele blob regions ' +
                  util.inspect(deleteRegions[i]));
              errorFunc(util.inspect(error));
              exiting = true;
              callback(error);
              return;
            }
            regionsSet.subtractInterval(deleteRegions[i].start, deleteRegions[i].end);
            next++;
            if (next >= deleteRegions.length) {
              if (--running <= 0) {
                verboseFunc('Successfully copied and cleaned up base VHD');
                onDeleted();
              }
              return;
            }
            deleteRegion(next);
          });
        }
        
        function onDeleted() {
          if (result.blobProperties && result.blobProperties.contentMD5) {
            result.blobProperties.contentMD5 = null; // clear it from the blob
            var blobOptions = { contentMD5: null, contentType: 'application/octet-stream' };
            blobService.setBlobProperties(container, blobName, blobOptions, function (error) {
              if (error) {
                skipLine();
                exitWithError(error);
              }
              callback(null, result);
            });
          } else {
            callback(null, result);
          }
        }
      });
      
    });
  } 
  
  var md5Done = 0;
  var exiting = false;
  
  var md5AggMd5 = null;
  
  function calculateMD5(callback) {
    md5AggMd5 = md5Agg.getCallback('md5');
    var md5hash = crypto.createHash('md5');
    var stream = 
      options.vhd ? vhdInfo.getReadStream() : fs.ReadStream(fileName);
    stream.on('data', function (data) {
      if (exiting) {
        verboseFunc('Waiting to finish...');
        stream.destroy();
        return;
      }
      md5hash.update(data);
      md5Done += data.length;        
    });
    stream.on('end', function () {
      if (exiting) {
        return;
      }
      var hash = md5hash.digest('base64');
      callback(hash);
    });
    stream.on('error', function (e) {
      callback(null, e);
    });
  }
  
  
  function onMD5Calculated(md5, error) {
    if (error) {
      errorFunc('Cannot calculate MD5 or read file ' + fileName);
      exitWithError(error);
    }
    var blobOptions = { contentMD5: md5, contentType: 'application/octet-stream' };
    blobService.setBlobProperties(container, blobName, blobOptions, function (error) {
      if (error) {
        skipLine();
        errorFunc(' Error in setBlobProperties() ');
        errorFunc(util.inspect(error));
      } else  if (options.verbose) {
        skipLine(); // do not write over progress messages
        verboseFunc('MD5 hash is computed and written to the blob: ' + md5);
      }
      md5AggMd5(error);
    });
  }
  
  function onBlobCreated(error) {
    if (error) {
      errorFunc('Cannot create or copy a blob');
      errorFunc(util.inspect(error));
      callback(error);
      return;
    }
    // initiate MD5 calculation
    if (!skipMd5) {
      sillyFunc('Starting to calculate MD5 hash for input file (use -m to skip it)');
      calculateMD5(onMD5Calculated);
    }
        
    var doneThreads = 0;
    var totalBlocks = maxRequest + 1;
    var tracker = jobTracker.getJobTracker(totalBlocks);
    var wasIdle = false;
    
    numThreads = Math.min(numThreads, maxRequest + 1);
    var runningThreads = 0;
    var alreadyDone = 0; // previously uploaded blocks - to adjust speed computation and check if anything was uploaded
    
    for(var num = 0; num < numThreads && !tracker.isDone(); ++num) {
      runningThreads++;
      next(num);
    }
    
    function printStatus() {
      var percentRequested = 100 * tracker.getRequestedPart();
      var percentCompleted = 100 * tracker.getCompletedPart();
      var doneBlocks = tracker.getCompleted();
      var speed = ' ';
      var uploadedBlocks = Math.max(doneBlocks - alreadyDone, 0);
      if ((doneBlocks >= numThreads || percentCompleted > 90) && uploadedBlocks > 0) {
        var elapsedTime = (new Date() - startTime) / 1000;
        var kbps = (blockSize / 1024 * uploadedBlocks) / elapsedTime;
        var timeMinSec = (elapsedTime % 60).toFixed();
        if (elapsedTime >= 60) {
            timeMinSec = Math.floor(elapsedTime / 60) + 'm' + extendLeftTo(timeMinSec, 2);
        }
        speed = ' Time:' + extendLeftTo(timeMinSec, 5) + 's Speed:' + extendLeftTo(kbps, 6, 0) + ' KB/s';
      }
      var runningRequests = runningThreads - doneThreads;
      var string = 
          'Requested:' + extendLeftTo(percentRequested, 5, 1) + '%' +
          ' Completed:' + extendLeftTo(percentCompleted, 5, 1) + '%' +     
          ' Running:' + extendLeftTo(runningRequests, 4) + 
          speed + ' \r';
      // Write to stdout (fd is 1)
      // console.log() cannot be used because it will not pass '\r' as it it (will do '\n') 
      fs.writeSync(1, string);
    }
        
    function next(number) { 
      var index = tracker.nextIndex();
      if (index === null || index === undefined) {
        wasIdle = true;
        doneThreads++;
        printStatus();
        if (doneThreads == runningThreads) {
          skipLine();
          if (md5Agg.isInProgressFor('md5')) {
            logFunc('Finishing computing MD5 hash, ' + (md5Done * 100 / size).toFixed() +'% is complete.');
          }
          md5AggUpload(null, alreadyDone === tracker.getCompleted());
        }
        return;
      }
      
      function toNext(error, pageBlob, response) {
        if (exiting) {
          return; // do not display all errors
        }
        if (error) {
          if (options.verbose) {
            skipLine(); // skip progress line
            warnFunc(number + '> Error at upload index ' + index + ' - will retry. ');
          }
          // on errors, remove one 'thread' on every other error
          // except when we are done with sending requests - in which case that some 'threads' are likely already finished
          if (tracker.error(index) % 2 && (!wasIdle || tracker.getErrorRate() > 0.95)) { // always go there for now
            doneThreads++;
            if (doneThreads == numThreads) {
              printStatus();
              skipLine();
              errorFunc('Error in blobService.createBlobPagesFrom...()');
              errorFunc(util.inspect(error));
              if (response) errorFunc('response=' + util.inspect(response));
              exiting = true;
              callback(error);
              return;
            }
            printStatus();
          } else {
            next(number);
          }
          return;
        }
        tracker.done(index);
        
        next(number);
      }
      
      if (exiting) {
        return;
      }
      uploadAtIndex(index ? index - 1 : maxRequest); // change indices to start uploading from the footer, in both dynamic and fixed VHD cases, then continue from the beginning
      printStatus();
      
      function isAlreadyUploaded(start, end) {
        if (uploadedRegions) {
          var set = intSet.createIntSet(start, end);
          set.subtractRanges(uploadedRegions);
          return set.isEmpty();
        }
        return false;
      }
      
      function uploadAtIndex(index) {
                       
        if (index > maxIndex) { // create a footer
          vhdInfo.footer.convertToFixed();
          if (!size || size % 512) {
            errorFunc('Incorrect file size - should be a multiple of 512: ' + size + '\n size % 512 =' + size % 512);
          }
          if (vhdInfo.footer.buffer.length !== 512) {
            errorFunc('Error: footer length (should be 512) =' + vhdInfo.footer.buffer.length);
          }
          // check if already uploaded
          if (isAlreadyUploaded(size - 512, size - 1)) {
            // nothing to do here
            alreadyDone++;
            process.nextTick(toNext); // use process.nextTick(toNext) instead of Next() for consistency with another case below 
            return;
          }
          // don't use string object, either by using Buffer.toString() or manually - this won't work
          blobService.createBlobPagesFromText(container, blobName,
            vhdInfo.footer.buffer, size - 512, size - 1, toNext);
          
        } else {
          var posIn = index * blockSize;
          var posOut = posIn;
          if (dynVHD) {
            var batIndex = Math.floor(index / uploadBlocksPerBATBlocks);
            posIn = vhdInfo.getDynVhdOffset(posOut);
            if (vhdInfo.fullIndices) {
              posOut = vhdInfo.fullIndices[batIndex] * vhdInfo.ddHeader.blockSize + (index % uploadBlocksPerBATBlocks) * blockSize;
            }
          }
          var realEndPosIn = Math.min(posIn + blockSize, size);
          realEndPosIn--;
          var realEndPosOut = Math.min(posOut + blockSize, size);
          realEndPosOut--;
          
          // check if already uploaded
          if (isAlreadyUploaded(posOut, realEndPosOut)) {
            // nothing to do here
            alreadyDone++;
            process.nextTick(toNext); // use nextTick(toNext) instead of toNext() to avoid possibly deep recursion
            return;
          }
          
          var readStream;
          if (dynVHD) {
            readStream = vhdInfo.getReadStream({start: posOut, end: realEndPosOut});
          } else {
            readStream = fs.createReadStream(fileName, 
              {start: posIn, end: realEndPosIn});
          }
          
          if (!readStream || !size) {
              callback('Cannot create read stream');
              throw new Error('Cannot create read stream');
          }
          if (posOut % 512 !== 0) {
            errorFunc(posOut + ': posOut % 512 =' + posOut % 512);
          }
          blobService.createBlobPagesFromStream(container, blobName,
            readStream, posOut, realEndPosOut, toNext);
        }
      }
    }
  }
};



