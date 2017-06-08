# Microsoft Azure SDK for Node.js - Storage Management

This project provides a Node.js package that makes it easy to manage Microsoft Azure Storage Resources.Right now it supports:
- **Node.js version: 6.x.x or higher**

## How to Install

```bash
npm install azure-arm-storage
```
## A working sample
A sample that can be cloned and is ready to used can be found over [here](https://github.com/Azure-Samples/storage-node-resource-provider-getting-started).

## How to Use

### Authentication, client creation and listing storageAccounts as an example

 ```javascript
 var msRestAzure = require('ms-rest-azure');
 var storageManagementClient = require('azure-arm-storage');
 
 // Interactive Login
 msRestAzure.interactiveLogin(function(err, credentials) {
  var client = new storageManagementClient(credentials, 'your-subscription-id');
  client.storageAccounts.list(function(err, result) {
    if (err) console.log(err);
    console.log(result);
  });
 });
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
