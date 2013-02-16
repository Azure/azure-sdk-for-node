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

// Test includes
var testutil = require('../../util/util');
var notificationhubstestutil = require('../../util/notificationhubs-test-utils');

var testPrefix = 'notificationhubs-tests';

var hubNames;
var hubNamePrefix = 'xplathub';

describe('Notification hubs', function () {
  var service;

  before(function (done) {
    notificationhubstestutil.setUpTest(testPrefix, function (err, notificationHubService) {
      service = notificationHubService;

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

  after(function (done) {
    // Schedule deleting notification hubs
    _.each(hubNames, function (notificationHub) {
      service.deleteNotificationHub(notificationHub, function () {});
    });

    notificationhubstestutil.tearDownTest(service, testPrefix, done);
  });

  describe('Create notification hub', function () {
    it('should create a notification hub', function (done) {
      var hubName = testutil.generateId(hubNamePrefix, hubNames);

      service.createNotificationHub(hubName, function (err, hub) {
        should.not.exist(err);
        should.exist(hub);
        hub.NotificationHubName.should.equal(hubName);

        done();
      });
    });
  });

  describe('Delete a notification hub', function () {
    var hubName = testutil.generateId(hubNamePrefix, hubNames);

    before(function (done) {
      service.createNotificationHub(hubName, done);
    });

    it('should delete a notification hub', function (done) {
      service.deleteNotificationHub(hubName, function (err, hub) {
        should.not.exist(err);

        done();
      });
    });
  });

  describe('List notification hubs', function () {
    var hubName1 = testutil.generateId(hubNamePrefix, hubNames);
    var hubName2 = testutil.generateId(hubNamePrefix, hubNames);

    before(function (done) {
      service.createNotificationHub(hubName1, function () {
        service.createNotificationHub(hubName2, done);
      });
    });

    it('should list the existing hubs', function (done) {
      service.listNotificationHubs(function (err, hubs) {
        should.not.exist(err);

        var hubsFound = 0;
        _.each(hubs, function (hub) {
          if (hub.NotificationHubName === hubName1) {
            hubsFound += 1;
          } else if (hub.NotificationHubName === hubName2) {
            hubsFound += 2;
          }
        });

        hubsFound.should.equal(3);

        done();
      });
    });
  });

  describe('Get notification hubs', function () {
    var hubName = testutil.generateId(hubNamePrefix, hubNames);

    before(function (done) {
      service.createNotificationHub(hubName, done);
    });

    it('should get the existing hub', function (done) {
      service.getNotificationHub(hubName, function (err, hub) {
        should.not.exist(err);
        should.exist(hub);

        // Check a few properties to make sure the content seems correct
        hub.RegistrationTtl.should.not.be.null;
        hub.AuthorizationRules.should.not.be.null;

        done();
      });
    });
  });
});