var KeyVault = require('azure-keyvault');
var util = require('util');
var Crypto = require('crypto');
var AuthenticationContext = require('adal-node').AuthenticationContext;

var clientId = '<to-be-filled>';
var clientSecret = '<to-be-filled>';
var vaultUri = '<to-be-filled>';

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

var credentials = new KeyVault.KeyVaultCredentials(authenticator);
var client = new KeyVault.KeyVaultClient(credentials);

var attributes = { expires: new Date('2050-02-02T08:00:00.000Z'), notBefore: new Date('2016-01-01T08:00:00.000Z') };
var keyOperations = ['encrypt', 'decrypt', 'sign', 'verify', 'wrapKey', 'unwrapKey'];

//Create a key
client.createKey(vaultUri, 'mykey', 'RSA', { keyOps: keyOperations, keyAttributes: attributes }, function(err, keyBundle) {
  if (err) throw err;
  console.log('\n\nkey ', keyBundle.key.kid, ' is created.\n', util.inspect(keyBundle, { depth: null }));

  // Retrieve the key
  client.getKey(keyBundle.key.kid, function(getErr, getKeyBundle) {
    if (getErr) throw getErr;    
    console.log('\n\nkey ', getKeyBundle.key.kid, ' is retrieved.\n');
    
    // Encrypt a plain text
    var encryptionContent = new Buffer('This message is to be encrypted...');
    client.encrypt(keyBundle.key.kid, 'RSA-OAEP', encryptionContent, function (encryptErr, cipherText) {
      if (encryptErr) throw encryptErr;
      console.log('\n\nText is encrypted: ', cipherText.result);
      
      // Decrypt a cipher text
      client.decrypt(keyBundle.key.kid, 'RSA-OAEP', cipherText.result, function (decryptErr, plainText) {
        if (decryptErr) throw decryptErr;
        console.log('\n\nThe encrypted cipher text is decrypted to: ', plainText.result);
      });
    });

    // Sign a digest value
    var hash = Crypto.createHash('sha256');
    var digest = hash.update(new Buffer('sign me')).digest();
    client.sign(keyBundle.key.kid, 'RS256', digest, function (signErr, signature) {
      if (signErr) throw signErr;
      console.log('The signature for digest ', digest, ' is: ', signature.result);
      
      // Verify a signature
      client.verify(keyBundle.key.kid, 'RS256', digest, signature.result, function (verifyErr, verification) {
        if (verifyErr) throw verifyErr;
        console.log('The verification', verification.value === true? 'succeeded':'failed');
      });
    });

  });
  
  // Update the key with new tags
  client.updateKey(keyBundle.key.kid, {tags: {'tag1': 'this is tag1', 'tag2': 'this is tag2'}}, function (getErr, updatedKeyBundle) {
    if (getErr) throw getErr;
    console.log('\n\nkey ', updatedKeyBundle.key.kid, ' is updated.\n', util.inspect(updatedKeyBundle, { depth: null }));
  });
  
  // List all versions of the key
  var parsedId = KeyVault.parseKeyIdentifier(keyBundle.key.kid);
  client.getKeyVersions(parsedId.vault, parsedId.name, function (getVersionsErr, result) {
    if (getVersionsErr) throw getVersionsErr;
    
    var loop = function (nextLink) {
      if (nextLink !== null && nextLink !== undefined) {
        client.getKeyVersionsNext(nextLink, function (err, res) {
          console.log(res);
          loop(res.nextLink);
        });
      }
    };
    
    console.log(result);
    loop(result.nextLink);      
  });
});


//Create a secret
client.setSecret(vaultUri, 'mysecret', 'my password', { contentType: 'test secret', secretAttributes: attributes }, function (err, secretBundle) {
  if (err) throw err;
  console.log('\n\nSecret ', secretBundle.id, ' is created.\n', util.inspect(secretBundle, { depth: null }));
  
  // Retrieve the secret
  client.getSecret(secretBundle.id, function (getErr, getSecretBundle) {
    if (getErr) throw getErr;
    console.log('\n\nSecret ', getSecretBundle.id, ' is retrieved.\n');
  });
  
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

var certificatePolicy = {
  keyProperties : {
    exportable: true,
    reuseKey : false,
    keySize : 2048,
    keyType : 'RSA'
  },          
  secretProperties : {
    contentType : 'application/x-pkcs12'
  },
  issuerParameters : {
    name : 'Self'
  },
  x509CertificateProperties : {
    subject : 'CN=*.microsoft.com',
    subjectAlternativeNames : ['onedrive.microsoft.com', 'xbox.microsoft.com'],
    validityInMonths : 24
  }
};
var intervalTime = 5000;

//Create a certificate
client.createCertificate(vaultUri, 'mycertificate', { certificatePolicy: certificatePolicy }, function (err, certificateOperation) {
  if (err) throw err;  
  console.log('\n\nCertificate', certificateOperation.id, 'is being created.\n', util.inspect(certificateOperation, { depth: null }));

  // Poll the certificate status until it is created
  var interval = setInterval(function getCertStatus() {
        
    var parsedId = KeyVault.parseCertificateOperationIdentifier(certificateOperation.id);
    client.getCertificateOperation(parsedId.vault, parsedId.name, function (err, pendingCertificate) {
      if (err) throw err;
      
      if (pendingCertificate.status.toUpperCase() === 'completed'.toUpperCase()) {
        clearInterval(interval);        
        console.log('\n\nCertificate', pendingCertificate.target, 'is created.\n', util.inspect(pendingCertificate, { depth: null }));
        
        var parsedCertId = KeyVault.parseCertificateIdentifier(pendingCertificate.target);
        //Delete the created certificate
        client.deleteCertificate(parsedCertId.vault, parsedCertId.name, function (delErr, deleteResp) {          
          console.log('\n\nCertificate', pendingCertificate.target, 'is deleted.\n');
        });
      }      
      else if (pendingCertificate.status.toUpperCase() === 'InProgress'.toUpperCase()) {
        console.log('\n\nCertificate', certificateOperation.id, 'is being created.\n', util.inspect(pendingCertificate, { depth: null }));
      }
    });
  }, intervalTime);
});