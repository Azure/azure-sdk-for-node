# Microsoft Azure SDK for Node.js - BillingManagement

This project provides a Node.js package for accessing Azure. Right now it supports:
- **Node.js version: 6.x.x or higher**
- **API version: 2017-02-27-preview**

## Features


## How to Install

```bash
npm install azure-arm-billing
```

## How to Use

### Authentication, client creation and listing invoices as an example

 ```javascript
 const msRestAzure = require('ms-rest-azure');
 const BillingManagement = require("azure-arm-billing");
 
 // Interactive Login
 // It provides a url and code that needs to be copied and pasted in a browser and authenticated over there. If successful, 
 // the user will get a DeviceTokenCredentials object.
 msRestAzure.interactiveLogin().then((credentials) => {
   let client = new BillingManagementClient(credentials, 'your-subscription-id');
   client.invoices.list().then((invoices) => {
     console.log('List of invoices:');
     console.dir(invoices, {depth: null, colors: true});
   });
 }).catch((err) => {
   console.log('An error ocurred');
   console.dir(err, {depth: null, colors: true});
 });
```

## Related projects

- [Microsoft Azure SDK for Node.js](https://github.com/Azure/azure-sdk-for-node)
