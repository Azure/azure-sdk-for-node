# Microsoft Azure SDK for Node.js - Authorization

This project provides a Node.js package for accessing the Azure PAS. Right now it supports:
- **Node.js version: 0.6.15 or higher**
- **API version: **

## Features


## How to Install

```bash
npm install azure-arm-authorization
```

## How to Use

### Authentication

### Create the Authorization client

```javascript
var fs = require("fs"),
common = require("azure-common"),
authorizationManagement = require("azure-arm-authorization");

var authorizationManagementClient = authorizationManagement.createAuthorizationManagementClient(new common.TokenCloudCredentials({
  subscriptionId: "<your subscription id>",
  token: "<your token here>"
}));
```

## Related projects

- [Microsoft Azure SDK for Node.js](https://github.com/Azure/azure-sdk-for-node)
