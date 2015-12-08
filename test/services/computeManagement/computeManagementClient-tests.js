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
var FileTokenCache = require('../../../lib/util/fileTokenCache');
var ComputeManagementClient = require('../../../lib/services/computeManagement2/lib/computeManagementClient');
var testPrefix = 'computemanagementservice-tests';
var groupPrefix = 'nodeTestGroup';
var accountPrefix = 'testacc';
var createdGroups = [];
var createdAccounts = [];

var requiredEnvironment = [
  { name: 'AZURE_TEST_LOCATION', defaultValue: 'West US' }
];

var suite;
var client;
var groupName;
var location;

describe('Compute Management', function () {
  
  before(function (done) {
    suite = new SuiteBase(this, testPrefix, requiredEnvironment);
    suite.setupSuite(function () {
      groupName = suite.generateId(groupPrefix, createdGroups, suite.isMocked);
      client = new ComputeManagementClient(suite.credentials, suite.subscriptionId);
      accountName = suite.generateId(accountPrefix, createdAccounts, suite.isMocked);
      location = process.env['AZURE_TEST_LOCATION'];
      if (suite.isPlayback) {
        client.longRunningOperationRetryTimeoutInSeconds = 0;
      }
      suite.createResourcegroup(groupName, location, function (err, result) {
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
  
  describe('Vm Extension Images', function () {
    it('should list versions successfully', function (done) {
      client.virtualMachineExtensionImages.listVersions('westus', 'Microsoft.Compute', 'VMAccessAgent', function (err, result, request, response) {
        should.not.exist(err);
        should.exist(result);
        result.length.should.be.above(0);
        result[0].location.should.equal('westus');
        result[0].id.should.match(/\/Subscriptions\/.*\/Providers\/Microsoft.Compute\/Locations\/westus\/Publishers\/Microsoft.Compute\/ArtifactTypes\/VMExtension\/Types\/VMAccessAgent\/Versions\/.*/ig);
        result[0].name.should.equal('2.0')
        response.statusCode.should.equal(200);
        done();
      });
    });

    it('should list types successfully', function (done) {
      var type = 'VMAccessAgent';
      client.virtualMachineExtensionImages.listTypes('westus', 'Microsoft.Compute', function (err, result, request, response) {
        should.not.exist(err);
        should.exist(result);
        result.length.should.be.above(0);
        result.some(function (item) { return item.name === type; }).should.be.true;
        response.statusCode.should.equal(200);
        done();
      });
    });

    it('should get a specific extension image successfully', function (done) {
      client.virtualMachineExtensionImages.get('westus', 'Microsoft.Compute', 'VMAccessAgent', '2.0', function (err, result, request, response) {
        should.not.exist(err);
        should.exist(result);
        result.name.should.equal('2.0')
        result.location.should.equal('westus');
        result.computeRole.should.equal('IaaS');
        result.supportsMultipleExtensions.should.be.false;
        result.vmScaleSetEnabled.should.be.false;
        result.operatingSystem.should.equal('Windows');
        response.statusCode.should.equal(200);
        done();
      });
    });
  });
});