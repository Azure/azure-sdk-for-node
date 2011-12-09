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

var testutil = require('../../util/util');

var TableService  = require('../../../lib/services/table/tableservice');
var ServiceClient      = require('../../../lib/services/serviceclient');
var BatchServiceClient = require('../../../lib/services/table/batchserviceclient');
var Constants = require('../../../lib/util/constants');
var HttpConstants = Constants.HttpConstants;

var tableService;

var tableNames = [];
var tablePrefix = 'batch';

var entity1 = { PartitionKey: 'part1',
  RowKey: 'row1',
  address: 'my city, my state',
  field1: 'my field1',
  otherprops: 'my properties'
};

module.exports = testCase(
{
  setUp: function (callback) {
    tableService = new TableService();

    callback();
  },

  tearDown: function (callback) {
    // clean up
    callback();
  },

  testAddOperation: function (test) {
    var tableName = testutil.generateId(tablePrefix, tableNames);

    tableService.beginBatch();

    test.throws(function () {
      tableService.commitBatch(function () { });
    });

    tableService.createTable(tableName, null, function (createTableError, table, createTableResponse) {
      test.equal(createTableError, null);
      test.notEqual(table, null);
      test.equal(createTableResponse.statusCode, HttpConstants.HttpResponseCodes.CREATED_CODE);

      tableService.insertEntity(tableName, entity1, null, function (insertError, insertEntity, insertEntityResponse) {
        test.equal(insertError, null);
        test.equal(insertEntity, null);
        test.equal(insertEntityResponse.statusCode, BatchServiceClient.BATCH_CODE);
      });

      // The operations were successfully added
      test.notEqual(tableService.operations, null);
      tableService.commitBatch(function (performBatchError, performBatchOperationResponses, performBatchResponse) {
        test.equal(performBatchError, null);
        test.equal(performBatchResponse.statusCode, HttpConstants.HttpResponseCodes.ACCEPTED_CODE);

        // The operations were successfully reset
        test.equal(tableService.operations, null);

        test.done();
      });
    });
  }
});
