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
var url = require('url');

var ServiceBusServiceBase = require('./servicebusservicebase');
var WnsService = require('./wnsservice');
var ApnsService = require('./apnsservice');

var azureutil = require('../../util/util');
var SharedAccessSignature = require('./sharedaccesssignature');
var WebResource = require('../../http/webresource');
var Constants = require('../../util/constants');
var HeaderConstants = Constants.HeaderConstants;

/**
* Creates a new NotificationHubService object.
*
* @param {string} hubName                         The notification hub name.
* @param {string} [endpointOrConnectionString]    The service bus endpoint or connection string.
* @param {string} [sharedAccessKeyName]           The notification hub shared access key name.
* @param {string} [sharedAccessKeyValue]          The notification hub shared access key value.
*/
function NotificationHubService(hubName, endpointOrConnectionString, sharedAccessKeyName, sharedAccessKeyValue) {
  var authenticationProvider;
  var host;
  var namespaceOrConnectionString = endpointOrConnectionString;
  var accessKey;

  if (sharedAccessKeyName && sharedAccessKeyValue) {
    authenticationProvider = new SharedAccessSignature(sharedAccessKeyName, sharedAccessKeyValue);

    var parsedUrl = url.parse(endpointOrConnectionString);
    host = parsedUrl.href;
    namespaceOrConnectionString = parsedUrl.host.split('.')[0];
    accessKey = '';
  }

  NotificationHubService['super_'].call(this,
    namespaceOrConnectionString,
    accessKey,
    undefined,
    undefined,
    host,
    authenticationProvider);

  this.hubName = hubName;
  this.wns = new WnsService(this);
  this.apns = new ApnsService(this);
}

util.inherits(NotificationHubService, ServiceBusServiceBase);

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
* Sends a message.
*
* @param {object|string}      payload                                                              The message's payload.
* @param {object|function}    [optionsOrCallback]                                                  The request options or callback function. Additional properties will be passed as headers.
* @param {string}             [optionsOrCallback.ServiceBusNotification-Tags]                      Comma-separated list of tag identifiers.
* @param {string}             [optionsOrCallback.ServiceBusNotification-Format]                    String. 'apple' or 'windows'.
* @param {string}             [optionsOrCallback.ServiceBusNotification-ApnsExpiry]                The expiry date.
* @param {function(error, response)} callback                                                      The callback function.
* @return {undefined}
*/
NotificationHubService.prototype._sendNotification = function (payload, optionsOrCallback, callback) {
  var options;
  azureutil.normalizeArgs(optionsOrCallback, callback, function (o, c) { options = o; callback = c; });

  validateCallback(callback);

  var webResource = WebResource.post(this.hubName + '/Messages');
  setRequestHeaders(webResource, options);

  if (!webResource.headers[HeaderConstants.CONTENT_TYPE]) {
    webResource.addOptionalHeader(HeaderConstants.CONTENT_TYPE, 'text/xml;charset="utf-8"');
  }

  webResource.addOptionalHeader(HeaderConstants.CONTENT_LENGTH, Buffer.byteLength(payload, 'utf8'));

  this._executeRequest(webResource, payload, null, null, callback);
};

module.exports = NotificationHubService;