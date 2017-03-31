# Microsoft Azure SDK for Node.js - SearchService

This project provides a Node.js package that makes it easy to manage Microsoft Azure DNS.
## API-Version: 2016-09-01
## Minimum node.js version >= 6.x.x

## How to Install

```bash
npm install azure-arm-searchservice
```

## How to Use

### Authentication, client creation and listing indexers as an example

 ```javascript
 const msRestAzure = require('ms-rest-azure');
 const SearchService = require("azure-arm-searchservice");
 
 // Interactive Login
 // It provides a url and code that needs to be copied and pasted in a browser and authenticated over there. If successful, 
 // the user will get a DeviceTokenCredentials object.
 msRestAzure.interactiveLogin().then((credentials) => {
   let client = new SearchService(credentials, 'your-subscription-id');
   return client.indexers.list();
 }).then((indexers) => {
  console.log('List of indexers:');
  console.dir(indexers, {depth: null, colors: true});
}).catch((err) => {
   console.log('An error ocurred');
   console.dir(err, {depth: null, colors: true});
 });
```

## Related projects

- [Microsoft Azure SDK for Node.js](https://github.com/Azure/azure-sdk-for-node)