# Microsoft Azure SDK for Node.js - ContainerServiceManagement

This project provides a Node.js package for accessing Azure. Right now it supports:
- **Node.js version: 6.x.x or higher**
- **API version: 2017-03-01**

## Features


## How to Install

```bash
npm install azure-arm-containerservice
```

## How to Use

### Authentication, client creation and listing container services as an example

 ```javascript
 const msRestAzure = require('ms-rest-azure');
 const ContainerServiceManagement = require("azure-arm-containerservice");
 
 // Interactive Login
 // It provides a url and code that needs to be copied and pasted in a browser and authenticated over there. If successful, 
 // the user will get a DeviceTokenCredentials object.
 msRestAzure.interactiveLogin().then((credentials) => {
   let client = new ContainerServiceManagement(credentials, 'your-subscription-id');
   client.containerServices.list().then((containerServices) => {
     console.log('List of container services:');
     console.dir(containerServices, {depth: null, colors: true});
   });
 }).catch((err) => {
   console.log('An error ocurred');
   console.dir(err, {depth: null, colors: true});
 });
```

## Related projects

- [Microsoft Azure SDK for Node.js](https://github.com/Azure/azure-sdk-for-node)
