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

var _ = require('underscore');
var tunnel = require('tunnel');
var https = require('https');
var url = require('url');

var Constants = require('../../../util/constants');

/**
* Creates a filter to set proxy options;
*
* @param {object} proxy The proxy url (with host, port and protocol properties).
*/
exports.create = function (proxy) {
  if (!proxy || !_.isObject(proxy)) {
    throw new Error('Invalid proxy argument');
  }

  if (!proxy.host) {
    throw new Error('Invalid proxy host');
  }

  if (!proxy.port) {
    throw new Error('Invalid proxy port');
  }

  if (!proxy.protocol) {
    throw new Error('Invalid proxy protocol');
  }

  return function handle (resource, next, callback) {
    exports.setAgent(resource, proxy);
    return next(resource, callback);
  };
};

/**
* Set the Agent to use for the request
* Result depends on proxy settings and protocol
*
* @param {object}   resouce     request options for request.
* @param {object}   proxy       parsed url for the proxy.
*/
exports.setAgent = function (resource, proxy) {
  function isProtocolHTTPS(urlToCheck) {
    return urlToCheck.protocol.toLowerCase() === Constants.HTTPS;
  }


  var requestUrl = url.parse(resource.url);
  var isHTTPS = isProtocolHTTPS(requestUrl);

  if (proxy) {
    // Disable strict SSL by default as there will be a proxy in the middle
    resource.strictSSL = false;

    var agentinfo = {
      proxy: proxy
    };

    if (resource.key) {
      agentinfo.key = resource.key;
    }
    if (resource.cert) {
      agentinfo.cert = resource.cert;
    }

    var isOverHTTPS = isProtocolHTTPS(proxy);
    if (isHTTPS) {
      if (isOverHTTPS) {
        resource.agent = tunnel.httpsOverHttps(agentinfo);
      } else {
        resource.agent = tunnel.httpsOverHttp(agentinfo);
      }
    } else {
      if (isOverHTTPS) {
        resource.agent = tunnel.httpOverHttps(agentinfo);
      } else {
        resource.agent = tunnel.httpOverHttp(agentinfo);
      }
    }
  } else if (isHTTPS) {
    resource.agent = new https.Agent(resource);
  }
};