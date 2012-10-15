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

var ServiceClient = azure.ServiceClient;
var TableQuery = azure.TableQuery;
var Constants = azure.Constants;
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
  boolValueTrue: { '@': { type: 'Edm.Boolean' }, '#': true },
  boolValueFalse: { '@': { type: 'Edm.Boolean' }, '#': false },
  intValue: { '@': { type: 'Edm.Int32' }, '#': 42 },
  dateValue: { '@': { type: 'Edm.DateTime' }, '#': ISO8061Date.format(new Date(2011, 12, 25)) }
};

var tableNames = [];
var tablePrefix = 'tableservice';

var testPrefix = 'tableservice-tests';
var numberTests = 21;

suite('tableservice-tests', function () {
  setup(function (done) {
    tabletestutil.setUpTest(testPrefix, function (err, newTableService) {
      tableService = newTableService;
      done();
    });
  });

  teardown(function (done) {
    tabletestutil.tearDownTest(numberTests, tableService, testPrefix, done);
  });

  test('GetServiceProperties', function (done) {
    tableService.getServiceProperties(function (error, serviceProperties) {
      assert.equal(error, null);
      assert.notEqual(serviceProperties, null);

      if (serviceProperties) {
        assert.notEqual(serviceProperties.Logging, null);
        if (serviceProperties.Logging) {
          assert.notEqual(serviceProperties.Logging.RetentionPolicy);
          assert.notEqual(serviceProperties.Logging.Version);
        }

        if (serviceProperties.Metrics) {
          assert.notEqual(serviceProperties.Metrics, null);
          assert.notEqual(serviceProperties.Metrics.RetentionPolicy);
          assert.notEqual(serviceProperties.Metrics.Version);
        }
      }

      done();
    });
  });

  test('SetServiceProperties', function (done) {
    tableService.getServiceProperties(function (error, serviceProperties) {
      assert.equal(error, null);

      serviceProperties.Logging.Read = true;
      tableService.setServiceProperties(serviceProperties, function (error2) {
        assert.equal(error2, null);

        tableService.getServiceProperties(function (error3, serviceProperties2) {
          assert.equal(error3, null);
          assert.equal(serviceProperties2.Logging.Read, true);

          done();
        });
      });
    });
  });

  test('CreateTable', function (done) {
    var tableName = testutil.generateId(tablePrefix, tableNames, tabletestutil.isMocked);

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

  test('CreateTableIfNotExists', function (done) {
    var tableName = testutil.generateId(tablePrefix, tableNames, tabletestutil.isMocked);

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

      // trying to create again with if not exists should be fine
      tableService.createTableIfNotExists(tableName, function (createError2, created2) {
        assert.equal(createError2, null);
        assert.equal(created2, false);

        done();
      });
    });
  });

  test('QueryTable', function (done) {
    var tableName1 = testutil.generateId(tablePrefix, tableNames, tabletestutil.isMocked);
    var tableName2 = testutil.generateId(tablePrefix, tableNames, tabletestutil.isMocked);

    tableService.queryTables(function (queryErrorEmpty, tablesEmpty) {
      assert.equal(queryErrorEmpty, null);
      assert.notEqual(tablesEmpty, null);
      if (tablesEmpty) {
        assert.equal(tablesEmpty.length, 0);
      }

      tableService.createTable(tableName1, function (createError, table1, createResponse) {
        assert.equal(createError, null);
        assert.notEqual(table1, null);
        assert.equal(createResponse.statusCode, HttpConstants.HttpResponseCodes.CREATED_CODE);

        tableService.createTable(tableName2, function (createError2, table2, createResponse2) {
          assert.equal(createError2, null);
          assert.notEqual(table2, null);
          assert.equal(createResponse2.statusCode, HttpConstants.HttpResponseCodes.CREATED_CODE);

          tableService.queryTables(function (queryError, tables, tablesContinuation, queryResponse) {
            assert.equal(queryError, null);
            assert.notEqual(tables, null);
            assert.ok(queryResponse.isSuccessful);
            assert.equal(queryResponse.statusCode, HttpConstants.HttpResponseCodes.OK_CODE);

            var entries = 0;
            tables.forEach(function (currentTable) {
              if (currentTable.TableName === tableName1) {
                entries += 1;
                assert.ok(currentTable.id);
                assert.ok(currentTable.link);
                assert.ok(currentTable.updated);
              }
              else if (currentTable.TableName === tableName2) {
                entries += 2;
                assert.ok(currentTable.id);
                assert.ok(currentTable.link);
                assert.ok(currentTable.updated);
              }
            });

            assert.equal(entries, 3);

            done();
          });
        });
      });
    });
  });

  test('DeleteTable', function (done) {
    var tableName = testutil.generateId(tablePrefix, tableNames, tabletestutil.isMocked);

    tableService.createTable(tableName, function (createError, table, createResponse) {
      assert.equal(createError, null);
      assert.notEqual(table, null);
      assert.ok(createResponse.isSuccessful);
      assert.equal(createResponse.statusCode, HttpConstants.HttpResponseCodes.CREATED_CODE);

      tableService.deleteTable(tableName, function (deleteError, deleted, deleteResponse) {
        assert.equal(deleteError, null);
        assert.equal(deleted, true);
        assert.ok(deleteResponse.isSuccessful);
        assert.equal(deleteResponse.statusCode, HttpConstants.HttpResponseCodes.NO_CONTENT_CODE);
        done();
      });
    });
  });

  test('InsertEntity', function (done) {
    var tableName = testutil.generateId(tablePrefix, tableNames, tabletestutil.isMocked);

    tableService.createTable(tableName, function (createError, table, createResponse) {
      assert.equal(createError, null);
      assert.notEqual(table, null);
      assert.equal(createResponse.statusCode, HttpConstants.HttpResponseCodes.CREATED_CODE);

      tableService.insertEntity(tableName, entity1, function (insertError, insertEntity, insertResponse) {
        assert.equal(insertError, null);
        assert.notEqual(insertEntity, null);
        assert.equal(insertResponse.statusCode, HttpConstants.HttpResponseCodes.CREATED_CODE);

        tableService.insertEntity(tableName, entity2, function (insertError2, insertEntity2, insertResponse2) {
          assert.equal(insertError2, null);
          assert.notEqual(insertEntity2, null);
          assert.equal(insertResponse2.statusCode, HttpConstants.HttpResponseCodes.CREATED_CODE);

          var tableQuery = TableQuery.select()
            .from(tableName);

          tableService.queryEntities(tableQuery, function (queryError, entries, entriesContinuation, queryResponse) {
            assert.equal(queryError, null);
            assert.notEqual(entries, null);
            assert.ok(queryResponse.isSuccessful);
            assert.equal(queryResponse.statusCode, HttpConstants.HttpResponseCodes.OK_CODE);

            assert.ok(entries);
            var entities = 0;
            entries.forEach(function (currentEntry) {
              if (currentEntry['PartitionKey'] === entity1['PartitionKey'] && currentEntry['RowKey'] === entity1['RowKey']) {
                entities += 1;

                assert.ok(currentEntry['etag']);
                assert.equal(currentEntry['field'], entity1['field']);
                assert.equal(currentEntry['otherfield'], entity1['otherfield']);
                assert.equal(currentEntry['otherprops'], entity1['otherprops']);
              }
              else if (currentEntry['PartitionKey'] === entity2['PartitionKey'] && currentEntry['RowKey'] === entity2['RowKey']) {
                entities += 2;

                assert.ok(currentEntry['etag']);
                assert.equal(currentEntry['boolValueTrue'], entity2['boolValueTrue']['#']);
                assert.equal(currentEntry['boolValueFalse'], entity2['boolValueFalse']['#']);
                assert.equal(currentEntry['intValue'], entity2['intValue']['#']);

                var date1 = new Date(currentEntry['dateValue']);
                var date2 = new Date(entity2['dateValue']['#']);
                assert.ok(date1, date2);
              }
            });

            assert.equal(entities, 3);

            tableQuery = TableQuery.select()
              .from(tableName)
              .whereKeys(entity1.PartitionKey, entity1.RowKey);

            tableService.queryEntities(tableQuery, function (queryError2, tableEntries2, tableEntriesContinuation2, queryResponse2) {
              assert.equal(queryError2, null);
              assert.ok(queryResponse2.isSuccessful);
              assert.equal(queryResponse2.statusCode, HttpConstants.HttpResponseCodes.OK_CODE);

              assert.ok(tableEntries2);
              var newentities = 0;
              tableEntries2.forEach(function (newcurrentEntry) {

                if (newcurrentEntry['PartitionKey'] === entity1['PartitionKey'] && newcurrentEntry['RowKey'] === entity1['RowKey']) {
                  newentities += 1;

                  assert.ok(newcurrentEntry['etag']);
                  assert.equal(newcurrentEntry['field'], entity1['field']);
                  assert.equal(newcurrentEntry['otherfield'], entity1['otherfield']);
                  assert.equal(newcurrentEntry['otherprops'], entity1['otherprops']);
                }
              });

              assert.equal(newentities, 1);

              done();
            });
          });
        });
      });
    });
  });

  test('InsertEntityWithHtmlSpecialChars', function (done) {
    var tableName = testutil.generateId(tablePrefix, tableNames, tabletestutil.isMocked);

    tableService.createTable(tableName, function (createError, table, createResponse) {
      assert.equal(createError, null);
      assert.notEqual(table, null);
      assert.equal(createResponse.statusCode, HttpConstants.HttpResponseCodes.CREATED_CODE);

      var newEntity = entity1;
      newEntity['field'] = 'XML <test>'; // this should work without breaking the XML

      tableService.insertEntity(tableName, newEntity, function (insertError, insertEntity, insertResponse) {
        assert.equal(insertError, null);
        assert.notEqual(insertEntity, null);
        assert.ok(insertResponse.isSuccessful);
        assert.equal(insertResponse.statusCode, HttpConstants.HttpResponseCodes.CREATED_CODE);

        var tableQuery = TableQuery.select()
          .from(tableName)
          .whereKeys(newEntity.PartitionKey, newEntity.RowKey);

        tableService.queryEntities(tableQuery, function (queryError, entries, entriesContinuation, queryResponse) {
          assert.equal(queryError, null);
          assert.notEqual(entries, null);
          assert.ok(queryResponse.isSuccessful);
          assert.ok(queryResponse.statusCode, HttpConstants.HttpResponseCodes.OK_CODE);

          assert.equal(entries[0]['field'], 'XML <test>');
          done();
        });
      });
    });
  });

  test('DeleteEntityWithoutEtag', function (done) {
    var tableName = testutil.generateId(tablePrefix, tableNames, tabletestutil.isMocked);

    tableService.createTable(tableName, function (createError, table, createResponse) {
      assert.equal(createError, null);
      assert.notEqual(table, null);
      assert.ok(createResponse.isSuccessful);
      assert.equal(createResponse.statusCode, HttpConstants.HttpResponseCodes.CREATED_CODE);

      tableService.insertEntity(tableName, entity1, function (insertError, insertEntity, insertResponse) {
        assert.equal(insertError, null);
        assert.notEqual(insertEntity, null);
        assert.ok(insertResponse.isSuccessful);
        assert.equal(insertResponse.statusCode, HttpConstants.HttpResponseCodes.CREATED_CODE);

        tableService.deleteEntity(tableName, entity1, false, function (deleteError, deleted, deleteResponse) {
          assert.equal(deleteError, null);
          assert.equal(deleted, true);
          assert.ok(deleteResponse.isSuccessful);
          assert.equal(deleteResponse.statusCode, HttpConstants.HttpResponseCodes.NO_CONTENT_CODE);

          done();
        });
      });
    });
  });

  test('DeleteEntityWithEtag', function (done) {
    var tableName = testutil.generateId(tablePrefix, tableNames, tabletestutil.isMocked);

    tableService.createTable(tableName, function (createError, table, createResponse) {
      assert.equal(createError, null);
      assert.notEqual(table, null);
      assert.ok(createResponse.isSuccessful);
      assert.equal(createResponse.statusCode, HttpConstants.HttpResponseCodes.CREATED_CODE);

      tableService.insertEntity(tableName, entity1, function (insertError, insertEntity, insertResponse) {
        assert.equal(insertError, null);
        assert.notEqual(insertEntity, null);
        assert.ok(insertResponse.isSuccessful);
        assert.equal(insertResponse.statusCode, HttpConstants.HttpResponseCodes.CREATED_CODE);

        // Set a fake old etag
        entity1['etag'] = 'W/"datetime\'2009-05-27T12%3A15%3A15.3321531Z\'"';

        // Delete forcing etag to be verified
        tableService.deleteEntity(tableName, entity1, { checkEtag: true }, function (deleteError, deleted, deleteResponse) {
          assert.equal(deleteError.code, StorageErrorCodeStrings.UPDATE_CONDITION_NOT_SATISFIED);
          assert.equal(deleted, false);
          assert.equal(deleteResponse.isSuccessful, false);
          assert.equal(deleteResponse.statusCode, HttpConstants.HttpResponseCodes.PRECONDITION_FAILED_CODE);

          done();
        });
      });
    });
  });

  test('UpdateEntityWithoutEtag', function (done) {
    var tableName = testutil.generateId(tablePrefix, tableNames, tabletestutil.isMocked);
    var newField = 'value';

    tableService.createTable(tableName, function (createError, table, createResponse) {
      assert.equal(createError, null);
      assert.notEqual(table, null);
      assert.ok(createResponse.isSuccessful);
      assert.equal(createResponse.statusCode, HttpConstants.HttpResponseCodes.CREATED_CODE);

      var newEntity1 = entity1;
      tableService.insertEntity(tableName, newEntity1, function (insertError, insertEntity, insertResponse) {
        assert.equal(insertError, null);
        assert.notEqual(insertEntity, null);
        assert.ok(insertResponse.isSuccessful);
        assert.equal(insertResponse.statusCode, HttpConstants.HttpResponseCodes.CREATED_CODE);
        var originalEtag = newEntity1['etag'];

        newEntity1['otherfield'] = newField;

        tableService.updateEntity(tableName, newEntity1, false, function (updateError2, updateEntity2, updateResponse2) {
          assert.equal(updateError2, null);
          assert.notEqual(updateEntity2, null);
          assert.ok(updateResponse2.isSuccessful);
          assert.equal(updateResponse2.statusCode, HttpConstants.HttpResponseCodes.NO_CONTENT_CODE);
          assert.notEqual(newEntity1.etag, originalEtag);

          done();
        });
      });
    });
  });

  test('UpdateEntityWithEtag', function (done) {
    var tableName = testutil.generateId(tablePrefix, tableNames, tabletestutil.isMocked);
    var newField = 'value';

    tableService.createTable(tableName, function (createError, table, createResponse) {
      assert.equal(createError, null);
      assert.notEqual(table, null);
      assert.ok(createResponse.isSuccessful);
      assert.equal(createResponse.statusCode, HttpConstants.HttpResponseCodes.CREATED_CODE);

      var newEntity1 = entity1;
      tableService.insertEntity(tableName, newEntity1, function (insertError, insertEntity, insertResponse) {
        assert.equal(insertError, null);
        assert.notEqual(insertEntity, null);
        assert.ok(insertResponse.isSuccessful);
        assert.equal(insertResponse.statusCode, HttpConstants.HttpResponseCodes.CREATED_CODE);

        newEntity1['otherfield'] = newField;

        // Set a fake old etag
        newEntity1['etag'] = 'W/"datetime\'2009-05-27T12%3A15%3A15.3321531Z\'"';

        tableService.updateEntity(tableName, newEntity1, { checkEtag: true }, function (updateError, updateEntity, updateResponse) {
          assert.equal(updateError.code, StorageErrorCodeStrings.UPDATE_CONDITION_NOT_SATISFIED);
          assert.equal(updateEntity, null);
          assert.equal(updateResponse.isSuccessful, false);
          assert.equal(updateResponse.statusCode, HttpConstants.HttpResponseCodes.PRECONDITION_FAILED_CODE);

          done();
        });
      });
    });
  });

  test('MergeEntityWithoutEtag', function (done) {
    var tableName = testutil.generateId(tablePrefix, tableNames, tabletestutil.isMocked);
    var newField = 'value';

    tableService.createTable(tableName, function (createError, table, createResponse) {
      assert.equal(createError, null);
      assert.notEqual(table, null);
      assert.ok(createResponse.isSuccessful);
      assert.equal(createResponse.statusCode, HttpConstants.HttpResponseCodes.CREATED_CODE);

      var newEntity1 = entity1;
      tableService.insertEntity(tableName, newEntity1, function (insertError, insertEntity, insertResponse) {
        assert.equal(insertError, null);
        assert.notEqual(insertEntity, null);
        assert.ok(insertResponse.isSuccessful);
        assert.equal(insertResponse.statusCode, HttpConstants.HttpResponseCodes.CREATED_CODE);

        insertEntity['otherfield'] = newField;

        tableService.mergeEntity(tableName, newEntity1, false, function (mergeError, mergeEntity, mergeResponse) {
          assert.equal(mergeError, null);
          assert.notEqual(mergeEntity, null);
          assert.ok(mergeResponse.isSuccessful);
          assert.equal(mergeResponse.statusCode, HttpConstants.HttpResponseCodes.NO_CONTENT_CODE);

          done();
        });
      });
    });
  });

  test('MergeEntityWithEtag', function (done) {
    var tableName = testutil.generateId(tablePrefix, tableNames, tabletestutil.isMocked);
    var newField = 'value';

    tableService.createTable(tableName, function (createError, table, createResponse) {
      assert.equal(createError, null);
      assert.notEqual(table, null);
      assert.ok(createResponse.isSuccessful);
      assert.equal(createResponse.statusCode, HttpConstants.HttpResponseCodes.CREATED_CODE);

      var newEntity1 = entity1;
      tableService.insertEntity(tableName, newEntity1, function (insertError, insertEntity, insertResponse) {
        assert.equal(insertError, null);
        assert.notEqual(insertEntity, null);
        assert.ok(insertResponse.isSuccessful);
        assert.equal(insertResponse.statusCode, HttpConstants.HttpResponseCodes.CREATED_CODE);

        newEntity1['otherfield'] = newField;

        // Set a fake old etag
        newEntity1['etag'] = 'W/"datetime\'2009-05-27T12%3A15%3A15.3321531Z\'"';

        tableService.mergeEntity(tableName, newEntity1, { checkEtag: true }, function (mergeError, mergeEntity, mergeResponse) {
          assert.equal(mergeError.code, StorageErrorCodeStrings.UPDATE_CONDITION_NOT_SATISFIED);
          assert.equal(mergeEntity, null);
          assert.equal(mergeResponse.isSuccessful, false);
          assert.equal(mergeResponse.statusCode, HttpConstants.HttpResponseCodes.PRECONDITION_FAILED_CODE);

          done();
        });
      });
    });
  });

  test('InsertOrReplaceEntity', function (done) {
    var tableName = testutil.generateId(tablePrefix, tableNames, tabletestutil.isMocked);

    tableService.createTable(tableName, function (error) {
      assert.equal(error, null);

      var entity = {
        PartitionKey: '1',
        RowKey: '1',
        field1: 'value',
        field2: 1
      };

      // Should perform an insert
      tableService.insertOrReplaceEntity(tableName, entity, function (error2) {
        assert.equal(error2, null);

        // change value of field2
        entity.field2 = 2;

        // should perform an update
        tableService.insertOrReplaceEntity(tableName, entity, function (error3) {
          assert.equal(error3, null);

          tableService.queryEntity(tableName, entity.PartitionKey, entity.RowKey, function (error4, entityResult) {
            assert.equal(error4, null);

            assert.notEqual(entityResult, null);
            if (entityResult) {
              assert.equal(entityResult.PartitionKey, entity.PartitionKey);
              assert.equal(entityResult.RowKey, entity.RowKey);
              assert.equal(entityResult.field1, entity.field1);
              assert.equal(entityResult.field2, entity.field2);
            }

            done();
          });
        });
      });
    });
  });

  test('InsertOrMerge', function (done) {
    var tableName = testutil.generateId(tablePrefix, tableNames, tabletestutil.isMocked);

    tableService.createTable(tableName, function (error) {
      assert.equal(error, null);

      var entity = {
        PartitionKey: '1',
        RowKey: '1',
        field1: 'value',
        field2: 1
      };

      // Should perform an insert
      tableService.insertOrMergeEntity(tableName, entity, function (error2) {
        assert.equal(error2, null);

        // Add a new field
        entity.field3 = 2;

        // should perform a merge
        tableService.insertOrMergeEntity(tableName, entity, function (error3) {
          assert.equal(error3, null);

          tableService.queryEntity(tableName, entity.PartitionKey, entity.RowKey, function (error4, entityResult) {
            assert.equal(error4, null);

            assert.notEqual(entityResult, null);
            if (entityResult) {
              assert.equal(entityResult.PartitionKey, entity.PartitionKey);
              assert.equal(entityResult.RowKey, entity.RowKey);
              assert.equal(entityResult.field1, entity.field1);
              assert.equal(entityResult.field2, entity.field2);
              assert.equal(entityResult.field3, entity.field3);
            }

            done();
          });
        });
      });
    });
  });

  test('InsertEntityEmptyField', function (done) {
    var tableName = testutil.generateId(tablePrefix, tableNames, tabletestutil.isMocked);

    tableService.createTable(tableName, function (error) {
      assert.equal(error, null);

      var entity = {
        PartitionKey: '1',
        RowKey: '1abc',
        field1: 'value',
        emptyField1: '',
        emptyField2: null,
        nonEmptyField3: 0
      };

      // Should perform an insert
      tableService.insertOrMergeEntity(tableName, entity, function (error2) {
        assert.equal(error2, null);

        tableService.queryEntity(tableName, entity.PartitionKey, entity.RowKey, function (error4, entityResult) {
          assert.equal(error4, null);

          assert.notEqual(entityResult, null);
          if (entityResult) {
            assert.equal(entityResult.PartitionKey, entity.PartitionKey);
            assert.equal(entityResult.RowKey, entity.RowKey);
            assert.equal(entityResult.field1, entity.field1);
            assert.equal(entityResult.emptyField1, undefined);
            assert.equal(entityResult.emptyField2, undefined);
            assert.equal(entityResult.nonEmptyField3, entity.nonEmptyField3);
          }

          done();
        });
      });
    });
  });

  test('InsertEntityNewLines', function (done) {
    var tableName = testutil.generateId(tablePrefix, tableNames, tabletestutil.isMocked);

    tableService.createTable(tableName, function (error) {
      assert.equal(error, null);

      var entity = {
        PartitionKey: '1',
        RowKey: '1abc',
        content: '\n\nhi\n\nthere\n\n'
      };

      // Should perform an insert
      tableService.insertOrMergeEntity(tableName, entity, function (error2) {
        assert.equal(error2, null);

        tableService.queryEntity(tableName, entity.PartitionKey, entity.RowKey, function (error4, entityResult) {
          assert.equal(error4, null);

          assert.notEqual(entityResult, null);
          if (entityResult) {
            assert.equal(entityResult.PartitionKey, entity.PartitionKey);
            assert.equal(entityResult.RowKey, entity.RowKey);
            assert.equal(entityResult.content, entity.content);
          }

          done();
        });
      });
    });
  });

  test('InsertPartitionKeyOnly', function (done) {
    var tableName = testutil.generateId(tablePrefix, tableNames, tabletestutil.isMocked);

    tableService.createTable(tableName, function (error1) {
      assert.equal(error1, null);

      var entity1 = {
        PartitionKey: '1',
        RowKey: '1st',
        field1: 'value'
      };

      // entity in the same partition
      var entity2 = {
        PartitionKey: '1',
        RowKey: '2st',
        field1: 'value'
      }

      // entity in another partition
      var entity3 = {
        PartitionKey: '2',
        RowKey: '2st',
        field1: 'value'
      }

      // Should perform an insert
      tableService.insertEntity(tableName, entity1, function (error2) {
        assert.equal(error2, null);

        tableService.insertEntity(tableName, entity2, function (error3) {
          assert.equal(error3, null);

          tableService.insertEntity(tableName, entity3, function (error4) {
            assert.equal(error4, null);

            // Create table query with passing partition key only
            var tableQuery = azure.TableQuery.select()
            .from(tableName)
            .whereKeys(entity1.PartitionKey);

            tableService.queryEntities(tableQuery, function (error5, entities) {
              assert.equal(error5, null);

              assert.notEqual(entities, null);
              assert.equal(entities.length, 2);

              done();
            });
          });
        });
      });
    });
  });

  test('storageConnectionStrings', function (done) {
    var key = 'AhlzsbLRkjfwObuqff3xrhB2yWJNh1EMptmcmxFJ6fvPTVX3PZXwrG2YtYWf5DPMVgNsteKStM5iBLlknYFVoA==';
    var connectionString = 'DefaultEndpointsProtocol=https;AccountName=myaccount;AccountKey=' + key;
    var tableService = azure.createTableService(connectionString);

    assert.equal(tableService.storageAccount, 'myaccount');
    assert.equal(tableService.storageAccessKey, key);
    assert.equal(tableService.protocol, 'https://');

    done();
  });

  test('storageConnectionStringsDevStore', function (done) {
    var connectionString = 'UseDevelopmentStorage=true';
    var tableService = azure.createTableService(connectionString);

    assert.equal(tableService.storageAccount, ServiceClient.DEVSTORE_STORAGE_ACCOUNT);
    assert.equal(tableService.storageAccessKey, ServiceClient.DEVSTORE_STORAGE_ACCESS_KEY);
    assert.equal(tableService.protocol, 'http://');
    assert.equal(tableService.host, '127.0.0.1');
    assert.equal(tableService.port, '10002');

    done();
  });

  test('storageConnectionStringsHttps', function (done) {
    var tableName = testutil.generateId(tablePrefix, tableNames, tabletestutil.isMocked);
    var expectedProtocol = 'https';
    var expectedName = process.env[ServiceClient.EnvironmentVariables.AZURE_STORAGE_ACCOUNT];
    var expectedKey = process.env[ServiceClient.EnvironmentVariables.AZURE_STORAGE_ACCESS_KEY];
    var connectionString = 'DefaultEndpointsProtocol=' + expectedProtocol + ';AccountName=' + expectedName + ';AccountKey=' + expectedKey;
    var tableService = azure.createTableService(connectionString);
    tableService.createTable(tableName, function (err) {
      assert.equal(err, null);

      assert.equal(tableService.storageAccount, expectedName);
      assert.equal(tableService.storageAccessKey, expectedKey);
      assert.equal(tableService.protocol, 'https://');

      done();
    });
  });

  test('storageConnectionStringsEndpointHttps', function (done) {
    var tableName = testutil.generateId(tablePrefix, tableNames, tabletestutil.isMocked);
    var expectedProtocol = 'https';
    var expectedName = process.env[ServiceClient.EnvironmentVariables.AZURE_STORAGE_ACCOUNT];
    var expectedKey = process.env[ServiceClient.EnvironmentVariables.AZURE_STORAGE_ACCESS_KEY];
    var expectedTableEndpoint = 'http://andrerod.table.core.windows.net';
    var connectionString = 'DefaultEndpointsProtocol=' + expectedProtocol + ';AccountName=' + expectedName + ';AccountKey=' + expectedKey + ';TableEndpoint=' + expectedTableEndpoint;
    var tableService = azure.createTableService(connectionString);
    tableService.createTable(tableName, function (err) {
      assert.equal(err, null);

      assert.equal(tableService.storageAccount, expectedName);
      assert.equal(tableService.storageAccessKey, expectedKey);

      // Explicit table host wins
      assert.equal(tableService.protocol, 'http://');

      done();
    });
  });

  test('storageConnectionStringsEndpointHttpsExplicit', function (done) {
    var tableName = testutil.generateId(tablePrefix, tableNames, tabletestutil.isMocked);
    var expectedName = process.env[ServiceClient.EnvironmentVariables.AZURE_STORAGE_ACCOUNT];
    var expectedKey = process.env[ServiceClient.EnvironmentVariables.AZURE_STORAGE_ACCESS_KEY];
    var expectedTableEndpoint = 'http://andrerod.table.core.windows.net';
    var tableService = azure.createTableService(expectedName, expectedKey, expectedTableEndpoint);
    tableService.createTable(tableName, function (err) {
      assert.equal(err, null);

      assert.equal(tableService.storageAccount, expectedName);
      assert.equal(tableService.storageAccessKey, expectedKey);
      assert.equal(tableService.protocol, 'http://');

      done();
    });
  });

  test('storageConnectionStringsEndpointDevStoreExplicit', function (done) {
    var expectedName = ServiceClient.DEVSTORE_STORAGE_ACCOUNT;
    var expectedKey = ServiceClient.DEVSTORE_STORAGE_ACCESS_KEY;
    var expectedTableEndpoint = ServiceClient.DEVSTORE_TABLE_HOST;
    var tableService = azure.createTableService(expectedName, expectedKey, expectedTableEndpoint);

    assert.equal(tableService.storageAccount, expectedName);
    assert.equal(tableService.storageAccessKey, expectedKey);
    assert.equal(tableService.protocol, 'http://');
    assert.equal(tableService.host, '127.0.0.1');
    assert.equal(tableService.port, '10002');
    assert.equal(tableService.usePathStyleUri, true);

    done();
  });
});