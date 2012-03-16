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

var assert = require('assert');
var net = require('net');

var RuntimeKernel = require('../../lib/serviceruntime/runtimekernel');
var NamedPipeInputChannel = require('../../lib/serviceruntime/namedpipeinputchannel');
var RuntimeVersionProtocolClient = require('../../lib/serviceruntime/runtimeversionprotocolclient');
var RuntimeVersionManager = require('../../lib/serviceruntime/runtimeversionmanager');

var Constants = require('../../lib/util/constants');
var ServiceRuntimeConstants = Constants.ServiceRuntimeConstants;

var azure = require('../../lib/azure');

var originalFileInputChannelReadData;
var originalNamedPipeInputChannelReadData;
var originalNamedPipeOutputChannelWriteOutputChannel;
var originalVersionEndpointFixedPath;
var originalRuntimeClient;
var originalEndpoint;

suite('roleenvironment-tests', function () {
  setup(function (done) {
    var runtimeKernel = RuntimeKernel.getKernel();

    originalFileInputChannelReadData = runtimeKernel.fileInputChannel._readData;
    originalNamedPipeInputChannelReadData = runtimeKernel.namedPipeInputChannel._readData;
    originalNamedPipeOutputChannelWriteOutputChannel = runtimeKernel.namedPipeOutputChannel.writeOutputChannel;
    originalVersionEndpointFixedPath = azure.RoleEnvironment.VersionEndpointFixedPath;
    originalRuntimeClient = azure.RoleEnvironment.runtimeClient;
    originalEndpoint = runtimeKernel.protocol1RuntimeGoalStateClient.endpoint;

    done();
  });

  teardown(function (done) {
    var runtimeKernel = RuntimeKernel.getKernel();

    runtimeKernel.namedPipeInputChannel._readData = originalNamedPipeInputChannelReadData;
    runtimeKernel.fileInputChannel._readData = originalFileInputChannelReadData;
    runtimeKernel.protocol1RuntimeGoalStateClient.currentGoalState = null;
    runtimeKernel.protocol1RuntimeGoalStateClient.currentEnvironmentData = null;
    runtimeKernel.protocol1RuntimeGoalStateClient.endpoint = originalEndpoint;

    azure.RoleEnvironment.VersionEndpointFixedPath = originalVersionEndpointFixedPath;
    azure.RoleEnvironment.runtimeClient = originalRuntimeClient;

    done();
  });

  test('eventEmitter', function (done) {
    // No event listeners registered yet
    assert.equal(azure.RoleEnvironment.listeners(ServiceRuntimeConstants.CHANGED).length, 0);

    // Register one event listener
    var listener = function () { };
    azure.RoleEnvironment.on(ServiceRuntimeConstants.CHANGED, listener);
    assert.equal(azure.RoleEnvironment.listeners(ServiceRuntimeConstants.CHANGED).length, 1);

    // Remove the event listener
    azure.RoleEnvironment.removeListener(ServiceRuntimeConstants.CHANGED, listener);
    assert.equal(azure.RoleEnvironment.listeners(ServiceRuntimeConstants.CHANGED).length, 0);

    done();
  });

  test('IsAvailable', function (done) {
    azure.RoleEnvironment.isAvailable(function (error1, isAvailable1) {
      assert.notEqual(error1, null);
      assert.equal(isAvailable1, false);

      var runtimeKernel = RuntimeKernel.getKernel();
      runtimeKernel.namedPipeInputChannel._readData = function (name, callback) {
        if (name === '\\\\.\\pipe\\WindowsAzureRuntime') {
          callback(undefined,
            "<?xml version=\"1.0\" encoding=\"utf-8\"?>" +
            "<RuntimeServerDiscovery xmlns:xsi=\"http://www.w3.org/2001/XMLSchema-instance\"" +
            "xmlns:xsd=\"http://www.w3.org/2001/XMLSchema\">" +
            "<RuntimeServerEndpoints>" +
            "<RuntimeServerEndpoint version=\"2011-03-08\" path=\"SomePath.GoalState\" />" +
            "</RuntimeServerEndpoints>" +
            "</RuntimeServerDiscovery>");
        } else if (name === 'SomePath.GoalState') {
          callback(undefined,
            "<?xml version=\"1.0\" encoding=\"utf-8\"?>" +
            "<GoalState xmlns:xsi=\"http://www.w3.org/2001/XMLSchema-instance\"" +
            "xmlns:xsd=\"http://www.w3.org/2001/XMLSchema\">" +
            "<Incarnation>1</Incarnation>" +
            "<ExpectedState>Started</ExpectedState>" +
            "<RoleEnvironmentPath>C:\\file.xml</RoleEnvironmentPath>" +
            "<CurrentStateEndpoint>\\.\pipe\WindowsAzureRuntime.CurrentState</CurrentStateEndpoint>" +
            "<Deadline>9999-12-31T23:59:59.9999999</Deadline>" +
            "</GoalState>");
        } else {
          callback('wrong file');
        }
      };

      runtimeKernel.fileInputChannel._readData = function (name, callback) {
        if (name === 'C:\\file.xml') {
          callback(undefined,
            "<?xml version=\"1.0\" encoding=\"utf-8\"?>" +
            "<RoleEnvironment xmlns:xsi=\"http://www.w3.org/2001/XMLSchema-instance\"" +
            "xmlns:xsd=\"http://www.w3.org/2001/XMLSchema\">" +
            "<Deployment id=\"92f5cd71a4c048ed94e1b130bd0c4639\" emulated=\"false\" />" +
            "<CurrentInstance id=\"geophotoapp_IN_0\" roleName=\"geophotoapp\" faultDomain=\"0\" updateDomain=\"0\">" +
            "<ConfigurationSettings />" +
            "<LocalResources>" +
            "<LocalResource name=\"DiagnosticStore\" path=\"somepath.DiagnosticStore\" sizeInMB=\"4096\" />" +
            "</LocalResources>" +
            "<Endpoints>" +
            "<Endpoint name=\"HttpIn\" address=\"10.114.250.21\" port=\"80\" protocol=\"tcp\" />" +
            "</Endpoints>" +
            "</CurrentInstance>" +
            "<Roles />" +
            "</RoleEnvironment>");
        } else {
          callback('wrong file');
        }
      };

      azure.RoleEnvironment.isAvailable(function (error2, isAvailable2) {
        assert.equal(error2, null);
        assert.equal(isAvailable2, true);

        done();
      });
    });
  });

  test('GetLocalResourcesNoGoalStateNamedPipe', function (done) {
    assert.throws(
  azure.RoleEnvironment.getLocalResources(function () { }),
  Error
  );

    done();
  });

  test('GetDeploymentId', function (done) {
    var runtimeKernel = RuntimeKernel.getKernel();
    runtimeKernel.namedPipeInputChannel._readData = function (name, callback) {
      if (name === '\\\\.\\pipe\\WindowsAzureRuntime') {
        callback(undefined,
          "<?xml version=\"1.0\" encoding=\"utf-8\"?>" +
          "<RuntimeServerDiscovery xmlns:xsi=\"http://www.w3.org/2001/XMLSchema-instance\"" +
          "xmlns:xsd=\"http://www.w3.org/2001/XMLSchema\">" +
          "<RuntimeServerEndpoints>" +
          "<RuntimeServerEndpoint version=\"2011-03-08\" path=\"SomePath.GoalState\" />" +
          "</RuntimeServerEndpoints>" +
          "</RuntimeServerDiscovery>");
      } else if (name === 'SomePath.GoalState') {
        callback(undefined,
          "<?xml version=\"1.0\" encoding=\"utf-8\"?>" +
          "<GoalState xmlns:xsi=\"http://www.w3.org/2001/XMLSchema-instance\"" +
          "xmlns:xsd=\"http://www.w3.org/2001/XMLSchema\">" +
          "<Incarnation>1</Incarnation>" +
          "<ExpectedState>Started</ExpectedState>" +
          "<RoleEnvironmentPath>C:\\file.xml</RoleEnvironmentPath>" +
          "<CurrentStateEndpoint>\\.\pipe\WindowsAzureRuntime.CurrentState</CurrentStateEndpoint>" +
          "<Deadline>9999-12-31T23:59:59.9999999</Deadline>" +
          "</GoalState>");
      } else {
        callback('wrong file');
      }
    };

    runtimeKernel.fileInputChannel._readData = function (name, callback) {
      if (name === 'C:\\file.xml') {
        callback(undefined,
          "<?xml version=\"1.0\" encoding=\"utf-8\"?>" +
          "<RoleEnvironment xmlns:xsi=\"http://www.w3.org/2001/XMLSchema-instance\"" +
          "xmlns:xsd=\"http://www.w3.org/2001/XMLSchema\">" +
          "<Deployment id=\"mydeploymentid\" emulated=\"false\" />" +
          "<CurrentInstance id=\"geophotoapp_IN_0\" roleName=\"geophotoapp\" faultDomain=\"0\" updateDomain=\"0\">" +
          "<ConfigurationSettings />" +
          "<LocalResources>" +
          "<LocalResource name=\"DiagnosticStore\" path=\"somepath.DiagnosticStore\" sizeInMB=\"4096\" />" +
          "</LocalResources>" +
          "<Endpoints>" +
          "<Endpoint name=\"HttpIn\" address=\"10.114.250.21\" port=\"80\" protocol=\"tcp\" />" +
          "</Endpoints>" +
          "</CurrentInstance>" +
          "<Roles />" +
          "</RoleEnvironment>");
      } else {
        callback('wrong file');
      }
    };

    azure.RoleEnvironment.getDeploymentId(function (error, id) {
      assert.equal(error, null);
      assert.equal(id, 'mydeploymentid');

      done();
    });
  });

  test('GetLocalResources', function (done) {
    var runtimeKernel = RuntimeKernel.getKernel();
    runtimeKernel.namedPipeInputChannel._readData = function (name, callback) {
      if (name === '\\\\.\\pipe\\WindowsAzureRuntime') {
        callback(undefined,
          "<?xml version=\"1.0\" encoding=\"utf-8\"?>" +
          "<RuntimeServerDiscovery xmlns:xsi=\"http://www.w3.org/2001/XMLSchema-instance\"" +
          "xmlns:xsd=\"http://www.w3.org/2001/XMLSchema\">" +
          "<RuntimeServerEndpoints>" +
          "<RuntimeServerEndpoint version=\"2011-03-08\" path=\"SomePath.GoalState\" />" +
          "</RuntimeServerEndpoints>" +
          "</RuntimeServerDiscovery>");
      } else if (name === 'SomePath.GoalState') {
        callback(undefined,
          "<?xml version=\"1.0\" encoding=\"utf-8\"?>" +
          "<GoalState xmlns:xsi=\"http://www.w3.org/2001/XMLSchema-instance\"" +
          "xmlns:xsd=\"http://www.w3.org/2001/XMLSchema\">" +
          "<Incarnation>1</Incarnation>" +
          "<ExpectedState>Started</ExpectedState>" +
          "<RoleEnvironmentPath>C:\\file.xml</RoleEnvironmentPath>" +
          "<CurrentStateEndpoint>\\.\pipe\WindowsAzureRuntime.CurrentState</CurrentStateEndpoint>" +
          "<Deadline>9999-12-31T23:59:59.9999999</Deadline>" +
          "</GoalState>");
      } else {
        callback('wrong file');
      }
    };

    runtimeKernel.fileInputChannel._readData = function (name, callback) {
      if (name === 'C:\\file.xml') {
        callback(undefined,
          "<?xml version=\"1.0\" encoding=\"utf-8\"?>" +
          "<RoleEnvironment xmlns:xsi=\"http://www.w3.org/2001/XMLSchema-instance\"" +
          "xmlns:xsd=\"http://www.w3.org/2001/XMLSchema\">" +
          "<Deployment id=\"92f5cd71a4c048ed94e1b130bd0c4639\" emulated=\"false\" />" +
          "<CurrentInstance id=\"geophotoapp_IN_0\" roleName=\"geophotoapp\" faultDomain=\"0\" updateDomain=\"0\">" +
          "<ConfigurationSettings />" +
          "<LocalResources>" +
          "<LocalResource name=\"DiagnosticStore\" path=\"somepath.DiagnosticStore\" sizeInMB=\"4096\" />" +
          "</LocalResources>" +
          "<Endpoints>" +
          "<Endpoint name=\"HttpIn\" address=\"10.114.250.21\" port=\"80\" protocol=\"tcp\" />" +
          "</Endpoints>" +
          "</CurrentInstance>" +
          "<Roles />" +
          "</RoleEnvironment>");
      } else {
        callback('wrong file');
      }
    };

    azure.RoleEnvironment.getLocalResources(function (error, localResources) {
      assert.equal(error, null);
      assert.notEqual(localResources, null);
      assert.notEqual(localResources['DiagnosticStore'], null);
      assert.notEqual(localResources['DiagnosticStore']['path'], null);
      assert.notEqual(localResources['DiagnosticStore']['sizeInMB'], null);

      done();
    });
  });

  test('GetRoles', function (done) {
    var runtimeKernel = RuntimeKernel.getKernel();
    runtimeKernel.namedPipeInputChannel._readData = function (name, callback) {
      if (name === '\\\\.\\pipe\\WindowsAzureRuntime') {
        callback(undefined,
          "<?xml version=\"1.0\" encoding=\"utf-8\"?>" +
          "<RuntimeServerDiscovery xmlns:xsi=\"http://www.w3.org/2001/XMLSchema-instance\"" +
          "xmlns:xsd=\"http://www.w3.org/2001/XMLSchema\">" +
          "<RuntimeServerEndpoints>" +
          "<RuntimeServerEndpoint version=\"2011-03-08\" path=\"SomePath.GoalState\" />" +
          "</RuntimeServerEndpoints>" +
          "</RuntimeServerDiscovery>");
      } else if (name === 'SomePath.GoalState') {
        callback(undefined,
          "<?xml version=\"1.0\" encoding=\"utf-8\"?>" +
          "<GoalState xmlns:xsi=\"http://www.w3.org/2001/XMLSchema-instance\"" +
          "xmlns:xsd=\"http://www.w3.org/2001/XMLSchema\">" +
          "<Incarnation>1</Incarnation>" +
          "<ExpectedState>Started</ExpectedState>" +
          "<RoleEnvironmentPath>C:\\file.xml</RoleEnvironmentPath>" +
          "<CurrentStateEndpoint>\\.\pipe\WindowsAzureRuntime.CurrentState</CurrentStateEndpoint>" +
          "<Deadline>9999-12-31T23:59:59.9999999</Deadline>" +
          "</GoalState>");
      } else {
        callback('wrong file');
      }
    };

    runtimeKernel.fileInputChannel._readData = function (name, callback) {
      if (name === 'C:\\file.xml') {
        callback(undefined,
          "<?xml version=\"1.0\" encoding=\"utf-8\"?>" +
          "<RoleEnvironment xmlns:xsi=\"http://www.w3.org/2001/XMLSchema-instance\"" +
          "xmlns:xsd=\"http://www.w3.org/2001/XMLSchema\">" +
          "<Deployment id=\"92f5cd71a4c048ed94e1b130bd0c4639\" emulated=\"false\" />" +
          "<CurrentInstance id=\"geophotoapp_IN_0\" roleName=\"role1\" faultDomain=\"0\" updateDomain=\"0\">" +
          "<ConfigurationSettings />" +
          "<LocalResources />" +
          "<Endpoints>" +
          "<Endpoint name=\"HttpIn\" address=\"10.114.250.21\" port=\"80\" protocol=\"tcp\" />" +
          "</Endpoints>" +
          "</CurrentInstance>" +
          "<Roles>" +
          "<Role name=\"role1\">" +
          "<Instances>" +
          "<Instance id=\"deployment16(191).test.role1_IN_0\" faultDomain=\"0\" updateDomain=\"0\">" +
          "<Endpoints>" +
          "<Endpoint name=\"MyInternalEndpoint1\" address=\"127.255.0.0\" port=\"20000\" protocol=\"tcp\" />" +
          "</Endpoints>" +
          "</Instance>" +
          "</Instances>" +
          "</Role>" +
          "<Role name=\"role2\">" +
          "<Instances>" +
          "<Instance id=\"deployment16(191).test.role2_IN_0\" faultDomain=\"0\" updateDomain=\"0\">" +
          "<Endpoints>" +
          "<Endpoint name=\"MyInternalEndpoint2\" address=\"127.255.0.2\" port=\"20002\" protocol=\"tcp\" />" +
          "</Endpoints>" +
          "</Instance>" +
          "<Instance id=\"deployment16(191).test.role2_IN_1\" faultDomain=\"0\" updateDomain=\"0\">" +
          "<Endpoints>" +
          "<Endpoint name=\"MyInternalEndpoint3\" address=\"127.255.0.3\" port=\"20002\" protocol=\"tcp\" />" +
          "<Endpoint name=\"MyInternalEndpoint4\" address=\"127.255.0.3\" port=\"20004\" protocol=\"tcp\" />" +
          "</Endpoints>" +
          "</Instance>" +
          "</Instances>" +
          "</Role>" +
          "</Roles>" +
          "</RoleEnvironment>");
      } else {
        callback('wrong file');
      }
    };

    azure.RoleEnvironment.getRoles(function (error, roles) {
      assert.equal(error, null);
      assert.notEqual(roles, null);
      assert.notEqual(roles['role1'], null);
      assert.notEqual(roles['role1']['deployment16(191).test.role1_IN_0'], null);
      assert.notEqual(roles['role1']['geophotoapp_IN_0'], null);

      assert.notEqual(roles['role2'], null);
      assert.notEqual(roles['role2']['deployment16(191).test.role2_IN_0'], null);
      assert.notEqual(roles['role2']['deployment16(191).test.role2_IN_1'], null);

      done();
    });
  });

  test('CalculateChanges', function (done) {
    var runtimeKernel = RuntimeKernel.getKernel();
    runtimeKernel.namedPipeInputChannel._readData = function (name, callback) {
      if (name === '\\\\.\\pipe\\WindowsAzureRuntime') {
        callback(undefined,
          "<?xml version=\"1.0\" encoding=\"utf-8\"?>" +
          "<RuntimeServerDiscovery xmlns:xsi=\"http://www.w3.org/2001/XMLSchema-instance\"" +
          "xmlns:xsd=\"http://www.w3.org/2001/XMLSchema\">" +
          "<RuntimeServerEndpoints>" +
          "<RuntimeServerEndpoint version=\"2011-03-08\" path=\"SomePath.GoalState\" />" +
          "</RuntimeServerEndpoints>" +
          "</RuntimeServerDiscovery>");
      } else if (name === 'SomePath.GoalState') {
        callback(undefined,
          "<?xml version=\"1.0\" encoding=\"utf-8\"?>" +
          "<GoalState xmlns:xsi=\"http://www.w3.org/2001/XMLSchema-instance\"" +
          "xmlns:xsd=\"http://www.w3.org/2001/XMLSchema\">" +
          "<Incarnation>1</Incarnation>" +
          "<ExpectedState>Started</ExpectedState>" +
          "<RoleEnvironmentPath>C:\\file.xml</RoleEnvironmentPath>" +
          "<CurrentStateEndpoint>\\.\pipe\WindowsAzureRuntime.CurrentState</CurrentStateEndpoint>" +
          "<Deadline>9999-12-31T23:59:59.9999999</Deadline>" +
          "</GoalState>");
      } else {
        callback('wrong file');
      }
    };

    runtimeKernel.fileInputChannel._readData = function (name, callback) {
      if (name === 'C:\\file.xml') {
        callback(undefined,
          "<?xml version=\"1.0\" encoding=\"utf-8\"?>" +
          "<RoleEnvironment xmlns:xsi=\"http://www.w3.org/2001/XMLSchema-instance\"" +
          "xmlns:xsd=\"http://www.w3.org/2001/XMLSchema\">" +
          "<Deployment id=\"92f5cd71a4c048ed94e1b130bd0c4639\" emulated=\"false\" />" +
          "<CurrentInstance id=\"geophotoapp_IN_0\" roleName=\"role1\" faultDomain=\"0\" updateDomain=\"0\">" +
          "<ConfigurationSettings />" +
          "<LocalResources />" +
          "<Endpoints>" +
          "<Endpoint name=\"HttpIn\" address=\"10.114.250.21\" port=\"80\" protocol=\"tcp\" />" +
          "</Endpoints>" +
          "</CurrentInstance>" +
          "<Roles>" +
          "<Role name=\"role1\">" +
          "<Instances>" +
          "<Instance id=\"deployment16(191).test.role1_IN_0\" faultDomain=\"0\" updateDomain=\"0\">" +
          "<Endpoints>" +
          "<Endpoint name=\"MyInternalEndpoint1\" address=\"127.255.0.0\" port=\"20000\" protocol=\"tcp\" />" +
          "</Endpoints>" +
          "</Instance>" +
          "</Instances>" +
          "</Role>" +
          "<Role name=\"role2\">" +
          "<Instances>" +
          "<Instance id=\"deployment16(191).test.role2_IN_0\" faultDomain=\"0\" updateDomain=\"0\">" +
          "<Endpoints>" +
          "<Endpoint name=\"MyInternalEndpoint2\" address=\"127.255.0.2\" port=\"20002\" protocol=\"tcp\" />" +
          "</Endpoints>" +
          "</Instance>" +
          "<Instance id=\"deployment16(191).test.role2_IN_1\" faultDomain=\"0\" updateDomain=\"0\">" +
          "<Endpoints>" +
          "<Endpoint name=\"MyInternalEndpoint3\" address=\"127.255.0.3\" port=\"20002\" protocol=\"tcp\" />" +
          "<Endpoint name=\"MyInternalEndpoint4\" address=\"127.255.0.3\" port=\"20004\" protocol=\"tcp\" />" +
          "</Endpoints>" +
          "</Instance>" +
          "</Instances>" +
          "</Role>" +
          "</Roles>" +
          "</RoleEnvironment>");
      } else {
        callback('wrong file');
      }
    };

    // do first call to get environment data
    azure.RoleEnvironment.getRoles(function (error, roles) {
      assert.equal(error, null);
      assert.notEqual(roles, null);

      // explicitly call calculate changes to reread and compare to previous environment data
      azure.RoleEnvironment._calculateChanges(function (calculateChangesError, changes) {
        assert.equal(calculateChangesError, null);
        assert.notEqual(changes, null);
        assert.equal(changes.length, 0);

        done();
      });
    });
  });

  test('testRequestRecycle', function (done) {
    var runtimeKernel = RuntimeKernel.getKernel();
    runtimeKernel.namedPipeInputChannel._readData = function (name, callback) {
      if (name === '\\\\.\\pipe\\WindowsAzureRuntime') {
        callback(undefined,
          "<?xml version=\"1.0\" encoding=\"utf-8\"?>" +
          "<RuntimeServerDiscovery xmlns:xsi=\"http://www.w3.org/2001/XMLSchema-instance\"" +
          "xmlns:xsd=\"http://www.w3.org/2001/XMLSchema\">" +
          "<RuntimeServerEndpoints>" +
          "<RuntimeServerEndpoint version=\"2011-03-08\" path=\"SomePath.GoalState\" />" +
          "</RuntimeServerEndpoints>" +
          "</RuntimeServerDiscovery>");
      } else if (name === 'SomePath.GoalState') {
        callback(undefined,
          "<?xml version=\"1.0\" encoding=\"utf-8\"?>" +
          "<GoalState xmlns:xsi=\"http://www.w3.org/2001/XMLSchema-instance\"" +
          "xmlns:xsd=\"http://www.w3.org/2001/XMLSchema\">" +
          "<Incarnation>1</Incarnation>" +
          "<ExpectedState>Started</ExpectedState>" +
          "<RoleEnvironmentPath>C:\\file.xml</RoleEnvironmentPath>" +
          "<CurrentStateEndpoint>\\.\pipe\WindowsAzureRuntime.CurrentState</CurrentStateEndpoint>" +
          "<Deadline>9999-12-31T23:59:59.9999999</Deadline>" +
          "</GoalState>");
      } else {
        callback('wrong file');
      }
    };

    runtimeKernel.fileInputChannel._readData = function (name, callback) {
      if (name === 'C:\\file.xml') {
        callback(undefined,
          "<?xml version=\"1.0\" encoding=\"utf-8\"?>" +
          "<RoleEnvironment xmlns:xsi=\"http://www.w3.org/2001/XMLSchema-instance\"" +
          "xmlns:xsd=\"http://www.w3.org/2001/XMLSchema\">" +
          "<Deployment id=\"deploymentId\" emulated=\"false\" />" +
          "<CurrentInstance id=\"test\" roleName=\"test\" faultDomain=\"0\" updateDomain=\"0\">" +
          "<ConfigurationSettings />" +
          "<LocalResources />" +
          "<Endpoints />" +
          "</CurrentInstance>" +
          "<Roles />" +
          "</RoleEnvironment>");
      } else {
        callback('wrong file');
      }
    };

    var writtenData;
    runtimeKernel.namedPipeOutputChannel.writeOutputChannel = function (name, data, callback) {
      writtenData = data;
      callback();
    };

    azure.RoleEnvironment.requestRecycle(function (error) {
      assert.equal(error, null);

      assert.equal(writtenData, '<?xml version="1.0" encoding="utf-8" standalone="yes"?><CurrentState><StatusLease ClientId="' + azure.RoleEnvironment.clientId + '"><Acquire><Incarnation>1</Incarnation><Status>' + ServiceRuntimeConstants.RoleStatus.RECYCLE + '</Status><StatusDetail>' + ServiceRuntimeConstants.RoleStatus.RECYCLE + '</StatusDetail><Expiration>9999-12-31T23:59:59.999Z</Expiration></Acquire></StatusLease></CurrentState>');

      done();
    });
  });

  test('testStartedChangedNotifications', function (done) {
    var versionsXml = "<?xml version=\"1.0\" encoding=\"utf-8\"?>" +
      "<RuntimeServerDiscovery xmlns:xsi=\"http://www.w3.org/2001/XMLSchema-instance\"" +
      "xmlns:xsd=\"http://www.w3.org/2001/XMLSchema\">" +
      "<RuntimeServerEndpoints>" +
      "<RuntimeServerEndpoint version=\"2011-03-08\" path=\"\\\\.\\pipe\\goalState\" />" +
      "</RuntimeServerEndpoints>" +
      "</RuntimeServerDiscovery>";

    var goalStateXml = "<?xml version=\"1.0\" encoding=\"utf-8\"?>" +
      "<GoalState xmlns:xsi=\"http://www.w3.org/2001/XMLSchema-instance\"" +
      "xmlns:xsd=\"http://www.w3.org/2001/XMLSchema\">" +
      "<Incarnation>1</Incarnation>" +
      "<ExpectedState>Started</ExpectedState>" +
      "<RoleEnvironmentPath>C:\\file.xml</RoleEnvironmentPath>" +
      "<CurrentStateEndpoint>\\.\pipe\WindowsAzureRuntime.CurrentState</CurrentStateEndpoint>" +
      "<Deadline>9999-12-31T23:59:59.9999999</Deadline>" +
      "</GoalState>";

    var environmentData = "<?xml version=\"1.0\" encoding=\"utf-8\"?>" +
      "<RoleEnvironment xmlns:xsi=\"http://www.w3.org/2001/XMLSchema-instance\"" +
      "xmlns:xsd=\"http://www.w3.org/2001/XMLSchema\">" +
      "<Deployment id=\"deploymentId\" emulated=\"false\" />" +
      "<CurrentInstance id=\"test\" roleName=\"test\" faultDomain=\"0\" updateDomain=\"0\">" +
      "<ConfigurationSettings />" +
      "<LocalResources />" +
      "<Endpoints />" +
      "</CurrentInstance>" +
      "<Roles />" +
      "</RoleEnvironment>";

    // Create versions pipe
    var serverVersionsStream;
    var serverVersions = net.createServer(function (stream) {
      serverVersionsStream = stream;

      stream.setEncoding('utf8');
      stream.on('connect', function () {
        stream.write(versionsXml);
      });

      stream.on('end', function () {
        stream.end();
      });
    });

    serverVersions.listen('\\\\.\\pipe\\versions');

    // Create goal state pipe
    var serverGoalStateInterval;
    var serverGoalStateStream;
    var serverGoalState = net.createServer(function (stream) {
      serverGoalStateStream = stream;

      stream.setEncoding('utf8');
      stream.on('connect', function () {
        // Write goal state every second
        serverGoalStateInterval = setInterval(function () {
          stream.write(goalStateXml);
        }, 1000);
      });

      stream.on('end', function () {
        stream.end();
      });
    });

    serverGoalState.listen('\\\\.\\pipe\\goalState');

    var runtimeKernel = RuntimeKernel.getKernel();
    runtimeKernel.fileInputChannel._readData = function (name, callback) {
      if (name === 'C:\\file.xml') {
        callback(undefined, environmentData);
      } else {
        callback('wrong file');
      }
    };

    azure.RoleEnvironment.VersionEndpointFixedPath = '\\\\.\\pipe\\versions';
    azure.RoleEnvironment.runtimeClient = null;

    var changingInvoked = false;

    azure.RoleEnvironment.on(ServiceRuntimeConstants.CHANGING, function () {
      changingInvoked = true;
    });

    azure.RoleEnvironment.on(ServiceRuntimeConstants.CHANGED, function (changes) {
      assert.equal(changingInvoked, true);

      assert.notEqual(changes, null);
      assert.equal(changes.length, 1);
      assert.equal(changes[0].type, 'TopologyChange');
      assert.equal(changes[0].name, 'test');

      clearInterval(serverGoalStateInterval);

      serverVersions.on('close', function () {
        serverGoalState.on('close', function () {
          done();
        });

        serverGoalStateStream.end();
        serverGoalState.close();
      });

      serverVersionsStream.end();
      serverVersions.close();
    });

    // Make sure incarnation 1 is read
    azure.RoleEnvironment.getConfigurationSettings(function (error) {
      // Update to incarnation 2
      goalStateXml = "<?xml version=\"1.0\" encoding=\"utf-8\"?>" +
        "<GoalState xmlns:xsi=\"http://www.w3.org/2001/XMLSchema-instance\"" +
        "xmlns:xsd=\"http://www.w3.org/2001/XMLSchema\">" +
        "<Incarnation>2</Incarnation>" +
        "<ExpectedState>Started</ExpectedState>" +
        "<RoleEnvironmentPath>C:\\file.xml</RoleEnvironmentPath>" +
        "<CurrentStateEndpoint>\\.\pipe\WindowsAzureRuntime.CurrentState</CurrentStateEndpoint>" +
        "<Deadline>9999-12-31T23:59:59.9999999</Deadline>" +
        "</GoalState>";

      environmentData = "<?xml version=\"1.0\" encoding=\"utf-8\"?>" +
        "<RoleEnvironment xmlns:xsi=\"http://www.w3.org/2001/XMLSchema-instance\"" +
        "xmlns:xsd=\"http://www.w3.org/2001/XMLSchema\">" +
        "<Deployment id=\"deploymentId\" emulated=\"false\" />" +
        "<CurrentInstance id=\"test\" roleName=\"test\" faultDomain=\"0\" updateDomain=\"1\">" +
        "<ConfigurationSettings />" +
        "<LocalResources />" +
        "<Endpoints />" +
        "</CurrentInstance>" +
        "<Roles />" +
        "</RoleEnvironment>";

      assert.equal(error, null);
    });
  });

  test('testStoppedChangedNotifications', function (done) {
    var versionsXml = "<?xml version=\"1.0\" encoding=\"utf-8\"?>" +
      "<RuntimeServerDiscovery xmlns:xsi=\"http://www.w3.org/2001/XMLSchema-instance\"" +
      "xmlns:xsd=\"http://www.w3.org/2001/XMLSchema\">" +
      "<RuntimeServerEndpoints>" +
      "<RuntimeServerEndpoint version=\"2011-03-08\" path=\"\\\\.\\pipe\\goalState\" />" +
      "</RuntimeServerEndpoints>" +
      "</RuntimeServerDiscovery>";

    var goalStateXml = "<?xml version=\"1.0\" encoding=\"utf-8\"?>" +
      "<GoalState xmlns:xsi=\"http://www.w3.org/2001/XMLSchema-instance\"" +
      "xmlns:xsd=\"http://www.w3.org/2001/XMLSchema\">" +
      "<Incarnation>1</Incarnation>" +
      "<ExpectedState>Started</ExpectedState>" +
      "<RoleEnvironmentPath>C:\\file.xml</RoleEnvironmentPath>" +
      "<CurrentStateEndpoint>\\.\pipe\WindowsAzureRuntime.CurrentState</CurrentStateEndpoint>" +
      "<Deadline>9999-12-31T23:59:59.9999999</Deadline>" +
      "</GoalState>";

    var environmentData = "<?xml version=\"1.0\" encoding=\"utf-8\"?>" +
      "<RoleEnvironment xmlns:xsi=\"http://www.w3.org/2001/XMLSchema-instance\"" +
      "xmlns:xsd=\"http://www.w3.org/2001/XMLSchema\">" +
      "<Deployment id=\"deploymentId\" emulated=\"false\" />" +
      "<CurrentInstance id=\"test\" roleName=\"test\" faultDomain=\"0\" updateDomain=\"0\">" +
      "<ConfigurationSettings />" +
      "<LocalResources />" +
      "<Endpoints />" +
      "</CurrentInstance>" +
      "<Roles />" +
      "</RoleEnvironment>";

    // Create versions pipe
    var serverVersionsStream;
    var serverVersions = net.createServer(function (stream) {
      serverVersionsStream = stream;

      stream.setEncoding('utf8');
      stream.on('connect', function () {
        stream.write(versionsXml);
      });

      stream.on('end', function () {
        stream.end();
      });
    });

    serverVersions.listen('\\\\.\\pipe\\versions');

    // Create goal state pipe
    var serverGoalStateInterval;
    var serverGoalStateStream;
    var serverGoalState = net.createServer(function (stream) {
      serverGoalStateStream = stream;

      stream.setEncoding('utf8');
      stream.on('connect', function () {
        // Write goal state every second
        serverGoalStateInterval = setInterval(function () {
          stream.write(goalStateXml);
        }, 1000);
      });

      stream.on('end', function () {
        stream.end();
      });
    });

    serverGoalState.listen('\\\\.\\pipe\\goalState');

    var runtimeKernel = RuntimeKernel.getKernel();
    runtimeKernel.fileInputChannel._readData = function (name, callback) {
      if (name === 'C:\\file.xml') {
        callback(undefined, environmentData);
      } else {
        callback('wrong file');
      }
    };

    azure.RoleEnvironment.VersionEndpointFixedPath = '\\\\.\\pipe\\versions';
    azure.RoleEnvironment.runtimeClient = null;

    azure.RoleEnvironment.on(ServiceRuntimeConstants.STOPPING, function () {
      clearInterval(serverGoalStateInterval);

      serverVersions.on('close', function () {
        serverGoalState.on('close', function () {
          done();
        });

        serverGoalStateStream.end();
        serverGoalState.close();
      });

      serverVersionsStream.end();
      serverVersions.close();
    });

    // Make sure incarnation 1 is read
    azure.RoleEnvironment.getConfigurationSettings(function (error) {
      // Update to incarnation 2
      goalStateXml = "<?xml version=\"1.0\" encoding=\"utf-8\"?>" +
        "<GoalState xmlns:xsi=\"http://www.w3.org/2001/XMLSchema-instance\"" +
        "xmlns:xsd=\"http://www.w3.org/2001/XMLSchema\">" +
        "<Incarnation>2</Incarnation>" +
        "<ExpectedState>Stopped</ExpectedState>" +
        "<RoleEnvironmentPath>C:\\file.xml</RoleEnvironmentPath>" +
        "<CurrentStateEndpoint>\\.\pipe\WindowsAzureRuntime.CurrentState</CurrentStateEndpoint>" +
        "<Deadline>9999-12-31T23:59:59.9999999</Deadline>" +
        "</GoalState>";

      environmentData = "<?xml version=\"1.0\" encoding=\"utf-8\"?>" +
        "<RoleEnvironment xmlns:xsi=\"http://www.w3.org/2001/XMLSchema-instance\"" +
        "xmlns:xsd=\"http://www.w3.org/2001/XMLSchema\">" +
        "<Deployment id=\"deploymentId\" emulated=\"false\" />" +
        "<CurrentInstance id=\"test\" roleName=\"test\" faultDomain=\"0\" updateDomain=\"1\">" +
        "<ConfigurationSettings />" +
        "<LocalResources />" +
        "<Endpoints />" +
        "</CurrentInstance>" +
        "<Roles />" +
        "</RoleEnvironment>";

      assert.equal(error, null);
    });
  });

  test('testClearStatus', function (done) {
    var runtimeKernel = RuntimeKernel.getKernel();
    runtimeKernel.namedPipeInputChannel._readData = function (name, callback) {
      if (name === '\\\\.\\pipe\\WindowsAzureRuntime') {
        callback(undefined,
          "<?xml version=\"1.0\" encoding=\"utf-8\"?>" +
          "<RuntimeServerDiscovery xmlns:xsi=\"http://www.w3.org/2001/XMLSchema-instance\"" +
          "xmlns:xsd=\"http://www.w3.org/2001/XMLSchema\">" +
          "<RuntimeServerEndpoints>" +
          "<RuntimeServerEndpoint version=\"2011-03-08\" path=\"SomePath.GoalState\" />" +
          "</RuntimeServerEndpoints>" +
          "</RuntimeServerDiscovery>");
      } else if (name === 'SomePath.GoalState') {
        callback(undefined,
          "<?xml version=\"1.0\" encoding=\"utf-8\"?>" +
          "<GoalState xmlns:xsi=\"http://www.w3.org/2001/XMLSchema-instance\"" +
          "xmlns:xsd=\"http://www.w3.org/2001/XMLSchema\">" +
          "<Incarnation>1</Incarnation>" +
          "<ExpectedState>Started</ExpectedState>" +
          "<RoleEnvironmentPath>C:\\file.xml</RoleEnvironmentPath>" +
          "<CurrentStateEndpoint>\\.\pipe\WindowsAzureRuntime.CurrentState</CurrentStateEndpoint>" +
          "<Deadline>9999-12-31T23:59:59.9999999</Deadline>" +
          "</GoalState>");
      } else {
        callback('wrong pipe');
      }
    };

    runtimeKernel.fileInputChannel._readData = function (name, callback) {
      if (name === 'C:\\file.xml') {
        callback(undefined,
          "<?xml version=\"1.0\" encoding=\"utf-8\"?>" +
          "<RoleEnvironment xmlns:xsi=\"http://www.w3.org/2001/XMLSchema-instance\"" +
          "xmlns:xsd=\"http://www.w3.org/2001/XMLSchema\">" +
          "<Deployment id=\"deploymentId\" emulated=\"false\" />" +
          "<CurrentInstance id=\"test\" roleName=\"test\" faultDomain=\"0\" updateDomain=\"0\">" +
          "<ConfigurationSettings />" +
          "<LocalResources />" +
          "<Endpoints />" +
          "</CurrentInstance>" +
          "<Roles />" +
          "</RoleEnvironment>");
      } else {
        console.log('hahah: ' + name);
        callback('wrong file');
      }
    };

    var writtenData;
    runtimeKernel.namedPipeOutputChannel.writeOutputChannel = function (name, data, callback) {
      writtenData = data;
      callback();
    };

    azure.RoleEnvironment.clearStatus(function (error) {
      assert.equal(error, null);

      assert.equal(writtenData, '<?xml version="1.0" encoding="utf-8" standalone="yes"?><CurrentState><StatusLease ClientId="' + azure.RoleEnvironment.clientId + '"><Release/></StatusLease></CurrentState>');

      done();
    });
  });

  test('testSetStatus', function (done) {
    var runtimeKernel = RuntimeKernel.getKernel();
    runtimeKernel.namedPipeInputChannel._readData = function (name, callback) {
      if (name === '\\\\.\\pipe\\WindowsAzureRuntime') {
        callback(undefined,
          "<?xml version=\"1.0\" encoding=\"utf-8\"?>" +
          "<RuntimeServerDiscovery xmlns:xsi=\"http://www.w3.org/2001/XMLSchema-instance\"" +
          "xmlns:xsd=\"http://www.w3.org/2001/XMLSchema\">" +
          "<RuntimeServerEndpoints>" +
          "<RuntimeServerEndpoint version=\"2011-03-08\" path=\"SomePath.GoalState\" />" +
          "</RuntimeServerEndpoints>" +
          "</RuntimeServerDiscovery>");
      } else if (name === 'SomePath.GoalState') {
        callback(undefined,
          "<?xml version=\"1.0\" encoding=\"utf-8\"?>" +
          "<GoalState xmlns:xsi=\"http://www.w3.org/2001/XMLSchema-instance\"" +
          "xmlns:xsd=\"http://www.w3.org/2001/XMLSchema\">" +
          "<Incarnation>1</Incarnation>" +
          "<ExpectedState>Started</ExpectedState>" +
          "<RoleEnvironmentPath>C:\\file.xml</RoleEnvironmentPath>" +
          "<CurrentStateEndpoint>\\.\pipe\WindowsAzureRuntime.CurrentState</CurrentStateEndpoint>" +
          "<Deadline>9999-12-31T23:59:59.9999999</Deadline>" +
          "</GoalState>");
      } else {
        callback('wrong file');
      }
    };

    runtimeKernel.fileInputChannel._readData = function (name, callback) {
      if (name === 'C:\\file.xml') {
        callback(undefined,
          "<?xml version=\"1.0\" encoding=\"utf-8\"?>" +
          "<RoleEnvironment xmlns:xsi=\"http://www.w3.org/2001/XMLSchema-instance\"" +
          "xmlns:xsd=\"http://www.w3.org/2001/XMLSchema\">" +
          "<Deployment id=\"deploymentId\" emulated=\"false\" />" +
          "<CurrentInstance id=\"test\" roleName=\"test\" faultDomain=\"0\" updateDomain=\"0\">" +
          "<ConfigurationSettings />" +
          "<LocalResources />" +
          "<Endpoints />" +
          "</CurrentInstance>" +
          "<Roles />" +
          "</RoleEnvironment>");
      } else {
        callback('wrong file');
      }
    };

    var writtenData;
    runtimeKernel.namedPipeOutputChannel.writeOutputChannel = function (name, data, callback) {
      writtenData = data;
      callback();
    };

    azure.RoleEnvironment.setStatus(ServiceRuntimeConstants.RoleInstanceStatus.READY, new Date(2012, 1, 1, 10, 10, 10, 0), function (error1) {
      assert.equal(error1, null);

      assert.equal(writtenData, '<?xml version="1.0" encoding="utf-8" standalone="yes"?><CurrentState><StatusLease ClientId="' + azure.RoleEnvironment.clientId + '"><Acquire><Incarnation>1</Incarnation><Status>Started</Status><StatusDetail>Started</StatusDetail><Expiration>2012-02-01T18:10:10.000Z</Expiration></Acquire></StatusLease></CurrentState>');

      azure.RoleEnvironment.setStatus(ServiceRuntimeConstants.RoleInstanceStatus.BUSY, new Date(2012, 1, 1, 10, 10, 10, 0), function (error2) {
        assert.equal(error2, null);

        assert.equal(writtenData, '<?xml version="1.0" encoding="utf-8" standalone="yes"?><CurrentState><StatusLease ClientId="' + azure.RoleEnvironment.clientId + '"><Acquire><Incarnation>1</Incarnation><Status>Busy</Status><StatusDetail>Busy</StatusDetail><Expiration>2012-02-01T18:10:10.000Z</Expiration></Acquire></StatusLease></CurrentState>');

        done();
      });
    });
  });
});