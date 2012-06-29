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
var ISO8061Date = testutil.libRequire('util/iso8061date');
var SharedKeyLiteTable = testutil.libRequire('services/table/sharedkeylitetable');

var ServiceClient = azure.ServiceClient;
var Constants = azure.Constants;
var TableQuery = azure.TableQuery;
var HttpConstants = Constants.HttpConstants;
var StorageErrorCodeStrings = Constants.StorageErrorCodeStrings;

var tableService;

var entity1 = { PartitionKey: 'part1',
  RowKey: 'row1',
  field: 'my field',
  otherfield: 'my other field',
  otherprops: 'my properties'
};

var entity2 = { PartitionKey: 'part2',
  RowKey: 'row1',
  boolval: { '@': { type: 'Edm.Boolean' }, '#': true },
  intval: { '@': { type: 'Edm.Int32' }, '#': 42 },
  dateval: { '@': { type: 'Edm.DateTime' }, '#': ISO8061Date.format(new Date()) }
};

var tableNames = [];
var tablePrefix = 'sharedkeytable';

var testPrefix = 'sharedkeytable-tests';
var numberTests = 1;

suite('sharedkeytable-tests', function () {
  setup(function (done) {
    tabletestutil.setUpTest(testPrefix, function (err, newTableService) {
      tableService = newTableService;
      done();
    });
  });

  teardown(function (done) {
    tabletestutil.tearDownTest(numberTests, tableService, testPrefix, done);
  });

  test('CreateTable', function (done) {
    var tableName = testutil.generateId(tablePrefix, tableNames, tabletestutil.isMocked);

    tableService.authenticationProvider = new SharedKeyLiteTable(tableService.storageAccount, tableService.storageAccessKey);
    tableService.createTable(tableName, function (createError, table, createResponse) {
      assert.equal(createError, null);
      assert.notEqual(table, null);
      assert.ok(createResponse.isSuccessful);
      assert.equal(createResponse.statusCode, HttpConstants.HttpResponseCodes.CREATED_CODE);

      assert.ok(table);
      if (table) {
        assert.ok(table.TableName);
        assert.equal(table.TableName, tableName);

        assert.ok(table.id);
        assert.equal(table.id, createResponse.body['id']);

        assert.ok(table.link);
        assert.equal(table.link, createResponse.body['link']['@']['href']);

        assert.ok(table.updated);
        assert.equal(table.updated, createResponse.body['updated']);
      }

      // check that the table exists
      tableService.getTable(tableName, function (existsError, tableResponse, existsResponse) {
        assert.equal(existsError, null);
        assert.notEqual(tableResponse, null);
        assert.ok(existsResponse.isSuccessful);
        assert.equal(existsResponse.statusCode, HttpConstants.HttpResponseCodes.OK_CODE);
        done();
      });
    });
  });
});
