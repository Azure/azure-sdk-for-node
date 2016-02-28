# Microsoft Azure SDK for Node.js - Graph Management

This project provides a Node.js package that makes it easy to manage MicrosoftGraph Resources. Right now it supports:
- **Node.js version: 0.10.0 or higher**

## How to Install

```bash
npm install azure-graph
```

## How to use

### Authentication

 ```javascript
 var msrestAzure = require('ms-rest-azure');
 //user authentication
 var credentials = new msRestAzure.UserTokenCredentials('your-client-id', 'your-domain', 'your-username', 'your-password', 'your-redirect-uri');
 //service principal authentication
 var credentials = new msRestAzure.ApplicationTokenCredentials('your-client-id', 'your-domain', 'your-secret');
 ```

### Create the Graph Rbac client

```javascript
var graphRbacManagementClient = require('azure-graph');
var graphClient = new graphRbacManagementClient(credentials, 'your-tenant-id');
```

- [Microsoft Azure SDK for Node.js](https://github.com/Azure/azure-sdk-for-node)