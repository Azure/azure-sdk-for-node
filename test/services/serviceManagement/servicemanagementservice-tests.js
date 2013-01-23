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
var uuid = require('node-uuid');

var testutil = require('../../util/util');

var azure = testutil.libRequire('azure');

describe('Service Management', function () {
  var service;

  before(function () {
    var subscriptionId = process.env['AZURE_SUBSCRIPTION_ID'];
    var auth = { keyvalue: process.env['AZURE_CERTIFICATE_KEY'], certvalue: process.env['AZURE_CERTIFICATE'] };
    service = azure.createServiceManagementService(
      subscriptionId, auth,
      { serializetype: 'XML'});
  });

  describe('list locations', function () {
    it('should list all locations', function (done) {
      service.listLocations(function (err, response) {
        should.exist(response.body);
        should.exist(response.body.filter(function (location) {
          return location.DisplayName === 'West Europe' && 
                 location.Name === 'West Europe' &&
                 location.AvailableServices !== undefined &&
                 location.AvailableServices.AvailableService !== undefined &&
                 location.AvailableServices.AvailableService.length === 3
        }));

        done(err);
      });
    });
  });

  describe('hosted services', function () {
    var originalHostedServices;
    var hostedServiceName = 'xplatcli-' + uuid.v4().substr(0, 8);
    var hostedServiceLocation = 'West US';

    before(function (done) {
      service.listHostedServices(function (err, response) {
        originalHostedServices = response;

        service.createHostedService(hostedServiceName, { Location: hostedServiceLocation }, done);
      });
    });

    after(function (done) {
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
    var storageAccountName = 'xplatcli' + uuid.v4().substr(0, 8).replace(/-/g, '');
    var storageAccountLocation = 'West US';

    before(function (done) {
      service.listStorageAccounts(function (err, response) {
        originalStorageAccounts = response;

        service.createStorageAccount(storageAccountName, { Location: storageAccountLocation }, done);
      });
    });

    after(function (done) {
      service.deleteStorageAccount(storageAccountName, done);
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

        // TODO: fix issue with handling null values for description
        // response.body.StorageServiceProperties.Description.should.be.null

        response.body.StorageServiceProperties.Location.should.equal(storageAccountLocation);

        done(err);
      });
    });

    it('should get created storage account keys', function (done) {
      service.getStorageAccountKeys(storageAccountName, function (err, response) {
        should.not.exist(err);

        response.body.StorageServiceKeys.Primary.should.not.be.null;
        response.body.StorageServiceKeys.Secondary.should.not.be.null;

        done(err);
      });
    });
  });
});