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
var _ = require('underscore');

var azureCommon = require('azure-common');
var ServiceManagementClient = azureCommon.ServiceManagementClient;
var ServiceManagementSettings = azureCommon.ServiceManagementSettings;
var WebResource = azureCommon.WebResource;

var js2xml = azureCommon.js2xml;
var Constants = azureCommon.Constants;
var SqlAzureConstants = Constants.SqlAzureConstants;

function setDefaultDbCreationOptions(opts) {
  if (!opts.edition) {
    opts.edition = SqlAzureConstants.WEB_EDITION;
  }

  if (!opts.maxsize) {
    if (opts.edition === SqlAzureConstants.WEB_EDITION) {
      opts.maxsize = SqlAzureConstants.WEB_1GB;
    } else {
      opts.maxsize = SqlAzureConstants.BUSINESS_10GB;
    }
  }

  if (!opts.collation) {
    opts.collation = SqlAzureConstants.DEFAULT_COLLATION_NAME;
  }
}

/**
*
* Creates a new SqlManagementService object
* @class
* The SqlManagementService object allows you to perform managment operations on Microsoft Azure SQL Database Servers.
* @constructor
*
* @param {string} configOrSubscriptionId                               Configuration, subscription ID for the account or the connection string
* @param {object} authentication                                       The authentication object for the client.
*                                                                      You must use either keyfile/certfile or keyvalue/certvalue
*                                                                      to provide a management certificate to authenticate
*                                                                      service requests.
* @param {string} [authentication.keyfile]                             The path to a file that contains the PEM encoded key
* @param {string} [authentication.certfile]                            The path to a file that contains the PEM encoded certificate
* @param {string} [authentication.keyvalue]                            A string that contains the PEM encoded key
* @param {string} [authentication.certvalue]                           A string that contains the PEM encoded certificate
* @param {object} [hostOptions]                                        The host options to override defaults.
* @param {string} [hostOptions.host='management.core.windows.net']     The management endpoint.
* @param {string} [hostOptions.apiversion='2012-03-01']                The API vesion to be used.
*/
function SqlManagementService(configOrSubscriptionId, authentication, hostOptions) {
  var settings = ServiceManagementSettings.createFromParameters(configOrSubscriptionId, authentication, hostOptions);

  SqlManagementService['super_'].call(this, settings);
  this.subscriptionId = settings._subscriptionId;
}

util.inherits(SqlManagementService, ServiceManagementClient);

/**
* Lists the available SQL Database servers.
*
* @param {Function(error, results, response)} callback   `error` will contain information
*                                                        if an error occurs; otherwise `results` will contain
*                                                        the list of available SQL Database servers information.
*                                                        `response` will contain information related to this operation.
*
* @example
* var azure = require('azure');
* var authentication={keyvalue:'...', certvalue:'...' };
* var sqlMgmt = new azure.createSqlManagementService(subscriptionId, authentication);
* sqlMgmt.listServers(function(error, servers) {
*   if(!error) {
*     console.log('servers\n' + servers);
*   }
* });
*/
SqlManagementService.prototype.listServers = function (callback) {
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

/**
* Deletes a SQL Database server.
*
* @param {string}   name                            The SQL Server name.
* @param {Function(error, response)} callback       `error` will contain information
*                                                   if an error occurs; otherwise `response` will contain information related to this operation.
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
* Creates a SQL Database server.
*
* @param {string}   administratorLogin          The administrator's login.
* @param {string}   administratorLoginPassword  The administrator's password.
* @param {string}   location                    The server's location.
* @param {Function(error, server, response)} callback        `error` will contain information
*                                                            if an error occurs; otherwise `server` will contain
*                                                            the new server information.
*                                                            `response` will contain information related to this operation.
*
* @example
* var azure = require('azure');
* var authentication={keyvalue:'...', certvalue:'...' };
* var sqlMgmt = new azure.createSqlManagementService(subscriptionId, authentication);
* sqlMgmt.createServer('sqladmin', 'Pa$$w0rd', 'West US', function(error, serverName) {
*   if(!error) {
*     console.log('created server ' + serverName);
*   }
* });
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
* Lists SQL Database server firewall rules.
*
* @param {string}   serverName                             The server name.
* @param {Function(error, results, response)} callback     `error` will contain information
*                                                           if an error occurs; otherwise `results` will contain
*                                                           the firewall rules.
*                                                           `response` will contain information related to this operation.
*
* @example
* var azure = require('azure');
* var authentication={keyvalue:'...', certvalue:'...'};
* var sqlMgmt = new azure.createSqlManagementService(subscriptionId, authentication);
* sqlMgmt.listServerFirewallRules(serverName, function(error, rules) {
*   if(!error) {
*     console.log('Rules:\n:' + rules);
*   }
* });
*/
SqlManagementService.prototype.listServerFirewallRules = function (serverName, callback) {
  var path = this._makePath('servers') + '/' + serverName + '/firewallrules';
  var webResource = WebResource.get(path);

  this.performRequest(webResource, null, null, function (responseObject, next) {
    if (!responseObject.error) {
      responseObject.firewallRules = [];

      if (responseObject.response.body.ServiceResources && responseObject.response.body.ServiceResources.ServiceResource) {
        responseObject.firewallRules = responseObject.response.body.ServiceResources.ServiceResource;

        if (!_.isArray(responseObject.firewallRules)) {
          responseObject.firewallRules = [ responseObject.firewallRules ];
        }
      }
    }

    var finalCallback = function (returnObject) {
      callback(returnObject.error, returnObject.firewallRules, returnObject.response);
    };

    next(responseObject, finalCallback);
  });
};

/**
* Deletes a SQL Database server firewall rule.
*
* @param {string}   serverName                      The server name.
* @param {string}   ruleName                        The rule name.
* @param {Function(error, response)} callback       `error` will contain information
*                                                   if an error occurs; otherwise `response` will contain information related to this operation.
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
* Creates a SQL Database server firewall rule.
*
* @param {string}   serverName                           The server name.
* @param {string}   ruleName                             The rule name.
* @param {string}   startIPAddress                       The starting IP address for the rule.
* @param {string}   endIPAddress                         The ending IP address for the rule.
* @param {Function(error, rule, response)} callback      `error` will contain information
*                                                        if an error occurs; otherwise `rule` will contain
*                                                        the new rule information.
*                                                        `response` will contain information related to this operation.
*
* @example
* var azure = require('azure');
* var authentication={keyvalue:'...', certvalue:'...'};
* var sqlMgmt = new azure.createSqlManagementService(subscriptionId, authentication);
* sqlMgmt.createServerFirewallRule(serverName, 'myrule', '192.168.100.0', '192.168.100.255', function(error, rule) {
*   if(!error) {
*     console.log('Rule created:\n' + rule);
*   }
* });
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
        responseObject.firewallRule = responseObject.response.body.ServiceResource;
      }
    }

    var finalCallback = function (returnObject) {
      callback(returnObject.error, returnObject.firewallRule, returnObject.response);
    };

    next(responseObject, finalCallback);
  });
};

/**
* Updates a SQL Database server firewall rule.
*
* @param {string}   serverName                           The server name.
* @param {string}   ruleName                             The rule name.
* @param {string}   startIPAddress                       The starting IP address for the rule.
* @param {string}   endIPAddress                         The ending IP address for the rule.
* @param {Function(error, rule, response)} callback      `error` will contain information
*                                                        if an error occurs; otherwise `rule` will contain
*                                                        the updated rule information.
*                                                        `response` will contain information related to this operation.
*/
SqlManagementService.prototype.updateServerFirewallRule = function (serverName, ruleName, startIPAddress, endIPAddress, callback) {
  var path = this._makePath('servers') + '/' + serverName + '/firewallrules/' + ruleName;
  var webResource = WebResource.put(path);

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
        responseObject.firewallRule = responseObject.response.body.ServiceResource;
      }
    }

    var finalCallback = function (returnObject) {
      callback(returnObject.error, returnObject.firewallRule, returnObject.response);
    };

    next(responseObject, finalCallback);
  });
};

/**
* Create a new database.
*
* @param {string}          serverName                                            The server name
* @param {string}          databaseName                                          Name of database to create
* @param {object}          [options]                                             Creation options.
* @param {string}          [options.edition='Web']                               'Web' or 'Business'.
* @param {number}          [options.maxsize=1|10]                                     Max DB size in GB, defaults to 1 for web, 10 for business, only certain values are valid
* @param {string}          [options.collation='SQL_Latin1_General_CP1_CI_AS']    sql collation name
* @param {Function(err, createResult, response)} callback                        `error` will contain information
*                                                                                if an error occurs; otherwise `createResult` will contain
*                                                                                the new database information.
*                                                                                `response` will contain information related to this operation.
*/
SqlManagementService.prototype.createDatabase = function (serverName, databaseName, optionsOrCallback, callback) {
  var options = optionsOrCallback;
  if (_.isFunction(optionsOrCallback)) {
    callback = optionsOrCallback;
    options = {};
  }
  setDefaultDbCreationOptions(options);

  var path = this._makePath('servers/' + serverName + '/databases');
  var webResource = WebResource.post(path);

  var createDatabaseRequestBody = {
    ServiceResource: {
      '$' : {
        xmlns: 'http://schemas.microsoft.com/windowsazure'
      },
      Name: databaseName,
      Edition: options.edition,
      MaxSizeGB: options.maxsize,
      CollationName: options.collation
    }
  };

  var createDatabaseRequestBodyXml = js2xml.serialize(createDatabaseRequestBody);

  this.performRequest(webResource, createDatabaseRequestBodyXml, null, function (responseObject, next) {
    if (!responseObject.error) {
      responseObject.database = [];

      if (responseObject.response.body.ServiceResource) {
        responseObject.database = responseObject.response.body.ServiceResource;
      }
    }

    var finalCallback = function (returnObject) {
      callback(returnObject.error, returnObject.database, returnObject.response);
    };

    next(responseObject, finalCallback);
  });

};

SqlManagementService.prototype._makePath = function (operationName) {
  return '/' + this.subscriptionId + '/services/sqlservers/' + operationName;
};

module.exports = SqlManagementService;
