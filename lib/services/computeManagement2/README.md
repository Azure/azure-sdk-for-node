# Microsoft Azure SDK for Node.js - Compute Management

This project provides a Node.js package that makes it easy to manage Microsoft Azure Compute Resources. Right now it supports:
- **Node.js version: 6.x.x or higher**

## How to Install

```bash
npm install azure-arm-compute
```

## How to use

### Authentication, client creation and listing vm images as an example

 ```javascript
 var msRestAzure = require('ms-rest-azure');
 var computeManagementClient = require('azure-arm-compute');

 // Interactive Login
 // It provides a url and code that needs to be copied and pasted in a browser and authenticated over there. If successful, 
 // the user will get a DeviceTokenCredentials object.
 msRestAzure.interactiveLogin(function(err, credentials) {
  var client = new computeManagementClient(credentials, 'your-subscription-id');
  client.virtualMachineImages.list('westus', 'MicrosoftWindowsServer', 'WindowsServer', '2012-R2-Datacenter', function(err, result, request, response) {
    if (err) console.log(err);
    console.log(result);
  });
 });
 ```

## Detailed Samples
- **VM Operations**: A detailed sample for creating, getting, listing, powering off, restarting, deleting a vm can be found [here](https://github.com/Azure-Samples/compute-node-manage-vm).
- **MSI (Managed Service Identity)**: A sample that shows how to create a VM with Managed Service Identity can be found [here](https://github.com/Azure-Samples/compute-node-msi-vm).
- **Using MSI to get tokens**: A sample showing how to use the SDK from a VM with MSI to get a token can be found [here](https://github.com/Azure-Samples/resources-node-manage-resources-with-msi).


## Related projects

- [Microsoft Azure SDK for Node.js](https://github.com/Azure/azure-sdk-for-node)
