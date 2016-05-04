# Microsoft Azure SDK for Node.js - Web Site Management

This project provides a Node.js package that makes it easy to manage Microsoft Azure Web Site. Right now it supports:
- **Node.js version: 0.10.0 or higher**
- **API version: 2015-08-01**

## Features

 - TODO

## How to Install

```bash
npm install azure-arm-website
```

## How to Use

### Authentication

 ```javascript
var msrestAzure = require('ms-rest-azure');
 //user authentication
 var credentials = new msRestAzure.UserTokenCredentials('your-client-id', 'your-domain', 'your-username', 'your-password', 'your-redirect-uri');
 //service principal authentication
 var credentials = new msRestAzure.ApplicationTokenCredentials('your-client-id', 'your-domain', 'your-secret');
 ```

### Create the WebSiteManagementClient

```javascript
var webSiteManagement = require('azure-arm-website');
var webSiteManagementClient = new webSiteManagement(credentials, 'your-subscription-id');
```

## Related projects

- [Microsoft Azure SDK for Node.js - All-up](https://github.com/WindowsAzure/azure-sdk-for-node)
