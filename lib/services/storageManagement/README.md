# Windows Azure SDK for Node.js - Storage Management

This project provides a Node.js package that makes it easy to manage Windows Azure Storage. Right now it supports:
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
* Have a management certificate set up in your Windows Azure subscription. You can do this by
  * Either uploading a certificate in the [Windows Azure management portal](https://manage.windowsazure.com).
  * Or use the [Windows Azure Xplat-CLI](https://github.com/WindowsAzure/azure-sdk-tools-xplat).
* Obtain the .pem file of your certificate. If you used [Windows Azure Xplat-CLI](https://github.com/WindowsAzure/azure-sdk-tools-xplat) to set it up. You can run ``azure account cert export`` to get the .pem file.
* Open the .pem file in a text editor and **certvalue** and **keyvalue**.

### Create the StorageManagementClient

```javascript
var storageManagement = require("azure-mgmt-storage");

var storageManagementClient = storageManagement.createStorageManagementClient({
  subscriptionId: "<your subscription id>",
  certvalue: "<your management certificate value>",
  keyvalue: "<your management certificate key value>"
});
```

### Manage Storage Account

```javascript
// Create a Storage account.
storageManagementClient.storageAccounts.create({
  serviceName: "storage01",
  location: "West US",
  label: "Storage 01"
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
storageManagementClient.storageAccounts.delete("storage01", function (err, result) {
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
  serviceName: "storage01",
  keyType: "Secondary"
}, function (err, result) {
  if (err) {
    console.error(err);
  } else {
    console.info("New secondary key:\t" + result.secondaryKey);
  }
});
```

## Related projects

- [Windows Azure SDK for Node.js - All-up](https://github.com/WindowsAzure/azure-sdk-for-node)
- [Windows Azure SDK for Node.js - Storage Blob](https://github.com/WindowsAzure/azure-sdk-for-node/tree/master/lib/services/blob)
- [Windows Azure SDK for Node.js - Storage Table](https://github.com/WindowsAzure/azure-sdk-for-node/tree/master/lib/services/table)
- [Windows Azure SDK for Node.js - Storage Queue](https://github.com/WindowsAzure/azure-sdk-for-node/tree/master/lib/services/queue)
