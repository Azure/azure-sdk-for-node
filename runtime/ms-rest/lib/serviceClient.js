// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

'use strict';

var url = require('url');
var Constants = require('./constants');
var ProxyFilter = require('./filters/proxyFilter');
var UserAgentFilter = require('./filters/userAgentFilter');
var RedirectFilter = require('./filters/redirectFilter');
var SigningFilter = require('./filters/signingFilter');
var ExponentialRetryPolicyFilter = require('./filters/exponentialRetryPolicyFilter');
var SystemErrorRetryPolicyFilter = require('./filters/systemErrorRetryPolicyFilter');
var requestPipeline = require('./requestPipeline');
var WebResource = require('./webResource');
var utils = require('./utils');
var packageJson = require('../package.json');
var moduleName = packageJson.name;
var moduleVersion = packageJson.version;

var userAgentInfo;

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

  userAgentInfo = [];

  if (credentials && !credentials.signRequest) {
    throw new Error('credentials argument needs to implement signRequest method');
  }

  this.addUserAgentInfo(`${moduleName}/${moduleVersion}`);

  if (credentials) {
    options.filters.push(SigningFilter.create(credentials));
  }

  options.filters.push(UserAgentFilter.create(userAgentInfo));
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
 * Sends the request and returns the response.
 *
 * @param {object|WebResource} options The request options that should be provided to send a request successfully. 
 * It can either be an options object (a simple json object) or the WebResource object with all the required properties set to make a request.
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
 * @param {boolean} [options.disableJsonStringifyOnBody] - When set to true, this method will not apply `JSON.stringify()` to the request body. Default value: false.
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
    if (options instanceof WebResource) {
      options.validateRequestProperties();
      httpRequest = options;
    } else {
      httpRequest = new WebResource();
      httpRequest = httpRequest.prepare(options);
    }
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

ServiceClient.prototype.addUserAgentInfo = function addUserAgentInfo(additionalUserAgentInfo) {
  userAgentInfo.push(additionalUserAgentInfo);
};

module.exports = ServiceClient;
