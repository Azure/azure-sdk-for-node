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
var moment = require('moment');
var util = require('util');
var msRestAzure = require('ms-rest-azure')
var IntuneResourceManagementClient = require('../../../lib/services/intune/lib/intuneResourceManagementClient');
var IntuneTestUtils = require('./intuneResourceManagementClient-tests-utils');
var SuiteBase = require('../../framework/suite-base');
var Constants = IntuneTestUtils.Constants;

var client;
var location;
var iOSPolicyId;
var androidPolicyId;
var iOSApps;
var androidApps;
var policiesCreated = [];
var policiesType;
var userGroups;
var userId;
var flaggedUser;
var deviceName;
var suite;
var baseUrl;
var isSetupPending = true;
var testPrefix = 'intune-tests';

describe('Intune Resource Management', function() {

  before(function(done) {
    // Anything but 'dogfood' will use prod
    var environment = process.env['ENVIRONMENT'];
    if (!environment || environment !== 'dogfood') {
      environment = 'production';
      baseUrl = 'https://management.azure.com';
    } else {
      baseUrl = 'https://api-dogfood.resources.windows-int.net';
    }

    suite = new SuiteBase(this, testPrefix);
    client = new IntuneResourceManagementClient(suite.credentials, baseUrl);

    suite.setupSuiteAsync(function(setUpDone) {
      if (!suite.isPlayback) {
        doSetUp(function() {
          if (suite.isRecording) {
            suite.saveMockVariable('location', location);
            suite.saveMockVariable('iOSApps', iOSApps);
            suite.saveMockVariable('androidApps', androidApps);
            suite.saveMockVariable('userGroups', userGroups);
            suite.saveMockVariable('userId', userId);
            suite.saveMockVariable('flaggedUser', flaggedUser);
            suite.saveMockVariable('iOSPolicyId', iOSPolicyId);
            suite.saveMockVariable('androidPolicyId', androidPolicyId);
            suite.saveMockVariable('deviceName', deviceName);
          }

          setUpDone(); // We tell the test framework we are done setting up
          done(); // We tell mocha we are done with the 'before' part
        });
      } else {
        location = suite.getMockVariable('location');
        iOSApps = suite.getMockVariable('iOSApps');
        androidApps = suite.getMockVariable('androidApps');
        userGroups = suite.getMockVariable('userGroups');
        userId = suite.getMockVariable('userId');
        flaggedUser = suite.getMockVariable('flaggedUser');
        iOSPolicyId = suite.getMockVariable('iOSPolicyId');
        androidPolicyId = suite.getMockVariable('androidPolicyId');
        deviceName = suite.getMockVariable('deviceName');

        setUpDone(); // We tell the test framework we are done setting up
        done(); // We tell mocha we are done with the 'before' part
      }
    });
  });

  after(function(done) {
    if (!suite.isPlayback) {
      done = IntuneTestUtils.done(2, done);

      suite.teardownSuite(deletePolicies);

      function deletePolicies() {
        // Delete all iOS Policies
        IntuneTestUtils.deleteAllPolicies(client, location, IntuneTestUtils.PolicyType.iOS, function(success) {
          success.should.be.true;
          // Delete all Android Policies
           IntuneTestUtils.deleteAllPolicies(client, location, IntuneTestUtils.PolicyType.Android, function(success) {
            success.should.be.true;
            done();
          });
        });
      }
    } else {
      suite.teardownSuite(done);
    }
  });

  beforeEach(function(done) {
    suite.setupTest(done);
  });

  afterEach(function(done) {
    if (!suite.isPlayback) {
      suite.baseTeardownTest(function() {
        IntuneTestUtils.deletePolicies(client, location, policiesType, policiesCreated, function(success) {
          success.should.be.true;
          policiesCreated = [];
          policiesType = null;
          done();
        });
      });
    } else {
      suite.baseTeardownTest(done);
    }
  });

  describe('- Locations', function() {
    it('- getLocations', function(done) {
      client.getLocations(null, function(error, result, request, response) {
        should.not.exist(error);
        should.exist(result);
        response.statusCode.should.equal(200);

        result.length.should.be.greaterThan(0);

        done();
      });
    });

    it('- getLocationByHostName', function(done) {
      client.getLocationByHostName(null, function(error, result, request, response) {
        should.not.exist(error);
        should.exist(result);
        response.statusCode.should.equal(200);

        should.exist(result.hostName);

        done();
      });
    });
  });

  describe('- Apps', function() {
    it('- getiOSApps', function(done) {
      var filter = IntuneTestUtils.format(Constants.PlatformTypeQuery, 'ios');
      client.getApps(location, { filter: filter }, function(error, result, request, response) {
        should.not.exist(error);
        should.exist(result);
        response.statusCode.should.equal(200);

        result.length.should.be.greaterThan(0);

        done();
      });
    });

    it('- getAndroidApps', function(done) {
      var filter = IntuneTestUtils.format(Constants.PlatformTypeQuery, 'android');
      client.getApps(location, { filter: filter }, function(error, result, request, response) {
        should.not.exist(error);
        should.exist(result);
        response.statusCode.should.equal(200);

        result.length.should.be.greaterThan(0);

        done();
      });
    });
  });

  describe('- Devices', function() {
    it('- getMAMUserDevices', function(done) {
      client.getMAMUserDevices(location, userId, null, function(error, result, request, response) {
        should.not.exist(error);
        should.exist(result);
        response.statusCode.should.equal(200);

        result.length.should.be.greaterThan(0);

        done();
      });
    });

    it.skip('- getMAMUserDeviceByDeviceName', function(done) {
      client.getMAMUserDeviceByDeviceName(location, userId, deviceName, null, function(error, result, request, response) {
        should.not.exist(error);
        should.exist(result);
        response.statusCode.should.equal(200);

        result.type.should.equal('Microsoft.Intune/locations/users/devices');

        done();
      });
    });

    it('- wipeMAMUserDevice', function(done) {
      client.wipeMAMUserDevice(location, userId, deviceName, null, function(error, result, request, response) {
        should.not.exist(error);
        should.exist(result);
        response.statusCode.should.equal(200);

        done();
      });
    });

    it('- getOperationResults', function(done) {
      client.getOperationResults(location, null, function(error, result, request, response) {
        should.not.exist(error);
        should.exist(result);
        response.statusCode.should.equal(200);

        result.length.should.be.greaterThan(0);

        done();
      });
    });
  });

  describe('- FlaggedUsers', function() {
    it('- GetMAMStatuses', function(done) {
      client.getMAMStatuses(location, null, function(error, result, request, response) {
        should.not.exist(error);
        should.exist(result);
        response.statusCode.should.equal(200);

        result.name.should.equal('default');
        result.status.should.equal('complete');
        result.type.should.equal('Microsoft.Intune/locations/statuses');

        done();
      });
    });

    it('- GetMAMFlaggedUsers', function(done) {
      client.getMAMFlaggedUsers(location, null, function(error, result, request, response) {
        should.not.exist(error);
        should.exist(result);
        response.statusCode.should.equal(200);

        result.length.should.be.greaterThan(0);
        var flaggedUser = result[0];
        flaggedUser.type.should.equal('Microsoft.Intune/locations/flaggedUsers');
        flaggedUser.errorCount.should.be.greaterThan(0);
        flaggedUser.friendlyName.should.exist;
        flaggedUser.id.should.exist;
        flaggedUser.name.should.exist;

        done();
      });
    });

    it('- GetMAMFlaggedUserByName', function(done) {
      client.getMAMFlaggedUserByName(location, flaggedUser.name, null, function(error, result, request, response) {
        should.not.exist(error);
        should.exist(result);
        response.statusCode.should.equal(200);

        result.errorCount.should.be.greaterThan(0);
        result.friendlyName.should.exist;
        result.id.should.exist;
        result.name.should.exist;

        done();
      });
    });

    it('- GetMAMUserFlaggedEnrolledApps', function(done) {
      client.getMAMUserFlaggedEnrolledApps(location, flaggedUser.name, null, function(error, result, request, response) {
        should.not.exist(error);
        should.exist(result);
        response.statusCode.should.equal(200);

        var flaggedApp = result[0];
        flaggedApp.type.should.be.equal('Microsoft.Intune/locations/flaggedUsers/flaggedEnrolledApps');
        flaggedApp.name.should.exist;
        flaggedApp.friendlyName.should.exist;
        flaggedApp.platform.should.exist;
        flaggedApp.id.should.exist;

        done();
      });
    });
  });

  describe('- Policies', function() {
    describe('- iOS', function() {
      it('- getMAMPolicies', function(done) {
        client.ios.getMAMPolicies(location, null, function(error, result, request, response) {
          should.not.exist(error);
          should.exist(result);
          response.statusCode.should.equal(200);
          done();
        });
      });

      it('- getMAMPoliciyById', function(done) {
        client.ios.getMAMPolicyByName(location, iOSPolicyId, null, function(error, result, request, response) {
          should.not.exist(error);
          should.exist(result);
          response.statusCode.should.equal(200);
          done();
        });
      });

      it('- createOrUpdateMAMPolicy', function(done) {
        var policyPayload = IntuneTestUtils.getPolicyPutPayload(IntuneTestUtils.PolicyType.iOS);
        var policyId = suite.generateGuid();
        client.ios.createOrUpdateMAMPolicy(location, policyId, policyPayload, null, function(error, result, request, response) {
          should.not.exist(error);
          should.exist(result);
          response.statusCode.should.equal(200);

          policiesCreated.push(policyId);
          policiesType = IntuneTestUtils.PolicyType.iOS;

          // Make sure policy is there
          client.ios.getMAMPolicyByName(location, policyId, null, function(error, result) {
            should.not.exist(error);
            should.exist(result);

            // Check that every property is written and retrieved correctly
            var accessRecheckOfflineTimeout = moment.duration(policyPayload.accessRecheckOfflineTimeout).toISOString();
            accessRecheckOfflineTimeout.should.be.equal(result.accessRecheckOfflineTimeout.toISOString());
            var accessRecheckOnlineTimeout = moment.duration(policyPayload.accessRecheckOnlineTimeout).toISOString();
            accessRecheckOnlineTimeout.should.be.equal(result.accessRecheckOnlineTimeout.toISOString());
            policyPayload.appSharingFromLevel.should.be.equal(result.appSharingFromLevel);
            policyPayload.appSharingToLevel.should.be.equal(result.appSharingToLevel);
            policyPayload.authentication.should.be.equal(result.authentication);
            policyPayload.clipboardSharingLevel.should.be.equal(result.clipboardSharingLevel);
            policyPayload.dataBackup.should.be.equal(result.dataBackup);
            policyPayload.pinNumRetry.should.be.equal(result.pinNumRetry);
            policyPayload.deviceCompliance.should.be.equal(result.deviceCompliance);
            policyPayload.fileSharingSaveAs.should.be.equal(result.fileSharingSaveAs);
            var offlineWipeTimeout = moment.duration(policyPayload.offlineWipeTimeout).toISOString();
            offlineWipeTimeout.should.be.equal(result.offlineWipeTimeout.toISOString());
            policyPayload.pin.should.be.equal(result.pin);
            policyPayload.description.should.be.equal(result.description);
            policyPayload.friendlyName.should.be.equal(result.friendlyName);
            policyPayload.touchId.should.be.equal(result.touchId);
            policyPayload.managedBrowser.should.be.equal(result.managedBrowser);
            policyPayload.fileEncryptionLevel.should.be.equal(result.fileEncryptionLevel);

            //result.should.be.equal(policyPayload);
            response.statusCode.should.equal(200);
            done();
          });
        });
      });

      it('- patchMAMPolicy', function(done) {
        var policyPatchPayload = IntuneTestUtils.getPolicyPatchPayload(IntuneTestUtils.PolicyType.iOS);
        client.ios.patchMAMPolicy(location, iOSPolicyId, policyPatchPayload, null, function(error, result, request, response) {
          should.not.exist(error);
          should.exist(result);
          response.statusCode.should.equal(200);

          // Make sure policy is there
          client.ios.getMAMPolicyByName(location, iOSPolicyId, null, function(error, result, request, response) {
            should.not.exist(error);
            should.exist(result);
            response.statusCode.should.equal(200);

            // Check if updated value was actually written on patch
            policyPatchPayload.friendlyName.should.be.equal(result.friendlyName);

            done();
          });
        });
      });

      it('- deleteMAMPolicy', function(done) {
        var policyPayload = IntuneTestUtils.getPolicyPutPayload(IntuneTestUtils.PolicyType.iOS);
        var policyId = suite.generateGuid();
        client.ios.createOrUpdateMAMPolicy(location, policyId, policyPayload, null, function(error, result, request, response) {
          should.not.exist(error);
          should.exist(result);
          response.statusCode.should.equal(200);

          // Make sure policy is there
          client.ios.deleteMAMPolicy(location, policyId, null, function(error, result, request, response) {
            should.not.exist(error);
            response.statusCode.should.equalOneOf([200, 204]);

            done();
          });
        });
      });

      it('- getAppsForMAMPolicy', function(done) {
        client.ios.getAppForMAMPolicy(location, iOSPolicyId, null, function(error, result, request, response) {
          should.not.exist(error);
          should.exist(result);
          response.statusCode.should.equal(200);
          done();
        });
      });

      it('- addAppForMAMPolicy', function(done) {
        var appId = iOSApps[0].name;
        var appProperties = {
          properties: {
            url: baseUrl + iOSApps[0].id
          }
        };
        client.ios.addAppForMAMPolicy(location, iOSPolicyId, appId, appProperties, null, function(error, result, request, response) {
          should.not.exist(error);
          response.statusCode.should.equalOneOf([200, 204]);

          client.ios.getAppForMAMPolicy(location, iOSPolicyId, null, function(error, result, request, response) {
            should.not.exist(error);
            should.exist(result);
            response.statusCode.should.equal(200);

            // Make sure that the app was actually added
            var addedApp = result.filter(function(app) {
              return app.name == appId;
            });

            addedApp.length.should.be.equal(1);

            done();
          });
        });
      });

      it('- deleteAppForMAMPolicy', function(done) {
        var appId = iOSApps[0].name;
        client.ios.deleteAppForMAMPolicy(location, iOSPolicyId, appId, null, function(error, result, request, response) {
          should.not.exist(error);
          response.statusCode.should.equalOneOf([200, 204]);

          client.ios.getAppForMAMPolicy(location, iOSPolicyId, null, function(error, result, request, response) {
            should.not.exist(error);
            should.exist(result);
            response.statusCode.should.equal(200);

            // Make sure that the app was actually deleted
            var addedApp = result.filter(function(app) {
              return app.name == appId;
            });

            addedApp.length.should.be.equal(0);

            done();
          });
        });
      });

      it('- getGroupsForMAMPolicy', function(done) {
        client.ios.getGroupsForMAMPolicy(location, iOSPolicyId, null, function(error, result, request, response) {
          should.not.exist(error);
          result.should.exist;
          response.statusCode.should.be.equal(200);

          // Should have the 1 group we added when creating the policy
          result.length.should.be.equal(1);

          done();
        });
      });

      it('- addGroupsForMAMPolicy', function(done) {
        var groupProperties = {
          properties: {
            url: baseUrl + '/providers/Microsoft.Intune/locations/' + location + '/groups/' + userGroups[1].objectId
          }
        };

        client.ios.addGroupForMAMPolicy(location, iOSPolicyId, userGroups[1].objectId, groupProperties, null, function(error, result, request, response) {
          should.not.exist(error);
          response.statusCode.should.equalOneOf([200, 204]);

          done();
        });
      });

      it('- deleteGroupsForMAMPolicy', function(done) {
        client.ios.deleteGroupForMAMPolicy(location, iOSPolicyId, userGroups[0].objectId, null, function(error, result, request, response) {
          should.not.exist(error);
          response.statusCode.should.equalOneOf([200, 204]);

          done();
        });
      });
    });

    describe('- Android', function() {
      it('- getMAMPolicies', function(done) {
        client.android.getMAMPolicies(location, null, function(error, result, request, response) {
          should.not.exist(error);
          should.exist(result);
          response.statusCode.should.equal(200);
          done();
        });
      });

      it('- getMAMPoliciyById', function(done) {
        client.android.getMAMPolicyByName(location, androidPolicyId, null, function(error, result, request, response) {
          should.not.exist(error);
          should.exist(result);
          response.statusCode.should.equal(200);
          done();
        });
      });

      it('- createOrUpdateMAMPolicy', function(done) {
        var policyPayload = IntuneTestUtils.getPolicyPutPayload(IntuneTestUtils.PolicyType.Android);
        var policyId = suite.generateGuid();
        client.android.createOrUpdateMAMPolicy(location, policyId, policyPayload, null, function(error, result, request, response) {
          should.not.exist(error);
          should.exist(result);
          response.statusCode.should.equal(200);

          policiesCreated.push(policyId);
          policiesType = IntuneTestUtils.PolicyType.Android;

          // Make sure policy is there
          client.android.getMAMPolicyByName(location, policyId, null, function(error, result) {
            should.not.exist(error);
            should.exist(result);

            // Check that every property is written and retrieved correctly
            var accessRecheckOfflineTimeout = moment.duration(policyPayload.accessRecheckOfflineTimeout).toISOString();
            accessRecheckOfflineTimeout.should.be.equal(result.accessRecheckOfflineTimeout.toISOString());
            var accessRecheckOnlineTimeout = moment.duration(policyPayload.accessRecheckOnlineTimeout).toISOString();
            accessRecheckOnlineTimeout.should.be.equal(result.accessRecheckOnlineTimeout.toISOString());
            policyPayload.appSharingFromLevel.should.be.equal(result.appSharingFromLevel);
            policyPayload.appSharingToLevel.should.be.equal(result.appSharingToLevel);
            policyPayload.authentication.should.be.equal(result.authentication);
            policyPayload.clipboardSharingLevel.should.be.equal(result.clipboardSharingLevel);
            policyPayload.dataBackup.should.be.equal(result.dataBackup);
            policyPayload.pinNumRetry.should.be.equal(result.pinNumRetry);
            policyPayload.deviceCompliance.should.be.equal(result.deviceCompliance);
            policyPayload.fileSharingSaveAs.should.be.equal(result.fileSharingSaveAs);
            var offlineWipeTimeout = moment.duration(policyPayload.offlineWipeTimeout).toISOString();
            offlineWipeTimeout.should.be.equal(result.offlineWipeTimeout.toISOString());
            policyPayload.pin.should.be.equal(result.pin);
            policyPayload.description.should.be.equal(result.description);
            policyPayload.friendlyName.should.be.equal(result.friendlyName);
            policyPayload.screenCapture.should.be.equal(result.screenCapture);
            policyPayload.managedBrowser.should.be.equal(result.managedBrowser);
            policyPayload.fileEncryption.should.be.equal(result.fileEncryption);

            //result.should.be.equal(policyPayload);
            response.statusCode.should.equal(200);
            done();
          });
        });
      });

      it('- patchMAMPolicy', function(done) {
        var policyPatchPayload = IntuneTestUtils.getPolicyPatchPayload();
        client.android.patchMAMPolicy(location, androidPolicyId, policyPatchPayload, null, function(error, result, request, response) {
          should.not.exist(error);
          should.exist(result);
          response.statusCode.should.equal(200);

          // Make sure policy is there
          client.android.getMAMPolicyByName(location, androidPolicyId, null, function(error, result, request, response) {
            should.not.exist(error);
            should.exist(result);
            response.statusCode.should.equal(200);

            // Check if updated value was actually written on patch
            policyPatchPayload.friendlyName.should.be.equal(result.friendlyName);

            done();
          });
        });
      });

      it('- deleteMAMPolicy', function(done) {
        var policyPayload = IntuneTestUtils.getPolicyPutPayload(IntuneTestUtils.PolicyType.Android);
        var policyId = suite.generateGuid();
        client.android.createOrUpdateMAMPolicy(location, policyId, policyPayload, null, function(error, result, request, response) {
          should.not.exist(error);
          should.exist(result);
          response.statusCode.should.equal(200);

          // Make sure policy is there
          client.android.deleteMAMPolicy(location, policyId, null, function(error, result, request, response) {
            should.not.exist(error);
            response.statusCode.should.equalOneOf([200, 204]);

            done();
          });
        });
      });

      it('- getAppsForMAMPolicy', function(done) {
        client.android.getAppForMAMPolicy(location, androidPolicyId, null, function(error, result, request, response) {
          should.not.exist(error);
          should.exist(result);
          response.statusCode.should.equal(200);
          done();
        });
      });

      it('- addAppForMAMPolicy', function(done) {
        var appId = androidApps[0].name;
        var appProperties = {
          properties: {
            url: baseUrl + androidApps[0].id
          }
        };
        client.android.addAppForMAMPolicy(location, androidPolicyId, appId, appProperties, null, function(error, result, request, response) {
          should.not.exist(error);
          response.statusCode.should.equalOneOf([200, 204]);

          client.android.getAppForMAMPolicy(location, androidPolicyId, null, function(error, result, request, response) {
            should.not.exist(error);
            should.exist(result);
            response.statusCode.should.equal(200);

            // Make sure that the app was actually added
            var addedApp = result.filter(function(app) {
              return app.name == appId;
            });

            addedApp.length.should.be.equal(1);

            done();
          });
        });
      });

      it('- deleteAppForMAMPolicy', function(done) {
        var appId = androidApps[0].name;
        client.android.deleteAppForMAMPolicy(location, androidPolicyId, appId, null, function(error, result, request, response) {
          should.not.exist(error);
          response.statusCode.should.equalOneOf([200, 204]);

          client.android.getAppForMAMPolicy(location, androidPolicyId, null, function(error, result, request, response) {
            should.not.exist(error);
            should.exist(result);
            response.statusCode.should.equal(200);

            // Make sure that the app was actually deleted
            var addedApp = result.filter(function(app) {
              return app.name == appId;
            });

            addedApp.length.should.be.equal(0);

            done();
          });
        });
      });

      it('- getGroupsForMAMPolicy', function(done) {
        client.android.getGroupsForMAMPolicy(location, androidPolicyId, null, function(error, result, request, response) {
          should.not.exist(error);
          result.should.exist;
          response.statusCode.should.be.equal(200);

          // Should have the 1 group we added when creating the policy
          result.length.should.be.equal(1);

          done();
        });
      });

      it('- addGroupsForMAMPolicy', function(done) {
        var groupProperties = {
          properties: {
            url: baseUrl + '/providers/Microsoft.Intune/locations/' + location + '/groups/' + userGroups[1].objectId
          }
        };

        client.android.addGroupForMAMPolicy(location, androidPolicyId, userGroups[1].objectId, groupProperties, null, function(error, result, request, response) {
          should.not.exist(error);
          response.statusCode.should.equalOneOf([200, 204]);

          done();
        });
      });

      it('- deleteGroupsForMAMPolicy', function(done) {
        client.android.deleteGroupForMAMPolicy(location, androidPolicyId, userGroups[0].objectId, null, function(error, result, request, response) {
          should.not.exist(error);
          response.statusCode.should.equalOneOf([200, 204]);

          done();
        });
      });
    });
  });
});

function doSetUp(done) {
  // Setup resolver
  preSetupDone = IntuneTestUtils.done(1, function() {
    precacheData(done);
  });

  IntuneTestUtils.getAADUsersAndGroups(process.env['USERNAME'], process.env['PASSWORD'], process.env['CLIENT_ID'], function(result) {
    // We need at least 2 groups to do all the tests!
    result.groups.length.should.be.greaterThan(2);
    result.users.length.should.be.greaterThan(0);

    userGroups = result.groups;
    userId = result.users.filter(function(user) {
      return user.userPrincipalName === process.env['USERNAME'];
    })[0].objectId;

    preSetupDone();
  });
}

function precacheData(done) {
  // Setup resolver
  cachingDone = IntuneTestUtils.done(3, function() {
    createInitialPolicies(done);
  });

  // We need the location for the account before performing any operations
  client.getLocationByHostName(null, function(error, result) {
    should.not.exist(error);
    should.exist(result);
    should.exist(result.hostName);
    location = result.hostName;

    // Precache the list of available apps before running tests
    client.getApps(location, null, function(error, result, request, response) {
      should.not.exist(error);
      should.exist(result);
      response.statusCode.should.equal(200);

      result.length.should.be.greaterThan(0);

      iOSApps = result.filter(function(app) {
        return app.platform === 'ios';
      });

      androidApps = result.filter(function(app) {
        return app.platform === 'android';
      });

      cachingDone();
    });

    // Precache a device name
    client.getMAMUserDevices(location, userId, null, function(error, result, request, response) {
      should.not.exist(error);
      should.exist(result);
      response.statusCode.should.equal(200);

      result.length.should.be.greaterThan(0);

      deviceName = result[0].name;

      cachingDone();
    });

    // Precache a flagged user
    client.getMAMFlaggedUsers(location, null, function(error, result, request, response) {
      should.not.exist(error);
      should.exist(result);
      response.statusCode.should.equal(200);

      result.length.should.be.greaterThan(0);

      flaggedUser = result[0];

      cachingDone();
    });
  });
}

// Helper method that creates a single iOS and Android policies
function createInitialPolicies(done) {
  // Setup resolver
  done = IntuneTestUtils.done(2, done);

  var groupProperties = {
    properties: {
      url: baseUrl + '/providers/Microsoft.Intune/locations/' + location + '/groups/' + userGroups[0].objectId
    }
  };

  iOSPolicyId = suite.generateGuid();
  var iOSPolicyPayload = IntuneTestUtils.getPolicyPutPayload(IntuneTestUtils.PolicyType.iOS);
  client.ios.createOrUpdateMAMPolicy(location, iOSPolicyId, iOSPolicyPayload, null, function(error, result, request, response) {
    should.not.exist(error);
    should.exist(result);
    response.statusCode.should.equal(200);

    // Make sure policy is there
    client.ios.getMAMPolicyByName(location, iOSPolicyId, null, function(error, result, request, response) {
      should.not.exist(error);
      should.exist(result);
      response.statusCode.should.equal(200);

      // add a single group to policy
      client.ios.addGroupForMAMPolicy(location, iOSPolicyId, userGroups[0].objectId, groupProperties, null, function(error, result, request, response) {
        should.not.exist(error);
        response.statusCode.should.equalOneOf([200, 204]);

        done();
      });
    });
  });

  androidPolicyId = suite.generateGuid();
  var androidPolicyPayload = IntuneTestUtils.getPolicyPutPayload(IntuneTestUtils.PolicyType.Android);
  client.android.createOrUpdateMAMPolicy(location, androidPolicyId, androidPolicyPayload, null, function(error, result, request, response) {
    should.not.exist(error);
    should.exist(result);
    response.statusCode.should.equal(200);

    // Make sure policy is there
    client.android.getMAMPolicyByName(location, androidPolicyId, null, function(error, result, request, response) {
      should.not.exist(error);
      should.exist(result);
      response.statusCode.should.equal(200);

      client.android.addGroupForMAMPolicy(location, androidPolicyId, userGroups[0].objectId, groupProperties, null, function(error, result, request, response) {
        should.not.exist(error);
        response.statusCode.should.equalOneOf([200, 204]);

        done();
      });
    });
  });
}
