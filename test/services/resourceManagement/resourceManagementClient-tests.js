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
var SuiteBase = require('../../framework/suite-base');


var dump = util.inspect;
var ResourceManagementClient = require('../../../lib/services/resourceManagement/lib/resource/resourceManagementClient');
var testPrefix = 'resourceManagement-tests';
var requiredEnvironment = [
  { name: 'AZURE_TEST_LOCATION', defaultValue: 'West US' }
];

var suite;
var client;
var groupName;
var testLocation;
var groupParameters;

describe('Resource Management Client', function () {
  
  before(function (done) {
    suite = new SuiteBase(this, testPrefix, requiredEnvironment);
    suite.setupSuite(function () {
      client = new ResourceManagementClient(suite.credentials, suite.subscriptionId);
      testLocation = process.env['AZURE_TEST_LOCATION'];
      groupParameters = {
        location: testLocation,
        tags: {
          tag1: 'val1',
          tag2: 'val2'
        }
      };
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
  
  describe('Group Operations', function () {
    var groupName = 'testg102';
    it('should work to create, get, list and delete a resource group', function (done) {
      //create a resource group
      client.resourceGroups.createOrUpdate(groupName, groupParameters, function (err, result) {
        should.not.exist(err);
        should.exist(result);
        //get a specific resource group
        client.resourceGroups.get(groupName, function (err, result, request, response) {
          should.not.exist(err);
          should.exist(result);
          response.statusCode.should.equal(200);
          var group = result;
          group.name.should.equal(groupName);
          group.location.should.equal('westus');
          group.properties.provisioningState.should.equal('Succeeded');
          //list all the resource groups in the subscription
          client.resourceGroups.list(null, null, function (err, result, request, response) {
            should.not.exist(err);
            should.exist(result);
            response.statusCode.should.equal(200);
            var groups = result;
            groups.length.should.be.above(0);
            groups.some(function (gr) { return (gr.name === groupName); }).should.be.true;
            //delete a specific resource group
            client.resourceGroups.deleteMethod(groupName, function (err, result, request, response) {
              should.not.exist(err);
              response.statusCode.should.equal(200);
              done();
            });
          });
        });
      });
    });
  });
  
  describe('Generic Resource Operations', function () {
    var resourceGroupName = 'testg102';
    it('should work to create, get, list and delete resource', function (done) {
      var resourceName = 'autorestsite102';
      var params = { 'location': 'West US', 'properties' : { 'SiteMode': 'Limited', 'ComputeMode': 'Shared' }, 'Name': resourceName };
      var resourceType = 'sites';
      var parentResourcePath = '';
      var resourceProviderNamespace = 'Microsoft.Web';
      var apiVersion = '2014-04-01';
      //create a resource group
      client.resourceGroups.createOrUpdate(resourceGroupName, groupParameters, function (err, result) {
        should.not.exist(err);
        should.exist(result);
        //create a resource in the resource group
        client.resources.createOrUpdate(resourceGroupName, resourceProviderNamespace, parentResourcePath, resourceType, resourceName , apiVersion, params, function (err, result, request, response) {
          should.not.exist(err);
          response.statusCode.should.equal(200);
          result.name.should.equal(resourceName);
          //get the specified resource
          client.resources.get(resourceGroupName, resourceProviderNamespace, parentResourcePath, resourceType, resourceName, apiVersion, function (err, result, request, response) {
            should.not.exist(err);
            response.statusCode.should.equal(200);
            result.name.should.equal(resourceName);
            result.type.should.equal(resourceProviderNamespace + '/' + resourceType);
            result.location.should.equal(testLocation);
            //list all the resources
            client.resources.list(null, null, function (err, result, request, response) {
              should.not.exist(err);
              response.statusCode.should.equal(200);
              var resources = result;
              resources.length.should.be.above(0);
              resources.some(function (re) { return (re.name === resourceName); }).should.be.true;
              //delete the specified resource
              client.resources.deleteMethod(resourceGroupName, resourceProviderNamespace, parentResourcePath, resourceType, resourceName, apiVersion, function (err, result, request, response) {
                should.not.exist(err);
                response.statusCode.should.equal(200);
                should.not.exist(result);
                //delete the resource group
                client.resourceGroups.deleteMethod(resourceGroupName, function (err, result, request, response) {
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
  
  describe('Group Deployment Operations', function () {
    var resourceGroupName = 'testg303';
    it.skip('should work to create, get and list deployments', function (done) {
      var deploymentName = 'testdep1';
      var resourceName = 'autorestsite303';
      var hostingPlanName = 'autoresthostplan303';
      var sku = 'Free';
      var templateUri = 'https://gallery.azure.com/artifact/20140901/Microsoft.ASPNETStarterSite.0.2.2-preview/DeploymentTemplates/Website_NewHostingPlan-Default.json';
      var deploymentParameters = {
        properties: {
          mode: 'Incremental',
          templateLink: {
            uri: templateUri
          },
          parameters: {
            siteName: {
              value: resourceName
            },
            hostingPlanName: {
              value: hostingPlanName
            },
            siteLocation: {
              value: testLocation
            },
            sku: {
              value: sku
            },
            workerSize: {
              value: '0'
            }
          }
        }
      };
      var resourceType = 'sites';
      var parentResourcePath = '';
      var resourceProviderNamespace = 'Microsoft.Web';
      var apiVersion = '2014-04-01';
      //create a resource group
      client.resourceGroups.createOrUpdate(resourceGroupName, groupParameters, function (err, result) {
        should.not.exist(err);
        should.exist(result);
        //validate a deployment
        client.deployments.validate(resourceGroupName, deploymentName, deploymentParameters, function (err, result, request, response) {
          should.not.exist(err);
          response.statusCode.should.equal(200);
          //result.properties.name.should.equal(deploymentName);
          //create a deployment
          client.deployments.createOrUpdate(resourceGroupName, deploymentName, deploymentParameters, function (err, result, request, response) {
            should.not.exist(err);
            //response.statusCode.should.equal(200); 201
            result.name.should.equal(deploymentName);
            //get a deployment
            client.deployments.get(resourceGroupName, deploymentName, function (err, result, request, response) {
              should.not.exist(err);
              response.statusCode.should.equal(200);
              result.name.should.equal(deploymentName);
              result.properties.mode.should.equal('Incremental');
              //list a deployment
              client.deployments.list(resourceGroupName, null, null, function (err, result, request, response) {
                should.not.exist(err);
                response.statusCode.should.equal(200);
                var deployments = result;
                deployments.length.should.be.above(0);
                deployments.some(function (de) { return (de.name === deploymentName); }).should.be.true;
                //delete the resource group
                client.resourceGroups.deleteMethod(resourceGroupName, function (err, result, request, response) {
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

  describe('Resource Provider operations', function () {
    it('should work to list, register, get and unregister resource providers', function (done) {
      client.providers.list(null, function (err, result, request, response) {
        should.not.exist(err);
        response.statusCode.should.equal(200);
        var providers = result;
        providers.length.should.be.above(0);
        var unregisteredProviders = providers.filter(function (item) { return item.registrationState === 'NotRegistered'; });
        var providerNamespace = unregisteredProviders[0].namespace;
        client.providers.register(providerNamespace, function (err, result, request, response) {
          should.not.exist(err);
          response.statusCode.should.equal(200);
          result.namespace.should.equal(providerNamespace);
          result.registrationState.should.equal('Registering');
          result.resourceTypes.length.should.be.above(0);
          client.providers.get(providerNamespace, function (err, result, request, response) {
            should.not.exist(err);
            response.statusCode.should.equal(200);
            result.namespace.should.equal(providerNamespace);
            result.registrationState.should.match(/^Register(ing|ed)$/ig);
            result.resourceTypes.length.should.be.above(0);
            client.providers.unregister(providerNamespace, function (err, result, request, response) {
              should.not.exist(err);
              response.statusCode.should.equal(200);
              result.namespace.should.equal(providerNamespace);
              result.registrationState.should.equal('Unregistering');
              done();
            });
          });
        });
      });
    });
  });
});