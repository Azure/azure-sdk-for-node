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

var should = require('should');
var mocha = require('mocha');

// Test includes
var testutil = require('../../util/util');
var tabletestutil = require('../../framework/table-test-utils');

// Lib includes
var common = require('azure-common');
var storage = require('azure-storage-legacy');

var tableNames = [];
var tablePrefix = 'tableservice';

var testPrefix = 'tableservice-gb-tests';

var tableService;
var suiteUtil;

describe('tableservice', function () {
  before(function (done) {
    tableService = storage.createTableService()
      .withFilter(new common.ExponentialRetryPolicyFilter());

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

  describe('when entity with gb keys exist', function () {
    var tableName;

    var partitionKey = '\u2488\u2460\u216B\u3128\u3129'.toString('GB18030');
    var rowKey = '\u2488\u2460\u216B\u3128\u3129'.toString('GB18030');
    var value = 'test';

    beforeEach(function (done) {
      tableName = testutil.generateId(tablePrefix, tableNames, suiteUtil.isMocked);

      tableService.createTable(tableName, function (err) {
        should.not.exist(err);

        tableService.insertEntity(tableName, {
            PartitionKey: partitionKey,
            RowKey: rowKey,
            Value: value
          },
          done);
      });
    });

    it('query entity should work', function (done) {
      tableService.queryEntity(tableName, partitionKey, rowKey, function (err, res) {
        should.not.exist(err);
        res.PartitionKey.should.equal(partitionKey);
        res.RowKey.should.equal(rowKey);
        res.Value.should.equal(value);

        done();
      });
    });
  });

  describe('inserting entity with gb18030 data', function () {
    var entity1 = { PartitionKey: 'part1',
      RowKey: 'row1',
      field: 'my field',
      otherfield: 'my other field',
      otherprops: 'my properties',
      gb18030: "𡬁𠻝𩂻耨鬲, 㑜䊑㓣䟉䋮䦓, ᡨᠥ᠙ᡰᢇ᠘ᠶ, ࿋ཇ࿂ོ༇ྒ, ꃌꈗꈉꋽ, Uighur, ᥗᥩᥬᥜᥦ "
    };
    var tableName;

    beforeEach(function (done) {
      tableName = testutil.generateId(tablePrefix, tableNames, suiteUtil.isMocked);
      tableService.createTable(tableName, function (createError, table, createResponse) {
        should.not.exist(createError);
        done(createError);
      });
    });

    it('should store data with encoded fields', function (done) {
      tableService.insertEntity(tableName, entity1, function (err) {
        if (err) { return done(err); }
        var tableQuery = storage.TableQuery.select().from(tableName);

        tableService.queryEntities(tableQuery, function (err, entries) {
          if (err) { return done(err); }

          entries.length.should.equal(1);
          entries[0].PartitionKey.should.equal(entity1.PartitionKey);
          entries[0].RowKey.should.equal(entity1.RowKey);
          entries[0].field.should.equal(entity1.field);
          entries[0].otherfield.should.equal(entity1.otherfield);
          entries[0].otherprops.should.equal(entity1.otherprops);
          entries[0].gb18030.should.equal(entity1.gb18030);

          done();
        });
      });
    });
  });
});