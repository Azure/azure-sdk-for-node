# Microsoft Azure SDK for Node.js - Azure Monitor Management

This project provides a Node.js package that makes it easy to use the Azure Monitor API. Right now it supports:
- **Node.js version: 0.6.15 or higher**
- **API version: 2015-04-01, 2015-07-01, 2016-03-01, 2016-09-01, 2017-03-01, 217-04-01**

## How to Install

```bash
npm install azure-arm-monitor
```

## How to Use

### Authentication

 ```javascript
 var msRestAzure = require('ms-rest-azure');
 var monitorManagementClient = require('azure-arm-monitor');
 
 // Interactive Login
 msRestAzure.interactiveLogin(function(err, credentials) {
   var client = new monitorManagementClient(credentials, 'your-subscription-id');
 });
 ```

### Create the monitorManagementClient

```javascript
 var msRestAzure = require("ms-rest-azure"),
 var monitorManagementClient = require("azure-arm-monitor");

 var client = new monitorManagementClient(credentials, 'your subscription id');
```

## Related projects

- [Microsoft Azure SDK for Node.js - All-up](https://github.com/WindowsAzure/azure-sdk-for-node)
