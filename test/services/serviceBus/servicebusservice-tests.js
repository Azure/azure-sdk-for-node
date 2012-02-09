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

    serviceBusService.createQueue(queueName, function (createError, queue) {
      test.equal(createError, null);
      test.notEqual(queue, null);

      test.done();
    });
  },

  testCreateQueueIfNotExists: function (test) {
    var queueName = testutil.generateId(queueNamesPrefix, queueNames);

    serviceBusService.createQueueIfNotExists(queueName, function (createError, created) {
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

        serviceBusService.deleteQueue(queueName, function (error3, deleteResponse2) {
          test.equal(error3, null);
          test.notEqual(deleteResponse2, null);

          test.done();
        });
      });
    });
  },

  testGetQueue: function (test) {
    var queueName = testutil.generateId(queueNamesPrefix, queueNames);

    serviceBusService.createQueue(queueName, function (createError, queue) {
      test.equal(createError, null);
      test.notEqual(queue, null);

      serviceBusService.getQueue(queueName, function (getError, getQueue) {
        test.equal(getError, null);
        test.notEqual(getQueue, null);

        test.done();
      });
    });
  },

  testListQueue: function (test) {
    var queueName1 = testutil.generateId(queueNamesPrefix, queueNames);
    var queueName2 = testutil.generateId(queueNamesPrefix, queueNames);

    serviceBusService.createQueue(queueName1, function (createError1, queue1) {
      test.equal(createError1, null);
      test.notEqual(queue1, null);

      serviceBusService.createQueue(queueName2, function (createError2, queue2) {
        test.equal(createError2, null);
        test.notEqual(queue2, null);

        serviceBusService.listQueues(function (getError, queues) {
          test.equal(getError, null);
          test.notEqual(queues, null);
          test.equal(queues.length, 2);

          test.done();
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

  testCreateTopic: function (test) {
    var topicName = testutil.generateId(topicNamesPrefix, topicNames);

    serviceBusService.createTopic(topicName, function (createError, topic) {
      test.equal(createError, null);
      test.notEqual(topic, null);

      test.done();
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

          test.done();
        });
      });
    });
  },

  testGetTopic: function (test) {
    var topicName = testutil.generateId(topicNamesPrefix, topicNames);

    serviceBusService.createTopic(topicName, function (createError, topic) {
      test.equal(createError, null);
      test.notEqual(topic, null);

      serviceBusService.getTopic(topicName, function (getError, getTopic) {
        test.equal(getError, null);
        test.notEqual(getTopic, null);

        test.done();
      });
    });
  },

  testListTopics: function (test) {
    var topicName1 = testutil.generateId(topicNamesPrefix, topicNames);
    var topicName2 = testutil.generateId(topicNamesPrefix, topicNames);

    serviceBusService.createTopic(topicName1, function (createError1, topic1) {
      test.equal(createError1, null);
      test.notEqual(topic1, null);

      serviceBusService.createTopic(topicName2, function (createError2, topic2) {
        test.equal(createError2, null);
        test.notEqual(topic2, null);

        serviceBusService.listTopics(function (listError, listTopics) {
          test.equal(listError, null);
          test.notEqual(listTopics, null);
          test.equal(listTopics.length, 2);

          test.done();
        });
      });
    });
  },

  testCreateSubscription: function (test) {
    var topicName = testutil.generateId(topicNamesPrefix, topicNames);
    var subscriptionName = testutil.generateId(subscriptionNamesPrefix, subscriptionNames);

    serviceBusService.createTopic(topicName, function (createError, topic) {
      test.equal(createError, null);
      test.notEqual(topic, null);

      serviceBusService.createSubscription(topicName, subscriptionName, function (createSubscriptionError, subscription) {
        test.equal(createSubscriptionError, null);
        test.notEqual(subscription, null);

        test.done();
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