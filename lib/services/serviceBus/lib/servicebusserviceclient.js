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

var azureCommon = require('azure-common');
var ServiceClient = azureCommon.ServiceClient;
var Constants = azureCommon.Constants;
var HeaderConstants = Constants.HeaderConstants;

var Wrap = require('./internal/wrap');
var SharedAccessSignature = require('./internal/sharedaccesssignature');

/**
* Creates a new ServiceBusServiceClient object.
*
* @constructor
* @param {string} [accessKey]               The password.
* @param {string} [issuer]                  The issuer.
* @param {string} [sharedAccessKeyName]     The notification hub shared access key name.
* @param {string} [sharedAccessKeyValue]    The notification hub shared access key value.
* @param {string} [host]                    The host for the service.
* @param {string} [acsHost]                 The acs host. Usually the same as the sb namespace with "-sb" suffix.
* @param {object} [authenticationProvider]  The authentication provider.
*/
function ServiceBusServiceClient(accessKey, issuer, sharedAccessKeyName, sharedAccessKeyValue, host, acsHost, authenticationProvider) {
  ServiceBusServiceClient['super_'].call(this, host, authenticationProvider);

  this.authenticationProvider = authenticationProvider;
  if (!this.authenticationProvider) {
    if (sharedAccessKeyName && sharedAccessKeyValue) {
      this.authenticationProvider = new SharedAccessSignature(sharedAccessKeyName, sharedAccessKeyValue);
    } else {
      this.authenticationProvider = new Wrap(acsHost, issuer, accessKey);
    }
  }

  this.apiVersion = Constants.ServiceBusConstants.CURRENT_API_VERSION;
}

util.inherits(ServiceBusServiceClient, ServiceClient);

/**
* Builds the request options to be passed to the http.request method.
*
* @param {WebResource} webResource The webresource where to build the options from.
* @param {object}      options     The request options.
* @param {function(error, requestOptions)}  callback  The callback function.
*/
ServiceBusServiceClient.prototype._buildRequestOptions = function (webResource, body, options, callback) {
  webResource.withHeader(HeaderConstants.ACCEPT_CHARSET_HEADER, 'UTF-8');

  // Set API version
  if (webResource.queryString[Constants.ServiceBusConstants.API_VERSION_QUERY_KEY] === undefined) {
    webResource.withQueryOption(Constants.ServiceBusConstants.API_VERSION_QUERY_KEY, Constants.ServiceBusConstants.CURRENT_API_VERSION);
  } else if (webResource.queryString[Constants.ServiceBusConstants.API_VERSION_QUERY_KEY] === null) {
    delete webResource.queryString[Constants.ServiceBusConstants.API_VERSION_QUERY_KEY];
  }

  // If wrap is used, make sure proxy settings are in sync
  if (this.useProxy &&
      this.authenticationProvider &&
      this.authenticationProvider.wrapTokenManager &&
      this.authenticationProvider.wrapTokenManager.wrapService) {
    this.authenticationProvider.wrapTokenManager.wrapService.setProxy(this.proxyUrl, this.proxyPort);
  }

  ServiceBusServiceClient['super_'].prototype._buildRequestOptions.call(this, webResource, body, options, callback);
};

module.exports = ServiceBusServiceClient;