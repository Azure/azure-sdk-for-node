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
var crypto = require('crypto');

// Test includes
var testutil = require('../../util/util');
var blobtestutil = require('../../framework/blob-test-utils');

// Lib includes
var storage = require('azure-storage-legacy');
var containerNamePrefix = 'upload-download-test';
var blockIdPrefix = 'block';
var containerCount = 0;
var containerName = '';
var blockBlobName = 'blockblob_nodesdktest';
var pageBlobName = 'pageblob_nodesdktest';
var blockFileName = 'blobservice_test_block.tmp';
var pageFileName = 'blobservice_test_page.tmp';
var page2KFileName = 'blobservice_test_2K_page.tmp';
var notExistFileName = 'blobservice_not_exist.tmp';
var zeroSizeFileName = 'blobservice_zero_size_file.tmp';
var fileText = 'Hello World!';
var pageBlobBuffer = new Buffer(1 * 1024);
var pageBlob2KBuffer = new Buffer(2 * 1024);
var blockBlobContentMD5 = null;
var pageBlobContentMD5 = '';
var pageBlob2KContentMD5 = '';
var downloadName = 'blobservice_download.tmp';
var uploadOptions = {
  blockIdPrefix : blockIdPrefix
};

var testPrefix = 'blobservice-uploaddownload-tests';

var blobService;
var suiteUtil;

function writeFile(fileName, content) {
  fs.writeFileSync(fileName, content);
  var md5hash = crypto.createHash('md5');
  md5hash.update(content);
  return md5hash.digest('base64');
}

describe('BlobService', function () {
  before(function (done) {
    blobService = storage.createBlobService();
    blobService.singleBlobPutThresholdInBytes = 0;
    blockBlobContentMD5 = writeFile(blockFileName, fileText);
    pageBlobBuffer.fill(0);
    pageBlobBuffer[0] = '1';
    pageBlobContentMD5 = writeFile(pageFileName, pageBlobBuffer);
    pageBlob2KBuffer.fill(0);
    pageBlob2KContentMD5 = writeFile(page2KFileName, pageBlob2KBuffer);
    var zeroBuffer = new Buffer(0);
    zeroFileContentMD5 = writeFile(zeroSizeFileName, zeroBuffer);
    suiteUtil = blobtestutil.createBlobTestUtils(blobService, testPrefix);
    try {
      fs.unlinkSync(notExistFileName);
    } catch(e) {}
    suiteUtil.setupSuite(done);
  });

  after(function (done) {
    try{ fs.unlinkSync(blockFileName); } catch (e) {}
    try{ fs.unlinkSync(pageFileName); } catch (e) {}
    try{ fs.unlinkSync(page2KFileName); } catch (e) {}
    try{ fs.unlinkSync(downloadName); } catch (e) {}
    try{ fs.unlinkSync(notExistFileName); } catch (e) {}
    try{ fs.unlinkSync(zeroSizeFileName); } catch (e) {}
    suiteUtil.teardownSuite(done);
  });

  beforeEach(function (done) {
    suiteUtil.setupTest(function() {
      containerName = containerNamePrefix + containerCount;
      containerCount++;
      uploadOptions = {
        blockIdPrefix : blockIdPrefix
      };
      blobService.createContainer(containerName, function(error) {
        if(error) throw error;
        done();
      });
    });
  });

  afterEach(function (done) {
    suiteUtil.teardownTest(done);
  });

  describe('CreateBlockBlobFromFile', function() {
    beforeEach(function (done) {
      blobService.deleteBlob(containerName, blockBlobName, function(error) {
        done();
      });
    });
    it('should work with basic file', function(done) {
      blobService.createBlockBlobFromFile(containerName, blockBlobName, blockFileName, uploadOptions, function (err) {
        assert.equal(err, null);
        blobService.getBlobProperties(containerName, blockBlobName, function(err, blob) {
          assert.equal(blob.contentMD5, blockBlobContentMD5);
          done();
        });
      });
    });

    it('should return a speed summary', function(done) {
      var speedSummary = blobService.createBlockBlobFromFile(containerName, blockBlobName, blockFileName, uploadOptions, function (err) {
        assert.equal(err, null);
        assert.equal(speedSummary.getTotalSize(false), Buffer.byteLength(fileText));
        assert.equal(speedSummary.getCompleteSize(false), Buffer.byteLength(fileText));
        assert.equal(speedSummary.getCompletePercent(), '100.0');
        done();
      });
    });

    it('should overwrite the existing blob', function(done) {
      blobService.createBlockBlobFromFile(containerName, blockBlobName, blockFileName, uploadOptions, function (err) {
        assert.equal(err, null);
        blobService.createBlockBlobFromFile(containerName, blockBlobName, blockFileName, uploadOptions, function (err) {
          assert.equal(err, null);
          done();
        });
      });
    });

    it('should work with zero size file', function(done) {
      blobService.createBlockBlobFromFile(containerName, blockBlobName, zeroSizeFileName, uploadOptions, function (err) {
        assert.equal(err, null);
        blobService.getBlobProperties(containerName, blockBlobName, function(err, blob) {
          assert.equal(blob.contentLength, 0);
          assert.equal(blob.contentMD5, zeroFileContentMD5);
          done();
        });
      });
    });

    it('should work with not existing file', function(done) {
      blobService.createBlockBlobFromFile(containerName, blockBlobName, notExistFileName, uploadOptions, function (err) {
        assert.notEqual(err, null);
        assert.equal(path.basename(err.path), notExistFileName);
        done();
      });
    });

    it('should work with customize time out', function(done) {
      uploadOptions.clientRequestTimeout = 1;
      if(!suiteUtil.isRecording) {
        console.warn('Skip running the test case for request time out. since we can\'t set up time out for mocked request.');
        done();
      } else {
        blobService.createBlockBlobFromFile(containerName, blockBlobName, blockFileName, uploadOptions, function (err) {
          assert.notEqual(err, null);
          var timeoutException = err.code == 'ETIMEOUT' || err.code == 'ESOCKETTIMEDOUT' || err.code == 'ETIMEDOUT';
          if(!timeoutException) {
            console.warn(err.code);
          }
          assert.equal(timeoutException, true);
          done();
        });
      }
    });
  });

  describe('CreateBlockBlobFromStream', function() {
    beforeEach(function (done) {
      blobService.deleteBlob(containerName, blockBlobName, function(error) {
        done();
      });
    });

    it('should work with basic file stream', function(done) {
      var len = Buffer.byteLength(fileText);
      var stream = fs.createReadStream(blockFileName);
      var speedSummary = blobService.createBlockBlobFromStream(containerName, blockBlobName, stream, len, uploadOptions, function (err) {
        assert.equal(err, null);
        assert.equal(speedSummary.getCompletePercent(), '100.0');
        blobService.getBlobProperties(containerName, blockBlobName, function(err, blob) {
          assert.equal(blob.contentMD5, blockBlobContentMD5);
          done();
        });
      });
    });

    it('should work with the speed summary in options', function(done) {
      var speedSummary = new storage.BlobService.SpeedSummary();
      var options = {
        blockIdPrefix : blockIdPrefix,
        speedSummary : speedSummary
      };
      var len = Buffer.byteLength(fileText);
      var stream = fs.createReadStream(blockFileName);
      blobService.createBlockBlobFromStream(containerName, blockBlobName, stream, len, options, function (err) {
        assert.equal(err, null);
        assert.equal(speedSummary.getTotalSize(false), Buffer.byteLength(fileText));
        assert.equal(speedSummary.getCompleteSize(false), Buffer.byteLength(fileText));
        assert.equal(speedSummary.getCompletePercent(), '100.0');
        done();
      });
    });
  });

  describe('CreatePageBlobFromFile', function() {
    beforeEach(function (done) {
      blobService.deleteBlob(containerName, pageBlobName, function(error) {
        done();
      });
    });

    it('should work with basic file', function(done) {
      blobService.createPageBlobFromFile(containerName, pageBlobName, pageFileName, uploadOptions, function (err) {
        assert.equal(err, null);
        blobService.getBlobProperties(containerName, pageBlobName, function(err, blob) {
          assert.equal(blob.contentMD5, undefined);
          done();
        });
      });
    });

    it('should work with speed summary', function(done) {
      var speedSummary = blobService.createPageBlobFromFile(containerName, pageBlobName, pageFileName, uploadOptions, function (err) {
        assert.equal(err, null);
        blobService.getBlobProperties(containerName, pageBlobName, function(err, blob) {
          assert.equal(err, null);
          assert.equal(blob.contentMD5, undefined);
          assert.equal(speedSummary.getTotalSize(false), 1024);
          assert.equal(speedSummary.getCompleteSize(false), 1024);
          assert.equal(speedSummary.getCompletePercent(), '100.0');
          done();
        });
      });
    });

    it('should set content md5', function(done) {
      var options = {
        blockIdPrefix : blockIdPrefix,
        setBlobContentMD5 : true,
        useTransactionalMD5 : true
      }
      blobService.createPageBlobFromFile(containerName, pageBlobName, pageFileName, options, function (err) {
        assert.equal(err, null);
        blobService.getBlobProperties(containerName, pageBlobName, function(err, blob) {
          assert.equal(blob.contentMD5, pageBlobContentMD5);
          done();
        });
      });
    });

    it('should overwrite the existing page blob', function(done) {
      var options = {
        blockIdPrefix : blockIdPrefix,
        setBlobContentMD5 : true,
        useTransactionalMD5 : true
      }
      blobService.createPageBlobFromFile(containerName, pageBlobName, pageFileName, options, function (err) {
        assert.equal(err, null);
        blobService.getBlobProperties(containerName, pageBlobName, function(err, blob) {
          assert.equal(blob.contentMD5, pageBlobContentMD5);
          assert.equal(blob.contentLength, 1024);
          options.contentMD5Header = null;
          blobService.createPageBlobFromFile(containerName, pageBlobName, page2KFileName, options, function (err) {
            assert.equal(err, null);
            blobService.getBlobProperties(containerName, pageBlobName, function(err, blob) {
              assert.equal(blob.contentLength, 2 * 1024);
              assert.equal(blob.contentMD5, pageBlob2KContentMD5);
              done();
            });
          });
        });
      });
    });

    it('should not work with the file with invalid size', function(done) {
      blobService.createPageBlobFromFile(containerName, pageBlobName, blockFileName, uploadOptions, function (err) {
        assert.equal(err.message, "The page blob size must be aligned to a 512-byte boundary. The current stream length is 12");
        done();
      });
    });

    it('should work with zero size file', function(done) {
      uploadOptions.setBlobContentMD5 = true;
      blobService.createPageBlobFromFile(containerName, blockBlobName, zeroSizeFileName, uploadOptions, function (err) {
        assert.equal(err, null);
        blobService.getBlobProperties(containerName, blockBlobName, function(err, blob) {
          assert.equal(blob.contentLength, 0);
          assert.equal(blob.contentMD5, zeroFileContentMD5);
          done();
        });
      });
    });

    it('should work with not existing file', function(done) {
      blobService.createPageBlobFromFile(containerName, blockBlobName, notExistFileName, uploadOptions, function (err) {
        assert.notEqual(err, null);
        assert.equal(path.basename(err.path), notExistFileName);
        done();
      });
    });
  });

  describe('CreatePageBlobFromStream', function() {
    beforeEach(function (done) {
      blobService.deleteBlob(containerName, pageBlobName, function(error) {
        done();
      });
    });

    //Most cases are in CreatePageBlobFromFile
    it('should work with basic file', function(done) {
      var stream = fs.createReadStream(pageFileName);
      blobService.createPageBlobFromStream(containerName, pageBlobName, stream, 1024, uploadOptions, function (err) {
        assert.equal(err, null);
        blobService.getBlobProperties(containerName, pageBlobName, function(err, blob) {
          assert.equal(blob.contentMD5, undefined);
          done();
        });
      });
    });
  });

  describe('GetBlobToFile', function() {
    describe('BlockBlob', function() {
      beforeEach(function(done) {
        blobService.createBlockBlobFromFile(containerName, blockBlobName, blockFileName, uploadOptions, function (err) {
          assert.equal(err, null);
          done();
        });
      });

      it('should work with basic block blob', function(done) {
        blobService.getBlobToFile(containerName, blockBlobName, downloadName, function(err, blob) {
          assert.equal(err, null);
          assert.equal(blob.clientSideContentMD5, null);
          done();
        });
      });

      it('should work with speed summary', function(done) {
        var speedSummary = blobService.getBlobToFile(containerName, blockBlobName, downloadName, function(err, blob) {
          assert.equal(err, null);
          assert.equal(blob.clientSideContentMD5, null);
          assert.equal(speedSummary.getTotalSize(false), Buffer.byteLength(fileText));
          assert.equal(speedSummary.getCompleteSize(false), Buffer.byteLength(fileText));
          assert.equal(speedSummary.getCompletePercent(), '100.0');
          done();
        });
      });

      it('shoud calculate content md5', function(done) {
        var options = {checkMD5sum : true};
        blobService.getBlobToFile(containerName, blockBlobName, downloadName, options, function(err, blob) {
          assert.equal(err, null);
          assert.equal(blob.clientSideContentMD5, blockBlobContentMD5);
          done();
        });
      });
    });

    describe('PageBlob', function() {
      beforeEach(function(done) {
        blobService.createPageBlobFromFile(containerName, pageBlobName, pageFileName, uploadOptions, function (err) {
          assert.equal(err, null);
          done();
        });
      });

      it('should work with basic page blob', function(done) {
        blobService.getBlobToFile(containerName, pageBlobName, downloadName, function(err, blob) {
          assert.equal(err, null);
          assert.equal(blob.clientSideContentMD5, null);
          done();
        });
      });

      it('should work with speed summary', function(done) {
        var speedSummary = blobService.getBlobToFile(containerName, pageBlobName, downloadName, function(err, blob) {
          assert.equal(err, null);
          assert.equal(blob.clientSideContentMD5, null);
          assert.equal(speedSummary.getTotalSize(false), 1024);
          assert.equal(speedSummary.getCompleteSize(false), 1024);
          assert.equal(speedSummary.getCompletePercent(), '100.0');
          done();
        });
      });

      it('shoud calculate content md5', function(done) {
        var options = {checkMD5sum : true};
        blobService.getBlobToFile(containerName, pageBlobName, downloadName, options, function(err, blob) {
          assert.equal(err, null);
          assert.equal(blob.clientSideContentMD5, pageBlobContentMD5);
          done();
        });
      });
    });
  });
});
