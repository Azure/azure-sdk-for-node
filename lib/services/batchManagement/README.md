# Microsoft Azure SDK for Node.js - Batch Management

This project provides a Node.js package that makes it easy to manage Microsoft Azure Batch Resources. Right now it supports:
- **Node.js version: 6.x.x or higher**

## How to Install

```bash
npm install azure-arm-batch
```

## How to use

### Authentication, client creation and listing accounts as an example

 ```javascript
 const msRestAzure = require('ms-rest-azure');
 const batchManagementClient = require('azure-arm-batch');

 // Interactive Login
 // It provides a url and code that needs to be copied and pasted in a browser and authenticated over there. If successful, 
 // the user will get a DeviceTokenCredentials object.
 msRestAzure.interactiveLogin().then((credentials) => {
  let client = new batchManagementClient(credentials, 'your-subscription-id');
  return client.batchAccountOperations.list(rgName);
 }).then((result) => {
  console.dir(result, {depth: null, colors: true});
}).catch ((err) => {
  console.log('An error occurred.');
  console.dir(err, {depth: null, colors: true});
});
 ```

## Related projects

- [Microsoft Azure SDK for Node.js](https://github.com/Azure/azure-sdk-for-node)
