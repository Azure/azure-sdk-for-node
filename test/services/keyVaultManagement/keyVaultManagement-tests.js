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
var KeyVaultManagementClient = require('../../../lib/services/keyVaultManagement/lib/keyVaultManagementClient');
var testPrefix = 'keyvaultmanagement-tests';
var groupPrefix = 'nodeTestGroup';
var vaultPrefix = 'testacc';
var createdGroups = [];
var createdVaults = [];

var requiredEnvironment = [
  { name: 'AZURE_TEST_LOCATION', defaultValue: 'westus' }
];

var suite;
var client;
var groupName;
var acclocation;

describe('Key Vault Management', function () {  
  before(function (done) {
    suite = new SuiteBase(this, testPrefix, requiredEnvironment);
    suite.setupSuite(function () {
      groupName = suite.generateId(groupPrefix, createdGroups, suite.isMocked);
      client = new KeyVaultManagementClient(suite.credentials, suite.subscriptionId);
      acclocation = process.env['AZURE_TEST_LOCATION'];
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
  
  describe('Key Vaults', function () {
    it('should create a key vault with vnet rule set correctly', function (done) {
      var vaultName = suite.generateId(vaultPrefix, createdVaults, suite.isMocked);
      var networkAcls = {
        bypass: 'AzureServices', // Allows bypass of network ACLs from Azure services. Valid: 'AzureServices' or 'None'
        defaultAction: 'Deny', // Action to take if access attempt does not match any rule. 'Allow' or 'Deny'
    
        // IP rules (allowed IPv4 addresses/ranges)
        ipRules: [ 
            { 'value': '23.43.43.43' },
            { 'value': '23.43.44.44' }
        ],
      };
      
      const kvParams = 
      {
        location: acclocation,
        properties: {
            tenantId: suite.domain,
            sku: {
                name: 'standard'
            },
            accessPolicies: [],
            networkAcls: networkAcls, // pass the network ACLs
            enabledForDeployment: false,
        }
      };
      
      client.vaults.createOrUpdate(groupName, vaultName, kvParams, function (err, result, request, response) {
        should.not.exist(err);
        should.exist(result);
        response.statusCode.should.equal(200);
        should.exist(result.properties.networkAcls);
        should.exist(result.properties.networkAcls.bypass);
        should.exist(result.properties.networkAcls.ipRules);
        result.properties.networkAcls.ipRules[0].value.should.equal('23.43.43.43/32');
        result.properties.networkAcls.ipRules[1].value.should.equal('23.43.44.44/32');
        done();
      });
        
    });
  });
});