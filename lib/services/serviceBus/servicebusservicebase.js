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
var _ = require('underscore');
var util = require('util');
var url = require('url');

var ServiceBusServiceClient = require('../core/servicebusserviceclient');

var WebResource = require('../../http/webresource');
var Constants = require('../../util/constants');
var ServiceClientConstants = require('../core/serviceclientconstants');
var QueryStringConstants = Constants.QueryStringConstants;
var HeaderConstants = Constants.HeaderConstants;

var ServiceSettings = require('../core/servicesettings');
var ServiceBusSettings = require('../core/servicebussettings');

/**
* Creates a new ServiceBusServiceBase object.
*
* @constructor
* @augments {ServiceClient}
*
* @param {string} [configOrNamespaceOrConnectionStringOrSettings]  The sdk configuraiton, service bus namespace, the connection string, or service settings.
* @param {string} [accessKey]                              The password. Only necessary if no connection string passed.
* @param {string} [issuer]                                 The issuer.
* @param {string} [acsNamespace]                           The acs namespace. Usually the same as the sb namespace with "-sb" suffix.
* @param {string} [host]                                   The host address.
* @param {object} [authenticationProvider]                 The authentication provider.
*/
function ServiceBusServiceBase(configOrNamespaceOrConnectionStringOrSettings, accessKey, issuer, acsNamespace, host, authenticationProvider) {
  var serviceBusSettings;
  if(!configOrNamespaceOrConnectionStringOrSettings || _.isFunction(configOrNamespaceOrConnectionStringOrSettings)) {
    // It's a config or blank. Create from config, which will handle
    // defaulting back to environment vars if needed.
    serviceBusSettings = ServiceBusSettings.createFromConfig(configOrNamespaceOrConnectionStringOrSettings);
  } else if (_.isObject(configOrNamespaceOrConnectionStringOrSettings)) {
    serviceBusSettings = configOrNamespaceOrConnectionStringOrSettings;
  } else if (configOrNamespaceOrConnectionStringOrSettings && accessKey === undefined) {
    // If namespaceOrConnectionString was passed and no accessKey was passed, assume connection string
    serviceBusSettings = ServiceBusSettings.createFromConnectionString(configOrNamespaceOrConnectionStringOrSettings);
  } else {
    if (!configOrNamespaceOrConnectionStringOrSettings) {
      configOrNamespaceOrConnectionStringOrSettings = process.env[ServiceClientConstants.EnvironmentVariables.AZURE_SERVICEBUS_NAMESPACE];
    }

    if (!accessKey) {
      accessKey = process.env[ServiceClientConstants.EnvironmentVariables.AZURE_SERVICEBUS_ACCESS_KEY];
    }

    if (!issuer) {
      issuer = process.env[ServiceClientConstants.EnvironmentVariables.AZURE_SERVICEBUS_ISSUER];

      if (!issuer) {
        issuer = ServiceClientConstants.DEFAULT_SERVICEBUS_ISSUER;
      }
    }

    if (!acsNamespace) {
      acsNamespace = process.env[ServiceClientConstants.EnvironmentVariables.AZURE_WRAP_NAMESPACE];

      if (!acsNamespace) {
        acsNamespace = configOrNamespaceOrConnectionStringOrSettings + ServiceClientConstants.DEFAULT_WRAP_NAMESPACE_SUFFIX;
      }
    }

    var endpoint = url.format({ protocol: 'https:', port: 443, hostname: configOrNamespaceOrConnectionStringOrSettings + '.' + ServiceClientConstants.CLOUD_SERVICEBUS_HOST });
    var stsendpoint = url.format({ protocol: 'https:', port: 443, hostname: acsNamespace + '.' + ServiceClientConstants.CLOUD_ACCESS_CONTROL_HOST });

    if (host) {
      endpoint = url.format(ServiceSettings.parseHost(host));
    }

    var settings = {
      endpoint: endpoint,
      sharedsecretissuer: issuer,
      sharedsecretvalue: accessKey,
      stsendpoint: stsendpoint
    };

    serviceBusSettings = ServiceBusSettings.createFromSettings(settings);
  }

  ServiceBusServiceBase['super_'].call(this,
    serviceBusSettings._wrapPassword,
    serviceBusSettings._wrapName,
    serviceBusSettings._sharedAccessKeyName,
    serviceBusSettings._sharedAccessKey,
    serviceBusSettings._serviceBusEndpointUri,
    serviceBusSettings._wrapEndpointUri,
    authenticationProvider);

  this.xml2jsSettings.ignoreAttrs = true;
}

util.inherits(ServiceBusServiceBase, ServiceBusServiceClient);

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

/**
* Creates a resource.
*
* @param {string}             path                                                The resource path.
* @param {object}             handler                                             The resource handler.
* @param {object|function}    [optionsOrCallback]                                 The request options or callback function.
* @param {function(error, response)} callback                                     The callback function.
* @return {undefined}
*/
ServiceBusServiceBase.prototype._createResource = function (path, handler, validators, optionsOrCallback, callback) {
  var options = null;
  if (typeof optionsOrCallback === 'function' && !callback) {
    callback = optionsOrCallback;
  } else {
    options = optionsOrCallback;
  }

  validateCallback(callback);

  var resource = handler.serialize(options);

  var webResource = WebResource.put(path);
  webResource.withHeader(HeaderConstants.CONTENT_TYPE, 'application/atom+xml;type=entry;charset=utf-8');
  webResource.withHeader(HeaderConstants.CONTENT_LENGTH, Buffer.byteLength(resource, 'utf8'));

  this._executeRequest(webResource, resource, handler, validators, callback);
};

/**
* Retrieves a resource.
*
* @param {string}             path                                                A string object that represents the resource name.
* @param {object}             handler                                             The resource handler.
* @param {function(error, resource, response)} callback                           The callback function.
* @return {undefined}
*/
ServiceBusServiceBase.prototype._getResource = function (path, handler, validators, callback) {
  validateCallback(callback);

  var webResource = WebResource.get(path);

  this._executeRequest(webResource, null, handler, validators, callback);
};

/**
* Returns a list of resources.
*
* @param {string}             path                                                A string object that represents the resource name.
* @param {object}             handler                                             The resource handler.
* @param {object|function}    [optionsOrCallback]                                 The request options or callback function.
* @param {int}                [optionsOrCallback.top]                             The number of topics to fetch.
* @param {int}                [optionsOrCallback.skip]                            The number of topics to skip.
* @param {function(error, resources, response)} callback                          The callback function.
* @return {undefined}
*/
ServiceBusServiceBase.prototype._listResources = function (path, handler, validators, optionsOrCallback, callback) {
  var options = null;
  if (typeof optionsOrCallback === 'function' && !callback) {
    callback = optionsOrCallback;
  } else {
    options = optionsOrCallback;
  }

  validateCallback(callback);

  var webResource = WebResource.get(path);

  if (options) {
    webResource.withQueryOption(QueryStringConstants.TOP, options.top);
    webResource.withQueryOption(QueryStringConstants.SKIP, options.skip);
  }

  this._executeRequest(webResource, null, handler, validators, callback);
};

/**
* Deletes a resource.
*
* @param {string}             path                                                The resource path.
* @param {function(error, response)} callback                                     The callback function.
* @return {undefined}
*/
ServiceBusServiceBase.prototype._deleteResource = function (path, callback) {
  validateCallback(callback);

  var webResource = WebResource.del(path);

  this._executeRequest(webResource, null, null, null, callback);
};

/**
* Executes a request.
*
* @param {WebResource}        webResource                                         The webresource.
* @param {string}             payload                                             The request payload.
* @param {object}             resultHandler                                       The result handler.
* @param {array}              validators                                          An array of validator functions for the response object.
* @param {function(error, response)} callback                                     The callback function.
* @return {undefined}
*/
ServiceBusServiceBase.prototype._executeRequest = function (webResource, payload, resultHandler, validators, callback) {
  var processResponseCallback = function (responseObject, next) {
    if (resultHandler) {
      responseObject.result = null;

      if (!responseObject.error && (!validators || !validators.some(function (v) { return !v(responseObject); }))) {
        responseObject.result = resultHandler.parse(responseObject.response.body);
      }
    }

    var finalCallback = function (returnObject) {
      if (returnObject.result !== undefined) {
        callback(returnObject.error, returnObject.result, returnObject.response);
      } else {
        callback(returnObject.error, returnObject.response);
      }
    };

    next(responseObject, finalCallback);
  };

  this.performRequest(webResource, payload, null, processResponseCallback);
};

module.exports = ServiceBusServiceBase;
