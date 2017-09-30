# Microsoft Azure SDK for Node.js - RelayManagement

This project provides a Node.js package that makes it easy to manage Microsoft Azure Relay.
## Minimum node.js version >= 6.x.x

## How to Install

```bash
npm install azure-arm-relay
```

## How to Use

### Authentication, client creation and listing namespaces as an example

 ```javascript
 const msRestAzure = require('ms-rest-azure');
 const RelayManagement = require("azure-arm-relay");
 
 // Interactive Login
 // It provides a url and code that needs to be copied and pasted in a browser and authenticated over there. If successful, 
 // the user will get a DeviceTokenCredentials object.
 msRestAzure.interactiveLogin().then((credentials) => {
   let client = new RelayManagement(credentials, 'your-subscription-id');
   return client.namespaces.list();
 }).then((namespaces) => {
  console.log('List of namespaces:');
  console.dir(namespaces, {depth: null, colors: true});
}).catch((err) => {
   console.log('An error ocurred');
   console.dir(err, {depth: null, colors: true});
 });
```

## Related projects

- [Microsoft Azure SDK for Node.js](https://github.com/Azure/azure-sdk-for-node)