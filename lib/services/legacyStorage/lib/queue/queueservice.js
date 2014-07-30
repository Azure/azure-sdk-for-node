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

// Module dependencies.
var util = require('util');
var _ = require('underscore');

var azureCommon = require('azure-common');
var azureutil = azureCommon.util;
var validate = azureCommon.validate;

var StorageServiceClient = azureCommon.StorageServiceClient;
var SharedKey = require('../blob/internal/sharedkey');
var WebResource = azureCommon.WebResource;
var Constants = azureCommon.Constants;
var QueryStringConstants = Constants.QueryStringConstants;
var HttpConstants = Constants.HttpConstants;
var HeaderConstants = Constants.HeaderConstants;

// Models requires
var ListQueuesResultContinuation = require('./models/listqueuesresultcontinuation');
var QueueResult = require('./models/queueresult');
var QueueMessageResult = require('./models/queuemessageresult');
var servicePropertiesResult = require('./models/servicepropertiesresult');

/**
* Creates a new QueueService object.
* If no storageAccount or storageAccessKey are provided, the AZURE_STORAGE_ACCOUNT and AZURE_STORAGE_ACCESS_KEY
* environment variables will be used.
* @class
* The QueueService class is used to perform operations on the Microsoft Azure Queue Service.
* 
* For more information on using the Queue Service, as well as task focused information on using it from a Node.js application, see
* [How to Use the Queue Service from Node.js](https://www.windowsazure.com/en-us/develop/nodejs/how-to-guides/queue-service/).
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

  QueueService['super_'].call(this,
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
* Gets the properties of a storage account’s Queue service, including Microsoft Azure Storage Analytics.
*
* @this {BlobService}
* @param {object}             [options]                        The request options.
* @param {int}                [options.timeoutIntervalInMs]    The timeout interval, in milliseconds, to use for the request.
* @param {Function(error, servicePropertiesResult, response)}  callback  `error` will contain information
*                                                                      if an error occurs; otherwise, `serviceProperties`
*                                                                      will contain the properties and `response`
*                                                                      will contain information related to this operation.
*/
QueueService.prototype.getServiceProperties = function (optionsOrCallback, callback) {
  var options;
  azureutil.normalizeArgs(optionsOrCallback, callback, function (o, c) { options = o; callback = c; });

  validate.validateArgs('getServiceProperties', function (v) {
    v.callback(callback);
  });

  var webResource = WebResource.get()
    .withQueryOption(QueryStringConstants.COMP, 'properties')
    .withQueryOption(QueryStringConstants.RESTYPE, 'service');

  var processResponseCallback = function (responseObject, next) {
    responseObject.servicePropertiesResult = null;
    if (!responseObject.error) {
      responseObject.servicePropertiesResult = servicePropertiesResult.parse(responseObject.response.body.StorageServiceProperties);
    }

    var finalCallback = function (returnObject) {
      callback(returnObject.error, returnObject.servicePropertiesResult, returnObject.response);
    };

    next(responseObject, finalCallback);
  };

  this.performRequest(webResource, null, options, processResponseCallback);
};

/**
* Sets the properties of a storage account’s Queue service, including Microsoft Azure Storage Analytics.
* You can also use this operation to set the default request version for all incoming requests that do not have a version specified.
*
* @this {BlobService}
* @param {object}             serviceProperties                        The service properties.
* @param {object}             [options]                                The request options.
* @param {int}                [options.timeoutIntervalInMs]            The timeout interval, in milliseconds, to use for the request.
* @param {Function(error, response)}  callback                         `error` will contain information
*                                                                      if an error occurs; otherwise, `response`
*                                                                      will contain information related to this operation.
*/
QueueService.prototype.setServiceProperties = function (serviceProperties, optionsOrCallback, callback) {
  var options;
  azureutil.normalizeArgs(optionsOrCallback, callback, function (o, c) { options = o; callback = c; });

  validate.validateArgs('setServiceProperties', function (v) {
    v.callback(callback);
  });

  var servicePropertiesXml = servicePropertiesResult.serialize(serviceProperties);

  var webResource = WebResource.put()
    .withQueryOption(QueryStringConstants.COMP, 'properties')
    .withQueryOption(QueryStringConstants.RESTYPE, 'service')
    .withHeader(HeaderConstants.CONTENT_TYPE, 'application/xml;charset="utf-8"')
    .withHeader(HeaderConstants.CONTENT_LENGTH, Buffer.byteLength(servicePropertiesXml))
    .withBody(servicePropertiesXml);

  var processResponseCallback = function (responseObject, next) {
    var finalCallback = function (returnObject) {
      callback(returnObject.error, returnObject.response);
    };

    next(responseObject, finalCallback);
  };

  this.performRequest(webResource, webResource.body, options, processResponseCallback);
};

/**
* Lists all queues under the given account.
*
* @this {QueueService}
* @param {object}             [options]                         The listing and request options.
* @param {string}             [options.prefix]                  Filters the results to return only queues whose name begins with the specified prefix.
* @param {string}             [options.marker]                  String value that identifies the portion of the list to be returned with the next list operation.
* @param {int}                [options.maxresults]              Specifies the maximum number of queues to return per call to Azure storage. This does NOT affect list size returned by this function. (maximum: 5000)
* @param {string}             [options.include]                 Include this parameter to specify that the queue's metadata be returned as part of the response body. (allowed values: '', 'metadata')
* @param {int}                [options.timeoutIntervalInMs]     The timeout interval, in milliseconds, to use for the request.
* @param {Function(error, queueResults, nextMarker, response)}  callback  `error` will contain information
*                                                                         if an error occurs; otherwise `queueResults` will contain a list of
*                                                                         queue objects,
*                                                                         and `response` will contain information related to this operation.
*                                                                         If not all queue information could be retrieved,
*                                                                         `nextMarker` will contain a value that can be used
*                                                                         to retrieve the next section of the queue list.
*/
QueueService.prototype.listQueues = function (optionsOrCallback, callback) {
  var options;
  azureutil.normalizeArgs(optionsOrCallback, callback, function (o, c) { options = o; callback = c; });

  validate.validateArgs('listQueues', function (v) {
    v.callback(callback);
  });

  var webResource = WebResource.get();
  webResource.withQueryOption(QueryStringConstants.COMP, 'list');
  webResource.withQueryOptions(options,
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

      if (responseObject.response.body.EnumerationResults.Queues && responseObject.response.body.EnumerationResults.Queues.Queue) {
        var queues = responseObject.response.body.EnumerationResults.Queues.Queue;

        if (!_.isArray(queues)) {
          queues = [ queues ];
        }

        queues.forEach(function (currentQueue) {
          var queueResult = QueueResult.parse(currentQueue);
          responseObject.listQueueResult.push(queueResult);
        });

        responseObject.listQueueResultContinuation = new ListQueuesResultContinuation(self, options, responseObject.response.body.EnumerationResults.NextMarker);
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
* @param {object}             [options]                         The create and request options.
* @param {object}             [options.metadata]                The metadata key/value pairs.
* @param {int}                [options.timeoutIntervalInMs]     The timeout interval, in milliseconds, to use for the request.
* @param {function(error, queueResult, response)}  callback     `error` will contain information
*                                                               if an error occurs; otherwise `queueResult` will contain
*                                                               the queue information.
*                                                               `response` will contain information related to this operation.
*/
QueueService.prototype.createQueue = function (queue, optionsOrCallback, callback) {
  var options;
  azureutil.normalizeArgs(optionsOrCallback, callback, function (o, c) { options = o; callback = c; });

  validate.validateArgs('createQueue', function (v) {
    v.string(queue, 'queue');
    v.queueNameIsValid(queue);
    v.callback(callback);
  });

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
* @param {object}             [options]                         The create and request options.
* @param {object}             [options.metadata]                The metadata key/value pairs.
* @param {int}                [options.timeoutIntervalInMs]     The timeout interval, in milliseconds, to use for the request.
* @param {Function(error, queueCreated, response)}  callback    `error` will contain information
*                                                               if an error occurs; otherwise `queueCreated` will contain
*                                                               the queue information.
*                                                               `response` will contain information related to this operation.
*
* @example
* var azure = require('azure');
* var queueService = azure.createQueueService();
* queueService.createQueueIfNotExists('taskqueue', function(error) {
*   if(!error) {
*     // Queue created or exists
*   }
* }); 
*/
QueueService.prototype.createQueueIfNotExists = function (queue, optionsOrCallback, callback) {
  var options;
  azureutil.normalizeArgs(optionsOrCallback, callback, function (o, c) { options = o; callback = c; });

  validate.validateArgs('createQueueIfNotExists', function (v) {
    v.string(queue, 'queue');
    v.queueNameIsValid(queue);
    v.callback(callback);
  });

  // Create WebResource specifying an additional ok code for the already created scenario.
  var webResource = WebResource.put(queue);

  if (options) {
    webResource.addOptionalMetadataHeaders(options.metadata);
  }

  var processResponseCallback = function (responseObject, next) {
    if (responseObject.response) {
      // Check if queue was actually created.
      responseObject.created = (responseObject.response.statusCode === HttpConstants.HttpResponseCodes.Created);

      if (responseObject.response.statusCode === HttpConstants.HttpResponseCodes.Created || responseObject.response.statusCode === HttpConstants.HttpResponseCodes.NoContent) {
        // If it was created before, there was no actual error.
        responseObject.error = null;
      }
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
* @param {object}             [options]                         The delete and request options.
* @param {int}                [options.timeoutIntervalInMs]     The timeout interval, in milliseconds, to use for the request.
* @param {Function(error, deleted, response)}  callback         `error` will contain information
*                                                               if an error occurs; otherwise `deleted` will contain
*                                                               `true` if the operation was successful.
*                                                               `response` will contain information related to this operation.
*/
QueueService.prototype.deleteQueue = function (queue, optionsOrCallback, callback) {
  var options;
  azureutil.normalizeArgs(optionsOrCallback, callback, function (o, c) { options = o; callback = c; });

  validate.validateArgs('deleteQueue', function (v) {
    v.string(queue, 'queue');
    v.queueNameIsValid(queue);
    v.callback(callback);
  });

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
* @param {object}             [options]                         The get and request options.
* @param {int}                [options.timeoutIntervalInMs]     The timeout interval, in milliseconds, to use for the request.
* @param {Function(error, queueResult, response)}  callback     `error` will contain information
*                                                               if an error occurs; otherwise `queueResult` will contain
*                                                               the queue information.
*                                                               `response` will contain information related to this operation.
*/
QueueService.prototype.getQueueMetadata = function (queue, optionsOrCallback, callback) {
  var options;
  azureutil.normalizeArgs(optionsOrCallback, callback, function (o, c) { options = o; callback = c; });

  validate.validateArgs('getQueueMetadata', function (v) {
    v.string(queue, 'queue');
    v.queueNameIsValid(queue);
    v.callback(callback);
  });

  var webResource = WebResource.get(queue)
    .withQueryOption(QueryStringConstants.COMP, 'metadata');

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
* @param {object}             [options]                         The set and request options.
* @param {int}                [options.timeoutIntervalInMs]     The timeout interval, in milliseconds, to use for the request.
* @param {Function(error, queueResult, response)}  callback     `error` will contain information
*                                                               if an error occurs; otherwise `queueResult` will contain
*                                                               the queue information.
*                                                               `response` will contain information related to this operation.
*/
QueueService.prototype.setQueueMetadata = function (queue, metadata, optionsOrCallback, callback) {
  var options;
  azureutil.normalizeArgs(optionsOrCallback, callback, function (o, c) { options = o; callback = c; });

  validate.validateArgs('setQueueMetadata', function (v) {
    v.string(queue, 'queue');
    v.queueNameIsValid(queue);
    v.callback(callback);
  });

  var webResource = WebResource.put(queue)
    .withQueryOption(QueryStringConstants.COMP, 'metadata')
    .addOptionalMetadataHeaders(metadata);

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
* @param {object}             [options]                                   The put and request options.
* @param {int}                [options.messagettl]                        The time-to-live interval for the message, in seconds. The maximum time-to-live allowed is 7 days. If this parameter is omitted, the default time-to-live is 7 days
* @param {int}                [options.visibilitytimeout]                 Specifies the new visibility timeout value, in seconds, relative to server time. The new value must be larger than or equal to 0, and cannot be larger than 7 days. The visibility timeout of a message cannot be set to a value later than the expiry time. visibilitytimeout should be set to a value smaller than the time-to-live value.
* @param {int}                [options.timeoutIntervalInMs]               The timeout interval, in milliseconds, to use for the request.
* @param {Function(error, queueMessageResult, response)}  callback        `error` will contain information
*                                                                         if an error occurs; otherwise `queueMessageResult` will contain
*                                                                         the result.
*                                                                         `response` will contain information related to this operation.
*
* @example
* var azure = require('azure');
* var queueService = azure.createQueueService();
* queueService.createMessage('taskqueue', 'Hello world!', function(error) {
*   if(!error) {
*     // Message inserted
*   }
* });
*/
QueueService.prototype.createMessage = function (queue, messageText, optionsOrCallback, callback) {
  var options;
  azureutil.normalizeArgs(optionsOrCallback, callback, function (o, c) { options = o; callback = c; });

  validate.validateArgs('createMessage', function (v) {
    v.string(queue, 'queue');
    v.queueNameIsValid(queue);
    v.callback(callback);
  });

  var xmlMessageDescriptor = QueueMessageResult.serialize(messageText);

  var webResource = WebResource.post(queue + '/messages')
    .withHeader(HeaderConstants.CONTENT_TYPE, 'application/atom+xml;charset="utf-8"')
    .withHeader(HeaderConstants.CONTENT_LENGTH, Buffer.byteLength(xmlMessageDescriptor, 'utf8'))
    .withQueryOptions(options, QueryStringConstants.MESSAGE_TTL, QueryStringConstants.VISIBILITY_TIMEOUT)
    .withBody(xmlMessageDescriptor);

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

  this.performRequest(webResource, webResource.body, options, processResponseCallback);
};

/**
* Retrieves a message from the queue and makes it invisible to other consumers.
*
* @this {QueueService}
* @param {string}             queue                                       The queue name.
* @param {object}             [options]                                   The get and request options.
* @param {int}                [options.numofmessages]                     A nonzero integer value that specifies the number of messages to retrieve from the queue, up to a maximum of 32. By default, a single message is retrieved from the queue with this operation.
* @param {bool}               [options.peekonly]                          Boolean value indicating wether the visibility of the message should be changed or not.
* @param {int}                [options.visibilitytimeout]                 Required if not peek only. Specifies the new visibility timeout value, in seconds, relative to server time. The new value must be larger than or equal to 0, and cannot be larger than 7 days. The visibility timeout of a message can be set to a value later than the expiry time.
* @param {int}                [options.timeoutIntervalInMs]               The timeout interval, in milliseconds, to use for the request.
* @param {Function(error, queueMessageResults, response)}  callback       `error` will contain information
*                                                                         if an error occurs; otherwise `queueMessageResults` will contain
*                                                                         the message.
*                                                                         `response` will contain information related to this operation.
*
* @example
* var azure = require('azure');
* var queueService = azure.createQueueService();
* var queueName = 'taskqueue';
* queueService.getMessages(queueName, function(error, serverMessages) {
*   if(!error) {
*     // Process the message in less than 30 seconds, the message
*     // text is available in serverMessages[0].messagetext
*     queueService.deleteMessage(queueName, serverMessages[0].messageid, serverMessages[0].popreceipt, function(error) {
*       if(!error){
*           // Message deleted
*       }
*     });
*   }
* });
*/
QueueService.prototype.getMessages = function (queue, optionsOrCallback, callback) {
  var options;
  azureutil.normalizeArgs(optionsOrCallback, callback, function (o, c) { options = o; callback = c; });

  validate.validateArgs('getMessages', function (v) {
    v.string(queue, 'queue');
    v.queueNameIsValid(queue);
    v.callback(callback);
  });

  var webResource = WebResource.get(queue + '/messages');
  webResource.withQueryOptions(options, QueryStringConstants.NUM_OF_MESSAGES, QueryStringConstants.VISIBILITY_TIMEOUT);
  if (options) {
    webResource.withQueryOption(QueryStringConstants.PEEK_ONLY, options[QueryStringConstants.PEEK_ONLY]);
  }

  var processResponseCallback = function (responseObject, next) {
    responseObject.queueMessageResults = null;

    if (!responseObject.error) {
      responseObject.queueMessageResults = [];

      if (responseObject.response.body.QueueMessagesList && responseObject.response.body.QueueMessagesList.QueueMessage) {
        var messages = responseObject.response.body.QueueMessagesList.QueueMessage;

        if (!_.isArray(messages)) {
          messages = [ messages ];
        }

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
* @param {object}             [options]                                   The peek and request options.
* @param {int}                [options.numofmessages]                     A nonzero integer value that specifies the number of messages to retrieve from the queue, up to a maximum of 32. By default, a single message is retrieved from the queue with this operation.
* @param {int}                [options.timeoutIntervalInMs]               The timeout interval, in milliseconds, to use for the request.
* @param {Function(error, queueMessageResults, response)}  callback       `error` will contain information
*                                                                         if an error occurs; otherwise `queueMessageResults` will contain
*                                                                         the message.
*                                                                         `response` will contain information related to this operation.
*/
QueueService.prototype.peekMessages = function (queue, optionsOrCallback, callback) {
  var options;
  azureutil.normalizeArgs(optionsOrCallback, callback, function (o, c) { options = o; callback = c; });

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
* @param {string}             queue                             The queue name.
* @param {string}             messageid                         The message identifier of the message to delete.
* @param {string}             popreceipt                        A valid pop receipt value returned from an earlier call to the Get Messages or Update Message operation
* @param {object}             [options]                         The delete and request options.
* @param {int}                [options.timeoutIntervalInMs]     The timeout interval, in milliseconds, to use for the request.
* @param {Function(error, successful, response)}  callback      `error` will contain information
*                                                               if an error occurs; otherwise `successful` will contain
*                                                               `true` if the operation was successful.
*                                                               `response` will contain information related to this operation.
*/
QueueService.prototype.deleteMessage = function (queue, messageid, popreceipt, optionsOrCallback, callback) {
  var options;
  azureutil.normalizeArgs(optionsOrCallback, callback, function (o, c) { options = o; callback = c; });

  validate.validateArgs('deleteMessage', function (v) {
    v.string(queue, 'queue');
    v.queueNameIsValid(queue);
    v.callback(callback);
  });

  if (!popreceipt) {
    throw new Error('A message retrieved using \'peekMessages\' can not be deleted! Use \'getMessages\' instead.');
  }

  var webResource = WebResource.del(queue + '/messages/' + messageid)
    .withQueryOption(QueryStringConstants.POP_RECEIPT, popreceipt, null, true);

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
* @param {string}             queue                             The queue name.
* @param {object}             [options]                         The delete and request options.
* @param {int}                [options.timeoutIntervalInMs]     The timeout interval, in milliseconds, to use for the request.
* @param {Function(error, response)}  callback                  `error` will contain information
*                                                               if an error occurs; otherwise 
*                                                               `response` will contain information related to this operation.
*/
QueueService.prototype.clearMessages = function (queue, optionsOrCallback, callback) {
  var options;
  azureutil.normalizeArgs(optionsOrCallback, callback, function (o, c) { options = o; callback = c; });

  validate.validateArgs('clearMessages', function (v) {
    v.string(queue, 'queue');
    v.queueNameIsValid(queue);
    v.callback(callback);
  });

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
* @param {object}             [options]                                   The delete and request options.
* @param {object}             [options.messagetext]                       The new message text.
* @param {int}                [options.timeoutIntervalInMs]               The timeout interval, in milliseconds, to use for the request.
* @param {Function(error, queueMessageResult, response)}  callback        `error` will contain information
*                                                                         if an error occurs; otherwise `queueMessageResult` will contain
*                                                                         the message result information.
*                                                                         `response` will contain information related to this operation.
*/
QueueService.prototype.updateMessage = function (queue, messageid, popreceipt, visibilitytimeout, optionsOrCallback, callback) {
  var options;
  azureutil.normalizeArgs(optionsOrCallback, callback, function (o, c) { options = o; callback = c; });

  validate.validateArgs('updateMessage', function (v) {
    v.string(queue, 'queue');
    v.queueNameIsValid(queue);
    v.callback(callback);
  });

  var content = null;
  if (options && options.messagetext) {
    content = QueueMessageResult.serialize(options.messagetext);
  }

  var contentLength = content ? Buffer.byteLength(content, 'utf8') : 0;

  var webResource = WebResource.put(queue + '/messages/' + messageid)
    .withHeader(HeaderConstants.CONTENT_TYPE, 'application/atom+xml;charset="utf-8"')
    .withHeader(HeaderConstants.CONTENT_LENGTH, contentLength)
    .withQueryOption(QueryStringConstants.POP_RECEIPT, popreceipt, null, true)
    .withQueryOption(QueryStringConstants.VISIBILITY_TIMEOUT, visibilitytimeout)
    .withBody(content);

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

  this.performRequest(webResource, webResource.body, options, processResponseCallback);
};

module.exports = QueueService;
