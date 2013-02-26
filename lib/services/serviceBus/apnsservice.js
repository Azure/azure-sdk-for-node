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

var _ = require('underscore');

var azureutil = require('../../util/util');
var Constants = require('../../util/constants');
var HeaderConstants = Constants.HeaderConstants;

/**
* Creates a new ApnsService object.
*
* @constructor
*
* @param {NotificationHubService} notificationHubService The notification hub service.
*/
function ApnsService(notificationHubService) {
  this.notificationHubService = notificationHubService;
}

/**
* Sends an APNS notification.
*
* @param {string}             hub                         A string object that repesents the notification hub name.
* @param {object|string}      payload                     The message's JSON or string payload.
* @param [number]             [payload.badge]             The number to display over the app icon.
* @param [string]             [payload.alert]             The alert text.
* @param [string]             [payload.sound]             The sound file name.
* @param [object]             [payload.payload]           The payload object that contains the notification text.
* @param [date]               [payload.expiry]            The expiration date.
* @param {object|function}    [optionsOrCallback]         The request options or callback function.
* @param {string}             [optionsOrCallback.tags]    Comma-separated list of tag identifiers.
* @param {string|date}        [optionsOrCallback.expiry]  The APNS expiry.
* @param {function(error, response)} callback             The callback function.
* @return {undefined}
*/
ApnsService.prototype.send = function (hub, payload, optionsOrCallback, callback) {
  var options;
  azureutil.normalizeArgs(optionsOrCallback, callback, function (o, c) { options = o; callback = c; });

  if (!_.isString(payload) && !_.isObject(payload)) {
    throw new Error('The payload parameter must be the notification payload string or object.');
  }

  if (!_.isFunction(callback)) {
    throw new Error('The callback parameter must be the callback function.');
  }

  if (!_.isString(payload)) {
    payload = JSON.stringify({ aps: payload });
  }

  options[HeaderConstants.SERVICE_BUS_NOTIFICATION_FORMAT] = 'apple';
  if (options.tags) {
    options[HeaderConstants.SERVICE_BUS_NOTIFICATION_TAGS] = options.tags;
    delete options.tags;
  }

  if (options.expiry) {
    options.expiry = new Date(options.expiry);
    options[HeaderConstants.SERVICE_BUS_NOTIFICATION_APNS_EXPIRY] = options.expiry.toISOString();
    delete options.expiry;
  }

  this.notificationHubService._sendNotification(hub, payload, options, callback);
};

module.exports = ApnsService;