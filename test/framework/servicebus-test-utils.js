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

var util = require('util');
var assert = require('assert');

var MockedTestUtils = require('./mocked-test-utils');

function ServiceBusTestUtils(service, testPrefix) {
  ServiceBusTestUtils.super_.call(this, service, testPrefix);
}

util.inherits(ServiceBusTestUtils, MockedTestUtils);

ServiceBusTestUtils.prototype.teardownTest = function (callback) {
  var self = this;

  var endTest = function () {
    self.baseTeardownTest(callback);
  };

  var deleteTopics = function () {
    self.service.listTopics(function (queryError, topics) {
      if (!queryError && topics.length > 0) {
        var topicCount = 0;
        topics.forEach(function (topic) {
          self.service.deleteTopic(topic.TopicName, function () {
            topicCount++;

            if (topicCount === topics.length) {
              endTest();
            }
          });
        });
      }
      else {
        endTest();
      }
    });
  };

  self.service.listQueues(function (queryError, queues) {
    if (!queryError && queues.length > 0) {
      var queueCount = 0;
      queues.forEach(function (queue) {
        self.service.deleteQueue(queue.QueueName, function () {
          queueCount++;

          if (queueCount === queues.length) {
            deleteTopics();
          }
        });
      });
    }
    else {
      deleteTopics();
    }
  });
};

exports.createServiceBusTestUtils = function (service, testPrefix) {
  return new ServiceBusTestUtils(service, testPrefix);
};

var checkValue = function(test, value, optionValue) {
  if (optionValue) {
    assert.equal(value, optionValue);
  }
};

exports.validateQueue = function(testObject, queueName, queueOptions, queue) {
  testObject.notEqual(queue, null);
  if (queue) {
    testObject.equal(queue.QueueName, queueName);
    checkValue(testObject, queue.LockDuration, queueOptions.LockDuration.toString());
    checkValue(testObject, queue.RequiresDuplicateDetection, queueOptions.RequiresDuplicateDetection.toString());
    checkValue(testObject, queue.RequiresSession, queueOptions.RequiresSession.toString());
    checkValue(testObject, queue.DefaultMessageTimeToLive, queueOptions.DefaultMessageTimeToLive.toString());
    checkValue(testObject, queue.DeadLetteringOnMessageExpiration, queueOptions.DeadLetteringOnMessageExpiration.toString());
    checkValue(testObject, queue.DuplicateDetectionHistoryTimeWindow, queueOptions.DuplicateDetectionHistoryTimeWindow.toString());
    checkValue(testObject, queue.MaxSizeInMegabytes, queueOptions.MaxSizeInMegabytes.toString());
  };
};

exports.checkNullParameter = function (callback) {
  assert.throws(
      function () {
        callback();
      },
      /name must be a non empty string/
    );
};