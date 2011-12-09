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

var testCase = require('nodeunit').testCase;

var azure = require('../../../lib/azure');
var azureutil = require('../../../lib/util/util');
var testutil = require('../../util/util');

var ServiceClient = require("../../../lib/services/serviceclient");
var Constants = require('../../../lib/util/constants');
var HttpConstants = Constants.HttpConstants;

var queueService;
var queueNames = [];
var queueNamesPrefix = 'queue';

module.exports = testCase(
{
  setUp: function (callback) {
    queueService = azure.createQueueService();

    callback();
  },

  tearDown: function (callback) {
    queueService.listQueues(function (listError, queues) {
      if (queues && queues.length > 0) {
        var queueCount = 0;
        queues.forEach(function (queue) {
          queueService.deleteQueue(queue.name, function () {
            queueCount++;
            if (queueCount === queues.length) {
              callback();
            }
          });
        });
      }
      else {
        callback();
      }
    });
  },

  getServiceProperties: function (test) {
    queueService.getServiceProperties(function (error, serviceProperties) {
      test.equal(error, null);
      test.notEqual(serviceProperties, null);

      if (serviceProperties) {
        test.notEqual(serviceProperties.Logging, null);
        if (serviceProperties.Logging) {
          test.notEqual(serviceProperties.Logging.RetentionPolicy);
          test.notEqual(serviceProperties.Logging.Version);
        }

        if (serviceProperties.Metrics) {
          test.notEqual(serviceProperties.Metrics, null);
          test.notEqual(serviceProperties.Metrics.RetentionPolicy);
          test.notEqual(serviceProperties.Metrics.Version);
        }
      }

      test.done();
    });
  },

  testSetServiceProperties: function (test) {
    queueService.getServiceProperties(function (error, serviceProperties) {
      test.equal(error, null);

      serviceProperties.Logging.Read = true;
      queueService.setServiceProperties(serviceProperties, function (error2) {
        test.equal(error2, null);

        queueService.getServiceProperties(function (error3, serviceProperties2) {
          test.equal(error3, null);
          test.equal(serviceProperties2.Logging.Read, true);

          test.done();
        });
      });
    });
  },

  testCreateQueue: function (test) {
    var queueName = testutil.generateId(queueNamesPrefix, queueNames);
    var metadata = { 'class': 'test' };

    // Create
    queueService.createQueue(queueName, { metadata: metadata }, function (createError, queue, createResponse) {
      test.equal(createError, null);
      test.notEqual(queue, null);
      test.ok(createResponse.isSuccessful);
      test.equal(createResponse.statusCode, HttpConstants.HttpResponseCodes.CREATED_CODE);

      test.ok(queue);
      if (createResponse.queue) {
        test.ok(queue.name);
        test.equal(queue.name, queueName);

        test.ok(queue.metadata);
        test.equal(queue.metadata['class'], metadata['class']);
      }

      // Get
      queueService.getQueueMetadata(queueName, function (getError, getQueue, getResponse) {
        test.equal(getError, null);
        test.ok(getResponse.isSuccessful);
        test.equal(getResponse.statusCode, HttpConstants.HttpResponseCodes.OK_CODE);

        test.ok(getQueue);
        if (getQueue) {
          test.ok(getQueue.name);
          test.equal(getQueue.name, queueName);

          test.ok(getQueue.metadata);
          test.equal(getQueue.metadata['class'], metadata['class']);
        }

        // Delete
        queueService.deleteQueue(queueName, function (deleteError, deleted, deleteResponse) {
          test.equal(deleteError, null);
          test.equal(deleted, true);
          test.ok(deleteResponse.isSuccessful);
          test.equal(deleteResponse.statusCode, HttpConstants.HttpResponseCodes.NO_CONTENT_CODE);

          test.done();
        });
      });
    });
  },

  testCreateQueueIfNotExists: function (test) {
    var queueName = testutil.generateId(queueNamesPrefix, queueNames);
    var metadata = { 'class': 'test' };

    // Create
    queueService.createQueue(queueName, { metadata: metadata }, function (createError, queue, createResponse) {
      test.equal(createError, null);
      test.notEqual(queue, null);
      test.ok(createResponse.isSuccessful);
      test.equal(createResponse.statusCode, HttpConstants.HttpResponseCodes.CREATED_CODE);

      test.ok(queue);
      if (createResponse.queue) {
        test.ok(queue.name);
        test.equal(queue.name, queueName);

        test.ok(queue.metadata);
        test.equal(queue.metadata['class'], metadata['class']);
      }

      // Try creating again
      queueService.createQueueIfNotExists(queueName, { metadata: metadata }, function (createError2, queueCreated2) {
        test.equal(createError2, null);
        test.equal(queueCreated2, false);

        test.done();
      });
    });
  },

  testListQueues: function (test) {
    var queueName1 = testutil.generateId(queueNamesPrefix, queueNames);
    var queueName2 = testutil.generateId(queueNamesPrefix, queueNames);
    var metadata = { 'class': 'test' };

    queueService.listQueues({ 'include': 'metadata' }, function (listErrorEmpty, queuesEmpty) {
      test.equal(listErrorEmpty, null);
      test.notEqual(queuesEmpty, null);
      if (queuesEmpty) {
        test.equal(queuesEmpty.length, 0);
      }

      queueService.createQueue(queueName1, function (createError1, queue1, createResponse1) {
        test.equal(createError1, null);
        test.notEqual(queue1, null);
        test.ok(createResponse1.isSuccessful);
        test.equal(createResponse1.statusCode, HttpConstants.HttpResponseCodes.CREATED_CODE);

        queueService.createQueue(queueName2, { metadata: metadata }, function (createError2, queue2, createResponse2) {
          test.equal(createError2, null);
          test.notEqual(queue2, null);
          test.ok(createResponse2.isSuccessful);
          test.equal(createResponse2.statusCode, HttpConstants.HttpResponseCodes.CREATED_CODE);

          queueService.listQueues({ 'include': 'metadata' }, function (listError, queues, nextMarker, listResponse) {
            test.equal(listError, null);
            test.notEqual(queues, null);
            test.ok(listResponse.isSuccessful);
            test.equal(listResponse.statusCode, HttpConstants.HttpResponseCodes.OK_CODE);

            test.ok(queues);

            var entries = 0;
            for (var queue in queues) {
              var currentQueue = queues[queue];

              if (currentQueue.name === queueName1) {
                entries += 1;
              }
              else if (currentQueue.name === queueName2) {
                entries += 2;
                test.equal(currentQueue.metadata['class'], metadata['class']);
              }
            }

            test.equal(entries, 3);

            test.done();
          });
        });
      });
    });
  },

  testCreateMessage: function (test) {
    var queueName = testutil.generateId(queueNamesPrefix, queueNames);
    var messageText1 = 'hi there';
    var messageText2 = 'bye there';

    // Create Queue
    queueService.createQueue(queueName, function (createError1, queue1, createResponse1) {
      test.equal(createError1, null);
      test.notEqual(queue1, null);
      test.ok(createResponse1.isSuccessful);
      test.equal(createResponse1.statusCode, HttpConstants.HttpResponseCodes.CREATED_CODE);

      // Create message
      queueService.createMessage(queueName, messageText1, function (createMessageError, message, createMessageResponse) {
        test.equal(createMessageError, null);
        test.ok(createMessageResponse.isSuccessful);
        test.equal(createMessageResponse.statusCode, HttpConstants.HttpResponseCodes.CREATED_CODE);

        // Create another message
        queueService.createMessage(queueName, messageText2, function (createMessageError2, message2, createMessageResponse2) {
          test.equal(createMessageError, null);
          test.ok(createMessageResponse2.isSuccessful);
          test.equal(createMessageResponse2.statusCode, HttpConstants.HttpResponseCodes.CREATED_CODE);

          // Peek message
          queueService.peekMessages(queueName, function (peekError, queueMessages, peekResponse) {
            test.equal(peekError, null);
            test.notEqual(queueMessages, null);

            var queueMessage = queueMessages[0];
            if (queueMessage) {
              test.ok(queueMessage['messageid']);
              test.ok(queueMessage['insertiontime']);
              test.ok(queueMessage['expirationtime']);
              test.equal(queueMessage.messagetext, messageText1);
            }

            test.ok(peekResponse.isSuccessful);
            test.equal(peekResponse.statusCode, HttpConstants.HttpResponseCodes.OK_CODE);

            // Get messages
            queueService.getMessages(queueName, function (getError, getQueueMessages, getResponse) {
              test.equal(getError, null);
              test.notEqual(getQueueMessages, null);
              test.equal(getQueueMessages.length, 1);
              test.ok(getResponse.isSuccessful);
              test.equal(getResponse.statusCode, HttpConstants.HttpResponseCodes.OK_CODE);

              var getQueueMessage = getQueueMessages[0];
              test.equal(getQueueMessage.messagetext, messageText1);

              // Delete message
              queueService.deleteMessage(queueName, getQueueMessage.messageid, getQueueMessage.popreceipt, function (deleteError, deleted, deleteResponse) {
                test.equal(deleteError, null);
                test.equal(deleted, true);
                test.ok(deleteResponse.isSuccessful);
                test.equal(deleteResponse.statusCode, HttpConstants.HttpResponseCodes.NO_CONTENT_CODE);

                // Get messages again
                queueService.getMessages(queueName, function (getError2, getQueueMessages2, getResponse2) {
                  test.equal(getError2, null);
                  test.notEqual(getQueueMessages2, null);
                  test.ok(getResponse2.isSuccessful);
                  test.equal(getResponse2.statusCode, HttpConstants.HttpResponseCodes.OK_CODE);

                  var getQueueMessage2 = getQueueMessages2[0];
                  test.equal(getQueueMessage2.messagetext, messageText2);

                  // Clear messages
                  queueService.clearMessages(queueName, function (clearError, clearResponse) {
                    test.equal(clearError, null);
                    test.ok(clearResponse.isSuccessful);
                    test.equal(clearResponse.statusCode, HttpConstants.HttpResponseCodes.NO_CONTENT_CODE);

                    // Get message again should yield empty
                    queueService.getMessages(queueName, function (getError3, getQueueMessage3, getResponse3) {
                      test.equal(getError3, null);
                      test.ok(getResponse3.isSuccessful);
                      test.equal(getResponse3.statusCode, HttpConstants.HttpResponseCodes.OK_CODE);

                      test.equal(getQueueMessage3.length, 0);

                      test.done();
                    });
                  });
                });
              });
            });
          });
        });
      });
    });
  },

  testCreateEmptyMessage: function (test) {
    var queueName = testutil.generateId(queueNamesPrefix, queueNames);

    // Create Queue
    queueService.createQueue(queueName, function (createError1) {
      test.equal(createError1, null);

      // Create message
      queueService.createMessage(queueName, '', function (createMessageError, message, createMessageResponse) {
        test.equal(createMessageError, null);
        test.equal(createMessageResponse.statusCode, HttpConstants.HttpResponseCodes.CREATED_CODE);

        test.done();
      });
    });
  },

  testSetQueueMetadataName: function (test) {
    var queueName = testutil.generateId(queueNamesPrefix, queueNames);
    var metadata = { '\Uc8fc\Uba39\Uc774\Uc6b4\Ub2e4': 'test' };

    queueService.createQueue(queueName, function (createError) {
      test.equal(createError, null);

      // unicode headers are valid
      queueService.setQueueMetadata(queueName, metadata, function (setError) {
        test.equal(setError, null);
        test.done();
      });
    });
  },

  testSetQueueMetadata: function (test) {
    var queueName = testutil.generateId(queueNamesPrefix, queueNames);
    var metadata = { 'class': 'test' };

    queueService.createQueue(queueName, function (createError) {
      test.equal(createError, null);

      queueService.setQueueMetadata(queueName, metadata, function (setError) {
        test.equal(setError, null);

        queueService.getQueueMetadata(queueName, function (getError, queue) {
          test.equal(getError, null);

          test.notEqual(queue, null);
          if (queue) {
            test.notEqual(queue.metadata, null);

            test.equal(queue.metadata.class, 'test');

            test.done();
          }
        });
      });
    });
  },

  testGetMessages: function (test) {
    var queueName = testutil.generateId(queueNamesPrefix, queueNames);

    queueService.createQueue(queueName, function (createError) {
      test.equal(createError, null);

      queueService.getMessages(queueName, function (error, emptyMessages) {
        test.equal(error, null);
        test.notEqual(emptyMessages, null);
        test.equal(emptyMessages.length, 0);

        queueService.createMessage(queueName, 'msg1', function (error1) {
          test.equal(error1, null);

          queueService.createMessage(queueName, 'msg2', function (error2) {
            test.equal(error2, null);

            queueService.getMessages(queueName, { peekonly: true }, function (error3, messages) {
              test.equal(error3, null);

              test.notEqual(messages, null);
              if (messages) {
                // By default only one is returned
                test.equal(messages.length, 1);
              }

              queueService.getMessages(queueName, { numofmessages: 2 }, function (error4, messages2) {
                test.equal(error4, null);
                test.notEqual(messages2, null);

                if (messages2) {
                  test.equal(messages2.length, 2);
                }

                test.done();
              });
            });
          });
        });
      });
    });
  },

  testUpdateMessage: function (test) {
    var queueName = testutil.generateId(queueNamesPrefix, queueNames);

    queueService.createQueue(queueName, function (error) {
      test.equal(error, null);

      queueService.createMessage(queueName, 'hi there', function (error2) {
        test.equal(error2, null);

        queueService.getMessages(queueName, function (error3, messages) {
          test.equal(error2, null);
          test.notEqual(messages, null);
          var message = messages[0];

          queueService.updateMessage(queueName, message.messageid, message.popreceipt, 10, { messagetext: 'bye there' }, function (error4) {
            test.equal(error4, null);

            test.done();
          });
        });
      });
    });
  },

  testUpdateMessageEncodingPopReceipt: function (test) {
    var queueName = testutil.generateId(queueNamesPrefix, queueNames);

    // no messages in the queue try to update a message should give fail to update instead of blowing up on authentication
    queueService.updateMessage(queueName, 'mymsg', 'AgAAAAEAAACucgAAvMW8+dqjzAE=', 10, { messagetext: 'bye there' }, function (error) {
      test.notEqual(error, null);
      test.equal(error.code, Constants.QueueErrorCodeStrings.QUEUE_NOT_FOUND);

      test.done();
    });
  }
});
