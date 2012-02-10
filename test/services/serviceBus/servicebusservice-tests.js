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
      test.notEqual(queue, null);
      if (queue) {
        test.equal(queue.QueueName, queueName);
        test.equal(queue.LockDuration, queueOptions.LockDuration);
        test.equal(queue.RequiresDuplicateDetection, queueOptions.RequiresDuplicateDetection);
        test.equal(queue.RequiresSession, queueOptions.RequiresSession);
        test.equal(queue.DefaultMessageTimeToLive, queueOptions.DefaultMessageTimeToLive);
        test.equal(queue.DeadLetteringOnMessageExpiration, queueOptions.DeadLetteringOnMessageExpiration);
        test.equal(queue.DuplicateDetectionHistoryTimeWindow, queueOptions.DuplicateDetectionHistoryTimeWindow);
        test.equal(queue.MaxSizeInMegabytes, queueOptions.MaxSizeInMegabytes);
      }

      test.done();
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

      // try creating queue again
      serviceBusService.createQueueIfNotExists(queueName, function (createError2, created2) {
        test.equal(createError2, null);
        test.equal(created2, false);

        test.done();
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
                test.notEqual(currentQueue[ServiceBusConstants.ENABLED_BATCHED_OPERATIONS], null);
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

        test.done();
      });
    });
  },

  testSendMessageProperties: function (test) {
    var queueName = testutil.generateId(queueNamesPrefix, queueNames);
    var messageText = 'hi there again';
    var messageOptions = {
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

      serviceBusService.sendQueueMessage(queueName, messageText, messageOptions, function (sendError) {
        test.equal(sendError, null);

        serviceBusService.receiveQueueMessage(queueName, function (receiveError, messageReceived) {
          test.equal(receiveError, null);
          test.notEqual(messageReceived, null);

          test.equal(messageReceived.contentType, messageOptions.contentType);
          test.equal(messageReceived.brokerProperties.CorrelationId, messageOptions.brokerProperties.CorrelationId);
          test.equal(messageReceived.brokerProperties.SessionId, messageOptions.brokerProperties.SessionId);
          test.equal(messageReceived.brokerProperties.MessageId, messageOptions.brokerProperties.MessageId);
          test.equal(messageReceived.brokerProperties.Label, messageOptions.brokerProperties.Label);
          test.equal(messageReceived.brokerProperties.ReplyTo, messageOptions.brokerProperties.ReplyTo);
          test.equal(messageReceived.brokerProperties.To, messageOptions.brokerProperties.To);
          test.equal(messageReceived.brokerProperties.ReplyToSessionId, messageOptions.brokerProperties.ReplyToSessionId);

          test.done();
        });
      });
    });
  },

  testMessageCustomProperties: function (test) {
    var queueName = testutil.generateId(queueNamesPrefix, queueNames);
    var messageText = 'hi there again';
    var messageOptions = {
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

      serviceBusService.sendQueueMessage(queueName, messageText, messageOptions, function (sendError) {
        test.equal(sendError, null);

        // read the message
        serviceBusService.receiveQueueMessage(queueName, function (receiveError, message) {
          test.equal(receiveError, null);
          test.equal(message.messagetext, messageText);
          test.strictEqual(message.customProperties.propint, messageOptions.customProperties.propint);
          test.strictEqual(message.customProperties.propfloat, messageOptions.customProperties.propfloat);
          test.deepEqual(message.customProperties.propdate.valueOf(), messageOptions.customProperties.propdate.valueOf());
          test.strictEqual(message.customProperties.propstring, messageOptions.customProperties.propstring);

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
          test.equal(message.messagetext, messageText);

          serviceBusService.receiveQueueMessage(queueName, function (receiveError2, emptyMessage) {
            test.notEqual(receiveError2, null);
            test.equal(emptyMessage, null);

            test.done();
          });
        });
      });
    });
  },

  /*
  testPeekMessage: function (test) {
  var queueName = testutil.generateId(queueNamesPrefix, queueNames);
  var messageText = 'hi there again';

  serviceBusService.createQueue(queueName, function (createError, queue) {
  test.equal(createError, null);
  test.notEqual(queue, null);

  serviceBusService.sendQueueMessage(queueName, messageText, function (sendError) {
  test.equal(sendError, null);

  // Peek the message
  serviceBusService.receiveQueueMessage(queueName, { isPeekLock: true, timeoutIntervalInMs: 5 }, function (receiveError, message) {
  test.equal(receiveError, null);
  test.equal(message.messagetext, messageText);

  test.notEqual(message.location, null);
  test.notEqual(message.brokerProperties.LockToken, null);
  test.notEqual(message.brokerProperties.LockedUntilUtc, null);

  // Message is not available while locked
  serviceBusService.receiveQueueMessage(queueName, { isPeekLock: true, timeoutIntervalInMs: 5 }, function (receiveError2, emptyMessage, rsp) {
  console.log(rsp);

  test.notEqual(receiveError2, null);
  test.equal(emptyMessage, null);

  // unlock message
  serviceBusService.unlockMessage(message.location, function (unlockError) {
  test.equal(unlockError, null);

  // receive message again
  serviceBusService.receiveQueueMessage(queueName, function (receiveError3, message3) {
  test.equal(receiveError3, null);
  test.equal(message3.messagetext, messageText);

  // message was deleted
  serviceBusService.receiveQueueMessage(queueName, function (receiveError4, emptyMessage2) {
  test.notEqual(receiveError4, null);
  test.equal(emptyMessage2, null);

  test.done();
  });
  });
  });
  });
  });
  });
  });
  },
  */

  testCreateTopic: function (test) {
    var topicName = testutil.generateId(topicNamesPrefix, topicNames);
    var topicOptions = {
      MaxSizeInMegabytes: '2048',
      RequiresDuplicateDetection: false,
      DefaultMessageTimeToLive: 'PT5S',
      DuplicateDetectionHistoryTimeWindow: 'PT55S'
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
      }

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

        test.done();
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

          test.done();
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

            test.done();
          });
        });
      });
    });
  },

  testGetSubscription: function (test) {
    var topicName = testutil.generateId(topicNamesPrefix, topicNames);
    var subscriptionName = testutil.generateId(subscriptionNamesPrefix, subscriptionNames);

    serviceBusService.createTopic(topicName, function (createError1, topic) {
      test.equal(createError1, null);
      test.notEqual(topic, null);

      serviceBusService.createSubscription(topicName, subscriptionName, function (createError2, subscription) {
        test.equal(createError2, null);
        test.notEqual(subscription, null);

        serviceBusService.getSubscription(topicName, subscriptionName, function (getError, getTopic) {
          test.equal(getError, null);
          test.notEqual(getTopic, null);

          test.done();
        });
      });
    });
  },

  testListSubscriptions: function (test) {
    var topicName = testutil.generateId(topicNamesPrefix, topicNames);
    var subscriptionName1 = testutil.generateId(subscriptionNamesPrefix, subscriptionNames);
    var subscriptionName2 = testutil.generateId(subscriptionNamesPrefix, subscriptionNames);

    serviceBusService.createTopic(topicName, function (createError1, topic) {
      test.equal(createError1, null);
      test.notEqual(topic, null);

      serviceBusService.createSubscription(topicName, subscriptionName1, function (createError2, subscription1) {
        test.equal(createError2, null);
        test.notEqual(subscription1, null);

        serviceBusService.createSubscription(topicName, subscriptionName2, function (createError3, subscription2) {
          test.equal(createError3, null);
          test.notEqual(subscription2, null);

          serviceBusService.listSubscriptions(topicName, function (listError, subscriptions) {
            test.equal(listError, null);
            test.notEqual(subscriptions, null);
            test.equal(subscriptions.length, 2);

            test.done();
          });
        });
      });
    });
  },

  testCreateRule: function (test) {
    var topicName = testutil.generateId(topicNamesPrefix, topicNames);
    var subscriptionName = testutil.generateId(subscriptionNamesPrefix, subscriptionNames);
    var ruleName = testutil.generateId(ruleNamesPrefix, ruleNames);

    serviceBusService.createTopic(topicName, function (createError, topic) {
      test.equal(createError, null);
      test.notEqual(topic, null);

      serviceBusService.createSubscription(topicName, subscriptionName, function (createSubscriptionError, subscription) {
        test.equal(createSubscriptionError, null);
        test.notEqual(subscription, null);

        serviceBusService.createRule(topicName, subscriptionName, ruleName, function (createRuleError, rule) {
          test.equal(createRuleError, null);
          test.notEqual(rule, null);
          test.done();
        });
      });
    });
  },

  testDeleteRule: function (test) {
    var topicName = testutil.generateId(topicNamesPrefix, topicNames);
    var subscriptionName = testutil.generateId(subscriptionNamesPrefix, subscriptionNames);
    var ruleName = testutil.generateId(ruleNamesPrefix, ruleNames);

    serviceBusService.deleteSubscription(topicName, subscriptionName, function (error1) {
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

              test.done();
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

    serviceBusService.createTopic(topicName, function (createError, topic) {
      test.equal(createError, null);
      test.notEqual(topic, null);

      serviceBusService.createSubscription(topicName, subscriptionName, function (createSubscriptionError, subscription) {
        test.equal(createSubscriptionError, null);
        test.notEqual(subscription, null);

        serviceBusService.createRule(topicName, subscriptionName, ruleName1, function (createRuleError1, rule1) {
          test.equal(createRuleError1, null);
          test.notEqual(rule1, null);

          serviceBusService.createRule(topicName, subscriptionName, ruleName2, function (createRuleError2, rule2) {
            test.equal(createRuleError2, null);
            test.notEqual(rule2, null);

            serviceBusService.listRules(topicName, subscriptionName, function (listError, rules) {
              test.equal(listError, null);
              test.notEqual(rules, null);
              test.equal(rules.length, 3);

              test.done();
            });
          });
        });
      });
    });
  }
});