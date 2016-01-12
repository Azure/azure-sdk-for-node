# Microsoft Azure SDK for Node.js - Data Lake Analytics

This project provides a Node.js package that makes it easy to manage Azure Data Lake Analytics accounts.

Right now it supports:

  *  **Node.js version: 0.8.28 or higher**
  *  **REST API version: 2015-10-01-preview**

## Features

- Account management: create, get, list, update, and delete.
- Job management: submit, get, list, cancel.
- Catalog management: get, list, create (secrets), update (secrets), delete (secrets).

## How to Install

- Install Node.js.
- Open a Command Prompt, Terminal, or Bash window.
- Enter the following:
 
```bash
npm install async
npm install adal-node
npm install azure-common
npm install azure-arm-datalake-analytics
```

## How to Use

The following example gets the job list.

```javascript
var async = require('async');
var adalNode = require('adal-node');
var azureCommon = require('azure-common');
var azureDataLakeAnalytics = require('azure-arm-datalake-analytics');

var resourceUri = 'https://management.core.windows.net/';
var loginUri = 'https://login.windows.net/'

var clientId = 'application_id_(guid)';
var clientSecret = 'application_password';

var tenantId = 'aad_tenant_id';
var subscriptionId = 'azure_subscription_id';
var resourceGroup = 'adla_resourcegroup_name';

var accountName = 'adla_account_name';

var context = new adalNode.AuthenticationContext(loginUri+tenantId);

var client;
var response;

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
      
        client = azureDataLakeAnalytics.createDataLakeAnalyticsJobManagementClient(credentials, 'azuredatalakeanalytics.net');

        next();
    },
    function (next) {
        client.jobs.list(resourceGroup, accountName, function(err, result){
            if (err) throw err;
            console.log(result);
        });
    }
]);
```

## Related projects

- [Microsoft Azure SDK for Node.js](https://github.com/azure/azure-sdk-for-node)
- [Microsoft Azure SDK for Node.js - Data Lake Store Management](https://github.com/Azure/azure-sdk-for-node/tree/master/lib/services/dataLake.Analytics)
