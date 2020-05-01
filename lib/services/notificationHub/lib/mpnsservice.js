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

var util = require('util');

var _ = require('underscore');
var mpns = require('mpns');

var azureCommon = require('azure-common');
var azureutil = azureCommon.util;
var Constants = azureCommon.Constants;
var validate = azureCommon.validate;
var HeaderConstants = Constants.HeaderConstants;
var WebResource = azureCommon.WebResource;

var registrationResult = require('./models/registrationresult');

// White list of methods to use from wns module
var templateSpecs = [ 'Toast', 'Tile', 'FlipTile', 'Raw' ];

/**
* Creates a new MpnsService object.
*
* __Note__: An instance of this object is created automatically when a {@link NotificationHubService}
* object is created. See {@link NotificationHubService#gcm}.
* @class
* The MpnsService class is used to send notifications using the [Microsoft Push Notification Service](http://msdn.microsoft.com/en-us/library/windowsphone/develop/ff402558).
* @constructor
*
* @param {NotificationHubService} notificationHubService The notification hub service.
*/
function MpnsService(notificationHubService) {
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

      var subject = mpns[createFunctionName].apply(mpns, args);
      var payload = subject.getXmlPayload();
      self.send(tags, payload, subject.targetName, subject.notificationClass, options, callback);
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

      var subject = mpns[createRegistrationFunctionName].apply(mpns, args);
      var payload = subject.getXmlPayload();

      if (!options) {
        options = {};
      }

      if (!options.headers) {
        options.headers = {};
      }

      options.headers['X-WindowsPhone-Target'] = subject.targetName;
      options.headers['X-NotificationClass'] = subject.notificationClass;

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

  templateSpecs.forEach(function (templateName) {
    var createName = util.format('create%s', templateName);

    if (_.isFunction(mpns[createName])) {
      // Expose create methods to be able to send raw payloads
      self[createName] = mpns[createName];

      // Expose send methods as convenience
      addSendMethod(createName, templateName);

      // Expose create registration methods
      addCreateAndUpdateRegistrationMethod(createName, templateName);
    }
  });
}

/**
* Creates a native MPNS registration.
*
* @param {string}                     channel                     The device channel uri.
* @param {string|array}               tags                        The tags (comma-separated list, no spaces).
* @param {object}                     [options]                   The request options.
* @param {Function(error, response)}  callback                    The callback function.
* @return {undefined}
*/
MpnsService.prototype.createNativeRegistration = function (channel, tags, optionsOrCallback, callback) {
  var options;
  azureutil.normalizeArgs(optionsOrCallback, callback, function (o, c) { options = o; callback = c; });

  validate.validateArgs('createNativeRegistration', function (v) {
    v.string(channel, 'channel');
    v.callback(callback);
  });

  var registrationXml = this._createBody('MpnsRegistrationDescription', channel, tags, null, options);

  var webResource = WebResource.post(this.notificationHubService.hubName + '/registrations')
    .withHeader(HeaderConstants.CONTENT_TYPE, 'application/atom+xml;type=entry;charset=utf-8')
    .withHeader(HeaderConstants.CONTENT_LENGTH, Buffer.byteLength(registrationXml, 'utf8'));

  this.notificationHubService._executeRequest(webResource, registrationXml, registrationResult, null, callback);
};

/**
* Creates or updates a native MPNS registration.
*
* @param {string}                     registrationId      The registration identifier.
* @param {string}                     channel             The device channel uri.
* @param {string|array}               tags                The tags (comma-separated list, no spaces).
* @param {object}                     [options]           The request options.
* @param {Function(error, response)}  callback            The callback function.
* @return {undefined}
*/
MpnsService.prototype.createOrUpdateNativeRegistration = function (registrationId, channel, tags, optionsOrCallback, callback) {
  var options;
  azureutil.normalizeArgs(optionsOrCallback, callback, function (o, c) { options = o; callback = c; });

  validate.validateArgs('createOrUpdateNativeRegistration', function (v) {
    v.string(registrationId, 'registrationId');
    v.string(channel, 'channel');
    v.callback(callback);
  });

  var registrationXml = this._createBody('MpnsRegistrationDescription', channel, tags, null, options);

  var webResource = WebResource.put(this.notificationHubService.hubName + '/registrations/' + registrationId)
    .withHeader(HeaderConstants.CONTENT_TYPE, 'application/atom+xml;type=entry;charset=utf-8')
    .withHeader(HeaderConstants.CONTENT_LENGTH, Buffer.byteLength(registrationXml, 'utf8'));

  this.notificationHubService._executeRequest(webResource, registrationXml, registrationResult, null, callback);
};

/**
* @name MpnsService#createFlipTileRegistration
* @function
*
* @description
* Creates a registration with a FlipTile template (Only Windows Phone version 7.8 or later). For more information see http://msdn.microsoft.com/en-us/library/windowsazure/jj206971.aspx.
*
* @param {string}                     channel                           The ChannelUri.
* @param {string|array}               tags                              The tags (comma-separated list, no spaces).
* @param {object}                     template                          The registration template.
* @param {string}                     template.backgroundImage          The URI of the background image for the tile.
* @param {string}                     template.count                    The number that appears on the tile.
* @param {string}                     template.title                    The title text of the tile.
* @param {string}                     template.backBackgroundImage      The URI of the image that is shown on the backside of the tile.
* @param {string}                     template.backTitle                Title for the backside side of the tile.
* @param {string}                     template.backContent              Text for the backside of the tile.
* @param {string}                     template.id                       ID of a related, secondary tile.
* @param {string}                     template.smallBackgroundImage     The URI for the background image for the tile when it is reduced to its small size.
* @param {string}                     template.wideBackgroundImage      The URI for the background image for the tile when it is expanded to its wide size.
* @param {string}                     template.wideBackContent          Content for the back tile when the tile is expanded to its wide size.
* @param {string}                     template.wideBackBackgroundImage  The URI for the image to be on the backside of the tile when the tile is expanded to its wide size.
* @param {object}                     [options]                         The request options.
* @param {object}                     [options.headers]                 The mpns headers.
* @param {Function(error, response)}  callback                          The callback function.
* @return {undefined}
*/

/**
* @name MpnsService#createTileRegistration
* @function
*
* @description
* Creates a registration with a Tile template. For more information see http://msdn.microsoft.com/en-us/library/windowsazure/jj553779.aspx.
*
* @param {string}                     channel                        The ChannelUri.
* @param {string|array}               tags                           The tags (comma-separated list, no spaces).
* @param {object}                     template                       The registration template.
* @param {string}                     template.backgroundImage       The URI of the background image for the tile.
* @param {string}                     template.count                 The number that appears on the tile.
* @param {string}                     template.title                 The title text of the tile.
* @param {string}                     template.backBackgroundImage   The URI of the image that is shown on the backside of the tile.
* @param {string}                     template.backTitle             Title for the backside side of the tile.
* @param {string}                     template.backContent           Text for the backside of the tile.
* @param {string}                     template.id                    ID of a related, secondary tile.
* @param {object}                     [options]                      The request options.
* @param {object}                     [options.headers]              The mpns headers.
* @param {Function(error, response)}  callback                       The callback function.
* @return {undefined}
*/

/**
* @name MpnsService#createToastRegistration
* @function
*
* @description
* Creates a registration with a Toast template For more information see http://msdn.microsoft.com/en-us/library/windowsazure/jj553779.aspx.
*
* @param {string}                     channel                        The ChannelUri.
* @param {string|array}               tags                           The tags (comma-separated list, no spaces).
* @param {object}                     template                       The registration template.
* @param {string}                     template.text1                 Text1
* @param {string}                     template.text2                 Text2
* @param {string}                     template.param                 (optional) (Only for Windows Phone version 7.5 or later)

* @param {object}                     [options]                      The request options.
* @param {object}                     [options.headers]              The mpns headers.
* @param {Function(error, response)}  callback                       The callback function.
* @return {undefined}
*/

/**
* Creates a raw template registration.
*
* @param {string}                     channel                                The device channel uri.
* @param {string|array}               tags                                   The tags (comma-separated list, no spaces).
* @param {json}                       template                               The template for the registration.
* @param {object}                     [options]                              The request options.
* @param {object}                     [options.headers]                      The mpns headers to include.
* @param {Function(error, response)}  callback                               The callback function.
* @return {undefined}
*/
MpnsService.prototype.createRawTemplateRegistration = function (channel, tags, template, optionsOrCallback, callback) {
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
* Creates a raw template registration.
*
* @param {string}                     registrationId      The registration identifier.
* @param {string}                     channel             The device channel uri.
* @param {string|array}               tags                The tags (comma-separated list, no spaces).
* @param {json}                       template            The template for the registration.
* @param {object}                     [options]           The request options.
* @param {object}                     [options.headers]   The mpns headers to include.
* @param {Function(error, response)}  callback            The callback function.
* @return {undefined}
*/
MpnsService.prototype.createOrUpdateRawTemplateRegistration = function (registrationId, channel, tags, template, optionsOrCallback, callback) {
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
* @name MpnsService#updateFlipTileRegistration
* @function
*
* @description
* Updates a registration with a FlipTile template (Only Windows Phone version 7.8 or later). For more information see http://msdn.microsoft.com/en-us/library/windowsazure/jj206971.aspx.
*
* @param {string}                     registrationId                    The registration identifier.
* @param {string}                     channel                           The ChannelUri.
* @param {string|array}               tags                              The tags (comma-separated list, no spaces).
* @param {object}                     template                          The registration template.
* @param {string}                     template.backgroundImage          The URI of the background image for the tile.
* @param {string}                     template.count                    The number that appears on the tile.
* @param {string}                     template.title                    The title text of the tile.
* @param {string}                     template.backBackgroundImage      The URI of the image that is shown on the backside of the tile.
* @param {string}                     template.backTitle                Title for the backside side of the tile.
* @param {string}                     template.backContent              Text for the backside of the tile.
* @param {string}                     template.id                       ID of a related, secondary tile.
* @param {string}                     template.smallBackgroundImage     The URI for the background image for the tile when it is reduced to its small size.
* @param {string}                     template.wideBackgroundImage      The URI for the background image for the tile when it is expanded to its wide size.
* @param {string}                     template.wideBackContent          Content for the back tile when the tile is expanded to its wide size.
* @param {string}                     template.wideBackBackgroundImage  The URI for the image to be on the backside of the tile when the tile is expanded to its wide size.
* @param {object}                     [options]                         The request options.
* @param {object}                     [options.headers]                 The mpns headers.
* @param {Function(error, response)}  callback                          The callback function.

* @return {undefined}
*/

/**
* @name MpnsService#updateTileRegistration
* @function
*
* @description
* Updates a registration with a Tile template. For more information see http://msdn.microsoft.com/en-us/library/windowsazure/jj553779.aspx.
*
* @param {string}                     registrationId                 The registration identifier.
* @param {string}                     channel                        The ChannelUri.
* @param {string|array}               tags                           The tags (comma-separated list, no spaces).
* @param {object}                     template                       The registration template.
* @param {string}                     template.backgroundImage       The URI of the background image for the tile.
* @param {string}                     template.count                 The number that appears on the tile.
* @param {string}                     template.title                 The title text of the tile.
* @param {string}                     template.backBackgroundImage   The URI of the image that is shown on the backside of the tile.
* @param {string}                     template.backTitle             Title for the backside side of the tile.
* @param {string}                     template.backContent           Text for the backside of the tile.
* @param {string}                     template.id                    ID of a related, secondary tile.
* @param {object}                     [options]                      The request options.
* @param {object}                     [options.headers]              The mpns headers.
* @param {Function(error, response)}  callback                       The callback function.
* @return {undefined}
*/

/**
* @name MpnsService#updatesToastRegistration
* @function
*
* @description
* Updates a registration with a Toast template. For more information see http://msdn.microsoft.com/en-us/library/windowsazure/jj553779.aspx.
*
* @param {string}                     registrationId                 The registration identifier.
* @param {string}                     channel                        The ChannelUri.
* @param {string|array}               tags                           The tags (comma-separated list, no spaces).
* @param {object}                     template                       The registration template.
* @param {string}                     template.text1                 Text1
* @param {string}                     template.text2                 Text2
* @param {string}                     template.param                 (optional) (Only for Windows Phone version 7.5 or later)
* @param {object}                     [options]                      The request options.
* @param {object}                     [options.headers]              The mpns headers.
* @param {Function(error, response)}  callback                       The callback function.
* @return {undefined}
*/

/**
* Updates a raw template registration.
*
* @param {string}                     registrationId                         The registration identifier.
* @param {string}                     channel                                The ChannelUri.
* @param {string|array}               tags                                   The tags (comma-separated list, no spaces).
* @param {json}                       template                               The template for the registration.
* @param {object}                     [options]                              The request options.
* @param {object}                     [options.headers]                      The mpns headers to include.
* @param {object}                     [options.etag]                         The etag to include.
* @param {Function(error, response)}  callback                               The callback function.
* @return {undefined}
*/
MpnsService.prototype.updatesRawTemplateRegistration = function (registrationId, channel, tags, template, optionsOrCallback, callback) {
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
* @param {string}                     channel                   The ChannelUri.
* @param {object}                     [options]                 The request options. Additional properties will be passed as headers.
* @param {object}                     [options.top]             Specifies the maximum number of registration to obtain from the call.
* @param {object}                     [options.skip]            Specifies the number of registrations to skip in the call.
* @param {Function(error, response)}  callback                  The callback function.
* @return {undefined}
*/
MpnsService.prototype.listRegistrationsByChannel = function (channel, optionsOrCallback, callback) {
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
* @name MpnsService#sendFlipTile
* @function
*
* @description
* Sends a FlipTile notification (Only Windows Phone version 7.8 or later). For more information see http://msdn.microsoft.com/en-us/library/windowsazure/jj206971.aspx.
*
* @param {string}                     tags                            A single tag or tag expression.
* @param {object}                     payload                         The message's payload.
* @param {string}                     payload.backgroundImage         The URI of the background image for the tile.
* @param {string}                     payload.count                   The number that appears on the tile.
* @param {string}                     payload.title                   The title text of the tile.
* @param {string}                     payload.backBackgroundImage     The URI of the image that is shown on the backside of the tile.
* @param {string}                     payload.backTitle               Title for the backside side of the tile.
* @param {string}                     payload.backContent             Text for the backside of the tile.
* @param {string}                     payload.id                      ID of a related, secondary tile.
* @param {string}                     payload.smallBackgroundImage    The URI for the background image for the tile when it is reduced to its small size.
* @param {string}                     payload.wideBackgroundImage     The URI for the background image for the tile when it is expanded to its wide size.
* @param {string}                     payload.wideBackContent         Content for the back tile when the tile is expanded to its wide size.
* @param {string}                     payload.wideBackBackgroundImage The URI for the image to be on the backside of the tile when the tile is expanded to its wide size.
* @param {object}                     [options]                       The request options.
* @param {object}                     [options.headers]               The mpns headers.
* @param {Function(error, response)}  callback                        The callback function.
* @return {undefined}
*/

/**
* @name MpnsService#sendTile
* @function
*
* @description
* Sends a Tile notification. For more information see http://msdn.microsoft.com/en-us/library/windowsazure/jj553779.aspx.
*
* @param {string}                     tags                           A single tag or tag expression.
* @param {object}                     payload                        The message's payload.
* @param {string}                     payload.backgroundImage        The URI of the background image for the tile.
* @param {string}                     payload.count                  the number that appears on the tile.
* @param {string}                     payload.title                  the title text of the tile.
* @param {string}                     payload.backBackgroundImage    The URI of the image that is shown on the backside of the tile.
* @param {string}                     payload.backTitle              Title for the backside side of the tile.
* @param {string}                     payload.backContent            Text for the backside of the tile.
* @param {string}                     payload.id                     ID of a related, secondary tile.
* @param {object}                     [options]                      The request options.
* @param {object}                     [options.headers]              The mpns headers.
* @param {Function(error, response)}  callback                       The callback function.
* @return {undefined}
*/

/**
* @name MpnsService#sendToast
* @function
*
* @description
* Sends a Toast notification. For more information see http://msdn.microsoft.com/en-us/library/windowsazure/jj553779.aspx.
*
* @param {string}                     tags                           A single tag or tag expression.
* @param {object}                     payload                        The message's payload.
* @param {string}                     payload.text1                  Text1
* @param {string}                     payload.text2                  Text2
* @param {string}                     payload.param                  (optional) (Only for Windows Phone version 7.5 or later)
* @param {object}                     [options]                      The request options.
* @param {object}                     [options.headers]              The mpns headers.
* @param {Function(error, response)}  callback                       The callback function.
* @return {undefined}
*/

/**
* Sends a custom MPNS notification. Use this method if you want to have full control on the payload.
*
* @param {string}                     tags                           A single tag or tag expression.
* @param {string}                     payload                        The message's XML payload.
* @param {string}                     targetName                     The target name.
* @param {string}                     notificationClass              The notification class.
* @param {object}                     [options]                      The request options.
* @param {object}                     [options.headers]              The mpns headers.
* @param {Function(error, response)}  callback                       The callback function.
* @return {undefined}
*/
MpnsService.prototype.send = function (tags, payload, targetName, notificationClass, optionsOrCallback, callback) {
  var options;
  azureutil.normalizeArgs(optionsOrCallback, callback, function (o, c) { options = o; callback = c; });

  if (!_.isString(payload)) {
    throw new Error('The payload parameter must be the notification payload string.');
  }

  if (!_.isFunction(callback)) {
    throw new Error('The callback parameter must be the callback function.');
  }

  var headers = {};
  headers[HeaderConstants.SERVICE_BUS_NOTIFICATION_FORMAT] = 'windowsphone';

  if (tags) {
    if (_.isArray(tags)) {
      tags = this.notificationHubService._joinTagsSend(tags);
    }

    headers[HeaderConstants.SERVICE_BUS_NOTIFICATION_TAGS] = tags;
  }

  headers['X-WindowsPhone-Target'] = targetName;
  headers['X-NotificationClass'] = notificationClass;

  if (options && options.headers) {
    Object.keys(options.headers).forEach(function (header) {
      headers[header] = options.headers[header];
    });
  }

  this.notificationHubService._sendNotification(payload, headers, callback);
};

/**
* Creates a template registration body.
* @ignore
*
* @param {string}             elementName                  The element name.
* @param {string}             channel                      The device channel uri.
* @param {string|array}       tags                         The tags.
* @param {json}               template                     The template for the registration.
* @param {object}             [options]                    The request options.
* @param {object}             [options.pnsCredentialName]  The pns credentials to use.
* @param {object}             [options.headers]            The mpns headers to include.
* @return {undefined}
*/
MpnsService.prototype._createBody = function (elementName, channel, tags, template, options) {
  var registration = { };

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

  registration.ChannelUri = channel;

  if (template) {
    registration.BodyTemplate = '<![CDATA[' + template + ']]>';
  }

  if (options) {
    if (options.headers) {
      registration.MpnsHeaders = { MpnsHeader: [] };
      Object.keys(options.headers).forEach(function (headerName) {
        registration.MpnsHeaders.MpnsHeader.push({ Header: headerName, Value: options.headers[headerName] });
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
* @param {object}             [options]                    The request options.
* @param {object}             [options.pnsCredentialName]  The pns credentials to use.
* @param {object}             [options.headers]            The mpns headers to include.
* @return {undefined}
*/
MpnsService.prototype._createTemplateBody = function (channel, tags, template, options) {
  return this._createBody('MpnsTemplateRegistrationDescription', channel, tags, template, options);
};

module.exports = MpnsService;