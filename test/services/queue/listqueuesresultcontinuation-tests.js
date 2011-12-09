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

var ServiceClient = require("../../../lib/services/serviceclient");
var Constants = require('../../../lib/util/constants');
var HttpConstants = Constants.HttpConstants;
var StorageErrorCodeStrings = Constants.StorageErrorCodeStrings;

var queueService;
var queueNames = generateNames('lqr', 5100);

module.exports = testCase(
{
  setUp: function (callback) {
    queueService = azure.createQueueService();

    callback();
  },

  tearDown: function (callback) {
    var deleteQueuePage = function (error, queuesResult, queuesResultContinuation) {
      if (!error && queuesResult.length > 0) {
        var queueCount = 0;
        queuesResult.forEach(function (queue) {
          queueService.deleteQueue(queue.name, function () {
            queueCount++;

            if (queueCount === queuesResult.length) {
              // if it is the last queue in this page, check if there is more pages
              if (queuesResultContinuation.hasNextPage()) {
                // if there is more pages, fetch them and continue
                queuesResultContinuation.getNextPage(deleteQueuePage);
              }
              else {
                callback();
              }
            }
          });
        });
      }
      else {
        callback();
      }
    };

    queueService.listQueues(deleteQueuePage);
  },

  testContinuationTokens: function (test) {
    var createdQueues = 0;
    var scheduledQueues = 0;
    var intervalId;

    var getQueues = function () {
      queueService.listQueues(function (getError, queues, queuesContinuation) {
        var count = queues.length;

        if (queuesContinuation.hasNextPage()) {
          queuesContinuation.getNextPage(function (err, nextQueues, queuesContinuation2) {
            test.equal(err, null);
            count += nextQueues.length;

            test.equal(count, queueNames.length);
            test.equal(queuesContinuation2.hasNextPage(), false);
            test.done();
          });
        }
      });
    };

    // Creates a queue from the current sequence.
    // If the last queue is created, wait 5 seconds and then invoke getQueues.
    var createQueue = function () {
      scheduledQueues++;
      if (scheduledQueues >= queueNames.length) {
        clearInterval(intervalId);
      }

      if (scheduledQueues <= queueNames.length) {
        queueService.createQueue(queueNames[scheduledQueues - 1], function (createError) {
          test.equal(createError, null);

          createdQueues++;
          if (createdQueues >= queueNames.length) {
            // test getting queues now that everything has been inserted
            // wait and then call getQueues
            setTimeout(getQueues(), 5000);
          }
        });
      }
    };

    // Create a queue every 100 mseconds to avoid getting disconnected by the service
    intervalId = setInterval(createQueue, 100);

    // Run the first batch now
    createQueue();
  }
});

function generateNames(prefix, num) {
  var result = [];
  for (var i = 0; i < num; ) {
    var newNumber = prefix + Math.floor(Math.random() * 10000);
    if (result.indexOf(newNumber) == -1) {
      result.push(newNumber);
      i++;
    }
  }

  return result;
};