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
var testutil = require('../../util/util');
var tabletestutil = require('../../framework/table-test-utils');

// Lib includes
var azure = testutil.libRequire('azure');
var storage = testutil.libRequire('services/legacyStorage');

var ServiceClient = azure.ServiceClient;
var ExponentialRetryPolicyFilter = azure.ExponentialRetryPolicyFilter;
var Constants = azure.Constants;

var exponentialRetryPolicyFilter;

var tableNames = [];
var tablePrefix = 'expretry';

var testPrefix = 'exponentialretrypolicyfilter-tests';

var tableService;
var suiteUtil;

suite('exponentialretrypolicyfilter-tests', function () {
  suiteSetup(function (done) {
    exponentialRetryPolicyFilter = new ExponentialRetryPolicyFilter();
    tableService = storage.createTableService().withFilter(exponentialRetryPolicyFilter);
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

  test('RetryFailSingle', function (done) {
    var tableName = testutil.generateId(tablePrefix, tableNames, suiteUtil.isMocked);

    var retryCount = 3;
    var retryInterval = 30;

    exponentialRetryPolicyFilter.retryCount = retryCount;
    exponentialRetryPolicyFilter.retryInterval = retryInterval;

    tableService.createTable(tableName, function (err) {
      assert.equal(err, null);

      tableService.createTable(tableName, function (err2) {
        assert.notEqual(err2, null);
        assert.equal(err2.code, Constants.TableErrorCodeStrings.TABLE_ALREADY_EXISTS);
        assert.equal(err2.innerError, null);

        done();
      });
    });
  });

  test('RetryFailMultiple', function (done) {
    var tableName = testutil.generateId(tablePrefix, tableNames, suiteUtil.isMocked);

    var retryCount = 3;

    // 30 seconds as starting time between attempts should be enough to give enough time for the
    // table creation to succeed after a deletion.
    var retryInterval = 30000;

    if (suiteUtil.isMocked && !suiteUtil.isRecording) {
      // if a playback on the mockserver is running, retryinterval can be lower
      retryInterval = 30;

      exponentialRetryPolicyFilter.minRetryInterval = 30;
    }

    exponentialRetryPolicyFilter.retryCount = retryCount;
    exponentialRetryPolicyFilter.retryInterval = retryInterval;

    // replace shouldRetry to skip return codes verification and retry on 409 (deleting)
    exponentialRetryPolicyFilter.shouldRetry = function (statusCode, retryData) {
      var currentCount = (retryData && retryData.retryCount) ? retryData.retryCount : 0;

      return (currentCount < this.retryCount);
    };

    tableService.createTable(tableName, function (err) {
      assert.equal(err, null);

      tableService.deleteTable(tableName, function (err2) {
        assert.equal(err2, null);

        // trying to create a table right after a delete should force retry to kick in
        // table should be created nicely
        tableService.createTable(tableName, function (err3) {
          assert.equal(err3, null);

          done();
        });
      });
    });
  });

  test('GetTablePassOnGetTable', function (done) {
    var tableName = testutil.generateId(tablePrefix, tableNames, suiteUtil.isMocked);

    var retryCount = 3;
    var retryInterval = 30;

    exponentialRetryPolicyFilter.retryCount = retryCount;
    exponentialRetryPolicyFilter.retryInterval = retryInterval;

    tableService.getTable(tableName, function (err, table) {
      assert.equal(err.code, Constants.StorageErrorCodeStrings.RESOURCE_NOT_FOUND);
      assert.equal(table, null);

      done();
    });
  });
});