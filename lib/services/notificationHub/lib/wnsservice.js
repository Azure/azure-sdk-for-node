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

var util = require('util');

var _ = require('underscore');
var wns = require('wns');

var azureCommon = require('azure-common');
var azureutil = azureCommon.util;
var Constants = azureCommon.Constants;
var validate = azureCommon.validate;
var HeaderConstants = Constants.HeaderConstants;
var WebResource = azureCommon.WebResource;

var registrationResult = require('./models/registrationresult');

// valid badge values from http://msdn.microsoft.com/en-us/library/windows/apps/br212849.aspx
var badges = ['none','activity','alert','available','away','busy','newMessage','paused','playing','unavailable','error', 'attention'];

// valid notification types from http://msdn.microsoft.com/en-us/library/windows/apps/hh465435.aspx
var types = ['wns/toast', 'wns/badge', 'wns/tile', 'wns/raw'];

// White list of methods to use from wns module
var templateSpecs = {
  TileSquareBlock: [0, 2],
  TileSquareText01: [0, 4],
  TileSquareText02: [0, 2],
  TileSquareText03: [0, 4],
  TileSquareText04: [0, 1],
  TileWideText01: [0, 5],
  TileWideText02: [0, 9],
  TileWideText03: [0, 1],
  TileWideText04: [0, 1],
  TileWideText05: [0, 5],
  TileWideText06: [0, 10],
  TileWideText07: [0, 9],
  TileWideText08: [0, 10],
  TileWideText09: [0, 2],
  TileWideText10: [0, 9],
  TileWideText11: [0, 10],
  TileSquareImage: [1, 0],
  TileSquarePeekImageAndText01: [1, 4],
  TileSquarePeekImageAndText02: [1, 2],
  TileSquarePeekImageAndText03: [1, 4],
  TileSquarePeekImageAndText04: [1, 1],
  TileWideImage: [1, 0],
  TileWideImageCollection: [5, 0],
  TileWideImageAndText01: [1, 1],
  TileWideImageAndText02: [1, 2],
  TileWideBlockAndText01: [0, 6],
  TileWideBlockAndText02: [0, 3],
  TileWideSmallImageAndText01: [1, 1],
  TileWideSmallImageAndText02: [1, 5],
  TileWideSmallImageAndText03: [1, 1],
  TileWideSmallImageAndText04: [1, 2],
  TileWideSmallImageAndText05: [1, 2],
  TileWidePeekImageCollection01: [5, 2],
  TileWidePeekImageCollection02: [5, 5],
  TileWidePeekImageCollection03: [5, 1],
  TileWidePeekImageCollection04: [5, 1],
  TileWidePeekImageCollection05: [6, 2],
  TileWidePeekImageCollection06: [6, 1],
  TileWidePeekImageAndText01: [1, 1],
  TileWidePeekImageAndText02: [1, 5],
  TileWidePeekImage01: [1, 2],
  TileWidePeekImage02: [1, 5],
  TileWidePeekImage03: [1, 1],
  TileWidePeekImage04: [1, 1],
  TileWidePeekImage05: [2, 2],
  TileWidePeekImage06: [2, 1],
  ToastText01: [0, 1],
  ToastText02: [0, 2],
  ToastText03: [0, 2],
  ToastText04: [0, 3],
  ToastImageAndText01: [1, 1],
  ToastImageAndText02: [1, 2],
  ToastImageAndText03: [1, 2],
  ToastImageAndText04: [1, 3]
};

/**
* Creates a new WnsService object.
*
* @constructor
*
* @param {NotificationHubService} notificationHubService The notification hub service.
*/
function WnsService(notificationHubService) {
  var self = this;

  this.notificationHubService = notificationHubService;

  var addSendMethod = function (createFunctionName, templateName) {
    var sendName = util.format('send%s', templateName);

    self[sendName] = function () {
      // signature is (tags, [payload, ]+, [options], callback)
      var tags = Array.prototype.shift.apply(arguments);

      // Get arguments without the final callback to build payload
      var args = Array.prototype.slice.call(arguments, 0, arguments.length - 1);

      var options = {};
      if (arguments.length >= 3 && _.isObject(arguments[arguments.length - 2])) {
        options = arguments[arguments.length - 2];
      }

      var callback = arguments[arguments.length - 1];

      if (!_.isFunction(callback)) {
        throw new Error('The callback parameter must be the callback function.');
      }

      var type =  templateName.indexOf('Tile') === 0 ? 'tile' : 'toast';
      var payload = wns[createFunctionName].apply(wns, args);
      self.send(tags, payload, 'wns/' + type, options, callback);
    };
  };

  var addCreateAndUpdateRegistrationMethod = function (createRegistrationFunctionName, templateName) {
    function createRegistrationXml(rawArgs) {
      // signature is (channel, tags, [payload, ]+, [options], callback)
      var channel = Array.prototype.shift.apply(rawArgs);
      var tags = Array.prototype.shift.apply(rawArgs);

      // Get arguments without the final callback to build payload
      var args = Array.prototype.slice.call(rawArgs, 0, rawArgs.length - 1);

      var options = {};
      if (rawArgs.length >= 3 && _.isObject(rawArgs[rawArgs.length - 2])) {
        options = rawArgs[rawArgs.length - 2];
      }

      var payload = wns[createRegistrationFunctionName].apply(wns, args);

      var type =  templateName.indexOf('Tile') === 0 ? 'tile' : 'toast';

      if (!options) {
        options = {};
      }

      if (!options.headers) {
        options.headers = {};
      }

      options.headers['X-WNS-Type'] = 'wns/' + type;

      return self._createTemplateBody(channel, tags, payload, options);
    }

    var createRegistrationName = util.format('create%sRegistration', templateName);
    self[createRegistrationName] = function () {
      var callback = arguments[arguments.length - 1];

      if (!_.isFunction(callback)) {
        throw new Error('The callback parameter must be the callback function.');
      }

      var registrationXml = createRegistrationXml(arguments);

      var webResource = WebResource.post(self.notificationHubService.hubName + '/registrations')
        .withHeader(HeaderConstants.CONTENT_TYPE, 'application/atom+xml;type=entry;charset=utf-8')
        .withHeader(HeaderConstants.CONTENT_LENGTH, Buffer.byteLength(registrationXml, 'utf8'));

      self.notificationHubService._executeRequest(webResource, registrationXml, registrationResult, null, callback);
    };

    var updateRegistrationName = util.format('update%sRegistration', templateName);
    self[updateRegistrationName] = function () {
      var registrationId = Array.prototype.shift.apply(arguments);
      var callback = arguments[arguments.length - 1];

      if (!_.isFunction(callback)) {
        throw new Error('The callback parameter must be the callback function.');
      }

      var options = {};
      if (arguments.length >= 3 && _.isObject(arguments[arguments.length - 2])) {
        options = arguments[arguments.length - 2];
      }

      var registrationXml = createRegistrationXml(arguments);

      var webResource = WebResource.put(self.notificationHubService.hubName + '/registrations/' + registrationId)
        .withHeader(HeaderConstants.CONTENT_TYPE, 'application/atom+xml;type=entry;charset=utf-8')
        .withHeader(HeaderConstants.CONTENT_LENGTH, Buffer.byteLength(registrationXml, 'utf8'));

      if (options && options.etag) {
        webResource.withHeader(HeaderConstants.IF_MATCH, options.etag);
      } else {
        webResource.withHeader(HeaderConstants.IF_MATCH, '*');
      }

      self.notificationHubService._executeRequest(webResource, registrationXml, registrationResult, null, callback);
    };

    var createOrUpdateRegistrationName = util.format('createOrUpdate%sRegistration', templateName);
    self[createOrUpdateRegistrationName] = function () {
      var registrationId = Array.prototype.shift.apply(arguments);
      var callback = arguments[arguments.length - 1];

      if (!_.isFunction(callback)) {
        throw new Error('The callback parameter must be the callback function.');
      }

      var options = {};
      if (arguments.length >= 3 && _.isObject(arguments[arguments.length - 2])) {
        options = arguments[arguments.length - 2];
      }

      var registrationXml = createRegistrationXml(arguments);

      var webResource = WebResource.put(self.notificationHubService.hubName + '/registrations/' + registrationId)
        .withHeader(HeaderConstants.CONTENT_TYPE, 'application/atom+xml;type=entry;charset=utf-8')
        .withHeader(HeaderConstants.CONTENT_LENGTH, Buffer.byteLength(registrationXml, 'utf8'));

      self.notificationHubService._executeRequest(webResource, registrationXml, registrationResult, null, callback);
    };
  };

  Object.keys(templateSpecs).forEach(function (templateName) {
    var createName = util.format('create%s', templateName);

    if (_.isFunction(wns[createName])) {
      // Expose create methods to be able to send raw payloads
      self[createName] = wns[createName];

      // Expose send methods as convenience
      addSendMethod(createName, templateName);

      // Expose create registration methods
      addCreateAndUpdateRegistrationMethod(createName, templateName);
    }
  });
}

/**
* Sends a wns/badge WNS notification.
*
* @param {array|string}               tags                           Comma-separated list or array of tag identifiers.
* @param {object|string}              value                          Either a numeric value or a string value that specifies a predefined badge 
*                                                                    glyph. Numerically, this value can accept any valid integer. A value of 0 clears the badge, 
*                                                                    values from 1-99 display as given, and any value greater than 99 displays as 99+.
*                                                                    See http://msdn.microsoft.com/en-us/library/windowsazure/br212849.aspx for more details.
* @param {object|function}            [optionsOrCallback]            The request options or callback function.
* @param {object|function}            [optionsOrCallback.headers]    The wns headers.
* @param {function(error, response)}  callback                       The callback function.
* @return {undefined}
*/
WnsService.prototype.sendBadge = function (tags, value, optionsOrCallback, callback) {
  var realValue;
  var realVersion;

  if (_.isObject(value)) {
    realValue = value.value;
    realVersion = value.version || 1;
  } else {
    realValue = value;
    realVersion = 1;
  }

  if (!_.isString(realValue) && isNaN(realValue)) {
    throw new Error('The badge value must be a string or a number.');
  }

  if (!isNaN(realValue)) {
    if (realValue < 0) {
      // Values greater than 99 appear as 99+, 0 clears the badge
      throw new Error('The badge numeric value must be greater than or equal to 0.');
    }
  } else if (!badges.some(function (badge) { return badge === realValue; })) {
    throw new Error('The badge value must be either an integer greater than or equal to 0 or one of ' +
      JSON.stringify(badges));
  }

  var payload = '<badge value="' + realValue + '" version="' + realVersion + '"/>';
  this.send(tags, payload, 'wns/badge', optionsOrCallback, callback);
};

/**
* @name WnsService#sendTile*
* @function
*
* @description
* Sends a Tile notification. There is a method for each tile template in see http://msdn.microsoft.com/en-us/library/windows/apps/hh761491.aspx
* (e.g. sendTileSquarePeekImageAndText01).
*
* @param {string}                     tags                           A single tag or tag expression.
* @param {object}                     payload                        The message's payload. Multiple payload parameters can be passed.
* @param {string}                     payload.text{1..n}             Value of the text element with id specified (e.g. text1). The number of text* properties depends on the tile type.
* @param {string}                     payload.image{1..n}src         Value of the src attribute of the image element with id specified (e.g. image1). The number of image* properties depends on the tile type.
* @param {string}                     payload.image{1..n}alt         Value of the alt attribute of the image element with id specified (e.g. image1). The number of image* properties depends on the tile type.
* @param {string}                     payload.lang                   The value of the language of the binding element.
* @param {string}                     payload.type                   Used in the general sendTile method.
* @param {object}                     [options]                      The request options.
* @param {object}                     [options.headers]              The wns headers.
* @param {Function(error, response)}  callback                       The callback function.
* @return {undefined}
*/

/**
* @name WnsService#sendToast*
* @function
*
* @description
* Sends a Toast notification. There is a method for each tile template in see http://msdn.microsoft.com/en-us/library/windows/apps/hh761494.aspx
* (e.g. sendToastText01).
*
* @param {string}                     tags                           A single tag or tag expression.
* @param {object}                     payload                        The message's payload.
* @param {string}                     payload.text{1..n}             Value of the text element with id specified (e.g. text1). The number of text* properties depends on the tile type.
* @param {string}                     payload.image{1..n}src         Value of the src attribute of the image element with id specified (e.g. image1). The number of image* properties depends on the tile type.
* @param {string}                     payload.image{1..n}alt         Value of the alt attribute of the image element with id specified (e.g. image1). The number of image* properties depends on the tile type.
* @param {string}                     payload.lang                   The value of the language of the binding element.
* @param {object}                     [options]                      The request options.
* @param {object}                     [options.headers]              The wns headers.
* @param {Function(error, response)}  callback                       The callback function.
* @return {undefined}
*/

/**
* Sends a wns/raw WNS notification.
*
* @param {array|string}               tags                           Comma-separated list or array of tag identifiers.
* @param {object|string}              payload                        The raw payload.
* @param {object|function}            [optionsOrCallback]            The request options or callback function.
* @param {object|function}            [optionsOrCallback.headers]    The wns headers.
* @param {function(error, response)}  callback                       The callback function.
* @return {undefined}
*/
WnsService.prototype.sendRaw = function (tags, payload, optionsOrCallback, callback) {
  return this.send(tags, payload, 'wns/raw', optionsOrCallback, callback);
};

/**
* Sends a custom WNS notification. Use this method if you want to have full control on the payload.
*
* @param {array|string}               tags                           Comma-separated list or array of tag identifiers.
* @param {string}                     payload                        The message's XML payload.
* @param {string}                     type                           The message type. Corresponds to header X-WNS-Type (options are: wns/raw, wns/tile and wns/toast).
* @param {object|function}            [optionsOrCallback]            The request options or callback function.
* @param {object|function}            [optionsOrCallback.headers]    The wns headers.
* @param {function(error, response)}  callback                       The callback function.
* @return {undefined}
*/
WnsService.prototype.send = function (tags, payload, type, optionsOrCallback, callback) {
  var options;
  azureutil.normalizeArgs(optionsOrCallback, callback, function (o, c) { options = o; callback = c; });

  if (!_.isString(payload)) {
    throw new Error('The payload parameter must be the notification payload string.');
  }

  if (!types.some(function (item) { return type === item; })) {
    throw new Error('The type parameter must specify the notification type. The value of ' + type +
      ' is not in the set of valid value types: ' + JSON.stringify(types));
  }

  if (!_.isFunction(callback)) {
    throw new Error('The callback parameter must be the callback function.');
  }

  var headers = {};
  headers[HeaderConstants.SERVICE_BUS_NOTIFICATION_FORMAT] = 'windows';

  if (tags) {
    if (_.isArray(tags)) {
      tags = this.notificationHubService._joinTagsSend(tags);
    }

    headers[HeaderConstants.SERVICE_BUS_NOTIFICATION_TAGS] = tags;
  }

  headers[HeaderConstants.SERVICE_BUS_X_WNS_TYPE] = type;

  if (options && options.headers) {
    Object.keys(options.headers).forEach(function (header) {
      headers[header] = options.headers[header];
    });
  }

  if (type === 'wns/raw' && !headers[HeaderConstants.CONTENT_TYPE]) {
    headers[HeaderConstants.CONTENT_TYPE] = 'application/octet-stream';
  }

  this.notificationHubService._sendNotification(payload, headers, callback);
};

/**
* Creates a native WNS registration.
*
* @param {string}                     channel                             The device channel uri.
* @param {string|array}               tags                                The tags.
* @param {object|function}            [optionsOrCallback]                 The request options or callback function.
* @param {function(error, response)}  callback                            The callback function.
* @return {undefined}
*/
WnsService.prototype.createNativeRegistration = function (channel, tags, optionsOrCallback, callback) {
  var options;
  azureutil.normalizeArgs(optionsOrCallback, callback, function (o, c) { options = o; callback = c; });

  validate.validateArgs('createNativeRegistration', function (v) {
    v.string(channel, 'channel');
    v.callback(callback);
  });

  var registrationXml = this._createBody('WindowsRegistrationDescription', channel, tags, null, options);

  var webResource = WebResource.post(this.notificationHubService.hubName + '/registrations')
    .withHeader(HeaderConstants.CONTENT_TYPE, 'application/atom+xml;type=entry;charset=utf-8')
    .withHeader(HeaderConstants.CONTENT_LENGTH, Buffer.byteLength(registrationXml, 'utf8'));

  this.notificationHubService._executeRequest(webResource, registrationXml, registrationResult, null, callback);
};

/**
* Creates or updates a native WNS registration.
*
* @param {string}                     registrationId       The registration identifier.
* @param {string}                     channel              The device channel uri.
* @param {string|array}               tags                 The tags.
* @param {object|function}            [optionsOrCallback]  The request options or callback function.
* @param {function(error, response)}  callback             The callback function.
* @return {undefined}
*/
WnsService.prototype.createOrUpdateNativeRegistration = function (registrationId, channel, tags, optionsOrCallback, callback) {
  var options;
  azureutil.normalizeArgs(optionsOrCallback, callback, function (o, c) { options = o; callback = c; });

  validate.validateArgs('createOrUpdateNativeRegistration', function (v) {
    v.string(registrationId, 'registrationId');
    v.string(channel, 'channel');
    v.callback(callback);
  });

  var registrationXml = this._createBody('WindowsRegistrationDescription', channel, tags, null, options);

  var webResource = WebResource.put(this.notificationHubService.hubName + '/registrations/' + registrationId)
    .withHeader(HeaderConstants.CONTENT_TYPE, 'application/atom+xml;type=entry;charset=utf-8')
    .withHeader(HeaderConstants.CONTENT_LENGTH, Buffer.byteLength(registrationXml, 'utf8'));

  this.notificationHubService._executeRequest(webResource, registrationXml, registrationResult, null, callback);
};

/**
* @name WnsService#createTile*Registration
* @function
*
* @description
* Creates a new registration with a Tile template. There is a method for each tile template in see http://msdn.microsoft.com/en-us/library/windows/apps/hh761491.aspx
* (e.g. createTileSquarePeekImageAndText01Registration).
*
* @param {string}                     channel                        The device channel uri.
* @param {string|array}               tags                           The tags.
* @param {object}                     template                       The body template of the registration.
* @param {string}                     template.text{1..n}            Value of the text element with id specified (e.g. text1). The number of text* properties depends on the tile type.
* @param {string}                     template.image{1..n}src        Value of the src attribute of the image element with id specified (e.g. image1). The number of image* properties depends on the tile type.
* @param {string}                     template.image{1..n}alt        Value of the alt attribute of the image element with id specified (e.g. image1). The number of image* properties depends on the tile type.
* @param {string}                     template.lang                  The value of the language of the binding element.
* @param {object}                     [options]                      The request options.
* @param {object}                     [options.headers]              The wns headers.
* @param {Function(error, response)}  callback                       The callback function.
* @return {undefined}
*/

/**
* @name WnsService#createToast*Registration
* @function
*
* @description
* Creates a new registration with a Toast template.There is a method for each tile template in see http://msdn.microsoft.com/en-us/library/windows/apps/hh761494.aspx
* (e.g. createToastText01Registration).
*
* @param {string}                     channel                        The device channel uri.
* @param {string|array}               tags                           The tags.
* @param {object}                     template                       The body template of the registration.
* @param {string}                     template.text{1..n}            Value of the text element with id specified (e.g. text1). The number of text* properties depends on the tile type.
* @param {string}                     template.image{1..n}src        Value of the src attribute of the image element with id specified (e.g. image1). The number of image* properties depends on the tile type.
* @param {string}                     template.image{1..n}alt        Value of the alt attribute of the image element with id specified (e.g. image1). The number of image* properties depends on the tile type.
* @param {string}                     template.lang                  The value of the language of the binding element.
* @param {object}                     [options]                      The request options.
* @param {object}                     [options.headers]              The wns headers.
* @param {Function(error, response)}  callback                       The callback function.
* @return {undefined}
*/

/**
* Creates a custom template registration. Use this method to have full control on the template format. Remember that you have to specify the X-WNS-Type header
* (possible values: wns/toast, wns/tile, wns/badge, wns/raw).
*
* @param {string}                     channel                                The device channel uri.
* @param {string|array}               tags                                   The tags.
* @param {string}                     template                               The template for the registration.
* @param {object|function}            [optionsOrCallback]                    The request options or callback function.
* @param {object|function}            [optionsOrCallback.pnsCredentialName]  The pns credentials to use.
* @param {object|function}            [optionsOrCallback.headers]            The wns headers to include.
* @param {function(error, response)}  callback                               The callback function.
* @return {undefined}
*/
WnsService.prototype.createRawTemplateRegistration = function (channel, tags, template, optionsOrCallback, callback) {
  var options;
  azureutil.normalizeArgs(optionsOrCallback, callback, function (o, c) { options = o; callback = c; });

  validate.validateArgs('createRawTemplateRegistration', function (v) {
    v.string(channel, 'channel');
    v.callback(callback);
  });

  var registrationXml = this._createTemplateBody(channel, tags, template, options);

  var webResource = WebResource.post(this.notificationHubService.hubName + '/registrations')
    .withHeader(HeaderConstants.CONTENT_TYPE, 'application/atom+xml;type=entry;charset=utf-8')
    .withHeader(HeaderConstants.CONTENT_LENGTH, Buffer.byteLength(registrationXml, 'utf8'));

  this.notificationHubService._executeRequest(webResource, registrationXml, registrationResult, null, callback);
};

/**
* Creates a custom template registration. Use this method to have full control on the template format. Remember that you have to specify the X-WNS-Type header
* (possible values: wns/toast, wns/tile, wns/badge, wns/raw).
*
* @param {string}                     registrationId                 The registration identifier.
* @param {string}                     channel                                The device channel uri.
* @param {string|array}               tags                                   The tags.
* @param {string}                     template                               The template for the registration.
* @param {object|function}            [optionsOrCallback]                    The request options or callback function.
* @param {object|function}            [optionsOrCallback.pnsCredentialName]  The pns credentials to use.
* @param {object|function}            [optionsOrCallback.headers]            The wns headers to include.
* @param {function(error, response)}  callback                               The callback function.
* @return {undefined}
*/
WnsService.prototype.createOrUpdateRawTemplateRegistration = function (registrationId, channel, tags, template, optionsOrCallback, callback) {
  var options;
  azureutil.normalizeArgs(optionsOrCallback, callback, function (o, c) { options = o; callback = c; });

  validate.validateArgs('createOrUpdateRawTemplateRegistration', function (v) {
    v.string(registrationId, 'registrationId');
    v.string(channel, 'channel');
    v.callback(callback);
  });

  var registrationXml = this._createTemplateBody(channel, tags, template, options);

  var webResource = WebResource.put(this.notificationHubService.hubName + '/registrations/' + registrationId)
    .withHeader(HeaderConstants.CONTENT_TYPE, 'application/atom+xml;type=entry;charset=utf-8')
    .withHeader(HeaderConstants.CONTENT_LENGTH, Buffer.byteLength(registrationXml, 'utf8'));

  this.notificationHubService._executeRequest(webResource, registrationXml, registrationResult, null, callback);
};

/**
* @name WnsService#updateTile*Registration
* @function
*
* @description
* Updates a new registration with a Tile template. There is a method for each tile template in see http://msdn.microsoft.com/en-us/library/windows/apps/hh761491.aspx
* (e.g. createTileSquarePeekImageAndText01Registration).
*
* @param {string}                     registrationId                 The registration identifier.
* @param {string}                     channel                        The device channel uri.
* @param {string|array}               tags                           The tags.
* @param {object}                     template                       The body template of the registration.
* @param {string}                     template.text{1..n}            Value of the text element with id specified (e.g. text1). The number of text* properties depends on the tile type.
* @param {string}                     template.image{1..n}src        Value of the src attribute of the image element with id specified (e.g. image1). The number of image* properties depends on the tile type.
* @param {string}                     template.image{1..n}alt        Value of the alt attribute of the image element with id specified (e.g. image1). The number of image* properties depends on the tile type.
* @param {string}                     template.lang                  The value of the language of the binding element.
* @param {object}                     [options]                      The request options.
* @param {object}                     [options.headers]              The wns headers.
* @param {Function(error, response)}  callback                       The callback function.
* @return {undefined}
*/

/**
* @name WnsService#updateToast*Registration
* @function
*
* @description
* Updates a new registration with a Toast template.There is a method for each tile template in see http://msdn.microsoft.com/en-us/library/windows/apps/hh761494.aspx
* (e.g. updateToastText01Registration).
*
* @param {string}                     registrationId                 The registration identifier.
* @param {string}                     channel                        The device channel uri.
* @param {string|array}               tags                           The tags.
* @param {object}                     template                       The body template of the registration.
* @param {string}                     template.text{1..n}            Value of the text element with id specified (e.g. text1). The number of text* properties depends on the tile type.
* @param {string}                     template.image{1..n}src        Value of the src attribute of the image element with id specified (e.g. image1). The number of image* properties depends on the tile type.
* @param {string}                     template.image{1..n}alt        Value of the alt attribute of the image element with id specified (e.g. image1). The number of image* properties depends on the tile type.
* @param {string}                     template.lang                  The value of the language of the binding element.
* @param {object}                     [options]                      The request options.
* @param {object}                     [options.headers]              The wns headers.
* @param {Function(error, response)}  callback                       The callback function.
* @return {undefined}
*/

/**
* Updates a raw template registration.
*
* @param {string}                     registrationId                         The registration identifier.
* @param {string}                     channel                                The device channel uri.
* @param {string|array}               tags                                   The tags.
* @param {string}                     template                               The template for the registration.
* @param {object|function}            [optionsOrCallback]                    The request options or callback function.
* @param {object|function}            [optionsOrCallback.pnsCredentialName]  The pns credentials to use.
* @param {object|function}            [optionsOrCallback.headers]            The wns headers to include.
* @param {object|function}            [optionsOrCallback.etag]               The etag to include.
* @param {function(error, response)}  callback                               The callback function.
* @return {undefined}
*/
WnsService.prototype.updatesRawTemplateRegistration = function (registrationId, channel, tags, template, optionsOrCallback, callback) {
  var options;
  azureutil.normalizeArgs(optionsOrCallback, callback, function (o, c) { options = o; callback = c; });

  validate.validateArgs('updatesRawTemplateRegistration', function (v) {
    v.string(registrationId, 'registrationId');
    v.string(channel, 'channel');
    v.callback(callback);
  });

  var registrationXml = this._createTemplateBody(channel, tags, template, options);

  var webResource = WebResource.put(this.notificationHubService.hubName + '/registrations/' + registrationId)
    .withHeader(HeaderConstants.CONTENT_TYPE, 'application/atom+xml;type=entry;charset=utf-8')
    .withHeader(HeaderConstants.CONTENT_LENGTH, Buffer.byteLength(registrationXml, 'utf8'));

  if (options && options.etag) {
    webResource.withHeader(HeaderConstants.IF_MATCH, options.etag);
  } else {
    webResource.withHeader(HeaderConstants.IF_MATCH, '*');
  }

  this.notificationHubService._executeRequest(webResource, registrationXml, registrationResult, null, callback);
};

/**
* Retrieves a registration by channel.
*
* @param {string}                     channel                   The registration identifier.
* @param {object|function}            [optionsOrCallback]       The request options or callback function. Additional properties will be passed as headers.
* @param {object|function}            [optionsOrCallback.top]   Specifies the maximum number of registration to obtain from the call.
* @param {object|function}            [optionsOrCallback.skip]  Specifies the number of registrations to skip in the call.
* @param {function(error, response)}  callback                  The callback function.
* @return {undefined}
*/
WnsService.prototype.listRegistrationsByChannel = function (channel, optionsOrCallback, callback) {
  var options;
  azureutil.normalizeArgs(optionsOrCallback, callback, function (o, c) { options = o; callback = c; });

  validate.validateArgs('listRegistrationsByChannel', function (v) {
    v.string(channel, 'channel');
    v.callback(callback);
  });

  var webResource = WebResource.get(this.notificationHubService.hubName + '/registrations/')
    .withQueryOption('$filter', 'ChannelUri eq \'' + channel + '\'');

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
* @param {string}             elementName                  The element name.
* @param {string}             channel                      The device channel uri.
* @param {string|array}       tags                         The tags.
* @param {json}               template                     The template for the registration.
* @param {object|function}    [options]                    The request options or callback function.
* @param {object|function}    [options.pnsCredentialName]  The pns credentials to use.
* @param {object|function}    [options.headers]            The wns headers to include.
* @return {undefined}
*/
WnsService.prototype._createBody = function (elementName, channel, tags, template, options) {
  var registration = { };

  if (options) {
    if (options.registrationId) {
      registration['RegistrationId'] = options.registrationId;
    }

    if (options.expirationTime) {
      if (_.isDate(options.expirationTime)) {
        options.expirationTime = new Date(options.expirationTime);
      }

      registration['ExpirationTime'] = options.expirationTime.toISOString();
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

  registration.ChannelUri = channel;

  if (template) {
    registration.BodyTemplate = '<![CDATA[' + template + ']]>';
  }

  if (options) {
    if (options.headers) {
      registration.WnsHeaders = { WnsHeader: [] };
      Object.keys(options.headers).forEach(function (headerName) {
        registration.WnsHeaders.WnsHeader.push({ Header: headerName, Value: options.headers[headerName] });
      });
    }
  }

  var registrationXml;
  if (options && options.registrationId) {
    registrationXml = registrationResult.serialize(elementName, registration, {
      title: options.registrationId
    });
  } else {
    registrationXml = registrationResult.serialize(elementName, registration);
  }

  return registrationXml;
};

/**
* Creates a template registration body.
* @ignore
* 
* @param {string}             channel                      The device channel uri.
* @param {string|array}       tags                         The tags.
* @param {json}               template                     The template for the registration.
* @param {object|function}    [options]                    The request options or callback function.
* @param {object|function}    [options.pnsCredentialName]  The pns credentials to use.
* @param {object|function}    [options.headers]            The wns headers to include.
* @return {undefined}
*/
WnsService.prototype._createTemplateBody = function (channel, tags, template, options) {
  return this._createBody('WindowsTemplateRegistrationDescription', channel, tags, template, options);
};

module.exports = WnsService;