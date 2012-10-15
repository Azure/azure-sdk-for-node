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

var should = require('should');
var url = require('url');

var testutil = require('../../util/util');
var azure = testutil.libRequire('azure');
var Constants = azure.Constants;
var ConnectionStringKeys = Constants.ConnectionStringKeys;
var StorageServiceSettings = azure.StorageServiceSettings;

suite('storageservicesettings-tests', function () {
  test('testCreateFromConnectionStringWithUseDevStore', function () {
    // Setup
    var connectionString = 'UseDevelopmentStorage=true';
    var expectedName = Constants.DEV_STORE_NAME;
    var expectedKey = Constants.DEV_STORE_KEY;
    var expectedBlobEndpoint = Constants.DEV_STORE_URI + ':10000';
    var expectedQueueEndpoint = Constants.DEV_STORE_URI + ':10001';
    var expectedTableEndpoint = Constants.DEV_STORE_URI + ':10002';
    var expectedUsePathStyleUri = true;

    // Test
    var actual = StorageServiceSettings.createFromConnectionString(connectionString);

    // Assert
    actual._name.should.equal(expectedName);
    actual._key.should.equal(expectedKey);
    actual._blobEndpointUri.should.equal(expectedBlobEndpoint);
    actual._queueEndpointUri.should.equal(expectedQueueEndpoint);
    actual._tableEndpointUri.should.equal(expectedTableEndpoint);
    actual._usePathStyleUri.should.equal(expectedUsePathStyleUri);
  });

  test('testCreateFromConnectionStringWithUseDevStoreUri', function () {
    // Setup
    var myProxyUri = 'http://222.3.5.6';
    var connectionString = 'DevelopmentStorageProxyUri=' + myProxyUri + ';UseDevelopmentStorage=true';
    var expectedName = Constants.DEV_STORE_NAME;
    var expectedKey = Constants.DEV_STORE_KEY;
    var expectedBlobEndpoint = myProxyUri + ':10000';
    var expectedQueueEndpoint = myProxyUri + ':10001';
    var expectedTableEndpoint = myProxyUri + ':10002';
    var expectedUsePathStyleUri = true;

    // Test
    var actual = StorageServiceSettings.createFromConnectionString(connectionString);
    
    // Assert
    actual._name.should.equal(expectedName);
    actual._key.should.equal(expectedKey);
    actual._blobEndpointUri.should.equal(expectedBlobEndpoint);
    actual._queueEndpointUri.should.equal(expectedQueueEndpoint);
    actual._tableEndpointUri.should.equal(expectedTableEndpoint);
    actual._usePathStyleUri.should.equal(expectedUsePathStyleUri);
  });

  test('testCreateFromConnectionStringWithInvalidUseDevStoreFail', function () {
    // Setup
    var invalidValue = 'invalid_value';
    var connectionString = 'UseDevelopmentStorage=' + invalidValue;

    // Test
    (function() {
      StorageServiceSettings.createFromConnectionString(connectionString);
    }).should.throw('The provided config value ' + invalidValue + ' does not belong to the valid values subset:\n[true]');
  });

  test('testCreateFromConnectionStringWithEmptyConnectionStringFail', function () {
    // Setup
    var connectionString = '';

    // Test
    (function() {
      StorageServiceSettings.createFromConnectionString(connectionString);
    }).should.throw('The provided connection string "" does not have complete configuration settings.');
  });

  test('testCreateFromConnectionStringWithAutomatic', function () {
    // Setup
    var protocol = 'https';
    var expectedName = 'mytestaccount';
    var expectedKey = 'AhlzsbLRkjfwObuqff3xrhB2yWJNh1EMptmcmxFJ6fvPTVX3PZXwrG2YtYWf5DPMVgNsteKStM5iBLlknYFVoA==';
    var connectionString  = 'DefaultEndpointsProtocol=' + protocol + ';AccountName=' + expectedName + ';AccountKey=' + expectedKey;
    var expectedBlobEndpoint = url.format({ protocol: protocol, host: expectedName + '.' + ConnectionStringKeys.BLOB_BASE_DNS_NAME });
    var expectedQueueEndpoint = url.format({ protocol: protocol, host: expectedName + '.' + ConnectionStringKeys.QUEUE_BASE_DNS_NAME });
    var expectedTableEndpoint = url.format({ protocol: protocol, host: expectedName + '.' + ConnectionStringKeys.TABLE_BASE_DNS_NAME });

    // Test
    var actual = StorageServiceSettings.createFromConnectionString(connectionString);

    // Assert
    actual._name.should.equal(expectedName);
    actual._key.should.equal(expectedKey);
    actual._blobEndpointUri.should.equal(expectedBlobEndpoint);
    actual._queueEndpointUri.should.equal(expectedQueueEndpoint);
    actual._tableEndpointUri.should.equal(expectedTableEndpoint);
  });

  test('testCreateFromConnectionStringWithTableEndpointSpecified', function () {
    // Setup
    var protocol = 'https';
    var expectedName = 'mytestaccount';
    var expectedKey = 'AhlzsbLRkjfwObuqff3xrhB2yWJNh1EMptmcmxFJ6fvPTVX3PZXwrG2YtYWf5DPMVgNsteKStM5iBLlknYFVoA==';
    var expectedTableEndpoint = 'http://myprivatedns.com';
    var expectedBlobEndpoint = url.format({ protocol: protocol, host: expectedName + '.' + ConnectionStringKeys.BLOB_BASE_DNS_NAME });
    var expectedQueueEndpoint = url.format({ protocol: protocol, host: expectedName + '.' + ConnectionStringKeys.QUEUE_BASE_DNS_NAME });
    var connectionString  = 'DefaultEndpointsProtocol=' + protocol + ';AccountName=' + expectedName + ';AccountKey=' + expectedKey + ';TableEndpoint=' + expectedTableEndpoint;

    // Test
    var actual = StorageServiceSettings.createFromConnectionString(connectionString);

    // Assert
    actual._name.should.equal(expectedName);
    actual._key.should.equal(expectedKey);
    actual._blobEndpointUri.should.equal(expectedBlobEndpoint);
    actual._queueEndpointUri.should.equal(expectedQueueEndpoint);
    actual._tableEndpointUri.should.equal(expectedTableEndpoint);
  });

  test('testCreateFromConnectionStringWithBlobEndpointSpecified', function () {
    // Setup
    var protocol = 'https';
    var expectedName = 'mytestaccount';
    var expectedKey = 'AhlzsbLRkjfwObuqff3xrhB2yWJNh1EMptmcmxFJ6fvPTVX3PZXwrG2YtYWf5DPMVgNsteKStM5iBLlknYFVoA==';
    var expectedTableEndpoint = url.format({ protocol: protocol, host: expectedName + '.' + ConnectionStringKeys.TABLE_BASE_DNS_NAME });
    var expectedBlobEndpoint = 'http://myprivatedns.com';
    var expectedQueueEndpoint = url.format({ protocol: protocol, host: expectedName + '.' + ConnectionStringKeys.QUEUE_BASE_DNS_NAME });
    var connectionString  = 'DefaultEndpointsProtocol=' + protocol + ';AccountName=' + expectedName + ';AccountKey=' + expectedKey + ';BlobEndpoint=' + expectedBlobEndpoint;

    // Test
    var actual = StorageServiceSettings.createFromConnectionString(connectionString);

    // Assert
    actual._name.should.equal(expectedName);
    actual._key.should.equal(expectedKey);
    actual._blobEndpointUri.should.equal(expectedBlobEndpoint);
    actual._queueEndpointUri.should.equal(expectedQueueEndpoint);
    actual._tableEndpointUri.should.equal(expectedTableEndpoint);
  });

  test('testCreateFromConnectionStringWithQueueEndpointSpecified', function () {
    // Setup
    var protocol = 'https';
    var expectedName = 'mytestaccount';
    var expectedKey = 'AhlzsbLRkjfwObuqff3xrhB2yWJNh1EMptmcmxFJ6fvPTVX3PZXwrG2YtYWf5DPMVgNsteKStM5iBLlknYFVoA==';
    var expectedTableEndpoint = url.format({ protocol: protocol, host: expectedName + '.' + ConnectionStringKeys.TABLE_BASE_DNS_NAME });
    var expectedBlobEndpoint = url.format({ protocol: protocol, host: expectedName + '.' + ConnectionStringKeys.BLOB_BASE_DNS_NAME });
    var expectedQueueEndpoint = 'http://myprivatedns.com';
    var connectionString  = 'DefaultEndpointsProtocol=' + protocol + ';AccountName=' + expectedName + ';AccountKey=' + expectedKey + ';QueueEndpoint=' + expectedQueueEndpoint;

    // Test
    var actual = StorageServiceSettings.createFromConnectionString(connectionString);

    // Assert
    actual._name.should.equal(expectedName);
    actual._key.should.equal(expectedKey);
    actual._blobEndpointUri.should.equal(expectedBlobEndpoint);
    actual._queueEndpointUri.should.equal(expectedQueueEndpoint);
    actual._tableEndpointUri.should.equal(expectedTableEndpoint);
  });

  test('testCreateFromConnectionStringWithQueueAndBlobEndpointSpecified', function () {
    // Setup
    var protocol = 'https';
    var expectedName = 'mytestaccount';
    var expectedKey = 'AhlzsbLRkjfwObuqff3xrhB2yWJNh1EMptmcmxFJ6fvPTVX3PZXwrG2YtYWf5DPMVgNsteKStM5iBLlknYFVoA==';
    var expectedTableEndpoint = url.format({ protocol: protocol, host: expectedName + '.' + ConnectionStringKeys.TABLE_BASE_DNS_NAME });
    var expectedBlobEndpoint = 'http://myprivateblobdns.com';
    var expectedQueueEndpoint = 'http://myprivatequeuedns.com';
    var connectionString  = 'DefaultEndpointsProtocol=' + protocol + ';AccountName=' + expectedName + ';AccountKey=' + expectedKey + ';QueueEndpoint=' + expectedQueueEndpoint + ';BlobEndpoint=' + expectedBlobEndpoint;

    // Test
    var actual = StorageServiceSettings.createFromConnectionString(connectionString);

    // Assert
    actual._name.should.equal(expectedName);
    actual._key.should.equal(expectedKey);
    actual._blobEndpointUri.should.equal(expectedBlobEndpoint);
    actual._queueEndpointUri.should.equal(expectedQueueEndpoint);
    actual._tableEndpointUri.should.equal(expectedTableEndpoint);
  });

  test('testCreateFromConnectionStringWithAutomaticMissingProtocolFail', function () {
    // Setup
    var expectedName = 'mytestaccount';
    var expectedKey = 'AhlzsbLRkjfwObuqff3xrhB2yWJNh1EMptmcmxFJ6fvPTVX3PZXwrG2YtYWf5DPMVgNsteKStM5iBLlknYFVoA==';
    var connectionString  = 'AccountName=' + expectedName + ';AccountKey=' + expectedKey;

    // Test
    (function() {
      StorageServiceSettings.createFromConnectionString(connectionString);
    }).should.throw('The provided connection string "' + connectionString + '" does not have complete configuration settings.');
  });

  test('testCreateFromConnectionStringWithAutomaticMissingAccountNameFail', function () {
    // Setup
    var expectedKey = 'AhlzsbLRkjfwObuqff3xrhB2yWJNh1EMptmcmxFJ6fvPTVX3PZXwrG2YtYWf5DPMVgNsteKStM5iBLlknYFVoA==';
    var connectionString  = 'DefaultEndpointsProtocol=http;AccountKey=' + expectedKey;

    // Test
    (function() {
      StorageServiceSettings.createFromConnectionString(connectionString);
    }).should.throw('The provided connection string "' + connectionString + '" does not have complete configuration settings.');
  });

  test('testCreateFromConnectionStringWithAutomaticCorruptedAccountKeyFail', function () {
    // Setup
    var expectedName = 'mytestaccount';
    var invalidKey = '__A&*INVALID-@Key';
    var connectionString  = 'DefaultEndpointsProtocol=http;AccountName=' + expectedName + ';AccountKey=' + invalidKey;

    // Test
    (function() {
      StorageServiceSettings.createFromConnectionString(connectionString);
    }).should.throw('The provided account key ' + invalidKey + ' is not a valid base64 string.');
  });

  test('testCreateFromConnectionStringWithQueueAndBlobAndTableEndpointSpecfied', function () {
    // Setup
    var protocol = 'https';
    var expectedName = 'mytestaccount';
    var expectedKey = 'AhlzsbLRkjfwObuqff3xrhB2yWJNh1EMptmcmxFJ6fvPTVX3PZXwrG2YtYWf5DPMVgNsteKStM5iBLlknYFVoA==';
    var expectedTableEndpoint = 'http://myprivatetabledns.com';
    var expectedBlobEndpoint = 'http://myprivateblobdns.com';
    var expectedQueueEndpoint = 'http://myprivatequeuedns.com';
    var connectionString  = 'DefaultEndpointsProtocol=' + protocol + ';AccountName=' + expectedName + ';AccountKey=' + expectedKey + ';QueueEndpoint=' + expectedQueueEndpoint + ';BlobEndpoint=' + expectedBlobEndpoint+ ';TableEndpoint=' + expectedTableEndpoint;

    // Test
    var actual = StorageServiceSettings.createFromConnectionString(connectionString);

    // Assert
    actual._name.should.equal(expectedName);
    actual._key.should.equal(expectedKey);
    actual._blobEndpointUri.should.equal(expectedBlobEndpoint);
    actual._queueEndpointUri.should.equal(expectedQueueEndpoint);
    actual._tableEndpointUri.should.equal(expectedTableEndpoint);
  });

  test('testCreateFromConnectionStringMissingServicesEndpointsFail', function () {
    // Setup
    var expectedName = 'mytestaccount';
    var expectedKey = 'AhlzsbLRkjfwObuqff3xrhB2yWJNh1EMptmcmxFJ6fvPTVX3PZXwrG2YtYWf5DPMVgNsteKStM5iBLlknYFVoA==';
    var invalidUri = 'https://www.invalid_domain';
    var connectionString  = 'BlobEndpoint=' + invalidUri + ';DefaultEndpointsProtocol=http;AccountName=' + expectedName + ';AccountKey=' + expectedKey;

    // Test
    (function() {
      StorageServiceSettings.createFromConnectionString(connectionString);
    }).should.throw('The provided URI "' + invalidUri + '" is invalid.');
  });

  test('testCreateFromConnectionStringWithInvalidSettingKeyFail', function () {
    // Setup
    var expectedName = 'mytestaccount';
    var expectedKey = 'AhlzsbLRkjfwObuqff3xrhB2yWJNh1EMptmcmxFJ6fvPTVX3PZXwrG2YtYWf5DPMVgNsteKStM5iBLlknYFVoA==';
    var invalidKey = 'InvalidKey';
    var connectionString  = 'DefaultEndpointsProtocol=http;' + invalidKey + '=MyValue;AccountName=' + expectedName + ';AccountKey=' + expectedKey;

    // Test
    (function() {
      StorageServiceSettings.createFromConnectionString(connectionString);
    }).should.throw('Invalid connection string setting key "' + invalidKey.toLowerCase() + '"');
  });

  test('testCreateFromConnectionStringWithCaseInsensitive', function () {
    // Setup
    var protocol = 'https';
    var expectedName = 'mytestaccount';
    var expectedKey = 'AhlzsbLRkjfwObuqff3xrhB2yWJNh1EMptmcmxFJ6fvPTVX3PZXwrG2YtYWf5DPMVgNsteKStM5iBLlknYFVoA==';
    var connectionString  = 'defaultendpointsprotocol=' + protocol + ';accountname=' + expectedName + ';accountkey=' + expectedKey;
    var expectedBlobEndpoint = url.format({ protocol: protocol, host: expectedName + '.' + ConnectionStringKeys.BLOB_BASE_DNS_NAME });
    var expectedQueueEndpoint = url.format({ protocol: protocol, host: expectedName + '.' + ConnectionStringKeys.QUEUE_BASE_DNS_NAME });
    var expectedTableEndpoint = url.format({ protocol: protocol, host: expectedName + '.' + ConnectionStringKeys.TABLE_BASE_DNS_NAME });

    // Test
    var actual = StorageServiceSettings.createFromConnectionString(connectionString);

    // Assert
    actual._name.should.equal(expectedName);
    actual._key.should.equal(expectedKey);
    actual._blobEndpointUri.should.equal(expectedBlobEndpoint);
    actual._queueEndpointUri.should.equal(expectedQueueEndpoint);
    actual._tableEndpointUri.should.equal(expectedTableEndpoint);
  });

  test('getDevelopmentStorageAccount', function () {
    var developmentStorageAccount = StorageServiceSettings._getDevelopmentStorageAccount();

    developmentStorageAccount._name.should.equal('devstoreaccount1');
    developmentStorageAccount._key.should.equal('Eby8vdM02xNOcqFlqUwJPLlmEtlCDXJ1OUzFT50uSRZ6IFsuFq2UVErCz4I6tq/K1SZFPTOtr/KBHBeksoGMGw==');
    developmentStorageAccount._blobEndpointUri.should.equal('http://127.0.0.1:10000');
    developmentStorageAccount._queueEndpointUri.should.equal('http://127.0.0.1:10001');
    developmentStorageAccount._tableEndpointUri.should.equal('http://127.0.0.1:10002');
    developmentStorageAccount._usePathStyleUri.should.equal(true);
  });
});