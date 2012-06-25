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

var assert = require('assert');

// Test includes
var testutil = require('../../util/util');
var wrapservicetestutil = require('../../util/wrapservice-test-utils');

// Lib includes
var azure = testutil.libRequire('azure');
var azureutil = testutil.libRequire('util/util');
var ISO8061Date = testutil.libRequire('util/iso8061date');

var ServiceClient = azure.ServiceClient;
var Constants = azure.Constants;
var HttpConstants = Constants.HttpConstants;
var StorageErrorCodeStrings = Constants.StorageErrorCodeStrings;

var wrapService;

var testPrefix = 'wrapservice-tests';

suite('wrapservice-tests', function() {
  setup(function (done) {
    wrapservicetestutil.setUpTest(module.exports, testPrefix, function (err, newWrapService) {
      wrapService = newWrapService;
      done();
    });
  });

  teardown(function (done) {
    wrapservicetestutil.tearDownTest(module.exports, wrapService, testPrefix, done);
  });

  test('WrapAccessToken', function (done) {
    var namespace = process.env[ServiceClient.EnvironmentVariables.AZURE_SERVICEBUS_NAMESPACE];

    wrapService.wrapAccessToken('http://' + namespace + '.servicebus.windows.net/myqueue', function (error, wrapAccessToken) {
      assert.equal(error, null);
      assert.notEqual(wrapAccessToken['wrap_access_token'], null);
      assert.notEqual(wrapAccessToken['wrap_access_token_expires_in'], null);

      done();
    });
  });
});
