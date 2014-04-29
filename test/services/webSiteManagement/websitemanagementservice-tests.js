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

var should = require('should');

var testutil = require('../../util/util');

var azure = testutil.libRequire('azure');
var MockedTestUtils = require('../../framework/mocked-test-utils');

var testPrefix = 'websitemanagementservice-tests';

var siteNamePrefix = 'websitesdk';
var siteNames = [];

describe('Website Management', function () {
  var service;
  var suiteUtil;

  before(function (done) {
    var subscriptionId = process.env['AZURE_SUBSCRIPTION_ID'];
    var auth = testutil.getAuthenticationCertificate();
    service = azure.createWebsiteManagementService(
      subscriptionId, auth,
      { serializetype: 'XML'});

    service.strictSSL = false;
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

  describe('listWebspaces', function () {
    it('should work', function (done) {
      service.listWebspaces(function (err, webspaces) {
        should.exist(webspaces);
        webspaces.length.should.be.above(0);
        webspaces[0].AvailabilityState.should.not.be.null;
        webspaces[0].ComputeMode.should.not.be.null;
        webspaces[0].CurrentNumberOfWorkers.should.not.be.null;
        webspaces[0].CurrentWorkerSize.should.not.be.null;
        webspaces[0].GeoLocation.should.not.be.null;
        webspaces[0].GeoRegion.should.not.be.null;
        webspaces[0].Name.should.not.be.null;
        webspaces[0].NumberOfWorkers.should.not.be.null;

        done();
      });
    });
  });

  describe('listGeoRegions', function () {
    it('should work', function (done) {
      service.listGeoRegions(function (err, geoRegions) {
        should.exist(geoRegions);
        geoRegions.length.should.be.above(0);
        geoRegions[0].Name.should.not.be.null;

        done();
      });
    });
  });

  describe('listDNSSuffix', function () {
    it('should work', function (done) {
      service.listDNSSuffix(function (err, suffix) {
        should.exist(suffix);
        suffix.should.equal('azurewebsites.net');

        done();
      });
    });
  });

  describe('sites', function () {
    describe('create site', function () {
      var siteName;
      var webspace;

      beforeEach(function (done) {
        service.listWebspaces(function (err, webspaces) {
          webspace = webspaces[0];

          done();
        });
      });

      afterEach(function (done) {
        service.deleteSite(webspace.Name, siteName, done);
      });

      it('should work', function (done) {
        siteName = testutil.generateId(siteNamePrefix, siteNames, suiteUtil.isMocked);

        var siteProperties = {
          HostNames: {
            '$': { 'xmlns:a': 'http://schemas.microsoft.com/2003/10/Serialization/Arrays' },
            'a:string': [ siteName + '.azurewebsites.net' ]
          },
          Name: siteName,
          WebSpace: webspace.Name
        };

        service.createSite(webspace.Name, siteName, siteProperties, function (err) {
          should.not.exist(err);

          done();
        });
      });
    });

    describe('when a site exists', function () {
      var webspace;
      var siteName;

      beforeEach(function (done) {
        siteName = testutil.generateId(siteNamePrefix, siteNames, suiteUtil.isMocked);

        service.listWebspaces(function (err, webspaces) {
          webspace = webspaces[0];

          var siteProperties = {
            HostNames: {
              '$': { 'xmlns:a': 'http://schemas.microsoft.com/2003/10/Serialization/Arrays' },
              'a:string': [ siteName + '.azurewebsites.net' ]
            },
            Name: siteName,
            WebSpace: webspace.Name
          };

          service.createSite(webspace.Name, siteName, siteProperties, done);
        });
      });

      afterEach(function (done) {
        service.deleteSite(webspace.Name, siteName, done);
      });

      it('should list the site', function (done) {
        service.listSites(webspace.Name, function (err, sites) {
          should.not.exist(err);

          sites.some(function (s) {
            return s.Name === siteName;
          }).should.be.true;

          done();
        });
      });

      it('should show the site', function (done) {
        service.getSite(webspace.Name, siteName, function (err, site) {
          should.not.exist(err);
          site.Name.should.equal(siteName);

          done();
        });
      });
    });
  });
});