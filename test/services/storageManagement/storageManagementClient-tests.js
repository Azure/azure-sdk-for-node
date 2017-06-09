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

var SuiteBase = require('../../framework/suite-base');
var FileTokenCache = require('../../../lib/util/fileTokenCache');
var StorageManagementClient = require('../../../lib/services/storageManagement2/lib/storageManagementClient');
var testPrefix = 'storagemanagementservice-tests';
var groupPrefix = 'nodeTestGroup';
var accountPrefix = 'testacc';
var createdGroups = [];
var createdAccounts = [];

var requiredEnvironment = [
  { name: 'AZURE_TEST_LOCATION', defaultValue: 'westus' }
];

var suite;
var client;
var accountName;
var groupName;
var acclocation;
var accType;
var createParameters;

describe('Storage Management', function () {
  
  before(function (done) {
    suite = new SuiteBase(this, testPrefix, requiredEnvironment);
    suite.setupSuite(function () {
      groupName = suite.generateId(groupPrefix, createdGroups, suite.isMocked);
      client = new StorageManagementClient(suite.credentials, suite.subscriptionId);
      accountName = suite.generateId(accountPrefix, createdAccounts, suite.isMocked);
      acclocation = process.env['AZURE_TEST_LOCATION'];
      accType = 'Standard_LRS';
      createParameters = {
        location: acclocation,
        sku: {
          name: accType,
        },
        kind: 'Storage',
        tags: {
          tag1: 'val1',
          tag2: 'val2'
        }
      };
      if (suite.isPlayback) {
        client.longRunningOperationRetryTimeout = 0;
      }
      suite.createResourcegroup(groupName, acclocation, function (err, result) {
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
  
  describe('storage accounts', function () {
    it('should create an account correctly', function (done) {
      client.storageAccounts.create(groupName, accountName, createParameters, function (err, result, request, response) {
        should.not.exist(err);
        should.exist(result);
        response.statusCode.should.equal(200);
        done();
      });
    });

    it('should create an account correctly with encryption', function (done) {
      accountNameEncryption = suite.generateId(accountPrefix, createdAccounts, suite.isMocked);
      createParametersEncryption = {
        location: 'westus',
        sku: {
          name: accType,
        },
        kind: 'Storage',
        encryption: {
          services: {blob: {enabled: true}, file: {enabled: true}},
          keySource: 'Microsoft.Storage'
        }
      };
      client.storageAccounts.create(groupName, accountNameEncryption, createParametersEncryption, function (err, result, request, response) {
        should.not.exist(err);
        should.exist(result);
        response.statusCode.should.equal(200);
        done();
      });
    });

    it('should create an account correctly with cool', function (done) {
      accountNameCool = suite.generateId(accountPrefix, createdAccounts, suite.isMocked);
      createParametersCool = {
        location: 'westus',
        sku: {
          name: accType,
        },
        kind: 'BlobStorage',
        accessTier: 'Cool'
      };
      client.storageAccounts.create(groupName, accountNameCool, createParametersCool, function (err, result, request, response) {
        should.not.exist(err);
        should.exist(result);
        response.statusCode.should.equal(200);
        done();
      });
    }); 

    it('should create an account correctly with https only', function (done) {
      accountNameCool = suite.generateId(accountPrefix, createdAccounts, suite.isMocked);
      createParametersCool = {
        location: 'westus',
        sku: {
          name: accType,
        },
        kind: 'Storage',
        enableHttpsTrafficOnly: true
      };
      client.storageAccounts.create(groupName, accountNameCool, createParametersCool, function (err, result, request, response) {
        should.not.exist(err);
        should.exist(result);
        var accounts = result;
        accounts.enableHttpsTrafficOnly.should.equal(true);
        response.statusCode.should.equal(200);
        done();
      });
    }); 
    
    it('should check the name availability for a storage account that already exists', function (done) {
      accountNameCheck = {
        name: accountName
      };
      client.storageAccounts.checkNameAvailability(accountNameCheck, function (err, result, request, response) {
        should.not.exist(err);
        should.exist(result);
        result.nameAvailable.should.equal(false);
        result.reason.should.match(/.*AlreadyExists.*/ig);
        result.message.should.match(/.*is already taken.*/ig);
        response.statusCode.should.equal(200);
        done();
      });
    });
    
    it('should check the name availability for a storage account that does not exist', function (done) {
      accountNameCheck = {
        name: accountName + '1012'
      };
      client.storageAccounts.checkNameAvailability(accountNameCheck, function (err, result, request, response) {
        should.not.exist(err);
        should.exist(result);
        result.nameAvailable.should.equal(true);
        response.statusCode.should.equal(200);
        done();
      });
    });

    it('should get properties of the specified storage account', function (done) {
      client.storageAccounts.getProperties(groupName, accountName, function (err, result, request, response) {
        should.not.exist(err);
        should.exist(result);
        response.statusCode.should.equal(200);
        var account = result;
        account.name.should.equal(accountName);
        account.location.should.equal("westus");
        account.type.should.equal('Microsoft.Storage/storageAccounts');
        done();
      });
    });
    
    it('should list all the storage accounts in the subscription', function (done) {
      client.storageAccounts.list(function (err, result, request, response) {
        should.not.exist(err);
        should.exist(result);
        response.statusCode.should.equal(200);
        var accounts = result;
        accounts.length.should.be.above(0);
        accounts.some(function (ac) { return ac.name === accountName }).should.be.true;
        done();
      });
    });
    
    it('should list all the storage accounts in the resourcegroup', function (done) {
      client.storageAccounts.listByResourceGroup(groupName, function (err, result, request, response) {
        should.not.exist(err);
        should.exist(result);
        response.statusCode.should.equal(200);
        var accounts = result;
        accounts.length.should.be.above(0);
        accounts.some(function (ac) { return ac.name === accountName }).should.be.true;
        done();
      });
    });
    
    it('should list all the storage account keys', function (done) {
      client.storageAccounts.listKeys(groupName, accountName, function (err, result, request, response) {
        should.not.exist(err);
        should.exist(result);
        response.statusCode.should.equal(200);
        should.exist(result.keys[0]);
        should.exist(result.keys[1]);
        done();
      });
    });
    
    it('should regenerate storage account keys', function (done) {
      client.storageAccounts.listKeys(groupName, accountName, function (err, result, request, response) {
        should.not.exist(err);
        should.exist(result);
        response.statusCode.should.equal(200);
        var keys = result.keys;
        client.storageAccounts.regenerateKey(groupName, accountName, {keyName: 'key1'}, function (err, result, request, response) {
          should.not.exist(err);
          should.exist(result);
          response.statusCode.should.equal(200);
          keys[1].value.should.equal(result.keys[1].value);
          keys[0].value.should.not.equal(result.keys[0].value);
          done();
        });
      });
    });
    
    it('should list the storage account SAS', function (done) {
      var parameter = {
        services : 'bftq',
        resourceTypes : 'sco',
        permissions : 'rdwlacup',
        protocols : 'https,http',
        sharedAccessStartTime : new Date().toISOString(),
        sharedAccessExpiryTime :  new Date((new Date).setHours((new Date).getHours()+1)).toISOString(),
        keyToSign : "key1"
      };

      client.storageAccounts.listAccountSAS(groupName, accountName, parameter, function (err, result, request, response) {
        should.not.exist(err);
        should.exist(result);
        response.statusCode.should.equal(200);
        should.exist(result.accountSasToken);
        done();
      });
    });

    it('should list the storage service SAS', function (done) {
      var parameter = {
        canonicalizedResource : '/blob/'.concat(accountName).concat('/music'),
        resource : 'c',
        permissions : 'rdwlacup',
        protocols : 'https,http',
        sharedAccessStartTime : new Date().toISOString(),
        sharedAccessExpiryTime :  new Date((new Date).setHours((new Date).getHours()+1)).toISOString(),
        keyToSign : "key1"
      };

      client.storageAccounts.listServiceSAS(groupName, accountName, parameter, function (err, result, request, response) {
        should.not.exist(err);
        should.exist(result);
        response.statusCode.should.equal(200);
        should.exist(result.serviceSasToken);
        done();
      });
    });

    it('should delete the specified storage account', function (done) {
      client.storageAccounts.deleteMethod(groupName, accountName, function (err, result, request, response) {
        should.not.exist(err);
        response.statusCode.should.equal(200);
        done();
      });
    });
  });
});