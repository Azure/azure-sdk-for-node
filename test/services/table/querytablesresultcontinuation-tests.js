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
var testutil = require('../../util/util');

var ServiceClient = require("../../../lib/services/serviceclient");
var TableQuery = require('../../../lib/services/table/tablequery');
var Constants = require('../../../lib/util/constants');
var HttpConstants = Constants.HttpConstants;
var StorageErrorCodeStrings = Constants.StorageErrorCodeStrings;

var tableService;
var tableNames = [];
var tablePrefix = 'tablecont';

module.exports = testCase(
{
  setUp: function (callback) {
    tableService = azure.createTableService();

    callback();
  },

  tearDown: function (callback) {
    var deleteTablePage = function (error, tablesResult, tablesResultContinuation) {
      if (!error && tablesResult.length > 0) {
        var tableCount = 0;
        tablesResult.forEach(function (table) {
          tableService.deleteTable(table.TableName, function () {
            tableCount++;

            if (tableCount === tablesResult.length) {
              // if it is the last table in this page, check if there is more pages
              if (tablesResultContinuation.hasNextPage()) {
                // if there is more pages, fetch them and continue
                tablesResultContinuation.getNextPage(deleteTablePage);
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

    tableService.queryTables(deleteTablePage);
  },

  testContinuationTokens: function (test) {
    var createdTables = 0;
    var scheduledTables = 0;
    var tableLength = 1200;
    var intervalId;

    var getTables = function () {
      tableService.queryTables(function (getError, tables, tablesContinuation) {
        var count = tables.length;
        tables.forEach(function (t) {
          if (t.TableName === 'WADDiagnosticInfrastructureLogsTable'
           || t.TableName === 'WADLogsTable'
           || t.TableName === 'WADPerformanceCountersTable') {
            count--;
          }
        });

        if (tablesContinuation.hasNextPage()) {
          tablesContinuation.getNextPage(function (err, nextTables, tablesContinuation2) {
            test.equal(err, null);
            count += nextTables.length;

            nextTables.forEach(function (t) {
              if (t.TableName === 'WADDiagnosticInfrastructureLogsTable'
               || t.TableName === 'WADLogsTable'
               || t.TableName === 'WADPerformanceCountersTable') {
                count--;
              }
            });

            test.equal(count, tableNames.length);
            test.equal(tablesContinuation2.hasNextPage(), false);
            test.done();
          });
        }
      });
    };

    // Creates a table from the current sequence.
    // If the last table is created, wait 5 seconds and then invoke getTables.
    var createTable = function () {
      scheduledTables++;
      if (scheduledTables >= tableLength) {
        clearInterval(intervalId);
      }

      if (scheduledTables <= tableLength) {
        tableService.createTable(testutil.generateId(tablePrefix, tableNames), function (createError) {
          test.equal(createError, null);

          createdTables++;
          if (createdTables >= tableLength) {
            // test getting tables now that everything has been inserted
            // wait and then call getTables
            setTimeout(getTables(), 5000);
          }
        });
      }
    };

    // Create a table every 100 mseconds to avoid getting disconnected by the service
    intervalId = setInterval(createTable, 100);

    // Run the first batch now
    createTable();
  }
});