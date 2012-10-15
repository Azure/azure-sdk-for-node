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

var azureutil = require('../../util/util');

var ServiceClient = require('../core/serviceclient');
var WrapService = require('./wrapservice');
var WebResource = require('../../http/webresource');
var Constants = require('../../util/constants');
var QueryStringConstants = Constants.QueryStringConstants;
var HttpConstants = Constants.HttpConstants;
var HeaderConstants = Constants.HeaderConstants;
var ServiceBusConstants = Constants.ServiceBusConstants;

// Expose 'Wrap'.
exports = module.exports = WrapTokenManager;

var ONE_SECOND_MS = 1000;

/**
* Creates a new Wrap object.
*
* @param {string} acsHost                 The access control host.
* @param {string} issuer                  The service bus issuer.
* @param {string} accessKey               The service bus issuer password.
*/
function WrapTokenManager(acsHost, issuer, accessKey) {
  this.activeTokens = { };

  this.wrapService = new WrapService(acsHost, issuer, accessKey);
}

WrapTokenManager.prototype.getAccessToken = function(scopeUri, callback) {
  var self = this;
  var now = new Date();

  var cachedToken = self.activeTokens[scopeUri];
  if (cachedToken && now < cachedToken[ServiceBusConstants.WRAP_ACCESS_TOKEN_EXPIRES_UTC]) {
    callback(null, cachedToken);
    return;
  }

  // sweep expired tokens out of collection
  for (var token in self.activeTokens) {
    if (now >= self.activeTokens[token][ServiceBusConstants.WRAP_ACCESS_TOKEN_EXPIRES_UTC]) {
      delete self.activeTokens[token];
    }
  }

  // get access token
  this.wrapService.wrapAccessToken(scopeUri, function (error, acsTokenResult) {
    if (!error) {
      // set UTC expiration time and cache result
      now.setMilliseconds(now.getMilliseconds() + 
        ((ONE_SECOND_MS * acsTokenResult[ServiceBusConstants.WRAP_ACCESS_TOKEN_EXPIRES_IN]) / 2));
      acsTokenResult[ServiceBusConstants.WRAP_ACCESS_TOKEN_EXPIRES_UTC] = now;

      self.activeTokens[scopeUri] = acsTokenResult;
    }

    callback(error, acsTokenResult);
  });
};