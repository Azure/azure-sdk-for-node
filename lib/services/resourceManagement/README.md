# Microsoft Azure SDK for Node.js - Resource Management

This project provides a Node.js package that makes it easy to manage Azure resources. Right now it supports:
- **Node.js version: 0.6.15 or higher**
- **API version: 2013-08-01**

## Features

 - TODO

## How to Install

```bash
npm install azure-arm-resource
```

## How to Use

### Authentication

 - TODO: Describe tokens

### Create the ResourceManagementClient

```javascript
var fs                = require("fs"),
    common            = require("azure-common"),
    resourceManagement = require("azure-arm-resource");

var resourceManagementClient = resourceManagement.createResourceManagementClient(new common.TokenCloudCredentials({
  subscriptionId: "<your subscription id>",
  token: "<your token here>"
}));
```

## Related projects

- [Microsoft Azure SDK for Node.js - All-up](https://github.com/WindowsAzure/azure-sdk-for-node)
