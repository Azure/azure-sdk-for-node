# Microsoft Azure SDK for Node.js - MediaServicesManagement

This project provides a Node.js package that makes it easy to manage Microsoft Azure MediaServices.
## Minimum node.js version >= 6.x.x

## How to Install

```bash
npm install azure-arm-mediaservice
```

## How to Use

### Authentication, client creation and listing mediaServices as an example

 ```javascript
 const msRestAzure = require('ms-rest-azure');
 const MediaServicesManagement = require('azure-arm-mediaservices');
 
 // Interactive Login
 // It provides a url and code that needs to be copied and pasted in a browser and authenticated over there. If successful, 
 // the user will get a DeviceTokenCredentials object.
 msRestAzure.interactiveLogin().then((credentials) => {
   let client = new MediaServicesManagement(credentials, 'your-subscription-id');
   return client.mediaServiceOperations.listByResourceGroup('testrg');
 }).then((mediaServices) => {
  console.log('List of zones:');
  console.dir(mediaServices, {depth: null, colors: true});
}).catch((err) => {
   console.log('An error ocurred');
   console.dir(err, {depth: null, colors: true});
 });
```

## Related projects

- [Microsoft Azure SDK for Node.js](https://github.com/Azure/azure-sdk-for-node)