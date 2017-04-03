# Microsoft Azure SDK for Node.js - ServerManagement

This project provides a Node.js package that makes it easy to manage Azure ServerManagement Resources. Right now it supports:
- **Node.js version: 6.0.0 or higher**

## Features

 - TODO

## How to Install

```bash
npm install azure-arm-servermanagement
```

## How to Use

### Authentication, client creation and listing nodes in a resource group as an example

 ```javascript
 var msRestAzure = require('ms-rest-azure');
 var ServerManagement = require('azure-arm-servermanagement');
 
 // Interactive Login
 msRestAzure.interactiveLogin(function(err, credentials) {
  var client = new ServerManagement(credentials, 'your-subscription-id');
  client.node.list(resourceGroupName, function(err, nodes, request, response) {
    if (err) console.log(err);
    nodes.map(function (node, index, array) {
      console.log('found node :' + node.name);
    }));
  });
 });
 ```

## Related projects

- [Microsoft Azure SDK for Node.js - All-up](https://github.com/WindowsAzure/azure-sdk-for-node)
