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
    if (subscription[ServiceBusConstants.LOCK_DURATION]) {
      subscriptionDescription[ServiceBusConstants.LOCK_DURATION] = subscription[ServiceBusConstants.LOCK_DURATION];
    }

    if (subscription[ServiceBusConstants.REQUIRES_SESSION]) {
      subscriptionDescription[ServiceBusConstants.REQUIRES_SESSION] = subscription[ServiceBusConstants.REQUIRES_SESSION];
    }

    if (subscription[ServiceBusConstants.DEFAULT_MESSAGE_TIME_TO_LIVE]) {
      subscriptionDescription[ServiceBusConstants.DEFAULT_MESSAGE_TIME_TO_LIVE] = subscription[ServiceBusConstants.DEFAULT_MESSAGE_TIME_TO_LIVE];
    }

    if (subscription[ServiceBusConstants.DEAD_LETTERING_ON_MESSAGE_EXPIRATION]) {
      subscriptionDescription[ServiceBusConstants.DEAD_LETTERING_ON_MESSAGE_EXPIRATION] = subscription[ServiceBusConstants.DEAD_LETTERING_ON_MESSAGE_EXPIRATION];
    }

    if (subscription[ServiceBusConstants.DEAD_LETTERING_ON_FILTER_EVALUATION_EXCEPTIONS]) {
      subscriptionDescription[ServiceBusConstants.DEAD_LETTERING_ON_FILTER_EVALUATION_EXCEPTIONS] = subscription[ServiceBusConstants.DEAD_LETTERING_ON_FILTER_EVALUATION_EXCEPTIONS];
    }

    if (subscription[ServiceBusConstants.DEFAULT_RULE_DESCRIPTION]) {
      subscriptionDescription[ServiceBusConstants.DEFAULT_RULE_DESCRIPTION] = subscription[ServiceBusConstants.DEFAULT_RULE_DESCRIPTIONS];
    }

    if (subscription[ServiceBusConstants.MESSAGE_COUNT]) {
      subscriptionDescription[ServiceBusConstants.MESSAGE_COUNT] = subscription[ServiceBusConstants.MESSAGE_COUNT];
    }

    if (subscription[ServiceBusConstants.MAX_DELIVERY_COUNT]) {
      subscriptionDescription[ServiceBusConstants.MAX_DELIVERY_COUNT] = subscription[ServiceBusConstants.MAX_DELIVERY_COUNT];
    }

    if (subscription[ServiceBusConstants.ENABLE_BATCHED_OPERATIONS]) {
      subscriptionDescription[ServiceBusConstants.ENABLE_BATCHED_OPERATIONS] = subscription[ServiceBusConstants.ENABLE_BATCHED_OPERATIONS];
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

  if (subscription.SubscriptionName.indexOf('?') !== -1) {
    subscription.SubscriptionName = subscription.SubscriptionName.substr(0, subscription.SubscriptionName.indexOf('?'));
  }

  // Extract string up to topic name
  pos = subscription.id.indexOf('/Subscriptions');
  var tmp = subscription.id.substr(0, pos);

  // Extract topic name
  pos = tmp.lastIndexOf('/');
  subscription.TopicName = tmp.substr(pos + 1);

  return subscription;
};