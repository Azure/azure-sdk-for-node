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

var assert = require('assert');
var azure = require('../../../lib/azure');
var azureutil = require('../../../lib/util/util');

var ISO8061Date = require('../../../lib/util/iso8061date');

var testutil = require('../../util/util');
var servicebustestutil = require('../../util/servicebus-test-utils');

var ServiceClient = require("../../../lib/services/serviceclient");
var Constants = require('../../../lib/util/constants');
var HttpConstants = Constants.HttpConstants;
var StorageErrorCodeStrings = Constants.StorageErrorCodeStrings;
var ServiceBusConstants = Constants.ServiceBusConstants;

var serviceBusService;

var queueNames = [];
var queueNamesPrefix = 'sbqueue';

var topicNames = [];
var topicNamesPrefix = 'sbtopic';

var subscriptionNames = [];
var subscriptionNamesPrefix = 'sbsubscription';

var ruleNames = [];
var ruleNamesPrefix = 'sbrule';

var testPrefix = 'servicebusservice-tests';

module.exports = testCase(
{
  setUp: function (callback) {
    servicebustestutil.setUpTest(module.exports, testPrefix, function (err, newServiceBusService) {
      serviceBusService = newServiceBusService;
      callback();
    });
  },

  tearDown: function (callback) {
    servicebustestutil.tearDownTest(module.exports, serviceBusService, testPrefix, callback);
  },

  testCreateQueue: function (test) {
    var queueName = testutil.generateId(queueNamesPrefix, queueNames);
    var queueOptions = {
      LockDuration: 'PT45S',
      MaxSizeInMegabytes: '2048',
      RequiresDuplicateDetection: false,
      RequiresSession: false,
      DefaultMessageTimeToLive: 'PT5S',
      DeadLetteringOnMessageExpiration: true,
      DuplicateDetectionHistoryTimeWindow: 'PT55S'
    };

    serviceBusService.createQueue(queueName, queueOptions, function (createError, queue) {
      test.equal(createError, null);
      servicebustestutil.validateQueue(test, queueName, queueOptions, queue);

      // Validate appropriate error for existing queue
      serviceBusService.createQueue(queueName, queueOptions, function (createError2) {
        // TODO, validate the actual error
        test.notEqual(createError2, null);

        servicebustestutil.checkNullParameter(function () {
          serviceBusService.createQueue(null, function() { });
        });

        test.done();
      });
    });
  },

  testCreateQueueIfNotExists: function (test) {
    var queueName = testutil.generateId(queueNamesPrefix, queueNames);
    var queueOptions = {
      LockDuration: 'PT45S',
      MaxSizeInMegabytes: '2048',
      RequiresDuplicateDetection: false,
      RequiresSession: false,
      DefaultMessageTimeToLive: 'PT5S',
      DeadLetteringOnMessageExpiration: true,
      DuplicateDetectionHistoryTimeWindow: 'PT55S'
    };

    serviceBusService.createQueueIfNotExists(queueName, queueOptions, function (createError, created) {
      test.equal(createError, null);
      test.equal(created, true);

      serviceBusService.getQueue(queueName, function( error, queue) {
        servicebustestutil.validateQueue(test, queueName, queueOptions, queue);

        // try creating queue again
        serviceBusService.createQueueIfNotExists(queueName, function (createError2, created2) {
          test.equal(createError2, null);
          test.equal(created2, false);

          servicebustestutil.checkNullParameter(function () {
            serviceBusService.createQueueIfNotExists( null, function() { });
          });

          test.done();
        });
      });
    });
  },

  testDeleteQueue: function (test) {
    var queueName = testutil.generateId(queueNamesPrefix, queueNames);

    serviceBusService.deleteQueue(queueName, function (error1) {
      test.notEqual(error1, null);
      test.equal(error1.code, '404');

      serviceBusService.createQueue(queueName, function (error2, createResponse1) {
        test.equal(error2, null);
        test.notEqual(createResponse1, null);

        serviceBusService.getQueue(queueName, function (error3, createdQueue) {
          test.equal(error3, null);
          test.notEqual(createdQueue, null);
          test.equal(createdQueue.QueueName, queueName);

          serviceBusService.deleteQueue(queueName, function (error4, deleteResponse2) {
            test.equal(error4, null);
            test.notEqual(deleteResponse2, null);

            serviceBusService.getQueue(queueName, function (error5, queueDeleting) {
              test.notEqual(error5, null);
              test.equal(queueDeleting, null);
              servicebustestutil.checkNullParameter(function () {
                serviceBusService.deleteQueue(null, function() { });
              });
              test.done();
            });
          });
        });
      });
    });
  },

  testGetQueue: function (test) {
    var queueName = testutil.generateId(queueNamesPrefix, queueNames);

    serviceBusService.getQueue(queueName, function (getError1, getQueue1) {
      test.notEqual(getError1, null);
      test.equal(getQueue1, null);

      serviceBusService.createQueue(queueName, function (createError, queue) {
        test.equal(createError, null);
        test.notEqual(queue, null);

        // Getting existant queue
        serviceBusService.getQueue(queueName, function (getError2, getQueue2) {
          test.equal(getError2, null);
          test.notEqual(getQueue2, null);

          servicebustestutil.checkNullParameter(function () {
            serviceBusService.getQueue(null, function() { });
          });
          test.done();
        });
      });
    });
  },

  testListQueue: function (test) {
    var queueName1 = testutil.generateId(queueNamesPrefix, queueNames);
    var queueName2 = testutil.generateId(queueNamesPrefix, queueNames);

    // listing without any queue
    serviceBusService.listQueues(function (emptyError, emptyQueues) {
      test.equal(emptyError, null);
      test.notEqual(emptyQueues, null);
      test.equal(emptyQueues.length, 0);

      serviceBusService.createQueue(queueName1, function (createError1, queue1) {
        test.equal(createError1, null);
        test.notEqual(queue1, null);

        // Listing with only one queue
        serviceBusService.listQueues(function (oneQueueError, oneQueue) {
          test.equal(oneQueueError, null);
          test.notEqual(oneQueue, null);
          test.equal(oneQueue.length, 1);

          serviceBusService.createQueue(queueName2, function (createError2, queue2) {
            test.equal(createError2, null);
            test.notEqual(queue2, null);

            // Listing with multiple queues.
            serviceBusService.listQueues(function (getError, queues) {
              test.equal(getError, null);
              test.notEqual(queues, null);
              test.equal(queues.length, 2);

              var queueCount = 0;
              for (var queue in queues) {
                var currentQueue = queues[queue];

                test.notEqual(currentQueue[ServiceBusConstants.LOCK_DURATION], null);
                test.notEqual(currentQueue[ServiceBusConstants.MAX_SIZE_IN_MEGABYTES], null);
                test.notEqual(currentQueue[ServiceBusConstants.REQUIRES_DUPLICATE_DETECTION], null);
                test.notEqual(currentQueue[ServiceBusConstants.REQUIRES_SESSION], null);
                test.notEqual(currentQueue[ServiceBusConstants.DEFAULT_MESSAGE_TIME_TO_LIVE], null);
                test.notEqual(currentQueue[ServiceBusConstants.DEAD_LETTERING_ON_MESSAGE_EXPIRATION], null);
                test.notEqual(currentQueue[ServiceBusConstants.DUPLICATE_DETECTION_HISTORY_TIME_WINDOW], null);
                test.notEqual(currentQueue[ServiceBusConstants.MAX_DELIVERY_COUNT], null);
                test.notEqual(currentQueue[ServiceBusConstants.ENABLE_BATCHED_OPERATIONS], null);
                test.notEqual(currentQueue[ServiceBusConstants.SIZE_IN_BYTES], null);
                test.notEqual(currentQueue[ServiceBusConstants.MESSAGE_COUNT], null);

                if (currentQueue.QueueName === queueName1) {
                  queueCount += 1;
                } else if (currentQueue.QueueName === queueName2) {
                  queueCount += 2;
                }
              }

              test.equal(queueCount, 3);

              test.done();
            });
          });
        });
      });
    });
  },

  testListQueueRanges: function (test) {
    var queueName1 = '1' + testutil.generateId(queueNamesPrefix, queueNames);
    var queueName2 = '2' + testutil.generateId(queueNamesPrefix, queueNames);
    var queueName3 = '3' + testutil.generateId(queueNamesPrefix, queueNames);
    var queueName4 = '4' + testutil.generateId(queueNamesPrefix, queueNames);

    serviceBusService.createQueue(queueName1, function (createError1) {
      test.equal(createError1, null);

      serviceBusService.createQueue(queueName2, function (createError2) {
        test.equal(createError2, null);

        serviceBusService.createQueue(queueName3, function (createError3) {
          test.equal(createError3, null);

          serviceBusService.createQueue(queueName4, function (createError4) {
            test.equal(createError4, null);

            // test top
            serviceBusService.listQueues({ top: 2 }, function (listError1, listQueues1) {
              test.equal(listError1, null);
              test.notEqual(listQueues1, null);
              test.equal(listQueues1.length, 2);

              // results are ordered by alphabetic order so
              // queueName1 and queueName2 should be in the result
              var queueCount = 0;
              for (var queue in listQueues1) {
                var currentQueue = listQueues1[queue];
                if (currentQueue.QueueName === queueName1) {
                  queueCount += 1;
                } else if (currentQueue.QueueName === queueName2) {
                  queueCount += 2;
                }
              }

              test.equal(queueCount, 3);

              // test skip
              serviceBusService.listQueues({ top: 2, skip: 1 }, function (listError2, listQueues2) {
                test.equal(listError2, null);
                test.notEqual(listQueues2, null);
                test.equal(listQueues2.length, 2);

                // results are ordered by alphabetic order so
                // queueName2 and queueName3 should be in the result
                queueCount = 0;
                for (queue in listQueues2) {
                  currentQueue = listQueues2[queue];
                  if (currentQueue.QueueName === queueName2) {
                    queueCount += 1;
                  } else if (currentQueue.QueueName === queueName3) {
                    queueCount += 2;
                  }
                }

                test.equal(queueCount, 3);

                test.done();
              });
            });
          });
        });
      });
    });
  },

  testSendQueueMessage: function (test) {
    var queueName = testutil.generateId(queueNamesPrefix, queueNames);

    serviceBusService.createQueue(queueName, function (createError, queue) {
      test.equal(createError, null);
      test.notEqual(queue, null);

      serviceBusService.sendQueueMessage(queueName, 'hi there', function (sendError) {
        test.equal(sendError, null);

        servicebustestutil.checkNullParameter(function () {
          serviceBusService.sendQueueMessage( null, 'hello again', function() { });
        });
        test.done();
      });
    });
  },

  testSendMessageProperties: function (test) {
    var queueName = testutil.generateId(queueNamesPrefix, queueNames);
    var message = {
      body: 'hi there again',
      contentType: 'made-up-one',
      brokerProperties: {
        CorrelationId: '{701332F3-B37B-4D29-AA0A-E367906C206E}',
        SessionId: 'session',
        MessageId: 'id',
        Label: 'lbl',
        ReplyTo: 'repTo',
        To: 'to',
        ReplyToSessionId: 'repsession'
      }
    };

    serviceBusService.createQueue(queueName, function (createError, queue) {
      test.equal(createError, null);
      test.notEqual(queue, null);

      serviceBusService.sendQueueMessage(queueName, message, function (sendError) {
        test.equal(sendError, null);

        serviceBusService.receiveQueueMessage(queueName, function (receiveError, messageReceived) {
          test.equal(receiveError, null);
          test.notEqual(messageReceived, null);

          test.equal(messageReceived.body, message.body);
          test.equal(messageReceived.contentType, message.contentType);
          test.equal(messageReceived.brokerProperties.CorrelationId, message.brokerProperties.CorrelationId);
          test.equal(messageReceived.brokerProperties.SessionId, message.brokerProperties.SessionId);
          test.equal(messageReceived.brokerProperties.MessageId, message.brokerProperties.MessageId);
          test.equal(messageReceived.brokerProperties.Label, message.brokerProperties.Label);
          test.equal(messageReceived.brokerProperties.ReplyTo, message.brokerProperties.ReplyTo);
          test.equal(messageReceived.brokerProperties.To, message.brokerProperties.To);
          test.equal(messageReceived.brokerProperties.ReplyToSessionId, message.brokerProperties.ReplyToSessionId);
          test.done();
        });
      });
    });
  },

  testMessageCustomProperties: function (test) {
    var queueName = testutil.generateId(queueNamesPrefix, queueNames);
    var message = {
      body: 'hi there again',
      customProperties: {
        propint: 1,
        propfloat: 2.22,
        propdate: new Date(2012, 02, 07, 22, 27, 0),
        propstring: 'hi there'
      }
    };

    serviceBusService.createQueue(queueName, function (createError, queue) {
      test.equal(createError, null);
      test.notEqual(queue, null);

      serviceBusService.sendQueueMessage(queueName, message, function (sendError) {
        test.equal(sendError, null);

        // read the message
        serviceBusService.receiveQueueMessage(queueName, function (receiveError, receivedMessage) {
          test.equal(receiveError, null);
          test.equal(receivedMessage.body, message.body);
          test.strictEqual(receivedMessage.customProperties.propint, message.customProperties.propint);
          test.strictEqual(receivedMessage.customProperties.propfloat, message.customProperties.propfloat);
          test.deepEqual(receivedMessage.customProperties.propdate.valueOf(), message.customProperties.propdate.valueOf());
          test.strictEqual(receivedMessage.customProperties.propstring, message.customProperties.propstring);

          serviceBusService.receiveQueueMessage(queueName, function (receiveError2, emptyMessage) {
            test.notEqual(receiveError2, null);
            test.equal(emptyMessage, null);

            test.done();
          });
        });
      });
    });
  },

  testReceiveQueueMessage: function (test) {
    var queueName = testutil.generateId(queueNamesPrefix, queueNames);
    var messageText = 'hi there again';

    serviceBusService.createQueue(queueName, function (createError, queue) {
      test.equal(createError, null);
      test.notEqual(queue, null);

      serviceBusService.sendQueueMessage(queueName, messageText, function (sendError) {
        test.equal(sendError, null);

        // read the message
        serviceBusService.receiveQueueMessage(queueName, function (receiveError, message) {
          test.equal(receiveError, null);
          test.equal(message.body, messageText);

          serviceBusService.receiveQueueMessage(queueName, function (receiveError2, emptyMessage) {
            test.notEqual(receiveError2, null);
            test.equal(emptyMessage, null);

            servicebustestutil.checkNullParameter(function () {
              serviceBusService.receiveQueueMessage(null, function() { });
            });
            test.done();
          });
        });
      });
    });
  },

  testPeekLockedMessageCanBeCompleted: function (test) {
    var queueName = testutil.generateId(queueNamesPrefix, queueNames);
    var messageText = 'hi there again';

    serviceBusService.createQueue(queueName, function (createError, queue) {
      test.equal(createError, null);
      test.notEqual(queue, null);

      serviceBusService.sendQueueMessage(queueName, messageText, function (sendError) {
        test.equal(sendError, null);

        // Peek the message
        serviceBusService.receiveQueueMessage(queueName, { isPeekLock: true, timeoutIntervalInS: 5 }, function (receiveError, message) {
          test.equal(receiveError, null);
          test.equal(message.body, messageText);

          test.notEqual(message.location, null);
          test.notEqual(message.brokerProperties.LockToken, null);
          test.notEqual(message.brokerProperties.LockedUntilUtc, null);

          // deleted message
          serviceBusService.deleteMessage(message.location, function (deleteError) {
            test.equal(deleteError, null);

            test.done();
          });
        });
      });
    });
  },

  testPeekLockedMessageCanBeCompletedWithObject: function (test) {
    var queueName = testutil.generateId(queueNamesPrefix, queueNames);
    var messageText = 'hi there again';

    serviceBusService.createQueue(queueName, function (createError, queue) {
      test.equal(createError, null);
      test.notEqual(queue, null);

      serviceBusService.sendQueueMessage(queueName, messageText, function (sendError) {
        test.equal(sendError, null);

        // Peek the message
        serviceBusService.receiveQueueMessage(queueName, { isPeekLock: true, timeoutIntervalInS: 5 }, function (receiveError, message) {
          test.equal(receiveError, null);
          test.equal(message.body, messageText);

          test.notEqual(message.location, null);
          test.notEqual(message.brokerProperties.LockToken, null);
          test.notEqual(message.brokerProperties.LockedUntilUtc, null);

          // deleted message
          serviceBusService.deleteMessage(message, function (deleteError) {
            test.equal(deleteError, null);

            test.done();
          });
        });
      });
    });
  },

  testPeekLockedMessageCanBeUnlocked: function (test) {
    var queueName = testutil.generateId(queueNamesPrefix, queueNames);
    var messageText = 'hi there again';

    serviceBusService.createQueue(queueName, function (createError, queue) {
      test.equal(createError, null);
      test.notEqual(queue, null);

      serviceBusService.sendQueueMessage(queueName, messageText, function (sendError) {
        test.equal(sendError, null);

        // Peek the message
        serviceBusService.receiveQueueMessage(queueName, { isPeekLock: true, timeoutIntervalInS: 5 }, function (receiveError1, message1) {
          test.equal(receiveError1, null);
          test.equal(message1.body, messageText);

          test.notEqual(message1.location, null);
          test.notEqual(message1.brokerProperties.LockToken, null);
          test.notEqual(message1.brokerProperties.LockedUntilUtc, null);

          // deleted message
          serviceBusService.unlockMessage(message1.location, function (unlockError) {
            test.equal(unlockError, null);

            serviceBusService.receiveQueueMessage(queueName, function (receiveError2, receiveMessage2) {
              test.equal(receiveError2, null);
              test.notEqual(receiveMessage2, null);

              test.done();
            });
          });
        });
      });
    });
  },

  testPeekLockedMessageCanBeUnlockedWithObject: function (test) {
    var queueName = testutil.generateId(queueNamesPrefix, queueNames);
    var messageText = 'hi there again';

    serviceBusService.createQueue(queueName, function (createError, queue) {
      test.equal(createError, null);
      test.notEqual(queue, null);

      serviceBusService.sendQueueMessage(queueName, messageText, function (sendError) {
        test.equal(sendError, null);

        // Peek the message
        serviceBusService.receiveQueueMessage(queueName, { isPeekLock: true, timeoutIntervalInS: 5 }, function (receiveError1, message1) {
          test.equal(receiveError1, null);
          test.equal(message1.body, messageText);

          test.notEqual(message1.location, null);
          test.notEqual(message1.brokerProperties.LockToken, null);
          test.notEqual(message1.brokerProperties.LockedUntilUtc, null);

          // deleted message
          serviceBusService.unlockMessage(message1, function (unlockError) {
            test.equal(unlockError, null);

            serviceBusService.receiveQueueMessage(queueName, function (receiveError2, receiveMessage2) {
              test.equal(receiveError2, null);
              test.notEqual(receiveMessage2, null);

              test.done();
            });
          });
        });
      });
    });
  },

  testCreateTopic: function (test) {
    var topicName = testutil.generateId(topicNamesPrefix, topicNames);
    var topicOptions = {
      MaxSizeInMegabytes: '2048',
      RequiresDuplicateDetection: false,
      DefaultMessageTimeToLive: 'PT5S',
      DuplicateDetectionHistoryTimeWindow: 'PT55S',
      EnableBatchedOperations: true,
      SizeInBytes: '1024'
    };

    serviceBusService.createTopic(topicName, topicOptions, function (createError, topic) {
      test.equal(createError, null);
      test.notEqual(topic, null);
      if (topic) {
        test.equal(topic.TopicName, topicName);

        test.equal(topic.MaxSizeInMegabytes, topicOptions.MaxSizeInMegabytes);
        test.equal(topic.RequiresDuplicateDetection, topicOptions.RequiresDuplicateDetection);
        test.equal(topic.DefaultMessageTimeToLive, topicOptions.DefaultMessageTimeToLive);
        test.equal(topic.DuplicateDetectionHistoryTimeWindow, topicOptions.DuplicateDetectionHistoryTimeWindow);
        test.equal(topic.EnableBatchedOperations, topicOptions.EnableBatchedOperations);     
        test.equal(topic.SizeInBytes, topicOptions.SizeInBytes);
        }

      servicebustestutil.checkNullParameter(function () {
        serviceBusService.createTopic(null, topicOptions, function() { });
      });
      test.done();
    });
  },

  testCreateTopicIfNotExists: function (test) {
    var topicName = testutil.generateId(topicNamesPrefix, topicNames);
    var topicOptions = {
      MaxSizeInMegabytes: '2048',
      RequiresDuplicateDetection: false,
      DefaultMessageTimeToLive: 'PT5S',
      DuplicateDetectionHistoryTimeWindow: 'PT55S'
    };

    serviceBusService.createTopicIfNotExists(topicName, topicOptions, function (createError1, created1) {
      test.equal(createError1, null);
      test.equal(created1, true);

      serviceBusService.createTopicIfNotExists(topicName, function (createError2, created2) {
        test.equal(createError2, null);
        test.equal(created2, false);

        servicebustestutil.checkNullParameter(function () {
          serviceBusService.createTopicIfNotExists(null, topicOptions, function() { });
        });
        test.done();
      });
    });
  },

  testSendTopicMessage: function (test) {
    var topicName = testutil.generateId(topicNamesPrefix, topicNames);
    var subscriptionName = testutil.generateId(subscriptionNamesPrefix, subscriptionNames);
    var message = {
      body: 'hi there topic',
      contentType: 'made-up-one',
      brokerProperties: {
        CorrelationId: '{701332F3-B37B-4D29-AA0A-E367906C206E}',
        SessionId: 'session',
        MessageId: 'id',
        Label: 'lbl',
        ReplyTo: 'repTo',
        To: 'to',
        ReplyToSessionId: 'repsession'
      }
    };

    serviceBusService.createTopic(topicName, function (createTopicError) {
      test.equal(createTopicError, null);

      serviceBusService.createSubscription(topicName, subscriptionName, function (createSubscriptionError) {
        test.equal(createSubscriptionError, null);

        serviceBusService.sendTopicMessage(topicName, message, function (sendMessageError) {
          test.equal(sendMessageError, null);

          serviceBusService.receiveSubscriptionMessage(topicName, subscriptionName, function (receiveSubscriptionError, messageReceived) {
            test.equal(receiveSubscriptionError, null);
            test.notEqual(messageReceived, null);
            test.equal(messageReceived.body, message.body);

            test.equal(messageReceived.contentType, message.contentType);
            test.equal(messageReceived.brokerProperties.CorrelationId, message.brokerProperties.CorrelationId);
            test.equal(messageReceived.brokerProperties.SessionId, message.brokerProperties.SessionId);
            test.equal(messageReceived.brokerProperties.MessageId, message.brokerProperties.MessageId);
            test.equal(messageReceived.brokerProperties.Label, message.brokerProperties.Label);
            test.equal(messageReceived.brokerProperties.ReplyTo, message.brokerProperties.ReplyTo);
            test.equal(messageReceived.brokerProperties.To, message.brokerProperties.To);
            test.equal(messageReceived.brokerProperties.ReplyToSessionId, message.brokerProperties.ReplyToSessionId);

            servicebustestutil.checkNullParameter(function () {
              serviceBusService.sendTopicMessage( null, message, function() { });
            });

            servicebustestutil.checkNullParameter(function () {
              serviceBusService.receiveSubscriptionMessage(null, subscriptionName, function() { });
            });

            servicebustestutil.checkNullParameter(function () {
              serviceBusService.receiveSubscriptionMessage(topicName, null, function() { });
            });

            test.done();
          });
        });
      });
    });
  },

  testDeleteTopic: function (test) {
    var topicName = testutil.generateId(topicNamesPrefix, topicNames);

    serviceBusService.deleteTopic(topicName, function (error1) {
      test.notEqual(error1, null);
      test.equal(error1.code, '404');

      serviceBusService.createTopic(topicName, function (error2, createResponse1) {
        test.equal(error2, null);
        test.notEqual(createResponse1, null);

        serviceBusService.deleteTopic(topicName, function (error3, deleteResponse2) {
          test.equal(error3, null);
          test.notEqual(deleteResponse2, null);

          serviceBusService.getTopic(topicName, function (error4, topicDeleting) {
            test.notEqual(error4, null);
            test.equal(topicDeleting, null);

            servicebustestutil.checkNullParameter(function () {
              serviceBusService.deleteTopic(null, function() { });
            });
            test.done();
          });
        });
      });
    });
  },

  testGetTopic: function (test) {
    var topicName = testutil.generateId(topicNamesPrefix, topicNames);

    serviceBusService.getTopic(topicName, function (error, emptyTopic) {
      test.notEqual(error, null);
      test.equal(emptyTopic, null);

      serviceBusService.createTopic(topicName, function (createError, topic) {
        test.equal(createError, null);
        test.notEqual(topic, null);

        serviceBusService.getTopic(topicName, function (getError, getTopic) {
          test.equal(getError, null);
          test.notEqual(getTopic, null);

          servicebustestutil.checkNullParameter(function () {
            serviceBusService.getTopic(null, function() { });
          });

          test.done();
        });
      });
    });
  },

  testListTopics: function (test) {
    var topicName1 = testutil.generateId(topicNamesPrefix, topicNames);
    var topicName2 = testutil.generateId(topicNamesPrefix, topicNames);

    // listing without any topic
    serviceBusService.listTopics(function (listError1, listTopics1) {
      test.equal(listError1, null);
      test.notEqual(listTopics1, null);
      test.equal(listTopics1.length, 0);

      serviceBusService.createTopic(topicName1, function (createError1, topic1) {
        test.equal(createError1, null);
        test.notEqual(topic1, null);

        // listing with a single topic
        serviceBusService.listTopics(function (listError2, listTopics2) {
          test.equal(listError2, null);
          test.notEqual(listTopics2, null);
          test.equal(listTopics2.length, 1);

          serviceBusService.createTopic(topicName2, function (createError2, topic2) {
            test.equal(createError2, null);
            test.notEqual(topic2, null);

            // listing multiple topics
            serviceBusService.listTopics(function (listError, listTopics) {
              test.equal(listError, null);
              test.notEqual(listTopics, null);
              test.equal(listTopics.length, 2);

              var topicCount = 0;
              for (var topic in listTopics) {
                var currentTopic = listTopics[topic];

                test.notEqual(currentTopic.MaxSizeInMegabytes, null);
                test.notEqual(currentTopic.RequiresDuplicateDetection, null);
                test.notEqual(currentTopic.DefaultMessageTimeToLive, null);
                test.notEqual(currentTopic.DuplicateDetectionHistoryTimeWindow, null);

                if (currentTopic.TopicName === topicName1) {
                  topicCount += 1;
                } else if (currentTopic.TopicName === topicName2) {
                  topicCount += 2;
                }
              }

              test.equal(topicCount, 3);

              test.done();
            });
          });
        });
      });
    });
  },

  testListTopicsRanges: function (test) {
    var topicName1 = '1' + testutil.generateId(topicNamesPrefix, topicNames);
    var topicName2 = '2' + testutil.generateId(topicNamesPrefix, topicNames);
    var topicName3 = '3' + testutil.generateId(topicNamesPrefix, topicNames);
    var topicName4 = '4' + testutil.generateId(topicNamesPrefix, topicNames);

    serviceBusService.createTopic(topicName1, function (createError1) {
      test.equal(createError1, null);

      serviceBusService.createTopic(topicName2, function (createError2) {
        test.equal(createError2, null);

        serviceBusService.createTopic(topicName3, function (createError3) {
          test.equal(createError3, null);

          serviceBusService.createTopic(topicName4, function (createError4) {
            test.equal(createError4, null);

            // test top
            serviceBusService.listTopics({ top: 2 }, function (listError1, listTopics1) {
              test.equal(listError1, null);
              test.notEqual(listTopics1, null);
              test.equal(listTopics1.length, 2);

              // results are ordered by alphabetic order so
              // topicName1 and topicName2 should be in the result
              var topicCount = 0;
              for (var topic in listTopics1) {
                var currentTopic = listTopics1[topic];
                if (currentTopic.TopicName === topicName1) {
                  topicCount += 1;
                } else if (currentTopic.TopicName === topicName2) {
                  topicCount += 2;
                }
              }

              test.equal(topicCount, 3);

              // test skip
              serviceBusService.listTopics({ top: 2, skip: 1 }, function (listError2, listTopics2) {
                test.equal(listError2, null);
                test.notEqual(listTopics2, null);
                test.equal(listTopics2.length, 2);

                // results are ordered by alphabetic order so
                // topicName2 and topicName3 should be in the result
                topicCount = 0;
                for (topic in listTopics2) {
                  currentTopic = listTopics2[topic];
                  if (currentTopic.TopicName === topicName2) {
                    topicCount += 1;
                  } else if (currentTopic.TopicName === topicName3) {
                    topicCount += 2;
                  }
                }

                test.equal(topicCount, 3);

                test.done();
              });
            });
          });
        });
      });
    });
  },

  testCreateSubscription: function (test) {
    var topicName = testutil.generateId(topicNamesPrefix, topicNames);
    var subscriptionName1 = testutil.generateId(subscriptionNamesPrefix, subscriptionNames);
    var subscriptionName2 = testutil.generateId(subscriptionNamesPrefix, subscriptionNames);

    var subscriptionOptions = {
      LockDuration: 'PT5S',
      RequiresSession: true,
      DefaultMessageTimeToLive: 'PT5S',
      DeadLetteringOnMessageExpiration: true,
      DeadLetteringOnFilterEvaluationExceptions: true
    };

    // Invalid topic name
    serviceBusService.createSubscription('MyFakeTopic', subscriptionName1, subscriptionOptions, function (fakeCreateSubscriptionError, fakeSubscription) {
      test.notEqual(fakeCreateSubscriptionError, null);
      test.equal(fakeSubscription, null);

      serviceBusService.createTopic(topicName, function (createError, topic) {
        test.equal(createError, null);
        test.notEqual(topic, null);

        serviceBusService.createSubscription(topicName, subscriptionName1, subscriptionOptions, function (createSubscriptionError1, subscription1) {
          test.equal(createSubscriptionError1, null);
          test.notEqual(subscription1, null);

          serviceBusService.createSubscription(topicName, subscriptionName2, subscriptionOptions, function (createSubscriptionError2, subscription2) {
            test.equal(createSubscriptionError2, null);
            test.notEqual(subscription2, null);

            test.equal(subscription2.LockDuration, subscriptionOptions.LockDuration);
            test.equal(subscription2.RequiresSession, subscriptionOptions.RequiresSession);
            test.equal(subscription2.DefaultMessageTimeToLive, subscriptionOptions.DefaultMessageTimeToLive);
            test.equal(subscription2.DeadLetteringOnMessageExpiration, subscriptionOptions.DeadLetteringOnMessageExpiration);
            test.equal(subscription2.DeadLetteringOnFilterEvaluationExceptions, subscriptionOptions.DeadLetteringOnFilterEvaluationExceptions);

            // duplicate subscription
            serviceBusService.createSubscription(topicName, subscriptionName1, function (subscriptionError, duplicateSubscription) {
              test.notEqual(subscriptionError, null);
              test.equal(duplicateSubscription, null);

              servicebustestutil.checkNullParameter(function () {
                serviceBusService.createSubscription(null, subscriptionName1, function() { });
              });

              servicebustestutil.checkNullParameter(function () {
                serviceBusService.createSubscription(topicName, null, function() { });
              });

              test.done();
            });
          });
        });
      });
    });
  },

  testDeleteSubscription: function (test) {
    var topicName = testutil.generateId(topicNamesPrefix, topicNames);
    var subscriptionName = testutil.generateId(subscriptionNamesPrefix, subscriptionNames);

    serviceBusService.deleteSubscription(topicName, subscriptionName, function (error1) {
      test.notEqual(error1, null);
      test.equal(error1.code, '404');

      serviceBusService.createTopic(topicName, function (error2, createResponse1) {
        test.equal(error2, null);
        test.notEqual(createResponse1, null);

        serviceBusService.createSubscription(topicName, subscriptionName, function (error3, createResponse3) {
          test.equal(error3, null);
          test.notEqual(createResponse3, null);

          serviceBusService.deleteSubscription(topicName, subscriptionName, function (error4, deleteResponse4) {
            test.equal(error4, null);
            test.notEqual(deleteResponse4, null);

            serviceBusService.getSubscription(topicName, subscriptionName, function (getError, sub) {
              test.notEqual(getError, null);
              test.equal(sub, null);

              servicebustestutil.checkNullParameter(function () {
                serviceBusService.deleteSubscription(null, subscriptionName, function() { });
              });

              servicebustestutil.checkNullParameter(function () {
                serviceBusService.deleteSubscription(topicName, null, function() { });
              });

              test.done();
            });
          });
        });
      });
    });
  },

  testGetSubscription: function (test) {
    var topicName = testutil.generateId(topicNamesPrefix, topicNames);
    var subscriptionName = testutil.generateId(subscriptionNamesPrefix, subscriptionNames);

    serviceBusService.getSubscription(topicName, subscriptionName, function (getError1, getSub1) {
      test.notEqual(getError1, null);
      test.equal(getSub1, null);

      serviceBusService.createTopic(topicName, function (createError1, topic) {
        test.equal(createError1, null);
        test.notEqual(topic, null);

        serviceBusService.createSubscription(topicName, subscriptionName, function (createError2, subscription) {
          test.equal(createError2, null);
          test.notEqual(subscription, null);

          serviceBusService.getSubscription(topicName, subscriptionName, function (getError, getSubscription) {
            test.equal(getError, null);
            test.notEqual(getSubscription, null);

            test.notEqual(getSubscription.LockDuration, null);
            test.notEqual(getSubscription.RequiresSession, null);
            test.notEqual(getSubscription.DefaultMessageTimeToLive, null);
            test.notEqual(getSubscription.DeadLetteringOnMessageExpiration, null);
            test.notEqual(getSubscription.DeadLetteringOnFilterEvaluationExceptions, null);

            servicebustestutil.checkNullParameter(function () {
              serviceBusService.getSubscription(null, subscriptionName, function() { });
            });

            servicebustestutil.checkNullParameter(function () {
              serviceBusService.getSubscription(topicName, null, function() { });
            });

            test.done();
          });
        });
      });
    });
  },

  testListSubscriptions: function (test) {
    var topicName = testutil.generateId(topicNamesPrefix, topicNames);
    var subscriptionName1 = testutil.generateId(subscriptionNamesPrefix, subscriptionNames);
    var subscriptionName2 = testutil.generateId(subscriptionNamesPrefix, subscriptionNames);

    // topic doesnt exist
    serviceBusService.listSubscriptions(topicName, function (listError1, subscriptions1) {
      test.notEqual(listError1, null);
      test.equal(subscriptions1, null);

      serviceBusService.createTopic(topicName, function (createError1, topic) {
        test.equal(createError1, null);
        test.notEqual(topic, null);

        // No subscriptions on the topic yet
        serviceBusService.listSubscriptions(topicName, function (listError2, subscriptions2) {
          test.equal(listError2, null);
          test.notEqual(subscriptions2, null);
          test.equal(subscriptions2.length, 0);

          serviceBusService.createSubscription(topicName, subscriptionName1, function (createError2, subscription1) {
            test.equal(createError2, null);
            test.notEqual(subscription1, null);

            // Single subscription
            serviceBusService.listSubscriptions(topicName, function (listError3, subscriptions3) {
              test.equal(listError3, null);
              test.notEqual(subscriptions3, null);
              test.equal(subscriptions3.length, 1);

              serviceBusService.createSubscription(topicName, subscriptionName2, function (createError3, subscription2) {
                test.equal(createError3, null);
                test.notEqual(subscription2, null);

                serviceBusService.listSubscriptions(topicName, function (listError, subscriptions) {
                  test.equal(listError, null);
                  test.notEqual(subscriptions, null);
                  test.equal(subscriptions.length, 2);

                  var subscriptionsCount = 0;
                  for (var subscription in subscriptions) {
                    var currentSubscription = subscriptions[subscription];

                    test.notEqual(currentSubscription.LockDuration, null);
                    test.notEqual(currentSubscription.RequiresSession, null);
                    test.notEqual(currentSubscription.DefaultMessageTimeToLive, null);
                    test.notEqual(currentSubscription.DeadLetteringOnMessageExpiration, null);
                    test.notEqual(currentSubscription.DeadLetteringOnFilterEvaluationExceptions, null);

                    if (currentSubscription.SubscriptionName === subscriptionName1) {
                      subscriptionsCount += 1;
                    } else if (currentSubscription.SubscriptionName === subscriptionName2) {
                      subscriptionsCount += 2;
                    }
                  }

                  test.equal(subscriptionsCount, 3);

                  test.done();
                });
              });
            });
          });
        });
      });
    });
  },

  testListSubscriptionsRanges: function (test) {
    var topicName = testutil.generateId(topicNamesPrefix, topicNames);
    var subscriptionName1 = '1' + testutil.generateId(subscriptionNamesPrefix, subscriptionNames);
    var subscriptionName2 = '2' + testutil.generateId(subscriptionNamesPrefix, subscriptionNames);
    var subscriptionName3 = '3' + testutil.generateId(subscriptionNamesPrefix, subscriptionNames);
    var subscriptionName4 = '4' + testutil.generateId(subscriptionNamesPrefix, subscriptionNames);

    serviceBusService.createTopic(topicName, function (createError0) {
      test.equal(createError0, null);

      serviceBusService.createSubscription(topicName, subscriptionName1, function (createError1) {
        test.equal(createError1, null);

        serviceBusService.createSubscription(topicName, subscriptionName2, function (createError2) {
          test.equal(createError2, null);

          serviceBusService.createSubscription(topicName, subscriptionName3, function (createError3) {
            test.equal(createError3, null);

            serviceBusService.createSubscription(topicName, subscriptionName4, function (createError4) {
              test.equal(createError4, null);

              // test top
              serviceBusService.listSubscriptions(topicName, { top: 2 }, function (listError1, listSubscriptions1) {
                test.equal(listError1, null);
                test.notEqual(listSubscriptions1, null);
                test.equal(listSubscriptions1.length, 2);

                // results are ordered by alphabetic order so
                // subscriptionName1 and subscriptionName2 should be in the result
                var subscriptionCount = 0;
                for (var subscription in listSubscriptions1) {
                  var currentSubscription = listSubscriptions1[subscription];
                  if (currentSubscription.SubscriptionName === subscriptionName1) {
                    subscriptionCount += 1;
                  } else if (currentSubscription.SubscriptionName === subscriptionName2) {
                    subscriptionCount += 2;
                  }
                }

                test.equal(subscriptionCount, 3);

                // test skip
                serviceBusService.listSubscriptions(topicName, { top: 2, skip: 1 }, function (listError2, listSubscriptions2) {
                  test.equal(listError2, null);
                  test.notEqual(listSubscriptions2, null);
                  test.equal(listSubscriptions2.length, 2);

                  // results are ordered by alphabetic order so
                  // subscriptionName2 and subscriptionName3 should be in the result
                  subscriptionCount = 0;
                  for (topic in listSubscriptions2) {
                    currentSubscription = listSubscriptions2[topic];
                    if (currentSubscription.SubscriptionName === subscriptionName2) {
                      subscriptionCount += 1;
                    } else if (currentSubscription.SubscriptionName === subscriptionName3) {
                      subscriptionCount += 2;
                    }
                  }

                  test.equal(subscriptionCount, 3);

                  test.done();
                });
              });
            });
          });
        });
      });
    });
  },

  testCreateRule: function (test) {
    var topicName = testutil.generateId(topicNamesPrefix, topicNames);
    var subscriptionName = testutil.generateId(subscriptionNamesPrefix, subscriptionNames);
    var ruleName1 = testutil.generateId(ruleNamesPrefix, ruleNames);
    var ruleOptions1 = {
      sqlExpressionFilter: 'Number=2'
    };

    var ruleName2 = testutil.generateId(ruleNamesPrefix, ruleNames);
    var ruleOptions2 = {
      correlationIdFilter: 'myId'
    };

    var ruleName3 = testutil.generateId(ruleNamesPrefix, ruleNames);
    var ruleOptions3 = {
      trueFilter: 'Number=2'
    };

    var ruleName4 = testutil.generateId(ruleNamesPrefix, ruleNames);
    var ruleOptions4 = {
      falseFilter: 'Number=2'
    };

    serviceBusService.createRule('FakeTopic', 'FakeSubscription', ruleName1, function (invalidCreateError, invalidRule1) {
      test.notEqual(invalidCreateError, null);
      test.equal(invalidRule1, null);

      serviceBusService.createRule(topicName, 'FakeSubscription', ruleName1, function (invalidCreateError2, invalidRule2) {
        test.notEqual(invalidCreateError2, null);
        test.equal(invalidRule2, null);

        serviceBusService.createTopic(topicName, function (createError, topic) {
          test.equal(createError, null);
          test.notEqual(topic, null);

          serviceBusService.createSubscription(topicName, subscriptionName, function (createSubscriptionError, subscription) {
            test.equal(createSubscriptionError, null);
            test.notEqual(subscription, null);

            serviceBusService.createRule(topicName, subscriptionName, ruleName1, ruleOptions1, function (createRuleError1, rule1) {
              test.equal(createRuleError1, null);
              test.notEqual(rule1, null);

              serviceBusService.createRule(topicName, subscriptionName, ruleName2, ruleOptions2, function (createRuleError2, rule2) {
                test.equal(createRuleError2, null);
                test.notEqual(rule2, null);

                serviceBusService.createRule(topicName, subscriptionName, ruleName3, ruleOptions3, function (createRuleError3, rule3) {
                  test.equal(createRuleError3, null);
                  test.notEqual(rule3, null);

                  serviceBusService.createRule(topicName, subscriptionName, ruleName4, ruleOptions4, function (createRuleError4, rule4) {
                    test.equal(createRuleError4, null);
                    test.notEqual(rule4, null);

                    // Existing rule...
                    serviceBusService.createRule(topicName, subscriptionName, ruleName1, function (duplicateError, duplicateRule) {
                      test.notEqual(duplicateError, null);
                      test.equal(duplicateRule, null);

                      servicebustestutil.checkNullParameter(function () {
                        serviceBusService.createRule(null, subscriptionName, ruleName1, ruleOptions1, function() { });
                      });

                      servicebustestutil.checkNullParameter(function () {
                        serviceBusService.createRule(topicName, null, ruleName1, ruleOptions1, function() { });
                      });

                      servicebustestutil.checkNullParameter(function () {
                        serviceBusService.createRule(topicName, subscriptionName, null, ruleOptions1, function() { });
                      });

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

  testSqlExpressionFilter: function (test) {
    var topicName = testutil.generateId(topicNamesPrefix, topicNames);
    var subscriptionName1 = testutil.generateId(subscriptionNamesPrefix, subscriptionNames);
    var subscriptionName2 = testutil.generateId(subscriptionNamesPrefix, subscriptionNames);

    var messageText1 = 'hi there topic';
    var messageText2 = 'hi there topic again';

    var ruleName = testutil.generateId(ruleNamesPrefix, ruleNames);
    var ruleOptions = {
      sqlExpressionFilter: 'property=1'
    };

    serviceBusService.createTopic(topicName, function (createTopicError) {
      test.equal(createTopicError, null);

      serviceBusService.createSubscription(topicName, subscriptionName1, function (createSubscriptionError1) {
        test.equal(createSubscriptionError1, null);

        serviceBusService.createSubscription(topicName, subscriptionName2, function (createSubscriptionError2) {
          test.equal(createSubscriptionError2, null);

          serviceBusService.deleteRule(topicName, subscriptionName1, ServiceBusConstants.DEFAULT_RULE_NAME, function (deleteRuleError) {
            test.equal(deleteRuleError, null);

            serviceBusService.createRule(topicName, subscriptionName1, ruleName, ruleOptions, function(createRuleError) {
              test.equal(createRuleError, null);

              // non matching property
              serviceBusService.sendTopicMessage(topicName, { body: messageText1, customProperties: { property: 2 } }, function(sendError1) {
                test.equal(sendError1, null);

                serviceBusService.receiveSubscriptionMessage(topicName, subscriptionName1, function(receiveError1, receiveMessage1) {
                  test.notEqual(receiveError1, null); // Nothing to receive
                  test.equal(receiveMessage1, null);

                  // matching property
                  serviceBusService.sendTopicMessage(topicName, { body: messageText2, customProperties: { property: 1 } }, function(sendError2) {
                    test.equal(sendError2, null);

                    serviceBusService.receiveSubscriptionMessage(topicName, subscriptionName1, function(receiveError2, receiveMessage2) {
                      test.equal(receiveError2, null);
                      test.notEqual(receiveMessage2, null);
                      test.equal(receiveMessage2.body, messageText2);

                      // subscription 2 can receive both messages
                      serviceBusService.receiveSubscriptionMessage(topicName, subscriptionName2, function(receiveError3, receiveMessage3) {
                        test.equal(receiveError3, null);
                        test.notEqual(receiveMessage3, null);
                        test.equal(receiveMessage3.body, messageText1);

                        serviceBusService.receiveSubscriptionMessage(topicName, subscriptionName2, function(receiveError4, receiveMessage4) {
                          test.equal(receiveError4, null);
                          test.notEqual(receiveMessage4, null);
                          test.equal(receiveMessage4.body, messageText2);

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
      });
    });
  },

  testCorrelationIdFilter: function (test) {
    var topicName = testutil.generateId(topicNamesPrefix, topicNames);
    var subscriptionName1 = testutil.generateId(subscriptionNamesPrefix, subscriptionNames);
    var subscriptionName2 = testutil.generateId(subscriptionNamesPrefix, subscriptionNames);

    var messageText1 = 'hi there topic';
    var messageText2 = 'hi there topic again';

    var ruleName = testutil.generateId(ruleNamesPrefix, ruleNames);
    var ruleOptions = {
      correlationIdFilter: 'myid'
    };

    serviceBusService.createTopic(topicName, function (createTopicError) {
      test.equal(createTopicError, null);

      serviceBusService.createSubscription(topicName, subscriptionName1, function (createSubscriptionError1) {
        test.equal(createSubscriptionError1, null);

        serviceBusService.createSubscription(topicName, subscriptionName2, function (createSubscriptionError2) {
          test.equal(createSubscriptionError2, null);

          serviceBusService.deleteRule(topicName, subscriptionName1, ServiceBusConstants.DEFAULT_RULE_NAME, function (deleteRuleError) {
            test.equal(deleteRuleError, null);

            serviceBusService.createRule(topicName, subscriptionName1, ruleName, ruleOptions, function (createRuleError) {
              test.equal(createRuleError, null);

              // non matching property
              serviceBusService.sendTopicMessage(topicName, { body: messageText1, brokerProperties: { CorrelationId: 'otherid'} }, function (sendError1) {
                test.equal(sendError1, null);

                serviceBusService.receiveSubscriptionMessage(topicName, subscriptionName1, function (receiveError1, receiveMessage1) {
                  test.notEqual(receiveError1, null); // Nothing to receive
                  test.equal(receiveMessage1, null);

                  // matching property
                  serviceBusService.sendTopicMessage(topicName, { body: messageText2, brokerProperties: { CorrelationId: 'myid'} }, function (sendError2) {
                    test.equal(sendError2, null);

                    serviceBusService.receiveSubscriptionMessage(topicName, subscriptionName1, function (receiveError2, receiveMessage2) {
                      test.equal(receiveError2, null);
                      test.notEqual(receiveMessage2, null);
                      test.equal(receiveMessage2.body, messageText2);

                      // subscription 2 can receive both messages
                      serviceBusService.receiveSubscriptionMessage(topicName, subscriptionName2, function (receiveError3, receiveMessage3) {
                        test.equal(receiveError3, null);
                        test.notEqual(receiveMessage3, null);
                        test.equal(receiveMessage3.body, messageText1);

                        serviceBusService.receiveSubscriptionMessage(topicName, subscriptionName2, function (receiveError4, receiveMessage4) {
                          test.equal(receiveError4, null);
                          test.notEqual(receiveMessage4, null);
                          test.equal(receiveMessage4.body, messageText2);

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
      });
    });
  },

  testDeleteRule: function (test) {
    var topicName = testutil.generateId(topicNamesPrefix, topicNames);
    var subscriptionName = testutil.generateId(subscriptionNamesPrefix, subscriptionNames);
    var ruleName = testutil.generateId(ruleNamesPrefix, ruleNames);

    serviceBusService.deleteRule(topicName, subscriptionName, ruleName, function (error1) {
      test.notEqual(error1, null);
      test.equal(error1.code, '404');

      serviceBusService.createTopic(topicName, function (error2, createResponse1) {
        test.equal(error2, null);
        test.notEqual(createResponse1, null);

        serviceBusService.createSubscription(topicName, subscriptionName, function (error3, createResponse3) {
          test.equal(error3, null);
          test.notEqual(createResponse3, null);

          serviceBusService.createRule(topicName, subscriptionName, ruleName, function (error4, createResponse4) {
            test.equal(error4, null);
            test.notEqual(createResponse4, null);

            serviceBusService.deleteRule(topicName, subscriptionName, ruleName, function (error5, deleteResponse5) {
              test.equal(error5, null);
              test.notEqual(deleteResponse5, null);

              serviceBusService.getRule(topicName, subscriptionName, ruleName, function (error6, deletedRule) {
                test.notEqual(error6, null);
                test.equal(deletedRule, null);

                servicebustestutil.checkNullParameter(function () {
                  serviceBusService.deleteRule(null, subscriptionName, ruleName, function() { });
                });

                servicebustestutil.checkNullParameter(function () {
                  serviceBusService.deleteRule(topicName, null, ruleName, function() { });
                });

                servicebustestutil.checkNullParameter(function () {
                  serviceBusService.deleteRule(topicName, subscriptionName, null, function() { });
                });

                test.done();
              });
            });
          });
        });
      });
    });
  },

  testListRule: function (test) {
    var topicName = testutil.generateId(topicNamesPrefix, topicNames);
    var subscriptionName = testutil.generateId(subscriptionNamesPrefix, subscriptionNames);
    var ruleName1 = testutil.generateId(ruleNamesPrefix, ruleNames);
    var ruleName2 = testutil.generateId(ruleNamesPrefix, ruleNames);

    // Invalid topic
    serviceBusService.listRules(topicName, subscriptionName, function (listError1, rulesList1) {
      test.notEqual(listError1, null);
      test.equal(rulesList1, null);

      serviceBusService.createTopic(topicName, function (createError, topic) {
        test.equal(createError, null);
        test.notEqual(topic, null);

        // Invalid subscription
        serviceBusService.listRules(topicName, subscriptionName, function (listError2, rulesList2) {
          test.notEqual(listError2, null);
          test.equal(rulesList2, null);

          serviceBusService.createSubscription(topicName, subscriptionName, function (createSubscriptionError, subscription) {
            test.equal(createSubscriptionError, null);
            test.notEqual(subscription, null);

            // There's always a $Default rule
            serviceBusService.listRules(topicName, subscriptionName, function (listError3, rulesList3) {
              test.equal(listError3, null);
              test.notEqual(rulesList3, null);
              test.equal(rulesList3.length, 1);

              serviceBusService.createRule(topicName, subscriptionName, ruleName1, function (createRuleError1, rule1) {
                test.equal(createRuleError1, null);
                test.notEqual(rule1, null);

                // Two rules ($Default + one that was just added)
                serviceBusService.listRules(topicName, subscriptionName, function (listError4, rulesList4) {
                  test.equal(listError4, null);
                  test.notEqual(rulesList4, null);
                  test.equal(rulesList4.length, 2);

                  serviceBusService.createRule(topicName, subscriptionName, ruleName2, function (createRuleError2, rule2) {
                    test.equal(createRuleError2, null);
                    test.notEqual(rule2, null);

                    // multiple rules
                    serviceBusService.listRules(topicName, subscriptionName, function (listError, rules) {
                      test.equal(listError, null);
                      test.notEqual(rules, null);
                      test.equal(rules.length, 3);

                      var ruleCount = 0;
                      for (var rule in rules) {
                        var currentRule = rules[rule];

                        test.notEqual(currentRule.Filter, null);
                        test.notEqual(currentRule.Action, null);

                        if (currentRule.RuleName === ruleName1) {
                          ruleCount += 1;
                        } else if (currentRule.RuleName === ruleName2) {
                          ruleCount += 2;
                        }
                      }

                      test.equal(ruleCount, 3);

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

  testListRulesRanges: function (test) {
    var topicName = testutil.generateId(topicNamesPrefix, topicNames);
    var subscriptionName = testutil.generateId(subscriptionNamesPrefix, subscriptionNames);
    var ruleName1 = '1' + testutil.generateId(ruleNamesPrefix, ruleNames);
    var ruleName2 = '2' + testutil.generateId(ruleNamesPrefix, ruleNames);
    var ruleName3 = '3' + testutil.generateId(ruleNamesPrefix, ruleNames);
    var ruleName4 = '4' + testutil.generateId(ruleNamesPrefix, ruleNames);

    serviceBusService.createTopic(topicName, function (createError0) {
      test.equal(createError0, null);

      serviceBusService.createSubscription(topicName, subscriptionName, function (createError1) {
        test.equal(createError1, null);

        serviceBusService.createRule(topicName, subscriptionName, ruleName1, function (createError2) {
          test.equal(createError2, null);

          serviceBusService.createRule(topicName, subscriptionName, ruleName2, function (createError3) {
            test.equal(createError3, null);

            serviceBusService.createRule(topicName, subscriptionName, ruleName3, function (createError4) {
              test.equal(createError4, null);

              serviceBusService.createRule(topicName, subscriptionName, ruleName4, function (createError5) {
                test.equal(createError5, null);

                // test top
                serviceBusService.listRules(topicName, subscriptionName, { top: 2 }, function (listError1, listRules1) {
                  test.equal(listError1, null);
                  test.notEqual(listRules1, null);
                  test.equal(listRules1.length, 2);

                  // results are ordered by alphabetic order so
                  // ruleName1 and ruleName2 should be in the result
                  var ruleCount = 0;
                  for (var rule in listRules1) {
                    var currentRule = listRules1[rule];
                    if (currentRule.RuleName === ServiceBusConstants.DEFAULT_RULE_NAME) {
                      ruleCount += 1;
                    } else if (currentRule.RuleName === ruleName1) {
                      ruleCount += 2;
                    }
                  }

                  test.equal(ruleCount, 3);

                  // test skip
                  serviceBusService.listRules(topicName, subscriptionName, { top: 2, skip: 1 }, function (listError2, listRules2) {
                    test.equal(listError2, null);
                    test.notEqual(listRules2, null);
                    test.equal(listRules2.length, 2);

                    // results are ordered by alphabetic order so
                    // ruleName2 and ruleName3 should be in the result
                    ruleCount = 0;
                    for (rule in listRules2) {
                      currentRule = listRules2[rule];
                      if (currentRule.RuleName === ruleName1) {
                        ruleCount += 1;
                      } else if (currentRule.RuleName === ruleName2) {
                        ruleCount += 2;
                      }
                    }

                    test.equal(ruleCount, 3);

                    test.done();
                  });
                });
              });
            });
          });
        });
      });
    });
  }
});