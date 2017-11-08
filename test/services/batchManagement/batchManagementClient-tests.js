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
      batchAccount = 'batchtestnodesdk';
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
    
    it('should list Batch operations successfully', function (done) {
      client.operations.list(function (err, result, request, response) {
        should.not.exist(err);
        should.exist(result);
        result.length.should.equal(30);
        result[0].name.should.equal('Microsoft.Batch/batchAccounts/providers/Microsoft.Insights/diagnosticSettings/read');
        result[0].origin.should.equal('system');
        result[0].display.provider.should.equal('Microsoft Batch');
        result[0].display.operation.should.equal('Read diagnostic setting');
        done();
      });
    });
    
    it('should get subscription quota successfully', function (done) {
      client.location.getQuotas(location, function (err, result, request, response) {
        should.not.exist(err);
        should.exist(result);
        result.accountQuota.should.equal(1);
        done();
      });
    });

    it('should check name available successfully', function (done) {
      name = "randombatch8374652387"
      client.location.checkNameAvailability(location, name, function (err, result, request, response) {
        should.not.exist(err);
        should.exist(result);
        result.nameAvailable.should.equal(true);
        done();
      });
    });

    it('should create a batch account successfully', function (done) {
      var resource = util.format('/subscriptions/%s/resourceGroups/%s/providers/Microsoft.Storage/storageAccounts/%s',
            suite.subscriptionId, groupName, autoStorage);
      var params = { location: location, autoStorage: { storageAccountId: resource } };
      client.batchAccountOperations.create(groupName, batchAccount, params, function (err, result, request, response) {
        should.not.exist(err);
        should.exist(result);
        result.location.should.equal(location);
        result.poolQuota.should.equal(20);
        result.dedicatedCoreQuota.should.equal(20);
        result.lowPriorityCoreQuota.should.equal(20);
        response.statusCode.should.equal(200);
        done();
      });
    });
    
    it('should add application successfully', function (done) {
      var params = { allowUpdates: true, displayName: 'my_application_name' };
      var options = { parameters : params };
      client.applicationOperations.create(groupName, batchAccount, 'my_application_id', options, function (err, result, request, response) {
        should.not.exist(err);
        should.exist(result);
        result.id.should.equal('my_application_id');
        response.statusCode.should.equal(201);
        done();
      });
    });
    
    it('should get application successfully', function (done) {
      client.applicationOperations.get(groupName, batchAccount, 'my_application_id', function (err, result, request, response) {
        should.not.exist(err);
        should.exist(result);
        result.id.should.equal('my_application_id')
        result.displayName.should.equal('my_application_name');
        done();
      });
    });
    
    it('should get a list of applications successfully', function (done) {
      client.applicationOperations.list(groupName, batchAccount, function (err, result, request, response) {
        should.not.exist(err);
        should.exist(result);
        result.length.should.be.above(0);
        done();
      });
    });
    
    it('should add application package successfully', function (done) {
      client.applicationPackageOperations.create(groupName, batchAccount, 'my_application_id', 'v1.0', function (err, result, request, response) {
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
      client.applicationPackageOperations.create(groupName, batchAccount, 'my_application_id', 'v2.0', function (err, result, request, response) {
        should.not.exist(err);
        should.exist(result);
        done();
      });
    });
    
    it('should activate application package successfully', function (done) {
      client.applicationPackageOperations.activate(groupName, batchAccount, 'my_application_id', 'v1.0', 'zip', function (err, result, request, response) {
        should.not.exist(err);
        response.statusCode.should.equal(204);
        done();
      });
    });
    
    it('should fail to activate application package', function (done) {
      client.applicationPackageOperations.activate(groupName, batchAccount, 'my_application_id', 'v2.0', 'zip', function (err, result, request, response) {
        should.exist(err);
        should.not.exist(result);
        err.code.should.equal('ApplicationPackageBlobNotFound');
        done();
      });
    });
    
    it('should fail to update application', function (done) {
      var params = { allowUpdates: false, displayName: 'my_updated_name', defaultVersion: 'v2.0' };
      client.applicationOperations.update(groupName, batchAccount, 'my_application_id', params, function (err, result, request, response) {
        should.exist(err);
        should.not.exist(result);
        err.code.should.equal('RequestedDefaultVersionNotActive');
        done();
      });
    });
    
    it('should update application successfully', function (done) {
      var params = { allowUpdates: false, displayName: 'my_updated_name', defaultVersion: 'v1.0' };
      client.applicationOperations.update(groupName, batchAccount, 'my_application_id', params, function (err, result, request, response) {
        should.not.exist(err);
        response.statusCode.should.equal(204);
        done();
      });
    });
    
    it('should get application package successfully', function (done) {
      client.applicationPackageOperations.get(groupName, batchAccount, 'my_application_id', 'v1.0', function (err, result, request, response) {
        should.not.exist(err);
        should.exist(result);
        response.statusCode.should.equal(200);
        done();
      });
    });
    
    it('should delete application package successfully', function (done) {
      client.applicationPackageOperations.deleteMethod(groupName, batchAccount, 'my_application_id', 'v1.0', function (err, result, request, response) {
        should.not.exist(err);
        response.statusCode.should.equal(204);
        done();
      });
    });
    
    it('should fail to delete application', function (done) {
      client.applicationOperations.deleteMethod(groupName, batchAccount, 'my_application_id', function (err, result, request, response) {
        should.exist(err);
        err.code.should.equal('ApplicationPackagesNotEmpty');
        err.response.statusCode.should.equal(409);
        done();
      });
    });
    
    it('should delete second application package successfully', function (done) {
      client.applicationPackageOperations.deleteMethod(groupName, batchAccount, 'my_application_id', 'v2.0', function (err, result, request, response) {
        should.not.exist(err);
        response.statusCode.should.equal(204);
        done();
      });
    });
    
    it('should delete application successfully', function (done) {
      client.applicationOperations.deleteMethod(groupName, batchAccount, 'my_application_id', function (err, result, request, response) {
        should.not.exist(err);
        response.statusCode.should.equal(204);
        done();
      });
    });
    
    it('should fail to create a batch account due to dupilcate location', function (done) {
      var params = { location: 'japaneast' };
      client.batchAccountOperations.create(groupName, 'batchtestnodesdk2', params, function (err, result, request, response) {
        should.exist(err);
        should.not.exist(result);
        //This fails after the initial create request - so error isn't surfaced.
        done();
      });
    });
    
    it('should fail to create a batch account due to invalid resource group', function (done) {
      var params = { location: 'japaneast' };
      client.batchAccountOperations.create('does-not-exist', batchAccount, params, function (err, result, request, response) {
        should.exist(err);
        err.code.should.equal('ResourceGroupNotFound');
        err.response.statusCode.should.equal(404);
        should.not.exist(result);
        //This fails on the initial create request - so we can check the error.
        done();
      });
    });
    
    it('should get a specific account info successfully', function (done) {
      client.batchAccountOperations.get(groupName, batchAccount, function (err, result, request, response) {
        should.not.exist(err);
        should.exist(result);
        result.name.should.equal(batchAccount);
        result.location.should.equal(location);
        response.statusCode.should.equal(200);
        done();
      });
    });
    
    it('should list accounts successfully', function (done) {
      client.batchAccountOperations.list(function (err, result, request, response) {
        should.not.exist(err);
        should.exist(result);
        result.length.should.be.above(0);
        var sorted = result.sort(function (a, b) {
          if (a.name < b.name) {
            return -1;
          }
          return 1;
        });
        sorted[0].name.should.equal(batchAccount);
        sorted[0].location.should.equal(location);
        done();
      });
    });
    
    it('should list accounts by resource group successfully', function (done) {
      client.batchAccountOperations.listByResourceGroup(groupName, function (err, result, request, response) {
        should.not.exist(err);
        should.exist(result);
        result.length.should.be.above(0);
        result[0].name.should.equal(batchAccount);
        result[0].location.should.equal(location);
        done();
      });
    });
    
    it('should get account keys successfully', function (done) {
      client.batchAccountOperations.getKeys(groupName, batchAccount, function (err, result, request, response) {
        should.not.exist(err);
        should.exist(result);
        should.exist(result.accountName);
        should.exist(result.primary);
        should.exist(result.secondary);
        done();
      });
    });
    
    it('should regenerate keys successfully', function (done) {
      client.batchAccountOperations.regenerateKey(groupName, batchAccount, 'Primary', function (err, result, request, response) {
        should.not.exist(err);
        should.exist(result);
        should.exist(result.primary);
        should.exist(result.secondary);
        done();
      });
    });
    
    it('should sync auto storage keys successfully', function (done) {
      client.batchAccountOperations.synchronizeAutoStorageKeys(groupName, batchAccount, function (err, result, request, response) {
        should.not.exist(err);
        response.statusCode.should.equal(204);
        done();
      });
    });
    
    it('should update account successfully', function (done) {
      var tags = { tags: { Name: 'tagName', Value: 'tagValue' } };
      client.batchAccountOperations.update(groupName, batchAccount, tags, function (err, result, request, response) {
        should.not.exist(err);
        should.exist(result);
        result.tags.Name.should.equal('tagName');
        result.tags.Value.should.equal('tagValue');
        done()
      });
    });

    it('should add certificate successfully', function (done) {
      var certificate = 'SHA1-cff2ab63c8c955aaf71989efa641b906558d9fb7';
      var parameters = {
        thumbprint: 'cff2ab63c8c955aaf71989efa641b906558d9fb7',
        thumbprintAlgorithm: 'sha1',
        data: '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',
        format: 'pfx',
        password: 'nodesdk'
      };
      client.certificateOperations.create(groupName, batchAccount, certificate, parameters, function(err, result, request, response) {
        should.not.exist(err);
        should.exist(result);
        result.name.should.equal('SHA1-CFF2AB63C8C955AAF71989EFA641B906558D9FB7');
        done();
      });
    });

    it('should list certificates successfully', function (done) {
      client.certificateOperations.listByBatchAccount(groupName, batchAccount, function(err, result, request, response) {
        should.not.exist(err);
        should.exist(result);
        result.length.should.equal(1);
        done();
      });
    });

    it('should get certificate successfully', function (done) {
      var certificate = 'SHA1-cff2ab63c8c955aaf71989efa641b906558d9fb7';
      client.certificateOperations.get(groupName, batchAccount, certificate, function(err, result, request, response) {
        should.not.exist(err);
        should.exist(result);
        result.name.should.equal('SHA1-CFF2AB63C8C955AAF71989EFA641B906558D9FB7');
        result.thumbprintAlgorithm.should.equal('SHA1');
        result.thumbprint.should.equal('CFF2AB63C8C955AAF71989EFA641B906558D9FB7');
        done();
      });
    });

    it('should update certificate successfully', function (done){
      var certificate = 'SHA1-cff2ab63c8c955aaf71989efa641b906558d9fb7';
      var parameters = {
        password: 'nodesdk',
        data: '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'
      };
      client.certificateOperations.update(groupName, batchAccount, certificate, parameters, function(err, result, request, response) {
        should.not.exist(err);
        should.exist(result);
        result.name.should.equal('SHA1-CFF2AB63C8C955AAF71989EFA641B906558D9FB7');
        done();
      });
    });

    it('shoud delete certificate successfully', function (done) {
      var certificate = 'SHA1-cff2ab63c8c955aaf71989efa641b906558d9fb7';
      client.certificateOperations.deleteMethod(groupName, batchAccount, certificate, function(err, result, request, response) {
        should.not.exist(err);
        done();
      });
    });

    it('should create a paas pool successfully', function(done) {
      var paas_pool = "test_paas_pool";
      var parameters = {
        displayName: "test_pool",
        vmSize: "small",
        deploymentConfiguration: {
          cloudServiceConfiguration: {
            osFamily: "5"
          }
        },
        startTask: {
          commandLine: "cmd.exe /c \"echo hello world\"",
          resourceFiles: [{blobSource: "https://blobsource.com", filePath: "filename.txt"}],
          environmentSettings: [{name: "ENV_VAR", value: "foo"}],
          userIdentity: {
            autoUser: {
              elevationLevel: "admin"
            }
          }
        },
        userAccounts: [{name: "UserName", password: "p@55wOrd"}],
        scaleSettings: {
          fixedScale: {
            targetDedicatedNodes: 0,
            targetLowPriorityNodes: 0
          }
        }
      };
      client.poolOperations.create(groupName, batchAccount, paas_pool, parameters, function(err, result, request, response) {
        should.not.exist(err);
        should.exist(result);
        result.name.should.equal(paas_pool);
        done();
      });
    });

    it('should create a iaas pool successfully', function(done) {
      var iaas_pool = "test_iaas_pool";
      var parameters = {
        displayName: "test_pool",
        vmSize: "Standard_A1",
        deploymentConfiguration: {
          virtualMachineConfiguration: {
            imageReference: {
              publisher: 'MicrosoftWindowsServer',
              offer: 'WindowsServer',
              sku: '2016-Datacenter-smalldisk'
            },
            nodeAgentSkuId: 'batch.node.windows amd64',
            windowsConfiguration: {enableAutomaticUpdates: true}
          }
        },
        scaleSettings: {
          fixedScale: {
            targetDedicatedNodes: 0,
            targetLowPriorityNodes: 0
          }
        }
      };
      client.poolOperations.create(groupName, batchAccount, iaas_pool, parameters, function(err, result, request, response) {
        should.not.exist(err);
        should.exist(result);
        result.name.should.equal(iaas_pool);
        done();
      });
    });

    it('should list pools successfully', function(done) {
      client.poolOperations.listByBatchAccount(groupName, batchAccount, function(err, result, request, response) {
        should.not.exist(err);
        should.exist(result);
        result.length.should.equal(2);
        done();
      });
    });

    it('should update pool successfully', function(done) {
      var iaas_pool = "test_iaas_pool";
      parameters = {
        autoScale: {
          formula: "$TargetDedicatedNodes=1"
        }
      };
      client.poolOperations.update(groupName, batchAccount, iaas_pool, parameters, function(err, result, request, response) {
        should.not.exist(err);
        should.exist(result);
        result.name.should.equal(iaas_pool);
        done();
      });
    });

    it('should get pool successfully', function(done) {
      var iaas_pool = "test_iaas_pool";
      client.poolOperations.get(groupName, batchAccount, iaas_pool, function(err, result, request, response) {
        should.not.exist(err);
        should.exist(result);
        result.name.should.equal(iaas_pool);
        result.vmSize.should.equal('STANDARD_A1');
        done();
      });
    });

    it('should delete pool successfully', function(done) {
      var iaas_pool = "test_iaas_pool";
      client.poolOperations.deleteMethod(groupName, batchAccount, iaas_pool, function(err, result, request, response) {
        should.not.exist(err);
        done();
      });
    });

    it('should delete a batch account successfully', function (done) {
      client.batchAccountOperations.deleteMethod(groupName, batchAccount, function (err, result, request, response) {
        should.not.exist(err);
        done();
      });
    });

    it('should fail to create a BYOS account with bad KeyVault properties', function (done) {
      var byosAccountName = 'batchtestnodesdkbyos';
      var allocationMode = 'UserSubscription';

      // Omit keyVaultReference
      var params = { 
        location: location,
        poolAllocationMode: allocationMode
      };

      client.batchAccountOperations.create(groupName, byosAccountName, params, function (err, result, request, response) {
        should.exist(err);
        err.body.message.should.startWith('The specified Request Body is not syntactically valid.');

        // Use malformed key vault parameter values
        var params = { 
          location: location,
          poolAllocationMode: allocationMode,
          keyVaultReference: {
            id: 'abc',
            url: 'def'
          }
        };

        client.batchAccountOperations.create(groupName, byosAccountName, params, function (err, result, request, response) {
          should.exist(err);
          err.body.message.should.startWith('Property id \'abc\' at path \'properties.keyVaultReference.id\' is invalid. Expect fully qualified resource Id that start with \'/subscriptions/{subscriptionId}\' or \'/providers/{resourceProviderNamespace}/\'');
          done();
        });
      });
    });
  });
});