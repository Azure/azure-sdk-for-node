# Microsoft Azure SDK for Node.js - Network Management

This project provides a Node.js package that makes it easy to manage Microsoft Azure Network Resources.
- **Node.js version: 6.x.x or higher**
- **API version: 2017-10-01**

## Features

- Manage virtual network
- Manage subnet
- Manage network security group
- Manage network security rule
- Manage load balancer
- Manage network interface
- Manage publicIPAddress
- Manage application gateway
- Manage connections
- Manage express route
- Manage local network gateway
- Manage application security group
- Manage network watcher
- Manage route table
- Manage route
- Manage virtual network gateway



## How to Install

```bash
npm install azure-arm-network
```

## How to use

### Authentication, client creation and listing vnets in a resource group as an example

 ```javascript
 var msRestAzure = require('ms-rest-azure');
 var NetworkManagementClient = require('azure-arm-network');

 // Interactive Login
 // It provides a url and code that needs to be copied and pasted in a browser and authenticated over there. If successful, 
 // the user will get a DeviceTokenCredentials object.
 msRestAzure.interactiveLogin(function(err, credentials) {
  var client = new NetworkManagementClient(credentials, 'your-subscription-id');
  client.virtualNetworks.list(resourceGroupName, function(err, result, request, response) {
    if (err) console.log(err);
    console.log(result);
  });
 });
 ```

 ## Detailed Sample
A detailed sample for managing a load balancer than can be cloned and is ready to used can be found [here](https://github.com/Azure-Samples/network-node-manage-loadbalancer).

 ## Related projects

- [Microsoft Azure SDK for Node.js - All-up](https://github.com/WindowsAzure/azure-sdk-for-node)