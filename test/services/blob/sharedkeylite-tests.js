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

var fs = require('fs');
var path = require("path");
var util = require('util');

// Test includes
var testutil = require('../../util/util');
var blobtestutil = require('../../framework/blob-test-utils');

// Lib includes
var azureutil = testutil.libRequire('util/util');
var azure = testutil.libRequire('azure');
var WebResource = testutil.libRequire('http/webresource');

var SharedAccessSignature = azure.SharedAccessSignature;
var BlobService = azure.BlobService;
var SharedKeyLite = azure.SharedKeyLite;
var ServiceClient = azure.ServiceClient;
var Constants = azure.Constants;
var BlobConstants = Constants.BlobConstants;
var HttpConstants = Constants.HttpConstants;

var containerNames = [];
var containerNamesPrefix = 'cont';

var testPrefix = 'sharedkeylite-tests';

var blobService;
var suiteUtil;

suite('sharedkeylite-tests', function () {
  suiteSetup(function (done) {
    blobService = azure.createBlobService();
    suiteUtil = blobtestutil.createBlobTestUtils(blobService, testPrefix);
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

  test('CreateContainer', function (done) {
    blobService.authenticationProvider = new SharedKeyLite(blobService.storageAccount, blobService.storageAccessKey);

    var containerName = testutil.generateId(containerNamesPrefix, containerNames, suiteUtil.isMocked);

    blobService.createContainer(containerName, function (createError, container1, createContainerResponse) {
      assert.equal(createError, null);
      assert.notEqual(container1, null);
      if (container1) {
        assert.notEqual(container1.name, null);
        assert.notEqual(container1.etag, null);
        assert.notEqual(container1.lastModified, null);
      }

      assert.equal(createContainerResponse.statusCode, HttpConstants.HttpResponseCodes.CREATED_CODE);

      // creating again will result in a duplicate error
      blobService.createContainer(containerName, function (createError2, container2) {
        assert.equal(createError2.code, Constants.BlobErrorCodeStrings.CONTAINER_ALREADY_EXISTS);
        assert.equal(container2, null);

        done();
      });
    });
  });
});
