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
var HttpConstants = Constants.HttpConstants;
var StorageErrorCodeStrings = Constants.StorageErrorCodeStrings;

var tableService;

var entity1 = {
  PartitionKey: 'partition1',
  RowKey: 'row1',
  field1: 'field1 value',
  field2: 'field2 value'
};

var entity2 = {
  PartitionKey: 'partition1',
  RowKey: 'row2',
  field1: 'field1 value',
  field2: 'field2 value'
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

  testSelect: function (test) {
    var tableName = testutil.generateId(testPrefix, tableNames);

    tableService.createTable(tableName, function (error1) {
      test.equal(error1, null);

      tableService.insertEntity(tableName, entity1, function (error2) {
        test.equal(error2, null);

        // Select specific field
        var tableQuery = TableQuery.select('field1')
          .from(tableName);

        tableService.queryEntities(tableQuery, function (error3, entities1) {
          test.equal(error3, null);

          test.notEqual(entities1, null);

          if (entities1) {
            test.equal(entities1.length, 1);
            var entityResult1 = entities1[0];
            test.equal(entityResult1.field1, entity1.field1);
            test.equal(entityResult1.field2, undefined);
          }

          // Select all fields
          tableQuery = TableQuery.select()
            .from(tableName);

          tableService.queryEntities(tableQuery, function (error4, entities2) {
            test.equal(error3, null);

            test.notEqual(entities2, null);

            if (entities2) {
              test.equal(entities2.length, 1);
              var entityResult2 = entities2[0];
              test.equal(entityResult2.field1, entity1.field1);
              test.equal(entityResult2.field2, entity1.field2);
            }

            test.done();
          });
        });
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
      field: 'street' + randomFromTo(0, 50)
    };

    entities.push(entity);
  }

  return entities;
};