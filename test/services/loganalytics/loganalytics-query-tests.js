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

'use-strict';

var should = require('should');
var Testutil = require('../../util/util');
var LogAnalyticsClient = require('../../../lib/services/loganalytics/lib/logAnalyticsClient');
var msrest = require('ms-rest');
var MockedTestUtils = require('../../framework/mocked-test-utils');
var util = require('util');

describe('Log Analytics query', function () {
  
  var client;
  var suiteUtil;

  before(function (done) {
    var apiKeyOptions = {
      inHeader: {
        'x-api-key': 'DEMO_KEY'
      } 
    }
    var credentials = new msrest.ApiKeyCredentials(apiKeyOptions);
    client = new LogAnalyticsClient(credentials);
    suiteUtil = new MockedTestUtils(client, 'loganalytics-query-tests');
    suiteUtil.setupSuite(done);
  });

  after(function (done) {
    suiteUtil.teardownSuite(done);
  });

  beforeEach(function (done) {
    suiteUtil.setupTest(done);
  });

  afterEach(function (done) {
    suiteUtil.baseTeardownTest(done);
  });
  
  it('executes successfully', function (done) {
    var queryBody = {
      query: 'AzureActivity | take 10'
    }
    client.query('DEMO_WORKSPACE', queryBody, function(err, result) {
      // All results at least return one empty table
      if (err) {
        done(err);
      }
      should.exist(result.tables);
      (result.tables.length).should.be.aboveOrEqual(1);
      
      // AzureActivity has 23 column schema
      should.equal(result.tables[0].columns.length, 23);
 
      // This call should be able to retrieve 10 rows successfully
      should.equal(result.tables[0].rows.length, 10);
      done();
    })
  });
});
