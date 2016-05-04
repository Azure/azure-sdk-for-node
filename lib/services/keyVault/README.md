# Microsoft Azure SDK for Node.js - Key Vault

This project provides a Node.js package for accessing keys and secrets on Azure Key Vault. Right now it supports:
- **Node.js version: 0.8.28 or higher**
- **REST API version: 2015-06-01**

## Features

- Manage keys: create, import, update, delete, backup, restore, list and get.
- Key operations: sign, verify, encrypt, decrypt, wrap, unwrap.
- Secret operations: set, get, update and list.

## How to Install

```bash
npm install azure-keyvault
```

## How to Use

The following example writes and reads a secret, creates a key and uses it for encrypt and decrypt some data.

```javascript
var async = require('async');
var adalNode = require('adal-node'); // Used for authentication
var azureKeyVault = require('azure-keyvault');

var clientId = '<your client id>';
var clientSecret = '<your client secret>';

var credentials = new azureKeyVault.KeyVaultCredentials(authenticator);
var client = new azureKeyVault.KeyVaultClient(credentials);

var vaultUri = 'https://<my vault>.vault.azure.net';
var secret = 'Chocolate is hidden in the toothpaste cabinet';
var secretId;
var kid;
var plainText = '1234567890';
var cipherText;

async.series([  

  function (next) {
    // Writes a secret
    var request = { value: secret };
    console.info('Writing secret...');
    client.setSecret(vaultUri, 'mySecret', request, function(err, result) {
      if (err) throw err;
      console.info('Secret written: ' + JSON.stringify(result, null, ' '));
      secretId = result.id;
      next();
    });
  },

  function (next) {
    // Reads a secret
    console.info('Reading secret...');
    client.getSecret(secretId, function(err, result) {
      if (err) throw err;
      console.info('Secret read: ' + JSON.stringify(result, null, ' '));
      next();
    });
  },

  function (next) {
    // Creates a key
    var request = { kty: "RSA", key_ops: ["encrypt", "decrypt"] };
    console.info('Creating key...');
    client.createKey(vaultUri, 'mykey', request, function(err, result) {
      if (err) throw err;
      console.info('Key created: ' + JSON.stringify(result));
      kid = result.key.kid;
      next();
    });
  },

  function (next) {
    // Encrypts some data with the key.
    console.info('Encrypting text...');
    client.encrypt(kid, 'RSA-OAEP', new Buffer(plainText), function(err, result) {
      if (err) throw err;
      console.info('Encryption result: ' + JSON.stringify(result));
      cipherText = result.value;
      next();
    });
  },
  
  function (next) {
    // Decrypts data with the key.
    console.info('Decrypting text...');
    client.decrypt(kid, 'RSA-OAEP', cipherText, function(err, result) {
      if (err) throw err;
      console.info('Decryption result: ' + JSON.stringify(result));
      var decrypted = result.value.toString();
      if (decrypted !== plainText) {
        throw new Error('Was expecting "' + plainText + '", not "' + decrypted + '".');
      }
      next();
    });
  },
  
  function (next) {
    console.info('Finished with success!');
    next();
  }

]);

function authenticator(challenge, callback) {
  // Create a new authentication context.
  var context = new adalNode.AuthenticationContext(challenge.authorization);
  // Use the context to acquire an authentication token.
  return context.acquireTokenWithClientCredentials(challenge.resource, clientId, clientSecret, function(err, tokenResponse) {
      if (err) throw err;
      // Calculate the value to be set in the request's Authorization header and resume the call.
      var authorizationValue = tokenResponse.tokenType + ' ' + tokenResponse.accessToken;
      return callback(null, authorizationValue);
  });
}
```

## Related projects

- [Microsoft Azure SDK for Node.js](https://github.com/azure/azure-sdk-for-node)
- [Microsoft Azure SDK for Node.js - Key Vault Management](https://github.com/Azure/azure-sdk-for-node/tree/master/lib/services/keyVault)
