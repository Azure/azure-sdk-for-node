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

var util = require('util');

var _ = require('underscore');
var wns = require('wns');

var azureutil = require('../../util/util');
var Constants = require('../../util/constants');
var HeaderConstants = Constants.HeaderConstants;

// valid badge values from http://msdn.microsoft.com/en-us/library/windows/apps/br212849.aspx
var badges = ['none','activity','alert','available','away','busy','newMessage','paused','playing','unavailable','error', 'attention'];

// valid notification types from http://msdn.microsoft.com/en-us/library/windows/apps/hh465435.aspx
var types = ['wns/toast', 'wns/badge', 'wns/tile', 'wns/raw'];

// White list of methods to use from wns module
var templateSpecs = {
  TileSquareBlock: [0, 2],
  TileSquareText01: [0, 4],
  TileSquareText02: [0, 2],
  TileSquareText03: [0, 4],
  TileSquareText04: [0, 1],
  TileWideText01: [0, 5],
  TileWideText02: [0, 9],
  TileWideText03: [0, 1],
  TileWideText04: [0, 1],
  TileWideText05: [0, 5],
  TileWideText06: [0, 10],
  TileWideText07: [0, 9],
  TileWideText08: [0, 10],
  TileWideText09: [0, 2],
  TileWideText10: [0, 9],
  TileWideText11: [0, 10],
  TileSquareImage: [1, 0],
  TileSquarePeekImageAndText01: [1, 4],
  TileSquarePeekImageAndText02: [1, 2],
  TileSquarePeekImageAndText03: [1, 4],
  TileSquarePeekImageAndText04: [1, 1],
  TileWideImage: [1, 0],
  TileWideImageCollection: [5, 0],
  TileWideImageAndText01: [1, 1],
  TileWideImageAndText02: [1, 2],
  TileWideBlockAndText01: [0, 6],
  TileWideBlockAndText02: [0, 3],
  TileWideSmallImageAndText01: [1, 1],
  TileWideSmallImageAndText02: [1, 5],
  TileWideSmallImageAndText03: [1, 1],
  TileWideSmallImageAndText04: [1, 2],
  TileWideSmallImageAndText05: [1, 2],
  TileWidePeekImageCollection01: [5, 2],
  TileWidePeekImageCollection02: [5, 5],
  TileWidePeekImageCollection03: [5, 1],
  TileWidePeekImageCollection04: [5, 1],
  TileWidePeekImageCollection05: [6, 2],
  TileWidePeekImageCollection06: [6, 1],
  TileWidePeekImageAndText01: [1, 1],
  TileWidePeekImageAndText02: [1, 5],
  TileWidePeekImage01: [1, 2],
  TileWidePeekImage02: [1, 5],
  TileWidePeekImage03: [1, 1],
  TileWidePeekImage04: [1, 1],
  TileWidePeekImage05: [2, 2],
  TileWidePeekImage06: [2, 1],
  ToastText01: [0, 1],
  ToastText02: [0, 2],
  ToastText03: [0, 2],
  ToastText04: [0, 3],
  ToastImageAndText01: [1, 1],
  ToastImageAndText02: [1, 2],
  ToastImageAndText03: [1, 2],
  ToastImageAndText04: [1, 3]
};

/**
* Creates a new WnsService object.
*
* @constructor
*
* @param {NotificationHubService} notificationHubService The notification hub service.
*/
function WnsService(notificationHubService) {
  var self = this;

  this.notificationHubService = notificationHubService;

  var addSendMethod = function (createFunctionName, templateName) {
    var sendName = util.format('send%s', templateName);

    self[sendName] = function () {
      // signature is (tags, [payload, ]+, [options], callback)
      var tags = Array.prototype.shift.apply(arguments);

      // Get arguments without the final callback to build payload
      var args = Array.prototype.slice.call(arguments, 0, arguments.length - 1);

      var options = {};
      if (arguments.length >= 3 && _.isObject(arguments[arguments.length - 2])) {
        options = arguments[arguments.length - 2];
      }

      var callback = arguments[arguments.length - 1];

      if (!_.isFunction(callback)) {
        throw new Error('The callback parameter must be the callback function.');
      }

      var type =  templateName.indexOf('Tile') === 0 ? 'tile' : 'toast';
      var payload = wns[createFunctionName].apply(wns, args);
      self.send(tags, payload, 'wns/' + type, options, callback);
    };
  };

  Object.keys(templateSpecs).forEach(function (templateName) {
    var createName = util.format('create%s', templateName);

    if (_.isFunction(wns[createName])) {
      // Expose create methods to be able to send raw payloads
      self[createName] = wns[createName];

      // Expose send methods as convenience
      addSendMethod(createName, templateName);
    }
  });
}

/**
* Sends a wns/badge WNS notification.
*
* @param {array|string}       tags                           Comma-separated list or array of tag identifiers.
* @param {object|string}      value                          Either a numeric value or a string value that specifies a predefined badge 
*                                                            glyph. Numerically, this value can accept any valid integer. A value of 0 clears the badge, 
*                                                            values from 1-99 display as given, and any value greater than 99 displays as 99+.
*                                                            See http://msdn.microsoft.com/en-us/library/windowsazure/br212849.aspx for more details.
* @param {object|function}    [optionsOrCallback]            The request options or callback function.
* @param {object|function}    [optionsOrCallback.headers] The wns headers.
* @param {function(error, response)} callback                The callback function.
* @return {undefined}
*/
WnsService.prototype.sendBadge = function (tags, value, optionsOrCallback, callback) {
  var realValue;
  var realVersion;

  if (_.isObject(value)) {
    realValue = value.value;
    realVersion = value.version || 1;
  } else {
    realValue = value;
    realVersion = 1;
  }

  if (!_.isString(realValue) && isNaN(realValue)) {
    throw new Error('The badge value must be a string or a number.');
  }

  if (!isNaN(realValue)) {
    if (realValue < 0) {
      // Values greater than 99 appear as 99+, 0 clears the badge
      throw new Error('The badge numeric value must be greater than or equal to 0.');
    }
  } else if (!badges.some(function (badge) { return badge === realValue; })) {
    throw new Error('The badge value must be either an integer greater than or equal to 0 or one of ' +
      JSON.stringify(badges));
  }

  var payload = '<badge value="' + realValue + '" version="' + realVersion + '"/>';
  this.send(tags, payload, 'wns/badge', optionsOrCallback, callback);
};

/**
* Sends a wns/raw WNS notification.
*
* @param {array|string}       tags                           Comma-separated list or array of tag identifiers.
* @param {object|string}      payload                        The raw payload.
* @param {object|function}    [optionsOrCallback]            The request options or callback function.
* @param {object|function}    [optionsOrCallback.headers] The wns headers.
* @param {function(error, response)} callback                The callback function.
* @return {undefined}
*/
WnsService.prototype.sendRaw = function (tags, payload, optionsOrCallback, callback) {
  return this.send(tags, payload, 'wns/raw', optionsOrCallback, callback);
};

/**
* Sends a custom WNS notification.
*
* @param {array|string}       tags                           Comma-separated list or array of tag identifiers.
* @param {string}             payload                        The message's XML payload.
* @param {string}             type                           The message type. Corresponds to header X-WNS-Type (options are: wns/raw, wns/tile and wns/toast).
* @param {object|function}    [optionsOrCallback]            The request options or callback function.
* @param {object|function}    [optionsOrCallback.headers] The wns headers.
* @param {function(error, response)} callback                The callback function.
* @return {undefined}
*/
WnsService.prototype.send = function (tags, payload, type, optionsOrCallback, callback) {
  var options;
  azureutil.normalizeArgs(optionsOrCallback, callback, function (o, c) { options = o; callback = c; });

  if (!_.isString(payload)) {
    throw new Error('The payload parameter must be the notification payload string.');
  }

  if (!types.some(function (item) { return type === item; })) {
    throw new Error('The type parameter must specify the notification type. The value of ' + type +
      ' is not in the set of valid value types: ' + JSON.stringify(types));
  }

  if (!_.isFunction(callback)) {
    throw new Error('The callback parameter must be the callback function.');
  }

  var headers = {};
  headers[HeaderConstants.SERVICE_BUS_NOTIFICATION_FORMAT] = 'windows';

  if (tags) {
    if (_.isArray(tags)) {
      tags = tags.join(',');
    }

    headers[HeaderConstants.SERVICE_BUS_NOTIFICATION_TAGS] = tags;
  }

  headers[HeaderConstants.SERVICE_BUS_X_WNS_TYPE] = type;

  if (options && options.headers) {
    Object.keys(options.headers).forEach(function (header) {
      headers[header] = options.headers[header];
    });
  }

  if (type === 'wns/raw' && !headers[HeaderConstants.CONTENT_TYPE]) {
    headers[HeaderConstants.CONTENT_TYPE] = 'application/octet-stream';
  }

  this.notificationHubService._sendNotification(payload, headers, callback);
};

module.exports = WnsService;