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
var validateCertificateOperation = KvUtils.validateCertificateOperation
var validateCertificateBundle = KvUtils.validateCertificateBundle;
var validateIssuerBundle = KvUtils.validateIssuerBundle;
var validateCertificateContacts = KvUtils.validateCertificateContacts;
var validateCertificateList = KvUtils.validateCertificateList;
var validateCertificateIssuerList = KvUtils.validateCertificateIssuerList;
var assertExactly = KvUtils.assertExactly;
var compareObjects = KvUtils.compareObjects;

var vaultUri = process.env['AZURE_KV_VAULT'];
if (!vaultUri) {
    vaultUri = 'https://sdktestvault74.vault.azure.net';
}

var CERTIFICATE_NAME = 'nodeCertificate';
var ISSUER_NAME = 'nodeIssuer';
var LIST_TEST_SIZE = 2;

describe('Key Vault certificates', function () {

  var client;
  var suiteUtil;

  before(function (done) {
    var credentials = new msRestAzure.KeyVaultCredentials(KvUtils.authenticator);
    client = new KeyVault.KeyVaultClient(credentials);

    suiteUtil = new MockedTestUtils(client, 'keyVault-certificate-tests');
    suiteUtil.setupSuite(done);
  });

  after(function (done) {
    cleanupCreatedCertificates(function () {
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

      function assertCertificateMatch(vault, name, version, Id) {

        assertExactly(util.format('%s/certificates/%s', vault, name), Id.baseIdentifier);
        if (version) {
          assertExactly(util.format('%s/certificates/%s/%s', vault, name, version), Id.identifier);
        } else {
          assertExactly(Id.baseIdentifier, Id.identifier);
        }
        assertExactly(vault, Id.vault);
        assertExactly(name, Id.name);
        assertExactly(version, Id.version);
      }

      function verifyCertificateCreate(vault, name, version) {
        var Id, parsedId;
        if (version) {
          Id = KeyVault.createCertificateIdentifier(vault, name, version);
        } else {
          Id = KeyVault.createCertificateIdentifier(vault, name);
        }
        assertCertificateMatch(vault, name, version, Id);
        if (version) {
          parsedId = KeyVault.parseCertificateIdentifier(Id.identifier);
          assertCertificateMatch(vault, name, version, parsedId);
        }
        parsedId = KeyVault.parseCertificateIdentifier(Id.baseIdentifier);
        assertCertificateMatch(vault, name, null, parsedId);
      }

      function assertCertificateOperationMatch(vault, name, Id) {
        assertExactly(util.format('%s/certificates/%s/pending', vault, name), Id.baseIdentifier);
        assertExactly(Id.baseIdentifier, Id.identifier);

        assertExactly(vault, Id.vault);
        assertExactly(name, Id.name);
        assertExactly(null, Id.version);
      }

      function verifyCertificateOperationCreate(vault, name) {
        var Id, parsedId;
        Id = KeyVault.createCertificateOperationIdentifier(vault, name);

        assertCertificateOperationMatch(vault, name, Id);
        parsedId = KeyVault.parseCertificateOperationIdentifier(Id.baseIdentifier);
        assertCertificateOperationMatch(vault, name, parsedId);
      }

      function assertIssuerMatch(vault, name, Id) {
        assertExactly(util.format('%s/certificates/issuers/%s', vault, name), Id.baseIdentifier);
        assertExactly(Id.baseIdentifier, Id.identifier);

        assertExactly(vault, Id.vault);
        assertExactly(name, Id.name);
        assertExactly(null, Id.version);
      }

      function verifyIssuerCreate(vault, name) {
        var Id, parsedId;
        Id = KeyVault.createIssuerIdentifier(vault, name);

        assertIssuerMatch(vault, name, Id);
        parsedId = KeyVault.parseIssuerIdentifier(Id.baseIdentifier);
        assertIssuerMatch(vault, name, parsedId);
      }

      verifyCertificateCreate(vaultUri, CERTIFICATE_NAME, null);
      verifyCertificateCreate(vaultUri, CERTIFICATE_NAME, '1234');

      verifyCertificateOperationCreate(vaultUri, CERTIFICATE_NAME);

      verifyIssuerCreate(vaultUri, CERTIFICATE_NAME);

      done();

    });
  });

  describe('CRUD certificate', function () {
    it('should work', function (done) {

      this.timeout(100000);

      //create delete update get

      var createdBundle;
      var certificateId;
      var certificatePolicy = {
        keyProperties: {
          exportable: true,
          reuseKey: false,
          keySize: 2048,
          keyType: 'RSA'
        },
        secretProperties: {
          contentType: 'application/x-pkcs12'
        },
        issuerParameters: {
          name: 'Self'
        },
        x509CertificateProperties: {
          subject: 'CN=*.microsoft.com',
          subjectAlternativeNames: ["onedrive.microsoft.com", "xbox.microsoft.com"],
          validityInMonths: 24
        }
      };

      function createCertificate(next) {
        var intervalTime = 5000;
        if (suiteUtil.isPlayback) {
          intervalTime = 0;
        }
        client.createCertificate(vaultUri, CERTIFICATE_NAME, { certificatePolicy: certificatePolicy }, function (err, certificateOperation) {
          if (err) throw err;
          var interval = setInterval(function getCertStatus() {
            client.getCertificateOperation(vaultUri, CERTIFICATE_NAME, function (err, pendingCertificate) {
              if (err) throw err;
              validateCertificateOperation(pendingCertificate, vaultUri, CERTIFICATE_NAME, certificatePolicy);

              if (pendingCertificate.status.toUpperCase() === 'completed'.toUpperCase()) {
                clearInterval(interval);
                validateCertificateOperation(pendingCertificate, vaultUri, CERTIFICATE_NAME, certificatePolicy);
                certificateId = KeyVault.parseCertificateIdentifier(pendingCertificate.target);
                next();
              }
              else if (pendingCertificate.status.toUpperCase() !== 'InProgress'.toUpperCase()) {
                throw new Error('UnKnown status code for pending certificate: ' + util.inspect(pendingCertificate, { depth: null }));
              }
            });
          }, intervalTime);
        });
      }

      function updateCertificate(next) {
        certificatePolicy.tags = { 'tag1': 'value1' };
        client.updateCertificate(certificateId.vault, certificateId.name, '', certificatePolicy, function (err, certificateBundle) {
          if (err) throw err;
          validateCertificateBundle(certificateBundle, vaultUri, CERTIFICATE_NAME, certificatePolicy);
          next();
        });
      }

      function getCertificate(next) {
        client.getCertificate(certificateId.vault, certificateId.name, '', function (err, certificateBundle) {
          if (err) throw err;

          validateCertificateBundle(certificateBundle, vaultUri, CERTIFICATE_NAME, certificatePolicy);
          certificateId = KeyVault.parseCertificateIdentifier(certificateBundle.id);

          //Get certificate as secret
          client.getSecret(certificateId.vault, certificateId.name, certificateId.version, function (err, secretBundle) {
            if (err) throw err;

            next();
          });
        });
      }

      function deleteCertificate(next) {
        client.deleteCertificate(vaultUri, CERTIFICATE_NAME, function (err, certificateBundle) {
          if (err) throw err;
          validateCertificateBundle(certificateBundle, vaultUri, CERTIFICATE_NAME, certificatePolicy);
          next();
        });
      }

      function getNoneExistingCertificate(next) {
        client.getCertificate(certificateId.vault, certificateId.name, '', function (err, certificateBundle) {
          if (!err || !err.code || err.code !== 'CertificateNotFound' || !err.statusCode || err.statusCode !== 404) {
            throw new Error('Unexpected error object: ' + JSON.stringify(err, null, ' '));
          }
          next();
        });
      }

      series([
        createCertificate,
        updateCertificate,
        getCertificate,
        deleteCertificate,
        getNoneExistingCertificate,
        function () { done(); }
      ]);

    });
  });


  describe('import', function () {
    it('should work', function (done) {

      this.timeout(10000);

      var CERTIFICATE_NAME = 'nodeImportCertificate';

      function importCertificate(next) {
        importCommonCertificate(CERTIFICATE_NAME, function (err, certificateBundle, certificatePolicy) {
          if (err) throw err;
          validateCertificateBundle(certificateBundle, vaultUri, CERTIFICATE_NAME, certificatePolicy);
          next();
        });
      }

      series([
        importCertificate,
        function () { done(); }
      ]);

    });
  });

  /*
  describe('list', function () {
    it('should work', function (done) {

      this.timeout(100000);
      var expected = {};

      function importSomeCertificates(next) {
        importCommonCertificate('importListCertificate1', function (err, certificateBundle) {
          if (err) throw err;
          expected[KeyVault.parseCertificateIdentifier(certificateBundle.id).baseIdentifier] = certificateBundle.attributes;

          importCommonCertificate('importListCertificate2', function (err, certificateBundle) {
            if (err) throw err;
            expected[KeyVault.parseCertificateIdentifier(certificateBundle.id).baseIdentifier] = certificateBundle.attributes;
            next();
          });
        });
      }

      function listCertificate(next) {
        client.getCertificates(vaultUri, { maxresults: LIST_TEST_SIZE }, function (err, certList) {
          if (err) throw err;
          should(certList.length).be.within(0, LIST_TEST_SIZE);
          validateCertificateList(certList, expected);
          if (certList.nextLink) {
            return getNextCertificates(certList.nextLink);
          }

          if (expected.length && expected.length !== 0) {
            throw new Error('Not all certificates were returned: ' + JSON.stringify(expected, null, ' '));
          }
          next();

          function getNextCertificates(nextLink) {
            client.getCertificatesNext(nextLink, function (err, list) {
              if (err) throw err;
              validateCertificateList(list, expected);
              if (list.nextLink) {
                return getNextCertificates(list.nextLink);
              }
              if (expected.length && expected.length !== 0) {
                throw new Error('Not all certificates were returned: ' + JSON.stringify(expected, null, ' '));
              }
              next();
            });
          }
        });
      }

      series([
        importSomeCertificates,
        listCertificate,
        function () {
          done();
        }
      ]);

    });
  });*/

  /*
  describe('list versions', function () {
    it('should work', function (done) {
      var CERTIFICATE_NAME = 'importListVersionCerts';
      this.timeout(100000);
      var expected = {};

      function importSameCertificates(next) {
        importCommonCertificate(CERTIFICATE_NAME, function (err, certificateBundle) {
          if (err) throw err;
          expected[certificateBundle.id] = certificateBundle.attributes;

          importCommonCertificate(CERTIFICATE_NAME, function (err, certificateBundle) {
            if (err) throw err;
            expected[certificateBundle.id] = certificateBundle.attributes;
            next();
          });
        });
      }

      function listCertificateVersions(next) {
        client.getCertificateVersions(vaultUri, CERTIFICATE_NAME, { maxresults: LIST_TEST_SIZE }, function (err, certVersionList) {
          if (err) throw err;
          should(certVersionList.length).be.within(0, LIST_TEST_SIZE);
          validateCertificateList(certVersionList, expected);
          if (certVersionList.nextLink) {
            return getNextCertificateVersions(certVersionList.nextLink);
          }

          if (expected.length && expected.length !== 0) {
            throw new Error('Not all certificates versions were returned: ' + JSON.stringify(expected, null, ' '));
          }
          next();

          function getNextCertificateVersions(nextLink) {
            client.getCertificateVersionsNext(nextLink, function (err, list) {
              if (err) throw err;
              validateCertificateList(list, expected);
              if (list.nextLink) {
                return getNextCertificateVersions(list.nextLink);
              }
              if (expected.length && expected.length !== 0) {
                throw new Error('Not all certificates versions were returned: ' + JSON.stringify(expected, null, ' '));
              }
              next();
            });
          }
        });
      }

      series([
        importSameCertificates,
        listCertificateVersions,
        function () {
          done();
        }
      ]);
    });
  });*/

  describe('CRUD issuer', function () {
    it('should work', function (done) {

      this.timeout(100000);
      setTimeout(done, 100000);

      var ISSUER_NAME = 'nodeIssuer';

      var issuerBundle = {
        provider: 'test',
        credentials: {
          accountId: 'keyvaultuser',
          password: 'password'
        },
        organizationDetails: {
          adminDetails: [{
            firstName: 'Jane',
            lastName: 'Doe',
            emailAddress: 'admin@contoso.com',
            phone: '4256666666'
          }]
        }
      };

      function createCertificateIssuer(next) {
        client.setCertificateIssuer(vaultUri, ISSUER_NAME, 'test', issuerBundle, function (err, responseIssuerBundle) {
          if (err) throw err;
          validateIssuerBundle(responseIssuerBundle, vaultUri, ISSUER_NAME, issuerBundle);
          next();
        });
      }

      function getCertificateIssuer(next) {
        client.getCertificateIssuer(vaultUri, ISSUER_NAME, function (err, responseIssuerBundle) {
          if (err) throw err;
          validateIssuerBundle(responseIssuerBundle, vaultUri, ISSUER_NAME, issuerBundle);
          next();
        });
      }

      function updateCertificateIssuer(next) {
        var updateIssuer = {
          provider: 'test',
          credentials: {
            accountId: 'xboxuser',
            password: 'security'
          },
          organizationDetails: {
            adminDetails: [{
              firstName: 'Jane II',
              lastName: 'Doe',
              emailAddress: 'admin@contoso2.com',
              phone: '1111111111'
            }]
          }
        };
        client.updateCertificateIssuer(vaultUri, ISSUER_NAME, updateIssuer, function (err, responseIssuerBundle) {
          if (err) throw err;
          validateIssuerBundle(responseIssuerBundle, vaultUri, ISSUER_NAME, updateIssuer);
          next();
        });
      }

      function deleteCertificateIssuer(next) {
        client.deleteCertificateIssuer(vaultUri, ISSUER_NAME, function (err, responseIssuerBundle) {
          if (err) throw err;
          next();
        });
      }

      function getNoneExistingIssuer(next) {
        client.getCertificateIssuer(vaultUri, ISSUER_NAME, function (err, responseIssuerBundle) {
          if (!err || !err.code || err.code !== 'CertificateIssuerNotFound' || !err.statusCode || err.statusCode !== 404) {
            throw new Error('Unexpected error object: ' + JSON.stringify(err, null, ' '));
          }
          next();
        });
      }

      series([
        createCertificateIssuer,
        getCertificateIssuer,
        updateCertificateIssuer,
        deleteCertificateIssuer,
        getNoneExistingIssuer,
        function () { done(); }
      ]);

    });
  });

  describe('list issuers', function () {
    it('should work', function (done) {

      this.timeout(10000);

      var expected = {};

      function setCertificateIssuers(next) {

        var issuerBundle = {
          provider: 'test',
          credentials: {
            accountId: 'keyvaultuser',
            password: 'password'
          },
          organizationDetails: {
            adminDetails: [{
              firstName: 'Jane',
              lastName: 'Doe',
              emailAddress: 'admin@contoso.com',
              phone: '4256666666'
            }]
          }
        };

        client.setCertificateIssuer(vaultUri, 'nodeIssuer1', 'test', issuerBundle, function (err, setIssuerBundle) {
          if (err) throw err;
          expected[setIssuerBundle.id] = setIssuerBundle.provider;

          client.setCertificateIssuer(vaultUri, 'nodeIssuer2', 'test', issuerBundle, function (err, setIssuerBundle) {
            if (err) throw err;
            expected[setIssuerBundle.id] = setIssuerBundle.provider;
            next();
          });
        });
      }

      function listCertificateIssuers(next) {

        client.getCertificateIssuers(vaultUri, { maxresults: LIST_TEST_SIZE }, function (err, issuerList1) {
          if (err) throw err;
          validateCertificateIssuerList(issuerList1, expected);
          should(issuerList1.length).be.within(0, LIST_TEST_SIZE);

          if (issuerList1.nextLink) {
            return getNextIssuers(issuerList1.nextLink);
          }

          if (expected.length && expected.length !== 0) {
            throw new Error('Not all issuers were returned: ' + JSON.stringify(expected, null, ' '));
          }
          next();

          function getNextIssuers(nextList) {
            client.getCertificateIssuersNext(nextList, function (err, issuerList) {
              if (err) throw err;
              validateCertificateIssuerList(issuerList, expected);
              if (issuerList.nextLink) {
                return getNextIssuers(issuerList.nextLink);
              }
              if (expected.length && expected.length !== 0) {
                throw new Error('Not all issuers were returned: ' + JSON.stringify(expected, null, ' '));
              }
              next();
            });
          }
        });
      }

      series([
        setCertificateIssuers,
        listCertificateIssuers,
        function () { done(); }
      ]);

    });
  });

  describe('async request cancellation and deletion', function () {
    it('should work', function (done) {

      this.timeout(10000);

      var certificateName = "asyncCancelledDeletedCert";
      var certificatePolicy = {
        keyProperties: {
          exportable: true,
          reuseKey: false,
          keySize: 2048,
          keyType: 'RSA'
        },
        secretProperties: {
          contentType: 'application/x-pkcs12'
        },
        issuerParameters: {
          name: 'Self'
        },
        x509CertificateProperties: {
          subject: 'CN=*.microsoft.com',
          subjectAlternativeNames: ["onedrive.microsoft.com", "xbox.microsoft.com"]
        },
        ValidityInMonths: 24,
      };

      function createCertificate(next) {

        client.createCertificate(vaultUri, certificateName, { certificatePolicy: certificatePolicy }, function (err, certificateOperation) {
          if (err) throw err;
          next();
        });
      }

      function cancelCertificateOperation(next) {

        client.updateCertificateOperation(vaultUri, certificateName, true, function (err, cancelledCertificateOperation) {
          if (err) throw err;
          should.exist(cancelledCertificateOperation.cancellationRequested);
          should(cancelledCertificateOperation.cancellationRequested).be.exactly(true);
          validateCertificateOperation(cancelledCertificateOperation, vaultUri, certificateName, certificatePolicy);

          client.getCertificateOperation(vaultUri, certificateName, function (err, retrievedCertificateOperation) {
            if (err) throw err;

            should.exist(cancelledCertificateOperation.cancellationRequested);
            should(cancelledCertificateOperation.cancellationRequested).be.exactly(true);
            validateCertificateOperation(retrievedCertificateOperation, vaultUri, certificateName, certificatePolicy);
            next();
          });
        });
      }

      function deleteCertificateOperation(next) {

        client.deleteCertificateOperation(vaultUri, certificateName, function (err, deletedCertificateOperation) {
          if (err) throw err;
          should.exist(deletedCertificateOperation);
          validateCertificateOperation(deletedCertificateOperation, vaultUri, certificateName, certificatePolicy);

          client.getCertificateOperation(vaultUri, certificateName, function (err, retrievedCertificateOperation) {
            if (!err || !err.code || err.code !== 'PendingCertificateNotFound' || !err.statusCode || err.statusCode !== 404) {
              throw new Error('Unexpected error object: ' + JSON.stringify(err, null, ' '));
            }
            next();
          });
        });
      }

      function deleteCancelledCertificateOperation(next) {
        client.deleteCertificate(vaultUri, certificateName, function (err, certificateBundle) {
          if (err) throw err;
          next();
        });
      }

      series([
        createCertificate,
        cancelCertificateOperation,
        deleteCertificateOperation,
        deleteCancelledCertificateOperation,
        function () { done(); }
      ]);

    });
  });

  describe('CRUD contacts', function () {
    it('should work', function (done) {

      var contacts = {
        contactList: [{
          emailAddress: 'admin@contoso.com',
          name: 'John Doe',
          phone: '1111111111'
        }, {
            emailAddress: 'admin2@contoso.com',
            name: 'John Doe2',
            phone: '2222222222'
          }]
      };

      function createCertificateContacts(next) {
        client.setCertificateContacts(vaultUri, contacts, function (err, responseContacts) {
          if (err) throw err;
          validateCertificateContacts(responseContacts, vaultUri, contacts);
          next();
        });
      }

      function getCertificateContacts(next) {
        client.getCertificateContacts(vaultUri, function (err, responseContacts) {
          if (err) throw err;
          validateCertificateContacts(responseContacts, vaultUri, contacts);
          next();
        });
      }

      function deleteCertificateContacts(next) {
        client.deleteCertificateContacts(vaultUri, function (err, responseContacts) {
          if (err) throw err;
          validateCertificateContacts(responseContacts, vaultUri, contacts);
          next();
        });
      }

      function getNoneExistingContacts(next) {
        client.getCertificateContacts(vaultUri, function (err, responseContacts) {
          if (!err || !err.code || err.code !== 'ContactsNotFound' || !err.statusCode || err.statusCode !== 404) {
            throw new Error('Unexpected error object: ' + JSON.stringify(err, null, ' '));
          }
          next();
        });
      }

      series([
        createCertificateContacts,
        getCertificateContacts,
        deleteCertificateContacts,
        getNoneExistingContacts,
        function () { done(); }
      ]);

    });
  });

  describe('policy', function () {
    it('should work', function (done) {

      this.timeout(10000);

      var certificateName = 'policyCertificate';

      function getCertificatePolicy(next) {

        importCommonCertificate(certificateName, function (err, certificateBundle, certificatePolicy) {
          if (err) throw err;
          client.getCertificatePolicy(vaultUri, certificateName, function (err, retrievedCertificatePolicy) {
            if (err) throw err;
            should.exist(retrievedCertificatePolicy);
            next();
          });
        });

      }

      function updateCertificatePolicy(next) {

        var certificatePolicy = {
          keyProperties: {
            exportable: true,
            reuseKey: false,
            keySize: 2048,
            keyType: 'RSA'
          },
          secretProperties: {
            contentType: 'application/x-pkcs12'
          },
          issuerParameters: {
            name: 'Self'
          }
        };

        client.updateCertificatePolicy(vaultUri, certificateName, certificatePolicy, function (err, certificateBundle, updatedCertificatePolicy) {
          if (err) throw err;
          client.getCertificatePolicy(vaultUri, certificateName, function (err, updatedCertificatePolicy) {
            if (err) throw err;
            should.exist(updatedCertificatePolicy);
            next();
          });
        });
      }

      series([
        getCertificatePolicy,
        updateCertificatePolicy,
        function () { done(); }
      ]);

    });
  });

  describe('manual enrolled', function () {
    it('should work', function (done) {

      this.timeout(10000);

      var certificateName = "UnknownIssuerCert1";
      var certificatePolicy = {
        keyProperties: {
          exportable: true,
          reuseKey: false,
          keySize: 2048,
          keyType: 'RSA'
        },
        secretProperties: {
          contentType: 'application/x-pkcs12'
        },
        issuerParameters: {
          name: 'Unknown'
        },
        x509CertificateProperties: {
          subject: 'CN=*.microsoft.com',
          subjectAlternativeNames: ["onedrive.microsoft.com", "xbox.microsoft.com"]
        }
      };

      function getPendingCertificateSigningRequest(next) {

        client.createCertificate(vaultUri, certificateName, { certificatePolicy: certificatePolicy }, function (err, certificateOperation) {
          if (err) throw err;

          try {
            client.getPendingCertificateSigningRequest(vaultUri, certificateName, function (err, pendingVersionCsr) {
              if (err) throw err;
              should(new Buffer(certificateOperation.csr).toString('base64')).be.exactly(pendingVersionCsr);
              next();
            });
          }
          catch (e) { throw e; }
          finally {
            client.deleteCertificate(vaultUri, certificateName, function (err, certificateBundle) {
              if (err) throw err;
              next();
            });
          }
        });
      }

      series([
        getPendingCertificateSigningRequest,
        function () { done(); }
      ]);

    });
  });

  function importCommonCertificate(certificateName, callback) {
    var certificateContent = "MIIJOwIBAzCCCPcGCSqGSIb3DQEHAaCCCOgEggjkMIII4DCCBgkGCSqGSIb3DQEHAaCCBfoEggX2MIIF8jCCBe4GCyqGSIb3DQEMCgECoIIE/jCCBPowHAYKKoZIhvcNAQwBAzAOBAj15YH9pOE58AICB9AEggTYLrI+SAru2dBZRQRlJY7XQ3LeLkah2FcRR3dATDshZ2h0IA2oBrkQIdsLyAAWZ32qYR1qkWxLHn9AqXgu27AEbOk35+pITZaiy63YYBkkpR+pDdngZt19Z0PWrGwHEq5z6BHS2GLyyN8SSOCbdzCz7blj3+7IZYoMj4WOPgOm/tQ6U44SFWek46QwN2zeA4i97v7ftNNns27ms52jqfhOvTA9c/wyfZKAY4aKJfYYUmycKjnnRl012ldS2lOkASFt+lu4QCa72IY6ePtRudPCvmzRv2pkLYS6z3cI7omT8nHP3DymNOqLbFqr5O2M1ZYaLC63Q3xt3eVvbcPh3N08D1hHkhz/KDTvkRAQpvrW8ISKmgDdmzN55Pe55xHfSWGB7gPw8sZea57IxFzWHTK2yvTslooWoosmGxanYY2IG/no3EbPOWDKjPZ4ilYJe5JJ2immlxPz+2e2EOCKpDI+7fzQcRz3PTd3BK+budZ8aXX8aW/lOgKS8WmxZoKnOJBNWeTNWQFugmktXfdPHAdxMhjUXqeGQd8wTvZ4EzQNNafovwkI7IV/ZYoa++RGofVR3ZbRSiBNF6TDj/qXFt0wN/CQnsGAmQAGNiN+D4mY7i25dtTu/Jc7OxLdhAUFpHyJpyrYWLfvOiS5WYBeEDHkiPUa/8eZSPA3MXWZR1RiuDvuNqMjct1SSwdXADTtF68l/US1ksU657+XSC+6ly1A/upz+X71+C4Ho6W0751j5ZMT6xKjGh5pee7MVuduxIzXjWIy3YSd0fIT3U0A5NLEvJ9rfkx6JiHjRLx6V1tqsrtT6BsGtmCQR1UCJPLqsKVDvAINx3cPA/CGqr5OX2BGZlAihGmN6n7gv8w4O0k0LPTAe5YefgXN3m9pE867N31GtHVZaJ/UVgDNYS2jused4rw76ZWN41akx2QN0JSeMJqHXqVz6AKfz8ICS/dFnEGyBNpXiMRxrY/QPKi/wONwqsbDxRW7vZRVKs78pBkE0ksaShlZk5GkeayDWC/7Hi/NqUFtIloK9XB3paLxo1DGu5qqaF34jZdktzkXp0uZqpp+FfKZaiovMjt8F7yHCPk+LYpRsU2Cyc9DVoDA6rIgf+uEP4jppgehsxyT0lJHax2t869R2jYdsXwYUXjgwHIV0voj7bJYPGFlFjXOp6ZW86scsHM5xfsGQoK2Fp838VT34SHE1ZXU/puM7rviREHYW72pfpgGZUILQMohuTPnd8tFtAkbrmjLDo+k9xx7HUvgoFTiNNWuq/cRjr70FKNguMMTIrid+HwfmbRoaxENWdLcOTNeascER2a+37UQolKD5ksrPJG6RdNA7O2pzp3micDYRs/+s28cCIxO//J/d4nsgHp6RTuCu4+Jm9k0YTw2Xg75b2cWKrxGnDUgyIlvNPaZTB5QbMid4x44/lE0LLi9kcPQhRgrK07OnnrMgZvVGjt1CLGhKUv7KFc3xV1r1rwKkosxnoG99oCoTQtregcX5rIMjHgkc1IdflGJkZzaWMkYVFOJ4Weynz008i4ddkske5vabZs37Lb8iggUYNBYZyGzalruBgnQyK4fz38Fae4nWYjyildVfgyo/fCePR2ovOfphx9OQJi+M9BoFmPrAg+8ARDZ+R+5yzYuEc9ZoVX7nkp7LTGB3DANBgkrBgEEAYI3EQIxADATBgkqhkiG9w0BCRUxBgQEAQAAADBXBgkqhkiG9w0BCRQxSh5IAGEAOAAwAGQAZgBmADgANgAtAGUAOQA2AGUALQA0ADIAMgA0AC0AYQBhADEAMQAtAGIAZAAxADkANABkADUAYQA2AGIANwA3MF0GCSsGAQQBgjcRATFQHk4ATQBpAGMAcgBvAHMAbwBmAHQAIABTAHQAcgBvAG4AZwAgAEMAcgB5AHAAdABvAGcAcgBhAHAAaABpAGMAIABQAHIAbwB2AGkAZABlAHIwggLPBgkqhkiG9w0BBwagggLAMIICvAIBADCCArUGCSqGSIb3DQEHATAcBgoqhkiG9w0BDAEGMA4ECNX+VL2MxzzWAgIH0ICCAojmRBO+CPfVNUO0s+BVuwhOzikAGNBmQHNChmJ/pyzPbMUbx7tO63eIVSc67iERda2WCEmVwPigaVQkPaumsfp8+L6iV/BMf5RKlyRXcwh0vUdu2Qa7qadD+gFQ2kngf4Dk6vYo2/2HxayuIf6jpwe8vql4ca3ZtWXfuRix2fwgltM0bMz1g59d7x/glTfNqxNlsty0A/rWrPJjNbOPRU2XykLuc3AtlTtYsQ32Zsmu67A7UNBw6tVtkEXlFDqhavEhUEO3dvYqMY+QLxzpZhA0q44ZZ9/ex0X6QAFNK5wuWxCbupHWsgxRwKftrxyszMHsAvNoNcTlqcctee+ecNwTJQa1/MDbnhO6/qHA7cfG1qYDq8Th635vGNMW1w3sVS7l0uEvdayAsBHWTcOC2tlMa5bfHrhY8OEIqj5bN5H9RdFy8G/W239tjDu1OYjBDydiBqzBn8HG1DSj1Pjc0kd/82d4ZU0308KFTC3yGcRad0GnEH0Oi3iEJ9HbriUbfVMbXNHOF+MktWiDVqzndGMKmuJSdfTBKvGFvejAWVO5E4mgLvoaMmbchc3BO7sLeraHnJN5hvMBaLcQI38N86mUfTR8AP6AJ9c2k514KaDLclm4z6J8dMz60nUeo5D3YD09G6BavFHxSvJ8MF0Lu5zOFzEePDRFm9mH8W0N/sFlIaYfD/GWU/w44mQucjaBk95YtqOGRIj58tGDWr8iUdHwaYKGqU24zGeRae9DhFXPzZshV1ZGsBQFRaoYkyLAwdJWIXTi+c37YaC8FRSEnnNmS79Dou1Kc3BvK4EYKAD2KxjtUebrV174gD0Q+9YuJ0GXOTspBvCFd5VT2Rw5zDNrA/J3F5fMCk4wOzAfMAcGBSsOAwIaBBSxgh2xyF+88V4vAffBmZXv8Txt4AQU4O/NX4MjxSodbE7ApNAMIvrtREwCAgfQ";
    var certificatePassword = "123";
    var certificatePolicy = {
      keyProperties: {
        exportable: true,
        reuseKey: false,
        keySize: 2048,
        keyType: 'RSA'
      },
      secretProperties: {
        contentType: 'application/x-pkcs12'
      }
    };

    client.importCertificate(vaultUri, certificateName, certificateContent, { password: certificatePassword, certificatePolicy: certificatePolicy }, function (err, bundle) {
      callback(err, bundle, certificatePolicy);
    });
  }

  function cleanupCreatedCertificates(callback) {
    if (!suiteUtil.isMocked) {
      client.getCertificates(vaultUri, function (err, list) {
        if (list && list.length !== 0) {
          list.forEach(function (cert) {
            var id = KeyVault.parseCertificateIdentifier(cert.id);
            client.deleteCertificate(id.vault, id.name, function (err, bundle) { });
          });
        }
        callback();;
      });
    }
    else callback();
  }

});