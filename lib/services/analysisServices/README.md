# Microsoft Azure SDK for Node.js - AnalysisServices

This project provides a Node.js package for accessing the Azure PAS. Right now it supports:
- **Node.js version: 4.x.x or higher**
- **API version: 2016-05-16**

## Features


## How to Install

```bash
npm install azure-arm-analysisservices
```

## How to Use

### Authentication, client creation and listing role assignments as an example

 ```javascript
 var msRestAzure = require('ms-rest-azure');
 var analysisServicesManagement = require("azure-arm-analysisservices");

 // Interactive Login
 // It provides a url and code that needs to be copied and pasted in a browser and authenticated over there. If successful, 
 // the user will get a DeviceTokenCredentials object.
 msRestAzure.interactiveLogin(function(err, credentials) {
  var client = new analysisServicesManagement(credentials, 'your-subscription-id');
  client.roleAssignments.listForResourceGroup(rgName, function(err, result) {
    if (err) console.log(err);
    console.log(result);
  });
 });
 ```

## Related projects

- [Microsoft Azure SDK for Node.js](https://github.com/Azure/azure-sdk-for-node)
