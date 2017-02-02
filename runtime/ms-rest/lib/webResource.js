// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information. 

// Module dependencies.
var utils = require('./utils');
var Constants = require('./constants');
var util = require('util');
var HeaderConstants = Constants.HeaderConstants;
var HttpConstants = Constants.HttpConstants;
var HttpConstants = Constants.HttpConstants;
var HttpVerbs = HttpConstants.HttpVerbs;

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
  this.url = null;
  this.method = null;
  this.headers = {};
  this.body = null;
}

/**
* Creates a new put request web resource.
*
* @param {string} path The path for the put operation.
* @return {WebResource} A new WebResource with a put operation for the given path.
*/
WebResource.put = function (path) {
  var webResource = new WebResource();
  webResource.path = path ? utils.encodeUri(path) : null;
  webResource.method = HttpConstants.HttpVerbs.PUT;
  return webResource;
};

/**
* Creates a new get request web resource.
*
* @param {string} path The path for the get operation.
* @return {WebResource} A new WebResource with a get operation for the given path.
*/
WebResource.get = function (path) {
  var webResource = new WebResource();
  webResource.path = path ? utils.encodeUri(path) : null;
  webResource.method = HttpConstants.HttpVerbs.GET;
  return webResource;
};

/**
* Creates a new head request web resource.
*
* @param {string} path The path for the head operation.
* @return {WebResource} A new WebResource with a head operation for the given path.
*/
WebResource.head = function (path) {
  var webResource = new WebResource();
  webResource.path = path ? utils.encodeUri(path) : null;
  webResource.method = HttpConstants.HttpVerbs.HEAD;
  return webResource;
};

/**
* Creates a new delete request web resource.
*
* @param {string} path The path for the delete operation.
* @return {WebResource} A new WebResource with a delete operation for the given path.
*/
WebResource.del = function (path) {
  var webResource = new WebResource();
  webResource.path = path ? utils.encodeUri(path) : null;
  webResource.method = HttpConstants.HttpVerbs.DELETE;
  return webResource;
};

/**
* Creates a new post request web resource.
*
* @param {string} path The path for the post operation.
* @return {WebResource} A new WebResource with a post operation for the given path.
*/
WebResource.post = function (path) {
  var webResource = new WebResource();
  webResource.path = path ? utils.encodeUri(path) : null;
  webResource.method = HttpConstants.HttpVerbs.POST;
  return webResource;
};

/**
* Creates a new merge request web resource.
*
* @param {string} path The path for the merge operation.
* @return {WebResource} A new WebResource with a merge operation for the given path.
*/
WebResource.merge = function (path) {
  var webResource = new WebResource();
  webResource.path = path ? utils.encodeUri(path) : null;
  webResource.method = HttpConstants.HttpVerbs.MERGE;
  return webResource;
};

/**
* Creates a new patch request web resource.
*
* @param {string} path The path for the patch operation.
* @return {WebResource} A new WebResource with a patch operation for the given path.
*/
WebResource.patch = function (path) {
  var webResource = new WebResource();
  webResource.path = path ? utils.encodeUri(path) : null;
  webResource.method = HttpConstants.HttpVerbs.PATCH;
  return webResource;
};

/**
* Specifies a custom property in the web resource.
*
* @param {string} name  The property name.
* @param {string} value The property value.
* @return {WebResource} The WebResource.
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
* @return {WebResource} The WebResource.
*/
WebResource.prototype.withRawResponse = function (rawResponse) {
  if (rawResponse) {
    this.rawResponse = rawResponse;
  } else {
    this.rawResponse = true;
  }

  return this;
};

WebResource.prototype.withHeadersOnly = function (headersOnly) {
  if (headersOnly !== undefined) {
    this.headersOnly = headersOnly;
  } else {
    this.headersOnly = true;
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
WebResource.prototype.withQueryOption = function (name, value, defaultValue) {
  if (!utils.objectIsNull(value)) {
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
WebResource.prototype.withQueryOptions = function (object) {
  if (object) {
    for (var i = 1; i < arguments.length; i++) {
      if (object[arguments[i]]) {
        this.withQueryOption(arguments[i], object[arguments[i]]);
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
WebResource.prototype.withHeader = function (name, value) {
  if (!this.headers) {
    this.headers = {};
  }

  if (value !== undefined && value !== null) {
    this.headers[name] = value;
  }

  return this;
};

/**
* Adds an optional body.
*
* @param {Object} body  The request body.
* @return {Object} The web resource.
*/
WebResource.prototype.withBody = function (body) {
  this.body = body;
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
WebResource.prototype.withHeaders = function (object) {
  if (object) {
    for (var i = 1; i < arguments.length; i++) {
      if (object[arguments[i]]) {
        this.withHeader(arguments[i], object[arguments[i]]);
      }
    }
  }

  return this;
};

WebResource.prototype.addOptionalMetadataHeaders = function (metadata) {
  var self = this;

  if (metadata) {
    Object.keys(metadata).forEach(function (metadataHeader) {
      self.withHeader(HeaderConstants.PREFIX_FOR_STORAGE_METADATA + metadataHeader.toLowerCase(), metadata[metadataHeader]);
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
  if (statusCode >= 200 && statusCode < 300) {
    return true;
  }

  return false;
};

function isMethodWithBody(verb) {
  return verb === HttpVerbs.PUT ||
    verb === HttpVerbs.POST ||
    verb === HttpVerbs.MERGE;
}

/**
 * Hook up the given input stream to a destination output stream if the WebResource method
 * requires a request body and a body is not already set.
 *
 * @param {Stream} inputStream the stream to pipe from
 * @param {Stream} outputStream the stream to pipe to
 *
 * @return destStream
 */
WebResource.prototype.pipeInput = function(inputStream, destStream) {
  if (isMethodWithBody(this.method) && !this.hasOwnProperty('body')) {
    inputStream.pipe(destStream);
  }

  return destStream;
};

/**
 * Validates that the required properties such as method, url, headers['Content-Type'], 
 * headers['accept-language'] are defined. It will throw an error if one of the above
 * mentioned properties are not defined.
 */
WebResource.prototype.validateRequestProperties = function validateRequestProperties() {
  if (!this.method || !this.url || !this.headers['Content-Type'] || !this.headers['accept-language']) {
    throw new Error('method, url, headers[\'Content-Type\'], headers[\'accept-language\'] are ' +
      'required properties before making a request. Either provide them or use WebResource.prepare() method.');
  }
};

/**
 * Prepares the request.
 *
 * @param {object} options The request options that should be provided to send a request successfully
 *
 * @param {string} options.method The HTTP request method. Valid values are 'GET', 'PUT', 'HEAD', 'DELETE', 'OPTIONS', 'POST', 'PATCH'.
 *
 * @param {string} [options.url] The request url. It may or may not have query parameters in it. 
 * Either provide the 'url' or provide the 'pathTemplate' in the options object. Both the options are mutually exclusive.
 *
 * @param {object} [options.queryParameters] A dictionary of query parameters to be appended to the url, where 
 * the 'key' is the 'query-parameter-name' and the 'value' is the 'query-parameter-value'. 
 * The 'query-parameter-value' can be of type 'string' or it can be of type 'object'. 
 * The 'object' format should be used when you want to skip url encoding. While using the object format, 
 * the object must have a property named value which provides the 'query-parameter-value'.
 * Example: 
 *    - query-parameter-value in 'object' format: { 'query-parameter-name': { value: 'query-parameter-value', skipUrlEncoding: true } }
 *    - query-parameter-value in 'string' format: { 'query-parameter-name': 'query-parameter-value'}.
 * Note: 'If options.url already has some query parameters, then the value provided in options.queryParameters will be appended to the url.
 *
 * @param {string} [options.pathTemplate] The path template of the request url. Either provide the 'url' or provide the 'pathTemplate' 
 * in the options object. Both the options are mutually exclusive.
 * Example: '/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.Storage/storageAccounts/{accountName}'
 *
 * @param {string} [options.baseUrl] The base url of the request. Default value is: 'https://management.azure.com'. This is applicable only with 
 * options.pathTemplate. If you are providing options.url then it is expected that you provide the complete url.
 *
 * @param {object} [options.pathParameters] A dictionary of path parameters that need to be replaced with actual values in the pathTemplate.
 * Here the key is the 'path-parameter-name' and the value is the 'path-parameter-value'. 
 * The 'path-parameter-value' can be of type 'string'  or it can be of type 'object'.
 * The 'object' format should be used when you want to skip url encoding. While using the object format, 
 * the object must have a property named value which provides the 'path-parameter-value'.
 * Example: 
 *    - path-parameter-value in 'object' format: { 'path-parameter-name': { value: 'path-parameter-value', skipUrlEncoding: true } }
 *    - path-parameter-value in 'string' format: { 'path-parameter-name': 'path-parameter-value' }.
 *
 * @param {object} [options.headers] A dictionary of request headers that need to be applied to the request.
 * Here the key is the 'header-name' and the value is the 'header-value'. The header-value MUST be of type string.
 *  - ContentType must be provided with the key name as 'Content-Type'. Default value 'application/json; charset=utf-8'.
 *  - 'Transfer-Encoding' is set to 'chunked' by default if 'options.bodyIsStream' is set to true.
 *  - 'Content-Type' is set to 'application/octet-stream' by default if 'options.bodyIsStream' is set to true.
 *  - 'accept-language' by default is set to 'en-US'
 *  - 'x-ms-client-request-id' by default is set to a new Guid. To not generate a guid for the request, please set options.disableClientRequestId to true
 *
 * @param {boolean} [options.disableClientRequestId] When set to true, instructs the client to not set 'x-ms-client-request-id' header to a new Guid().
 *
 * @param {object|string|boolean|array|number|null|undefined} [options.body] - The request body. It can be of any type. This method will JSON.stringify() the request body.
 *
 * @param {boolean} [options.disableJsonStringifyOnBody] - Indicates whether this method should JSON.stringify() the request body. Default value: false.
 *
 * @param {boolean} [options.bodyIsStream] - Indicates whether the request body is a stream (useful for file upload scenarios).
 *
 * @returns {object} WebResource Returns the prepared WebResource (HTTP Request) object that needs to be given to the request pipeline.
 */
WebResource.prototype.prepare = function prepare(options) {
  if (options === null || options === undefined || typeof options !== 'object') {
    throw new Error('options cannot be null or undefined and must be of type object');
  }

  if (options.method === null || options.method === undefined || typeof options.method.valueOf() !== 'string') {
    throw new Error('options.method cannot be null or undefined and it must be of type string.');
  }

  if (options.url && options.pathTemplate) {
    throw new Error('options.url and options.pathTemplate are mutually exclusive. Please provide either of them.');
  }


  if ((options.pathTemplate === null || options.pathTemplate === undefined || typeof options.pathTemplate.valueOf() !== 'string') && (options.url === null || options.url === undefined || typeof options.url.valueOf() !== 'string')) {
    throw new Error('Please provide either options.pathTemplate or options.url. Currently none of them were provided.');
  }

  //set the url if it is provided.
  if (options.url) {
    if (typeof options.url !== 'string') {
      throw new Error('options.url must be of type \'string\'.');
    }
    this.url = options.url;
  }

  //set the method
  if (options.method) {
    var validMethods = ['GET', 'PUT', 'HEAD', 'DELETE', 'OPTIONS', 'POST', 'PATCH'];
    if (validMethods.indexOf(options.method.toUpperCase()) === -1) {
      throw new Error('The provided method \'' + options.method + '\' is invalid. Supported HTTP methods are: ' + JSON.stringify(validMethods));
    }
  }
  this.method = options.method.toUpperCase();

  //construct the url if path template is provided
  if (options.pathTemplate) {
    if (typeof options.pathTemplate !== 'string') {
      throw new Error('options.pathTemplate must be of type \'string\'.');
    }
    if (!options.baseUrl) {
      options.baseUrl = 'https://management.azure.com';
    }
    var baseUrl = options.baseUrl;
    var url = baseUrl + (baseUrl.endsWith('/') ? '' : '/') + (options.pathTemplate.startsWith('/') ? options.pathTemplate.slice(1) : options.pathTemplate);
    var segments = url.match(/({\w*\s*\w*})/ig);
    if (segments && segments.length) {
      if (options.pathParameters === null || options.pathParameters === undefined || typeof options.pathParameters !== 'object') {
        throw new Error('pathTemplate: ' + options.pathTemplate + ' has been provided. Hence, options.pathParameters ' +
          'cannot be null or undefined and must be of type \'object\'.');
      }
      segments.forEach(function (item) {
        var pathParamName = item.slice(1, -1);
        var pathParam = options.pathParameters[pathParamName];
        if (pathParam === null || pathParam === undefined || !(typeof pathParam === 'string' || typeof pathParam === 'object')) {
          throw new Error('pathTemplate: ' + options.pathTemplate + ' contains the path parameter ' + pathParamName +
            ' however, it is not present in options.pathParameters - ' + util.inspect(options.pathParameters, { depth: null } +
            '. The value of the path parameter can either be a string of the form { ' + pathParamName + ': \'some sample value\' } or ' +
            'it can be an object of the form { ' + pathParamName + ': { value: \'some sample value\', skipUrlEncoding: true } }.'));
        }

        if (typeof pathParam.valueOf() === 'string') {
          url = url.replace(item, encodeURIComponent(pathParam));
        }

        if (typeof pathParam.valueOf() === 'object') {
          if (!pathParam.value) {
            throw new Error('options.pathParameters[' + pathParamName + '] is of type \'object\' but it does not contain a \'value\' property.');
          }
          if (pathParam.skipUrlEncoding) {
            url = url.replace(item, pathParam.value);
          } else {
            url = url.replace(item, encodeURIComponent(pathParam.value));
          }
        }
      });
    }
    this.url = url;
  }

  //append query parameters to the url if they are provided. They can be provided with pathTemplate or url option.
  if (options.queryParameters) {
    if (typeof options.queryParameters !== 'object') {
      throw new Error('options.queryParameters must be of type object. It should be a JSON object ' +
        'of \'query-parameter-name\' as the key and the \'query-parameter-value\' as the value. ' +
        'The \'query-parameter-value\' may be a string or an object of the form { value: \'query-parameter-value\', skipUrlEncoding: true }.');
    }
    //append question mark if it is not present in the url
    if (this.url && this.url.indexOf('?') === -1) {
      this.url += '?';
    }
    //construct queryString
    var queryParams = [];
    var queryParameters = options.queryParameters;
    //We need to populate this.query as a dictionary if the request is being used for Sway's validateRequest(). 
    this.query = {};
    for (var queryParamName in queryParameters) {
      var queryParam = queryParameters[queryParamName];
      if (queryParam) {
        if (typeof queryParam === 'string') {
          queryParams.push(queryParamName + '=' + encodeURIComponent(queryParam));
          this.query[queryParamName] = encodeURIComponent(queryParam);
        }
        if (typeof queryParam === 'object') {
          if (!queryParam.value) {
            throw new Error('options.queryParameters[' + queryParamName + '] is of type \'object\' but it does not contain a \'value\' property.');
          }
          if (queryParam.skipUrlEncoding) {
            queryParams.push(queryParamName + '=' + queryParameters[queryParamName]);
            this.query[queryParamName] = queryParameters[queryParamName];
          } else {
            queryParams.push(queryParamName + '=' + encodeURIComponent(queryParameters[queryParamName]));
            this.query[queryParamName] = encodeURIComponent(queryParameters[queryParamName]);
          }
        }
      }
    }//end-of-for
    //append the queryString
    this.url += queryParams.join('&');
  }

  //add headers to the request if they are provided
  if (options.headers) {
    var headers = options.headers;
    for (var headerName in headers) {
      if (headers.hasOwnProperty(headerName)) {
        this.headers[headerName] = headers[headerName];
      }
    }
  }
  //ensure accept-language is set correctly
  if (!this.headers['accept-language']) {
    this.headers['accept-language'] = 'en-US';
  }
  //ensure the request-id is set correctly
  if (!this.headers['x-ms-client-request-id'] && !options.disableClientRequestId) {
    this.headers['x-ms-client-request-id'] = utils.generateUuid();
  }
  //ensure content-type is set correctly
  if (this.headers['Content-Type'] &&
      typeof this.headers['Content-Type'].valueOf() === 'string' &&
      !this.headers['Content-Type'].endsWith('; charset=utf-8')) {
    this.headers['Content-Type'] += '; charset=utf-8';
  }

  //default
  if (!this.headers['Content-Type']) {
    this.headers['Content-Type'] = 'application/json; charset=utf-8';
  }

  //set the request body. request.js automatically sets the Content-Length request header, so we need not set it explicilty
  this.body = null;
  if (options.body !== null && options.body !== undefined) {
    //body as a stream special case. set the body as-is and check for some special request headers specific to sending a stream. 
    if (options.bodyIsStream) {
      this.body = options.body;
      if (!this.headers['Transfer-Encoding']) {
        this.headers['Transfer-Encoding'] = 'chunked';
      }
      if (this.headers['Content-Type'] !== 'application/octet-stream') {
        this.headers['Content-Type'] = 'application/octet-stream';
      }
    } else {
      if (options.disableJsonStringifyOnBody) {
        this.body = options.body;
      } else {
        this.body = JSON.stringify(options.body);
      }
    }
  }

  return this;
};

module.exports = WebResource;