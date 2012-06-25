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

var ServiceClient = azure.ServiceClient;
var LinearRetryPolicyFilter = azure.LinearRetryPolicyFilter;
var Constants = azure.Constants;

var tableService;
var linearRetryPolicyFilter;

var tableNames = [];
var tablePrefix = 'linearretry';

var testPrefix = 'linearretrypolicyfilter-tests';
var numberTests = 3;

suite('linearretrypolicyfilter-tests', function () {
  setup(function (done) {
    tabletestutil.setUpTest(testPrefix, function (err, newTableService) {
      linearRetryPolicyFilter = new LinearRetryPolicyFilter();
      tableService = newTableService.withFilter(linearRetryPolicyFilter);
      done();
    });
  });

  teardown(function (done) {
    tabletestutil.tearDownTest(numberTests, tableService, testPrefix, done);
  });

  test('RetryFailSingle', function (done) {
    var tableName = testutil.generateId(tablePrefix, tableNames, tabletestutil.isMocked);

    var retryCount = 3;
    var retryInterval = 30;

    linearRetryPolicyFilter.retryCount = retryCount;
    linearRetryPolicyFilter.retryInterval = retryInterval;

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
    var tableName = testutil.generateId(tablePrefix, tableNames, tabletestutil.isMocked);

    var retryCount = 3;

    // 30 seconds between attempts should be enough to give enough time for the
    // table creation to succeed after a deletion.
    var retryInterval = 30000;

    if (tabletestutil.isMocked && !tabletestutil.isRecording) {
      // if a playback on the mockserver is running, retryinterval can be lower
      retryInterval = 30;
    }

    linearRetryPolicyFilter.retryCount = retryCount;
    linearRetryPolicyFilter.retryInterval = retryInterval;

    // replace shouldRetry to skip return codes verification and retry on 409 (deleting)
    linearRetryPolicyFilter.shouldRetry = function (statusCode, retryData) {
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

  test('RetryPassOnGetTable', function (done) {
    var tableName = testutil.generateId(tablePrefix, tableNames, tabletestutil.isMocked);

    var retryCount = 3;
    var retryInterval = 30;

    linearRetryPolicyFilter.retryCount = retryCount;
    linearRetryPolicyFilter.retryInterval = retryInterval;

    tableService.getTable(tableName, function (err, table) {
      assert.equal(err.code, Constants.StorageErrorCodeStrings.RESOURCE_NOT_FOUND);
      assert.equal(table, null);

      done();
    });
  });
});