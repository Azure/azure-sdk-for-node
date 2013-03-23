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
* @param {array|string}       tags                        Comma-separated list or array of tag identifiers.
* @param {object|string}      payload                     The message's JSON or string payload.
* @param [number]             [payload.badge]             The number to display over the app icon.
* @param [string]             [payload.alert]             The alert text.
* @param [string]             [payload.sound]             The sound file name.
* @param [object]             [payload.payload]           The payload object that contains the notification text.
* @param [date]               [payload.expiry]            The expiration date.
* @param {function(error, response)} callback             The callback function.
* @return {undefined}
*/
ApnsService.prototype.send = function (tags, payload, callback) {
  var headers = {};

  if (!_.isString(payload) && !_.isObject(payload)) {
    throw new Error('The payload parameter must be the notification payload string or object.');
  }

  if (!_.isFunction(callback)) {
    throw new Error('The callback parameter must be the callback function.');
  }

  headers[HeaderConstants.SERVICE_BUS_NOTIFICATION_FORMAT] = 'apple';
  if (tags) {
    if (_.isArray(tags)) {
      tags = tags.join(',');
    }

    headers[HeaderConstants.SERVICE_BUS_NOTIFICATION_TAGS] = tags;
  }

  if (payload.expiry) {
    var expiry = new Date(payload.expiry);
    headers[HeaderConstants.SERVICE_BUS_NOTIFICATION_APNS_EXPIRY] = expiry.toISOString();
    delete payload.expiry;
  }

  if (!_.isString(payload)) {
    payload = JSON.stringify({ aps: payload });
  }

  this.notificationHubService._sendNotification(payload, headers, callback);
};

module.exports = ApnsService;