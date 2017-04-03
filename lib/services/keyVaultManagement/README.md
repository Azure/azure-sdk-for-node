# Microsoft Azure SDK for Node.js - Key Vault Management

This project provides a Node.js package for managing vaults on Azure Key Vault. Right now it supports:
- **Node.js version: 6.x.x or higher**
- **REST API version: 2015-06-01**

## Features

- Manage vaults: create, update, delete, list and get.

## How to Install

```bash
npm install azure-arm-keyvault
```

## Detailed Sample
A sample that can be cloned and run can be found [here](https://github.com/Azure-Samples/key-vault-node-getting-started).

## How to Use

The following example creates a new vault.

```javascript
const msRestAzure = require('ms-rest-azure');
const KeyVaultManagementClient = require('azure-arm-keyvault');

// Interactive Login
const client;
msRestAzure.interactiveLogin().then((credentials) => {
  client = new KeyVaultManagementClient(credentials, '<your-subscription-id>');
  return client.vaults.list();
}).then((vaults) => {
  console.dir(vaults, {depth: null, colors: true});
  return;
}).then(() => {
  let resourceGroup = '<resource group name>';
  let vaultName = 'myNewVault';
  let parameters = {
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
  return client.vaults.createOrUpdate(resourceGroup, vaultName, parameters);
}).then((vault) => {
  console.dir(vault, {depth: null, colors: true});
  return;
}).catch((err) => {
  console.log('An error occured');
  console.dir(err, {depth: null, colors: true});
  return;
});
```

## Related projects

- [Microsoft Azure SDK for Node.js](https://github.com/Azure/azure-sdk-for-node)
- [Microsoft Azure SDK for Node.js - Key Vault](https://github.com/Azure/azure-sdk-for-node/tree/master/lib/services/keyVault)
