# Microsoft Azure SDK for Node.js - OperationsManagement

This project provides a Node.js package for accessing the Azure PAS. Right now it supports:
- **Node.js version: 6.x.x or higher**

## How to Install

```bash
npm install azure-arm-operations
```

## How to Use

### Authentication, client creation and listing solutions as an example

 ```javascript
 var msRestAzure = require('ms-rest-azure');
 var OperationsManagementClient = require("azure-arm-operations");
 
 // Interactive Login
 // It provides a url and code that needs to be copied and pasted in a browser and authenticated over there. If successful, 
 // the user will get a DeviceTokenCredentials object.
 msRestAzure.interactiveLogin(function(err, credentials) {
  let client = new OperationsManagementClient(credentials, 'your-subscription-id');
  client.solutions.listBySubscription().then((solutions) => {
    console.log('List of solutions:');
    console.dir(solutions, {depth: null, colors: true});
   });
  }).catch((err) => {
   console.log('An error ocurred');
   console.dir(err, {depth: null, colors: true});
  });
});
```

## Related projects

- [Microsoft Azure SDK for Node.js](https://github.com/Azure/azure-sdk-for-node)
