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

var should = require('should');

// Test includes
var testutil = require('../../util/util');
var blobtestutil = require('../../framework/blob-test-utils');

// Lib includes
var common = require('azure-common');
var storage = require('azure-storage-legacy');

var containerNames = [];
var containerNamesPrefix = 'cont';

var blobNames = [];
var blobNamesPrefix = 'blob';

var testPrefix = 'blobservice-gb-tests';

var blobService;
var suiteUtil;

describe('BlobService', function () {
  before(function (done) {
    blobService = storage.createBlobService()
      .withFilter(new common.ExponentialRetryPolicyFilter());

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

  describe('createBlobWithStrangeCharacters', function () {
    var containerName;

    beforeEach(function (done) {
      containerName = testutil.generateId(containerNamesPrefix, containerNames, suiteUtil.isMocked);

      blobService.createContainer(containerName, done);
    });

    it('should work', function (done) {
      var blobName = 'def@#/abef?def/& &/abcde+=-';

      blobService.createBlockBlobFromText(containerName, blobName, 'hi there', function (uploadError, blob, uploadResponse) {
        should.not.exist(uploadError);
        uploadResponse.isSuccessful.should.be.ok;

        blobService.getBlobProperties(containerName, blobName, function(error, blob) {
          should.not.exist(error);
          uploadResponse.isSuccessful.should.be.ok;
          should.exist(blob);

          done();
        });
      });
    });
  });

  describe('createBlockBlobFromText', function () {
    var containerName;

    beforeEach(function (done) {
      containerName = testutil.generateId(containerNamesPrefix, containerNames, suiteUtil.isMocked);

      blobService.createContainer(containerName, done);
    });

    it('should work', function (done) {
      var blobName = '\u2488\u2460\u216B\u3128\u3129'.toString('GB18030');
      var blobText = '\u2488\u2460\u216B\u3128\u3129'.toString('GB18030');

      blobService.createBlockBlobFromText(containerName, blobName, blobText, function (uploadError, blob, uploadResponse) {
        should.not.exist(uploadError);
        uploadResponse.isSuccessful.should.be.ok;

        blobService.getBlobToText(containerName, blobName, function (downloadErr, blobTextResponse) {
          should.not.exist(downloadErr);
          should.equal(blobTextResponse, blobText);

          done();
        });
      });
    });
  });
});