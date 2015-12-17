//
// Copyright (c) Microsoft and contributors.  All rights reserved.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//   http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
//
// See the License for the specific language governing permissions and
// limitations under the License.
//

'use strict';

var Testutil = require('../../util/util');
var KeyVault = Testutil.libRequire('services/keyVault');
var MockedTestUtils = require('../../framework/mocked-test-utils');
var KvUtils = require('./kv-test-utils.js');
var Crypto = require('crypto');
var util = require('util');

var series = KvUtils.series;
var assertExactly = KvUtils.assertExactly;
var compareObjects = KvUtils.compareObjects;
var validateRsaKeyBundle = KvUtils.validateRsaKeyBundle;
var validateKeyList = KvUtils.validateKeyList;
var getTestKey = KvUtils.getTestKey;
var setRsaParameters = KvUtils.setRsaParameters;
var random = KvUtils.getRandom();

var vaultUri = process.env['AZURE_KV_VAULT'];
if (!vaultUri) {
    vaultUri = 'https://nodesdktest.vault.azure.net';
}

var standardVaultOnly = process.env['AZURE_KV_STANDARD_VAULT_ONLY'];
if (!standardVaultOnly || standardVaultOnly.toLowerCase() == 'false') {
    standardVaultOnly = false;
}

var KEY_NAME = 'nodeKey';
var LIST_TEST_SIZE = 5;

describe('Key Vault keys', function () {

  var client;
  var suiteUtil;

  before(function (done) {
    var credentials = new KeyVault.KeyVaultCredentials(KvUtils.authenticator);
    client = new KeyVault.KeyVaultClient(credentials);

    suiteUtil = new MockedTestUtils(client, 'keyVault-key-tests');
    suiteUtil.setupSuite(done);
  });

  after(function (done) {
    suiteUtil.teardownSuite(done);
  });

  beforeEach(function (done) {
    suiteUtil.setupTest(done);
  });

  afterEach(function (done) {
    suiteUtil.baseTeardownTest(done);
  });

  describe('identifier', function() {
    it('should work', function(done) {
      
      function assertMatch(vault, name, version, keyId) {
        assertExactly(util.format('%s/keys/%s', vault, name), keyId.baseIdentifier);
        if (version) {
          assertExactly(util.format('%s/keys/%s/%s', vault, name, version), keyId.identifier);
        } else {
          assertExactly(keyId.baseIdentifier, keyId.identifier);
        }
        assertExactly(vault, keyId.vault);
        assertExactly(name, keyId.name);
        assertExactly(version, keyId.version);
      }
      
      function verifyCreate(vault, name, version) {
        var keyId, parsedId;
        if (version) {
          keyId = KeyVault.createKeyIdentifier(vault, name, version);
        } else {
          keyId = KeyVault.createKeyIdentifier(vault, name);
        }
        assertMatch(vault, name, version, keyId);
        if (version) {
          parsedId = KeyVault.parseKeyIdentifier(keyId.identifier);
          assertMatch(vault, name, version, parsedId);
        }
        parsedId = KeyVault.parseKeyIdentifier(keyId.baseIdentifier);
        assertMatch(vault, name, null, parsedId);
      }

      verifyCreate(vaultUri, KEY_NAME, null);
      verifyCreate(vaultUri, KEY_NAME, '1234');
      
      done();
      
    });
  });
  
  describe('CRUD operations', function () {
    it('should work', function (done) {
      
      var createdBundle;
      var keyId;

      function createKey(next) {
        client.createKey(vaultUri, KEY_NAME, { kty: 'RSA' }, function(err, keyBundle) {
          if (err) throw err;
          validateRsaKeyBundle(keyBundle, vaultUri, KEY_NAME, 'RSA');
          createdBundle = keyBundle;
          keyId = KeyVault.parseKeyIdentifier(createdBundle.key.kid);
          next();
        });
      }
      
      function getKeyWOVersion(next) {
        client.getKey(keyId.baseIdentifier, function(err, keyBundle) {
          if (err) throw err;
          compareObjects(createdBundle, keyBundle);
          next();
        });
      }

      function getKeyWithVersion(next) {
        client.getKey(keyId.identifier, function(err, keyBundle) {
          if (err) throw err;
          compareObjects(createdBundle, keyBundle);
          next();
        });
      }

      function updateKey(keyUri, next) {
        var updatingBundle = KvUtils.clone(createdBundle);
        updatingBundle.attributes.exp = new Date('2050-02-02T08:00:00.000Z');
        updatingBundle.key.key_ops = ['encrypt', 'decrypt'];
        updatingBundle.tags = { foo: random.hex(100) };
        var request = { key_ops: updatingBundle.key.key_ops, attributes: updatingBundle.attributes, tags: updatingBundle.tags };
        client.updateKey(keyUri, request, function(err, keyBundle) {
          if (err) throw err;
          updatingBundle.attributes.updated = keyBundle.attributes.updated;
          compareObjects(updatingBundle, keyBundle);
          createdBundle = keyBundle;
          next();
        });
      }
      
      function updateKeyWOVersion(next) {
        return updateKey(keyId.baseIdentifier, next);
      }
      
      function updateKeyWithVersion(next) {
        return updateKey(keyId.identifier, next);
      }

      function deleteKey(next) {
        client.deleteKey(keyId.vault, keyId.name, function(err, keyBundle) {
          if (err) throw err;
          compareObjects(createdBundle, keyBundle);
          next();
        });
      }

      function getKeyReturnsNotFound(next) {
        client.getKey(keyId.baseIdentifier, function(err, keyBundle) {
          if (!err || !err.code || err.code !== 'KeyNotFound' || !err.statusCode || err.statusCode !== 404) {
            throw new Error('Unexpected error object: ' + JSON.stringify(err, null, ' '));
          }
          next();
        });
      }

      series([
        createKey,
        getKeyWOVersion,
        getKeyWithVersion,
        updateKeyWOVersion,
        updateKeyWithVersion,
        deleteKey,
        getKeyReturnsNotFound,
        function () {done();}
      ]);     
      
    });
  });
  
  describe('import', function() {
    it('should work', function(done) {
      
      function doImport(importToHardware, next) {
        var importKeyRequest = {
          key: {
            kty: 'RSA',
            key_ops: ['encrypt', 'decrypt', 'sign', 'verify', 'wrapKey', 'unwrapKey']
          },
          hsm: importToHardware
        };  
        setRsaParameters(importKeyRequest.key, getTestKey(suiteUtil));
        client.importKey(vaultUri, KEY_NAME, importKeyRequest, function(err, keyBundle) {
          if (err) throw err;
          validateRsaKeyBundle(keyBundle, vaultUri, KEY_NAME, importToHardware ? 'RSA-HSM' : 'RSA', importKeyRequest.key_ops);
          next();
        });
      };
      
      function importToSoftware(next) {
        doImport(false, next);        
      }
            
      function importToHardware(next) {
        if(!standardVaultOnly) {
          doImport(true, next);
        } else {
          doImport(false, next);
        }
      }

      series([
        importToSoftware,
        importToHardware,
        function() {done();}
      ]);     

    });
  });
 
  // TODO: Disabled because intermittently fails due to throtlling. We need to have a better back-off handling here.
  describe.skip('list', function() {
    it('should work', function(done) {

      var maxKeys = LIST_TEST_SIZE;
      var expected = {};
      var zeroCount = Object.keys(expected).length;

      function createManyKeys(next) {

        var keyCount = 0;
        var errorCount = 0;

        function createAKey() {
          client.createKey(vaultUri, KEY_NAME + (keyCount+1), { kty: 'RSA' }, function(err, keyBundle) {
            if (err && err.code == 'Throttled') {
              ++errorCount;
              return setTimeout(createAKey, errorCount * 2500);
            }
            if (err) throw err;
            errorCount = 0;
            var kid = KeyVault.parseKeyIdentifier(keyBundle.key.kid).baseIdentifier;
            expected[kid] = keyBundle.attributes;
            ++keyCount;
            if (keyCount < maxKeys) {
              return createAKey();
            }
            next();
          });
        }

        createAKey();
      }

      function listKeys(next) {
        var currentResult;
        client.getKeys(vaultUri, null, function(err, result) {
          if (err) throw err;
          //console.log('getKeys: ' + JSON.stringify(result, null, ' '));
          validateKeyList(result, expected);
          currentResult = result;
          if (currentResult.nextLink) {
            return getNextKeys();
          }
          next();
          
          function getNextKeys() {
            client.getKeysNext(currentResult.nextLink, function(err, result) {
              if (err) throw err;
              validateKeyList(result, expected);
              currentResult = result;
              if (currentResult.nextLink) {
                return getNextKeys();
              }
              if (Object.keys(expected).length !== zeroCount) {
                throw new Error('Not all keys were returned: ' + JSON.stringify(Object.keys(expected), null, ' '));
              }
              next();
            });
          }
          
        });
      }

      function deleteKeys(next) {

        var keyNum = 1;

        function deleteAKey() {
          client.deleteKey(vaultUri, KEY_NAME+keyNum, function(err, keyBundle) {
            if (err) {
              console.info('Unable to delete key: ' + JSON.stringify(err));
            }
            ++keyNum;
            if (keyNum <= maxKeys) {
              return deleteAKey();
            }
            next();
          });
        }

        deleteAKey();
      }

      series([
        createManyKeys,
        listKeys,
        deleteKeys,
        function() { 
          if (!suiteUtil.isMocked) {
            // Avoid being throttled in the next test.
            setTimeout(function() {done();}, 5000); 
          }
        }
      ]);

    });
  });

  // TODO: Disabled because intermittently fails due to throtlling. We need to have a better back-off handling here.
  describe.skip('list versions', function() {
    it('should work', function(done) {

      var maxKeys = LIST_TEST_SIZE;
      var expected = {};
      var zeroCount = Object.keys(expected).length;

      function createManyKeyVersions(next) {

        var keyCount = 0;
        var errorCount = 0;

        function createAKey() {
          client.createKey(vaultUri, KEY_NAME, { kty: 'RSA' }, function(err, keyBundle) {
            if (err && err.code == 'Throttled') {
              ++errorCount;
              return setTimeout(createAKey, errorCount * 2500);
            }
            if (err) throw err;
            errorCount = 0;
            expected[keyBundle.key.kid] = keyBundle.attributes;
            ++keyCount;
            if (keyCount < maxKeys) {
              return createAKey();
            }
            next();
          });
        }

        createAKey();
      }

      function listKeyVersions(next) {
        var currentResult;
        client.getKeyVersions(vaultUri, KEY_NAME, null, function(err, result) {
          if (err) throw err;
          validateKeyList(result, expected);
          currentResult = result;
          if (currentResult.nextLink) {
            return getNextKeys();
          }
          next();
          
          function getNextKeys() {
            client.getKeyVersionsNext(currentResult.nextLink, function(err, result) {
              if (err) throw err;
              validateKeyList(result, expected);
              currentResult = result;
              if (currentResult.nextLink) {
                return getNextKeys();
              }
              if (Object.keys(expected).length !== zeroCount) {
                throw new Error('Not all keys were returned: ' + JSON.stringify(Object.keys(expected), null, ' '));
              }
              next();
            });
          }
          
        });
      }

      function deleteKey(next) {
        client.deleteKey(vaultUri, KEY_NAME, function(err, keyBundle) {
          if (err) {
            console.info('Unable to delete key: ' + JSON.stringify(err));
          }
          next();
        });
      }

      series([
        createManyKeyVersions,
        listKeyVersions,
        deleteKey,
        function() { 
          if (!suiteUtil.isMocked) {
            // Avoid being throttled in the next test.
            setTimeout(function() {done();}, 5000); 
          }
        }
      ]);

    });
  });

  describe('backup and restore', function() {
    it('should work', function(done) {

      var keyName = KEY_NAME + 'forBkp';
      var createdBundle;
      var keyId;
      var keyBackup;

      function createKey(next) {
        client.createKey(vaultUri, keyName, { kty: 'RSA' }, function(err, keyBundle) {
          if (err) throw err;
          createdBundle = keyBundle;
          keyId = KeyVault.parseKeyIdentifier(createdBundle.key.kid);
          next();
        });
      }

      function backup(next) {
        client.backupKey(keyId.vault, keyId.name, function(err, result) {
          if (err) throw err;
          keyBackup = result.value;
          next();
        });
      }

      function deleteKey(next) {
        client.deleteKey(keyId.vault, keyId.name, function(err, keyBundle) {
          if (err) throw err;
          next();
        });
      }

      function restore(next) {
        client.restoreKey(vaultUri, keyBackup, function(err, keyBundle) {
          if (err) throw err;
          compareObjects(createdBundle, keyBundle);
          next();
        });
      }

      series([
        createKey,
        backup,
        deleteKey,
        restore,
        function() {done();}
      ]);

    });
  });

  describe('encrypt and decrypt', function() {
    it ('should work', function(done) {

      var keyId = KeyVault.createKeyIdentifier(vaultUri, KEY_NAME);
      var plainText = new Buffer(random.hex(200), 'hex');
      var cipherText;

      function importKey(next) {
        importTestKey(client, keyId, function(err, keyBundle) {
          if (err) throw err;
          keyId = KeyVault.parseKeyIdentifier(keyBundle.key.kid);
          next();
        })
      }

      function encryptWOVersion(next) {
        client.encrypt(keyId.baseIdentifier, 'RSA-OAEP', plainText, function(err, result) {
          if (err) throw err;
          cipherText = result.value;
          next();
        });
      }

      function decryptWOVersion(next) {
        client.decrypt(keyId.baseIdentifier, 'RSA-OAEP', cipherText, function(err, result) {
          if (err) throw err;
          compareObjects(plainText, result.value);
          next();
        });
      }

      function encryptWithVersion(next) {
        client.encrypt(keyId.identifier, 'RSA-OAEP', plainText, function(err, result) {
          if (err) throw err;
          cipherText = result.value;
          next();
        });
      }

      function decryptWithVersion(next) {
        client.decrypt(keyId.identifier, 'RSA-OAEP', cipherText, function(err, result) {
          if (err) throw err;
          compareObjects(plainText, result.value);
          next();
        });
      }

      series([
        importKey,
        encryptWOVersion,
        decryptWOVersion,
        encryptWithVersion,
        decryptWithVersion,
        function() {done();}
      ]);

    });
  });

  describe('wrap and unwrap', function() {
    it ('should work', function(done) {

      var keyId = KeyVault.createKeyIdentifier(vaultUri, KEY_NAME);
      var plainText = new Buffer(random.hex(200), 'hex');
      var cipherText;

      function importKey(next) {
        importTestKey(client, keyId, function(err, keyBundle) {
          if (err) throw err;
          keyId = KeyVault.parseKeyIdentifier(keyBundle.key.kid);
          next();
        })
      }

      function wrapWOVersion(next) {
        client.wrapKey(keyId.baseIdentifier, 'RSA-OAEP', plainText, function(err, result) {
          if (err) throw err;
          cipherText = result.value;
          next();
        });
      }

      function unwrapWOVersion(next) {
        client.unwrapKey(keyId.baseIdentifier, 'RSA-OAEP', cipherText, function(err, result) {
          if (err) throw err;
          compareObjects(plainText, result.value);
          next();
        });
      }

      function wrapWithVersion(next) {
        client.wrapKey(keyId.identifier, 'RSA-OAEP', plainText, function(err, result) {
          if (err) throw err;
          cipherText = result.value;
          next();
        });
      }

      function unwrapWithVersion(next) {
        client.unwrapKey(keyId.identifier, 'RSA-OAEP', cipherText, function(err, result) {
          if (err) throw err;
          compareObjects(plainText, result.value);
          next();
        });
      }

      series([
        importKey,
        wrapWOVersion,
        unwrapWOVersion,
        wrapWithVersion,
        unwrapWithVersion,
        function() {done();}
      ]);

    });
  });

  describe('sign and verify', function() {
    it ('should work', function(done) {

      var keyId = KeyVault.createKeyIdentifier(vaultUri, KEY_NAME);
      var plainText = new Buffer(random.hex(200), 'hex');
      var md = Crypto.createHash('sha256');
      md.update(plainText);
      var digest = md.digest();
      var signature;

      function importKey(next) {
        importTestKey(client, keyId, function(err, keyBundle) {
          if (err) throw err;
          keyId = KeyVault.parseKeyIdentifier(keyBundle.key.kid);
          next();
        })
      }

      function signWOVersion(next) {
        client.sign(keyId.baseIdentifier, 'RS256', digest, function(err, result) {
          if (err) throw err;
          signature = result.value;
          next();
        });
      }

      function verifyWOVersion(next) {
        client.verify(keyId.baseIdentifier, 'RS256', digest, signature, function(err, result) {
          if (err) throw err;
          if (!result.value) {
            throw new Error('Expected {value:true}, but found ' + JSON.stringify(result));
          }
          next();
        });
      }

      function signWithVersion(next) {
        client.sign(keyId.identifier, 'RS256', digest, function(err, result) {
          if (err) throw err;
          signature = result.value;
          next();
        });
      }

      function verifyWithVersion(next) {
        client.verify(keyId.identifier, 'RS256', digest, signature, function(err, result) {
          if (err) throw err;
          if (!result.value) {
            throw new Error('Expected {value:true}, but found ' + JSON.stringify(result));
          }
          next();
        });
      }

      series([
        importKey,
        signWOVersion,
        verifyWOVersion,
        function() {done();}
      ]);

    });
  });

  function importTestKey(client, keyId, callback) {
    var importKeyRequest = {
      key: {
        kty: 'RSA',
        key_ops: ['encrypt', 'decrypt', 'sign', 'verify', 'wrapKey', 'unwrapKey']
      }
    };
    setRsaParameters(importKeyRequest.key, getTestKey(suiteUtil));
    client.importKey(keyId.vault, keyId.name, importKeyRequest, callback);
  }
  
});
