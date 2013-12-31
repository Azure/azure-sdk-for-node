# Windows Azure SDK for Node.js - Compute Management

This project provides a Node.js package that makes it easy to manage Windows Azure Virtual Machines and Cloud Services. Right now it supports:
- **Node.js version: 0.6.15 or higher**
- **API version: 2013-11-01**

## Features

- Manage virtual machine
- Manage virtual machine OS and data disk
- Manage virtual machine image
- Manage deployment
- Manage cloud service
- Manage service certificate
- Get operating systems and operating system families

## How to Install

```bash
npm install azure-mgmt-compute
```

## How to Use

### Authentication

This library support management certificate authentication. To authenticate the library for the REST API calls, you need to
* Have a management certificate set up in your Windows Azure subscription. You can do this by
  * Either uploading a certificate in the [Windows Azure management portal](https://manage.windowsazure.com).
  * Or use the [Windows Azure Xplat-CLI](https://github.com/WindowsAzure/azure-sdk-tools-xplat).
* Obtain the .pem file of your certificate. If you used [Windows Azure Xplat-CLI](https://github.com/WindowsAzure/azure-sdk-tools-xplat) to set it up. You can run ``azure account cert export`` to get the .pem file.
* Open the .pem file in a text editor and **certvalue** and **keyvalue**.

### Create the ComputeManagementClient

```javascript
var computeManagement = require("azure-mgmt-compute");

// Create a client using management certificate authentication
var computeManagementClient = computeManagement.createComputeManagementClient({
  subscriptionId: "<your subscription id>",
  certvalue: "<your management certificate value>",
  keyvalue: "<your management certificate key value>"
});
``` 

### Manage Virtual Machine

```javascript
// Create a virtual Machine.
computeManagementClient.virtualMachines.create("service01", "deployment01", {
  roleName: "vm01"
}, function (err, result) {
  if (err) {
    console.error(err);
  } else {
    console.info(result.statusCode);
  }
});

// List all virtual machines under a subscription.
computeManagementClient.virtualMachines.list(function (err, result) {
  if (err) {
    console.error(err);
  } else {
    console.info("Name\t\tLocation");
    console.info("====\t\t========");
    // TODO
  }
});

// Get a virtual machine by name.
computeManagementClient.storageAccounts.get("service01", "deployment01", "vm01", function (err, result) {
  if (err) {
    console.error(err);
  } else {
    // TODO
  }
});

// Update a virtual machine.
computeManagementClient.virtualMachines.update("service01", "deployment01", "vm01", {
  roleSize: "large"
}, function (err, result) {
  if (err) {
    console.error(err);
  } else {
    console.info(result.statusCode);
  }
});

// Delete a virtual machine.
computeManagementClient.virtualMachines.delete("service01", "deployment01", "vm01", function (err, result) {
  if (err) {
    console.error(err);
  } else {
    console.info(result.statusCode);
  }
});
```

### Manage Cloud Service

```javascript
// Create a cloud service.
computeManagementClient.hostedServices.create({
  serviceName: "cloudservice01",
  label: "Cloud Service 01",
  location: "West US"
}, function (err, result) {
  if (err) {
    console.error(err);
  } else {
    // TODO
  }
});

// List all the cloud services under a subscription.
computeManagementClient.hostedServices.list(function (err, result) {
  if (err) {
    console.error(err);
  } else {
    // TODO
  }
});

// Get a cloud service by name.
computeManagementClient.hostedServices.get("cloudservice01", function (err, result) {
  if (err) {
    console.error(err);
  } else {
    // TODO
  }
});

// Update a cloud service.
computeManagementClient.hostedServices.update("cloudservice01", {
  description: "some description"
}, function (err, result) {
  if (err) {
    console.error(err);
  } else {
    // TODO
  }
});

// Delete a cloud service.
computeManagementClient.hostedServices.delete(function (err, result) {
    if (err) {
    console.error(err);
  } else {
    // TODO
  }
});
```

## Related projects

- [Windows Azure SDK for Node.js - All-up](https://github.com/WindowsAzure/azure-sdk-for-node)
- [Windows Azure SDK for Node.js - Network Management](https://github.com/andrerod/azure-sdk-for-node/tree/master/lib/services/networkManagement)
