/**
* Copyright (c) Microsoft.  All rights reserved.
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

var assert = require('assert');

// Test includes
var testutil = require('./util/util');

// Lib includes
var azure = testutil.libRequire('azure');
var ServiceBusServiceClient = testutil.libRequire('services/core/servicebusserviceclient');
var ServiceClient = azure.ServiceClient;

var environmentAzureStorageAccount = 'myaccount';
var environmentAzureStorageAccessKey = 'AhlzsbLRkjfwObuqff3xrhB2yWJNh1EMptmcmxFJ6fvPTVX3PZXwrG2YtYWf5DPMVgNsteKStM5iBLlknYFVoA==';
var environmentServiceBusNamespace = 'mynamespace';
var environmentServiceBusIssuer = 'myissuer';
var environmentServiceBusAccessKey = 'AhlzsbLRkjfwObuqff3xrhB2yWJNh1EMptmcmxFJ6fvPTVX3PZXwrG2YtYWf5DPMVgNsteKStM5iBLlknYFVoA==';
var environmentWrapNamespace = 'mynamespace-sb';

var parameterAzureStorageAccount = 'storageAccount';
var parameterAzureStorageAccessKey = 'AhlzsbLRkjfwObuqff3xrhB2yWJNh1EMptmcmxFJ6fvPTVX3PZXwrG2YtYWf5DPMVgNsteKStM5iBLlknYFVoA==';

var firstRun = true;
var originalAzureStorageAccount = null;
var originalAzureStorageAccessKey = null;
var originalServiceBusNamespace = null;
var originalServiceBusIssuer = null;
var originalServiceBusAccessKey = null;
var originalWrapNamespace = null;

suite('azure', function () {
  setup(function (done) {
    if (firstRun) {
      firstRun = false;

      // On the first run store the previous azure storage account / azure storage access key from the environment
      if (!originalAzureStorageAccount && process.env[ServiceClient.EnvironmentVariables.AZURE_STORAGE_ACCOUNT]) {
        originalAzureStorageAccount = process.env[ServiceClient.EnvironmentVariables.AZURE_STORAGE_ACCOUNT];
      }

      if (!originalAzureStorageAccessKey && process.env[ServiceClient.EnvironmentVariables.AZURE_STORAGE_ACCESS_KEY]) {
        originalAzureStorageAccessKey = process.env[ServiceClient.EnvironmentVariables.AZURE_STORAGE_ACCESS_KEY];
      }

      // On the first run store the previous azure storage account / azure storage access key from the environment
      if (!originalServiceBusNamespace && process.env[ServiceClient.EnvironmentVariables.AZURE_SERVICEBUS_NAMESPACE]) {
        originalServiceBusNamespace = process.env[ServiceClient.EnvironmentVariables.AZURE_SERVICEBUS_NAMESPACE];
      }

      if (!originalServiceBusIssuer && process.env[ServiceClient.EnvironmentVariables.AZURE_SERVICEBUS_ISSUER]) {
        originalServiceBusIssuer = process.env[ServiceClient.EnvironmentVariables.AZURE_SERVICEBUS_ISSUER];
      }

      if (!originalServiceBusAccessKey && process.env[ServiceClient.EnvironmentVariables.AZURE_SERVICEBUS_ACCESS_KEY]) {
        originalServiceBusAccessKey = process.env[ServiceClient.EnvironmentVariables.AZURE_SERVICEBUS_ACCESS_KEY];
      }

      if (!originalWrapNamespace && process.env[ServiceClient.EnvironmentVariables.AZURE_WRAP_NAMESPACE]) {
        originalWrapNamespace = process.env[ServiceClient.EnvironmentVariables.AZURE_WRAP_NAMESPACE];
      }
    }

    done();
  });

  teardown(function (done) {
    // Make sure emulated is never a left over after the test runs.
    delete process.env[ServiceClient.EnvironmentVariables.EMULATED];

    if (originalAzureStorageAccount) {
      process.env[ServiceClient.EnvironmentVariables.AZURE_STORAGE_ACCOUNT] = originalAzureStorageAccount;
    }

    if (originalAzureStorageAccessKey) {
      process.env[ServiceClient.EnvironmentVariables.AZURE_STORAGE_ACCESS_KEY] = originalAzureStorageAccessKey;
    }

    if (originalServiceBusNamespace) {
      process.env[ServiceClient.EnvironmentVariables.AZURE_SERVICEBUS_NAMESPACE] = originalServiceBusNamespace;
    }

    if (originalServiceBusIssuer) {
      process.env[ServiceClient.EnvironmentVariables.AZURE_SERVICEBUS_ISSUER] = originalServiceBusIssuer;
    }

    if (originalServiceBusAccessKey) {
      process.env[ServiceClient.EnvironmentVariables.AZURE_SERVICEBUS_ACCESS_KEY] = originalServiceBusAccessKey;
    }

    if (originalWrapNamespace) {
      process.env[ServiceClient.EnvironmentVariables.AZURE_WRAP_NAMESPACE] = originalWrapNamespace;
    }

    // clean up
    done();
  });

  test('ExponentialRetryPolicyFilter', function (done) {
    assert.notEqual(azure.ExponentialRetryPolicyFilter, null);

    done();
  });

  test('LinearRetryPolicyFilter', function (done) {
    assert.notEqual(azure.LinearRetryPolicyFilter, null);

    done();
  });

  test('Constants', function (done) {
    assert.notEqual(azure.Constants, null);

    done();
  });

  test('IsEmulated', function (done) {
    var ServiceClient = azure.ServiceClient;
    delete process.env[ServiceClient.EnvironmentVariables.EMULATED];
    assert.equal(azure.isEmulated(), false);

    // set some environment credentials for the live windows azure services
    process.env[ServiceClient.EnvironmentVariables.AZURE_STORAGE_ACCOUNT] = environmentAzureStorageAccount;
    process.env[ServiceClient.EnvironmentVariables.AZURE_STORAGE_ACCESS_KEY] = environmentAzureStorageAccessKey;

    var blobService1 = azure.createBlobService();
    assert.equal(blobService1.host, environmentAzureStorageAccount + '.' + ServiceClient.CLOUD_BLOB_HOST);
    assert.equal(blobService1.usePathStyleUri, false);

    process.env[ServiceClient.EnvironmentVariables.EMULATED] = true;

    var blobService2 = azure.createBlobService();
    assert.equal(blobService2.host, '127.0.0.1');
    assert.equal(blobService2.usePathStyleUri, true);

    done();
  });

  test('NotEmulatedExplicitCredentials', function (done) {
    // Make sure is not emulated
    delete process.env[ServiceClient.EnvironmentVariables.EMULATED];

    // set some environment credentials for the live windows azure services
    process.env[ServiceClient.EnvironmentVariables.AZURE_STORAGE_ACCOUNT] = environmentAzureStorageAccount;
    process.env[ServiceClient.EnvironmentVariables.AZURE_STORAGE_ACCESS_KEY] = environmentAzureStorageAccessKey;

    // Create blob client passing some credentials
    var blobService = azure.createBlobService(parameterAzureStorageAccount, parameterAzureStorageAccessKey);

    // Points to the live services
    assert.equal(blobService.usePathStyleUri, false);
    assert.equal(blobService.host, parameterAzureStorageAccount.toLowerCase() + '.' + ServiceClient.CLOUD_BLOB_HOST);

    // And credentials are the ones passed 
    assert.equal(blobService.authenticationProvider.storageAccount, parameterAzureStorageAccount);
    assert.equal(blobService.authenticationProvider.storageAccessKey, parameterAzureStorageAccessKey);

    done();
  });

  test('EmulatedExplicitCredentials', function (done) {
    // set emulated to true
    process.env[ServiceClient.EnvironmentVariables.EMULATED] = true;

    // set some environment credentials for the live windows azure services
    process.env[ServiceClient.EnvironmentVariables.AZURE_STORAGE_ACCOUNT] = environmentAzureStorageAccount;
    process.env[ServiceClient.EnvironmentVariables.AZURE_STORAGE_ACCESS_KEY] = environmentAzureStorageAccessKey;

    // Create blob client passing some credentials
    var blobService = azure.createBlobService(parameterAzureStorageAccount, parameterAzureStorageAccessKey);

    // Points to the credentials
    assert.equal(blobService.usePathStyleUri, false);
    assert.equal(blobService.host + ':' + blobService.port, parameterAzureStorageAccount.toLowerCase() + '.' +  ServiceClient.CLOUD_BLOB_HOST + ':80');

    // But the used credentials are the ones passed because we were explicit
    assert.equal(blobService.authenticationProvider.storageAccount, parameterAzureStorageAccount);
    assert.equal(blobService.authenticationProvider.storageAccessKey, parameterAzureStorageAccessKey);

    done();
  });

  test('EmulatedWithoutParameters', function (done) {
    // set emulated to true
    process.env[ServiceClient.EnvironmentVariables.EMULATED] = true;

    // set some environment credentials for the live windows azure services
    process.env[ServiceClient.EnvironmentVariables.AZURE_STORAGE_ACCOUNT] = environmentAzureStorageAccount;
    process.env[ServiceClient.EnvironmentVariables.AZURE_STORAGE_ACCESS_KEY] = environmentAzureStorageAccessKey;

    // Create blob client without passing any credentials
    var blobService = azure.createBlobService();

    // Points to the emulator
    assert.equal(blobService.usePathStyleUri, true);
    assert.equal(blobService.host + ':' + blobService.port, ServiceClient.DEVSTORE_BLOB_HOST);

    // And uses the emulator credentials
    assert.equal(blobService.authenticationProvider.storageAccount, ServiceClient.DEVSTORE_STORAGE_ACCOUNT);
    assert.equal(blobService.authenticationProvider.storageAccessKey, ServiceClient.DEVSTORE_STORAGE_ACCESS_KEY);

    done();
  });

  test('NotEmulatedWithoutParameters', function (done) {
    // Make sure is not emulated
    delete process.env[ServiceClient.EnvironmentVariables.EMULATED];

    // set some environment credentials for the live windows azure services
    process.env[ServiceClient.EnvironmentVariables.AZURE_STORAGE_ACCOUNT] = environmentAzureStorageAccount;
    process.env[ServiceClient.EnvironmentVariables.AZURE_STORAGE_ACCESS_KEY] = environmentAzureStorageAccessKey;

    // Create blob client without passing any credentials
    var blobService = azure.createBlobService();

    // Points to the live service
    assert.equal(blobService.usePathStyleUri, false);
    assert.equal(blobService.host, environmentAzureStorageAccount + '.' + ServiceClient.CLOUD_BLOB_HOST);

    // and uses the environment variables
    assert.equal(blobService.authenticationProvider.storageAccount, environmentAzureStorageAccount);
    assert.equal(blobService.authenticationProvider.storageAccessKey, environmentAzureStorageAccessKey);

    done();
  });

test('MissingServiceBusIssuerAndWrapNamespace', function (done) {
    delete process.env[ServiceClient.EnvironmentVariables.AZURE_WRAP_NAMESPACE];
    delete process.env[ServiceClient.EnvironmentVariables.AZURE_SERVICEBUS_ISSUER];

    process.env[ServiceClient.EnvironmentVariables.AZURE_SERVICEBUS_NAMESPACE] = environmentServiceBusNamespace;
    process.env[ServiceClient.EnvironmentVariables.AZURE_SERVICEBUS_ACCESS_KEY] = environmentServiceBusAccessKey;

    // Create service bus client without passing any credentials
    var serviceBusService = azure.createServiceBusService();

    // set correctly
    assert.equal(serviceBusService.authenticationProvider.acsHost, 'https://' + environmentServiceBusNamespace + ServiceClient.DEFAULT_WRAP_NAMESPACE_SUFFIX + '.accesscontrol.windows.net:443');
    assert.equal(serviceBusService.authenticationProvider.accessKey, environmentServiceBusAccessKey);

    // defaulted correctly
    assert.equal(serviceBusService.authenticationProvider.issuer, ServiceClient.DEFAULT_SERVICEBUS_ISSUER);

    done();
  });
});