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

var fs = require('fs');
var path = require('path');
var util = require('util');
var sinon = require('sinon');
var url = require('url');

var request = require('request');

// Test includes
var testutil = require('../../util/util');
var blobtestutil = require('../../framework/blob-test-utils');

// Lib includes
var azureutil = testutil.libRequire('common/lib/util/util');
var azure = testutil.libRequire('azure');
var WebResource = testutil.libRequire('common/lib/http/webresource');

var SharedAccessSignature = azure.SharedAccessSignature;
var BlobService = azure.BlobService;
var ServiceClient = azure.ServiceClient;
var ExponentialRetryPolicyFilter = azure.ExponentialRetryPolicyFilter;
var Constants = azure.Constants;
var BlobConstants = Constants.BlobConstants;
var HttpConstants = Constants.HttpConstants;
var ServiceClientConstants = azure.ServiceClientConstants;
var QueryStringConstants = Constants.QueryStringConstants;

var containerNames = [];
var containerNamesPrefix = 'cont';

var blobNames = [];
var blobNamesPrefix = 'blob';

var testPrefix = 'blobservice-stream-tests';

var blobService;
var suiteUtil;

describe('BlobServiceStream', function () {
  before(function (done) {
    blobService = azure.createBlobService()
      .withFilter(new azure.ExponentialRetryPolicyFilter());

    suiteUtil = blobtestutil.createBlobTestUtils(blobService, testPrefix);
    suiteUtil.setupSuite(done);
  });

  after(function (done) {
    suiteUtil.teardownSuite(done);
  });

  beforeEach(function (done) {
    suiteUtil.setupTest(done);
  });

  afterEach(function (done) {
    suiteUtil.teardownTest(done);
  });

  describe('getBlob', function () {
    it('should be able to pipe', function (done) {
      var containerName = testutil.generateId(containerNamesPrefix, containerNames, suiteUtil.isMocked);
      var blobName = testutil.generateId(blobNamesPrefix, blobNames, suiteUtil.isMocked);
      var fileNameTarget = testutil.generateId('getBlobFile', [], suiteUtil.isMocked) + '.test';
      var blobText = 'Hello World';

      blobService.createContainer(containerName, function (createError1, container1) {
        assert.equal(createError1, null);
        assert.notEqual(container1, null);

        blobService.createBlockBlobFromText(containerName, blobName, blobText, function (error1) {
          assert.equal(error1, null);

          var stream = blobService.getBlob(containerName, blobName).pipe(fs.createWriteStream(fileNameTarget));
          stream.on('close', function () {

            var content = fs.readFileSync(fileNameTarget).toString();
            assert.equal(content, blobText);

            try { fs.unlinkSync(fileNameTarget); } catch (e) {}

            done();
          });

        });
      });
    });

    it('should emit error events', function (done) {
      var containerName = testutil.generateId(containerNamesPrefix, containerNames, suiteUtil.isMocked);
      var blobName = testutil.generateId(blobNamesPrefix, blobNames, suiteUtil.isMocked);
      var fileNameTarget = testutil.generateId('getBlobFile', [], suiteUtil.isMocked) + '.test';
      var blobText = 'Hello World';

      var stream = blobService.getBlob(containerName, blobName);
      stream.on('error', function (error) {
        assert.equal(error.code, 'NotFound');
        assert.equal(error.statusCode, '404');
        assert.notEqual(error.requestId, null);

        try { fs.unlinkSync(fileNameTarget); } catch (e) {}

        done();
      });

      stream.pipe(fs.createWriteStream(fileNameTarget));
    });
  });

  describe('createBlob', function () {
    it('should be able to pipe', function (done) {
      var containerName = testutil.generateId(containerNamesPrefix, containerNames, suiteUtil.isMocked);
      var blobName = testutil.generateId(blobNamesPrefix, blobNames, suiteUtil.isMocked);
      var fileNameTarget = testutil.generateId('getBlobFile', [], suiteUtil.isMocked) + '.test';
      var blobText = 'Hello World';

      blobService.createContainer(containerName, function (createError1, container1) {
        assert.equal(createError1, null);
        assert.notEqual(container1, null);

        // Write file so that it can be piped
        fs.writeFileSync(fileNameTarget, blobText);

        // Pipe file to a blob
        var stream = fs.createReadStream(fileNameTarget).pipe(blobService.createBlob(containerName, blobName, BlobConstants.BlobTypes.BLOCK, { blockIdPrefix: 'block' }));
        stream.on('close', function () {
          blobService.getBlobToText(containerName, blobName, function (err, text) {
            assert.equal(err, null);

            assert.equal(text, blobText);

            try { fs.unlinkSync(fileNameTarget); } catch (e) {}

            done();
          });
        });
      });
    });
  });
});