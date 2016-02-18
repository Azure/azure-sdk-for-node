# Microsoft Azure SDK for Node.js - Compute Management

This project provides a Node.js package that makes it easy to manage Microsoft Azure Compute Resources. Right now it supports:
- **Node.js version: 0.10.0 or higher**

## How to Install

```bash
npm install azure-arm-compute
```

## How to use

### Authentication

 ```javascript
 var msrestAzure = require('ms-rest-azure');
 //user authentication
 var credentials = new msRestAzure.UserTokenCredentials('your-client-id', 'your-domain', 'your-username', 'your-password', 'your-redirect-uri');
 //service principal authentication
 var credentials = new msRestAzure.ApplicationTokenCredentials('your-client-id', 'your-domain', 'your-secret');
 ```

### Create the ComputeManagementClient

```javascript
var computeManagementClient = require('azure-arm-compute');
var client = new computeManagementClient(credentials, 'your-subscription-id');
```

## List VM Images

```javascript
client.virtualMachineImages.list('westus', 'MicrosoftWindowsServer', 'WindowsServer', '2012-R2-Datacenter', function (err, result, request, response) { 
    should.not.exist(err); 
    should.exist(result); 
    result.length.should.be.above(0); 
    response.statusCode.should.equal(200); 
    done(); 
  }); 
}); 
```

## Detailed Sample
A detailed sample for creating. getting, listing, powering off, restarting, deleting a vm can be found  [here](https://github.com/Azure/azure-sdk-for-node/blob/autorest/examples/compute/vm-sample.js).
