// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

var os = require('os');
var util = require('util');
var Constants = require('../constants');
var HeaderConstants = Constants.HeaderConstants;

/**
* Creates a filter to add the user agent header in a request.
*
* @param {string} userAgent The user agent string to use.
*/
exports.create = function (userAgentInfo) {
  return function handle(resource, next, callback) {
    if (!resource.headers[HeaderConstants.USER_AGENT]) {
      exports.tagRequest(resource, userAgentInfo);
    }

    return next(resource, callback);
  };
};

exports.tagRequest = function (requestOptions, userAgentInfo) {
  var runtimeInfo = util.format('Node/%s', process.version);
  var osInfo = util.format('(%s-%s-%s)', os.arch(), os.type(), os.release());
  userAgentInfo.unshift(runtimeInfo, osInfo);
  requestOptions.headers[HeaderConstants.USER_AGENT] = userAgentInfo.join(' ');
};
