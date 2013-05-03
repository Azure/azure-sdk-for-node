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
var _ = require('underscore');

var ServiceManagementClient = require('../core/servicemanagementclient');
var WebResource = require('../../http/webresource');

// var js2xml = require('../../util/js2xml');
// var Constants = require('../../util/constants');

/**
*
* Creates a new HDInsightService object
*
* @constructor
* @param {string} subscriptionId   Subscription ID for the account or the connection string
* @param {object} authentication                    The authentication object for the client.
*                                                   {
*                                                     keyfile: 'path to .pem',
*                                                     certfile: 'path to .pem',
*                                                     keyvalue: privatekey value,
*                                                     certvalue: public cert value
*                                                   }
* @param {object} hostOptions                       The host options to override defaults.
*                                                   {
*                                                     host: 'management.core.windows.net',
*                                                     apiversion: '2012-03-01',
*                                                     serializetype: 'XML'
*                                                   }
*/
function HDInsightService(subscriptionId, authentication, hostOptions) {
  if (typeof subscriptionId != 'string' || subscriptionId.length === 0) {
    throw new Error('A subscriptionId or a connection string is required');
  }

  if (!hostOptions) {
    hostOptions = { };
  }

  hostOptions.serializetype = 'XML';
  HDInsightService['super_'].call(this, authentication, hostOptions);

  this.subscriptionId = subscriptionId;
}

util.inherits(HDInsightService, ServiceManagementClient);

HDInsightService.prototype.listClusters = function (callback) {
  var path = this._makePath('servers');
  var webResource = WebResource.get(path);

  this.performRequest(webResource, null, null, function (responseObject, next) {
    if (!responseObject.error) {
      responseObject.sqlServers = [];
      if (responseObject.response.body.Servers && responseObject.response.body.Servers.Server) {
        responseObject.sqlServers = responseObject.response.body.Servers.Server;
        if (!_.isArray(responseObject.sqlServers)) {
          responseObject.sqlServers = [ responseObject.sqlServers ];
        }
      }
    }

    var finalCallback = function (returnObject) {
      callback(returnObject.error, returnObject.sqlServers, returnObject.response);
    };

    next(responseObject, finalCallback);
  });
};

HDInsightService.prototype._makePath = function (operationName) {
  return '/' + this.subscriptionId + '/services/sqlservers/' + operationName;
};
module.exports = HDInsightService;
