# Microsoft Azure SDK for Node.js - ServerManagement

This project provides a Node.js package that makes it easy to manage Azure ServerManagement Resources. Right now it supports:
- **Node.js version: 5.0.0 or higher**
- **API version: 2015-07-01-preview**

## Features

 - TODO

## How to Install

```bash
npm install azure-arm-servermanagement
```

## How to Use

### Create an ServerManagement management client

```javascript
    var msRestAzure = require('ms-rest-azure');
    var ServerManagement = require('azure-arm-servermanagement');

    var credentials = new msRestAzure.UserTokenCredentials(clientId, username, password, subscriptionId);
    var client = new ServerManagement(credentials, subscriptionId);


    // do something
```

## Related projects

- [Microsoft Azure SDK for Node.js - All-up](https://github.com/WindowsAzure/azure-sdk-for-node)
