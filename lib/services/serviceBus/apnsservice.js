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
var validate = require('../../util/validate');
var HttpConstants = Constants.HttpConstants;
var HeaderConstants = Constants.HeaderConstants;

var WebResource = require('../../http/webresource');

var registrationResult = require('./models/registrationresult');

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

  payload = _.clone(payload);
  if (payload.payload) {
    Object.keys(payload.payload).forEach(function (property) {
      payload[property] = payload.payload[property];
    });

    delete payload.payload;
  }

  if (payload.expiry) {
    var expiry = new Date(payload.expiry);
    headers[HeaderConstants.SERVICE_BUS_NOTIFICATION_APNS_EXPIRY] = expiry.toISOString();
    delete payload.expiry;
  }

  if (!_.isString(payload)) {
    payload = JSON.stringify({ aps: payload });
  }

  headers[HeaderConstants.CONTENT_TYPE] = 'application/json;charset="utf-8"';
  this.notificationHubService._sendNotification(payload, headers, callback);
};

/**
* Creates a native registration.
*
* @param {string}             token                       The device token.
* @param {object|function}    [optionsOrCallback]         The request options or callback function.
* @param {function(error, response)} callback             The callback function.
* @return {undefined}
*/
ApnsService.prototype.createNativeRegistration = function (token, optionsOrCallback, callback) {
  var options;
  azureutil.normalizeArgs(optionsOrCallback, callback, function (o, c) { options = o; callback = c; });

  validate.isValidFunction(callback);

  var registrationXml = registrationResult.serialize('AppleRegistrationDescription', {
    DeviceToken: token
  });

  var webResource = WebResource.post(this.notificationHubService.hubName + '/registrations')
    .withOkCode(HttpConstants.HttpResponseCodes.Ok);

  this.notificationHubService._executeRequest(webResource, registrationXml, registrationResult, null, callback);
};

/**
* Creates a template registration.
*
* @param {string}             token                       The device token.
* @param {string|array}       tags                        The tags.
* @param {object|string}      template                    The message's JSON or string payload.
* @param [number]             [template.badge]            The number to display over the app icon.
* @param [string]             [template.alert]            The alert text.
* @param [string]             [template.sound]            The sound file name.
* @param [object]             [template.payload]          The payload object that contains the notification text.
* @param [date]               [template.expiry]           The expiration date.
* @param {object|function}    [optionsOrCallback]         The request options or callback function.
* @param {function(error, response)} callback             The callback function.
* @return {undefined}
*/
ApnsService.prototype.createTemplateRegistration = function (token, tags, template, optionsOrCallback, callback) {
  var options;
  azureutil.normalizeArgs(optionsOrCallback, callback, function (o, c) { options = o; callback = c; });

  validate.isValidFunction(callback);

  if (!_.isString(template) && !_.isObject(template)) {
    throw new Error('The payload parameter must be the notification payload string or object.');
  }

  var registrationXml = this._createTemplateBody(token, tags, template);

  var webResource = WebResource.post(this.notificationHubService.hubName + '/registrations')
    .withOkCode(HttpConstants.HttpResponseCodes.Ok);

  this.notificationHubService._executeRequest(webResource, registrationXml, registrationResult, null, callback);
};

/**
* Updates a template registration.
*
* @param {string}             registrationId              The registration identifier.
* @param {string}             token                       The device token.
* @param {object|string}      template                    The message's JSON or string payload.
* @param [number]             [template.badge]            The number to display over the app icon.
* @param [string]             [template.alert]            The alert text.
* @param [string]             [template.sound]            The sound file name.
* @param [object]             [template.payload]          The payload object that contains the notification text.
* @param [date]               [template.expiry]           The expiration date.
* @param {object|function}    [optionsOrCallback]         The request options or callback function.
* @param {function(error, response)} callback             The callback function.
* @return {undefined}
*/
ApnsService.prototype.updateTemplateRegistration = function (registrationId, token, tags, template, optionsOrCallback, callback) {
  var options;
  azureutil.normalizeArgs(optionsOrCallback, callback, function (o, c) { options = o; callback = c; });

  validate.isValidFunction(callback);

  if (!_.isString(template) && !_.isObject(template)) {
    throw new Error('The payload parameter must be the notification payload string or object.');
  }

  var registrationXml = this._createTemplateBody(token, tags, template);

  var webResource = WebResource.put(this.notificationHubService.hubName + '/registrations/' + registrationId)
    .withOkCode(HttpConstants.HttpResponseCodes.Ok);

  if (options && options.etag) {
    webResource.addOptionalHeader(HeaderConstants.IF_MATCH, options.etag);
  } else {
    webResource.addOptionalHeader(HeaderConstants.IF_MATCH, '*');
  }

  this.notificationHubService._executeRequest(webResource, registrationXml, registrationResult, null, callback);
};

/**
* Retrieves a registration by device token.
*
* @param {string}             token                       The device token.
* @param {object|function}    [optionsOrCallback]         The request options or callback function. Additional properties will be passed as headers.
* @param {object|function}    [optionsOrCallback.top]     Specifies the maximum number of registration to obtain from the call.
* @param {object|function}    [optionsOrCallback.skip]    Specifies the number of registrations to skip in the call.
* @param {function(error, response)} callback             The callback function.
* @return {undefined}
*/
ApnsService.prototype.listRegistrationsByToken = function (token, optionsOrCallback, callback) {
  var options;
  azureutil.normalizeArgs(optionsOrCallback, callback, function (o, c) { options = o; callback = c; });

  validate.isValidFunction(callback);

  var webResource = WebResource.get(this.hubName + '/registrations/')
    .addOptionalQueryParam('$filter', 'deviceToken eq \'' + token + '\'');

  if (options) {
    if (options.top) {
      webResource.addOptionalQueryParam('$top', options.top);
    }

    if (options.skip) {
      webResource.addOptionalQueryParam('$skip', options.skip);
    }
  }

  this._executeRequest(webResource, null, registrationResult, null, callback);
};

/**
* Creates a template registration body.
*
* @param {string}  token     The device token.
* @param {json}    template  The template for the registration.
* @return {string}  The template body.
*/
ApnsService.prototype._createTemplateBody = function (token, tags, template) {
  var registration = {
    DeviceToken: token
  };

  var payload = _.clone(template);
  if (payload.payload) {
    Object.keys(payload.payload).forEach(function (property) {
      payload[property] = payload.payload[property];
    });

    delete payload.payload;
  }

  if (payload.expiry) {
    registration['Expiry'] = payload.expiry;
    delete payload.expiry;
  }

  if (!_.isString(payload)) {
    payload = JSON.stringify({ aps: payload });
  }

  registration['BodyTemplate'] = '<![CDATA[' + payload + ']]>';

  return registrationResult.serialize('AppleTemplateRegistrationDescription', registration);
};

module.exports = ApnsService;