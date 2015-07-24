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
var MockedTestUtils = require('../../framework/mocked-test-utils');


var dump = util.inspect;
var SubscriptionClient = require('../../../lib/services/resourceManagement/lib/subscription/subscriptionClient');
var testPrefix = 'subscriptionClient-tests';

var service;
var suiteUtil;
var subscriptionId = process.env['SUBSCRIPTION_ID'] || 'subscription-id';
var clientId = process.env['CLIENT_ID'] || 'client-id';
var domain = process.env['DOMAIN'] || 'domain';
var username = process.env['USERNAME'] || 'username@example.com';
var password = process.env['PASSWORD'] || 'dummypassword';
var clientRedirectUri = 'clientRedirectUri';

var credentials = new msRestAzure.UserTokenCredentials(clientId, domain, username, password, clientRedirectUri);
var client = new SubscriptionClient(credentials, subscriptionId);

describe('Subscription Management Client', function () {
  
  before(function (done) {
    suiteUtil = new MockedTestUtils(client, testPrefix);
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
  
  it('should get a specified subscription', function (done) {
    client.subscriptions.get(subscriptionId, function (err, result) {
      should.not.exist(err);
      should.exist(result.body);
      result.response.statusCode.should.equal(200);
      result.body.subscriptionId.should.equal(subscriptionId);
      result.body.state.should.equal('Enabled');
      done();
    });
  });
  
  it('should list all the subscriptions', function (done) {
    client.subscriptions.list(function (err, result) {
      should.not.exist(err);
      should.exist(result.body);
      result.response.statusCode.should.equal(200);
      result.body.value.length.should.be.above(0);
      result.body.value.some(function (item) { return _.isEqual(item.subscriptionId, subscriptionId); }).should.be.true;
      done();
    });
  });

  it('should list all the tenants', function (done) {
    client.tenants.list(function (err, result) {
      should.not.exist(err);
      should.exist(result.body);
      result.response.statusCode.should.equal(200);
      result.body.value.length.should.be.above(0);
      done();
    });
  });
});