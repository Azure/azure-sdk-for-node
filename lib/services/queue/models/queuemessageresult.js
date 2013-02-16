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

// Module dependencies.
var xmlbuilder = require('xmlbuilder');
var azureutil = require('../../../util/util');

var Constants = require('../../../util/constants');
var HeaderConstants = Constants.HeaderConstants;

// Expose 'QueueMessageResult'.
exports = module.exports = QueueMessageResult;

function QueueMessageResult(queue, messageid, popreceipt, metadata) {
  if (queue) {
    this.queue = queue;
  }

  if (messageid) {
    this.messageid = messageid;
  }

  if (popreceipt) {
    this.popreceipt = popreceipt;
  }

  if (metadata) {
    this.metadata = metadata;
  }
}

/**
* Builds an XML representation for a queue message
*
* @param  {string}  messageJs The queue message.
* @return {string} The XML queue message.
*/
QueueMessageResult.serialize = function (messageJs) {
  var doc = xmlbuilder.create();
  doc = doc.begin(Constants.QUEUE_MESSAGE_ELEMENT, { version: '1.0', encoding: 'utf-8' });

  if (messageJs) {
    doc.ele(Constants.MESSAGE_TEXT_ELEMENT)
        .txt(new Buffer(messageJs).toString('base64'))
      .up();
  } else {
    doc.ele(Constants.MESSAGE_TEXT_ELEMENT).up();
  }

  return doc.doc().toString();
};

QueueMessageResult.parse = function (messageXml) {
  var queueMessageResult = new QueueMessageResult();
  for (var property in messageXml) {
    if (property === Constants.MESSAGE_TEXT_ELEMENT) {
      queueMessageResult.messagetext = new Buffer(messageXml[property], 'base64').toString();
    } else {
      queueMessageResult[property.toLowerCase()] = messageXml[property];
    }
  }
  
  return queueMessageResult;
};

QueueMessageResult.prototype.getPropertiesFromHeaders = function (headers) {
  var self = this;

  var setmessagePropertyFromHeaders = function (messageProperty, headerProperty) {
    if (!self[messageProperty] && headers[headerProperty.toLowerCase()]) {
      self[messageProperty] = headers[headerProperty.toLowerCase()];
    }
  };

  setmessagePropertyFromHeaders('popreceipt', HeaderConstants.POP_RECEIPT_HEADER);
  setmessagePropertyFromHeaders('timenextvisible', HeaderConstants.TIME_NEXT_VISIBLE_HEADER);
};
