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
var testPrefix = 'cdnOrigin-tests';
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
var originName;
var standardCreateParameters;
var validEndpointProperties;
var validOriginParameteres;
var invalidOriginParameters;
var defaultLocation;

describe('Cdn Management Origin', function() {

  before(function(done) {
    suite = new SuiteBase(this, testPrefix, requiredEnvironment);
    suite.setupSuite(function() {
      groupName = suite.generateId(groupPrefix, createdGroups, suite.isMocked);
      client = new StorageManagementClient(suite.credentials, suite.subscriptionId);
      defaultLocation = process.env['AZURE_TEST_LOCATION'];
      profileName = suite.generateId(profilePrefix, createdProfiles, suite.isMocked);
      originName = 'newname';
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
          name: originName,
          hostName: originName + '.azureedge.net'
        }]
      }
      validOriginParameteres = {
        hostName: "valid.helloworld.com",
        httpPort: 9874,
        httpsPort: 9090
      }
      invalidOriginParameters = {
        hostName: "valid.helloworld.com",
        httpPort: 9874,
        httpsPort: -9090
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

  describe('cdn origins', function() {
    it('should return a list of one origin when list by endpoint', function(done) {
      client.profiles.create(groupName, profileName, standardCreateParameters, function(err, result, request, response) {
        should.not.exist(err);
        client.endpoints.create(groupName, profileName, endpointName, validEndpointProperties, function(err, result, request, response) {
          should.not.exist(err);
          client.origins.listByEndpoint(groupName, profileName, endpointName, function(err, result, request, response) {
            should.not.exist(err);
            var origins = result;
            origins.length.should.equal(1);
            origins[0].name.should.equal(originName);
            origins[0].hostName.should.equal(originName + '.azureedge.net');
            done();
          });
        });
      });
    });

    it('should return one origin when get by that origin', function(done) {
      client.origins.get(groupName, profileName, endpointName, originName, function(err, result, request, response) {
        should.not.exist(err);
        var origin = result;
        origin.name.should.equal(originName);
        origin.hostName.should.equal(originName + '.azureedge.net');
        done();
      });
    });

    it('should fail when get by that an invalid origin name', function(done) {
      client.origins.get(groupName, profileName, endpointName, 'fakeOriginName', function(err, result, request, response) {
        should.exist(err);
        should.not.exist(result);
        done();
      });
    });

    it('should fail updating origin with invalid origin parameters', function(done) {
      client.origins.update(groupName, profileName, endpointName, originName, invalidOriginParameters, function(err, result, request, response) {
        should.exist(err);
        done();
      });
    });

    it('should successfully updating origin with valid origin parameters', function(done) {
      client.origins.update(groupName, profileName, endpointName, originName, validOriginParameteres, function(err, result, request, response) {
        should.not.exist(err);
        client.origins.get(groupName, profileName, endpointName, originName, function(err, result, request, response) {
          should.not.exist(err);
          var origin = result;
          origin.name.should.equal(originName);
          origin.hostName.should.equal(validOriginParameteres.hostName);
          origin.httpPort.should.equal(validOriginParameteres.httpPort);
          origin.httpsPort.should.equal(validOriginParameteres.httpsPort);
          done();
        });
      });
    });

    it('should successfully updating origin when endpoint is stopped', function(done) {
      client.endpoints.stop(groupName, profileName, endpointName, function(err, result, request, response) {
        should.not.exist(err);
        client.origins.update(groupName, profileName, endpointName, originName, validOriginParameteres, function(err, result, request, response) {
          should.not.exist(err);
          done();
        });
      });
    });

    it('should successfully updating origin when endpoint is running', function(done) {
      client.endpoints.start(groupName, profileName, endpointName, function(err, result, request, response) {
        should.not.exist(err);
        client.origins.update(groupName, profileName, endpointName, originName, validOriginParameteres, function(err, result, request, response) {
          should.not.exist(err);
          done();
        });
      });
    });
  });
});