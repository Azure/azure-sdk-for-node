# Windows Azure SDK for Node.js - Service Bus Management

This project provides a Node.js package that makes it easy to manage Windows Azure Service Bus. Right now it supports:
- **Node.js version: 0.6.15 or higher**
- **API version: 2013-08-01**

## Features

- Manage namespace
- Manage queue
- Manage topic
- Manage relay
- Manage notification hub

## How to Install

```bash
npm install azure-mgmt-sb
```

## How to Use

### Authentication

This library support management certificate authentication. To authenticate the library for the REST API calls, you need to
* Have a management certificate set up in your Windows Azure subscription. You can do this by
  * Either uploading a certificate in the [Windows Azure management portal](https://manage.windowsazure.com).
  * Or use the [Windows Azure Xplat-CLI](https://github.com/WindowsAzure/azure-sdk-tools-xplat).
* Obtain the .pem file of your certificate. If you used [Windows Azure Xplat-CLI](https://github.com/WindowsAzure/azure-sdk-tools-xplat) to set it up. You can run ``azure account cert export`` to get the .pem file.
* Open the .pem file in a text editor to get the **cert value** and **key value**.

### Create the ServiceBusManagementClient

```javascript
var common               = require("azure-common"),
    serviceBusManagement = require("azure-mgmt-sb");

var namespaceName = "database01";

var serviceBusManagementClient = serviceBusManagement.createServiceBusManagementClient(new common.CertificateCloudCredentials({
  subscriptionId: "<your subscription id>",
  cert: "<your management certificate value>",
  key: "<your management certificate key value>"
}));
```

### Manage Namespace

```javascript
serviceBusManagementClient.namespaces.create(namespaceName, "West US", function (err, result) {
  if (err) {
    console.error(err);
  } else {
    console.info(result);
  }
});
```

## Related projects

- [Windows Azure SDK for Node.js - All-up](https://github.com/WindowsAzure/azure-sdk-for-node)
- [Windows Azure SDK for Node.js - Service Bus](https://github.com/WindowsAzure/azure-sdk-for-node/tree/master/lib/services/serviceBus)