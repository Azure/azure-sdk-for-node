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
var path = require('path');

var ServiceBusServiceBase = require('./servicebusservicebase');
var WnsService = require('./wnsservice');
var ApnsService = require('./apnsservice');

var azureutil = require('../../util/util');
var WebResource = require('../../http/webresource');
var Constants = require('../../util/constants');
var HeaderConstants = Constants.HeaderConstants;

var notificationHubResult = require('./models/notificationhubresult');

/**
* Creates a new NotificationHubService object.
*
* @constructor
* @augments {ServiceClient}
*
* @param {string} [namespaceOrConnectionString]  The service bus namespace or the connection string.
* @param {string} [accessKey]                    The password. Only necessary if no connection string passed.
* @param {string} [issuer]                       The issuer.
* @param {string} [acsNamespace]                 The acs namespace. Usually the same as the sb namespace with "-sb" suffix.
* @param {string} [host]                         The host address.
* @param {object} [authenticationProvider]       The authentication provider.
*/
function NotificationHubService(namespaceOrConnectionString, accessKey, issuer, acsNamespace, host, authenticationProvider) {
  NotificationHubService['super_'].call(this,
    namespaceOrConnectionString,
    accessKey,
    issuer,
    acsNamespace,
    host,
    authenticationProvider);

  this.wns = new WnsService(this);
  this.apns = new ApnsService(this);
}

util.inherits(NotificationHubService, ServiceBusServiceBase);

/**
* Validates a hub name.
*
* @param {string} topic The hub name.
* @return {undefined}
*/
function validateHubName(hub) {
  if (!azureutil.objectIsString(hub) || azureutil.stringIsEmpty(hub)) {
    throw new Error('Notification hub name must be a non empty string.');
  }
}

/**
* Validates a callback function.
*
* @param (function) callback The callback function.
* @return {undefined}
*/
function validateCallback(callback) {
  if (!callback) {
    throw new Error('Callback must be specified.');
  }
}

function setRequestHeaders(webResource, message) {
  for (var property in message) {
    if (property !== 'body') {
      webResource.addOptionalHeader(property, message[property]);
    }
  }
}

/**
* Creates a notification hub.
*
* @param {string}             hubPath                             A string object that represents the name of the notification hub.
* @param {object|function}    [optionsOrCallback]                 The request options or callback function.
* @param {array}              [optionsOrCallback.wns]             The WNS credentials.
* @param {array}              [optionsOrCallback.apns]            The APNS credentials.
* @param {function(error, result, response)} callback             The callback function.
* @return {undefined}
*/
NotificationHubService.prototype.createNotificationHub = function (hubPath, optionsOrCallback, callback) {
  validateHubName(hubPath);

  this._createResource(hubPath, notificationHubResult, null, optionsOrCallback, callback);
};

/**
* Gets a notification hub.
*
* @param {string}             hubPath                  A string object that represents the name of the notification hub.
* @param {function(error, result, response)} callback  The callback function.
* @return {undefined}
*/
NotificationHubService.prototype.getNotificationHub = function (hubPath, callback) {
  validateHubName(hubPath);

  var validateResult = function (responseObject) {
    if (!responseObject.error && !(responseObject.response.body && responseObject.response.body.entry)) {
      responseObject.error = new Error();
      responseObject.error.code = Constants.ServiceBusErrorCodeStrings.NOTIFICATION_HUB_NOT_FOUND;
      responseObject.error.details = 'Invalid Notification Hub';

      return false;
    }

    return true;
  };


  this._getResource(hubPath, notificationHubResult, [ validateResult ], callback);
};

/**
* Returns a list of notification hubs.
*
* @param {object|function}    [optionsOrCallback]       The request options or callback function.
* @param {int}                [optionsOrCallback.top]   The number of topics to fetch.
* @param {int}                [optionsOrCallback.skip]  The number of topics to skip.
* @param {function(error, result, response)} callback   The callback function.
* @return {undefined}
*/
NotificationHubService.prototype.listNotificationHubs = function (optionsOrCallback, callback) {
  this._listResources('/$Resources/NotificationHubs', notificationHubResult, null, optionsOrCallback, callback);
};

/**
* Deletes a notification hub.
*
* @param {string}             hubPath          A string object that represents the name of the notification hub.
* @param {function(error, response)} callback  The callback function.
* @return {undefined}
*/
NotificationHubService.prototype.deleteNotificationHub = function (hubPath, callback) {
  validateHubName(hubPath);

  this._deleteResource(hubPath, callback);
};

/**
* Sends a message.
*
* @param {string}             hub                                                                  A string object that repesents the notification hub name.
* @param {object|string}      message                                                              A message object that represents the message to send.
* @param {string}             message.body                                                         The message's XML payload.
* @param {string}             [message.ServiceBusNotification-Tags]                                Comma-separated list of tag identifiers.
* @param {string}             [message.ServiceBusNotification-Format]                              String. 'Apple' or 'Windows'.
* @param {string}             [message.ServiceBusNotification-ApnsExpiry]                          The expiry date.
* @param {function(error, response)} callback                                                      The callback function.
* @return {undefined}
*/
NotificationHubService.prototype._sendNotification = function (hub, message, callback) {
  validateCallback(callback);

  if (azureutil.objectIsString(message)) {
    message = { body: message };
  }

  var webResource = WebResource.post(path.join(hub, 'Messages'));
  webResource.addOptionalHeader(HeaderConstants.CONTENT_TYPE, 'application/xml;charset="utf-8"');
  webResource.addOptionalHeader(HeaderConstants.CONTENT_LENGTH, Buffer.byteLength(message.body, 'utf8'));

  setRequestHeaders(webResource, message);

  this._executeRequest(webResource, message.body, null, null, callback);
};

module.exports = NotificationHubService;
