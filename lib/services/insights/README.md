# Microsoft Azure SDK for Node.js - Web Site Management

This project provides a Node.js package that makes it easy to use the Azure Insights API. Right now it supports:
- **Node.js version: 0.6.15 or higher**
- **API version: 2014-04-01, 2015-04-01, 2016-03-01, 2016-09-01**

## How to Install

```bash
npm install azure-insights
```

## Deprecation Warning
This package has been deprecated. Please use [azure-monitor](https://www.npmjs.com/package/azure-monitor) instead.

## How to Use

### Authentication

 ```javascript
 var msRestAzure = require('ms-rest-azure');
 var insightsClient = require('azure-insights');
 
 // Interactive Login
 msRestAzure.interactiveLogin(function(err, credentials) {
   var client = new insightsClient(credentials, 'your-subscription-id');
 });
 ```

### Create the InsightsClient

```javascript
 var msRestAzure = require("ms-rest-azure"),
 var insightsClient = require("azure-insights");

 var client = new insightsClient(credentials, 'your subscription id');
```

## Related projects

- [Microsoft Azure SDK for Node.js - All-up](https://github.com/WindowsAzure/azure-sdk-for-node)
