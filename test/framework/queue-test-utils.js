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

// Test includes
var testutil = require('../util/util');

// Lib includes
var azure = testutil.libRequire('azure');

var MockedTestUtils = require('./mocked-test-utils');

function QueueTestUtils(service, testPrefix) {
  QueueTestUtils.super_.call(this, service, testPrefix);
}

util.inherits(QueueTestUtils, MockedTestUtils);

QueueTestUtils.prototype.teardownTest = function (callback) {
  var self = this;

  var deleteQueues = function (queues, done) {
    if (queues.length <= 0) {
      done();
    } else {
      var currentQueue = queues.pop();
      self.service.deleteQueue(currentQueue.name, function () {
        deleteQueues(queues, done);
      });
    }
  };

  self.service.listQueues(function (queryError, queues) {
    deleteQueues(queues, function () {
      self.baseTeardownTest(callback);
    });
  });
};

exports.createQueueTestUtils = function (service, testPrefix) {
  return new QueueTestUtils(service, testPrefix);
};