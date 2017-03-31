# Microsoft Azure SDK for Node.js - SQLManagement

This project provides a Node.js package that makes it easy to manage Microsoft Azure SQL.
## Minimum node.js version >= 6.x.x

## How to Install

```bash
npm install azure-arm-sql
```

## How to Use

### Authentication, client creation and listing servers as an example

 ```javascript
 const msRestAzure = require('ms-rest-azure');
 const SQLManagement = require("azure-arm-sql");
 
 // Interactive Login
 // It provides a url and code that needs to be copied and pasted in a browser and authenticated over there. If successful, 
 // the user will get a DeviceTokenCredentials object.
 msRestAzure.interactiveLogin().then((credentials) => {
   let client = new SQLManagement(credentials, 'your-subscription-id');
   return client.servers.list();
 }).then((servers) => {
  console.log('List of servers:');
  console.dir(servers, {depth: null, colors: true});
}).catch((err) => {
   console.log('An error ocurred');
   console.dir(err, {depth: null, colors: true});
 });
```

## Related projects

- [Microsoft Azure SDK for Node.js](https://github.com/Azure/azure-sdk-for-node)