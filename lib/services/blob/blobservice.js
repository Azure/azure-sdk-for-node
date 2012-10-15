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

// Module dependencies.
var fs = require('fs');
var qs = require('qs');
var url = require('url');
var path = require('path');
var util = require('util');
var crypto = require('crypto');
var xmlbuilder = require('xmlbuilder');
var mime = require('mime');

var azureutil = require('../../util/util');
var ISO8061Date = require('../../util/iso8061date');

var SharedKey = require('./sharedkey');
var SharedAccessSignature = require('./sharedaccesssignature');
var StorageServiceClient = require('../core/storageserviceclient');
var ServiceClient = require('../core/serviceclient');
var WebResource = require('../../http/webresource');
var Constants = require('../../util/constants');
var HeaderConstants = Constants.HeaderConstants;
var QueryStringConstants = Constants.QueryStringConstants;
var BlobConstants = Constants.BlobConstants;
var HttpConstants = Constants.HttpConstants;

// Models requires
var ServicePropertiesResult = require('./models/servicepropertiesresult');
var ContainerAclResult = require('./models/containeraclresult');
var BlockListResult = require('./models/blocklistresult');
var BlobResult = require('./models/blobresult');
var ContainerResult = require('./models/containerresult');
var LeaseResult = require('./models/leaseresult');
var ListBlobsResultContinuation = require('./models/listblobsresultcontinuation');
var ListContainersResultContinuation = require('./models/listcontainersresultcontinuation');

// Expose 'BlobService'.
exports = module.exports = BlobService;

// Validation error messages
BlobService.needCntErr = "Container name must be specified in the 'name' parameter.";
BlobService.needCntBlobErr = "Container and blob name must be specified in the 'name' parameter, separated with a forward slash.";
BlobService.needBlobValErr = "Blob value must be specified in the 'data' parameter.";
BlobService.incorrectContainerNameErr = 'Container name must be a non empty string.';
BlobService.incorrectContainerNameFormatErr = 'Container name format is incorrect.';
BlobService.incorrectBlobNameErr = 'Blob name is not specified.';
BlobService.incorrectBlobNameFormatErr = 'Blob name format is incorrect.';
BlobService.incorrectMetadataErr = 'Metadata should be a JSON object.';
BlobService.incorrectCallbackErr = 'Callback must be specified.';
BlobService.incorrectFilenameErr = 'Local filename is not specified.';
BlobService.incorrectStartByteOffsetErr = 'Start byte offset must be a modulus of 512.';
BlobService.incorrectEndByteOffsetErr = 'End byte offset must be a modulus of 512 minus 1.';

/**
* Creates a new BlobService object.
* If no storageaccount or storageaccesskey are provided, the AZURE_STORAGE_ACCOUNT and AZURE_STORAGE_ACCESS_KEY environment variables will be used.
*
* @constructor
* @extends {ServiceClient}
*
* @param {string} [storageAccountOrConnectionString]  The storage account or the connection string.
* @param {string} [storageAccessKey]                  The storage access key.
* @param {string} [host]                              The host address.
* @param {object} [authenticationProvider]            The authentication provider.
*/
function BlobService(storageAccountOrConnectionString, storageAccessKey, host, authenticationProvider) {
  var storageServiceSettings = StorageServiceClient.getStorageSettings(storageAccountOrConnectionString, storageAccessKey, host);

  BlobService.super_.call(this,
    storageServiceSettings._name,
    storageServiceSettings._key,
    storageServiceSettings._blobEndpointUri,
    storageServiceSettings._usePathStyleUri,
    authenticationProvider);

  if (!this.authenticationProvider) {
    this.authenticationProvider = new SharedKey(this.storageAccount, this.storageAccessKey, this.usePathStyleUri);
  }

  if (!this.sharedAccessSignatureCredentials) {
    this.sharedAccessSignatureCredentials = new SharedAccessSignature(this.storageAccount, this.storageAccessKey);
  }

  this.singleBlobPutThresholdInBytes = BlobConstants.DEFAULT_SINGLE_BLOB_PUT_THRESHOLD_IN_BYTES;
  this.writeBlockSizeInBytes = BlobConstants.DEFAULT_WRITE_BLOCK_SIZE_IN_BYTES;
}

util.inherits(BlobService, StorageServiceClient);

/**
* Gets the properties of a storage account’s Blob service, including Windows Azure Storage Analytics.
*
* @this {BlobService}
* @param {object|function}    [optionsOrCallback]                      The request options or callback function.
* @param {int}                [optionsOrCallback.timeoutIntervalInMs]  The timeout interval, in milliseconds, to use for the request.
* @param {function(error, serviceProperties, response)}  callback      The callback function.
* @return {undefined}
*/
BlobService.prototype.getServiceProperties = function (optionsOrCallback, callback) {
  var options = null;
  if (typeof optionsOrCallback === 'function' && !callback) {
    callback = optionsOrCallback;
  } else {
    options = optionsOrCallback;
  }

  validateCallback(callback);

  var webResource = WebResource.get();
  webResource.addOptionalQueryParam(QueryStringConstants.COMP, 'properties');
  webResource.addOptionalQueryParam(QueryStringConstants.RESTYPE, 'service');

  var processResponseCallback = function (responseObject, next) {
    responseObject.servicePropertiesResult = null;
    if (!responseObject.error) {
      responseObject.servicePropertiesResult = ServicePropertiesResult.parse(responseObject.response.body);
    }

    // function to be called after all filters
    var finalCallback = function (returnObject) {
      callback(returnObject.error, returnObject.servicePropertiesResult, returnObject.response);
    };

    // call the first filter
    next(responseObject, finalCallback);
  };

  this.performRequest(webResource, null, options, processResponseCallback);
};

/**
* Sets the properties of a storage account’s Blob service, including Windows Azure Storage Analytics.
* You can also use this operation to set the default request version for all incoming requests that do not have a version specified.
*
* @this {BlobService}
* @param {object}             serviceProperties                        The service properties.
* @param {object|function}    [optionsOrCallback]                      The request options or callback function.
* @param {int}                [optionsOrCallback.timeoutIntervalInMs]  The timeout interval, in milliseconds, to use for the request.
* @param {function(error, response)}  callback                         The callback function.
* @return {undefined}
*/
BlobService.prototype.setServiceProperties = function (serviceProperties, optionsOrCallback, callback) {
  var options = null;
  if (typeof optionsOrCallback === 'function' && !callback) {
    callback = optionsOrCallback;
  } else {
    options = optionsOrCallback;
  }

  validateCallback(callback);

  var servicePropertiesXml = ServicePropertiesResult.serialize(serviceProperties);

  var webResource = WebResource.put().withOkCode(HttpConstants.HttpResponseCodes.ACCEPTED_CODE);
  webResource.addOptionalQueryParam(QueryStringConstants.COMP, 'properties');
  webResource.addOptionalQueryParam(QueryStringConstants.RESTYPE, 'service');

  webResource.addOptionalHeader(HeaderConstants.CONTENT_TYPE, 'application/xml;charset="utf-8"');
  webResource.addOptionalHeader(HeaderConstants.CONTENT_LENGTH, Buffer.byteLength(servicePropertiesXml));

  var processResponseCallback = function (responseObject, next) {
    var finalCallback = function (returnObject) {
      callback(returnObject.error, returnObject.response);
    };

    next(responseObject, finalCallback);
  };

  this.performRequest(webResource, servicePropertiesXml, options, processResponseCallback);
};

/**
* Returns a list of the containers under the specified account.
*
* @this {BlobService}
* @param {object}             [optionsOrCallback]                         The list container options.
* @param {string}             [optionsOrCallback.prefix]                  Filters the results to return only containers whose name begins with the specified prefix.
* @param {int}                [optionsOrCallback.maxresults]              Specifies the maximum number of containers to return per call to Azure storage.
* @param {string}             [optionsOrCallback.marker]                  String value that identifies the portion of the list to be returned with the next list operation.
* @param {string}             [optionsOrCallback.include]                 Include this parameter to specify that the container's metadata be returned as part of the response body. (allowed values: '', 'metadata')
* @param {int}                [optionsOrCallback.timeoutIntervalInMs]     The timeout interval, in milliseconds, to use for the request.
* @param {function(error, containers, nextMarker, response)}  callback    The callback function.
* @return {undefined}
*/
BlobService.prototype.listContainers = function (optionsOrCallback, callback) {
  var options = null;
  if (typeof optionsOrCallback === 'function' && !callback) {
    callback = optionsOrCallback;
  } else {
    options = optionsOrCallback;
  }

  validateCallback(callback);

  var webResource = WebResource.get()
    .withProperty(BlobConstants.ResourceTypeProperty, BlobConstants.ResourceTypes.CONTAINER)
    .withProperty(BlobConstants.SharedAccessPermissionProperty, BlobConstants.SharedAccessPermissions.LIST);

  webResource.addOptionalQueryParam(QueryStringConstants.COMP, 'list');
  webResource.addOptionalQueryParams(options,
    QueryStringConstants.PREFIX,
    QueryStringConstants.MARKER,
    QueryStringConstants.MAX_RESULTS,
    QueryStringConstants.INCLUDE);

  var self = this;
  var processResponseCallback = function (responseObject, next) {
    responseObject.listContainersResult = null;
    responseObject.listContainersResultContinuation = null;

    if (!responseObject.error) {
      responseObject.listContainersResult = [];

      if (responseObject.response.body.Containers && responseObject.response.body.Containers.Container) {
        var containers = [];
        if (responseObject.response.body.Containers.Container) {
          containers = responseObject.response.body.Containers.Container;

          if (!Array.isArray(containers)) {
            containers = [containers];
          }
        }

        containers.forEach(function (currentContainer) {
          var containerResult = ContainerResult.parse(currentContainer);
          responseObject.listContainersResult.push(containerResult);
        });

        responseObject.listContainersResultContinuation = new ListContainersResultContinuation(self, options, responseObject.response.body.NextMarker);
      }
    }

    var finalCallback = function (returnObject) {
      callback(returnObject.error, returnObject.listContainersResult, returnObject.listContainersResultContinuation, returnObject.response);
    };

    next(responseObject, finalCallback);
  };

  this.performRequest(webResource, null, options, processResponseCallback);
};

/**
* Creates a new container under the specified account.
* If a container with the same name already exists, the operation fails.
*
* @this {BlobService}
* @param {string}             container                                   The container name.
* @param {object|function}    [optionsOrCallback]                         The optional container and request options.
* @param {object}             [optionsOrCallback.metadata]                The metadata key/value pairs.
* @param {string}             [optionsOrCallback.publicAccessLevel]       Specifies whether data in the container may be accessed publicly and the level of access.
* @param {int}                [optionsOrCallback.timeoutIntervalInMs]     The timeout interval, in milliseconds, to use for the request.
* @param {function(error, container, response)}  callback                 The callback function.
* @return {undefined}
*/
BlobService.prototype.createContainer = function (container, optionsOrCallback, callback) {
  var options = null;
  if (typeof optionsOrCallback === 'function' && !callback) {
    callback = optionsOrCallback;
  } else {
    options = optionsOrCallback;
  }

  validateContainerName(container);
  validateCallback(callback);

  var webResource = WebResource.put(container)
    .withProperty(BlobConstants.ResourceTypeProperty, BlobConstants.ResourceTypes.CONTAINER)
    .withProperty(BlobConstants.SharedAccessPermissionProperty, BlobConstants.SharedAccessPermissions.WRITE);

  webResource.addOptionalQueryParam(QueryStringConstants.RESTYPE, 'container');

  if (options) {
    webResource.addOptionalMetadataHeaders(options.metadata);
    webResource.addOptionalHeader(HeaderConstants.BLOB_PUBLIC_ACCESS_HEADER, options.publicAccessLevel);
  }

  var processResponseCallback = function (responseObject, next) {
    responseObject.containerResult = null;
    if (!responseObject.error) {
      responseObject.containerResult = new ContainerResult(container);
      responseObject.containerResult.getPropertiesFromHeaders(responseObject.response.headers);
      if (options && options.metadata) {
        responseObject.containerResult.metadata = options.metadata;
      }
    }

    var finalCallback = function (returnObject) {
      callback(returnObject.error, returnObject.containerResult, returnObject.response);
    };

    next(responseObject, finalCallback);
  };

  this.performRequest(webResource, null, options, processResponseCallback);
};

/**
* Creates a new container under the specified account if the container does not exists.
*
* @this {BlobService}
* @param {string}             container                                   The container name.
* @param {object|function}    [optionsOrCallback]                         The optional container and request options.
* @param {object}             [optionsOrCallback.metadata]                The metadata key/value pairs.
* @param {string}             [optionsOrCallback.publicAccessLevel]       Specifies whether data in the container may be accessed publicly and the level of access.
* @param {int}                [optionsOrCallback.timeoutIntervalInMs]     The timeout interval, in milliseconds, to use for the request.
* @param {function(error, containerCreated, response)}  callback          The callback function.
* @return {undefined}
*/
BlobService.prototype.createContainerIfNotExists = function (container, optionsOrCallback, callback) {
  var options = null;
  if (typeof optionsOrCallback === 'function' && !callback) {
    callback = optionsOrCallback;
  } else {
    options = optionsOrCallback;
  }

  this.createContainer(container, options, function (error, responseContainer, response) {
    if (error && error.code === Constants.BlobErrorCodeStrings.CONTAINER_ALREADY_EXISTS) {
      // If it was created before, there was no actual error.
      error = null;
    }

    callback(error, !azureutil.objectIsNull(responseContainer), response);
  });
};

/**
* Retrieves a container and its properties from a specified account.
*
* @this {BlobService}
* @param {string}             container                                   The container name.
* @param {object|function}    [optionsOrCallback]                         The request options.
* @param {int}                [optionsOrCallback.timeoutIntervalInMs]     The timeout interval, in milliseconds, to use for the request.
* @param {function(error, container, response)}  callback                 The callback function.
* @return {undefined}
*/
BlobService.prototype.getContainerProperties = function (container, optionsOrCallback, callback) {
  var options = null;
  if (typeof optionsOrCallback === 'function' && !callback) {
    callback = optionsOrCallback;
  } else {
    options = optionsOrCallback;
  }

  validateContainerName(container);
  validateCallback(callback);

  var webResource = WebResource.head(container)
    .withProperty(BlobConstants.ResourceTypeProperty, BlobConstants.ResourceTypes.CONTAINER)
    .withProperty(BlobConstants.SharedAccessPermissionProperty, BlobConstants.SharedAccessPermissions.READ);

  webResource.addOptionalQueryParam(QueryStringConstants.RESTYPE, 'container');

  var self = this;
  var processResponseCallback = function (responseObject, next) {
    responseObject.containerResult = null;
    if (!responseObject.error) {
      responseObject.containerResult = new ContainerResult(container);
      responseObject.containerResult.metadata = self.parseMetadataHeaders(responseObject.response.headers);
      responseObject.containerResult.getPropertiesFromHeaders(responseObject.response.headers);
    }

    var finalCallback = function (returnObject) {
      callback(returnObject.error, returnObject.containerResult, returnObject.response);
    };

    next(responseObject, finalCallback);
  };

  this.performRequest(webResource, null, options, processResponseCallback);
};

/**
* Returns all user-defined metadata for the container.
*
* @this {BlobService}
* @param {string}             container                                   The container name.
* @param {object|function}    [optionsOrCallback]                         The request options.
* @param {int}                [optionsOrCallback.timeoutIntervalInMs]     The timeout interval, in milliseconds, to use for the request.
* @param {function(error, container, response)}  callback                 The callback function.
* @return {undefined}
*/
BlobService.prototype.getContainerMetadata = function (container, optionsOrCallback, callback) {
  var options = null;
  if (typeof optionsOrCallback === 'function' && !callback) {
    callback = optionsOrCallback;
  } else {
    options = optionsOrCallback;
  }

  validateContainerName(container);
  validateCallback(callback);

  var webResource = WebResource.head(container)
    .withProperty(BlobConstants.ResourceTypeProperty, BlobConstants.ResourceTypes.CONTAINER)
    .withProperty(BlobConstants.SharedAccessPermissionProperty, BlobConstants.SharedAccessPermissions.READ);

  webResource.addOptionalQueryParam(QueryStringConstants.RESTYPE, 'container');
  webResource.addOptionalQueryParam(QueryStringConstants.COMP, 'metadata');

  var self = this;
  var processResponseCallback = function (responseObject, next) {
    responseObject.containerResult = null;
    if (!responseObject.error) {
      responseObject.containerResult = new ContainerResult(container);
      responseObject.containerResult.metadata = self.parseMetadataHeaders(responseObject.response.headers);
      responseObject.containerResult.getPropertiesFromHeaders(responseObject.response.headers);
    }

    var finalCallback = function (returnObject) {
      callback(returnObject.error, returnObject.containerResult, returnObject.response);
    };

    next(responseObject, finalCallback);
  };

  this.performRequest(webResource, null, options, processResponseCallback);
};

/**
* Sets the container's metadata.
*
* Calling the Set Container Metadata operation overwrites all existing metadata that is associated with the container. 
* It's not possible to modify an individual name/value pair.
*
* @this {BlobService}
* @param {string}             container                                   The container name.
* @param {object}             metadata                                    The metadata key/value pairs.
* @param {object|function}    [optionsOrCallback]                         The container and request options.
* @param {object}             [optionsOrCallback.accessConditions]        See http://msdn.microsoft.com/en-us/library/dd179371.aspx for more information.
* @param {int}                [optionsOrCallback.timeoutIntervalInMs]     The timeout interval, in milliseconds, to use for the request.
* @param {function(error, response)}  callback                            The callback function.
* @return {undefined}
*/
BlobService.prototype.setContainerMetadata = function (container, metadata, optionsOrCallback, callback) {
  var options = null;
  if (typeof optionsOrCallback === 'function' && !callback) {
    callback = optionsOrCallback;
  } else {
    options = optionsOrCallback;
  }

  validateContainerName(container);
  validateCallback(callback);

  var webResource = WebResource.put(container)
    .withOkCode(HttpConstants.HttpResponseCodes.OK_CODE)
    .withProperty(BlobConstants.ResourceTypeProperty, BlobConstants.ResourceTypes.CONTAINER)
    .withProperty(BlobConstants.SharedAccessPermissionProperty, BlobConstants.SharedAccessPermissions.WRITE);

  webResource.addOptionalQueryParam(QueryStringConstants.RESTYPE, 'container');
  webResource.addOptionalQueryParam(QueryStringConstants.COMP, 'metadata');
  webResource.addOptionalMetadataHeaders(metadata);

  var processResponseCallback = function (responseObject, next) {
    var finalCallback = function (returnObject) {
      callback(returnObject.error, returnObject.response);
    };

    next(responseObject, finalCallback);
  };

  this.performRequest(webResource, null, options, processResponseCallback);
};

/**
* Gets the container's ACL.
*
* @this {BlobService}
* @param {string}             container                                   The container name.
* @param {object|function}    [optionsOrCallback]                         The container and request options.
* @param {int}                [optionsOrCallback.timeoutIntervalInMs]     The timeout interval, in milliseconds, to use for the request.
* @param {function(error, container, response)}  callback                 The callback function.
* @return {undefined}
*/
BlobService.prototype.getContainerAcl = function (container, optionsOrCallback, callback) {
  var options = null;
  if (typeof optionsOrCallback === 'function' && !callback) {
    callback = optionsOrCallback;
  } else {
    options = optionsOrCallback;
  }

  validateContainerName(container);
  validateCallback(callback);

  var webResource = WebResource.get(container)
    .withProperty(BlobConstants.ResourceTypeProperty, BlobConstants.ResourceTypes.CONTAINER)
    .withProperty(BlobConstants.SharedAccessPermissionProperty, BlobConstants.SharedAccessPermissions.READ);

  webResource.addOptionalQueryParam(QueryStringConstants.RESTYPE, 'container');
  webResource.addOptionalQueryParam(QueryStringConstants.COMP, 'acl');

  var processResponseCallback = function (responseObject, next) {
    responseObject.containerResult = null;
    if (!responseObject.error) {
      responseObject.containerResult = new ContainerResult(container);
      responseObject.containerResult.getPropertiesFromHeaders(responseObject.response.headers);
      responseObject.containerResult.signedIdentifiers = ContainerAclResult.parse(responseObject.response.body.SignedIdentifier);
    }

    var finalCallback = function (returnObject) {
      callback(returnObject.error, returnObject.containerResult, returnObject.response);
    };

    next(responseObject, finalCallback);
  };

  this.performRequest(webResource, null, options, processResponseCallback);
};

/**
* Updates the container's ACL.
*
* @this {BlobService}
* @param {string}             container                                   The container name.
* @param {string}             publicAccessLevel                           Specifies whether data in the container may be accessed publicly and the level of access.
* @param {object|function}    [optionsOrCallback]                         The container and request options.
* @param {object}             [optionsOrCallback.signedIdentifiers]       The signed identifiers.
* @param {int}                [optionsOrCallback.timeoutIntervalInMs]     The timeout interval, in milliseconds, to use for the request.
* @param {function(error, container, response)}  callback                 The callback function.
* @return {undefined}
*/
BlobService.prototype.setContainerAcl = function (container, publicAccessLevel, optionsOrCallback, callback) {
  var options = null;
  if (typeof optionsOrCallback === 'function' && !callback) {
    callback = optionsOrCallback;
  } else {
    options = optionsOrCallback;
  }

  validateContainerName(container);
  validateCallback(callback);

  var webResource = WebResource.put(container)
    .withOkCode(HttpConstants.HttpResponseCodes.OK_CODE)
    .withProperty(BlobConstants.ResourceTypeProperty, BlobConstants.ResourceTypes.CONTAINER)
    .withProperty(BlobConstants.SharedAccessPermissionProperty, BlobConstants.SharedAccessPermissions.WRITE);

  webResource.addOptionalQueryParam(QueryStringConstants.RESTYPE, 'container');
  webResource.addOptionalQueryParam(QueryStringConstants.COMP, 'acl');

  var policies = null;
  if (options && options.signedIdentifiers) {
    policies = ContainerAclResult.serialize(options.signedIdentifiers);
  }

  webResource.addOptionalHeader(HeaderConstants.CONTENT_LENGTH, !azureutil.objectIsNull(policies) ? Buffer.byteLength(policies) : 0);
  webResource.addOptionalHeader(HeaderConstants.BLOB_PUBLIC_ACCESS_HEADER, publicAccessLevel);

  var processResponseCallback = function (responseObject, next) {
    responseObject.containerResult = null;
    if (!responseObject.error) {
      responseObject.containerResult = new ContainerResult(container, publicAccessLevel);
      responseObject.containerResult.getPropertiesFromHeaders(responseObject.response.headers);
      if (options && options.signedIdentifiers) {
        responseObject.containerResult.signedIdentifiers = options.signedIdentifiers;
      }
    }

    var finalCallback = function (returnObject) {
      callback(returnObject.error, returnObject.containerResult, returnObject.response);
    };

    next(responseObject, finalCallback);
  };

  this.performRequest(webResource, policies, options, processResponseCallback);
};

/**
* Marks the specified container for deletion. 
* The container and any blobs contained within it are later deleted during garbage collection.
*
* @this {BlobService}
* @param {string}             container                                   The container name.
* @param {object|function}    [optionsOrCallback]                         The container and request options.
* @param {int}                [optionsOrCallback.timeoutIntervalInMs]     The timeout interval, in milliseconds, to use for the request.
* @param {function(error, response)}  callback                            The callback function.
* @return {undefined}
*/
BlobService.prototype.deleteContainer = function (container, optionsOrCallback, callback) {
  var options = null;
  if (typeof optionsOrCallback === 'function' && !callback) {
    callback = optionsOrCallback;
  } else {
    options = optionsOrCallback;
  }

  validateContainerName(container);
  validateCallback(callback);

  var webResource = WebResource.del(container)
    .withOkCode(HttpConstants.HttpResponseCodes.ACCEPTED_CODE)
    .withProperty(BlobConstants.ResourceTypeProperty, BlobConstants.ResourceTypes.CONTAINER)
    .withProperty(BlobConstants.SharedAccessPermissionProperty, BlobConstants.SharedAccessPermissions.WRITE);

  webResource.addOptionalQueryParam(QueryStringConstants.RESTYPE, 'container');

  var processResponseCallback = function (responseObject, next) {
    var finalCallback = function (returnObject) {
      callback(returnObject.error, returnObject.response);
    };

    next(responseObject, finalCallback);
  };

  this.performRequest(webResource, null, options, processResponseCallback);
};

/**
* Lists all of the blobs in the given container.
*
* @this {BlobService}
* @param {string}             container                                   The container name.
* @param {object|function}    [optionsOrCallback]                         The listing and request options.
* @param {string}             [optionsOrCallback.prefix]                  The blob name prefix.
* @param {string}             [optionsOrCallback.delimiter]               Delimiter, i.e. '/', for specifying folder hierarchy.
* @param {int}                [optionsOrCallback.maxresults]              Specifies the maximum number of blobs to return per call to Azure ServiceClient. This does NOT affect list size returned by this function. (maximum: 5000)
* @param {string}             [optionsOrCallback.marker]                  String value that identifies the portion of the list to be returned with the next list operation.
* @param {string}             [optionsOrCallback.include]                 Specifies that the response should include one or more of the following subsets: '', 'metadata', 'snapshots', 'uncommittedblobs'). Multiple values can be added separated with a comma (,)
* @param {int}                [optionsOrCallback.timeoutIntervalInMs]     The timeout interval, in milliseconds, to use for the request.
* @param {function(error, blobs, response)}  callback                     The callback function.
* @return {undefined}
*/
BlobService.prototype.listBlobs = function (container, optionsOrCallback, callback) {
  var options = null;
  if (typeof optionsOrCallback === 'function' && !callback) {
    callback = optionsOrCallback;
  } else {
    options = optionsOrCallback;
  }

  validateContainerName(container);
  validateCallback(callback);

  var webResource = WebResource.get(container)
    .withProperty(BlobConstants.ResourceTypeProperty, BlobConstants.ResourceTypes.BLOB)
    .withProperty(BlobConstants.SharedAccessPermissionProperty, BlobConstants.SharedAccessPermissions.LIST);

  webResource.addOptionalQueryParam(QueryStringConstants.RESTYPE, 'container');
  webResource.addOptionalQueryParam(QueryStringConstants.COMP, 'list');
  webResource.addOptionalQueryParams(options,
    QueryStringConstants.PREFIX,
    QueryStringConstants.MARKER,
    QueryStringConstants.MAX_RESULTS,
    QueryStringConstants.DELIMITER,
    QueryStringConstants.INCLUDE);

  var self = this;
  var processResponseCallback = function (responseObject, next) {
    responseObject.listBlobsResult = null;
    responseObject.listBlobsResultContinuation = null;

    if (!responseObject.error) {
      responseObject.listBlobsResult = [];
      var blobs = [];
      if (responseObject.response.body.Blobs.Blob) {
        blobs = responseObject.response.body.Blobs.Blob;
        if (!Array.isArray(blobs)) {
          blobs = [blobs];
        }
      }

      blobs.forEach(function (currentBlob) {
        var blobResult = BlobResult.parse(currentBlob);
        responseObject.listBlobsResult.push(blobResult);
      });

      responseObject.listBlobsResultContinuation = new ListBlobsResultContinuation(self, container, options, responseObject.response.body.NextMarker);
    }

    var finalCallback = function (returnObject) {
      callback(returnObject.error, returnObject.listBlobsResult, returnObject.listBlobsResultContinuation, returnObject.response);
    };

    next(responseObject, finalCallback);
  };

  this.performRequest(webResource, null, options, processResponseCallback);
};

/**
* Writes a range of pages to a page blob.
*
* @this {BlobService}
* @param {string}             container                                   The container name.
* @param {string}             blob                                        The blob name.
* @param {int}                length                                      The length of the page blob in bytes.
* @param {object|function}    [optionsOrCallback]                         The page blob and request options.
* @param {object}             [optionsOrCallback.metadata]                The metadata key/value pairs.
* @param {string}             [optionsOrCallback.leaseId]                 The target blob lease identifier.
* @param {object}             [optionsOrCallback.accessConditions]        The access conditions. See http://msdn.microsoft.com/en-us/library/dd179371.aspx for more information.
* @param {int}                [optionsOrCallback.timeoutIntervalInMs]     The timeout interval, in milliseconds, to use for the request.
* @param {function(error, response)}  callback                            The callback function.
* @return {undefined}
*/
BlobService.prototype.createPageBlob = function (container, blob, length, optionsOrCallback, callback) {
  var options = null;
  if (typeof optionsOrCallback === 'function' && !callback) {
    callback = optionsOrCallback;
  } else {
    options = optionsOrCallback;
  }

  validateContainerName(container);
  validateBlobName(container, blob);
  validateCallback(callback);

  var resourceName = createResourceName(container, blob);
  var webResource = WebResource.put(resourceName)
    .withProperty(BlobConstants.ResourceTypeProperty, BlobConstants.ResourceTypes.BLOB)
    .withProperty(BlobConstants.SharedAccessPermissionProperty, BlobConstants.SharedAccessPermissions.WRITE);

  if (options) {
    webResource.addOptionalHeader(HeaderConstants.LEASE_ID_HEADER, options.leaseId);
    webResource.addOptionalMetadataHeaders(options.metadata);
  }

  webResource.addOptionalHeader(HeaderConstants.BLOB_TYPE_HEADER, BlobConstants.BlobTypes.PAGE);
  webResource.addOptionalHeader(HeaderConstants.CONTENT_LENGTH_HEADER, length);
  webResource.addOptionalHeader(HeaderConstants.CONTENT_LENGTH, 0);

  var processResponseCallback = function (responseObject, next) {
    var finalCallback = function (returnObject) {
      callback(returnObject.error, returnObject.response);
    };

    next(responseObject, finalCallback);
  };

  this.performRequest(webResource, null, options, processResponseCallback);
};

/** 
* Creates a new block blob or page blob, or updates the content of an existing block blob. 
* Updating an existing block blob overwrites any existing metadata on the blob. Partial updates are not supported with Put Blob; the content of the existing blob is overwritten with the content of the new blob. To perform a partial update of the content of a block blob, use the Put Block List operation.
* Calling Put Blob to create a page blob only initializes the blob. To add content to a page blob, call the Put Page operation.
*
* @this {BlobService}
* @param {string}             container                                   The container name.
* @param {string}             blob                                        The blob name.
* @param {string}             localFilename                               The local path to the file to be uploaded.
* @param {object|function}    [optionsOrCallback]                         The creating and request options.
* @param {string}             [optionsOrCallback.snapshotId]              The snapshot identifier.
* @param {string}             [optionsOrCallback.leaseId]                 The lease identifier.
* @param {object}             [optionsOrCallback.metadata]                The metadata key/value pairs.
* @param {bool}               [optionsOrCallback.setBlobContentMD5]       Specifies whether the blob's ContentMD5 header should be set on uploads. This field is not supported for page blobs. The default value is false.
* @param {string}             [optionsOrCallback.blobType]                The type of blob to create: block blob or page blob.
* @param {string}             [optionsOrCallback.contentType]             The MIME content type of the blob. The default type is application/octet-stream.
* @param {string}             [optionsOrCallback.contentEncoding]         The content encodings that have been applied to the blob.
* @param {string}             [optionsOrCallback.contentLanguage]         The natural languages used by this resource.
* @param {string}             [optionsOrCallback.contentMD5]              The MD5 hash of the blob content.
* @param {string}             [optionsOrCallback.cacheControl]            The Blob service stores this value but does not use or modify it.
* @param {string}             [optionsOrCallback.contentTypeHeader]       The blob’s content type. (x-ms-blob-content-type)
* @param {string}             [optionsOrCallback.contentEncodingHeader]   The blob’s content encoding. (x-ms-blob-content-encoding)
* @param {string}             [optionsOrCallback.contentLanguageHeader]   The blob's content language. (x-ms-blob-content-language)
* @param {string}             [optionsOrCallback.contentMD5Header]        The blob’s MD5 hash. (x-ms-blob-content-md5)
* @param {string}             [optionsOrCallback.cacheControlHeader]      The blob's cache control. (x-ms-blob-cache-control)
* @param {object}             [optionsOrCallback.accessConditions]        The access conditions. See http://msdn.microsoft.com/en-us/library/dd179371.aspx for more information.
* @param {int}                [optionsOrCallback.timeoutIntervalInMs]     The timeout interval, in milliseconds, to use for the request.
* @param {function(error, blockBlob, response)}  callback                 The callback function.
* @return {undefined}
*/
BlobService.prototype.createBlockBlobFromFile = function (container, blob, localFilename, optionsOrCallback, callback) {
  var options = null;
  if (typeof optionsOrCallback === 'function' && !callback) {
    callback = optionsOrCallback;
  } else {
    options = optionsOrCallback;
  }

  validateContainerName(container);
  validateBlobName(container, blob);
  validateCallback(callback);

  var self = this;
  var operation = function (length, md5) {
    if (md5 && !blob.contentMD5) {
      blob.contentMD5 = md5;
    }

    if (!options) {
      options = {};
    }

    if (options.contentType === undefined) {
      options.contentType = mime.lookup(localFilename);
    }

    if (options.contentTypeHeader === undefined) {
      options.contentTypeHeader = mime.lookup(localFilename);
    }

    if (length >= self.singleBlobPutThresholdInBytes) {
      throw new Error('Invalid file size for a single block');
    } else {
      var readStream = fs.createReadStream(localFilename);
      self.createBlockBlobFromStream(container, blob, readStream, length, options, callback);
    }
  };

  var calculateMD5 = (options && options.setBlobContentMD5 && !options[HeaderConstants.CONTENT_MD5]);
  if (calculateMD5) {
    var stream = fs.createReadStream(localFilename);
    this._analyzeStream(stream, calculateMD5, operation);
  } else {
    fs.stat(localFilename, function (statErr, stat) {
      if (statErr) {
        callback(statErr);
      } else {
        operation(stat.size);
      }
    });
  }
};

/**
* Uploads a block blob from a stream.
*
* @this {BlobService}
* @param {string}             container                                   The container name.
* @param {string}             blob                                        The blob name.
* @param (Stream)             stream                                      Stream to the data to store.
* @param {int}                streamLength                                The length of the stream to upload.
* @param {object|function}    [optionsOrCallback]                         The creating and request options.
* @param {string}             [optionsOrCallback.snapshotId]              The snapshot identifier.
* @param {string}             [optionsOrCallback.leaseId]                 The lease identifier.
* @param {object}             [optionsOrCallback.metadata]                The metadata key/value pairs.
* @param {bool}               [optionsOrCallback.setBlobContentMD5]       Specifies whether the blob's ContentMD5 header should be set on uploads. This field is not supported for page blobs. The default value is false.
* @param {string}             [optionsOrCallback.blobType]                The type of blob to create: block blob or page blob.
* @param {string}             [optionsOrCallback.contentType]             The MIME content type of the blob. The default type is application/octet-stream.
* @param {string}             [optionsOrCallback.contentEncoding]         The content encodings that have been applied to the blob.
* @param {string}             [optionsOrCallback.contentLanguage]         The natural languages used by this resource.
* @param {string}             [optionsOrCallback.contentMD5]              The MD5 hash of the blob content.
* @param {string}             [optionsOrCallback.cacheControl]            The Blob service stores this value but does not use or modify it.
* @param {string}             [optionsOrCallback.contentTypeHeader]       The blob’s content type. (x-ms-blob-content-type)
* @param {string}             [optionsOrCallback.contentEncodingHeader]   The blob’s content encoding. (x-ms-blob-content-encoding)
* @param {string}             [optionsOrCallback.contentLanguageHeader]   The blob's content language. (x-ms-blob-content-language)
* @param {string}             [optionsOrCallback.contentMD5Header]        The blob’s MD5 hash. (x-ms-blob-content-md5)
* @param {string}             [optionsOrCallback.cacheControlHeader]      The blob's cache control. (x-ms-blob-cache-control)
* @param {object}             [optionsOrCallback.accessConditions]        The access conditions. See http://msdn.microsoft.com/en-us/library/dd179371.aspx for more information.
* @param {int}                [optionsOrCallback.timeoutIntervalInMs]     The timeout interval, in milliseconds, to use for the request.
* @param {function(error, blockBlob, response)}  callback                 The callback function.
* @return {undefined}
*/
BlobService.prototype.createBlockBlobFromStream = function (container, blob, readStream, streamLength, optionsOrCallback, callback) {
  var options = null;
  if (typeof optionsOrCallback === 'function' && !callback) {
    callback = optionsOrCallback;
  } else {
    options = optionsOrCallback;
  }

  validateContainerName(container);
  validateBlobName(container, blob);
  validateCallback(callback);

  var resourceName = createResourceName(container, blob);
  var webResource = WebResource.put(resourceName)
    .withProperty(BlobConstants.ResourceTypeProperty, BlobConstants.ResourceTypes.BLOB)
    .withProperty(BlobConstants.SharedAccessPermissionProperty, BlobConstants.SharedAccessPermissions.WRITE);

  this._setHeadersFromBlob(webResource, options);

  if (!(webResource.headers && webResource.headers[HeaderConstants.BLOB_TYPE_HEADER])) {
    webResource.addOptionalHeader(HeaderConstants.BLOB_TYPE_HEADER, BlobConstants.BlobTypes.BLOCK);
  }

  webResource.addOptionalHeader(HeaderConstants.CONTENT_TYPE, 'application/octet-stream');
  webResource.addOptionalHeader(HeaderConstants.CONTENT_LENGTH, streamLength);

  var processResponseCallback = function (responseObject, next) {
    responseObject.blobResult = null;
    if (!responseObject.error) {
      responseObject.blobResult = new BlobResult(container, blob);
      responseObject.blobResult.getPropertiesFromHeaders(responseObject.response.headers);
      if (options && options.metadata) {
        responseObject.blobResult.metadata = options.metadata;
      }
    }

    var finalCallback = function (returnObject) {
      callback(returnObject.error, returnObject.blobResult, returnObject.response);
    };

    next(responseObject, finalCallback);
  };

  this.performRequestOutputStream(webResource, readStream, options, processResponseCallback);
};

/**
* Uploads a block blob from a text string.
*
* @this {BlobService}
* @param {string}             container                                   The container name.
* @param {string}             blob                                        The blob name.
* @param {string}             text                                        The blob text.
* @param {object|function}    [optionsOrCallback]                         The blob and request options.
* @param {string}             [optionsOrCallback.snapshotId]              The snapshot identifier.
* @param {string}             [optionsOrCallback.leaseId]                 The lease identifier.
* @param {object}             [optionsOrCallback.metadata]                The metadata key/value pairs.
* @param {bool}               [optionsOrCallback.setBlobContentMD5]       Specifies whether the blob's ContentMD5 header should be set on uploads. This field is not supported for page blobs. The default value is false.
* @param {string}             [optionsOrCallback.blobType]                The type of blob to create: block blob or page blob.
* @param {string}             [optionsOrCallback.contentType]             The MIME content type of the blob. The default type is application/octet-stream.
* @param {string}             [optionsOrCallback.contentEncoding]         The content encodings that have been applied to the blob.
* @param {string}             [optionsOrCallback.contentLanguage]         The natural languages used by this resource.
* @param {string}             [optionsOrCallback.contentMD5]              The MD5 hash of the blob content.
* @param {string}             [optionsOrCallback.cacheControl]            The Blob service stores this value but does not use or modify it.
* @param {string}             [optionsOrCallback.contentTypeHeader]       The blob’s content type. (x-ms-blob-content-type)
* @param {string}             [optionsOrCallback.contentEncodingHeader]   The blob’s content encoding. (x-ms-blob-content-encoding)
* @param {string}             [optionsOrCallback.contentLanguageHeader]   The blob's content language. (x-ms-blob-content-language)
* @param {string}             [optionsOrCallback.contentMD5Header]        The blob’s MD5 hash. (x-ms-blob-content-md5)
* @param {string}             [optionsOrCallback.cacheControlHeader]      The blob's cache control. (x-ms-blob-cache-control)
* @param {object}             [optionsOrCallback.accessConditions]        The access conditions. See http://msdn.microsoft.com/en-us/library/dd179371.aspx for more information.
* @param {int}                [optionsOrCallback.timeoutIntervalInMs]     The timeout interval, in milliseconds, to use for the request.
* @param {function(error, blockBlob, response)}  callback                 The callback function.
* @return {undefined}
*/
BlobService.prototype.createBlockBlobFromText = function (container, blob, text, optionsOrCallback, callback) {
  var options = null;
  if (typeof optionsOrCallback === 'function' && !callback) {
    callback = optionsOrCallback;
  } else {
    options = optionsOrCallback;
  }

  validateContainerName(container);
  validateBlobName(container, blob);
  validateCallback(callback);

  var resourceName = createResourceName(container, blob);
  var webResource = WebResource.put(resourceName)
    .withProperty(BlobConstants.ResourceTypeProperty, BlobConstants.ResourceTypes.BLOB)
    .withProperty(BlobConstants.SharedAccessPermissionProperty, BlobConstants.SharedAccessPermissions.WRITE);

  this._setHeadersFromBlob(webResource, options);

  if (!(webResource.headers && webResource.headers[HeaderConstants.BLOB_TYPE_HEADER])) {
    webResource.addOptionalHeader(HeaderConstants.BLOB_TYPE_HEADER, BlobConstants.BlobTypes.BLOCK);
  }

  webResource.addOptionalHeader(HeaderConstants.CONTENT_LENGTH, Buffer.byteLength(text));
  webResource.addOptionalHeader(HeaderConstants.CONTENT_TYPE, 'text/plain;charset="utf-8"');

  var processResponseCallback = function (responseObject, next) {
    responseObject.blobResult = null;
    if (!responseObject.error) {
      responseObject.blobResult = new BlobResult(container, blob);
      responseObject.blobResult.getPropertiesFromHeaders(responseObject.response.headers);
      if (options && options.metadata) {
        responseObject.blobResult.metadata = options.metadata;
      }
    }

    var finalCallback = function (returnObject) {
      callback(returnObject.error, returnObject.blobResult, returnObject.response);
    };

    next(responseObject, finalCallback);
  };

  this.performRequest(webResource, text, options, processResponseCallback);
};

/**
* Returns all user-defined metadata, standard HTTP properties, and system properties for the blob.
* It does not return the content of the blob.
*
* @this {BlobService}
* @param {string}             container                                   The container name.
* @param {string}             blob                                        The blob name.
* @param {object|function}    [optionsOrCallback]                         The blob and request options.
* @param {string}             [optionsOrCallback.snapshotId]              The snapshot identifier.
* @param {string}             [optionsOrCallback.leaseId]                 The lease identifier.
* @param {object}             [optionsOrCallback.accessConditions]        The access conditions. See http://msdn.microsoft.com/en-us/library/dd179371.aspx for more information.
* @param {int}                [optionsOrCallback.timeoutIntervalInMs]     The timeout interval, in milliseconds, to use for the request.
* @param {function(error, blob, response)}  callback                      The callback function.
* @return {undefined}
*/
BlobService.prototype.getBlobProperties = function (container, blob, optionsOrCallback, callback) {
  var options = null;
  if (typeof optionsOrCallback === 'function' && !callback) {
    callback = optionsOrCallback;
  } else {
    options = optionsOrCallback;
  }

  validateContainerName(container);
  validateBlobName(container, blob);
  validateCallback(callback);

  var resourceName = createResourceName(container, blob);
  var webResource = WebResource.head(resourceName)
    .withProperty(BlobConstants.ResourceTypeProperty, BlobConstants.ResourceTypes.BLOB)
    .withProperty(BlobConstants.SharedAccessPermissionProperty, BlobConstants.SharedAccessPermissions.READ);

  if (options && options.snapshotId) {
    webResource.addOptionalQueryParam(QueryStringConstants.SNAPSHOT, options.snapshotId);
  }

  this._setHeadersFromBlob(webResource, options);

  var self = this;
  var processResponseCallback = function (responseObject, next) {
    responseObject.blobResult = null;
    if (!responseObject.error) {
      responseObject.blobResult = new BlobResult(container, blob);
      responseObject.blobResult.metadata = self.parseMetadataHeaders(responseObject.response.headers);
      responseObject.blobResult.getPropertiesFromHeaders(responseObject.response.headers);
    }

    var finalCallback = function (returnObject) {
      callback(returnObject.error, returnObject.blobResult, returnObject.response);
    };

    next(responseObject, finalCallback);
  };

  this.performRequest(webResource, null, options, processResponseCallback);
};

/**
* Returns all user-defined metadata for the specified blob or snapshot.
*
* @this {BlobService}
* @param {string}             container                                   The container name.
* @param {string}             blob                                        The blob name.
* @param {object|function}    [optionsOrCallback]                         The blob and request options.
* @param {string}             [optionsOrCallback.snapshotId]              The snapshot identifier.
* @param {string}             [optionsOrCallback.leaseId]                 The lease identifier.
* @param {object}             [optionsOrCallback.accessConditions]        The access conditions. See http://msdn.microsoft.com/en-us/library/dd179371.aspx for more information.
* @param {int}                [optionsOrCallback.timeoutIntervalInMs]     The timeout interval, in milliseconds, to use for the request.
* @param {function(error, blob, response)}  callback                      The callback function.
* @return {undefined}
*/
BlobService.prototype.getBlobMetadata = function (container, blob, optionsOrCallback, callback) {
  var options = null;
  if (typeof optionsOrCallback === 'function' && !callback) {
    callback = optionsOrCallback;
  } else {
    options = optionsOrCallback;
  }

  validateContainerName(container);
  validateBlobName(container, blob);
  validateCallback(callback);

  var resourceName = createResourceName(container, blob);
  var webResource = WebResource.head(resourceName)
    .withOkCode(HttpConstants.HttpResponseCodes.OK_CODE)
    .withProperty(BlobConstants.ResourceTypeProperty, BlobConstants.ResourceTypes.BLOB)
    .withProperty(BlobConstants.SharedAccessPermissionProperty, BlobConstants.SharedAccessPermissions.READ);

  webResource.addOptionalQueryParam(QueryStringConstants.COMP, 'metadata');
  if (options && options.snapshotId) {
    webResource.addOptionalQueryParam(QueryStringConstants.SNAPSHOT, options.snapshotId);
  }

  this._setHeadersFromBlob(webResource, options);

  var self = this;
  var processResponseCallback = function (responseObject, next) {
    responseObject.blobResult = null;
    if (!responseObject.error) {
      responseObject.blobResult = new BlobResult(container, blob);
      responseObject.blobResult.metadata = self.parseMetadataHeaders(responseObject.response.headers);
      responseObject.blobResult.getPropertiesFromHeaders(responseObject.response.headers);
    }

    var finalCallback = function (returnObject) {
      callback(returnObject.error, returnObject.blobResult, returnObject.response);
    };

    next(responseObject, finalCallback);
  };

  this.performRequest(webResource, null, options, processResponseCallback);
};

/**
* Returns all user-defined metadata, standard HTTP properties, and system properties for the blob.
* It does not return the content of the blob.
*
* @this {BlobService}
* @param {string}             container                                   The container name.
* @param {string}             blob                                        The blob name.
* @param {object|function}    [optionsOrCallback]                         The blob and request options.
* @param {string}             [optionsOrCallback.leaseId]                 The lease identifier.
* @param {string}             [optionsOrCallback.contentTypeHeader]       The blob’s content type. (x-ms-blob-content-type)
* @param {string}             [optionsOrCallback.contentEncodingHeader]   The blob’s content encoding. (x-ms-blob-content-encoding)
* @param {string}             [optionsOrCallback.contentLanguageHeader]   The blob's content language. (x-ms-blob-content-language)
* @param {string}             [optionsOrCallback.contentMD5Header]        The blob’s MD5 hash. (x-ms-blob-content-md5)
* @param {string}             [optionsOrCallback.cacheControlHeader]      The blob's cache control. (x-ms-blob-cache-control)
* @param {int}                [optionsOrCallback.timeoutIntervalInMs]     The timeout interval, in milliseconds, to use for the request.
* @param {object}             [optionsOrCallback.accessConditions]        The access conditions. See http://msdn.microsoft.com/en-us/library/dd179371.aspx for more information.
* @param {function(error, blob, response)}  callback                      The callback function.
* @return {undefined}
*/
BlobService.prototype.setBlobProperties = function (container, blob, optionsOrCallback, callback) {
  var options = null;
  if (typeof optionsOrCallback === 'function' && !callback) {
    callback = optionsOrCallback;
  } else {
    options = optionsOrCallback;
  }

  validateContainerName(container);
  validateBlobName(container, blob);
  validateCallback(callback);

  var resourceName = createResourceName(container, blob);
  var webResource = WebResource.put(resourceName).withOkCode(HttpConstants.HttpResponseCodes.OK_CODE)
    .withProperty(BlobConstants.ResourceTypeProperty, BlobConstants.ResourceTypes.BLOB)
    .withProperty(BlobConstants.SharedAccessPermissionProperty, BlobConstants.SharedAccessPermissions.WRITE);

  webResource.addOptionalQueryParam(QueryStringConstants.COMP, 'properties');

  this._setHeadersFromBlob(webResource, options);

  var processResponseCallback = function (responseObject, next) {
    responseObject.blobResult = null;
    if (!responseObject.error) {
      responseObject.blobResult = new BlobResult(container, blob);
      responseObject.blobResult.getPropertiesFromHeaders(responseObject.response.headers);
    }

    var finalCallback = function (returnObject) {
      callback(returnObject.error, returnObject.blobResult, returnObject.response);
    };

    next(responseObject, finalCallback);
  };

  this.performRequest(webResource, null, options, processResponseCallback);
};

/**
* Sets user-defined metadata for the specified blob as one or more name-value pairs.
*
* @this {BlobService}
* @param {string}             container                                   The container name.
* @param {string}             blob                                        The blob name.
* @param {object}             metadata                                    The metadata key/value pairs.
* @param {object|function}    [optionsOrCallback]                         The blob and request options.
* @param {string}             [optionsOrCallback.snapshotId]              The snapshot identifier.
* @param {string}             [optionsOrCallback.leaseId]                 The lease identifier.
* @param {object}             [optionsOrCallback.accessConditions]        The access conditions. See http://msdn.microsoft.com/en-us/library/dd179371.aspx for more information.
* @param {int}                [optionsOrCallback.timeoutIntervalInMs]     The timeout interval, in milliseconds, to use for the request.
* @param {function(error, blob, response)}  callback                      The callback function.
* @return {undefined}
*/
BlobService.prototype.setBlobMetadata = function (container, blob, metadata, optionsOrCallback, callback) {
  var options = {};
  if (typeof optionsOrCallback === 'function' && !callback) {
    callback = optionsOrCallback;
  } else {
    options = optionsOrCallback;
  }

  validateContainerName(container);
  validateBlobName(container, blob);
  validateCallback(callback);

  var resourceName = createResourceName(container, blob);
  var webResource = WebResource.put(resourceName)
    .withOkCode(HttpConstants.HttpResponseCodes.OK_CODE)
    .withProperty(BlobConstants.ResourceTypeProperty, BlobConstants.ResourceTypes.BLOB)
    .withProperty(BlobConstants.SharedAccessPermissionProperty, BlobConstants.SharedAccessPermissions.WRITE);

  webResource.addOptionalQueryParam(QueryStringConstants.COMP, 'metadata');

  if (options && options.snapshotId) {
    webResource.addOptionalQueryParam(QueryStringConstants.SNAPSHOT, options.snapshotId);
  }

  webResource.addOptionalMetadataHeaders(metadata);
  this._setHeadersFromBlob(webResource, options);

  var processResponseCallback = function (responseObject, next) {
    responseObject.blobResult = null;
    if (!responseObject.error) {
      responseObject.blobResult = new BlobResult(container, blob);
      responseObject.blobResult.getPropertiesFromHeaders(responseObject.response.headers);
    }

    var finalCallback = function (returnObject) {
      callback(returnObject.error, returnObject.blobResult, returnObject.response);
    };

    next(responseObject, finalCallback);
  };

  this.performRequest(webResource, null, options, processResponseCallback);
};

/**
* Downloads a blob into a file.
*
* @this {BlobService}
* @param {string}             container                                   The container name.
* @param {string}             blob                                        The blob name.
* @param {string}             localFileName                               The local path to the file to be downloaded.
* @param {object|function}    [optionsOrCallback]                         The blob and request options.
* @param {string}             [optionsOrCallback.snapshotId]              The snapshot identifier.
* @param {string}             [optionsOrCallback.leaseId]                 The lease identifier.
* @param {string}             [optionsOrCallback.blobType]                The type of blob to create: block blob or page blob.
* @param {string}             [optionsOrCallback.contentType]             The MIME content type of the blob. The default type is application/octet-stream.
* @param {string}             [optionsOrCallback.contentEncoding]         The content encodings that have been applied to the blob.
* @param {string}             [optionsOrCallback.contentLanguage]         The natural languages used by this resource.
* @param {string}             [optionsOrCallback.contentMD5]              The MD5 hash of the blob content.
* @param {string}             [optionsOrCallback.cacheControl]            The Blob service stores this value but does not use or modify it.
* @param {string}             [optionsOrCallback.rangeStart]              Return only the bytes of the blob in the specified range.
* @param {string}             [optionsOrCallback.rangeEnd]                Return only the bytes of the blob in the specified range.
* @param {string}             [optionsOrCallback.contentTypeHeader]       The blob’s content type. (x-ms-blob-content-type)
* @param {string}             [optionsOrCallback.contentEncodingHeader]   The blob’s content encoding. (x-ms-blob-content-encoding)
* @param {string}             [optionsOrCallback.contentLanguageHeader]   The blob's content language. (x-ms-blob-content-language)
* @param {string}             [optionsOrCallback.contentMD5Header]        The blob’s MD5 hash. (x-ms-blob-content-md5)
* @param {string}             [optionsOrCallback.rangeStartHeader]        Return only the bytes of the blob in the specified range. If both Range and x-ms-range are specified, the service uses the value of x-ms-range.
* @param {string}             [optionsOrCallback.rangeEndHeader]          Return only the bytes of the blob in the specified range. If both Range and x-ms-range are specified, the service uses the value of x-ms-range.
* @param {string}             [optionsOrCallback.rangeGetContentMd5]      When this header is set to true and specified together with the Range header, the service returns the MD5 hash for the range, as long as the range is less than or equal to 4 MB in size.
* @param {string}             [optionsOrCallback.cacheControlHeader]      The blob's cache control. (x-ms-blob-cache-control)
* @param {object}             [optionsOrCallback.accessConditions]        The access conditions. See http://msdn.microsoft.com/en-us/library/dd179371.aspx for more information.
* @param {int}                [optionsOrCallback.timeoutIntervalInMs]     The timeout interval, in milliseconds, to use for the request.
* @param {function(error, blockBlob, response)}  callback                 The callback function.
* @return {undefined}
*/
BlobService.prototype.getBlobToFile = function (container, blob, localFilename, optionsOrCallback, callback) {
  var options = null;
  if (typeof optionsOrCallback === 'function' && !callback) {
    callback = optionsOrCallback;
  } else {
    options = optionsOrCallback;
  }

  validateContainerName(container);
  validateBlobName(container, blob);
  validateCallback(callback);

  if (!localFilename) {
    throw new Error(BlobService.incorrectFilenameErr);
  }

  var writeStream = fs.createWriteStream(localFilename);

  this.getBlobToStream(container, blob, writeStream, options, function (error, responseBlob, response) {
    if (error) {
      if (azureutil.pathExistsSync(localFilename)) {
        // make sure writeStream is closed / destroyed to avoid locking issues
        if (writeStream.close) {
          writeStream.close();
        }

        // If the download failed from the beginning, remove the file.
        fs.unlink(localFilename, function () {
          callback(error, responseBlob, response);
        });

        return;
      }
    }

    callback(error, responseBlob, response);
  });
};

/**
* Downloads a blob into a stream.
*
* @this {BlobService}
* @param {string}             container                                   The container name.
* @param {string}             blob                                        The blob name.
* @param {Stream}             writeStream                                 The write stream.
* @param {object|function}    [optionsOrCallback]                         The blob and request options.
* @param {string}             [optionsOrCallback.snapshotId]              The snapshot identifier.
* @param {string}             [optionsOrCallback.leaseId]                 The lease identifier.
* @param {string}             [optionsOrCallback.blobType]                The type of blob to create: block blob or page blob.
* @param {string}             [optionsOrCallback.contentType]             The MIME content type of the blob. The default type is application/octet-stream.
* @param {string}             [optionsOrCallback.contentEncoding]         The content encodings that have been applied to the blob.
* @param {string}             [optionsOrCallback.contentLanguage]         The natural languages used by this resource.
* @param {string}             [optionsOrCallback.contentMD5]              The MD5 hash of the blob content.
* @param {string}             [optionsOrCallback.cacheControl]            The Blob service stores this value but does not use or modify it.
* @param {string}             [optionsOrCallback.rangeStart]              Return only the bytes of the blob in the specified range.
* @param {string}             [optionsOrCallback.rangeEnd]                Return only the bytes of the blob in the specified range.
* @param {string}             [optionsOrCallback.contentTypeHeader]       The blob’s content type. (x-ms-blob-content-type)
* @param {string}             [optionsOrCallback.contentEncodingHeader]   The blob’s content encoding. (x-ms-blob-content-encoding)
* @param {string}             [optionsOrCallback.contentLanguageHeader]   The blob's content language. (x-ms-blob-content-language)
* @param {string}             [optionsOrCallback.contentMD5Header]        The blob’s MD5 hash. (x-ms-blob-content-md5)
* @param {string}             [optionsOrCallback.rangeStartHeader]        Return only the bytes of the blob in the specified range. If both Range and x-ms-range are specified, the service uses the value of x-ms-range.
* @param {string}             [optionsOrCallback.rangeEndHeader]          Return only the bytes of the blob in the specified range. If both Range and x-ms-range are specified, the service uses the value of x-ms-range.
* @param {string}             [optionsOrCallback.rangeGetContentMd5]      When this header is set to true and specified together with the Range header, the service returns the MD5 hash for the range, as long as the range is less than or equal to 4 MB in size.
* @param {string}             [optionsOrCallback.cacheControlHeader]      The blob's cache control. (x-ms-blob-cache-control)
* @param {object}             [optionsOrCallback.accessConditions]        The access conditions. See http://msdn.microsoft.com/en-us/library/dd179371.aspx for more information.
* @param {int}                [optionsOrCallback.timeoutIntervalInMs]     The timeout interval, in milliseconds, to use for the request.
* @param {function(error, blockBlob, response)}  callback                 The callback function.
* @return {undefined}
*/
BlobService.prototype.getBlobToStream = function (container, blob, writeStream, optionsOrCallback, callback) {
  var options = null;
  if (typeof optionsOrCallback === 'function' && !callback) {
    callback = optionsOrCallback;
  } else {
    options = optionsOrCallback;
  }

  validateContainerName(container);
  validateBlobName(container, blob);
  validateCallback(callback);

  var resourceName = createResourceName(container, blob);
  var webResource = WebResource.get(resourceName)
    .withOkCode(HttpConstants.HttpResponseCodes.PARTIAL_CONTENT, true)
    .withProperty(BlobConstants.ResourceTypeProperty, BlobConstants.ResourceTypes.BLOB)
    .withProperty(BlobConstants.SharedAccessPermissionProperty, BlobConstants.SharedAccessPermissions.READ)
    .withRawResponse();

  if (options && options.snapshotId) {
    webResource.addOptionalQueryParam(QueryStringConstants.SNAPSHOT, options.snapshotId);
  }

  this._setHeadersFromBlob(webResource, options);

  var self = this;
  var processResponseCallback = function (responseObject, next) {
    responseObject.blobResult = null;

    if (!responseObject.error) {
      responseObject.blobResult = new BlobResult(container, blob);
      responseObject.blobResult.metadata = self.parseMetadataHeaders(responseObject.response.headers);
      responseObject.blobResult.getPropertiesFromHeaders(responseObject.response.headers);
    }

    var finalCallback = function (returnObject) {
      callback(returnObject.error, returnObject.blobResult, returnObject.response);
    };

    next(responseObject, finalCallback);
  };

  this.performRequestInputStream(webResource, null, writeStream, options, processResponseCallback);
};

/**
* Downloads a blob into a text string.
*
* @this {BlobService}
* @param {string}             container                                   The container name.
* @param {string}             blob                                        The blob name.
* @param {object|function}    [optionsOrCallback]                         The blob and request options.
* @param {string}             [optionsOrCallback.snapshotId]              The snapshot identifier.
* @param {string}             [optionsOrCallback.leaseId]                 The lease identifier.
* @param {string}             [optionsOrCallback.blobType]                The type of blob to create: block blob or page blob.
* @param {string}             [optionsOrCallback.contentType]             The MIME content type of the blob. The default type is application/octet-stream.
* @param {string}             [optionsOrCallback.contentEncoding]         The content encodings that have been applied to the blob.
* @param {string}             [optionsOrCallback.contentLanguage]         The natural languages used by this resource.
* @param {string}             [optionsOrCallback.contentMD5]              The MD5 hash of the blob content.
* @param {string}             [optionsOrCallback.cacheControl]            The Blob service stores this value but does not use or modify it.
* @param {string}             [optionsOrCallback.rangeStart]              Return only the bytes of the blob in the specified range.
* @param {string}             [optionsOrCallback.rangeEnd]                Return only the bytes of the blob in the specified range.
* @param {string}             [optionsOrCallback.contentTypeHeader]       The blob’s content type. (x-ms-blob-content-type)
* @param {string}             [optionsOrCallback.contentEncodingHeader]   The blob’s content encoding. (x-ms-blob-content-encoding)
* @param {string}             [optionsOrCallback.contentLanguageHeader]   The blob's content language. (x-ms-blob-content-language)
* @param {string}             [optionsOrCallback.contentMD5Header]        The blob’s MD5 hash. (x-ms-blob-content-md5)
* @param {string}             [optionsOrCallback.rangeStartHeader]        Return only the bytes of the blob in the specified range. If both Range and x-ms-range are specified, the service uses the value of x-ms-range.
* @param {string}             [optionsOrCallback.rangeEndHeader]          Return only the bytes of the blob in the specified range. If both Range and x-ms-range are specified, the service uses the value of x-ms-range.
* @param {string}             [optionsOrCallback.rangeGetContentMd5]      When this header is set to true and specified together with the Range header, the service returns the MD5 hash for the range, as long as the range is less than or equal to 4 MB in size.
* @param {string}             [optionsOrCallback.cacheControlHeader]      The blob's cache control. (x-ms-blob-cache-control)
* @param {object}             [optionsOrCallback.accessConditions]        The access conditions. See http://msdn.microsoft.com/en-us/library/dd179371.aspx for more information.
* @param {int}                [optionsOrCallback.timeoutIntervalInMs]     The timeout interval, in milliseconds, to use for the request.
* @param {function(error, text, blockBlob, response)}  callback           The callback function.
* @return {undefined}
*/
BlobService.prototype.getBlobToText = function (container, blob, optionsOrCallback, callback) {
  var options = null;
  if (typeof optionsOrCallback === 'function' && !callback) {
    callback = optionsOrCallback;
  } else {
    options = optionsOrCallback;
  }

  validateContainerName(container);
  validateBlobName(container, blob);
  validateCallback(callback);

  var resourceName = createResourceName(container, blob);
  var webResource = WebResource.get(resourceName)
    .withOkCode(HttpConstants.HttpResponseCodes.PARTIAL_CONTENT, true)
    .withProperty(BlobConstants.ResourceTypeProperty, BlobConstants.ResourceTypes.BLOB)
    .withProperty(BlobConstants.SharedAccessPermissionProperty, BlobConstants.SharedAccessPermissions.READ)
    .withRawResponse();

  if (options && options.snapshotId) {
    webResource.addOptionalQueryParam(QueryStringConstants.SNAPSHOT, options.snapshotId);
  }

  this._setHeadersFromBlob(webResource, options);

  var processResponseCallback = function (responseObject, next) {
    responseObject.text = null;
    responseObject.blobResult = null;

    if (!responseObject.error) {
      responseObject.blobResult = new BlobResult(container, blob);
      responseObject.blobResult.getPropertiesFromHeaders(responseObject.response.headers);
      responseObject.text = responseObject.response.body;
    }

    var finalCallback = function (returnObject) {
      callback(returnObject.error, returnObject.text, returnObject.blobResult, returnObject.response);
    };

    next(responseObject, finalCallback);
  };

  this.performRequest(webResource, null, options, processResponseCallback);
};

/**
* Marks the specified blob or snapshot for deletion. The blob is later deleted during garbage collection.
* In order to delete a blob, you must delete all of its snapshots. You can delete both at the same time with the Delete Blob operation.
*
* @this {BlobService}
* @param {string}             container                                   The container name.
* @param {string}             blob                                        The blob name.
* @param {object|function}    [optionsOrCallback]                         The blob and request options.
* @param {string}             [optionsOrCallback.snapshotId]              The snapshot identifier.
* @param {string}             [optionsOrCallback.leaseId]                 The lease identifier.
* @param {object}             [optionsOrCallback.accessConditions]        The access conditions. See http://msdn.microsoft.com/en-us/library/dd179371.aspx for more information.
* @param {int}                [optionsOrCallback.timeoutIntervalInMs]     The timeout interval, in milliseconds, to use for the request.
* @param {function(error, isSuccessful, response)}  callback              The callback function.
* @return {undefined}
*/
BlobService.prototype.deleteBlob = function (container, blob, optionsOrCallback, callback) {
  var options = null;
  if (typeof optionsOrCallback === 'function' && !callback) {
    callback = optionsOrCallback;
  } else {
    options = optionsOrCallback;
  }

  validateContainerName(container);
  validateBlobName(container, blob);
  validateCallback(callback);

  var resourceName = createResourceName(container, blob);
  var webResource = WebResource.del(resourceName)
    .withOkCode(HttpConstants.HttpResponseCodes.ACCEPTED_CODE)
    .withProperty(BlobConstants.ResourceTypeProperty, BlobConstants.ResourceTypes.BLOB)
    .withProperty(BlobConstants.SharedAccessPermissionProperty, BlobConstants.SharedAccessPermissions.WRITE);

  if (options && options.snapshotId) {
    webResource.addOptionalQueryParam(QueryStringConstants.SNAPSHOT, options.snapshotId);
  }

  this._setHeadersFromBlob(webResource, options);

  var processResponseCallback = function (responseObject, next) {
    var finalCallback = function (returnObject) {
      callback(returnObject.error, returnObject.response && returnObject.response.isSuccessful, returnObject.response);
    };

    next(responseObject, finalCallback);
  };

  this.performRequest(webResource, null, options, processResponseCallback);
};

/**
* Creates a read-only snapshot of a blob.
*
* @this {BlobService}
* @param {string}             container                                   The container name.
* @param {string}             blob                                        The blob name.
* @param {object|function}    [optionsOrCallback]                         The blob and request options.
* @param {string}             [optionsOrCallback.snapshotId]              The snapshot identifier.
* @param {object}             [optionsOrCallback.metadata]                The metadata key/value pairs.
* @param {string}             [optionsOrCallback.leaseId]                 The lease identifier.
* @param {object}             [optionsOrCallback.accessConditions]        The access conditions. See http://msdn.microsoft.com/en-us/library/dd179371.aspx for more information.
* @param {int}                [optionsOrCallback.timeoutIntervalInMs]     The timeout interval, in milliseconds, to use for the request.
* @param {function(error, snapshotId, response)}  callback                The callback function.
* @return {undefined}
*/
BlobService.prototype.createBlobSnapshot = function (container, blob, optionsOrCallback, callback) {
  var options = null;
  if (typeof optionsOrCallback === 'function' && !callback) {
    callback = optionsOrCallback;
  } else {
    options = optionsOrCallback;
  }

  validateContainerName(container);
  validateBlobName(container, blob);
  validateCallback(callback);

  var resourceName = createResourceName(container, blob);
  var webResource = WebResource.put(resourceName)
    .withProperty(BlobConstants.ResourceTypeProperty, BlobConstants.ResourceTypes.BLOB)
    .withProperty(BlobConstants.SharedAccessPermissionProperty, BlobConstants.SharedAccessPermissions.WRITE);

  webResource.addOptionalQueryParam(QueryStringConstants.COMP, 'snapshot');
  this._setHeadersFromBlob(webResource, options);

  var processResponseCallback = function (responseObject, next) {
    responseObject.snapshotId = null;
    if (!responseObject.error) {
      responseObject.snapshotId = responseObject.response.headers[HeaderConstants.SNAPSHOT_HEADER];
    }

    var finalCallback = function (returnObject) {
      callback(returnObject.error, returnObject.snapshotId, returnObject.response);
    };

    next(responseObject, finalCallback);
  };

  this.performRequest(webResource, null, options, processResponseCallback);
};

/**
* Copies a blob to a destination within the storage account. The Copy Blob operation copies the entire committed blob.
*
* @this {BlobService}
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
* @param {object}             [optionsOrCallback.sourceAccessConditions]        The access conditions. See http://msdn.microsoft.com/en-us/library/dd179371.aspx for more information.
* @param {int}                [optionsOrCallback.timeoutIntervalInMs]     The timeout interval, in milliseconds, to use for the request.
* @param {function(error, blob, response)}  callback                      The callback function.
* @return {undefined}
*/
BlobService.prototype.copyBlob = function (sourceContainer, sourceBlob, targetContainer, targetBlob, optionsOrCallback, callback) {
  var options = null;
  if (typeof optionsOrCallback === 'function' && !callback) {
    callback = optionsOrCallback;
  } else {
    options = optionsOrCallback;
  }

  validateContainerName(sourceContainer);
  validateContainerName(targetContainer);
  validateBlobName(sourceContainer, sourceBlob);
  validateBlobName(targetContainer, targetBlob);
  validateCallback(callback);

  var sourceResourceName = createResourceName(sourceContainer, sourceBlob);

  if (options && options.snapshotId) {
    sourceResourceName += '?snapshot=' + options.snapshotId;
  }

  var targetResourceName = createResourceName(targetContainer, targetBlob);

  var webResource = WebResource.put(targetResourceName)
    .withProperty(BlobConstants.ResourceTypeProperty, BlobConstants.ResourceTypes.BLOB)
    .withProperty(BlobConstants.SharedAccessPermissionProperty, BlobConstants.SharedAccessPermissions.WRITE);

  if (options) {
    webResource.addOptionalHeader(HeaderConstants.LEASE_ID_HEADER, options.leaseId);
    webResource.addOptionalHeader(HeaderConstants.SOURCE_LEASE_ID_HEADER, options.leaseId);
    webResource.addOptionalMetadataHeaders(options.metadata);
  }

  webResource.addOptionalHeader(HeaderConstants.COPY_SOURCE_HEADER, '/' + this.storageAccount + '/' + sourceResourceName);

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
      callback(returnObject.error, returnObject.blobResult, returnObject.response);
    };

    next(responseObject, finalCallback);
  };

  this.performRequest(webResource, null, options, processResponseCallback);
};

/**
* Acquires a new lease on the blob.
*
* @this {BlobService}
* @param {string}             container                                   The container name.
* @param {string}             blob                                        The blob name.
* @param {object|function}    [optionsOrCallback]                         The blob and request options.
* @param {object}             [optionsOrCallback.accessConditions]        The access conditions. See http://msdn.microsoft.com/en-us/library/dd179371.aspx for more information.
* @param {int}                [optionsOrCallback.timeoutIntervalInMs]     The timeout interval, in milliseconds, to use for the request.
* @param {function(error, lease, response)}  callback                     The callback function.
* @return {undefined}
*/
BlobService.prototype.acquireLease = function (container, blob, optionsOrCallback, callback) {
  var options = null;
  if (typeof optionsOrCallback === 'function' && !callback) {
    callback = optionsOrCallback;
  } else {
    options = optionsOrCallback;
  }

  this._leaseBlobImpl(container, blob, null /* leaseId */, Constants.BlobConstants.LeaseOperation.ACQUIRE, options, callback);
};

/**
* Renews an existing lease.
*
* @this {BlobService}
* @param {string}             container                                   The container name.
* @param {string}             blob                                        The blob name.
* @param {string}             leaseId                                     The lease identifier.
* @param {object|function}    [optionsOrCallback]                         The blob and request options.
* @param {object}             [optionsOrCallback.accessConditions]        The access conditions. See http://msdn.microsoft.com/en-us/library/dd179371.aspx for more information.
* @param {int}                [optionsOrCallback.timeoutIntervalInMs]     The timeout interval, in milliseconds, to use for the request.
* @param {function(error, lease, response)}  callback                     The callback function.
* @return {undefined}
*/
BlobService.prototype.renewLease = function(container, blob, leaseId, optionsOrCallback, callback) {
  var options = null;
  if (typeof optionsOrCallback === 'function' && !callback) {
    callback = optionsOrCallback;
  } else {
    options = optionsOrCallback;
  }

  this._leaseBlobImpl(container, blob, leaseId, Constants.BlobConstants.LeaseOperation.RENEW, options, callback);
};

/**
* Releases the lease on the blob.
*
* @this {BlobService}
* @param {string}             container                                   The container name.
* @param {string}             blob                                        The blob name.
* @param {string}             leaseId                                     The lease identifier.
* @param {object|function}    [optionsOrCallback]                         The blob and request options.
* @param {object}             [optionsOrCallback.accessConditions]        The access conditions. See http://msdn.microsoft.com/en-us/library/dd179371.aspx for more information.
* @param {int}                [optionsOrCallback.timeoutIntervalInMs]     The timeout interval, in milliseconds, to use for the request.
* @param {function(error, lease, response)}  callback                     The callback function.
* @return {undefined}
*/
BlobService.prototype.releaseLease = function (container, blob, leaseId, optionsOrCallback, callback) {
  var options = null;
  if (typeof optionsOrCallback === 'function' && !callback) {
    callback = optionsOrCallback;
  } else {
    options = optionsOrCallback;
  }

  this._leaseBlobImpl(container, blob, leaseId, Constants.BlobConstants.LeaseOperation.RELEASE, options, callback);
};

/**
* Breaks the lease but ensures that another client cannot acquire a new lease until the current lease period has expired.
*
* @this {BlobService}
* @param {string}             container                                   The container name.
* @param {string}             blob                                        The blob name.
* @param {string}             leaseId                                     The lease identifier.
* @param {object|function}    [optionsOrCallback]                         The blob and request options.
* @param {object}             [optionsOrCallback.accessConditions]        The access conditions. See http://msdn.microsoft.com/en-us/library/dd179371.aspx for more information.
* @param {int}                [optionsOrCallback.timeoutIntervalInMs]     The timeout interval, in milliseconds, to use for the request.
* @param {function(error, lease, response)}  callback                     The callback function.
* @return {undefined}
*/
BlobService.prototype.breakLease = function(container, blob, leaseId, optionsOrCallback, callback) {
  var options = null;
  if (typeof optionsOrCallback === 'function' && !callback) {
    callback = optionsOrCallback;
  } else {
    options = optionsOrCallback;
  }

  this._leaseBlobImpl(container, blob, leaseId, Constants.BlobConstants.LeaseOperation.BREAK, options, callback);
};

/**
* Clears a page blob.
*
* @this {BlobService}
* @param {string}             container                                   The container name.
* @param {string}             blob                                        The blob name.
* @param {string}             text                                        The text string.
* @param {int}                rangeStart                                  The range start.
* @param {int}                rangeEnd                                    The range end.
* @param {object|function}    [optionsOrCallback]                         The page blob and request options.
* @param {string}             [optionsOrCallback.leaseId]                 The target blob lease identifier.
* @param {object}             [optionsOrCallback.accessConditions]        The access conditions. See http://msdn.microsoft.com/en-us/library/dd179371.aspx for more information.
* @param {int}                [optionsOrCallback.timeoutIntervalInMs]     The timeout interval, in milliseconds, to use for the request.
* @param {function(error, response)}  callback                            The callback function.
* @return {undefined}
*/
BlobService.prototype.clearBlobPages = function (container, blob, rangeStart, rangeEnd, optionsOrCallback, callback) {
  var options = null;
  if (typeof optionsOrCallback === 'function' && !callback) {
    callback = optionsOrCallback;
  } else {
    options = optionsOrCallback;
  }

  validateCallback(callback);

  var request = this._updatePageBlobPagesImpl(container, blob, 0, rangeStart, rangeEnd, BlobConstants.PageWriteOptions.CLEAR, options);

  var self = this;
  var processResponseCallback = function (responseObject, next) {
    var finalCallback = function (returnObject) {
      callback(returnObject.error, returnObject.response);
    };

    next(responseObject, finalCallback);
  };

  self.performRequest(request, null, options, processResponseCallback);
};

/**
* Updates a page blob from a stream.
*
* @this {BlobService}
* @param {string}             container                                   The container name.
* @param {string}             blob                                        The blob name.
* @param {Stream}             readStream                                  The read stream.
* @param {int}                rangeStart                                  The range start.
* @param {int}                rangeEnd                                    The range end.
* @param {object|function}    [optionsOrCallback]                         The page blob and request options.
* @param {string}             [optionsOrCallback.leaseId]                 The target blob lease identifier.
* @param {object}             [optionsOrCallback.accessConditions]        The access conditions. See http://msdn.microsoft.com/en-us/library/dd179371.aspx for more information.
* @param {int}                [optionsOrCallback.timeoutIntervalInMs]     The timeout interval, in milliseconds, to use for the request.
* @param {function(error, pageBlob, response)}  callback                  The callback function.
* @return {undefined}
*/
BlobService.prototype.createBlobPagesFromStream = function (container, blob, readStream, rangeStart, rangeEnd, optionsOrCallback, callback) {
  var options = null;
  if (typeof optionsOrCallback === 'function' && !callback) {
    callback = optionsOrCallback;
  } else {
    options = optionsOrCallback;
  }

  validateCallback(callback);

  var webResource = this._updatePageBlobPagesImpl(container, blob,
    (rangeEnd - rangeStart) + 1, rangeStart, rangeEnd, 
    BlobConstants.PageWriteOptions.UPDATE, options);

  var self = this;
  var processResponseCallback = function (responseObject, next) {
    responseObject.blobResult = null;
    if (!responseObject.error) {
      responseObject.blobResult = new BlobResult(container, blob);
      responseObject.blobResult.getPropertiesFromHeaders(responseObject.response.headers);
    }

    var finalCallback = function (returnObject) {
      callback(returnObject.error, returnObject.blobResult, returnObject.response);
    };

    next(responseObject, finalCallback);
  };

  self.performRequestOutputStream(webResource, readStream, options, processResponseCallback);
};

/**
* Updates a page blob from text.
*
* @this {BlobService}
* @param {string}             container                                   The container name.
* @param {string}             blob                                        The blob name.
* @param {string}             text                                        The text string.
* @param {int}                rangeStart                                  The range start.
* @param {int}                rangeEnd                                    The range end.
* @param {object|function}    [optionsOrCallback]                         The page blob and request options.
* @param {string}             [optionsOrCallback.leaseId]                 The target blob lease identifier.
* @param {object}             [optionsOrCallback.accessConditions]        The access conditions. See http://msdn.microsoft.com/en-us/library/dd179371.aspx for more information.
* @param {int}                [optionsOrCallback.timeoutIntervalInMs]     The timeout interval, in milliseconds, to use for the request.
* @param {function(error, pageBlob, response)}  callback                  The callback function.
* @return {undefined}
*/
BlobService.prototype.createBlobPagesFromText = function (container, blob, text, rangeStart, rangeEnd, optionsOrCallback, callback) {
  var options = null;
  if (typeof optionsOrCallback === 'function' && !callback) {
    callback = optionsOrCallback;
  } else {
    options = optionsOrCallback;
  }

  validateCallback(callback);

  var request = this._updatePageBlobPagesImpl(container, blob, text.length, rangeStart, rangeEnd, BlobConstants.PageWriteOptions.UPDATE, options);

  var self = this;
  var processResponseCallback = function (responseObject, next) {
    responseObject.blobResult = null;
    if (!responseObject.error) {
      responseObject.blobResult = new BlobResult(container, blob);
      responseObject.blobResult.getPropertiesFromHeaders(responseObject.response.headers);
    }

    var finalCallback = function (returnObject) {
      callback(returnObject.error, returnObject.blobResult, returnObject.response);
    };

    next(responseObject, finalCallback);
  };

  self.performRequest(request, text, options, processResponseCallback);
};

/**
* Lists page blob regions.
*
* @this {BlobService}
* @param {string}             container                                   The container name.
* @param {string}             blob                                        The blob name.
* @param {int}                rangeStart                                  The range start.
* @param {int}                rangeEnd                                    The range end.
* @param {object|function}    [optionsOrCallback]                         The page blob and request options.
* @param {string}             [optionsOrCallback.snapshotId]              The snapshot identifier.
* @param {string}             [optionsOrCallback.leaseId]                 The target blob lease identifier.
* @param {int}                [optionsOrCallback.timeoutIntervalInMs]     The timeout interval, in milliseconds, to use for the request.
* @param {function(error, pageRegions, response)}  callback               The callback function.
* @return {undefined}
*/
BlobService.prototype.listBlobRegions = function (container, blob, rangeStart, rangeEnd, optionsOrCallback, callback) {
  var options = null;
  if (typeof optionsOrCallback === 'function' && !callback) {
    callback = optionsOrCallback;
  } else {
    options = optionsOrCallback;
  }

  validateContainerName(container);
  validateBlobName(container, blob);
  validateCallback(callback);

  if (rangeStart && rangeStart % 512 !== 0) {
    throw new Error(BlobService.incorrectStartByteOffsetErr);
  }

  if (rangeEnd && (rangeEnd + 1) % 512 !== 0) {
    throw new Error(BlobService.incorrectEndByteOffsetErr);
  }

  var resourceName = createResourceName(container, blob);
  var webResource = WebResource.get(resourceName)
    .withProperty(BlobConstants.ResourceTypeProperty, BlobConstants.ResourceTypes.BLOB)
    .withProperty(BlobConstants.SharedAccessPermissionProperty, BlobConstants.SharedAccessPermissions.READ);

  webResource.addOptionalQueryParam(QueryStringConstants.COMP, 'pagelist');
  if (options && options.snapshotId) {
    webResource.addOptionalQueryParam(QueryStringConstants.SNAPSHOT, options.snapshotId);
  }

  if (!options) {
    options = { };
  }

  options.rangeStart = rangeStart;
  options.rangeEnd = rangeEnd;

  this._setHeadersFromBlob(webResource, options);

  var processResponseCallback = function (responseObject, next) {
    responseObject.pageRegions = null;
    if (!responseObject.error) {
      responseObject.pageRegions = [];

      var pageRanges = [];
      if (responseObject.response.body.PageRange) {
        pageRanges = responseObject.response.body.PageRange;
        if (!Array.isArray(pageRanges)) {
          pageRanges = [pageRanges];
        }
      }

      pageRanges.forEach(function (pageRange) {
        var range = {
          start: parseInt(pageRange.Start, 10),
          end: parseInt(pageRange.End, 10)
        };

        responseObject.pageRegions.push(range);
      });
    }

    var finalCallback = function (returnObject) {
      callback(returnObject.error, returnObject.pageRegions, returnObject.response);
    };

    next(responseObject, finalCallback);
  };

  this.performRequest(webResource, null, options, processResponseCallback);
};

/**
* Creates a new block to be committed as part of a blob.
*
* @this {BlobService}
* @param {string}             blockId                                     The block identifier.
* @param {string}             container                                   The container name.
* @param {string}             blob                                        The blob name.
* @param {string}             content                                     The block content.
* @param {object|function}    [optionsOrCallback]                         The blob and request options.
* @param {string}             [optionsOrCallback.leaseId]                 The target blob lease identifier.
* @param {string}             [optionsOrCallback.contentMD5]              The blob’s MD5 hash.
* @param {object}             [optionsOrCallback.accessConditions]        The access conditions. See http://msdn.microsoft.com/en-us/library/dd179371.aspx for more information.
* @param {int}                [optionsOrCallback.timeoutIntervalInMs]     The timeout interval, in milliseconds, to use for the request.
* @param {function(error, response)}  callback                            The callback function.
* @return {undefined}
*/
BlobService.prototype.createBlobBlockFromText = function (blockId, container, blob, content, optionsOrCallback, callback) {
  var options = null;
  if (typeof optionsOrCallback === 'function' && !callback) {
    callback = optionsOrCallback;
  } else {
    options = optionsOrCallback;
  }

  validateContainerName(container);
  validateBlobName(container, blob);
  validateCallback(callback);

  var resourceName = createResourceName(container, blob);
  var webResource = WebResource.put(resourceName)
    .withProperty(BlobConstants.ResourceTypeProperty, BlobConstants.ResourceTypes.BLOB)
    .withProperty(BlobConstants.SharedAccessPermissionProperty, BlobConstants.SharedAccessPermissions.WRITE);

  webResource.addOptionalQueryParam(QueryStringConstants.COMP, 'block');
  webResource.addOptionalQueryParam(QueryStringConstants.BLOCK_ID, new Buffer(blockId).toString('base64'));
  this._setHeadersFromBlob(webResource, options);

  webResource.addOptionalHeader(HeaderConstants.CONTENT_LENGTH, Buffer.byteLength(content));

  var processResponseCallback = function (responseObject, next) {
    var finalCallback = function (returnObject) {
      callback(returnObject.error, returnObject.response);
    };

    next(responseObject, finalCallback);
  };

  this.performRequest(webResource, content, options, processResponseCallback);
};

/**
* Creates a new block to be committed as part of a blob.
*
* @this {BlobService}
* @param {string}             blockId                                     The block identifier.
* @param {string}             container                                   The container name.
* @param {string}             blob                                        The blob name.
* @param {Stream}             readStream                                  The read stream.
* @param {int}                streamLength                                The stream length.
* @param {object|function}    [optionsOrCallback]                         The blob and request options.
* @param {string}             [optionsOrCallback.leaseId]                 The target blob lease identifier.
* @param {string}             [optionsOrCallback.contentMD5]              The blob’s MD5 hash.
* @param {object}             [optionsOrCallback.accessConditions]        The access conditions. See http://msdn.microsoft.com/en-us/library/dd179371.aspx for more information.
* @param {int}                [optionsOrCallback.timeoutIntervalInMs]     The timeout interval, in milliseconds, to use for the request.
* @param {function(error, response)}  callback                            The callback function.
* @return {undefined}
*/
BlobService.prototype.createBlobBlockFromStream = function (blockId, container, blob, readStream, streamLength, optionsOrCallback, callback) {
  var options = null;
  if (typeof optionsOrCallback === 'function' && !callback) {
    callback = optionsOrCallback;
  } else {
    options = optionsOrCallback;
  }

  validateContainerName(container);
  validateBlobName(container, blob);
  validateCallback(callback);

  var resourceName = createResourceName(container, blob);
  var webResource = WebResource.put(resourceName)
    .withProperty(BlobConstants.ResourceTypeProperty, BlobConstants.ResourceTypes.BLOB)
    .withProperty(BlobConstants.SharedAccessPermissionProperty, BlobConstants.SharedAccessPermissions.WRITE);

  webResource.addOptionalQueryParam(QueryStringConstants.COMP, 'block');
  webResource.addOptionalQueryParam(QueryStringConstants.BLOCK_ID, new Buffer(blockId).toString('base64'));
  this._setHeadersFromBlob(webResource, options);

  webResource.addOptionalHeader(HeaderConstants.CONTENT_LENGTH, streamLength);

  var processResponseCallback = function (responseObject, next) {
    var finalCallback = function (returnObject) {
      callback(returnObject.error, returnObject.response);
    };

    next(responseObject, finalCallback);
  };

  this.performRequestOutputStream(webResource, readStream, options, processResponseCallback);
};

/**
* Writes a blob by specifying the list of block IDs that make up the blob. 
* In order to be written as part of a blob, a block must have been successfully written to the server in a prior 
* createBlobBlock operation.
*
* @this {BlobService}
* @param {string}             container                                   The container name.
* @param {string}             blob                                        The blob name.
* @param {object}             blockList                                   The block identifiers.
* @param {object|function}    [optionsOrCallback]                         The blocklist and request options.
* @param {object}             [optionsOrCallback.metadata]                The metadata key/value pairs.
* @param {string}             [optionsOrCallback.leaseId]                 The target blob lease identifier.
* @param {string}             [optionsOrCallback.contentType]             The MIME content type of the blob. The default type is application/octet-stream.
* @param {string}             [optionsOrCallback.contentEncoding]         The content encodings that have been applied to the blob.
* @param {string}             [optionsOrCallback.contentLanguage]         The natural languages used by this resource.
* @param {string}             [optionsOrCallback.contentMD5]              The MD5 hash of the blob content.
* @param {string}             [optionsOrCallback.cacheControl]            The Blob service stores this value but does not use or modify it.
* @param {string}             [optionsOrCallback.contentTypeHeader]       The blob’s content type. (x-ms-blob-content-type)
* @param {string}             [optionsOrCallback.contentEncodingHeader]   The blob’s content encoding. (x-ms-blob-content-encoding)
* @param {string}             [optionsOrCallback.contentLanguageHeader]   The blob's content language. (x-ms-blob-content-language)
* @param {string}             [optionsOrCallback.contentMD5Header]        The blob’s MD5 hash. (x-ms-blob-content-md5)
* @param {string}             [optionsOrCallback.cacheControlHeader]      The blob's cache control. (x-ms-blob-cache-control)
* @param {object}             [optionsOrCallback.accessConditions]        The access conditions. See http://msdn.microsoft.com/en-us/library/dd179371.aspx for more information.
* @param {int}                [optionsOrCallback.timeoutIntervalInMs]     The timeout interval, in milliseconds, to use for the request.
* @param {function(error, blocklist, response)}  callback                 The callback function.
* @return {undefined}
*/
BlobService.prototype.commitBlobBlocks = function (container, blob, blockList, optionsOrCallback, callback) {
  var options = null;
  if (typeof optionsOrCallback === 'function' && !callback) {
    callback = optionsOrCallback;
  } else {
    options = optionsOrCallback;
  }

  validateContainerName(container);
  validateBlobName(container, blob);
  validateCallback(callback);

  var resourceName = createResourceName(container, blob);
  var webResource = WebResource.put(resourceName)
    .withProperty(BlobConstants.ResourceTypeProperty, BlobConstants.ResourceTypes.BLOB)
    .withProperty(BlobConstants.SharedAccessPermissionProperty, BlobConstants.SharedAccessPermissions.WRITE);

  webResource.addOptionalQueryParam(QueryStringConstants.COMP, 'blocklist');

  var blockListXml = BlockListResult.serialize(blockList);
  webResource.addOptionalHeader(HeaderConstants.CONTENT_LENGTH, Buffer.byteLength(blockListXml));
  this._setHeadersFromBlob(webResource, options);

  var processResponseCallback = function (responseObject, next) {
    responseObject.list = null;
    if (!responseObject.error) {
      responseObject.list = blockList;
    }

    var finalCallback = function (returnObject) {
      callback(returnObject.error, returnObject.list, returnObject.response);
    };

    next(responseObject, finalCallback);
  };

  this.performRequest(webResource, blockListXml, options, processResponseCallback);
};

/**
* Retrieves the list of blocks that have been uploaded as part of a block blob.
*
* @this {BlobService}
* @param {string}             container                                   The container name.
* @param {string}             blob                                        The blob name.
* @param {BlockListFilter}    blocklisttype                               The type of block list to retrieve.
* @param {object|function}    [optionsOrCallback]                         The blocklist and request options.
* @param {string}             [optionsOrCallback.snapshotId]              The source blob snapshot identifier.
* @param {string}             [optionsOrCallback.leaseId]                 The target blob lease identifier.
* @param {int}                [optionsOrCallback.timeoutIntervalInMs]     The timeout interval, in milliseconds, to use for the request.
* @param {function(error, blocklist, response)}  callback                 The callback function.
* @return {undefined}
*/
BlobService.prototype.listBlobBlocks = function (container, blob, blocklisttype, optionsOrCallback, callback) {
  var options = null;
  if (typeof optionsOrCallback === 'function' && !callback) {
    callback = optionsOrCallback;
  } else {
    options = optionsOrCallback;
  }

  validateContainerName(container);
  validateBlobName(container, blob);
  validateCallback(callback);

  var resourceName = createResourceName(container, blob);
  var webResource = WebResource.get(resourceName)
    .withProperty(BlobConstants.ResourceTypeProperty, BlobConstants.ResourceTypes.BLOB)
    .withProperty(BlobConstants.SharedAccessPermissionProperty, BlobConstants.SharedAccessPermissions.READ);

  webResource.addOptionalQueryParam(QueryStringConstants.COMP, 'blocklist');
  webResource.addOptionalQueryParam(QueryStringConstants.BLOCK_LIST_TYPE, blocklisttype);

  if (options && options.snapshotId) {
    webResource.addOptionalQueryParam(QueryStringConstants.SNAPSHOT, options.snapshotId);
  }

  this._setHeadersFromBlob(webResource, blob);

  var processResponseCallback = function (responseObject, next) {
    responseObject.blockListResult = null;
    if (!responseObject.error) {
      responseObject.blockListResult = BlockListResult.parse(responseObject.response.body);
    }

    var finalCallback = function (returnObject) {
      callback(returnObject.error, returnObject.blockListResult, returnObject.response);
    };

    next(responseObject, finalCallback);
  };

  this.performRequest(webResource, null, options, processResponseCallback);
};

/**
* Retrieves a shared access URL.
*
* @this {BlobService}
* @param {string}                   container                                     The container name.
* @param {string}                   [blob]                                        The blob name.
* @param {object}                   sharedAccessPolicy                            The shared access policy.
* @param {string}                   [sharedAccessPolicy.Id]                       The signed identifier.
* @param {SharedAccessPermissions}  sharedAccessPolicy.AccessPolicy.Permissions   The permission type.
* @param {date|string}              [sharedAccessPolicy.AccessPolicy.Start]       The time at which the Shared Access Signature becomes valid (The UTC value will be used).
* @param {date|string}              sharedAccessPolicy.AccessPolicy.Expiry        The time at which the Shared Access Signature becomes expired (The UTC value will be used).
* @return {object}                                                                An object with the shared access signature.
*/
BlobService.prototype.generateSharedAccessSignature = function (container, blob, sharedAccessPolicy) {
  // Validate container name. Blob name is optional.
  validateContainerName(container);

  var resourceType = BlobConstants.ResourceTypes.CONTAINER;
  if (blob) {
    resourceType = BlobConstants.ResourceTypes.BLOB;
  }

  if (!azureutil.objectIsNull(sharedAccessPolicy.AccessPolicy.Start)) {
    sharedAccessPolicy.AccessPolicy.Start = ISO8061Date.format(sharedAccessPolicy.AccessPolicy.Start, true);
  }

  if (!azureutil.objectIsNull(sharedAccessPolicy.AccessPolicy.Expiry)) {
    sharedAccessPolicy.AccessPolicy.Expiry = ISO8061Date.format(sharedAccessPolicy.AccessPolicy.Expiry, true);
  }

  var resourceName = createResourceName(container, blob);
  var signedQueryString = this.sharedAccessSignatureCredentials.generateSignedQueryString(resourceName, {}, resourceType, sharedAccessPolicy);

  var baseUrl = this.protocol + this.host + ':' + this.port;
  var path = this._getPath('/' + resourceName);

  return {
    baseUrl: baseUrl,
    path: path,
    queryString: signedQueryString,
    url: function () {
      return baseUrl + path + '?' + qs.stringify(signedQueryString);
    }
  };
};

/**
* Retrieves a blob URL.
*
* @this {BlobService}
* @param {string}                   container                                     The container name.
* @param {string}                   [blob]                                        The blob name.
* @return {object}                                                                An object with the blob URL.
*/
BlobService.prototype.getBlobUrl = function (container, blob) {
  // Validate container name. Blob name is optional.
  validateContainerName(container);

  var resourceName = createResourceName(container, blob);

  var baseUrl = this.protocol + this.host + ':' + this.port;
  var path = this._getPath('/' + resourceName);

  return {
    baseUrl: baseUrl,
    path: path,
    url: function () {
      return baseUrl + path;
    }
  };
};

// Private methods

/**
* Establishes and manages a one-minute lock on a blob for write operations.
*
* @this {BlobService}
* @param {string}             container                                   The container name.
* @param {string}             blob                                        The blob name.
* @param {string}             leaseId                                     The lease identifier.
* @param {string}             leaseAction                                 The lease action (BlobService.LEASE_*).
* @param {object|function}    [optionsOrCallback]                         The blob and request options.
* @param {object}             [optionsOrCallback.accessConditions]        The access conditions. See http://msdn.microsoft.com/en-us/library/dd179371.aspx for more information.
* @param {int}                [optionsOrCallback.timeoutIntervalInMs]     The timeout interval, in milliseconds, to use for the request.
* @param {function(error, lease, response)}  callback                     The callback function.
* @return {undefined}
*/
BlobService.prototype._leaseBlobImpl = function (container, blob, leaseId, leaseAction, optionsOrCallback, callback) {
  var options = null;
  if (typeof optionsOrCallback === 'function' && !callback) {
    callback = optionsOrCallback;
  } else {
    options = optionsOrCallback;
  }

  validateContainerName(container);
  validateBlobName(container, blob);
  validateCallback(callback);

  var expectedResponseCode = null;
  switch (leaseAction) {
    case BlobConstants.LeaseOperation.ACQUIRE:
      // Acquire: A successful operation returns status code 201 (Created).
      expectedResponseCode = HttpConstants.HttpResponseCodes.CREATED_CODE;
      break;
    case BlobConstants.LeaseOperation.RENEW:
      // Renew: A successful operation returns status code 200 (OK).
      expectedResponseCode = HttpConstants.HttpResponseCodes.OK_CODE;
      break;
    case BlobConstants.LeaseOperation.RELEASE:
      // Release: A successful operation returns status code 200 (OK).
      expectedResponseCode = HttpConstants.HttpResponseCodes.OK_CODE;
      break;
    case BlobConstants.LeaseOperation.BREAK:
      // Break: A successful operation returns status code 202 (Accepted).
      expectedResponseCode = HttpConstants.HttpResponseCodes.ACCEPTED_CODE;
      break;
  }

  var resourceName = createResourceName(container, blob);
  var webResource = WebResource.put(resourceName)
    .withOkCode(expectedResponseCode)
    .withProperty(BlobConstants.ResourceTypeProperty, BlobConstants.ResourceTypes.BLOB)
    .withProperty(BlobConstants.SharedAccessPermissionProperty, BlobConstants.SharedAccessPermissions.WRITE);

  webResource.addOptionalQueryParam(QueryStringConstants.COMP, 'lease');
  webResource.addOptionalHeader(HeaderConstants.LEASE_ID_HEADER, leaseId);
  webResource.addOptionalHeader(HeaderConstants.LEASE_ACTION_HEADER, leaseAction.toLowerCase());
  this._setHeadersFromBlob(webResource, options);

  var processResponseCallback = function (responseObject, next) {
    responseObject.leaseResult = null;
    if (!responseObject.error) {
      responseObject.leaseResult = new LeaseResult(container, blob);
      responseObject.leaseResult.getPropertiesFromHeaders(responseObject.response.headers);
    }

    var finalCallback = function (returnObject) {
      callback(returnObject.error, returnObject.leaseResult, returnObject.response);
    };

    next(responseObject, finalCallback);
  };

  this.performRequest(webResource, null, options, processResponseCallback);
};

BlobService.prototype._setHeadersFromBlob = function (webResource, blob) {
  var setHeaderPropertyFromBlob = function (headerProperty, blobProperty) {
    if (blob[blobProperty]) {
      webResource.addOptionalHeader(headerProperty, blob[blobProperty]);
    }
  };

  if (blob) {
    // Content-Type
    setHeaderPropertyFromBlob(HeaderConstants.CONTENT_TYPE_HEADER, 'contentTypeHeader');
    setHeaderPropertyFromBlob(HeaderConstants.CONTENT_TYPE_HEADER, 'contentType');
    setHeaderPropertyFromBlob(HeaderConstants.CONTENT_TYPE, 'contentType');

    // Content-Encoding
    setHeaderPropertyFromBlob(HeaderConstants.CONTENT_ENCODING_HEADER, 'contentEncodingHeader');
    setHeaderPropertyFromBlob(HeaderConstants.CONTENT_ENCODING_HEADER, 'contentEncoding');
    setHeaderPropertyFromBlob(HeaderConstants.CONTENT_ENCODING, 'contentEncoding');

    // Content-MD5
    setHeaderPropertyFromBlob(HeaderConstants.BLOB_CONTENT_MD5_HEADER, 'contentMD5Header');
    setHeaderPropertyFromBlob(HeaderConstants.BLOB_CONTENT_MD5_HEADER, 'contentMD5');
    setHeaderPropertyFromBlob(HeaderConstants.CONTENT_MD5, 'contentMD5');

    // Content-Language
    setHeaderPropertyFromBlob(HeaderConstants.CONTENT_LANGUAGE_HEADER, 'contentLanguageHeader');
    setHeaderPropertyFromBlob(HeaderConstants.CONTENT_LANGUAGE_HEADER, 'contentLanguage');
    setHeaderPropertyFromBlob(HeaderConstants.CONTENT_LANGUAGE, 'contentLanguage');

    // Cache-Control
    setHeaderPropertyFromBlob(HeaderConstants.CACHE_CONTROL_HEADER, 'cacheControlHeader');
    setHeaderPropertyFromBlob(HeaderConstants.CACHE_CONTROL_HEADER, 'cacheControl');
    setHeaderPropertyFromBlob(HeaderConstants.CACHE_CONTROL, 'cacheControl');

    // Content-Length
    setHeaderPropertyFromBlob(HeaderConstants.CONTENT_LENGTH_HEADER, 'contentLengthHeader');
    setHeaderPropertyFromBlob(HeaderConstants.CONTENT_LENGTH_HEADER, 'contentLength');
    setHeaderPropertyFromBlob(HeaderConstants.CONTENT_LENGTH, 'contentLength');

    // Range
    if (!azureutil.objectIsNull(blob.rangeStart)) {
      var range = 'bytes=' + blob.rangeStart + '-';

      if (!azureutil.objectIsNull(blob.rangeEnd)) {
        range += blob.rangeEnd;
      }

      webResource.addOptionalHeader(HeaderConstants.RANGE, range);
    }

    if (!azureutil.objectIsNull(blob.rangeStartHeader)) {
      var rangeHeader = 'bytes=' + blob.rangeStartHeader + '-';

      if (!azureutil.objectIsNull(blob.rangeEndHeader)) {
        rangeHeader += blob.rangeEndHeader;
      }

      webResource.addOptionalHeader(HeaderConstants.STORAGE_RANGE_HEADER, rangeHeader);
    }

    // Range get content-md5
    setHeaderPropertyFromBlob(HeaderConstants.RANGE_GET_CONTENT_MD5, 'rangeGetContentMd5');

    // Blob Type
    setHeaderPropertyFromBlob(HeaderConstants.BLOB_TYPE_HEADER, 'blobTypeHeader');
    setHeaderPropertyFromBlob(HeaderConstants.BLOB_TYPE_HEADER, 'blobType');

    // Lease id
    setHeaderPropertyFromBlob(HeaderConstants.LEASE_ID_HEADER, 'leaseId');

    // Sequence number
    setHeaderPropertyFromBlob(HeaderConstants.SEQUENCE_NUMBER, 'sequenceNumberHeader');
    setHeaderPropertyFromBlob('x-ms-sequence-number-action', 'sequenceNumberActionHeader');

    if (blob.metadata) {
      webResource.addOptionalMetadataHeaders(blob.metadata);
    }
  }
};

BlobService.prototype._updatePageBlobPagesImpl = function (container, blob, length, rangeStart, rangeEnd, writeMethod, options) {
  validateContainerName(container);
  validateBlobName(container, blob);

  if (rangeStart % 512 !== 0) {
    throw new Error(BlobService.incorrectStartByteOffsetErr);
  }

  var size = null;
  if (!azureutil.objectIsNull(rangeEnd)) {
    if ((rangeEnd + 1) % 512 !== 0) {
      throw new Error(BlobService.incorrectEndByteOffsetErr);
    }

    size = (rangeEnd - rangeStart) + 1;
    if (size > this.writeBlockSizeInBytes) {
      throw new Error('Page blob size cant be larger than ' + this.writeBlockSizeInBytes + ' bytes.');
    }
  }

  var resourceName = createResourceName(container, blob);
  var webResource = WebResource.put(resourceName)
    .withProperty(BlobConstants.ResourceTypeProperty, BlobConstants.ResourceTypes.BLOB)
    .withProperty(BlobConstants.SharedAccessPermissionProperty, BlobConstants.SharedAccessPermissions.WRITE);

  webResource.addOptionalQueryParam(QueryStringConstants.COMP, 'page');

  if (!options) {
    options = {};
  }

  options.rangeStart = rangeStart;
  options.rangeEnd = rangeEnd;

  this._setHeadersFromBlob(webResource, options);

  webResource.addOptionalHeader(HeaderConstants.PAGE_WRITE, writeMethod);
  if (size) {
    webResource.addOptionalHeader(HeaderConstants.CONTENT_LENGTH_HEADER, size);
  }

  webResource.addOptionalHeader(HeaderConstants.CONTENT_LENGTH, length);
  webResource.addOptionalHeader(HeaderConstants.CONTENT_TYPE, 'application/octet-stream');

  return webResource;
};

BlobService.prototype._analyzeStream = function (stream, calculateMD5, callback) {
  var digest = null;
  var length = 0;
  if (calculateMD5) {
    digest = crypto.createHash('md5');
  }

  stream.on('data', function (chunk) {
    if (calculateMD5) {
      digest.update(chunk);
    }

    length += chunk.length;
  });

  stream.on('end', function () {
    var md5 = null;
    if (calculateMD5) {
      md5 = digest.digest('base64');
    }

    callback(length, md5);
  });
};

// Non-class methods

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
* Generate a block identifier.
*
* @param {int} part Block number
* @return {string} The block identifier.
*/
function generateBlockId(part) {
  // make sure part becomes a string
  var returnValue = part + '';

  while (returnValue.length < 64) {
    returnValue = '0' + returnValue;
  }

  return returnValue;
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
