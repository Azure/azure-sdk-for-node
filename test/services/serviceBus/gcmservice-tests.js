/**
* Copyright (c) Microsoft.  All rights reserved.
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*   http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/

var _ = require('underscore');

var should = require('should');
var sinon = require('sinon');

// Test includes
var testutil = require('../../util/util');
var notificationhubstestutil = require('../../framework/notificationhubs-test-utils');

var azure = testutil.libRequire('azure');

var HeaderConstants = azure.Constants.HeaderConstants;

var hubNames = [];
var hubNamePrefix = 'xplathub';

var testPrefix = 'gcmservice-tests';

describe('GCM notifications', function () {
  var service;
  var suiteUtil;
  var sandbox;

  before(function (done) {
    sandbox = sinon.sandbox.create();

    service = azure.createServiceBusService();
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

  describe('Send notification', function () {
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

    it('should send a simple message', function (done) {
      notificationHubService.gcm.send(null, {
        'collapse_key': 'score_update',
        'time_to_live': 108,
        'delay_while_idle': true,
        'data': {
          'score': '4x8',
          'time': '15:16.2342'
        }
      },
      function (error, result) {
          should.not.exist(error);
          result.statusCode.should.equal(201);

          done();
        });
    });

    it('should send a simple message with tags', function (done) {
      var tagsString = 'dogs';

      var executeSpy = sandbox.spy(notificationHubService, '_executeRequest');
      notificationHubService.gcm.send(
        tagsString, {
          collapse_key: 'score_update',
          time_to_live: 108,
          delay_while_idle: true,
          data: {
            score: '4x8',
            time: '15:16.2342'
          }
        },
        function (error, result) {
          should.not.exist(error);
          result.statusCode.should.equal(201);

          executeSpy.args[0][0].headers[HeaderConstants.SERVICE_BUS_NOTIFICATION_TAGS].should.equal(tagsString);
          executeSpy.args[0][0].headers[HeaderConstants.SERVICE_BUS_NOTIFICATION_FORMAT].should.equal('gcm');

          done();
        }
      );
    });
  });
});