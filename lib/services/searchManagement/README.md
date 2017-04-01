# Microsoft Azure SDK for Node.js - SearchManagement

This project provides a Node.js package that makes it easy to manage Microsoft Azure Search.
## API-Version: 2015-08-19
## Minimum node.js version >= 6.x.x

## How to Install

```bash
npm install azure-arm-search
```

## How to Use

### Authentication, client creation and listing services as an example

 ```javascript
 const msRestAzure = require('ms-rest-azure');
 const SearchManagement = require("azure-arm-search");
 
 // Interactive Login
 // It provides a url and code that needs to be copied and pasted in a browser and authenticated over there. If successful, 
 // the user will get a DeviceTokenCredentials object.
 msRestAzure.interactiveLogin().then((credentials) => {
   let client = new SearchManagement(credentials, 'your-subscription-id');
   return client.services.listByResourceGroup('testrg');
 }).then((services) => {
  console.log('List of services:');
  console.dir(services, {depth: null, colors: true});
}).catch((err) => {
   console.log('An error ocurred');
   console.dir(err, {depth: null, colors: true});
 });
```

## Related projects

- [Microsoft Azure SDK for Node.js](https://github.com/Azure/azure-sdk-for-node)