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
var BlobConstants = Constants.BlobConstants;
var HttpConstants = Constants.HttpConstants;
var WebResource = require('../../../lib/http/webresource');

var blobService;
var containerNames = [];
var containerNamesPrefix = 'cont';
var blobNames = [];
var blobNamesPrefix = 'blob';

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

  testIncorrectContainerNames: function (test) {
    test.throws(function () { blobService.createContainer(null, function () { }); },
      BlobService.incorrectContainerNameErr);

    test.throws(function () { blobService.createContainer('', function () { }); },
      BlobService.incorrectContainerNameErr);

    test.throws(function () { blobService.createContainer('as', function () { }); },
      BlobService.incorrectContainerNameFormatErr);

    test.throws(function () { blobService.createContainer('a--s', function () { }); },
      BlobService.incorrectContainerNameFormatErr);

    test.throws(function () { blobService.createContainer('cont-', function () { }); },
      BlobService.incorrectContainerNameFormatErr);

    test.throws(function () { blobService.createContainer('conTain', function () { }); },
      BlobService.incorrectContainerNameFormatErr);

    test.done();
  },

  testIncorrectBlobNames: function (test) {
    test.throws(function () { blobService.blobExists('container', null, function () { }); },
      BlobService.incorrectBlobNameFormatErr);

    test.throws(function () { blobService.blobExists('container', '', function () { }); },
      BlobService.incorrectBlobNameFormatErr);

    test.done();
  },

  testGetServiceProperties: function (test) {
    blobService.getServiceProperties(function (error, serviceProperties) {
      test.equal(error, null);
      test.notEqual(serviceProperties, null);

      if (serviceProperties) {
        test.notEqual(serviceProperties.Logging, null);
        if (serviceProperties.Logging) {
          test.notEqual(serviceProperties.Logging.RetentionPolicy);
          test.notEqual(serviceProperties.Logging.Version);
        }

        if (serviceProperties.Metrics) {
          test.notEqual(serviceProperties.Metrics, null);
          test.notEqual(serviceProperties.Metrics.RetentionPolicy);
          test.notEqual(serviceProperties.Metrics.Version);
        }
      }

      test.done();
    });
  },

  testSetServiceProperties: function (test) {
    blobService.getServiceProperties(function (error, serviceProperties) {
      test.equal(error, null);

      serviceProperties.DefaultServiceVersion = '2009-09-19';
      serviceProperties.Logging.Read = true;
      blobService.setServiceProperties(serviceProperties, function (error2) {
        test.equal(error2, null);

        blobService.getServiceProperties(function (error3, serviceProperties2) {
          test.equal(error3, null);
          test.equal(serviceProperties2.DefaultServiceVersion, '2009-09-19');
          test.equal(serviceProperties2.Logging.Read, true);

          test.done();
        });
      });
    });
  },

  testListContainers: function (test) {
    var containerName1 = testutil.generateId(containerNamesPrefix, containerNames);
    var metadata1 = {
      color: 'orange',
      containernumber: '01',
      somemetadataname: 'SomeMetadataValue'
    };

    var containerName2 = testutil.generateId(containerNamesPrefix, containerNames);
    var metadata2 = {
      color: 'pink',
      containernumber: '02',
      somemetadataname: 'SomeMetadataValue'
    };

    var containerName3 = testutil.generateId(containerNamesPrefix, containerNames);
    var metadata3 = {
      color: 'brown',
      containernumber: '03',
      somemetadataname: 'SomeMetadataValue'
    };

    var containerName4 = testutil.generateId(containerNamesPrefix, containerNames);
    var metadata4 = {
      color: 'blue',
      containernumber: '04',
      somemetadataname: 'SomeMetadataValue'
    };

    var validateContainers = function (containers, entries) {
      for (var containerIndex in containers) {
        var container = containers[containerIndex];

        if (container.name == containerName1) {
          test.equal(container.metadata.color, metadata1.color);
          test.equal(container.metadata.containernumber, metadata1.containernumber);
          test.equal(container.metadata.somemetadataname, metadata1.somemetadataname);
          entries.push(container.name);
        }
        else if (container.name == containerName2) {
          test.equal(container.metadata.color, metadata2.color);
          test.equal(container.metadata.containernumber, metadata2.containernumber);
          test.equal(container.metadata.somemetadataname, metadata2.somemetadataname);
          entries.push(container.name);
        }
        else if (container.name == containerName3) {
          test.equal(container.metadata.color, metadata3.color);
          test.equal(container.metadata.containernumber, metadata3.containernumber);
          test.equal(container.metadata.somemetadataname, metadata3.somemetadataname);
          entries.push(container.name);
        }
        else if (container.name == containerName4) {
          test.equal(container.metadata.color, metadata4.color);
          test.equal(container.metadata.containernumber, metadata4.containernumber);
          test.equal(container.metadata.somemetadataname, metadata4.somemetadataname);
          entries.push(container.name);
        }
      }

      return entries;
    };

    blobService.createContainer(containerName1, { metadata: metadata1 }, function (createError1, createContainer1, createResponse1) {
      test.equal(createError1, null);
      test.notEqual(createContainer1, null);
      test.ok(createResponse1.isSuccessful);

      blobService.createContainer(containerName2, { metadata: metadata2 }, function (createError2, createContainer2, createResponse2) {
        test.equal(createError2, null);
        test.notEqual(createContainer2, null);
        test.ok(createResponse2.isSuccessful);

        blobService.createContainer(containerName3, { metadata: metadata3 }, function (createError3, createContainer3, createResponse3) {
          test.equal(createError3, null);
          test.notEqual(createContainer3, null);
          test.ok(createResponse3.isSuccessful);

          blobService.createContainer(containerName4, { metadata: metadata4 }, function (createError4, createContainer4, createResponse4) {
            test.equal(createError4, null);
            test.notEqual(createContainer4, null);
            test.ok(createResponse4.isSuccessful);

            var options = {
              'maxresults': 3,
              'include': 'metadata'
            };

            blobService.listContainers(options, function (listError, containers, containersContinuation, listResponse) {
              test.equal(listError, null);
              test.ok(listResponse.isSuccessful);
              test.equal(containers.length, 3);

              var entries = validateContainers(containers, []);

              test.equal(containersContinuation.hasNextPage(), true);
              containersContinuation.getNextPage(function (listErrorContinuation, containers2) {
                test.equal(listErrorContinuation, null);
                test.ok(listResponse.isSuccessful);
                validateContainers(containers2, entries);
                test.equal(entries.length, 4);

                test.done();
              });
            });
          });
        });
      });
    });
  },

  testListContainersOptionalParams: function (test) {
    blobService.listContainers(null, function (err) {
      test.equal(err, null);
      test.done();
    });
  },

  testCreateContainer: function (test) {
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
  },

  testCreateContainerIfNotExists: function (test) {
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
      blobService.createContainerIfNotExists(containerName, function (createError2, isCreated) {
        test.equal(createError2, null);
        test.equal(isCreated, false);

        test.done();
      });
    });
  },

  testGetContainerProperties: function (test) {
    var containerName = testutil.generateId(containerNamesPrefix, containerNames);
    var metadata = {
      color: 'blue'
    };

    blobService.createContainer(containerName, { metadata: metadata }, function (createError, container1, createContainerResponse) {
      test.equal(createError, null);
      test.notEqual(container1, null);
      test.equal(createContainerResponse.isSuccessful, true);

      blobService.getContainerProperties(containerName, function (getError, container2, getResponse) {
        test.equal(getError, null);
        test.notEqual(container2, null);
        if (container2) {
          test.equal(container2.metadata.color, metadata.color);
        }

        test.notEqual(getResponse, null);
        test.equal(getResponse.isSuccessful, true);

        test.done();
      });
    });
  },

  testSetContainerMetadata: function (test) {
    var containerName = testutil.generateId(containerNamesPrefix, containerNames);
    var metadata = { 'class': 'test' };

    blobService.createContainer(containerName, function (createError, createContainer, createContainerResponse) {
      test.equal(createError, null);
      test.notEqual(createContainer, null);
      test.ok(createContainerResponse.isSuccessful);

      blobService.setContainerMetadata(containerName, metadata, function (setMetadataError, setMetadataResponse) {
        test.equal(setMetadataError, null);
        test.ok(setMetadataResponse.isSuccessful);

        blobService.getContainerMetadata(containerName, function (getMetadataError, containerMetadata, getMetadataResponse) {
          test.equal(getMetadataError, null);
          test.notEqual(containerMetadata, null);
          test.notEqual(containerMetadata.metadata, null);
          if (containerMetadata.metadata) {
            test.equal(containerMetadata.metadata.class, 'test');
          }

          test.ok(getMetadataResponse.isSuccessful);

          test.done();
        });
      });
    });
  },

  testGetContainerAcl: function (test) {
    var containerName = testutil.generateId(containerNamesPrefix, containerNames);

    blobService.createContainer(containerName, function (createError, container1, createContainerResponse) {
      test.equal(createError, null);
      test.notEqual(container1, null);
      test.equal(createContainerResponse.isSuccessful, true);

      blobService.getContainerAcl(containerName, function (containerAclError, containerBlob, containerAclResponse) {
        test.equal(containerAclError, null);
        test.notEqual(containerBlob, null);
        if (containerBlob) {
          test.equal(containerBlob.publicAccessLevel, BlobConstants.BlobContainerPublicAccessType.OFF);
        }

        test.equal(containerAclResponse.isSuccessful, true);

        test.done();
      });
    });
  },

  testSetContainerAcl: function (test) {
    var containerName = testutil.generateId(containerNamesPrefix, containerNames);

    blobService.createContainer(containerName, function (createError, container1, createContainerResponse) {
      test.equal(createError, null);
      test.notEqual(container1, null);
      test.ok(createContainerResponse.isSuccessful);

      blobService.setContainerAcl(containerName, BlobConstants.BlobContainerPublicAccessType.BLOB, function (setAclError, setAclContainer1, setResponse1) {
        test.equal(setAclError, null);
        test.notEqual(setAclContainer1, null);
        test.ok(setResponse1.isSuccessful);

        blobService.getContainerAcl(containerName, function (getAclError, getAclContainer1, getResponse1) {
          test.equal(getAclError, null);
          test.notEqual(getAclContainer1, null);
          if (getAclContainer1) {
            test.equal(getAclContainer1.publicAccessLevel, BlobConstants.BlobContainerPublicAccessType.BLOB);
          }

          test.ok(getResponse1.isSuccessful);

          blobService.setContainerAcl(containerName, BlobConstants.BlobContainerPublicAccessType.CONTAINER, function (setAclError2, setAclContainer2, setResponse2) {
            test.equal(setAclError2, null);
            test.notEqual(setAclContainer2, null);
            test.ok(setResponse2.isSuccessful);

            blobService.getContainerAcl(containerName, function (getAclError2, getAclContainer2, getResponse3) {
              test.equal(getAclError2, null);
              test.notEqual(getAclContainer2, null);
              if (getAclContainer2) {
                test.equal(getAclContainer2.publicAccessLevel, BlobConstants.BlobContainerPublicAccessType.CONTAINER);
              }

              test.ok(getResponse3.isSuccessful);

              test.done();
            });
          });
        });
      });
    });
  },

  testSetContainerAclSignedIdentifiers: function (test) {
    var containerName = testutil.generateId(containerNamesPrefix, containerNames);

    blobService.createContainer(containerName, function (createContainerError, container1, createContainerResponse) {
      test.equal(createContainerError, null);
      test.notEqual(container1, null);
      test.ok(createContainerResponse.isSuccessful);

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
        test.equal(setAclError, null);
        test.notEqual(setAclContainer, null);
        test.ok(setAclResponse.isSuccessful);

        blobService.getContainerAcl(containerName, function (getAclError, containerAcl, getAclResponse) {
          test.equal(getAclError, null);
          test.notEqual(containerAcl, null);
          test.notEqual(getAclResponse, null);

          if (getAclResponse) {
            test.equal(getAclResponse.isSuccessful, true);
          }

          var entries = 0;
          if (containerAcl) {
            if (containerAcl.signedIdentifiers) {
              containerAcl.signedIdentifiers.forEach(function (identifier) {
                if (identifier.Id === 'id1') {
                  test.equal(identifier.AccessPolicy.Start, '2009-10-10T00:00:00.0000000Z');
                  test.equal(identifier.AccessPolicy.Expiry, '2009-10-11T00:00:00.0000000Z');
                  test.equal(identifier.AccessPolicy.Permission, 'r');
                  entries += 1;
                }
                else if (identifier.Id === 'id2') {
                  test.equal(identifier.AccessPolicy.Start, '2009-11-10T00:00:00.0000000Z');
                  test.equal(identifier.AccessPolicy.Expiry, '2009-11-11T00:00:00.0000000Z');
                  test.equal(identifier.AccessPolicy.Permission, 'w');
                  entries += 2;
                }
              });
            }
          }

          test.equals(entries, 3);

          test.done();
        });
      }
      );
    });
  },

  testCreateBlockBlobFromText: function (test) {
    var containerName = testutil.generateId(containerNamesPrefix, containerNames);
    var blobName = testutil.generateId(blobNamesPrefix, blobNames);
    var blobText = 'Hello World';

    blobService.createContainer(containerName, function (createError1, container1, createResponse1) {
      test.equal(createError1, null);
      test.notEqual(container1, null);
      test.ok(createResponse1.isSuccessful);
      test.equal(createResponse1.statusCode, HttpConstants.HttpResponseCodes.CREATED_CODE);

      blobService.createBlockBlobFromText(containerName, blobName, blobText, function (uploadError, blob, uploadResponse) {
        test.equal(uploadError, null);
        test.ok(uploadResponse.isSuccessful);

        blobService.getBlobToText(containerName, blobName, function (downloadErr, blobTextResponse) {
          test.equal(downloadErr, null);
          test.equal(blobTextResponse, blobText);

          test.done();
        });
      });
    });
  },

  testSnapshotBlob: function (test) {
    var containerName = testutil.generateId(containerNamesPrefix, containerNames);
    var blobName = testutil.generateId(blobNamesPrefix, blobNames);
    var blobText = 'Hello World';

    blobService.createContainer(containerName, function (createError, container1, createResponse) {
      test.equal(createError, null);
      test.notEqual(container1, null);
      test.notEqual(createResponse, null);
      if (createResponse) {
        test.ok(createResponse.isSuccessful);
      }

      blobService.createBlockBlobFromText(containerName, blobName, blobText, function (uploadError, blob, putResponse) {
        test.equal(uploadError, null);
        test.notEqual(putResponse, null);
        if (putResponse) {
          test.ok(putResponse.isSuccessful);
        }

        blobService.createBlobSnapshot(containerName, blobName, function (snapshotError, snapshotId, snapshotResponse) {
          test.equal(snapshotError, null);
          test.notEqual(snapshotResponse, null);
          test.notEqual(snapshotId, null);

          if (snapshotResponse) {
            test.ok(snapshotResponse.isSuccessful);
          }

          blobService.getBlobToText(containerName, blobName, function (getError, content, blockBlob, getResponse) {
            test.equal(getError, null);
            test.notEqual(blockBlob, null);
            test.notEqual(getResponse, null);
            if (getResponse) {
              test.ok(getResponse.isSuccessful);
            }

            test.equal(blobText, content);
            test.done();
          });
        });
      });
    });
  },

  testCopyBlob: function (test) {
    var sourceContainerName = testutil.generateId(containerNamesPrefix, containerNames);
    var targetContainerName = testutil.generateId(containerNamesPrefix, containerNames);

    var sourceBlobName = testutil.generateId(blobNamesPrefix, blobNames);
    var targetBlobName = testutil.generateId(blobNamesPrefix, blobNames);

    var blobText = 'hi there';

    blobService.createContainer(sourceContainerName, function (createErr1) {
      test.equal(createErr1, null);

      blobService.createContainer(targetContainerName, function (createErr2) {
        test.equal(createErr2, null);

        blobService.createBlockBlobFromText(sourceContainerName, sourceBlobName, blobText, function (uploadErr) {
          test.equal(uploadErr, null);

          blobService.copyBlob(sourceContainerName, sourceBlobName, targetContainerName, targetBlobName, function (copyErr) {
            test.equal(copyErr, null);

            blobService.getBlobToText(targetContainerName, targetBlobName, function (downloadErr, text) {
              test.equal(downloadErr, null);
              test.equal(text, blobText);

              test.done();
            });
          });
        });
      });
    });
  },

  testLeaseBlob: function (test) {
    var containerName = testutil.generateId(containerNamesPrefix, containerNames);
    var blobName = testutil.generateId(blobNamesPrefix, blobNames);
    var blobText = 'hello';

    blobService.createContainer(containerName, function (createError, container1, createResponse) {
      test.equal(createError, null);
      test.notEqual(container1, null);
      test.ok(createResponse.isSuccessful);

      blobService.createBlockBlobFromText(containerName, blobName, blobText, function (uploadError, blob, uploadResponse) {
        test.equal(uploadError, null);
        test.notEqual(blob, null);
        test.ok(uploadResponse.isSuccessful);

        // Acquire a lease
        blobService._leaseBlobImpl(containerName, blobName, null, BlobConstants.LeaseOperation.ACQUIRE, function (leaseBlobError, lease, leaseBlobResponse) {
          test.equal(leaseBlobError, null);
          test.notEqual(lease, null);
          if (lease) {
            test.ok(lease.id);
          }

          test.notEqual(leaseBlobResponse, null);
          if (leaseBlobResponse) {
            test.ok(leaseBlobResponse.isSuccessful);
          }

          // Second lease should not be possible
          blobService._leaseBlobImpl(containerName, blobName, null, BlobConstants.LeaseOperation.ACQUIRE, function (secondLeaseBlobError, secondLease, secondLeaseBlobResponse) {
            test.equal(secondLeaseBlobError.code, 'LeaseAlreadyPresent');
            test.equal(secondLease, null);
            test.equal(secondLeaseBlobResponse.isSuccessful, false);

            // Delete should not be possible
            blobService.deleteBlob(containerName, blobName, function (deleteError, deleted, deleteResponse) {
              test.equal(deleteError.code, 'LeaseIdMissing');
              test.equal(deleteResponse.isSuccessful, false);

              test.done();
            });
          });
        });
      });
    });
  },

  testGetBlobProperties: function (test) {
    var containerName = testutil.generateId(containerNamesPrefix, containerNames);
    var blobName = testutil.generateId(blobNamesPrefix, blobNames);
    var metadata = {
      color: 'blue'
    };

    blobService.createContainer(containerName, function (err) {
      test.equal(err, null);

      blobService.createBlockBlobFromText(containerName, blobName, "hello", { metadata: metadata }, function (blobErr) {
        test.equal(blobErr, null);

        blobService.getBlobProperties(containerName, blobName, function (getErr, blob) {
          test.equal(getErr, null);

          test.notEqual(blob, null);
          if (blob) {
            test.notEqual(blob.metadata, null);
            if (blob.metadata) {
              test.equal(blob.metadata.color, metadata.color);
            }
          }

          test.done();
        });
      });
    });
  },

  testSetBlobProperties: function (test) {
    var containerName = testutil.generateId(containerNamesPrefix, containerNames);
    var blobName = testutil.generateId(blobNamesPrefix, blobNames);
    var text = "hello";

    blobService.createContainer(containerName, function (err) {
      test.equal(err, null);

      blobService.createBlockBlobFromText(containerName, blobName, text, function (blobErr) {
        test.equal(blobErr, null);

        var options = {};
        options.contentType = 'text';
        options.contentEncoding = 'utf8';
        options.contentLanguage = 'pt';
        options.cacheControl = 'true';

        blobService.setBlobProperties(containerName, blobName, options, function (setErr) {
          test.equal(setErr, null);

          blobService.getBlobProperties(containerName, blobName, function (getErr, blob) {
            test.equal(getErr, null);

            test.notEqual(blob, null);
            if (blob) {
              test.equal(blob.contentLength, text.length);
              test.equal(blob.contentType, options.contentType);
              test.equal(blob.contentEncoding, options.contentEncoding);
              test.equal(blob.contentLanguage, options.contentLanguage);
              test.equal(blob.cacheControl, options.cacheControl);
            }

            test.done();
          });
        });
      });
    });
  },

  testGetBlobMetadata: function (test) {
    var containerName = testutil.generateId(containerNamesPrefix, containerNames);
    var blobName = testutil.generateId(blobNamesPrefix, blobNames);
    var metadata = {
      color: 'blue'
    };

    blobService.createContainer(containerName, function (err) {
      test.equal(err, null);

      blobService.createBlockBlobFromText(containerName, blobName, "hello", { metadata: metadata }, function (blobErr) {
        test.equal(blobErr, null);

        blobService.getBlobMetadata(containerName, blobName, function (getErr, blob) {
          test.equal(getErr, null);

          test.notEqual(blob, null);
          if (blob) {
            test.notEqual(blob.metadata, null);
            if (blob.metadata) {
              test.equal(blob.metadata.color, metadata.color);
            }
          }

          test.done();
        });
      });
    });
  },

  testListBlobs: function (test) {
    var containerName = testutil.generateId(containerNamesPrefix, containerNames);
    var blobName1 = testutil.generateId(blobNamesPrefix, blobNames);
    var blobName2 = testutil.generateId(blobNamesPrefix, blobNames);
    var blobText1 = 'hello1';
    var blobText2 = 'hello2';

    blobService.createContainer(containerName, function (err) {
      test.equal(err, null);

      // Test listing 0 blobs
      blobService.listBlobs(containerName, function (listErrNoBlobs, listNoBlobs) {
        test.equal(listErrNoBlobs, null);
        test.notEqual(listNoBlobs, null);
        if (listNoBlobs) {
          test.equal(listNoBlobs.length, 0);
        }

        blobService.createBlockBlobFromText(containerName, blobName1, blobText1, function (blobErr1) {
          test.equal(blobErr1, null);

          // Test listing 1 blob
          blobService.listBlobs(containerName, function (listErr, listBlobs) {
            test.equal(listErr, null);
            test.notEqual(listBlobs, null);
            test.equal(listBlobs.length, 1);

            blobService.createBlockBlobFromText(containerName, blobName2, blobText2, function (blobErr2) {
              test.equal(blobErr2, null);

              // Test listing multiple blobs
              blobService.listBlobs(containerName, function (listErr2, listBlobs2) {
                test.equal(listErr2, null);
                test.notEqual(listBlobs2, null);
                if (listBlobs2) {
                  test.equal(listBlobs2.length, 2);

                  var entries = 0;
                  listBlobs2.forEach(function (blob) {
                    if (blob.name === blobName1) {
                      entries += 1;
                    }
                    else if (blob.name === blobName2) {
                      entries += 2;
                    }
                  });

                  test.equal(entries, 3);
                }

                blobService.createBlobSnapshot(containerName, blobName1, function (snapErr) {
                  test.equal(snapErr, null);

                  // Test listing without requesting snapshots
                  blobService.listBlobs(containerName, function (listErr3, listBlobs3) {
                    test.equal(listErr3, null);
                    test.notEqual(listBlobs3, null);
                    if (listBlobs3) {
                      test.equal(listBlobs3.length, 2);
                    }

                    // Test listing including snapshots
                    blobService.listBlobs(containerName, { include: BlobConstants.BlobListingDetails.SNAPSHOTS }, function (listErr4, listBlobs4) {
                      test.equal(listErr4, null);
                      test.notEqual(listBlobs4, null);

                      if (listBlobs3) {
                        test.equal(listBlobs4.length, 3);
                      }

                      test.done();
                    });
                  });
                });
              });
            });
          });
        });
      });
    });
  },

  testSharedAccess: function (test) {
    var containerName = testutil.generateId(containerNamesPrefix, containerNames);
    var blobName = testutil.generateId(blobNamesPrefix, blobNames);
    var blobText = 'text';

    var sharedBlobClient = azure.createBlobService();
    var sharedAccessSignature = new SharedAccessSignature(sharedBlobClient.storageAccount, sharedBlobClient.storageAccessKey);
    sharedBlobClient.authenticationProvider = sharedAccessSignature;

    var managementBlobClient = azure.createBlobService();

    managementBlobClient.createContainer(containerName, function (createError, container1, createResponse) {
      test.equal(createError, null);
      test.notEqual(container1, null);
      test.ok(createResponse.isSuccessful);

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
        test.equal(putError, null);
        test.ok(putResponse.isSuccessful);

        // Make sure its not possible to get the blob since only write permission was given
        sharedBlobClient.getBlobToText(containerName, blobName, function (getError, content, blockBlob, getResponse) {
          test.equal(getError.code, Constants.StorageErrorCodeStrings.RESOURCE_NOT_FOUND);
          test.equal(content, null);
          test.equal(blockBlob, null);
          test.notEqual(getResponse, null);
          if (getResponse) {
            test.equal(getResponse.isSuccessful, false);
          }

          test.done();
        });
      });
    });
  },

  testPageBlob: function (test) {
    var containerName = testutil.generateId(containerNamesPrefix, containerNames);
    var blobName = testutil.generateId(blobNamesPrefix, blobNames);

    blobService.createContainer(containerName, function (createError) {
      test.equal(createError, null);

      var data1 = "Hello, World!" + repeat(' ', 1024 - 13);
      var data2 = "Hello, World!" + repeat(' ', 512 - 13);

      // Create the empty page blob
      blobService.createPageBlob(containerName, blobName, 1024, function (err) {
        test.equal(err, null);

        // Upload all data
        blobService.createBlobPagesFromText(containerName, blobName, data1, 0, 1023, function (err2) {
          test.equal(err2, null);

          // Verify contents
          blobService.getBlobToText(containerName, blobName, function (err3, content1) {
            test.equal(err3, null);
            test.equal(content1, data1);

            // Clear the page blob
            blobService.clearBlobPages(containerName, blobName, 0, 1023, function (err4) {
              test.equal(err4);

              // Upload other data in 2 pages
              blobService.createBlobPagesFromText(containerName, blobName, data2, 0, 511, function (err5) {
                test.equal(err5, null);

                blobService.createBlobPagesFromText(containerName, blobName, data2, 512, 1023, function (err6) {
                  test.equal(err6, null);

                  blobService.getBlobToText(containerName, blobName, function (err7, content2) {
                    test.equal(err7, null);
                    test.equal(data2 + data2, content2);

                    test.done();
                  });
                });
              });
            });
          });
        });
      });
    });
  },

  testGetPageRegions: function (test) {
    var containerName = testutil.generateId(containerNamesPrefix, containerNames);
    var blobName = testutil.generateId(blobNamesPrefix, blobNames);

    blobService.createContainer(containerName, function (createError) {
      test.equal(createError, null);

      var data = "Hello, World!" + repeat(' ', 512 - 13);

      // Upload contents in 2 parts
      blobService.createPageBlob(containerName, blobName, 1024 * 1024 * 1024, function (err) {
        test.equal(err, null);

        // Upload all data
        blobService.createBlobPagesFromText(containerName, blobName, data, 0, 511, function (err2) {
          test.equal(err2, null);

          blobService.createBlobPagesFromText(containerName, blobName, data, 1048576, 1049087, null, function (err3) {
            test.equal(err3, null);

            // Get page regions
            blobService.listBlobRegions(containerName, blobName, 0, null, function (error5, regions) {
              test.equal(error5, null);
              test.notEqual(regions, null);
              if (regions) {
                test.equal(regions.length, 2);

                var entries = 0;
                regions.forEach(function (region) {
                  if (region.start === 0) {
                    test.equal(region.end, 511);
                    entries += 1;
                  }
                  else if (region.start === 1048576) {
                    test.equal(region.end, 1049087);
                    entries += 2;
                  }
                });

                test.equal(entries, 3);
              }

              test.done();
            });
          });
        });
      });
    });
  },

  testUploadBlobAccessCondition: function (test) {
    var containerName = testutil.generateId(containerNamesPrefix, containerNames);
    var blobName = testutil.generateId(blobNamesPrefix, blobNames);
    var blobText = 'hello';

    blobService.createContainer(containerName, function (error) {
      test.equal(error, null);

      blobService.createBlockBlobFromText(containerName, blobName, blobText, function (error2) {
        test.equal(error2, null);

        blobService.getBlobProperties(containerName, blobName, function (error4, blobProperties) {
          test.equal(error4, null);

          var options = { accessConditions: { 'If-None-Match': blobProperties.etag} };
          blobService.createBlockBlobFromText(containerName, blobName, blobText, options, function (error3) {
            test.notEqual(error3, null);
            test.equal(error3.code, Constants.StorageErrorCodeStrings.CONDITION_NOT_MET);

            test.done();
          });
        });
      });
    });
  },

  testSmallUploadBlobFromFileWithSpace: function (test) {
    var containerName = testutil.generateId(containerNamesPrefix, containerNames);
    var blobName = testutil.generateId(blobNamesPrefix, blobNames) + ' a';
    var blobText = 'Hello World';

    blobService.createContainer(containerName, function (createError1, container1, createResponse1) {
      test.equal(createError1, null);
      test.notEqual(container1, null);
      test.ok(createResponse1.isSuccessful);
      test.equal(createResponse1.statusCode, HttpConstants.HttpResponseCodes.CREATED_CODE);

      blobService.createBlockBlobFromText(containerName, blobName, blobText, function (uploadError, blobResponse, uploadResponse) {
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
  },

  testGetBlobRange: function (test) {
    var containerName = testutil.generateId(containerNamesPrefix, containerNames);
    var blobName = testutil.generateId(blobNamesPrefix, blobNames);

    blobService.createContainer(containerName, function (createError) {
      test.equal(createError, null);

      var data1 = "Hello, World!";

      // Create the empty page blob
      blobService.createBlockBlobFromText(containerName, blobName, data1, function (err) {
        test.equal(err, null);

        blobService.getBlobToText(containerName, blobName, { rangeStart: 2, rangeEnd: 3 }, function (err3, content1) {
          test.equal(err3, null);

          // get the double ll's in the hello
          test.equal(content1, 'll');

          test.done();
        });
      });
    });
  },

  testGetBlobRangeOpenEnded: function (test) {
    var containerName = testutil.generateId(containerNamesPrefix, containerNames);
    var blobName = testutil.generateId(blobNamesPrefix, blobNames);

    blobService.createContainer(containerName, function (createError) {
      test.equal(createError, null);

      var data1 = "Hello, World!";

      // Create the empty page blob
      blobService.createBlockBlobFromText(containerName, blobName, data1, function (err) {
        test.equal(err, null);

        blobService.getBlobToText(containerName, blobName, { rangeStart: 2 }, function (err3, content1) {
          test.equal(err3, null);

          // get the last bytes from the message
          test.equal(content1, 'llo, World!');

          test.done();
        });
      });
    });
  },

  testSetBlobMime: function (test) {
    var containerName = testutil.generateId(containerNamesPrefix, containerNames);
    var blobName = testutil.generateId(blobNamesPrefix, blobNames);
    var fileNameSource = testutil.generateId('file') + '.bmp'; // fake bmp file with text...
    var blobText = 'Hello World!';

    fs.writeFile(fileNameSource, blobText, function () {
      blobService.createContainer(containerName, function (createError) {
        test.equal(createError, null);

        // Create the empty page blob
        blobService.createBlockBlobFromFile(containerName, blobName, fileNameSource, function (err) {
          test.equal(err, null);

          blobService.getBlobToText(containerName, blobName, { rangeStart: 2 }, function (err3, content1, blob) {
            test.equal(err3, null);

            // get the last bytes from the message
            test.equal(content1, 'llo World!');
            test.equal(blob.contentType, 'image/bmp');

            fs.unlink(fileNameSource, function () {
              test.done();
            });
          });
        });
      });
    });
  },

  testSetBlobMimeSkip: function (test) {
    var containerName = testutil.generateId(containerNamesPrefix, containerNames);
    var blobName = testutil.generateId(blobNamesPrefix, blobNames);
    var fileNameSource = testutil.generateId('prefix') + '.bmp'; // fake bmp file with text...
    var blobText = 'Hello World!';

    fs.writeFile(fileNameSource, blobText, function () {
      blobService.createContainer(containerName, function (createError) {
        test.equal(createError, null);

        // Create the empty page blob
        blobService.createBlockBlobFromFile(containerName, blobName, fileNameSource, { contentType: null, contentTypeHeader: null }, function (err) {
          test.equal(err, null);

          blobService.getBlobToText(containerName, blobName, { rangeStart: 2 }, function (err3, content1, blob) {
            test.equal(err3, null);

            // get the last bytes from the message
            test.equal(content1, 'llo World!');
            test.equal(blob.contentType, 'application/octet-stream');

            fs.unlink(fileNameSource, function () {
              test.done();
            });
          });
        });
      });
    });
  },

  testCreateBlobWithBars: function (test) {
    var containerName = testutil.generateId(containerNamesPrefix, containerNames);
    var blobName = 'blobs/' + testutil.generateId(blobNamesPrefix, blobNames);
    var blobText = 'Hello World!';

    blobService.createContainer(containerName, function (createError) {
      test.equal(createError, null);

      // Create the empty page blob
      blobService.createBlockBlobFromText(containerName, blobName, blobText, function (err) {
        test.equal(err, null);

        blobService.getBlobProperties(containerName, blobName, function (error, properties) {
          test.equal(error, null);
          test.equal(properties.container, containerName);
          test.equal(properties.blob, blobName);

          test.done();
        });
      });
    });
  },

  testCommitBlockList: function (test) {
    var containerName = testutil.generateId(containerNamesPrefix, containerNames);
    var blobName = testutil.generateId(blobNamesPrefix, blobNames);

    blobService.createContainer(containerName, function (error) {
      test.equal(error, null);

      blobService.createBlobBlockFromText('id1', containerName, blobName, 'id1', function (error2) {
        test.equal(error2, null);

        blobService.createBlobBlockFromText('id2', containerName, blobName, 'id2', function (error3) {
          test.equal(error3, null);

          var blockList = {
            LatestBlocks: ['id1', 'id2']
          };

          blobService.commitBlobBlocks(containerName, blobName, blockList, function (error4) {
            test.equal(error4, null);

            blobService.listBlobBlocks(containerName, blobName, BlobConstants.BlockListFilter.ALL, function (error5, list) {
              test.equal(error5, null);
              test.notEqual(list, null);
              test.notEqual(list.CommittedBlocks, null);
              test.equal(list.CommittedBlocks.length, 2);

              test.done();
            });
          });
        });
      });
    });
  },

  testGetBlobUrl: function (test) {
    var containerName = testutil.generateId(containerNamesPrefix, containerNames);
    var blobName = testutil.generateId(blobNamesPrefix, blobNames);

    var blobServiceTest = azure.createBlobService('storageAccount', 'storageAccessKey', 'host:80');
    blobServiceTest.usePathStyleUri = false;

    var urlParts = blobServiceTest.getBlobUrl(containerName);
    test.equal(urlParts.url(), 'http://storageAccount.host:80/' + containerName);

    urlParts = blobServiceTest.getBlobUrl(containerName, blobName);
    test.equal(urlParts.url(), 'http://storageAccount.host:80/' + containerName + '/' + blobName);

    blobServiceTest.usePathStyleUri = true;
    urlParts = blobServiceTest.getBlobUrl(containerName);
    test.equal(urlParts.url(), 'http://host:80/storageAccount/' + containerName);

    urlParts = blobServiceTest.getBlobUrl(containerName, blobName);
    test.equal(urlParts.url(), 'http://host:80/storageAccount/' + containerName + '/' + blobName);

    test.done();
  }
});

function repeat(s, n) {
  var ret = "";
  for (var i = 0; i < n; i++) {
    ret += s;
  }
  return ret;
};