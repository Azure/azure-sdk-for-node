# Microsoft Azure SDK for Node.js - Key Vault Management

This project provides a Node.js package for managing vaults on Azure Key Vault. Right now it supports:
- **Node.js version: 0.6.15 or higher**
- **Resource Management REST API version: 2014-12-19-PREVIEW**

## Features

- Manage vaults: create, update, delete, list and get.

## How to Install

```bash
npm install azure-arm-keyvault
```

## How to Use

The following example creates a new vault.

```javascript
var AzureCommon       = require('azure-common');
var AzureMgmtKeyVault = require('azure-arm-keyvault');
var AdalNode          = require('adal-node'); // Used for authentication

var userName = 'someone@myorg.com';
var password = '123';
var clientId = '<client GUID>';
var resourceUri = 'https://management.core.windows.net/';

var context = new AdalNode.AuthenticationContext('https://login.windows.net/myorg.com');
context.acquireTokenWithUsernamePassword(resourceId, userName, password, clientId, function (err, response) {
  if (err) {
    throw new Error('Unable to authenticate: ' + err.stack);
  }

  var credentials = new AzureCommon.TokenCloudCredentials({
    subscriptionId : '<subscription GUID>',
    authorizationScheme : response.tokenType,
    token : response.accessToken
  });
  
  // Creates an Azure Key Vault Management client.
  client = new AzureMgmtKeyVault.KeyVaultManagementClient(credentials);
  
  var resourceGroup = 'myResourceGroup';
  var vaultName = 'myNewVault';
  var parameters = {
    location : "East US",
    properties : {
      sku : {
        family : 'A',
        name : 'standard'
      },
      accessPolicies : [],
      enabledForDeployment : false
    },
    tags : {}
  }; 
  
  console.info('Creating vault...');
  client.vaults.createOrUpdate(resourceGroup, vaultName, parameters, function (err, result) {
    if (err) throw err;
    console.info('Vault created: ' + JSON.stringify(result, null, ' '));
  });
  
});
```

## Related projects

- [Microsoft Azure SDK for Node.js](https://github.com/WindowsAzure/azure-sdk-for-node)
- [Microsoft Azure SDK for Node.js - Key Vault](https://github.com/WindowsAzure/azure-keyvault-for-node)
