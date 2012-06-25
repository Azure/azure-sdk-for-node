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
var testutil = require('../../util/util');
var tabletestutil = require('../../util/table-test-utils');

// Lib includes
var azure = testutil.libRequire('azure');
var azureutil = testutil.libRequire('util/util');
var testutil = testutil.libRequire('util/util');

var ServiceClient = azure.ServiceClient;
var TableQuery = azure.TableQuery;
var Constants = azure.Constants;
var HttpConstants = Constants.HttpConstants;
var StorageErrorCodeStrings = Constants.StorageErrorCodeStrings;

var tableService;
var tableNames = [];
var tablePrefix = 'tablecont';

suite('querytablesresultcontinuation-tests', function () {
  setup(function (done) {
    tableService = azure.createTableService();

    done();
  });

  teardown(function (done) {
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
                done();
              }
            }
          });
        });
      }
      else {
        done();
      }
    };

    tableService.queryTables(deleteTablePage);
  });

  test('ContinuationTokens', function (done) {
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
            assert.equal(err, null);
            count += nextTables.length;

            nextTables.forEach(function (t) {
              if (t.TableName === 'WADDiagnosticInfrastructureLogsTable'
               || t.TableName === 'WADLogsTable'
               || t.TableName === 'WADPerformanceCountersTable') {
                count--;
              }
            });

            assert.equal(count, tableNames.length);
            assert.equal(tablesContinuation2.hasNextPage(), false);
            done();
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
          assert.equal(createError, null);

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
  });
});