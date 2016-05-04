﻿//
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

var util = require('util');
var msrest = require('ms-rest');
var _ = require('underscore');
var url = require('url');

var Constants = msrest.Constants;
var HmacSha256Sign = require('./hmacsha256');

/**
* Creates a new BatchSharedKeyCredentials object.
* @constructor
* @param {string} accountName The batch account name. 
* @param {string} accountKey The batch account key.
*/
function BatchSharedKeyCredentials(accountName, accountKey) {
  if (!Boolean(accountName) || typeof accountName.valueOf() !== 'string') {
    throw new Error('accountName must be a non empty string.');
  }
  
  if (!Boolean(accountKey) || typeof accountKey.valueOf() !== 'string') {
    throw new Error('accountKey must be a non empty string.');
  }
  
  this.accountName = accountName;
  this.accountKey = accountKey;
  this.signer = new HmacSha256Sign(accountKey);
}

/**
* Signs a request with the Authentication header.
*
* @param {webResource} The WebResource to be signed.
* @param {function(error)}  callback  The callback function.
* @return {undefined}
*/
BatchSharedKeyCredentials.prototype.signRequest = function (webResource, callback) {
  var self = this;
  
  // Help function to get header value, if header without value, append a newline
  var getvalueToAppend = function (value, headerName) {
    if (!Boolean(value) || !Boolean(value[headerName])) {
      return '\n';
    } else {
      return value[headerName] + '\n';
    }
  };
  
  // Help function to get content length
  var getContentLengthToAppend = function (value, method, body) {
    if (!Boolean(value) || !Boolean(value['Content-Length'])) {
      // Get content length from body if available
      if (body) {
        return Buffer.byteLength(body) + '\n';
      }
      // For GET verb, do not add content-length
      if (method === 'GET') {
        return '\n';
      } else {
        return '0\n';
      }
    } else {
      return value['Content-Length'] + '\n';
    }
  };
  
  // Set Headers
  if (!Boolean(webResource.headers['ocp-date'])) {
    webResource.headers['ocp-date'] = new Date().toUTCString();
  }
  
  // Add verb and standard HTTP header as single line
  var stringToSign = webResource.method + '\n' +
      getvalueToAppend(webResource.headers, 'Content-Encoding') +
      getvalueToAppend(webResource.headers, 'Content-Language') +
      getContentLengthToAppend(webResource.headers, webResource.method, webResource.body) +
      getvalueToAppend(webResource.headers, 'Content-MD5') +
      getvalueToAppend(webResource.headers, 'Content-Type') +
      getvalueToAppend(webResource.headers, 'Date') +
      getvalueToAppend(webResource.headers, 'If-Modified-Since') +
      getvalueToAppend(webResource.headers, 'If-Match') +
      getvalueToAppend(webResource.headers, 'If-None-Match') +
      getvalueToAppend(webResource.headers, 'If-Unmodified-Since') +
      getvalueToAppend(webResource.headers, 'Range');
  
  // Add customize HTTP header
  stringToSign += this._getCanonicalizedHeaders(webResource);
  
  // Add path/query from uri
  stringToSign += this._getCanonicalizedResource(webResource);
  
  // Signed with sha256
  var signature = this.signer.sign(stringToSign);
  
  // Add authrization header
  webResource.headers[Constants.HeaderConstants.AUTHORIZATION] = util.format('SharedKey %s:%s', self.accountName, signature);
  callback(null);
};

/*
* Constructs the Canonicalized Headers string.
*
* To construct the CanonicalizedHeaders portion of the signature string,
* follow these steps: 1. Retrieve all headers for the resource that begin
* with ocp-, including the ocp-date header. 2. Convert each HTTP header
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
BatchSharedKeyCredentials.prototype._getCanonicalizedHeaders = function (webResource) {
  // Build canonicalized headers
  var canonicalizedHeaders = '';
  if (webResource.headers) {
    var canonicalizedHeadersArray = [];
    
    // Retrieve all headers for begin with ocp-
    for (var header in webResource.headers) {
      if (header.indexOf('ocp-') === 0) {
        canonicalizedHeadersArray.push(header);
      }
    }
    
    // Sort the header by header name
    canonicalizedHeadersArray.sort();
    
    _.each(canonicalizedHeadersArray, function (currentHeader) {
      var value = webResource.headers[currentHeader];
      if (Boolean(value)) {
        // Make header value lower case and apend a new line for each header
        canonicalizedHeaders += currentHeader.toLowerCase() + ':' + value + '\n';
      }
    });
  }
  
  return canonicalizedHeaders;
};

/*
* Retrieves the webresource's canonicalized resource string.
* @param {WebResource} webResource The webresource to get the canonicalized resource string from.
* @return {string} The canonicalized resource string.
*/
BatchSharedKeyCredentials.prototype._getCanonicalizedResource = function (webResource) {
  var path = '/';
  var urlstring = url.parse(webResource.url, true);
  if (urlstring.pathname) {
    // Due to server issue, client has to replace "%5C" and "%2F" in path to "/" before calculation
    path = urlstring.pathname.replace(/\%5C/g, '/').replace(/\%2F/g, '/');
  }
  
  var canonicalizedResource = '/' + this.accountName + path;
  
  // Get the raw query string values for signing
  var queryStringValues = urlstring.query;
  
  // Build the canonicalized resource by sorting the values by name.
  if (queryStringValues) {
    var paramNames = [];
    Object.keys(queryStringValues).forEach(function (n) {
      paramNames.push(n);
    });
    
    // All the queries sorted by query name
    paramNames = paramNames.sort();
    Object.keys(paramNames).forEach(function (name) {
      canonicalizedResource += '\n' + paramNames[name] + ':' + queryStringValues[paramNames[name]];
    });
  }
  
  return canonicalizedResource;
};

module.exports = BatchSharedKeyCredentials;
