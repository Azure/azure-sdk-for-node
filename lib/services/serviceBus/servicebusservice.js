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
var url = require('url');

var azureutil = require('../../util/util');
var RFC1123 = require('../../util/rfc1123date');

var ServiceClient = require('../core/serviceclient');
var ServiceBusServiceClient = require('../core/servicebusserviceclient');

var WebResource = require('../../http/webresource');
var Constants = require('../../util/constants');
var QueryStringConstants = Constants.QueryStringConstants;
var HttpConstants = Constants.HttpConstants;
var HeaderConstants = Constants.HeaderConstants;

var ServiceBusSettings = require('../core/servicebussettings');

var QueueResult = require('./models/queueresult');
var QueueMessageResult = require('./models/queuemessageresult');
var TopicResult = require('./models/topicresult');
var SubscriptionResult = require('./models/subscriptionresult');
var RuleResult = require('./models/ruleresult');

// Expose 'ServiceBusService'.
exports = module.exports = ServiceBusService;

/**
* Creates a new ServiceBusService object.
*
* @constructor
* @augments {ServiceClient}
*
* @param {string} [namespaceOrConnectionString]  The service bus namespace or the connection string.
* @param {string} [accessKey]                    The password.
* @param {string} [issuer]                       The issuer.
* @param {string} [acsNamespace]                 The acs namespace. Usually the same as the sb namespace with "-sb" suffix.
* @param {string} [host]                         The host address.
* @param {object} [authenticationProvider]       The authentication provider.
*/
function ServiceBusService(namespaceOrConnectionString, accessKey, issuer, acsNamespace, host, authenticationProvider) {
  var serviceBusSettings;
  if (namespaceOrConnectionString && !accessKey) {
    // If namespaceOrConnectionString was passed and no accessKey was passed, assume connection string
    serviceBusSettings = ServiceBusSettings.createFromConnectionString(namespaceOrConnectionString);
  } else {
    if (!namespaceOrConnectionString) {
      namespaceOrConnectionString = process.env[ServiceClient.EnvironmentVariables.AZURE_SERVICEBUS_NAMESPACE];
    }

    if (!accessKey) {
      accessKey = process.env[ServiceClient.EnvironmentVariables.AZURE_SERVICEBUS_ACCESS_KEY];
    }

    if (!issuer) {
      issuer = process.env[ServiceClient.EnvironmentVariables.AZURE_SERVICEBUS_ISSUER];

      if (!issuer) {
        issuer = ServiceClient.DEFAULT_SERVICEBUS_ISSUER;
      }
    }

    if (!acsNamespace) {
      acsNamespace = process.env[ServiceClient.EnvironmentVariables.AZURE_WRAP_NAMESPACE];

      if (!acsNamespace) {
        acsNamespace = namespaceOrConnectionString + ServiceClient.DEFAULT_WRAP_NAMESPACE_SUFFIX;
      }
    }

    var endpoint = url.format({ protocol: 'https:', port: 443, hostname: namespaceOrConnectionString + '.' + ServiceClient.CLOUD_SERVICEBUS_HOST });
    var stsendpoint = url.format({ protocol: 'https:', port: 443, hostname: acsNamespace + '.' + ServiceClient.CLOUD_ACCESS_CONTROL_HOST });

    if (host) {
      endpoint = url.format(ServiceClient._parseHost(host));
    }

    var settings = { 
      endpoint: endpoint,
      sharedsecretissuer: issuer,
      sharedsecretvalue: accessKey,
      stsendpoint: stsendpoint
    };

    serviceBusSettings = ServiceBusSettings.createFromSettings(settings);
  }

  ServiceBusService.super_.call(this,
    serviceBusSettings._wrapPassword,
    serviceBusSettings._wrapName,
    serviceBusSettings._serviceBusEndpointUri,
    serviceBusSettings._wrapEndpointUri,
    authenticationProvider);
}

util.inherits(ServiceBusService, ServiceBusServiceClient);

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
    .withOkCode(HttpConstants.HttpResponseCodes.OK_CODE, true)
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
    .withOkCode(HttpConstants.HttpResponseCodes.OK_CODE, true)
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
      .withOkCode(HttpConstants.HttpResponseCodes.NO_CONTENT_CODE, true)
      .withRawResponse();
  } else {
    webResource = WebResource.del(path + '/Messages/Head')
      .withOkCode(HttpConstants.HttpResponseCodes.OK_CODE, true)
      .withRawResponse();
  }

  if (options && options.timeoutIntervalInS) {
    webResource.addOptionalQueryParam(QueryStringConstants.TIMEOUT, options.timeoutIntervalInS);
  }

  var processResponseCallback = function (responseObject, next) {
    if (responseObject.response &&
        responseObject.response.statusCode === HttpConstants.HttpResponseCodes.NO_CONTENT_CODE) {
      responseObject.error = 'No messages to receive';
    } else if (!responseObject.error) {
      responseObject.message = QueueMessageResult.parse(responseObject.response);
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
  var options = null;
  if (typeof optionsOrCallback === 'function' && !callback) {
    callback = optionsOrCallback;
  } else {
    options = optionsOrCallback;
  }

  validateQueueName(queuePath);
  validateCallback(callback);

  var queueXml = QueueResult.serialize(queuePath, options);

  var webResource = WebResource.put(queuePath);
  webResource.addOptionalHeader(HeaderConstants.CONTENT_TYPE, 'application/atom+xml;type=entry;charset=utf-8');
  webResource.addOptionalHeader(HeaderConstants.CONTENT_LENGTH, Buffer.byteLength(queueXml, 'utf8'));

  var processResponseCallback = function (responseObject, next) {
    if (!responseObject.error) {
      responseObject.queue = QueueResult.parse(responseObject.response.body);
    }

    var finalCallback = function (returnObject) {
      callback(returnObject.error, responseObject.queue, returnObject.response);
    };

    next(responseObject, finalCallback);
  };

  this.performRequest(webResource, queueXml, options, processResponseCallback);
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

  var queueXml = QueueResult.serialize(queuePath, options);

  var webResource = WebResource.put(queuePath)
    .withOkCode(HttpConstants.HttpResponseCodes.CONFLICT_CODE, true);

  webResource.addOptionalHeader(HeaderConstants.CONTENT_TYPE, 'application/atom+xml;type=entry;charset=utf-8');
  webResource.addOptionalHeader(HeaderConstants.CONTENT_LENGTH, Buffer.byteLength(queueXml, 'utf8'));

  var processResponseCallback = function (responseObject, next) {
    // Check if queue was actually created.
    responseObject.created = (responseObject.response.statusCode === HttpConstants.HttpResponseCodes.CREATED_CODE);

    if (responseObject.response.statusCode === HttpConstants.HttpResponseCodes.CREATED_CODE || responseObject.response.statusCode === HttpConstants.HttpResponseCodes.CONFLICT_CODE) {
      // If it was created before, there was no actual error.
      responseObject.error = null;
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

  var webResource = WebResource.del(queuePath)
    .withOkCode(HttpConstants.HttpResponseCodes.OK_CODE);

  var processResponseCallback = function (responseObject, next) {
    var finalCallback = function (returnObject) {
      callback(returnObject.error, returnObject.response);
    };

    next(responseObject, finalCallback);
  };

  this.performRequest(webResource, null, null, processResponseCallback);
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
  validateCallback(callback);

  var webResource = WebResource.get(queuePath);

  var processResponseCallback = function (responseObject, next) {
    if (!responseObject.error) {
      var queue = QueueResult.parse(responseObject.response.body);
      if (queue.QueueName !== queuePath) {
        responseObject.error = {
          code: Constants.ServiceBusErrorCodeStrings.QUEUE_NOT_FOUND,
          details: 'Invalid Queue'
        };
      } else {
        responseObject.queue = queue;
      }
    }

    var finalCallback = function (returnObject) {
      callback(returnObject.error, responseObject.queue, returnObject.response);
    };

    next(responseObject, finalCallback);
  };

  this.performRequest(webResource, null, null, processResponseCallback);
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
  var options = null;
  if (typeof optionsOrCallback === 'function' && !callback) {
    callback = optionsOrCallback;
  } else {
    options = optionsOrCallback;
  }

  validateCallback(callback);

  var webResource = WebResource.get('/$Resources/Queues');
  if (options) {
    webResource.addOptionalQueryParam(QueryStringConstants.TOP, options.top);
    webResource.addOptionalQueryParam(QueryStringConstants.SKIP, options.skip);
  }

  var processResponseCallback = function (responseObject, next) {
    responseObject.listQueueResult = null;

    if (!responseObject.error) {
      responseObject.listQueueResult = [];

      if (responseObject.response.body.entry) {
        var queues = [];
        if (responseObject.response.body.entry) {
          queues = responseObject.response.body.entry;
          if (!Array.isArray(queues)) {
            queues = [queues];
          }
        }

        queues.forEach(function (currentQueue) {
          var queueResult = QueueResult.parse(currentQueue);
          responseObject.listQueueResult.push(queueResult);
        });
      }
    }

    var finalCallback = function (returnObject) {
      callback(returnObject.error, responseObject.listQueueResult, returnObject.response);
    };

    next(responseObject, finalCallback);
  };

  this.performRequest(webResource, null, options, processResponseCallback);
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
  var options = null;
  if (typeof optionsOrCallback === 'function' && !callback) {
    callback = optionsOrCallback;
  } else {
    options = optionsOrCallback;
  }

  validateTopicName(topic);
  validateCallback(callback);

  var topicXml = TopicResult.serialize(topic, options);

  var webResource = WebResource.put(topic);
  webResource.addOptionalHeader(HeaderConstants.CONTENT_TYPE, 'application/atom+xml;type=entry;charset=utf-8');
  webResource.addOptionalHeader(HeaderConstants.CONTENT_LENGTH, Buffer.byteLength(topicXml, 'utf8'));

  var processResponseCallback = function (responseObject, next) {
    if (!responseObject.error) {
      responseObject.topic = TopicResult.parse(responseObject.response.body);
    }

    var finalCallback = function (returnObject) {
      callback(returnObject.error, responseObject.topic, returnObject.response);
    };

    next(responseObject, finalCallback);
  };

  this.performRequest(webResource, topicXml, options, processResponseCallback);
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

  var topicXml = TopicResult.serialize(topic, options);

  var webResource = WebResource.put(topic)
    .withOkCode(HttpConstants.HttpResponseCodes.CONFLICT_CODE, true);

  webResource.addOptionalHeader(HeaderConstants.CONTENT_TYPE, 'application/atom+xml;type=entry;charset=utf-8');
  webResource.addOptionalHeader(HeaderConstants.CONTENT_LENGTH, Buffer.byteLength(topicXml, 'utf8'));

  var processResponseCallback = function (responseObject, next) {
    if (responseObject.response) {
      // Check if topic was actually created.
      responseObject.created = (responseObject.response.statusCode === HttpConstants.HttpResponseCodes.CREATED_CODE);

      if (responseObject.response.statusCode === HttpConstants.HttpResponseCodes.CREATED_CODE || responseObject.response.statusCode === HttpConstants.HttpResponseCodes.CONFLICT_CODE) {
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

  var webResource = WebResource.del(topicPath)
    .withOkCode(HttpConstants.HttpResponseCodes.OK_CODE);

  var processResponseCallback = function (responseObject, next) {
    var finalCallback = function (returnObject) {
      callback(returnObject.error, returnObject.response);
    };

    next(responseObject, finalCallback);
  };

  this.performRequest(webResource, null, null, processResponseCallback);
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
  validateCallback(callback);

  var webResource = WebResource.get(topicPath);

  var processResponseCallback = function (responseObject, next) {
    if (!responseObject.error) {
      var topic = TopicResult.parse(responseObject.response.body);
      if (topic.TopicName !== topicPath) {
        responseObject.error = {
          code: Constants.ServiceBusErrorCodeStrings.TOPIC_NOT_FOUND,
          details: 'Invalid Topic'
        };
      } else {
        responseObject.topic = topic;
      }
    }

    var finalCallback = function (returnObject) {
      callback(returnObject.error, responseObject.topic, returnObject.response);
    };

    next(responseObject, finalCallback);
  };

  this.performRequest(webResource, null, null, processResponseCallback);
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
  var options = null;
  if (typeof optionsOrCallback === 'function' && !callback) {
    callback = optionsOrCallback;
  } else {
    options = optionsOrCallback;
  }

  validateCallback(callback);

  var webResource = WebResource.get('/$Resources/Topics');
  if (options) {
    webResource.addOptionalQueryParam(QueryStringConstants.TOP, options.top);
    webResource.addOptionalQueryParam(QueryStringConstants.SKIP, options.skip);
  }

  var processResponseCallback = function (responseObject, next) {
    responseObject.listTopicResult = null;

    if (!responseObject.error) {
      responseObject.listTopicResult = [];

      if (responseObject.response.body.entry) {
        var topics = [];
        if (responseObject.response.body.entry) {
          topics = responseObject.response.body.entry;
          if (!Array.isArray(topics)) {
            topics = [topics];
          }
        }

        topics.forEach(function (currentTopic) {
          var topicResult = TopicResult.parse(currentTopic);
          responseObject.listTopicResult.push(topicResult);
        });
      }
    }

    var finalCallback = function (returnObject) {
      callback(returnObject.error, responseObject.listTopicResult, returnObject.response);
    };

    next(responseObject, finalCallback);
  };

  this.performRequest(webResource, null, options, processResponseCallback);
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
  var options = null;
  if (typeof optionsOrCallback === 'function' && !callback) {
    callback = optionsOrCallback;
  } else {
    options = optionsOrCallback;
  }

  validateTopicName(topicPath);
  validateSubscriptionName(subscriptionPath);
  validateCallback(callback);

  var subscriptionFullPath = createSubscriptionPath(topicPath, subscriptionPath);
  var subscriptionXml = SubscriptionResult.serialize(subscriptionFullPath, options);

  var webResource = WebResource.put(subscriptionFullPath);
  webResource.addOptionalHeader(HeaderConstants.CONTENT_TYPE, 'application/atom+xml;type=entry;charset=utf-8');
  webResource.addOptionalHeader(HeaderConstants.CONTENT_LENGTH, Buffer.byteLength(subscriptionXml, 'utf8'));

  var processResponseCallback = function (responseObject, next) {
    if (!responseObject.error) {
      responseObject.subscription = SubscriptionResult.parse(responseObject.response.body);
    }

    var finalCallback = function (returnObject) {
      callback(returnObject.error, responseObject.subscription, returnObject.response);
    };

    next(responseObject, finalCallback);
  };

  this.performRequest(webResource, subscriptionXml, options, processResponseCallback);
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
  var webResource = WebResource.del(subscriptionFullPath)
    .withOkCode(HttpConstants.HttpResponseCodes.OK_CODE);

  var processResponseCallback = function (responseObject, next) {
    var finalCallback = function (returnObject) {
      callback(returnObject.error, returnObject.response);
    };

    next(responseObject, finalCallback);
  };

  this.performRequest(webResource, null, null, processResponseCallback);
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
  validateCallback(callback);

  var subscriptionFullPath = createSubscriptionPath(topicPath, subscriptionPath);

  var webResource = WebResource.get(subscriptionFullPath);

  var processResponseCallback = function (responseObject, next) {
    if (!responseObject.error) {
      var subscription = SubscriptionResult.parse(responseObject.response.body);
      if (subscription.SubscriptionName !== subscriptionPath) {
        responseObject.error = {
          code: Constants.ServiceBusErrorCodeStrings.SUBSCRIPTION_NOT_FOUND,
          details: 'Invalid Subscription'
        };
      } else {
        responseObject.subscription = subscription;
      }
    }

    var finalCallback = function (returnObject) {
      callback(returnObject.error, responseObject.subscription, returnObject.response);
    };

    next(responseObject, finalCallback);
  };

  this.performRequest(webResource, null, null, processResponseCallback);
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
  var options = null;
  if (typeof optionsOrCallback === 'function' && !callback) {
    callback = optionsOrCallback;
  } else {
    options = optionsOrCallback;
  }

  validateTopicName(topicPath);
  validateCallback(callback);

  var webResource = WebResource.get(topicPath + '/Subscriptions/');
  if (options) {
    webResource.addOptionalQueryParam(QueryStringConstants.TOP, options.top);
    webResource.addOptionalQueryParam(QueryStringConstants.SKIP, options.skip);
  }

  var processResponseCallback = function (responseObject, next) {
    responseObject.listSubscriptionResult = null;

    if (!responseObject.error) {
      if (responseObject.response.body.id.indexOf(topicPath + '/Subscriptions/') === -1) {
        responseObject.error = {
          code: Constants.ServiceBusErrorCodeStrings.TOPIC_NOT_FOUND,
          details: 'Invalid Topic'
        };
      } else {
        responseObject.listSubscriptionResult = [];

        if (responseObject.response.body.entry) {
          var subscription = [];
          if (responseObject.response.body.entry) {
            subscription = responseObject.response.body.entry;
            if (!Array.isArray(subscription)) {
              subscription = [subscription];
            }
          }

          subscription.forEach(function (currentSubscription) {
            var subscriptionResult = SubscriptionResult.parse(currentSubscription);
            responseObject.listSubscriptionResult.push(subscriptionResult);
          });
        }
      }
    }

    var finalCallback = function (returnObject) {
      callback(returnObject.error, responseObject.listSubscriptionResult, returnObject.response);
    };

    next(responseObject, finalCallback);
  };

  this.performRequest(webResource, null, null, processResponseCallback);
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
  var options = null;
  if (typeof optionsOrCallback === 'function' && !callback) {
    callback = optionsOrCallback;
  } else {
    options = optionsOrCallback;
  }

  validateTopicName(topicPath);
  validateSubscriptionName(subscriptionPath);
  validateRuleName(rulePath);
  validateCallback(callback);

  var ruleFullPath = createRulePath(topicPath, subscriptionPath, rulePath);
  var ruleXml = RuleResult.serialize(rulePath, ruleFullPath, options);

  var webResource = WebResource.put(ruleFullPath);
  webResource.addOptionalHeader(HeaderConstants.CONTENT_TYPE, 'application/atom+xml;type=entry;charset=utf-8');
  webResource.addOptionalHeader(HeaderConstants.CONTENT_LENGTH, Buffer.byteLength(ruleXml, 'utf8'));

  var processResponseCallback = function (responseObject, next) {
    if (!responseObject.error) {
      responseObject.rule = RuleResult.parse(responseObject.response.body);
    }

    var finalCallback = function (returnObject) {
      callback(returnObject.error, responseObject.rule, returnObject.response);
    };

    next(responseObject, finalCallback);
  };

  this.performRequest(webResource, ruleXml, options, processResponseCallback);
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
  validateCallback(callback);

  var ruleFullPath = createRulePath(topicPath, subscriptionPath, rulePath);
  var webResource = WebResource.del(ruleFullPath)
    .withOkCode(HttpConstants.HttpResponseCodes.OK_CODE);

  var processResponseCallback = function (responseObject, next) {
    var finalCallback = function (returnObject) {
      callback(returnObject.error, returnObject.response);
    };

    next(responseObject, finalCallback);
  };

  this.performRequest(webResource, null, null, processResponseCallback);
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
  validateCallback(callback);

  var ruleFullPath = createRulePath(topicPath, subscriptionPath, rulePath);
  var webResource = WebResource.get(ruleFullPath);

  var processResponseCallback = function (responseObject, next) {
    if (!responseObject.error) {
      var rule = RuleResult.parse(responseObject.response.body);
      if (rule.RuleName !== rulePath) {
        responseObject.error = {
          code: Constants.ServiceBusErrorCodeStrings.RULE_NOT_FOUND,
          details: 'Invalid Rule'
        };
      } else {
        responseObject.rule = rule;
      }
    }

    var finalCallback = function (returnObject) {
      callback(returnObject.error, responseObject.subscription, returnObject.response);
    };

    next(responseObject, finalCallback);
  };

  this.performRequest(webResource, null, null, processResponseCallback);
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
  var options = null;
  if (typeof optionsOrCallback === 'function' && !callback) {
    callback = optionsOrCallback;
  } else {
    options = optionsOrCallback;
  }

  validateTopicName(topicPath);
  validateSubscriptionName(subscriptionPath);
  validateCallback(callback);

  var subscriptionFullPath = createSubscriptionPath(topicPath, subscriptionPath);
  var webResource = WebResource.get(subscriptionFullPath + '/Rules/');

  if (options) {
    webResource.addOptionalQueryParam(QueryStringConstants.TOP, options.top);
    webResource.addOptionalQueryParam(QueryStringConstants.SKIP, options.skip);
  }

  var processResponseCallback = function (responseObject, next) {
    responseObject.listRulesResult = null;

    if (!responseObject.error) {
      if (responseObject.response.body.id.indexOf(subscriptionFullPath + '/Rules/') === -1) {
        responseObject.error = {
          code: Constants.ServiceBusErrorCodeStrings.SUBSCRIPTION_NOT_FOUND,
          details: 'Invalid Subscription'
        };
      } else {
        responseObject.listRulesResult = [];

        if (responseObject.response.body.entry) {
          var rules = [];
          if (responseObject.response.body.entry) {
            rules = responseObject.response.body.entry;
            if (!Array.isArray(rules)) {
              rules = [rules];
            }
          }

          rules.forEach(function (currentRule) {
            var ruleResult = RuleResult.parse(currentRule);
            responseObject.listRulesResult.push(ruleResult);
          });
        }
      }
    }

    var finalCallback = function (returnObject) {
      callback(returnObject.error, responseObject.listRulesResult, returnObject.response);
    };

    next(responseObject, finalCallback);
  };

  this.performRequest(webResource, null, null, processResponseCallback);
};

function setRequestHeaders(webResource, message) {
  for (var property in message) {
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
          var value = message.customProperties[customProperty];
          if (azureutil.objectIsString(value)) {
            value = "\"" + value.toString() + "\"";
          } else if (azureutil.stringIsDate(value)) {
            value = "\"" + RFC1123.format(value) + "\"";
          } else {
            value = value.toString();
          }

          webResource.addOptionalHeader(customProperty, value);
        }
        break;
      default:
        break;
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