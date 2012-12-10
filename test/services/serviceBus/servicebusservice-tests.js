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

var assert = require('assert');


// Test includes
var testutil = require('../../util/util');
var servicebustestutil = require('../../util/servicebus-test-utils');

// Lib includes
var azure = testutil.libRequire('azure');
var azureutil = testutil.libRequire('util/util');
var ISO8061Date = testutil.libRequire('util/iso8061date');

var ServiceClient = azure.ServiceClient;
var Constants = azure.Constants;
var HttpConstants = Constants.HttpConstants;
var StorageErrorCodeStrings = Constants.StorageErrorCodeStrings;
var ServiceBusConstants = Constants.ServiceBusConstants;
var QueryStringConstants = Constants.QueryStringConstants;

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
var numberTests = 33;

suite('servicebusservice-tests', function () {
  setup(function (done) {
    servicebustestutil.setUpTest(testPrefix, function (err, newServiceBusService) {
      serviceBusService = newServiceBusService;
      done();
    });
  });

  teardown(function (done) {
    servicebustestutil.tearDownTest(numberTests, serviceBusService, testPrefix, done);
  });

  test('CreateQueue', function (done) {
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
      assert.equal(createError, null);
      servicebustestutil.validateQueue(assert, queueName, queueOptions, queue);

      // Validate appropriate error for existing queue
      serviceBusService.createQueue(queueName, queueOptions, function (createError2) {
        // TODO, validate the actual error
        assert.notEqual(createError2, null);

        servicebustestutil.checkNullParameter(function () {
          serviceBusService.createQueue(null, function () { });
        });

        done();
      });
    });
  });

  test('CreateQueueIfNotExists', function (done) {
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
      assert.equal(createError, null);
      assert.equal(created, true);

      serviceBusService.getQueue(queueName, function (error, queue) {
        servicebustestutil.validateQueue(assert, queueName, queueOptions, queue);

        // try creating queue again
        serviceBusService.createQueueIfNotExists(queueName, function (createError2, created2) {
          assert.equal(createError2, null);
          assert.equal(created2, false);

          servicebustestutil.checkNullParameter(function () {
            serviceBusService.createQueueIfNotExists(null, function () { });
          });

          done();
        });
      });
    });
  });

  test('DeleteQueue', function (done) {
    var queueName = testutil.generateId(queueNamesPrefix, queueNames);

    serviceBusService.deleteQueue(queueName, function (error1) {
      assert.notEqual(error1, null);
      assert.equal(error1.code, '404');

      serviceBusService.createQueue(queueName, function (error2, createResponse1) {
        assert.equal(error2, null);
        assert.notEqual(createResponse1, null);

        serviceBusService.getQueue(queueName, function (error3, createdQueue) {
          assert.equal(error3, null);
          assert.notEqual(createdQueue, null);
          assert.equal(createdQueue.QueueName, queueName);

          serviceBusService.deleteQueue(queueName, function (error4, deleteResponse2) {
            assert.equal(error4, null);
            assert.notEqual(deleteResponse2, null);

            serviceBusService.getQueue(queueName, function (error5, queueDeleting) {
              assert.notEqual(error5, null);
              assert.equal(queueDeleting, null);
              servicebustestutil.checkNullParameter(function () {
                serviceBusService.deleteQueue(null, function () { });
              });
              done();
            });
          });
        });
      });
    });
  });

  test('GetQueue', function (done) {
    var queueName = testutil.generateId(queueNamesPrefix, queueNames);

    serviceBusService.getQueue(queueName, function (getError1, getQueue1) {
      assert.notEqual(getError1, null);
      assert.equal(getQueue1, null);

      serviceBusService.createQueue(queueName, function (createError, queue) {
        assert.equal(createError, null);
        assert.notEqual(queue, null);

        // Getting existant queue
        serviceBusService.getQueue(queueName, function (getError2, getQueue2) {
          assert.equal(getError2, null);
          assert.notEqual(getQueue2, null);

          servicebustestutil.checkNullParameter(function () {
            serviceBusService.getQueue(null, function () { });
          });
          done();
        });
      });
    });
  });

  test('ListQueue', function (done) {
    var queueName1 = testutil.generateId(queueNamesPrefix, queueNames);
    var queueName2 = testutil.generateId(queueNamesPrefix, queueNames);

    // listing without any queue
    serviceBusService.listQueues(function (emptyError, emptyQueues) {
      assert.equal(emptyError, null);
      assert.notEqual(emptyQueues, null);
      assert.equal(emptyQueues.length, 0);

      serviceBusService.createQueue(queueName1, function (createError1, queue1) {
        assert.equal(createError1, null);
        assert.notEqual(queue1, null);

        // Listing with only one queue
        serviceBusService.listQueues(function (oneQueueError, oneQueue) {
          assert.equal(oneQueueError, null);
          assert.notEqual(oneQueue, null);
          assert.equal(oneQueue.length, 1);

          serviceBusService.createQueue(queueName2, function (createError2, queue2) {
            assert.equal(createError2, null);
            assert.notEqual(queue2, null);

            // Listing with multiple queues.
            serviceBusService.listQueues(function (getError, queues) {
              assert.equal(getError, null);
              assert.notEqual(queues, null);
              assert.equal(queues.length, 2);

              var queueCount = 0;
              for (var queue in queues) {
                var currentQueue = queues[queue];

                assert.notEqual(currentQueue[ServiceBusConstants.LOCK_DURATION], null);
                assert.notEqual(currentQueue[ServiceBusConstants.MAX_SIZE_IN_MEGABYTES], null);
                assert.notEqual(currentQueue[ServiceBusConstants.REQUIRES_DUPLICATE_DETECTION], null);
                assert.notEqual(currentQueue[ServiceBusConstants.REQUIRES_SESSION], null);
                assert.notEqual(currentQueue[ServiceBusConstants.DEFAULT_MESSAGE_TIME_TO_LIVE], null);
                assert.notEqual(currentQueue[ServiceBusConstants.DEAD_LETTERING_ON_MESSAGE_EXPIRATION], null);
                assert.notEqual(currentQueue[ServiceBusConstants.DUPLICATE_DETECTION_HISTORY_TIME_WINDOW], null);
                assert.notEqual(currentQueue[ServiceBusConstants.MAX_DELIVERY_COUNT], null);
                assert.notEqual(currentQueue[ServiceBusConstants.ENABLE_BATCHED_OPERATIONS], null);
                assert.notEqual(currentQueue[ServiceBusConstants.SIZE_IN_BYTES], null);
                assert.notEqual(currentQueue[ServiceBusConstants.MESSAGE_COUNT], null);

                if (currentQueue.QueueName === queueName1) {
                  queueCount += 1;
                } else if (currentQueue.QueueName === queueName2) {
                  queueCount += 2;
                }
              }

              assert.equal(queueCount, 3);

              done();
            });
          });
        });
      });
    });
  });

  test('ListQueueRanges', function (done) {
    var queueName1 = '1' + testutil.generateId(queueNamesPrefix, queueNames);
    var queueName2 = '2' + testutil.generateId(queueNamesPrefix, queueNames);
    var queueName3 = '3' + testutil.generateId(queueNamesPrefix, queueNames);
    var queueName4 = '4' + testutil.generateId(queueNamesPrefix, queueNames);

    serviceBusService.createQueue(queueName1, function (createError1) {
      assert.equal(createError1, null);

      serviceBusService.createQueue(queueName2, function (createError2) {
        assert.equal(createError2, null);

        serviceBusService.createQueue(queueName3, function (createError3) {
          assert.equal(createError3, null);

          serviceBusService.createQueue(queueName4, function (createError4) {
            assert.equal(createError4, null);

            // test top
            serviceBusService.listQueues({ top: 2 }, function (listError1, listQueues1) {
              assert.equal(listError1, null);
              assert.notEqual(listQueues1, null);
              assert.equal(listQueues1.length, 2);

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

              assert.equal(queueCount, 3);

              // test skip
              serviceBusService.listQueues({ top: 2, skip: 1 }, function (listError2, listQueues2) {
                assert.equal(listError2, null);
                assert.notEqual(listQueues2, null);
                assert.equal(listQueues2.length, 2);

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

                assert.equal(queueCount, 3);

                done();
              });
            });
          });
        });
      });
    });
  });

  test('SendQueueMessage', function (done) {
    var queueName = testutil.generateId(queueNamesPrefix, queueNames);

    serviceBusService.createQueue(queueName, function (createError, queue) {
      assert.equal(createError, null);
      assert.notEqual(queue, null);

      serviceBusService.sendQueueMessage(queueName, 'hi there', function (sendError) {
        assert.equal(sendError, null);

        servicebustestutil.checkNullParameter(function () {
          serviceBusService.sendQueueMessage(null, 'hello again', function () { });
        });
        done();
      });
    });
  });

  test('SendMessageProperties', function (done) {
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
      assert.equal(createError, null);
      assert.notEqual(queue, null);

      serviceBusService.sendQueueMessage(queueName, message, function (sendError) {
        assert.equal(sendError, null);

        serviceBusService.receiveQueueMessage(queueName, function (receiveError, messageReceived) {
          assert.equal(receiveError, null);
          assert.notEqual(messageReceived, null);

          assert.equal(messageReceived.body, message.body);
          assert.equal(messageReceived.contentType, message.contentType);
          assert.equal(messageReceived.brokerProperties.CorrelationId, message.brokerProperties.CorrelationId);
          assert.equal(messageReceived.brokerProperties.SessionId, message.brokerProperties.SessionId);
          assert.equal(messageReceived.brokerProperties.MessageId, message.brokerProperties.MessageId);
          assert.equal(messageReceived.brokerProperties.Label, message.brokerProperties.Label);
          assert.equal(messageReceived.brokerProperties.ReplyTo, message.brokerProperties.ReplyTo);
          assert.equal(messageReceived.brokerProperties.To, message.brokerProperties.To);
          assert.equal(messageReceived.brokerProperties.ReplyToSessionId, message.brokerProperties.ReplyToSessionId);
          done();
        });
      });
    });
  });

  test('MessageCustomProperties', function (done) {
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
      assert.equal(createError, null);
      assert.notEqual(queue, null);

      serviceBusService.sendQueueMessage(queueName, message, function (sendError) {
        assert.equal(sendError, null);

        // read the message
        serviceBusService.receiveQueueMessage(queueName, function (receiveError, receivedMessage) {
          assert.equal(receiveError, null);
          assert.equal(receivedMessage.body, message.body);
          assert.strictEqual(receivedMessage.customProperties.propint, message.customProperties.propint);
          assert.strictEqual(receivedMessage.customProperties.propfloat, message.customProperties.propfloat);
          assert.deepEqual(receivedMessage.customProperties.propdate.valueOf(), message.customProperties.propdate.valueOf());
          assert.strictEqual(receivedMessage.customProperties.propstring, message.customProperties.propstring);

          serviceBusService.receiveQueueMessage(queueName, function (receiveError2, emptyMessage) {
            assert.notEqual(receiveError2, null);
            assert.equal(emptyMessage, null);

            done();
          });
        });
      });
    });
  });

  test('ReceiveQueueMessage', function (done) {
    var queueName = testutil.generateId(queueNamesPrefix, queueNames);
    var messageText = 'hi there again';

    serviceBusService.createQueue(queueName, function (createError, queue) {
      assert.equal(createError, null);
      assert.notEqual(queue, null);

      serviceBusService.sendQueueMessage(queueName, messageText, function (sendError) {
        assert.equal(sendError, null);

        // read the message
        serviceBusService.receiveQueueMessage(queueName, function (receiveError, message) {
          assert.equal(receiveError, null);
          assert.equal(message.body, messageText);

          serviceBusService.receiveQueueMessage(queueName, function (receiveError2, emptyMessage) {
            assert.notEqual(receiveError2, null);
            assert.equal(emptyMessage, null);

            servicebustestutil.checkNullParameter(function () {
              serviceBusService.receiveQueueMessage(null, function () { });
            });
            done();
          });
        });
      });
    });
  });

  test('PeekLockedMessageCanBeCompleted', function (done) {
    var queueName = testutil.generateId(queueNamesPrefix, queueNames);
    var messageText = 'hi there again';

    serviceBusService.createQueue(queueName, function (createError, queue) {
      assert.equal(createError, null);
      assert.notEqual(queue, null);

      serviceBusService.sendQueueMessage(queueName, messageText, function (sendError) {
        assert.equal(sendError, null);

        // Peek the message
        serviceBusService.receiveQueueMessage(queueName, { isPeekLock: true, timeoutIntervalInS: 5 }, function (receiveError, message) {
          assert.equal(receiveError, null);
          assert.equal(message.body, messageText);

          assert.notEqual(message.location, null);
          assert.notEqual(message.brokerProperties.LockToken, null);
          assert.notEqual(message.brokerProperties.LockedUntilUtc, null);

          // deleted message
          serviceBusService.deleteMessage(message.location, function (deleteError) {
            assert.equal(deleteError, null);

            done();
          });
        });
      });
    });
  });

  test('PeekLockedMessageCanBeCompletedWithObject', function (done) {
    var queueName = testutil.generateId(queueNamesPrefix, queueNames);
    var messageText = 'hi there again';

    serviceBusService.createQueue(queueName, function (createError, queue) {
      assert.equal(createError, null);
      assert.notEqual(queue, null);

      serviceBusService.sendQueueMessage(queueName, messageText, function (sendError) {
        assert.equal(sendError, null);

        // Peek the message
        serviceBusService.receiveQueueMessage(queueName, { isPeekLock: true, timeoutIntervalInS: 5 }, function (receiveError, message) {
          assert.equal(receiveError, null);
          assert.equal(message.body, messageText);

          assert.notEqual(message.location, null);
          assert.notEqual(message.brokerProperties.LockToken, null);
          assert.notEqual(message.brokerProperties.LockedUntilUtc, null);

          // deleted message
          serviceBusService.deleteMessage(message, function (deleteError) {
            assert.equal(deleteError, null);

            done();
          });
        });
      });
    });
  });

  test('PeekLockedMessageCanBeUnlocked', function (done) {
    var queueName = testutil.generateId(queueNamesPrefix, queueNames);
    var messageText = 'hi there again';

    serviceBusService.createQueue(queueName, function (createError, queue) {
      assert.equal(createError, null);
      assert.notEqual(queue, null);

      serviceBusService.sendQueueMessage(queueName, messageText, function (sendError) {
        assert.equal(sendError, null);

        // Peek the message
        serviceBusService.receiveQueueMessage(queueName, { isPeekLock: true, timeoutIntervalInS: 5 }, function (receiveError1, message1) {
          assert.equal(receiveError1, null);
          assert.equal(message1.body, messageText);

          assert.notEqual(message1.location, null);
          assert.notEqual(message1.brokerProperties.LockToken, null);
          assert.notEqual(message1.brokerProperties.LockedUntilUtc, null);

          // deleted message
          serviceBusService.unlockMessage(message1.location, function (unlockError) {
            assert.equal(unlockError, null);

            serviceBusService.receiveQueueMessage(queueName, function (receiveError2, receiveMessage2) {
              assert.equal(receiveError2, null);
              assert.notEqual(receiveMessage2, null);

              done();
            });
          });
        });
      });
    });
  });

  test('PeekLockedMessageCanBeUnlockedWithObject', function (done) {
    var queueName = testutil.generateId(queueNamesPrefix, queueNames);
    var messageText = 'hi there again';

    serviceBusService.createQueue(queueName, function (createError, queue) {
      assert.equal(createError, null);
      assert.notEqual(queue, null);

      serviceBusService.sendQueueMessage(queueName, messageText, function (sendError) {
        assert.equal(sendError, null);

        // Peek the message
        serviceBusService.receiveQueueMessage(queueName, { isPeekLock: true, timeoutIntervalInS: 5 }, function (receiveError1, message1) {
          assert.equal(receiveError1, null);
          assert.equal(message1.body, messageText);

          assert.notEqual(message1.location, null);
          assert.notEqual(message1.brokerProperties.LockToken, null);
          assert.notEqual(message1.brokerProperties.LockedUntilUtc, null);

          // deleted message
          serviceBusService.unlockMessage(message1, function (unlockError) {
            assert.equal(unlockError, null);

            serviceBusService.receiveQueueMessage(queueName, function (receiveError2, receiveMessage2) {
              assert.equal(receiveError2, null);
              assert.notEqual(receiveMessage2, null);

              done();
            });
          });
        });
      });
    });
  });

  test('CreateTopic', function (done) {
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
      assert.equal(createError, null);
      assert.notEqual(topic, null);
      if (topic) {
        assert.equal(topic.TopicName, topicName);

        assert.equal(topic.MaxSizeInMegabytes, topicOptions.MaxSizeInMegabytes.toString());
        assert.equal(topic.RequiresDuplicateDetection, topicOptions.RequiresDuplicateDetection.toString());
        assert.equal(topic.DefaultMessageTimeToLive, topicOptions.DefaultMessageTimeToLive.toString());
        assert.equal(topic.DuplicateDetectionHistoryTimeWindow, topicOptions.DuplicateDetectionHistoryTimeWindow.toString());
        assert.equal(topic.EnableBatchedOperations, topicOptions.EnableBatchedOperations.toString());
        assert.equal(topic.SizeInBytes, topicOptions.SizeInBytes.toString());
      }

      servicebustestutil.checkNullParameter(function () {
        serviceBusService.createTopic(null, topicOptions, function () { });
      });
      done();
    });
  });

  test('CreateTopicIfNotExists', function (done) {
    var topicName = testutil.generateId(topicNamesPrefix, topicNames);
    var topicOptions = {
      MaxSizeInMegabytes: '2048',
      RequiresDuplicateDetection: false,
      DefaultMessageTimeToLive: 'PT5S',
      DuplicateDetectionHistoryTimeWindow: 'PT55S'
    };

    serviceBusService.createTopicIfNotExists(topicName, topicOptions, function (createError1, created1) {
      assert.equal(createError1, null);
      assert.equal(created1, true);

      serviceBusService.createTopicIfNotExists(topicName, function (createError2, created2) {
        assert.equal(createError2, null);
        assert.equal(created2, false);

        servicebustestutil.checkNullParameter(function () {
          serviceBusService.createTopicIfNotExists(null, topicOptions, function () { });
        });
        done();
      });
    });
  });

  test('SendTopicMessage', function (done) {
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
      assert.equal(createTopicError, null);

      serviceBusService.createSubscription(topicName, subscriptionName, function (createSubscriptionError) {
        assert.equal(createSubscriptionError, null);

        serviceBusService.sendTopicMessage(topicName, message, function (sendMessageError) {
          assert.equal(sendMessageError, null);

          serviceBusService.receiveSubscriptionMessage(topicName, subscriptionName, function (receiveSubscriptionError, messageReceived) {
            assert.equal(receiveSubscriptionError, null);
            assert.notEqual(messageReceived, null);
            assert.equal(messageReceived.body, message.body);

            assert.equal(messageReceived.contentType, message.contentType);
            assert.equal(messageReceived.brokerProperties.CorrelationId, message.brokerProperties.CorrelationId);
            assert.equal(messageReceived.brokerProperties.SessionId, message.brokerProperties.SessionId);
            assert.equal(messageReceived.brokerProperties.MessageId, message.brokerProperties.MessageId);
            assert.equal(messageReceived.brokerProperties.Label, message.brokerProperties.Label);
            assert.equal(messageReceived.brokerProperties.ReplyTo, message.brokerProperties.ReplyTo);
            assert.equal(messageReceived.brokerProperties.To, message.brokerProperties.To);
            assert.equal(messageReceived.brokerProperties.ReplyToSessionId, message.brokerProperties.ReplyToSessionId);

            servicebustestutil.checkNullParameter(function () {
              serviceBusService.sendTopicMessage(null, message, function () { });
            });

            servicebustestutil.checkNullParameter(function () {
              serviceBusService.receiveSubscriptionMessage(null, subscriptionName, function () { });
            });

            servicebustestutil.checkNullParameter(function () {
              serviceBusService.receiveSubscriptionMessage(topicName, null, function () { });
            });

            done();
          });
        });
      });
    });
  });

  test('DeleteTopic', function (done) {
    var topicName = testutil.generateId(topicNamesPrefix, topicNames);

    serviceBusService.deleteTopic(topicName, function (error1) {
      assert.notEqual(error1, null);
      assert.equal(error1.code, '404');

      serviceBusService.createTopic(topicName, function (error2, createResponse1) {
        assert.equal(error2, null);
        assert.notEqual(createResponse1, null);

        serviceBusService.deleteTopic(topicName, function (error3, deleteResponse2) {
          assert.equal(error3, null);
          assert.notEqual(deleteResponse2, null);

          serviceBusService.getTopic(topicName, function (error4, topicDeleting) {
            assert.notEqual(error4, null);
            assert.equal(topicDeleting, null);

            servicebustestutil.checkNullParameter(function () {
              serviceBusService.deleteTopic(null, function () { });
            });
            done();
          });
        });
      });
    });
  });

  test('GetTopic', function (done) {
    var topicName = testutil.generateId(topicNamesPrefix, topicNames);

    serviceBusService.getTopic(topicName, function (error, emptyTopic) {
      assert.notEqual(error, null);
      assert.equal(emptyTopic, null);

      serviceBusService.createTopic(topicName, function (createError, topic) {
        assert.equal(createError, null);
        assert.notEqual(topic, null);

        serviceBusService.getTopic(topicName, function (getError, getTopic) {
          assert.equal(getError, null);
          assert.notEqual(getTopic, null);

          servicebustestutil.checkNullParameter(function () {
            serviceBusService.getTopic(null, function () { });
          });

          done();
        });
      });
    });
  });

  test('ListTopics', function (done) {
    var topicName1 = testutil.generateId(topicNamesPrefix, topicNames);
    var topicName2 = testutil.generateId(topicNamesPrefix, topicNames);

    // listing without any topic
    serviceBusService.listTopics(function (listError1, listTopics1) {
      assert.equal(listError1, null);
      assert.notEqual(listTopics1, null);
      assert.equal(listTopics1.length, 0);

      serviceBusService.createTopic(topicName1, function (createError1, topic1) {
        assert.equal(createError1, null);
        assert.notEqual(topic1, null);

        // listing with a single topic
        serviceBusService.listTopics(function (listError2, listTopics2) {
          assert.equal(listError2, null);
          assert.notEqual(listTopics2, null);
          assert.equal(listTopics2.length, 1);

          serviceBusService.createTopic(topicName2, function (createError2, topic2) {
            assert.equal(createError2, null);
            assert.notEqual(topic2, null);

            // listing multiple topics
            serviceBusService.listTopics(function (listError, listTopics) {
              assert.equal(listError, null);
              assert.notEqual(listTopics, null);
              assert.equal(listTopics.length, 2);

              var topicCount = 0;
              for (var topic in listTopics) {
                var currentTopic = listTopics[topic];

                assert.notEqual(currentTopic.MaxSizeInMegabytes, null);
                assert.notEqual(currentTopic.RequiresDuplicateDetection, null);
                assert.notEqual(currentTopic.DefaultMessageTimeToLive, null);
                assert.notEqual(currentTopic.DuplicateDetectionHistoryTimeWindow, null);

                if (currentTopic.TopicName === topicName1) {
                  topicCount += 1;
                } else if (currentTopic.TopicName === topicName2) {
                  topicCount += 2;
                }
              }

              assert.equal(topicCount, 3);

              done();
            });
          });
        });
      });
    });
  });

  test('ListTopicsRanges', function (done) {
    var topicName1 = '1' + testutil.generateId(topicNamesPrefix, topicNames);
    var topicName2 = '2' + testutil.generateId(topicNamesPrefix, topicNames);
    var topicName3 = '3' + testutil.generateId(topicNamesPrefix, topicNames);
    var topicName4 = '4' + testutil.generateId(topicNamesPrefix, topicNames);

    serviceBusService.createTopic(topicName1, function (createError1) {
      assert.equal(createError1, null);

      serviceBusService.createTopic(topicName2, function (createError2) {
        assert.equal(createError2, null);

        serviceBusService.createTopic(topicName3, function (createError3) {
          assert.equal(createError3, null);

          serviceBusService.createTopic(topicName4, function (createError4) {
            assert.equal(createError4, null);

            // test top
            serviceBusService.listTopics({ top: 2 }, function (listError1, listTopics1) {
              assert.equal(listError1, null);
              assert.notEqual(listTopics1, null);
              assert.equal(listTopics1.length, 2);

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

              assert.equal(topicCount, 3);

              // test skip
              serviceBusService.listTopics({ top: 2, skip: 1 }, function (listError2, listTopics2) {
                assert.equal(listError2, null);
                assert.notEqual(listTopics2, null);
                assert.equal(listTopics2.length, 2);

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

                assert.equal(topicCount, 3);

                done();
              });
            });
          });
        });
      });
    });
  });

  test('CreateSubscription', function (done) {
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
      assert.notEqual(fakeCreateSubscriptionError, null);
      assert.equal(fakeSubscription, null);

      serviceBusService.createTopic(topicName, function (createError, topic) {
        assert.equal(createError, null);
        assert.notEqual(topic, null);

        serviceBusService.createSubscription(topicName, subscriptionName1, subscriptionOptions, function (createSubscriptionError1, subscription1) {
          assert.equal(createSubscriptionError1, null);
          assert.notEqual(subscription1, null);

          serviceBusService.createSubscription(topicName, subscriptionName2, subscriptionOptions, function (createSubscriptionError2, subscription2) {
            assert.equal(createSubscriptionError2, null);
            assert.notEqual(subscription2, null);

            assert.equal(subscription2.LockDuration, subscriptionOptions.LockDuration.toString());
            assert.equal(subscription2.RequiresSession, subscriptionOptions.RequiresSession.toString());
            assert.equal(subscription2.DefaultMessageTimeToLive, subscriptionOptions.DefaultMessageTimeToLive.toString());
            assert.equal(subscription2.DeadLetteringOnMessageExpiration, subscriptionOptions.DeadLetteringOnMessageExpiration.toString());
            assert.equal(subscription2.DeadLetteringOnFilterEvaluationExceptions, subscriptionOptions.DeadLetteringOnFilterEvaluationExceptions.toString());

            // duplicate subscription
            serviceBusService.createSubscription(topicName, subscriptionName1, function (subscriptionError, duplicateSubscription) {
              assert.notEqual(subscriptionError, null);
              assert.equal(duplicateSubscription, null);

              servicebustestutil.checkNullParameter(function () {
                serviceBusService.createSubscription(null, subscriptionName1, function () { });
              });

              servicebustestutil.checkNullParameter(function () {
                serviceBusService.createSubscription(topicName, null, function () { });
              });

              done();
            });
          });
        });
      });
    });
  });

  test('DeleteSubscription', function (done) {
    var topicName = testutil.generateId(topicNamesPrefix, topicNames);
    var subscriptionName = testutil.generateId(subscriptionNamesPrefix, subscriptionNames);

    serviceBusService.deleteSubscription(topicName, subscriptionName, function (error1) {
      assert.notEqual(error1, null);
      assert.equal(error1.code, '404');

      serviceBusService.createTopic(topicName, function (error2, createResponse1) {
        assert.equal(error2, null);
        assert.notEqual(createResponse1, null);

        serviceBusService.createSubscription(topicName, subscriptionName, function (error3, createResponse3) {
          assert.equal(error3, null);
          assert.notEqual(createResponse3, null);

          serviceBusService.deleteSubscription(topicName, subscriptionName, function (error4, deleteResponse4) {
            assert.equal(error4, null);
            assert.notEqual(deleteResponse4, null);

            serviceBusService.getSubscription(topicName, subscriptionName, function (getError, sub) {
              assert.notEqual(getError, null);
              assert.equal(sub, null);

              servicebustestutil.checkNullParameter(function () {
                serviceBusService.deleteSubscription(null, subscriptionName, function () { });
              });

              servicebustestutil.checkNullParameter(function () {
                serviceBusService.deleteSubscription(topicName, null, function () { });
              });

              done();
            });
          });
        });
      });
    });
  });

  test('GetSubscription', function (done) {
    var topicName = testutil.generateId(topicNamesPrefix, topicNames);
    var subscriptionName = testutil.generateId(subscriptionNamesPrefix, subscriptionNames);

    serviceBusService.getSubscription(topicName, subscriptionName, function (getError1, getSub1) {
      assert.notEqual(getError1, null);
      assert.equal(getSub1, null);

      serviceBusService.createTopic(topicName, function (createError1, topic) {
        assert.equal(createError1, null);
        assert.notEqual(topic, null);

        serviceBusService.createSubscription(topicName, subscriptionName, function (createError2, subscription) {
          assert.equal(createError2, null);
          assert.notEqual(subscription, null);

          serviceBusService.getSubscription(topicName, subscriptionName, function (getError, getSubscription) {
            assert.equal(getError, null);
            assert.notEqual(getSubscription, null);

            assert.notEqual(getSubscription.LockDuration, null);
            assert.notEqual(getSubscription.RequiresSession, null);
            assert.notEqual(getSubscription.DefaultMessageTimeToLive, null);
            assert.notEqual(getSubscription.DeadLetteringOnMessageExpiration, null);
            assert.notEqual(getSubscription.DeadLetteringOnFilterEvaluationExceptions, null);

            servicebustestutil.checkNullParameter(function () {
              serviceBusService.getSubscription(null, subscriptionName, function () { });
            });

            servicebustestutil.checkNullParameter(function () {
              serviceBusService.getSubscription(topicName, null, function () { });
            });

            done();
          });
        });
      });
    });
  });

  test('ListSubscriptions', function (done) {
    var topicName = testutil.generateId(topicNamesPrefix, topicNames);
    var subscriptionName1 = testutil.generateId(subscriptionNamesPrefix, subscriptionNames);
    var subscriptionName2 = testutil.generateId(subscriptionNamesPrefix, subscriptionNames);

    // topic doesnt exist
    serviceBusService.listSubscriptions(topicName, function (listError1, subscriptions1) {
      assert.notEqual(listError1, null);
      assert.equal(subscriptions1, null);

      serviceBusService.createTopic(topicName, function (createError1, topic) {
        assert.equal(createError1, null);
        assert.notEqual(topic, null);

        // No subscriptions on the topic yet
        serviceBusService.listSubscriptions(topicName, function (listError2, subscriptions2) {
          assert.equal(listError2, null);
          assert.notEqual(subscriptions2, null);
          assert.equal(subscriptions2.length, 0);

          serviceBusService.createSubscription(topicName, subscriptionName1, function (createError2, subscription1) {
            assert.equal(createError2, null);
            assert.notEqual(subscription1, null);

            // Single subscription
            serviceBusService.listSubscriptions(topicName, function (listError3, subscriptions3) {
              assert.equal(listError3, null);
              assert.notEqual(subscriptions3, null);
              assert.equal(subscriptions3.length, 1);

              serviceBusService.createSubscription(topicName, subscriptionName2, function (createError3, subscription2) {
                assert.equal(createError3, null);
                assert.notEqual(subscription2, null);

                serviceBusService.listSubscriptions(topicName, function (listError, subscriptions) {
                  assert.equal(listError, null);
                  assert.notEqual(subscriptions, null);
                  assert.equal(subscriptions.length, 2);

                  var subscriptionsCount = 0;
                  for (var subscription in subscriptions) {
                    var currentSubscription = subscriptions[subscription];

                    assert.notEqual(currentSubscription.LockDuration, null);
                    assert.notEqual(currentSubscription.RequiresSession, null);
                    assert.notEqual(currentSubscription.DefaultMessageTimeToLive, null);
                    assert.notEqual(currentSubscription.DeadLetteringOnMessageExpiration, null);
                    assert.notEqual(currentSubscription.DeadLetteringOnFilterEvaluationExceptions, null);

                    if (currentSubscription.SubscriptionName === subscriptionName1) {
                      subscriptionsCount += 1;
                    } else if (currentSubscription.SubscriptionName === subscriptionName2) {
                      subscriptionsCount += 2;
                    }
                  }

                  assert.equal(subscriptionsCount, 3);

                  done();
                });
              });
            });
          });
        });
      });
    });
  });

  test('ListSubscriptionsRanges', function (done) {
    var topicName = testutil.generateId(topicNamesPrefix, topicNames);
    var subscriptionName1 = '1' + testutil.generateId(subscriptionNamesPrefix, subscriptionNames);
    var subscriptionName2 = '2' + testutil.generateId(subscriptionNamesPrefix, subscriptionNames);
    var subscriptionName3 = '3' + testutil.generateId(subscriptionNamesPrefix, subscriptionNames);
    var subscriptionName4 = '4' + testutil.generateId(subscriptionNamesPrefix, subscriptionNames);

    serviceBusService.createTopic(topicName, function (createError0) {
      assert.equal(createError0, null);

      serviceBusService.createSubscription(topicName, subscriptionName1, function (createError1) {
        assert.equal(createError1, null);

        serviceBusService.createSubscription(topicName, subscriptionName2, function (createError2) {
          assert.equal(createError2, null);

          serviceBusService.createSubscription(topicName, subscriptionName3, function (createError3) {
            assert.equal(createError3, null);

            serviceBusService.createSubscription(topicName, subscriptionName4, function (createError4) {
              assert.equal(createError4, null);

              // test top
              serviceBusService.listSubscriptions(topicName, { top: 2 }, function (listError1, listSubscriptions1) {
                assert.equal(listError1, null);
                assert.notEqual(listSubscriptions1, null);
                assert.equal(listSubscriptions1.length, 2);

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

                assert.equal(subscriptionCount, 3);

                // test skip
                serviceBusService.listSubscriptions(topicName, { top: 2, skip: 1 }, function (listError2, listSubscriptions2) {
                  assert.equal(listError2, null);
                  assert.notEqual(listSubscriptions2, null);
                  assert.equal(listSubscriptions2.length, 2);

                  // results are ordered by alphabetic order so
                  // subscriptionName2 and subscriptionName3 should be in the result
                  subscriptionCount = 0;
                  for (var topic in listSubscriptions2) {
                    currentSubscription = listSubscriptions2[topic];
                    if (currentSubscription.SubscriptionName === subscriptionName2) {
                      subscriptionCount += 1;
                    } else if (currentSubscription.SubscriptionName === subscriptionName3) {
                      subscriptionCount += 2;
                    }
                  }

                  assert.equal(subscriptionCount, 3);

                  done();
                });
              });
            });
          });
        });
      });
    });
  });

  test('CreateRule', function (done) {
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
      assert.notEqual(invalidCreateError, null);
      assert.equal(invalidRule1, null);

      serviceBusService.createRule(topicName, 'FakeSubscription', ruleName1, function (invalidCreateError2, invalidRule2) {
        assert.notEqual(invalidCreateError2, null);
        assert.equal(invalidRule2, null);

        serviceBusService.createTopic(topicName, function (createError, topic) {
          assert.equal(createError, null);
          assert.notEqual(topic, null);

          serviceBusService.createSubscription(topicName, subscriptionName, function (createSubscriptionError, subscription) {
            assert.equal(createSubscriptionError, null);
            assert.notEqual(subscription, null);

            serviceBusService.createRule(topicName, subscriptionName, ruleName1, ruleOptions1, function (createRuleError1, rule1) {
              assert.equal(createRuleError1, null);
              assert.notEqual(rule1, null);

              serviceBusService.createRule(topicName, subscriptionName, ruleName2, ruleOptions2, function (createRuleError2, rule2) {
                assert.equal(createRuleError2, null);
                assert.notEqual(rule2, null);

                serviceBusService.createRule(topicName, subscriptionName, ruleName3, ruleOptions3, function (createRuleError3, rule3) {
                  assert.equal(createRuleError3, null);
                  assert.notEqual(rule3, null);

                  serviceBusService.createRule(topicName, subscriptionName, ruleName4, ruleOptions4, function (createRuleError4, rule4) {
                    assert.equal(createRuleError4, null);
                    assert.notEqual(rule4, null);

                    // Existing rule...
                    serviceBusService.createRule(topicName, subscriptionName, ruleName1, function (duplicateError, duplicateRule) {
                      assert.notEqual(duplicateError, null);
                      assert.equal(duplicateRule, null);

                      servicebustestutil.checkNullParameter(function () {
                        serviceBusService.createRule(null, subscriptionName, ruleName1, ruleOptions1, function () { });
                      });

                      servicebustestutil.checkNullParameter(function () {
                        serviceBusService.createRule(topicName, null, ruleName1, ruleOptions1, function () { });
                      });

                      servicebustestutil.checkNullParameter(function () {
                        serviceBusService.createRule(topicName, subscriptionName, null, ruleOptions1, function () { });
                      });

                      done();
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

  test('SqlExpressionFilter', function (done) {
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
      assert.equal(createTopicError, null);

      serviceBusService.createSubscription(topicName, subscriptionName1, function (createSubscriptionError1) {
        assert.equal(createSubscriptionError1, null);

        serviceBusService.createSubscription(topicName, subscriptionName2, function (createSubscriptionError2) {
          assert.equal(createSubscriptionError2, null);

          serviceBusService.deleteRule(topicName, subscriptionName1, ServiceBusConstants.DEFAULT_RULE_NAME, function (deleteRuleError) {
            assert.equal(deleteRuleError, null);

            serviceBusService.createRule(topicName, subscriptionName1, ruleName, ruleOptions, function (createRuleError) {
              assert.equal(createRuleError, null);

              // non matching property
              serviceBusService.sendTopicMessage(topicName, { body: messageText1, customProperties: { property: 2} }, function (sendError1) {
                assert.equal(sendError1, null);

                serviceBusService.receiveSubscriptionMessage(topicName, subscriptionName1, function (receiveError1, receiveMessage1) {
                  assert.notEqual(receiveError1, null); // Nothing to receive
                  assert.equal(receiveMessage1, null);

                  // matching property
                  serviceBusService.sendTopicMessage(topicName, { body: messageText2, customProperties: { property: 1} }, function (sendError2) {
                    assert.equal(sendError2, null);

                    serviceBusService.receiveSubscriptionMessage(topicName, subscriptionName1, function (receiveError2, receiveMessage2) {
                      assert.equal(receiveError2, null);
                      assert.notEqual(receiveMessage2, null);
                      assert.equal(receiveMessage2.body, messageText2);

                      // subscription 2 can receive both messages
                      serviceBusService.receiveSubscriptionMessage(topicName, subscriptionName2, function (receiveError3, receiveMessage3) {
                        assert.equal(receiveError3, null);
                        assert.notEqual(receiveMessage3, null);
                        assert.equal(receiveMessage3.body, messageText1);

                        serviceBusService.receiveSubscriptionMessage(topicName, subscriptionName2, function (receiveError4, receiveMessage4) {
                          assert.equal(receiveError4, null);
                          assert.notEqual(receiveMessage4, null);
                          assert.equal(receiveMessage4.body, messageText2);

                          done();
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
  });

  test('CorrelationIdFilter', function (done) {
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
      assert.equal(createTopicError, null);

      serviceBusService.createSubscription(topicName, subscriptionName1, function (createSubscriptionError1) {
        assert.equal(createSubscriptionError1, null);

        serviceBusService.createSubscription(topicName, subscriptionName2, function (createSubscriptionError2) {
          assert.equal(createSubscriptionError2, null);

          serviceBusService.deleteRule(topicName, subscriptionName1, ServiceBusConstants.DEFAULT_RULE_NAME, function (deleteRuleError) {
            assert.equal(deleteRuleError, null);

            serviceBusService.createRule(topicName, subscriptionName1, ruleName, ruleOptions, function (createRuleError) {
              assert.equal(createRuleError, null);

              // non matching property
              serviceBusService.sendTopicMessage(topicName, { body: messageText1, brokerProperties: { CorrelationId: 'otherid'} }, function (sendError1) {
                assert.equal(sendError1, null);

                serviceBusService.receiveSubscriptionMessage(topicName, subscriptionName1, function (receiveError1, receiveMessage1) {
                  assert.notEqual(receiveError1, null); // Nothing to receive
                  assert.equal(receiveMessage1, null);

                  // matching property
                  serviceBusService.sendTopicMessage(topicName, { body: messageText2, brokerProperties: { CorrelationId: 'myid'} }, function (sendError2) {
                    assert.equal(sendError2, null);

                    serviceBusService.receiveSubscriptionMessage(topicName, subscriptionName1, function (receiveError2, receiveMessage2) {
                      assert.equal(receiveError2, null);
                      assert.notEqual(receiveMessage2, null);
                      assert.equal(receiveMessage2.body, messageText2);

                      // subscription 2 can receive both messages
                      serviceBusService.receiveSubscriptionMessage(topicName, subscriptionName2, function (receiveError3, receiveMessage3) {
                        assert.equal(receiveError3, null);
                        assert.notEqual(receiveMessage3, null);
                        assert.equal(receiveMessage3.body, messageText1);

                        serviceBusService.receiveSubscriptionMessage(topicName, subscriptionName2, function (receiveError4, receiveMessage4) {
                          assert.equal(receiveError4, null);
                          assert.notEqual(receiveMessage4, null);
                          assert.equal(receiveMessage4.body, messageText2);

                          done();
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
  });

  test('DeleteRule', function (done) {
    var topicName = testutil.generateId(topicNamesPrefix, topicNames);
    var subscriptionName = testutil.generateId(subscriptionNamesPrefix, subscriptionNames);
    var ruleName = testutil.generateId(ruleNamesPrefix, ruleNames);

    serviceBusService.deleteRule(topicName, subscriptionName, ruleName, function (error1) {
      assert.notEqual(error1, null);
      assert.equal(error1.code, '404');

      serviceBusService.createTopic(topicName, function (error2, createResponse1) {
        assert.equal(error2, null);
        assert.notEqual(createResponse1, null);

        serviceBusService.createSubscription(topicName, subscriptionName, function (error3, createResponse3) {
          assert.equal(error3, null);
          assert.notEqual(createResponse3, null);

          serviceBusService.createRule(topicName, subscriptionName, ruleName, function (error4, createResponse4) {
            assert.equal(error4, null);
            assert.notEqual(createResponse4, null);

            serviceBusService.deleteRule(topicName, subscriptionName, ruleName, function (error5, deleteResponse5) {
              assert.equal(error5, null);
              assert.notEqual(deleteResponse5, null);

              serviceBusService.getRule(topicName, subscriptionName, ruleName, function (error6, deletedRule) {
                assert.notEqual(error6, null);
                assert.equal(deletedRule, null);

                servicebustestutil.checkNullParameter(function () {
                  serviceBusService.deleteRule(null, subscriptionName, ruleName, function () { });
                });

                servicebustestutil.checkNullParameter(function () {
                  serviceBusService.deleteRule(topicName, null, ruleName, function () { });
                });

                servicebustestutil.checkNullParameter(function () {
                  serviceBusService.deleteRule(topicName, subscriptionName, null, function () { });
                });

                done();
              });
            });
          });
        });
      });
    });
  });

  test('ListRule', function (done) {
    var topicName = testutil.generateId(topicNamesPrefix, topicNames);
    var subscriptionName = testutil.generateId(subscriptionNamesPrefix, subscriptionNames);
    var ruleName1 = testutil.generateId(ruleNamesPrefix, ruleNames);
    var ruleName2 = testutil.generateId(ruleNamesPrefix, ruleNames);

    // Invalid topic
    serviceBusService.listRules(topicName, subscriptionName, function (listError1, rulesList1) {
      assert.notEqual(listError1, null);
      assert.equal(rulesList1, null);

      serviceBusService.createTopic(topicName, function (createError, topic) {
        assert.equal(createError, null);
        assert.notEqual(topic, null);

        // Invalid subscription
        serviceBusService.listRules(topicName, subscriptionName, function (listError2, rulesList2) {
          assert.notEqual(listError2, null);
          assert.equal(rulesList2, null);

          serviceBusService.createSubscription(topicName, subscriptionName, function (createSubscriptionError, subscription) {
            assert.equal(createSubscriptionError, null);
            assert.notEqual(subscription, null);

            // There's always a $Default rule
            serviceBusService.listRules(topicName, subscriptionName, function (listError3, rulesList3) {
              assert.equal(listError3, null);
              assert.notEqual(rulesList3, null);
              assert.equal(rulesList3.length, 1);

              serviceBusService.createRule(topicName, subscriptionName, ruleName1, function (createRuleError1, rule1) {
                assert.equal(createRuleError1, null);
                assert.notEqual(rule1, null);

                // Two rules ($Default + one that was just added)
                serviceBusService.listRules(topicName, subscriptionName, function (listError4, rulesList4) {
                  assert.equal(listError4, null);
                  assert.notEqual(rulesList4, null);
                  assert.equal(rulesList4.length, 2);

                  serviceBusService.createRule(topicName, subscriptionName, ruleName2, function (createRuleError2, rule2) {
                    assert.equal(createRuleError2, null);
                    assert.notEqual(rule2, null);

                    // multiple rules
                    serviceBusService.listRules(topicName, subscriptionName, function (listError, rules) {
                      assert.equal(listError, null);
                      assert.notEqual(rules, null);
                      assert.equal(rules.length, 3);

                      var ruleCount = 0;
                      for (var rule in rules) {
                        var currentRule = rules[rule];

                        assert.notEqual(currentRule.Filter, null);
                        assert.notEqual(currentRule.Action, null);

                        if (currentRule.RuleName === ruleName1) {
                          ruleCount += 1;
                        } else if (currentRule.RuleName === ruleName2) {
                          ruleCount += 2;
                        }
                      }

                      assert.equal(ruleCount, 3);

                      done();
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

  test('ListRulesRanges', function (done) {
    var topicName = testutil.generateId(topicNamesPrefix, topicNames);
    var subscriptionName = testutil.generateId(subscriptionNamesPrefix, subscriptionNames);
    var ruleName1 = '1' + testutil.generateId(ruleNamesPrefix, ruleNames);
    var ruleName2 = '2' + testutil.generateId(ruleNamesPrefix, ruleNames);
    var ruleName3 = '3' + testutil.generateId(ruleNamesPrefix, ruleNames);
    var ruleName4 = '4' + testutil.generateId(ruleNamesPrefix, ruleNames);

    serviceBusService.createTopic(topicName, function (createError0) {
      assert.equal(createError0, null);

      serviceBusService.createSubscription(topicName, subscriptionName, function (createError1) {
        assert.equal(createError1, null);

        serviceBusService.createRule(topicName, subscriptionName, ruleName1, function (createError2) {
          assert.equal(createError2, null);

          serviceBusService.createRule(topicName, subscriptionName, ruleName2, function (createError3) {
            assert.equal(createError3, null);

            serviceBusService.createRule(topicName, subscriptionName, ruleName3, function (createError4) {
              assert.equal(createError4, null);

              serviceBusService.createRule(topicName, subscriptionName, ruleName4, function (createError5) {
                assert.equal(createError5, null);

                // test top
                serviceBusService.listRules(topicName, subscriptionName, { top: 2 }, function (listError1, listRules1) {
                  assert.equal(listError1, null);
                  assert.notEqual(listRules1, null);
                  assert.equal(listRules1.length, 2);

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

                  assert.equal(ruleCount, 3);

                  // test skip
                  serviceBusService.listRules(topicName, subscriptionName, { top: 2, skip: 1 }, function (listError2, listRules2) {
                    assert.equal(listError2, null);
                    assert.notEqual(listRules2, null);
                    assert.equal(listRules2.length, 2);

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

                    assert.equal(ruleCount, 3);

                    done();
                  });
                });
              });
            });
          });
        });
      });
    });
  });

  test('TimeoutWorks', function (done) {
    var queueName = testutil.generateId(queueNamesPrefix, queueNames);
    var customTimeoutInternalInS = 5;

    serviceBusService.createQueue(queueName, function (createQueueError) {
      assert.equal(createQueueError, null);

      serviceBusService.sendQueueMessage(queueName, 'hi there', function (sendMessageError) {
        assert.equal(sendMessageError, null);

        var buildRequestOptionsFunction = serviceBusService._buildRequestOptions.bind(serviceBusService);
        serviceBusService._buildRequestOptions = function (webResource, options, callback) {
          buildRequestOptionsFunction(webResource, options, function (error, requestOptions) {
            assert.equal(webResource._queryString[QueryStringConstants.TIMEOUT]['value'], customTimeoutInternalInS);

            callback(error, requestOptions);
          });
        };

        serviceBusService.receiveQueueMessage(queueName, { timeoutIntervalInS: customTimeoutInternalInS }, function (receiveMessageError) {
          assert.equal(receiveMessageError, null);

          serviceBusService._buildRequestOptions = buildRequestOptionsFunction;

          done();
        });
      });
    });
  });

  test('connectionStrings', function (done) {
    var key = 'AhlzsbLRkjfwObuqff3xrhB2yWJNh1EMptmcmxFJ6fvPTVX3PZXwrG2YtYWf5DPMVgNsteKStM5iBLlknYFVoA==';
    var connectionString = 'Endpoint=http://ablal-martvue.servicebus.windows.net/;StsEndpoint=https://ablal-martvue-sb.accesscontrol.windows.net;SharedSecretIssuer=owner;SharedSecretValue=' + key;

    var serviceBusService = azure.createServiceBusService(connectionString);
    assert.equal(serviceBusService.host, 'ablal-martvue.servicebus.windows.net');
    assert.equal(serviceBusService.authenticationProvider.issuer, 'owner');
    assert.equal(serviceBusService.authenticationProvider.accessKey, key);
    assert.equal(serviceBusService.authenticationProvider.acsHost, 'https://ablal-martvue-sb.accesscontrol.windows.net');

    done();
  });

  test('storageConnectionStringsEndpointHttpExplicit', function (done) {
    var topicName = testutil.generateId(topicNamesPrefix, topicNames);
    var expectedNamespace = process.env[ServiceClient.EnvironmentVariables.AZURE_SERVICEBUS_NAMESPACE];
    var expectedKey = process.env[ServiceClient.EnvironmentVariables.AZURE_SERVICEBUS_ACCESS_KEY];
    var expectedHost = 'http://' + process.env[ServiceClient.EnvironmentVariables.AZURE_SERVICEBUS_NAMESPACE] + '.servicebus.windows.net';
    var serviceBusService = azure.createServiceBusService(expectedNamespace, expectedKey, undefined, undefined, expectedHost);
    serviceBusService.createTopic(topicName, function (err) {
      assert.equal(err, null);

      assert.equal(serviceBusService.host, process.env[ServiceClient.EnvironmentVariables.AZURE_SERVICEBUS_NAMESPACE] + '.servicebus.windows.net');
      assert.equal(serviceBusService.port, 80);
      assert.equal(serviceBusService.authenticationProvider.issuer, 'owner');
      assert.equal(serviceBusService.authenticationProvider.accessKey, expectedKey);
      assert.equal(serviceBusService.authenticationProvider.acsHost, 'https://' + process.env[ServiceClient.EnvironmentVariables.AZURE_SERVICEBUS_NAMESPACE] + '-sb.accesscontrol.windows.net:443');

      done();
    });
  });

  test('storageConnectionStringsEndpointHttpsExplicit', function (done) {
    var topicName = testutil.generateId(topicNamesPrefix, topicNames);
    var expectedNamespace = process.env[ServiceClient.EnvironmentVariables.AZURE_SERVICEBUS_NAMESPACE];
    var expectedKey = process.env[ServiceClient.EnvironmentVariables.AZURE_SERVICEBUS_ACCESS_KEY];
    var expectedHost = 'https://' + process.env[ServiceClient.EnvironmentVariables.AZURE_SERVICEBUS_NAMESPACE] + '.servicebus.windows.net';
    var serviceBusService = azure.createServiceBusService(expectedNamespace, expectedKey, undefined, undefined, expectedHost);
    serviceBusService.createTopic(topicName, function (err) {
      assert.equal(err, null);

      assert.equal(serviceBusService.host, process.env[ServiceClient.EnvironmentVariables.AZURE_SERVICEBUS_NAMESPACE] + '.servicebus.windows.net');
      assert.equal(serviceBusService.port, 443);
      assert.equal(serviceBusService.authenticationProvider.issuer, 'owner');
      assert.equal(serviceBusService.authenticationProvider.accessKey, expectedKey);
      assert.equal(serviceBusService.authenticationProvider.acsHost, 'https://' + process.env[ServiceClient.EnvironmentVariables.AZURE_SERVICEBUS_NAMESPACE] + '-sb.accesscontrol.windows.net:443');

      done();
    });
  });

  test('connectionStringsWithSbSchema', function (done) {
    var key = 'AhlzsbLRkjfwObuqff3xrhB2yWJNh1EMptmcmxFJ6fvPTVX3PZXwrG2YtYWf5DPMVgNsteKStM5iBLlknYFVoA==';
    var connectionString = 'Endpoint=sb://ablal-martvue.servicebus.windows.net/;StsEndpoint=https://ablal-martvue-sb.accesscontrol.windows.net;SharedSecretIssuer=owner;SharedSecretValue=' + key;

    var serviceBusService = azure.createServiceBusService(connectionString);
    assert.equal(serviceBusService.host, 'ablal-martvue.servicebus.windows.net');
    assert.equal(serviceBusService.protocol, 'https://');
    assert.equal(serviceBusService.authenticationProvider.issuer, 'owner');
    assert.equal(serviceBusService.authenticationProvider.accessKey, key);
    assert.equal(serviceBusService.authenticationProvider.acsHost, 'https://ablal-martvue-sb.accesscontrol.windows.net');

    done();
  });

  test('invalidAccessKeyGivesError', function (done) {
    var serviceBusService = azure.createServiceBusService(process.env['AZURE_SERVICEBUS_NAMESPACE'], 'key');
    // fails, with an error on the callback.
    serviceBusService.createTopicIfNotExists('Topic', function(error) {
      assert.notEqual(error, null);
      assert.equal(error.code, '401');

      done();
    });
  });

  test('invalidNamespaceGivesError', function (done) {
    var serviceBusService = azure.createServiceBusService('BoGuS', process.env['AZURE_SERVICEBUS_ACCESS_KEY']);
    // fails, with an error on the callback.
    serviceBusService.createTopicIfNotExists('Topic', function(error) {
      assert.notEqual(error, null);
      assert.equal(error.code, 'ENOTFOUND');

      done();
    });
  });
});