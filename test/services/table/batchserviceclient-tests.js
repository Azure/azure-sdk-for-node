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
var BatchServiceClient = testutil.libRequire('services/legacyStorage/lib/table/batchserviceclient');
var Constants = common.Constants;
var HttpConstants = Constants.HttpConstants;

var tableNames = [];
var tablePrefix = 'batch';

var entity1 = { PartitionKey: 'part1',
  RowKey: 'row1',
  address: 'my city, my state',
  field1: 'my field1',
  otherprops: 'my properties'
};

var testPrefix = 'batchserviceclient-tests';

var tableService;
var suiteUtil;

suite('batchserviceclient-tests', function () {
  suiteSetup(function (done) {
    tableService = storage.createTableService()
      .withFilter(new common.ExponentialRetryPolicyFilter());

    suiteUtil = tabletestutil.createTableTestUtils(tableService, testPrefix);
    suiteUtil.setupSuite(done);
  });

  suiteTeardown(function (done) {
    suiteUtil.teardownSuite(done);
  });

  setup(function (done) {
    suiteUtil.setupTest(done);
  });

  teardown(function (done) {
    suiteUtil.teardownTest(done);
  });

  test('AddOperation', function (done) {
    var tableName = testutil.generateId(tablePrefix, tableNames, suiteUtil.isMocked);

    tableService.beginBatch();

    assert.throws(function () {
      tableService.commitBatch(function () { });
    });

    tableService.createTable(tableName, null, function (createTableError, table, createTableResponse) {
      assert.equal(createTableError, null);
      assert.notEqual(table, null);
      assert.equal(createTableResponse.statusCode, HttpConstants.HttpResponseCodes.Created);

      tableService.insertEntity(tableName, entity1, null, function (insertError, insertEntity, insertEntityResponse) {
        assert.equal(insertError, null);
        assert.equal(insertEntity, null);
        assert.equal(insertEntityResponse.statusCode, BatchServiceClient.BATCH_CODE);
      });

      // The operations were successfully added
      assert.notEqual(tableService.operations, null);
      tableService.commitBatch(function (performBatchError, performBatchOperationResponses, performBatchResponse) {
        assert.equal(performBatchError, null);
        assert.equal(performBatchResponse.statusCode, HttpConstants.HttpResponseCodes.Created);

        // The operations were successfully reset
        assert.equal(tableService.operations, null);

        done();
      });
    });
  });

  test('HasOperations', function (done) {
    var tableName = testutil.generateId(tablePrefix, tableNames, suiteUtil.isMocked);

    tableService.beginBatch();

    assert.equal(tableService.isInBatch(), true);
    assert.equal(tableService.hasOperations(), false);

    // Don't really need to create the table since we're not going to execute the batch
    tableService.insertEntity(tableName, entity1, null, function (insertError, insertEntity, insertEntityResponse) {
      assert.equal(insertError, null);
      assert.equal(insertEntity, null);
      assert.equal(insertEntityResponse.statusCode, BatchServiceClient.BATCH_CODE);
    });

    assert.equal(tableService.isInBatch(), true);
    assert.equal(tableService.hasOperations(), true);

    // insert another one just to check
    tableService.insertEntity(tableName, entity1, null, function (insertError, insertEntity, insertEntityResponse) {
      assert.equal(insertError, null);
      assert.equal(insertEntity, null);
      assert.equal(insertEntityResponse.statusCode, BatchServiceClient.BATCH_CODE);
    });

    assert.equal(tableService.isInBatch(), true);
    assert.equal(tableService.hasOperations(), true);

    tableService.rollback();

    // rolling back should've clear the batch
    assert.equal(tableService.hasOperations(), false);
    assert.equal(tableService.isInBatch(), false);

    done();
  });
});
