// 
// Copyright (c) Microsoft and contributors.  All rights reserved.
// 
// Licensed under the Apache License, Version 2.0 (the 'License');
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//   http://www.apache.org/licenses/LICENSE-2.0
// 
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an 'AS IS' BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// 
// See the License for the specific language governing permissions and
// limitations under the License.
// 

'use strict';

var adal = require('adal-node');
var fs = require('fs');
var https = require('https');
var util = require('util');
var msRestAzure = require('ms-rest-azure');
var AuthenticationContext = adal.AuthenticationContext;

function turnOnLogging() {
  var log = adal.Logging;
  log.setLoggingOptions(
    {
      level : log.LOGGING_LEVEL.VERBOSE,
      log : function (level, message, error) {
        console.log(message);
        if (error) {
          console.log(error);
        }
      }
    });
}

turnOnLogging();

var authenticationParameters = {
  tenant: 'common',
  authorityHostUrl: 'https://login.windows.net',
  clientId: '04b07795-8ddb-461a-bbee-02f9e1bf7b46'
};

/**
 * Authenticate with username and password
 * @param {string} username - Username
 * @param {string} password - Password
 * @param {function} callback - The callback to handle the error and result.
 */
exports.authenticateWithUsernamePassword = function (username, password, callback) {
  var authorityUrl = authenticationParameters.authorityHostUrl + '/' + authenticationParameters.tenant;
  var resource = 'https://management.core.windows.net/';
  var context = new AuthenticationContext(authorityUrl);
  context.acquireTokenWithUsernamePassword(resource, authenticationParameters.username, authenticationParameters.password, authenticationParameters.clientId, function (err, tokenResponse) {
    if (err) {
      callback('Authentication failed. The error is: ' + util.inspect(err));
    } else {
      callback(null, tokenResponse);
    }
  });
};

/**
 * Authenticate with Service Principal
 * @param {string} clientId - Id of the service principal
 * @param {string} clientSecret - Password/Secret of the service principal
 * @param {string} tenant - The tenant id of the service principal.
 * @param {function} callback - The callback to handle the error and result.
 */
exports.authenticateWithServicePrincipal = function (clientId, clientSecret, tenant, callback) {
  var authorityUrl = authenticationParameters.authorityHostUrl + '/' + tenant;
  var resource = 'https://management.core.windows.net/';
  var context = new AuthenticationContext(authorityUrl);
  context.acquireTokenWithClientCredentials(resource, authenticationParameters.clientId, authenticationParameters.clientSecret, function (err, tokenResponse) {
    if (err) {
      callback('Authentication failed. The error is: ' + util.inspect(err));
    } else {
      //new msRestAzure.SubscriptionCredentials(tokenResponse,
      callback(null, tokenResponse);
    }
  });
};

exports = module.exports;