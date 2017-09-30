# Deprecation Warning

This package has been **deprecated**. Please use [azure-arm-cosmosdb](https://www.npmjs.com/package/azure-arm-cosmosdb) instead.

## Microsoft Azure SDK for Node.js - DocumentDBManagement

This project provides a Node.js package for accessing Azure. Right now it supports:
- **Node.js version: 6.x.x or higher**
- **API version: 2015-04-08**

## Features


## How to Install

```bash
npm install azure-arm-documentdb
```

## How to Use

### Authentication, client creation and listing databaseAccounts as an example

 ```javascript
 const msRestAzure = require('ms-rest-azure');
 const DocumentDBManagement = require("azure-arm-documentdb");
 
 // Interactive Login
 // It provides a url and code that needs to be copied and pasted in a browser and authenticated over there. If successful, 
 // the user will get a DeviceTokenCredentials object.
 msRestAzure.interactiveLogin().then((credentials) => {
   let client = new DocumentDBManagement(credentials, 'your-subscription-id');
   return client.databaseAccounts.list();
 }).then((databaseAccounts) => {
  console.log('List of databaseAccounts:');
  console.dir(databaseAccounts, {depth: null, colors: true});
}).catch((err) => {
   console.log('An error ocurred');
   console.dir(err, {depth: null, colors: true});
 });
```

## Related projects

- [Microsoft Azure SDK for Node.js](https://github.com/Azure/azure-sdk-for-node)
