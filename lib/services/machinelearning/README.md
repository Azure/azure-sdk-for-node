# Microsoft Azure SDK for Node.js - MachineLearningManagement

This project provides a Node.js package for accessing Azure. Right now it supports:
- **Node.js version: 6.x.x or higher**

## Features


## How to Install

```bash
npm install azure-arm-machinelearning
```

## How to Use

### Authentication, client creation and listing commitmentPlans as an example

 ```javascript
 const msRestAzure = require('ms-rest-azure');
 const MachineLearningManagement = require("azure-arm-machinelearning");
 
 // Interactive Login
 // It provides a url and code that needs to be copied and pasted in a browser and authenticated over there. If successful, 
 // the user will get a DeviceTokenCredentials object.
 msRestAzure.interactiveLogin().then((credentials) => {
   let client = new MachineLearningManagement.CommitmentPlansManagementClient(credentials, 'your-subscription-id');
   return client.commitmentPlans.list();
 }).then((commitmentPlans) => {
    console.log('List of commitmentPlans:');
    console.dir(commitmentPlans, {depth: null, colors: true});
    return;
}).catch((err) => {
  console.log('An error ocurred');
  console.dir(err, {depth: null, colors: true});
  return;
});
```

## Related projects

- [Microsoft Azure SDK for Node.js](https://github.com/Azure/azure-sdk-for-node)
