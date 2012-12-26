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

var StorageServiceClient = require('../core/storageserviceclient');
var ServiceClient = require('../core/serviceclient');
var SharedKey = require('../blob/sharedkey');
var WebResource = require('../../http/webresource');
var Constants = require('../../util/constants');
var QueryStringConstants = Constants.QueryStringConstants;
var HttpConstants = Constants.HttpConstants;
var HeaderConstants = Constants.HeaderConstants;

// Models requires
var ListQueuesResultContinuation = require('./models/listqueuesresultcontinuation');
var QueueResult = require('./models/queueresult');
var QueueMessageResult = require('./models/queuemessageresult');
var ServicePropertiesResult = require('./models/servicepropertiesresult');

// Expose 'QueueService'.
exports = module.exports = QueueService;

/**
* Creates a new QueueService object.
* If no storageAccount or storageAccessKey are provided, the AZURE_STORAGE_ACCOUNT and AZURE_STORAGE_ACCESS_KEY 
* environment variables will be used.
*
* @constructor
* @augments {ServiceClient}
*
* @param {string} [storageAccountOrConnectionString]  The storage account or the connection string.
* @param {string} [storageAccessKey]                  The storage access key.
* @param {string} [host]                              The host address.
* @param {object} [authenticationProvider]            The authentication provider.
*/
function QueueService(storageAccountOrConnectionString, storageAccessKey, host, authenticationProvider) {
  var storageServiceSettings = StorageServiceClient.getStorageSettings(storageAccountOrConnectionString, storageAccessKey, host);

  QueueService.super_.call(this,
    storageServiceSettings._name,
    storageServiceSettings._key,
    storageServiceSettings._queueEndpointUri,
    storageServiceSettings._usePathStyleUri,
    authenticationProvider);

  if (!this.authenticationProvider) {
    this.authenticationProvider = new SharedKey(this.storageAccount, this.storageAccessKey, this.usePathStyleUri);
  }
}

util.inherits(QueueService, StorageServiceClient);

/**
* Gets the properties of a storage account’s Queue service, including Windows Azure Storage Analytics.
*
* @this {BlobService}
* @param {object|function}    [optionsOrCallback]                        The request options or callback function.
* @param {int}                [optionsOrCallback.timeoutIntervalInMs]    The timeout interval, in milliseconds, to use for the request.
* @param {function(error, servicePropertiesResult, response)}  callback  The callback function.
* @return {undefined}
*/
QueueService.prototype.getServiceProperties = function (optionsOrCallback, callback) {
  var options = null;
  if (typeof optionsOrCallback === 'function' && !callback) {
    callback = optionsOrCallback;
  } else {
    options = optionsOrCallback;
  }

  validateCallback(callback);

  var webResource = WebResource.get();
  webResource.addOptionalQueryParam(QueryStringConstants.COMP, 'properties');
  webResource.addOptionalQueryParam(QueryStringConstants.RESTYPE, 'service');

  var processResponseCallback = function (responseObject, next) {
    responseObject.servicePropertiesResult = null;
    if (!responseObject.error) {
      responseObject.servicePropertiesResult = ServicePropertiesResult.parse(responseObject.response.body.StorageServiceProperties);
    }

    var finalCallback = function (returnObject) {
      callback(returnObject.error, returnObject.servicePropertiesResult, returnObject.response);
    };

    next(responseObject, finalCallback);
  };

  this.performRequest(webResource, null, options, processResponseCallback);
};

/**
* Sets the properties of a storage account’s Queue service, including Windows Azure Storage Analytics.
* You can also use this operation to set the default request version for all incoming requests that do not have a version specified.
*
* @this {BlobService}
* @param {object}             serviceProperties                        The service properties.
* @param {object|function}    [optionsOrCallback]                      The request options or callback function.
* @param {int}                [optionsOrCallback.timeoutIntervalInMs]  The timeout interval, in milliseconds, to use for the request.
* @param {function(error, response)}  callback                         The callback function.
* @return {undefined}
*/
QueueService.prototype.setServiceProperties = function (serviceProperties, optionsOrCallback, callback) {
  var options = null;
  if (typeof optionsOrCallback === 'function' && !callback) {
    callback = optionsOrCallback;
  } else {
    options = optionsOrCallback;
  }

  validateCallback(callback);

  var servicePropertiesXml = ServicePropertiesResult.serialize(serviceProperties);

  var webResource = WebResource.put().withOkCode(HttpConstants.HttpResponseCodes.ACCEPTED_CODE);
  webResource.addOptionalQueryParam(QueryStringConstants.COMP, 'properties');
  webResource.addOptionalQueryParam(QueryStringConstants.RESTYPE, 'service');

  webResource.addOptionalHeader(HeaderConstants.CONTENT_TYPE, 'application/xml;charset="utf-8"');
  webResource.addOptionalHeader(HeaderConstants.CONTENT_LENGTH, Buffer.byteLength(servicePropertiesXml));

  var processResponseCallback = function (responseObject, next) {
    var finalCallback = function (returnObject) {
      callback(returnObject.error, returnObject.response);
    };

    next(responseObject, finalCallback);
  };

  this.performRequest(webResource, servicePropertiesXml, options, processResponseCallback);
};

/**
* Lists all queues under the given account.
*
* @this {QueueService}
* @param {object|function}    [optionsOrCallback]                         The listing and request options.
* @param {string}             [optionsOrCallback.prefix]                  Filters the results to return only queues whose name begins with the specified prefix.
* @param {string}             [optionsOrCallback.marker]                  String value that identifies the portion of the list to be returned with the next list operation.
* @param {int}                [optionsOrCallback.maxresults]              Specifies the maximum number of queues to return per call to Azure storage. This does NOT affect list size returned by this function. (maximum: 5000)
* @param {string}             [optionsOrCallback.include]                 Include this parameter to specify that the queue's metadata be returned as part of the response body. (allowed values: '', 'metadata')
* @param {int}                [optionsOrCallback.timeoutIntervalInMs]     The timeout interval, in milliseconds, to use for the request.
* @param {function(error, queueResults, nextMarker, response)}  callback  The callback function.
* @return {undefined}
*/
QueueService.prototype.listQueues = function (optionsOrCallback, callback) {
  var options = null;
  if (typeof optionsOrCallback === 'function' && !callback) {
    callback = optionsOrCallback;
  } else {
    options = optionsOrCallback;
  }

  validateCallback(callback);

  var webResource = WebResource.get();
  webResource.addOptionalQueryParam(QueryStringConstants.COMP, 'list');
  webResource.addOptionalQueryParams(options,
    QueryStringConstants.PREFIX,
    QueryStringConstants.MARKER,
    QueryStringConstants.MAX_RESULTS,
    QueryStringConstants.INCLUDE);

  var self = this;
  var processResponseCallback = function (responseObject, next) {
    responseObject.listQueueResult = null;
    responseObject.listQueueResultContinuation = null;

    if (!responseObject.error) {
      responseObject.listQueueResult = [];

      if (responseObject.response.body.EnumerationResults.Queues && responseObject.response.body.EnumerationResults.Queues[0].Queue) {
        var queues = responseObject.response.body.EnumerationResults.Queues[0].Queue;

        queues.forEach(function (currentQueue) {
          var queueResult = QueueResult.parse(currentQueue);
          responseObject.listQueueResult.push(queueResult);
        });

        responseObject.listQueueResultContinuation = new ListQueuesResultContinuation(self, options, responseObject.response.body.EnumerationResults.NextMarker[0]);
      }
    }

    var finalCallback = function (returnObject) {
      callback(returnObject.error, returnObject.listQueueResult, returnObject.listQueueResultContinuation, returnObject.response);
    };

    next(responseObject, finalCallback);
  };

  this.performRequest(webResource, null, options, processResponseCallback);
};

/**
* Creates a new queue under the given account.
*
* @this {QueueService}
* @param {string}             queue                                       The queue name.
* @param {object|function}    [optionsOrCallback]                         The create and request options.
* @param {object}             [optionsOrCallback.metadata]                The metadata key/value pairs.
* @param {int}                [optionsOrCallback.timeoutIntervalInMs]     The timeout interval, in milliseconds, to use for the request.
* @param {function(error, queueResult, response)}  callback               The callback function.
* @return {undefined}
*/
QueueService.prototype.createQueue = function (queue, optionsOrCallback, callback) {
  var options = null;
  if (typeof optionsOrCallback === 'function' && !callback) {
    callback = optionsOrCallback;
  } else {
    options = optionsOrCallback;
  }

  validateQueueName(queue);
  validateCallback(callback);

  var webResource = WebResource.put(queue);
  if (options) {
    webResource.addOptionalMetadataHeaders(options.metadata);
  }

  var processResponseCallback = function (responseObject, next) {
    responseObject.queueResult = null;
    if (!responseObject.error) {
      responseObject.queueResult = new QueueResult(queue);
      if (options && options.metadata) {
        responseObject.queueResult.metadata = options.metadata;
      }
    }

    var finalCallback = function (returnObject) {
      callback(returnObject.error, returnObject.queueResult, returnObject.response);
    };

    next(responseObject, finalCallback);
  };

  this.performRequest(webResource, null, options, processResponseCallback);
};

/**
* Creates a new queue under the given account if it doesn't exist.
*
* @this {QueueService}
* @param {string}             queue                                       The queue name.
* @param {object|function}    [optionsOrCallback]                         The create and request options.
* @param {object}             [optionsOrCallback.metadata]                The metadata key/value pairs.
* @param {int}                [optionsOrCallback.timeoutIntervalInMs]     The timeout interval, in milliseconds, to use for the request.
* @param {function(error, queueCreated, response)}  callback              The callback function.
* @return {undefined}
*/
QueueService.prototype.createQueueIfNotExists = function (queue, optionsOrCallback, callback) {
  var options = null;
  if (typeof optionsOrCallback === 'function' && !callback) {
    callback = optionsOrCallback;
  } else {
    options = optionsOrCallback;
  }

  validateQueueName(queue);
  validateCallback(callback);

  // Create WebResource specifying an additional ok code for the already created scenario.
  var webResource = WebResource.put(queue)
    .withOkCode(HttpConstants.HttpResponseCodes.NO_CONTENT_CODE, true);

  if (options) {
    webResource.addOptionalMetadataHeaders(options.metadata);
  }

  var processResponseCallback = function (responseObject, next) {
    // Check if queue was actually created.
    responseObject.created = (responseObject.response.statusCode === HttpConstants.HttpResponseCodes.CREATED_CODE);

    if (responseObject.response.statusCode === HttpConstants.HttpResponseCodes.CREATED_CODE || responseObject.response.statusCode === HttpConstants.HttpResponseCodes.NO_CONTENT_CODE) {
      // If it was created before, there was no actual error.
      responseObject.error = null;
    }

    var finalCallback = function (returnObject) {
      callback(returnObject.error, returnObject.created, returnObject.response);
    };

    next(responseObject, finalCallback);
  };

  this.performRequest(webResource, null, options, processResponseCallback);
};

/**
* Permanently deletes the specified queue.
*
* @this {QueueService}
* @param {string}             queue                                       The queue name.
* @param {object|function}    [optionsOrCallback]                         The delete and request options.
* @param {int}                [optionsOrCallback.timeoutIntervalInMs]     The timeout interval, in milliseconds, to use for the request.
* @param {function(error, deleted, response)}  callback                   The callback function.
* @return {undefined}
*/
QueueService.prototype.deleteQueue = function (queue, optionsOrCallback, callback) {
  var options = null;
  if (typeof optionsOrCallback === 'function' && !callback) {
    callback = optionsOrCallback;
  } else {
    options = optionsOrCallback;
  }

  validateQueueName(queue);
  validateCallback(callback);

  var webResource = WebResource.del(queue);
  var processResponseCallback = function (responseObject, next) {
    var finalCallback = function (returnObject) {
      callback(returnObject.error, returnObject.response.isSuccessful, returnObject.response);
    };

    next(responseObject, finalCallback);
  };

  this.performRequest(webResource, null, options, processResponseCallback);
};

/**
* Returns queue properties, including user-defined metadata.
*
* @this {QueueService}
* @param {string}             queue                                       The queue name.
* @param {object|function}    [optionsOrCallback]                         The get and request options.
* @param {int}                [optionsOrCallback.timeoutIntervalInMs]     The timeout interval, in milliseconds, to use for the request.
* @param {function(error, queueResult, response)}  callback               The callback function.
* @return {undefined}
*/
QueueService.prototype.getQueueMetadata = function (queue, optionsOrCallback, callback) {
  var options = null;
  if (typeof optionsOrCallback === 'function' && !callback) {
    callback = optionsOrCallback;
  } else {
    options = optionsOrCallback;
  }

  validateQueueName(queue);
  validateCallback(callback);

  var webResource = WebResource.get(queue);
  webResource.addOptionalQueryParam(QueryStringConstants.COMP, 'metadata');

  var self = this;
  var processResponseCallback = function (responseObject, next) {
    responseObject.queueResult = null;
    if (!responseObject.error) {
      responseObject.queueResult = new QueueResult(queue);
      responseObject.queueResult.metadata = self.parseMetadataHeaders(responseObject.response.headers);
      responseObject.queueResult.getPropertiesFromHeaders(responseObject.response.headers);
    }

    var finalCallback = function (returnObject) {
      callback(returnObject.error, returnObject.queueResult, returnObject.response);
    };

    next(responseObject, finalCallback);
  };

  this.performRequest(webResource, null, options, processResponseCallback);
};

/**
* Sets user-defined metadata on the specified queue. Metadata is associated with the queue as name-value pairs.
*
* @this {QueueService}
* @param {string}             queue                                       The queue name.
* @param {object}             metadata                                    The metadata key/value pairs.
* @param {object|function}    [optionsOrCallback]                         The set and request options.
* @param {int}                [optionsOrCallback.timeoutIntervalInMs]     The timeout interval, in milliseconds, to use for the request.
* @param {function(error, queueResult, response)}  callback               The callback function.
* @return {undefined}
*/
QueueService.prototype.setQueueMetadata = function (queue, metadata, optionsOrCallback, callback) {
  var options = null;
  if (typeof optionsOrCallback === 'function' && !callback) {
    callback = optionsOrCallback;
  } else {
    options = optionsOrCallback;
  }

  validateQueueName(queue);
  validateCallback(callback);

  var webResource = WebResource.put(queue).withOkCode(HttpConstants.HttpResponseCodes.NO_CONTENT_CODE);
  webResource.addOptionalQueryParam(QueryStringConstants.COMP, 'metadata');
  webResource.addOptionalMetadataHeaders(metadata);

  var processResponseCallback = function (responseObject, next) {
    responseObject.queueResult = null;
    if (!responseObject.error) {
      responseObject.queueResult = new QueueResult(queue, metadata);
      responseObject.queueResult.getPropertiesFromHeaders(responseObject.response.headers);
    }

    var finalCallback = function (returnObject) {
      callback(returnObject.error, returnObject.queueResult, returnObject.response);
    };

    next(responseObject, finalCallback);
  };

  this.performRequest(webResource, null, options, processResponseCallback);
};

/**
* Adds a new message to the back of the message queue. A visibility timeout can also be specified to make the message
* invisible until the visibility timeout expires. A message must be in a format that can be included in an XML request
* with UTF-8 encoding. The encoded message can be up to 64KB in size for versions 2011-08-18 and newer, or 8KB in size
* for previous versions.
*
* @this {QueueService}
* @param {string}             queue                                       The queue name.
* @param {object}             messageText                                 The message text.
* @param {object|function}    [optionsOrCallback]                         The put and request options.
* @param {int}                [optionsOrCallback.messagettl]              The time-to-live interval for the message, in seconds. The maximum time-to-live allowed is 7 days. If this parameter is omitted, the default time-to-live is 7 days
* @param {int}                [optionsOrCallback.visibilitytimeout]       Specifies the new visibility timeout value, in seconds, relative to server time. The new value must be larger than or equal to 0, and cannot be larger than 7 days. The visibility timeout of a message cannot be set to a value later than the expiry time. visibilitytimeout should be set to a value smaller than the time-to-live value.
* @param {int}                [optionsOrCallback.timeoutIntervalInMs]     The timeout interval, in milliseconds, to use for the request.
* @param {function(error, queueMessageResult, response)}  callback        The callback function.
* @return {undefined}
*/
QueueService.prototype.createMessage = function (queue, messageText, optionsOrCallback, callback) {
  var options = null;
  if (typeof optionsOrCallback === 'function' && !callback) {
    callback = optionsOrCallback;
  } else {
    options = optionsOrCallback;
  }

  validateQueueName(queue);
  validateCallback(callback);

  var xmlMessageDescriptor = QueueMessageResult.serialize(messageText);

  var webResource = WebResource.post(queue + '/messages');

  webResource.addOptionalHeader(HeaderConstants.CONTENT_TYPE, 'application/atom+xml;charset="utf-8"');
  webResource.addOptionalHeader(HeaderConstants.CONTENT_LENGTH, Buffer.byteLength(xmlMessageDescriptor, 'utf8'));

  webResource.addOptionalQueryParams(options, QueryStringConstants.MESSAGE_TTL, QueryStringConstants.VISIBILITY_TIMEOUT);

  var processResponseCallback = function (responseObject, next) {
    responseObject.queueMessageResult = null;
    if (!responseObject.error) {
      responseObject.queueMessageResult = new QueueMessageResult(queue);
      responseObject.queueMessageResult.getPropertiesFromHeaders(responseObject.response.headers);
    }

    var finalCallback = function (returnObject) {
      callback(returnObject.error, returnObject.queueMessageResult, returnObject.response);
    };

    next(responseObject, finalCallback);
  };

  this.performRequest(webResource, xmlMessageDescriptor, options, processResponseCallback);
};

/**
* Retrieves a message from the queue and makes it invisible to other consumers.
*
* @this {QueueService}
* @param {string}             queue                                       The queue name.
* @param {object|function}    [optionsOrCallback]                         The get and request options.
* @param {int}                [optionsOrCallback.numofmessages]           A nonzero integer value that specifies the number of messages to retrieve from the queue, up to a maximum of 32. By default, a single message is retrieved from the queue with this operation.
* @param {bool}               [optionsOrCallback.peekonly]                Boolean value indicating wether the visibility of the message should be changed or not.
* @param {int}                [optionsOrCallback.visibilitytimeout]       Required if not peek only. Specifies the new visibility timeout value, in seconds, relative to server time. The new value must be larger than or equal to 0, and cannot be larger than 7 days. The visibility timeout of a message can be set to a value later than the expiry time.
* @param {int}                [optionsOrCallback.timeoutIntervalInMs]     The timeout interval, in milliseconds, to use for the request.
* @param {function(error, queueMessageResults, response)}  callback       The callback function.
* @return {undefined}
*/
QueueService.prototype.getMessages = function (queue, optionsOrCallback, callback) {
  var options = null;
  if (typeof optionsOrCallback === 'function' && !callback) {
    callback = optionsOrCallback;
  } else {
    options = optionsOrCallback;
  }

  validateCallback(callback);

  var webResource = WebResource.get(queue + '/messages');
  webResource.addOptionalQueryParams(options, QueryStringConstants.NUM_OF_MESSAGES, QueryStringConstants.VISIBILITY_TIMEOUT);
  if (options) {
    webResource.addOptionalQueryParam(QueryStringConstants.PEEK_ONLY, options[QueryStringConstants.PEEK_ONLY]);
  }

  var processResponseCallback = function (responseObject, next) {
    responseObject.queueMessageResults = null;

    if (!responseObject.error) {
      responseObject.queueMessageResults = [];

      if (responseObject.response.body.QueueMessagesList && responseObject.response.body.QueueMessagesList.QueueMessage) {
        var messages = responseObject.response.body.QueueMessagesList.QueueMessage;

        messages.forEach(function (message) {
          var queueMessageResult = QueueMessageResult.parse(message);
          responseObject.queueMessageResults.push(queueMessageResult);
        });
      }
    }

    var finalCallback = function (returnObject) {
      callback(returnObject.error, returnObject.queueMessageResults, returnObject.response);
    };

    next(responseObject, finalCallback);
  };

  this.performRequest(webResource, null, options, processResponseCallback);
};

/**
* Retrieves a message from the front of the queue, without changing the message visibility.
*
* @this {QueueService}
* @param {string}             queue                                       The queue name.
* @param {object|function}    [optionsOrCallback]                         The peek and request options.
* @param {int}                [optionsOrCallback.numofmessages]           A nonzero integer value that specifies the number of messages to retrieve from the queue, up to a maximum of 32. By default, a single message is retrieved from the queue with this operation.
* @param {int}                [optionsOrCallback.timeoutIntervalInMs]     The timeout interval, in milliseconds, to use for the request.
* @param {function(error, queueMessageResults, response)}  callback       The callback function.
* @return {undefined}
*/
QueueService.prototype.peekMessages = function (queue, optionsOrCallback, callback) {
  var options = null;
  if (typeof optionsOrCallback === 'function' && !callback) {
    callback = optionsOrCallback;
  } else {
    options = optionsOrCallback;
  }

  if (!options) {
    options = {};
  }

  if (!options[QueryStringConstants.NUM_OF_MESSAGES]) {
    options[QueryStringConstants.NUM_OF_MESSAGES] = 1;
  }

  options[QueryStringConstants.PEEK_ONLY] = true;
  this.getMessages(queue, options, callback);
};

/**
* Deletes a specified message from the queue.
*
* @this {QueueService}
* @param {string}             queue                                       The queue name.
* @param {string}             messageid                                   The message identifier of the message to delete.
* @param {string}             popreceipt                                  A valid pop receipt value returned from an earlier call to the Get Messages or Update Message operation
* @param {object|function}    [optionsOrCallback]                         The delete and request options.
* @param {int}                [optionsOrCallback.timeoutIntervalInMs]     The timeout interval, in milliseconds, to use for the request.
* @param {function(error, successful, response)}  callback                The callback function.
* @return {undefined}
*/
QueueService.prototype.deleteMessage = function (queue, messageid, popreceipt, optionsOrCallback, callback) {
  var options = null;
  if (typeof optionsOrCallback === 'function' && !callback) {
    callback = optionsOrCallback;
  } else {
    options = optionsOrCallback;
  }

  validateQueueName(queue);
  validateCallback(callback);

  if (!popreceipt) {
    throw new Error("A message retrieved using 'peekMessages' can not be deleted! Use 'getMessages' instead.");
  }

  var webResource = WebResource.del(queue + '/messages/' + messageid);
  webResource.addOptionalQueryParam(QueryStringConstants.POP_RECEIPT, popreceipt, null, true);

  var processResponseCallback = function (responseObject, next) {
    var finalCallback = function (returnObject) {
      callback(returnObject.error, returnObject.response.isSuccessful, returnObject.response);
    };

    next(responseObject, finalCallback);
  };

  this.performRequest(webResource, null, options, processResponseCallback);
};

/**
* Clears all messages from the queue.
*
* @this {QueueService}
* @param {string}             queue                                       The queue name.
* @param {object|function}    [optionsOrCallback]                         The delete and request options.
* @param {int}                [optionsOrCallback.timeoutIntervalInMs]     The timeout interval, in milliseconds, to use for the request.
* @param {function(error, response)}  callback                            The callback function.
* @return {undefined}
*/
QueueService.prototype.clearMessages = function (queue, optionsOrCallback, callback) {
  var options = null;
  if (typeof optionsOrCallback === 'function' && !callback) {
    callback = optionsOrCallback;
  } else {
    options = optionsOrCallback;
  }

  validateQueueName(queue);
  validateCallback(callback);

  var webResource = WebResource.del(queue + '/messages');

  var processResponseCallback = function (responseObject, next) {
    var finalCallback = function (returnObject) {
      callback(returnObject.error, returnObject.response);
    };

    next(responseObject, finalCallback);
  };

  this.performRequest(webResource, null, options, processResponseCallback);
};

/**
* Updates the visibility timeout of a message. You can also use this operation to update the contents of a message.
* A message must be in a format that can be included in an XML request with UTF-8 encoding, and the encoded message can be up to 64KB in size.
*
* @this {QueueService}
* @param {string}             queue                                       The queue name.
* @param {string}             messageid                                   The message identifier of the message to update.
* @param {string}             popreceipt                                  A valid pop receipt value returned from an earlier call to the Get Messages or Update Message operation
* @param {int}                visibilitytimeout                           Specifies the new visibility timeout value, in seconds, relative to server time. The new value must be larger than or equal to 0, and cannot be larger than 7 days. The visibility timeout of a message can be set to a value later than the expiry time.
* @param {object|function}    [optionsOrCallback]                         The delete and request options.
* @param {object|function}    [optionsOrCallback.messagetext]             The new message text.
* @param {int}                [optionsOrCallback.timeoutIntervalInMs]     The timeout interval, in milliseconds, to use for the request.
* @param {function(error, queueMessageResult, response)}  callback        The callback function.
* @return {undefined}
*/
QueueService.prototype.updateMessage = function (queue, messageid, popreceipt, visibilitytimeout, optionsOrCallback, callback) {
  var options = null;
  if (typeof optionsOrCallback === 'function' && !callback) {
    callback = optionsOrCallback;
  } else {
    options = optionsOrCallback;
  }

  validateQueueName(queue);
  validateCallback(callback);

  var content = null;
  if (options && options.messagetext) {
    content = QueueMessageResult.serialize(options.messagetext);
  }

  var webResource = WebResource.put(queue + '/messages/' + messageid).withOkCode(HttpConstants.HttpResponseCodes.NO_CONTENT_CODE);

  webResource.addOptionalHeader(HeaderConstants.CONTENT_TYPE, 'application/atom+xml;charset="utf-8"');
  webResource.addOptionalHeader(HeaderConstants.CONTENT_LENGTH, Buffer.byteLength(content, 'utf8'));

  webResource.addOptionalQueryParam(QueryStringConstants.POP_RECEIPT, popreceipt, null, true);
  webResource.addOptionalQueryParam(QueryStringConstants.VISIBILITY_TIMEOUT, visibilitytimeout);

  var processResponseCallback = function (responseObject, next) {
    responseObject.queueMessageResult = null;
    if (!responseObject.error) {
      responseObject.queueMessageResult = new QueueMessageResult(queue, messageid);
      responseObject.queueMessageResult.getPropertiesFromHeaders(responseObject.response.headers);
    }

    var finalCallback = function (returnObject) {
      callback(returnObject.error, returnObject.queueMessageResult, returnObject.response);
    };

    next(responseObject, finalCallback);
  };

  this.performRequest(webResource, content, options, processResponseCallback);
};

// Non-module methods

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

  if (queue === '$root') {
    return;
  }

  // Caps aren't allowed by the REST API
  if (queue.match('^[a-z0-9][a-z0-9-]*$') === null) {
    throw new Error('Incorrect queue name format.');
  }

  if (queue.indexOf('--') !== -1) {
    throw new Error('Incorrect queue name format.');
  }

  if (queue.length < 3 || queue.length > 63) {
    throw new Error('Incorrect queue name format.');
  }

  if (queue.substr(queue.length - 1, 1) === '-') {
    throw new Error('Incorrect queue name format.');
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