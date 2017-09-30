# Microsoft Azure SDK for Node.js - AdvisorManagement

This project provides a Node.js package for accessing Azure. Right now it supports:
- **Node.js version: 6.x.x or higher**
- **API version: 2017-04-19**

## Features


## How to Install

```bash
npm install azure-arm-advisor
```

## How to Use

### Authentication, client creation and listing recommendations as an example

 ```javascript
 const msRestAzure = require('ms-rest-azure');
 const advisorManagement = require("azure-arm-advisor");
 
 // Interactive Login
 // It provides a url and code that needs to be copied and pasted in a browser and authenticated over there. If successful, 
 // the user will get a DeviceTokenCredentials object.
 msRestAzure.interactiveLogin().then((credentials) => {
   let client = new advisorManagement(credentials, 'your-subscription-id');
   client.recommendations.list().then((recommendations) => {
     console.log('List of recommendations:');
     console.dir(recommendations, {depth: null, colors: true});
   });
 }).catch((err) => {
   console.log('An error ocurred');
   console.dir(err, {depth: null, colors: true});
 });
```

## Related projects

- [Microsoft Azure SDK for Node.js](https://github.com/Azure/azure-sdk-for-node)
