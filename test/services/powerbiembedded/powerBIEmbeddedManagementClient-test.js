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
var PowerBIEmbeddedManagementClient = require('../../../lib/services/powerbiembedded/lib/powerBIEmbeddedManagementClient');
var testPrefix = 'powerbiembeddedmanagementclient-tests';
var groupPrefix = 'azureSdkNodeTestResourceGroup';
var workspaceCollectionPrefix = 'azureNodeSdkTestWorkspaceCollection';
var workspacePrefix = 'azureNodeSdkTestWorkspace';
var createdGroups = [];
var createdWorkspaceCollections = [];
var createdWorkspaces = [];

var requiredEnvironment = [
  { name: 'AZURE_TEST_LOCATION', defaultValue: 'southcentralus' }
];

var suite;
var client;
var accountName;
var resourceGroupName;
var workspaceCollectionName
var accountLocation;
// TODO: Is there a way to get latest version at runtime instead of hardcoding?
var apiVersion = "2016-01-29";

describe('PowerBI Embedded Management Client', function () {
  
  before(function (done) {
    suite = new SuiteBase(this, testPrefix, requiredEnvironment);
    suite.setupSuite(function () {
      resourceGroupName = suite.generateId(groupPrefix, createdGroups, suite.isMocked);
      // resourceGroupName = 'powerbiclitest';
      
      client = new PowerBIEmbeddedManagementClient(suite.credentials, suite.subscriptionId);
      accountLocation = process.env['AZURE_TEST_LOCATION'];

      if (suite.isPlayback) {
        client.longRunningOperationRetryTimeout = 0;
      }
      
      workspaceCollectionName = suite.generateId(workspaceCollectionPrefix, createdWorkspaceCollections, suite.isMocked);
      console.log('subscriptionId: ' + suite.subscriptionId);
      console.log('accountLocation: ' + accountLocation);
      console.log('resourceGroupName: ' + resourceGroupName);
      console.log('workspaceCollectionName: ' + workspaceCollectionName);
      
      suite.createResourcegroup(resourceGroupName, accountLocation, function (error, result) {
        should.not.exist(error);
        done();
      });
      // done();
    });
  });
  
  after(function (done) {
    suite.teardownSuite(function () {
      suite.deleteResourcegroup(resourceGroupName, function (error, result) {
        should.not.exist(error);
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
    
  describe('workspace collections', function () {
    var workspaceCollection;
    var skuName = 'S1';
    var skuTier = "Standard";
    
    it('create workspace collection', function (done) {
      var createParameters = {
        location: accountLocation,
        sku: {
          name: skuName,
          tier: skuTier
        },
        tags: {
          tag1: 'val1',
          tag2: 'val2'
        }
      };
      
      client.workspaceCollections.create(resourceGroupName, workspaceCollectionName, createParameters, function (error, result, request, response) {
        // Request is successful
        should.not.exist(error);
        should.exist(result);
        response.statusCode.should.equal(200);
        
        // New workspace has intended name
        workspaceCollection = result;
        workspaceCollection.name.should.equal(workspaceCollectionName);
        
        done();
      });
    });

    it('list workspace collections within subscription', function (done) {
      client.workspaceCollections.listBySubscription(function (error, result, request, response) {
        // Request is successful
        should.not.exist(error);
        should.exist(result);
        response.statusCode.should.equal(200);
        
        // Result contains workspaceCollection we created above
        var workspaceCollections = result;
        var containsWorkspace = workspaceCollections.some(function (workspace) {
          return (workspace.name === workspaceCollectionName);
        });
        should(containsWorkspace).be.exactly(true);
        
        done();
      });
    });

    it('list worksapce collections within subscription and resource group', function (done) {
      client.workspaceCollections.listByResourceGroup(resourceGroupName, function (error, result, request, response) {
        // Request is successful
        should.not.exist(error);
        should.exist(result);
        response.statusCode.should.equal(200);
        
        // Result contains workspaceCollection we created above
        var workspaceCollections = result;
        var containsWorkspace = workspaceCollections.some(function (workspace) {
          return (workspace.name === workspaceCollectionName);
        });
        should(containsWorkspace).be.exactly(true);
        
        done();
      });
    });
  
    it('get workspace collection by resource group and name', function (done) {
      client.workspaceCollections.getByName(resourceGroupName, workspaceCollectionName, function (error, result, request, response) {
        // Request is successful
        should.not.exist(error);
        should.exist(result);
        response.statusCode.should.equal(200);
        
        // Result contains workspaceCollection we created above
        var workspaceCollection = result;
        workspaceCollection.name.should.equal(workspaceCollectionName);
        
        done();
      });
    });
    
    var accessKeys;
    it('get access keys for workspace collection', function (done) {
      client.workspaceCollections.getAccessKeys(resourceGroupName, workspaceCollectionName, function (error, result, request, response) {
        // Request is successful
        should.not.exist(error);
        should.exist(result);
        response.statusCode.should.equal(200);
        
        // Verify Response
        accessKeys = result;
        should.exist(accessKeys.key1);
        should.exist(accessKeys.key2);

        done();
      });
    });

    // Note: This test has dependency on the previous test running before it in order to get the access keys, we could duplicate the get access keys request in here but it adds nested callbacks.
    it('regenerate access keys for the workspace collection', function (done) {
      var accessKey = {
        keyName: "key1"
      };
      
      client.workspaceCollections.regenerateKey(resourceGroupName, workspaceCollectionName, accessKey, function (error, result, request, response) {
        // Request is successful
        should.not.exist(error);
        should.exist(result);
        response.statusCode.should.equal(200);
        
        // Key1 should not match previous key because we regenerated it
        var regeneratedAccessKeys = result;
        regeneratedAccessKeys.key1.should.not.equal(accessKeys.key1);
        
        // Key2 should match because it should remain unmodified
        regeneratedAccessKeys.key2.should.equal(accessKeys.key2);
        
        done();
      });
    });
    
    it('get workspaces within a workspace collection', function (done) {
      client.workspaces.list(resourceGroupName, workspaceCollectionName, function (error, result, request, response) {
        // Request is successful
        should.not.exist(error);
        should.exist(result);
        response.statusCode.should.equal(200);

        // Verify there are no workspaces since this is new workspace collection
        var workspaces = result;
        should(Array.isArray(workspaces)).be.exactly(true);
        should(workspaces.length).be.exactly(0);
        
        done();
      });
    });
    
    /**
     * Skipped because of bug with location.  If you leave location out, it says it's required property, but if you include location, it says it can't be set because it's readonly. 
     */
    it('update workspace collection', null, function (done) {
      var updateBody = {
        sku: {
          name: skuName,
          tier: skuTier
        },
        tags: {
          newTag: 'newValue',
          removeTag: ''
        }
      };
    
      client.workspaceCollections.update(resourceGroupName, workspaceCollectionName, updateBody, function (error, result, request , response) {
        // Request is successful
        should.not.exist(error);
        should.exist(result);
        response.statusCode.should.equal(200);
        
        var worksapceCollection = result;
        worksapceCollection.tags.newTag.should.equal(updateBody.tags.newTag);
        
        done();
      });
    });
    
    /**
     * Skipped because there is an error with long-polling operation returning the incorrect location header to cluster url instead of relative url to ARM
     */
    it('delete workspace collection', null, function (done) {
      client.workspaceCollections.deleteMethod(resourceGroupName, workspaceCollectionName, function (error, result, request, response) {
        // Request is successful
        should.not.exist(error);
        should.exist(result);
        response.statusCode.should.equal(204);
        
        done();
      });
    });
  });
});