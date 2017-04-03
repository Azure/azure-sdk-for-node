# Microsoft Azure SDK for Node.js - Web Site Management

This project provides a Node.js package that makes it easy to manage Microsoft Azure Web Site. Right now it supports:
- **Node.js version: 6.x.x or higher**
- **API version: 2016-03-01**

## Features

 - TODO

## How to Install

```bash
npm install azure-arm-website
```

## How to Use

### Authentication, client creation and listing serverFarms in a resource group as an example

 ```javascript
 var msRestAzure = require('ms-rest-azure');
 var webSiteManagementClient = require('azure-arm-website');
 
 // Interactive Login
 msRestAzure.interactiveLogin(function(err, credentials) {
  var client = new webSiteManagementClient(credentials, 'your-subscription-id');
  client.serverFarms.getServerFarms(resourceGroupName, function(err, result) {
    if (err) console.log(err);
    console.log(result);
  });
 });
 ```

## Related projects

- [Microsoft Azure SDK for Node.js - All-up](https://github.com/WindowsAzure/azure-sdk-for-node)
