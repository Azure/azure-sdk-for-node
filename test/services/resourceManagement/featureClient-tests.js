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
var util = require('util');
var msRestAzure = require('ms-rest-azure');
var _ = require('underscore');
var testutil = require('../../util/util');
var SuiteBase = require('../../framework/suite-base');


var dump = util.inspect;
var FeatureClient = require('../../../lib/services/resourceManagement/lib/feature/featureClient');
var testPrefix = 'featureClient-tests';
var resourceProvider = 'Microsoft.Sql';
var featureName = 'IndexAdvisor';
var client;
var suite;

describe('Feature Client', function () {
  
  before(function (done) {
    suite = new SuiteBase(this, testPrefix);
    suite.setupSuite(function () {
      client = new FeatureClient(suite.credentials, suite.subscriptionId);
      if (suite.isPlayback) {
        client.longRunningOperationRetryTimeoutInSeconds = 0;
      }
      done();
    });
  });
  
  after(function (done) {
    suite.teardownSuite(done);
  });
  
  beforeEach(function (done) {
    suite.setupTest(done);
  });
  
  afterEach(function (done) {
    suite.baseTeardownTest(done);
  });
  
  it('should list features of an RP', function (done) {
    client.features.list(resourceProvider, function (err, result) {
      should.not.exist(err);
      should.exist(result.body);
      result.response.statusCode.should.equal(200);
      result.body.value.length.should.be.above(0);
      result.body.value.some(function (item) {
        return (_.isEqual(item.name, 'Microsoft.Sql/IndexAdvisor') && _.isEqual(item.type, 'Microsoft.Features/providers/features'));
      }).should.be.true;
      done();
    });
  });
  
  it('should list all the features of all the RPs in the subscription', function (done) {
    client.features.listAll(function (err, result) {
      should.not.exist(err);
      should.exist(result.body);
      result.response.statusCode.should.equal(200);
      result.body.value.length.should.be.above(0);
      done();
    });
  });

  it('should register an RP', function (done) {
    client.features.register(resourceProvider, featureName, function (err, result) {
      should.not.exist(err);
      should.exist(result.body);
      result.response.statusCode.should.equal(200);
      result.body.name.should.equal('Microsoft.Sql/IndexAdvisor');
      result.body.properties.state.should.not.equal('NotRegistered');
      done();
    });
  });
});