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
 * Common code to delete OS or Disk image, possibly with a blob
 */

var utils = require('../utils');
var blobUtils = require('../blobUtils');
var uploadVMImage = require('./upload/uploadVMImage');


function noop() {
}

// delete disk (apiName='Disk') or OS (apiName='OSImage') images
function deleteImageOnly(apiName, logName, logger, channel, name, progressEnd, callback) {
  utils.doServiceManagementOperation(channel, 'delete' + apiName, name, function(error, response) {
    progressEnd();
    if (!error) {
      logger.info(logName + ' deleted: ' + name);
    } else {
      logger.error(logName + ' not deleted: ' + name);      
    }
    
    callback(error);
  });  
}

//delete disk (apiName='Disk') or OS (apiName='OSImage') images
//set blobUrl to null or undefined to query
var deleteImage = exports.deleteImage =
    function deleteImage(apiName, logName, logger, channel, name, blobUrl, cliProgress, deleteBlobAsWell, callback) {
  var progressEnd = cliProgress ? cliProgress('Deleting image').end : noop;
  
  if (!deleteBlobAsWell) {
    deleteImageOnly(apiName, logName, logger, channel, name, progressEnd, callback);
    return;
  }

  if (blobUrl) {
    // Don't query for it
    // delete image first!
    deleteImageOnly(apiName, logName, logger, channel, name, progressEnd, deleteBlob);
    return;
  }

  utils.doServiceManagementOperation(channel, 'get' + apiName, name, function(error, response) {
    if (!error) {
      blobUrl = response.body.MediaLink;
      // delete image first!
      deleteImageOnly(apiName, logName, logger, channel, name, progressEnd, deleteBlob);
    } else {
      progressEnd();
      callback(error);
    }
  });
  
  function deleteBlob(error) {
    if (error) {
      callback(error);
      return;
    }
  
    blobUrl = blobUtils.unescape(blobUrl);
    // sometimes blob contains '//' - an RDFE issue. Workaround: remove - except in protocol
    var split = blobUrl.split('://');
    var next = split[split.length - 1];
    var prev;
    do {
      prev = next;
      next = next.replace('//', '/');
    } while (next !== prev);
    split[split.length - 1] = next;
    blobUrl = split.join('://');
    
    logger.silly('Deleting blob ' + blobUrl);
    uploadVMImage.deleteBlobFromIaasClient(blobUrl, channel, {logger: logger}, function (error) {
      progressEnd();
      if (error) {
        logger.warn('Warning: couldn\'t delete page blob '+ blobUrl);
      } else {
        logger.info('Blob deleted: ' + blobUrl);
      }
      callback(error);
    });
  } 
};

