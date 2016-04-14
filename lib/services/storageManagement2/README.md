# Microsoft Azure SDK for Node.js - Storage Management

This project provides a Node.js package that makes it easy to manage Microsoft Azure Storage Resources.Right now it supports:
- **Node.js version: 0.10.0 or higher**

## How to Install

```bash
npm install azure-arm-storage
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

### Create the StorageManagementClient

```javascript
var storageManagementClient = require('azure-arm-storage');
var client = new storageManagementClient(credentials, 'your-subscription-id');
```

## Create a storageAccount

```javascript
var createParameters = {
  location: 'West US',
  sku: {
    name: 'Standard_LRS'
  },
  kind: 'Storage'
  tags: {
    tag1: 'val1',
    tag2: 'val2'
  }
};
client.storageAccounts.create(groupName, accountName, createParameters, function (err, result, request, response) {
  if (err) {
    console.log(err);
  }
  console.log(result);
});
```

## Get properties of a storageAccount

```javascript
client.storageAccounts.getProperties(groupName, accountName, function (err, result, request, response) {
  if (err) {
    console.log(err);
  }
  console.log(result);
});
```

## List all the storage accounts in a specific resource group

```javascript
client.storageAccounts.listByResourceGroup(groupName, function (err, result, request, response) {
  if (err) {
    console.log(err);
  }
  console.log(result);
});
```

## List all the storage accounts in the current subscription

```javascript
client.storageAccounts.list(function (err, result, request, response) {
  if (err) {
    console.log(err);
  }
  console.log(result);
});
```

## Regenerate the storage account keys of a storage account

```javascript
client.storageAccounts.regenerateKey(groupName, accountName, 'key1', function (err, result, request, response) {
  if (err) {
    console.log(err);
  }
  console.log(result);
});
```

## Delete a storageAccount

```javascript
client.storageAccounts.deleteMethod(groupName, accountName, function (err, result, request, response) {
  if (err) {
    console.log(err);
  }
  console.log(result);
});
```

## Related projects

- [Microsoft Azure SDK for Node.js - All-up](https://github.com/WindowsAzure/azure-sdk-for-node)
