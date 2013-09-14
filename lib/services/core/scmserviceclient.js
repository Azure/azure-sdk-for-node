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
var url = require('url');

var ServiceClient = require('./serviceclient');
var Constants = require('../../util/constants');
var HeaderConstants = Constants.HeaderConstants;

/**
* Creates a new ScmServiceClient object.
*
* @constructor
*/
function ScmServiceClient(authentication, host) {
  host.protocol = Constants.HTTPS;

  ScmServiceClient['super_'].call(this, url.format(host), authentication);

  this.authentication = authentication;
}

util.inherits(ScmServiceClient, ServiceClient);

/**
* Builds the request options to be passed to the http.request method.
*
* @param {WebResource} webResource The webresource where to build the options from.
* @param {object}      options     The request options.
* @param {function(error, requestOptions)}  callback  The callback function.
* @return {undefined}
*/
ScmServiceClient.prototype._buildRequestOptions = function (webResource, options, callback) {
  var self = this;

  webResource.withHeader(HeaderConstants.HOST_HEADER, self.host);

  if (!webResource.headers || !webResource.headers[HeaderConstants.CONTENT_LENGTH]) {
    webResource.withHeader(HeaderConstants.CONTENT_LENGTH, 0);
  }

  var targetUrl = {
    protocol: self._isHttps() ? 'https' : 'http',
    hostname: self.host,
    port: self.port,
    pathname: webResource.path,
    query: webResource.queryString
  };

  if (this.authentication) {
    targetUrl.auth = util.format('%s:%s', this.authentication.user, this.authentication.pass);
  }

  var requestOptions = {
    url: url.format(targetUrl),
    method: webResource.httpVerb,
    headers: webResource.headers,
    strictSSL: self.strictSSL
  };

  callback(null, requestOptions);
};

module.exports = ScmServiceClient;