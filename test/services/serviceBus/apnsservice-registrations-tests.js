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

var _ = require('underscore');

var should = require('should');
var sinon = require('sinon');
// Test includes
var testutil = require('../../util/util');
var notificationhubstestutil = require('../../framework/notificationhubs-test-utils');

var azure = testutil.libRequire('azure');

var HeaderConstants = azure.Constants.HeaderConstants;

var tokenId = '0f744707bebcf74f9b7c25d48e3358945f6aa01da5ddb387462c7eaf61bbad78';

var hubNames = [];
var hubNamePrefix = 'xplathubnxt';

var testPrefix = 'apnsservice-registrations-tests';

describe('APNS notifications registrations', function () {
  var service;
  var suiteUtil;
  var sandbox;

  before(function (done) {
    sandbox = sinon.sandbox.create();

    service = azure.createServiceBusService()
      .withFilter(new azure.ExponentialRetryPolicyFilter());

    suiteUtil = notificationhubstestutil.createNotificationHubsTestUtils(service, testPrefix);
    suiteUtil.setupSuite(done);
  });

  after(function (done) {
    sandbox.restore();
    suiteUtil.teardownSuite(done);
  });

  beforeEach(function (done) {
    suiteUtil.setupTest(function () {
      service.listNotificationHubs(function (err, hubs) {
        should.not.exist(err);
        var xplatHubs = hubs.filter(function (hub) {
          return hub.NotificationHubName.substr(0, hubNamePrefix.length) === hubNamePrefix;
        });

        _.each(xplatHubs, function (hub) {
          service.deleteNotificationHub(hub.NotificationHubName, function () { });
        });

        done();
      });
    });
  });

  afterEach(function (done) {
    // Schedule deleting notification hubs
    _.each(hubNames, function (notificationHub) {
      service.deleteNotificationHub(notificationHub, function () { });
    });

    suiteUtil.baseTeardownTest(done);
  });

  describe('registrations', function () {
    var hubName;
    var notificationHubService;

    beforeEach(function (done) {
      hubName = testutil.generateId(hubNamePrefix, hubNames, suiteUtil.isMocked);

      notificationHubService = azure.createNotificationHubService(hubName);

      suiteUtil.setupService(notificationHubService);
      service.createNotificationHub(hubName, {
        apns: {
          ApnsCertificate: process.env.AZURE_APNS_CERTIFICATE,
          CertificateKey: process.env.AZURE_APNS_CERTIFICATE_KEY,
          Endpoint: 'pushtestservice2.cloudapp.net'
        }
      }, done);
    });

    describe('native', function () {
      describe('create', function () {
        var registrationId;

        afterEach(function (done) {
          notificationHubService.deleteRegistration(registrationId, done);
        });

        it('should work', function (done) {
          notificationHubService.apns.createNativeRegistration(tokenId, null, function (error, registration) {
            should.not.exist(error);
            registrationId = registration.RegistrationId;

            done();
          });
        });
      });

      describe('list', function () {
        beforeEach(function (done) {
          notificationHubService.apns.createNativeRegistration(tokenId, ['mytag'], done);
        });

        it('should work without filtering', function (done) {
          notificationHubService.listRegistrations(function (err, list) {
            should.not.exist(err);
            should.exist(list);
            list.length.should.equal(1);

            done();
          });
        });

        it('should work with tag filtering with the wrong tag', function (done) {
          notificationHubService.listRegistrationsByTag('tag', { top: 10, skip: 0 }, function (err, list) {
            should.not.exist(err);
            should.exist(list);
            list.length.should.equal(0);

            done();
          });
        });

        it('should work with tag filtering with the right tag', function (done) {
          notificationHubService.listRegistrationsByTag('mytag', { top: 10, skip: 0 }, function (err, list) {
            should.not.exist(err);
            should.exist(list);
            list.length.should.equal(1);

            done();
          });
        });

        it('should work with token filtering', function (done) {
          notificationHubService.apns.listRegistrationsByToken(tokenId, { top: 10, skip: 0 }, function (err, list, rsp) {
            should.not.exist(err);
            should.exist(list);
            list.length.should.equal(1);

            done();
          });
        });
      });
    });

    describe('template', function () {
      describe('create alert', function () {
        var registrationId;

        afterEach(function (done) {
          notificationHubService.deleteRegistration(registrationId, done);
        });

        it('should work', function (done) {
          var executeSpy = sandbox.spy(notificationHubService, '_executeRequest');
          notificationHubService.apns.createTemplateRegistration(
            tokenId,
            null,
            {
              alert: '$(alertMessage1)'
            },
            function (error, registration) {
              should.not.exist(error);
              registrationId = registration.RegistrationId;
              executeSpy.args[0][1].should.match(/\<BodyTemplate\>\<\!\[CDATA\[{"aps":{"alert":"\$\(alertMessage1\)"}}\]\]\>\<\/BodyTemplate\>/);

              done();
            });
        });

        it('should work when payload matches APNS specs', function (done) {
          var executeSpy = sandbox.spy(notificationHubService, '_executeRequest');
          notificationHubService.apns.createTemplateRegistration(
            tokenId,
            null,
            {
              aps: {
                alert: '$(alertMessage1)'
              }
            },
            function (error, registration) {
              should.not.exist(error);
              registrationId = registration.RegistrationId;

              executeSpy.args[0][1].should.match(/\<BodyTemplate\>\<\!\[CDATA\[{"aps":{"alert":"\$\(alertMessage1\)"}}\]\]\>\<\/BodyTemplate\>/);

              done();
            });
        });

        it('should work when payload matches APNS specs and has extra data', function (done) {
          var executeSpy = sandbox.spy(notificationHubService, '_executeRequest');
          notificationHubService.apns.createTemplateRegistration(
            tokenId,
            null,
            {
              aps: {
                alert: '$(alertMessage1)'
              },
              extraData: '$(data)'
            },
            function (error, registration) {
              should.not.exist(error);
              registrationId = registration.RegistrationId;

              executeSpy.args[0][1].should.match(/\<BodyTemplate\>\<\!\[CDATA\[{"aps":{"alert":"\$\(alertMessage1\)"},"extraData":"\$\(data\)"}\]\]\>\<\/BodyTemplate\>/);

              done();
            });
        });
      });

      describe('update alert', function () {
        var registrationId;
        var executeSpy;

        beforeEach(function (done) {
          executeSpy = sandbox.spy(notificationHubService, '_executeRequest');
          notificationHubService.apns.createTemplateRegistration(
            tokenId,
            null,
            {
              alert: '$(alertMessage1)'
            },
            function (error, registration) {
              should.not.exist(error);
              registrationId = registration.RegistrationId;

              executeSpy.args[0][1].should.match(/\<BodyTemplate\>\<\!\[CDATA\[{"aps":{"alert":"\$\(alertMessage1\)"}}\]\]\>\<\/BodyTemplate\>/);

              // Current version of sinon does not appear to support multiple calls on same spy.
              sandbox.restore();

              done();
            });
        });

        afterEach(function (done) {
          notificationHubService.deleteRegistration(registrationId, done);
        });

        it('should work', function (done) {
          executeSpy = sandbox.spy(notificationHubService, '_executeRequest');
          notificationHubService.apns.updateTemplateRegistration(
            registrationId,
            tokenId,
            null,
            {
              alert: '$(newAlertMessage1)'
            },
            function (error) {
              should.not.exist(error);

              executeSpy.args[0][1].should.match(/\<BodyTemplate\>\<\!\[CDATA\[{"aps":{"alert":"\$\(newAlertMessage1\)"}}\]\]\>\<\/BodyTemplate\>/);

              done();
            });
        });

        it('should work when payload member exists', function (done) {
          executeSpy = sandbox.spy(notificationHubService, '_executeRequest');
          notificationHubService.apns.updateTemplateRegistration(
            registrationId,
            tokenId,
            null,
            {
              alert: '$(newAlertMessage1)',
              payload: {
                data1: '$(data1)',
                data2: '$(data2)',
              }
            },
            function (error) {
              should.not.exist(error);

              executeSpy.args[0][1].should.match(/\<BodyTemplate\>\<\!\[CDATA\[{"aps":{"alert":"\$\(newAlertMessage1\)"},"data1":"\$\(data1\)","data2":"\$\(data2\)"}\]\]\>\<\/BodyTemplate\>/);

              done();
            });
        });

        it('should work when aps exists without modifying payload as extra data', function (done) {
          executeSpy = sandbox.spy(notificationHubService, '_executeRequest');
          notificationHubService.apns.updateTemplateRegistration(
            registrationId,
            tokenId,
            null,
            {
              aps: { alert: '$(newAlertMessage1)' },
              payload: {
                data1: '$(data1)',
                data2: '$(data2)',
              }
            },
            function (error) {
              should.not.exist(error);

              executeSpy.args[0][1].should.match(/\<BodyTemplate\>\<\!\[CDATA\[{"aps":{"alert":"\$\(newAlertMessage1\)"},"payload":{"data1":"\$\(data1\)","data2":"\$\(data2\)"}}\]\]\>\<\/BodyTemplate\>/);

              done();
            });
        });
      });
    });
  });
});