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
var MockServerClient = require('http-mock');

// Lib includes
var azure = testutil.libRequire('azure');

var exports = module.exports;

exports.isMocked = MockServerClient.isEnabled();
exports.isRecording = MockServerClient.isRecording();

var mockServerClient;

exports.setUpTest = function (testPrefix, callback) {
  var notificationHubService;

  notificationHubService = azure.createNotificationHubService();
  callback(null, notificationHubService);
};

exports.tearDownTest = function (notificationHubService, testPrefix, callback) {
  callback();
};

var checkValue = function(test, value, optionValue) {
  if (optionValue) {
    assert.equal(value, optionValue);
  }
};

exports.checkNullParameter = function (callback) {
  assert.throws(
      function () {
        callback();
      },
      /name must be a non empty string/
    );
};