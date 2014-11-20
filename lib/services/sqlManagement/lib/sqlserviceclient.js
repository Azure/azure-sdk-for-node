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

var azureCommon = require('azure-common');
var ServiceClient = azureCommon.ServiceClient;
var SqlServerAcs = require('./sqlserveracs');

var Constants = azureCommon.Constants;
var HeaderConstants = Constants.HeaderConstants;

/**
* Creates a new SqlServiceClient object.
*
* @constructor
* @param {string} serverName                   The SQL server name.
* @param {string} administratorLogin           The SQL Server administrator login.
* @param {string} administratorLoginPassword   The SQL Server administrator login password.
* @param {string} host                         The host for the service.
* @param {string} acsHost                      The acs host. Usually the same as the sb namespace with "-sb" suffix.
* @param {object} [authenticationProvider]     The authentication provider.
*/
function SqlServiceClient(serverName, administratorLogin, administratorLoginPassword, host, acsHost, authenticationProvider) {
  SqlServiceClient['super_'].call(this, host, authenticationProvider);

  this.authenticationProvider = authenticationProvider;
  if (!this.authenticationProvider) {
    this.authenticationProvider = new SqlServerAcs(acsHost, serverName, administratorLogin, administratorLoginPassword);
  }
}

util.inherits(SqlServiceClient, ServiceClient);

/**
* Builds the request options to be passed to the http.request method.
*
* @param {WebResource} webResource The webresource where to build the options from.
* @param {object}      options     The request options.
* @param {function(error, requestOptions)}  callback  The callback function.
*/
SqlServiceClient.prototype._buildRequestOptions = function (webResource, body, options, callback) {
  webResource.withHeader(HeaderConstants.ACCEPT_CHARSET_HEADER, 'UTF-8');

  // If wrap is used, make sure proxy settings are in sync
  if (this.useProxy &&
      this.authenticationProvider &&
      this.authenticationProvider.wrapTokenManager &&
      this.authenticationProvider.wrapTokenManager.wrapService) {
    this.authenticationProvider.wrapTokenManager.wrapService.setProxy(this.proxyUrl, this.proxyPort);
  }

  SqlServiceClient['super_'].prototype._buildRequestOptions.call(this, webResource, body, options, callback);
};

module.exports = SqlServiceClient;