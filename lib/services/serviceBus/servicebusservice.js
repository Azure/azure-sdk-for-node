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
var util = require('util');

var azureutil = require('../../util/util');
var RFC1123 = require('../../util/rfc1123date');

var ServiceClient = require('../core/serviceclient');
var ServiceBusServiceBase = require('./servicebusservicebase');

var WebResource = require('../../http/webresource');
var Constants = require('../../util/constants');
var QueryStringConstants = Constants.QueryStringConstants;
var HttpConstants = Constants.HttpConstants;
var HeaderConstants = Constants.HeaderConstants;

var queueResult = require('./models/queueresult');
var queueMessageResult = require('./models/queuemessageresult');
var topicResult = require('./models/topicresult');
var subscriptionResult = require('./models/subscriptionresult');
var ruleResult = require('./models/ruleresult');
var notificationHubResult = require('./models/notificationhubresult');

/**
* Creates a new ServiceBusService object.
*
* @constructor
* @augments {ServiceClient}
*
* @param {string} [namespaceOrConnectionString]  The service bus namespace or the connection string.
* @param {string} [accessKey]                    The password. Only necessary if no connection string passed.
* @param {string} [issuer]                       The issuer.
* @param {string} [acsNamespace]                 The acs namespace. Usually the same as the sb namespace with "-sb" suffix.
* @param {string} [host]                         The host address.
* @param {object} [authenticationProvider]       The authentication provider.
*/
function ServiceBusService(namespaceOrConnectionString, accessKey, issuer, acsNamespace, host, authenticationProvider) {
  ServiceBusService['super_'].call(this,
    namespaceOrConnectionString,
    accessKey,
    issuer,
    acsNamespace,
    host,
    authenticationProvider);
}

util.inherits(ServiceBusService, ServiceBusServiceBase);

function setRequestHeaders(webResource, message) {
  for (var property in message) {
    if (message.hasOwnProperty(property)) {
      switch (property) {
      case 'contentType':
        webResource.addOptionalHeader(HeaderConstants.CONTENT_TYPE, message[property]);
        break;
      case 'brokerProperties':
        webResource.addOptionalHeader(HeaderConstants.BROKER_PROPERTIES_HEADER, JSON.stringify(message.brokerProperties));
        break;
      case 'customProperties':
        // Custom properties
        for (var customProperty in message.customProperties) {
          if (message.customProperties.hasOwnProperty(customProperty)) {
            var value = message.customProperties[customProperty];
            if (azureutil.objectIsString(value)) {
              value = '\"' + value.toString() + '\"';
            } else if (azureutil.stringIsDate(value)) {
              value = '\"' + RFC1123.format(value) + '\"';
            } else {
              value = value.toString();
            }

            webResource.addOptionalHeader(customProperty, value);
          }
        }
        break;
      default:
        break;
      }
    }
  }

  // if content-type not specified by caller, set it using message type
  if (webResource.headers && webResource.headers[HeaderConstants.CONTENT_TYPE] === undefined) {
    if (azureutil.objectIsString(message.body)) {
      webResource.addOptionalHeader(HeaderConstants.CONTENT_TYPE, 'text/plain');
    } else if (typeof message.body == 'object') {
      webResource.addOptionalHeader(HeaderConstants.CONTENT_TYPE, 'application/json');
    }
  }
}

function createSubscriptionPath(topicPath, subscriptionPath) {
  return topicPath + '/Subscriptions/' + subscriptionPath;
}

function createRulePath(topicPath, subscriptionPath, rulePath) {
  return topicPath + '/Subscriptions/' + subscriptionPath + '/Rules/' + rulePath;
}

/**
* Validates a hub name.
*
* @param {string} topic The hub name.
* @return {undefined}
*/
function validateHubName(hub) {
  if (!azureutil.objectIsString(hub) || azureutil.stringIsEmpty(hub)) {
    throw new Error('Notification hub name must be a non empty string.');
  }
}

/**
* Validates a queue name.
*
* @param {string} queue The queue name.
* @return {undefined}
*/
function validateQueueName(queue) {
  if (!azureutil.objectIsString(queue) || azureutil.stringIsEmpty(queue)) {
    throw new Error('Queue name must be a non empty string.');
  }
}

/**
* Validates a topic name.
*
* @param {string} topic The topic name.
* @return {undefined}
*/
function validateTopicName(topic) {
  if (!azureutil.objectIsString(topic) || azureutil.stringIsEmpty(topic)) {
    throw new Error('Topic name must be a non empty string.');
  }
}

/**
* Validates a subscription name.
*
* @param {string} topic The subscription name.
* @return {undefined}
*/
function validateSubscriptionName(subscription) {
  if (!azureutil.objectIsString(subscription) || azureutil.stringIsEmpty(subscription)) {
    throw new Error('Subscription name must be a non empty string.');
  }
}

/**
* Validates a rule name.
*
* @param {string} topic The rule name.
* @return {undefined}
*/
function validateRuleName(rule) {
  if (!azureutil.objectIsString(rule) || azureutil.stringIsEmpty(rule)) {
    throw new Error('Rule name must be a non empty string.');
  }
}

/**
* Validates a callback function.
*
* @param (function) callback The callback function.
* @return {undefined}
*/
function validateCallback(callback) {
  if (!callback) {
    throw new Error('Callback must be specified.');
  }
}

/**
* Receives a queue message.
*
* @param {string}             queuePath                                           A string object that represents the name of the queue to which the message will be sent.
* @param {object|function}    [optionsOrCallback]                                 The request options or callback function.
* @param {bool}               [optionsOrCallback.isPeekLock]                      Boolean value indicating if the message should be peeked or received.
* @param {int}                [optionsOrCallback.timeoutIntervalInS]              The timeout interval, in seconds, to use for the request.
* @param {function(error, receivequeuemessageresult, response)} callback          The callback function.
* @return {undefined}
*/
ServiceBusService.prototype.receiveQueueMessage = function (queuePath, optionsOrCallback, callback) {
  var options = null;
  if (typeof optionsOrCallback === 'function' && !callback) {
    callback = optionsOrCallback;
  } else {
    options = optionsOrCallback;
  }

  validateQueueName(queuePath);
  this._receiveMessage(queuePath, options, callback);
};

/**
* Receives a subscription message.
*
* @param {string}             topicPath                                           A string object that represents the name of the topic to receive.
* @param {string}             subscriptionPath                                    A string object that represents the name of the subscription from the message will be received.
* @param {object|function}    [optionsOrCallback]                                 The request options or callback function.
* @param {bool}               [optionsOrCallback.isPeekLock]                      Boolean value indicating if the message should be peeked or received.
* @param {int}                [optionsOrCallback.timeoutIntervalInS]              The timeout interval, in seconds, to use for the request.
* @param {function(error, receivetopicmessageresult, response)} callback          The callback function.
* @return {undefined}
*/
ServiceBusService.prototype.receiveSubscriptionMessage = function (topicPath, subscriptionPath, optionsOrCallback, callback) {
  var options = null;
  if (typeof optionsOrCallback === 'function' && !callback) {
    callback = optionsOrCallback;
  } else {
    options = optionsOrCallback;
  }

  validateTopicName(topicPath);
  validateSubscriptionName(subscriptionPath);

  var subscriptionFullPath = createSubscriptionPath(topicPath, subscriptionPath);
  this._receiveMessage(subscriptionFullPath, options, callback);
};

/**
* Deletes a message.
*
* @param {object|string}      message                                             The message object or a string with the message location.
* @param {function(error, response)} callback                                     The callback function.
* @return {undefined}
*/
ServiceBusService.prototype.deleteMessage = function (message, callback) {
  validateCallback(callback);

  if (azureutil.objectIsString(message)) {
    message = { location: message };
  }

  var relativePath = message.location.substr(
    message.location.indexOf(ServiceClient.CLOUD_SERVICEBUS_HOST + '/') +
    ServiceClient.CLOUD_SERVICEBUS_HOST.length + 1);

  var webResource = WebResource.del(relativePath)
    .withOkCode(HttpConstants.HttpResponseCodes.Ok, true)
    .withRawResponse();

  var processResponseCallback = function (responseObject, next) {
    var finalCallback = function (returnObject) {
      callback(returnObject.error, returnObject.response);
    };

    next(responseObject, finalCallback);
  };

  this.performRequest(webResource, null, null, processResponseCallback);
};

/**
* Unlocks a message.
*
* @param {object|string}      message                                             The message object or a string with the message location.
* @param {function(error, response)} callback                                     The callback function.
* @return {undefined}
*/
ServiceBusService.prototype.unlockMessage = function (message, callback) {
  validateCallback(callback);

  if (azureutil.objectIsString(message)) {
    message = { location: message };
  }

  var relativePath = message.location.substr(
    message.location.indexOf(ServiceClient.CLOUD_SERVICEBUS_HOST + '/') +
    ServiceClient.CLOUD_SERVICEBUS_HOST.length + 1);

  var webResource = WebResource.put(relativePath)
    .withOkCode(HttpConstants.HttpResponseCodes.Ok, true)
    .withRawResponse();

  var processResponseCallback = function (responseObject, next) {
    var finalCallback = function (returnObject) {
      callback(returnObject.error, returnObject.response);
    };

    next(responseObject, finalCallback);
  };

  this.performRequest(webResource, null, null, processResponseCallback);
};

/**
* Sends a queue message.
*
* @param {string}             queuePath                                                            A string object that represents the name of the queue to which the message will be sent.
* @param {object|string}      message                                                              A message object that represents the message to send.
* @param {string}             [message.body]                                                       The message's text.
* @param {object}             [message.customProperties]                                           The message's custom properties.
* @param {string}             [message.brokerProperties.CorrelationId]                             The message's correlation identifier.
* @param {string}             [message.brokerProperties.SessionId]                                 The session identifier.
* @param {string}             [message.brokerProperties.MessageId]                                 The message's identifier.
* @param {string}             [message.brokerProperties.Label]                                     The message's lable.
* @param {string}             [message.brokerProperties.ReplyTo]                                   The message's reply to.
* @param {string}             [message.brokerProperties.TimeToLive]                                The message's time to live.
* @param {string}             [message.brokerProperties.To]                                        The message's to.
* @param {string}             [message.brokerProperties.ScheduledEnqueueTimeUtc]                   The message's scheduled enqueue time in UTC.
* @param {string}             [message.brokerProperties.ReplyToSessionId]                          The message's reply to session identifier.
* @param {function(error, response)} callback                                                      The callback function.
* @return {undefined}
*/
ServiceBusService.prototype.sendQueueMessage = function (queuePath, message, callback) {
  validateQueueName(queuePath);
  this._sendMessage(queuePath, message, callback);
};

/**
* Sends a topic message.
*
* @param {string}             topicPath                                                            A string object that represents the name of the topic to which the message will be sent.
* @param {object|string}      message                                                              A message object that represents the message to send.
* @param {string}             [message.body]                                                       The message's text.
* @param {object}             [message.customProperties]                                           The message's custom properties.
* @param {string}             [message.brokerProperties.CorrelationId]                             The message's correlation identifier.
* @param {string}             [message.brokerProperties.SessionId]                                 The session identifier.
* @param {string}             [message.brokerProperties.MessageId]                                 The message's identifier.
* @param {string}             [message.brokerProperties.Label]                                     The message's lable.
* @param {string}             [message.brokerProperties.ReplyTo]                                   The message's reply to.
* @param {string}             [message.brokerProperties.TimeToLive]                                The message's time to live.
* @param {string}             [message.brokerProperties.To]                                        The message's to.
* @param {string}             [message.brokerProperties.ScheduledEnqueueTimeUtc]                   The message's scheduled enqueue time in UTC.
* @param {string}             [message.brokerProperties.ReplyToSessionId]                          The message's reply to session identifier.
* @param {function(error, receivetopicmessageresult, response)} callback                           The callback function.
* @return {undefined}
*/
ServiceBusService.prototype.sendTopicMessage = function (topicPath, message, callback) {
  validateTopicName(topicPath);
  this._sendMessage(topicPath, message, callback);
};

/**
* Sends a message.
*
* @param {string}             path                                                                 A string object that represents the path to which the message will be sent. This may be the value of a queuePath or a topicPath.
* @param {object|string}      message                                                              A message object that represents the message to send.
* @param {string}             [message.body]                                                       The message's text.
* @param {object}             [message.customProperties]                                           The message's custom properties.
* @param {string}             [message.brokerProperties.CorrelationId]                             The message's correlation identifier.
* @param {string}             [message.brokerProperties.SessionId]                                 The session identifier.
* @param {string}             [message.brokerProperties.MessageId]                                 The message's identifier.
* @param {string}             [message.brokerProperties.Label]                                     The message's lable.
* @param {string}             [message.brokerProperties.ReplyTo]                                   The message's reply to.
* @param {string}             [message.brokerProperties.TimeToLive]                                The message's time to live.
* @param {string}             [message.brokerProperties.To]                                        The message's to.
* @param {string}             [message.brokerProperties.ScheduledEnqueueTimeUtc]                   The message's scheduled enqueue time in UTC.
* @param {string}             [message.brokerProperties.ReplyToSessionId]                          The message's reply to session identifier.
* @param {function(error, response)} callback                                                      The callback function.
* @return {undefined}
*/
ServiceBusService.prototype._sendMessage = function (path, message, callback) {
  validateCallback(callback);

  if (azureutil.objectIsString(message)) {
    message = { body: message };
  }

  var webResource = WebResource.post(path + '/Messages');
  setRequestHeaders(webResource, message);

  var processResponseCallback = function (responseObject, next) {
    var finalCallback = function (returnObject) {
      callback(returnObject.error, returnObject.response);
    };

    next(responseObject, finalCallback);
  };

  this.performRequest(webResource, message.body, null, processResponseCallback);
};

/**
* Receives a message.
*
* @param {string}             path                                                A <code>String</code> object that represents the path from which a message will be received. This may either be the value of queuePath or a combination of the topicPath + "/subscriptions/" + subscriptionName.
* @param {object|function}    [optionsOrCallback]                                 The request options or callback function.
* @param {bool}               [optionsOrCallback.isPeekLock]                      Boolean value indicating if the message should be peeked or received.
* @param {int}                [optionsOrCallback.timeoutIntervalInS]              The timeout interval, in seconds, to use for the request.
* @param {function(error, receivemessageresult, response)} callback               The callback function.
* @return {undefined}
*/
ServiceBusService.prototype._receiveMessage = function (path, optionsOrCallback, callback) {
  var options = null;
  if (typeof optionsOrCallback === 'function' && !callback) {
    callback = optionsOrCallback;
  } else {
    options = optionsOrCallback;
  }

  validateCallback(callback);

  var webResource;
  if (options && options.isPeekLock) {
    webResource = WebResource.post(path + '/Messages/Head')
      .withOkCode(HttpConstants.HttpResponseCodes.NoContent, true)
      .withRawResponse();
  } else {
    webResource = WebResource.del(path + '/Messages/Head')
      .withOkCode(HttpConstants.HttpResponseCodes.Ok, true)
      .withRawResponse();
  }

  if (options && options.timeoutIntervalInS) {
    webResource.addOptionalQueryParam(QueryStringConstants.TIMEOUT, options.timeoutIntervalInS);
  }

  var processResponseCallback = function (responseObject, next) {
    if (responseObject.response &&
        responseObject.response.statusCode === HttpConstants.HttpResponseCodes.NoContent) {
      responseObject.error = 'No messages to receive';
    } else if (!responseObject.error) {
      responseObject.message = queueMessageResult.parse(responseObject.response);
    }

    var finalCallback = function (returnObject) {
      callback(returnObject.error, returnObject.message, returnObject.response);
    };

    next(responseObject, finalCallback);
  };

  this.performRequest(webResource, null, options, processResponseCallback);
};

/**
* Creates a queue.
*
* @param {string}             queuePath                                                       A string object that represents the name of the queue to delete.
* @param {object|function}    [optionsOrCallback]                                             The request options or callback function.
* @param {int}                [optionsOrCallback.MaxSizeInMegaBytes]                          Specifies the maximum queue size in megabytes. Any attempt to enqueue a message that will cause the queue to exceed this value will fail.
* @param {PTnHnMnS}           [optionsOrCallback.DefaultMessageTimeToLive]                    Depending on whether DeadLettering is enabled, a message is automatically moved to the DeadLetterQueue or deleted if it has been stored in the queue for longer than the specified time. This value is overwritten by a TTL specified on the message if and only if the message TTL is smaller than the TTL set on the queue. This value is immutable after the Queue has been created.
* @param {PTnHnMnS}           [optionsOrCallback.LockDuration]                                Determines the amount of time in seconds in which a message should be locked for processing by a receiver. After this period, the message is unlocked and available for consumption by the next receiver. Settable only at queue creation time.
* @param {bool}               [optionsOrCallback.RequiresSession]                             Settable only at queue creation time. If set to true, the queue will be session-aware and only SessionReceiver will be supported. Session-aware queues are not supported through REST.
* @param {bool}               [optionsOrCallback.RequiresDuplicateDetection]                  Settable only at queue creation time.
* @param {bool}               [optionsOrCallback.DeadLetteringOnMessageExpiration]            This field controls how the Service Bus handles a message whose TTL has expired. If it is enabled and a message expires, the Service Bus moves the message from the queue into the queue’s dead-letter sub-queue. If disabled, message will be permanently deleted from the queue. Settable only at queue creation time.
* @param {bool}               [optionsOrCallback.DuplicateDetectionHistoryTimeWindow]         Specifies the time span during which the Service Bus detects message duplication.
* @param {function(error, createqueueresult, response)} callback                              The callback function.
* @return {undefined}
*/
ServiceBusService.prototype.createQueue = function (queuePath, optionsOrCallback, callback) {
  validateQueueName(queuePath);

  this._createResource(queuePath, queueResult, null, optionsOrCallback, callback);
};

/**
* Creates a queue if it doesn't already exists.
*
* @param {string}             queuePath                                                       A string object that represents the name of the queue to delete.
* @param {object|function}    [optionsOrCallback]                                             The request options or callback function.
* @param {int}                [optionsOrCallback.MaxSizeInMegaBytes]                          Specifies the maximum queue size in megabytes. Any attempt to enqueue a message that will cause the queue to exceed this value will fail.
* @param {PTnHnMnS}           [optionsOrCallback.DefaultMessageTimeToLive]                    Depending on whether DeadLettering is enabled, a message is automatically moved to the DeadLetterQueue or deleted if it has been stored in the queue for longer than the specified time. This value is overwritten by a TTL specified on the message if and only if the message TTL is smaller than the TTL set on the queue. This value is immutable after the Queue has been created.
* @param {PTnHnMnS}           [optionsOrCallback.LockDuration]                                Determines the amount of time in seconds in which a message should be locked for processing by a receiver. After this period, the message is unlocked and available for consumption by the next receiver. Settable only at queue creation time.
* @param {bool}               [optionsOrCallback.RequiresSession]                             Settable only at queue creation time. If set to true, the queue will be session-aware and only SessionReceiver will be supported. Session-aware queues are not supported through REST.
* @param {bool}               [optionsOrCallback.RequiresDuplicateDetection]                  Settable only at queue creation time.
* @param {bool}               [optionsOrCallback.DeadLetteringOnMessageExpiration]            This field controls how the Service Bus handles a message whose TTL has expired. If it is enabled and a message expires, the Service Bus moves the message from the queue into the queue’s dead-letter sub-queue. If disabled, message will be permanently deleted from the queue. Settable only at queue creation time.
* @param {bool}               [optionsOrCallback.DuplicateDetectionHistoryTimeWindow]         Specifies the time span during which the Service Bus detects message duplication.
* @param {function(error, queueCreated, response)} callback                                   The callback function.
* @return {undefined}
*/
ServiceBusService.prototype.createQueueIfNotExists = function (queuePath, optionsOrCallback, callback) {
  var options = null;
  if (typeof optionsOrCallback === 'function' && !callback) {
    callback = optionsOrCallback;
  } else {
    options = optionsOrCallback;
  }

  validateQueueName(queuePath);
  validateCallback(callback);

  var queueXml = queueResult.serialize(options);

  var webResource = WebResource.put(queuePath)
    .withOkCode(HttpConstants.HttpResponseCodes.Conflict, true);

  webResource.addOptionalHeader(HeaderConstants.CONTENT_TYPE, 'application/atom+xml;type=entry;charset=utf-8');
  webResource.addOptionalHeader(HeaderConstants.CONTENT_LENGTH, Buffer.byteLength(queueXml, 'utf8'));

  var processResponseCallback = function (responseObject, next) {
    // Check if queue was actually created.
    if (!responseObject.error) {
      responseObject.created = (responseObject.response.statusCode === HttpConstants.HttpResponseCodes.Created);

      if (responseObject.response.statusCode === HttpConstants.HttpResponseCodes.Created || responseObject.response.statusCode === HttpConstants.HttpResponseCodes.Conflict) {
        // If it was created before, there was no actual error.
        responseObject.error = null;
      }
    }

    var finalCallback = function (returnObject) {
      callback(returnObject.error, returnObject.created, returnObject.response);
    };

    next(responseObject, finalCallback);
  };

  this.performRequest(webResource, queueXml, options, processResponseCallback);
};

/**
* Deletes a queue.
*
* @param {string}             queuePath                                           A string object that represents the name of the queue to delete.
* @param {function(error, response)} callback                                     The callback function.
* @return {undefined}
*/
ServiceBusService.prototype.deleteQueue = function (queuePath, callback) {
  validateQueueName(queuePath);
  validateCallback(callback);

  this._deleteResource(queuePath, callback);
};

/**
* Retrieves a queue.
*
* @param {string}             queuePath                                           A string object that represents the name of the queue to retrieve.
* @param {function(error, getqueueresult, response)} callback                     The callback function.
* @return {undefined}
*/
ServiceBusService.prototype.getQueue = function (queuePath, callback) {
  validateQueueName(queuePath);

  var validateResult = function (responseObject) {
    if (!responseObject.error && !(responseObject.response.body && responseObject.response.body.entry)) {
      responseObject.error = new Error();
      responseObject.error.code = Constants.ServiceBusErrorCodeStrings.QUEUE_NOT_FOUND;
      responseObject.error.details = 'Invalid Queue';

      return false;
    }

    return true;
  };

  this._getResource(queuePath, queueResult, [ validateResult ], callback);
};

/**
* Returns a list of queues.
*
* @param {object|function}    [optionsOrCallback]                                 The request options or callback function.
* @param {int}                [optionsOrCallback.top]                             The top clause for listing queues.
* @param {int}                [optionsOrCallback.skip]                            The skip clause for listing queues.
* @param {function(error, listqueuesresult, response)} callback                   The callback function.
* @return {undefined}
*/
ServiceBusService.prototype.listQueues = function (optionsOrCallback, callback) {
  this._listResources('/$Resources/Queues', queueResult, null, optionsOrCallback, callback);
};

/**
* Creates a topic.
*
* @param {TopicInfo}          topic                                                                 A Topic object that represents the topic to create.
* @param {object|function}    [optionsOrCallback]                                                   The request options or callback function.
* @param {int}                [optionsOrCallback.MaxSizeInMegabytes]                                Specifies the maximum topic size in megabytes. Any attempt to enqueue a message that will cause the topic to exceed this value will fail. All messages that are stored in the topic or any of its subscriptions count towards this value. Multiple copies of a message that reside in one or multiple subscriptions count as a single messages. For example, if message m exists once in subscription s1 and twice in subscription s2, m is counted as a single message.
* @param {PTnHnMnS}           [optionsOrCallback.DefaultMessageTimeToLive]                          Determines how long a message lives in the associated subscriptions. Subscriptions inherit the TTL from the topic unless they are created explicitly with a smaller TTL. Based on whether dead-lettering is enabled, a message whose TTL has expired will either be moved to the subscription’s associated DeadLtterQueue or will be permanently deleted.
* @param {bool}               [optionsOrCallback.RequiresDuplicateDetection]                        If enabled, the topic will detect duplicate messages within the time span specified by the DuplicateDetectionHistoryTimeWindow property. Settable only at topic creation time.
* @param {PTnHnMnS}           [optionsOrCallback.DuplicateDetectionHistoryTimeWindow]               Specifies the time span during which the Service Bus will detect message duplication.
* @param {bool}               [optionsOrCallback.EnableBatchedOperations]                           Specifies if batched operations should be allowed.
* @param {int}                [optionsOrCallback.SizeInBytes]                                       Specifies the topic size in bytes.
* @param {function(error, createtopicresult, response)} callback                                    The callback function.
* @return {undefined}
*/
ServiceBusService.prototype.createTopic = function (topic, optionsOrCallback, callback) {
  validateTopicName(topic);

  this._createResource(topic, topicResult, null, optionsOrCallback, callback);
};

/**
* Creates a topic if it doesn't exists.
*
* @param {TopicInfo}          topic                                                                 A Topic object that represents the topic to create.
* @param {object|function}    [optionsOrCallback]                                                   The request options or callback function.
* @param {int}                [optionsOrCallback.MaxSizeInMegabytes]                                Specifies the maximum topic size in megabytes. Any attempt to enqueue a message that will cause the topic to exceed this value will fail. All messages that are stored in the topic or any of its subscriptions count towards this value. Multiple copies of a message that reside in one or multiple subscriptions count as a single messages. For example, if message m exists once in subscription s1 and twice in subscription s2, m is counted as a single message.
* @param {PTnHnMnS}           [optionsOrCallback.DefaultMessageTimeToLive]                          Determines how long a message lives in the associated subscriptions. Subscriptions inherit the TTL from the topic unless they are created explicitly with a smaller TTL. Based on whether dead-lettering is enabled, a message whose TTL has expired will either be moved to the subscription’s associated DeadLtterQueue or will be permanently deleted.
* @param {bool}               [optionsOrCallback.RequiresDuplicateDetection]                        If enabled, the topic will detect duplicate messages within the time span specified by the DuplicateDetectionHistoryTimeWindow property. Settable only at topic creation time.
* @param {PTnHnMnS}           [optionsOrCallback.DuplicateDetectionHistoryTimeWindow]               Specifies the time span during which the Service Bus will detect message duplication.
* @param {int}                [optionsOrCallback.MaxSubscriptionsPerTopic]                          Specifies the maximum number of subscriptions that can be associated with the topic.
* @param {int}                [optionsOrCallback.MaxSqlFiltersPerTopic]                             Specifies the maximum number of SQL filter expressions (in total) that can be added to the subscriptions associated with the topic.
* @param {int}                [optionsOrCallback.MaxCorrelationFiltersPerTopic]                     Specifies the maximum number of correlation filter expressions (in total) that can be added to the subscriptions associated with the topic.
* @param {bool}               [optionsOrCallback.EnableDeadLetteringOnMessageExpiration]            Settable only at topic creation time.
* @param {bool}               [optionsOrCallback.EnableDeadLetteringOnFilterEvaluationExceptions]   Settable only at topic creation time.
* @param {function(error, topicCreated, response)} callback                                         The callback function.
* @return {undefined}
*/
ServiceBusService.prototype.createTopicIfNotExists = function (topic, optionsOrCallback, callback) {
  var options = null;
  if (typeof optionsOrCallback === 'function' && !callback) {
    callback = optionsOrCallback;
  } else {
    options = optionsOrCallback;
  }

  validateTopicName(topic);
  validateCallback(callback);

  var topicXml = topicResult.serialize(options);

  var webResource = WebResource.put(topic)
    .withOkCode(HttpConstants.HttpResponseCodes.Conflict, true);

  webResource.addOptionalHeader(HeaderConstants.CONTENT_TYPE, 'application/atom+xml;type=entry;charset=utf-8');
  webResource.addOptionalHeader(HeaderConstants.CONTENT_LENGTH, Buffer.byteLength(topicXml, 'utf8'));

  var processResponseCallback = function (responseObject, next) {
    if (responseObject.response) {
      // Check if topic was actually created.
      responseObject.created = (responseObject.response.statusCode === HttpConstants.HttpResponseCodes.Created);

      if (responseObject.response.statusCode === HttpConstants.HttpResponseCodes.Created || responseObject.response.statusCode === HttpConstants.HttpResponseCodes.Conflict) {
        // If it was created before, there was no actual error.
        responseObject.error = null;
      }
    }

    var finalCallback = function (returnObject) {
      callback(returnObject.error, returnObject.created, returnObject.response);
    };

    next(responseObject, finalCallback);
  };

  this.performRequest(webResource, topicXml, options, processResponseCallback);
};

/**
* Deletes a topic.
*
* @param {string}             topicPath                                           A <code>String</code> object that represents the name of the queue to delete.
* @param {function(error, response)} callback                                     The callback function.
* @return {undefined}
*/
ServiceBusService.prototype.deleteTopic = function (topicPath, callback) {
  validateTopicName(topicPath);
  validateCallback(callback);

  this._deleteResource(topicPath, callback);
};

/**
* Retrieves a topic.
*
* @param {string}             topicPath                                           A <code>String</code> object that represents the name of the topic to retrieve.
* @param {function(error, gettopicresult, response)} callback                     The callback function.
* @return {undefined}
*/
ServiceBusService.prototype.getTopic = function (topicPath, callback) {
  validateTopicName(topicPath);

  var validateResult = function (responseObject) {
    if (!responseObject.error && !(responseObject.response.body && responseObject.response.body.entry)) {
      responseObject.error = new Error();
      responseObject.error.code = Constants.ServiceBusErrorCodeStrings.TOPIC_NOT_FOUND;
      responseObject.error.details = 'Invalid Topic';

      return false;
    }

    return true;
  };

  this._getResource(topicPath, topicResult, [ validateResult ], callback);
};

/**
* Returns a list of topics.
*
* @param {object|function}    [optionsOrCallback]                                 The request options or callback function.
* @param {int}                [optionsOrCallback.top]                             The number of topics to fetch.
* @param {int}                [optionsOrCallback.skip]                            The number of topics to skip.
* @param {function(error, listtopicsresult, response)} callback                   The callback function.
* @return {undefined}
*/
ServiceBusService.prototype.listTopics = function (optionsOrCallback, callback) {
  this._listResources('/$Resources/Topics', topicResult, null, optionsOrCallback, callback);
};

/**
* Creates a subscription.
*
* @param {string}             topicPath                                                             A string object that represents the name of the topic for the subscription.
* @param {string}             subscriptionPath                                                      A string object that represents the name of the subscription.
* @param {object|function}    [optionsOrCallback]                                                   The request options or callback function.
* @param {PTnHnMnS}           [optionsOrCallback.LockDuration]                                      The default lock duration is applied to subscriptions that do not define a lock duration. Settable only at subscription creation time.
* @param {bool}               [optionsOrCallback.RequiresSession]                                   Settable only at subscription creation time. If set to true, the subscription will be session-aware and only SessionReceiver will be supported. Session-aware subscription are not supported through REST.
* @param {PTnHnMnS}           [optionsOrCallback.DefaultMessageTimeToLive]                          Determines how long a message lives in the subscription. Based on whether dead-lettering is enabled, a message whose TTL has expired will either be moved to the subscription’s associated DeadLtterQueue or permanently deleted.
* @param {bool}               [optionsOrCallback.EnableDeadLetteringOnMessageExpiration]            This field controls how the Service Bus handles a message whose TTL has expired. If it is enabled and a message expires, the Service Bus moves the message from the queue into the subscription’s dead-letter sub-queue. If disabled, message will be permanently deleted from the subscription’s main queue. Settable only at subscription creation time.
* @param {bool}               [optionsOrCallback.EnableDeadLetteringOnFilterEvaluationExceptions]   Determines how the Service Bus handles a message that causes an exception during a subscription’s filter evaluation. If the value is set to true, the message that caused the exception will be moved to the subscription’s dead-letter queue. Otherwise, it will be discarded. By default this parameter is set to true, allowing the user a chance to investigate the cause of the exception. It can occur from a malformed message or some incorrect assumptions being made in the filter about the form of the message. Settable only at topic creation time.
* @param {function(error, createsubscriptionresult, response)} callback                             The callback function.
* @return {undefined}
*/
ServiceBusService.prototype.createSubscription = function (topicPath, subscriptionPath, optionsOrCallback, callback) {
  validateTopicName(topicPath);
  validateSubscriptionName(subscriptionPath);

  var subscriptionFullPath = createSubscriptionPath(topicPath, subscriptionPath);
  this._createResource(subscriptionFullPath, subscriptionResult, null, optionsOrCallback, callback);
};

/**
* Deletes a subscription.
*
* @param {string}             topicPath                                           A string object that represents the name of the topic for the subscription.
* @param {string}             subscriptionPath                                    A string object that represents the name of the subscription to delete.
* @param {function(error, response)} callback                                     The callback function.
* @return {undefined}
*/
ServiceBusService.prototype.deleteSubscription = function (topicPath, subscriptionPath, callback) {
  validateTopicName(topicPath);
  validateSubscriptionName(subscriptionPath);
  validateCallback(callback);

  var subscriptionFullPath = createSubscriptionPath(topicPath, subscriptionPath);
  this._deleteResource(subscriptionFullPath, callback);
};

/**
* Retrieves a subscription.
*
* @param {string}             topicPath                                           A string object that represents the name of the topic for the subscription.
* @param {string}             subscriptionPath                                    A string object that represents the name of the subscription to retrieve.
* @param {function(error, getsubscriptionresult, response)} callback              The callback function.
* @return {undefined}
*/
ServiceBusService.prototype.getSubscription = function (topicPath, subscriptionPath, callback) {
  validateTopicName(topicPath);
  validateSubscriptionName(subscriptionPath);

  var subscriptionFullPath = createSubscriptionPath(topicPath, subscriptionPath);

  var validateResult = function (responseObject) {
    if (!responseObject.error && !(responseObject.response.body && responseObject.response.body.entry)) {
      responseObject.error = new Error();
      responseObject.error.code = Constants.ServiceBusErrorCodeStrings.SUBSCRIPTION_NOT_FOUND;
      responseObject.error.details = 'Invalid Subscription';

      return false;
    }

    return true;
  };

  this._getResource(subscriptionFullPath, subscriptionResult, [ validateResult ], callback);
};

/**
* Returns a list of subscriptions.
*
* @param {string}             topicPath                                           A string object that represents the name of the topic for the subscriptions to retrieve.
* @param {object|function}    [optionsOrCallback]                                 The request options or callback function.
* @param {int}                [optionsOrCallback.top]                             The number of topics to fetch.
* @param {int}                [optionsOrCallback.skip]                            The number of topics to skip.
* @param {function(error, listsubscriptionsresult, response)} callback            The callback function.
* @return {undefined}
*/
ServiceBusService.prototype.listSubscriptions = function (topicPath, optionsOrCallback, callback) {
  validateTopicName(topicPath);

  var path = topicPath + '/Subscriptions/';
  var validateResult = function (responseObject) {
    if (!responseObject.error && !(responseObject.response.body && responseObject.response.body.feed.id.indexOf(path) !== -1)) {
      responseObject.error = new Error();
      responseObject.error.code = Constants.ServiceBusErrorCodeStrings.TOPIC_NOT_FOUND;
      responseObject.error.details = 'Invalid Topic';

      return false;
    }

    return true;
  };

  this._listResources(path, subscriptionResult, [ validateResult ], optionsOrCallback, callback);
};

/**
* Creates a rule.
*
* @param {string}             topicPath                                                 A string object that represents the name of the topic for the subscription.
* @param {string}             subscriptionPath                                          A string object that represents the name of the subscription for which the rule will be created.
* @param {string}             rulePath                                                  A string object that represents the name of the rule to be created.
* @param {object|function}    [optionsOrCallback]                                       The request options or callback function.
* @param {string}             [optionsOrCallback.trueFilter]                            Defines the expression that the rule evaluates as a true filter.
* @param {string}             [optionsOrCallback.falseFilter]                           Defines the expression that the rule evaluates as a false filter.
* @param {string}             [optionsOrCallback.sqlExpressionFilter]                   Defines the expression that the rule evaluates. The expression string is interpreted as a SQL92 expression which must evaluate to True or False. Only one between a correlation and a sql expression can be defined.
* @param {string}             [optionsOrCallback.correlationIdFilter]                   Defines the expression that the rule evaluates. Only the messages whose CorrelationId match the CorrelationId set in the filter expression are allowed. Only one between a correlation and a sql expression can be defined.
* @param {string}             [optionsOrCallback.sqlRuleAction]                         Defines the expression that the rule evaluates. If the rule is of type SQL, the expression string is interpreted as a SQL92 expression which must evaluate to True or False. If the rule is of type CorrelationFilterExpression then only the messages whose CorrelationId match the CorrelationId set in the filter expression are allowed.
* @param {function(error, createruleresult, response)} callback                         The callback function.
* @return {undefined}
*/
ServiceBusService.prototype.createRule = function (topicPath, subscriptionPath, rulePath, optionsOrCallback, callback) {
  validateTopicName(topicPath);
  validateSubscriptionName(subscriptionPath);
  validateRuleName(rulePath);

  var ruleFullPath = createRulePath(topicPath, subscriptionPath, rulePath);
  this._createResource(ruleFullPath, ruleResult, null, optionsOrCallback, callback);
};

/**
* Deletes a rule.
*
* @param {string}             topicPath                                           A string object that represents the name of the topic for the subscription.
* @param {string}             subscriptionPath                                    A string object that represents the name of the subscription for which the rule will be deleted.
* @param {string}             rulePath                                            A string object that represents the name of the rule to delete.
* @param {function(error, response)} callback                                     The callback function.
* @return {undefined}
*/
ServiceBusService.prototype.deleteRule = function (topicPath, subscriptionPath, rulePath, callback) {
  validateTopicName(topicPath);
  validateSubscriptionName(subscriptionPath);
  validateRuleName(rulePath);

  var ruleFullPath = createRulePath(topicPath, subscriptionPath, rulePath);
  this._deleteResource(ruleFullPath, callback);
};

/**
* Retrieves a rule.
*
* @param {string}             topicPath                                           A string object that represents the name of the topic for the subscription.
* @param {string}             subscriptionPath                                    A string object that represents the name of the subscription for which the rule will be retrieved.
* @param {string}             rulePath                                            A string object that represents the name of the rule to retrieve.
* @param {function(error, getruleresult, response)} callback                      The callback function.
* @return {undefined}
*/
ServiceBusService.prototype.getRule = function (topicPath, subscriptionPath, rulePath, callback) {
  validateTopicName(topicPath);
  validateSubscriptionName(subscriptionPath);
  validateRuleName(rulePath);

  var ruleFullPath = createRulePath(topicPath, subscriptionPath, rulePath);

  var validateResult = function (responseObject) {
    if (!responseObject.error && !(responseObject.response.body && responseObject.response.body.entry)) {
      responseObject.error = new Error();
      responseObject.error.code = Constants.ServiceBusErrorCodeStrings.RULE_NOT_FOUND;
      responseObject.error.details = 'Invalid Rule';

      return false;
    }

    return true;
  };

  this._getResource(ruleFullPath, ruleResult, [ validateResult ], callback);
};

/**
* Returns a list of rules.
*
* @param {string}             topicPath                                           A string object that represents the name of the topic for the subscription.
* @param {string}             subscriptionPath                                    A string object that represents the name of the subscription whose rules are being retrieved.
* @param {object|function}    [optionsOrCallback]                                 The request options or callback function.
* @param {int}                [optionsOrCallback.top]                             The number of topics to fetch.
* @param {int}                [optionsOrCallback.skip]                            The number of topics to skip.
* @param {function(error, listrulesresult, response)} callback                    The callback function.
* @return {undefined}
*/
ServiceBusService.prototype.listRules = function (topicPath, subscriptionPath, optionsOrCallback, callback) {
  validateTopicName(topicPath);
  validateSubscriptionName(subscriptionPath);

  var rulesFullPath = createSubscriptionPath(topicPath, subscriptionPath) + '/Rules/';

  var validateResult = function (responseObject) {
    if (!responseObject.error && !(responseObject.response.body && responseObject.response.body.feed.id.indexOf(rulesFullPath) !== -1)) {
      responseObject.error = new Error();
      responseObject.error.code = Constants.ServiceBusErrorCodeStrings.SUBSCRIPTION_NOT_FOUND;
      responseObject.error.details = 'Invalid Subscription';

      return false;
    }

    return true;
  };

  this._listResources(rulesFullPath, ruleResult, [ validateResult ], optionsOrCallback, callback);
};

/**
* Creates a notification hub.
*
* @param {string}             hubPath                             A string object that represents the name of the notification hub.
* @param {object|function}    [optionsOrCallback]                 The request options or callback function.
* @param {object}             [optionsOrCallback.wns]             An object with the key value pairs for the WNS credentials.
* @param {object}             [optionsOrCallback.apns]            An object with the key value pairs for the APNS credentials.
* @param {function(error, result, response)} callback             The callback function.
* @return {undefined}
*/
ServiceBusService.prototype.createNotificationHub = function (hubPath, optionsOrCallback, callback) {
  validateHubName(hubPath);

  this._createResource(hubPath, notificationHubResult, null, optionsOrCallback, callback);
};

/**
* Gets a notification hub.
*
* @param {string}             hubPath                  A string object that represents the name of the notification hub.
* @param {function(error, result, response)} callback  The callback function.
* @return {undefined}
*/
ServiceBusService.prototype.getNotificationHub = function (hubPath, callback) {
  validateHubName(hubPath);

  var validateResult = function (responseObject) {
    if (!responseObject.error && !(responseObject.response.body && responseObject.response.body.entry)) {
      responseObject.error = new Error();
      responseObject.error.code = Constants.ServiceBusErrorCodeStrings.NOTIFICATION_HUB_NOT_FOUND;
      responseObject.error.details = 'Invalid Notification Hub';

      return false;
    }

    return true;
  };


  this._getResource(hubPath, notificationHubResult, [ validateResult ], callback);
};

/**
* Returns a list of notification hubs.
*
* @param {object|function}    [optionsOrCallback]       The request options or callback function.
* @param {int}                [optionsOrCallback.top]   The number of topics to fetch.
* @param {int}                [optionsOrCallback.skip]  The number of topics to skip.
* @param {function(error, result, response)} callback   The callback function.
* @return {undefined}
*/
ServiceBusService.prototype.listNotificationHubs = function (optionsOrCallback, callback) {
  this._listResources('/$Resources/NotificationHubs', notificationHubResult, null, optionsOrCallback, callback);
};

/**
* Deletes a notification hub.
*
* @param {string}             hubPath          A string object that represents the name of the notification hub.
* @param {function(error, response)} callback  The callback function.
* @return {undefined}
*/
ServiceBusService.prototype.deleteNotificationHub = function (hubPath, callback) {
  validateHubName(hubPath);

  this._deleteResource(hubPath, callback);
};

module.exports = ServiceBusService;