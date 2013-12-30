# Windows Azure SDK for Node.js - Storage Management

This project provides a Node.js package that makes it easy to manage Windows Azure Storage. Right now it supports:
- **Node.js version: 0.6.15 or higher**
- **Windows Azure Storage Management API version: 2013-03-01**

## Features

- Create, get, update and delete storage account.
- Get and regenerate access key.
- Check storage account name availability.

## How to Install

```bash
npm install azure-mgmt-storage
```

## How to Use

### Create the StorageManagementClient

```javascript
var storageManagement = require("azure-mgmt-storage");

var storageManagementClient = storageManagement.createcreateStorageManagementClient({
  subscriptionId : "<your subscription id>",
  certvalue : "<your management certificate value>",
  keyvalue : "<your management certificate key value>"
});
```

### Managing Storage Account

```javascript
// Create a Storage account.
storageManagementClient.storageAccounts.create({
  serviceName : "storage01",
  location : "West US",
  label : "Storage 01"
  geoReplicationEnabled : true
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
    console.info("Name\t\tLocation");
    console.info("====\t\t========");
    for (int i = 0; i < result.storageServices.length; i++) {
      var output = result.storageServices[i].serviceName + "\t\t" +
        result.storageServices[i].location;
      console.info(output);
    }
  }
});

// Get a Storage account by name.
storageManagementClient.storageAccounts.get("storage01", function (err, result) {
  if (err) {
    console.error(err);
  } else {
    console.info("Name:\t" + result.serviceName);
    console.info("URI:\t" + result.uri);
  }
});

// Update a Storage account.
storageManagementClient.storageAccounts.update("storage01", {
  geoReplicationEnabled : false,
  description : "This is a demo Storage account."
}, function (err, result) {
  if (err) {
    console.error(err);
  } else {
    console.info(result.statusCode);
  }
});

// Delete a Storage account.
storageManagementClient.storageAccounts.delete("storage01", function (err, result) {
  if (err) {
    console.error(err);
  } else {
    console.info(result.statusCode);
  }
});
```

### Managing Access Key

```javascript
// Get the primary key and secondary key of a Storage account.
storageManagementClient.storageAccounts.getKeys("storage01", function (err, result) {
  if (err) {
    console.error(err);
  } else {
    console.info("Primary key:\t" + result.primaryKey);
    console.info("Secondary key:\t" + result.secondaryKey);
  }
});

// Regenerate the secondary key of a Storage account.
storageManagementClient.storageAccounts.regenerateKeys({
  serviceName : "storage01",
  keyType : "Secondary"
}, function (err, result) {
  if (err) {
    console.error(err);
  } else {
    console.info("New secondary key:\t" + result.secondaryKey);
  }
});
```

## Related projects

- Windows Azure SDK for Node.js - All-up
  - GitHub repo: https://github.com/WindowsAzure/azure-sdk-for-node
  - NPM: https://npmjs.org/package/azure
- Windows Azure SDK for Node.js - Storage Blob
  - GitHub repo: https://github.com/WindowsAzure/azure-sdk-for-node/tree/master/lib/services/blob
  - NPM: https://npmjs.org/package/azure-storage-blob
- Windows Azure SDK for Node.js - Storage Table
  - GitHub repo: https://github.com/WindowsAzure/azure-sdk-for-node/tree/master/lib/services/table
  - NPM: https://npmjs.org/package/azure-storage-table
- Windows Azure SDK for Node.js - Storage Queue
  - GitHub repo: https://github.com/WindowsAzure/azure-sdk-for-node/tree/master/lib/services/queue
  - NPM: https://npmjs.org/package/azure-storage-queue
