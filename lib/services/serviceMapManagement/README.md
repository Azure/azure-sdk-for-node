# Microsoft Azure SDK for Node.js - ServiceMapManagement

This project provides a Node.js package that makes it easy to manage Microsoft Azure ServiceMap.
## API-Version: 2016-04-01
## Minimum node.js version >= 6.x.x

## How to Install

```bash
npm install azure-arm-servicemap
```

## How to Use

### Authentication, client creation and listing machineGroups as an example

 ```javascript
 const msRestAzure = require('ms-rest-azure');
 const ServiceMapManagement = require("azure-arm-servicemap");
 
 // Interactive Login
 // It provides a url and code that needs to be copied and pasted in a browser and authenticated over there. If successful, 
 // the user will get a DeviceTokenCredentials object.
 msRestAzure.interactiveLogin().then((credentials) => {
   let client = new ServiceMapManagement(credentials, 'your-subscription-id');
   return client.machineGroups.listByWorkspace('testrg', 'testworkspace');
 }).then((machineGroups) => {
  console.log('List of machineGroups:');
  console.dir(machineGroups, {depth: null, colors: true});
}).catch((err) => {
   console.log('An error ocurred');
   console.dir(err, {depth: null, colors: true});
 });
```

## Related projects

- [Microsoft Azure SDK for Node.js](https://github.com/Azure/azure-sdk-for-node)