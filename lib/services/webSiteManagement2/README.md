# Microsoft Azure SDK for Node.js - Web Site Management

This project provides a Node.js package that makes it easy to manage Microsoft Azure Web Site. Right now it supports:
- **Node.js version: 6.x.x or higher**

## Features

 - TODO

## How to Install

```bash
npm install azure-arm-website
```

## How to Use

### Authentication, client creation and listing serverFarms in a resource group as an example

 ```javascript
 const msRestAzure = require('ms-rest-azure');
 const webSiteManagementClient = require('azure-arm-website');
 
 // Interactive Login
 msRestAzure.interactiveLogin(function(err, credentials) {
  let client = new webSiteManagementClient(credentials, 'your-subscription-id');
  client.webApps.list(function(err, result) {
    if (err) return console.log(err);
    return console.log(result);
  });
 });
 ```

## Related projects

- [Microsoft Azure SDK for Node.js - All-up](https://github.com/WindowsAzure/azure-sdk-for-node)
