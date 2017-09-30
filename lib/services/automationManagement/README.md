# Microsoft Azure SDK for Node.js - AutomationManagement

This project provides a Node.js package for accessing Azure. Right now it supports:
- **Node.js version: 6.x.x or higher**

## Features


## How to Install

```bash
npm install azure-arm-automation
```

## How to Use

### Authentication, client creation and listing automation accounts as an example

 ```javascript
 const msRestAzure = require('ms-rest-azure');
 const AutomationManagement = require("azure-arm-automation");
 
 // Interactive Login
 // It provides a url and code that needs to be copied and pasted in a browser and authenticated over there. If successful, 
 // the user will get a DeviceTokenCredentials object.
 msRestAzure.interactiveLogin().then((credentials) => {
   let client = new AutomationManagement(credentials, 'your-subscription-id');
   client.automationAccounts.listByResourceGroup('test-rg').then((automationAccounts) => {
     console.log('List of Automation Accounts:');
     console.dir(automationAccounts, {depth: null, colors: true});
   });
 }).catch((err) => {
   console.log('An error ocurred');
   console.dir(err, {depth: null, colors: true});
 });
```

## Related projects

- [Microsoft Azure SDK for Node.js](https://github.com/Azure/azure-sdk-for-node)