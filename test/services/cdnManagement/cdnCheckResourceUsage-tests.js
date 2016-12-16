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
var testPrefix = 'cdnCheckResourceUsage-tests';
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
var groupName;
var akamaiProfileName;
var akamaiEndpointName;
var akamaiProfileParameters;
var akamaiEndpointProperties;
var geoFilterUpdateProperties;
var defaultLocation;

describe('Cdn Management CheckResourceUsage', function () {
    
    before(function (done) {
        suite = new SuiteBase(this, testPrefix, requiredEnvironment);
        suite.setupSuite(function () {
            groupName = suite.generateId(groupPrefix, createdGroups, suite.isMocked);
            client = new StorageManagementClient(suite.credentials, suite.subscriptionId);
            defaultLocation = process.env['AZURE_TEST_LOCATION'];
            akamaiProfileName = suite.generateId(profilePrefix, createdProfiles, suite.isMocked);
            akamaiEndpointName = suite.generateId(endpointPrefix, createdEndpoints, suite.isMocked);
            
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

            akamaiEndpointProperties = {
                location: 'West US',
                tags: {
                    tag1: 'val1'
                },
                origins: [{
                    name: 'newakamainame',
                    hostName: 'newakamainame.azure.com'
                }]
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

            if (suite.isPlayback) {
                client.longRunningOperationRetryTimeout = 0;
            }
            suite.createResourcegroup(groupName, defaultLocation, function (err, result) {
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
    
    describe('cdn list resource usages', function () {
        it('should get one resource usage with value of zero on subscription when no profiles', function (done) {
            client.checkResourceUsage(function (err, result, request, response) {
                should.not.exist(err);
                result.length.should.equal(1);
                result[0].currentValue.should.equal(0);
                result[0].limit.should.equal(8);
                done();
            });
        });

        it('should get one resource usage with value of one after profile created ', function (done) {
            client.profiles.create(groupName, akamaiProfileName, akamaiProfileParameters, function(err, result, request, response) {
                client.checkResourceUsage(function(err, result, request, response) {
                    should.not.exist(err);
                    result.length.should.equal(1);
                    result[0].currentValue.should.equal(1);
                    result[0].limit.should.equal(8);
                    done();
                });
            });
        });
        
        it('should get one resource usage with value of zero on profile when no endpoints', function (done) {
            client.profiles.listResourceUsage(groupName, akamaiProfileName, function (err, result, request, response) {
                should.not.exist(err);
                result.length.should.equal(1);
                result[0].currentValue.should.equal(0);
                result[0].limit.should.equal(10);
                done();
            });
        });
        
        it('should get one resource usage with value of one on profile after endpoint creation', function (done) {
            client.endpoints.create(groupName, akamaiProfileName, akamaiEndpointName, akamaiEndpointProperties, function (err, result, request, response) {
                should.not.exist(err);
                client.profiles.listResourceUsage(groupName, akamaiProfileName, function (err, result, request, response) {
                    should.not.exist(err);
                    result.length.should.equal(1);
                    result[0].currentValue.should.equal(1);
                    result[0].limit.should.equal(10);
                    done();
                });
            });
        })
        
        it('should get resource usages with value of zero of endpoint', function (done) {
            client.endpoints.listResourceUsage(groupName, akamaiProfileName, akamaiEndpointName, function (err, result, request, response) {
                should.not.exist(err);
                result.length.should.equal(2);
                result[0].currentValue.should.equal(0);
                result[0].limit.should.equal(10);
                result[1].currentValue.should.equal(0);
                result[1].limit.should.equal(25);
                done();
            });
        });
        
        it('should update current value of resource usage after geo filter is added', function (done) {
            client.endpoints.update(groupName, akamaiProfileName, akamaiEndpointName, geoFilterUpdateProperties, function (err, result, request, response) {
                should.not.exist(err);
                client.endpoints.listResourceUsage(groupName, akamaiProfileName, akamaiEndpointName, function (err, result, request, response) {
                    should.not.exist(err);
                    result.length.should.equal(2);
                    result[0].currentValue.should.equal(0);
                    result[0].limit.should.equal(10);
                    result[1].currentValue.should.equal(1);
                    result[1].limit.should.equal(25);
                    done();
                });
            });
        });
    });
});