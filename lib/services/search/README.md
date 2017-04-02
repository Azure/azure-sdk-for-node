# Microsoft Azure SDK for Node.js - SearchIndex

This project provides a Node.js package that makes it easy to manage Microsoft Azure SearchIndex.
## Minimum node.js version >= 6.x.x
## API Version: 2016-09-01
## How to Install

```bash
npm install azure-arm-searchindex
```

## How to Use

### Authentication, client creation and counts documentsProxy as an example

 ```javascript
 const msRestAzure = require('ms-rest-azure');
 const SearchIndex = require("azure-arm-searchindex");
 
 // Interactive Login
 // It provides a url and code that needs to be copied and pasted in a browser and authenticated over there. If successful, 
 // the user will get a DeviceTokenCredentials object.
 msRestAzure.interactiveLogin().then((credentials) => {
   let client = new SearchIndex(credentials, 'your-subscription-id');
   return client.documentsProxy.count();
 }).then((documentsProxy) => {
  console.log('List of documentsProxy:');
  console.dir(documentsProxy, {depth: null, colors: true});
}).catch((err) => {
   console.log('An error ocurred');
   console.dir(err, {depth: null, colors: true});
 });
```

## Related projects

- [Microsoft Azure SDK for Node.js](https://github.com/Azure/azure-sdk-for-node)