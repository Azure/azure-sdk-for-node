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
var azureutil = require('../util/util');
var Constants = require('../util/constants');
var HeaderConstants = Constants.HeaderConstants;
var HttpConstants = Constants.HttpConstants;

function encodeSpecialCharacters(path) {
  return path.replace(/'/g, '%27');
}

/**
* Creates a new WebResource object.
*
* This class provides an abstraction over a REST call by being library / implementation agnostic and wrapping the necessary
* properties to initiate a request.
*
* @constructor
*/
function WebResource() {
  this.rawResponse = false;
  this.queryString = {};
}

/**
* Creates a new put request web resource.
*
* @param {string} path The path for the put operation.
* @return {WebResource} A new webresource with a put operation for the given path.
*/
WebResource.put = function (path) {
  var webResource = new WebResource();
  webResource.path = path ? encodeSpecialCharacters(path) : null;
  webResource.httpVerb = HttpConstants.HttpVerbs.PUT;
  webResource.okCodes = [HttpConstants.HttpResponseCodes.Created];
  return webResource;
};

/**
* Creates a new get request web resource.
*
* @param {string} path The path for the get operation.
* @return {WebResource} A new webresource with a get operation for the given path.
*/
WebResource.get = function (path) {
  var webResource = new WebResource();
  webResource.path = path ? encodeSpecialCharacters(path) : null;
  webResource.httpVerb = HttpConstants.HttpVerbs.GET;
  webResource.okCodes = [HttpConstants.HttpResponseCodes.Ok];
  return webResource;
};

/**
* Creates a new head request web resource.
*
* @param {string} path The path for the head operation.
* @return {WebResource} A new webresource with a head operation for the given path.
*/
WebResource.head = function (path) {
  var webResource = new WebResource();
  webResource.path = path ? encodeSpecialCharacters(path) : null;
  webResource.httpVerb = HttpConstants.HttpVerbs.HEAD;
  webResource.okCodes = [HttpConstants.HttpResponseCodes.Ok];
  return webResource;
};

/**
* Creates a new delete request web resource.
*
* @param {string} path The path for the delete operation.
* @return {WebResource} A new webresource with a delete operation for the given path.
*/
WebResource.del = function (path) {
  var webResource = new WebResource();
  webResource.path = path ? encodeSpecialCharacters(path) : null;
  webResource.httpVerb = HttpConstants.HttpVerbs.DELETE;
  webResource.okCodes = [HttpConstants.HttpResponseCodes.NoContent];
  return webResource;
};

/**
* Creates a new post request web resource.
*
* @param {string} path The path for the post operation.
* @return {WebResource} A new webresource with a post operation for the given path.
*/
WebResource.post = function (path) {
  var webResource = new WebResource();
  webResource.path = path ? encodeSpecialCharacters(path) : null;
  webResource.httpVerb = HttpConstants.HttpVerbs.POST;
  webResource.okCodes = [HttpConstants.HttpResponseCodes.Created];
  return webResource;
};

/**
* Creates a new merge request web resource.
*
* @param {string} path The path for the merge operation.
* @return {WebResource} A new webresource with a merge operation for the given path.
*/
WebResource.merge = function (path) {
  var webResource = new WebResource();
  webResource.path = path ? encodeSpecialCharacters(path) : null;
  webResource.httpVerb = HttpConstants.HttpVerbs.MERGE;
  webResource.okCodes = [HttpConstants.HttpResponseCodes.Created];
  return webResource;
};

/**
* Specifies the response status codes that are valid for the given web request.
*
* @param {int}  okCode The expected ok code.
* @param {bool} append true if the ok code should be appended to a list of many; false if it should replace any previous ok code.
* @return {WebResource} The webresource.
*/
WebResource.prototype.withOkCode = function (okCode, append) {
  if (!this.okCodes || !append) {
    this.okCodes = [];
  }

  this.okCodes.push(okCode);
  return this;
};

/**
* Specifies a custom property in the web resource.
*
* @param {string} name  The property name.
* @param {string} value The property value.
* @return {WebResource} The webresource.
*/
WebResource.prototype.withProperty = function (name, value) {
  if (!this.properties) {
    this.properties = {};
  }

  this.properties[name] = value;

  return this;
};

/**
* Specifies if the response should be parsed or not.
*
* @param {bool} rawResponse true if the response should not be parse; false otherwise.
* @return {WebResource} The webresource.
*/
WebResource.prototype.withRawResponse = function (rawResponse) {
  if (rawResponse) {
    this.rawResponse = rawResponse;
  } else {
    this.rawResponse = true;
  }

  return this;
};

/**
* Adds an optional query string parameter.
*
* @param {Object} name          The name of the query string parameter.
* @param {Object} value         The value of the query string parameter.
* @param {Object} defaultValue  The default value for the query string parameter to be used if no value is passed.
* @return {Object} The web resource.
*/
WebResource.prototype.addOptionalQueryParam = function (name, value, defaultValue) {
  if (!azureutil.objectIsNull(value)) {
    this.queryString[name] = value;
  } else if (defaultValue) {
    this.queryString[name] = defaultValue;
  }

  return this;
};

/**
* Adds optional query string parameters.
*
* Additional arguments will be the needles to search in the haystack. 
*
* @param {Object} object  The haystack of query string parameters.
* @return {Object} The web resource.
*/
WebResource.prototype.addOptionalQueryParams = function (object) {
  if (object) {
    for (var i = 1; i < arguments.length; i++) {
      if (object[arguments[i]]) {
        this.addOptionalQueryParam(arguments[i], object[arguments[i]]);
      }
    }
  }

  return this;
};

/**
* Adds an optional header parameter.
*
* @param {Object} name  The name of the header parameter.
* @param {Object} value The value of the header parameter.
* @return {Object} The web resource.
*/
WebResource.prototype.addOptionalHeader = function (name, value) {
  if (!this.headers) {
    this.headers = {};
  }

  if (value !== undefined && value !== null) {
    this.headers[name] = value;
  }

  return this;
};

/**
* Adds optional query string parameters.
*
* Additional arguments will be the needles to search in the haystack. 
*
* @param {Object} object  The haystack of headers.
* @return {Object} The web resource.
*/
WebResource.prototype.addOptionalHeaders = function (object) {
  if (object) {
    for (var i = 1; i < arguments.length; i++) {
      if (object[arguments[i]]) {
        this.addOptionalHeader(arguments[i], object[arguments[i]]);
      }
    }
  }

  return this;
};

WebResource.prototype.addOptionalMetadataHeaders = function (metadata) {
  var self = this;

  if (metadata) {
    Object.keys(metadata).forEach(function (metadataHeader) {
      self.addOptionalHeader(HeaderConstants.PREFIX_FOR_STORAGE_METADATA + metadataHeader.toLowerCase(), metadata[metadataHeader]);
    });
  }

  return this;
};

/**
* Determines if a status code corresponds to a valid response according to the WebResource's expected status codes.
*
* @param {int} statusCode The response status code.
* @return true if the response is valid; false otherwise.
*/
WebResource.prototype.validResponse = function (statusCode) {
  for (var i in this.okCodes) {
    if (this.okCodes[i] == statusCode) {
      return true;
    }
  }

  return false;
};

module.exports = WebResource;