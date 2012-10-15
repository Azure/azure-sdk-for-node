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
var ServiceBusSettings = azure.ServiceBusSettings;

suite('servicebussettings-tests', function () {
  test('testCreateFromConnectionStringWithServiceBusAutomaticCase', function () {
    // Setup
    var expectedNamespace = 'mynamespace';
    var expectedServiceBusEndpoint = 'https://' + expectedNamespace + '.servicebus.windows.net';
    var expectedWrapName = 'myname';
    var expectedWrapPassword = 'mypassword';
    var expectedWrapEndpointUri = 'https://' + expectedNamespace + '-sb.accesscontrol.windows.net:443/WRAPv0.9';
    var connectionString = 'Endpoint=' + expectedServiceBusEndpoint + ';SharedSecretIssuer=' + expectedWrapName + ';SharedSecretValue=' + expectedWrapPassword;

    // Test
    var actual = ServiceBusSettings.createFromConnectionString(connectionString);

    // Assert
    actual._namespace.should.equal(expectedNamespace);
    actual._serviceBusEndpointUri.should.equal(expectedServiceBusEndpoint);
    actual._wrapName.should.equal(expectedWrapName);
    actual._wrapPassword.should.equal(expectedWrapPassword);
    actual._wrapEndpointUri.should.equal(expectedWrapEndpointUri);
  });

  test('testCreateFromConnectionStringWithMissingServiceBusEndpointFail', function () {
    // Setup
    var connectionString = 'SharedSecretIssuer=name;SharedSecretValue=password';

    // Test
    (function() {
      ServiceBusSettings.createFromConnectionString(connectionString);
    }).should.throw('The provided connection string "' + connectionString + '" does not have complete configuration settings.');
  });

  test('testCreateFromConnectionStringWithInvalidServiceBusKeyFail', function () {
    // Setup
    var invalidKey = 'InvalidKey';
    var connectionString = invalidKey + '=value;SharedSecretIssuer=name;SharedSecretValue=password';

    // Test
    (function() {
      ServiceBusSettings.createFromConnectionString(connectionString);
    }).should.throw('Invalid connection string setting key "' + invalidKey.toLowerCase() + '"');
  });

  test('testCreateFromConnectionStringWithCaseInvesitive', function () {
    // Setup
    var expectedNamespace = 'mynamespace';
    var expectedServiceBusEndpoint = 'https://' + expectedNamespace + '.servicebus.windows.net';
    var expectedWrapName = 'myname';
    var expectedWrapPassword = 'mypassword';
    var expectedWrapEndpointUri = 'https://' + expectedNamespace + '-sb.accesscontrol.windows.net:443/WRAPv0.9';
    var connectionString = 'eNdPoinT=' + expectedServiceBusEndpoint + ';sHarEdsecRetiSsuer=' + expectedWrapName + ';shArEdsecrEtvAluE=' + expectedWrapPassword;
        
    // Test
    var actual = ServiceBusSettings.createFromConnectionString(connectionString);

    // Assert
    actual._namespace.should.equal(expectedNamespace);
    actual._serviceBusEndpointUri.should.equal(expectedServiceBusEndpoint);
    actual._wrapName.should.equal(expectedWrapName);
    actual._wrapPassword.should.equal(expectedWrapPassword);
    actual._wrapEndpointUri.should.equal(expectedWrapEndpointUri);
  });
});