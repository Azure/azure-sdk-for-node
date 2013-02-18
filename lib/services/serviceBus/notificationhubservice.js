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

var ServiceBusServiceBase = require('./servicebusservicebase');

var azureutil = require('../../util/util');
var Constants = require('../../util/constants');

var NotificationHubResult = require('./models/notificationhubresult');

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
* Creates a notification hub.
*
* @param {string}             hubPath                             A string object that represents the name of the notification hub.
* @param {object|function}    [optionsOrCallback]                 The request options or callback function.
* @param {array}              [optionsOrCallback.WnsCredential]   The WNS credentials.
* @param {array}              [optionsOrCallback.ApnsCredential]  The APNS credentials.
* @param {function(error, result, response)} callback             The callback function.
* @return {undefined}
*/
NotificationHubService.prototype.createNotificationHub = function (hubPath, optionsOrCallback, callback) {
  validateHubName(hubPath);

  this._createResource(hubPath, NotificationHubResult, optionsOrCallback, callback);
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


  this._getResource(hubPath, NotificationHubResult, [ validateResult ], callback);
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
  this._listResources('/$Resources/NotificationHubs', NotificationHubResult, null, optionsOrCallback, callback);
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

module.exports = NotificationHubService;