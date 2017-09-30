# Microsoft Azure SDK for Node.js - Data Lake Analytics

This project provides a Node.js package that makes it easy to manage Azure Data Lake Analytics accounts.

Right now it supports:

  *  **Node.js version: 6.x.x or higher**

## Features

- Account management: create, get, list, update, and delete.
- Account storage management: add, get, list update and delete Data Lake Store accounts and Azure Storage accounts from an existing Data Lake analytics account.
- Job management: submit, get, list, cancel.
- Catalog management: get, list, create (secrets and credentials), update (secrets and credentials), delete (secrets and credentials).

## How to Install

```bash
npm install azure-arm-datalake-analytics
```

## How to Use

### Authentication, account, job and catalog client creation and listing jobs as an example

### Login and list jobs using promises
 ```javascript
 var msRestAzure = require('ms-rest-azure');
 var adlaManagement = require("azure-arm-datalake-analytics");

 // Interactive Login
 // It provides a url and code that needs to be copied and pasted in a browser and authenticated over there. If successful, 
 // the user will get a DeviceTokenCredentials object.
 msRestAzure.interactiveLogin().then((credentials) => {
  var acccountClient = new adlaManagement.DataLakeAnalyticsAccountClient(credentials, 'your-subscription-id');
  var jobClient = new adlaManagement.DataLakeAnalyticsJobClient(credentials, 'azuredatalakeanalytics.net');
  var catalogClient = new adlaManagement.DataLakeAnalyticsCatalogClient(credentials, 'azuredatalakeanalytics.net');
  return jobClient.job.list(accountName);
}).then((jobs) => {
  console.log(result);
  return;
}).catch((err) => {
  console.log('An error occured');
  console.dir(err, {depth: null, colors: true});
});
 ```

### Create a Data Lake Analytics Account using callback pattern
```javascript
var util = require('util');
var resourceGroupName = 'testrg';
var accountName = 'testadlaacct';
var location = 'eastus2';

// A Data Lake Store account must already have been created to create
// a Data Lake Analytics account. See the Data Lake Store readme for
// information on doing so. For now, we assume one exists already.
var datalakeStoreAccountName = 'existingadlsaccount';

// account object to create
var accountToCreate = {
  tags: {
    testtag1: 'testvalue1',
    testtag2: 'testvalue2'
  },
  location: location,
  defaultDataLakeStoreAccount: datalakeStoreAccountName,
  dataLakeStoreAccounts: [
    {
      name: datalakeStoreAccountName
    }
  ]
};

client.account.create(resourceGroupName, accountName, accountToCreate, function (err, result, request, response) {
  if (err) {
    console.log(err);
    /*err has reference to the actual request and response, so you can see what was sent and received on the wire.
      The structure of err looks like this:
      err: {
        code: 'Error Code',
        message: 'Error Message',
        body: 'The response body if any',
        request: reference to a stripped version of http request
        response: reference to a stripped version of the response
      }
    */
  } else {
    console.log('result is: ' + util.inspect(result, {depth: null}));
  }
});
```

### Get a list of jobs using callback pattern

```javascript
var util = require('util');
var accountName = 'testadlaacct';
jobClient.job.list(accountName, function (err, result, request, response) {
  if (err) {
    console.log(err);
  } else {
    console.log('result is: ' + util.inspect(result, {depth: null}));
  }
});
```

### Get a list of databases in the Data Lake Analytics Catalog using Promise that provides the HttpOperationResponse<T> wrapper
```javascript
var util = require('util');
var accountName = 'testadlaacct';
catalogClient.catalog.listDatabasesWithHttpOperationResponse(accountName).then((httpOperationResponse) => {
  console.log('Deserialized Result (list of databases)');
  console.dir(httpOperationResponse.body, {depth: null, colors: true});
  console.log('Actual Request');
  console.dir(httpOperationResponse.request, {depth: null, colors: true});
  console.log('Raw Response');
  console.dir(httpOperationResponse.response, {depth: 3, colors: true});
}).catch((err) => {
  console.log('An error occurred.');
  console.dir(err, {depth: null, colors: true});
});
```

## Related projects

- [Microsoft Azure SDK for Node.js](https://github.com/azure/azure-sdk-for-node)
- [Microsoft Azure SDK for Node.js - Data Lake Store Management](https://github.com/Azure/azure-sdk-for-node/tree/autorest/lib/services/dataLake.Store)
