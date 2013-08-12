/*
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
var HeaderConstants = Constants.HeaderConstants;

var WebResource = require('../../http/webresource');

var registrationResult = require('./models/registrationresult');

/**
* Creates a new GcmService object.
*
* __Note__: An instance of this object is created automatically when a {@link NotificationHubService}
* object is created. See {@link NotificationHubService#gcm}.
* @class
* The GcmService class is used to send notifications using [Google Cloud Messaging](http://developer.android.com/google/gcm/index.html).
* @constructor
*
* @param {NotificationHubService} notificationHubService The notification hub service.
*/
function GcmService(notificationHubService) {
  this.notificationHubService = notificationHubService;
}

/**
* Sends a GCM notification.
*
* @param {array|string}       tags                        Comma-separated list or array of tag identifiers.
* @param {object|string}      payload                     The message's JSON or string payload.
* @param {Function(error, response)} callback             `error` will contain information
*                                                         if an error occurs; otherwise, `response`
*                                                         will contain information related to this operation.
* @return {undefined}
*/
GcmService.prototype.send = function (tags, payload, callback) {
  var headers = {};

  if (!_.isString(payload) && !_.isObject(payload)) {
    throw new Error('The payload parameter must be the notification payload string or object.');
  }

  if (!_.isFunction(callback)) {
    throw new Error('The callback parameter must be the callback function.');
  }

  headers[HeaderConstants.SERVICE_BUS_NOTIFICATION_FORMAT] = 'gcm';
  if (tags) {
    if (_.isArray(tags)) {
      tags = tags.join(',');
    }

    headers[HeaderConstants.SERVICE_BUS_NOTIFICATION_TAGS] = tags;
  }

  if (!_.isString(payload)) {
    payload = JSON.stringify(payload);
  }

  headers[HeaderConstants.CONTENT_TYPE] = 'application/json;charset="utf-8"';
  this.notificationHubService._sendNotification(payload, headers, callback);
};

/**
* Creates a native registration.
*
* @param {string}             gcmRegistrationId           The gcm registration identifier.
* @param {string|array}       tags                        The tags.
* @param {object}             [options]                   The request options or callback function.
* @param {string}             [options.registrationId]    The registration identifier.
* @param {Function(error, response)} callback             `error` will contain information
*                                                         if an error occurs; otherwise, `response`
*                                                         will contain information related to this operation.
* @return {undefined}
*/
GcmService.prototype.createNativeRegistration = function (gcmRegistrationId, tags, optionsOrCallback, callback) {
  var options;
  azureutil.normalizeArgs(optionsOrCallback, callback, function (o, c) { options = o; callback = c; });

  validate.isValidFunction(callback);

  var registrationXml = this._createBody('GcmRegistrationDescription', gcmRegistrationId, tags, null, options);
  var webResource = WebResource.post(this.notificationHubService.hubName + '/registrations');

  this.notificationHubService._executeRequest(webResource, registrationXml, registrationResult, null, callback);
};

/**
* Creates a template registration.
*
* @param {string}             gcmRegistrationId           The gcm registration identifier.
* @param {string|array}       tags                        The tags.
* @param {object|string}      template                    The message's JSON or string payload.
* @param {object}             [options]                   The request options or callback function.
* @param {Function(error, response)} callback             `error` will contain information
*                                                         if an error occurs; otherwise, `response`
*                                                         will contain information related to this operation.
* @return {undefined}
*/
GcmService.prototype.createTemplateRegistration = function (gcmRegistrationId, tags, template, optionsOrCallback, callback) {
  var options;
  azureutil.normalizeArgs(optionsOrCallback, callback, function (o, c) { options = o; callback = c; });

  validate.isValidFunction(callback);

  if (!_.isString(template) && !_.isObject(template)) {
    throw new Error('The payload parameter must be the notification payload string or object.');
  }

  var registrationXml = this._createTemplateBody(gcmRegistrationId, tags, template);

  var webResource = WebResource.post(this.notificationHubService.hubName + '/registrations');

  this.notificationHubService._executeRequest(webResource, registrationXml, registrationResult, null, callback);
};

/**
* Updates a template registration.
*
* @param {string}             registrationId              The registration identifier.
* @param {string}             gcmRegistrationId           The gcm registration identifier.
* @param {object|string}      template                    The message's JSON or string payload.
* @param {object}             [options]                   The request options or callback function.
* @param {Function(error, response)} callback             `error` will contain information
*                                                         if an error occurs; otherwise, `response`
*                                                         will contain information related to this operation.
* @return {undefined}
*/
GcmService.prototype.updateTemplateRegistration = function (registrationId, gcmRegistrationId, tags, template, optionsOrCallback, callback) {
  var options;
  azureutil.normalizeArgs(optionsOrCallback, callback, function (o, c) { options = o; callback = c; });

  validate.isValidFunction(callback);

  if (!_.isString(template) && !_.isObject(template)) {
    throw new Error('The payload parameter must be the notification payload string or object.');
  }

  var registrationXml = this._createTemplateBody(gcmRegistrationId, tags, template);

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
* @param {string}             gcmRegistrationId           The gcm registration identifier.
* @param {object}             [options]                   The request options or callback function. Additional properties will be passed as headers.
* @param {object}             [options.top]               Specifies the maximum number of registration to obtain from the call.
* @param {object}             [options.skip]              Specifies the number of registrations to skip in the call.
* @param {Function(error, response)} callback             `error` will contain information
*                                                         if an error occurs; otherwise, `response`
*                                                         will contain information related to this operation.
* @return {undefined}
*/
GcmService.prototype.listRegistrationsByGcmRegistrationId = function (gcmRegistrationId, optionsOrCallback, callback) {
  var options;
  azureutil.normalizeArgs(optionsOrCallback, callback, function (o, c) { options = o; callback = c; });

  validate.isValidFunction(callback);

  var webResource = WebResource.get(this.notificationHubService.hubName + '/registrations/')
    .withQueryOption('$filter', 'GcmRegistrationId eq \'' + gcmRegistrationId + '\'');

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
* @param {string}             gcmRegistrationId                   The registration identifier.
* @param {string|array}       tags                                The tags.
* @param {json}               template                            The template for the registration.
* @param {object|function}    [options]                           The request options or callback function.
* @param {object|function}    [options.pnsCredentialName]         The pns credentials to use.
* @return {string}  The template body.
*/
GcmService.prototype._createBody = function (elementName, gcmRegistrationId, tags, template, options) {
  var registration = {};

  if (options) {
    if (options.pnsCredentialName) {
      registration['PnsCredentialName'] = options.pnsCredentialName;
    }
  }

  if (tags) {
    if (_.isArray(tags)) {
      tags = tags.join(',');
    }

    registration.Tags = tags;
  }

  registration.GcmRegistrationId = gcmRegistrationId;

  if (template) {
    var payload = _.clone(template);
    if (!_.isString(payload)) {
      payload = JSON.stringify(payload);
    }

    registration.BodyTemplate = '<![CDATA[' + payload + ']]>';
  }

  return registrationResult.serialize(elementName, registration);
};

/**
* Creates a template registration body.
* @ignore
* 
* @param {string}             gcmRegistrationId                   The registration identifier.
* @param {string|array}       tags                                The tags.
* @param {json}               template                            The template for the registration.
* @param {object|function}    [options]                           The request options or callback function.
* @return {string}  The template body.
*/
GcmService.prototype._createTemplateBody = function (gcmRegistrationId, tags, template, options) {
  return this._createBody('GcmTemplateRegistrationDescription', gcmRegistrationId, tags, template, options);
};

module.exports = GcmService;