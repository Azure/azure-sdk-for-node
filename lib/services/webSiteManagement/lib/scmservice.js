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
var url = require('url');
var util = require('util');

var azureCommon = require('azure-common');
var azureutil = azureCommon.util;

var ServiceClient = azureCommon.ServiceClient;
var WebResource = azureCommon.WebResource;
var Constants = azureCommon.Constants;

var HeaderConstants = Constants.HeaderConstants;

/**
*
* Creates a new ScmService object.
* @class
* The ScmService object allows you to perform management operations on Microsoft Azure Web Sites Repositories.
* @constructor
*
* @param {object} authentication                                       The authentication object for the client.
*                                                                      You must use a auth/pass for basic authentication.
* @param {string} [authentication.user]                                The basic authentication username.
* @param {string} [authentication.pass]                                The basic authentication password.
* @param {object} [hostOptions]                                        The host options to override defaults.
* @param {string} [hostOptions.host]                                   The SCM repository endpoint.
*/
function ScmService(authentication, hostOptions) {
  hostOptions.protocol = Constants.HTTPS;

  ScmService['super_'].call(this, url.format(hostOptions), authentication);

  this.authenticationProvider = {
    signRequest: function (webResource, callback) {
      webResource.authentication = authentication;
      callback(null);
    }
  };
}

util.inherits(ScmService, ServiceClient);

/**
* Get log dump.
*
* @this {ScmService}
* @param {Function(error, results, response)} callback  `error` will contain information
*                                                       if an error occurs; otherwise `results` will contain
*                                                       the list of webspaces.
*                                                       `response` will contain information related to this operation.
*/
ScmService.prototype.getDumpToStream = function (writeStream, callback) {
  var webResource = WebResource.get('dump');

  this.performRequestInputStream(webResource, null, writeStream, null, function (responseObject, next) {
    var finalCallback = function (returnObject) {
      callback(returnObject.error, returnObject.response);
    };

    next(responseObject, finalCallback);
  });
};

/**
* Get log stream.
*
* @this {ScmService}
* @param {object} path                                  The log stream path.
* @param {object}    [options]                          The request options.
* @param {int}       [options.filter]                   The log stream filter.
* @param {Function(error, results, response)} callback  `error` will contain information
*                                                       if an error occurs; otherwise `results` will contain
*                                                       the list of webspaces.
*                                                       `response` will contain information related to this operation.
*/
ScmService.prototype.getLogStream = function (path, optionsOrCallback, chunkCallback, callback) {
  var options;
  azureutil.normalizeArgs(optionsOrCallback, callback, function (o, c) { options = o; callback = c; });

  var webResource;
  if (!path) {
    webResource = WebResource.get('logstream');
  } else {
    webResource = WebResource.get('logstream/' + path);
  }

  if (options.filter) {
    webResource.withQueryOption('filter', options.filter);
  }

  this.performChunkedRequest(webResource, null, null, function (responseObject, next) {
    var finalCallback = function (returnObject) {
      chunkCallback(returnObject.error, returnObject.error ? null : returnObject.response.body, returnObject.response);
    };

    next(responseObject, finalCallback);
  }, function (responseObject, next) {
    var finalCallback = function (returnObject) {
      callback(returnObject.error, returnObject.error ? null : returnObject.response.body, returnObject.response);
    };

    next(responseObject, finalCallback);
  });
};

module.exports = ScmService;