# Microsoft Azure SDK for Node.js - Web Site Management

This project provides a Node.js package that makes it easy to manage Microsoft Azure Web Site. Right now it supports:
- **Node.js version: 0.6.15 or higher**
- **API version: 2013-08-01**

## Features

 - TODO

## How to Install

```bash
npm install azure-arm-website
```

## How to Use

### Authentication

 - TODO: Describe tokens

### Create the WebSiteManagementClient

```javascript
var fs                = require('fs'),
    webSiteManagement = require('azure-arm-website');

var webSiteManagementClient = webSiteManagement.createWebsiteManagementClient(webSiteManagement.createCertificateCloudCredentials({
  subscriptionId: '<your subscription id>',
  pem: fs.readFileSync('<your pem file>')
}));
```

## Related projects

- [Microsoft Azure SDK for Node.js - All-up](https://github.com/WindowsAzure/azure-sdk-for-node)
