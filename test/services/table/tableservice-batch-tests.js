//
// Copyright (c) Microsoft and contributors.  All rights reserved.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//   http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
//
// See the License for the specific language governing permissions and
// limitations under the License.
//

var assert = require('assert');

// Test includes
var testutil = require('../../util/util');
var tabletestutil = require('../../framework/table-test-utils');

// Lib includes
var common = require('azure-common');
var storage = require('azure-storage-legacy');

var azureutil = common.util;

var ServiceClient = common.ServiceClient;
var TableQuery = storage.TableQuery;
var Constants = common.Constants;
var HttpConstants = Constants.HttpConstants;

var tableNames = [];
var tablePrefix = 'tablebatch';

var testPrefix = 'tableservice-batch-tests';

var tableService;
var testUtil;

suite('tableservice-batch-tests', function () {
  suiteSetup(function (done) {
    tableService = storage.createTableService()
      .withFilter(new common.ExponentialRetryPolicyFilter());

    testUtil = tabletestutil.createTableTestUtils(tableService, testPrefix);
    testUtil.setupSuite(done);
  });

  suiteTeardown(function (done) {
    testUtil.teardownSuite(done);
  });

  setup(function (done) {
    testUtil.setupTest(done);
  });

  teardown(function (done) {
    testUtil.teardownTest(done);
  });

  test('QueryEntities_All', function (done) {
    var tableName = testutil.generateId(tablePrefix, tableNames, testUtil.isMocked);

    tableService.createTable(tableName, function (createError, table, createResponse) {
      assert.equal(createError, null);
      assert.notEqual(table, null);
      assert.ok(createResponse.isSuccessful);

      var entities = generateEntities(20);

      tableService.beginBatch();
      entities.forEach(function (entity) {
        tableService.insertEntity(tableName, entity);
      });

      tableService.commitBatch(function (batchError, performBatchOperationResponses, batchResponse) {
        assert.equal(batchError, null);
        assert.ok(batchResponse.isSuccessful);

        var tableQuery = TableQuery.select()
          .from(tableName);

        tableService.queryEntities(tableQuery, function (queryError, entries, entriesContinuation, queryResponse) {
          assert.equal(queryError, null);
          assert.ok(queryResponse.isSuccessful);

          if (entries) {
            assert.equal(entries.length, 20);
          }

          done();
        });
      });
    });
  });

  test('QueryEntities_Single1', function (done) {
    var tableName = testutil.generateId(tablePrefix, tableNames, testUtil.isMocked);

    tableService.createTable(tableName, function (createError, table, createResponse) {
      assert.equal(createError, null);
      assert.notEqual(table, null);
      assert.ok(createResponse.isSuccessful);

      var entities = generateEntities(20);

      tableService.beginBatch();
      entities.forEach(function (entity) {
        tableService.insertEntity(tableName, entity);
      });

      tableService.commitBatch(function (batchError, performBatchOperationResponses, batchResponse) {
        assert.equal(batchError, null);
        assert.ok(batchResponse.isSuccessful);

        var tableQuery = TableQuery.select()
          .from(tableName)
          .whereKeys(entities[0].PartitionKey, entities[0].RowKey.toString());

        tableService.queryEntities(tableQuery, function (queryError, entries, entriesContinuation, queryResponse) {
          assert.equal(queryError, null);
          assert.ok(queryResponse.isSuccessful);

          if (entries) {
            assert.equal(entries.length, 1);
          }

          done();
        });
      });
    });
  });

  test('QueryEntities_Single2', function (done) {
    var tableName = testutil.generateId(tablePrefix, tableNames, testUtil.isMocked);

    tableService.createTable(tableName, function (createError, table, createResponse) {
      assert.equal(createError, null);
      assert.notEqual(table, null);
      assert.ok(createResponse.isSuccessful);

      var entities = generateEntities(20);

      tableService.beginBatch();
      entities.forEach(function (entity) {
        tableService.insertEntity(tableName, entity);
      });

      tableService.commitBatch(function (batchError, performBatchOperationResponses, batchResponse) {
        assert.equal(batchError, null);
        assert.ok(batchResponse.isSuccessful);

        tableService.queryEntity(tableName, entities[0].PartitionKey, entities[0].RowKey.toString(), function (queryError, entry, queryResponse) {
          assert.equal(queryError, null);
          assert.ok(queryResponse.isSuccessful);
          assert.notEqual(entry, null);
          assert.equal(entry.PartitionKey, entities[0].PartitionKey);
          assert.equal(entry.RowKey, entities[0].RowKey);

          done();
        });
      });
    });
  });

  test('RetrieveEntities_TableQuery1', function (done) {
    var tableName = testutil.generateId(tablePrefix, tableNames, testUtil.isMocked);

    tableService.createTable(tableName, function (createError, table, createResponse) {
      assert.equal(createError, null);
      assert.notEqual(table, null);
      assert.ok(createResponse.isSuccessful);

      var entities = generateEntities(20);

      tableService.beginBatch();
      entities.forEach(function (entity) {
        tableService.insertEntity(tableName, entity);
      });

      tableService.commitBatch(function (batchError, performBatchOperationResponses, batchResponse) {
        assert.equal(batchError, null);
        assert.ok(batchResponse.isSuccessful);

        var tableQuery = TableQuery.select()
          .from(tableName)
          .where('address eq ?', entities[0].address)
          .and('RowKey eq ?', entities[0].RowKey.toString());

        tableService.queryEntities(tableQuery, function (queryError, entries, entriesContinuation, queryResponse) {
          assert.equal(queryError, null);
          assert.notEqual(entries, null);
          assert.ok(queryResponse.isSuccessful);

          if (entries) {
            assert.equal(entries.length, 1);
            if (entries[0]) {
              assert.equal(entries[0].address, entities[0].address);
              assert.equal(entries[0].RowKey, entities[0].RowKey);
              assert.equal(entries[0].PartitionKey, entities[0].PartitionKey);
            }
          }

          done();
        });
      });
    });
  });

  test('RetrieveEntities_TableQuery2', function (done) {
    var tableName = testutil.generateId(tablePrefix, tableNames, testUtil.isMocked);

    tableService.createTable(tableName, function (createError, table, createResponse) {
      assert.equal(createError, null);
      assert.notEqual(table, null);
      assert.ok(createResponse.isSuccessful);

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
        assert.equal(batchError, null);

        assert.notEqual(batchResponse, null);
        if (batchResponse) {
          assert.ok(batchResponse.isSuccessful);
        }

        var tableQuery = TableQuery.select()
          .from(tableName)
          .where('address eq ?', entities[0].address)
          .and('PartitionKey eq ?', entities[0].PartitionKey);

        tableService.queryEntities(tableQuery, function (queryError, entries, entriesContinuation, queryResponse) {
          assert.equal(queryError, null);
          assert.notEqual(entries, null);
          if (entries) {
            assert.equal(entries.length, 1);

            if (entries[0]) {
              assert.equal(entries[0].address, entities[0].address);
              assert.equal(entries[0].RowKey, entities[0].RowKey);
              assert.equal(entries[0].PartitionKey, entities[0].PartitionKey);
            }
          }

          assert.notEqual(queryResponse, null);
          if (queryResponse) {
            assert.ok(queryResponse.isSuccessful);
          }

          done();
        });
      });
    });
  });

  test('RetrieveEntities_Top', function (done) {
    var tableName = testutil.generateId(tablePrefix, tableNames, testUtil.isMocked);

    tableService.createTable(tableName, function (createError, table, createResponse) {
      assert.equal(createError, null);
      assert.notEqual(table, null);

      assert.notEqual(createResponse, null);
      if (createResponse) {
        assert.ok(createResponse.isSuccessful);
      }

      var entities = generateEntities(20);

      tableService.beginBatch();
      entities.forEach(function (entity) {
        tableService.insertEntity(tableName, entity);
      });

      tableService.commitBatch(function (batchError, performBatchOperationResponses, batchResponse) {
        assert.equal(batchError, null);

        assert.notEqual(batchResponse, null);
        if (batchResponse) {
          assert.ok(batchResponse.isSuccessful);
        }

        var tableQuery = TableQuery.select()
          .from(tableName)
          .top(4);

        tableService.queryEntities(tableQuery, function (queryError, entries, entriesContinuation, queryResponse) {
          assert.equal(queryError, null);

          assert.notEqual(entries, null);
          if (entries) {
            assert.equal(entries.length, 4);
          }

          assert.notEqual(queryResponse, null);
          if (queryResponse) {
            assert.ok(queryResponse.isSuccessful);
          }

          done();
        });
      });
    });
  });

  // TODO: fix
/*
  test('FailBatch', function (done) {
    var tableName = testutil.generateId(tablePrefix, tableNames, testUtil.isMocked);

    tableService.createTable(tableName, function (createError, table, createResponse) {
      assert.equal(createError, null);
      assert.notEqual(table, null);

      assert.notEqual(createResponse, null);
      if (createResponse) {
        assert.ok(createResponse.isSuccessful);
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
        assert.equal(batchError, null);

        assert.notEqual(performBatchOperationResponses, null);
        assert.equal(performBatchOperationResponses.length, 1);
        assert.notEqual(performBatchOperationResponses[0].error, null);
        assert.equal(performBatchOperationResponses[0].error.code, Constants.StorageErrorCodeStrings.RESOURCE_NOT_FOUND);

        assert.notEqual(batchResponse, null);
        if (batchResponse) {
          assert.ok(batchResponse.isSuccessful);
        }

        done();
      });
    });
  });*/
});

function generateEntities(count) {
  var entities = [];

  for(var i = 0 ; i < count ; i++) {
    var entity = {
      PartitionKey: 'partition1',
      RowKey: (i + 1).toString(),
      address: 'street' + (i + 1)
    };

    entities.push(entity);
  }

  return entities;
};
