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
  var queueService;

  if (exports.isMocked) {
    if (exports.isRecording) {
      queueService = azure.createQueueService();
    } else {
      // The mockserver will ignore the credentials when it's in playback mode
      queueService = azure.createQueueService('playback', 'playback');
    }

    if (!mockServerClient) {
      mockServerClient = new MockServerClient();
      mockServerClient.tryStartServer();
    }

    mockServerClient.startTest(testPrefix + currentTest, function () {
      queueService.useProxy = true;
      queueService.proxyUrl = 'localhost';
      queueService.proxyPort = 8888;

      callback(null, queueService);
    });
  } else {
    queueService = azure.createQueueService();
    callback(null, queueService);
  }
};

exports.tearDownTest = function (numberTests, queueService, testPrefix, callback) {
  var endTest = function () {
    if (exports.isMocked) {
      var lastTest = (numberTests === currentTest + 1);

      mockServerClient.endTest(testPrefix + currentTest, lastTest, function () {
        currentTest++;

        if (lastTest) {
          mockServerClient = null;
          currentTest = 0;
        }

        callback();
      });
    } else {
      callback();
    }
  };

  queueService.listQueues(function (listError, queues) {
    if (queues && queues.length > 0) {
      var queueCount = 0;
      queues.forEach(function (queue) {
        queueService.deleteQueue(queue.name, function () {
          queueCount++;
          if (queueCount === queues.length) {
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