# Deprecation Warning
This package is **deprecated**. Intune now uses the Microsoft Graph API implementation, see https://aka.ms/intune-graph-api

## Microsoft Azure SDK for Node.js - Intune

This project provides a Node.js package that makes it easy to manage Microsoft Intune Resources. Right now it supports:
- **Node.js version: 6.x.x or higher**
- **API version: 2015-01-14-preview**


## How to Install

```bash
npm install azure-arm-intune
```

## How to Use

### Authentication, client creation and getting location by hostname

 ```javascript
 var msRestAzure = require('ms-rest-azure');
 var IntuneResourceManagementClient = require('azure-arm-intune');

 // Interactive Login
 // It provides a url and code that needs to be copied and pasted in a browser and authenticated over there. If successful,
 // the user will get a DeviceTokenCredentials object.
 msRestAzure.interactiveLogin(function(err, credentials) {
  var client = new IntuneResourceManagementClient(credentials);
  client.getLocationByHostName(null, function(error, result, request, response) {
    if (err) console.log(err);
    console.log(result);
  });
 });
 ```

## Related projects

- [Microsoft Azure SDK for Node.js - All-up](https://github.com/WindowsAzure/azure-sdk-for-node)
