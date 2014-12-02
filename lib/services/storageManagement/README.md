# Microsoft Azure SDK for Node.js - Storage Management

This project provides a Node.js package that makes it easy to manage Microsoft Azure Storage. Right now it supports:
- **Node.js version: 0.6.15 or higher**
- **API version: 2013-03-01**

## Features

- Manage storage account
- Manage access key

## How to Install

```bash
npm install azure-mgmt-storage
```

## How to Use

### Authentication

This library support management certificate authentication. To authenticate the library for the REST API calls, you need to
* Have a management certificate set up in your Microsoft Azure subscription. You can do this by
  * Either uploading a certificate in the [Microsoft Azure management portal](https://manage.windowsazure.com).
  * Or use the [Microsoft Azure Xplat-CLI](https://github.com/Azure/azure-xplat-cli).
* Obtain the .pem file of your certificate. If you used [Microsoft Azure Xplat-CLI](https://github.com/Azure/azure-xplat-cli) to set it up. You can run ``azure account cert export`` to get the .pem file.

### Create the StorageManagementClient

```javascript
var fs                = require('fs'),
    storageManagement = require('azure-mgmt-storage');

var storageManagementClient = storageManagement.createStorageManagementClient(storageManagement.createCertificateCloudCredentials({
  subscriptionId: '<your subscription id>',
  pem: fs.readFileSync('<your pem file>')
}));
```

### Manage Storage Account

```javascript
var storageAccountName = "storage01";

// Create a Storage account.
storageManagementClient.storageAccounts.create({
  serviceName: storageAccountName,
  location: "West US",
  label: "Storage 01",
  geoReplicationEnabled: true
}, function (err, result) {
  if (err) {
    console.error(err);
  } else {
    console.info(result.statusCode);
  }
});

// List all Storage account under a subscription.
storageManagementClient.storageAccounts.list(function (err, result) {
  if (err) {
    console.error(err);
  } else {
    for (var i = 0; i < result.storageServices.length; i++) {
      var output = result.storageServices[i].serviceName + ", " +
        result.storageServices[i].properties.location;
      console.info(output);
    }
  }
});

// Get a Storage account by name.
storageManagementClient.storageAccounts.get(storageAccountName, function (err, result) {
  if (err) {
    console.error(err);
  } else {
    console.info("Name: " + result.serviceName);
    console.info("URI: " + result.uri);
  }
});

// Update a Storage account.
storageManagementClient.storageAccounts.update(storageAccountName, {
  geoReplicationEnabled: false,
  description: "This is a demo Storage account."
}, function (err, result) {
  if (err) {
    console.error(err);
  } else {
    console.info(result.statusCode);
  }
});

// Delete a Storage account.
storageManagementClient.storageAccounts.delete(storageAccountName, function (err, result) {
  if (err) {
    console.error(err);
  } else {
    console.info(result.statusCode);
  }
});
```

### Manage Access Key

```javascript
// Get the primary key and secondary key of a Storage account.
storageManagementClient.storageAccounts.getKeys(storageAccountName, function (err, result) {
  if (err) {
    console.error(err);
  } else {
    console.info("Primary key: " + result.primaryKey);
    console.info("Secondary key: " + result.secondaryKey);
  }
});

// Regenerate the secondary key of a Storage account.
storageManagementClient.storageAccounts.regenerateKeys({
  serviceName: storageAccountName,
  keyType: "Secondary"
}, function (err, result) {
  if (err) {
    console.error(err);
  } else {
    console.info("New secondary key: " + result.secondaryKey);
  }
});
```

## Related projects

- [Microsoft Azure SDK for Node.js](https://github.com/WindowsAzure/azure-sdk-for-node)
- [Microsoft Azure SDK for Node.js - Storage Blob](https://github.com/WindowsAzure/azure-sdk-for-node/tree/master/lib/services/blob)
- [Microsoft Azure SDK for Node.js - Storage Table](https://github.com/WindowsAzure/azure-sdk-for-node/tree/master/lib/services/table)
- [Microsoft Azure SDK for Node.js - Storage Queue](https://github.com/WindowsAzure/azure-sdk-for-node/tree/master/lib/services/queue)
