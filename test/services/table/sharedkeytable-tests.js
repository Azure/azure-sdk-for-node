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
var ISO8061Date = require('../../../lib/util/iso8061date');

var ServiceClient = require("../../../lib/services/serviceclient");
var TableQuery = require('../../../lib/services/table/tablequery');
var SharedKeyLiteTable = require('../../../lib/services/table/sharedkeylitetable');
var Constants = require('../../../lib/util/constants');
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
var testPrefix = 'tableservice';

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

  testCreateTable: function (test) {
    var tableName = testutil.generateId(testPrefix, tableNames);

    tableService.authenticationProvider = new SharedKeyLiteTable(tableService.storageAccount, tableService.storageAccessKey);
    tableService.createTable(tableName, function (createError, table, createResponse) {
      test.equal(createError, null);
      test.notEqual(table, null);
      test.ok(createResponse.isSuccessful);
      test.equal(createResponse.statusCode, HttpConstants.HttpResponseCodes.CREATED_CODE);

      test.ok(table);
      if (table) {
        test.ok(table.TableName);
        test.equal(table.TableName, tableName);

        test.ok(table.id);
        test.equal(table.id, createResponse.body['id']);

        test.ok(table.link);
        test.equal(table.link, createResponse.body['link']['@']['href']);

        test.ok(table.updated);
        test.equal(table.updated, createResponse.body['updated']);
      }

      // check that the table exists
      tableService.getTable(tableName, function (existsError, tableResponse, existsResponse) {
        test.equal(existsError, null);
        test.notEqual(tableResponse, null);
        test.ok(existsResponse.isSuccessful);
        test.equal(existsResponse.statusCode, HttpConstants.HttpResponseCodes.OK_CODE);
        test.done();
      });
    });
  }
});
