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
var testPrefix = 'cdnProfile-tests';
var groupPrefix = 'cdnTestGroup';
var profilePrefix = 'cdnTestProfile';
var createdGroups = [];
var createdProfiles = [];

var requiredEnvironment = [{
  name: 'AZURE_TEST_LOCATION',
  defaultValue: 'West US'
}];

var suite;
var client;
var profileName1;
var profileName2;
var profileName3;
var groupName1;
var groupName2;
var standardCreateParameters;
var premiumCreateParameters;
var defaultLocation;

describe('Cdn Management Profile', function() {

  before(function(done) {
    suite = new SuiteBase(this, testPrefix, requiredEnvironment);
    suite.setupSuite(function() {
      groupName1 = suite.generateId(groupPrefix, createdGroups, suite.isMocked);
      groupName2 = suite.generateId(groupPrefix, createdGroups, suite.isMocked);
      client = new StorageManagementClient(suite.credentials, suite.subscriptionId);
      defaultLocation = process.env['AZURE_TEST_LOCATION'];
      profileName1 = suite.generateId(profilePrefix, createdProfiles, suite.isMocked);
      profileName2 = suite.generateId(profilePrefix, createdProfiles, suite.isMocked);
      profileName3 = suite.generateId(profilePrefix, createdProfiles, suite.isMocked);
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
      premiumCreateParameters = {
        location: 'East US',
        tags: {
          tag1: 'val1',
          tag2: 'val2'
        },
        sku: {
          name: 'Premium_Verizon'
        }
      };
      akamaiCreateParameters = {
        location: 'East US',
        tags: {
          tag1: 'val1',
          tag2: 'val2'
        },
        sku: {
          name: 'Standard_Akamai'
        }
      };
      if (suite.isPlayback) {
        client.longRunningOperationRetryTimeout = 0;
      }
      suite.createResourcegroup(groupName1, defaultLocation, function(err, result) {
        should.not.exist(err);
        suite.createResourcegroup(groupName2, defaultLocation, function(err, result) {
          should.not.exist(err);
          done();
        });
      });
    });
  });

  after(function(done) {
    suite.teardownSuite(function() {
      suite.deleteResourcegroup(groupName1, function(err, result) {
        should.not.exist(err);
        suite.deleteResourcegroup(groupName2, function(err, result) {
          should.not.exist(err);
          done();
        });
      });
    });
  });

  beforeEach(function(done) {
    suite.setupTest(done);
  });

  afterEach(function(done) {
    suite.baseTeardownTest(done);
  });

  describe('cdn profiles', function() {

    it('should list profiles by SubscriptionId and return none', function(done) {
      client.profiles.list(function(err, result, request, response) {
        should.not.exist(err);
        should.exist(result);
        var profiles = result;
        profiles.length.should.equal(0);
        done();
      });
    });

    it('should list profiles by ResourceGroup and return none', function(done) {
      client.profiles.listByResourceGroup(groupName1, function(err, result, request, response) {
        should.not.exist(err);
        should.exist(result);
        var profiles = result;
        profiles.length.should.equal(0);
        done();
      });
    });

    it('should create a standard profile correctly', function(done) {
      client.profiles.create(groupName1, profileName1, standardCreateParameters, function(err, result, request, response) {
        should.not.exist(err);
        should.exist(result);
        var profile = result;
        profile.name.should.equal(profileName1);
        profile.sku.name.should.equal(standardCreateParameters.sku.name);
        done();
      });
    });

    it('should list the optimization types for a standard profile successfully', function(done) {
      client.profiles.listSupportedOptimizationTypes(groupName1, profileName1, function(err, result, request, response) {
        should.not.exist(err);
        should.exist(result);
        var optimizationTypes = result.supportedOptimizationTypes;
        should.exist(optimizationTypes);
        done();
      });
    });
    
    it('should list profiles by SubscriptionId and return one profile', function(done) {
      client.profiles.list(function(err, result, request, response) {
        should.not.exist(err);
        should.exist(result);
        var profiles = result;
        profiles.length.should.equal(1);
        done();
      });
    });

    it('should list profiles by ResourceGroup1 and return one profile', function(done) {
      client.profiles.listByResourceGroup(groupName1, function(err, result, request, response) {
        should.not.exist(err);
        should.exist(result);
        var profiles = result;
        profiles.length.should.equal(1);
        done();
      });
    });

    it('should update profile tags correctly', function(done) {
      var updateParameters = {
        tags : {
          tag1: 'val1',
          tag2: 'val2',
          tag3: 'val3'  
        }
      }

      client.profiles.update(groupName1, profileName1, updateParameters, function(err, result, request, response) {
        should.not.exist(err);
        should.exist(result);
        var profile = result;
        profile.name.should.equal(profileName1);
        profile.tags.tag1.should.equal(updateParameters.tags.tag1);
        profile.tags.tag2.should.equal(updateParameters.tags.tag2);
        profile.tags.tag3.should.equal(updateParameters.tags.tag3);
        done();
      });
    });

    it('should generate SSO uri correctly', function(done) {
      client.profiles.generateSsoUri(groupName1, profileName1, function(err, result, request, response) {
        should.not.exist(err);
        should.exist(result);
        done();
      });
    })

    it('should create a premium profile correctly', function(done) {
      client.profiles.create(groupName2, profileName2, premiumCreateParameters, function(err, result, request, response) {
        should.not.exist(err);
        should.exist(result);
        var profile = result;
        profile.name.should.equal(profileName2);
        profile.sku.name.should.equal(premiumCreateParameters.sku.name);
        done();
      });
    });

    it('should list profiles by SubscriptionId and return 2 profiles', function(done) {
      client.profiles.list(function(err, result, request, response) {
        should.not.exist(err);
        should.exist(result);
        var profiles = result;
        profiles.length.should.equal(2);
        done();
      });
    });

    it('should list profiles by ResourceGroup2 and return one profile', function(done) {
      client.profiles.listByResourceGroup(groupName2, function(err, result, request, response) {
        should.not.exist(err);
        should.exist(result);
        var profiles = result;
        profiles.length.should.equal(1);
        done();
      });
    });

    it('should delete first profile and succeed', function(done) {
      client.profiles.deleteMethod(groupName1, profileName1, function(err, result, request, response) {
        should.not.exist(err);
        done();
      });
    });

    it('should list profiles by ResourceGroup1 and return none', function(done) {
      client.profiles.listByResourceGroup(groupName1, function(err, result, request, response) {
        should.not.exist(err);
        should.exist(result);
        var profiles = result;
        profiles.length.should.equal(0);
        done();
      });
    });

    it('should list profiles by SubscriptionId again and return one profile', function(done) {
      client.profiles.list(function(err, result, request, response) {
        should.not.exist(err);
        should.exist(result);
        var profiles = result;
        profiles.length.should.equal(1);
        done();
      });
    });

    it('should try to delete profile that was already deleted and succeed', function(done) {
      client.profiles.deleteMethod(groupName1, profileName1, function(err, result, request, response) {
        should.not.exist(err);
        done();
      });
    });

    it('should delete second profile and succeed', function(done) {
      client.profiles.deleteMethod(groupName2, profileName2, function(err, result, request, response) {
        should.not.exist(err);
        done();
      });
    });

    it('should create a standard akamai profile correctly', function (done) {
      client.profiles.create(groupName1, profileName3, akamaiCreateParameters, function (err, result, request, response) {
        should.not.exist(err);
        should.exist(result);
        var profile = result;
        profile.name.should.equal(profileName3);
        profile.sku.name.should.equal(akamaiCreateParameters.sku.name);
        done();
      });
    });

    it('should delete akamai profile and succeed', function (done) {
      client.profiles.deleteMethod(groupName1, profileName3, function (err, result, request, response) {
        should.not.exist(err);
        done();
      });
    });
  });
});