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

  Object.keys(templateSpecs).forEach(function (templateName) {
    var createName = util.format('create%s', templateName);

    if (_.isFunction(wns[createName])) {
      var sendName = util.format('send%s', templateName);

      self[sendName] = function () {
        // signature is (hub, [payload, ]+, [options], callback)
        var hub = Array.prototype.shift.apply(arguments);

        // Get arguments without the final callback
        var args = Array.prototype.slice.call(arguments, 0, arguments.length - 1);
        var options = null;

        if (arguments.length >= 5) {
          options = arguments[arguments.length - 2];
        }

        var callback = arguments[arguments.length - 1];

        if (!_.isString(hub)) {
          throw new Error('The hub parameter must be the notification hub name string.');
        }

        if (!_.isFunction(callback)) {
          throw new Error('The callback parameter must be the callback function.');
        }

        var type =  templateName.indexOf('Tile') === 0 ? 'tile' : 'toast';
        var message = {
          'ServiceBusNotification-Format': 'windows',
          'X-WNS-Type': 'wns/' + type,
          body: wns[createName].apply(wns, args)
        };

        if (options && options.tags) {
          message['ServiceBusNotification-Tags'] = options.tags;
        }

        self.notificationHubService._sendNotification(hub, message, callback);
      };
    }
  });
}

/**
* Sends a custom WNS notification.
*
* @param {string}             hub                         A string object that repesents the notification hub name.
* @param {string}             wnsType                     The message type. Corresponds to header X-WNS-Type (options are: wns/raw, wns/tile and wns/toast).
* @param {object|string}      payload                     The message's JSON payload.
* @param {object|function}    [optionsOrCallback]         The request options or callback function. Additional properties will be passed as headers.
* @param {function(error, response)} callback             The callback function.
* @return {undefined}
*/
WnsService.prototype.send = function (hub, wnsType, payload, optionsOrCallback, callback) {
  var options = null;
  if (typeof optionsOrCallback === 'function' && !callback) {
    callback = optionsOrCallback;
  } else {
    options = optionsOrCallback;
  }

  var message = {
    body: payload,
    'ServiceBusNotification-Format': 'windows',
    'X-WNS-Type': wnsType
  };

  if (!_.isString(message.body)) {
    message.body = JSON.stringify(message.body);
  }

  if (options) {
    Object.keys(options).forEach(function (header) {
      message[header] = options[header];
    });
  }

  this.notificationHubService._sendNotification(hub, message, callback);
};


module.exports = WnsService;