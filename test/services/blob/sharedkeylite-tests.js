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
var fs = require('fs');
var path = require("path");
var util = require('util');

var azureutil = require('../../../lib/util/util');
var azure = require('../../../lib/azure');
var testutil = require('../../util/util');

var SharedAccessSignature = require('../../../lib/services/blob/sharedaccesssignature');
var BlobService = require("../../../lib/services/blob/blobservice");
var SharedKeyLite = require("../../../lib/services/blob/sharedkeylite");
var ServiceClient = require("../../../lib/services/serviceclient");
var Constants = require('../../../lib/util/constants');
var BlobConstants = Constants.BlobConstants;
var HttpConstants = Constants.HttpConstants;
var WebResource = require('../../../lib/http/webresource');

var blobService;
var containerNames = [];
var containerNamesPrefix = 'cont';

module.exports = testCase(
{
  setUp: function (callback) {
    blobService = azure.createBlobService();

    callback();
  },

  tearDown: function (callback) {
    var deleteFiles = function () {
      // delete test files
      var list = fs.readdirSync('./');
      list.forEach(function (file) {
        if (file.indexOf('.test') !== -1) {
          fs.unlinkSync(file);
        }
      });

      callback();
    };

    // delete blob containers
    blobService.listContainers(function (listError, containers) {
      if (containers && containers.length > 0) {
        var containerCount = 0;
        containers.forEach(function (container) {
          blobService.deleteContainer(container.name, function () {
            containerCount++;
            if (containerCount === containers.length) {
              // clean up
              deleteFiles();
            }
          });
        });
      }
      else {
        // clean up
        deleteFiles();
      }
    });
  },

  testCreateContainer: function (test) {
    blobService.authenticationProvider = new SharedKeyLite(blobService.storageAccount, blobService.storageAccessKey);

    var containerName = testutil.generateId(containerNamesPrefix, containerNames);

    blobService.createContainer(containerName, function (createError, container1, createContainerResponse) {
      test.equal(createError, null);
      test.notEqual(container1, null);
      if (container1) {
        test.notEqual(container1.name, null);
        test.notEqual(container1.etag, null);
        test.notEqual(container1.lastModified, null);
      }

      test.equal(createContainerResponse.statusCode, HttpConstants.HttpResponseCodes.CREATED_CODE);

      // creating again will result in a duplicate error
      blobService.createContainer(containerName, function (createError2, container2) {
        test.equal(createError2.code, Constants.BlobErrorCodeStrings.CONTAINER_ALREADY_EXISTS);
        test.equal(container2, null);

        test.done();
      });
    });
  }
});
