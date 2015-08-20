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

var hubNames = [];
var hubNamePrefix = 'xplathubnxt';

var testPrefix = 'installation-management-tests';

describe('Installation Management tests', function () {
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
      service.listNotificationHubs(function (err, hubs, rsp) {
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

  describe('installations', function () {
    var hubName;
    var notificationHubService;

    beforeEach(function (done) {
      hubName = hubName = testutil.generateId(hubNamePrefix, hubNames, suiteUtil.isMocked);

      notificationHubService = azure.createNotificationHubService(hubName);
      suiteUtil.setupService(notificationHubService);
      service.createNotificationHub(hubName, done);
    });

    describe('createOrUpdate', function () {
      var installationId = '1234567';

      afterEach(function (done) {
        notificationHubService.deleteInstallation(installationId, done);
      });

      it('should work', function (done) {
        notificationHubService.createOrUpdateInstallation({
          installationId: installationId,
          pushChannel: 'http://db3.notify.windows.com/fake/superfake',
          platform: 'wns'
        }, function (error, response) {
          should.not.exist(error);

          done();
        });
      });
    });

    describe('get', function () {
      var installationId = '1234567';

      afterEach(function (done) {
        notificationHubService.deleteInstallation(installationId, done);
      });

      it('should work', function (done) {
        notificationHubService.getInstallation(installationId, function (error, installation, response) {
          should.not.exist(error);
          var id = installation.installationId;

          done();
        });
      });
    });
  });
});