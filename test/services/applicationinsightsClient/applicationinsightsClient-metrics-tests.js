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

describe('App Insights metrics', function () {
  
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
    suiteUtil = new MockedTestUtils(client, 'applicationinsightsClient-metrics-tests');
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
  
  it('can get single metric successfully', function (done) {
    let metricId = 'availabilityResults/count';
    client.metrics.get(appId, metricId, function(err, result) {
      // All results at least return one empty table
      if (err) {
        done(err);
      }
      result.should.have.property('value');
      result.value.should.have.properties(['start', 'end', 'availabilityResults/count']);
      should.exist(result.value['availabilityResults/count'].sum);
      result.value['availabilityResults/count'].sum.should.be.Number()
      done();
    })
  });

  it('can get multiple metrics successfully', function (done) {
    // Setup
    var params = [
      {
        "id": "1",
        "parameters": {
          "metricId": "availabilityResults/duration"
        }
      },
      {
        "id": "second",
        "parameters": {
          "metricId": "availabilityResults/count",
          "timespan": "P7D12H2M",
          "aggregation": ["sum"]
        }
      }
    ]

    client.metrics.getMultiple(appId, params, function(err, result) {
      if (err) {
        return done(err);
      }
      
      // Basic properties
      for (var i = 0; i < result.length; i++) {
        result[i].should.have.property('status');
        result[i].status.should.eql(200);
        result[i].should.have.property('body');
      }

      // Should get two items back
      result.length.should.eql(2);
      
      // Sanity check
      should.exist(result[1].body.value['availabilityResults/count'].sum)
      done();
    })
  });

  it('can get metrics metadata successfully', function (done) {
    client.metrics.getMetadata(appId, function(err, result) {
      if (err) {
        return done(err);
      }

      // Check smattering of metadata properties (how to improve this?)
      result.should.have.properties(['metrics', 'dimensions']);
      result.metrics.should.have.properties(['requests/count', 'users/authenticated']);
      result.dimensions['request/source'].should.have.property('displayName');
      done();
    })
  });
});
