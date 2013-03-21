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
var _ = require('underscore');

// Test includes
var testutil = require('../../util/util');
var tabletestutil = require('../../framework/table-test-utils');

// Lib includes
var azure = testutil.libRequire('azure');
var azureutil = testutil.libRequire('util/util');

var ServiceClient = azure.ServiceClient;
var TableQuery = azure.TableQuery;
var Constants = azure.Constants;
var HttpConstants = Constants.HttpConstants;
var StorageErrorCodeStrings = Constants.StorageErrorCodeStrings;

var tableNames = [];
var tablePrefix = 'tabledatatype';

var testPrefix = 'tabledatatype-tests';

var tableService;
var suiteUtil;

describe('Table Service', function () {
  before(function (done) {
    tableService = azure.createTableService();
    suiteUtil = tabletestutil.createTableTestUtils(tableService, testPrefix);
    suiteUtil.setupSuite(done);
  });

  after(function (done) {
    suiteUtil.teardownSuite(done);
  });

  beforeEach(function (done) {
    suiteUtil.setupTest(done);
  });

  afterEach(function (done) {
    suiteUtil.teardownTest(done);
  });

  describe('queryEntities', function (done) {
    var tableName;
    var entity = {
      PartitionKey: '1',
      RowKey: '2',
      IntNumberValue: 200,
      DoubleNumberValue: 2.5,
      FalseBooleanValue: false,
      TrueBooleanValue: true,
      StringValue: 'hi there',
      DateValue: new Date(2012, 10, 10, 3, 4, 5, 200)
    };

    function verifyEntity(result) {
      Object.keys(entity).forEach(function (propertyName) {
        if (_.isDate(entity[propertyName])) {
          assert.strictEqual(entity[propertyName].getTime(), result[propertyName].getTime());
        } else {
          assert.strictEqual(entity[propertyName], result[propertyName]);
        }
      });
    }

    beforeEach(function (done) {
      tableName = testutil.generateId(tablePrefix, tableNames, suiteUtil.isMocked);

      tableService.createTable(tableName, function () {
        tableService.insertEntity(tableName, entity, done);
      });
    });

    it('should be able to query by integer value', function (done) {
      var tableQuery = azure.TableQuery.select().from(tableName).where('IntNumberValue eq ?', entity.IntNumberValue);
      tableService.queryEntities(tableQuery, function (err, results) {
        assert.equal(err, null);
        assert.notEqual(results, null);
        assert.equal(results.length, 1);
        verifyEntity(results[0]);

        done();
      });
    });

    it('should be able to query by double value', function (done) {
      var tableQuery = azure.TableQuery.select().from(tableName).where('DoubleNumberValue eq ?', entity.DoubleNumberValue);
      tableService.queryEntities(tableQuery, function (err, results) {
        assert.equal(err, null);
        assert.notEqual(results, null);
        assert.equal(results.length, 1);
        verifyEntity(results[0]);

        done();
      });
    });

    it('should be able to query by false boolean value', function (done) {
      var tableQuery = azure.TableQuery.select().from(tableName).where('FalseBooleanValue eq ?', entity.FalseBooleanValue);
      tableService.queryEntities(tableQuery, function (err, results) {
        assert.equal(err, null);
        assert.notEqual(results, null);
        assert.equal(results.length, 1);
        verifyEntity(results[0]);

        done();
      });
    });

    it('should be able to query by true boolean value', function (done) {
      var tableQuery = azure.TableQuery.select().from(tableName).where('TrueBooleanValue eq ?', entity.TrueBooleanValue);
      tableService.queryEntities(tableQuery, function (err, results) {
        assert.equal(err, null);
        assert.notEqual(results, null);
        assert.equal(results.length, 1);
        verifyEntity(results[0]);

        done();
      });
    });

    it('should be able to query by string value', function (done) {
      var tableQuery = azure.TableQuery.select().from(tableName).where('TrueBooleanValue eq ?', entity.TrueBooleanValue);
      tableService.queryEntities(tableQuery, function (err, results) {
        assert.equal(err, null);
        assert.notEqual(results, null);
        assert.equal(results.length, 1);
        verifyEntity(results[0]);

        done();
      });
    });

    it('should be able to query by date value', function (done) {
      var tableQuery = azure.TableQuery.select().from(tableName).where('DateValue eq ?', entity.DateValue);
      tableService.queryEntities(tableQuery, function (err, results) {
        assert.equal(err, null);
        assert.notEqual(results, null);
        assert.equal(results.length, 1);
        verifyEntity(results[0]);

        done();
      });
    });
  });
});