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

var testutil = require('../../util/util');
var MockedTestUtils = require('../../framework/mocked-test-utils');


var dump = util.inspect;
var StorageManagementClient = require('../../../lib/services/storageManagement2/lib/storageManagementClient');
var testPrefix = 'storagemanagementservice-tests';

var service;
var suiteUtil;
var subscriptionId = process.env['SUBSCRIPTION_ID'];
var token = process.env['AZURE_TOKEN'];
var credentials = new msRestAzure.SubscriptionCredentials(token, subscriptionId);
var client = new StorageManagementClient(credentials);
var accountName = 'testac112';
var groupName = 'csmrg7947';
var acclocation = 'West US';
var accType = 'Standard_LRS';
var createParameters = {
  location: acclocation,
  properties: {
    accountType: accType,
  },
  tags: {
    tag1: 'val1',
    tag2: 'val2'
  }
};

describe('Storage Management', function () {
  
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
  
  describe('storage accounts', function () {
    it('should create an account correctly', function (done) {
      if (suiteUtil.isPlayback) {
        client.longRunningOperationRetryTimeoutInSeconds = 0;
      }
      client.storageAccounts.create(groupName, accountName, createParameters, function (err, result) {
        should.not.exist(err);
        should.exist(result.body);
        result.response.statusCode.should.equal(200);
        done();
      });
    });
    
    it('should get properties of the specified storage account', function (done) {
      client.storageAccounts.getProperties(groupName, accountName, function (err, result) {
        should.not.exist(err);
        should.exist(result.body);
        result.response.statusCode.should.equal(200);
        var account = result.body;
        account.name.should.equal(accountName);
        account.location.should.equal(acclocation);
        account.type.should.equal('Microsoft.Storage/storageAccounts');
        done();
      });
    });
    
    it('should list all the storage accounts in the subscription', function (done) {
      client.storageAccounts.list(function (err, result) {
        should.not.exist(err);
        should.exist(result.body);
        result.response.statusCode.should.equal(200);
        var accounts = result.body.value;
        accounts.length.should.be.above(0);
        accounts.some(function (ac) { return ac.name === accountName }).should.be.true;
        done();
      });
    });
    
    it('should list all the storage accounts in the resourcegroup', function (done) {
      client.storageAccounts.listByResourceGroup(groupName, function (err, result) {
        should.not.exist(err);
        should.exist(result.body);
        result.response.statusCode.should.equal(200);
        var accounts = result.body.value;
        accounts.length.should.be.above(0);
        accounts.some(function (ac) { return ac.name === accountName }).should.be.true;
        done();
      });
    });
    
    it('should list all the storage account keys', function (done) {
      client.storageAccounts.listKeys(groupName, accountName, function (err, result) {
        should.not.exist(err);
        should.exist(result.body);
        result.response.statusCode.should.equal(200);
        var keys = result.body;
        should.exist(keys.key1);
        should.exist(keys.key2);
        done();
      });
    });
    
    it('should regenerate storage account keys', function (done) {
      client.storageAccounts.listKeys(groupName, accountName, function (err, result) {
        should.not.exist(err);
        should.exist(result.body);
        result.response.statusCode.should.equal(200);
        var keys = result.body;
        client.storageAccounts.regenerateKey(groupName, accountName, { keyName: 'key1' }, function (err, result) {
          should.not.exist(err);
          should.exist(result.body);
          result.response.statusCode.should.equal(200);
          var regeneratedkeys = result.body;
          keys.key2.should.equal(regeneratedkeys.key2);
          keys.key1.should.not.equal(regeneratedkeys.key1);
          done();
        });
      });
    });
    
    it('should delete the specified storage account', function (done) {
      client.storageAccounts.deleteMethod(groupName, accountName, function (err, result) {
        should.not.exist(err);
        result.response.statusCode.should.equal(200);
        done();
      });
    });
  });
});