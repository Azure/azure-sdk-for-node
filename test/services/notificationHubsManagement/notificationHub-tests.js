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
var NotificationHubsManagementClient = require('../../../lib/services/notificationHubsManagement/lib/notificationHubsManagementClient');
var testPrefix = 'notificationhubsservice-Hub-tests';
var groupPrefix = 'nodeTestGroup';
var namespacePrefix = 'testNS';
var notificationHubPrefix = 'testHub';
var authPrefix = 'testAuth';
var namespaceType = 'NotificationHub';
var createdGroups = [];
var createdAccounts = [];

var requiredEnvironment = [
  { name: 'AZURE_TEST_LOCATION', defaultValue: 'South Central US' }
];

var suite;
var client;
var namespaceName;
var authorizationRuleName;
var notificationHubName;
var groupName;
var namespaceLocation;
var createNamespaceParameters;
var createNotificationHubParameters;
var authRuleParameter;

describe('Notification Hubs Management', function () {
    
    before(function (done) {
        suite = new SuiteBase(this, testPrefix, requiredEnvironment);
        suite.setupSuite(function () {
            groupName = suite.generateId(groupPrefix, createdGroups, suite.isMocked);
            client = new NotificationHubsManagementClient(suite.credentials, suite.subscriptionId);
            namespaceName = suite.generateId(namespacePrefix, createdAccounts, suite.isMocked);
            notificationHubName = suite.generateId(notificationHubPrefix, createdAccounts, suite.isMocked);
            authorizationRuleName = suite.generateId(authPrefix, createdAccounts, suite.isMocked);
            namespaceLocation = process.env['AZURE_TEST_LOCATION'];
            createNamespaceParameters = {
                location: namespaceLocation,
                tags: {
                    tag1: 'value1',
                    tag2: 'value2'
                },
                properties: {
                    namespaceType : namespaceType
                }
            };
            
            createNotificationHubParameters = {
                location: namespaceLocation,
                properties: {
                    WnsCredential : {
                        properties: {
                            PackageSid : 'ms-app://s-1-15-2-1817505189-427745171-3213743798-2985869298-800724128-1004923984-4143860699',
                            SecretKey : 'w7TBprR-9tJxn9mUOdK4PPHLCAzSYFhp',
                            WindowsLiveEndpoint : 'http://pushtestservice.cloudapp.net/LiveID/accesstoken.srf'
                        }
                    }
                }
            };
            
            authRuleParameter = {
                location: namespaceLocation,
                properties: {
                    keyName : authorizationRuleName,
                    rights : ['Listen', 'Send'], 
                    primaryKey : 'IR4qH02MB2yXjlekt5fhlgMR9YAoMsXHTkUqarUkATU=',
                    secondaryKey : 'aVpieJX6Ot7PUnC9N4wUAWbpB6wfX+s893SwXW9WCeQ=',
                    claimType : 'SharedAccessKey',
                    claimValue : 'None'
                }
            };
            
            
            if (suite.isPlayback) {
                client.longRunningOperationRetryTimeoutInSeconds = 0;
            }
            //console.log("Create Resource Group : " + groupName);

            suite.createResourcegroup(groupName, namespaceLocation, function (err, result) {
                should.not.exist(err);
                
                if (!suite.isPlayback) {
                    //console.log("Create Namespace : " + namespaceName);
                    client.namespaces.createOrUpdate(groupName, namespaceName, createNamespaceParameters, function (err, result, request, response) {
                        should.not.exist(err);
                        should.exist(result);
                        response.statusCode.should.equal(200);
                        
                        //console.log("Get the Created Namespace");
                        IsNamespaceActive(groupName, namespaceName, function (err, active) {
                            //console.log("State : " + active);
                            done();
                        });
                    });
                } else {
                    done();
                }
            });
        });
    });
        
    after(function (done) {
        suite.teardownSuite(function () {
            //There is a bug in the RP Delete call. Will uncomment this once the fix is in 
         //   console.log("Delete Namespace");
            //client.namespaces.deleteMethod(groupName, namespaceName, function (err, result, request, response) {
         //       should.not.exist(err);
         //       console.log("statusCode" + response.statusCode);
         //       response.statusCode.should.equal(404);
                
                //console.log("Delete Resource Group");
                suite.deleteResourcegroup(groupName, function (err, result) {
                    should.not.exist(err);
                    done();
                });
            //});

        });
    });
    
    beforeEach(function (done) {
        suite.setupTest(done);
    });
    
    afterEach(function (done) {
        suite.baseTeardownTest(done);
    });
    
    describe('NotificationHub Tests :', function () {
        it('CRUD', function (done) {
            //console.log("Wait : " + notificationHubName);
            Wait(function (err) {
                //console.log("Create a Notification Hub : " + notificationHubName);
                client.notificationHubs.createOrUpdate(groupName, namespaceName, notificationHubName, createNotificationHubParameters, function (err, result, request, response) {
                    should.not.exist(err);
                    should.exist(result);
                    response.statusCode.should.equal(201);
                    
                    //console.log("Get created Notification Hub");
                    client.notificationHubs.get(groupName, namespaceName, notificationHubName, function (err, result, request, response) {
                        should.not.exist(err);
                        should.exist(result);
                        response.statusCode.should.equal(200);
                        var nhub = result;
                        nhub.name.should.equal(notificationHubName);
                        nhub.location.should.equal(namespaceLocation);
                        
                        //console.log("Get all Notification Hubs");
                        client.notificationHubs.list(groupName, namespaceName, function (err, result, request, response) {
                            should.not.exist(err);
                            should.exist(result);
                            response.statusCode.should.equal(200);
                            var nHubList = result;
                            nHubList.length.should.be.above(0);
                            
                            //console.log("Get the PNS credentials");
                            client.notificationHubs.getPnsCredentials(groupName, namespaceName, notificationHubName, function (err, result, request, response) {
                                should.not.exist(err);
                                should.exist(result);
                                response.statusCode.should.equal(200);
                                var nhub = result;
                                
                                //Uncomment after fixing this bug . 
                                //nhub.properties.WnsCredential.properties.SecretKey.should.equal(createNotificationHubParameters.properties.WnsCredential.properties.SecretKey);
                                //nhub.properties.WnsCredential.properties.PackageSid.should.equal(createNotificationHubParameters.properties.WnsCredential.properties.PackageSid);
                                //nhub.properties.WnsCredential.properties.WindowsLiveEndpoint.should.equal(createNotificationHubParameters.properties.WnsCredential.properties.WindowsLiveEndpoint);
                                
                                //console.log("Create Notification Hub Authorization Rules : " + authorizationRuleName);
                                client.notificationHubs.createOrUpdateAuthorizationRule(groupName, namespaceName, notificationHubName, authorizationRuleName, authRuleParameter, function (err, result, request, response) {
                                    should.not.exist(err);
                                    should.exist(result);
                                    response.statusCode.should.equal(200);
                                    var authRule = result;
                                    authRule.name.should.equal(authorizationRuleName);
                                    authRule.properties.primaryKey.should.equal(authRuleParameter.properties.primaryKey);
                                    authRule.properties.rights.length.should.be.equal(2);
                                    authRule.properties.rights.indexOf('Listen') > -1;
                                    authRule.properties.rights.indexOf('Send') > -1;
                                    
                                    //console.log("Get Created Authorization Rules");
                                    client.notificationHubs.getAuthorizationRule(groupName, namespaceName, notificationHubName, authorizationRuleName, function (err, result, request, response) {
                                        should.not.exist(err);
                                        should.exist(result);
                                        response.statusCode.should.equal(200);
                                        var authRule = result;
                                        authRule.name.should.equal(authorizationRuleName);
                                        authRule.properties.primaryKey.should.equal(authRuleParameter.properties.primaryKey);
                                        authRule.properties.rights.length.should.be.equal(2);
                                        authRule.properties.rights.indexOf('Listen') > -1;
                                        authRule.properties.rights.indexOf('Send') > -1;
                                        
                                        //console.log("Get all the Notification Hub Authoirzation Rules");
                                        client.notificationHubs.listAuthorizationRules(groupName, namespaceName, notificationHubName, function (err, result, request, response) {
                                            should.not.exist(err);
                                            should.exist(result);
                                            response.statusCode.should.equal(200);
                                            var authRuleList = result;
                                            authRuleList.length.should.be.above(2);
                                            authRuleList.some(function (auth) { return auth.name === authorizationRuleName }).should.be.true;
                                            
                                            //console.log("NotificationHub ListKeys");
                                            client.notificationHubs.listKeys(groupName, namespaceName, notificationHubName, authorizationRuleName, function (err, result, request, response) {
                                                should.not.exist(err);
                                                should.exist(result);
                                                response.statusCode.should.equal(200);
                                                var authKey = result;
                                                authKey.primaryConnectionString.indexOf(authRuleParameter.properties.primaryKey) > -1;
                                                authKey.secondaryConnectionString.indexOf(authRuleParameter.properties.secondaryKey) > -1;
                                                
                                                //console.log("Delete the Created Authorization Rule");
                                                client.notificationHubs.deleteAuthorizationRule(groupName, namespaceName, notificationHubName, authorizationRuleName, function (err, result, request, response) {
                                                    should.not.exist(err);
                                                    response.statusCode.should.equal(200);
                                                    
                                                    //console.log("Delete the Created Notification Hub");
                                                    client.notificationHubs.deleteMethod(groupName, namespaceName, notificationHubName, function (err, result, request, response) {
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
                    });
                });
            });
        });
    });

    function IsNamespaceActive(groupName, namespaceName, callback) {
        
        client.namespaces.get(groupName, namespaceName, 
                function (err, result, request, response) {
            //console.log("Inside Get");
            should.not.exist(err);
            should.exist(result);
            response.statusCode.should.equal(200);
            namespace = result;
            namespace.name.should.equal(namespaceName);
            namespace.location.should.equal(namespaceLocation);
            namespace.properties.namespaceType.should.equal(namespaceType);
            //console.log("State : " + namespace.properties.provisioningState);
            //console.log(namespace);
            if (namespace.properties.provisioningState === "Succeeded")
                return callback(null, true);
            else
                return IsNamespaceActive(groupName, namespaceName, callback);
        });        
    }

    function Wait(callback)
    {
        if (!suite.isPlayback) {
            setTimeout(function () {
                //console.log('sleep for 30 seconds');
                return callback(null);
            }, 30000);
        } else {
            return callback(null);
        }
    }
});