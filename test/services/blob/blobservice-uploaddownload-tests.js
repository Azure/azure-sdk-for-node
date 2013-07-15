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
var crypto = require('crypto');

// Test includes
var testutil = require('../../util/util');
var blobtestutil = require('../../framework/blob-test-utils');

// Lib includes
var azure = testutil.libRequire('azure');

var containerName = 'test';
var blockBlobName = 'blockblob_nodesdktest';
var pageBlobName = 'pageblob_nodesdktest';
var blockFileName = 'blobservice_test_block.tmp';
var pageFileName = 'blobservice_test_page.tmp';
var page2KFileName = 'blobservice_test_2K_page.tmp';
var fileText = 'Hello World!';
var pageBlobBuffer = new Buffer(1 * 1024);
var pageBlob2KBuffer = new Buffer(2 * 1024);
var blockBlobContentMd5 = '';
var pageBlobContentMd5 = ''; 
var pageBlob2KContentMd5 = ''; 
var downloadName = 'blobservice_download.tmp';

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
    blobService = azure.createBlobService();
    blockBlobContentMd5 = writeFile(blockFileName, fileText);
    pageBlobBuffer.fill(0);
    pageBlobBuffer[0] = '1';
    pageBlobContentMd5 = writeFile(pageFileName, pageBlobBuffer); 
    pageBlob2KBuffer.fill(0);
    pageBlob2KContentMd5 = writeFile(page2KFileName, pageBlob2KBuffer);
    suiteUtil = blobtestutil.createBlobTestUtils(blobService, testPrefix);
    suiteUtil.setupSuite(done);
  });

  after(function (done) {
    suiteUtil.teardownSuite(done);
    fs.unlinkSync(blockFileName);
    fs.unlinkSync(pageFileName);
    fs.unlinkSync(page2KFileName);
    fs.unlinkSync(downloadName);
  });

  describe('CreateBlockBlobFromFile', function() {
    beforeEach(function (done) {
      blobService.deleteBlob(containerName, blockBlobName, function(error) {
        done();
      });
    });
    it('should work', function(done) {
      blobService.createBlockBlobFromFile(containerName, blockBlobName, blockFileName, function (err) {
        assert.equal(err, null);
        blobService.getBlobProperties(containerName, blockBlobName, function(err, blob) {
          assert.equal(blob.contentMD5, blockBlobContentMd5);
          done();
        });
      });
    });

    it('should return a speed summary', function(done) {
      var speedSummary = blobService.createBlockBlobFromFile(containerName, blockBlobName, blockFileName, {}, function (err) {
        assert.equal(err, null);
        assert.equal(speedSummary.getTotalSize(false), Buffer.byteLength(fileText));
        assert.equal(speedSummary.getCompleteSize(false), Buffer.byteLength(fileText));
        assert.equal(speedSummary.getCompletePercent(), '100.0');
        done();
      });
    });

    it('should overwrite the existing blob', function(done) {
      blobService.createBlockBlobFromFile(containerName, blockBlobName, blockFileName, function (err) {
        assert.equal(err, null);
        blobService.createBlockBlobFromFile(containerName, blockBlobName, blockFileName, function (err) {
          assert.equal(err, null);
          done();
        });
      });
    });
  });

  describe('CreateBlockBlobFromStream', function() {
    beforeEach(function (done) {
      blobService.deleteBlob(containerName, blockBlobName, function(error) {
        done();
      });
    });
    it('should work with string path', function(done) {
      var len = Buffer.byteLength(fileText);
      var speedSummary = blobService.createBlockBlobFromStream(containerName, blockBlobName, blockFileName, len, function (err) {
        assert.equal(err, null);
        assert.equal(speedSummary.getCompletePercent(), '100.0');
        blobService.getBlobProperties(containerName, blockBlobName, function(err, blob) {
          assert.equal(blob.contentMD5, blockBlobContentMd5);
          done();
        });
      });
    });

    it('should work with file stream', function(done) {
      var len = Buffer.byteLength(fileText);
      var stream = fs.createReadStream(blockFileName);
      var speedSummary = blobService.createBlockBlobFromStream(containerName, blockBlobName, stream, len, {}, function (err) {
        assert.equal(err, null);
        assert.equal(speedSummary.getCompletePercent(), '100.0');
        blobService.getBlobProperties(containerName, blockBlobName, function(err, blob) {
          assert.equal(blob.contentMD5, blockBlobContentMd5);
          done();
        });
      });
    });

    it('should work with the speed summary in options', function(done) {
      var speedSummary = new azure.BlobService.SpeedSummary();
      var options = {
        speedSummary : speedSummary
      };
      var len = Buffer.byteLength(fileText);
      blobService.createBlockBlobFromStream(containerName, blockBlobName, blockFileName, len, options, function (err) {
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

    it('should work', function(done) {
      blobService.createPageBlobFromFile(containerName, pageBlobName, pageFileName, function (err) {
        assert.equal(err, null);
        blobService.getBlobProperties(containerName, pageBlobName, function(err, blob) {
          assert.equal(blob.contentMD5, undefined);
          done();
        });
      });
    });

    it('should work with speed summary', function(done) {
      var speedSummary = blobService.createPageBlobFromFile(containerName, pageBlobName, pageFileName, function (err) {
        assert.equal(err, null);
        blobService.getBlobProperties(containerName, pageBlobName, function(err, blob) {
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
        setBlobContentMD5 : true,
        useTransactionalMD5 : true
      }
      blobService.createPageBlobFromFile(containerName, pageBlobName, pageFileName, options, function (err) {
        assert.equal(err, null);
        blobService.getBlobProperties(containerName, pageBlobName, function(err, blob) {
          assert.equal(blob.contentMD5, pageBlobContentMd5);
          done();
        });
      });
    });

    it('should overwrite the existing page blob', function(done) {
      var options = {
        setBlobContentMD5 : true,
        useTransactionalMD5 : true
      }
      blobService.createPageBlobFromFile(containerName, pageBlobName, pageFileName, options, function (err) {
        assert.equal(err, null);
        blobService.getBlobProperties(containerName, pageBlobName, function(err, blob) {
          assert.equal(blob.contentMD5, pageBlobContentMd5);
          assert.equal(blob.contentLength, 1024);
          blobService.createPageBlobFromFile(containerName, pageBlobName, page2KFileName, options, function (err) {
            assert.equal(err, null);
            blobService.getBlobProperties(containerName, pageBlobName, function(err, blob) {
              assert.equal(blob.contentLength, 2 * 1024);
              assert.equal(blob.contentMD5, pageBlob2KContentMd5);
              done();
            });
          });
        });
      });
    });

    it('should not work with the file with invalid size', function(done) {
      blobService.createPageBlobFromFile(containerName, pageBlobName, blockFileName, {}, function (err) {
        assert.equal(err.message, "The page blob size must be aligned to a 512-byte boundary. The current stream length is 12");
        done();
      });
    });
  });

  describe('GetBlobToFile', function() {
    describe('BlockBlob', function() {
      beforeEach(function(done) {
        blobService.createBlockBlobFromFile(containerName, blockBlobName, blockFileName, function (err) {
          assert.equal(err, null);
          done();
        });
      });

      it('should work', function(done) {
        blobService.getBlobToFile(containerName, blockBlobName, downloadName, function(err, md5sum) {
          assert.equal(err, null);        
          assert.equal(md5sum, null);
          done();
        });
      });

      it('should work with speed summary', function(done) {
        var speedSummary = blobService.getBlobToFile(containerName, blockBlobName, downloadName, function(err, md5sum) {
          assert.equal(err, null);        
          assert.equal(md5sum, null);
          assert.equal(speedSummary.getTotalSize(false), Buffer.byteLength(fileText));
          assert.equal(speedSummary.getCompleteSize(false), Buffer.byteLength(fileText));
          assert.equal(speedSummary.getCompletePercent(), '100.0');
          done();
        });
      });

      it('shoud calculate content md5', function(done) {
        var options = {checkMd5sum : true}; 
        blobService.getBlobToFile(containerName, blockBlobName, downloadName, options, function(err, md5sum) {
          assert.equal(err, null);        
          assert.equal(md5sum, blockBlobContentMd5);
          done();
        });
      });
    });

    describe('PageBlob', function() {
      beforeEach(function(done) {
        blobService.createPageBlobFromFile(containerName, pageBlobName, pageFileName, function (err) {
          assert.equal(err, null);
          done();
        });
      });

      it('should work', function(done) {
        blobService.getBlobToFile(containerName, pageBlobName, downloadName, function(err, md5sum) {
          assert.equal(err, null);        
          assert.equal(md5sum, null);
          done();
        });
      });

      it('should work with speed summary', function(done) {
        var speedSummary = blobService.getBlobToFile(containerName, pageBlobName, downloadName, function(err, md5sum) {
          assert.equal(err, null);        
          assert.equal(md5sum, null);
          assert.equal(speedSummary.getTotalSize(false), 1024);
          assert.equal(speedSummary.getCompleteSize(false), 1024);
          assert.equal(speedSummary.getCompletePercent(), '100.0');
          done();
        });
      });

      it('shoud calculate content md5', function(done) {
        var options = {checkMd5sum : true}; 
        blobService.getBlobToFile(containerName, pageBlobName, downloadName, options, function(err, md5sum) {
          assert.equal(err, null);        
          assert.equal(md5sum, pageBlobContentMd5);
          done();
        });
      });
    });
  });
});
