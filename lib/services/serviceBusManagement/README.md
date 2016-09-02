# Microsoft Azure SDK for Node.js - Service Bus Management

This project provides a Node.js package that makes it easy to manage Microsoft Azure Service Bus. Right now it supports:
- **API version: 2013-08-01**

## Features

- Manage namespace
- Manage queue
- Manage topic
- Manage relay
- Manage notification hub

## How to Install

```bash
npm install azure-asm-sb
```

## How to Use

### Authentication

This library support management certificate authentication. To authenticate the library for the REST API calls, you need to
* Have a management certificate set up in your Microsoft Azure subscription. You can do this by
  * Either uploading a certificate in the [Microsoft Azure management portal](https://manage.windowsazure.com).
  * Or use the [Microsoft Azure Xplat-CLI](https://github.com/Azure/azure-xplat-cli).
* Obtain the .pem file of your certificate. If you used [Microsoft Azure Xplat-CLI](https://github.com/Azure/azure-xplat-cli) to set it up. You can run ``azure account cert export`` to get the .pem file.

### Create the ServiceBusManagementClient

```javascript
var fs           = require('fs'),
    sbManagement = require('azure-asm-sb');

var sbManagementClient = sbManagement.createServiceBusManagementClient(sbManagement.createCertificateCloudCredentials({
  subscriptionId: '<your subscription id>',
  pem: fs.readFileSync('<your pem file>')
}));
```

### Manage Namespace

```javascript
var namespaceName = "namespace01";

// Create a namespace.
sbManagementClient.namespaces.create(namespaceName, "West US", function (err, result) {
  if (err) {
    console.error(err);
  } else {
    console.info(result);
  }
});
```

## Related projects

- [Microsoft Azure SDK for Node.js](https://github.com/WindowsAzure/azure-sdk-for-node)
- [Microsoft Azure SDK for Node.js - Service Bus](https://github.com/WindowsAzure/azure-sdk-for-node/tree/master/lib/services/serviceBus)