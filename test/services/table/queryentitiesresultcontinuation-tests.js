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
var QueryEntitiesResultContinuation = testutil.libRequire('services/table/models/queryentitiesresultcontinuation');

var ServiceClient = azure.ServiceClient;
var TableQuery = azure.TableQuery;
var Constants = azure.Constants;
var HttpConstants = Constants.HttpConstants;
var StorageErrorCodeStrings = Constants.StorageErrorCodeStrings;

var tableService;
var tableNames = [];
var tablePrefix = 'qecont';

suite('queryentitiesresultcontinuation-tests', function () {
  setup(function (done) {
    tableService = azure.createTableService();

    done();
  });

  teardown(function (done) {
    tableService.queryTables(function (queryError, tables) {
      if (!queryError && tables.length > 0) {
        var tableCount = 0;
        tables.forEach(function (table) {
          tableService.deleteTable(table.TableName, function () {
            tableCount++;

            if (tableCount === tables.length) {
              done();
            }
          });
        });
      }
      else {
        done();
      }
    });
  });

  test('ContinuationTokens', function (done) {
    var tableName = testutil.generateId(tablePrefix, tableNames);
    var numberOfEntities = 30;
    var numberOfEntitiesPerBatch = 10;
    var numberOfEntitiesPerQuery = 10;

    tableService.createTable(tableName, function (createError, table, createResponse) {
      assert.equal(createError, null);
      assert.notEqual(table, null);
      assert.notEqual(createResponse, null);

      if (createResponse) {
        assert.ok(createResponse.isSuccessful);
        assert.equal(createResponse.statusCode, HttpConstants.HttpResponseCodes.CREATED_CODE);
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
              assert.equal(queryError, null);
              assert.notEqual(entries, null);

              if (entries) {
                var count = entries.length;

                if (entriesContinuation.hasNextPage()) {
                  entriesContinuation.getNextPage(function (queryError2, entries2, entriesContinuation2) {
                    assert.equal(queryError2, null);
                    count += entries2.length;

                    if (entriesContinuation2.hasNextPage()) {
                      entriesContinuation2.getNextPage(function (queryError3, entries3, entriesContinuation3) {
                        assert.equal(queryError3, null);
                        count += entries3.length;

                        assert.equal(count, numberOfEntities);
                        assert.equal(entriesContinuation3.hasNextPage(), false);
                        done();
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
  });

  test('NullNextRowKey', function (done) {
    var tableName = testutil.generateId(tablePrefix, tableNames);
    var tableQuery = TableQuery.select().from(tableName);

    tableService.createTable(tableName, function (createError) {
      assert.equal(createError, null);

      var queryEntitiesResultContinuation = new QueryEntitiesResultContinuation(tableService, tableQuery, 'part1', null);
      assert.equal(queryEntitiesResultContinuation.hasNextPage(), true);

      queryEntitiesResultContinuation.getNextPage(function (error) {
        // There should be no error when fetching the next page with a null next row key
        assert.equal(error, null);

        done();
      });
    });
  });
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
      field: 'street' + (i + 1)
    };

    entities.push(entity);
  }

  return entities;
};