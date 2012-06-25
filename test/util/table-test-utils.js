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
  var tableService;

  if (exports.isMocked) {
    if (exports.isRecording) {
      tableService = azure.createTableService();
    } else {
      // The mockserver will ignore the credentials when it's in playback mode
      tableService = azure.createTableService('playback', 'playback');
    }

    if (!mockServerClient) {
      mockServerClient = new MockServerClient();
      mockServerClient.tryStartServer();
    }

    mockServerClient.startTest(testPrefix + currentTest, function () {
      tableService.useProxy = true;
      tableService.proxyUrl = 'localhost';
      tableService.proxyPort = 8888;

      callback(null, tableService);
    });
  } else {
    tableService = azure.createTableService();
    callback(null, tableService);
  }
};

exports.tearDownTest = function (numberTests, tableService, testPrefix, callback) {
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

  tableService.queryTables(function (queryError, tables) {
    if (!queryError && tables.length > 0) {
      var tableCount = 0;
      tables.forEach(function (table) {
        tableService.deleteTable(table.TableName, function () {
          tableCount++;

          if (tableCount === tables.length) {
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