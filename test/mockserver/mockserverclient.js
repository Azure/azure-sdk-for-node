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

var http = require('http');

var mockServer = require('../mockserver/mockserver');

var ServiceClient = require("../../lib/services/core/serviceclient");

var recordingsPath = '/session';

// Expose 'MockServerClient'
exports = module.exports = MockServerClient;

MockServerClient.isRecording = function () {
  return process.env['AZURE_TEST_IS_RECORDING'] === '1' ||
         process.env['AZURE_TEST_IS_RECORDING'] === 'true';
};

MockServerClient.isMocked = function () {
  return false;
  // TODO: uncomment once mock server is running correctly again.
  /*
  return !(process.env['AZURE_TEST_IS_NOT_MOCKED'] === '1' ||
           process.env['AZURE_TEST_IS_NOT_MOCKED'] === 'true');
           */
};

MockServerClient.showLogs = function () {
  return process.env['AZURE_TEST_SHOW_MOCK_LOGS'] === '1' ||
         process.env['AZURE_TEST_SHOW_MOCK_LOGS'] === 'true';
};

function MockServerClient() {
  mockServer.log = MockServerClient.showLogs();

  this.server = null;
};

MockServerClient.prototype.tryStartServer = function () {
  if (!this.server) {
    this.server = mockServer.createServer();
  }
};

MockServerClient.prototype.stopServer = function () {
  if (this.server) {
    this.server.close();
  }
};

MockServerClient.prototype.startTest = function (testName, callback) {
  this.tryStartServer();

  if (MockServerClient.isRecording()) {
    this.startRecording(testName, callback);
  }
  else {
    this.startPlayback(testName, callback);
  }
};

MockServerClient.prototype.endTest = function (testName, lastTest, callback) {
  var self = this;
  var shutdown = function () {
    if (lastTest) {
      self.stopServer();
    }

    callback();
  };

  if (MockServerClient.isRecording()) {
    this.endRecording(testName, shutdown);
  }
  else {
    this.endPlayback(testName, shutdown);
  }
};

MockServerClient.prototype.startRecording = function (name, callback) {
  var requestOptions = {
    method: 'PUT',
    path: recordingsPath,
    host: 'localhost',
    port: '8888'
  };

  var request = http.request(requestOptions, function (response) {
    var body = '';

    // Keep track of the response data.
    response.on('data', function (responseData) {
      body += responseData;
    });

    response.on('end', function () {
      callback();
    });
  });

  request.end(JSON.stringify({ "mode": "recording", "name": name }));
};

MockServerClient.prototype.endRecording = function (name, callback) {
  var requestOptions = {
    method: 'DELETE',
    path: recordingsPath,
    host: 'localhost',
    port: '8888'
  };

  var request = http.request(requestOptions, function (response) {
    response.on('end', function () {
      callback();
    });
  });

  request.end(JSON.stringify({ "mode": "recording", "name": name }));
};

MockServerClient.prototype.startPlayback = function (name, callback) {
  var requestOptions = {
    method: 'PUT',
    path: recordingsPath,
    host: 'localhost',
    port: '8888'
  };

  var request = http.request(requestOptions, function (response) {
    var body = '';

    // Keep track of the response data.
    response.on('data', function (responseData) {
      body += responseData;
    });

    response.on('end', function () {
      callback();
    });
  });
  request.end(JSON.stringify({ "mode": "playback", "name": name }));
};

MockServerClient.prototype.endPlayback = function (name, callback) {
  var requestOptions = {
    method: 'DELETE',
    path: recordingsPath,
    host: 'localhost',
    port: '8888'
  };

  var request = http.request(requestOptions, function (response) {
    response.on('end', function () {
      callback();
    });
  });

  request.end(JSON.stringify({ "mode": "playback", "name": name }));
};