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
var fs = require('fs');
var msRest = require('ms-rest');
var msRestAzure = require('ms-rest-azure');
var SuiteBase = require('../../framework/suite-base');
var FileTokenCache = require('../../../lib/util/fileTokenCache');
var BatchManagementClient = require('../../../lib/services/batchManagement/lib/batchManagementClient');
var WebResource = msRest.WebResource;
var Pipeline = msRest.requestPipeline;
var ServiceClient = msRest.ServiceClient;
var testPrefix = 'batchmanagementservice-tests';
var groupPrefix = 'nodeTestGroup';
var accountPrefix = 'testacc';
var createdGroups = [];
var createdAccounts = [];

var requiredEnvironment = [
  { name: 'AZURE_TEST_LOCATION', defaultValue: 'japaneast' },
  { name: 'AZURE_AUTOSTORAGE', defaultValue: 'nodesdkteststorage' }
];

var suite;
var client;
var groupName;
var location;
var autoStorage;

describe('Batch Management', function () {
  
  before(function (done) {
    suite = new SuiteBase(this, testPrefix, requiredEnvironment);
    suite.setupSuite(function () {
      client = new BatchManagementClient(suite.credentials, suite.subscriptionId);
      if (suite.isPlayback) {
        client.longRunningOperationRetryTimeout = 0;
      }
      location = process.env.AZURE_TEST_LOCATION;
      autoStorage = process.env.AZURE_AUTOSTORAGE;
      groupName = util.format('default-azurebatch-%s', location);
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
  
  describe('operations', function () {
    
    it('should get subscription quota successfully', function (done) {
      client.subscription.getSubscriptionQuotas(location, function (err, result, request, response) {
        should.not.exist(err);
        should.exist(result);
        result.accountQuota.should.equal(1);
        done();
      });
    });
    
    it('should create a batch account successfully', function (done) {
      var resource = util.format('/subscriptions/%s/resourceGroups/%s/providers/Microsoft.Storage/storageAccounts/%s',
            suite.subscriptionId, groupName, autoStorage);
      var params = { location: location, autoStorage: { storageAccountId: resource } };
      client.account.create(groupName, 'batchtestnodesdk', params, function (err, result, request, response) {
        should.not.exist(err);
        should.exist(result);
        result.location.should.equal(location);
        result.poolQuota.should.equal(20);
        response.statusCode.should.equal(200);
        done();
      });
    });
    
    it('should add application successfully', function (done) {
      var params = { allowUpdates: true, displayName: 'my_application_name' };
      var options = { parameters : params };
      client.applicationOperations.addApplication(groupName, 'batchtestnodesdk', 'my_application_id', options, function (err, result, request, response) {
        should.not.exist(err);
        should.exist(result);
        result.id.should.equal('my_application_id');
        response.statusCode.should.equal(201);
        done();
      });
    });
    
    it('should get application successfully', function (done) {
      client.applicationOperations.getApplication(groupName, 'batchtestnodesdk', 'my_application_id', function (err, result, request, response) {
        should.not.exist(err);
        should.exist(result);
        result.id.should.equal('my_application_id')
        result.displayName.should.equal('my_application_name');
        done();
      });
    });
    
    it('should get a list of applications successfully', function (done) {
      client.applicationOperations.list(groupName, 'batchtestnodesdk', function (err, result, request, response) {
        should.not.exist(err);
        should.exist(result);
        result.length.should.be.above(0);
        done();
      });
    });
    
    it('should add application package successfully', function (done) {
      client.applicationOperations.addApplicationPackage(groupName, 'batchtestnodesdk', 'my_application_id', 'v1.0', function (err, result, request, response) {
        should.not.exist(err);
        should.exist(result);
        response.statusCode.should.equal(201);
        result.id.should.equal('my_application_id')
        result.version.should.equal('v1.0');
        fs.writeFileSync(__dirname + '/../../data/test_package.zip', 'Hey there!');
        var fileContent = fs.createReadStream(__dirname + '/../../data/test_package.zip');
        var httpRequest = new WebResource();
        var client = new ServiceClient();
        httpRequest.method = 'PUT';
        httpRequest.headers = {};
        httpRequest.headers['x-ms-blob-type'] = 'BlockBlob';
        httpRequest.headers['Content-Length'] = '10';
        httpRequest.url = result.storageUrl;
        httpRequest.body = fileContent;
        httpRequest.streamedResponse = true;
        var upload = client.pipeline(httpRequest, function (err, response) {
          should.not.exist(err);
          should.exist(response);
          response.statusCode.should.equal(201);
          done();
        });
      });
    });
    
    it('should add second application package successfully', function (done) {
      client.applicationOperations.addApplicationPackage(groupName, 'batchtestnodesdk', 'my_application_id', 'v2.0', function (err, result, request, response) {
        should.not.exist(err);
        should.exist(result);
        done();
      });
    });
    
    it('should activate application package successfully', function (done) {
      client.applicationOperations.activateApplicationPackage(groupName, 'batchtestnodesdk', 'my_application_id', 'v1.0', 'zip', function (err, result, request, response) {
        should.not.exist(err);
        response.statusCode.should.equal(204);
        done();
      });
    });
    
    it('should fail to activate application package', function (done) {
      client.applicationOperations.activateApplicationPackage(groupName, 'batchtestnodesdk', 'my_application_id', 'v2.0', 'zip', function (err, result, request, response) {
        should.exist(err);
        should.not.exist(result);
        err.code.should.equal('ApplicationPackageBlobNotFound');
        done();
      });
    });
    
    it('should fail to update application', function (done) {
      var params = { allowUpdates: false, displayName: 'my_updated_name', defaultVersion: 'v2.0' };
      client.applicationOperations.updateApplication(groupName, 'batchtestnodesdk', 'my_application_id', params, function (err, result, request, response) {
        should.exist(err);
        should.not.exist(result);
        err.code.should.equal('RequestedDefaultVersionNotActive');
        done();
      });
    });
    
    it('should update application successfully', function (done) {
      var params = { allowUpdates: false, displayName: 'my_updated_name', defaultVersion: 'v1.0' };
      client.applicationOperations.updateApplication(groupName, 'batchtestnodesdk', 'my_application_id', params, function (err, result, request, response) {
        should.not.exist(err);
        response.statusCode.should.equal(204);
        done();
      });
    });
    
    it('should get application package successfully', function (done) {
      client.applicationOperations.getApplicationPackage(groupName, 'batchtestnodesdk', 'my_application_id', 'v1.0', function (err, result, request, response) {
        should.not.exist(err);
        should.exist(result);
        response.statusCode.should.equal(200);
        done();
      });
    });
    
    it('should delete application package successfully', function (done) {
      client.applicationOperations.deleteApplicationPackage(groupName, 'batchtestnodesdk', 'my_application_id', 'v1.0', function (err, result, request, response) {
        should.not.exist(err);
        response.statusCode.should.equal(204);
        done();
      });
    });
    
    it('should fail to delete application', function (done) {
      client.applicationOperations.deleteApplication(groupName, 'batchtestnodesdk', 'my_application_id', function (err, result, request, response) {
        should.exist(err);
        err.code.should.equal('ApplicationPackagesNotEmpty');
        err.response.statusCode.should.equal(409);
        done();
      });
    });
    
    it('should delete second application package successfully', function (done) {
      client.applicationOperations.deleteApplicationPackage(groupName, 'batchtestnodesdk', 'my_application_id', 'v2.0', function (err, result, request, response) {
        should.not.exist(err);
        response.statusCode.should.equal(204);
        done();
      });
    });
    
    it('should delete application successfully', function (done) {
      client.applicationOperations.deleteApplication(groupName, 'batchtestnodesdk', 'my_application_id', function (err, result, request, response) {
        should.not.exist(err);
        response.statusCode.should.equal(204);
        done();
      });
    });
    
    it('should fail to create a batch account due to dupilcate location', function (done) {
      var params = { location: 'japaneast' };
      client.account.create(groupName, 'batchtestnodesdk2', params, function (err, result, request, response) {
        should.exist(err);
        should.not.exist(result);
        //This fails after the initial create request - so error isn't surfaced.
        done();
      });
    });
    
    it('should fail to create a batch account due to invalid resource group', function (done) {
      var params = { location: 'japaneast' };
      client.account.create('does-not-exist', 'batchtestnodesdk', params, function (err, result, request, response) {
        should.exist(err);
        err.code.should.equal('ResourceGroupNotFound');
        err.response.statusCode.should.equal(404);
        should.not.exist(result);
        //This fails on the initial create request - so we can check the error.
        done();
      });
    });
    
    it('should get a specific account info successfully', function (done) {
      client.account.get(groupName, 'batchtestnodesdk', function (err, result, request, response) {
        should.not.exist(err);
        should.exist(result);
        result.name.should.equal('batchtestnodesdk');
        result.location.should.equal(location);
        response.statusCode.should.equal(200);
        done();
      });
    });
    
    it('should list accounts successfully', function (done) {
      client.account.list(function (err, result, request, response) {
        should.not.exist(err);
        should.exist(result);
        result.length.should.be.above(0);
        var sorted = result.sort(function (a, b) {
          if (a.name < b.name) {
            return -1;
          }
          return 1;
        });
        sorted[0].name.should.equal('batchtestnodesdk');
        sorted[0].location.should.equal(location);
        done();
      });
    });
    
    it('should list accounts by resource group successfully', function (done) {
      client.account.listByResourceGroup(groupName, function (err, result, request, response) {
        should.not.exist(err);
        should.exist(result);
        result.length.should.be.above(0);
        result[0].name.should.equal('batchtestnodesdk');
        result[0].location.should.equal(location);
        done();
      });
    });
    
    it('should get account keys successfully', function (done) {
      client.account.listKeys(groupName, 'batchtestnodesdk', function (err, result, request, response) {
        should.not.exist(err);
        should.exist(result);
        should.exist(result.primary);
        should.exist(result.secondary);
        done();
      });
    });
    
    it('should regenerate keys successfully', function (done) {
      client.account.regenerateKey(groupName, 'batchtestnodesdk', 'Primary', function (err, result, request, response) {
        should.not.exist(err);
        should.exist(result);
        should.exist(result.primary);
        should.exist(result.secondary);
        done();
      });
    });
    
    it('should sync auto storage keys successfully', function (done) {
      client.account.synchronizeAutoStorageKeys(groupName, 'batchtestnodesdk', function (err, result, request, response) {
        should.not.exist(err);
        response.statusCode.should.equal(204);
        done();
      });
    });
    
    it('should update account successfully', function (done) {
      var tags = { tags: { Name: 'tagName', Value: 'tagValue' } };
      client.account.update(groupName, 'batchtestnodesdk', tags, function (err, result, request, response) {
        should.not.exist(err);
        should.exist(result);
        result.tags.name.should.equal('tagName');
        result.tags.value.should.equal('tagValue');
        done()
      });
    });
    
    it('should delete a batch account successfully', function (done) {
      client.account.deleteMethod(groupName, 'batchtestnodesdk', function (err, result, request, response) {
        //Pending change in behavior for raised error
        should.exist(err);
        done();
      });
    });
  });
});