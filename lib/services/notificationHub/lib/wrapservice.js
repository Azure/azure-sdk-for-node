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
var util = require('util');
var url = require('url');

var azureCommon = require('azure-common');
var ServiceClient = azureCommon.ServiceClient;

var WebResource = azureCommon.WebResource;
var Constants = azureCommon.Constants;
var ServiceClientConstants = azureCommon.ServiceClientConstants;
var HeaderConstants = Constants.HeaderConstants;

var acsTokenResult = require('./models/acstokenresult');

/**
* Creates a new WrapService object.
*
* @param {string} acsHost                 The access control host.
* @param {string} [issuer]                The service bus issuer.
* @param {string} [accessKey]             The service bus issuer password.
*/
function WrapService(acsHost, issuer, accessKey) {
  if (!acsHost) {
    var acsNamespace = process.env[ServiceClientConstants.EnvironmentVariables.AZURE_WRAP_NAMESPACE];
    if (!acsNamespace) {
      acsNamespace = process.env[ServiceClientConstants.EnvironmentVariables.AZURE_SERVICEBUS_NAMESPACE] + ServiceClientConstants.DEFAULT_WRAP_NAMESPACE_SUFFIX;
    }

    acsHost = url.format({ protocol: 'https:', port: 443, hostname: acsNamespace + '.' + ServiceClientConstants.CLOUD_ACCESS_CONTROL_HOST });
  }

  this.issuer = issuer;
  if (!this.issuer) {
    this.issuer = process.env[ServiceClientConstants.EnvironmentVariables.AZURE_SERVICEBUS_ISSUER];

    if (!this.issuer) {
      this.issuer = ServiceClientConstants.DEFAULT_SERVICEBUS_ISSUER;
    }
  }

  this.accessKey = accessKey;
  if (!this.accessKey) {
    this.accessKey = process.env[ServiceClientConstants.EnvironmentVariables.AZURE_SERVICEBUS_ACCESS_KEY];
  }

  WrapService['super_'].call(this, acsHost);

  this.authenticationProvider = {
    signRequest: function (webResource, callback) {
      callback(null);
    }
  };

  this.strictSSL = false;
}

util.inherits(WrapService, ServiceClient);

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
    .withRawResponse(true);

  webResource.withHeader(HeaderConstants.CONTENT_TYPE, 'application/x-www-form-urlencoded');

  var processResponseCallback = function (responseObject, next) {
    responseObject.acsTokenResult = null;
    if (!responseObject.error) {
      responseObject.acsTokenResult = acsTokenResult.parse(responseObject.response.body);
    }

    var finalCallback = function (returnObject) {
      callback(returnObject.error, returnObject.acsTokenResult, returnObject.response);
    };

    next(responseObject, finalCallback);
  };

  this.performRequest(webResource, acsData, options, processResponseCallback);
};

module.exports = WrapService;