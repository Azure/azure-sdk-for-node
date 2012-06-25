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
var testutil = require('./util');
var MockServerClient = require('../mockserver/mockserverclient');

// Lib includes
var azure = testutil.libRequire('azure');

var exports = module.exports;

exports.isMocked = MockServerClient.isMocked();
exports.isRecording = MockServerClient.isRecording();

var mockServerClient;
var currentTest = 0;

exports.setUpTest = function (testPrefix, callback) {
  var serviceBusService;

  serviceBusService = azure.createServiceBusService();
  callback(null, serviceBusService);
};

exports.tearDownTest = function (numberTests, serviceBusService, testPrefix, callback) {
  var endTest = function () {
    callback();
  };

  var deleteTopics = function () {
    serviceBusService.listTopics(function (queryError, topics) {
      if (!queryError && topics.length > 0) {
        var topicCount = 0;
        topics.forEach(function (topic) {
          serviceBusService.deleteTopic(topic.TopicName, function () {
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

  serviceBusService.listQueues(function (queryError, queues) {
    if (!queryError && queues.length > 0) {
      var queueCount = 0;
      queues.forEach(function (queue) {
        serviceBusService.deleteQueue(queue.QueueName, function () {
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