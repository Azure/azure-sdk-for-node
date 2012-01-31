/**
* Copyright 2011 Microsoft Corporation
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

var queryString = require('querystring');

// Module dependencies.
var AtomHandler = require('../../../util/atomhandler');
var ISO8061Date = require('../../../util/iso8061date');
var Constants = require('../../../util/constants');
var ServiceBusConstants = Constants.ServiceBusConstants;
var HeaderConstants = Constants.HeaderConstants;

// Expose 'SubscriptionResult'.
exports = module.exports = SubscriptionResult;

function SubscriptionResult() { }

SubscriptionResult.serialize = function (path, subscription) {
  var subscriptionDescription = {
    '@': {
      'xmlns:i': 'http://www.w3.org/2001/XMLSchema-instance',
      'xmlns': 'http://schemas.microsoft.com/netservices/2010/10/servicebus/connect'
    }
  };

  var atomQueue = {
    'title': '',
    'updated': ISO8061Date.format(new Date()),
    'author': {
      name: ''
    },
    'id': '',
    'content': {
      '@': { type: 'application/xml' },
      SubscriptionDescription: subscriptionDescription
    }
  };

  if (subscription) {
    for (var property in subscription) {
      switch (property) {
        case ServiceBusConstants.LOCK_DURATION:
        case ServiceBusConstants.REQUIRES_SESSION:
        case ServiceBusConstants.DEFAULT_MESSAGE_TIME_TO_LIVE:
        case ServiceBusConstants.DEAD_LETTERING_ON_MESSAGE_EXPIRATION:
        case ServiceBusConstants.DEAD_LETTERING_ON_FILTER_EVALUATION_EXCEPTIONS:
          subscriptionDescription[property] = subscription[property];
          break;
        default:
          break;
      }
    }
  }

  var atomHandler = new AtomHandler(null, null);
  var xml = atomHandler.serialize(atomQueue);

  return xml;
};

SubscriptionResult.parse = function (subscriptionXml) {
  var atomHandler = new AtomHandler(null, null);
  var subscription = atomHandler.parse(subscriptionXml, Constants.ATOM_SUBSCRIPTION_DESCRIPTION_MARKER);

  // Extract subscription name
  var pos = subscription.id.lastIndexOf('/');
  subscription.SubscriptionName = subscription.id.substr(pos + 1);

  // Extract string up to topic name
  pos = subscription.id.indexOf('/Subscriptions');
  var tmp = subscription.id.substr(0, pos);

  // Extract topic name
  pos = tmp.lastIndexOf('/');
  subscription.TopicName = tmp.substr(pos + 1);

  return subscription;
};