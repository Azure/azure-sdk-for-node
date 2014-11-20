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

var assert = require('assert');

// Test includes
var testutil = require('./util/util');

// Lib includes
var azure = testutil.libRequire('azure');
var storage = testutil.libRequire('services/legacyStorage');
var ServiceBusServiceClient = testutil.libRequire('services/serviceBus/lib/servicebusserviceclient');
var ServiceClientConstants = azure.ServiceClientConstants;

var environmentAzureStorageAccount = 'myaccount';
var environmentAzureStorageAccessKey = 'AhlzsbLRkjfwObuqff3xrhB2yWJNh1EMptmcmxFJ6fvPTVX3PZXwrG2YtYWf5DPMVgNsteKStM5iBLlknYFVoA==';
var environmentAzureStorageDnsSuffix = 'core.windows.net';
var environmentServiceBusNamespace = 'mynamespace';
var environmentServiceBusIssuer = 'myissuer';
var environmentServiceBusAccessKey = 'AhlzsbLRkjfwObuqff3xrhB2yWJNh1EMptmcmxFJ6fvPTVX3PZXwrG2YtYWf5DPMVgNsteKStM5iBLlknYFVoA==';
var environmentWrapNamespace = 'mynamespace-sb';

var parameterAzureStorageAccount = 'storageAccount';
var parameterAzureStorageAccessKey = 'AhlzsbLRkjfwObuqff3xrhB2yWJNh1EMptmcmxFJ6fvPTVX3PZXwrG2YtYWf5DPMVgNsteKStM5iBLlknYFVoA==';

var firstRun = true;
var originalAzureStorageAccount = null;
var originalAzureStorageAccessKey = null;
var originalAzureStorageDnsSuffix = null;
var originalServiceBusNamespace = null;
var originalServiceBusIssuer = null;
var originalServiceBusAccessKey = null;
var originalWrapNamespace = null;

suite('azure', function () {
  setup(function (done) {
    if (firstRun) {
      firstRun = false;

      // On the first run store the previous azure storage account / azure storage access key from the environment
      if (!originalAzureStorageAccount && process.env[ServiceClientConstants.EnvironmentVariables.AZURE_STORAGE_ACCOUNT]) {
        originalAzureStorageAccount = process.env[ServiceClientConstants.EnvironmentVariables.AZURE_STORAGE_ACCOUNT];
      }

      if (!originalAzureStorageAccessKey && process.env[ServiceClientConstants.EnvironmentVariables.AZURE_STORAGE_ACCESS_KEY]) {
        originalAzureStorageAccessKey = process.env[ServiceClientConstants.EnvironmentVariables.AZURE_STORAGE_ACCESS_KEY];
      }

      if (!originalAzureStorageDnsSuffix && process.env[ServiceClientConstants.EnvironmentVariables.AZURE_STORAGE_DNS_SUFFIX]) {
        originalAzureStorageDnsSuffix = process.env[ServiceClientConstants.EnvironmentVariables.AZURE_STORAGE_DNS_SUFFIX];
      }
      // On the first run store the previous azure storage account / azure storage access key from the environment
      if (!originalServiceBusNamespace && process.env[ServiceClientConstants.EnvironmentVariables.AZURE_SERVICEBUS_NAMESPACE]) {
        originalServiceBusNamespace = process.env[ServiceClientConstants.EnvironmentVariables.AZURE_SERVICEBUS_NAMESPACE];
      }

      if (!originalServiceBusIssuer && process.env[ServiceClientConstants.EnvironmentVariables.AZURE_SERVICEBUS_ISSUER]) {
        originalServiceBusIssuer = process.env[ServiceClientConstants.EnvironmentVariables.AZURE_SERVICEBUS_ISSUER];
      }

      if (!originalServiceBusAccessKey && process.env[ServiceClientConstants.EnvironmentVariables.AZURE_SERVICEBUS_ACCESS_KEY]) {
        originalServiceBusAccessKey = process.env[ServiceClientConstants.EnvironmentVariables.AZURE_SERVICEBUS_ACCESS_KEY];
      }

      if (!originalWrapNamespace && process.env[ServiceClientConstants.EnvironmentVariables.AZURE_WRAP_NAMESPACE]) {
        originalWrapNamespace = process.env[ServiceClientConstants.EnvironmentVariables.AZURE_WRAP_NAMESPACE];
      }
    }

    done();
  });

  teardown(function (done) {
    // Make sure emulated is never a left over after the test runs.
    delete process.env[ServiceClientConstants.EnvironmentVariables.EMULATED];

    if (originalAzureStorageAccount) {
      process.env[ServiceClientConstants.EnvironmentVariables.AZURE_STORAGE_ACCOUNT] = originalAzureStorageAccount;
    }

    if (originalAzureStorageAccessKey) {
      process.env[ServiceClientConstants.EnvironmentVariables.AZURE_STORAGE_ACCESS_KEY] = originalAzureStorageAccessKey;
    }

    if (originalServiceBusNamespace) {
      process.env[ServiceClientConstants.EnvironmentVariables.AZURE_SERVICEBUS_NAMESPACE] = originalServiceBusNamespace;
    }

    if (originalServiceBusIssuer) {
      process.env[ServiceClientConstants.EnvironmentVariables.AZURE_SERVICEBUS_ISSUER] = originalServiceBusIssuer;
    }

    if (originalServiceBusAccessKey) {
      process.env[ServiceClientConstants.EnvironmentVariables.AZURE_SERVICEBUS_ACCESS_KEY] = originalServiceBusAccessKey;
    }

    if (originalWrapNamespace) {
      process.env[ServiceClientConstants.EnvironmentVariables.AZURE_WRAP_NAMESPACE] = originalWrapNamespace;
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
    var ServiceClientConstants = azure.ServiceClientConstants;
    delete process.env[ServiceClientConstants.EnvironmentVariables.EMULATED];
    assert.equal(azure.isEmulated(), false);

    // set some environment credentials for the live microsoft azure services
    process.env[ServiceClientConstants.EnvironmentVariables.AZURE_STORAGE_ACCOUNT] = environmentAzureStorageAccount;
    process.env[ServiceClientConstants.EnvironmentVariables.AZURE_STORAGE_ACCESS_KEY] = environmentAzureStorageAccessKey;
    process.env[ServiceClientConstants.EnvironmentVariables.AZURE_STORAGE_DNS_SUFFIX] = environmentAzureStorageDnsSuffix;

    var blobService1 = storage.createBlobService();
    assert.equal(blobService1.host, environmentAzureStorageAccount + '.' + ServiceClientConstants.CLOUD_BLOB_HOST);
    assert.equal(blobService1.usePathStyleUri, false);

    process.env[ServiceClientConstants.EnvironmentVariables.EMULATED] = true;

    var blobService2 = storage.createBlobService();
    assert.equal(blobService2.host, '127.0.0.1');
    assert.equal(blobService2.usePathStyleUri, true);

    done();
  });

  test('NotEmulatedExplicitCredentials', function (done) {
    // Make sure is not emulated
    delete process.env[ServiceClientConstants.EnvironmentVariables.EMULATED];

    // set some environment credentials for the live microsoft azure services
    process.env[ServiceClientConstants.EnvironmentVariables.AZURE_STORAGE_ACCOUNT] = environmentAzureStorageAccount;
    process.env[ServiceClientConstants.EnvironmentVariables.AZURE_STORAGE_ACCESS_KEY] = environmentAzureStorageAccessKey;
    process.env[ServiceClientConstants.EnvironmentVariables.AZURE_STORAGE_DNS_SUFFIX] = environmentAzureStorageDnsSuffix;

    // Create blob client passing some credentials
    var blobService = storage.createBlobService(parameterAzureStorageAccount, parameterAzureStorageAccessKey);

    // Points to the live services
    assert.equal(blobService.usePathStyleUri, false);
    assert.equal(blobService.host, parameterAzureStorageAccount.toLowerCase() + '.' + ServiceClientConstants.CLOUD_BLOB_HOST);

    // And credentials are the ones passed
    assert.equal(blobService.authenticationProvider.storageAccount, parameterAzureStorageAccount);
    assert.equal(blobService.authenticationProvider.storageAccessKey, parameterAzureStorageAccessKey);

    done();
  });

  test('EmulatedExplicitCredentials', function (done) {
    // set emulated to true
    process.env[ServiceClientConstants.EnvironmentVariables.EMULATED] = true;

    // set some environment credentials for the live microsoft azure services
    process.env[ServiceClientConstants.EnvironmentVariables.AZURE_STORAGE_ACCOUNT] = environmentAzureStorageAccount;
    process.env[ServiceClientConstants.EnvironmentVariables.AZURE_STORAGE_ACCESS_KEY] = environmentAzureStorageAccessKey;
    process.env[ServiceClientConstants.EnvironmentVariables.AZURE_STORAGE_DNS_SUFFIX] = environmentAzureStorageDnsSuffix;

    // Create blob client passing some credentials
    var blobService = storage.createBlobService(parameterAzureStorageAccount, parameterAzureStorageAccessKey);

    // Points to the credentials
    assert.equal(blobService.usePathStyleUri, false);
    assert.equal(blobService.host + ':' + blobService.port, parameterAzureStorageAccount.toLowerCase() + '.' +  ServiceClientConstants.CLOUD_BLOB_HOST + ':443');

    // But the used credentials are the ones passed because we were explicit
    assert.equal(blobService.authenticationProvider.storageAccount, parameterAzureStorageAccount);
    assert.equal(blobService.authenticationProvider.storageAccessKey, parameterAzureStorageAccessKey);

    done();
  });

  test('EmulatedWithoutParameters', function (done) {
    // set emulated to true
    process.env[ServiceClientConstants.EnvironmentVariables.EMULATED] = true;

    // set some environment credentials for the live microsoft azure services
    process.env[ServiceClientConstants.EnvironmentVariables.AZURE_STORAGE_ACCOUNT] = environmentAzureStorageAccount;
    process.env[ServiceClientConstants.EnvironmentVariables.AZURE_STORAGE_ACCESS_KEY] = environmentAzureStorageAccessKey;
    process.env[ServiceClientConstants.EnvironmentVariables.AZURE_STORAGE_DNS_SUFFIX] = environmentAzureStorageDnsSuffix;

    // Create blob client without passing any credentials
    var blobService = storage.createBlobService();

    // Points to the emulator
    assert.equal(blobService.usePathStyleUri, true);
    assert.equal(blobService.host + ':' + blobService.port, ServiceClientConstants.DEVSTORE_BLOB_HOST);

    // And uses the emulator credentials
    assert.equal(blobService.authenticationProvider.storageAccount, ServiceClientConstants.DEVSTORE_STORAGE_ACCOUNT);
    assert.equal(blobService.authenticationProvider.storageAccessKey, ServiceClientConstants.DEVSTORE_STORAGE_ACCESS_KEY);

    done();
  });

  test('NotEmulatedWithoutParameters', function (done) {
    // Make sure is not emulated
    delete process.env[ServiceClientConstants.EnvironmentVariables.EMULATED];

    // set some environment credentials for the live microsoft azure services
    process.env[ServiceClientConstants.EnvironmentVariables.AZURE_STORAGE_ACCOUNT] = environmentAzureStorageAccount;
    process.env[ServiceClientConstants.EnvironmentVariables.AZURE_STORAGE_ACCESS_KEY] = environmentAzureStorageAccessKey;
    process.env[ServiceClientConstants.EnvironmentVariables.AZURE_STORAGE_DNS_SUFFIX] = environmentAzureStorageDnsSuffix;

    // Create blob client without passing any credentials
    var blobService = storage.createBlobService();

    // Points to the live service
    assert.equal(blobService.usePathStyleUri, false);
    assert.equal(blobService.host, environmentAzureStorageAccount + '.' + ServiceClientConstants.CLOUD_BLOB_HOST);

    // and uses the environment variables
    assert.equal(blobService.authenticationProvider.storageAccount, environmentAzureStorageAccount);
    assert.equal(blobService.authenticationProvider.storageAccessKey, environmentAzureStorageAccessKey);

    done();
  });

test('MissingServiceBusIssuerAndWrapNamespace', function (done) {
    delete process.env[ServiceClientConstants.EnvironmentVariables.AZURE_WRAP_NAMESPACE];
    delete process.env[ServiceClientConstants.EnvironmentVariables.AZURE_SERVICEBUS_ISSUER];

    process.env[ServiceClientConstants.EnvironmentVariables.AZURE_SERVICEBUS_NAMESPACE] = environmentServiceBusNamespace;
    process.env[ServiceClientConstants.EnvironmentVariables.AZURE_SERVICEBUS_ACCESS_KEY] = environmentServiceBusAccessKey;

    // Create service bus client without passing any credentials
    var serviceBusService = azure.createServiceBusService();

    // set correctly
    assert.equal(serviceBusService.authenticationProvider.acsHost, 'https://' + environmentServiceBusNamespace + ServiceClientConstants.DEFAULT_WRAP_NAMESPACE_SUFFIX + '.accesscontrol.windows.net:443/WRAPv0.9');
    assert.equal(serviceBusService.authenticationProvider.accessKey, environmentServiceBusAccessKey);

    // defaulted correctly
    assert.equal(serviceBusService.authenticationProvider.issuer, ServiceClientConstants.DEFAULT_SERVICEBUS_ISSUER);

    done();
  });
});