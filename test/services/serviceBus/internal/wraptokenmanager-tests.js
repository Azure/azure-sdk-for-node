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

// Test includes
var testutil = require('../../../util/util');
var wrapservicetestutil = require('../../../framework/wrapservice-test-utils');

// Lib includes
var azure = testutil.libRequire('azure');
var WrapService = testutil.libRequire('services/serviceBus/lib/wrapservice');
var WrapTokenManager = testutil.libRequire('services/serviceBus/lib/internal/wraptokenmanager');

var ServiceClientConstants = azure.ServiceClientConstants;

var wrapTokenManager;
var wrapService;
var suiteUtil;

var testPrefix = 'wraptokenmanager-tests';

suite('wraptokenmanager-tests', function () {
  suiteSetup(function (done) {
    wrapService = new WrapService();
    suiteUtil = wrapservicetestutil.createWrapServiceTestUtils(wrapService, testPrefix);
    suiteUtil.setupSuite(done);
  });

  suiteTeardown(function (done) {
    suiteUtil.teardownSuite(done);
  });

  setup(function (done) {
    suiteUtil.setupTest(done);
  });

  teardown(function (done) {
    suiteUtil.teardownTest(done);
  });

  test('GetAccessToken', function (done) {
    wrapTokenManager = new WrapTokenManager();

    var namespace = process.env[ServiceClientConstants.EnvironmentVariables.AZURE_SERVICEBUS_NAMESPACE];
    var scopeUri = 'http://' + namespace + '.servicebus.windows.net/myqueue';

    wrapTokenManager.getAccessToken(scopeUri, function (error, wrapAccessToken) {
      assert.equal(error, null);
      assert.notEqual(wrapAccessToken['wrap_access_token'], null);
      assert.notEqual(wrapAccessToken['wrap_access_token_expires_in'], null);
      assert.notEqual(wrapAccessToken['wrap_access_token_expires_utc'], null);

      // trying to get an access token to the same scopeUri immediately
      // should return the same as it should still be cached
      wrapTokenManager.getAccessToken(scopeUri, function (error2, cachedWrapAccessToken) {
        assert.equal(error2, null);
        assert.equal(cachedWrapAccessToken, wrapAccessToken);

        done();
      });
    });
  });
});
