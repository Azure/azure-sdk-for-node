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

  getServiceProperties: function (test) {
    tableService.getServiceProperties(function (error, serviceProperties, response) {
      test.equal(error, null);
      test.notEqual(serviceProperties, null);

      if (serviceProperties) {
        test.notEqual(serviceProperties.Logging, null);
        if (serviceProperties.Logging) {
          test.notEqual(serviceProperties.Logging.RetentionPolicy);
          test.notEqual(serviceProperties.Logging.Version);
        }

        if (serviceProperties.Metrics) {
          test.notEqual(serviceProperties.Metrics, null);
          test.notEqual(serviceProperties.Metrics.RetentionPolicy);
          test.notEqual(serviceProperties.Metrics.Version);
        }
      }

      test.done();
    });
  },

  testSetServiceProperties: function (test) {
    tableService.getServiceProperties(function (error, serviceProperties) {
      test.equal(error, null);

      serviceProperties.Logging.Read = true;
      tableService.setServiceProperties(serviceProperties, function (error2) {
        test.equal(error2, null);

        tableService.getServiceProperties(function (error3, serviceProperties2) {
          test.equal(error3, null);
          test.equal(serviceProperties2.Logging.Read, true);

          test.done();
        });
      });
    });
  },

  testCreateTable: function (test) {
    var tableName = testutil.generateId(testPrefix, tableNames);

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
  },

  testCreateTableIfNotExists: function (test) {
    var tableName = testutil.generateId(testPrefix, tableNames);

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

      // trying to create again with if not exists should be fine
      tableService.createTableIfNotExists(tableName, function (createError2, created2) {
        test.equal(createError2, null);
        test.equal(created2, false);

        test.done();
      });
    });
  },

  testQueryTable: function (test) {
    var tableName1 = testutil.generateId(testPrefix, tableNames);
    var tableName2 = testutil.generateId(testPrefix, tableNames);

    tableService.queryTables(function (queryErrorEmpty, tablesEmpty) {
      test.equal(queryErrorEmpty, null);
      test.notEqual(tablesEmpty, null);
      if (tablesEmpty) {
        test.equal(tablesEmpty.length, 0);
      }

      tableService.createTable(tableName1, function (createError, table1, createResponse) {
        test.equal(createError, null);
        test.notEqual(table1, null);
        test.equal(createResponse.statusCode, HttpConstants.HttpResponseCodes.CREATED_CODE);

        tableService.createTable(tableName2, function (createError2, table2, createResponse2) {
          test.equal(createError2, null);
          test.notEqual(table2, null);
          test.equal(createResponse2.statusCode, HttpConstants.HttpResponseCodes.CREATED_CODE);

          tableService.queryTables(function (queryError, tables, tablesContinuation, queryResponse) {
            test.equal(queryError, null);
            test.notEqual(tables, null);
            test.ok(queryResponse.isSuccessful);
            test.equal(queryResponse.statusCode, HttpConstants.HttpResponseCodes.OK_CODE);

            var entries = 0;
            tables.forEach(function (currentTable) {
              if (currentTable.TableName === tableName1) {
                entries += 1;
                test.ok(currentTable.id);
                test.ok(currentTable.link);
                test.ok(currentTable.updated);
              }
              else if (currentTable.TableName === tableName2) {
                entries += 2;
                test.ok(currentTable.id);
                test.ok(currentTable.link);
                test.ok(currentTable.updated);
              }
            });

            test.equal(entries, 3);

            test.done();
          });
        });
      });
    });
  },

  testDeleteTable: function (test) {
    var tableName = testutil.generateId(testPrefix, tableNames);

    tableService.createTable(tableName, function (createError, table, createResponse) {
      test.equal(createError, null);
      test.notEqual(table, null);
      test.ok(createResponse.isSuccessful);
      test.equal(createResponse.statusCode, HttpConstants.HttpResponseCodes.CREATED_CODE);

      tableService.deleteTable(tableName, function (deleteError, deleted, deleteResponse) {
        test.equal(deleteError, null);
        test.equal(deleted, true);
        test.ok(deleteResponse.isSuccessful);
        test.equal(deleteResponse.statusCode, HttpConstants.HttpResponseCodes.NO_CONTENT_CODE);
        test.done();
      });
    });
  },

  testInsertEntity: function (test) {
    var tableName = testutil.generateId(testPrefix, tableNames);

    tableService.createTable(tableName, function (createError, table, createResponse) {
      test.equal(createError, null);
      test.notEqual(table, null);
      test.equal(createResponse.statusCode, HttpConstants.HttpResponseCodes.CREATED_CODE);

      tableService.insertEntity(tableName, entity1, function (insertError, insertEntity, insertResponse) {
        test.equal(insertError, null);
        test.notEqual(insertEntity, null);
        test.equal(insertResponse.statusCode, HttpConstants.HttpResponseCodes.CREATED_CODE);

        tableService.insertEntity(tableName, entity2, function (insertError2, insertEntity2, insertResponse2) {
          test.equal(insertError2, null);
          test.notEqual(insertEntity2, null);
          test.equal(insertResponse2.statusCode, HttpConstants.HttpResponseCodes.CREATED_CODE);

          var tableQuery = TableQuery.select()
            .from(tableName);

          tableService.queryEntities(tableQuery, function (queryError, entries, entriesContinuation, queryResponse) {
            test.equal(queryError, null);
            test.notEqual(entries, null);
            test.ok(queryResponse.isSuccessful);
            test.equal(queryResponse.statusCode, HttpConstants.HttpResponseCodes.OK_CODE);

            test.ok(entries);
            var entities = 0;
            entries.forEach(function (currentEntry) {
              if (currentEntry['PartitionKey'] === entity1['PartitionKey'] && currentEntry['RowKey'] === entity1['RowKey']) {
                entities += 1;

                test.ok(currentEntry['etag']);
                test.equal(currentEntry['field'], entity1['field']);
                test.equal(currentEntry['otherfield'], entity1['otherfield']);
                test.equal(currentEntry['otherprops'], entity1['otherprops']);
              }
              else if (currentEntry['PartitionKey'] === entity2['PartitionKey'] && currentEntry['RowKey'] === entity2['RowKey']) {
                entities += 2;

                test.ok(currentEntry['etag']);
                test.equal(currentEntry['boolval'], entity2['boolval']['#']);
                test.equal(currentEntry['intval'], entity2['intval']['#']);

                var date1 = new Date(currentEntry['dateval']);
                var date2 = new Date(entity2['dateval']['#']);
                test.ok(date1, date2);
              }
            });

            test.equal(entities, 3);

            tableQuery = TableQuery.select()
              .from(tableName)
              .whereKeys(entity1.PartitionKey, entity1.RowKey);

            tableService.queryEntities(tableQuery, function (queryError2, tableEntries2, tableEntriesContinuation2, queryResponse2) {
              test.equal(queryError2, null);
              test.ok(queryResponse2.isSuccessful);
              test.equal(queryResponse2.statusCode, HttpConstants.HttpResponseCodes.OK_CODE);

              test.ok(tableEntries2);
              var newentities = 0;
              tableEntries2.forEach(function (newcurrentEntry) {

                if (newcurrentEntry['PartitionKey'] === entity1['PartitionKey'] && newcurrentEntry['RowKey'] === entity1['RowKey']) {
                  newentities += 1;

                  test.ok(newcurrentEntry['etag']);
                  test.equal(newcurrentEntry['field'], entity1['field']);
                  test.equal(newcurrentEntry['otherfield'], entity1['otherfield']);
                  test.equal(newcurrentEntry['otherprops'], entity1['otherprops']);
                }
              });

              test.equal(newentities, 1);

              test.done();
            });
          });
        });
      });
    });
  },

  testInsertEntityWithHtmlSpecialChars: function (test) {
    var tableName = testutil.generateId(testPrefix, tableNames);

    tableService.createTable(tableName, function (createError, table, createResponse) {
      test.equal(createError, null);
      test.notEqual(table, null);
      test.equal(createResponse.statusCode, HttpConstants.HttpResponseCodes.CREATED_CODE);

      var newEntity = entity1;
      newEntity['field'] = 'XML <test>'; // this should work without breaking the XML

      tableService.insertEntity(tableName, newEntity, function (insertError, insertEntity, insertResponse) {
        test.equal(insertError, null);
        test.notEqual(insertEntity, null);
        test.ok(insertResponse.isSuccessful);
        test.equal(insertResponse.statusCode, HttpConstants.HttpResponseCodes.CREATED_CODE);

        var tableQuery = TableQuery.select()
          .from(tableName)
          .whereKeys(newEntity.PartitionKey, newEntity.RowKey);

        tableService.queryEntities(tableQuery, function (queryError, entries, entriesContinuation, queryResponse) {
          test.equal(queryError, null);
          test.notEqual(entries, null);
          test.ok(queryResponse.isSuccessful);
          test.ok(queryResponse.statusCode, HttpConstants.HttpResponseCodes.OK_CODE);

          test.equal(entries[0]['field'], 'XML <test>');
          test.done();
        });
      });
    });
  },

  testDeleteEntityWithoutEtag: function (test) {
    var tableName = testutil.generateId(testPrefix, tableNames);

    tableService.createTable(tableName, function (createError, table, createResponse) {
      test.equal(createError, null);
      test.notEqual(table, null);
      test.ok(createResponse.isSuccessful);
      test.equal(createResponse.statusCode, HttpConstants.HttpResponseCodes.CREATED_CODE);

      tableService.insertEntity(tableName, entity1, function (insertError, insertEntity, insertResponse) {
        test.equal(insertError, null);
        test.notEqual(insertEntity, null);
        test.ok(insertResponse.isSuccessful);
        test.equal(insertResponse.statusCode, HttpConstants.HttpResponseCodes.CREATED_CODE);

        tableService.deleteEntity(tableName, entity1, false, function (deleteError, deleted, deleteResponse) {
          test.equal(deleteError, null);
          test.equal(deleted, true);
          test.ok(deleteResponse.isSuccessful);
          test.equal(deleteResponse.statusCode, HttpConstants.HttpResponseCodes.NO_CONTENT_CODE);

          test.done();
        });
      });
    });
  },

  testDeleteEntityWithEtag: function (test) {
    var tableName = testutil.generateId(testPrefix, tableNames);

    tableService.createTable(tableName, function (createError, table, createResponse) {
      test.equal(createError, null);
      test.notEqual(table, null);
      test.ok(createResponse.isSuccessful);
      test.equal(createResponse.statusCode, HttpConstants.HttpResponseCodes.CREATED_CODE);

      tableService.insertEntity(tableName, entity1, function (insertError, insertEntity, insertResponse) {
        test.equal(insertError, null);
        test.notEqual(insertEntity, null);
        test.ok(insertResponse.isSuccessful);
        test.equal(insertResponse.statusCode, HttpConstants.HttpResponseCodes.CREATED_CODE);

        // Set a fake old etag
        entity1['etag'] = 'W/"datetime\'2009-05-27T12%3A15%3A15.3321531Z\'"';

        // Delete forcing etag to be verified
        tableService.deleteEntity(tableName, entity1, { checkEtag: true }, function (deleteError, deleted, deleteResponse) {
          test.equal(deleteError.code, StorageErrorCodeStrings.UPDATE_CONDITION_NOT_SATISFIED);
          test.equal(deleted, false);
          test.equal(deleteResponse.isSuccessful, false);
          test.equal(deleteResponse.statusCode, HttpConstants.HttpResponseCodes.PRECONDITION_FAILED_CODE);

          test.done();
        });
      });
    });
  },

  testUpdateEntityWithoutEtag: function (test) {
    var tableName = testutil.generateId(testPrefix, tableNames);
    var newField = 'value';

    tableService.createTable(tableName, function (createError, table, createResponse) {
      test.equal(createError, null);
      test.notEqual(table, null);
      test.ok(createResponse.isSuccessful);
      test.equal(createResponse.statusCode, HttpConstants.HttpResponseCodes.CREATED_CODE);

      var newEntity1 = entity1;
      tableService.insertEntity(tableName, newEntity1, function (insertError, insertEntity, insertResponse) {
        test.equal(insertError, null);
        test.notEqual(insertEntity, null);
        test.ok(insertResponse.isSuccessful);
        test.equal(insertResponse.statusCode, HttpConstants.HttpResponseCodes.CREATED_CODE);
        var originalEtag = newEntity1['etag'];

        newEntity1['otherfield'] = newField;

        tableService.updateEntity(tableName, newEntity1, false, function (updateError2, updateEntity2, updateResponse2) {
          test.equal(updateError2, null);
          test.notEqual(updateEntity2, null);
          test.ok(updateResponse2.isSuccessful);
          test.equal(updateResponse2.statusCode, HttpConstants.HttpResponseCodes.NO_CONTENT_CODE);
          test.notEqual(newEntity1.etag, originalEtag);

          test.done();
        });
      });
    });
  },

  testUpdateEntityWithEtag: function (test) {
    var tableName = testutil.generateId(testPrefix, tableNames);
    var newField = 'value';

    tableService.createTable(tableName, function (createError, table, createResponse) {
      test.equal(createError, null);
      test.notEqual(table, null);
      test.ok(createResponse.isSuccessful);
      test.equal(createResponse.statusCode, HttpConstants.HttpResponseCodes.CREATED_CODE);

      var newEntity1 = entity1;
      tableService.insertEntity(tableName, newEntity1, function (insertError, insertEntity, insertResponse) {
        test.equal(insertError, null);
        test.notEqual(insertEntity, null);
        test.ok(insertResponse.isSuccessful);
        test.equal(insertResponse.statusCode, HttpConstants.HttpResponseCodes.CREATED_CODE);

        newEntity1['otherfield'] = newField;

        // Set a fake old etag
        newEntity1['etag'] = 'W/"datetime\'2009-05-27T12%3A15%3A15.3321531Z\'"';

        tableService.updateEntity(tableName, newEntity1, { checkEtag: true }, function (updateError, updateEntity, updateResponse) {
          test.equal(updateError.code, StorageErrorCodeStrings.CONDITION_NOT_MET);
          test.equal(updateEntity, null);
          test.equal(updateResponse.isSuccessful, false);
          test.equal(updateResponse.statusCode, HttpConstants.HttpResponseCodes.PRECONDITION_FAILED_CODE);

          test.done();
        });
      });
    });
  },

  testMergeEntityWithoutEtag: function (test) {
    var tableName = testutil.generateId(testPrefix, tableNames);
    var newField = 'value';

    tableService.createTable(tableName, function (createError, table, createResponse) {
      test.equal(createError, null);
      test.notEqual(table, null);
      test.ok(createResponse.isSuccessful);
      test.equal(createResponse.statusCode, HttpConstants.HttpResponseCodes.CREATED_CODE);

      var newEntity1 = entity1;
      tableService.insertEntity(tableName, newEntity1, function (insertError, insertEntity, insertResponse) {
        test.equal(insertError, null);
        test.notEqual(insertEntity, null);
        test.ok(insertResponse.isSuccessful);
        test.equal(insertResponse.statusCode, HttpConstants.HttpResponseCodes.CREATED_CODE);

        insertEntity['otherfield'] = newField;

        tableService.mergeEntity(tableName, newEntity1, false, function (mergeError, mergeEntity, mergeResponse) {
          test.equal(mergeError, null);
          test.notEqual(mergeEntity, null);
          test.ok(mergeResponse.isSuccessful);
          test.equal(mergeResponse.statusCode, HttpConstants.HttpResponseCodes.NO_CONTENT_CODE);

          test.done();
        });
      });
    });
  },

  testMergeEntityWithEtag: function (test) {
    var tableName = testutil.generateId(testPrefix, tableNames);
    var newField = 'value';

    tableService.createTable(tableName, function (createError, table, createResponse) {
      test.equal(createError, null);
      test.notEqual(table, null);
      test.ok(createResponse.isSuccessful);
      test.equal(createResponse.statusCode, HttpConstants.HttpResponseCodes.CREATED_CODE);

      var newEntity1 = entity1;
      tableService.insertEntity(tableName, newEntity1, function (insertError, insertEntity, insertResponse) {
        test.equal(insertError, null);
        test.notEqual(insertEntity, null);
        test.ok(insertResponse.isSuccessful);
        test.equal(insertResponse.statusCode, HttpConstants.HttpResponseCodes.CREATED_CODE);

        newEntity1['otherfield'] = newField;

        // Set a fake old etag
        newEntity1['etag'] = 'W/"datetime\'2009-05-27T12%3A15%3A15.3321531Z\'"';

        tableService.mergeEntity(tableName, newEntity1, { checkEtag: true }, function (mergeError, mergeEntity, mergeResponse) {
          test.equal(mergeError.code, StorageErrorCodeStrings.UPDATE_CONDITION_NOT_SATISFIED);
          test.equal(mergeEntity, null);
          test.equal(mergeResponse.isSuccessful, false);
          test.equal(mergeResponse.statusCode, HttpConstants.HttpResponseCodes.PRECONDITION_FAILED_CODE);

          test.done();
        });
      });
    });
  },

  testInsertOrReplaceEntity: function (test) {
    var tableName = testutil.generateId(testPrefix, tableNames);

    tableService.createTable(tableName, function (error) {
      test.equal(error, null);

      var entity = {
        PartitionKey: '1',
        RowKey: '1',
        field1: 'value',
        field2: 1
      };

      // Should perform an insert
      tableService.insertOrReplaceEntity(tableName, entity, function (error2) {
        test.equal(error2, null);

        // change value of field2
        entity.field2 = 2;

        // should perform an update
        tableService.insertOrReplaceEntity(tableName, entity, function (error3) {
          test.equal(error3, null);

          tableService.queryEntity(tableName, entity.PartitionKey, entity.RowKey, function (error4, entityResult) {
            test.equal(error4, null);

            test.notEqual(entityResult, null);
            if (entityResult) {
              test.equal(entityResult.PartitionKey, entity.PartitionKey);
              test.equal(entityResult.RowKey, entity.RowKey);
              test.equal(entityResult.field1, entity.field1);
              test.equal(entityResult.field2, entity.field2);
            }

            test.done();
          });
        });
      });
    });
  },

  testInsertOrMerge: function (test) {
    var tableName = testutil.generateId(testPrefix, tableNames);

    tableService.createTable(tableName, function (error) {
      test.equal(error, null);

      var entity = {
        PartitionKey: '1',
        RowKey: '1',
        field1: 'value',
        field2: 1
      };

      // Should perform an insert
      tableService.insertOrMergeEntity(tableName, entity, function (error2) {
        test.equal(error2, null);

        // Add a new field
        entity.field3 = 2;

        // should perform a merge
        tableService.insertOrMergeEntity(tableName, entity, function (error3) {
          test.equal(error3, null);

          tableService.queryEntity(tableName, entity.PartitionKey, entity.RowKey, function (error4, entityResult) {
            test.equal(error4, null);

            test.notEqual(entityResult, null);
            if (entityResult) {
              test.equal(entityResult.PartitionKey, entity.PartitionKey);
              test.equal(entityResult.RowKey, entity.RowKey);
              test.equal(entityResult.field1, entity.field1);
              test.equal(entityResult.field2, entity.field2);
              test.equal(entityResult.field3, entity.field3);
            }

            test.done();
          });
        });
      });
    });
  },

  testInsertEntityEmptyField: function (test) {
    var tableName = testutil.generateId(testPrefix, tableNames);

    tableService.createTable(tableName, function (error) {
      test.equal(error, null);

      var entity = {
        PartitionKey: '1',
        RowKey: '1',
        field1: 'value',
        emptyField1: '',
        emptyField2: null,
        nonEmptyField3: 0
      };

      // Should perform an insert
      tableService.insertOrMergeEntity(tableName, entity, function (error2) {
        test.equal(error2, null);

        tableService.queryEntity(tableName, entity.PartitionKey, entity.RowKey, function (error4, entityResult) {
          test.equal(error4, null);

          test.notEqual(entityResult, null);
          if (entityResult) {
            test.equal(entityResult.PartitionKey, entity.PartitionKey);
            test.equal(entityResult.RowKey, entity.RowKey);
            test.equal(entityResult.field1, entity.field1);
            test.equal(entityResult.emptyField1, entity.emptyField1);
            test.equal(entityResult.emptyField2, entity.emptyField2);
            test.equal(entityResult.nonEmptyField3, entity.nonEmptyField3);
          }

          test.done();
        });
      });
    });
  }
});
