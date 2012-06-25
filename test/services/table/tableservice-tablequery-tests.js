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

var ServiceClient = azure.ServiceClient;
var TableQuery = azure.TableQuery;
var Constants = azure.Constants;
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
var tablePrefix = 'tablequery';

var testPrefix = 'tableservice-tablequery-tests';
var numberTests = 1;

suite('tableservice-tablequery-tests', function () {
  setup(function (done) {
    tabletestutil.setUpTest(testPrefix, function (err, newTableService) {
      tableService = newTableService;
      done();
    });
  });

  teardown(function (done) {
    tabletestutil.tearDownTest(numberTests, tableService, testPrefix, done);
  });

  test('Select', function (done) {
    var tableName = testutil.generateId(tablePrefix, tableNames, tabletestutil.isMocked);

    tableService.createTable(tableName, function (error1) {
      assert.equal(error1, null);

      tableService.insertEntity(tableName, entity1, function (error2) {
        assert.equal(error2, null);

        // Select specific field
        var tableQuery = TableQuery.select('field1')
          .from(tableName);

        tableService.queryEntities(tableQuery, function (error3, entities1) {
          assert.equal(error3, null);

          assert.notEqual(entities1, null);

          if (entities1) {
            assert.equal(entities1.length, 1);
            var entityResult1 = entities1[0];
            assert.equal(entityResult1.field1, entity1.field1);
            assert.equal(entityResult1.field2, undefined);
          }

          // Select all fields
          tableQuery = TableQuery.select()
            .from(tableName);

          tableService.queryEntities(tableQuery, function (error4, entities2) {
            assert.equal(error3, null);

            assert.notEqual(entities2, null);

            if (entities2) {
              assert.equal(entities2.length, 1);
              var entityResult2 = entities2[0];
              assert.equal(entityResult2.field1, entity1.field1);
              assert.equal(entityResult2.field2, entity1.field2);
            }

            done();
          });
        });
      });
    });
  });
});

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