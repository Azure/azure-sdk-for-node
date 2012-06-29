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

// Lib includes
var azureutil = testutil.libRequire('util/util');
var azure = testutil.libRequire('azure');

var SharedAccessSignature = azure.SharedAccessSignature;
var BlobService = azure.BlobService;
var ServiceClient = azure.ServiceClient;
var Constants = azure.Constants;
var HttpConstants = Constants.HttpConstants;
var BlobConstants = Constants.BlobConstants;

var blobService;
var containerNames = [];
var containerNamesPrefix = 'cont';
var blobNames = [];
var blobNamesPrefix = 'blob';

var mockServerClient;
var currentTestName;

suite('blobservice-longrunning-tests', function () {
  setup(function (done) {
    blobService = azure.createBlobService(ServiceClient.DEVSTORE_STORAGE_ACCOUNT, ServiceClient.DEVSTORE_STORAGE_ACCESS_KEY, ServiceClient.DEVSTORE_BLOB_HOST);

    done();
  });

  teardown(function (done) {
    var deleteFiles = function () {
      // delete test files
      var list = fs.readdirSync('./');
      list.forEach(function (file) {
        if (file.indexOf('.test') !== -1) {
          fs.unlinkSync(file);
        }
      });

      done();
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
  });

  test('GetBlobToStream', function (done) {
    var containerName = testutil.generateId(containerNamesPrefix, containerNames);
    var blobName = testutil.generateId(blobNamesPrefix, blobNames);
    var fileNameTarget = testutil.generateId('getBlobFile') + '.test';
    var blobText = 'Hello World';

    blobService.createContainer(containerName, function (createError1, container1) {
      assert.equal(createError1, null);
      assert.notEqual(container1, null);

      blobService.createBlockBlobFromText(containerName, blobName, blobText, function (error1) {
        assert.equal(error1, null);

        blobService.getBlobToFile(containerName, blobName, fileNameTarget, function (error2) {
          assert.equal(error2, null);

          path.exists(fileNameTarget, function (exists) {
            assert.equal(exists, true);

            var fileText = fs.readFileSync(fileNameTarget);
            assert.equal(blobText, fileText);
            done();
          });
        });
      });
    });
  });

  test('SmallUploadBlobFromFile', function (done) {
    var containerName = testutil.generateId(containerNamesPrefix, containerNames);
    var blobName = testutil.generateId(blobNamesPrefix, blobNames);
    var fileNameSource = testutil.generateId('getBlobFile') + '.test';
    var blobText = 'Hello World';

    fs.writeFile(fileNameSource, blobText, function () {
      blobService.createContainer(containerName, function (createError1, container1, createResponse1) {
        assert.equal(createError1, null);
        assert.notEqual(container1, null);
        assert.ok(createResponse1.isSuccessful);
        assert.equal(createResponse1.statusCode, HttpConstants.HttpResponseCodes.CREATED_CODE);

        var blobOptions = { contentType: 'text' };
        blobService.createBlockBlobFromFile(containerName, blobName, fileNameSource, blobOptions, function (uploadError, blobResponse, uploadResponse) {
          assert.equal(uploadError, null);
          assert.notEqual(blobResponse, null);
          assert.ok(uploadResponse.isSuccessful);

          blobService.getBlobToText(containerName, blobName, function (downloadErr, blobTextResponse) {
            assert.equal(downloadErr, null);
            assert.equal(blobTextResponse, blobText);

            blobService.getBlobProperties(containerName, blobName, function (getBlobPropertiesErr, blobGetResponse) {
              assert.equal(getBlobPropertiesErr, null);
              assert.notEqual(blobGetResponse, null);
              if (blobGetResponse) {
                assert.equal(blobOptions.contentType, blobGetResponse.contentType);
              }

              done();
            });
          });
        });
      });
    });
  });

  test('AnalyzeStream', function (done) {
    var containerName = testutil.generateId(containerNamesPrefix, containerNames);
    var blobName = testutil.generateId(blobNamesPrefix, blobNames);
    var fileNameSource = testutil.generateId('getBlobFile') + '.test';
    var blobText = 'Hello World';

    fs.writeFile(fileNameSource, blobText, function () {
      blobService.createContainer(containerName, function (createError1, container1, createResponse1) {
        assert.equal(createError1, null);
        assert.notEqual(container1, null);
        assert.ok(createResponse1.isSuccessful);
        assert.equal(createResponse1.statusCode, HttpConstants.HttpResponseCodes.CREATED_CODE);

        blobService.createBlockBlobFromFile(containerName, blobName, fileNameSource, { setBlobContentMD5: true }, function (uploadError, blobResponse, uploadResponse) {
          assert.equal(uploadError, null);
          assert.notEqual(blobResponse, null);
          assert.ok(uploadResponse.isSuccessful);

          blobService.getBlobToText(containerName, blobName, function (downloadErr, blobTextResponse) {
            assert.equal(downloadErr, null);
            assert.equal(blobTextResponse, blobText);

            done();
          });
        });
      });
    });
  });

  test('InvalidMD5SmallFile', function (done) {
    var containerName = testutil.generateId(containerNamesPrefix, containerNames);
    var blobName = testutil.generateId(blobNamesPrefix, blobNames);
    var fileNames = [];
    var fileNameSource = testutil.generateId('getBlobFile', fileNames) + '.test';
    var fileNameTarget = testutil.generateId('getBlobFile', fileNames) + '.test';
    var blobText = 'Hello World';

    fs.writeFile(fileNameSource, blobText, function () {
      blobService.createContainer(containerName, function (createError1, container1, createResponse1) {
        assert.equal(createError1, null);
        assert.notEqual(container1, null);
        assert.ok(createResponse1.isSuccessful);
        assert.equal(createResponse1.statusCode, HttpConstants.HttpResponseCodes.CREATED_CODE);

        blobService.createBlockBlobFromFile(containerName, blobName, fileNameSource, { setBlobContentMD5: true }, function (uploadError, blobResponse, uploadResponse) {
          assert.equal(uploadError, null);
          assert.notEqual(blobResponse, null);
          assert.ok(uploadResponse.isSuccessful);

          // Just retrieving works fine
          blobService.getBlobToFile(containerName, blobName, fileNameTarget, function (downloadErr1) {
            assert.equal(downloadErr1, null);

            // replace contentMD5 by a messed up one
            var blobOptions = { contentMD5: 'fake' };
            blobService.setBlobProperties(containerName, blobName, blobOptions, function (setPropErr) {
              assert.equal(setPropErr, null);

              blobService.getBlobToFile(containerName, blobName, fileNameTarget, function (downloadErr2) {
                assert.notEqual(downloadErr2, null);
                assert.equal(downloadErr2, 'Blob data corrupted (integrity check failed), Expected value is fake, retrieved sQqNsWTgdUEFt6mb5y4/5Q==');

                done();
              });
            });
          });
        });
      });
    });
  });

  test('SharedAccess', function (done) {
    var containerName = testutil.generateId(containerNamesPrefix, containerNames);
    var blobName = testutil.generateId(blobNamesPrefix, blobNames);
    var blobText = 'text';

    var sharedBlobClient = azure.createBlobService();
    var sharedAccessSignature = new SharedAccessSignature(sharedBlobClient.storageAccount, sharedBlobClient.storageAccessKey);
    sharedBlobClient.authenticationProvider = sharedAccessSignature;

    var managementBlobClient = azure.createBlobService();

    managementBlobClient.createContainer(containerName, function (createError, container1, createResponse) {
      assert.equal(createError, null);
      assert.notEqual(container1, null);
      assert.ok(createResponse.isSuccessful);

      var currentDate = new Date();
      var futureDate = new Date(currentDate);
      futureDate.setMinutes(currentDate.getMinutes() + 5);

      var sharedAccessPolicy = {
        AccessPolicy: {
          Expiry: futureDate,
          Permissions: BlobConstants.SharedAccessPermissions.WRITE
        }
      };

      // Get shared access Url valid for the next 5 minutes
      var sharedAccessCredentials = managementBlobClient.generateSharedAccessSignature(
        containerName,
        null,
        sharedAccessPolicy);

      sharedAccessSignature.permissionSet = [sharedAccessCredentials];

      // Writing the blob should be possible
      sharedBlobClient.createBlockBlobFromText(containerName, blobName, blobText, function (putError, blob, putResponse) {
        assert.equal(putError, null);
        assert.ok(putResponse.isSuccessful);

        // Make sure its not possible to get the blob since only write permission was given
        sharedBlobClient.getBlobToText(containerName, blobName, function (getError, content, blockBlob, getResponse) {
          assert.equal(getError.code, Constants.StorageErrorCodeStrings.RESOURCE_NOT_FOUND);
          assert.equal(content, null);
          assert.equal(blockBlob, null);
          assert.notEqual(getResponse, null);
          if (getResponse) {
            assert.equal(getResponse.isSuccessful, false);
          }

          done();
        });
      });
    });
  });
});

function repeat(s, n) {
  var ret = "";
  for (var i = 0; i < n; i++) {
    ret += s;
  }
  return ret;
}