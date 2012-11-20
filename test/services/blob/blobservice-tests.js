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
var blobtestutil = require('../../util/blob-test-utils');

// Lib includes
var azureutil = testutil.libRequire('util/util');
var azure = testutil.libRequire('azure');
var WebResource = testutil.libRequire('http/webresource');

var SharedAccessSignature = azure.SharedAccessSignature;
var BlobService = azure.BlobService;
var ServiceClient = azure.ServiceClient;
var ExponentialRetryPolicyFilter = azure.ExponentialRetryPolicyFilter;
var Constants = azure.Constants;
var BlobConstants = Constants.BlobConstants;
var HttpConstants = Constants.HttpConstants;
var QueryStringConstants = Constants.QueryStringConstants;

var blobService;
var containerNames = [];
var containerNamesPrefix = 'cont';

var blobNames = [];
var blobNamesPrefix = 'blob';

var testPrefix = 'blobservice-tests';
var numberTests = 34;

suite('blobservice-tests', function () {
  setup(function (done) {
    blobtestutil.setUpTest(testPrefix, function (err, newBlobService) {
      blobService = newBlobService;
      done();
    });
  });

  teardown(function (done) {
    blobtestutil.tearDownTest(numberTests, blobService, testPrefix, done);
  });

  test('IncorrectContainerNames', function (done) {
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

  test('IncorrectBlobNames', function (done) {
    assert.throws(function () { blobService.blobExists('container', null, function () { }); },
      BlobService.incorrectBlobNameFormatErr);

    assert.throws(function () { blobService.blobExists('container', '', function () { }); },
      BlobService.incorrectBlobNameFormatErr);

    done();
  });

  test('GetServiceProperties', function (done) {
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

  test('SetServiceProperties', function (done) {
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

  test('ListContainers', function (done) {
    var containerName1 = testutil.generateId(containerNamesPrefix, containerNames, blobtestutil.isMocked);
    var metadata1 = {
      color: 'orange',
      containernumber: '01',
      somemetadataname: 'SomeMetadataValue'
    };

    var containerName2 = testutil.generateId(containerNamesPrefix, containerNames, blobtestutil.isMocked);
    var metadata2 = {
      color: 'pink',
      containernumber: '02',
      somemetadataname: 'SomeMetadataValue'
    };

    var containerName3 = testutil.generateId(containerNamesPrefix, containerNames, blobtestutil.isMocked);
    var metadata3 = {
      color: 'brown',
      containernumber: '03',
      somemetadataname: 'SomeMetadataValue'
    };

    var containerName4 = testutil.generateId(containerNamesPrefix, containerNames, blobtestutil.isMocked);
    var metadata4 = {
      color: 'blue',
      containernumber: '04',
      somemetadataname: 'SomeMetadataValue'
    };

    var validateContainers = function (containers, entries) {
      for (var containerIndex in containers) {
        var container = containers[containerIndex];

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
      }

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

  test('ListContainersOptionalParams', function (done) {
    blobService.listContainers(null, function (err) {
      assert.equal(err, null);
      done();
    });
  });

  test('CreateContainer', function (done) {
    var containerName = testutil.generateId(containerNamesPrefix, containerNames, blobtestutil.isMocked);

    blobService.createContainer(containerName, function (createError, container1, createContainerResponse) {
      assert.equal(createError, null);
      assert.notEqual(container1, null);
      if (container1) {
        assert.notEqual(container1.name, null);
        assert.notEqual(container1.etag, null);
        assert.notEqual(container1.lastModified, null);
      }

      assert.equal(createContainerResponse.statusCode, HttpConstants.HttpResponseCodes.CREATED_CODE);

      // creating again will result in a duplicate error
      blobService.createContainer(containerName, function (createError2, container2) {
        assert.equal(createError2.code, Constants.BlobErrorCodeStrings.CONTAINER_ALREADY_EXISTS);
        assert.equal(container2, null);

        done();
      });
    });
  });

  test('CreateContainerIfNotExists', function (done) {
    var containerName = testutil.generateId(containerNamesPrefix, containerNames, blobtestutil.isMocked);

    blobService.createContainer(containerName, function (createError, container1, createContainerResponse) {
      assert.equal(createError, null);
      assert.notEqual(container1, null);
      if (container1) {
        assert.notEqual(container1.name, null);
        assert.notEqual(container1.etag, null);
        assert.notEqual(container1.lastModified, null);
      }

      assert.equal(createContainerResponse.statusCode, HttpConstants.HttpResponseCodes.CREATED_CODE);

      // creating again will result in a duplicate error
      blobService.createContainerIfNotExists(containerName, function (createError2, isCreated) {
        assert.equal(createError2, null);
        assert.equal(isCreated, false);

        done();
      });
    });
  });

  test('GetContainerProperties', function (done) {
    var containerName = testutil.generateId(containerNamesPrefix, containerNames, blobtestutil.isMocked);
    var metadata = {
      color: 'blue'
    };

    blobService.createContainer(containerName, { metadata: metadata }, function (createError, container1, createContainerResponse) {
      assert.equal(createError, null);
      assert.notEqual(container1, null);
      assert.equal(createContainerResponse.isSuccessful, true);

      blobService.getContainerProperties(containerName, function (getError, container2, getResponse) {
        assert.equal(getError, null);
        assert.notEqual(container2, null);
        if (container2) {
          assert.equal(container2.metadata.color, metadata.color);
        }

        assert.notEqual(getResponse, null);
        assert.equal(getResponse.isSuccessful, true);

        done();
      });
    });
  });

  test('SetContainerMetadata', function (done) {
    var containerName = testutil.generateId(containerNamesPrefix, containerNames, blobtestutil.isMocked);
    var metadata = { 'class': 'test' };

    blobService.createContainer(containerName, function (createError, createContainer, createContainerResponse) {
      assert.equal(createError, null);
      assert.notEqual(createContainer, null);
      assert.ok(createContainerResponse.isSuccessful);

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

  test('GetContainerAcl', function (done) {
    var containerName = testutil.generateId(containerNamesPrefix, containerNames, blobtestutil.isMocked);

    blobService.createContainer(containerName, function (createError, container1, createContainerResponse) {
      assert.equal(createError, null);
      assert.notEqual(container1, null);
      assert.equal(createContainerResponse.isSuccessful, true);

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

  test('SetContainerAcl', function (done) {
    var containerName = testutil.generateId(containerNamesPrefix, containerNames, blobtestutil.isMocked);

    blobService.createContainer(containerName, function (createError, container1, createContainerResponse) {
      assert.equal(createError, null);
      assert.notEqual(container1, null);
      assert.ok(createContainerResponse.isSuccessful);

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
  });

  test('SetContainerAclWithPolicies', function (done) {
    var containerName = testutil.generateId(containerNamesPrefix, containerNames, blobtestutil.isMocked);

    var readWriteStartDate = new Date();
    var readWriteExpiryDate = new Date(readWriteStartDate);
    readWriteExpiryDate.setMinutes(readWriteStartDate.getMinutes() + 10);

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

    blobService.createContainer(containerName, function (createError, container1, createContainerResponse) {
      assert.equal(createError, null);
      assert.notEqual(container1, null);
      assert.ok(createContainerResponse.isSuccessful);

      blobService.setContainerAcl(containerName, BlobConstants.BlobContainerPublicAccessType.BLOB, options, function (setAclError, setAclContainer1, setResponse1) {
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
  });

  test('SetContainerAclSignedIdentifiers', function (done) {
    var containerName = testutil.generateId(containerNamesPrefix, containerNames, blobtestutil.isMocked);

    blobService.createContainer(containerName, function (createContainerError, container1, createContainerResponse) {
      assert.equal(createContainerError, null);
      assert.notEqual(container1, null);
      assert.ok(createContainerResponse.isSuccessful);

      var options = {};
      options.signedIdentifiers = [
        { Id: 'id1',
          AccessPolicy: {
            Start: '2009-10-10',
            Expiry: '2009-10-11',
            Permissions: 'r'
          }
        },
        { Id: 'id2',
          AccessPolicy: {
            Start: '2009-11-10',
            Expiry: '2009-11-11',
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
                  assert.equal(identifier.AccessPolicy.Start, '2009-10-10T00:00:00.0000000Z');
                  assert.equal(identifier.AccessPolicy.Expiry, '2009-10-11T00:00:00.0000000Z');
                  assert.equal(identifier.AccessPolicy.Permission, 'r');
                  entries += 1;
                }
                else if (identifier.Id === 'id2') {
                  assert.equal(identifier.AccessPolicy.Start, '2009-11-10T00:00:00.0000000Z');
                  assert.equal(identifier.AccessPolicy.Expiry, '2009-11-11T00:00:00.0000000Z');
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

  test('CreateBlockBlobFromText', function (done) {
    var containerName = testutil.generateId(containerNamesPrefix, containerNames, blobtestutil.isMocked);
    var blobName = testutil.generateId(blobNamesPrefix, blobNames, blobtestutil.isMocked);
    var blobText = 'Hello World';

    blobService.createContainer(containerName, function (createError1, container1, createResponse1) {
      assert.equal(createError1, null);
      assert.notEqual(container1, null);
      assert.ok(createResponse1.isSuccessful);
      assert.equal(createResponse1.statusCode, HttpConstants.HttpResponseCodes.CREATED_CODE);

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

  test('SnapshotBlob', function (done) {
    var containerName = testutil.generateId(containerNamesPrefix, containerNames, blobtestutil.isMocked);
    var blobName = testutil.generateId(blobNamesPrefix, blobNames, blobtestutil.isMocked);
    var blobText = 'Hello World';

    blobService.createContainer(containerName, function (createError, container1, createResponse) {
      assert.equal(createError, null);
      assert.notEqual(container1, null);
      assert.notEqual(createResponse, null);
      if (createResponse) {
        assert.ok(createResponse.isSuccessful);
      }

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

  test('CopyBlob', function (done) {
    var sourceContainerName = testutil.generateId(containerNamesPrefix, containerNames, blobtestutil.isMocked);
    var targetContainerName = testutil.generateId(containerNamesPrefix, containerNames, blobtestutil.isMocked);

    var sourceBlobName = testutil.generateId(blobNamesPrefix, blobNames, blobtestutil.isMocked);
    var targetBlobName = testutil.generateId(blobNamesPrefix, blobNames, blobtestutil.isMocked);

    var blobText = 'hi there';

    blobService.createContainer(sourceContainerName, function (createErr1) {
      assert.equal(createErr1, null);

      blobService.createContainer(targetContainerName, function (createErr2) {
        assert.equal(createErr2, null);

        blobService.createBlockBlobFromText(sourceContainerName, sourceBlobName, blobText, function (uploadErr) {
          assert.equal(uploadErr, null);

          blobService.copyBlob(sourceContainerName, sourceBlobName, targetContainerName, targetBlobName, function (copyErr) {
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

  test('LeaseBlob', function (done) {
    var containerName = testutil.generateId(containerNamesPrefix, containerNames, blobtestutil.isMocked);
    var blobName = testutil.generateId(blobNamesPrefix, blobNames, blobtestutil.isMocked);
    var blobText = 'hello';

    blobService.createContainer(containerName, function (createError, container1, createResponse) {
      assert.equal(createError, null);
      assert.notEqual(container1, null);
      assert.ok(createResponse.isSuccessful);

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

  test('GetBlobProperties', function (done) {
    var containerName = testutil.generateId(containerNamesPrefix, containerNames, blobtestutil.isMocked);
    var blobName = testutil.generateId(blobNamesPrefix, blobNames, blobtestutil.isMocked);
    var metadata = {
      color: 'blue'
    };

    blobService.createContainer(containerName, function (err) {
      assert.equal(err, null);

      blobService.createBlockBlobFromText(containerName, blobName, "hello", { metadata: metadata }, function (blobErr) {
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

  test('SetBlobProperties', function (done) {
    var containerName = testutil.generateId(containerNamesPrefix, containerNames, blobtestutil.isMocked);
    var blobName = testutil.generateId(blobNamesPrefix, blobNames, blobtestutil.isMocked);
    var text = "hello";

    blobService.createContainer(containerName, function (err) {
      assert.equal(err, null);

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

  test('GetBlobMetadata', function (done) {
    var containerName = testutil.generateId(containerNamesPrefix, containerNames, blobtestutil.isMocked);
    var blobName = testutil.generateId(blobNamesPrefix, blobNames, blobtestutil.isMocked);
    var metadata = { color: 'blue' };

    blobService.createContainer(containerName, function (err) {
      assert.equal(err, null);

      blobService.createBlockBlobFromText(containerName, blobName, "hello", { metadata: metadata }, function (blobErr) {
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

  test('ListBlobs', function (done) {
    var containerName = testutil.generateId(containerNamesPrefix, containerNames, blobtestutil.isMocked);
    var blobName1 = testutil.generateId(blobNamesPrefix, blobNames, blobtestutil.isMocked);
    var blobName2 = testutil.generateId(blobNamesPrefix, blobNames, blobtestutil.isMocked);
    var blobText1 = 'hello1';
    var blobText2 = 'hello2';

    blobService.createContainer(containerName, function (err) {
      assert.equal(err, null);

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

  test('PageBlob', function (done) {
    var containerName = testutil.generateId(containerNamesPrefix, containerNames, blobtestutil.isMocked);
    var blobName = testutil.generateId(blobNamesPrefix, blobNames, blobtestutil.isMocked);

    blobService.createContainer(containerName, function (createError) {
      assert.equal(createError, null);

      var data1 = "Hello, World!" + repeat(' ', 1024 - 13);
      var data2 = "Hello, World!" + repeat(' ', 512 - 13);

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

  test('GetPageRegions', function (done) {
    var containerName = testutil.generateId(containerNamesPrefix, containerNames, blobtestutil.isMocked);
    var blobName = testutil.generateId(blobNamesPrefix, blobNames, blobtestutil.isMocked);

    blobService.createContainer(containerName, function (createError) {
      assert.equal(createError, null);

      var data = "Hello, World!" + repeat(' ', 512 - 13);

      // Upload contents in 2 parts
      blobService.createPageBlob(containerName, blobName, 1024 * 1024 * 1024, function (err) {
        assert.equal(err, null);

        // Upload all data
        blobService.createBlobPagesFromText(containerName, blobName, data, 0, 511, function (err2) {
          assert.equal(err2, null);

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

  test('UploadBlobAccessCondition', function (done) {
    var containerName = testutil.generateId(containerNamesPrefix, containerNames, blobtestutil.isMocked);
    var blobName = testutil.generateId(blobNamesPrefix, blobNames, blobtestutil.isMocked);
    var blobText = 'hello';

    blobService.createContainer(containerName, function (error) {
      assert.equal(error, null);

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
  });

  test('SmallUploadBlobFromFileWithSpace', function (done) {
    var containerName = testutil.generateId(containerNamesPrefix, containerNames, blobtestutil.isMocked);
    var blobName = testutil.generateId(blobNamesPrefix, blobNames, blobtestutil.isMocked) + ' a';
    var blobText = 'Hello World';

    blobService.createContainer(containerName, function (createError1, container1, createResponse1) {
      assert.equal(createError1, null);
      assert.notEqual(container1, null);
      assert.ok(createResponse1.isSuccessful);
      assert.equal(createResponse1.statusCode, HttpConstants.HttpResponseCodes.CREATED_CODE);

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

  test('GetBlobRange', function (done) {
    var containerName = testutil.generateId(containerNamesPrefix, containerNames, blobtestutil.isMocked);
    var blobName = testutil.generateId(blobNamesPrefix, blobNames, blobtestutil.isMocked);

    blobService.createContainer(containerName, function (createError) {
      assert.equal(createError, null);

      var data1 = "Hello, World!";

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

  test('GetBlobRangeOpenEnded', function (done) {
    var containerName = testutil.generateId(containerNamesPrefix, containerNames, blobtestutil.isMocked);
    var blobName = testutil.generateId(blobNamesPrefix, blobNames, blobtestutil.isMocked);

    blobService.createContainer(containerName, function (createError) {
      assert.equal(createError, null);

      var data1 = "Hello, World!";

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

  test('SetBlobMime', function (done) {
    var containerName = testutil.generateId(containerNamesPrefix, containerNames, blobtestutil.isMocked);
    var blobName = testutil.generateId(blobNamesPrefix, blobNames, blobtestutil.isMocked);
    var fileNameSource = testutil.generateId('file') + '.bmp'; // fake bmp file with text...
    var blobText = 'Hello World!';

    fs.writeFile(fileNameSource, blobText, function () {
      blobService.createContainer(containerName, function (createError) {
        assert.equal(createError, null);

        // Create the empty page blob
        blobService.createBlockBlobFromFile(containerName, blobName, fileNameSource, function (err) {
          assert.equal(err, null);

          blobService.getBlobToText(containerName, blobName, { rangeStart: 2 }, function (err3, content1, blob) {
            assert.equal(err3, null);

            // get the last bytes from the message
            assert.equal(content1, 'llo World!');
            assert.equal(blob.contentType, 'image/bmp');

            fs.unlink(fileNameSource, function () {
              done();
            });
          });
        });
      });
    });
  });

  test('SetBlobMimeSkip', function (done) {
    var containerName = testutil.generateId(containerNamesPrefix, containerNames, blobtestutil.isMocked);
    var blobName = testutil.generateId(blobNamesPrefix, blobNames, blobtestutil.isMocked);
    var fileNameSource = testutil.generateId('prefix') + '.bmp'; // fake bmp file with text...
    var blobText = 'Hello World!';

    fs.writeFile(fileNameSource, blobText, function () {
      blobService.createContainer(containerName, function (createError) {
        assert.equal(createError, null);

        // Create the empty page blob
        blobService.createBlockBlobFromFile(containerName, blobName, fileNameSource, { contentType: null, contentTypeHeader: null }, function (err) {
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

  test('GenerateSharedAccessSignature', function (done) {
    var containerName = 'images';
    var blobName = 'pic1.png';

    var devStorageBlobService = azure.createBlobService(ServiceClient.DEVSTORE_STORAGE_ACCOUNT, ServiceClient.DEVSTORE_STORAGE_ACCESS_KEY);

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
    assert.equal(sharedAccessSignature.queryString[QueryStringConstants.SIGNATURE], '7NIEip+VOrQ5ZV80pORPK1MOsJc62wwCNcbMvE+lQ0s=');

    done();
  });

  test('CreateBlobWithBars', function (done) {
    var containerName = testutil.generateId(containerNamesPrefix, containerNames, blobtestutil.isMocked);
    var blobName = 'blobs/' + testutil.generateId(blobNamesPrefix, blobNames, blobtestutil.isMocked);
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

  test('CommitBlockList', function (done) {
    var containerName = testutil.generateId(containerNamesPrefix, containerNames, blobtestutil.isMocked);
    var blobName = testutil.generateId(blobNamesPrefix, blobNames, blobtestutil.isMocked);

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

  test('GetBlobUrl', function (done) {
    var containerName = testutil.generateId(containerNamesPrefix, containerNames, blobtestutil.isMocked);
    var blobName = testutil.generateId(blobNamesPrefix, blobNames, blobtestutil.isMocked);

    var blobServiceassert = azure.createBlobService('storageAccount', 'storageAccessKey', 'host.com:80');

    var urlParts = blobServiceassert.getBlobUrl(containerName);
    assert.equal(urlParts.url(), 'http://host.com:80/' + containerName);

    urlParts = blobServiceassert.getBlobUrl(containerName, blobName);
    assert.equal(urlParts.url(), 'http://host.com:80/' + containerName + '/' + blobName);

    done();
  });

  test('responseEmits', function (done) {
    var containerName = testutil.generateId(containerNamesPrefix, containerNames, blobtestutil.isMocked);
    var blobName = testutil.generateId(blobNamesPrefix, blobNames, blobtestutil.isMocked);

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

          var exists = azureutil.pathExistsSync(fileNameTarget);
          assert.equal(exists, true);

          var fileText = fs.readFileSync(fileNameTarget);
          assert.equal(blobText, fileText);

          done();
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

  test('storageConnectionStrings', function (done) {
    var key = 'AhlzsbLRkjfwObuqff3xrhB2yWJNh1EMptmcmxFJ6fvPTVX3PZXwrG2YtYWf5DPMVgNsteKStM5iBLlknYFVoA==';
    var connectionString = 'DefaultEndpointsProtocol=https;AccountName=myaccount;AccountKey=' + key;
    var blobService = azure.createBlobService(connectionString);

    assert.equal(blobService.storageAccount, 'myaccount');
    assert.equal(blobService.storageAccessKey, key);
    assert.equal(blobService.protocol, 'https://');
    assert.equal(blobService.host, 'myaccount.blob.core.windows.net');

    done();
  });

  test('storageConnectionStringsDevStore', function (done) {
    var connectionString = 'UseDevelopmentStorage=true';
    var blobService = azure.createBlobService(connectionString);

    assert.equal(blobService.storageAccount, ServiceClient.DEVSTORE_STORAGE_ACCOUNT);
    assert.equal(blobService.storageAccessKey, ServiceClient.DEVSTORE_STORAGE_ACCESS_KEY);
    assert.equal(blobService.protocol, 'http://');
    assert.equal(blobService.host, '127.0.0.1');
    assert.equal(blobService.port, '10000');

    done();
  });

});

function repeat(s, n) {
  var ret = "";
  for (var i = 0; i < n; i++) {
    ret += s;
  }
  return ret;
};