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
var azure = require('../../../lib/services/serviceBus/lib/servicebus');
var SuiteBase = require('../../framework/suite-base');
var NotificationHubsManagementClient = require('../../../lib/services/notificationHubsManagement/lib/notificationHubsManagementClient');
var testPrefix = 'notificationhubsservice-NS-tests';
var groupPrefix = 'nodeTestGroup';
var namespacePrefix = 'testNS';

var requiredEnvironment = [
  { name: 'AZURE_TEST_LOCATION', defaultValue: 'South Central US' }
];

var notificationHubPrefix = 'testHub';
var notificationHubName;
var testPrefix = 'notificationhubsservice-NS-tests';
var groupPrefix = 'nodeTestGroup';
var namespacePrefix = 'testNS';
var authPrefix = 'testAuth';
var groupName;
var createdGroups = [];
var createdAccounts = [];

describe('Notification Hubs Management :',
  function () {
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
          sku: { name: "Standard" }
        };

        authRuleParameter = {
          location: namespaceLocation,
          name: authorizationRuleName,
          properties: {
            rights: ['Listen', 'Send']
          }
        };

        createNotificationHubParameters = {
          location: namespaceLocation,
          wnsCredential: {
            packageSid:
            'ms-app://s-1-15-2-1817505189-427745171-3213743798-2985869298-800724128-1004923984-4143860699',
            secretKey: 'w7TBprR-THIS-IS-DUMMY-KEYAzSYFhp',
            windowsLiveEndpoint: 'http://pushtestservice.cloudapp.net/LiveID/accesstoken.srf'
          },
          apnsCredential: {
            token:
            "MIGTAgEAMBMGByqGSM49AgEGCCqGSM49AwEHBHkwdwIBAQQgpVB15km4qskA5Ra5XvdtOwWPvaXIhVVQZdonzINh + hGgCgYIKoZIzj0DAQehRANCAASS3ek04J20BqA6WWDlD6 + xd3dJEifhW87wI0nnkfUB8LDb424TiWlzGIgnxV79hb3QHCAUNsPdBfLLF + Od8yqL",
            appName: "Sample",
            appId: "EF9WEB9D5K",
            keyId: "TXRXD9P6K7",
            endpoint: "https://api.push.apple.com:443/3/device"
          }
        };

        if (suite.isPlayback) {
          client.longRunningOperationRetryTimeoutInSeconds = 0;
        }
        suite.createResourcegroup(groupName,
          namespaceLocation,
          function (err, result) {
            should.not.exist(err);
            done();
          });
      });
    });

    after(function (done) {
      suite.teardownSuite(function () {
        suite.deleteResourcegroup(groupName,
          function (err, result) {
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

    describe('Registration Tests : ',
      function () {
        it('Notification Hub Registration',
          function (done) {

            client.namespaces.createOrUpdate(groupName,
              namespaceName,
              createNamespaceParameters,
              function (err,
                result,
                request,
                response) {

                should.not.exist(err);
                should.exist(result);

                IsNamespaceActive(groupName, namespaceName, function (err, active) {
                  should.not.exist(err);

                  Wait(function (err) {
                    client.notificationHubs.createOrUpdate(groupName, namespaceName, notificationHubName, createNotificationHubParameters, function (err, result, request, response) {
                      should.not.exist(err);
                      should.exist(result);
                      response.statusCode.should.equal(201);

                      client.notificationHubs.get(groupName, namespaceName, notificationHubName, function (err, result, request, response) {
                        should.not.exist(err);
                        response.statusCode.should.equal(200);
                        client.notificationHubs.listAuthorizationRules(groupName, namespaceName, notificationHubName, function (err, result, request, response) {
                          should.not.exist(err);
                          authRuleName = result[0].name;

                          client.notificationHubs.listKeys(groupName, namespaceName, notificationHubName, authRuleName, function (err, result, request, response) {
                            should.not.exist(err);
                            var connectionString = result.primaryConnectionString;
                            var hubService = azure.createNotificationHubService(notificationHubName, connectionString);
                            var tokenId = '0f744707bebcf74f9b7c25d48e3358945f6aa01da5ddb387462c7eaf61bbad78';
                            hubService.apns.createNativeRegistration(tokenId, null, function (err) {
                              should.not.exist(err);
                              hubService.apns.listRegistrationsByToken(tokenId, { top: 10, skip: 0 }, function (err, list) {
                                should.not.exist(err);
                                var regToUpdate = list[0];
                                regToUpdate.Tags = 'mytag1,mytag2';
                                hubService.createOrUpdateRegistration(regToUpdate, function (err, updatedReg) {
                                  should.not.exist(err);
                                  hubService.getRegistration(updatedReg.RegistrationId, function (err, newReg) {
                                    should.not.exist(err);
                                    should.exist(newReg.Tags);
                                    newReg.Tags.should.equal(regToUpdate.Tags);
                                    hubService.deleteRegistration(updatedReg.RegistrationId, function (err, result) {
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
      if (namespace.provisioningState === "Succeeded")
        return callback(null, true);
      else
        return IsNamespaceActive(groupName, namespaceName, callback);
    });
}

function Wait(callback) {
  if (!suite.isPlayback) {
    setTimeout(function () {
      return callback(null);
    }, 30000);
  } else {
    return callback(null);
  }
}



