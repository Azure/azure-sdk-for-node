# Windows Azure SDK for Node.js - Core Management

This project provides a Node.js package that makes it easy to manage basic Windows Azure functionalities. Right now it supports:
- **Node.js version: 0.6.15 or higher**
- **API version: 2013-03-01**

## Features

- List locations and affinity groups
- Manage management certificate
- Manage subscription

## How to Install

```bash
npm install azure-mgmt
```

## How to Use

### Authentication

This library support management certificate authentication. To authenticate the library for the REST API calls, you need to
* Have a management certificate set up in your Windows Azure subscription. You can do this by
  * Either uploading a certificate in the [Windows Azure management portal](https://manage.windowsazure.com).
  * Or use the [Windows Azure Xplat-CLI](https://github.com/WindowsAzure/azure-sdk-tools-xplat).
* Obtain the .pem file of your certificate. If you used [Windows Azure Xplat-CLI](https://github.com/WindowsAzure/azure-sdk-tools-xplat) to set it up. You can run ``azure account cert export`` to get the .pem file.
* Open the .pem file in a text editor to get the **cert value** and **key value**.

### Create the ManagementClient

```javascript
var fs         = require('fs'),
    management = require('azure-mgmt');

var managementClient = management.createManagementClient(management.createCertificateCloudCredentials({
  subscriptionId: '<your subscription id>',
  pem: fs.readFileSync('<your pem file>')
}));
```

### List locations and affinity groups

```
// List all the available locations.
managementClient.locations.list(function (err, result) {
  if (err) {
    console.error(err);
  } else {
    console.info(result);
  }
});

// List all the affinity groups under a subscription.
managementClient.affinityGroups.list(function (err, result) {
  if (err) {
    console.error(err);
  } else {
    console.info(result);
  }
});
```


## Related projects

- [Windows Azure SDK for Node.js](https://github.com/WindowsAzure/azure-sdk-for-node)
