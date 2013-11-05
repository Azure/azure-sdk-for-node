/*
* @copyright
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

var util = require('util');
var _ = require('underscore');

var Constants = require('../../util/constants');
var HeaderConstants = Constants.HeaderConstants;
var WebResource = require('../../http/webresource');
var ServiceManagementClient = require('../core/servicemanagementclient');
var ServiceManagementSettings = require('../core/servicemanagementsettings');
var atomHandler = require('../../util/atomhandler');
var validate = require('../../util/validate');
var js2xml = require('../../util/js2xml');

// Client for making requests to service bus endpoint

/**
*
* Creates a new ServiceBusManagementService object
* @class
* The ServiceBusManagementService allows you to perform management operations on Windows Azure Service Bus.
* @constructor
* 
* @param {string} subscriptionId                                      Subscription ID for the account or the connection string.
* @param {object} authentication                                      The authentication object for the client.
*                                                                     You must use either keyfile/certfile or keyvalue/certvalue
*                                                                     to provide a management certificate to authenticate
*                                                                     service requests.
* @param {string} [authentication.keyfile]                            The path to a file that contains the PEM encoded key
* @param {string} [authentication.certfile]                           The path to a file that contains the PEM encoded certificate
* @param {string} [authentication.keyvalue]                           A string that contains the PEM encoded key
* @param {string} [authentication.certvalue]                          A string that contains the PEM encoded certificate
* @param {object} [hostOptions]                                       The host options to override defaults.
* @param {string} [hostOptions.host='management.core.windows.net']    The management endpoint.
* @param {string} [hostOptions.apiversion='2012-03-01']               The API vesion to be used.
*/
function ServiceBusManagementService(subscriptionId, authentication, hostOptions) {
  var settings = ServiceManagementSettings.createFromParameters(subscriptionId, authentication, hostOptions);

  ServiceBusManagementService['super_'].call(this, settings);

  this.subscriptionId = settings._subscriptionId;
}

util.inherits(ServiceBusManagementService, ServiceManagementClient);

var stringToBoolTable = {
  'true': true,
  'false': false
};

function toBool(value) {
  return stringToBoolTable[value.toLowerCase()];
}

function createEntry(payloadElementName, payload) {
  var entry = {
    entry: {
      '$': { xmlns: Constants.ATOM_NAMESPACE },
      content: {
        '$': { type: 'application/xml' }
      }
    }
  };

  entry.entry.content[payloadElementName] = payload;
  entry.entry.content[payloadElementName].$ = { xmlns: Constants.SB_NAMESPACE };
  return entry;
}
_.extend(ServiceBusManagementService.prototype, {
  /**
  * List the service bus namespaces defined on the account
  * @memberof ServiceBusManagementService#
  *
  * @param {Function(error, results)} callback  `error` will contain information
  *                                              if an error occurs; otherwise `results` will contain
  *                                              an array of namespaces.
  */
  listNamespaces: function (callback) {
    validate.validateArgs('listNamespaces', function (v) {
      v.callback(callback);
    });

    var path = this._makePath('Namespaces');
    this._getResult(path, null, 'get', 'NamespaceDescription', callback);
  },

  /**
  * Get details about a specific namespace
  * @memberof ServiceBusManagementService#
  *
  * @param {string} namespaceName name of the namespace to get details about
  *
  * @param {Function(error, results)} callback    `error` will contain information
  *                                              if an error occurs; otherwise `results` will contain
  *                                              the namespace information.
  */
  getNamespace: function (namespaceName, callback) {
    validate.validateArgs('getNamespace', function (v) {
      v.string(namespaceName, 'namespaceName');
      v.callback(callback);
    });

    var path = this._makePath('Namespaces') + namespaceName;
    this._getResult(path, null, 'get', 'NamespaceDescription', callback);
  },

  /**
  * Create a new Service Bus namespace
  * @memberof ServiceBusManagementService#
  *
  * @param {string} namespaceName name of the namespace to create
  *
  * @param {string} region region to create the namespace in
  *
  * @param {Function(error, namespace)} callback `error` will contain information
  *                                              if an error occurs; otherwise `namespace` will contain
  *                                              the new namespace information.
  */
  createNamespace: function (namespaceName, region, callback) {
    var that = this;

    validate.validateArgs('createNamespace', function (v) {
      v.string(namespaceName, 'namespaceName');
      v.string(region, 'region');
      v.callback(callback);
    });

    validate.namespaceNameIsValid(namespaceName, function (err) {
      if (err) { return callback(err); }
      var path = that._makePath('Namespaces') + namespaceName;
      var body = js2xml.serialize(createEntry('NamespaceDescription', { Region: region }));
      that._getResult(path, null, 'put', body, 'NamespaceDescription', callback);
    });
  },

  /**
  * Delete a service bus namespace
  * @memberof ServiceBusManagementService#
  *
  * @param {string} namespaceName name of namespace to delete
  * @param {Function(error, results)} callback  `error` will contain information
  *                                              if an error occurs; otherwise `results` will contain
  *                                              the results of this operation.
  */
  deleteNamespace: function (namespaceName, callback) {
    var that = this;
    validate.validateArgs('deleteNamespace', function (v) {
      v.string(namespaceName, 'namespaceName');
    });

    validate.namespaceNameIsValid(namespaceName, function (err) {
      if (err) { return callback(err); }
      var path = that._makePath('Namespaces') + namespaceName;
      that._getResult(path, null, 'del', 'NamespaceDescription', callback);
    });
  },

  /**
  * Get list of available Service Bus regions
  * @memberof ServiceBusManagementService#
  *
  * @param {Function(error, results)} callback    `error` will contain information
  *                                              if an error occurs; otherwise `results` will contain
  *                                              an array of available regions.
  */
  getRegions: function (callback) {
    validate.validateArgs('getRegions', function (v) { v.callback(callback); });

    var path = this._makePath('Regions');
    this._getResult(path, null, 'get', 'RegionCodeDescription', callback);
  },

  /**
  * Verify that a namespace name is valid and available.
  * @memberof ServiceBusManagementService#
  *
  * @param {string} name namespace name to validate
  * @param {Function(error, results)} callback    `error` will contain information
  *                                              if an error occurs; otherwise `results` will contain
  *                                              the results of this operation.
  */
  verifyNamespace: function (name, callback) {
    var that = this;
    validate.namespaceNameIsValid(name, function (err) {
      if (err) {
        return callback(err);
      }
      var path = that._makePath('CheckNamespaceAvailability');
      that._getResult(path, { namespace: name }, 'get', 'NamespaceAvailability', function (err, result) {
        if (err) {
          return callback(err);
        }

        callback(null, toBool(result.Result));
      });
    });
  },

  _makePath: function (operationName) {
    return '/' + this.subscriptionId + '/services/ServiceBus/' + operationName + '/';
  },

  _getResult: function (path, queryString, verb, requestBody, responseContentElementName, callback) {
    // requestBody can be omitted, normalize arguments if that's the case
    if (_.isFunction(responseContentElementName)) {
      callback = responseContentElementName;
      responseContentElementName = requestBody;
      requestBody = null;
    }

    var webResource = WebResource[verb](path);
    if (queryString) {
      webResource.queryString = queryString;
    }

    if (requestBody) {
      webResource.withHeader(HeaderConstants.CONTENT_LENGTH, Buffer.byteLength(requestBody));
    }

    this.performRequest(webResource, requestBody, null, function (responseObject, next) {
      var finalCallback = function (returnObject) {
        if (!returnObject.response.isSuccessful) {
          return callback(returnObject.error, returnObject.response);
        }

        var result = atomHandler.parse(returnObject.response.body, responseContentElementName);
        callback(null, result);
      };

      next(responseObject, finalCallback);
    });
  },

  // base hard codes content type, so we have to override here
  // instead of passing it in the request headers.
  _getContentType: function () {
    return 'application/xml;type=entry;charset="utf-8"';
  }
});

module.exports = ServiceBusManagementService;