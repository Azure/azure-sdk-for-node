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
var xml2js = require('xml2js');

var ServiceManagementClient = require('../core/servicemanagementclient');
var WebResource = require('../../http/webresource');

var js2xml = require('../../util/js2xml');
var parseserverresponse = require('./models/parseserverresponse');
var Constants = require('../../util/constants');
var HttpConstants = Constants.HttpConstants;

// Expose 'SqlManagementService'.
exports = module.exports = SqlManagementService;

/**
*
* Creates a new SqlManagementService object
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

function SqlManagementService(subscriptionId, authentication, hostOptions) {
  if (typeof subscriptionId != 'string' || subscriptionId.length === 0) {
    throw new Error('A subscriptionId or a connection string is required');
  }

  if (!hostOptions) {
    hostOptions = { };
  }

  hostOptions.serializetype = 'XML';
  SqlManagementService.super_.call(this, authentication, hostOptions);

  this.subscriptionId = subscriptionId;
}

util.inherits(SqlManagementService, ServiceManagementClient);

/**
* Lists the available SQL Servers.
*
* @param {function} callback function (err, results, response) The callback function called on completion. Required.
*/
SqlManagementService.prototype.listServers = function (callback) {
  var path = this._makePath('servers');
  var webResource = WebResource.get(path);
  webResource.withOkCode(HttpConstants.HttpResponseCodes.OK_CODE, true);

  this.performRequest(webResource, null, null, function (responseObject, next) {
    if (!responseObject.error) {
      responseObject.sqlServers = [];
      if (responseObject.response.body.Servers && responseObject.response.body.Servers.Server) {
        responseObject.sqlServers = parseserverresponse(responseObject.response.body.Servers.Server);
      }
    }

    var finalCallback = function (returnObject) {
      callback(returnObject.error, returnObject.sqlServers, returnObject.response);
    };

    next(responseObject, finalCallback);
  });
};

/**
* Deletes a SQL Server.
*
* @param {string}   name                The SQL Server name.
* @param {function} callback            function (err, response) The callback function called on completion. Required.
*/
SqlManagementService.prototype.deleteServer = function (name, callback) {
  var path = this._makePath('servers') + '/' + name;
  var webResource = WebResource.del(path);

  this.performRequest(webResource, null, null, function (responseObject, next) {
    var finalCallback = function (returnObject) {
      callback(returnObject.error, returnObject.response);
    };

    next(responseObject, finalCallback);
  });
};

/**
* Creates a SQL Server.
*
* @param {string}   administratorLogin          The administrator's login.
* @param {string}   administratorLoginPassword  The administrator's password.
* @param {string}   location                    The server's location.
* @param {function} callback                    function (err, server, response) The callback function called on completion. Required.
*/
SqlManagementService.prototype.createServer = function (administratorLogin, administratorLoginPassword, location, callback) {
  var path = this._makePath('servers');
  var webResource = WebResource.post(path);

  var createServerRequestBody = {
    Server: {
      '$': {
        xmlns: 'http://schemas.microsoft.com/sqlazure/2010/12/',
        'xmlns:i': 'http://www.w3.org/2001/XMLSchema-instance'
      },
      AdministratorLogin: administratorLogin,
      AdministratorLoginPassword: administratorLoginPassword,
      Location: location
    }
  };

  var createServerRequestBodyXml = js2xml.serialize(createServerRequestBody);

  this.performRequest(webResource, createServerRequestBodyXml, null, function (responseObject, next) {
    if (!responseObject.error) {
      responseObject.serverName = null;
      if (responseObject.response.body.ServerName) {
        responseObject.serverName = responseObject.response.body.ServerName[Constants.XML_VALUE_MARKER];
      }
    }

    var finalCallback = function (returnObject) {
      callback(returnObject.error, returnObject.serverName, returnObject.response);
    };

    next(responseObject, finalCallback);
  });
};

/**
* Lists SQL Server firewall rules.
*
* @param {string}   serverName          The server name.
* @param {function} callback            function (err, results, response) The callback function called on completion. Required.
*/
SqlManagementService.prototype.listServerFirewallRules = function (serverName, callback) {
  var path = this._makePath('servers') + '/' + serverName + '/firewallrules';
  var webResource = WebResource.get(path);
  webResource.withOkCode(HttpConstants.HttpResponseCodes.OK_CODE, true);

  this.performRequest(webResource, null, null, function (responseObject, next) {
    if (!responseObject.error) {
      responseObject.firewallRules = [];

      if (responseObject.response.body.ServiceResources && responseObject.response.body.ServiceResources.ServiceResource) {
        responseObject.firewallRules = parseserverresponse(responseObject.response.body.ServiceResources.ServiceResource);
      }
    }

    var finalCallback = function (returnObject) {
      callback(returnObject.error, returnObject.firewallRules, returnObject.response);
    };

    next(responseObject, finalCallback);
  });
};

/**
* Deletes a SQL Server firewall rule.
*
* @param {string}   serverName          The server name.
* @param {string}   ruleName            The rule name.
* @param {function} callback            function (err, response) The callback function called on completion. Required.
*/
SqlManagementService.prototype.deleteServerFirewallRule = function (serverName, ruleName, callback) {
  var path = this._makePath('servers') + '/' + serverName + '/firewallrules/' + ruleName;
  var webResource = WebResource.del(path);

  this.performRequest(webResource, null, null, function (responseObject, next) {
    var finalCallback = function (returnObject) {
      callback(returnObject.error, returnObject.response);
    };

    next(responseObject, finalCallback);
  });
};

/**
* Creates a SQL Server firewall rule.
*
* @param {string}   serverName          The server name.
* @param {string}   ruleName            The rule name.
* @param {string}   startIPAddress      The starting IP address for the rule.
* @param {string}   endIPAddress        The ending IP address for the rule.
* @param {function} callback            function (err, rule, response) The callback function called on completion. Required.
*/
SqlManagementService.prototype.createServerFirewallRule = function (serverName, ruleName, startIPAddress, endIPAddress, callback) {
  var path = this._makePath('servers') + '/' + serverName + '/firewallrules';
  var webResource = WebResource.post(path);

  var createRuleRequestBody = {
    ServiceResource: {
      '$': {
        xmlns: 'http://schemas.microsoft.com/windowsazure',
        'xmlns:i': 'http://www.w3.org/2001/XMLSchema-instance'
      },
      Name: ruleName,
      StartIPAddress: startIPAddress,
      EndIPAddress: endIPAddress
    }
  };

  var createRuleRequestBodyXml = js2xml.serialize(createRuleRequestBody);

  this.performRequest(webResource, createRuleRequestBodyXml, null, function (responseObject, next) {
    if (!responseObject.error) {
      responseObject.firewallRule = [];

      if (responseObject.response.body.ServiceResource) {
        responseObject.firewallRule = parseserverresponse(responseObject.response.body.ServiceResource);
      }
    }

    var finalCallback = function (returnObject) {
      callback(returnObject.error, returnObject.firewallRule, returnObject.response);
    };

    next(responseObject, finalCallback);
  });
};

/**
* Updates a SQL Server firewall rule.
*
* @param {string}   serverName          The server name.
* @param {string}   ruleName            The rule name.
* @param {string}   startIPAddress      The starting IP address for the rule.
* @param {string}   endIPAddress        The ending IP address for the rule.
* @param {function} callback            function (err, rule, response) The callback function called on completion. Required.
*/
SqlManagementService.prototype.updateServerFirewallRule = function (serverName, ruleName, startIPAddress, endIPAddress, callback) {
  var path = this._makePath('servers') + '/' + serverName + '/firewallrules/' + ruleName;
  var webResource = WebResource.put(path);
  webResource.withOkCode(HttpConstants.HttpResponseCodes.OK_CODE, true);

  var updateServerRequestBody = {
    ServiceResource: {
      '$': {
        xmlns: 'http://schemas.microsoft.com/windowsazure',
        'xmlns:i': 'http://www.w3.org/2001/XMLSchema-instance'
      },
      Name: ruleName,
      StartIPAddress: startIPAddress,
      EndIPAddress: endIPAddress
    }
  };

  var updateServerRequestBodyXml = js2xml.serialize(updateServerRequestBody);

  this.performRequest(webResource, updateServerRequestBodyXml, null, function (responseObject, next) {
    if (!responseObject.error) {
      responseObject.firewallRule = [];

      if (responseObject.response.body.ServiceResource) {
        responseObject.firewallRule = parseserverresponse(responseObject.response.body.ServiceResource);
      }
    }

    var finalCallback = function (returnObject) {
      callback(returnObject.error, returnObject.firewallRule, returnObject.response);
    };

    next(responseObject, finalCallback);
  });
};

SqlManagementService.prototype._makePath = function (operationName) {
  return '/' + this.subscriptionId + '/services/sqlservers/' + operationName;
};