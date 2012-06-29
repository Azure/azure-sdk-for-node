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
 * blobInfo.getBlobInfo
 * 
 * For page blob
 * 
 * 1. Uploaded regions
 * 2. ContentMD5 property
 * 3. Data at specified range if specified (single range for now)
 * 4. If requested, tries to create container at the same time in parallel
 *
 */

var callbackAggregator = require('../../callbackAggregator');
var intSet = require('./intSet');
var bufferStream = require('./bufferStream');

var getBlobInfo =
  exports.getBlobInfo = 
    function(blobService, container, blobName, range, createContainerIfNotExists, callback) {
  var agg = callbackAggregator.callbackAndAggregator(function(results, key, args) {
    if (key) { // This means error somewhere - defined by key
      var error = args[0];
      var resp = args[2];
      if (error && typeof error === 'object') {
        error.whichFunction = key;
        if (!error.code && !error.statusCode && resp) {
         // Sometimes error object does not have useful information. Add it to make it more debuggable.
         error.statusCode = resp.statusCode;
         error.response = resp;
        }
      }
      if (error.code === 'BlobNotFound' || (resp && resp.statusCode == 404)) {
        // blob is not there
        // This is not considered an error for our purpose
        // callback will get no args
        callback();
        return;
      }
      callback.apply(null, args); // pass all arguments to callback()
      return;
    }
    // success
    var result = {};
    if (!blobName) {
      // just creating a container
      callback();
      return;
    }
    result.pageRegions = results.listBlobRegion[1]; // callback(error, pageRegions, response)
    result.blobProperties = results.getBlobProperties[1];
    if (range && 
        result.blobProperties && 
        result.pageRegions && result.pageRegions.length !== 0 &&
        range.end < result.blobProperties.contentLength) {
      // if we succeed try to get footer / specified range
      var setAvailable = intSet.createIntSet(range.start, range.end);
      setAvailable.subtractRanges(result.blobProperties.pageRegions);
      var range0Available = setAvailable.getInterval(0);
      if (range0Available && range0Available.start === range.start && range0Available.end === range.end) {
        // download range 
        var getOptions = {};
        getOptions.rangeStart = range.start;
        getOptions.rangeEnd = range.end;
        /*
          blobService.getBlobToText() does not work right with non-ascii symbols
          We need to implement Buffer-based writeable stream or stream-like object
        */
        var errorsCalled = 0;
        var stream = bufferStream.createBufferWriteStream(function(error, buffer) {
          if (error) {
            if (errorsCalled++ === 0) callback(error, result); // call once
            return;
          }
          result.data = buffer;
          callback(null, result);
        });
        blobService.getBlobToStream(container, blobName, stream, 
            getOptions, function(error, blockBlob, response) {
          if (error) {
            if (errorsCalled++ === 0) callback(error, result); // call once
            return;
          }
        });
        return;
      }
      
    }  
    callback(null, result);
  });
  
  if (blobName) {
    var lbrAgg = agg.getCallback('listBlobRegion');  
    blobService.listBlobRegions(container, blobName, null, null, lbrAgg);
   
    var gbpAgg = agg.getCallback('getBlobProperties');
    blobService.getBlobProperties(container, blobName, gbpAgg);
  } else {
    if (!createContainerIfNotExists) {
      throw new Error('Wrong args - nothing to do!');
    }
  }
  
  if (createContainerIfNotExists) {
    // do this in parallel too
    var ccAgg = agg.getCallback('createContainerIfNotExists');
    blobService.createContainerIfNotExists(container, ccAgg);
  }  
};
