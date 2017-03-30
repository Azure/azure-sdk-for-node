# Microsoft Azure SDK for Node.js - CustomerInsightsManagement

This project provides a Node.js package for accessing Azure. Right now it supports:
- **Node.js version: 6.x.x or higher**
- **API version: 2017-01-01**

## Features


## How to Install

```bash
npm install azure-arm-customerinsights
```

## How to Use

### Authentication, client creation and listing hubs as an example

 ```javascript
 const msRestAzure = require('ms-rest-azure');
 const CustomerInsightsManagement = require("azure-arm-customerinsights");
 
 // Interactive Login
 // It provides a url and code that needs to be copied and pasted in a browser and authenticated over there. If successful, 
 // the user will get a DeviceTokenCredentials object.
 msRestAzure.interactiveLogin().then((credentials) => {
   let client = new CustomerInsightsManagement(credentials, 'your-subscription-id');
   client.hubs.list().then((hubs) => {
     console.log('List of hubs:');
     console.dir(hubs, {depth: null, colors: true});
   });
 }).catch((err) => {
   console.log('An error ocurred');
   console.dir(err, {depth: null, colors: true});
 });
```

## Related projects

- [Microsoft Azure SDK for Node.js](https://github.com/Azure/azure-sdk-for-node)
