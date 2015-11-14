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
var AuthorizationClient = require('../../../lib/services/resourceManagement/lib/authorization/authorizationClient');
var ResourceManagementClient = require('../../../lib/services/resourceManagement/lib/resource/resourceManagementClient');
var testPrefix = 'authorizationClient-tests';
var groupPrefix = 'nodeTestGroup';
var createdGroups = [];

var requiredEnvironment = [
  { name: 'AZURE_TEST_LOCATION', defaultValue: 'West US' }
];

var suite;
var client;
var testLocation;
var groupName;

describe('Authorization Client', function () {
  before(function (done) {
    suite = new SuiteBase(this, testPrefix, requiredEnvironment);
    suite.setupSuite(function () {
      groupName = suite.generateId(groupPrefix, createdGroups, suite.isMocked);
      client = new AuthorizationClient(suite.credentials, suite.subscriptionId);
      testLocation = process.env['AZURE_TEST_LOCATION'];
      if (suite.isPlayback) {
        client.longRunningOperationRetryTimeoutInSeconds = 0;
      }
      suite.createResourcegroup(groupName, testLocation, function (err, result) {
        should.not.exist(err);
        done();
      });
    });
  });
  
  after(function (done) {
    suite.teardownSuite(function () {
      suite.deleteResourcegroup(groupName, function (err, result) {
        should.not.exist(err);
        done();
      });
    });
  });
  
  beforeEach(function (done) {
    suite.setupTest(done);
  });
  
  afterEach(function (done) {
    suite.baseTeardownTest(done);
  });
  
  describe('Management Lock Operations', function () {
    var lockName = 'testlock1';
    var lockLevel = 'CanNotDelete';
    it('should work for all operations possible', function (done) {
      var lockParameters = {
          level: lockLevel,
          notes: 'Optional text.'
      };
      client.managementLocks.createOrUpdateAtResourceGroupLevel(groupName, lockName, lockParameters, function (err, result) {
        should.not.exist(err);
        should.exist(result);
        client.managementLocks.get(lockName, function (error, result) {
          //should.not.exist(err);
          //should.exist(result);
          client.managementLocks.listAtResourceGroupLevel(groupName, { properties: { level: lockLevel } }, function (err, result, request, response) {
            should.not.exist(err);
            should.exist(result);
            response.statusCode.should.equal(200);
            var locks = result;
            locks.length.should.be.above(0);
            locks.some(function (item) {
              return item.name.should.equal(lockName);
            }).should.be.true;
            client.managementLocks.listAtSubscriptionLevel(null, function (err, result, request, response) {
              should.not.exist(err);
              should.exist(result);
              response.statusCode.should.equal(200);
              var locks = result;
              locks.length.should.be.above(0);
              locks.some(function (item) {
                return item.name.should.equal(lockName);
              }).should.be.true;
              client.managementLocks.deleteAtResourceGroupLevel(groupName, lockName, function (err, result, request, response) {
                should.not.exist(err);
                response.statusCode.should.equal(200);
                done();
              });
            });
          });
        });
      });
    });
  });
});