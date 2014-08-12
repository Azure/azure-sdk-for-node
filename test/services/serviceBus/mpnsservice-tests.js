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
var hubNamePrefix = 'xplathub';

var testPrefix = 'mpnsservice-tests';

describe('MPNS notifications', function () {
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
        mpns: {
          MpnsCertificate: process.env.AZURE_MPNS_CERTIFICATE,
          CertificateKey: process.env.AZURE_MPNS_CERTIFICATE_KEY
        }
      }, done);
    });

    it('should send a simple toast message', function (done) {
      notificationHubService.mpns.sendToast(
        null, 'Bold Text', 'This is normal text',
        function (error, result) {
          should.not.exist(error);
          result.statusCode.should.equal(201);

          done();
        });
    });

    it('should send a simple toast message with tags', function (done) {
      var tagsString = 'dogs';

      var executeSpy = sandbox.spy(notificationHubService, '_executeRequest');
      notificationHubService.mpns.sendToast(
        tagsString, 'Bold Text', 'This is normal text',
        function (error, result) {
          should.not.exist(error);
          result.statusCode.should.equal(201);

          executeSpy.args[0][0].headers['ServiceBusNotification-Tags'].should.equal(tagsString);
          executeSpy.args[0][0].headers['ServiceBusNotification-Format'].should.equal('windowsphone');

          done();
        });
    });

    it('should set wrong mpns type if asked to (and fail to send)', function (done) {
      var tagsString = 'dogs';

      var executeSpy = sandbox.spy(notificationHubService, '_executeRequest');
      notificationHubService.mpns.sendTile(
        tagsString, {
          backTitle: 'This is a tile'
        },
        {
          headers: {
            'X-WindowsPhone-Target': 'toast'
          }
        },
        function (error, result) {
          executeSpy.args[0][0].headers['ServiceBusNotification-Tags'].should.equal(tagsString);
          executeSpy.args[0][0].headers['X-WindowsPhone-Target'].should.equal('toast');
          executeSpy.args[0][0].headers['ServiceBusNotification-Format'].should.equal('windowsphone');

          done();
        });
    });

    it('should send a simple message', function (done) {
      notificationHubService.mpns.send(null,
        '<wp:Notification xmlns:wp=\"WPNotification\"><wp:Toast><wp:Text1>' +
        'Bold Text</wp:Text1><wp:Text2>This is normal text</wp:Text2></wp:Toast>' +
        '</wp:Notification>',
        'toast',
        '2',
        function (error, result) {
          should.not.exist(error);
          result.statusCode.should.equal(201);

          done();
        }
      );
    });

    it('should send a tile message', function (done) {
      notificationHubService.mpns.sendTile(null, 'attention',
        function (error, result) {
          should.not.exist(error);
          result.statusCode.should.equal(201);

          done();
        }
      );
    });
  });
});