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


const should = require('should');
const util = require('util');
const Testutil = require('../../util/util');
const msRestAzure = require('ms-rest-azure');
const AzureStorage = require('azure-storage');
const SuiteBase = require('../../framework/suite-base');
const KeyVaultManagementClient = require('../../../lib/services/keyVaultManagement/lib/keyVaultManagementClient');
const AuthorizationManagementClient = require('../../../lib/services/authorizationManagement/lib/authorizationManagementClient');
const StorageManagementClient = require('../../../lib/services/storageManagement2/lib/storageManagementClient');
const testPrefix = 'keyvaultstorage-tests';
const groupPrefix = 'nodeTestGroup';
const vaultPrefix = 'testacc';
const createdGroups = [];
const createdVaults = [];
const createdStorageAccounts = [];
const KeyVault = Testutil.libRequire('services/keyVault');

const requiredEnvironment = [
  { name: 'AZURE_TEST_LOCATION', defaultValue: 'westus' },
];

var suite;
var kvManagementClient;
var storageMgmtClient;
var groupName;
var acclocation;
var akvClient;
var testVault;
var userOid;
var testStorageAccount;

var _tokenFromUserCredentials = () => { 
  return new Promise ( (resolve, reject) => { 
    suite.credentials.getToken( (err, token) => {
      if(err) {
        reject(err);
        return;
      }
      resolve(token);
    });
  });
};
    
describe('Key Vault Storage', function () {  
  before(async function () {
    suite = new SuiteBase(this, testPrefix, requiredEnvironment);
    await new Promise( (resolve) => { suite.setupSuite(function() { resolve(); }) });
    akvClient = new KeyVault.KeyVaultClient(new msRestAzure.KeyVaultCredentials(null, suite.credentials));
    kvManagementClient = new KeyVaultManagementClient(suite.credentials, suite.subscriptionId);
    storageMgmtClient = new StorageManagementClient(suite.credentials, suite.subscriptionId);
    acclocation = process.env['AZURE_TEST_LOCATION'];
    
    if (!suite.isPlayback && !process.env['AZURE_PASSWORD']) {
      throw new Error('AKV storage test recording requires user credentials');
    }
    
    if (suite.isPlayback) {
      kvManagementClient.longRunningOperationRetryTimeout = 0;
      storageMgmtClient.longRunningOperationRetryTimeout = 0;
    }
  });
  
  after(function (done) {
    suite.teardownSuite(function () {
      suite.deleteResourcegroup(groupName, function (err, result) {
        should.not.exist(err);
        done();
      });
    });
  });
  
  beforeEach(function (done) {
    suite.setupTest(done);
  });
  
  afterEach(function (done) {
    suite.baseTeardownTest(done);
  });
  
  // if we put below in the beforeAll hook it doesn't get successfully recorded and test playback fails
  it('should successfully assign Key Vault the operator role on a storage account', async function() {
    groupName = suite.generateId(groupPrefix, createdGroups, suite.isMocked);
    // set up sample resource group
    if(!suite.isPlayback) {
      await suite.createResourcegroup(groupName, acclocation);
    }
    
    var testVaultName = suite.generateId(vaultPrefix, createdVaults, suite.isMocked);
    var testStorageAccountName = suite.generateId('testakvsa', createdStorageAccounts, suite.isMocked);

    // set up test vault w/ access policy permitting user credentials' oid
    
    var token;
    
    if(!suite.isPlayback) {
      token = await _tokenFromUserCredentials(suite.credentials);
    } else {
      token = { 'oid': '7541419d-883d-452f-a823-56aa8bf0749f' };
    }
    
    const kvParams = 
    {
      location: acclocation,
      properties: {
          tenantId: suite.domain,
          sku: {
              name: 'standard'
          },
          accessPolicies: [
            {
              tenantId: suite.domain,
              objectId: token.oid,
              permissions: {
                secrets: ['get', 'list', 'set', 'delete', 'backup', 'restore', 'recover', 'purge'],
                storage: ['get', 'list', 'delete', 'set', 'update', 'regeneratekey', 'recover', 'purge', 'backup', 'restore', 'setsas', 'listsas', 'getsas', 'deletesas']
              }
            }
          ],
          enabledForDeployment: false,
      }
    };
    
    testVault = await kvManagementClient.vaults.createOrUpdate(groupName, testVaultName, kvParams);
    
    const createSaParams = {
      location: acclocation,
      sku: {
          name: 'Standard_RAGRS'
      },
      kind: 'Storage',
      tags: {}
    };
    
    testStorageAccount = await storageMgmtClient.storageAccounts.create(groupName, testStorageAccountName, createSaParams);
    const authorizationMgmtClient = new AuthorizationManagementClient(suite.credentials, suite.subscriptionId);
    
    // Find the ID for the "Storage Account Key Operator Service Role" role
    const roleList = await authorizationMgmtClient.roleDefinitions.list('/', { 
        'filter': "roleName eq 'Storage Account Key Operator Service Role'"
    });
    
    const roleAssignmentParams = {
        roleDefinitionId: roleList[0].id,
        principalId: '93c27d83-f79b-4cb2-8dd4-4aa716542e74' // The Azure Key Vault Service ID
    };

    await authorizationMgmtClient.roleAssignments.create(testStorageAccount.id, suite.generateGuid(), roleAssignmentParams);
  });
  
  it('should successfully add the storage account to the vault', async function () {
    await akvClient.setStorageAccount(testVault.properties.vaultUri, testStorageAccount.name, testStorageAccount.id, 'key1', true, {
        regenerationPeriod : 'P30D',
        storageAccountAttributes: {
            enabled: true
        }
    });
    
    const storageAccounts = await akvClient.getStorageAccounts(testVault.properties.vaultUri);
    storageAccounts.length.should.equal(1);
  });
  
  it('should successfully update the active account key', async function() {
    await akvClient.updateStorageAccount(testVault.properties.vaultUri, testStorageAccount.name, { 
      activeKeyName: 'key2' 
    });
  });
  
  it('should successfully disable auto key-regen', async function() {
    await akvClient.updateStorageAccount(testVault.properties.vaultUri, testStorageAccount.name, {
      autoRegenerateKey: false
    });
  });
  
  it('should successfully create a SAS account template', async function() {
    const policy = {
      AccessPolicy: {
        Services: 'bfqt', // All services: blob, file, queue, and table
        ResourceTypes: 'sco', // All resource types (service, template, object)
        Permissions: 'acdlpruw', // All permissions: add, create, list, process, read, update, write
        Expiry: '2020-01-01' // Expiry will be ignored and validity period will determine token expiry
      }
    };
  
    const sasTemplate = AzureStorage.generateAccountSharedAccessSignature(testStorageAccount.name, '00000000', policy); // Instead of providing the actual key, just use '00000000' as a placeholder
  
    
    const sasDef = await akvClient.setSasDefinition(testVault.properties.vaultUri, testStorageAccount.name, 'acctall', sasTemplate, 'account', 'PT2H' /* 2 hour validity period */, {
      sasDefinitionAttributes: { enabled: true }
    });
    
    const result = await akvClient.getSasDefinitions(testVault.properties.vaultUri, testStorageAccount.name);
    result.length.should.equal(1);
  });
  
  it('should successfully remove the storage account from the vault', async function() {
    await akvClient.deleteStorageAccount(testVault.properties.vaultUri, testStorageAccount.name);
    const storageAccounts = await akvClient.getStorageAccounts(testVault.properties.vaultUri);
    storageAccounts.length.should.equal(0);
  });
});