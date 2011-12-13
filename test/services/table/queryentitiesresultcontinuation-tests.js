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
var QueryEntitiesResultContinuation = require('../../../lib/services/table/models/queryentitiesresultcontinuation');
var HttpConstants = Constants.HttpConstants;
var StorageErrorCodeStrings = Constants.StorageErrorCodeStrings;

var tableService;
var tableNames = [];
var tablePrefix = 'qecont';

module.exports = testCase(
{
  setUp: function (callback) {
    tableService = azure.createTableService();

    callback();
  },

  tearDown: function (callback) {
    tableService.queryTables(function (queryError, tables) {
      if (!queryError && tables.length > 0) {
        var tableCount = 0;
        tables.forEach(function (table) {
          tableService.deleteTable(table.TableName, function () {
            tableCount++;

            if (tableCount === tables.length) {
              callback();
            }
          });
        });
      }
      else {
        callback();
      }
    });
  },

  testContinuationTokens: function (test) {
    var tableName = testutil.generateId(tablePrefix, tableNames);
    var numberOfEntities = 30;
    var numberOfEntitiesPerBatch = 10;
    var numberOfEntitiesPerQuery = 10;

    tableService.createTable(tableName, function (createError, table, createResponse) {
      test.equal(createError, null);
      test.notEqual(table, null);
      test.notEqual(createResponse, null);

      if (createResponse) {
        test.ok(createResponse.isSuccessful);
        test.equal(createResponse.statusCode, HttpConstants.HttpResponseCodes.CREATED_CODE);
      }

      var entities = generateEntities(numberOfEntities);

      // Insert test data
      var finished = 0;
      for (var i = 0; i < numberOfEntities; i += numberOfEntitiesPerBatch) {
        tableService.beginBatch();

        var entitiesTemp = entities.slice(i, i + numberOfEntitiesPerBatch);
        entitiesTemp.forEach(function (entity) {
          tableService.insertEntity(tableName, entity);
        });

        tableService.commitBatch(function () {
          finished++;
          if (finished === Math.ceil(numberOfEntities / numberOfEntitiesPerBatch)) {
            // Verify
            var tableQuery = TableQuery.select()
              .from(tableName)
              .top(numberOfEntitiesPerQuery);

            tableService.queryEntities(tableQuery, function (queryError, entries, entriesContinuation) {
              test.equal(queryError, null);
              test.notEqual(entries, null);

              if (entries) {
                var count = entries.length;

                if (entriesContinuation.hasNextPage()) {
                  entriesContinuation.getNextPage(function (queryError2, entries2, entriesContinuation2) {
                    test.equal(queryError2, null);
                    count += entries2.length;

                    if (entriesContinuation2.hasNextPage()) {
                      entriesContinuation2.getNextPage(function (queryError3, entries3, entriesContinuation3) {
                        test.equal(queryError3, null);
                        count += entries3.length;

                        test.equal(count, numberOfEntities);
                        test.equal(entriesContinuation3.hasNextPage(), false);
                        test.done();
                      });
                    }
                  });
                };
              }
            });
          }
        });
      }
    });
  },

  testNullNextRowKey: function (test) {
    var tableName = testutil.generateId(tablePrefix, tableNames);
    var tableQuery = TableQuery.select().from(tableName);

    tableService.createTable(tableName, function (createError) {
      test.equal(createError, null);

      var queryEntitiesResultContinuation = new QueryEntitiesResultContinuation(tableService, tableQuery, 'part1', null);
      test.equal(queryEntitiesResultContinuation.hasNextPage(), true);

      queryEntitiesResultContinuation.getNextPage(function (error) {
        // There should be no error when fetching the next page with a null next row key
        test.equal(error, null);

        test.done();
      });
    });
  }
});

function generateNames (prefix, num) {
  var result = [];
  for (var i = 0; i < num; ) {
    var newNumber = prefix + Math.floor(Math.random() * 10000);
    if (result.indexOf(newNumber) == -1) {
      result.push(newNumber);
      i++;
    }
  }

  return result;
};

function generateEntities(count) {
  var entities = [];
  
  for(var i = 0 ; i < count ; i++) {
    var entity = {
      PartitionKey: 'partition1',
      RowKey: i + 1,
      field: 'street' + randomFromTo(0, 50)
    };

    entities.push(entity);
  }

  return entities;
};

function randomFromTo(from, to) {
  return Math.floor(Math.random() * (to - from + 1) + from);
};