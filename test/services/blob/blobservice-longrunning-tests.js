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
var ServiceClient = require("../../../lib/services/serviceclient");
var Constants = require('../../../lib/util/constants');
var HttpConstants = Constants.HttpConstants;
var BlobConstants = Constants.BlobConstants;

var blobService;
var containerNames = [];
var containerNamesPrefix = 'cont';
var blobNames = [];
var blobNamesPrefix = 'blob';

var mockServerClient;
var currentTestName;

module.exports = testCase(
{
  setUp: function (callback) {
    blobService = azure.createBlobService(ServiceClient.DEVSTORE_STORAGE_ACCOUNT, ServiceClient.DEVSTORE_STORAGE_ACCESS_KEY, ServiceClient.DEVSTORE_BLOB_HOST);

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

  testGetBlobToStream: function (test) {
    var containerName = testutil.generateId(containerNamesPrefix, containerNames);
    var blobName = testutil.generateId(blobNamesPrefix, blobNames);
    var fileNameTarget = testutil.generateId('getBlobFile') + '.test';
    var blobText = 'Hello World';

    blobService.createContainer(containerName, function (createError1, container1) {
      test.equal(createError1, null);
      test.notEqual(container1, null);

      blobService.createBlockBlobFromText(containerName, blobName, blobText, function (error1) {
        test.equal(error1, null);

        blobService.getBlobToFile(containerName, blobName, fileNameTarget, function (error2) {
          test.equal(error2, null);

          path.exists(fileNameTarget, function (exists) {
            test.equal(exists, true);

            var fileText = fs.readFileSync(fileNameTarget);
            test.equal(blobText, fileText);
            test.done();
          });
        });
      });
    });
  },

  testSmallUploadBlobFromFile: function (test) {
    var containerName = testutil.generateId(containerNamesPrefix, containerNames);
    var blobName = testutil.generateId(blobNamesPrefix, blobNames);
    var fileNameSource = testutil.generateId('getBlobFile') + '.test';
    var blobText = 'Hello World';

    fs.writeFile(fileNameSource, blobText, function () {
      blobService.createContainer(containerName, function (createError1, container1, createResponse1) {
        test.equal(createError1, null);
        test.notEqual(container1, null);
        test.ok(createResponse1.isSuccessful);
        test.equal(createResponse1.statusCode, HttpConstants.HttpResponseCodes.CREATED_CODE);

        var blobOptions = { contentType: 'text' };
        blobService.createBlockBlobFromFile(containerName, blobName, fileNameSource, blobOptions, function (uploadError, blobResponse, uploadResponse) {
          test.equal(uploadError, null);
          test.notEqual(blobResponse, null);
          test.ok(uploadResponse.isSuccessful);

          blobService.getBlobToText(containerName, blobName, function (downloadErr, blobTextResponse) {
            test.equal(downloadErr, null);
            test.equal(blobTextResponse, blobText);

            blobService.getBlobProperties(containerName, blobName, function (getBlobPropertiesErr, blobGetResponse) {
              test.equal(getBlobPropertiesErr, null);
              test.notEqual(blobGetResponse, null);
              if (blobGetResponse) {
                test.equal(blobOptions.contentType, blobGetResponse.contentType);
              }

              test.done();
            });
          });
        });
      });
    });
  },

  testAnalyzeStream: function (test) {
    var containerName = testutil.generateId(containerNamesPrefix, containerNames);
    var blobName = testutil.generateId(blobNamesPrefix, blobNames);
    var fileNameSource = testutil.generateId('getBlobFile') + '.test';
    var blobText = 'Hello World';

    fs.writeFile(fileNameSource, blobText, function () {
      blobService.createContainer(containerName, function (createError1, container1, createResponse1) {
        test.equal(createError1, null);
        test.notEqual(container1, null);
        test.ok(createResponse1.isSuccessful);
        test.equal(createResponse1.statusCode, HttpConstants.HttpResponseCodes.CREATED_CODE);

        blobService.createBlockBlobFromFile(containerName, blobName, fileNameSource, { setBlobContentMD5: true }, function (uploadError, blobResponse, uploadResponse) {
          test.equal(uploadError, null);
          test.notEqual(blobResponse, null);
          test.ok(uploadResponse.isSuccessful);

          blobService.getBlobToText(containerName, blobName, function (downloadErr, blobTextResponse) {
            test.equal(downloadErr, null);
            test.equal(blobTextResponse, blobText);

            test.done();
          });
        });
      });
    });
  },

  testInvalidMD5SmallFile: function (test) {
    var containerName = testutil.generateId(containerNamesPrefix, containerNames);
    var blobName = testutil.generateId(blobNamesPrefix, blobNames);
    var fileNames = [];
    var fileNameSource = testutil.generateId('getBlobFile', fileNames) + '.test';
    var fileNameTarget = testutil.generateId('getBlobFile', fileNames) + '.test';
    var blobText = 'Hello World';

    fs.writeFile(fileNameSource, blobText, function () {
      blobService.createContainer(containerName, function (createError1, container1, createResponse1) {
        test.equal(createError1, null);
        test.notEqual(container1, null);
        test.ok(createResponse1.isSuccessful);
        test.equal(createResponse1.statusCode, HttpConstants.HttpResponseCodes.CREATED_CODE);

        blobService.createBlockBlobFromFile(containerName, blobName, fileNameSource, { setBlobContentMD5: true }, function (uploadError, blobResponse, uploadResponse) {
          test.equal(uploadError, null);
          test.notEqual(blobResponse, null);
          test.ok(uploadResponse.isSuccessful);

          // Just retrieving works fine
          blobService.getBlobToFile(containerName, blobName, fileNameTarget, function (downloadErr1) {
            test.equal(downloadErr1, null);

            // replace contentMD5 by a messed up one
            var blobOptions = { contentMD5: 'fake' };
            blobService.setBlobProperties(containerName, blobName, blobOptions, function (setPropErr) {
              test.equal(setPropErr, null);

              blobService.getBlobToFile(containerName, blobName, fileNameTarget, function (downloadErr2) {
                test.notEqual(downloadErr2, null);
                test.equal(downloadErr2, 'Blob data corrupted (integrity check failed), Expected value is fake, retrieved sQqNsWTgdUEFt6mb5y4/5Q==');

                test.done();
              });
            });
          });
        });
      });
    });
  },

  /*
  testInvalidMD5Text: function (test) {
    var containerName = containerNames[7];
    var blobName = blobNames[12];
    var blobText = 'Hello World';

    blobService.createContainer(containerName, function (createError1, container1, createResponse1) {
      test.equal(createError1, null);
      test.notEqual(container1, null);
      test.ok(createResponse1.isSuccessful);
      test.equal(createResponse1.statusCode, HttpConstants.HttpResponseCodes.CREATED_CODE);

      blobService.createBlockBlobFromFile(containerName, blobName, blobText, { setBlobContentMD5: true }, function (uploadError, blobResponse, uploadResponse) {
        test.equal(uploadError, null);
        test.notEqual(blobResponse, null);
        test.ok(uploadResponse.isSuccessful);

        // Normal retrieval ok
        blobService.getBlobToText(containerName, blobName, function (downloadErr1, content) {
          test.equal(downloadErr1, null);
          test.equal(blobText, content);

          // replace contentMD5 by a messed up one
          var blobOptions = { contentMD5: 'fake' };
          blobService.setBlobProperties(containerName, blobName, blobOptions, function (setPropErr) {
            test.equal(setPropErr, null);

            // Error will be shown
            blobService.getBlobToText(containerName, blobName, function (downloadErr2) {
              test.notEqual(downloadErr2, null);
              test.equal(downloadErr2, 'Blob data corrupted (integrity check failed), Expected value is fake, retrieved sQqNsWTgdUEFt6mb5y4/5Q==');

              // We can always ask to ignore MD5
              blobService.getBlobToText(containerName, blobName, { disableContentMD5: true }, function (downloadErr3) {
                test.equal(downloadErr3, null);

                test.done();
              });
            });
          });
        });
      });
    });
  }*/
});

function repeat(s, n) {
  var ret = "";
  for (var i = 0; i < n; i++) {
    ret += s;
  }
  return ret;
}