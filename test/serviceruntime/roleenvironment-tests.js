﻿/**
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

var RuntimeKernel = require('../../lib/serviceruntime/runtimekernel');
var NamedPipeInputChannel = require('../../lib/serviceruntime/namedpipeinputchannel');
var RuntimeVersionProtocolClient = require('../../lib/serviceruntime/runtimeversionprotocolclient');
var RuntimeVersionManager = require('../../lib/serviceruntime/runtimeversionmanager');

var Constants = require('../../lib/util/constants');
var ServiceRuntimeConstants = Constants.ServiceRuntimeConstants;

var azure = require('../../lib/azure');

suite('roleenvironment-tests', function () {
  test('IsAvailable', function (done) {
    azure.RoleEnvironment.isAvailable(function (error1, isAvailable1) {
      assert.notEqual(error1, null);
      assert.equal(isAvailable1, false);

      var runtimeKernel = RuntimeKernel.getKernel();
      var originalNamedPipeInputChannelReadData = runtimeKernel.namedPipeInputChannel.readData;
      runtimeKernel.namedPipeInputChannel.readData = function (name, callback) {
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

      var originalFileInputChannelReadData = runtimeKernel.fileInputChannel.readData;
      runtimeKernel.fileInputChannel.readData = function (name, callback) {
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

        runtimeKernel.namedPipeInputChannel.readData = originalNamedPipeInputChannelReadData;
        runtimeKernel.fileInputChannel.readData = originalFileInputChannelReadData;
        runtimeKernel.protocol1RuntimeGoalStateClient.currentGoalState = null;
        runtimeKernel.protocol1RuntimeGoalStateClient.currentEnvironmentData = null;

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
    var originalNamedPipeInputChannelReadData = runtimeKernel.namedPipeInputChannel.readData;
    runtimeKernel.namedPipeInputChannel.readData = function (name, callback) {
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

    var originalFileInputChannelReadData = runtimeKernel.fileInputChannel.readData;
    runtimeKernel.fileInputChannel.readData = function (name, callback) {
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

      runtimeKernel.namedPipeInputChannel.readData = originalNamedPipeInputChannelReadData;
      runtimeKernel.fileInputChannel.readData = originalFileInputChannelReadData;
      runtimeKernel.protocol1RuntimeGoalStateClient.currentGoalState = null;
      runtimeKernel.protocol1RuntimeGoalStateClient.currentEnvironmentData = null;

      done();
    });
  });

  test('GetLocalResources', function (done) {
    var runtimeKernel = RuntimeKernel.getKernel();
    var originalNamedPipeInputChannelReadData = runtimeKernel.namedPipeInputChannel.readData;
    runtimeKernel.namedPipeInputChannel.readData = function (name, callback) {
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

    var originalFileInputChannelReadData = runtimeKernel.fileInputChannel.readData;
    runtimeKernel.fileInputChannel.readData = function (name, callback) {
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

      runtimeKernel.namedPipeInputChannel.readData = originalNamedPipeInputChannelReadData;
      runtimeKernel.fileInputChannel.readData = originalFileInputChannelReadData;
      runtimeKernel.protocol1RuntimeGoalStateClient.currentGoalState = null;
      runtimeKernel.protocol1RuntimeGoalStateClient.currentEnvironmentData = null;

      done();
    });
  });

  test('GetRoles', function (done) {
    var runtimeKernel = RuntimeKernel.getKernel();
    var originalNamedPipeInputChannelReadData = runtimeKernel.namedPipeInputChannel.readData;
    runtimeKernel.namedPipeInputChannel.readData = function (name, callback) {
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

    var originalFileInputChannelReadData = runtimeKernel.fileInputChannel.readData;
    runtimeKernel.fileInputChannel.readData = function (name, callback) {
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

      runtimeKernel.namedPipeInputChannel.readData = originalNamedPipeInputChannelReadData;
      runtimeKernel.fileInputChannel.readData = originalFileInputChannelReadData;
      runtimeKernel.protocol1RuntimeGoalStateClient.currentGoalState = null;
      runtimeKernel.protocol1RuntimeGoalStateClient.currentEnvironmentData = null;

      done();
    });
  });

  test('CalculateChanges', function (done) {
    var runtimeKernel = RuntimeKernel.getKernel();
    var originalNamedPipeInputChannelReadData = runtimeKernel.namedPipeInputChannel.readData;
    runtimeKernel.namedPipeInputChannel.readData = function (name, callback) {
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

    var originalFileInputChannelReadData = runtimeKernel.fileInputChannel.readData;
    runtimeKernel.fileInputChannel.readData = function (name, callback) {
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

        runtimeKernel.namedPipeInputChannel.readData = originalNamedPipeInputChannelReadData;
        runtimeKernel.fileInputChannel.readData = originalFileInputChannelReadData;
        runtimeKernel.protocol1RuntimeGoalStateClient.currentGoalState = null;
        runtimeKernel.protocol1RuntimeGoalStateClient.currentEnvironmentData = null;

        done();
      });
    });
  });

  test('testRequestRecycle', function (done) {
    var runtimeKernel = RuntimeKernel.getKernel();
    var originalNamedPipeInputChannelReadData = runtimeKernel.namedPipeInputChannel.readData;
    runtimeKernel.namedPipeInputChannel.readData = function (name, callback) {
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

    var originalFileInputChannelReadData = runtimeKernel.fileInputChannel.readData;
    runtimeKernel.fileInputChannel.readData = function (name, callback) {
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

    var originalNamedPipeOutputChannelWriteOutputChannel = runtimeKernel.namedPipeOutputChannel.writeOutputChannel;
    var writtenData;
    runtimeKernel.namedPipeOutputChannel.writeOutputChannel = function (data, callback) {
      writtenData = data;
      callback();
    };

    azure.RoleEnvironment.requestRecycle(function (error) {
      assert.equal(error, null);

      assert.equal(writtenData, '<?xml version="1.0" encoding="utf-8" standalone="yes"?><CurrentState><StatusLease ClientId="' + azure.RoleEnvironment.clientId + '"><Acquire><Expiration>Fri Dec 31 9999 15:59:59 GMT-0800 (Pacific Standard Time)</Expiration><Incarnation>1</Incarnation><Status>recycle</Status></Acquire></StatusLease></CurrentState>');

      runtimeKernel.namedPipeInputChannel.readData = originalNamedPipeInputChannelReadData;
      runtimeKernel.fileInputChannel.readData = originalFileInputChannelReadData;
      runtimeKernel.protocol1RuntimeGoalStateClient.currentGoalState = null;
      runtimeKernel.protocol1RuntimeGoalStateClient.currentEnvironmentData = null;
      runtimeKernel.namedPipeOutputChannel.writeOutputChannel = originalNamedPipeOutputChannelWriteOutputChannel;

      done();
    });
  });

  test('testClearStatus', function (done) {
    var runtimeKernel = RuntimeKernel.getKernel();
    var originalNamedPipeInputChannelReadData = runtimeKernel.namedPipeInputChannel.readData;
    runtimeKernel.namedPipeInputChannel.readData = function (name, callback) {
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

    var originalFileInputChannelReadData = runtimeKernel.fileInputChannel.readData;
    runtimeKernel.fileInputChannel.readData = function (name, callback) {
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

    var originalNamedPipeOutputChannelWriteOutputChannel = runtimeKernel.namedPipeOutputChannel.writeOutputChannel;
    var writtenData;
    runtimeKernel.namedPipeOutputChannel.writeOutputChannel = function (data, callback) {
      writtenData = data;
      callback();
    };

    azure.RoleEnvironment.clearStatus(function (error) {
      assert.equal(error, null);

      assert.equal(writtenData, '<?xml version="1.0" encoding="utf-8" standalone="yes"?><CurrentState><StatusLease ClientId="' + azure.RoleEnvironment.clientId + '"><Release/></StatusLease></CurrentState>');

      runtimeKernel.namedPipeInputChannel.readData = originalNamedPipeInputChannelReadData;
      runtimeKernel.fileInputChannel.readData = originalFileInputChannelReadData;
      runtimeKernel.protocol1RuntimeGoalStateClient.currentGoalState = null;
      runtimeKernel.protocol1RuntimeGoalStateClient.currentEnvironmentData = null;
      runtimeKernel.namedPipeOutputChannel.writeOutputChannel = originalNamedPipeOutputChannelWriteOutputChannel;

      done();
    });
  });

  test('testSetStatus', function (done) {
    var runtimeKernel = RuntimeKernel.getKernel();
    var originalNamedPipeInputChannelReadData = runtimeKernel.namedPipeInputChannel.readData;
    runtimeKernel.namedPipeInputChannel.readData = function (name, callback) {
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

    var originalFileInputChannelReadData = runtimeKernel.fileInputChannel.readData;
    runtimeKernel.fileInputChannel.readData = function (name, callback) {
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

    var originalNamedPipeOutputChannelWriteOutputChannel = runtimeKernel.namedPipeOutputChannel.writeOutputChannel;
    var writtenData;
    runtimeKernel.namedPipeOutputChannel.writeOutputChannel = function (data, callback) {
      writtenData = data;
      callback();
    };

    azure.RoleEnvironment.setStatus(ServiceRuntimeConstants.RoleInstanceStatus.READY, new Date(2012, 1, 1, 12, 10, 10, 0), function (error1) {
      assert.equal(error1, null);

      assert.equal(writtenData, '<?xml version="1.0" encoding="utf-8" standalone="yes"?><CurrentState><StatusLease ClientId="' + azure.RoleEnvironment.clientId + '"><Acquire><Expiration>Wed Feb 01 2012 12:10:10 GMT-0800 (Pacific Standard Time)</Expiration><Incarnation>1</Incarnation><Status>started</Status></Acquire></StatusLease></CurrentState>');

      azure.RoleEnvironment.setStatus(ServiceRuntimeConstants.RoleInstanceStatus.BUSY, new Date(2012, 1, 1, 10, 10, 10, 0), function (error2) {
        assert.equal(error2, null);

        assert.equal(writtenData, '<?xml version="1.0" encoding="utf-8" standalone="yes"?><CurrentState><StatusLease ClientId="' + azure.RoleEnvironment.clientId + '"><Acquire><Expiration>Wed Feb 01 2012 10:10:10 GMT-0800 (Pacific Standard Time)</Expiration><Incarnation>1</Incarnation><Status>busy</Status></Acquire></StatusLease></CurrentState>');

        runtimeKernel.namedPipeInputChannel.readData = originalNamedPipeInputChannelReadData;
        runtimeKernel.fileInputChannel.readData = originalFileInputChannelReadData;
        runtimeKernel.protocol1RuntimeGoalStateClient.currentGoalState = null;
        runtimeKernel.protocol1RuntimeGoalStateClient.currentEnvironmentData = null;
        runtimeKernel.namedPipeOutputChannel.writeOutputChannel = originalNamedPipeOutputChannelWriteOutputChannel;

        done();
      });
    });
  });
});