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

// Expose 'TopicResult'.
exports = module.exports = TopicResult;

function TopicResult() { }

TopicResult.serialize = function (path, topic) {
  var topicDescription = {
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
      TopicDescription: topicDescription
    }
  };

  if (topic) {
    for (var property in topic) {
      switch (property) {
        case ServiceBusConstants.MAX_TOPIC_SIZE_IN_BYTES:
        case ServiceBusConstants.DEFAULT_MESSAGE_TIME_TO_LIVE:
        case ServiceBusConstants.REQUIRES_DUPLICATE_DETECTION:
        case ServiceBusConstants.DUPLICATE_DETECTION_HISTORY_TIME_WINDOW:
        case ServiceBusConstants.MAX_SUBSCRIPTIONS_PER_TOPIC:
        case ServiceBusConstants.MAX_SQL_FILTERS_PER_TOPIC:
        case ServiceBusConstants.MAX_CORRELATION_FILTERS_PER_TOPIC:
        case ServiceBusConstants.DEAD_LETTERING_ON_MESSAGE_EXPIRATION:
        case ServiceBusConstants.DEAD_LETTERING_ON_FILTER_EVALUATION_EXCEPTIONS:
          topicDescription[property] = topic[property];
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

TopicResult.parse = function (topicXml) {
  var atomHandler = new AtomHandler(null, null);
  var topic = atomHandler.parse(topicXml, Constants.ATOM_TOPIC_DESCRIPTION_MARKER);

  var pos = topic.id.lastIndexOf('/');
  topic.TopicName = topic.id.substr(pos + 1);

  return topic;
};