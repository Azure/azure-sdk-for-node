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
var crypto = require('crypto');

var azureutil = require('../../util/util');
var HmacSha256Sign = require('../blob/hmacsha256sign');
var Constants = require('../../util/constants');
var HeaderConstants = Constants.HeaderConstants;
var QueryStringConstants = Constants.QueryStringConstants;

// Expose 'SharedKeyLiteTable'.
exports = module.exports = SharedKeyLiteTable;

/**
* Creates a new SharedKeyLiteTable object.
*
* @constructor
* @param {string} storageAccount    The storage account.
* @param {string} storageAccessKey  The storage account's access key.
* @param {bool}   usePathStyleUri   Boolean value indicating if the path, or the hostname, should include the storage account.
*/
function SharedKeyLiteTable(storageAccount, storageAccessKey, usePathStyleUri) {
  this.storageAccount = storageAccount;
  this.storageAccessKey = storageAccessKey;
  this.usePathStyleUri = usePathStyleUri;
  this.signer = new HmacSha256Sign(storageAccessKey);
}

/**
* Signs a request with the Authentication header.
* 
* @param {WebResource} The webresource to be signed.
* @param {function(error)}  callback  The callback function.
* @return {undefined}
*/
SharedKeyLiteTable.prototype.signRequest = function (webResource, callback) {
  var getvalueToAppend = function (value) {
    if (azureutil.objectIsNull(value)) {
      return '\n';
    } else {
      return value + '\n';
    }
  };

  var stringToSign =
      getvalueToAppend(webResource.headers[HeaderConstants.DATE_HEADER]) +
      this._getCanonicalizedResource(webResource);

  var signature = this.signer.sign(stringToSign);

  webResource.addOptionalHeader(HeaderConstants.AUTHORIZATION, 'SharedKeyLite ' + this.storageAccount + ':' + signature);

  callback(null);
};

/*
* Retrieves the webresource's canonicalized resource string.
* @param {WebResource} webResource The webresource to get the canonicalized resource string from.
* @return {string} The canonicalized resource string.
*/
SharedKeyLiteTable.prototype._getCanonicalizedResource = function (webResource) {
  var path = '/';
  if (webResource.path) {
    path = webResource.path;
  }

  var canonicalizedResource = '/' + this.storageAccount + path;

  var queryStringValues = webResource.getQueryStringValues(false);
  if (queryStringValues[QueryStringConstants.COMP]) {
    canonicalizedResource += '?comp=' + queryStringValues[QueryStringConstants.COMP];
  }

  return canonicalizedResource;
};