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
var ServiceManagementSettings = azure.ServiceManagementSettings;

suite('servicemanagementsettings-tests', function () {
  test('testCreateFromConnectionStringWithAutomaticCase', function () {
    // Setup
    var expectedSubscriptionId = 'mySubscriptionId';
    var expectedCertificatePath = 'C:\\path_to_my_cert.pem';
    var expectedEndpointUri = Constants.SERVICE_MANAGEMENT_URL;
    var connectionString = 'SubscriptionID=' + expectedSubscriptionId + ';CertificatePath=' + expectedCertificatePath;

    // Test
    var actual = ServiceManagementSettings.createFromConnectionString(connectionString);

    // Assert
    actual._subscriptionId.should.equal(expectedSubscriptionId);
    actual._certificatePath.should.equal(expectedCertificatePath);
    actual._endpointUri.should.equal(expectedEndpointUri)
  });

  test('testCreateFromConnectionStringWithExplicitCase', function () {
    // Setup
    var expectedSubscriptionId = 'mySubscriptionId';
    var expectedCertificatePath = 'C:\\path_to_my_cert.pem';
    var expectedEndpointUri = 'http://myprivatedns.com';
    var connectionString = 'SubscriptionID=' + expectedSubscriptionId + ';CertificatePath=' + expectedCertificatePath + ';ServiceManagementEndpoint=' + expectedEndpointUri;

    // Test
    var actual = ServiceManagementSettings.createFromConnectionString(connectionString);

    // Assert
    actual._subscriptionId.should.equal(expectedSubscriptionId);
    actual._certificatePath.should.equal(expectedCertificatePath);
    actual._endpointUri.should.equal(expectedEndpointUri)
  });

  test('testCreateFromConnectionStringWithMissingKeyFail', function () {
    // Setup
    var connectionString = 'CertificatePath=C:\\path_to_my_cert.pem;ServiceManagementEndpoint=http://myprivatedns.com';

    // Test
    (function() {
      ServiceManagementSettings.createFromConnectionString(connectionString);
    }).should.throw('The provided connection string "' + connectionString + '" does not have complete configuration settings.');
  });

  test('testCreateFromConnectionStringWithInvalidServiceManagementKeyFail', function () {
    // Setup
    var invalidKey = 'InvalidKey';
    var connectionString = invalidKey + '=value;SubscriptionID=12345;CertificatePath=C:\\path_to_cert;ServiceManagementEndpoint=http://endpoint.com';

    // Test
    (function() {
      ServiceManagementSettings.createFromConnectionString(connectionString);
    }).should.throw('Invalid connection string setting key "' + invalidKey.toLowerCase() + '"');
  });

  test('testCreateFromConnectionStringWithCaseInsensitive', function () {
    // Setup
    var expectedSubscriptionId = 'mySubscriptionId';
    var expectedCertificatePath = 'C:\\path_to_my_cert.pem';
    var expectedEndpointUri = 'http://myprivatedns.com';
    var connectionString = 'suBscriptIonId=' + expectedSubscriptionId + ';ceRtiFicAtepAth=' + expectedCertificatePath + ';ServiCemAnagemenTendPoinT=' + expectedEndpointUri;

    // Test
    var actual = ServiceManagementSettings.createFromConnectionString(connectionString);

    // Assert
    actual._subscriptionId.should.equal(expectedSubscriptionId);
    actual._certificatePath.should.equal(expectedCertificatePath);
    actual._endpointUri.should.equal(expectedEndpointUri)
  });
});