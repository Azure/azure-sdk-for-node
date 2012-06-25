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

var fs = require('fs');

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
  var blobService;

  if (exports.isMocked) {
    if (exports.isRecording) {
      blobService = azure.createBlobService();
    } else {
      // The mockserver will ignore the credentials when it's in playback mode
      blobService = azure.createBlobService('playback', 'playback');
    }

    if (!mockServerClient) {
      mockServerClient = new MockServerClient();
      mockServerClient.tryStartServer();
    }

    mockServerClient.startTest(testPrefix + currentTest, function () {
      blobService.useProxy = true;
      blobService.proxyUrl = 'localhost';
      blobService.proxyPort = 8888;

      callback(null, blobService);
    });
  } else {
    blobService = azure.createBlobService();
    callback(null, blobService);
  }
};

exports.tearDownTest = function (numberTests, blobService, testPrefix, callback) {
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

  var deleteFiles = function () {
    // delete test files
    var list = fs.readdirSync('./');
    list.forEach(function (file) {
      if (file.indexOf('.test') !== -1) {
        fs.unlinkSync(file);
      }
    });

    endTest();
  };

  // delete blob containers
  blobService.listContainers(function (listError, containers) {
    if (containers && containers.length > 0) {
      var containerCount = 0;
      containers.forEach(function (container) {
        blobService.deleteContainer(container.name, function () {
          containerCount++;
          if (containerCount === containers.length) {
            // clean up
            deleteFiles();
          }
        });
      });
    }
    else {
      // clean up
      deleteFiles();
    }
  });
};