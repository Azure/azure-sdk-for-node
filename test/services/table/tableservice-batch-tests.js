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

var ServiceClient = require('../../../lib/services/serviceclient');
var TableQuery = require('../../../lib/services/table/tablequery');
var Constants = require('../../../lib/util/constants');
var HttpConstants = Constants.HttpConstants;

var tableService;
var tableNames = [];
var testPrefix = 'tableservicebatch';

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
              // clean up
              callback();
            }
          });
        });
      }
      else {
        // clean up
        callback();
      }
    });
  },

  testQueryEntities_All: function (test) {
    var tableName = testutil.generateId(testPrefix, tableNames);

    tableService.createTable(tableName, function (createError, table, createResponse) {
      test.equal(createError, null);
      test.notEqual(table, null);
      test.ok(createResponse.isSuccessful);

      var entities = generateEntities(20);

      tableService.beginBatch();
      entities.forEach(function (entity) {
        tableService.insertEntity(tableName, entity);
      });

      tableService.commitBatch(function (batchError, performBatchOperationResponses, batchResponse) {
        test.equal(batchError, null);
        test.ok(batchResponse.isSuccessful);

        var tableQuery = TableQuery.select()
          .from(tableName);

        tableService.queryEntities(tableQuery, function (queryError, entries, entriesContinuation, queryResponse) {
          test.equal(queryError, null);
          test.ok(queryResponse.isSuccessful);

          if (entries) {
            test.equal(entries.length, 20);
          }

          test.done();
        });
      });
    });
  },

  testQueryEntities_Single1: function (test) {
    var tableName = testutil.generateId(testPrefix, tableNames);

    tableService.createTable(tableName, function (createError, table, createResponse) {
      test.equal(createError, null);
      test.notEqual(table, null);
      test.ok(createResponse.isSuccessful);

      var entities = generateEntities(20);

      tableService.beginBatch();
      entities.forEach(function (entity) {
        tableService.insertEntity(tableName, entity);
      });

      tableService.commitBatch(function (batchError, performBatchOperationResponses, batchResponse) {
        test.equal(batchError, null);
        test.ok(batchResponse.isSuccessful);

        var tableQuery = TableQuery.select()
          .from(tableName)
          .whereKeys(entities[0].PartitionKey, entities[0].RowKey);

        tableService.queryEntities(tableQuery, function (queryError, entries, entriesContinuation, queryResponse) {
          test.equal(queryError, null);
          test.ok(queryResponse.isSuccessful);

          if (entries) {
            test.equal(entries.length, 1);
          }

          test.done();
        });
      });
    });
  },

  testQueryEntities_Single2: function (test) {
    var tableName = testutil.generateId(testPrefix, tableNames);

    tableService.createTable(tableName, function (createError, table, createResponse) {
      test.equal(createError, null);
      test.notEqual(table, null);
      test.ok(createResponse.isSuccessful);

      var entities = generateEntities(20);

      tableService.beginBatch();
      entities.forEach(function (entity) {
        tableService.insertEntity(tableName, entity);
      });

      tableService.commitBatch(function (batchError, performBatchOperationResponses, batchResponse) {
        test.equal(batchError, null);
        test.ok(batchResponse.isSuccessful);

        tableService.queryEntity(tableName, entities[0].PartitionKey, entities[0].RowKey, function (queryError, entry, queryResponse) {
          test.equal(queryError, null);
          test.ok(queryResponse.isSuccessful);
          test.notEqual(entry, null);
          test.equal(entry.PartitionKey, entities[0].PartitionKey);
          test.equal(entry.RowKey, entities[0].RowKey);

          test.done();
        });
      });
    });
  },

  testRetrieveEntities_TableQuery1: function (test) {
    var tableName = testutil.generateId(testPrefix, tableNames);

    tableService.createTable(tableName, function (createError, table, createResponse) {
      test.equal(createError, null);
      test.notEqual(table, null);
      test.ok(createResponse.isSuccessful);

      var entities = generateEntities(20);

      tableService.beginBatch();
      entities.forEach(function (entity) {
        tableService.insertEntity(tableName, entity);
      });

      tableService.commitBatch(function (batchError, performBatchOperationResponses, batchResponse) {
        test.equal(batchError, null);
        test.ok(batchResponse.isSuccessful);

        var tableQuery = TableQuery.select()
          .from(tableName)
          .where('address eq ?', entities[0].address)
          .and('RowKey eq ?', entities[0].RowKey);

        tableService.queryEntities(tableQuery, function (queryError, entries, entriesContinuation, queryResponse) {
          test.equal(queryError, null);
          test.notEqual(entries, null);
          test.ok(queryResponse.isSuccessful);

          if (entries) {
            test.equal(entries.length, 1);
            if (entries[0]) {
              test.equal(entries[0].address, entities[0].address);
              test.equal(entries[0].RowKey, entities[0].RowKey);
              test.equal(entries[0].PartitionKey, entities[0].PartitionKey);
            }
          }

          test.done();
        });
      });
    });
  },

  testRetrieveEntities_TableQuery2: function (test) {
    var tableName = testutil.generateId(testPrefix, tableNames);

    tableService.createTable(tableName, function (createError, table, createResponse) {
      test.equal(createError, null);
      test.notEqual(table, null);
      test.ok(createResponse.isSuccessful);

      var entities = generateEntities(20);

      // Make sure the address for the first entity is different than the remaining entities
      entities.forEach(function (entity) {
        entity.address = 'other';
      });
      entities[0].address = 'unique';

      tableService.beginBatch();
      entities.forEach(function (entity) {
        tableService.insertEntity(tableName, entity);
      });

      tableService.commitBatch(function (batchError, performBatchOperationResponses, batchResponse) {
        test.equal(batchError, null);

        test.notEqual(batchResponse, null);
        if (batchResponse) {
          test.ok(batchResponse.isSuccessful);
        }

        var tableQuery = TableQuery.select()
          .from(tableName)
          .where('address eq ?', entities[0].address)
          .and('PartitionKey eq ?', entities[0].PartitionKey);

        tableService.queryEntities(tableQuery, function (queryError, entries, entriesContinuation, queryResponse) {
          test.equal(queryError, null);
          test.notEqual(entries, null);
          if (entries) {
            test.equal(entries.length, 1);

            if (entries[0]) {
              test.equal(entries[0].address, entities[0].address);
              test.equal(entries[0].RowKey, entities[0].RowKey);
              test.equal(entries[0].PartitionKey, entities[0].PartitionKey);
            }
          }

          test.notEqual(queryResponse, null);
          if (queryResponse) {
            test.ok(queryResponse.isSuccessful);
          }

          test.done();
        });
      });
    });
  },

  testRetrieveEntities_Top: function (test) {
    var tableName = testutil.generateId(testPrefix, tableNames);

    tableService.createTable(tableName, function (createError, table, createResponse) {
      test.equal(createError, null);
      test.notEqual(table, null);

      test.notEqual(createResponse, null);
      if (createResponse) {
        test.ok(createResponse.isSuccessful);
      }

      var entities = generateEntities(20);

      tableService.beginBatch();
      entities.forEach(function (entity) {
        tableService.insertEntity(tableName, entity);
      });

      tableService.commitBatch(function (batchError, performBatchOperationResponses, batchResponse) {
        test.equal(batchError, null);

        test.notEqual(batchResponse, null);
        if (batchResponse) {
          test.ok(batchResponse.isSuccessful);
        }

        var tableQuery = TableQuery.select()
          .from(tableName)
          .top(4);

        tableService.queryEntities(tableQuery, function (queryError, entries, entriesContinuation, queryResponse) {
          test.equal(queryError, null);

          test.notEqual(entries, null);
          if (entries) {
            test.equal(entries.length, 4);
          }

          test.notEqual(queryResponse, null);
          if (queryResponse) {
            test.ok(queryResponse.isSuccessful);
          }

          test.done();
        });
      });
    });
  },

  testFailBatch: function (test) {
    var tableName = testutil.generateId(testPrefix, tableNames);

    tableService.createTable(tableName, function (createError, table, createResponse) {
      test.equal(createError, null);
      test.notEqual(table, null);

      test.notEqual(createResponse, null);
      if (createResponse) {
        test.ok(createResponse.isSuccessful);
      }

      var simpleEntity = {
        PartitionKey: 'part',
        RowKey: 1,
        MyField: 'value'
      };

      tableService.beginBatch();

      tableService.insertEntity(tableName, simpleEntity);

      // Doing an update on the same entity within the same batch should make the batch fail
      simpleEntity.MyField = 'othervalue';
      tableService.updateEntity(tableName, simpleEntity);

      tableService.commitBatch(function (batchError, performBatchOperationResponses, batchResponse) {
        test.equal(batchError, null);

        test.notEqual(performBatchOperationResponses, null);
        test.equal(performBatchOperationResponses.length, 1);
        test.notEqual(performBatchOperationResponses[0].error, null);
        test.equal(performBatchOperationResponses[0].error.code, Constants.StorageErrorCodeStrings.RESOURCE_NOT_FOUND);

        test.notEqual(batchResponse, null);
        if (batchResponse) {
          test.ok(batchResponse.isSuccessful);
        }

        test.done();
      });
    });
  }
});

function generateEntities(count) {
  var entities = [];
  
  for(var i = 0 ; i < count ; i++) {
    var entity = {
      PartitionKey: 'partition1',
      RowKey: i + 1,
      address: 'street' + testutil.randomFromTo(0, 50)
    };

    entities.push(entity);
  }

  return entities;
};
