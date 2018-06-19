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

describe('App Insights events', function () {
  
  var client;
  var suiteUtil;
  const appId = 'DEMO_APP';
  const props = [
    'id', 
    'timestamp', 
    'count', 
    'customDimensions', 
    'operation', 
    'session', 
    'user', 
    'cloud', 
    'ai', 
    'application', 
    'client', 
    'type'
  ];

  before(function (done) {
    var apiKeyOptions = {
      inHeader: {
        'x-api-key': 'DEMO_KEY'
      } 
    }
    var credentials = new msrest.ApiKeyCredentials(apiKeyOptions);
    client = new ApplicationInsightsDataClient(credentials);
    suiteUtil = new MockedTestUtils(client, 'applicationinsightsClient-events-tests');
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
  
  it('can get events by type', function (done) {
    client.events.getByType(appId, 'requests', (err, result) => {
      if (err) {
        return done(err);
      }
      
      should.exist(result.value);
      result.value.length.should.be.aboveOrEqual(1);
      for (var i = 0; i < result.value.length; i++) {
        result.value[i].should.have.properties(props);
      }
      console.log(result, err)
      done();
    });
  });

  it('can get single event by id', function (done) {
    client.events.get(appId, 'requests', 'a3a046e0-7378-11e8-9522-d9a097b67ddd', (err, result) => {
      if (err) {
        return done(err);
      }
      console.log(result, err);
      done();
    });
  });

  it('can get events metadata', function (done) {
    client.events.getOdataMetadata(appId, (err, result, req, res) => {
      if (err) {
        // ERROR: Can't deserialize XML
        return done(err);
      }
      done();
    });
  });
});
