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
var NotificationHubsManagementClient = require('../../../lib/services/notificationHubsManagement/lib/notificationHubsManagementClient');
var testPrefix = 'notificationhubsservice-NS-tests';
var groupPrefix = 'nodeTestGroup';
var namespacePrefix = 'testNS';
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
var groupName;
var namespaceLocation;
var createNamespaceParameters;
var authRuleParameter;

describe('Notification Hubs Management :', function () {
    
    before(function (done) {
        suite = new SuiteBase(this, testPrefix, requiredEnvironment);
        suite.setupSuite(function () {
            groupName = suite.generateId(groupPrefix, createdGroups, suite.isMocked);
            client = new NotificationHubsManagementClient(suite.credentials, suite.subscriptionId);
            namespaceName = suite.generateId(namespacePrefix, createdAccounts, suite.isMocked);
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
            //console.log("Create ResourceGroup : " + groupName);
            suite.createResourcegroup(groupName, namespaceLocation, function (err, result) {
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
    
    describe('Namespace Tests : ', function () {
        it('CRUD', function (done) {
            
            //console.log("Create Namespace : " + namespaceName);

            client.namespaces.createOrUpdate(groupName, namespaceName, createNamespaceParameters, function (err, result, request, response) {
                should.not.exist(err);
                should.exist(result);
                response.statusCode.should.equal(200);
                
                //console.log("Get created Namespace");
                IsNamespaceActive(groupName, namespaceName, function (err, active) {
                    //console.log("State : " + active);
                    
                    //console.log("Get all created Namespace in the ResourceGroup");
                    client.namespaces.list(groupName, function (err, result, request, response) {
                        should.not.exist(err);
                        should.exist(result);
                        response.statusCode.should.equal(200);
                        var namespaceList = result;
                        namespaceList.length.should.be.above(0);
                        namespaceList.some(function (ns) { return ns.name === namespaceName }).should.be.true;
                        
                        //console.log("Get all Namespaces in the subscription");
                        client.namespaces.listAll(function (err, result, request, response) {
                            should.not.exist(err);
                            should.exist(result);
                            response.statusCode.should.equal(200);
                            var namespaceList = result;
                            namespaceList.length.should.be.above(0);
                            namespaceList.some(function (ns) { return ns.name === namespaceName }).should.be.true;
                            
                            //console.log("Create Namespace Authorization rule : " + authorizationRuleName);
                            client.namespaces.createOrUpdateAuthorizationRule(groupName, namespaceName, authorizationRuleName, authRuleParameter, function (err, result, request, response) {
                                should.not.exist(err);
                                should.exist(result);
                                response.statusCode.should.equal(200);
                                var authRule = result;
                                authRule.name.should.equal(authorizationRuleName);
                                authRule.properties.primaryKey.should.equal(authRuleParameter.properties.primaryKey);
                                authRule.properties.rights.length.should.be.equal(2);
                                authRule.properties.rights.indexOf('Listen') > -1;
                                authRule.properties.rights.indexOf('Send') > -1;
                                
                                //console.log("Get created Namespace Authorization rule");
                                client.namespaces.getAuthorizationRule(groupName, namespaceName, authorizationRuleName, function (err, result, request, response) {
                                    should.not.exist(err);
                                    should.exist(result);
                                    response.statusCode.should.equal(200);
                                    var authRule = result;
                                    authRule.name.should.equal(authorizationRuleName);
                                    authRule.properties.primaryKey.should.equal(authRuleParameter.properties.primaryKey);
                                    authRule.properties.rights.length.should.be.equal(2);
                                    authRule.properties.rights.indexOf('Listen') > -1;
                                    authRule.properties.rights.indexOf('Send') > -1;
                                    
                                    //console.log("Get all Namespace Authorizations rules");
                                    client.namespaces.listAuthorizationRules(groupName, namespaceName, authorizationRuleName, function (err, result, request, response) {
                                        should.not.exist(err);
                                        should.exist(result);
                                        response.statusCode.should.equal(200);
                                        var authRuleList = result;
                                        authRuleList.length.should.be.above(1);
                                        authRuleList.some(function (auth) { return auth.name === authorizationRuleName }).should.be.true;
                                        
                                        //console.log("Namespace listKeys");
                                        client.namespaces.listKeys(groupName, namespaceName, authorizationRuleName, function (err, result, request, response) {
                                            should.not.exist(err);
                                            should.exist(result);
                                            response.statusCode.should.equal(200);
                                            var authKey = result;
                                            authKey.primaryConnectionString.indexOf(authRuleParameter.properties.primaryKey) > -1;
                                            authKey.secondaryConnectionString.indexOf(authRuleParameter.properties.secondaryKey) > -1;
                                            
                                            //console.log("Delete Namespace Authorization Rule");
                                            client.namespaces.deleteAuthorizationRule(groupName, namespaceName, authorizationRuleName, function (err, result, request, response) {
                                                should.not.exist(err);
                                                response.statusCode.should.equal(200);
                                                
                                                //There is a bug in the RP Delete call. Will uncomment this once the fix is in 
                                                //console.log("Delete created Namespace");
                                                //client.namespaces.deleteMethod(groupName, namespaceName, function (err, result, request, response) {
                                                //    should.not.exist(err);
                                                //    response.statusCode.should.equal(200) || response.statusCode.should.equal(204);
                                                    done();
                                                //});
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
    
    function Wait(callback) {
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