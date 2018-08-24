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

const Testutil = require('../../util/util');
const KeyVault = Testutil.libRequire('services/keyVault');
const msRestAzure = require('../../../runtime/ms-rest-azure');
const MockedTestUtils = require('../../framework/mocked-test-utils');
const KvUtils = require('./kv-test-utils.js');
const Crypto = require('crypto');
const util = require('util');
const should = require('should');

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
    vaultUri = 'https://sdktestvault74.vault.azure.net';
}

var standardVaultOnly = process.env['AZURE_KV_STANDARD_VAULT_ONLY'];
if (!standardVaultOnly || standardVaultOnly.toLowerCase() == 'false') {
    standardVaultOnly = false;
}

var KEY_NAME = 'nodeKey';
var LIST_TEST_SIZE = 2;

describe('Key Vault keys', function () {

  var client;
  var suiteUtil;

  before(function (done) {
    var credentials = new msRestAzure.KeyVaultCredentials(KvUtils.authenticator);
    client = new KeyVault.KeyVaultClient(credentials);

    suiteUtil = new MockedTestUtils(client, 'keyVault-key-tests');
    suiteUtil.setupSuite(done);
  });

  after(function (done) {
    cleanupCreatedKeys(function () {
      suiteUtil.teardownSuite(done);
    });
  });

  beforeEach(function (done) {
    suiteUtil.setupTest(done);
  });

  afterEach(function (done) {
    suiteUtil.baseTeardownTest(done);
  });

  describe('identifier', function () {
    it('should work', function (done) {

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

      this.timeout(10000);

      var createdBundle;
      var keyId;

      function createKey(next) {
        client.createKey(vaultUri, KEY_NAME, 'RSA', function (err, keyBundle) {
          if (err) throw err;
          validateRsaKeyBundle(keyBundle, vaultUri, KEY_NAME, 'RSA');
          createdBundle = keyBundle;
          keyId = KeyVault.parseKeyIdentifier(createdBundle.key.kid);
          next();
        });
      }

      function getKeyWOVersion(next) {
        client.getKey(keyId.vault, keyId.name, '', function (err, keyBundle) {
          if (err) throw err;
          compareObjects(createdBundle, keyBundle);
          next();
        });
      }

      function getKeyWithVersion(next) {
        client.getKey(keyId.vault, keyId.name, keyId.version, function (err, keyBundle) {
          if (err) throw err;
          compareObjects(createdBundle, keyBundle);
          next();
        });
      }

      function updateKey(version, next) {
        var updatingBundle = KvUtils.clone(createdBundle);
        updatingBundle.attributes.expires = new Date('2050-02-02T08:00:00.000Z');
        updatingBundle.key.keyOps = ['encrypt', 'decrypt'];
        updatingBundle.tags = { foo: random.hex(100) };
        var request = { keyOps: updatingBundle.key.keyOps, keyAttributes: updatingBundle.attributes, tags: updatingBundle.tags };
        client.updateKey(keyId.vault, keyId.name, version, request, function (err, keyBundle) {
          if (err) throw err;
          updatingBundle.attributes.updated = keyBundle.attributes.updated;
          compareObjects(updatingBundle, keyBundle);
          createdBundle = keyBundle;
          next();
        });
      }

      function updateKeyWOVersion(next) {
        return updateKey('', next);
      }

      function updateKeyWithVersion(next) {
        return updateKey(keyId.version, next);
      }

      function deleteKey(next) {
        client.deleteKey(keyId.vault, keyId.name, function (err, keyBundle) {
          if (err) throw err;
          compareObjects(createdBundle, keyBundle);
          next();
        });
      }

      function getKeyReturnsNotFound(next) {
        client.getKey(keyId.vault, keyId.name, '', function (err, keyBundle) {
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
        function () { done(); }
      ]);

    });
  });


  describe('import', function () {
    it('should work', function (done) {

      this.timeout(10000);

      function doImport(importToHardware, next) {
        var key = {
          kty: 'RSA',
          keyOps: ['encrypt', 'decrypt', 'sign', 'verify', 'wrapKey', 'unwrapKey']
        };

        setRsaParameters(key, getTestKey(suiteUtil));
        client.importKey(vaultUri, KEY_NAME, key, { hsm: importToHardware }, function (err, keyBundle) {
          if (err) throw err;
          validateRsaKeyBundle(keyBundle, vaultUri, KEY_NAME, importToHardware ? 'RSA-HSM' : 'RSA', key.keyOps);
          next();
        });
      };

      function importToSoftware(next) {
        doImport(false, next);
      }

      function importToHardware(next) {
        if (!standardVaultOnly) {
          doImport(true, next);
        } else {
          doImport(false, next);
        }
      }

      series([
        importToSoftware,
        importToHardware,
        function () { done(); }
      ]);

    });
  });

  describe('list', function () {
    it('should work', function (done) {

      this.timeout(100000);

      var maxKeys = LIST_TEST_SIZE;
      var expected = {};
      var zeroCount = Object.keys(expected).length;

      function createManyKeys(next) {

        var keyCount = 0;
        var errorCount = 0;

        function createAKey() {
          client.createKey(vaultUri, KEY_NAME + (keyCount + 1), 'RSA', function (err, keyBundle) {
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
        client.getKeys(vaultUri, { maxresults: LIST_TEST_SIZE }, function (err, result) {
          if (err) throw err;
          should(result.length).be.within(0, LIST_TEST_SIZE);
          validateKeyList(result, expected);
          currentResult = result;
          if (currentResult.nextLink) {
            return getNextKeys(currentResult.nextLink);
          }
          next();

          function getNextKeys(nextLink) {
            client.getKeysNext(nextLink, function (err, list) {
              if (err) throw err;
              validateKeyList(list, expected);
              if (list.nextLink) {
                return getNextKeys(list.nextLink);
              }
              if (expected.length && expected.length !== 0) {
                throw new Error('Not all keys were returned: ' + JSON.stringify(expected, null, ' '));
              }
              next();
            });
          }

        });
      }

      series([
        createManyKeys,
        listKeys,
        function () {
          done();
        }
      ]);

    });
  });

  describe('list versions', function () {
    it('should work', function (done) {

      this.timeout(10000);

      var maxKeys = LIST_TEST_SIZE;
      var expected = {};
      var zeroCount = Object.keys(expected).length;

      function createManyKeyVersions(next) {

        var keyCount = 0;
        var errorCount = 0;

        function createAKey() {
          client.createKey(vaultUri, KEY_NAME, 'RSA', function (err, keyBundle) {
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
        client.getKeyVersions(vaultUri, KEY_NAME, function (err, result) {
          if (err) throw err;
          validateKeyList(result, expected);
          currentResult = result;
          if (currentResult.nextLink) {
            return getNextKeys(currentResult.nextLink);
          }
          next();

          function getNextKeys(nextLink) {
            client.getKeyVersionsNext(currentResult.nextLink, function (err, list) {
              if (err) throw err;
              validateKeyList(list, expected);
              if (list.nextLink) {
                return getNextKeys(list.nextLink);
              }
              if (expected.length && expected.length !== 0) {
                throw new Error('Not all key versions were returned: ' + JSON.stringify(expected, null, ' '));
              }
              next();
            });
          }

        });
      }

      series([
        createManyKeyVersions,
        listKeyVersions,
        function () {
          done();
        }
      ]);

    });
  });

  describe('backup and restore', function () {
    it('should work', function (done) {

      this.timeout(10000);

      var keyName = KEY_NAME + 'forBkp';
      var createdBundle;
      var keyId;
      var keyBackup;

      function createKey(next) {
        client.createKey(vaultUri, keyName, 'RSA', function (err, keyBundle) {
          if (err) throw err;
          createdBundle = keyBundle;
          keyId = KeyVault.parseKeyIdentifier(createdBundle.key.kid);
          next();
        });
      }

      function backup(next) {
        client.backupKey(keyId.vault, keyId.name, function (err, result) {
          if (err) throw err;
          keyBackup = result.value;
          next();
        });
      }

      function deleteKey(next) {
        client.deleteKey(keyId.vault, keyId.name, function (err, keyBundle) {
          if (err) throw err;
          next();
        });
      }

      function restore(next) {
        client.restoreKey(vaultUri, keyBackup, function (err, keyBundle) {
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
        function () { done(); }
      ]);

    });
  });

  describe('encrypt and decrypt', function () {
    it('should work', function (done) {

      this.timeout(10000);

      var keyId = KeyVault.createKeyIdentifier(vaultUri, KEY_NAME);
      var plainText = new Buffer(random.hex(200), 'hex');
      var cipherText;

      function importKey(next) {
        importTestKey(client, keyId, function (err, keyBundle) {
          if (err) throw err;
          keyId = KeyVault.parseKeyIdentifier(keyBundle.key.kid);
          next();
        })
      }

      function encryptWOVersion(next) {
        client.encrypt(keyId.vault, keyId.name, '', 'RSA-OAEP', plainText, function (err, result) {
          if (err) throw err;
          cipherText = result.result;
          next();
        });
      }

      function decryptWOVersion(next) {
        client.decrypt(keyId.vault, keyId.name, '', 'RSA-OAEP', cipherText, function (err, result) {
          if (err) throw err;
          compareObjects(plainText, result.result);
          next();
        });
      }

      function encryptWithVersion(next) {
        client.encrypt(keyId.vault, keyId.name, keyId.version, 'RSA-OAEP', plainText, function (err, result) {
          if (err) throw err;
          cipherText = result.result;
          next();
        });
      }

      function decryptWithVersion(next) {
        client.decrypt(keyId.vault, keyId.name, keyId.version, 'RSA-OAEP', cipherText, function (err, result) {
          if (err) throw err;
          compareObjects(plainText, result.result);
          next();
        });
      }

      series([
        importKey,
        encryptWOVersion,
        decryptWOVersion,
        encryptWithVersion,
        decryptWithVersion,
        function () { done(); }
      ]);

    });
  });

  describe('wrap and unwrap', function () {
    it('should work', function (done) {

      this.timeout(10000);

      var keyId = KeyVault.createKeyIdentifier(vaultUri, KEY_NAME);
      var plainText = new Buffer(random.hex(200), 'hex');
      var cipherText;

      function importKey(next) {
        importTestKey(client, keyId, function (err, keyBundle) {
          if (err) throw err;
          keyId = KeyVault.parseKeyIdentifier(keyBundle.key.kid);
          next();
        })
      }

      function wrapWOVersion(next) {
        client.wrapKey(keyId.vault, keyId.name, '', 'RSA-OAEP', plainText, function (err, result) {
          if (err) throw err;
          cipherText = result.result;
          next();
        });
      }

      function unwrapWOVersion(next) {
        client.unwrapKey(keyId.vault, keyId.name, '', 'RSA-OAEP', cipherText, function (err, result) {
          if (err) throw err;
          compareObjects(plainText, result.result);
          next();
        });
      }

      function wrapWithVersion(next) {
        client.wrapKey(keyId.vault, keyId.name, keyId.version, 'RSA-OAEP', plainText, function (err, result) {
          if (err) throw err;
          cipherText = result.result;
          next();
        });
      }

      function unwrapWithVersion(next) {
        client.unwrapKey(keyId.vault, keyId.name, keyId.version, 'RSA-OAEP', cipherText, function (err, result) {
          if (err) throw err;
          compareObjects(plainText, result.result);
          next();
        });
      }

      series([
        importKey,
        wrapWOVersion,
        unwrapWOVersion,
        wrapWithVersion,
        unwrapWithVersion,
        function () { done(); }
      ]);

    });
  });

  describe('sign and verify', function () {
    it('should work', function (done) {

      this.timeout(10000);

      var keyId = KeyVault.createKeyIdentifier(vaultUri, KEY_NAME);
      var plainText = new Buffer(random.hex(200), 'hex');
      var md = Crypto.createHash('sha256');
      md.update(plainText);
      var digest = md.digest();
      var signature;

      function importKey(next) {
        importTestKey(client, keyId, function (err, keyBundle) {
          if (err) throw err;
          keyId = KeyVault.parseKeyIdentifier(keyBundle.key.kid);
          next();
        });
      }

      function signWOVersion(next) {
        client.sign(keyId.vault, keyId.name, '', 'RS256', digest, function (err, result) {
          if (err) throw err;
          signature = result.result;
          next();
        });
      }

      function verifyWOVersion(next) {
        client.verify(keyId.vault, keyId.name, '', 'RS256', digest, signature, function (err, result) {
          if (err) throw err;
          if (!result.value) {
            throw new Error('Expected {value:true}, but found ' + JSON.stringify(result));
          }
          next();
        });
      }

      function signWithVersion(next) {
        client.sign(keyId.vault, keyId.name, keyId.version, 'RS256', digest, function (err, result) {
          if (err) throw err;
          signature = result.result;
          next();
        });
      }

      function verifyWithVersion(next) {
        client.verify(keyId.vault, keyId.name, keyId.version, 'RS256', digest, signature, function (err, result) {
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
        function () { done(); }
      ]);

    });
  });

  function importTestKey(client, keyId, callback) {
    var key = {
      kty: 'RSA',
      keyOps: ['encrypt', 'decrypt', 'sign', 'verify', 'wrapKey', 'unwrapKey']
    };
    setRsaParameters(key, getTestKey(suiteUtil));
    client.importKey(keyId.vault, keyId.name, key, callback);
  }

  function cleanupCreatedKeys(callback) {

    if (!suiteUtil.isMocked) {
      client.getKeys(vaultUri, function (err, list) {
        if (list && list.length !== 0) {
          list.forEach(function (key) {
            var id = KeyVault.parseKeyIdentifier(key.kid);
            client.deleteKey(id.vault, id.name, function (err, bundle) { });
          });
        }
        callback();;
      });
    }
    else callback();
  }
});