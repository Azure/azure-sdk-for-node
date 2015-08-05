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
var AuthorizationClient = require('../../../lib/services/resourceManagement/lib/authorization/authorizationClient');
var ResourceManagementClient = require('../../../lib/services/resourceManagement/lib/resource/resourceManagementClient');
var testPrefix = 'authorizationClient-tests';

var service;
var suiteUtil;
var subscriptionId = process.env['SUBSCRIPTION_ID'] || 'subscription-id';
var clientId = process.env['CLIENT_ID'] || 'client-id';
var domain = process.env['DOMAIN'] || 'domain';
var username = process.env['USERNAME'] || 'username@example.com';
var password = process.env['PASSWORD'] || 'dummypassword';
var clientRedirectUri = 'clientRedirectUri';
var resourceProvider = 'Microsoft.Sql';
var featureName = 'IndexAdvisor';

var credentials = new msRestAzure.UserTokenCredentials(clientId, domain, username, password, clientRedirectUri);
var client = new AuthorizationClient(credentials, subscriptionId);
var resourceManagementClient = new ResourceManagementClient(credentials, subscriptionId);
var testLocation = 'West US';
var groupParameters = {
  location: testLocation,
  tags: {
    tag1: 'val1',
    tag2: 'val2'
  }
};

describe('Authorization Client', function () {
  
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
  
  describe('Management Lock Operations', function () {
    var groupName = 'testg101';
    var lockName = 'testlock1';
    var lockLevel = 'CanNotDelete';
    it('should work for all operations possible', function (done) {
      //create a resource group
      resourceManagementClient.resourceGroups.createOrUpdate(groupName, groupParameters, function (err, result) {
        should.not.exist(err);
        should.exist(result.body);
        var lockParameters = {
          properties: {
            level: lockLevel,
            notes: 'Optional text.'
          }
        };
        client.managementLocks.createOrUpdateAtResourceGroupLevel(groupName, lockName, lockParameters, function (err, result) {
          should.not.exist(err);
          should.exist(result.body);
          client.managementLocks.get(lockName, function (error, result) {
            //should.not.exist(err);
            //should.exist(result.body);
            client.managementLocks.listAtResourceGroupLevel(groupName, { properties: { level: lockLevel } }, function (err, result) {
              should.not.exist(err);
              should.exist(result.body);
              result.response.statusCode.should.equal(200);
              var locks = result.body.value;
              locks.length.should.be.above(0);
              locks.some(function (item) {
                return item.name.should.equal(lockName);
              }).should.be.true;
              client.managementLocks.listAtSubscriptionLevel(null, function (err, result) {
                should.not.exist(err);
                should.exist(result.body);
                result.response.statusCode.should.equal(200);
                var locks = result.body.value;
                locks.length.should.be.above(0);
                locks.some(function (item) {
                  return item.name.should.equal(lockName);
                }).should.be.true;
                client.managementLocks.deleteAtResourceGroupLevel(groupName, lockName, function (err, result) {
                  should.not.exist(err);
                  result.response.statusCode.should.equal(200);
                  done();
                });
              });
            });
          });
        });
      });
    });
  });
});