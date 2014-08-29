// 
// Copyright (c) Microsoft and contributors.  All rights reserved.
// 
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//   http://www.apache.org/licenses/LICENSE-2.0
// 
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// 
// See the License for the specific language governing permissions and
// limitations under the License.
// 

var _ = require('underscore');

var azureCommon = require('azure-common');
var azureutil = azureCommon.util;
var Constants = azureCommon.Constants;
var validate = azureCommon.validate;
var HeaderConstants = Constants.HeaderConstants;
var WebResource = azureCommon.WebResource;

var registrationResult = require('./models/registrationresult');

/**
* Creates a new ApnsService object using the specified {@link NotificationHubService} object.
* 
*
* __Note__: An instance of this object is created automatically when a {@link NotificationHubService}
* object is created. See {@link NotificationHubService#apns}.
* @class
* The ApnsService class is used to send notifications using the Apple Push Notification Service (APNS).
* This service is used to communicate with iOS device.
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
* @param {string}                     tags                A single tag or tag expression.
*                                                         If null it will broadcast to all registrations in this hub
* @param {object|string}              payload             The message's JSON payload as specified below.
*                                                         If the payload is a string, follow the APNS format as in https://developer.apple.com/library/ios/documentation/NetworkingInternet/Conceptual/RemoteNotificationsPG/Chapters/ApplePushService.html#//apple_ref/doc/uid/TP40008194-CH100-SW1
* @param {date}                       [payload.expiry]    The expiration date. (in W3C DTF, YYYY-MM-DDThh:mmTZD (e.g. 1997-07-16T19:20+01:00))
* @param {object}                     [payload.aps]       If the 'aps' member is provided, the object is delivered to APNS as-is after expiry is processed. The object is assumed to follow the APNS format at https://developer.apple.com/library/ios/documentation/NetworkingInternet/Conceptual/RemoteNotificationsPG/Chapters/ApplePushService.html#//apple_ref/doc/uid/TP40008194-CH100-SW1
* @param {number}                     [payload.badge]     If the 'aps' member is not provided, the number to display over the app icon.
* @param {string}                     [payload.alert]     If the 'aps' member is not provided, the alert text.
* @param {string}                     [payload.sound]     If the 'aps' member is not provided, the sound file name.
* @param {object}                     [payload.payload]   If the 'aps' member is not provided, the payload object that contains the notification text.
* @param {Function(error, response)}  callback            `error` will contain information
*                                                         if an error occurs; otherwise, `response`
*                                                         will contain information related to this operation.
*
* @example
* notificationHubService.apns.send( null, {
*     alert: 'This is my toast message for iOS!',
*     expiry: '2014-07-16T19:20+01:00'
*   },
*   function (error) {
*     if (!error) {
*       // message sent successfully
*     }
* });
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
      tags = this.notificationHubService._joinTagsSend(tags);
    }

    headers[HeaderConstants.SERVICE_BUS_NOTIFICATION_TAGS] = tags;
  }

  if (!_.isString(payload)) {
    payload = _.clone(payload);

    if (payload.expiry) {
      var expiry = new Date(payload.expiry);
      headers[HeaderConstants.SERVICE_BUS_NOTIFICATION_APNS_EXPIRY] = expiry.toISOString();
      delete payload.expiry;
    }

    payload = this._formatPayload(payload);
  }

  headers[HeaderConstants.CONTENT_TYPE] = 'application/json;charset="utf-8"';
  this.notificationHubService._sendNotification(payload, headers, callback);
};

/**
* Creates a native registration.
*
* @param {string}                     token                       The device token.
* @param {string|array}               tags                        The tags (comma-separated list, no spaces).
* @param {object}                     [options]                   The request options
* @param {Function(error, response)}  callback                    `error` will contain information
*                                                                 if an error occurs; otherwise, `response`
*                                                                 will contain information related to this operation.
*/
ApnsService.prototype.createNativeRegistration = function (token, tags, optionsOrCallback, callback) {
  var options;
  azureutil.normalizeArgs(optionsOrCallback, callback, function (o, c) { options = o; callback = c; });

  validate.validateArgs('createNativeRegistration', function (v) {
    v.string(token, 'token');
    v.callback(callback);
  });

  var registrationXml = this._createBody('AppleRegistrationDescription', token, tags, null, options);
  var webResource = WebResource.post(this.notificationHubService.hubName + '/registrations');

  this.notificationHubService._executeRequest(webResource, registrationXml, registrationResult, null, callback);
};

/**
* Creates or updates a native registration.
*
* @param {string}                     registrationId              The registration identifier.
* @param {string}                     token                       The device token.
* @param {string|array}               tags                        The tags (comma-separated list, no spaces).
* @param {object}                     [options]                   The request options
* @param {Function(error, response)}  callback                    `error` will contain information
*                                                                 if an error occurs; otherwise, `response`
*                                                                 will contain information related to this operation.
*/
ApnsService.prototype.createOrUpdateNativeRegistration = function (registrationId, token, tags, optionsOrCallback, callback) {
  var options;
  azureutil.normalizeArgs(optionsOrCallback, callback, function (o, c) { options = o; callback = c; });

  validate.validateArgs('createOrUpdateNativeRegistration', function (v) {
    v.string(registrationId, 'registrationId');
    v.string(token, 'token');
    v.callback(callback);
  });

  var registrationXml = this._createBody('AppleRegistrationDescription', token, tags, null, options);
  var webResource = WebResource.put(this.notificationHubService.hubName + '/registrations/' + registrationId);

  this.notificationHubService._executeRequest(webResource, registrationXml, registrationResult, null, callback);
};

/**
* Creates a template registration.
*
* @param {string}                     token               The device token.
* @param {string|array}               tags                The tags.
* @param {object|string}              template            The message's JSON payload as specified below.
*                                                         If the payload is a string, follow the APNS format as in https://developer.apple.com/library/ios/documentation/NetworkingInternet/Conceptual/RemoteNotificationsPG/Chapters/ApplePushService.html#//apple_ref/doc/uid/TP40008194-CH100-SW1
* @param {date}                       [template.expiry]   The expiration date.
* @param {object}                     [template.aps]      If the 'aps' member is provided, the registration is delivered to NotifcationHub as-is after expiry is processed. The object is assumed to follow the APNS format at https://developer.apple.com/library/ios/documentation/NetworkingInternet/Conceptual/RemoteNotificationsPG/Chapters/ApplePushService.html#//apple_ref/doc/uid/TP40008194-CH100-SW1
* @param {number}                     [template.badge]    If the 'aps' member is not provided, the number to display over the app icon.
* @param {string}                     [template.alert]    If the 'aps' member is not provided, the alert text.
* @param {string}                     [template.sound]    If the 'aps' member is not provided, the sound file name.
* @param {object}                     [template.payload]  If the 'aps' member is not provided, the payload object that contains the notification text.
* @param {object}                     [options]           The request options.
* @param {Function(error, response)}  callback            `error` will contain information
*                                                         if an error occurs; otherwise, `response`
*                                                         will contain information related to this operation.
*/
ApnsService.prototype.createTemplateRegistration = function (token, tags, template, optionsOrCallback, callback) {
  var options;
  azureutil.normalizeArgs(optionsOrCallback, callback, function (o, c) { options = o; callback = c; });

  validate.validateArgs('createTemplateRegistration', function (v) {
    v.string(token, 'token');
    v.callback(callback);
  });

  if (!_.isString(template) && !_.isObject(template)) {
    throw new Error('The payload parameter must be the notification payload string or object.');
  }

  var registrationXml = this._createTemplateBody(token, tags, template);

  var webResource = WebResource.post(this.notificationHubService.hubName + '/registrations');
  this.notificationHubService._executeRequest(webResource, registrationXml, registrationResult, null, callback);
};

/**
* Creates or updates a template registration.
*
* @param {string}                     registrationId      The registration identifier.
* @param {string}                     token               The device token.
* @param {object|string}              template            The message's JSON payload as specified below.
*                                                         If the payload is a string, follow the APNS format as in https://developer.apple.com/library/ios/documentation/NetworkingInternet/Conceptual/RemoteNotificationsPG/Chapters/ApplePushService.html#//apple_ref/doc/uid/TP40008194-CH100-SW1
* @param {date}                       [template.expiry]   The expiration date.
* @param {object}                     [template.aps]      If the 'aps' member is provided, the registration is delivered to NotifcationHub as-is after expiry is processed. The object is assumed to follow the APNS format at https://developer.apple.com/library/ios/documentation/NetworkingInternet/Conceptual/RemoteNotificationsPG/Chapters/ApplePushService.html#//apple_ref/doc/uid/TP40008194-CH100-SW1
* @param {number}                     [template.badge]    If the 'aps' member is not provided, the number to display over the app icon.
* @param {string}                     [template.alert]    If the 'aps' member is not provided, the alert text.
* @param {string}                     [template.sound]    If the 'aps' member is not provided, the sound file name.
* @param {object}                     [template.payload]  If the 'aps' member is not provided, the payload object that contains the notification text.
* @param {object}                     [options]           The request options.
* @param {Function(error, response)}  callback            `error` will contain information
*                                                         if an error occurs; otherwise, `response`
*                                                         will contain information related to this operation.
*/
ApnsService.prototype.createOrUpdateTemplateRegistration = function (registrationId, token, tags, template, optionsOrCallback, callback) {
  var options;
  azureutil.normalizeArgs(optionsOrCallback, callback, function (o, c) { options = o; callback = c; });

  validate.validateArgs('createOrUpdateTemplateRegistration', function (v) {
    v.string(registrationId, 'registrationId');
    v.string(token, 'token');
    v.callback(callback);
  });

  if (!_.isString(template) && !_.isObject(template)) {
    throw new Error('The payload parameter must be the notification payload string or object.');
  }

  var registrationXml = this._createTemplateBody(token, tags, template, options);

  var webResource = WebResource.put(this.notificationHubService.hubName + '/registrations/' + registrationId);
  this.notificationHubService._executeRequest(webResource, registrationXml, registrationResult, null, callback);
};

/**
* Updates a template registration.
*
* @param {string}                     registrationId      The registration identifier.
* @param {string}                     token               The device token.
* @param {object|string}              template            The message's JSON payload as specified below.
*                                                         If the payload is a string, follow the APNS format as in https://developer.apple.com/library/ios/documentation/NetworkingInternet/Conceptual/RemoteNotificationsPG/Chapters/ApplePushService.html#//apple_ref/doc/uid/TP40008194-CH100-SW1
* @param {date}                       [template.expiry]   The expiration date.
* @param {object}                     [template.aps]      If the 'aps' member is provided, the registration is delivered to NotifcationHub as-is after expiry is processed. The object is assumed to follow the APNS format at https://developer.apple.com/library/ios/documentation/NetworkingInternet/Conceptual/RemoteNotificationsPG/Chapters/ApplePushService.html#//apple_ref/doc/uid/TP40008194-CH100-SW1
* @param {number}                     [template.badge]    If the 'aps' member is not provided, the number to display over the app icon.
* @param {string}                     [template.alert]    If the 'aps' member is not provided, the alert text.
* @param {string}                     [template.sound]    If the 'aps' member is not provided, the sound file name.
* @param {object}                     [template.payload]  If the 'aps' member is not provided, the payload object that contains the notification text.
* @param {object}                     [options]           The request options.
* @param {Function(error, response)}  callback            `error` will contain information
*                                                         if an error occurs; otherwise, `response`
*                                                         will contain information related to this operation.
*/
ApnsService.prototype.updateTemplateRegistration = function (registrationId, token, tags, template, optionsOrCallback, callback) {
  var options;
  azureutil.normalizeArgs(optionsOrCallback, callback, function (o, c) { options = o; callback = c; });

  validate.validateArgs('updateTemplateRegistration', function (v) {
    v.string(registrationId, 'registrationId');
    v.string(token, 'token');
    v.callback(callback);
  });

  if (!_.isString(template) && !_.isObject(template)) {
    throw new Error('The payload parameter must be the notification payload string or object.');
  }

  var registrationXml = this._createTemplateBody(token, tags, template, options);

  var webResource = WebResource.put(this.notificationHubService.hubName + '/registrations/' + registrationId);

  if (options && options.etag) {
    webResource.withHeader(HeaderConstants.IF_MATCH, options.etag);
  } else {
    webResource.withHeader(HeaderConstants.IF_MATCH, '*');
  }

  this.notificationHubService._executeRequest(webResource, registrationXml, registrationResult, null, callback);
};

/**
* Retrieves a registration by device token.
*
* @param {string}                     token               The device token.
* @param {object}                     [options]           The request options. Additional properties will be passed as headers.
* @param {object}                     [options.top]       Specifies the maximum number of registration to obtain from the call.
* @param {object}                     [options.skip]      Specifies the number of registrations to skip in the call.
* @param {Function(error, response)}  callback            `error` will contain information
*                                                         if an error occurs; otherwise, `response`
*                                                         will contain information related to this operation.
*/
ApnsService.prototype.listRegistrationsByToken = function (token, optionsOrCallback, callback) {
  var options;
  azureutil.normalizeArgs(optionsOrCallback, callback, function (o, c) { options = o; callback = c; });

  validate.validateArgs('listRegistrationsByToken', function (v) {
    v.string(token, 'token');
    v.callback(callback);
  });

  var webResource = WebResource.get(this.notificationHubService.hubName + '/registrations/')
    .withQueryOption('$filter', 'DeviceToken eq \'' + token.toUpperCase() + '\'');

  if (options) {
    if (options.top) {
      webResource.withQueryOption('$top', options.top);
    }

    if (options.skip) {
      webResource.withQueryOption('$skip', options.skip);
    }
  }

  this.notificationHubService._executeRequest(webResource, null, registrationResult, null, callback);
};

/**
* Creates a template registration body.
* @ignore
* 
* @param {string}             elementName                         The element name.
* @param {string}             token                               The device token.
* @param {string|array}       tags                                The tags.
* @param {json}               template                            The template for the registration.
* @param {object|function}    [options]                           The request options or callback function.
* @param {object|function}    [options.pnsCredentialName]         The pns credentials to use.
* @return {string}  The template body.
*/
ApnsService.prototype._createBody = function (elementName, token, tags, template, options) {
  var registration = {};

  if (options) {
    if (options.registrationId) {
      registration['RegistrationId'] = options.registrationId;
    }

    if (options.pnsCredentialName) {
      registration['PnsCredentialName'] = options.pnsCredentialName;
    }
  }

  if (tags) {
    if (_.isArray(tags)) {
      tags = this.notificationHubService._joinTags(tags);
    }

    registration.Tags = tags;
  }

  registration.DeviceToken = token;

  if (template) {
    var payload = _.clone(template);
    var expiry;

    if (!_.isString(payload)) {
      if (payload.expiry) {
        expiry = payload.expiry;
        delete payload.expiry;
      }

      payload = this._formatPayload(payload);
    }

    registration.BodyTemplate = '<![CDATA[' + payload + ']]>';

    // Expiry member must be set after BodyTemplate
    if (expiry) {
      registration.Expiry = expiry;
    }
  }

  return registrationResult.serialize(elementName, registration);
};

/**
* Creates a template registration body.
* @ignore
*
* @param {string}             token                               The device token.
* @param {string|array}       tags                                The tags.
* @param {json}               template                            The template for the registration.
* @param {object|function}    [options]                           The request options or callback function.
* @return {string}  The template body.
*/
ApnsService.prototype._createTemplateBody = function (token, tags, template, options) {
  return this._createBody('AppleTemplateRegistrationDescription', token, tags, template, options);
};

ApnsService.prototype._formatPayload = function (payload) {
  if (!payload.aps) {
    payload = { aps: payload };

    if (payload.aps.payload) {
      Object.keys(payload.aps.payload).forEach(function (innerPayloadMember) {
        payload[innerPayloadMember] = payload.aps.payload[innerPayloadMember];
      });

      delete payload.aps.payload;
    }
  }

  return JSON.stringify(payload);
};

module.exports = ApnsService;