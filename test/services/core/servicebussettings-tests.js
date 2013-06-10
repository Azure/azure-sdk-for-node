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
    var expected = new ExpectedConnectionString('mynamespace', 'myname', 'mypassword');

    // Test
    var actual = ServiceBusSettings.createFromConnectionString(expected.connectionString);

    // Assert
    expected.shouldMatchSettings(actual);
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

  test('testCreateFromConnectionStringWithCaseInsensitive', function () {
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

  test('testCreateFromConfigWithConnectionStringSucceeds', function () {
    // Setup
    var expected = new ExpectedConnectionString('mynamespace', 'myname', 'mypassword');

    azure.configure('servicebussettingstestenvironment', function (c) {
      c.set('service bus connection string', expected.connectionString);
    });

    // Test
    var actual = ServiceBusSettings.createFromConfig(azure.config('servicebussettingstestenvironment'));

    // Assert
    expected.shouldMatchSettings(actual);
  });

  test('testCreateFromConfigWithNoConfigUsesDefault', function () {
    var expected = new ExpectedConnectionString('namespacefromdefault', 'wrapnamefromdefault', 'passwordfromdefault');
    var originalEnvironment = process.env.NODE_ENV;
    process.env.NODE_ENV = 'testenvironment';

    azure.configure('testenvironment', function (c) {
      c.set('service bus connection string', expected.connectionString);
    });

    try {
      var actual = ServiceBusSettings.createFromConfig();

      expected.shouldMatchSettings(actual);
    } finally {
      process.env.NODE_ENV = originalEnvironment;
    }
  });

  test('testCreateFromConfigWithNoSettingFallsBackToEnvironmentVariable', function () {
    var expected = new ExpectedConnectionString('namespacefromenv', 'wrapnameenv', 'passwordenv');
    var originalVar = process.env.AZURE_SERVICEBUS_CONNECTIONSTRING;
    process.env.AZURE_SERVICEBUS_CONNECTIONSTRING = expected.connectionString;
    try {
      var actual = ServiceBusSettings.createFromConfig();

      expected.shouldMatchSettings(actual);
    } finally {
      process.env.AZURE_SERVICBUS_CONNECTIONSTRING = originalVar;
    }
  });
});

// Helper functions for creating and verifying namespaces

function ExpectedConnectionString(namespace, wrapName, wrapPassword) {
    this.expectedNamespace = namespace;
    this.expectedServiceBusEndpoint = 'https://' + this.expectedNamespace + '.servicebus.windows.net';
    this.expectedWrapName = wrapName;
    this.expectedWrapPassword = wrapPassword;
    this.expectedWrapEndpointUri = 'https://' + this.expectedNamespace + '-sb.accesscontrol.windows.net:443/WRAPv0.9';
    this.connectionString = 'Endpoint=' + this.expectedServiceBusEndpoint + ';SharedSecretIssuer=' + this.expectedWrapName + ';SharedSecretValue=' + this.expectedWrapPassword;
}

ExpectedConnectionString.prototype.shouldMatchSettings = function (settings) {
    settings._namespace.should.equal(this.expectedNamespace);
    settings._serviceBusEndpointUri.should.equal(this.expectedServiceBusEndpoint);
    settings._wrapName.should.equal(this.expectedWrapName);
    settings._wrapPassword.should.equal(this.expectedWrapPassword);
    settings._wrapEndpointUri.should.equal(this.expectedWrapEndpointUri);
}
