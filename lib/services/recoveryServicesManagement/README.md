# Microsoft Azure SDK for Node.js - RecoveryServicesManagement

This project provides a Node.js package that makes it easy to manage Microsoft Azure RecoveryServices.
## API-Version: 2016-04-01
## Minimum node.js version >= 6.x.x

## How to Install

```bash
npm install azure-arm-recoveryservices
```

## How to Use

### Authentication, client creation and listing vaults as an example

 ```javascript
 const msRestAzure = require('ms-rest-azure');
 const RecoveryServicesManagement = require("azure-arm-recoveryservices");
 
 // Interactive Login
 // It provides a url and code that needs to be copied and pasted in a browser and authenticated over there. If successful, 
 // the user will get a DeviceTokenCredentials object.
 msRestAzure.interactiveLogin().then((credentials) => {
   let client = new RecoveryServicesManagement(credentials, 'your-subscription-id');
   return client.vaults.listByResourceGroup('testrg');
 }).then((vaults) => {
  console.log('List of vaults:');
  console.dir(vaults, {depth: null, colors: true});
}).catch((err) => {
   console.log('An error ocurred');
   console.dir(err, {depth: null, colors: true});
 });
```

## Related projects

- [Microsoft Azure SDK for Node.js](https://github.com/Azure/azure-sdk-for-node)