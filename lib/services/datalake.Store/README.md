# Microsoft Azure SDK for Node.js - Data Lake Store

This project provides a Node.js package that makes it easy to manage Azure Data Lake Store accounts.

Right now it supports:

  *  **Node.js version: 6.x.x or higher**

## Features

- Account management: create, get, list, update, and delete.
- File system management: create, get, upload, append, download, read, delete, list.

## How to Install

```bash
npm install azure-arm-datalake-store
```

## How to Use

### Authentication, account and filesystem client creation and listing file status as an example

 ```javascript
 var msRestAzure = require('ms-rest-azure');
 var adlsManagement = require("azure-arm-datalake-store");
 
 // Interactive Login
 // It provides a url and code that needs to be copied and pasted in a browser and authenticated over there. If successful, 
 // the user will get a DeviceTokenCredentials object.
 msRestAzure.interactiveLogin(function(err, credentials) {
  var accountName = 'testadlsacct';
  var pathToEnumerate = '/myfolder';
  var acccountClient = new adlsManagement.DataLakeStoreAccountClient(credentials, 'your-subscription-id');
  var filesystemClient = new adlsManagement.DataLakeStoreFileSystemClient(credentials, 'azuredatalakestore.net');
  filesystemClient.fileSystem.listFileStatus(accountName, pathToEnumerate, function(err, result, request, response) {
    if (err) console.log(err);
    console.log(result);
  });
 });
 ```

### Create a Data Lake Store Account
```javascript
var util = require('util');
var resourceGroupName = 'testrg';
var accountName = 'testadlsacct';
var location = 'eastus2';

// account object to create
var accountToCreate = {
  tags: {
    testtag1: 'testvalue1',
    testtag2: 'testvalue2'
  },
  location: location
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

### Create a file with content
```javascript
var util = require('util');
var accountName = 'testadlsacct';
var fileToCreate = '/myfolder/myfile.txt';
var options = {
  streamContents: new Buffer('some string content')
}

filesystemClient.fileSystem.listFileStatus(accountName, fileToCreate, options, function (err, result, request, response) {
  if (err) {
    console.log(err);
  } else {
    // no result is returned, only a 201 response for success.
    console.log('response is: ' + util.inspect(response, {depth: null}));
  }
});
```

### Get a list of files and folders

```javascript
var util = require('util');
var accountName = 'testadlsacct';
var pathToEnumerate = '/myfolder';
filesystemClient.fileSystem.listFileStatus(accountName, pathToEnumerate, function (err, result, request, response) {
  if (err) {
    console.log(err);
  } else {
    console.log('result is: ' + util.inspect(result, {depth: null}));
  }
});
```

## Related projects

- [Microsoft Azure SDK for Node.js](https://github.com/azure/azure-sdk-for-node)
- [Microsoft Azure SDK for Node.js - Data Lake Analytics Management](https://github.com/Azure/azure-sdk-for-node/tree/autorest/lib/services/dataLake.Store)
