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
var blobtestutil = require('../../util/blob-test-utils');

// Lib includes
var azureutil = testutil.libRequire('util/util');
var azure = testutil.libRequire('azure');
var BlobService = testutil.libRequire('services/blob/blobservice');
var Constants = testutil.libRequire('util/constants');

var BlobConstants = Constants.BlobConstants;

var blobService;

var testPrefix = 'filter-tests';
var numberTests = 3;

suite('filter-tests', function () {
  setup(function (done) {
    blobtestutil.setUpTest(testPrefix, function (err, newBlobService) {
      blobService = newBlobService;
      done();
    });
  });

  teardown(function (done) {
    blobtestutil.tearDownTest(numberTests, blobService, testPrefix, done);
  });

  test('NoFilter', function (done) {
    blobService.getServiceProperties(function (error, serviceProperties) {
      assert.equal(error, null);
      assert.notEqual(serviceProperties, null);

      done();
    });
  });

  test('SingleFilter', function (done) {
    var eventNumber = 0;

    var loggingBlobClient = blobService.withFilter({
      handle: function (requestOptions, nextPreCallback) {
        // pre is first event to occur
        assert.equal(eventNumber, 0);
        eventNumber++;

        if (nextPreCallback) {
          nextPreCallback(requestOptions, function (returnObject, finalCallback, nextPostCallback) {
            // post is second event to occur
            assert.equal(eventNumber, 1);
            if (nextPostCallback) {
              nextPostCallback(returnObject);
            }
            else if (finalCallback) {
              finalCallback(returnObject);
            }
          });
        }
      }
    });

    loggingBlobClient.getServiceProperties(function (error, serviceProperties) {
      assert.equal(error, null);
      assert.notEqual(serviceProperties, null);

      done();
    });
  });

  test('NestedFilters', function (done) {
    var eventNumber = 0;

    var loggingBlobClient = blobService.withFilter({
      handle: function (requestOptions, nextPreCallback) {
        assert.equal(eventNumber++, 2);

        if (nextPreCallback) {
          nextPreCallback(requestOptions, function (returnObject, finalCallback, nextPostCallback) {
            assert.equal(eventNumber++, 3);

            if (nextPostCallback) {
              nextPostCallback(returnObject);
            }
            else if (finalCallback) {
              finalCallback(returnObject);
            }
          });
        }
      }
    }).withFilter({
      handle: function (requestOptions, nextPreCallback) {
        assert.equal(eventNumber++, 1);

        if (nextPreCallback) {
          nextPreCallback(requestOptions, function (returnObject, finalCallback, nextPostCallback) {
            assert.equal(eventNumber++, 4);

            if (nextPostCallback) {
              nextPostCallback(returnObject);
            }
            else if (finalCallback) {
              finalCallback(returnObject);
            }
          });
        }
      }
    }).withFilter({
      handle: function (requestOptions, nextPreCallback) {
        assert.equal(eventNumber++, 0);

        if (nextPreCallback) {
          nextPreCallback(requestOptions, function (returnObject, finalCallback, nextPostCallback) {
            assert.equal(eventNumber++, 5);

            if (nextPostCallback) {
              nextPostCallback(returnObject);
            }
            else if (finalCallback) {
              finalCallback(returnObject);
            }
          });
        }
      }
    });

    loggingBlobClient.getServiceProperties(function (error) {
      assert.equal(error, null);

      done();
    });
  });
});
