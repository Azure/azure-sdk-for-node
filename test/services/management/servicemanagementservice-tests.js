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

var should = require('should');
var mocha = require('mocha');
var _ = require('underscore');

var testutil = require('../../util/util');
var MockedTestUtils = require('../../framework/mocked-test-utils');

var azure = testutil.libRequire('azure');

var testPrefix = 'serviceManagement-tests';

var storageaccounts = [];
var hostedservices = [];

describe('Service Management', function () {
  var service;
  var suiteUtil;

  before(function (done) {
    var subscriptionId = process.env['AZURE_SUBSCRIPTION_ID'];
    var auth = { keyvalue: testutil.getCertificateKey(), certvalue: testutil.getCertificate() };
    service = azure.createServiceManagementService(
      subscriptionId, auth,
      { serializetype: 'XML'});

    suiteUtil = new MockedTestUtils(service, testPrefix);
    suiteUtil.setupSuite(done);
  });

  after(function (done) {
    suiteUtil.teardownSuite(done);
  });

  beforeEach(function (done) {
    suiteUtil.setupTest(done);
  });

  afterEach(function (done) {
    suiteUtil.baseTeardownTest(done);
  });

  describe('list locations', function () {
    it('should return locations', function (done) {
      service.listLocations(function (err, response) {
        should.exist(response.body);
        should.exist(response.body.filter(function (location) {
          return location.DisplayName === 'West Europe' && 
                 location.Name === 'West Europe' &&
                 location.AvailableServices !== undefined &&
                 location.AvailableServices.AvailableService !== undefined &&
                 _.isArray(location.AvailableServices.AvailableService)
        }));

        // there is more than one location
        response.body.length.should.be.above(1);

        done(err);
      });
    });
  });

  describe('hosted services', function () {
    var originalHostedServices;
    var hostedServiceName;
    var hostedServiceLocation = 'West US';

    beforeEach(function (done) {
      hostedServiceName = testutil.generateId('nodesdk', hostedservices, suiteUtil.isMocked);
      service.listHostedServices(function (err, response) {
        originalHostedServices = response;

        service.createHostedService(hostedServiceName, { Location: hostedServiceLocation }, done);
      });
    });

    afterEach(function (done) {
      service.deleteHostedService(hostedServiceName, done);
    });

    it('should list created hosted service', function (done) {
      service.listHostedServices(function (err, response) {
        should.not.exist(err);
        should.exist(response.body.filter(function (hostedService) {
          return hostedService.ServiceName === hostedServiceName;
        }));

        done(err);
      });
    });

    it('should get created hosted service', function (done) {
      service.getHostedService(hostedServiceName, function (err, response) {
        should.not.exist(err);

        response.body.ServiceName.should.equal(hostedServiceName);
        response.body.HostedServiceProperties.Description.should.equal('Service host');
        response.body.HostedServiceProperties.Location.should.equal(hostedServiceLocation);
        response.body.HostedServiceProperties.Status.should.equal('Created');

        done(err);
      });
    });

    it('should get created hosted service properties', function (done) {
      service.getHostedServiceProperties(hostedServiceName, function (err, response) {
        should.not.exist(err);

        response.body.ServiceName.should.equal(hostedServiceName);
        response.body.HostedServiceProperties.Description.should.equal('Service host');
        response.body.HostedServiceProperties.Location.should.equal(hostedServiceLocation);
        response.body.HostedServiceProperties.Status.should.equal('Created');

        done(err);
      });
    });

    it('should get created hosted service properties', function (done) {
      service.getHostedServiceProperties(hostedServiceName, function (err, response) {
        should.not.exist(err);

        response.body.ServiceName.should.equal(hostedServiceName);
        response.body.HostedServiceProperties.Description.should.equal('Service host');
        response.body.HostedServiceProperties.Location.should.equal(hostedServiceLocation);
        response.body.HostedServiceProperties.Status.should.equal('Created');

        done(err);
      });
    });
  });

  describe('storage accounts', function () {
    var originalStorageAccounts;
    var storageAccountLocation = 'West US';
    var storageAccountName;

    beforeEach(function (done) {
      storageAccountName = testutil.generateId('nodesdk', storageaccounts, suiteUtil.isMocked);

      service.listStorageAccounts(function (err, response) {
        originalStorageAccounts = response;

        service.createStorageAccount(storageAccountName, { Location: storageAccountLocation }, done);
      });
    });

    afterEach(function (done) {
      var deleteStorage = function() {
        setTimeout(function () {
          service.deleteStorageAccount(storageAccountName, function (err) {
            if (err) {
              deleteStorage();
            } else {
              done();
            }
          });
        }, (suiteUtil.isMocked && !suiteUtil.isRecording) ? 0 : 10000);
      };

      deleteStorage();
    });

    it('should list storage accounts', function (done) {
      service.listStorageAccounts(function (err, response) {
        should.not.exist(err);

        should.exist(response.body.filter(function (storageAccount) {
          return storageAccount.ServiceName === storageAccountName;
        }));

        done(err);
      });
    });

    it('should get created storage account properties', function (done) {
      service.getStorageAccountProperties(storageAccountName, function (err, response) {
        should.not.exist(err);

        response.body.ServiceName.should.equal(storageAccountName);

        response.body.StorageServiceProperties.Description.should.be.null
        response.body.StorageServiceProperties.Location.should.equal(storageAccountLocation);

        done(err);
      });
    });

    it('should get created storage account keys', function (done) {
      var attempts = 0;

      var executeTest = function () {
        service.getStorageAccountKeys(storageAccountName, function (err, response) {
          if (!err || attempts >= 3) {
            should.not.exist(err);

            response.body.StorageServiceKeys.Primary.should.not.be.null;
            response.body.StorageServiceKeys.Secondary.should.not.be.null;

            done();
          } else {
            attempts++;

            // Retry in 5 seconds
            setTimeout(executeTest, (suiteUtil.isMocked && !suiteUtil.isRecording) ? 0 : 5000);
          }
        });
      };

      executeTest();
    });
  });

  describe('virtual networks', function () {
    it('should set network configuration', function (done) {
      var vnetObject = {
        VirtualNetworkConfiguration: {
          VirtualNetworkSites: [
            {
              Name: 'test',
              AffinityGroup: 'test-ag',
              AddressSpace: ['10.0.0.0/20'],
              Subnets: [
                {
                  Name: 'sub1',
                  AddressPrefix: '10.0.0.0/23'
                }
              ]
            }
          ]
        }
      };

      service.setNetworkConfig(vnetObject, function (err, response) {
        should.not.exist(err);

        done(err);
      });
    });

    it('should get network configuration', function (done) {
      service.getNetworkConfig(function (err, response) {
        should.not.exist(err);

        var configuration = response.body;
        configuration.VirtualNetworkConfiguration.VirtualNetworkSites[0].AddressSpace[0].should.equal('10.0.0.0/20');
        configuration.VirtualNetworkConfiguration.VirtualNetworkSites[0].Subnets[0].AddressPrefix.should.equal('10.0.0.0/23');

        done(err);
      });
    });
  });
});