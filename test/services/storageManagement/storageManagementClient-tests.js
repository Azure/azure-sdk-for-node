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

var fs = require('fs');

var should = require('should');

var testutil = require('../../util/util');

var azure = testutil.libRequire('azure');
var CertificateCloudCredentials = azure.CertificateCloudCredentials;
var MockedTestUtils = require('../../framework/mocked-test-utils');

var testPrefix = 'storagemanagementservice-tests';

var siteNamePrefix = 'storagesdk';
var siteNames = [];

describe('Storage Management', function () {
  var service;
  var suiteUtil;

  before(function (done) {
    var subscriptionId = process.env['AZURE_SUBSCRIPTION_ID'];
    service = azure.createStorageManagementClient(new CertificateCloudCredentials({
        subscriptionId: subscriptionId,
        pem: fs.readFileSync(process.env['AZURE_CERTIFICATE_PEM_FILE']).toString()
      }));

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

  describe('storage accounts list', function () {
    it('should work', function (done) {
      service.storageAccounts.list(function (err, result) {
        should.not.exist(err);
        should.exist(result);

        done();
      });
    });
  });
});