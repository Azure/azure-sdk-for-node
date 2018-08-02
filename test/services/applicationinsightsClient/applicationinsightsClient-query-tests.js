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
var ApplicationInsightsDataClient = require('../../../lib/services/applicationinsightsClient/lib/applicationInsightsDataClient');
var msrest = require('ms-rest');
var MockedTestUtils = require('../../framework/mocked-test-utils');
var util = require('util');

describe('App Insights query', function () {
  
  var client;
  var suiteUtil;
  const appId = 'DEMO_APP';

  before(function (done) {
    var apiKeyOptions = {
      inHeader: {
        'x-api-key': 'DEMO_KEY'
      } 
    }
    var credentials = new msrest.ApiKeyCredentials(apiKeyOptions);
    client = new ApplicationInsightsDataClient(credentials);
    suiteUtil = new MockedTestUtils(client, 'applicationinsightsClient-query-tests');
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
      query: 'requests | take 10',
      timespan: 'P2D'
    }
    client.query.execute(appId, queryBody, function(err, result) {
      // All results at least return one empty table
      if (err) {
        done(err);
      }
      should.exist(result.tables);
      (result.tables.length).should.be.aboveOrEqual(1);
      
      // requests here has 37 column schema
      should.equal(result.tables[0].columns.length, 37);
 
      // This call should be able to retrieve 10 rows successfully
      should.equal(result.tables[0].rows.length, 10);

      // Field should be a float-y number
      should(result.tables[0].rows[0][7]).be.a.Number();
      done();
    })
  });
});
