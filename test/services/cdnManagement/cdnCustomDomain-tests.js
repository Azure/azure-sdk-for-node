﻿//
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
var testPrefix = 'cdnCustomDomain-tests';
var groupPrefix = 'cdnTestGroup';
var profilePrefix = 'cdnTestProfile';
var customDomainPrefix = 'cdnTestCustomDomain';
var createdGroups = [];
var createdProfiles = [];
var createdEndpoints = [];
var createdCustomDomains = [];

var requiredEnvironment = [{
  name: 'AZURE_TEST_LOCATION',
  defaultValue: 'West US'
}];

var suite;
var client;
var profileName;
var groupName;
var endpointName;
var customDomainName1;
var customDomainName2;
var customDomainHostName1;
var customDomainHostName2;
var standardCreateParameters;
var validEndpointProperties;
var defaultLocation;

describe('Cdn Management Endpoint', function() {

  before(function(done) {
    suite = new SuiteBase(this, testPrefix, requiredEnvironment);
    suite.setupSuite(function() {
      groupName = suite.generateId(groupPrefix, createdGroups, suite.isMocked);
      client = new StorageManagementClient(suite.credentials, suite.subscriptionId);
      defaultLocation = process.env['AZURE_TEST_LOCATION'];
      profileName = suite.generateId(profilePrefix, createdProfiles, suite.isMocked);
      endpointName = 'testEndpoint-6029da3a-835e-4506-b4ea-bd5375165cdf';
      customDomainName1 = suite.generateId(customDomainPrefix, createdCustomDomains, suite.isMocked);
      customDomainName2 = suite.generateId(customDomainPrefix, createdCustomDomains, suite.isMocked);
      customDomainHostName1 = 'sdk-1-6029da3a-835e-4506-b4ea-bd5375165cdf.azureedge-test.net';
      customDomainHostName2 = 'sdk-2-6029da3a-835e-4506-b4ea-bd5375165cdf.azureedge-test.net';
      standardCreateParameters = {
        location: 'West US',
        tags: {
          tag1: 'val1',
          tag2: 'val2'
        },
        sku: {
          name: 'Standard'
        }
      };
      validEndpointProperties = {
        location: 'West US',
        tags: {
          tag1: 'val1'
        },
        origins: [{
          name: 'newname',
          hostName: 'newname.azureedge.net'
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

  describe('cdn customDomains', function() {
    it('should return zero custom domain when list by endpoint', function (done) {
      client.profiles.create(profileName, standardCreateParameters, groupName, function (err, result, request, response) {
        should.not.exist(err);
        client.endpoints.create(endpointName, validEndpointProperties, profileName, groupName, function (err, result, request, response) {
          should.not.exist(err);
          client.customDomains.listByEndpoint(endpointName, profileName, groupName, function (err, result, request, response) {
            should.not.exist(err);
            var customDomains = result;
            customDomains.length.should.equal(0);
            done();
          });
        });
      });
    })

    it('should create custom domain on running endpoint and succeed', function(done) {
      client.customDomains.create(customDomainName1, endpointName, profileName, groupName, customDomainHostName1, function(err, result, request, response) {
        should.not.exist(err);
        done();
      });
    })

    it('should return one custom domain when list by endpoint', function(done) {
      client.customDomains.listByEndpoint(endpointName, profileName, groupName, function(err, result, request, response) {
        should.not.exist(err);
        var customDomains = result;
        customDomains.length.should.equal(1);
        done();
      });
    })

    it('should get the cutom domain by name', function(done) {
      client.customDomains.get(customDomainName1, endpointName, profileName, groupName, function(err, result, request, response) {
        should.not.exist(err);
        var customDomain = result;
        customDomain.name.should.equal(customDomainName1);
        customDomain.hostName.should.equal(customDomainHostName1);
        done();
      });
    })

    it('should fail when update on running endpoint', function(done) {
      client.customDomains.update(customDomainName1, endpointName, profileName, groupName, 'customdomain11.hello.com', function(err, result, request, response) {
        should.exist(err);
        done();
      });
    });

    it('should successfully create custom domain on stopped endpoint', function(done) {
      client.endpoints.stop(endpointName, profileName, groupName, function(err, result, request, response) {
        should.not.exist(err);
        client.customDomains.create(customDomainName2, endpointName, profileName, groupName, customDomainHostName2, function(err, result, request, response) {
          should.not.exist(err);
          done();
        });
      });
    });

    it('should return 2 custom domains when listing', function(done) {
      client.customDomains.listByEndpoint(endpointName, profileName, groupName, function(err, result, request, response) {
        should.not.exist(err);
        var customDomains = result;
        customDomains.length.should.equal(2);
        done();
      });
    })

    it('should fail when update on stopped endpoint', function(done) {
      client.customDomains.update(customDomainName2, endpointName, profileName, groupName, 'customdomain22.hello.com', function(err, result, request, response) {
        should.exist(err);
        done();
      });
    });

    it('should successfully delete custom domain', function(done) {
      client.customDomains.deleteIfExists(customDomainName2, endpointName, profileName, groupName, function(err, result, request, response) {
        should.not.exist(err);
        done();
      });
    });

    it('should return 1 custom domain again when listing', function(done) {
      client.customDomains.listByEndpoint(endpointName, profileName, groupName, function(err, result, request, response) {
        should.not.exist(err);
        var customDomains = result;
        customDomains.length.should.equal(1);
        done();
      });
    })

    it('should fail on getting the deleted custom domain', function(done) {
      client.customDomains.get(customDomainName2, endpointName, profileName, groupName, function(err, result, request, response) {
        should.exist(err);
        should.not.exist(result);
        done();
      });
    })

    it('should successfully delete custom domain when endpoint is running', function(done) {
      client.endpoints.start(endpointName, profileName, groupName, function(err, result, request, response) {
        should.not.exist(err);
        client.customDomains.deleteIfExists(customDomainName1, endpointName, profileName, groupName, function(err, result, request, response) {
          should.not.exist(err);
          done();
        });
      });
    });

    it('should return zero custom domain now when list by endpoint', function(done) {
      client.customDomains.listByEndpoint(endpointName, profileName, groupName, function(err, result, request, response) {
        should.not.exist(err);
        var customDomains = result;
        customDomains.length.should.equal(0);
        done();
      });
    })
  });
});