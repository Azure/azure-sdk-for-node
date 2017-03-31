# Microsoft Azure SDK for Node.js - Key Vault

This project provides a Node.js package for accessing keys, secrets and certificates on Azure Key Vault. Right now it supports:
- **Node.js version: 6.x.x or higher**
- **REST API version: 2016-10-01**

## Features

- Manage keys: create, import, update, delete, backup, restore, list and get.
- Key operations: sign, verify, encrypt, decrypt, wrap, unwrap.
- Secret operations: set, get, update and list.
- Certificate operations: create, get, update, import, list, and manage contacts and issuers.

## How to Install

```bash
npm install azure-keyvault
```
## Detailed Sample
A sample that can be cloned and run can be found [here](https://github.com/Azure-Samples/key-vault-node-getting-started).

## How to Use

The following are some examples on how to create and consume secrets, certificates and keys.
For the complete sample please visit [this sample](https://github.com/Azure/azure-sdk-for-node/tree/master/lib/services/keyVault/sample.js).

### Authentication

```javascript

var KeyVault = require('azure-keyvault');
var AuthenticationContext = require('adal-node').AuthenticationContext;

var clientId = "<to-be-filled>";
var clientSecret = "<to-be-filled>";
var vaultUri = "<to-be-filled>";

// Authenticator - retrieves the access token
var authenticator = function (challenge, callback) {

  // Create a new authentication context.
  var context = new AuthenticationContext(challenge.authorization);
  
  // Use the context to acquire an authentication token.
  return context.acquireTokenWithClientCredentials(challenge.resource, clientId, clientSecret, function (err, tokenResponse) {
    if (err) throw err;
    // Calculate the value to be set in the request's Authorization header and resume the call.
    var authorizationValue = tokenResponse.tokenType + ' ' + tokenResponse.accessToken;

    return callback(null, authorizationValue);
  });

};
```

### Create the KeyVaultClient

```javascript

var credentials = new KeyVault.KeyVaultCredentials(authenticator);
var client = new KeyVault.KeyVaultClient(credentials);
```

### Create a key and use it

```javascript

client.createKey(vaultUri, 'mykey', 'RSA', options, function(err, keyBundle) {

  // Retrieve the key
  client.getKey(keyBundle.key.kid, function(getErr, getKeyBundle) {    
    console.log(getKeyBundle);

    // Encrypt a plain text
    client.encrypt(keyBundle.key.kid, 'RSA-OAEP', encryptionContent, function (encryptErr, cipherText) {		 
      console.log(cipherText);
    });

    // Sign a digest value
    client.sign(keyBundle.key.kid, 'RS256', digest, function (signErr, signature) {	 
      console.log(signature);
    });

  });
});
```


### Create a secret and list all secrets

```javascript

client.setSecret(vaultUri, 'mysecret', 'my password', options, function (err, secretBundle) {
  
  // List all secrets
  var parsedId = KeyVault.parseSecretIdentifier(secretBundle.id);
  client.getSecrets(parsedId.vault, parsedId.name, function (err, result) {
    if (err) throw err;
    
    var loop = function (nextLink) {
      if (nextLink !== null && nextLink !== undefined) {
        client.getSecretsNext(nextLink, function (err, res) {
          console.log(res);
          loop(res.nextLink);
        });
      }
    };
    
    console.log(result);
    loop(result.nextLink);
  });
});
```

### Create a certificate and delete it

```javascript

//Create a certificate
client.createCertificate(vaultUri, 'mycertificate', options, function (err, certificateOperation) {
  console.log(certificateOperation));

  // Poll the certificate status until it is created
  var interval = setInterval(function getCertStatus() {
        
    var parsedId = KeyVault.parseCertificateOperationIdentifier(certificateOperation.id);
    client.getCertificateOperation(parsedId.vault, parsedId.name, function (err, pendingCertificate) {
      
      if (pendingCertificate.status.toUpperCase() === 'completed'.toUpperCase()) {
        clearInterval(interval);        
        console.log(pendingCertificate);
        
        var parsedCertId = KeyVault.parseCertificateIdentifier(pendingCertificate.target);
        //Delete the created certificate
        client.deleteCertificate(parsedCertId.vault, parsedCertId.name, function (delErr, deleteResp) {          
          console.log(deleteResp);
        });
      }
    });
  }, intervalTime);
});

```

## Related projects

- [Microsoft Azure SDK for Node.js](https://github.com/azure/azure-sdk-for-node)
- [Microsoft Azure SDK for Node.js - Key Vault Management](https://github.com/Azure/azure-sdk-for-node/tree/master/lib/services/keyVaultManagement)
