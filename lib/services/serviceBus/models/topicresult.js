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
    if (topic[ServiceBusConstants.DEFAULT_MESSAGE_TIME_TO_LIVE]) {
      topicDescription[ServiceBusConstants.DEFAULT_MESSAGE_TIME_TO_LIVE] = topic[ServiceBusConstants.DEFAULT_MESSAGE_TIME_TO_LIVE];
    }

    if (topic[ServiceBusConstants.MAX_SIZE_IN_MEGABYTES]) {
      topicDescription[ServiceBusConstants.MAX_SIZE_IN_MEGABYTES] = topic[ServiceBusConstants.MAX_SIZE_IN_MEGABYTES];
    }

    if (topic[ServiceBusConstants.REQUIRES_DUPLICATE_DETECTION]) {
      topicDescription[ServiceBusConstants.REQUIRES_DUPLICATE_DETECTION] = topic[ServiceBusConstants.REQUIRES_DUPLICATE_DETECTION];
    }

    if (topic[ServiceBusConstants.DUPLICATE_DETECTION_HISTORY_TIME_WINDOW]) {
      topicDescription[ServiceBusConstants.DUPLICATE_DETECTION_HISTORY_TIME_WINDOW] = topic[ServiceBusConstants.DUPLICATE_DETECTION_HISTORY_TIME_WINDOW];
    }

    if (topic[ServiceBusConstants.ENABLE_BATCHED_OPERATIONS]) {
      topicDescription[ServiceBusConstants.ENABLE_BATCHED_OPERATIONS] = topic[ServiceBusConstants.ENABLE_BATCHED_OPERATIONS];
    }

    if (topic[ServiceBusConstants.SIZE_IN_BYTES]) {
      topicDescription[ServiceBusConstants.SIZE_IN_BYTES] = topic[ServiceBusConstants.SIZE_IN_BYTES];
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

  if (topic.TopicName.indexOf('?') !== -1) {
    topic.TopicName = topic.TopicName.substr(0, topic.TopicName.indexOf('?'));
  }

  return topic;
};