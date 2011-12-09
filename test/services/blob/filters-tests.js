/**
* Copyright 2011 Microsoft Corporation
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

var testCase = require('nodeunit').testCase;

var azureutil = require('../../../lib/util/util');
var azure = require('../../../lib/azure');

var BlobService = require("../../../lib/services/blob/blobservice");
var Constants = require('../../../lib/util/constants');
var BlobConstants = Constants.BlobConstants;

var blobService;

module.exports = testCase(
{
  setUp: function (callback) {
    blobService = azure.createBlobService();

    callback();
  },

  tearDown: function (callback) {
    callback();
  },

  testNoFilter: function (test) {
    blobService.getServiceProperties(function (error, serviceProperties) {
      test.equal(error, null);
      test.notEqual(serviceProperties, null);

      test.done();
    });
  },

  testSingleFilter: function (test) {
    var eventNumber = 0;

    var loggingBlobClient = blobService.withFilter({
      handle: function (requestOptions, nextPreCallback) {
        // pre is first event to occur
        test.equal(eventNumber, 0);
        eventNumber++;

        if (nextPreCallback) {
          nextPreCallback(requestOptions, function (returnObject, finalCallback, nextPostCallback) {
            // post is second event to occur
            test.equal(eventNumber, 1);
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
      test.equal(error, null);
      test.notEqual(serviceProperties, null);

      test.done();
    });
  },

  testNestedFilters: function (test) {
    var eventNumber = 0;

    var loggingBlobClient = blobService.withFilter({
      handle: function (requestOptions, nextPreCallback) {
        test.equal(eventNumber++, 2);

        if (nextPreCallback) {
          nextPreCallback(requestOptions, function (returnObject, finalCallback, nextPostCallback) {
            test.equal(eventNumber++, 3);

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
        test.equal(eventNumber++, 1);

        if (nextPreCallback) {
          nextPreCallback(requestOptions, function (returnObject, finalCallback, nextPostCallback) {
            test.equal(eventNumber++, 4);

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
        test.equal(eventNumber++, 0);

        if (nextPreCallback) {
          nextPreCallback(requestOptions, function (returnObject, finalCallback, nextPostCallback) {
            test.equal(eventNumber++, 5);

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
      test.equal(error, null);

      test.done();
    });
  }
});
