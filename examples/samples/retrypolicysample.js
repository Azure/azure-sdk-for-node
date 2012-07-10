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

/**
* Demonstrates how to define a customized retry policy.
* 
* In this sample, we define a customized retry policy which retries on the "The specified container is being deleted"
* exception besides the server exceptions.
* 
* Note that only in the cloud(not the storage emulator), "The specified container is being deleted" exceptions will be
* sent if users immediately recreate a container after delete it.
*/

var fs = require('fs');
if (!fs.existsSync) {
  fs.existsSync = require('path').existsSync;
}

var azure;
if (fs.existsSync('./../../lib/azure.js')) {
  azure = require('./../../lib/azure');
} else {
  azure = require('azure');
}

var BlobConstants = azure.Constants.BlobConstants;
var ServiceClient = azure.ServiceClient;
var CloudBlobClient = azure.CloudBlobClient;
var ExponentialRetryPolicyFilter = azure.ExponentialRetryPolicyFilter;

var util = require('util');

var container = 'retrypolicysample';

var blobServiceNoRetry = azure.createBlobService();
var blobService;

function setRetryPolicy() {
  // Step 1 : Set the retry policy to customized retry policy which will
  // retry on any status code other than the excepted one, including
  // the "The specified container is being deleted" exception .

  var retryOnContainerBeingDeleted = new ExponentialRetryPolicyFilter();
  retryOnContainerBeingDeleted.retryCount = 3;
  retryOnContainerBeingDeleted.retryInterval = 30000;

  retryOnContainerBeingDeleted.shouldRetry = function(statusCode, retryData) {
    console.log('Made the request at ' + new Date().toUTCString() + ', received StatusCode: ' + statusCode);

    var currentCount = (retryData && retryData.retryCount) ? retryData.retryCount : 0;

    return (currentCount < this.retryCount);
  };

  blobService = blobServiceNoRetry.withFilter(retryOnContainerBeingDeleted);
  createContainer();
}

function createContainer() {
  // Step 2: Create a container with a random name.
  blobService.createContainer(container, function(error) {
    if (error) {
      console.log(error);
    } else {
      console.log('Created the container ' + container);
      deleteContainer();
    }
  });
}

function deleteContainer() {
  // Step 3 : Delete a container.
  blobService.deleteContainer(container, function (error) {
    if (error) {
      console.log(error);
    } else {
      console.log('Deleted the container ' + container);
      createContainerAgain();
    }
  });
};

function createContainerAgain() {
  // Step 4 : Attempt to create the container immediately while it was still beeing deleted.
  blobService.createContainer(container, function (error) {
    if (error) {
      console.log(error);
    } else {
      console.log('Created the container ' + container);
    }
  });
};

var arguments = process.argv;

if (arguments.length > 3) {
  console.log('Incorrect number of arguments');
}
else if (arguments.length == 3) {
  // Adding a third argument on the command line, whatever it is, will delete the container before running the sample.
  blobServiceNoRetry.deleteContainer(container, function (error) {
    if (error) {
      console.log(error);
    } else {
      setRetryPolicy();
    }
  });
}
else {
  setRetryPolicy();
}