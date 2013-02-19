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

/**
* Creates a new ApsnService object.
*
* @constructor
*
* @param {NotificationHubService} [notificationHubService] The notification hub service.
*/
function ApnsService(notificationHubService) {
  this.notificationHubService = notificationHubService;
}

/**
* Sends an APNS notification.
*
* @param {string}             hub                         A string object that repesents the notification hub name.
* @param {object|string}      payload                     The message's JSON payload.
* @param {object|function}    [optionsOrCallback]         The request options or callback function.
* @param {string}             [optionsOrCallback.tags]    Comma-separated list of tag identifiers.
* @param {string}             [optionsOrCallback.expiry]  The APNS expiry.
* @param {function(error, response)} callback             The callback function.
* @return {undefined}
*/
ApnsService.prototype.send = function (hub, payload, optionsOrCallback, callback) {
  var options = null;
  if (typeof optionsOrCallback === 'function' && !callback) {
    callback = optionsOrCallback;
  } else {
    options = optionsOrCallback;
  }

  var message = {
    body: payload,
    'ServiceBusNotification-Format': 'apple'
  };

  if (!_.isString(message.body)) {
    message.body = JSON.stringify(message.body);
  }

  if (options) {
    if (options.tags) {
      message['ServiceBusNotification-Tags'] = options.tags;
    }

    if (options.expiry) {
      if (!_.isDate(options.expiry)) {
        options.expiry = new Date(options.expiry);
      }

      message['ServiceBusNotification-ApnsExpiry'] = options.expiry.toISOString();
    }
  }

  this.sendNotification(hub, message, callback);
};

module.exports = ApnsService;