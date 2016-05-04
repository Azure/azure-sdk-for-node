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

/**
* 1. Demonstrates how to upload all files from a given directory in parallel
*
* 2. Demonstrates how to download all files from a given blob container to a given destination directory.
*
* 3. Demonstrate making requests using AccessConditions.
*/

var fs = require('fs');
var path = require('path');
var azure;
try {
  fs.statSync(path.join(__dirname, './../../lib/azure.js'));
  azure = require('./../../lib/azure');
} catch (error) {
  azure = require('azure');
}

var BlobConstants = azure.Constants.BlobConstants;
var ServiceClient = azure.ServiceClient;
var CloudBlobClient = azure.CloudBlobClient;

var container = 'updownsample';
var blob = 'updownsample';
var blobAccess = 'updownaccesssample';

var blobService = azure.createBlobService();

var args = process.argv;

function createContainer() {
  // Step 0: Create the container.
  blobService.createContainerIfNotExists(container, function (error, result, reponse) {
    if (error) {
      console.log(error);
    } else {
      console.log('Created the container %s', container);
      uploadSample();
    }
  });
}

function uploadSample() {
  // Sample 1 : Demonstrates how to upload all files from a given directoy
  uploadBlobs(args[2], container, function () {

    // Sample 2 : Demonstrates how to download all files from a given
    // blob container to a given destination directory.
    downloadBlobs(container, args[3], function () {

      // Sample 3 : Demonstrate making requests using AccessConditions.
      requestAccessConditionSample(container);
    });
  });
}

function uploadBlobs(sourceDirectoryPath, containerName, callback) {
  // Step 0 : validate directory is valid.
  try {
    var stats = fs.statSync(sourceDirectoryPath);
    if (stats.isDirectory() === true) {
      listFilesUpload(sourceDirectoryPath, containerName, callback);
      return;
    }
  } catch (error) {
    console.log(error);
  }
  console.log('%s is an invalid directory path.', sourceDirectoryPath);
}

function listFilesUpload(sourceDirectoryPath, containerName, callback) {
  // Step 1 : Search the directory and generate a list of files to upload.
  walk(sourceDirectoryPath, function (error, files) {
    if (error) {
      console.log(error);
    } else {
      uploadFilesParallel(files, containerName, callback);
    }
  });
}

function uploadFilesParallel(files, containerName, callback) {
  var finished = 0;

  // Step 3 : generate and schedule an upload for each file
  files.forEach(function (file) {
    var blobName = file.replace(/^.*[\\\/]/, '');

    blobService.createBlockBlobFromLocalFile(containerName, blobName, file, function (error, result, response) {
      finished++;
      if (error) {
        console.log(error);
      } else {
        console.log('Blob %s upload finished.', blobName);

        if (finished === files.length) {
          // Step 4 : Wait until all workers complete and the blobs are uploaded
          // to the server.
          console.log('All files uploaded');
          callback();
        }
      }
    });
  });
}

function downloadBlobs(containerName, destinationDirectoryPath, callback) {
  // Step 0. Validate directory
  try {
    var stats = fs.statSync(destinationDirectoryPath);
    if (stats.isDirectory() === true) {
      downloadFilesParallel(containerName, destinationDirectoryPath, callback);
      return;
    }
  } catch (error) {
    console.log(error);
  }
  console.log('%s is an invalid directory path.', destinationDirectoryPath);
}

function downloadFilesParallel(containerName, destinationDirectoryPath, callback) {
  // NOTE: does not handle pagination.
  blobService.listBlobsSegmented(containerName, null, function (error, result, reponse) {
    if (error) {
      console.log(error);
    } else {
      var blobsDownloaded = 0;
      var blobs = result.entries;
      blobs.forEach(function (blob) {
        blobService.getBlobToLocalFile(containerName, blob.name, path.join(destinationDirectoryPath, blob.name), function (error, result, response) {
          blobsDownloaded++;
          if (error) {
            console.log(error);
          } else {
            console.log('Blob %s download finished.', blob.name);
            if (blobsDownloaded === blobs.length) {
              // Step 4 : Wait until all workers complete and the blobs are downloaded
              console.log('All files downloaded');
              callback();
            }
          }
        });
      });
    }
  });
}

function requestAccessConditionSample(containerName) {
  // Step 1: Create a blob.
  blobService.createBlockBlobFromText(containerName, blobAccess, 'hello', function (error, result, response) {
    if (error) {
      console.log(error);
    } else {
      console.log('Created the blob %s', blobAccess);
      downloadBlobProperties(containerName, blobAccess);
    }
  });
}

function downloadBlobProperties(containerName, blobName) {
  // Step 2 : Download the blob attributes to get the ETag.
  blobService.getBlobProperties(containerName, blobName, function (error, blob, response) {
    if (error) {
      console.log(error);
    } else {
      console.log('Blob Etag is: %s ', blob.etag);
      testAccess(containerName, blobName, blob.etag);
    }
  });
}

function testAccess(containerName, blobName, etag) {
  // Step 2: Use the If-not-match ETag condition to access the blob. By
  // using the IfNoneMatch condition we are asserting that the blob needs
  // to have been modified in order to complete the request. In this
  // sample no other client is accessing the blob, so this will fail as
  // expected.

  var options = {
    accessConditions: {
      'If-None-Match': etag
    }
  };
  blobService.createBlockBlobFromText(containerName, blobName, 'new hello', options, function (error, result, response) {
    if (error) {
      console.log('Got an expected exception. Details:');
      console.log(error);
    } else {
      console.log('Blob was incorrectly updated');
    }
  });
}

if (args.length > 5 || args.length < 4) {
  console.log('Incorrect number of arguments');
} else if (args.length === 5) {
  // Adding a third argument on the command line, whatever it is, will delete the container before running the sample.
  blobService.deleteContainerIfExists(container, function (error, result, response) {
    if (error) {
      console.log(error);
    } else {
      createContainer();
    }
  });
} else {
  createContainer();
}

// Utilitary functions

var walk = function (dir, done) {
  var results = [];
  fs.readdir(dir, function (err, files) {
    if (err) return done(err);
    var i = 0;
    (function next() {
      var file = files[i++];
      if (!file) return done(null, results);
      file = path.join(dir, file);
      fs.stat(file, function (error, stats) {
        if (stats && stats.isDirectory()) {
          walk(file, function (error, res) {
            results = results.concat(res);
            next();
          });
        } else {
          results.push(file);
          next();
        }
      });
    })();
  });
};
