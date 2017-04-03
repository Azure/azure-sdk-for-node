# Microsoft Azure SDK for Node.js - OperationalInsightsManagement

This project provides a Node.js package that makes it easy to manage Microsoft Azure OperationalInsights.
## Minimum node.js version >= 6.x.x

## How to Install

```bash
npm install azure-arm-operationalinsights
```

## How to Use

### Authentication, client creation and listing workspaces as an example

 ```javascript
 const msRestAzure = require('ms-rest-azure');
 const OperationalInsightsManagement = require("azure-arm-operationalinsights");
 
 // Interactive Login
 // It provides a url and code that needs to be copied and pasted in a browser and authenticated over there. If successful, 
 // the user will get a DeviceTokenCredentials object.
 msRestAzure.interactiveLogin().then((credentials) => {
   let client = new OperationalInsightsManagement(credentials, 'your-subscription-id');
   return client.workspaces.listByResourceGroup('testworkspace');
 }).then((workspaces) => {
  console.log('List of workspaces:');
  console.dir(workspaces, {depth: null, colors: true});
}).catch((err) => {
   console.log('An error ocurred');
   console.dir(err, {depth: null, colors: true});
 });
```

## Related projects

- [Microsoft Azure SDK for Node.js](https://github.com/Azure/azure-sdk-for-node)