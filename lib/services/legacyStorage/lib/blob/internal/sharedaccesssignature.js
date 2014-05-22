// 
// Copyright (c) Microsoft and contributors.  All rights reserved.
// 
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//   http://www.apache.org/licenses/LICENSE-2.0
// 
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// 
// See the License for the specific language governing permissions and
// limitations under the License.
// 

// Module dependencies.
var qs = require('querystring');

var azureCommon = require('azure-common');
var azureutil = azureCommon.util;
var HmacSha256Sign = azureCommon.HmacSha256Sign;
var Constants = azureCommon.Constants;
var BlobConstants = Constants.BlobConstants;
var QueryStringConstants = Constants.QueryStringConstants;

var SAS_VERSION = '2012-02-12';


/**
* Creates a new SharedAccessSignature object.
*
* @constructor
* @param {string} storageAccount    The storage account.
* @param {string} storageAccessKey  The storage account's access key.
* @param {array}  permissionSet     An array of URL's for which there is a permission defined.
*/
function SharedAccessSignature(storageAccount, storageAccessKey, permissionSet) {
  this.storageAccount = storageAccount;
  this.storageAccessKey = storageAccessKey;
  this.permissionSet = permissionSet;
  this.signer = new HmacSha256Sign(storageAccessKey);
}

/**
* Generates the query string for a shared access signature signing.
*
* @this {SharedAccessSignature}
* @param {string}                     path                                          The path to the resource.
* @parma {ResourceTypes}              resourceType                                  The resource type.
* @param {object}                     sharedAccessPolicy                            The shared access policy.
* @param {string}                     [sharedAccessPolicy.Id]                       The signed identifier.
* @param {SharedAccessPermissions}    sharedAccessPolicy.AccessPolicy.Permissions   The permission type.
* @param {date}                       [sharedAccessPolicy.AccessPolicy.Start]       The time at which the Shared Access Signature becomes valid.
* @param {date}                       sharedAccessPolicy.AccessPolicy.Expiry        The time at which the Shared Access Signature becomes expired.
* @return {object} The shared access signature query string.
*/
SharedAccessSignature.prototype.generateSignedQueryString = function (path, queryString, resourceType, sharedAccessPolicy) {
  if (sharedAccessPolicy.AccessPolicy) {
    if (sharedAccessPolicy.AccessPolicy.Start) {
      queryString[QueryStringConstants.SIGNED_START] = sharedAccessPolicy.AccessPolicy.Start;
    }

    if (sharedAccessPolicy.AccessPolicy.Expiry) {
      queryString[QueryStringConstants.SIGNED_EXPIRY] = sharedAccessPolicy.AccessPolicy.Expiry;
    }

    if (sharedAccessPolicy.AccessPolicy.Permissions) {
      queryString[QueryStringConstants.SIGNED_PERMISSIONS] = sharedAccessPolicy.AccessPolicy.Permissions;
    }
  }

  queryString[QueryStringConstants.SIGNED_RESOURCE] = resourceType;

  if (sharedAccessPolicy.Id) {
    queryString[QueryStringConstants.SIGNED_IDENTIFIER] = sharedAccessPolicy.Id;
  }

  queryString[QueryStringConstants.SIGNED_VERSION] = SAS_VERSION;

  queryString[QueryStringConstants.SIGNATURE] = this._generateSignature(path, resourceType, sharedAccessPolicy);

  return queryString;
};

/**
* Signs a request with the signature header.
*
* @this {SharedAccessSignature}
* @param {WebResource} The webresource to be signed.
* @param {function(error)}  callback  The callback function.
* @return {undefined}
*/
SharedAccessSignature.prototype.signRequest = function (webResource, callback) {
  var self = this;

  for (var permission in this.permissionSet) {
    if (this.permissionSet.hasOwnProperty(permission)) {
      var sharedAccessSignature = this.permissionSet[permission];

      if (self._permissionMatchesRequest(sharedAccessSignature, webResource,
        webResource.properties[BlobConstants.ResourceTypeProperty],
        webResource.properties[BlobConstants.SharedAccessPermissionProperty])) {

        if (webResource.uri.indexOf('?') === -1) {
          webResource.uri += '?';
        } else {
          webResource.uri += '&';
        }

        webResource.uri += qs.stringify(sharedAccessSignature.queryString);
        break;
      }
    }
  }

  callback(null);
};

/**
* Generates the shared access signature for a resource.
*
* @this {SharedAccessSignature}
* @param {string}                     path                                          The path to the resource.
* @parma {ResourceTypes}              resourceType                                  The resource type.
* @param {object}                     sharedAccessPolicy                            The shared access policy.
* @param {string}                     [sharedAccessPolicy.Id]                       The signed identifier.
* @param {SharedAccessPermissions}    sharedAccessPolicy.AccessPolicy.Permissions   The permission type.
* @param {date}                       [sharedAccessPolicy.AccessPolicy.Start]       The time at which the Shared Access Signature becomes valid.
* @param {date}                       sharedAccessPolicy.AccessPolicy.Expiry        The time at which the Shared Access Signature becomes expired.
* @return {string} The shared access signature.
*/
SharedAccessSignature.prototype._generateSignature = function (path, resourceType, sharedAccessPolicy) {
  var getvalueToAppend = function (value, noNewLine) {
    var returnValue = '';
    if (!azureutil.objectIsNull(value)) {
      returnValue = value;
    }

    if (noNewLine !== true) {
      returnValue += '\n';
    }

    return returnValue;
  };

  // Add leading slash to path
  if (path.substr(0, 1) !== '/') {
    path = '/' + path;
  }

  var canonicalizedResource = '/' + this.storageAccount + path;

  var stringToSign =
    getvalueToAppend(sharedAccessPolicy.AccessPolicy ? sharedAccessPolicy.AccessPolicy.Permissions : '') +
    getvalueToAppend(sharedAccessPolicy.AccessPolicy ? sharedAccessPolicy.AccessPolicy.Start : '') +
    getvalueToAppend(sharedAccessPolicy.AccessPolicy ? sharedAccessPolicy.AccessPolicy.Expiry : '') +
    getvalueToAppend(canonicalizedResource) +
    getvalueToAppend(sharedAccessPolicy.Id) +
    SAS_VERSION;

  return this.signer.sign(stringToSign);
};

/**
* Generates the query string for a shared access signature signing.
*
* @this {SharedAccessSignature}
* @param {object}                     sharedAccessSignature     The shared access signature object.
* @parma {WebResource}                webResource               The web resource.
* @parma {ResourceTypes}              resourceType              The resource type.
* @param {SharedAccessPermissions}    requiredPermission        The time at which the Shared Access Signature becomes valid.
* @return {bool} true if the request matches the permission set; false otherwise.
*/
SharedAccessSignature.prototype._permissionMatchesRequest = function (sharedAccessSignature, webResource, resourceType, requiredPermission) {
  var requiredResourceType = resourceType;
  if (requiredResourceType === BlobConstants.ResourceTypes.BLOB) {
    requiredResourceType += BlobConstants.ResourceTypes.CONTAINER;
  }

  for (var property in sharedAccessSignature.queryString) {
    if (property === QueryStringConstants.SIGNED_RESOURCE && requiredResourceType.indexOf(sharedAccessSignature.queryString[property]) === -1) {
      return false;
    } else if (property === QueryStringConstants.SIGNED_PERMISSIONS && requiredPermission.indexOf(sharedAccessSignature.queryString[property]) === -1) {
      return false;
    }
  }

  return webResource.path.indexOf(sharedAccessSignature.path) !== -1;
};

module.exports = SharedAccessSignature;
