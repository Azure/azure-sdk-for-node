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

var gcmRegistrationId = 'id1';

var hubNames = [];
var hubNamePrefix = 'xplathubnxt';

var testPrefix = 'gcmservice-registrations-tests';

describe('GCM notifications registrations', function () {
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
        var xplatHubs = hubs.filter(function (hub) {
          return hub.NotificationHubName.substr(0, hubNamePrefix.length) === hubNamePrefix;
        });

        _.each(xplatHubs, function (hub) {
          service.deleteNotificationHub(hub.NotificationHubName, function () {});
        });

        done();
      });
    });
  });

  afterEach(function (done) {
    // Schedule deleting notification hubs
    _.each(hubNames, function (notificationHub) {
      service.deleteNotificationHub(notificationHub, function () {});
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
          gcm: {
            GoogleApiKey: process.env.AZURE_GCM_KEY,
            GcmEndpoint: 'http://pushtestservice2.cloudapp.net/gcm/send'
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
          notificationHubService.gcm.createNativeRegistration(gcmRegistrationId, null, function (error, registration) {
            should.not.exist(error);
            registrationId = registration.RegistrationId;

            done();
          });
        });
      });

      describe('list', function () {
        beforeEach(function (done) {
          notificationHubService.gcm.createNativeRegistration(gcmRegistrationId, [ 'mytag'], done);
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

        it('should work with registration id filtering', function (done) {
          notificationHubService.gcm.listRegistrationsByGcmRegistrationId(gcmRegistrationId, { top: 10, skip: 0 }, function (err, list, rsp) {
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
          notificationHubService.gcm.createTemplateRegistration(
            gcmRegistrationId,
            null,
            {
              'collapse_key': 'score_update',
              'time_to_live': 108,
              'delay_while_idle': true,
              data: {
                score: '4x8',
                time: '15:16.2342'
              }
            },
            function (error, registration) {
              should.not.exist(error);
              registrationId = registration.RegistrationId;

              done();
            });
        });
      });

      describe('update alert', function () {
        var registrationId;

        beforeEach(function (done) {
          notificationHubService.gcm.createTemplateRegistration(
            gcmRegistrationId,
            null,
            {
              'collapse_key': 'score_update',
              'time_to_live': 108,
              'delay_while_idle': true,
              data: {
                score: '4x8',
                time: '15:16.2342'
              }
            },
            function (error, registration) {
              should.not.exist(error);
              registrationId = registration.RegistrationId;

              done();
            });
        });

        afterEach(function (done) {
          notificationHubService.deleteRegistration(registrationId, done);
        });

        it('should work', function (done) {
          notificationHubService.gcm.updateTemplateRegistration(
            registrationId,
            gcmRegistrationId,
            null,
            {
              'collapse_key': '$(collapse_key)',
              'time_to_live': 108,
              'delay_while_idle': true,
              data: {
                score: '4x8',
                time: '15:16.2342'
              }
            },
            function (error) {
              should.not.exist(error);

              done();
            });
        });
      });
    });
  });
});