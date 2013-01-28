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
var url = require('url');
var _ = require('underscore');

var SqlServiceClient = require('../core/sqlserviceclient');
var WebResource = require('../../http/webresource');
var ServiceClient = require('../core/serviceclient');

var AtomHandler = require('../../util/atomhandler');
var DatabaseResult = require('./models/databaseresult');

var Constants = require('../../util/constants');
var HttpConstants = Constants.HttpConstants;
var HeaderConstants = Constants.HeaderConstants;
var SqlAzureConstants = Constants.SqlAzureConstants;

// Expose 'SqlService'.
exports = module.exports = SqlService;

/**
*
* Creates a new SqlService object
*
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

  var endpoint = url.format({ protocol: 'https:', port: 443, hostname: serverName + '.' + ServiceClient.CLOUD_DATABASE_HOST });
  var acsEndpoint = url.format({ protocol: 'https:', port: 443, hostname: serverName + '.' + ServiceClient.CLOUD_DATABASE_HOST });

  SqlService.super_.call(this,
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
* @param {string}             databaseName                             The database name.
* @param {object|function}    [optionsOrCallback]                      The get options or callback function.
* @param {string}             [optionsOrCallback.collation]            The database collation to be used.
* @param {string}             [optionsOrCallback.edition]              The database edition to be used.
* @param {string}             [optionsOrCallback.maxSizeInGB]          The database maximum size in gigabytes.
* @param {function}           callback                                 function (err, response) The callback function called on completion. Required.
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

  var databaseXml = DatabaseResult.serialize(databaseName, options.collation, options.edition, options.maxSizeInGB);

  var webResource = WebResource.post(SqlAzureConstants.MANAGEMENT_SERVICE_URI + 'Server2(\'' + this.serverName + '\')/Databases');

  webResource.addOptionalHeader(HeaderConstants.CONTENT_TYPE, 'application/atom+xml;charset="utf-8"');
  webResource.addOptionalHeader(HeaderConstants.CONTENT_LENGTH, Buffer.byteLength(databaseXml, 'utf8'));
  webResource.addOptionalHeader('Expect', '100-continue');

  var processResponseCallback = function (responseObject, next) {
    if (!responseObject.error && responseObject.response.body.entry) {
      var atomHandler = new AtomHandler();
      responseObject.database = atomHandler.parse(responseObject.response.body.entry)
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
* @param {string}   databaseId          The database identifier.
* @param {function} callback            function (err, response) The callback function called on completion. Required.
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
* @param {function} callback            function (err, results, response) The callback function called on completion. Required.
*/
SqlService.prototype.listServerDatabases = function (callback) {
  validateCallback(callback);

  var webResource = WebResource.get(SqlAzureConstants.MANAGEMENT_SERVICE_URI + 'Server2(\'' + this.serverName + '\')/Databases');

  var processResponseCallback = function (responseObject, next) {
    if (!responseObject.error) {
      responseObject.databases = [];

      var entries = [];
      if (responseObject.response.body.feed && responseObject.response.body.feed.entry) {
        entries = responseObject.response.body.feed.entry;
      } else if (responseObject.response.body.entry) {
        entries = [responseObject.response.body.entry];
      }

      var atomHandler = new AtomHandler();
      _.each(entries, function (entry) {
        responseObject.databases.push(atomHandler.parse(entry));
      });
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
    webResource.addOptionalHeader(HeaderConstants.DATA_SERVICE_VERSION, '1.0;NetFx');
  }

  if (!webResource.headers || !webResource.headers[HeaderConstants.MAX_DATA_SERVICE_VERSION]) {
    webResource.addOptionalHeader(HeaderConstants.MAX_DATA_SERVICE_VERSION, '2.0;NetFx');
  }

  this.performRequest(webResource, rawData, options, callback);
};

/**
* Validates a callback function.
*
* @param {string} callback The callback function.
* @return {undefined}
*/
function validateCallback(callback) {
  if (!callback) {
    throw new Error(TableService.incorrectCallbackErr);
  }
}