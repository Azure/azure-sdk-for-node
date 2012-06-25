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
 * BlobServiceEx
 */

var util = require('util');
var BlobService = require('../../services/blob/blobservice');
var WebResource = require('../../http/webresource');
var azureutil = require('../../util/util');
var BlobResult = require('../../services/blob/models/blobresult');
var Constants = require('../../util/constants');
var HeaderConstants = Constants.HeaderConstants;
var QueryStringConstants = Constants.QueryStringConstants;
var BlobConstants = Constants.BlobConstants;
var HttpConstants = Constants.HttpConstants;

//Expose 'BlobServiceEx'.
exports = module.exports = BlobServiceEx;


/**
* Creates a new BlobServiceEx object.
*
* @constructor
* @extends {BlobServiceEx}
*
* @param {string} [storageAccount]          The storage account.
* @param {string} [storageAccessKey]        The storage access key.
* @param {string} [host]                    The host address.
* @param {object} [authenticationProvider]  The authentication provider.
*/
function BlobServiceEx(storageAccount, storageAccessKey, host, authenticationProvider) {
  BlobServiceEx.super_.call(this, storageAccount, storageAccessKey, host, authenticationProvider);
  this.apiVersion = '2012-02-12';
}

util.inherits(BlobServiceEx, BlobService);

/**
* Copies a blob to a destination within the storage account. The Copy Blob operation copies the entire committed blob.
*
* @this {BlobServiceEx}
* @param {string}             sourceContainer                             The source container name.
* @param {string}             sourceBlob                                  The source blob name.
* @param {string}             targetContainer                             The target container name.
* @param {string}             targetBlob                                  The target blob name.
* @param {object|function}    [optionsOrCallback]                         The blobs and request options.
* @param {string}             [optionsOrCallback.snapshotId]              The source blob snapshot identifier.
* @param {object}             [optionsOrCallback.metadata]                The target blob metadata key/value pairs.
* @param {string}             [optionsOrCallback.leaseId]                 The target blob lease identifier.
* @param {string}             [optionsOrCallback.sourceLeaseId]           The source blob lease identifier.
* @param {object}             [optionsOrCallback.accessConditions]        The access conditions. See http://msdn.microsoft.com/en-us/library/dd179371.aspx for more information.
* @param {object}             [optionsOrCallback.sourceAccessConditions]  The access conditions. See http://msdn.microsoft.com/en-us/library/dd179371.aspx for more information.
* @param {int}                [optionsOrCallback.timeoutIntervalInMs]     The timeout interval, in milliseconds, to use for the request.
* @param {function(error, blob, response)}  callback                      The callback function.
* @return {undefined}
*/
BlobServiceEx.prototype.copyBlobEx = function (sourceUri, targetContainer, targetBlob, optionsOrCallback, callback) {
  var options = null;
  if (typeof optionsOrCallback === 'function' && !callback) {
    callback = optionsOrCallback;
  } else {
    options = optionsOrCallback;
  }
  
  validateContainerName(targetContainer);
  validateBlobName(targetContainer, targetBlob);
  validateCallback(callback);

  var targetResourceName = createResourceName(targetContainer, targetBlob);

  var webResource = WebResource.put(targetResourceName)
    .withProperty(BlobConstants.ResourceTypeProperty, BlobConstants.ResourceTypes.BLOB)
    .withProperty(BlobConstants.SharedAccessPermissionProperty, BlobConstants.SharedAccessPermissions.WRITE);
 
  if (options) {
    webResource.addOptionalHeader(HeaderConstants.LEASE_ID_HEADER, options.leaseId);
    webResource.addOptionalHeader(HeaderConstants.SOURCE_LEASE_ID_HEADER, options.leaseId);
    webResource.addOptionalMetadataHeaders(options.metadata);
  }
  
  webResource.withOkCode(HttpConstants.HttpResponseCodes.ACCEPTED_CODE);

  if (options && options.snapshotId) {
    sourceUri += '?snapshot=' + options.snapshotId;
  }
  webResource.addOptionalHeader(HeaderConstants.COPY_SOURCE_HEADER, sourceUri);
 
  var processResponseCallback = function (responseObject, next) {
    responseObject.blobResult = null;
    if (!responseObject.error) {
      responseObject.blobResult = new BlobResult(targetContainer, targetBlob);
      responseObject.blobResult.getPropertiesFromHeaders(responseObject.response.headers);
  
      if (options && options.metadata) {
        responseObject.blobResult.metadata = options.metadata;
      }
    }
  
    var finalCallback = function (returnObject) {
     var response = returnObject.response;
     if (response && response.headers) {
    	response.copyStatus = response.headers['x-ms-copy-status'] || response.headers['x-ms-copy-blob-status']; 
      }
      callback(returnObject.error, returnObject.blobResult, returnObject.response);
    };
  
    next(responseObject, finalCallback);
  };

  this.performRequest(webResource, null, options, processResponseCallback);
};

/**
* Copies a blob to a destination within the storage account. The Copy Blob operation copies the entire committed blob.
*
* @this {BlobServiceEx}
* @param {string}             targetContainer                             The target container name.
* @param {string}             targetBlob                                  The target blob name.
* @param {object|function}    [optionsOrCallback]                         The blobs and request options.
* @param {string}             [optionsOrCallback.leaseId]                 The target blob lease identifier.
* @param {object}             [optionsOrCallback.accessConditions]        The access conditions. See http://msdn.microsoft.com/en-us/library/dd179371.aspx for more information.
* @param {int}                [optionsOrCallback.timeoutIntervalInMs]     The timeout interval, in milliseconds, to use for the request.
* @param {function(error, blob, response)}  callback                      The callback function.
* @return {undefined}
*/
BlobServiceEx.prototype.copyBlobStatus = function (targetContainer, targetBlob, optionsOrCallback, callback) {
  var options = null;
  if (typeof optionsOrCallback === 'function' && !callback) {
    callback = optionsOrCallback;
  } else {
    options = optionsOrCallback;
  }
  
  validateContainerName(targetContainer);
  validateBlobName(targetContainer, targetBlob);
  validateCallback(callback);

  var targetResourceName = createResourceName(targetContainer, targetBlob);

  var webResource = WebResource.head(targetResourceName)
    .withProperty(BlobConstants.ResourceTypeProperty, BlobConstants.ResourceTypes.BLOB)
    .withProperty(BlobConstants.SharedAccessPermissionProperty, BlobConstants.SharedAccessPermissions.WRITE);

  
  if (options && options.leaseId) {
    webResource.addOptionalHeader(HeaderConstants.LEASE_ID_HEADER, options.leaseId);
    webResource.addOptionalHeader(HeaderConstants.SOURCE_LEASE_ID_HEADER, options.leaseId);
  }
  webResource.withOkCode(HttpConstants.HttpResponseCodes.ACCEPTED_CODE);
  webResource.withOkCode(HttpConstants.HttpResponseCodes.OK_CODE);
   
  var processResponseCallback = function (responseObject, next) {
    responseObject.blobResult = null;
    if (!responseObject.error) {
      responseObject.blobResult = new BlobResult(targetContainer, targetBlob);
      responseObject.blobResult.getPropertiesFromHeaders(responseObject.response.headers);
    }
  
    var finalCallback = function (returnObject) {
      var response = returnObject.response;
      if (response && response.headers) {
        response.copyStatus = response.headers['x-ms-copy-status'] || response.headers['x-ms-copy-blob-status']; 
      }
      callback(returnObject.error, returnObject.blobResult, returnObject.response);
    };
 
    next(responseObject, finalCallback);
  };
  
  this.performRequest(webResource, null, options, processResponseCallback);
};

//Non-class methods

/**
* Create resource name
*
* @param {string} containerName Container name
* @param {string} blobName      Blob name
* @return {string} The encoded resource name.
*/
function createResourceName(containerName, blobName) {
  // Resource name
  var resourceName = containerName + '/' + blobName;
  if (!containerName || containerName === '$root') {
    resourceName = blobName;
  }

  if (!blobName) {
    resourceName = containerName;
  }

  // return URI encoded resource name
  return encodeURI(resourceName);
}

/**
* Validates a container name.
*
* @param {string} containerName The container name.
* @return {undefined}
*/
function validateContainerName(containerName) {
  if (!azureutil.objectIsString(containerName) || azureutil.stringIsEmpty(containerName)) {
    throw new Error(BlobService.incorrectContainerNameErr);
  }

  if (containerName === '$root') {
    return;
  }

  if (containerName.match('^[a-z0-9][a-z0-9-]*$') === null) {
    throw new Error(BlobService.incorrectContainerNameFormatErr);
  }

  if (containerName.indexOf('--') !== -1) {
    throw new Error(BlobService.incorrectContainerNameFormatErr);
  }

  if (containerName.length < 3 || containerName.length > 63) {
    throw new Error(BlobService.incorrectContainerNameFormatErr);
  }

  if (containerName.substr(containerName.length - 1, 1) === '-') {
    throw new Error(BlobService.incorrectContainerNameFormatErr);
  }
}

/**
* Validates a blob name.
*
* @param {string} containerName The container name.
* @param {string} blobname      The blob name.
* @return {undefined}
*/
function validateBlobName(containerName, blobName) {
  if (!blobName) {
    throw new Error(BlobService.incorrectBlobNameErr);
  }

  if (containerName === '$root' && blobName.indexOf('/') !== -1) {
    throw new Error(BlobService.incorrectBlobNameFormatErr);
  }
}

/**
* Validates a callback function.
*
* @param {function} callback The callback function.
* @return {undefined}
*/
function validateCallback(callback) {
  if (!callback) {
    throw new Error(BlobService.incorrectCallbackErr);
  }
}
