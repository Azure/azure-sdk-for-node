# Microsoft Azure SDK for Node.js - DatafactoryManagement

This project provides a Node.js package for accessing the Azure PAS. Right now it supports:
- **Node.js version: 6.x.x or higher**

## How to Install

```bash
npm install azure-arm-datafactory
```

## How to Use

### Authentication, client creation and listing factories as an example

 ```javascript
 var msRestAzure = require('ms-rest-azure');
 var DataFactoryManagementClient = require("azure-arm-datafactory");
 
 // Interactive Login
 // It provides a url and code that needs to be copied and pasted in a browser and authenticated over there. If successful, 
 // the user will get a DeviceTokenCredentials object.
 msRestAzure.interactiveLogin(function(err, credentials) {
  let client = new DataFactoryManagementClient(credentials, 'your-subscription-id');
  client.factories.list().then((factories) => {
    console.log('List of factories:');
    console.dir(factories, {depth: null, colors: true});
   });
  }).catch((err) => {
   console.log('An error ocurred');
   console.dir(err, {depth: null, colors: true});
  });
});
```

## Related projects

- [Microsoft Azure SDK for Node.js](https://github.com/Azure/azure-sdk-for-node)
