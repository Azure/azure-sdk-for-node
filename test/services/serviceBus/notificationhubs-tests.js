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
var azureSb = require('azure-sb');

var hubNames = [];
var hubNamePrefix = 'xplathub';

var testPrefix = 'notificationhubservice-tests';

var tokenId = '0f744707bebcf74f9b7c25d48e3358945f6aa01da5ddb387462c7eaf61bbad78';

describe('Notification hubs', function () {
  var service;
  var suiteUtil;
  var sandbox;

  before(function (done) {
    sandbox = sinon.sandbox.create();

    service = azureSb.createServiceBusService()
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
    var deleteHubs = function (hubs) {
      if (hubs.length === 0) {
        suiteUtil.baseTeardownTest(done);
      } else {
        var currentHub = hubs.pop();
        service.deleteNotificationHub(currentHub, function () {
          deleteHubs(hubs);
        });
      }
    };

    deleteHubs(hubNames);
  });

  describe('Create notification hub', function () {
    var sandbox;

    beforeEach(function (done) {
      sandbox = sinon.sandbox.create();

      done();
    });

    afterEach(function (done) {
      sandbox.restore();

      done();
    });

    it('should create a notification hub', function (done) {
      var hubName = testutil.generateId(hubNamePrefix, hubNames, suiteUtil.isMocked);

      service.createNotificationHub(hubName, function (err, hub) {
        should.not.exist(err);
        should.exist(hub);
        hub.NotificationHubName.should.equal(hubName);

        done();
      });
    });

    it('should create a notification hub with credentials', function (done) {
      var hubName = testutil.generateId(hubNamePrefix, hubNames, suiteUtil.isMocked);

      var credentials = {
        wns: {
          PackageSid: 'secret1',
          SecretKey: 'secret2'
        },
        apns: {
          ApnsCertificate: 'secret1',
          CertificateKey: 'secret2'
        }
      };

      sandbox.stub(service, '_executeRequest', function (webResource, payload, resultHandler, validators, callback) {
        payload.should.include('<WnsCredential><Properties><Property><Name>PackageSid</Name><Value>secret1</Value></Property>' +
          '<Property><Name>SecretKey</Name><Value>secret2</Value></Property></Properties></WnsCredential>' +
          '<ApnsCredential><Properties><Property><Name>ApnsCertificate</Name><Value>secret1</Value></Property>' +
          '<Property><Name>CertificateKey</Name><Value>secret2</Value></Property></Properties></ApnsCredential>');

        callback(undefined, { NotificationHubName: hubName });
      });

      service.createNotificationHub(hubName, credentials, function (err, hub) {
        should.not.exist(err);
        should.exist(hub);
        hub.NotificationHubName.should.equal(hubName);

        done();
      });
    });
  });

  describe('Delete a notification hub', function () {
    var hubName;

    beforeEach(function (done) {
      hubName = testutil.generateId(hubNamePrefix, hubNames, suiteUtil.isMocked);
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
    var hubName1;
    var hubName2;

    beforeEach(function (done) {
      hubName1 = testutil.generateId(hubNamePrefix, hubNames, suiteUtil.isMocked);
      hubName2 = testutil.generateId(hubNamePrefix, hubNames, suiteUtil.isMocked);

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
    var hubName;

    beforeEach(function (done) {
      hubName = testutil.generateId(hubNamePrefix, hubNames, suiteUtil.isMocked);

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

  describe('Send template messages', function () {
    var hubName;
    var notificationHubService;

    beforeEach(function (done) {
      hubName = testutil.generateId(hubNamePrefix, hubNames, suiteUtil.isMocked);

      service.createNotificationHub(hubName, {
          apns: {
            ApnsCertificate: process.env.AZURE_APNS_CERTIFICATE,
            CertificateKey: process.env.AZURE_APNS_CERTIFICATE_KEY,
            Endpoint: 'pushtestservice2.cloudapp.net'
          }
        }, done);
    });

    it('should be able to send a template message', function (done) {
      notificationHubService = azure.createNotificationHubService(hubName);
      suiteUtil.setupService(notificationHubService);

      var executeSpy = sandbox.spy(notificationHubService, '_executeRequest');

      notificationHubService.send(null, { property: 'value' }, function (err) {
        should.not.exist(err);

        // Body
        var body = JSON.parse(executeSpy.args[0][1]);

        should.exist(body['property']);
        body['property'].should.equal('value');

        done();
      });
    });
  });

  describe('tags', function () {
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
        }, function () {
          notificationHubService.apns.createTemplateRegistration(
            tokenId,
            ['tag1', 'tag3'],
            {
              alert: '$(alertMessage1)'
            },
            function (error, reg) {
              notificationHubService.apns.createTemplateRegistration(
                tokenId,
                'tag2',
                {
                  alert: '$(alertMessage1)'
                },
                function (error, reg) {
                  done();
                });
            });
      });
    });

    it('should be able to send a template message to multiple tags', function (done) {
      notificationHubService = azure.createNotificationHubService(hubName);
      suiteUtil.setupService(notificationHubService);

      var executeSpy = sandbox.spy(notificationHubService, '_executeRequest');

      notificationHubService.send(['tag1', 'tag2', 'tag3'], { property: 'value' }, function (err) {
        should.not.exist(err);

        // Body
        var body = JSON.parse(executeSpy.args[0][1]);

        should.exist(body['property']);
        body['property'].should.equal('value');

        done();
      });
    });
  });

  describe('Shared Access Signature', function () {
    var notificationHubService;
    var notificationListenHubService;
    var hubName;

    beforeEach(function (done) {
      hubName = testutil.generateId(hubNamePrefix, hubNames, suiteUtil.isMocked);

      service.createNotificationHub(hubName, {
          apns: {
            ApnsCertificate: process.env.AZURE_APNS_CERTIFICATE,
            CertificateKey: process.env.AZURE_APNS_CERTIFICATE_KEY,
            Endpoint: 'pushtestservice2.cloudapp.net'
          }
        },
        function () {
          var setupHub = function () {
            service.getNotificationHub(hubName, function (err, hub) {
              if (err) {
                setupHub();
              } else {
                var fullRule = hub.AuthorizationRules.AuthorizationRule.filter(function (rule) {
                  return rule.KeyName === 'DefaultFullSharedAccessSignature';
                })[0];

                var endpoint = 'https://' + process.env.AZURE_SERVICEBUS_NAMESPACE + '.servicebus.windows.net';
                notificationHubService = azure.createNotificationHubService(hubName, endpoint, fullRule.KeyName, fullRule.PrimaryKey);
                suiteUtil.setupService(notificationHubService);

                var listenRule = hub.AuthorizationRules.AuthorizationRule.filter(function (rule) {
                  return rule.KeyName === 'DefaultListenSharedAccessSignature';
                })[0];

                endpoint = 'https://' + process.env.AZURE_SERVICEBUS_NAMESPACE + '.servicebus.windows.net';
                notificationListenHubService = azure.createNotificationHubService(hubName, endpoint, listenRule.KeyName, listenRule.PrimaryKey);
                suiteUtil.setupService(notificationListenHubService);

                done();
              }
            });
          };

          setupHub();
        });
    });

    it('should be able to execute an operation', function (done) {
      notificationHubService.apns.send(null, {
        alert: 'This is my toast message for iOS!'
      }, function (error, result) {
        should.not.exist(error);
        result.statusCode.should.equal(201);

        done();
      });
    });

    it('should not be able to execute a send operation with listen rights only', function (done) {
      notificationListenHubService.apns.send(null, { 
        alert: 'This is my toast message for iOS!'
      }, function (error, result) {
        should.exist(error);
        result.statusCode.should.equal(401);

        done();
      });
    });
  });

  describe('create registration identifier', function () {
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
        }, function () {
        done();
      });
    });

    it('should work', function (done) {
      service.getNotificationHub(hubName, function (err, hub) {
        notificationHubService.createRegistrationId(function (err, registrationId, rsp) {
          should.not.exist(err);
          should.exist(registrationId);
          should.exist(rsp);

          done();
        });
      });
    });

    it('should be able to use the registration identifier', function (done) {
      service.getNotificationHub(hubName, function (err, hub) {
        notificationHubService.createRegistrationId(function (err, registrationId, rsp) {
          should.not.exist(err);
          should.exist(registrationId);
          should.exist(rsp);

          notificationHubService.apns.createOrUpdateTemplateRegistration(
            registrationId,
            tokenId,
            null,
            {
              alert: '$(alertMessage1)'
            },
            function (error) {
              should.not.exist(error);

              notificationHubService.getRegistration(registrationId, function (err, getRegistration) {
                should.not.exist(err);
                should.exist(getRegistration);

                // Create or update again to test update. This time with the raw createOrUpdate.
                getRegistration.BodyTemplate = JSON.stringify({ aps: { alert: '$(alertMessage2)' } });
                notificationHubService.createOrUpdateRegistration(
                  getRegistration,
                  function (error) {
                    should.not.exist(error);

                    done();
                  });
              });
            });
        });
      });
    });
  });

  describe('update registration', function () {
    var hubName;
    var notificationHubService;
    var registration;

    beforeEach(function (done) {
      hubName = testutil.generateId(hubNamePrefix, hubNames, suiteUtil.isMocked);

      notificationHubService = azure.createNotificationHubService(hubName);

      suiteUtil.setupService(notificationHubService);
      service.createNotificationHub(hubName, function () {
        notificationHubService.apns.createTemplateRegistration(
          tokenId,
          null,
          {
            alert: '$(alertMessage1)'
          },
          function (error, reg) {
            notificationHubService.getRegistration(reg.RegistrationId, function (err, getRegistration) {
              registration = getRegistration;

              done();
            });
          });
      });
    });

    it('should work', function (done) {
      notificationHubService.updateRegistration(registration, function (err) {
        should.not.exist(err);

        done();
      });
    });
  });

  describe('Initiating service', function () {
    originalNamespace = process.env.AZURE_SERVICEBUS_NAMESPACE;
    originalKey = process.env.AZURE_SERVICEBUS_ACCESS_KEY;

    beforeEach(function (done) {
      var originalNamespace = process.env.AZURE_SERVICEBUS_NAMESPACE;
      var originalKey = process.env.AZURE_SERVICEBUS_ACCESS_KEY;

      delete process.env.AZURE_SERVICEBUS_NAMESPACE;
      delete process.env.AZURE_SERVICEBUS_ACCESS_KEY;

      done();
    });

    afterEach(function (done) {
      process.env.AZURE_SERVICEBUS_NAMESPACE = originalNamespace;
      process.env.AZURE_SERVICEBUS_ACCESS_KEY = originalKey;

      done();
    });

    it('should work with no service bus credentials', function (done) {
      var notificationHubService = azure.createNotificationHubService('portal12', 'https://todons.servicebus.windows.net',
        'DefaultFullSharedAccessSignature',
        'key');

      should.exist(notificationHubService);

      done();
    });

    it('should work with sb endpoints', function (done) {
      var notificationHubService = azure.createNotificationHubService('portal12', 'sb://todons.servicebus.windows.net',
        'DefaultFullSharedAccessSignature',
        'key');

      should.exist(notificationHubService);

      done();
    });

    it('should work with connection strings', function (done) {
      var notificationHubService = azure.createNotificationHubService('portal12', 'Endpoint=sb://todons.servicebus.windows.net;SharedAccessKeyName=DefaultFullSharedAccessSignature;SharedAccessKey=key');

      should.exist(notificationHubService);

      done();
    });
  });
});