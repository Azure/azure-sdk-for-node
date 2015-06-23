# Microsoft Azure SDK for Node.js - Compute Management

This project provides a Node.js package that makes it easy to manage Microsoft Azure Virtual Machines and Cloud Services. Right now it supports:
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
npm install azure-asm-compute
```

## How to Use

### Authentication

This library support management certificate authentication. To authenticate the library for the REST API calls, you need to
* Have a management certificate set up in your Microsoft Azure subscription. You can do this by
  * Either uploading a certificate in the [Microsoft Azure management portal](https://manage.windowsazure.com).
  * Or use the [Microsoft Azure Xplat-CLI](https://github.com/Azure/azure-xplat-cli).
* Obtain the .pem file of your certificate. If you used [Microsoft Azure Xplat-CLI](https://github.com/Azure/azure-xplat-cli) to set it up. You can run ``azure account cert export`` to get the .pem file.

### Create the ComputeManagementClient

```javascript
var fs                = require('fs'),
    computeManagement = require('azure-asm-compute');

var computeManagementClient = computeManagement.createComputeManagementClient(computeManagement.createCertificateCloudCredentials({
  subscriptionId: '<your subscription id>',
  pem: fs.readFileSync('<your pem file>', 'utf-8')
}));
``` 

### Manage Virtual Machine

```javascript
var serviceName = "cloudservice01";
var deploymentName = "deployment01";
var virualMachineName = "vm01";
var storageAccountName = "storage01";
var diskContainerName = "vhds";

// List all the virtual machine images you can use.
computeManagementClient.virtualMachineVMImages.list(function (err, result) {
  if (err) {
    console.error(err);
  } else {
    console.info(result);
  }
});

// Create a cloud service.
computeManagementClient.hostedServices.create({
  serviceName: serviceName,
  label: "cloud service 01",
  location: "West US"
}, function (err, result) {
  if (err) {
    console.error(err);
  } else {
    console.info(result);

    // Create a virtual machine in the cloud service.
    computeManagementClient.virtualMachines.createDeployment(serviceName, {
      name: deploymentName,
      deploymentSlot: "Production",
      label: "deployment 01",
      roles: [{
        roleName: virualMachineName,
        roleType: "PersistentVMRole",
        label: "virutal machine 01",
        oSVirtualHardDisk: {
          sourceImageName: "a699494373c04fc0bc8f2bb1389d6106__Windows-Server-2012-R2-201312.01-en.us-127GB.vhd",
          mediaLink: "http://"+ storageAccountName + ".blob.core.windows.net/" + diskContainerName + "/" +
            serviceName + "-" + virualMachineName + "-" + Math.floor((Math.random()*100)+1) + ".vhd"
        },
        dataVirtualHardDisks: [],
        configurationSets: [{
          configurationSetType: "WindowsProvisioningConfiguration",
          adminUserName: "<your admin user name>",
          adminPassword: "<your admin password>",
          computerName: virualMachineName,
          enableAutomaticUpdates: true,
          resetPasswordOnFirstLogon: false,
          storedCertificateSettings: [],
          inputEndpoints: [],
          windowsRemoteManagement: {
            listeners: [{
              listenerType: "Https"
            }]
          }
        }, {
          configurationSetType: "NetworkConfiguration",
          subnetNames: [],
          storedCertificateSettings: [],
          inputEndpoints: [{
            localPort: 3389,
            protocol: "tcp",
            name: "RemoteDesktop"
          }, {
            localPort: 5986,
            protocol: "tcp",
            name: "WinRmHTTPS"
          }]
        }]
      }]
    }, function (err, result) {
      if (err) {
        console.error(err);
      } else {
        console.info(result);
      }
    });
  }
});
```

## Related projects

- [Microsoft Azure SDK for Node.js](https://github.com/WindowsAzure/azure-sdk-for-node)
- [Microsoft Azure SDK for Node.js - Network Management](https://github.com/andrerod/azure-sdk-for-node/tree/master/lib/services/networkManagement)
