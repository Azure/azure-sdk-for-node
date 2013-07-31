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

// Module dependencies.
var util = require('util');
var url = require('url');
var _ = require('underscore');

var SqlServiceClient = require('../core/sqlserviceclient');
var WebResource = require('../../http/webresource');
var ServiceClientConstants = require('../core/serviceclientconstants');

var OdataHandler = require('../../util/odatahandler');
var databaseResult = require('./models/databaseresult');

var Constants = require('../../util/constants');
var HeaderConstants = Constants.HeaderConstants;
var SqlAzureConstants = Constants.SqlAzureConstants;

/**
* Validates a callback function.
* @ignore
*
* @param {string} callback The callback function.
* @return {undefined}
*/
function validateCallback(callback) {
  if (!callback) {
    throw new Error('Callback must be specified.');
  }
}

/**
*
* Creates a new SqlService object
* @class
* The SqlService object allows you to perform management operations against databases
* created using Windows Azure SQL Database.
* @constructor
* @param {string} serverName                   The SQL server name.
* @param {string} administratorLogin           The SQL Server administrator login.
* @param {string} administratorLoginPassword   The SQL Server administrator login password.
* @param {string} [host]                       The host for the service.
* @param {string} [acsHost]                    The acs host.
* @param {object} [authenticationProvider]     The authentication provider.
*/
function SqlService(serverName, administratorLogin, administratorLoginPassword, host, acsHost, authenticationProvider) {
  this.serverName = serverName;

  if (!host) {
    host = ServiceClientConstants.CLOUD_DATABASE_HOST;
  }

  var endpoint = url.format({ protocol: 'https:', port: 443, hostname: serverName + '.' + host });
  var acsEndpoint = url.format({ protocol: 'https:', port: 443, hostname: serverName + '.' + host });

  SqlService['super_'].call(this,
    serverName,
    administratorLogin,
    administratorLoginPassword,
    endpoint,
    acsEndpoint,
    authenticationProvider);
}

util.inherits(SqlService, SqlServiceClient);

/**
* Creates a SQL Server database.
*
* @param {string}             databaseName                   The database name.
* @param {object|function}    [options]                      The get options or callback function.
* @param {string}             [options.collation]            The database collation to be used.
* @param {string}             [options.edition]              The database edition to be used.
* @param {string}             [options.maxSizeInGB]          The database maximum size in gigabytes.
* @param {Function(error, response)}           callback      `error` will contain information
*                                                            if an error occurs; otherwise `response` will contain information related to this operation.
*
* @example
* var azure = require('azure');
* var sqlService = new azure.createSqlService(serverName, 'sqlAdmin', 'Pa$$w0rd');
* sqlServer.createServerDatabase('mydb', function(error, db) {
*   if(!error) {
*     console.log('DB Created:\n' + db);
*   }
* });
*/
SqlService.prototype.createServerDatabase = function (databaseName, optionsOrCallback, callback) {
  var options = null;
  if (typeof optionsOrCallback === 'function' && !callback) {
    callback = optionsOrCallback;
    options = { };
  } else {
    options = optionsOrCallback;
  }

  validateCallback(callback);

  var databaseXml = databaseResult.serialize(databaseName, options.collation, options.edition, options.maxSizeInGB);

  var webResource = WebResource.post(SqlAzureConstants.MANAGEMENT_SERVICE_URI + 'Server2(\'' + this.serverName + '\')/Databases');

  webResource.withHeader(HeaderConstants.CONTENT_TYPE, 'application/atom+xml;charset="utf-8"');
  webResource.withHeader(HeaderConstants.CONTENT_LENGTH, Buffer.byteLength(databaseXml, 'utf8'));
  webResource.withHeader('Expect', '100-continue');

  var processResponseCallback = function (responseObject, next) {
    if (!responseObject.error) {
      var odataHandler = new OdataHandler();
      responseObject.database = odataHandler.parse(responseObject.response.body);
    }

    var finalCallback = function (returnObject) {
      callback(returnObject.error, returnObject.database, returnObject.response);
    };

    next(responseObject, finalCallback);
  };

  this._performRequestExtended(webResource, databaseXml, null, processResponseCallback);
};

/**
* Deletes a SQL Server database.
*
* @param {string}   databaseId                    The database identifier.
* @param {Function(error, response)} callback     `error` will contain information
*                                                 if an error occurs; otherwise `response` will contain information related to this operation.
*/
SqlService.prototype.deleteServerDatabase = function (databaseId, callback) {
  validateCallback(callback);

  var webResource = WebResource.del(SqlAzureConstants.MANAGEMENT_SERVICE_URI + 'Server2(\'' + this.serverName + '\')/Databases(' + databaseId + ')');

  var processResponseCallback = function (responseObject, next) {
    var finalCallback = function (returnObject) {
      callback(returnObject.error, returnObject.response);
    };

    next(responseObject, finalCallback);
  };

  this._performRequestExtended(webResource, null, null, processResponseCallback);
};

/**
* Lists the SQL Server databases.
*
* @param {Function(error, results, response)} callback     `error` will contain information
*                                                          if an error occurs; otherwise `results` will contain
*                                                          the list of databases.
*                                                          `response` will contain information related to this operation.
*/
SqlService.prototype.listServerDatabases = function (callback) {
  validateCallback(callback);

  var webResource = WebResource.get(SqlAzureConstants.MANAGEMENT_SERVICE_URI + 'Server2(\'' + this.serverName + '\')/Databases');

  var processResponseCallback = function (responseObject, next) {
    if (!responseObject.error) {
      var odataHandler = new OdataHandler();
      responseObject.databases = odataHandler.parse(responseObject.response.body);
      if (!responseObject.databases) {
        responseObject.databases = [];
      } else if (!_.isArray(responseObject.databases)) {
        responseObject.databases = [ responseObject.databases ];
      }
    }

    var finalCallback = function (returnObject) {
      callback(returnObject.error, returnObject.databases, returnObject.response);
    };

    next(responseObject, finalCallback);
  };

  this._performRequestExtended(webResource, null, null, processResponseCallback);
};

SqlService.prototype._performRequestExtended = function (webResource, rawData, options, callback) {
  if (!webResource.headers || !webResource.headers[HeaderConstants.DATA_SERVICE_VERSION]) {
    webResource.withHeader(HeaderConstants.DATA_SERVICE_VERSION, '1.0;NetFx');
  }

  if (!webResource.headers || !webResource.headers[HeaderConstants.MAX_DATA_SERVICE_VERSION]) {
    webResource.withHeader(HeaderConstants.MAX_DATA_SERVICE_VERSION, '2.0;NetFx');
  }

  this.performRequest(webResource, rawData, options, callback);
};

module.exports = SqlService;