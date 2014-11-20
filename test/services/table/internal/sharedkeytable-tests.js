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
var testutil = require('../../../util/util');
var tabletestutil = require('../../../framework/table-test-utils');

// Lib includes
var common = require('azure-common');
var storage = require('azure-storage-legacy');
var SharedKeyLiteTable = storage.SharedKeyLiteTable;

var Constants = common.Constants;
var HttpConstants = Constants.HttpConstants;

var tableNames = [];
var tablePrefix = 'sharedkeytable';

var testPrefix = 'sharedkeytable-tests';

var tableService;
var suiteUtil;

suite('sharedkeytable-tests', function () {
  suiteSetup(function (done) {
    tableService = storage.createTableService();
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

  test('CreateTable', function (done) {
    var tableName = testutil.generateId(tablePrefix, tableNames, suiteUtil.isMocked);

    tableService.authenticationProvider = new SharedKeyLiteTable(tableService.storageAccount, tableService.storageAccessKey);
    tableService.createTable(tableName, function (createError, table, createResponse) {
      assert.equal(createError, null);
      assert.notEqual(table, null);
      assert.ok(createResponse.isSuccessful);
      assert.equal(createResponse.statusCode, HttpConstants.HttpResponseCodes.Created);

      assert.ok(table);
      if (table) {
        assert.ok(table.TableName);
        assert.equal(table.TableName, tableName);

        assert.ok(table['_'].id);
        assert.equal(table['_'].id, createResponse.body.entry['id']);

        assert.ok(table['_'].link);
        assert.equal(table['_'].link, createResponse.body.entry['link'][Constants.XML_METADATA_MARKER]['href']);

        assert.ok(table['_'].updated);
        assert.equal(table['_'].updated, createResponse.body.entry['updated']);
      }

      // check that the table exists
      tableService.getTable(tableName, function (existsError, tableResponse, existsResponse) {
        assert.equal(existsError, null);
        assert.notEqual(tableResponse, null);
        assert.ok(existsResponse.isSuccessful);
        assert.equal(existsResponse.statusCode, HttpConstants.HttpResponseCodes.Ok);
        done();
      });
    });
  });
});