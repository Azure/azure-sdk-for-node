# Microsoft Azure SDK for Node.js - Key Vault

This project provides a Node.js package for accessing keys and secrets on Azure Key Vault. Right now it supports:
- **Node.js version: 0.6.15 or higher**
- **REST API version: 2015-02-01-preview**

## Features

- Manage keys: create, import, update, delete, backup, restore, list and get.
- Key operations: sign, verify, encrypt, decrypt, wrap, unwrap.
- Secret operations: set, get, update and list.

## How to Install

```bash
npm install azure-keyvault
```

## How to Use

The following example creates a key and uses it for encrypt and decrypt some data.

```javascript
var AzureCommon   = require('azure-common');
var AzureKeyVault = require('azure-keyvault');
var AdalNode      = require('adal-node'); // Used for authentication
var Hoek          = require('hoek'); // Used for base64url encoding

// Authentication
var tenant = 'myTenant';
var authorityUrl = 'https://login.windows.net/' + tenant;
var clientId = '<client GUID>';
var clientSecret = '<portal supplied client secret>';
var resource = 'https://vault.azure.net';

var context = new AdalNode.AuthenticationContext(authorityUrl);
context.acquireTokenWithClientCredentials(resource, clientId, clientSecret, function(err, tokenResponse) {
  if (err) {
    throw new Error('Unable to authenticate: ' + err.stack);
  }

  var credentials = new AzureCommon.TokenCloudCredentials({
    subscriptionId : subscriptionId,
    authorizationScheme : response.tokenType,
    token : response.accessToken
  });
  
  // Creates an Azure Key Vault client with the credentials.
  var vaultUri = 'https://myVault.vault.azure.net';
  var keyVault = new KeyVault.KeyVaultClient(credentials, vaultUri);
  
  // Creates a key
  var request = {
    kty: "RSA",
    key_ops: ["encrypt", "decrypt"],
    attributes: { enabled: true }
  };

  console.info('Creating key...');
  client.keys.create(vaultUri, 'mykey', request, function(err, result) {
    if (err) throw err;
    
    console.info('Key created: ' + JSON.stringify(result, null, ' '));
    var kid = result.key.kid;

    // Encrypts some data with the new key.
    var secret = 'Chocolate is hidden in the toothpaste cabinet';
    var request = {
      alg: "RSA_OAEP",
      value: Hoek.base64urlEncode(secret)
    };

    console.info('Encrypting text...');
    client.keys.encryptData(kid, request, function(err, result) {
      if (err) throw err;
      
      console.info('Encryption result: ' + JSON.stringify(result, null, ' '));
      var cipherText = result.value;
      
      // Decrypts data with the same key.
      var request = {
        alg: "RSA_OAEP",
        value: cipherText;
      };
      
      client.keys.decryptData(kid, request, function(err, result) {
        if (err) throw err;
        
        console.info('Data decrypted: ' + JSON.stringify(result, null, ' '));
        var plainText = Hoek.base64urlDecode(result.value);
        if (plainText == secret) {
           console.info("Secrets match.");
        } else {
          throw 'Was expecting "' + secret + '", not "'+ plainText +'".';
        }
      });
        
    });
    
  });

});
```

## Related projects

- [Microsoft Azure SDK for Node.js](https://github.com/WindowsAzure/azure-sdk-for-node)
- [Microsoft Azure SDK for Node.js - Key Vault Management](https://github.com/WindowsAzure/azure-mgmt-keyvault-for-node)
