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
var url = require('url');

var WrapTokenManager = require('./wraptokenmanager');

var Constants = require('../../../util/constants');
var HeaderConstants = Constants.HeaderConstants;
var ServiceBusConstants = Constants.ServiceBusConstants;

/**
* Creates a new Wrap object.
*
* @param {string} acsHost                 The access control host.
* @param {string} issuer                  The service bus issuer.
* @param {string} accessKey               The service bus issuer password.
*/
function Wrap(acsHost, issuer, accessKey) {
  this.acsHost = acsHost;
  this.issuer = issuer;
  this.accessKey = accessKey;
  this.wrapTokenManager = new WrapTokenManager(acsHost, issuer, accessKey);
}

/**
* Signs a request with the Authentication header.
*
* @param {WebResource} The webresource to be signed.
* @return {undefined}
*/
Wrap.prototype.signRequest = function (webResource, callback) {
  var parsedUrl = url.parse(webResource.uri);
  parsedUrl.protocol = 'http:';
  delete parsedUrl.path;
  delete parsedUrl.host;
  delete parsedUrl.port;
  var requestUrl = url.format(parsedUrl);
  this.wrapTokenManager.getAccessToken(requestUrl, function (error, accessToken) {
    if (!error) {
      webResource.withHeader(HeaderConstants.AUTHORIZATION,
        'WRAP access_token=\"' + accessToken[ServiceBusConstants.WRAP_ACCESS_TOKEN] + '\"');
    }

    callback(error);
  });
};

module.exports = Wrap;