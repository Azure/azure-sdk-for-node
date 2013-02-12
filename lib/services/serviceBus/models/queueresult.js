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

// Module dependencies
var util = require('util');

var AtomHandler = require('../../../util/atomhandler');
var ISO8061Date = require('../../../util/iso8061date');
var Constants = require('../../../util/constants');
var ServiceBusConstants = Constants.ServiceBusConstants;
var HeaderConstants = Constants.HeaderConstants;

// Expose 'QueueResult'.
exports = module.exports = QueueResult;

function QueueResult() { }

QueueResult.serialize = function (path, queue) {
  var queueDescription = {
    '$': {
      'xmlns:i': 'http://www.w3.org/2001/XMLSchema-instance',
      'xmlns': 'http://schemas.microsoft.com/netservices/2010/10/servicebus/connect'
    }
  };

  if (queue) {
    if (queue[ServiceBusConstants.LOCK_DURATION]) {
      queueDescription[ServiceBusConstants.LOCK_DURATION] = queue[ServiceBusConstants.LOCK_DURATION];
    }

    if (queue[ServiceBusConstants.MAX_SIZE_IN_MEGABYTES]) {
      queueDescription[ServiceBusConstants.MAX_SIZE_IN_MEGABYTES] = queue[ServiceBusConstants.MAX_SIZE_IN_MEGABYTES];
    }

    if (queue[ServiceBusConstants.REQUIRES_DUPLICATE_DETECTION]) {
      queueDescription[ServiceBusConstants.REQUIRES_DUPLICATE_DETECTION] = queue[ServiceBusConstants.REQUIRES_DUPLICATE_DETECTION];
    }

    if (queue[ServiceBusConstants.REQUIRES_SESSION]) {
      queueDescription[ServiceBusConstants.REQUIRES_SESSION] = queue[ServiceBusConstants.REQUIRES_SESSION];
    }

    if (queue[ServiceBusConstants.DEFAULT_MESSAGE_TIME_TO_LIVE]) {
      queueDescription[ServiceBusConstants.DEFAULT_MESSAGE_TIME_TO_LIVE] = queue[ServiceBusConstants.DEFAULT_MESSAGE_TIME_TO_LIVE];
    }

    if (queue[ServiceBusConstants.DEAD_LETTERING_ON_MESSAGE_EXPIRATION]) {
      queueDescription[ServiceBusConstants.DEAD_LETTERING_ON_MESSAGE_EXPIRATION] = queue[ServiceBusConstants.DEAD_LETTERING_ON_MESSAGE_EXPIRATION];
    }

    if (queue[ServiceBusConstants.DUPLICATE_DETECTION_HISTORY_TIME_WINDOW]) {
      queueDescription[ServiceBusConstants.DUPLICATE_DETECTION_HISTORY_TIME_WINDOW] = queue[ServiceBusConstants.DUPLICATE_DETECTION_HISTORY_TIME_WINDOW];
    }

    if (queue[ServiceBusConstants.MAX_DELIVERY_COUNT]) {
      queueDescription[ServiceBusConstants.MAX_DELIVERY_COUNT] = queue[ServiceBusConstants.MAX_DELIVERY_COUNT];
    }

    if (queue[ServiceBusConstants.ENABLE_BATCHED_OPERATIONS]) {
      queueDescription[ServiceBusConstants.ENABLE_BATCHED_OPERATIONS] = queue[ServiceBusConstants.ENABLE_BATCHED_OPERATIONS];
    }

    if (queue[ServiceBusConstants.SIZE_IN_BYTES]) {
      queueDescription[ServiceBusConstants.SIZE_IN_BYTES] = queue[ServiceBusConstants.SIZE_IN_BYTES];
    }

    if (queue[ServiceBusConstants.MESSAGE_COUNT]) {
      queueDescription[ServiceBusConstants.MESSAGE_COUNT] = queue[ServiceBusConstants.MESSAGE_COUNT];
    }
  }

  var atomQueue = {
    'title': '',
    'updated': ISO8061Date.format(new Date()),
    'author': {
      name: ''
    },
    'id': '',
    'content': {
      '$': { type: 'application/xml' },
      QueueDescription: queueDescription
    }
  };

  var atomHandler = new AtomHandler(null, null);
  var xml = atomHandler.serialize(atomQueue);

  return xml;
};

QueueResult.parse = function (queueXml) {
  var atomHandler = new AtomHandler(null, null);
  var queue = atomHandler.parse(queueXml, Constants.ATOM_QUEUE_DESCRIPTION_MARKER);

  var pos = queue.id.lastIndexOf('/');
  queue.QueueName = queue.id.substr(pos + 1);

  if (queue.QueueName.indexOf('?') !== -1) {
    queue.QueueName = queue.QueueName.substr(0, queue.QueueName.indexOf('?'));
  }

  return queue;
};