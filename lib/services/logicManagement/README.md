# Microsoft Azure SDK for Node.js - LogicManagement

This project provides a Node.js package that makes it easy to manage Microsoft Azure Logic.
## API-Version: 2016-06-01
## Minimum node.js version >= 6.x.x

## How to Install

```bash
npm install azure-arm-logic
```

## How to Use

### Authentication, client creation and listing workflows as an example

 ```javascript
 const msRestAzure = require('ms-rest-azure');
 const LogicManagement = require("azure-arm-logic");
 
 // Interactive Login
 // It provides a url and code that needs to be copied and pasted in a browser and authenticated over there. If successful, 
 // the user will get a DeviceTokenCredentials object.
 msRestAzure.interactiveLogin().then((credentials) => {
   let client = new LogicManagement(credentials, 'your-subscription-id');
   return client.workflows.listBySubscription();
 }).then((workflows) => {
  console.log('List of workflows:');
  console.dir(workflows, {depth: null, colors: true});
}).catch((err) => {
   console.log('An error ocurred');
   console.dir(err, {depth: null, colors: true});
 });
```

## Related projects

- [Microsoft Azure SDK for Node.js](https://github.com/Azure/azure-sdk-for-node)