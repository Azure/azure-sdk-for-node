# Microsoft Azure SDK for Node.js - CognitiveServicesManagement

This project provides a Node.js package for accessing Azure. Right now it supports:
- **Node.js version: 6.x.x or higher**

## Features


## How to Install

```bash
npm install azure-arm-cognitiveservices
```

## How to Use

### Authentication, client creation and listing cognitiveServicesAccounts as an example

 ```javascript
 const msRestAzure = require('ms-rest-azure');
 const CognitiveServicesManagement = require("azure-arm-cognitiveservices");
 
 // Interactive Login
 // It provides a url and code that needs to be copied and pasted in a browser and authenticated over there. If successful, 
 // the user will get a DeviceTokenCredentials object.
 msRestAzure.interactiveLogin().then((credentials) => {
   let client = new CognitiveServicesManagement(credentials, 'your-subscription-id');
   client.cognitiveServicesAccounts.list().then((cognitiveServicesAccounts) => {
     console.log('List of cognitiveServicesAccounts:');
     console.dir(cognitiveServicesAccounts, {depth: null, colors: true});
   });
 }).catch((err) => {
   console.log('An error ocurred');
   console.dir(err, {depth: null, colors: true});
 });
```

## Related projects

- [Microsoft Azure SDK for Node.js](https://github.com/Azure/azure-sdk-for-node)
