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

'use strict';

var tunnel = require('tunnel');
var https = require('https');
var url = require('url');

var Constants = require('../../../util/constants');

/**
* Creates a filter to set proxy options;
*
* @param {string} userAgent The user agent string to use.
*/
exports.create = function (proxy) {
  return function handle (resource, next, callback) {
    exports.setAgent(resource, proxy);
    return next(resource, callback);
  };
};

/**
* Set the Agent to use for the request
* Result depends on proxy settings and protocol
*
* @param {object}   reqopts     request options for request.
* @param {object}   proxy       parsed url for the proxy.
*/
exports.setAgent = function (reqopts, proxy) {
  var requestUrl = url.parse(reqopts.url);
  var isHTTPS = requestUrl.protocol.substr(0, 5).toLowerCase() === Constants.HTTPS;

  if (proxy) {
    reqopts.strictSSL = false;

    var agentinfo = {
      proxy: {
        host: proxy.host,
        port: proxy.port
      }
    };

    if (reqopts.key) {
      agentinfo.key = reqopts.key;
    }
    if (reqopts.cert) {
      agentinfo.cert = reqopts.cert;
    }

    var isOverHTTPS = proxy.protocol.substr(0, 5).toLowerCase() === Constants.HTTPS;

    if (isHTTPS) {
      if (isOverHTTPS) {
        reqopts.agent = tunnel.httpsOverHttps(agentinfo);
      } else {
        reqopts.agent = tunnel.httpsOverHttp(agentinfo);
      }
    } else {
      if (isOverHTTPS) {
        reqopts.agent = tunnel.httpOverHttps(agentinfo);
      } else {
        reqopts.agent = tunnel.httpOverHttp(agentinfo);
      }
    }
  } else if (isHTTPS) {
    reqopts.agent = new https.Agent(reqopts);
  }
};