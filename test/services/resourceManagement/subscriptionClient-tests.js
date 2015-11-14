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
var SubscriptionClient = require('../../../lib/services/resourceManagement/lib/subscription/subscriptionClient');
var testPrefix = 'subscriptionClient-tests';
var suite;
var client;

describe('Subscription Management Client', function () {
  
  before(function (done) {
    suite = new SuiteBase(this, testPrefix);
    suite.setupSuite(function () {
      client = new SubscriptionClient(suite.credentials, suite.subscriptionId);
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
  
  it('should get a specified subscription', function (done) {
    client.subscriptions.get(suite.subscriptionId, function (err, result, request, response) {
      should.not.exist(err);
      should.exist(result);
      response.statusCode.should.equal(200);
      result.subscriptionId.should.equal(suite.subscriptionId);
      result.state.should.equal('Enabled');
      done();
    });
  });
  
  it('should list all the subscriptions', function (done) {
    client.subscriptions.list(function (err, result, request, response) {
      should.not.exist(err);
      should.exist(result);
      response.statusCode.should.equal(200);
      result.length.should.be.above(0);
      result.some(function (item) { return _.isEqual(item.subscriptionId, suite.subscriptionId); }).should.be.true;
      done();
    });
  });

  it('should list all the tenants', function (done) {
    client.tenants.list(function (err, result, request, response) {
      should.not.exist(err);
      should.exist(result);
      response.statusCode.should.equal(200);
      result.length.should.be.above(0);
      done();
    });
  });
});