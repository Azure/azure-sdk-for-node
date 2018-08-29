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
const util = require('util');
const should = require('should');

var series = KvUtils.series;
var assertExactly = KvUtils.assertExactly;
var compareObjects = KvUtils.compareObjects;
var validateSecretBundle = KvUtils.validateSecretBundle;
var validateSecretList = KvUtils.validateSecretList;
var random = KvUtils.getRandom();

var vaultUri = process.env['AZURE_KV_VAULT'];
if (!vaultUri) {
    vaultUri = 'https://sdktestvault74.vault.azure.net';
}

var SECRET_NAME = 'nodeSecret';
var SECRET_VALUE = 'Pa$$w0rd';
var LIST_TEST_SIZE = 2;

describe('Key Vault secrets', function () {

  var client;
  var suiteUtil;

  before(function (done) {
    var credentials = new msRestAzure.KeyVaultCredentials(KvUtils.authenticator);
    client = new KeyVault.KeyVaultClient(credentials);

    suiteUtil = new MockedTestUtils(client, 'keyVault-secret-tests');
    suiteUtil.setupSuite(done);
  });

  after(function (done) {
    cleanupCreatedSecrets(function () {
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

      function assertMatch(vault, name, version, secretId) {
        assertExactly(util.format('%s/secrets/%s', vault, name), secretId.baseIdentifier);
        if (version) {
          assertExactly(util.format('%s/secrets/%s/%s', vault, name, version), secretId.identifier);
        } else {
          assertExactly(secretId.baseIdentifier, secretId.identifier);
        }
        assertExactly(vault, secretId.vault);
        assertExactly(name, secretId.name);
        assertExactly(version, secretId.version);
      }

      function verifyCreate(vault, name, version) {
        var secretId, parsedId;
        if (version) {
          secretId = KeyVault.createSecretIdentifier(vault, name, version);
        } else {
          secretId = KeyVault.createSecretIdentifier(vault, name);
        }
        assertMatch(vault, name, version, secretId);
        if (version) {
          parsedId = KeyVault.parseSecretIdentifier(secretId.identifier);
          assertMatch(vault, name, version, parsedId);
        }
        parsedId = KeyVault.parseSecretIdentifier(secretId.baseIdentifier);
        assertMatch(vault, name, null, parsedId);
      }

      verifyCreate(vaultUri, SECRET_NAME, null);
      verifyCreate(vaultUri, SECRET_NAME, '1234');

      done();

    });
  });

  describe('CRUD operations', function () {
    it('should work', function (done) {

      this.timeout(10000);

      var createdBundle;
      var secretId;

      function createSecret(next) {
        client.setSecret(vaultUri, SECRET_NAME, SECRET_VALUE, function (err, secretBundle) {
          if (err) throw err;
          validateSecretBundle(secretBundle, vaultUri, SECRET_NAME, SECRET_VALUE);
          createdBundle = secretBundle;
          secretId = KeyVault.parseSecretIdentifier(createdBundle.id);
          next();
        });
      }

      function getSecretWOVersion(next) {
        client.getSecret(secretId.vault, secretId.name, '', function (err, secretBundle) {
          if (err) throw err;
          compareObjects(createdBundle, secretBundle);
          next();
        });
      }

      function getSecretWithVersion(next) {
        client.getSecret(secretId.vault, secretId.name, secretId.version, function (err, secretBundle) {
          if (err) throw err;
          compareObjects(createdBundle, secretBundle);
          next();
        });
      }

      function updateSecret(version, next) {
        var updatingBundle = KvUtils.clone(createdBundle);
        updatingBundle.contentType = 'text/plain';
        updatingBundle.attributes.expires = new Date('2050-02-02T08:00:00.000Z');
        updatingBundle.tags = { foo: random.hex(100) };
        var request = { contentType: updatingBundle.contentType, secretAttributes: updatingBundle.attributes, tags: updatingBundle.tags };
        client.updateSecret(secretId.vault, secretId.name, version, request, function (err, secretBundle) {
          if (err) throw err;
          delete updatingBundle.value;
          updatingBundle.attributes.updated = secretBundle.attributes.updated;
          compareObjects(updatingBundle, secretBundle);
          createdBundle = secretBundle;
          next();
        });
      }

      function updateSecretWOVersion(next) {
        return updateSecret('', next);
      }

      function updateSecretWithVersion(next) {
        return updateSecret(secretId.version, next);
      }

      function deleteSecret(next) {
        client.deleteSecret(secretId.vault, secretId.name, function (err, secretBundle) {
          if (err) throw err;
          compareObjects(createdBundle, secretBundle);
          next();
        });
      }

      function getSecretReturnsNotFound(next) {
        client.getSecret(secretId.vault, secretId.name, '', function (err, secretBundle) {
          if (!err || !err.code || err.code !== 'SecretNotFound' || !err.statusCode || err.statusCode !== 404) throw new Error('Unexpected error object: ' + JSON.stringify(err, null, ' '));
          next();
        });
      }

      series([
        createSecret,
        getSecretWOVersion,
        getSecretWithVersion,
        updateSecretWOVersion,
        updateSecretWithVersion,
        deleteSecret,
        getSecretReturnsNotFound,
        function () { done(); }
      ]);

    });
  });

  describe('disabled secret', function () {
    it('should work', function (done) {

      this.timeout(10000);

      var createdBundle;
      var secretId;

      function createDisabledSecret(next) {
        client.setSecret(vaultUri, SECRET_NAME, SECRET_VALUE, 
            { secretAttributes: { enabled: false }}, function (err, secretBundle) {
          if (err) throw err;
          createdBundle = secretBundle;
          secretId = KeyVault.parseSecretIdentifier(createdBundle.id);
          next();
        });
      }

      function getDisabledSecret(next) {
        client.getSecret(secretId.vault, secretId.name, secretId.version, function (err, secretBundle) {
          if (!err || !err.body.error.code || !err.body.error.innerError.code) throw new Error('Unexpected error object: ' + JSON.stringify(err, null, ' '));
          next();
        });
      }

      function deleteSecret(next) {
        client.deleteSecret(secretId.vault, secretId.name, function (err, secretBundle) {
          if (err) throw err;
          next();
        });
      }

      series([
        createDisabledSecret,
        getDisabledSecret,
        deleteSecret,
        function () { done(); }
      ]);

    });
  });

  describe('list', function () {
    it('should work', function (done) {

      this.timeout(100000);

      var maxSecrets = LIST_TEST_SIZE;
      var expected = {};
      var zeroCount = Object.keys(expected).length;

      function createManySecrets(next) {

        var secretCount = 0;
        var errorCount = 0;

        function createASecret() {
          client.setSecret(vaultUri, SECRET_NAME + (secretCount + 1), SECRET_VALUE, function (err, secretBundle) {
            if (err && err.code == 'Throttled') {
              ++errorCount;
              return setTimeout(createASecret, errorCount * 2500);
            }
            if (err) throw err;
            errorCount = 0;
            var secretId = KeyVault.parseSecretIdentifier(secretBundle.id).baseIdentifier;
            expected[secretId] = secretBundle.attributes;
            ++secretCount;
            if (secretCount < maxSecrets) {
              return createASecret();
            }
            next();
          });
        }

        createASecret();
      }

      function listSecrets(next) {
        var currentResult;
        client.getSecrets(vaultUri, { maxresults: LIST_TEST_SIZE }, function (err, result) {
          if (err) throw err;
          should(result.length).be.within(0, LIST_TEST_SIZE);
          validateSecretList(result, expected);
          currentResult = result;
          if (currentResult.nextLink) {
            return getNextSecrets(currentResult.nextLink);
          }
          next();

          function getNextSecrets(nextLink) {
            client.getSecretsNext(nextLink, function (err, list) {
              if (err) throw err;
              validateSecretList(list, expected);
              if (list.nextLink) {
                return getNextSecrets(list.nextLink);
              }
              if (Object.keys(expected).length !== zeroCount) {
                throw new Error('Not all secrets were returned: ' + JSON.stringify(Object.keys(expected), null, ' '));
              }
              next();
            });
          }

        });
      }

      series([
        createManySecrets,
        listSecrets,
        function () {
          done();
        }
      ]);

    });
  });

  describe('list versions', function () {
    it('should work', function (done) {

      this.timeout(10000);


      var maxSecrets = LIST_TEST_SIZE;
      var expected = {};
      var zeroCount = Object.keys(expected).length;

      function createManySecretVersions(next) {

        var secretCount = 0;
        var errorCount = 0;

        function createASecret() {
          client.setSecret(vaultUri, SECRET_NAME, SECRET_VALUE, function (err, secretBundle) {
            if (err && err.code == 'Throttled') {
              ++errorCount;
              return setTimeout(createASecret, errorCount * 2500);
            }
            if (err) throw err;
            errorCount = 0;
            expected[secretBundle.id] = secretBundle.attributes;
            ++secretCount;
            if (secretCount < maxSecrets) {
              return createASecret();
            }
            next();
          });
        }

        createASecret();
      }

      function listSecretVersions(next) {
        var currentResult;
        client.getSecretVersions(vaultUri, SECRET_NAME, function (err, result) {
          if (err) throw err;
          validateSecretList(result, expected);
          currentResult = result;
          if (currentResult.nextLink) {
            return getNextSecrets(currentResult.nextLink);
          }
          next();

          function getNextSecrets(nextList) {
            client.getSecretVersionsNext(nextList, function (err, list) {
              if (err) throw err;
              validateSecretList(list, expected);
              if (list.nextLink) {
                return getNextSecrets(list.nextLink);
              }
              if (Object.keys(expected).length !== zeroCount) {
                throw new Error('Not all secrets were returned: ' + JSON.stringify(Object.keys(expected), null, ' '));
              }
              next();
            });
          }

        });
      }

      series([
        createManySecretVersions,
        listSecretVersions,
        function () {
          done();
        }
      ]);

    });
  });

  function cleanupCreatedSecrets(callback) {

    if (!suiteUtil.isMocked) {
      client.getSecrets(vaultUri, function (err, list) {
        if (list && list.length !== 0) {
          list.forEach(function (secret) {
            var id = KeyVault.parseSecretIdentifier(secret.id);
            client.deleteSecret(id.vault, id.name, function (err, bundle) { });
          });
        }
        callback();
      });
    }
    else callback();
  }

});