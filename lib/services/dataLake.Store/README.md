# Microsoft Azure SDK for Node.js - Data Lake Store

This project provides a Node.js package that makes it easy to manage Azure Data Lake Store accounts.

Right now it supports:

  *  **Node.js version: 0.8.28 or higher**
  *  **REST API version: 2015-10-01-preview**

## Features

- Account management: create, get, list, update, and delete.
- File system management: create, get, upload, append, download, read, delete, list.

## How to Install

- Install Node.js.
- Open a Command Prompt, Terminal, or Bash window.
- Enter the following:
 
```bash
npm install async
npm install adal-node
npm install azure-common
npm install azure-arm-datalake-store
```

## How to Use

The following example creates a file in a Data Lake Store account and appends data to it.

```javascript
var async = require('async');
var adalNode = require('adal-node');
var azureCommon = require('azure-common');
var azureDataLakeStore = require('azure-arm-datalake-store');

var resourceUri = 'https://management.core.windows.net/';
var loginUri = 'https://login.windows.net/'

var clientId = 'application_id_(guid)';
var clientSecret = 'application_password';

var tenantId = 'aad_tenant_id';
var subscriptionId = 'azure_subscription_id';
var resourceGroup = 'adls_resourcegroup_name';

var accountName = 'adls_account_name';

var context = new adalNode.AuthenticationContext(loginUri+tenantId);

var client;
var response;

var destinationFilePath = '/newFileName.txt';
var content = 'desired file contents';

async.series([
    function (next) {
        context.acquireTokenWithClientCredentials(resourceUri, clientId, clientSecret, function(err, result){
            if (err) throw err;
            response = result;
            next();
        });
    },
    function (next) {
        var credentials = new azureCommon.TokenCloudCredentials({
            subscriptionId : subscriptionId,
            authorizationScheme : response.tokenType,
            token : response.accessToken
        });
      
        client = azureDataLakeStore.createDataLakeStoreFileSystemManagementClient(credentials, 'azuredatalakestore.net');

        next();
    },
    function (next) {
        client.fileSystem.directCreate(destinationFilePath, accountName, content, function(err, result){
            if (err) throw err;
        });
    }
]);
```

## Related projects

- [Microsoft Azure SDK for Node.js](https://github.com/azure/azure-sdk-for-node)
- [Microsoft Azure SDK for Node.js - Data Lake Analytics Management](https://github.com/Azure/azure-sdk-for-node/tree/master/lib/services/dataLake.Store)
