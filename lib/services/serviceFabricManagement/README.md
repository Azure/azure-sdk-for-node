# Microsoft Azure SDK for Node.js - ServiceFabricManagement

This project provides a Node.js package that makes it easy to manage Microsoft Azure ServiceFabric.
## Minimum node.js version >= 6.x.x

## How to Install

```bash
npm install azure-arm-servicefabric
```

## How to Use

### Authentication, client creation and listing clusters as an example

 ```javascript
 const msRestAzure = require('ms-rest-azure');
 const ServiceFabricManagement = require("azure-arm-servicefabric");
 
 // Interactive Login
 // It provides a url and code that needs to be copied and pasted in a browser and authenticated over there. If successful, 
 // the user will get a DeviceTokenCredentials object.
 msRestAzure.interactiveLogin().then((credentials) => {
   let client = new ServiceFabricManagement(credentials, 'your-subscription-id');
   return client.clusters.list();
 }).then((clusters) => {
  console.log('List of clusters:');
  console.dir(clusters, {depth: null, colors: true});
}).catch((err) => {
   console.log('An error ocurred');
   console.dir(err, {depth: null, colors: true});
 });
```

## Related projects

- [Microsoft Azure SDK for Node.js](https://github.com/Azure/azure-sdk-for-node)