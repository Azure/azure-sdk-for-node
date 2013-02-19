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

describe('APNS notifications', function () {
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

  describe('Send notification', function () {
    var hubName = testutil.generateId(hubNamePrefix, hubNames);

    before(function (done) {
      service.createNotificationHub(hubName, done);
    });

    it('should send a simple message', function (done) {
      service.apns.send(hubName, { 
        'aps' : { 
          'alert': 'This is my toast message for iOS!', 
        }, 
      }, function (error, result) {
        should.not.exist(error);
        result.statusCode.should.equal(201);

        done();
      });
    });
  });
});