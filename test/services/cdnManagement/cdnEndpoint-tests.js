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
var testPrefix = 'cdnEndpoint-tests';
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
var akamaiProfileName;
var akamaiEndpointName;
var standardCreateParameters;
var akamaiProfileParameters;
var akamaiEndpointProperties;
var geoFilterUpdateProperties;
var emptyEndpointProperties;
var validEndpointProperties;
var purgeContentPaths;
var loadContentPaths;
var defaultLocation;

describe('Cdn Management Endpoint', function() {

  before(function(done) {
    suite = new SuiteBase(this, testPrefix, requiredEnvironment);
    suite.setupSuite(function() {
      groupName = suite.generateId(groupPrefix, createdGroups, suite.isMocked);
      client = new StorageManagementClient(suite.credentials, suite.subscriptionId);
      defaultLocation = process.env['AZURE_TEST_LOCATION'];
      profileName = suite.generateId(profilePrefix, createdProfiles, suite.isMocked);
      endpointName = suite.generateId(endpointPrefix, createdEndpoints, suite.isMocked);
      akamaiProfileName = suite.generateId(profilePrefix, createdProfiles, suite.isMocked);   
      akamaiEndpointName = suite.generateId(endpointPrefix, createdEndpoints, suite.isMocked);

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
            
      akamaiProfileParameters = {
        location: 'West US',
        tags: {
            tag1: 'val1',
            tag2: 'val2'
        },
        sku: {
            name: 'Standard_Akamai'
        }
      };

      emptyEndpointProperties = {

      }
      validEndpointProperties = {
        location: 'West US',
        tags: {
          tag1: 'val1'
        },
        origins: [{
          name: 'newname',
          hostName: 'newname.azure.com'
        }]
      }
            
      akamaiEndpointProperties = {
        location: 'West US',
        tags: {
            tag1: 'val1'
        },
        origins: [{
          name: 'newakamainame',
          hostName: 'newakamainame.azure.com'
        }],
        geoFilters : [
          {
            "relativePath": "/mypicture",
            "action": "Block",
            "countryCodes": [
              "AT"
            ]
          }
        ]
      }
            
      geoFilterUpdateProperties =
      {
        geoFilters : [
          {
            "relativePath": "/mycar",
            "action": "Allow",
            "countryCodes": [
              "DZ"
            ]
          }
        ]
      }

      purgeContentPaths = [
        '/movies/*',
        '/pictures/pic1.jpg'
      ]
      loadContentPaths = [
        '/movies/amazing.mp4',
        '/pictures/pic1.jpg'
      ]

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

  describe('cdn endpoints', function() {
    it('should list endpoints and got none', function (done) {
      client.profiles.create(groupName, profileName, standardCreateParameters, function (err, result, request, response) {
        should.not.exist(err);    
        client.endpoints.listByProfile(groupName, profileName, function(err, result, request, response) {
          should.not.exist(err);
          should.exist(result);
          var endpoints = result;
          endpoints.length.should.equal(0);
          done();
        });
      });
    });

    it('should fail endpoint creation once missing required missing properties', function(done) {
      client.endpoints.create(groupName, profileName, endpointName, emptyEndpointProperties, function(err, result, request, response) {
        should.exist(err);
        should.not.exist(result);
        done();
      });
    })

    it('should create endpoint correctly with correct properties', function(done) {
      client.endpoints.create(groupName, profileName, endpointName, validEndpointProperties, function(err, result, request, response) {
        should.not.exist(err);
        should.exist(result);
        var endpoint = result;
        endpoint.name.should.equal(endpointName);
        endpoint.tags.tag1.should.equal('val1');
        endpoint.origins.length.should.equal(1);
        endpoint.origins[0].name.should.equal('newname');
        endpoint.origins[0].hostName.should.equal('newname.azure.com');
        done();
      });
    })

    it('should list endpoints and got one', function(done) {
      client.endpoints.listByProfile(groupName, profileName, function(err, result, request, response) {
        should.not.exist(err);
        should.exist(result);
        var endpoints = result;
        endpoints.length.should.equal(1);
        done();
      });
    });

    it('should not update any property when empty payload is passed', function(done) {
      client.endpoints.update(groupName, profileName, endpointName, emptyEndpointProperties, function(err, result, request, response) {
        should.not.exist(err);
        should.exist(result);
        var endpoint = result;
        endpoint.name.should.equal(endpointName);
        endpoint.tags.tag1.should.equal('val1');
        endpoint.origins.length.should.equal(1);
        endpoint.origins[0].name.should.equal('newname');
        endpoint.origins[0].hostName.should.equal('newname.azure.com');
        done();
      });
    });

    it('should update properties that are specified in payload when update but not origins', function(done) {
      var updateProperties = {
        location: 'West US',
        tags: {
          tag1: 'val2',
          tag2: 'val1'
        }
      }

      client.endpoints.update(groupName, profileName, endpointName, updateProperties, function(err, result, request, response) {
        should.not.exist(err);
        should.exist(result);
        var endpoint = result;
        endpoint.name.should.equal(endpointName);
        endpoint.tags.tag1.should.equal('val2');
        endpoint.tags.tag2.should.equal('val1');
        endpoint.origins.length.should.equal(1);
        done();
      });
    });

    it('should default to start', function(done) {
      client.endpoints.get(groupName, profileName, endpointName, function(err, result, request, response) {
        should.not.exist(err);
        var endpoint = result;
        endpoint.resourceState.should.equal('Running');
        done();
      });
    });

    it('should purge content successfully with valid paths', function(done) {
      client.endpoints.purgeContent(groupName, profileName, endpointName, purgeContentPaths, function(err, result, request, response) {
        should.not.exist(err);
        done();
      });
    });

    it('should fail purge content with none existing endpoint', function(done) {
      client.endpoints.purgeContent(groupName, profileName, 'someFakeEndpoint', purgeContentPaths, function(err, result, request, response) {
        should.exist(err);
        done();
      });
    });

    it('should fail purge content with invalid paths', function(done) {
      client.endpoints.purgeContent(groupName, profileName, endpointName, ['invalidPath!'], function(err, result, request, response) {
        should.exist(err);
        done();
      });
    });

    it('should load content successfully with valid paths', function(done) {
      client.endpoints.loadContent(groupName, profileName, endpointName, loadContentPaths, function(err, result, request, response) {
        should.not.exist(err);
        done();
      });
    });

    it('should fail load content with none existing endpoint', function(done) {
      client.endpoints.loadContent(groupName, profileName, 'someFakeEndpoint', loadContentPaths, function(err, result, request, response) {
        should.exist(err);
        done();
      });
    });

    it('should fail load content with with invalid paths', function(done) {
      client.endpoints.loadContent(groupName, profileName, endpointName, ['/movies/*'], function(err, result, request, response) {
        should.exist(err);
        done();
      });
    });

    it('should stop', function(done) {
      client.endpoints.stop(groupName, profileName, endpointName, function(err, result, request, response) {
        should.not.exist(err);
        client.endpoints.get(groupName, profileName, endpointName, function(err, result, request, response) {
          should.not.exist(err);
          var endpoint = result;
          endpoint.resourceState.should.equal('Stopped');
          done();
        });
      });
    });

    it('should fail in purge when endpoint stopped', function(done) {
      client.endpoints.purgeContent(groupName, profileName, endpointName, purgeContentPaths, function(err, result, request, response) {
        should.exist(err);
        done();
      });
    });

    it('should fail in load when endpoint stopped', function(done) {
      client.endpoints.loadContent(groupName, profileName, endpointName, loadContentPaths, function(err, result, request, response) {
        should.exist(err);
        done();
      });
    });

    it('should start again', function(done) {
      client.endpoints.start(groupName, profileName, endpointName, function(err, result, request, response) {
        should.not.exist(err);
        client.endpoints.get(groupName, profileName, endpointName, function(err, result, request, response) {
          should.not.exist(err);
          var endpoint = result;
          endpoint.resourceState.should.equal('Running');
          done();
        });
      });
    });

    it('should delete existing endpoints successfully', function(done) {
      client.endpoints.deleteMethod(groupName, profileName, endpointName, function(err, result, request, response) {
        should.not.exist(err);
        done();
      });
    });

    it('should not list any endpoints under same profile', function(done) {
      client.endpoints.listByProfile(groupName, profileName, akamaiEndpointProperties, function(err, result, request, response) {
        should.not.exist(err);
        should.exist(result);
        var endpoints = result;
        endpoints.length.should.equal(0);
        done();
      });
    });

    it('should create akamai profile and endpoint with geo filters successfully', function(done) {
      client.profiles.create(groupName, akamaiProfileName, akamaiProfileParameters, function(err, result, request, response) {
        should.not.exist(err);
        client.endpoints.create(groupName, akamaiProfileName, akamaiEndpointName, akamaiEndpointProperties, function(err, result, request, response) {
          should.not.exist(err);
          should.exist(result);
          var endpoint = result;
          endpoint.name.should.equal(akamaiEndpointName);
          endpoint.origins.length.should.equal(1);
          endpoint.geoFilters.length.should.equal(1);
          endpoint.geoFilters[0].relativePath.should.equal("/mypicture");
          endpoint.geoFilters[0].action.should.equal("Block");
          endpoint.geoFilters[0].countryCodes.length.should.equal(1);
          endpoint.geoFilters[0].countryCodes[0].should.equal("AT");
          done();
        });
      });
    });

    it('should update endpoint with geo filters successfully', function(done) {
      client.endpoints.update(groupName, akamaiProfileName, akamaiEndpointName, geoFilterUpdateProperties, function(err, result, request, response) {
        should.not.exist(err);
        should.exist(result);
        var endpoint = result;
        endpoint.name.should.equal(akamaiEndpointName);
        endpoint.origins.length.should.equal(1);
        endpoint.geoFilters.length.should.equal(1);
        endpoint.geoFilters[0].relativePath.should.equal("/mycar");
        endpoint.geoFilters[0].action.should.equal("Allow");
        endpoint.geoFilters[0].countryCodes.length.should.equal(1);
        endpoint.geoFilters[0].countryCodes[0].should.equal("DZ");
        done();
      });
    });
  });
});