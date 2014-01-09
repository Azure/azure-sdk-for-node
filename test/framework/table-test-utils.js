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

var util = require('util');

var MockedTestUtils = require('./mocked-test-utils');

function TableTestUtils(service, testPrefix) {
  TableTestUtils.super_.call(this, service, testPrefix);
}

util.inherits(TableTestUtils, MockedTestUtils);

TableTestUtils.prototype.teardownTest = function (callback) {
  var self = this;

  var deleteTables = function (tables, done) {
    if (tables <= 0) {
      done();
    } else {
      var currentTable = tables.pop();
      self.service.deleteTable(currentTable.TableName, function () {
        deleteTables(tables, done);
      });
    }
  };

  self.service.queryTables(function (queryError, tables) {
    deleteTables(tables, function () {
      self.baseTeardownTest(callback);
    });
  });
};

exports.createTableTestUtils = function (service, testPrefix) {
  return new TableTestUtils(service, testPrefix);
};