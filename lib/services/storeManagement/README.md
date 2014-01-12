# Windows Azure SDK for Node.js - Store Management

This project provides a Node.js package that makes it easy to manage Windows Azure Store. Right now it supports:
- **Node.js version: 0.6.15 or higher**
- **API version: 2013-06-01**

## Features

- Manage add-on

## How to Install

```bash
npm install azure-mgmt-store
```

## How to Use

### Authentication

This library support management certificate authentication. To authenticate the library for the REST API calls, you need to
* Have a management certificate set up in your Windows Azure subscription. You can do this by
  * Either uploading a certificate in the [Windows Azure management portal](https://manage.windowsazure.com).
  * Or use the [Windows Azure Xplat-CLI](https://github.com/WindowsAzure/azure-sdk-tools-xplat).
* Obtain the .pem file of your certificate. If you used [Windows Azure Xplat-CLI](https://github.com/WindowsAzure/azure-sdk-tools-xplat) to set it up. You can run ``azure account cert export`` to get the .pem file.
* Open the .pem file in a text editor and **certvalue** and **keyvalue**.

### Create the StoreManagementClient

```javascript
var storeManagement = require('azure-mgmt-store');

var storeManagementClient = storeManagement.createStoreManagementClient({
  subscriptionId: '<your subscription id>',
  certvalue: "<your management certificate value>",
  keyvalue: "<your management certificate key value>"
});
```

### Manage Add-On

## Related projects

- [Windows Azure SDK for Node.js - All-up](https://github.com/WindowsAzure/azure-sdk-for-node)
