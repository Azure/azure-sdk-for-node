# Microsoft Azure SDK for Node.js - Key Vault Management

This project provides a Node.js package for managing vaults on Azure Key Vault. Right now it supports:
- **Node.js version: 4.x.x or higher**
- **REST API version: 2015-06-01**

## Features

- Manage vaults: create, update, delete, list and get.

## How to Install

```bash
npm install azure-arm-keyvault
```

## How to Use

The following example creates a new vault.

```javascript
var msRestAzure = require('ms-rest-azure');
var keyVaultManagementClient = require('azure-arm-keyvault');

// Interactive Login
msRestAzure.interactiveLogin(function(err, credentials) {
  var client = new keyVaultManagementClient(credentials, '<your-subscription-id>');

  client.vaults.list(function(err, result) {
    if (err) console.log(err);
    console.log(result);
  });

  var resourceGroup = '<resource group name>';
  var vaultName = 'myNewVault';
  var parameters = {
    location : "East US",
    properties : {
      sku : {
        family : 'A',
        name : 'standard'
      },
      accessPolicies : [],
      enabledForDeployment : false,
      tenantId : '<tenant GUID>'
    },
    tags : {}
  };

  console.info('Creating vault...');
  client.vaults.createOrUpdate(resourceGroup, vaultName, parameters, function (err, result) {
    if (err) throw err;
    console.log(result);
  });
});
```

## Related projects

- [Microsoft Azure SDK for Node.js](https://github.com/Azure/azure-sdk-for-node)
- [Microsoft Azure SDK for Node.js - Key Vault](https://github.com/Azure/azure-sdk-for-node/tree/master/lib/services/keyVault)
