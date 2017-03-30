# Microsoft Azure SDK for Node.js - commerceManagement

This project provides a Node.js package for accessing Azure. Right now it supports:
- **Node.js version: 6.x.x or higher**
- **API version: 2015-06-01-preview**

## Features


## How to Install

```bash
npm install azure-arm-commerce
```

## How to Use

### Authentication, client creation and listing invoices as an example

 ```javascript
 const msRestAzure = require('ms-rest-azure');
 const CommerceManagement = require("azure-arm-commerce");
 
 // Interactive Login
 // It provides a url and code that needs to be copied and pasted in a browser and authenticated over there. If successful, 
 // the user will get a DeviceTokenCredentials object.
 msRestAzure.interactiveLogin().then((credentials) => {
   let client = new CommerceManagement(credentials, 'your-subscription-id');
   client.usageAggregates.list().then((usageAggregates) => {
     console.log('List of usageAggregates:');
     console.dir(usageAggregates, {depth: null, colors: true});
   });
 }).catch((err) => {
   console.log('An error ocurred');
   console.dir(err, {depth: null, colors: true});
 });
```

## Related projects

- [Microsoft Azure SDK for Node.js](https://github.com/Azure/azure-sdk-for-node)
