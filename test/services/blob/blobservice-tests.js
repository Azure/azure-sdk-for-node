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
var common = require('azure-common');
var storage = testutil.libRequire('services/legacyStorage');

var azureutil = common.util;
var azure = testutil.libRequire('azure');
var WebResource = common.WebResource;

var SharedAccessSignature = storage.SharedAccessSignature;
var BlobService = storage.BlobService;
var ServiceClient = common.ServiceClient;
var ExponentialRetryPolicyFilter = common.ExponentialRetryPolicyFilter;
var Constants = common.Constants;
var BlobConstants = Constants.BlobConstants;
var HttpConstants = Constants.HttpConstants;
var ServiceClientConstants = common.ServiceClientConstants;
var QueryStringConstants = Constants.QueryStringConstants;

var containerNames = [];
var containerNamesPrefix = 'cont';

var blobNames = [];
var blobNamesPrefix = 'blob';

var testPrefix = 'blobservice-tests';

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

  describe('createContainer', function () {
    it('should detect incorrect container names', function (done) {
      assert.throws(function () { blobService.createContainer(null, function () { }); },
        BlobService.incorrectContainerNameErr);

      assert.throws(function () { blobService.createContainer('', function () { }); },
        BlobService.incorrectContainerNameErr);

      assert.throws(function () { blobService.createContainer('as', function () { }); },
        BlobService.incorrectContainerNameFormatErr);

      assert.throws(function () { blobService.createContainer('a--s', function () { }); },
        BlobService.incorrectContainerNameFormatErr);

      assert.throws(function () { blobService.createContainer('cont-', function () { }); },
        BlobService.incorrectContainerNameFormatErr);

      assert.throws(function () { blobService.createContainer('conTain', function () { }); },
        BlobService.incorrectContainerNameFormatErr);

      done();
    });

    it('should work', function (done) {
      var containerName = testutil.generateId(containerNamesPrefix, containerNames, suiteUtil.isMocked);

      blobService.createContainer(containerName, function (createError, container1, createContainerResponse) {
        assert.equal(createError, null);
        assert.notEqual(container1, null);
        if (container1) {
          assert.notEqual(container1.name, null);
          assert.notEqual(container1.etag, null);
          assert.notEqual(container1.lastModified, null);
        }

        assert.equal(createContainerResponse.statusCode, HttpConstants.HttpResponseCodes.Created);

        // creating again will result in a duplicate error
        blobService.createContainer(containerName, function (createError2, container2) {
          assert.equal(createError2.code, Constants.BlobErrorCodeStrings.CONTAINER_ALREADY_EXISTS);
          assert.equal(container2, null);

          done();
        });
      });
    });
  });

  describe('blobExists', function () {
    it('should detect incorrect blob names', function (done) {
      assert.throws(function () { blobService.blobExists('container', null, function () { }); },
        BlobService.incorrectBlobNameFormatErr);

      assert.throws(function () { blobService.blobExists('container', '', function () { }); },
        BlobService.incorrectBlobNameFormatErr);

      done();
    });
  });

  describe('getServiceProperties', function () {
    it('should get blob service properties', function (done) {
      blobService.getServiceProperties(function (error, serviceProperties) {
        assert.equal(error, null);
        assert.notEqual(serviceProperties, null);

        if (serviceProperties) {
          assert.notEqual(serviceProperties.Logging, null);
          if (serviceProperties.Logging) {
            assert.notEqual(serviceProperties.Logging.RetentionPolicy);
            assert.notEqual(serviceProperties.Logging.Version);
          }

          if (serviceProperties.Metrics) {
            assert.notEqual(serviceProperties.Metrics, null);
            assert.notEqual(serviceProperties.Metrics.RetentionPolicy);
            assert.notEqual(serviceProperties.Metrics.Version);
          }
        }

        done();
      });
    });
  });

  describe('getServiceProperties', function () {
    it('should set blob service properties', function (done) {
      blobService.getServiceProperties(function (error, serviceProperties) {
        assert.equal(error, null);

        serviceProperties.DefaultServiceVersion = '2009-09-19';
        serviceProperties.Logging.Read = true;
        blobService.setServiceProperties(serviceProperties, function (error2) {
          assert.equal(error2, null);

          blobService.getServiceProperties(function (error3, serviceProperties2) {
            assert.equal(error3, null);
            assert.equal(serviceProperties2.DefaultServiceVersion, '2009-09-19');
            assert.equal(serviceProperties2.Logging.Read, true);

            done();
          });
        });
      });
    });
  });

  describe('listContainers', function () {
    it('should work', function (done) {
      var containerName1 = testutil.generateId(containerNamesPrefix, containerNames, suiteUtil.isMocked);
      var metadata1 = {
        color: 'orange',
        containernumber: '01',
        somemetadataname: 'SomeMetadataValue'
      };

      var containerName2 = testutil.generateId(containerNamesPrefix, containerNames, suiteUtil.isMocked);
      var metadata2 = {
        color: 'pink',
        containernumber: '02',
        somemetadataname: 'SomeMetadataValue'
      };

      var containerName3 = testutil.generateId(containerNamesPrefix, containerNames, suiteUtil.isMocked);
      var metadata3 = {
        color: 'brown',
        containernumber: '03',
        somemetadataname: 'SomeMetadataValue'
      };

      var containerName4 = testutil.generateId(containerNamesPrefix, containerNames, suiteUtil.isMocked);
      var metadata4 = {
        color: 'blue',
        containernumber: '04',
        somemetadataname: 'SomeMetadataValue'
      };

      var validateContainers = function (containers, entries) {
        containers.forEach(function (container) {
          if (container.name == containerName1) {
            assert.equal(container.metadata.color, metadata1.color);
            assert.equal(container.metadata.containernumber, metadata1.containernumber);
            assert.equal(container.metadata.somemetadataname, metadata1.somemetadataname);
            entries.push(container.name);
          }
          else if (container.name == containerName2) {
            assert.equal(container.metadata.color, metadata2.color);
            assert.equal(container.metadata.containernumber, metadata2.containernumber);
            assert.equal(container.metadata.somemetadataname, metadata2.somemetadataname);
            entries.push(container.name);
          }
          else if (container.name == containerName3) {
            assert.equal(container.metadata.color, metadata3.color);
            assert.equal(container.metadata.containernumber, metadata3.containernumber);
            assert.equal(container.metadata.somemetadataname, metadata3.somemetadataname);
            entries.push(container.name);
          }
          else if (container.name == containerName4) {
            assert.equal(container.metadata.color, metadata4.color);
            assert.equal(container.metadata.containernumber, metadata4.containernumber);
            assert.equal(container.metadata.somemetadataname, metadata4.somemetadataname);
            entries.push(container.name);
          }
        });

        return entries;
      };

      blobService.createContainer(containerName1, { metadata: metadata1 }, function (createError1, createContainer1, createResponse1) {
        assert.equal(createError1, null);
        assert.notEqual(createContainer1, null);
        assert.ok(createResponse1.isSuccessful);

        blobService.createContainer(containerName2, { metadata: metadata2 }, function (createError2, createContainer2, createResponse2) {
          assert.equal(createError2, null);
          assert.notEqual(createContainer2, null);
          assert.ok(createResponse2.isSuccessful);

          blobService.createContainer(containerName3, { metadata: metadata3 }, function (createError3, createContainer3, createResponse3) {
            assert.equal(createError3, null);
            assert.notEqual(createContainer3, null);
            assert.ok(createResponse3.isSuccessful);

            blobService.createContainer(containerName4, { metadata: metadata4 }, function (createError4, createContainer4, createResponse4) {
              assert.equal(createError4, null);
              assert.notEqual(createContainer4, null);
              assert.ok(createResponse4.isSuccessful);

              var options = {
                'maxresults': 3,
                'include': 'metadata'
              };

              blobService.listContainers(options, function (listError, containers, containersContinuation, listResponse) {
                assert.equal(listError, null);
                assert.ok(listResponse.isSuccessful);
                assert.equal(containers.length, 3);

                var entries = validateContainers(containers, []);

                assert.equal(containersContinuation.hasNextPage(), true);
                containersContinuation.getNextPage(function (listErrorContinuation, containers2) {
                  assert.equal(listErrorContinuation, null);
                  assert.ok(listResponse.isSuccessful);
                  validateContainers(containers2, entries);
                  assert.equal(entries.length, 4);

                  done();
                });
              });
            });
          });
        });
      });
    });

    it('should work with optional parameters', function (done) {
      blobService.listContainers(null, function (err) {
        assert.equal(err, null);
        done();
      });
    });

    it('should work with prefix parameter', function (done) {
      blobService.listContainers({ prefix : '中文' }, function (err) {
        assert.equal(err, null);
        done();
      });
    });
  });

  describe('createContainerIfNotExists', function() {
    it('should create a container if not exists', function (done) {
      var containerName = testutil.generateId(containerNamesPrefix, containerNames, suiteUtil.isMocked);

      blobService.createContainer(containerName, function (createError, container1, createContainerResponse) {
        assert.equal(createError, null);
        assert.notEqual(container1, null);
        if (container1) {
          assert.notEqual(container1.name, null);
          assert.notEqual(container1.etag, null);
          assert.notEqual(container1.lastModified, null);
        }

        assert.equal(createContainerResponse.statusCode, HttpConstants.HttpResponseCodes.Created);

        // creating again will result in a duplicate error
        blobService.createContainerIfNotExists(containerName, function (createError2, isCreated) {
          assert.equal(createError2, null);
          assert.equal(isCreated, false);

          done();
        });
      });
    });

    it('should throw if called with a callback', function (done) {
      assert.throws(function () { blobService.createContainerIfNotExists('name'); },
        Error
      );

      done();
    });
  });

  describe('container', function () {
    var containerName;
    var metadata;

    beforeEach(function (done) {
      containerName = testutil.generateId(containerNamesPrefix, containerNames, suiteUtil.isMocked);
      metadata = { color: 'blue' };

      blobService.createContainer(containerName, { metadata: metadata }, done);
    });

    describe('getContainerProperties', function () {
      it('should work', function (done) {
        blobService.getContainerProperties(containerName, function (getError, container2, getResponse) {
          assert.equal(getError, null);
          assert.notEqual(container2, null);
          if (container2) {
            assert.equal('unlocked', container2.leaseStatus);
            assert.equal('available', container2.leaseState);
            assert.equal(null, container2.leaseDuration);
            assert.notEqual(null, container2.requestId);
            assert.equal(container2.metadata.color, metadata.color);
          }

          assert.notEqual(getResponse, null);
          assert.equal(getResponse.isSuccessful, true);

          done();
        });
      });
    });

    describe('setContainerMetadata', function () {
      it('should work', function (done) {
        var metadata = { 'class': 'test' };
        blobService.setContainerMetadata(containerName, metadata, function (setMetadataError, setMetadataResponse) {
          assert.equal(setMetadataError, null);
          assert.ok(setMetadataResponse.isSuccessful);

          blobService.getContainerMetadata(containerName, function (getMetadataError, containerMetadata, getMetadataResponse) {
            assert.equal(getMetadataError, null);
            assert.notEqual(containerMetadata, null);
            assert.notEqual(containerMetadata.metadata, null);
            if (containerMetadata.metadata) {
              assert.equal(containerMetadata.metadata.class, 'test');
            }

            assert.ok(getMetadataResponse.isSuccessful);

            done();
          });
        });
      });
    });

    describe('getContainerAcl', function () {
      it('should work', function (done) {
        blobService.getContainerAcl(containerName, function (containerAclError, containerBlob, containerAclResponse) {
          assert.equal(containerAclError, null);
          assert.notEqual(containerBlob, null);
          if (containerBlob) {
            assert.equal(containerBlob.publicAccessLevel, BlobConstants.BlobContainerPublicAccessType.OFF);
          }

          assert.equal(containerAclResponse.isSuccessful, true);

          done();
        });
      });
    });

    describe('setContainerAcl', function () {
      it('should work', function (done) {
        blobService.setContainerAcl(containerName, BlobConstants.BlobContainerPublicAccessType.BLOB, function (setAclError, setAclContainer1, setResponse1) {
          assert.equal(setAclError, null);
          assert.notEqual(setAclContainer1, null);
          assert.ok(setResponse1.isSuccessful);

          blobService.getContainerAcl(containerName, function (getAclError, getAclContainer1, getResponse1) {
            assert.equal(getAclError, null);
            assert.notEqual(getAclContainer1, null);
            if (getAclContainer1) {
              assert.equal(getAclContainer1.publicAccessLevel, BlobConstants.BlobContainerPublicAccessType.BLOB);
            }

            assert.ok(getResponse1.isSuccessful);

            blobService.setContainerAcl(containerName, BlobConstants.BlobContainerPublicAccessType.CONTAINER, function (setAclError2, setAclContainer2, setResponse2) {
              assert.equal(setAclError2, null);
              assert.notEqual(setAclContainer2, null);
              assert.ok(setResponse2.isSuccessful);

              setTimeout(function () {
                blobService.getContainerAcl(containerName, function (getAclError2, getAclContainer2, getResponse3) {
                  assert.equal(getAclError2, null);
                  assert.notEqual(getAclContainer2, null);
                  if (getAclContainer2) {
                    assert.equal(getAclContainer2.publicAccessLevel, BlobConstants.BlobContainerPublicAccessType.CONTAINER);
                  }

                  assert.ok(getResponse3.isSuccessful);

                  done();
                });
              }, (suiteUtil.isMocked && !suiteUtil.isRecording) ? 0 : 5000);
            });
          });
        });
      });

      it('should work with policies', function (done) {
        var readWriteStartDate = new Date(Date.UTC(2012, 10, 10));
        var readWriteExpiryDate = new Date(readWriteStartDate);
        readWriteExpiryDate.setMinutes(readWriteStartDate.getMinutes() + 10);
        readWriteExpiryDate.setMilliseconds(999);

        var readWriteSharedAccessPolicy = {
          Id: 'readwrite',
          AccessPolicy: {
            Start: readWriteStartDate,
            Expiry: readWriteExpiryDate,
            Permissions: 'rw'
          }
        };

        var readSharedAccessPolicy = {
          Id: 'read',
          AccessPolicy: {
            Expiry: readWriteStartDate,
            Permissions: 'r'
          }
        };

        var options = {};
        options.signedIdentifiers = [readWriteSharedAccessPolicy, readSharedAccessPolicy];

        blobService.setContainerAcl(containerName, BlobConstants.BlobContainerPublicAccessType.BLOB, options, function (setAclError, setAclContainer1, setResponse1) {
          assert.equal(setAclError, null);
          assert.notEqual(setAclContainer1, null);
          assert.ok(setResponse1.isSuccessful);

          blobService.getContainerAcl(containerName, function (getAclError, getAclContainer1, getResponse1) {
            assert.equal(getAclError, null);
            assert.notEqual(getAclContainer1, null);
            if (getAclContainer1) {
              assert.equal(getAclContainer1.publicAccessLevel, BlobConstants.BlobContainerPublicAccessType.BLOB);
              assert.equal(getAclContainer1.signedIdentifiers[0].AccessPolicy.Expiry.getTime(), readWriteExpiryDate.getTime());
            }

            assert.ok(getResponse1.isSuccessful);

            blobService.setContainerAcl(containerName, BlobConstants.BlobContainerPublicAccessType.CONTAINER, function (setAclError2, setAclContainer2, setResponse2) {
              assert.equal(setAclError2, null);
              assert.notEqual(setAclContainer2, null);
              assert.ok(setResponse2.isSuccessful);

              blobService.getContainerAcl(containerName, function (getAclError2, getAclContainer2, getResponse3) {
                assert.equal(getAclError2, null);
                assert.notEqual(getAclContainer2, null);
                if (getAclContainer2) {
                  assert.equal(getAclContainer2.publicAccessLevel, BlobConstants.BlobContainerPublicAccessType.CONTAINER);
                }

                assert.ok(getResponse3.isSuccessful);

                done();
              });
            });
          });
        });
      });

      it('should work with signed identifiers', function (done) {
        var options = {};
        options.signedIdentifiers = [
          { Id: 'id1',
            AccessPolicy: {
              Start: '2009-10-10T00:00:00.123Z',
              Expiry: '2009-10-11T00:00:00.456Z',
              Permissions: 'r'
            }
          },
          { Id: 'id2',
            AccessPolicy: {
              Start: '2009-11-10T00:00:00.006Z',
              Expiry: '2009-11-11T00:00:00.4Z',
              Permissions: 'w'
            }
          }];

        blobService.setContainerAcl(containerName, BlobConstants.BlobContainerPublicAccessType.OFF, options, function (setAclError, setAclContainer, setAclResponse) {
          assert.equal(setAclError, null);
          assert.notEqual(setAclContainer, null);
          assert.ok(setAclResponse.isSuccessful);

          blobService.getContainerAcl(containerName, function (getAclError, containerAcl, getAclResponse) {
            assert.equal(getAclError, null);
            assert.notEqual(containerAcl, null);
            assert.notEqual(getAclResponse, null);

            if (getAclResponse) {
              assert.equal(getAclResponse.isSuccessful, true);
            }

            var entries = 0;
            if (containerAcl) {
              if (containerAcl.signedIdentifiers) {
                containerAcl.signedIdentifiers.forEach(function (identifier) {
                  if (identifier.Id === 'id1') {
                    assert.equal(identifier.AccessPolicy.Start.getTime(), new Date('2009-10-10T00:00:00.123Z').getTime());
                    assert.equal(identifier.AccessPolicy.Expiry.getTime(), new Date('2009-10-11T00:00:00.456Z').getTime());
                    assert.equal(identifier.AccessPolicy.Permission, 'r');
                    entries += 1;
                  }
                  else if (identifier.Id === 'id2') {
                    assert.equal(identifier.AccessPolicy.Start.getTime(), new Date('2009-11-10T00:00:00.006Z').getTime());
                    assert.equal(identifier.AccessPolicy.Start.getMilliseconds(), 6);
                    assert.equal(identifier.AccessPolicy.Expiry.getTime(), new Date('2009-11-11T00:00:00.4Z').getTime());
                    assert.equal(identifier.AccessPolicy.Expiry.getMilliseconds(), 400);
                    assert.equal(identifier.AccessPolicy.Permission, 'w');
                    entries += 2;
                  }
                });
              }
            }

            assert.equal(entries, 3);

            done();
          });
        });
      });
    });

    describe('createBlockBlobFromText', function () {
      it('should work', function (done) {
        var blobName = testutil.generateId(blobNamesPrefix, blobNames, suiteUtil.isMocked);
        var blobText = 'Hello World';

        blobService.createBlockBlobFromText(containerName, blobName, blobText, function (uploadError, blob, uploadResponse) {
          assert.equal(uploadError, null);
          assert.ok(uploadResponse.isSuccessful);

          blobService.getBlobToText(containerName, blobName, function (downloadErr, blobTextResponse) {
            assert.equal(downloadErr, null);
            assert.equal(blobTextResponse, blobText);

            done();
          });
        });
      });
    });

    describe('createBlobSnapshot', function () {
      it('should work', function (done) {
        var blobName = testutil.generateId(blobNamesPrefix, blobNames, suiteUtil.isMocked);
        var blobText = 'Hello World';

        blobService.createBlockBlobFromText(containerName, blobName, blobText, function (uploadError, blob, putResponse) {
          assert.equal(uploadError, null);
          assert.notEqual(putResponse, null);
          if (putResponse) {
            assert.ok(putResponse.isSuccessful);
          }

          blobService.createBlobSnapshot(containerName, blobName, function (snapshotError, snapshotId, snapshotResponse) {
            assert.equal(snapshotError, null);
            assert.notEqual(snapshotResponse, null);
            assert.notEqual(snapshotId, null);

            if (snapshotResponse) {
              assert.ok(snapshotResponse.isSuccessful);
            }

            blobService.getBlobToText(containerName, blobName, function (getError, content, blockBlob, getResponse) {
              assert.equal(getError, null);
              assert.notEqual(blockBlob, null);
              assert.notEqual(getResponse, null);
              if (getResponse) {
                assert.ok(getResponse.isSuccessful);
              }

              assert.equal(blobText, content);
              done();
            });
          });
        });
      });
    });

    describe('acquireLease', function () {
      it('should work', function (done) {
        var blobName = testutil.generateId(blobNamesPrefix, blobNames, suiteUtil.isMocked);
        var blobText = 'hello';

        blobService.createBlockBlobFromText(containerName, blobName, blobText, function (uploadError, blob, uploadResponse) {
          assert.equal(uploadError, null);
          assert.notEqual(blob, null);
          assert.ok(uploadResponse.isSuccessful);

          // Acquire a lease
          blobService.acquireLease(containerName, blobName, function (leaseBlobError, lease, leaseBlobResponse) {
            assert.equal(leaseBlobError, null);
            assert.notEqual(lease, null);
            if (lease) {
              assert.ok(lease.id);
            }

            assert.notEqual(leaseBlobResponse, null);
            if (leaseBlobResponse) {
              assert.ok(leaseBlobResponse.isSuccessful);
            }

            // Second lease should not be possible
            blobService.acquireLease(containerName, blobName, function (secondLeaseBlobError, secondLease, secondLeaseBlobResponse) {
              assert.equal(secondLeaseBlobError.code, 'LeaseAlreadyPresent');
              assert.equal(secondLease, null);
              assert.equal(secondLeaseBlobResponse.isSuccessful, false);

              // Delete should not be possible
              blobService.deleteBlob(containerName, blobName, function (deleteError, deleted, deleteResponse) {
                assert.equal(deleteError.code, 'LeaseIdMissing');
                assert.equal(deleteResponse.isSuccessful, false);

                done();
              });
            });
          });
        });
      });
    });

    describe('getBlobProperties', function () {
      it('should work', function (done) {
        var blobName = testutil.generateId(blobNamesPrefix, blobNames, suiteUtil.isMocked);
        var metadata = {
          color: 'blue'
        };

        blobService.createBlockBlobFromText(containerName, blobName, 'hello', { metadata: metadata }, function (blobErr) {
          assert.equal(blobErr, null);

          blobService.getBlobProperties(containerName, blobName, function (getErr, blob) {
            assert.equal(getErr, null);

            assert.notEqual(blob, null);

            if (blob) {
              assert.notEqual(blob.metadata, null);
              if (blob.metadata) {
                assert.equal(blob.metadata.color, metadata.color);
              }
            }

            done();
          });
        });
      });
    });

    describe('setBlobProperties', function () {
      it('should work', function (done) {
        var blobName = testutil.generateId(blobNamesPrefix, blobNames, suiteUtil.isMocked);
        var text = 'hello';

        blobService.createBlockBlobFromText(containerName, blobName, text, function (blobErr) {
          assert.equal(blobErr, null);

          var options = {};
          options.contentType = 'text';
          options.contentEncoding = 'utf8';
          options.contentLanguage = 'pt';
          options.cacheControl = 'true';

          blobService.setBlobProperties(containerName, blobName, options, function (setErr) {
            assert.equal(setErr, null);

            blobService.getBlobProperties(containerName, blobName, function (getErr, blob) {
              assert.equal(getErr, null);

              assert.notEqual(blob, null);
              if (blob) {
                assert.equal(blob.contentLength, text.length);
                assert.equal(blob.contentType, options.contentType);
                assert.equal(blob.contentEncoding, options.contentEncoding);
                assert.equal(blob.contentLanguage, options.contentLanguage);
                assert.equal(blob.cacheControl, options.cacheControl);
              }

              done();
            });
          });
        });
      });
    });

    describe('getBlobMetadata', function () {
      it('should work', function (done) {
        var blobName = testutil.generateId(blobNamesPrefix, blobNames, suiteUtil.isMocked);
        var metadata = { color: 'blue' };

        blobService.createBlockBlobFromText(containerName, blobName, 'hello', { metadata: metadata }, function (blobErr) {
          assert.equal(blobErr, null);

          blobService.getBlobMetadata(containerName, blobName, function (getErr, blob) {
            assert.equal(getErr, null);

            assert.notEqual(blob, null);
            if (blob) {
              assert.notEqual(blob.metadata, null);
              if (blob.metadata) {
                assert.equal(blob.metadata.color, metadata.color);
              }
            }

            done();
          });
        });
      });
    });

    describe('pageBlob', function () {
      it('should work', function (done) {
        var blobName = testutil.generateId(blobNamesPrefix, blobNames, suiteUtil.isMocked);

        var data1 = 'Hello, World!' + repeat(' ', 1024 - 13);
        var data2 = 'Hello, World!' + repeat(' ', 512 - 13);

        // Create the empty page blob
        blobService.createPageBlob(containerName, blobName, 1024, function (err) {
          assert.equal(err, null);

          // Upload all data
          blobService.createBlobPagesFromText(containerName, blobName, data1, 0, 1023, function (err2) {
            assert.equal(err2, null);

            // Verify contents
            blobService.getBlobToText(containerName, blobName, function (err3, content1) {
              assert.equal(err3, null);
              assert.equal(content1, data1);

              // Clear the page blob
              blobService.clearBlobPages(containerName, blobName, 0, 1023, function (err4) {
                assert.equal(err4);

                // Upload other data in 2 pages
                blobService.createBlobPagesFromText(containerName, blobName, data2, 0, 511, function (err5) {
                  assert.equal(err5, null);

                  blobService.createBlobPagesFromText(containerName, blobName, data2, 512, 1023, function (err6) {
                    assert.equal(err6, null);

                    blobService.getBlobToText(containerName, blobName, function (err7, content2) {
                      assert.equal(err7, null);
                      assert.equal(data2 + data2, content2);

                      done();
                    });
                  });
                });
              });
            });
          });
        });
      });
    });

    describe('createBlockBlobFromText', function () {
      it('should work with access condition', function (done) {
        var blobName = testutil.generateId(blobNamesPrefix, blobNames, suiteUtil.isMocked);
        var blobText = 'hello';

        blobService.createBlockBlobFromText(containerName, blobName, blobText, function (error2) {
          assert.equal(error2, null);

          blobService.getBlobProperties(containerName, blobName, function (error4, blobProperties) {
            assert.equal(error4, null);

            var options = { accessConditions: { 'if-none-match': blobProperties.etag} };
            blobService.createBlockBlobFromText(containerName, blobName, blobText, options, function (error3) {
              assert.notEqual(error3, null);
              assert.equal(error3.code, Constants.StorageErrorCodeStrings.CONDITION_NOT_MET);

              done();
            });
          });
        });
      });

      it('should work for small size from file', function (done) {
        var blobName = testutil.generateId(blobNamesPrefix, blobNames, suiteUtil.isMocked) + ' a';
        var blobText = 'Hello World';

        blobService.createBlockBlobFromText(containerName, blobName, blobText, function (uploadError, blobResponse, uploadResponse) {
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

    describe('getBlobRange', function () {
      it('should work', function (done) {
        var blobName = testutil.generateId(blobNamesPrefix, blobNames, suiteUtil.isMocked);

        var data1 = 'Hello, World!';

        // Create the empty page blob
        blobService.createBlockBlobFromText(containerName, blobName, data1, function (err) {
          assert.equal(err, null);

          blobService.getBlobToText(containerName, blobName, { rangeStart: 2, rangeEnd: 3 }, function (err3, content1) {
            assert.equal(err3, null);

            // get the double ll's in the hello
            assert.equal(content1, 'll');

            done();
          });
        });
      });
    });

    describe('getBlobRangeOpenEnded', function () {
      it('should work', function (done) {
        var blobName = testutil.generateId(blobNamesPrefix, blobNames, suiteUtil.isMocked);

        var data1 = 'Hello, World!';

        // Create the empty page blob
        blobService.createBlockBlobFromText(containerName, blobName, data1, function (err) {
          assert.equal(err, null);

          blobService.getBlobToText(containerName, blobName, { rangeStart: 2 }, function (err3, content1) {
            assert.equal(err3, null);

            // get the last bytes from the message
            assert.equal(content1, 'llo, World!');

            done();
          });
        });
      });
    });

    describe('setBlobMime', function () {
      it('should work', function (done) {
        var blobName = testutil.generateId(blobNamesPrefix, blobNames, suiteUtil.isMocked);
        var fileNameSource = testutil.generateId('file') + '.bmp'; // fake bmp file with text...
        var blobText = 'Hello World!';

        fs.writeFile(fileNameSource, blobText, function () {

          // Create the empty page blob
          var blobOptions = {blockIdPrefix : 'blockId' };
          blobService.createBlockBlobFromFile(containerName, blobName, fileNameSource, blobOptions, function (err) {
            assert.equal(err, null);

            blobService.getBlobToText(containerName, blobName, { rangeStart: 2 }, function (err3, content1, blob) {
              assert.equal(err3, null);

              // get the last bytes from the message
              assert.equal(content1, 'llo World!');
              assert.ok(blob.contentType === 'image/bmp' || blob.contentType === 'image/x-ms-bmp');

              fs.unlink(fileNameSource, function () {
                done();
              });
            });
          });
        });
      });

      it('should work with skip', function (done) {
        var blobName = testutil.generateId(blobNamesPrefix, blobNames, suiteUtil.isMocked);
        var fileNameSource = testutil.generateId('prefix') + '.bmp'; // fake bmp file with text...
        var blobText = 'Hello World!';

        fs.writeFile(fileNameSource, blobText, function () {
          // Create the empty page blob
          blobService.createBlockBlobFromFile(containerName, blobName, fileNameSource, { contentType: null, contentTypeHeader: null, blockIdPrefix : 'blockId' }, function (err) {
            assert.equal(err, null);

            blobService.getBlobToText(containerName, blobName, { rangeStart: 2 }, function (err3, content1, blob) {
              assert.equal(err3, null);

              // get the last bytes from the message
              assert.equal(content1, 'llo World!');
              assert.equal(blob.contentType, 'application/octet-stream');

              fs.unlink(fileNameSource, function () {
                done();
              });
            });
          });
        });
      });
    });
  });

  describe('copyBlob', function () {
    it('should work', function (done) {
      var sourceContainerName = testutil.generateId(containerNamesPrefix, containerNames, suiteUtil.isMocked);
      var targetContainerName = testutil.generateId(containerNamesPrefix, containerNames, suiteUtil.isMocked);

      var sourceBlobName = testutil.generateId(blobNamesPrefix, blobNames, suiteUtil.isMocked);
      var targetBlobName = testutil.generateId(blobNamesPrefix, blobNames, suiteUtil.isMocked);

      var blobText = 'hi there';

      blobService.createContainer(sourceContainerName, function (createErr1) {
        assert.equal(createErr1, null);

        blobService.createContainer(targetContainerName, function (createErr2) {
          assert.equal(createErr2, null);

          blobService.createBlockBlobFromText(sourceContainerName, sourceBlobName, blobText, function (uploadErr) {
            assert.equal(uploadErr, null);

            blobService.copyBlob(blobService.getBlobUrl(sourceContainerName, sourceBlobName), targetContainerName, targetBlobName, function (copyErr) {
              assert.equal(copyErr, null);

              blobService.getBlobToText(targetContainerName, targetBlobName, function (downloadErr, text) {
                assert.equal(downloadErr, null);
                assert.equal(text, blobText);

                done();
              });
            });
          });
        });
      });
    });
  });

  describe('listBlobs', function () {
    var containerName;

    beforeEach(function (done) {
      containerName = testutil.generateId(containerNamesPrefix, containerNames, suiteUtil.isMocked);

      blobService.createContainer(containerName, done);
    });

    it('should work', function (done) {
      var blobName1 = testutil.generateId(blobNamesPrefix, blobNames, suiteUtil.isMocked);
      var blobName2 = testutil.generateId(blobNamesPrefix, blobNames, suiteUtil.isMocked);
      var blobText1 = 'hello1';
      var blobText2 = 'hello2';

      // Test listing 0 blobs
      blobService.listBlobs(containerName, function (listErrNoBlobs, listNoBlobs) {
        assert.equal(listErrNoBlobs, null);
        assert.notEqual(listNoBlobs, null);
        if (listNoBlobs) {
          assert.equal(listNoBlobs.length, 0);
        }

        blobService.createBlockBlobFromText(containerName, blobName1, blobText1, function (blobErr1) {
          assert.equal(blobErr1, null);

          // Test listing 1 blob
          blobService.listBlobs(containerName, function (listErr, listBlobs) {
            assert.equal(listErr, null);
            assert.notEqual(listBlobs, null);
            assert.equal(listBlobs.length, 1);

            blobService.createBlockBlobFromText(containerName, blobName2, blobText2, function (blobErr2) {
              assert.equal(blobErr2, null);

              // Test listing multiple blobs
              blobService.listBlobs(containerName, function (listErr2, listBlobs2) {
                assert.equal(listErr2, null);
                assert.notEqual(listBlobs2, null);
                if (listBlobs2) {
                  assert.equal(listBlobs2.length, 2);

                  var entries = 0;
                  listBlobs2.forEach(function (blob) {
                    if (blob.name === blobName1) {
                      entries += 1;
                    }
                    else if (blob.name === blobName2) {
                      entries += 2;
                    }
                  });

                  assert.equal(entries, 3);
                }

                blobService.createBlobSnapshot(containerName, blobName1, function (snapErr) {
                  assert.equal(snapErr, null);

                  // Test listing without requesting snapshots
                  blobService.listBlobs(containerName, function (listErr3, listBlobs3) {
                    assert.equal(listErr3, null);
                    assert.notEqual(listBlobs3, null);
                    if (listBlobs3) {
                      assert.equal(listBlobs3.length, 2);
                    }

                    // Test listing including snapshots
                    blobService.listBlobs(containerName, { include: BlobConstants.BlobListingDetails.SNAPSHOTS }, function (listErr4, listBlobs4) {
                      assert.equal(listErr4, null);
                      assert.notEqual(listBlobs4, null);

                      if (listBlobs3) {
                        assert.equal(listBlobs4.length, 3);
                      }

                      done();
                    });
                  });
                });
              });
            });
          });
        });
      });
    });
  });

  describe('getPageRegions', function () {
    var containerName;

    beforeEach(function (done) {
      containerName = testutil.generateId(containerNamesPrefix, containerNames, suiteUtil.isMocked);

      blobService.createContainer(containerName, done);
    });

    it('should work', function (done) {
      var blobName = testutil.generateId(blobNamesPrefix, blobNames, suiteUtil.isMocked);

      var data = 'Hello, World!' + repeat(' ', 512 - 13);

      // Upload contents in 2 parts
      blobService.createPageBlob(containerName, blobName, 1024 * 1024 * 1024, function (err) {
        assert.equal(err, null);

        // Upload all data
        blobService.createBlobPagesFromText(containerName, blobName, data, 0, 511, function (err2) {
          assert.equal(err2, null);

          // Only one region present
          blobService.listBlobRegions(containerName, blobName, 0, null, function (error, regions) {
            assert.equal(error, null);
            assert.notEqual(regions, null);
            if (regions) {
              assert.equal(regions.length, 1);

              var entries = 0;
              regions.forEach(function (region) {
                if (region.start === 0) {
                  assert.equal(region.end, 511);
                  entries += 1;
                }
              });

              assert.equal(entries, 1);
            }

            blobService.createBlobPagesFromText(containerName, blobName, data, 1048576, 1049087, null, function (err3) {
              assert.equal(err3, null);

              // Get page regions
              blobService.listBlobRegions(containerName, blobName, 0, null, function (error5, regions) {
                assert.equal(error5, null);
                assert.notEqual(regions, null);
                if (regions) {
                  assert.equal(regions.length, 2);

                  var entries = 0;
                  regions.forEach(function (region) {
                    if (region.start === 0) {
                      assert.equal(region.end, 511);
                      entries += 1;
                    }
                    else if (region.start === 1048576) {
                      assert.equal(region.end, 1049087);
                      entries += 2;
                    }
                  });

                  assert.equal(entries, 3);
                }

                done();
              });
            });
          });
        });
      });
    });
  });

  it('CreateBlobWithBars', function (done) {
    var containerName = testutil.generateId(containerNamesPrefix, containerNames, suiteUtil.isMocked);
    var blobName = 'blobs/' + testutil.generateId(blobNamesPrefix, blobNames, suiteUtil.isMocked);
    var blobText = 'Hello World!';

    blobService.createContainer(containerName, function (createError) {
      assert.equal(createError, null);

      // Create the empty page blob
      blobService.createBlockBlobFromText(containerName, blobName, blobText, function (err) {
        assert.equal(err, null);

        blobService.getBlobProperties(containerName, blobName, function (error, properties) {
          assert.equal(error, null);
          assert.equal(properties.container, containerName);
          assert.equal(properties.blob, blobName);

          done();
        });
      });
    });
  });

  it('works with files without specifying content type', function (done) {
    // This test ensures that blocks can be created from files correctly
    // and was created to ensure that the request module does not magically add
    // a content type to the request when the user did not specify one.
    var containerName = testutil.generateId(containerNamesPrefix, containerNames, suiteUtil.isMocked);
    var blobName = testutil.generateId(blobNamesPrefix, blobNames, suiteUtil.isMocked);
    var fileName= testutil.generateId('prefix') + '.txt';
    var blobText = 'Hello World!';

    try { fs.unlinkSync(fileName); } catch (e) {}
    fs.writeFileSync(fileName, blobText);

    var stat = fs.statSync(fileName);

    blobService.createContainer(containerName, function (createErr1) {
      assert.equal(createErr1, null);

      blobService.createBlobBlockFromStream('test', containerName, blobName, fs.createReadStream(fileName), stat.size, function (error) {
        try { fs.unlinkSync(fileName); } catch (e) {}

        assert.equal(error, null);

        done();
      });
    });
  });

  it('CommitBlockList', function (done) {
    var containerName = testutil.generateId(containerNamesPrefix, containerNames, suiteUtil.isMocked);
    var blobName = testutil.generateId(blobNamesPrefix, blobNames, suiteUtil.isMocked);

    blobService.createContainer(containerName, function (error) {
      assert.equal(error, null);

      blobService.createBlobBlockFromText('id1', containerName, blobName, 'id1', function (error2) {
        assert.equal(error2, null);

        blobService.createBlobBlockFromText('id2', containerName, blobName, 'id2', function (error3) {
          assert.equal(error3, null);

          var blockList = {
            LatestBlocks: ['id1'],
            UncommittedBlocks: ['id2']
          };

          blobService.commitBlobBlocks(containerName, blobName, blockList, function (error4) {
            assert.equal(error4, null);

            blobService.listBlobBlocks(containerName, blobName, BlobConstants.BlockListFilter.ALL, function (error5, list) {
              assert.equal(error5, null);
              assert.notEqual(list, null);
              assert.notEqual(list.CommittedBlocks, null);
              assert.equal(list.CommittedBlocks.length, 2);

              done();
            });
          });
        });
      });
    });
  });

  describe('shared access signature', function () {
    describe('getBlobUrl', function () {
      it('should work', function (done) {
        var containerName = testutil.generateId(containerNamesPrefix, containerNames, suiteUtil.isMocked);
        var blobName = testutil.generateId(blobNamesPrefix, blobNames, suiteUtil.isMocked);

        var blobServiceassert = storage.createBlobService('storageAccount', 'storageAccessKey', 'host.com:80');

        var blobUrl = blobServiceassert.getBlobUrl(containerName);
        assert.equal(blobUrl, 'https://host.com:80/' + containerName);

        blobUrl = blobServiceassert.getBlobUrl(containerName, blobName);
        assert.equal(blobUrl, 'https://host.com:80/' + containerName + '/' + blobName);

        done();
      });

      it('should work with shared access policy', function (done) {
        var containerName = 'container';
        var blobName = 'blob';

        var blobServiceassert = storage.createBlobService('storageAccount', 'storageAccessKey', 'host.com:80');

        var sharedAccessPolicy = {
          AccessPolicy: {
            Expiry: new Date('October 12, 2011 11:53:40 am GMT')
          }
        };

        var blobUrl = blobServiceassert.getBlobUrl(containerName, blobName, sharedAccessPolicy);
        assert.equal(blobUrl, 'https://host.com:80/' + containerName + '/' + blobName + '?se=2011-10-12T11%3A53%3A40Z&sr=b&sv=2012-02-12&sig=gDOuwDoa4F7hhQJW9ReCimoHN2qp7NF1Nu3sdHjwIfs%3D');

        done();
      });

      it('should work with container acl permissions and spaces in name', function (done) {
        var containerName = testutil.generateId(containerNamesPrefix, containerNames, suiteUtil.isMocked);
        var blobName = testutil.generateId(blobNamesPrefix, blobNames, suiteUtil.isMocked) + ' foobar';
        var blobText = 'Hello World';
        var fileNameSource = testutil.generateId('prefix') + '.txt'; // fake bmp file with text...

        blobService.createContainer(containerName, function (err) {
          assert.equal(err, null);

          var startTime = new Date('April 15, 2013 11:53:40 am GMT');

          var readWriteSharedAccessPolicy = {
            Id: 'readwrite',
            AccessPolicy: {
              Start: startTime,
              Permissions: 'rwdl'
            }
          };

          blobService.setContainerAcl(containerName, null, { signedIdentifiers: [ readWriteSharedAccessPolicy ] }, function (err) {
            assert.equal(err, null);

            blobService.createBlockBlobFromText(containerName, blobName, blobText, function (uploadError, blob, uploadResponse) {
              assert.equal(uploadError, null);
              assert.ok(uploadResponse.isSuccessful);

              var blobUrl = blobService.getBlobUrl(containerName, blobName, {
                Id: 'readwrite',
                AccessPolicy: {
                  Expiry: new Date('April 15, 2099 11:53:40 am GMT')
                }
              });

              function responseCallback(err, rsp) {
                assert.equal(rsp.statusCode, 200);
                assert.equal(err, null);

                fs.unlink(fileNameSource, done);
              }

              request.get(blobUrl, responseCallback).pipe(fs.createWriteStream(fileNameSource));
            });
          });
        });
      });

      it('should work with container acl permissions', function (done) {
        var containerName = testutil.generateId(containerNamesPrefix, containerNames, suiteUtil.isMocked);
        var blobName = testutil.generateId(blobNamesPrefix, blobNames, suiteUtil.isMocked);
        var fileNameSource = testutil.generateId('prefix') + '.bmp'; // fake bmp file with text...
        var blobText = 'Hello World!';

        blobService.createContainer(containerName, function (error) {
          assert.equal(error, null);

          var startTime = new Date('April 15, 2013 11:53:40 am GMT');

          var readWriteSharedAccessPolicy = {
            Id: 'readwrite',
            AccessPolicy: {
              Start: startTime,
              Permissions: 'rwdl'
            }
          };

          blobService.setContainerAcl(containerName, null, { signedIdentifiers: [ readWriteSharedAccessPolicy ] }, function (err) {
            assert.equal(err, null);

            blobService.createBlockBlobFromText(containerName, blobName, blobText, function (err) {
              assert.equal(err, null);

              var blobUrl = blobService.getBlobUrl(containerName, blobName, {
                Id: 'readwrite',
                AccessPolicy: {
                  Expiry: new Date('April 15, 2099 11:53:40 am GMT')
                }
              });

              function responseCallback(err, rsp) {
                assert.equal(rsp.statusCode, 200);
                assert.equal(err, null);

                fs.unlink(fileNameSource, done);
              }

              request.get(blobUrl, responseCallback).pipe(fs.createWriteStream(fileNameSource));
            });
          });
        });
      });

      it('should work with duration', function (done) {
        var containerName = 'container';
        var blobName = 'blob';

        var blobServiceassert = storage.createBlobService('storageAccount', 'storageAccessKey', 'host.com:80');

        // Mock Date just to ensure a fixed signature
        this.clock = sinon.useFakeTimers(0, 'Date');

        var sharedAccessPolicy = {
          AccessPolicy: {
            Expiry: storage.date.minutesFromNow(10)
          }
        };

        this.clock.restore();

        var blobUrl = blobServiceassert.getBlobUrl(containerName, blobName, sharedAccessPolicy);
        assert.equal(blobUrl, 'https://host.com:80/' + containerName + '/' + blobName + '?se=1970-01-01T00%3A10%3A00Z&sr=b&sv=2012-02-12&sig=ca700zLsjqapO1sUBVHIBblj2XoJCON1V4gMSfyQZc8%3D');

        done();
      });
    });

    it('GenerateSharedAccessSignature', function (done) {
      var containerName = 'images';
      var blobName = 'pic1.png';

      var devStorageBlobService = storage.createBlobService(ServiceClientConstants.DEVSTORE_STORAGE_ACCOUNT, ServiceClientConstants.DEVSTORE_STORAGE_ACCESS_KEY);

      var sharedAccessPolicy = {
        AccessPolicy: {
          Permissions: BlobConstants.SharedAccessPermissions.READ,
          Start: new Date('October 11, 2011 11:03:40 am GMT'),
          Expiry: new Date('October 12, 2011 11:53:40 am GMT')
        }
      };

      var sharedAccessSignature = devStorageBlobService.generateSharedAccessSignature(containerName, blobName, sharedAccessPolicy);

      assert.equal(sharedAccessSignature.queryString[QueryStringConstants.SIGNED_START], '2011-10-11T11:03:40Z');
      assert.equal(sharedAccessSignature.queryString[QueryStringConstants.SIGNED_EXPIRY], '2011-10-12T11:53:40Z');
      assert.equal(sharedAccessSignature.queryString[QueryStringConstants.SIGNED_RESOURCE], BlobConstants.ResourceTypes.BLOB);
      assert.equal(sharedAccessSignature.queryString[QueryStringConstants.SIGNED_PERMISSIONS], BlobConstants.SharedAccessPermissions.READ);
      assert.equal(sharedAccessSignature.queryString[QueryStringConstants.SIGNED_VERSION], '2012-02-12');
      assert.equal(sharedAccessSignature.queryString[QueryStringConstants.SIGNATURE], 'ju4tX0G79vPxMOkBb7UfNVEgrj9+ZnSMutpUemVYHLY=');

      done();
    });
  });

  it('responseEmits', function (done) {
    var containerName = testutil.generateId(containerNamesPrefix, containerNames, suiteUtil.isMocked);
    var blobName = testutil.generateId(blobNamesPrefix, blobNames, suiteUtil.isMocked);

    var responseReceived = false;
    blobService.on('response', function (response) {
      assert.notEqual(response, null);
      responseReceived = true;
      blobService.removeAllListeners('response');
    });

    blobService.createContainer(containerName, function (error) {
      assert.equal(error, null);

      blobService.createBlobBlockFromText('id1', containerName, blobName, 'id1', function (error2) {
        assert.equal(error2, null);
        // By the time the complete callback is processed the response header callback must have been called before
        assert.equal(responseReceived, true);

        done();
      });
    });
  });

  it('getBlobToStream', function (done) {
    var containerName = testutil.generateId(containerNamesPrefix, containerNames, suiteUtil.isMocked);
    var blobName = testutil.generateId(blobNamesPrefix, blobNames, suiteUtil.isMocked);
    var fileNameTarget = testutil.generateId('getBlobFile', [], suiteUtil.isMocked) + '.test';
    var blobText = 'Hello World';

    blobService.createContainer(containerName, function (createError1, container1) {
      assert.equal(createError1, null);
      assert.notEqual(container1, null);

      blobService.createBlockBlobFromText(containerName, blobName, blobText, function (error1) {
        assert.equal(error1, null);

        blobService.getBlobToFile(containerName, blobName, fileNameTarget, function (error2) {
          assert.equal(error2, null);

          var exists = azureutil.pathExistsSync(fileNameTarget);
          assert.equal(exists, true);

          fs.readFile(fileNameTarget, function (err, fileText) {
            assert.equal(blobText, fileText);

            done();
          });
        });
      });
    });
  });

  it('SmallUploadBlobFromFile', function (done) {
    var containerName = testutil.generateId(containerNamesPrefix, containerNames, suiteUtil.isMocked);
    var blobName = testutil.generateId(blobNamesPrefix, blobNames, suiteUtil.isMocked);
    var fileNameSource = testutil.generateId('getBlobFile', [], suiteUtil.isMocked) + '.test';
    var blobText = 'Hello World';

    fs.writeFile(fileNameSource, blobText, function () {
      blobService.createContainer(containerName, function (createError1, container1, createResponse1) {
        assert.equal(createError1, null);
        assert.notEqual(container1, null);
        assert.ok(createResponse1.isSuccessful);
        assert.equal(createResponse1.statusCode, HttpConstants.HttpResponseCodes.Created);

        var blobOptions = { contentType: 'text', blockIdPrefix : 'blockId' };
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

  it('storageConnectionStrings', function (done) {
    var key = 'AhlzsbLRkjfwObuqff3xrhB2yWJNh1EMptmcmxFJ6fvPTVX3PZXwrG2YtYWf5DPMVgNsteKStM5iBLlknYFVoA==';
    var connectionString = 'DefaultEndpointsProtocol=https;AccountName=myaccount;AccountKey=' + key;
    var blobService = storage.createBlobService(connectionString);

    assert.equal(blobService.storageAccount, 'myaccount');
    assert.equal(blobService.storageAccessKey, key);
    assert.equal(blobService.protocol, 'https:');
    assert.equal(blobService.host, 'myaccount.blob.core.windows.net');

    done();
  });

  it('storageConnectionStringsDevStore', function (done) {
    var connectionString = 'UseDevelopmentStorage=true';
    var blobService = storage.createBlobService(connectionString);

    assert.equal(blobService.storageAccount, ServiceClientConstants.DEVSTORE_STORAGE_ACCOUNT);
    assert.equal(blobService.storageAccessKey, ServiceClientConstants.DEVSTORE_STORAGE_ACCESS_KEY);
    assert.equal(blobService.protocol, 'http:');
    assert.equal(blobService.host, '127.0.0.1');
    assert.equal(blobService.port, '10000');

    done();
  });

  it('should be creatable from config', function (done) {
    var key = 'AhlzsbLRkjfwObuqff3xrhB2yWJNh1EMptmcmxFJ6fvPTVX3PZXwrG2YtYWf5DPMVgNsteKStM5iBLlknYFVoA==';
    var connectionString = 'DefaultEndpointsProtocol=https;AccountName=myaccount;AccountKey=' + key;
    var config = common.configure('testenvironment', function (c) {
      c.storage(connectionString);
    });

    var blobService = storage.createBlobService(common.config('testenvironment'));

    assert.equal(blobService.storageAccount, 'myaccount');
    assert.equal(blobService.storageAccessKey, key);
    assert.equal(blobService.protocol, 'https:');
    assert.equal(blobService.host, 'myaccount.blob.core.windows.net');

    done();
  });
});

function repeat(s, n) {
  var ret = '';
  for (var i = 0; i < n; i++) {
    ret += s;
  }
  return ret;
}
