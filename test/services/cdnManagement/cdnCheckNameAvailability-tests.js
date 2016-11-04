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
var StorageManagementClient = require('../../../lib/services/cdnManagement/lib/cdnManagementClient');
var testPrefix = 'cdnCheckNameAvailability-tests';
var groupPrefix = 'cdnTestGroup';
var profilePrefix = 'cdnTestProfile';
var endpointPrefix = 'cdnTestEndpoint';
var createdGroups = [];
var createdProfiles = [];
var createdEndpoints = [];

var requiredEnvironment = [{
  name: 'AZURE_TEST_LOCATION',
  defaultValue: 'West US'
}];

var suite;
var client;
var profileName;
var groupName;
var endpointName;
var standardCreateParameters;
var validEndpointProperties;
var defaultLocation;

describe('Cdn Management CheckNameAvailability', function() {

  before(function(done) {
    suite = new SuiteBase(this, testPrefix, requiredEnvironment);
    suite.setupSuite(function() {
      groupName = suite.generateId(groupPrefix, createdGroups, suite.isMocked);
      client = new StorageManagementClient(suite.credentials, suite.subscriptionId);
      defaultLocation = process.env['AZURE_TEST_LOCATION'];
      profileName = suite.generateId(profilePrefix, createdProfiles, suite.isMocked);
      endpointName = suite.generateId(endpointPrefix, createdEndpoints, suite.isMocked);
      standardCreateParameters = {
        location: 'West US',
        tags: {
          tag1: 'val1',
          tag2: 'val2'
        },
        sku: {
          name: 'Standard_Verizon'
        }
      };
      validEndpointProperties = {
        location: 'West US',
        tags: {
          tag1: 'val1'
        },
        origins: [{
          name: 'somename',
          hostName: 'newname.azure.com'
        }]
      }
      if (suite.isPlayback) {
        client.longRunningOperationRetryTimeout = 0;
      }
      suite.createResourcegroup(groupName, defaultLocation, function(err, result) {
        should.not.exist(err);
        done();
      });
    });
  });

  after(function(done) {
    suite.teardownSuite(function() {
      suite.deleteResourcegroup(groupName, function(err, result) {
        should.not.exist(err);
        done();
      });
    });
  });

  beforeEach(function(done) {
    suite.setupTest(done);
  });

  afterEach(function(done) {
    suite.baseTeardownTest(done);
  });

  describe('cdn check name availability', function() {
    it('should return true when check a unique created endpoint name', function(done) {
      client.checkNameAvailability(endpointName, 'Microsoft.Cdn/Profiles/Endpoints', function(err, result, request, response) {
        should.not.exist(err);
        should.exist(result);
        result.nameAvailable.should.equal(true);
        done();
      });
    });

    it('should return false once endpoint is already used', function(done) {
      client.profiles.create(groupName, profileName, standardCreateParameters, function(err, result, request, response) {
        should.not.exist(err);
        client.endpoints.create(groupName, profileName, endpointName, validEndpointProperties, function(err, result, request, response) {
          should.not.exist(err);
          client.checkNameAvailability(endpointName, 'Microsoft.Cdn/Profiles/Endpoints', function(err, result, request, response) {
            should.not.exist(err);
            should.exist(result);
            result.nameAvailable.should.equal(false);
            done();
          });
        });
      });
    })
  });
});