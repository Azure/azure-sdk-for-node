# Deprecation Warning

This package has been **deprecated**. Please use [azure-arm-monitor](https://www.npmjs.com/package/azure-arm-monitor) instead.

# Microsoft Azure SDK for Node.js - Web Site Management

This project provides a Node.js package that makes it easy to use the Azure Insights API. Right now it supports:
- **Node.js version: 0.6.15 or higher**
- **API version: 2015-04-01, 2015-07-01, 2016-03-01**

## How to Install

```bash
npm install azure-arm-insights
```

## How to Use

### Authentication

 ```javascript
 var msRestAzure = require('ms-rest-azure');
 var insightsManagementClient = require('azure-arm-insights');
 
 // Interactive Login
 msRestAzure.interactiveLogin(function(err, credentials) {
   var client = new insightsManagementClient(credentials, 'your-subscription-id');
 });
 ```

### Create the insightsManagementClient

```javascript
 var msRestAzure = require("ms-rest-azure"),
 var insightsManagementClient = require("azure-arm-insights");

 var client = new insightsManagementClient(credentials, 'your subscription id');
```

## Related projects

- [Microsoft Azure SDK for Node.js - All-up](https://github.com/WindowsAzure/azure-sdk-for-node)
