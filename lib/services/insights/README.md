# Microsoft Azure SDK for Node.js - Web Site Management

This project provides a Node.js package that makes it easy to use the Azure Insights API. Right now it supports:
- **Node.js version: 0.6.15 or higher**
- **API version: 2014-04-01**

## Features

 - TODO

## How to Install

```bash
npm install azure-arm-insights
```

## How to Use

### Authentication

 - TODO: Describe tokens

### Create the InsightsManagementClient

```javascript
var common               = require("azure-common"),
    insightsClientLib    = require("azure-arm-insights");

var insightsManagementClient = insightsClientLib.createInsightsManagementClient(new common.TokenCloudCredentials({
  subscriptionId: "<your subscription id>",
  token: "<your token here>"
}));

var insightsClient = insightsClientLib.createInsightsClient(new common.TokenCloudCredentials({
  subscriptionId: "<your subscription id>",
  token: "<your token here>"
}));
```

## Related projects

- [Microsoft Azure SDK for Node.js - All-up](https://github.com/WindowsAzure/azure-sdk-for-node)
