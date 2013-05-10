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

var ServiceClient = require('./serviceclient');
var Wrap = require('../serviceBus/internal/wrap');
var SharedAccessSignature = require('../serviceBus/internal/sharedaccesssignature');
var Constants = require('../../util/constants');
var HeaderConstants = Constants.HeaderConstants;

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
ServiceBusServiceClient.prototype._buildRequestOptions = function (webResource, options, callback) {
  var self = this;

  if (!webResource.headers || !webResource.headers[HeaderConstants.CONTENT_TYPE]) {
    webResource.withHeader(HeaderConstants.CONTENT_TYPE, '');
  }

  if (!webResource.headers || !webResource.headers[HeaderConstants.CONTENT_LENGTH]) {
    webResource.withHeader(HeaderConstants.CONTENT_LENGTH, 0);
  }

  webResource.withHeader(HeaderConstants.ACCEPT_CHARSET_HEADER, 'UTF-8');
  webResource.withHeader(HeaderConstants.HOST_HEADER, this.host + ':' + this.port);

  // Set API version
  if (webResource.queryString[Constants.ServiceBusConstants.API_VERSION_QUERY_KEY] === undefined) {
    webResource.withQueryOption(Constants.ServiceBusConstants.API_VERSION_QUERY_KEY, Constants.ServiceBusConstants.CURRENT_API_VERSION);
  } else if (webResource.queryString[Constants.ServiceBusConstants.API_VERSION_QUERY_KEY] === null) {
    delete webResource.queryString[Constants.ServiceBusConstants.API_VERSION_QUERY_KEY];
  }

  // Sets the request url in the web resource.
  this._setRequestUrl(webResource);

  // If wrap is used, make sure proxy settings are in sync
  if (this.useProxy &&
      this.authenticationProvider &&
      this.authenticationProvider.wrapTokenManager &&
      this.authenticationProvider.wrapTokenManager.wrapService) {
    this.authenticationProvider.wrapTokenManager.wrapService.setProxy(this.proxyUrl, this.proxyPort);
  }

  // Now that the web request is finalized, sign it
  this.authenticationProvider.signRequest(webResource, function (error) {
    var requestOptions = null;

    if (!error) {
      requestOptions = {
        url: url.format({
          protocol: self._isHttps() ? 'https:' : 'http:',
          hostname: self.host,
          port: self.port,
          pathname: webResource.path,
          query: webResource.queryString
        }),
        method: webResource.httpVerb,
        headers: webResource.headers,
        strictSSL: self.strictSSL
      };

      self._setRequestOptionsProxy(requestOptions);
    }

    callback(error, requestOptions);
  });
};

/**
* Retrieves the normalized path to be used in a request.
* It adds a leading "/" to the path in case
* it's not there before.
*
* @param {string} path The path to be normalized.
* @return {string} The normalized path.
*/
ServiceBusServiceClient.prototype._getPath = function (path) {
  if (path === null || path === undefined) {
    path = '/';
  } else if (path.indexOf('/') !== 0) {
    path = '/' + path;
  }

  return path;
};

module.exports = ServiceBusServiceClient;