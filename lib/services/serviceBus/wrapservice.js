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
var util = require('util');
var url = require('url');

var azureutil = require('../../util/util');

var ServiceClient = require('../core/serviceclient');

var WebResource = require('../../http/webresource');
var Constants = require('../../util/constants');
var QueryStringConstants = Constants.QueryStringConstants;
var HttpConstants = Constants.HttpConstants;
var HeaderConstants = Constants.HeaderConstants;

var AcsTokenResult = require('./models/acstokenresult');

// Expose 'WrapService'.
exports = module.exports = WrapService;

/**
* Creates a new WrapService object.
*
* @param {string} acsHost                 The access control host.
* @param {string} [issuer]                The service bus issuer.
* @param {string} [accessKey]             The service bus issuer password.
*/
function WrapService(acsHost, issuer, accessKey) {
  if (!acsHost) {
    var acsNamespace = process.env[ServiceClient.EnvironmentVariables.AZURE_WRAP_NAMESPACE];
    if (!acsNamespace) {
      acsNamespace = process.env[ServiceClient.EnvironmentVariables.AZURE_SERVICEBUS_NAMESPACE] + ServiceClient.DEFAULT_WRAP_NAMESPACE_SUFFIX;
    }

    acsHost = url.format({ protocol: 'https:', port: 443, hostname: acsNamespace + '.' + ServiceClient.CLOUD_ACCESS_CONTROL_HOST });
  }

  this.issuer = issuer;
  if (!this.issuer) {
    this.issuer = process.env[ServiceClient.EnvironmentVariables.AZURE_SERVICEBUS_ISSUER];

    if (!this.issuer) {
      this.issuer = ServiceClient.DEFAULT_SERVICEBUS_ISSUER;
    }
  }

  this.accessKey = accessKey;
  if (!this.accessKey) {
    this.accessKey = process.env[ServiceClient.EnvironmentVariables.AZURE_SERVICEBUS_ACCESS_KEY];
  }

  WrapService.super_.call(this, acsHost);
}

util.inherits(WrapService, ServiceClient);

WrapService.prototype.wrapAccessToken = function (uri, optionsOrCallback, callback) {
  var options = null;
  if (typeof optionsOrCallback === 'function' && !callback) {
    callback = optionsOrCallback;
  } else {
    options = optionsOrCallback;
  }

  validateCallback(callback);

  var acsData = 'wrap_name=' + encodeURIComponent(this.issuer) +
                '&wrap_password=' + encodeURIComponent(this.accessKey) +
                '&wrap_scope=' + encodeURIComponent(uri);

  var webResource = WebResource.post('WRAPv0.9/')
    .withOkCode(HttpConstants.HttpResponseCodes.OK_CODE)
    .withRawResponse(true);

  webResource.addOptionalHeader(HeaderConstants.CONTENT_TYPE, 'application/x-www-form-urlencoded');

  var processResponseCallback = function (responseObject, next) {
    responseObject.acsTokenResult = null;
    if (!responseObject.error) {
      responseObject.acsTokenResult = AcsTokenResult.parse(responseObject.response.body);
    }

    var finalCallback = function (returnObject) {
      callback(returnObject.error, returnObject.acsTokenResult, returnObject.response);
    };

    next(responseObject, finalCallback);
  };

  this.performRequest(webResource, acsData, options, processResponseCallback);
};

WrapService.prototype._buildRequestOptions = function (webResource, options, callback) {
  var self = this;

  if (!webResource.headers || !webResource.headers[HeaderConstants.CONTENT_TYPE]) {
    webResource.addOptionalHeader(HeaderConstants.CONTENT_TYPE, '');
  }

  if (!webResource.headers || !webResource.headers[HeaderConstants.CONTENT_LENGTH]) {
    webResource.addOptionalHeader(HeaderConstants.CONTENT_LENGTH, 0);
  }

  // Sets the request url in the web resource.
  this._setRequestUrl(webResource);

  var requestOptions = {
    url: url.format({
      protocol: self._isHttps() ? 'https:' : 'http:',
      hostname: self.host,
      port: self.port,
      pathname: webResource.path + webResource.getQueryString(true)
    }),
    method: webResource.httpVerb,
    headers: webResource.headers
  };

  callback(null, requestOptions);
};

/**
* Retrieves the normalized path to be used in a request.
* It adds a leading "/" to the path in case
* it's not there before.
*
* @param {string} path The path to be normalized.
* @return {string} The normalized path.
*/
WrapService.prototype._getPath = function (path) {
  if (path === null || path === undefined) {
    path = '/';
  } else if (path.indexOf('/') !== 0) {
    path = '/' + path;
  }

  return path;
};

/**
* Validates a callback function.
*
* @param (function) callback The callback function.
* @return {undefined}
*/
function validateCallback(callback) {
  if (!callback) {
    throw new Error('Callback must be specified.');
  }
}