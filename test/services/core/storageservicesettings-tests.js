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

var testutil = require('../../util/util');
var azure = testutil.libRequire('azure');
var Constants = azure.Constants;
var ConnectionStringKeys = Constants.ConnectionStringKeys;
var StorageServiceSettings = azure.StorageServiceSettings;

suite('storageservicesettings-tests', function () {
  test('testCreateFromConnectionStringWithUseDevStore', function () {
    // Setup
    var connectionString = 'UseDevelopmentStorage=true';
    var expectedName = ConnectionStringKeys.DEV_STORE_NAME;
    var expectedKey = ConnectionStringKeys.DEV_STORE_KEY;
    var expectedBlobEndpoint = Constants.DEV_STORE_URI + ':10000/devstoreaccount1/';
    var expectedQueueEndpoint = Constants.DEV_STORE_URI + ':10001/devstoreaccount1/';
    var expectedTableEndpoint = Constants.DEV_STORE_URI + ':10002/devstoreaccount1/';
    
    // Test
    var actual = StorageServiceSettings.createFromConnectionString(connectionString);
    
    // Assert
    actual._name.should.equal(expectedName);
    actual._key.should.equal(expectedKey);
    actual._blobEndpointUri.should.equal(expectedBlobEndpoint);
    actual._queueEndpointUri.should.equal(expectedQueueEndpoint);
    actual.tableEndpointUri.should.equal(expectedTableEndpoint);
  });
/*
  test('testCreateFromConnectionStringWithUseDevStoreUri', function () {
    // Setup
    var myProxyUri = 'http://222.3.5.6';
    var connectionString = "DevelopmentStorageProxyUri=$myProxyUri;UseDevelopmentStorage=true";
    var expectedName = ConnectionStringKeys.DEV_STORE_NAME;
    var expectedKey = ConnectionStringKeys.DEV_STORE_KEY;
    var expectedBlobEndpoint = myProxyUri + ':10000/devstoreaccount1/';
    var expectedQueueEndpoint = myProxyUri + ':10001/devstoreaccount1/';
    var expectedTableEndpoint = myProxyUri + ':10002/devstoreaccount1/';
    
    // Test
    var actual = StorageServiceSettings.createFromConnectionString(connectionString);
    
    // Assert
    actual._name.should.equal(expectedName);
    actual._key.should.equal(expectedKey);
    actual._blobEndpointUri.should.equal(expectedBlobEndpoint);
    actual._queueEndpointUri.should.equal(expectedQueueEndpoint);
    actual._tableEndpointUri.should.equal(expectedTableEndpoint);
  });

  test('testCreateFromConnectionStringWithInvalidUseDevStoreFail', function () {
    // Setup
    var invalidValue = 'invalid_value';
    var connectionString = 'UseDevelopmentStorage=$invalidValue';

    // Test
    (function() {
      StorageServiceSettings.createFromConnectionString(connectionString);
    }).should.throw('The provided config value ' + invalidValue + 'does not belong to the valid values subset:\n[ true ]');
  });

  test('testCreateFromConnectionStringWithEmptyConnectionStringFail', function () {
    // Setup
    var connectionString = '';

    // Test
    (function() {
      StorageServiceSettings.createFromConnectionString(connectionString);
    }).should.throw('InvalidArgumentException');
  });

  test('getDevelopmentStorageAccount', function () {
    var developmentStorageAccount = StorageServiceSettings._getDevelopmentStorageAccount();

    developmentStorageAccount._name.should.equal('devstoreaccount1');
    developmentStorageAccount._key.should.equal('Eby8vdM02xNOcqFlqUwJPLlmEtlCDXJ1OUzFT50uSRZ6IFsuFq2UVErCz4I6tq/K1SZFPTOtr/KBHBeksoGMGw==');
    developmentStorageAccount._blobEndpointUri.should.equal('http:://127.0.0.1:10000/devstoreaccount1/');
    developmentStorageAccount._queueEndpointUri.should.equal('http:://127.0.0.1:10001/devstoreaccount1/');
    developmentStorageAccount._tableEndpointUri.should.equal('http:://127.0.0.1:10002/devstoreaccount1/');
  });*/
});