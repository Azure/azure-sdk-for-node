/**
* Copyright 2011 Microsoft Corporation
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

var azureutil = require('../../util/util');

var ServiceClient = require('./serviceclient');
var Wrap = require('../serviceBus/wrap');
var Constants = require('../../util/constants');
var HeaderConstants = Constants.HeaderConstants;
var QueryStringConstants = Constants.QueryStringConstants;
var HttpConstants = Constants.HttpConstants;

// Expose 'ServiceBusServiceClient'.
exports = module.exports = ServiceBusServiceClient;

/**
* Creates a new ServiceBusServiceClient object.
*
* @constructor
* @param {string} host                    The host for the service.
* @param {string} [namespace]               The service bus namespace.
* @param {string} [accessKey]               The password.
* @param {string} [issuer]                  The issuer.
* @param {string} [acsNamespace]            The acs namespace. Usually the same as the sb namespace with "-sb" suffix.
* @param {string} [host]                    The host address.
* @param {object} [authenticationProvider]  The authentication provider.
*/
function ServiceBusServiceClient(host, namespace, accessKey, issuer, acsNamespace, authenticationProvider) {
  this.namespace = namespace;
  if (!this.namespace) {
    this.namespace = process.env[ServiceClient.EnvironmentVariables.AZURE_SERVICEBUS_NAMESPACE];
  }

  this.acsNamespace = acsNamespace;
  if (!this.acsNamespace) {
    this.acsNamespace = process.env[ServiceClient.EnvironmentVariables.AZURE_WRAP_NAMESPACE];

    if (!this.acsNamespace) {
      this.acsNamespace = this.namespace + ServiceClient.DEFAULT_WRAP_NAMESPACE_SUFFIX;
    }
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

  ServiceBusServiceClient.super_.call(this, host, authenticationProvider);

  this.protocol = 'https://';
  this.port = 443;

  if (!this.authenticationProvider) {
    this.authenticationProvider = new Wrap(this.acsNamespace, this.issuer, this.accessKey);
  }
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
    webResource.addOptionalHeader(HeaderConstants.CONTENT_TYPE, '');
  }

  webResource.addOptionalHeader(HeaderConstants.ACCEPT_CHARSET_HEADER, 'UTF-8');
  webResource.addOptionalHeader(HeaderConstants.HOST_HEADER, this.getHostname() + ':' + this.port);

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
        method: webResource.httpVerb,
        path: webResource.requestUrl,
        host: self.getRequestHost(),
        port: self.getRequestPort(),
        headers: webResource.headers
      };
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
ServiceBusServiceClient.prototype.getPath = function (path) {
  if (path === null || path === undefined) {
    path = '/';
  } else if (path.indexOf('/') !== 0) {
    path = '/' + path;
  }

  return path;
};

/**
* Retrives the hostname.
*
* @return {string} The hostname.
*/
ServiceBusServiceClient.prototype.getHostname = function () {
  return this.namespace + '.' + this.host;
};