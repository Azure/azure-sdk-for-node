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
var url = require('url');
var _ = require('underscore');

var azureCommon = require('azure-common');
var azureutil = azureCommon.util;
var ServiceClient = azureCommon.ServiceClient;

var WebResource = azureCommon.WebResource;
var Constants = azureCommon.Constants;
var SqlAzureConstants = Constants.SqlAzureConstants;

function escapeConnectionCredentials(value) {
  return value.replace(/\\/g, /\\\\/g).replace(/:/g, /\\:/g);
}

/**
* Creates a new SqlServerAcs object.
*
* @param {string} acsHost                      The access control host.
* @param {string} serverName                   The SQL server name.
* @param {string} administratorLogin           The administrator login.
* @param {string} administratorLoginPassword   The administrator login password.
*/
function SqlServerAcs(acsHost, serverName, administratorLogin, administratorLoginPassword) {
  this.acsHost = acsHost;
  this.serverName = serverName;
  this.administratorLogin = administratorLogin;
  this.administratorLoginPassword = administratorLoginPassword;

  SqlServerAcs['super_'].call(this, acsHost);
}

util.inherits(SqlServerAcs, ServiceClient);

/**
* Signs a request with the Authentication header.
*
* @param {WebResource} The webresource to be signed.
* @return {undefined}
*/
SqlServerAcs.prototype.signRequest = function (webResourceToSign, callback) {
  var escapedLogin = escapeConnectionCredentials(this.administratorLogin);
  var escapedLoginPassword = escapeConnectionCredentials(this.administratorLoginPassword);

  var escapedCredentials = escapedLogin + ':' + escapedLoginPassword;

  var encodedCredentials = 'Basic ' + (new Buffer(escapedCredentials).toString('base64'));

  var webResource = WebResource.get('/v1/ManagementService.svc/GetAccessToken');

  webResource.withHeader('sqlauthorization', encodedCredentials);

  var processResponseCallback = function (responseObject, next) {
    if (!responseObject.error) {
      if (responseObject.response.headers['set-cookie']) {
        _.each(responseObject.response.headers['set-cookie'], function (cookie) {
          if (azureutil.stringStartsWith(cookie, SqlAzureConstants.SQL_SERVER_MANAGEMENT_COOKIE)) {
            webResourceToSign.withHeader('Cookie', cookie.split(';')[0]);
          }
        });
      }

      webResourceToSign.withHeader('AccessToken', responseObject.response.body.string[Constants.XML_VALUE_MARKER]);
    }

    var finalCallback = function (returnObject) {
      callback(returnObject.error);
    };

    next(responseObject, finalCallback);
  };

  this.performRequest(webResource, null, null, processResponseCallback);
};

SqlServerAcs.prototype._buildRequestOptions = function (webResource, body, options, callback) {
  var self = this;

  // Sets the request url in the web resource.
  this._setRequestUrl(webResource);

  var requestOptions = {
    url: url.format({
      protocol: self._isHttps() ? 'https:' : 'http:',
      hostname: self.host,
      port: self.port,
      pathname: webResource.path,
      query: webResource.queryString
    }),
    method: webResource.method,
    headers: webResource.headers
  };

  callback(null, requestOptions);
};

/**
* Retrieves the normalized path to be used in a request.
* It adds a leading "/" to the path in case
* it's not there before.
*
* @param {string} path The path to be normalized.
* @return {string} The normalized path.
*/
SqlServerAcs.prototype._getPath = function (path) {
  if (path === null || path === undefined) {
    path = '/';
  } else if (path.indexOf('/') !== 0) {
    path = '/' + path;
  }

  return path;
};

module.exports = SqlServerAcs;