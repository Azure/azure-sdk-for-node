/**
* Copyright 2011 Microsoft Corporation
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*   http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/

var testCase = require('nodeunit').testCase;

var azure = require('../lib/azure');

var ServiceClient = azure.ServiceClient;

var environmentAzureStorageAccount = 'myaccount';
var environmentAzureStorageAccessKey = 'myaccountstoragekey';
var parameterAzureStorageAccount = 'storageAccount';
var parameterAzureStorageAccessKey = 'storageAccesKey';

var firstRun = true;
var originalAzureStorageAccount = null;
var originalAzureStorageAccessKey = null;

module.exports = testCase(
{
  setUp: function (callback) {
    if (firstRun) {
      firstRun = false;

      // On the first run store the previous azure storage account / azure storage access key from the environment
      if (!originalAzureStorageAccount && process.env[ServiceClient.EnvironmentVariables.AZURE_STORAGE_ACCOUNT]) {
        originalAzureStorageAccount = process.env[ServiceClient.EnvironmentVariables.AZURE_STORAGE_ACCOUNT];
      }

      if (!originalAzureStorageAccessKey && process.env[ServiceClient.EnvironmentVariables.AZURE_STORAGE_ACCESS_KEY]) {
        originalAzureStorageAccessKey = process.env[ServiceClient.EnvironmentVariables.AZURE_STORAGE_ACCESS_KEY];
      }
    }

    callback();
  },

  tearDown: function (callback) {
    // Make sure emulated is never a left over after the test runs.
    delete process.env[ServiceClient.EnvironmentVariables.EMULATED];

    if (originalAzureStorageAccount) {
      process.env[ServiceClient.EnvironmentVariables.AZURE_STORAGE_ACCOUNT] = originalAzureStorageAccount;
    }

    if (originalAzureStorageAccessKey) {
      process.env[ServiceClient.EnvironmentVariables.AZURE_STORAGE_ACCESS_KEY] = originalAzureStorageAccessKey;
    }

    // clean up
    callback();
  },

  testExponentialRetryPolicyFilter: function (test) {
    test.notEqual(azure.ExponentialRetryPolicyFilter, null);
    test.done();
  },

  testLinearRetryPolicyFilter: function (test) {
    test.notEqual(azure.LinearRetryPolicyFilter, null);
    test.done();
  },

  testConstants: function (test) {
    test.notEqual(azure.Constants, null);
    test.done();
  },

  testIsEmulated: function (test) {
    var ServiceClient = azure.ServiceClient;
    delete process.env[ServiceClient.EnvironmentVariables.EMULATED];
    test.equal(azure.isEmulated(), false);

    var blobService1 = azure.createBlobService();
    test.equal(blobService1.host, ServiceClient.CLOUD_BLOB_HOST);
    test.equal(blobService1.usePathStyleUri, false);

    process.env[ServiceClient.EnvironmentVariables.EMULATED] = true;
    test.equal(azure.isEmulated(), true);

    var blobService2 = azure.createBlobService();
    test.equal(blobService2.host, '127.0.0.1');
    test.equal(blobService2.usePathStyleUri, true);

    test.done();
  },

  testNotEmulatedExplicitCredentials: function (test) {
    // Make sure is not emulated
    delete process.env[ServiceClient.EnvironmentVariables.EMULATED];

    // set some environment credentials for the live windows azure services
    process.env[ServiceClient.EnvironmentVariables.AZURE_STORAGE_ACCOUNT] = environmentAzureStorageAccount;
    process.env[ServiceClient.EnvironmentVariables.AZURE_STORAGE_ACCESS_KEY] = environmentAzureStorageAccessKey;

    // Create blob client passing some credentials
    var blobService = azure.createBlobService(parameterAzureStorageAccount, parameterAzureStorageAccessKey);

    // Points to the live services
    test.equal(blobService.usePathStyleUri, false);
    test.equal(blobService.host, ServiceClient.CLOUD_BLOB_HOST);

    // And credentials are the ones passed 
    test.equal(blobService.authenticationProvider.storageAccount, parameterAzureStorageAccount);
    test.equal(blobService.authenticationProvider.storageAccessKey, parameterAzureStorageAccessKey);

    test.done();
  },

  testEmulatedExplicitCredentials: function (test) {
    // set emulated to true
    process.env[ServiceClient.EnvironmentVariables.EMULATED] = true;

    // set some environment credentials for the live windows azure services
    process.env[ServiceClient.EnvironmentVariables.AZURE_STORAGE_ACCOUNT] = environmentAzureStorageAccount;
    process.env[ServiceClient.EnvironmentVariables.AZURE_STORAGE_ACCESS_KEY] = environmentAzureStorageAccessKey;

    // Create blob client passing some credentials
    var blobService = azure.createBlobService(parameterAzureStorageAccount, parameterAzureStorageAccessKey);

    // Points to the emulator
    test.equal(blobService.usePathStyleUri, true);
    test.equal(blobService.host + ':' + blobService.port, ServiceClient.DEVSTORE_BLOB_HOST);

    // But the used credentials are the ones passed because we were explicit
    test.equal(blobService.authenticationProvider.storageAccount, parameterAzureStorageAccount);
    test.equal(blobService.authenticationProvider.storageAccessKey, parameterAzureStorageAccessKey);

    test.done();
  },

  testEmulatedWithoutParameters: function (test) {
    // set emulated to true
    process.env[ServiceClient.EnvironmentVariables.EMULATED] = true;

    // set some environment credentials for the live windows azure services
    process.env[ServiceClient.EnvironmentVariables.AZURE_STORAGE_ACCOUNT] = environmentAzureStorageAccount;
    process.env[ServiceClient.EnvironmentVariables.AZURE_STORAGE_ACCESS_KEY] = environmentAzureStorageAccessKey;

    // Create blob client without passing any credentials
    var blobService = azure.createBlobService();

    // Points to the emulator
    test.equal(blobService.usePathStyleUri, true);
    test.equal(blobService.host + ':' + blobService.port, ServiceClient.DEVSTORE_BLOB_HOST);

    // And uses the emulator credentials
    test.equal(blobService.authenticationProvider.storageAccount, ServiceClient.DEVSTORE_STORAGE_ACCOUNT);
    test.equal(blobService.authenticationProvider.storageAccessKey, ServiceClient.DEVSTORE_STORAGE_ACCESS_KEY);

    test.done();
  },

  testNotEmulatedWithoutParameters: function (test) {
    // Make sure is not emulated
    delete process.env[ServiceClient.EnvironmentVariables.EMULATED];

    // set some environment credentials for the live windows azure services
    process.env[ServiceClient.EnvironmentVariables.AZURE_STORAGE_ACCOUNT] = environmentAzureStorageAccount;
    process.env[ServiceClient.EnvironmentVariables.AZURE_STORAGE_ACCESS_KEY] = environmentAzureStorageAccessKey;

    // Create blob client without passing any credentials
    blobService = azure.createBlobService();

    // Points to the live service
    test.equal(blobService.usePathStyleUri, false);
    test.equal(blobService.host, ServiceClient.CLOUD_BLOB_HOST);

    // and uses the environment variables
    test.equal(blobService.authenticationProvider.storageAccount, environmentAzureStorageAccount);
    test.equal(blobService.authenticationProvider.storageAccessKey, environmentAzureStorageAccessKey);

    test.done();
  }
});
