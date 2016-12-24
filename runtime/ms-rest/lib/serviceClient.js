// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

'use strict';

var url = require('url');
var Constants = require('./constants');
var ProxyFilter = require('./filters/proxyFilter');
var RedirectFilter = require('./filters/redirectFilter');
var SigningFilter = require('./filters/signingFilter');
var ExponentialRetryPolicyFilter = require('./filters/exponentialRetryPolicyFilter');
var SystemErrorRetryPolicyFilter = require('./filters/systemErrorRetryPolicyFilter');
var requestPipeline = require('./requestPipeline');
var WebResource = require('./webResource');
var utils = require('./utils');

/**
 * @class
 * Initializes a new instance of the ServiceClient class.
 * @constructor
 * @param {object} [credentials]    - BasicAuthenticationCredentials or 
 * TokenCredentials object used for authentication. 
 * 
 * @param {object} [options] The parameter options
 * 
 * @param {Array} [options.filters]         - Filters to be added to the request pipeline
 * 
 * @param {object} [options.requestOptions] - Options for the request object
 * {@link https://github.com/request/request#requestoptions-callback Options doc}
 * 
 * @param {bool} [options.noRetryPolicy] - If set to true, turn off default retry policy
 */
function ServiceClient(credentials, options) {
  if (!options) {
    options = {};
  }
  
  if (!options.requestOptions) {
    options.requestOptions = {};
  }

  if (!options.filters) {
    options.filters = [];
  }
  
  if (credentials && !credentials.signRequest) {
    throw new Error('credentials argument needs to implement signRequest method');
  }

  if (credentials) {
    options.filters.push(SigningFilter.create(credentials));
  }

  options.filters.push(RedirectFilter.create());
  if (!options.noRetryPolicy) {
    options.filters.push(new ExponentialRetryPolicyFilter());
    options.filters.push(new SystemErrorRetryPolicyFilter());
  }

  this.pipeline = requestPipeline.create(options.requestOptions).apply(requestPipeline, options.filters);
  
  // enable network tracing
  this._setDefaultProxy();
}

/*
* Loads the fields "useProxy" and respective protocol, port and url
* from the environment values HTTPS_PROXY and HTTP_PROXY
* in case those are set.
* @ignore
*
* @return {string} or null
*/
ServiceClient._loadEnvironmentProxyValue = function () {
  var proxyUrl = null;
  if (process.env[Constants.HTTPS_PROXY]) {
    proxyUrl = process.env[Constants.HTTPS_PROXY];
  } else if (process.env[Constants.HTTPS_PROXY.toLowerCase()]) {
    proxyUrl = process.env[Constants.HTTPS_PROXY.toLowerCase()];
  } else if (process.env[Constants.HTTP_PROXY]) {
    proxyUrl = process.env[Constants.HTTP_PROXY];
  } else if (process.env[Constants.HTTP_PROXY.toLowerCase()]) {
    proxyUrl = process.env[Constants.HTTP_PROXY.toLowerCase()];
  }

  return proxyUrl;
};

/**
* Sets the service host default proxy from the environment.
* Can be overridden by calling _setProxyUrl or _setProxy
* It is useful for enabling Fiddler trace
*/
ServiceClient.prototype._setDefaultProxy = function () {
  var proxyUrl = ServiceClient._loadEnvironmentProxyValue();
  if (proxyUrl) {
    var parsedUrl = url.parse(proxyUrl);
    if (!parsedUrl.port) {
      parsedUrl.port = 80;
    }

    this.pipeline = requestPipeline.createWithSink(this.pipeline,
      ProxyFilter.create({
        host: parsedUrl.hostname,
        port: parsedUrl.port,
        protocol: parsedUrl.protocol
      },
      utils.urlIsHTTPS(parsedUrl)));
  }
};

/**
* Associate a filtering operation with this ServiceClient. Filtering operations
* can include logging, automatically retrying, etc. Filter operations are functions
* the signature:
*
*     "function (requestOptions, next, callback)".
*
* After doing its preprocessing on the request options, the method needs to call
* "next" passing the current options and a callback with the following signature:
*
*     "function (error, result, response, body)"
*
* In this callback, and after processing the result or response, the callback needs
* invoke the original passed in callback to continue processing other filters and
* finish up the service invocation.
*
* @param {function (requestOptins, next, callback)} filter The new filter object.
* @return {QueueService} A new service client with the filter applied.
*/
ServiceClient.prototype.addFilter = function (newFilter) {
  if (!newFilter) {
    throw new Error('No filter passed');
  }
  if (!(newFilter instanceof Function && newFilter.length === 3)) {
    throw new Error('newFilter must be a function taking three parameters');
  }

  this.pipeline = requestPipeline.createWithSink(this.pipeline, newFilter);
  return this;
};

/**
 * Private method: Prepares the HTTP Request object before sending the request based on the provided options.
 *
 * @param {object} options It is the same options that is an input to the sendRequest method. Please see the documentation over there.
 *
 * @return {object} WebResource Returns the prepared WebResource (HTTP Request) object that needs to be given to the request pipeline.
 */
function _prepareRequest(options) {
  if (options === null || options === undefined || typeof options !== 'object') {
    throw new Error('options cannot be null or undefined and must be of type object')
  }

  if (options.method === null || options.method === undefined || typeof options.method.valueOf() !== 'string') {
    throw new Error('options.method cannot be null or undefined and it must be of type string.');
  }

  if (options.url && options.pathTemplate) {
    throw new Error('options.url and options.pathTemplate are mutually exclusive. Please provide either of them.')
  }


  if ((options.pathTemplate === null || options.pathTemplate === undefined || typeof options.pathTemplate.valueOf() !== 'string') && (options.url === null || options.url === undefined || typeof options.url.valueOf() !== 'string')) {
    throw new Error('Please provide either options.pathTemplate or options.url. Currently none of them were provided.');
  }

  var httpRequest = new WebResource();
  //set the url if it is provided.
  if (options.url) {
    if (typeof options.url !== 'string') {
      throw new Error('options.url must be of type \'string\'.');
    }
    httpRequest.url = options.url;
  }

  //set the method
  if (options.method) {
    var validMethods = ['GET', 'PUT', 'HEAD', 'DELETE', 'OPTIONS', 'POST', 'PATCH'];
    if (validMethods.indexOf(options.method.toUpperCase()) === -1) {
      throw new Error('The provided method \'' + options.method + '\' is invalid. Supported HTTP methods are: ' + JSON.stringify(validMethods));
    }
  }
  httpRequest.method = options.method.toUpperCase();

  //construct the url if path template is provided
  if (options.pathTemplate) {
    if (typeof options.pathTemplate !== 'string') {
      throw new Error('options.pathTemplate must be of type \'string\'.');
    }
    if (!options.baseUrl) {
      options.baseUrl = 'https://management.azure.com';
    }
    var baseUrl = options.baseUrl;
    var url = baseUrl + (baseUrl.endsWith('/') ? '' : '/') + options.pathTemplate;
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
    httpRequest.url = url;
  }

  //append query parameters to the url if they are provided. They can be provided with pathTemplate or url option.
  if (options.queryParameters) {
    if (typeof options.queryParameters !== 'object') {
      throw new Error('options.queryParameters must be of type object. It should be a JSON object ' +
        'of \'query-parameter-name\' as the key and the \'query-parameter-value\' as the value. ' +
        'The \'query-parameter-value\' may be a string or an object of the form { value: \'query-parameter-value\', skipUrlEncoding: true }.');
    }
    //append question mark if it is not present in the url
    if (httpRequest.url && httpRequest.url.indexOf('?') === -1) {
      httpRequest.url += '?';
    }
    //construct queryString
    var queryParams = [];
    var queryParameters = options.queryParameters;
    for (var queryParamName in queryParameters) {
      var queryParam = queryParameters[queryParamName];
      if (queryParam) {
        if (typeof queryParam === 'string') {
          queryParams.push(queryParamName + '=' + encodeURIComponent(queryParam));
        }
        if (typeof queryParam === 'object') {
          if (!queryParam.value) {
            throw new Error('options.queryParameters[' + queryParamName + '] is of type \'object\' but it does not contain a \'value\' property.');
          }
          if (queryParam.skipUrlEncoding) {
            queryParams.push(queryParamName + '=' + queryParameters[queryParamName]);
          } else {
            queryParams.push(queryParamName + '=' + encodeURIComponent(queryParameters[queryParamName]));
          }
        }
      }
    }//end-of-for
    //append the queryString
    httpRequest.url += queryParams.join('&');
  }

  //add headers to the request if they are provided
  if (options.headers) {
    var headers = options.headers;
    for (var headerName in headers) {
      if (headers.hasOwnProperty(headerName)) {
        httpRequest.headers[headerName] = headers[headerName];
      }
    }
  }
  //ensure accept-language is set correctly
  if (!httpRequest.headers['accept-language']) {
    httpRequest.headers['accept-language'] = 'en-US';
  }
  //ensure the request-id is set correctly
  if (!httpRequest.headers['x-ms-client-request-id'] && !options.disableClientRequestId) {
    httpRequest.headers['x-ms-client-request-id'] = utils.generateUuid();
  }
  //ensure content-type is set correctly
  if (httpRequest.headers['Content-Type'] &&
      typeof httpRequest.headers['Content-Type'].valueOf() === 'string' &&
      !httpRequest.headers['Content-Type'].endsWith('; charset=utf-8')) {
    httpRequest.headers['Content-Type'] += '; charset=utf-8';
  }

  //default
  if (!httpRequest.headers['Content-Type']) {
    httpRequest.headers['Content-Type'] = 'application/json; charset=utf-8';
  }

  //set the request body. request.js automatically sets the Content-Length request header, so we need not set it explicilty
  httpRequest.body = null;
  if (options.body !== null && options.body !== undefined) {
    //body as a stream special case. set the body as-is and check for some special request headers specific to sending a stream. 
    if (options.bodyIsStream) {
      httpRequest.body = options.body;
      if (!httpRequest.headers['Transfer-Encoding']) {
        httpRequest.headers['Transfer-Encoding'] = 'chunked';
      }
      if (httpRequest.headers['Content-Type'] !== 'application/octet-stream') {
        httpRequest.headers['Content-Type'] = 'application/octet-stream';
      }
    } else {
      httpRequest.body = JSON.stringify(options.body);
    }
  }

  return httpRequest;
}

/**
 * Sends the request and returns the response.
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
 * @param {boolean} [options.bodyIsStream] - Indicates whether the request body is a stream (useful for file upload scenarios).
 *
 * @param {function} callback
 *
 * @returns {function} callback(err, request, response, responseBody)
 *
 *                      {Error}  err      - The Error object if an error occurred, null otherwise.
 *
 *                      {object} result   - The parsed (JSON.parse()) responseBody
 *
 *                      {object} request  - The HTTP Request object.
 * 
 *                      {stream} response - The raw HTTP Response stream.
 */
ServiceClient.prototype.sendRequest = function sendRequest(options, callback) {
  if (options === null || options === undefined || typeof options !== 'object') {
    throw new Error('options cannot be null or undefined and it must be of type object.');
  }

  if (callback === null || callback === undefined) {
    throw new Error('callback cannot be null or undefined.');
  }

  var httpRequest = null;
  try {
    httpRequest = _prepareRequest(options);
  } catch (error) {
    return callback(error);
  }
  //send request
  this.pipeline(httpRequest, function (err, response, responseBody) {
    if (responseBody === '') responseBody = null;
    var result = JSON.parse(responseBody);
    return callback(err, result, httpRequest, response);
  });
};

module.exports = ServiceClient;
