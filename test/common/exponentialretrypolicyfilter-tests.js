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

var azure = require("../../lib/azure");

var ServiceClient = require('../../lib/services/serviceclient');
var ExponentialRetryPolicyFilter = require('../../lib/common/exponentialretrypolicyfilter');
var Constants = require('../../lib/util/constants');

var tableService;
var exponentialRetryPolicyFilter;

var tableNames = generateNames('retryexp', 3);

module.exports = testCase(
{
  setUp: function (callback) {
    tableService = azure.createTableService();

    exponentialRetryPolicyFilter = new ExponentialRetryPolicyFilter();
    tableService = tableService.withFilter(exponentialRetryPolicyFilter);

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

  testRetryFailSingle: function (test) {
    var tableName = tableNames[0];
    var retryCount = 3;
    var retryInterval = 30;

    exponentialRetryPolicyFilter.retryCount = retryCount;
    exponentialRetryPolicyFilter.retryInterval = retryInterval;

    tableService.createTable(tableName, function (err) {
      test.equal(err, null);

      tableService.createTable(tableName, function (err2) {
        test.notEqual(err2, null);
        test.equal(err2.code, Constants.TableErrorCodeStrings.TABLE_ALREADY_EXISTS);
        test.equal(err2.innerError, null);

        test.done();
      });
    });
  },

  testRetryFailMultiple: function (test) {
    var tableName = tableNames[1];
    var retryCount = 3;
    var retryInterval = 30000;
    // 30 seconds as starting time between attempts should be enough to give enough time for the
    // table creation to succeed after a deletion.

    exponentialRetryPolicyFilter.retryCount = retryCount;
    exponentialRetryPolicyFilter.retryInterval = retryInterval;

    // replace shouldRetry to skip return codes verification and retry on 409 (deleting)
    exponentialRetryPolicyFilter.shouldRetry = function (statusCode, retryData) {
      var currentCount = (retryData && retryData.retryCount) ? retryData.retryCount : 0;

      return (currentCount < this.retryCount);
    };

    tableService.createTable(tableName, function (err) {
      test.equal(err, null);

      tableService.deleteTable(tableName, function (err2) {
        test.equal(err2, null);

        // trying to create a table right after a delete should force retry to kick in
        // table should be created nicely
        tableService.createTable(tableName, function (err3) {
          test.equal(err3, null);

          test.done();
        });
      });
    });
  },

  testGetTablePassOnGetTable: function (test) {
    var tableName = tableNames[2];
    var retryCount = 3;
    var retryInterval = 30;

    exponentialRetryPolicyFilter.retryCount = retryCount;
    exponentialRetryPolicyFilter.retryInterval = retryInterval;

    tableService.getTable(tableName, function (err, table) {
      test.equal(err.code, Constants.StorageErrorCodeStrings.RESOURCE_NOT_FOUND);
      test.equal(table, null);

      test.done();
    });
  }
});

function generateNames(prefix, num) {
  var result = [];
  for (var i = 0; i < num; ) {
    var newNumber = prefix + Math.floor(Math.random() * 10000);
    if (result.indexOf(newNumber) == -1) {
      result.push(newNumber);
      i++;
    }
  }

  return result;
};