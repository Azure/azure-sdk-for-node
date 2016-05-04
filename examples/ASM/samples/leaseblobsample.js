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
* This sample demonstrates how multiple clients can attempt to acquire a lease in order to provide a locking mechanism
* over write operations on a given blob.
*
* To simulate N workers please run multiple instances of this sample. Each instance will :
*
* 1. Try to acquire a lease on a uploaded blob.
*
* 2. If succeed, then renew the lease, print out the current process holds the lease every 40 seconds until the process
* is killed.
*
* 3. If fail, then sleep for 10 seconds and go back to step 1.
*
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

var workerWithLeaseSleepTimeInMs = 40 * 1000;
var workerWithoutLeaseSleepTimeInMs = 10 * 1000;

var container = 'leasesample';
var blob = 'leasesample';
var leaseId;

var blobClient = azure.createBlobService();

function createContainer(callback) {
  // Step 0: Check if the target container exists.
  blobClient.createContainerIfNotExists(container, function (error, result, response) {
    if (error) {
      console.log(error);
    } else {
      console.log('Created the container %s', container);
      callback();
    }
  });
};

function uploadBlob(callback) {
  // Step 1: Create text blob.
  blobClient.createBlockBlobFromText(container, blob, 'Hello world!', function () {
    console.log('Created the blob %s', blob);
    callback();
  });
};

function getLease(currentLease) {
  if (!currentLease) {
    // Step 2a: this worker doesn't hold a lease, then try to acquire the lease.
    blobClient.acquireLease(container, blob, function (error, result, response) {
      if (result != null) {
        leaseId = result.id;
        // Succeed in acquiring a lease.
        console.log('Worker acquired the lease whose ID is %s', leaseId);
        setTimeout(function () {
          getLease(result);
        }, workerWithLeaseSleepTimeInMs);
      } else {
        // Fail in acquiring a lease.
        console.log('Worker failed in acquiring the lease.');
        setTimeout(function () {
          getLease();
        }, workerWithoutLeaseSleepTimeInMs);
      }
    });
  } else {
    // Step 2b: This worker holds a lease, then renew the lease.
    // Traditionally there is some work this worker must do while it
    // holds the lease on the blob prior to releasing it.
    blobClient.renewLease(container, blob, leaseId, function (error, result, response) {
      if (result) {
        console.log('Worker renewed the lease whose ID is %s', result.id);
      } else {
        console.log('Worker failed in renewing the lease.');
      }
      setTimeout(function () {
        getLease(result);
      }, workerWithLeaseSleepTimeInMs);
    });
  }
};

var args = process.argv;

if (args.length > 3) {
  console.log('Incorrect number of arguments');
} else if (args.length === 3) {
  // Adding a third argument on the command line, whatever it is, will delete the container before running the sample.
  blobClient.deleteContainerIfExists(container, function (error, result, response) {
    createContainer(function () {
      uploadBlob(function () {
        getLease();
      });
    });
  });
} else {
  createContainer(function () {
    uploadBlob(function () {
      getLease();
    });
  });
}
