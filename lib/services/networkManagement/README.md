# Windows Azure SDK for Node.js - Virtual Network Management

This project provides a Node.js package that makes it easy to manage Windows Azure Virtual Network. Right now it supports:
- **Node.js version: 0.6.15 or higher**
- **API version: 2013-11-01**

## Features

- Manage network
- Manage gateway
- Manage reserved IP
- Manage client root certificate

## How to Install

```bash
npm install azure-mgmt-vnet
```

## How to Use

### Authentication

This library support management certificate authentication. To authenticate the library for the REST API calls, you need to
* Have a management certificate set up in your Windows Azure subscription. You can do this by
  * Either uploading a certificate in the [Windows Azure management portal](https://manage.windowsazure.com).
  * Or use the [Windows Azure Xplat-CLI](https://github.com/WindowsAzure/azure-sdk-tools-xplat).
* Obtain the .pem file of your certificate. If you used [Windows Azure Xplat-CLI](https://github.com/WindowsAzure/azure-sdk-tools-xplat) to set it up. You can run ``azure account cert export`` to get the .pem file.

### Create the VirtualNetworkManagementClient

```javascript
var fs             = require('fs'),
    vnetManagement = require('azure-mgmt-vnet');

var vnetManagementClient = vnetManagement.createVirtualNetworkManagementClient(vnetManagement.createCertificateCloudCredentials({
  subscriptionId: '<your subscription id>',
  pem: fs.readFileSync('<your pem file>')
}));
```

### Manage Network

```javascript
var xml2js = require("xml2js");

var affinityGroupName = "affinitygroup01";
var vnetSiteName = "vnet01";
var subnetName = "subnet01";

// List all the virtual networks under a subscription.
vnetManagementClient.networks.list(function (err, result) {
  if (err) {
    console.error(err);
  } else {
    console.info(result);
  }
});

// Get the virtual network configuration xml.
vnetManagementClient.networks.getConfiguration(function (err, result) {
  if (err) {
    console.error(err);
  } else {
    // Create a new virtual network site.
    xml2js.parseString(result.configuration, function (err2, config) {
      var vnets = config.NetworkConfiguration.VirtualNetworkConfiguration[0].VirtualNetworkSites[0].VirtualNetworkSite;
      vnets.push({
        "$": {
          AffinityGroup: affinityGroupName,
          name: vnetSiteName
        },
        AddressSpace: [{
          AddressPrefix: ["10.0.0.0/8"]
        }],
        Subnets: [{
          Subnet: [{
            "$": {
              name: subnetName
            },
            AddressPrefix: ["10.0.0.0/8"]
          }]
        }]
      });

      vnetManagementClient.networks.setConfiguration({
        configuration: (new xml2js.Builder()).buildObject(config)
      }, function (err3, result3) {
        if (err3) {
          console.error(err3);
        } else {
          console.info(result3);
        }
      });
    });
  }
});
```

## Related projects

- [Windows Azure SDK for Node.js](https://github.com/WindowsAzure/azure-sdk-for-node)
- [Windows Azure SDK for Node.js - Compute Management](https://github.com/WindowsAzure/azure-sdk-for-node/tree/master/lib/services/computeManagement)
