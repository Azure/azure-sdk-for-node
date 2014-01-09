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

var assert = require('assert');

var testutil = require('../../util/util');

var azure = testutil.libRequire('azure');
var TokenCloudCredentials = azure.TokenCloudCredentials;
var MockedTestUtils = require('../../framework/mocked-test-utils');

var testPrefix = 'token-tests';

describe('Token credentials', function () {
  var service;
  var suiteUtil;

  before(function (done) {
    assert.notEqual(process.env.AZURE_ACCESS_TOKEN, null);

    service = azure.createWebSiteManagementClient(new TokenCloudCredentials({ token: process.env.AZURE_ACCESS_TOKEN, subscriptionId: process.env.AZURE_SUBSCRIPTION_ID }));
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

  describe('when listing webspaces', function () {
    it('should work', function (done) {
      service.webSpaces.list(function (err, res) {
        assert.equal(err, null);

        assert.notEqual(res.webSpaces, null);

        done();
      });
    });
  });
});