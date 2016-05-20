# Microsoft Azure SDK for Node.js - DevTest Labs Management

This project provides a Node.js package that makes it easy to manage Microsoft Azure DevTest Labs. Right now it supports:
- **Node.js version: 0.13.0 or higher**

## How to Install

```bash
npm install azure-arm-devtestlabs
```
## How to Use

### Authentication

 ```javascript
 var msrestAzure = require('ms-rest-azure');
 //user authentication
 var credentials = new msRestAzure.UserTokenCredentials('your-client-id', 'your-domain', 'your-username', 'your-password', 'your-redirect-uri');
 //service principal authentication
 var credentials = new msRestAzure.ApplicationTokenCredentials('your-client-id', 'your-domain', 'your-secret');
 ```

### Create the DevTestLabsClient

```javascript
var DevTestLabsClient = require('azure-arm-devtestlabs');
var client = new DevTestLabsClient(credentials, 'your-subscription-id');
```

## Get properties of a lab

```javascript
client.labOperations.getResource(resourceGroupName, labName, null, function (err, result, request, response) {
  if (err) {
    console.log(err);
  }
  console.log(result);
});
```

## Related projects

- [Microsoft Azure SDK for Node.js - All-up](https://github.com/WindowsAzure/azure-sdk-for-node)
