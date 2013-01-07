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
var MockServerClient = require('http-mock');

// Lib includes
var azure = testutil.libRequire('azure');

exports = module.exports = StorageTestUtils;

function StorageTestUtils(service, testPrefix) {
  this.service = service;
  this.testPrefix = testPrefix;
  this.mockServerClient;
  this.currentTest = 0;

  this.isMocked = MockServerClient.isEnabled();
  this.isRecording = MockServerClient.isRecording();
}

StorageTestUtils.prototype.normalizeService = function (service) {
  if (this.isMocked) {
    service.useProxy = true;
    service.proxyUrl = 'localhost';
    service.proxyPort = 8888;
  }
};

StorageTestUtils.prototype.setupSuite = function (callback) {
  if (this.isMocked && !this.mockServerClient) {
    this.mockServerClient = new MockServerClient();
    this.mockServerClient.startServer();
  }

  callback();
};

StorageTestUtils.prototype.teardownSuite = function (callback) {
  this.currentTest = 0;

  if (this.isMocked) {
    this.mockServerClient.stopServer();
    this.mockServerClient = null;
  }

  callback();
};

StorageTestUtils.prototype.setupTest = function (callback) {
  var self = this;

  self.currentTest++;
  if (self.isMocked) {
    self.mockServerClient.startTest(self.testPrefix + self.currentTest, function () {
      self.normalizeService(self.service);

      callback();
    });
  } else {
    callback();
  }
};

StorageTestUtils.prototype.baseTeardownTest = function (callback) {
  if (this.isMocked) {
    this.mockServerClient.endTest(this.testPrefix + this.currentTest, callback);
  } else {
    callback();
  }
};