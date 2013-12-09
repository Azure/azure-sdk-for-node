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
var _ = require('underscore');

var azureCommon = require('azure-common');
var azureutil = azureCommon.util;
var HeaderConstants = azureCommon.Constants.HeaderConstants;
var HmacSha256Sign = azureCommon.HmacSha256Sign;

/**
* Creates a new SharedKey object.
*
* @constructor
* @param {string} storageAccount    The storage account.
* @param {string} storageAccessKey  The storage account's access key.
* @param {bool}   usePathStyleUri   Boolean value indicating if the path, or the hostname, should include the storage account.
*/
function SharedKey(storageAccount, storageAccessKey, usePathStyleUri) {
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
SharedKey.prototype.signRequest = function (webResource, callback) {
  var getvalueToAppend = function (value, headerName) {
    if (azureutil.objectIsNull(value) || azureutil.objectIsNull(value[headerName])) {
      return '\n';
    } else {
      return value[headerName] + '\n';
    }
  };

  var stringToSign =
    webResource.method + '\n' +
    getvalueToAppend(webResource.headers, HeaderConstants.CONTENT_ENCODING) +
    getvalueToAppend(webResource.headers, HeaderConstants.CONTENT_LANGUAGE) +
    getvalueToAppend(webResource.headers, HeaderConstants.CONTENT_LENGTH) +
    getvalueToAppend(webResource.headers, HeaderConstants.CONTENT_MD5) +
    getvalueToAppend(webResource.headers, HeaderConstants.CONTENT_TYPE) +
    getvalueToAppend(webResource.headers, HeaderConstants.DATE) +
    getvalueToAppend(webResource.headers, HeaderConstants.IF_MODIFIED_SINCE) +
    getvalueToAppend(webResource.headers, HeaderConstants.IF_MATCH) +
    getvalueToAppend(webResource.headers, HeaderConstants.IF_NONE_MATCH) +
    getvalueToAppend(webResource.headers, HeaderConstants.IF_UNMODIFIED_SINCE) +
    getvalueToAppend(webResource.headers, HeaderConstants.RANGE) +
    this._getCanonicalizedHeaders(webResource) +
    this._getCanonicalizedResource(webResource);

  var signature = this.signer.sign(stringToSign);

  webResource.withHeader(HeaderConstants.AUTHORIZATION, 'SharedKey ' + this.storageAccount + ':' + signature);
  callback(null);
};

/*
* Retrieves the webresource's canonicalized resource string.
* @param {WebResource} webResource The webresource to get the canonicalized resource string from.
* @return {string} The canonicalized resource string.
*/
SharedKey.prototype._getCanonicalizedResource = function (webResource) {
  var path = '/';
  if (webResource.path) {
    path = webResource.path;
  }

  var canonicalizedResource = '/' + this.storageAccount + path;

  // Get the raw query string values for signing
  var queryStringValues = webResource.queryString;

  // Build the canonicalized resource by sorting the values by name.
  if (queryStringValues) {
    var paramNames = [];
    Object.keys(queryStringValues).forEach(function (n) {
      paramNames.push(n);
    });

    paramNames = paramNames.sort();
    Object.keys(paramNames).forEach(function (name) {
      canonicalizedResource += '\n' + paramNames[name] + ':' + queryStringValues[paramNames[name]];
    });
  }

  return canonicalizedResource;
};

/*
* Constructs the Canonicalized Headers string.
*
* To construct the CanonicalizedHeaders portion of the signature string,
* follow these steps: 1. Retrieve all headers for the resource that begin
* with x-ms-, including the x-ms-date header. 2. Convert each HTTP header
* name to lowercase. 3. Sort the headers lexicographically by header name,
* in ascending order. Each header may appear only once in the
* string. 4. Unfold the string by replacing any breaking white space with a
* single space. 5. Trim any white space around the colon in the header. 6.
* Finally, append a new line character to each canonicalized header in the
* resulting list. Construct the CanonicalizedHeaders string by
* concatenating all headers in this list into a single string.
*
* @param {object} The webresource object.
* @return {string} The canonicalized headers.
*/
SharedKey.prototype._getCanonicalizedHeaders = function (webResource) {
  // Build canonicalized headers
  var canonicalizedHeaders = '';
  if (webResource.headers) {
    var canonicalizedHeadersArray = [];
    for (var header in webResource.headers) {
      if (header.indexOf(HeaderConstants.PREFIX_FOR_STORAGE_HEADER) === 0) {
        canonicalizedHeadersArray.push(header);
      }
    }

    canonicalizedHeadersArray.sort();

    _.each(canonicalizedHeadersArray, function (currentHeader) {
      canonicalizedHeaders += currentHeader.toLowerCase() + ':' + webResource.headers[currentHeader] + '\n';
    });
  }

  return canonicalizedHeaders;
};

module.exports = SharedKey;