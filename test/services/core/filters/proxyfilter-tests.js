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

var assert = require('assert');

// Test includes
var testutil = require('../../../util/util');
var blobtestutil = require('../../../framework/blob-test-utils');

var azure = testutil.libRequire('azure');

var containerNames = [];
var containerNamesPrefix = 'cont';

var testPrefix = 'proxyfilter-tests';

describe('Proxy filter', function () {
  var service;
  var suiteUtil;

  before(function (done) {
    service = azure.createBlobService()
      .withFilter(azure.ProxyFilter.create('http://localhost:8888', false));

    suiteUtil = blobtestutil.createBlobTestUtils(service, testPrefix);
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

  it('should work for https over http', function (done) {
    var containerName = testutil.generateId(containerNamesPrefix, containerNames, suiteUtil.isMocked);

    service.createContainer(containerName, function (err) {
      assert.equal(err, null);

      done();
    });
  });
});