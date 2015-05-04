# Microsoft Azure SDK for Node.js - Policy

This project provides a Node.js package for accessing the Azure PAS. Right now it supports:
- **Node.js version: 0.6.15 or higher**
- **API version: **

## Features


## How to Install

```bash
npm install azure-extra
```

## How to Use

### Authentication

### Create the Graph Rbac client

```javascript
var fs = require("fs"),
common = require("azure-common"),
graphRbacManagement = require("azure-extra");

var graphRbacManagementClient = graphRbacManagement.createGraphRbacManagementClient(new common.TokenCloudCredentials({
  tenantId: "<your tenant id>"
  subscriptionId: "<your subscription id>",
  token: "<your token here>"
}));
```

## Related projects

- [Microsoft Azure SDK for Node.js](https://github.com/Azure/azure-sdk-for-node)
