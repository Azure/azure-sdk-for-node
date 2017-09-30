# Microsoft Azure SDK for Node.js - AnalysisServices

This project provides a Node.js package for accessing the Azure PAS. Right now it supports:
- **Node.js version: 6.x.x or higher**
- **API version: 2017-08-01-beta**

## Features


## How to Install

```bash
npm install azure-arm-analysisservices
```

## How to Use

### Authentication, client creation and listing analysis server as an example

 ```javascript
 var msRestAzure = require('ms-rest-azure');
 var analysisServicesManagement = require("azure-arm-analysisservices");
 
 // Interactive Login
 // It provides a url and code that needs to be copied and pasted in a browser and authenticated over there. If successful, 
 // the user will get a DeviceTokenCredentials object.
 msRestAzure.interactiveLogin(function(err, credentials) {
  var client = new analysisServicesManagement(credentials, 'your-subscription-id');

  var util = require('util');
  var resourceGroupName = 'testrg';
  var serverName = 'testadlsacct';
  var location = 'eastus2';

  client.servers.list(function(err, result) {
    if (err) console.log(err);
    console.log(result);
  });

  // account object to create
  var serverToCreate = {
    sku: {
        name: "S1",
        tier: "Standard"
    },    
    tags: {
      testtag1: 'testvalue1',
      testtag2: 'testvalue2'
    },
    name: serverName,
    location: location,
    properties: {
      provisioningState: "Succeeded",
      serverFullName: "asazure://stabletest.asazure-int.windows.net/upgradevalidation",
      asAdministrators: {
        members: [
          "aztest0@stabletest.ccsctp.net"
        ]
      }
    }
  };

  client.servers.create(resourceGroupName, serverName, serverToCreate, function (err, result) {
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
 });
```

## Related projects

- [Microsoft Azure SDK for Node.js](https://github.com/Azure/azure-sdk-for-node)
