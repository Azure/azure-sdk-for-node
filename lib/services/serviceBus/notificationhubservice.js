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
var _ = require('underscore');
var util = require('util');

var ServiceBusServiceBase = require('./servicebusservicebase');
var WnsService = require('./wnsservice');
var ApnsService = require('./apnsservice');
var GcmService = require('./gcmservice');
var ServiceBusSettings = require('../core/servicebussettings');

var azureutil = require('../../util/util');
var WebResource = require('../../http/webresource');
var Constants = require('../../util/constants');
var HeaderConstants = Constants.HeaderConstants;

var registrationResult = require('./models/registrationresult');

/**
* Creates a new NotificationHubService object.
*
* @param {string} hubName                         The notification hub name.
* @param {string} [endpointOrConnectionString]    The service bus endpoint or connection string.
* @param {string} [sharedAccessKeyName]           The notification hub shared access key name.
* @param {string} [sharedAccessKeyValue]          The notification hub shared access key value.
*/
function NotificationHubService(hubName, endpointOrConnectionString, sharedAccessKeyName, sharedAccessKeyValue) {
  var settingsOrConnectionString = endpointOrConnectionString;

  if (sharedAccessKeyName && sharedAccessKeyValue) {
    settingsOrConnectionString = ServiceBusSettings.createFromSettings({
      endpoint: endpointOrConnectionString,
      sharedaccesskeyname: sharedAccessKeyName,
      sharedaccesskey: sharedAccessKeyValue
    });
  }

  NotificationHubService['super_'].call(this, settingsOrConnectionString);

  this.hubName = hubName;
  this.wns = new WnsService(this);
  this.apns = new ApnsService(this);
  this.gcm = new GcmService(this);
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
      webResource.withHeader(property, message[property]);
    }
  }
}

/**
* Sends a template message.
*
* @param {array|string}       tags                         Comma-separated list or array of tag identifiers.
* @param {object|string}      payload                      The message's payload.
* @param {object|function}    [optionsOrCallback]          The request options or callback function. 
* @param {string}             [optionsOrCallback.headers]  Additional headers.
* @param {function(error, response)} callback              The callback function.
* @return {undefined}
*/
NotificationHubService.prototype.send = function (tags, payload, optionsOrCallback, callback) {
  var options;
  azureutil.normalizeArgs(optionsOrCallback, callback, function (o, c) { options = o; callback = c; });

  if (!_.isString(payload) && !_.isObject(payload)) {
    throw new Error('The payload parameter must be the notification payload string or object.');
  }

  if (!_.isFunction(callback)) {
    throw new Error('The callback parameter must be a function.');
  }

  var headers = {};
  headers[HeaderConstants.SERVICE_BUS_NOTIFICATION_FORMAT] = 'template';

  if (tags) {
    if (_.isArray(tags)) {
      tags = tags.join(',');
    }

    headers[HeaderConstants.SERVICE_BUS_NOTIFICATION_TAGS] = tags;
  }

  if (!_.isString(payload)) {
    payload = JSON.stringify({ aps: payload });
  }

  if (options && options.headers) {
    Object.keys(options.headers).forEach(function (header) {
      headers[header] = options.headers[header];
    });
  }

  headers[HeaderConstants.CONTENT_TYPE] = 'application/json';

  this._sendNotification(payload, headers, callback);
};

/**
* Retrieves a registration.
*
* @param {string}             registrationId       The registration identifier.
* @param {object|function}    [optionsOrCallback]  The request options or callback function. Additional properties will be passed as headers.
* @param {function(error, response)} callback      The callback function.
* @return {undefined}
*/
NotificationHubService.prototype.getRegistration = function (registrationId, optionsOrCallback, callback) {
  var options;
  azureutil.normalizeArgs(optionsOrCallback, callback, function (o, c) { options = o; callback = c; });

  validateCallback(callback);

  var webResource = WebResource.get(this.hubName + '/registrations/' + registrationId);

  this._executeRequest(webResource, null, registrationResult, null, callback);
};

/**
* Deletes a registration.
*
* @param {string}             registrationId            The registration identifier.
* @param {object|function}    [optionsOrCallback]       The request options or callback function. Additional properties will be passed as headers.
* @param {object|function}    [optionsOrCallback.etag]  The etag.
* @param {function(error, response)} callback           The callback function.
* @return {undefined}
*/
NotificationHubService.prototype.deleteRegistration = function (registrationId, optionsOrCallback, callback) {
  var options;
  azureutil.normalizeArgs(optionsOrCallback, callback, function (o, c) { options = o; callback = c; });

  validateCallback(callback);

  var webResource = WebResource.del(this.hubName + '/registrations/' + registrationId);

  if (options && options.etag) {
    webResource.withHeader(HeaderConstants.IF_MATCH, options.etag);
  } else {
    webResource.withHeader(HeaderConstants.IF_MATCH, '*');
  }

  this._executeRequest(webResource, null, null, null, callback);
};

/**
* Updates a registration.
*
* @param {string}             registration              The registration to update.
* @param {object|function}    [optionsOrCallback]       The request options or callback function. Additional properties will be passed as headers.
* @param {object|function}    [optionsOrCallback.etag]  The etag.
* @param {function(error, response)} callback           The callback function.
* @return {undefined}
*/
NotificationHubService.prototype.updateRegistration = function (registration, optionsOrCallback, callback) {
  var options;
  azureutil.normalizeArgs(optionsOrCallback, callback, function (o, c) { options = o; callback = c; });

  validateCallback(callback);

  if (!registration || !registration.RegistrationId) {
    throw new Error('Invalid registration');
  }

  var webResource = WebResource.put(this.hubName + '/registrations/' + registration.RegistrationId);

  registration = _.clone(registration);
  var registrationType = registration[Constants.ATOM_METADATA_MARKER]['ContentRootElement'];
  delete registration[Constants.ATOM_METADATA_MARKER];
  delete registration.ExpirationTime;
  delete registration.Expiry;
  delete registration.TemplateName;

  var registrationXml = registrationResult.serialize(registrationType, registration);

  if (options && options.etag) {
    webResource.withHeader(HeaderConstants.IF_MATCH, options.etag);
  } else {
    webResource.withHeader(HeaderConstants.IF_MATCH, '*');
  }

  this._executeRequest(webResource, registrationXml, registrationResult, null, callback);
};

/**
* List registrations.
*
* @param {object|function}    [optionsOrCallback]       The request options or callback function. Additional properties will be passed as headers.
* @param {object|function}    [optionsOrCallback.top]   Specifies the maximum number of registration to obtain from the call.
* @param {object|function}    [optionsOrCallback.skip]  Specifies the number of registrations to skip in the call.
* @param {function(error, response)} callback           The callback function.
* @return {undefined}
*/
NotificationHubService.prototype.listRegistrations = function (optionsOrCallback, callback) {
  var options;
  azureutil.normalizeArgs(optionsOrCallback, callback, function (o, c) { options = o; callback = c; });

  validateCallback(callback);

  var webResource = WebResource.get(this.hubName + '/registrations');

  if (options) {
    if (options.top) {
      webResource.withQueryOption('$top', options.top);
    }

    if (options.skip) {
      webResource.withQueryOption('$skip', options.skip);
    }
  }

  this._executeRequest(webResource, null, registrationResult, null, callback);
};

/**
* Retrieves a registration by tag.
*
* @param {string}             tag                       The registration tag.
* @param {object|function}    [optionsOrCallback]       The request options or callback function. Additional properties will be passed as headers.
* @param {object|function}    [optionsOrCallback.top]   Specifies the maximum number of registration to obtain from the call.
* @param {object|function}    [optionsOrCallback.skip]  Specifies the number of registrations to skip in the call.
* @param {function(error, response)} callback           The callback function.
* @return {undefined}
*/
NotificationHubService.prototype.listRegistrationsByTag = function (tag, optionsOrCallback, callback) {
  var options;
  azureutil.normalizeArgs(optionsOrCallback, callback, function (o, c) { options = o; callback = c; });

  validateCallback(callback);

  var webResource = WebResource.get(this.hubName + '/tags/' + tag + '/registrations');

  if (options) {
    if (options.top) {
      webResource.withQueryOption('$top', options.top);
    }

    if (options.skip) {
      webResource.withQueryOption('$skip', options.skip);
    }
  }

  this._executeRequest(webResource, null, registrationResult, null, callback);
};

/**
* Sends a message.
*
* @param {object|string}      payload                                                The message's payload.
* @param {object|function}    [optionsOrCallback]                                    The request options or callback function. Additional properties will be passed as headers.
* @param {string}             [optionsOrCallback.ServiceBusNotification-Tags]        Comma-separated list of tag identifiers.
* @param {string}             [optionsOrCallback.ServiceBusNotification-Format]      String. 'apple' or 'windows'.
* @param {string}             [optionsOrCallback.ServiceBusNotification-ApnsExpiry]  The expiry date.
* @param {function(error, response)} callback                                        The callback function.
* @return {undefined}
*/
NotificationHubService.prototype._sendNotification = function (payload, optionsOrCallback, callback) {
  var options;
  azureutil.normalizeArgs(optionsOrCallback, callback, function (o, c) { options = o; callback = c; });

  validateCallback(callback);

  var webResource = WebResource.post(this.hubName + '/Messages');
  setRequestHeaders(webResource, options);

  if (!webResource.headers[HeaderConstants.CONTENT_TYPE]) {
    webResource.withHeader(HeaderConstants.CONTENT_TYPE, 'text/xml;charset="utf-8"');
  }

  webResource.withHeader(HeaderConstants.CONTENT_LENGTH, Buffer.byteLength(payload, 'utf8'));
  webResource.queryString[Constants.ServiceBusConstants.API_VERSION_QUERY_KEY] = null;

  this._executeRequest(webResource, payload, null, null, callback);
};

module.exports = NotificationHubService;