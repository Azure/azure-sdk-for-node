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
## Detailed Samples
A sample that can be cloned and run can be found [here](https://github.com/Azure-Samples/key-vault-node-authentication).

Others you might want to take a look at:
[Soft delete, recovery, backup and restore](https://github.com/Azure-Samples/key-vault-node-recovery)
[Managed storage accounts](https://github.com/Azure-Samples/key-vault-node-storage-accounts)
[Deploying certificates to a VM](https://github.com/Azure-Samples/key-vault-node-deploy-certificates-to-vm)
[Fetching keyvault secret from a web-application during runtime with MSI](https://github.com/Azure-Samples/app-service-msi-keyvault-node)

## How to Use

The following are some examples on how to create and consume secrets, certificates and keys.
For a complete sample, please check one of the above links. 

### Authentication and Client creation

```javascript
var KeyVault = require('azure-keyvault');
var msRestAzure = require('ms-rest-azure');

async function main(): Promise<void> {
  const credentials = await msRestAzure.interactiveLogin();
  // OR const credentials = await msRestAzure.loginWithServicePrincipalSecret("clientId", "secret", "domain");
  // OR any other login method from msRestAzure.
  const client = new KeyVault.KeyVaultClient(credentials);
}

main();
```

### Create a key and use it

```javascript

client.createKey(vaultUri, 'mykey', 'RSA', options).then( (keyBundle) => {
    // Encrypt some plain text
    return client.encrypt(keyBundle.key.kid, 'RSA-OAEP', "ciphertext");
});
```

### Create a certificate and delete it

```javascript

// Create a certificate
client.createCertificate(vaultUri, 'mycertificate', options).then( (certificateOperation) => {
  console.log(certificateOperation);
  var parsedId = KeyVault.parseCertificateOperationIdentifier(certificateOperation.id);
  
  // Poll the certificate status until it is created
  var interval = setInterval( () => {
    client.getCertificateOperation(parsedId.vault, parsedId.name).then( (pendingCertificate) => {
      if (pendingCertificate.status.toUpperCase() === 'completed'.toUpperCase()) {
        clearInterval(interval); // clear our polling function
        console.log(pendingCertificate);
        var parsedCertId = KeyVault.parseCertificateIdentifier(pendingCertificate.target);
        client.deleteCertificate(parsedCertId.vault, parsedCertId.name).then( (deleteResponse) => {
          console.log(deleteResponse);
        });
      }
    });
    
  });
});
```

## Related projects

- [Microsoft Azure SDK for Node.js](https://github.com/azure/azure-sdk-for-node)
- [Microsoft Azure SDK for Node.js - Key Vault Management](https://github.com/Azure/azure-sdk-for-node/tree/master/lib/services/keyVaultManagement)


![Impressions](https://azure-sdk-impressions.azurewebsites.net/api/impressions/azure-sdk-for-node%2Flib%2Fservices%2FkeyVault%2FREADME.png)
