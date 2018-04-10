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

// Module dependencies.
var _ = require('underscore');
var url = require('url');
var util = require('util');

var ServiceBusServiceBase = require('./servicebusservicebase');
var WnsService = require('./wnsservice');
var ApnsService = require('./apnsservice');
var GcmService = require('./gcmservice');
var MpnsService = require('./mpnsservice');

var azureCommon = require('azure-common');
var azureutil = azureCommon.util;
var WebResource = azureCommon.WebResource;
var Constants = azureCommon.Constants;
var HeaderConstants = Constants.HeaderConstants;

var ServiceBusSettings = azureCommon.ServiceBusSettings;

var registrationResult = require('./models/registrationresult');

/**
* Creates a new NotificationHubService object.
* @class
* The NotificationHubService allows you to send push notifications to iOS, Android, and Windows Store devices.
*
* For more information on Notification Hubs, as well as task focused information on using them from Node.js applications, see
* [How to Use Service Bus Notification Hubs](https://www.windowsazure.com/en-us/develop/nodejs/how-to-guides/service-bus-notification-hubs/).
* @constructor
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
	/**
	* Provides access to methods to send notifications to WNS (for Windows Store apps) and create/update registrations for Windows Store apps.
	* @type {WnsService}
	*
	*/
  this.wns = new WnsService(this);
	/**
	* Provides access to methods to send notifications to APNs (for iOS apps) and create/update registrations for iOS apps.
  * @type {ApnsService}
	*
	*/
  this.apns = new ApnsService(this);
	/**
	* Provides access to methods to send notifications to GCM (for Android apps) and create/update registrations for Android apps.
	* @type {GcmService}
	*
	*/
  this.gcm = new GcmService(this);
	/**
	* Provides access to methods to send notifications to MPNS (for Windows Phone apps) and create/update registrations for Windows Phone apps.
	* @type {MpnsService}
	*
	*/
  this.mpns = new MpnsService(this);
}

util.inherits(NotificationHubService, ServiceBusServiceBase);

/**
* Validates a callback function.
* @ignore
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
* @param {string}             tags                         A single tag or tag expression.
*                                                          If null it will broadcast to all registrations in this hub
* @param {object|string}      payload                      The message's payload.
* @param {object}             [options]                    The request options or callback function. 
* @param {string}             [options.headers]            Additional headers.
* @param {Function(error, response)} callback             `error` will contain information
*                                                         if an error occurs; otherwise, `response`
*                                                         will contain information related to this operation.
*
* @example
* var azure = require('azure');
* var notificationHubService = azure.createNotificationHubService('hubName', '{connection string}');
* notificationHubService.send( null, { message: 'This is my toast message for iOS!' }, function (error) {
*   if (!error) {
*     // message sent successfully
*   }
* });
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
      tags = this._joinTagsSend(tags);
    }

    headers[HeaderConstants.SERVICE_BUS_NOTIFICATION_TAGS] = tags;
  }

  if (!_.isString(payload)) {
    payload = JSON.stringify(payload);
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
* Creates a registration identifier.
*
* @param {Function(error, response)} callback      `error` will contain information
*                                                  if an error occurs; otherwise, `response`
*                                                  will contain information related to this operation.
*/
NotificationHubService.prototype.createRegistrationId = function (callback) {
  validateCallback(callback);

  var webResource = WebResource.post(this.hubName + '/registrationids');
  webResource.headers = {
    'content-length': null,
    'content-type': null
  };

  this._executeRequest(webResource, null, null, null, function (err, rsp) {
    var registrationId = null;
    if (!err) {
      var parsedLocationParts = url.parse(rsp.headers.location).pathname.split('/');
      registrationId = parsedLocationParts[parsedLocationParts.length - 1];
    }

    callback(err, registrationId, rsp);
  });
};


/**
* Retrieves a registration.
*
* @param {string}             registrationId       The registration identifier.
* @param {object}             [options]            The request options or callback function. Additional properties will be passed as headers.
* @param {Function(error, response)} callback      `error` will contain information
*                                                  if an error occurs; otherwise, `response`
*                                                  will contain information related to this operation.
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
* @param {object}             [options]                 The request options or callback function. Additional properties will be passed as headers.
* @param {object}             [options.etag]            The etag.
* @param {Function(error, response)} callback           `error` will contain information
*                                                       if an error occurs; otherwise, `response`
*                                                       will contain information related to this operation.
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
* @param {object}     registration                      The registration to update.
* @param {object}     registration.RegistrationId       Registration id to update
* @param {object}     registration._.ContentRootElement Type of the registration. Types allowed: WindowsRegistrationDescription, WindowsTemplateRegistrationDescription,
*                                                       AppleRegistrationDescription, AppleTemplateRegistrationDescription,
*                                                       GcmRegistrationDescription, GcmTemplateRegistrationDescription,
*                                                       MpnsRegistrationDescription, MpnsTemplateRegistrationDescription.
* @param {object}     registration.ChannelUri          Only if Windows or Mpns registration
* @param {object}     registration.DeviceToken         Only if Apple registration
* @param {object}     registration.GcmRegistrationId   Only if Gcm registration
* @param {object}     registration.Tags                Comma-separated list of tags (no spaces)
* @param {object}     registration.BodyTemplate        Only if template registration
* @param {object}     registration.WnsHeaders          Only if Windows template registration
* @param {object}     registration.MpnsHeaders         Only if Mpns template registration
* @param {object}     registration.Expiry              Only if Apple template registration
* @param {object}     registration.ApnsHeaders         Only if Apple template registration
* @param {object}     [options]                        The request options or callback function. Additional properties will be passed as headers.
* @param {object}     [options.etag]                   The etag.
* @param {Function(error, response)} callback           `error` will contain information
*                                                       if an error occurs; otherwise, `response`
*                                                       will contain information related to this operation.
*/
NotificationHubService.prototype.updateRegistration = function (registration, optionsOrCallback, callback) {
  var options;
  azureutil.normalizeArgs(optionsOrCallback, callback, function (o, c) { options = o; callback = c; });

  validateCallback(callback);

  if (!registration || !registration.RegistrationId) {
    throw new Error('Invalid registration');
  }

  var webResource = WebResource.put(this.hubName + '/registrations/' + registration.RegistrationId);

  var registrationType = registration[Constants.ATOM_METADATA_MARKER]['ContentRootElement'];
  delete registration[Constants.ATOM_METADATA_MARKER];
  delete registration.ExpirationTime;

  if (!registration.Expiry) {
    delete registration.Expiry;
  }

  if (registration) {
    delete registration.RegistrationId;
  }

  var newRegistration = {};
  newRegistration.Tags = registration.Tags;
  for (var key in registration) {
    if (key !== 'Tags')
      newRegistration[key] = registration[key];
  }

  var registrationXml = registrationResult.serialize(registrationType, newRegistration);

  if (options && options.etag) {
    webResource.withHeader(HeaderConstants.IF_MATCH, options.etag);
  } else {
    webResource.withHeader(HeaderConstants.IF_MATCH, '*');
  }

  this._executeRequest(webResource, registrationXml, registrationResult, null, callback);
};

/**
* Creates or updates a registration.
*
* @param {string}             registration              The registration to update.
* @param {object}             [options]                 The request options or callback function. Additional properties will be passed as headers.
* @param {object}             [options.etag]            The etag.
* @param {Function(error, response)} callback           `error` will contain information
*                                                       if an error occurs; otherwise, `response`
*                                                       will contain information related to this operation.
*/
NotificationHubService.prototype.createOrUpdateRegistration = function (registration, optionsOrCallback, callback) {
  var options;
  azureutil.normalizeArgs(optionsOrCallback, callback, function (o, c) { options = o; callback = c; });

  validateCallback(callback);

  if (!registration || !registration.RegistrationId) {
    throw new Error('Invalid registration');
  }

  var webResource = WebResource.put(this.hubName + '/registrations/' + registration.RegistrationId);

  var registrationType = registration[Constants.ATOM_METADATA_MARKER]['ContentRootElement'];
  delete registration[Constants.ATOM_METADATA_MARKER];
  delete registration.ExpirationTime;
  delete registration.ETag;

  if (!registration.Expiry) {
    delete registration.Expiry;
  }

  if (registration) {
    delete registration.RegistrationId;
  }

  var newRegistration = {};
  newRegistration.Tags = registration.Tags;
  for (var key in registration) {
    if (key !== 'Tags')
      newRegistration[key] = registration[key];
  }

  if (registration.BodyTemplate !== null && registration.BodyTemplate !== undefined)
    newRegistration.BodyTemplate = '<![CDATA[' + registration.BodyTemplate + ']]>';

  var registrationXml = registrationResult.serialize(registrationType, newRegistration);
  this._executeRequest(webResource, registrationXml, registrationResult, null, callback);
};

/**
* List registrations.
*
* @param {object}                    [options]            The request options or callback function. Additional properties will be passed as headers.
* @param {object}                    [options.top]        Specifies the maximum number of registration to obtain from the call.
* @param {object}                    [options.skip]       Specifies the number of registrations to skip in the call.
* @param {Function(error, response)} callback             `error` will contain information
*                                                         if an error occurs; otherwise, `response`
*                                                         will contain information related to this operation.
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
* @param {object}             [options]                 The request options or callback function. Additional properties will be passed as headers.
* @param {object}             [options.top]             Specifies the maximum number of registration to obtain from the call.
* @param {object}             [options.skip]            Specifies the number of registrations to skip in the call.
* @param {Function(error, response)} callback           `error` will contain information
*                                                       if an error occurs; otherwise, `response`
*                                                       will contain information related to this operation.
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
* @ignore
*
* @param {object|string}      payload                                      The message's payload.
* @param {object}             [options]                                    The request options or callback function. Additional properties will be passed as headers.
* @param {string}             [options.ServiceBusNotification-Tags]        Comma-separated list of tag identifiers.
* @param {string}             [options.ServiceBusNotification-Format]      String. 'apple', 'windows', 'gcm', or 'windowsphone'.
* @param {string}             [options.ServiceBusNotification-ApnsExpiry]  The expiry date.
* @param {Function(error, response)} callback                              `error` will contain information
*                                                                          if an error occurs; otherwise, `response`
*                                                                          will contain information related to this operation.
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

  this._executeRequest(webResource, payload, null, null, callback);
};

/**
* Creates or updates a installation.
*
* @param {string}             installation              The installation to create/update.
* @param {object}             [options]                 The request options or callback function. Additional properties will be passed as headers.
* @param {Function(error, response)} callback           `error` will contain information
*                                                       if an error occurs; otherwise, `response`
*                                                       will contain information related to this operation.
*/
NotificationHubService.prototype.createOrUpdateInstallation = function (installation, optionsOrCallback, callback) {
  var options;
  azureutil.normalizeArgs(optionsOrCallback, callback, function (o, c) { options = o; callback = c; });

  validateCallback(callback);

  if (!installation || !installation.installationId) {
    throw new Error('Invalid installation');
  }

  var webResource = WebResource.put(this.hubName + '/installations/' + installation.installationId);
  var requestContent = JSON.stringify(installation);

  this.performRequest(webResource, requestContent, options, function (responseObject, next) {
    var finalCallback = function (returnObject) {
      callback(returnObject.error, returnObject.response);
    };

    next(responseObject, finalCallback);
  });
};

/**
* Patches an existing installation.
*
* @param {string}             installationId            Installation Id
* @param {array}              partialUpdateOperations         List of partial operations to patch an existing installation
* @param {object}             [options]                 The request options or callback function. Additional properties will be passed as headers.
* @param {Function(error, response)} callback           `error` will contain information
*                                                       if an error occurs; otherwise, `response`
*                                                       will contain information related to this operation.
*/
NotificationHubService.prototype.patchInstallation = function (installationId, partialUpdateOperations, optionsOrCallback, callback) {
  var options;
  azureutil.normalizeArgs(optionsOrCallback, callback, function (o, c) { options = o; callback = c; });

  validateCallback(callback);

  if (!installationId) {
    throw new Error('Invalid installationId');
  }

  if (!_.isArray(partialUpdateOperations)) {
    throw new Error('Invalid partialUpdateOperations');
  }

  var webResource = WebResource.patch(this.hubName + '/installations/' + installationId);
  var requestContent = JSON.stringify(partialUpdateOperations);

  this.performRequest(webResource, requestContent, options, function (responseObject, next) {
    var finalCallback = function (returnObject) {
      callback(returnObject.error, returnObject.response);
    };

    next(responseObject, finalCallback);
  });
};

/**
* Deletes an existing installation.
*
* @param {string}             installationId            Installation Id
* @param {object}             [options]                 The request options or callback function. Additional properties will be passed as headers.
* @param {Function(error, response)} callback           `error` will contain information
*                                                       if an error occurs; otherwise, `response`
*                                                       will contain information related to this operation.
*/
NotificationHubService.prototype.deleteInstallation = function (installationId, optionsOrCallback, callback) {
  var options;
  azureutil.normalizeArgs(optionsOrCallback, callback, function (o, c) { options = o; callback = c; });

  validateCallback(callback);

  if (!installationId) {
    throw new Error('Invalid installationId');
  }

  var webResource = WebResource.del(this.hubName + '/installations/' + installationId);

  this.performRequest(webResource, null, options, function (responseObject, next) {
    var finalCallback = function (returnObject) {
      callback(returnObject.error, returnObject.response);
    };

    next(responseObject, finalCallback);
  });
};

/**
* Gets an installation by its Id
*
* @param {string}             installationId            Installation Id
* @param {object}             [options]                 The request options or callback function. Additional properties will be passed as headers.
* @param {Function(error, response)} callback           `error` will contain information
*                                                       if an error occurs; otherwise, `response`
*                                                       will contain information related to this operation.
*/
NotificationHubService.prototype.getInstallation = function (installationId, optionsOrCallback, callback) {
  var options;
  azureutil.normalizeArgs(optionsOrCallback, callback, function (o, c) { options = o; callback = c; });

  validateCallback(callback);

  if (!installationId) {
    throw new Error('Invalid installationId');
  }

  var webResource = WebResource.get(this.hubName + '/installations/' + installationId);
  webResource.rawResponse = true;

  this.performRequest(webResource, null, options, function (responseObject, next) {

    responseObject.installationResult = null;
    if (!responseObject.error && responseObject.response.body) {
      responseObject.installationResult = JSON.parse(responseObject.response.body);
    }

    // function to be called after all filters
    var finalCallback = function (returnObject) {
      callback(returnObject.error, returnObject.installationResult, returnObject.response);
    };

    // call the first filter
    next(responseObject, finalCallback);
  });
};

NotificationHubService.prototype._joinTags = function (tags) {
  return tags.join(',');
};

NotificationHubService.prototype._joinTagsSend = function (tags) {
  return tags.join(' || ');
};

module.exports = NotificationHubService;