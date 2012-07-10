﻿/**
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
* This sample demonstrates how to handle continuation tokens and virtual "pages" of results when performing a listing
* operation on the blob service.
*
* This sample peformsthe following steps:
*
* 0. Create container.
*
* 1. Creates 50 blobs.
*
* 2. List the first 10(page size) blobs.
*
* 3. Check whether there are more results.
*
* 4. List the next 10(page size) blobs.
*
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

var util = require('util');

var container = 'contsample';
var blob = 'contsample';

/**
* The total number of the blobs.
*/
var totalBlobsCount = 50;

/**
* The number of the blobs in one page.
*/
var pageSize = 10;

var blobService = azure.createBlobService();

function createContainer() {
  // Step 0: Create the container.
  blobService.createContainerIfNotExists(container, function (error) {
    if (error) {
      console.log(error);
    }
    else {
      console.log('Created the container ' + container);
      createBlobs(totalBlobsCount);
    }
  });
}

function createBlobs(currentBlobsCount) {
  // Step 1 : upload totalBlobsCount blobs to the container.
  blobService.createBlockBlobFromText(container, blob + currentBlobsCount, 'blob' + currentBlobsCount, function (error) {
    if (error) {
      console.log(error);
    } else if (currentBlobsCount > 1) {
      createBlobs(--currentBlobsCount);
    } else {
      console.log('Created ' + totalBlobsCount + ' blobs.');
      listPages();
    }
  });
}

function listPages() {
  // Step 2 : Perform a listing in "pages". A Page is a virtual construct
  // to allow the client to return a certain number of results at a time.
  // A good example of this is when using the entries in UI or improving
  // latency by only downloading the needed results.

  // In addition continuation tokens are expected from the blob service
  // when doing list operations and must be taken in account. For
  // convenience an iterator is provided via the listBlobs
  // methods which will handle the continuation token between requests in
  // a method that is opaque to the user.

  // The first list operation will return up to pageSize blobs, Note there
  // is no continuation is specified as this is the first request.
  blobService.listBlobs(container, { maxresults: pageSize }, function (error, page, pageContinuation) {
    if (error) {
      console.log(error);
    } else {
      console.log('There are ' + page.length + ' blobs in this page.');
      listNextPage(pageContinuation);
    }
  });
}

function listNextPage(pageContinuation) {
  // Step 3 : Check whether there are more results and list them in pages
  // of pageSize.

  // The hasNextPage() checks to see if the listing
  // provided a continuation token meaning there are additional results on
  // the service to be queried. This will be returned even if the
  // requested "page size" has been satisfied if there are more blobs on
  // the service.

  if (pageContinuation.hasNextPage()) {
    // Step 4 : make the next request from the last continuation token.

    pageContinuation.getNextPage(function (error, page, nextPageContinuation) {
      console.log('There are ' + page.length + ' blobs in this page.');
      listNextPage(nextPageContinuation);
    });
  }
  else {
    console.log('Listing blob in pages completed.');
  }
}

var arguments = process.argv;

if (arguments.length > 3) {
  console.log('Incorrect number of arguments');
}
else if (arguments.length == 3) {
  // Adding a third argument on the command line, whatever it is, will delete the container before running the sample.
  blobService.deleteContainer(container, function (error) {
    if (error) {
      console.log(error);
    } else {
      createContainer();
    }
  });
}
else {
  createContainer();
}