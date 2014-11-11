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

var assert = require('assert');

// Test includes
var testutil = require('../../util/util');

// Lib includes
var azure = testutil.libRequire('azure');

var ExponentialRetryPolicyFilter = azure.ExponentialRetryPolicyFilter;

suite('exponentialretrypolicyfilter-unittests', function () {
  test('RetrySucceedsOnHttp408StatusCode', function (done) {
    var retryCount = 2;
    var retryInterval = 2;
    var minRetryInterval = 1;
    var maxRetryInterval = 10;

    var response = {'statusCode': 408};
    var mockNextGenerator = function() {
      var timesCalled = 0;
      return function(options, retryCallback) {
        if (timesCalled == 0) {
          timesCalled ++;
          retryCallback(true, response, null);
        } else {
          done();
        }
      };
    };

    var mockRetryPolicyFilter = new ExponentialRetryPolicyFilter(retryCount, retryInterval, minRetryInterval, maxRetryInterval);
    mockRetryPolicyFilter(null, mockNextGenerator(), function(err, result, response, body) {
      throw "Fail to retry on HTTP 408";
    });
  });

  test('DoesNotRetryOnHttp404StatusCode', function (done) {
    var retryCount = 2;
    var retryInterval = 2;
    var minRetryInterval = 1;
    var maxRetryInterval = 10;

    var response = {'statusCode': 404};
    var mockNextGenerator = function() {
      var timesCalled = 0;
      return function(options, retryCallback) {
        if (timesCalled == 0) {
          timesCalled ++;
          retryCallback(true, response, null);
        } else {
          throw "Should not retry on HTTP 404";
        }
      };
    };

    var mockRetryPolicyFilter = new ExponentialRetryPolicyFilter(retryCount, retryInterval, minRetryInterval, maxRetryInterval);
    mockRetryPolicyFilter(null, mockNextGenerator(), function(err, result, response, body) {
      done();
    });
  });
});