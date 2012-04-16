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
var net = require('net');
var sinon = require('sinon');

var util = require('util');
var fs = require('fs');
var path = require('path');

// Test includes
var testutil = require('../util/util');

// Lib includes
var azure = testutil.libRequire('azure');
var RuntimeKernel = testutil.libRequire('serviceruntime/runtimekernel');
var NamedPipeInputChannel = testutil.libRequire('serviceruntime/namedpipeinputchannel');
var RuntimeVersionProtocolClient = testutil.libRequire('serviceruntime/runtimeversionprotocolclient');
var RuntimeVersionManager = testutil.libRequire('serviceruntime/runtimeversionmanager');
var Constants = testutil.libRequire('util/constants');
var ServiceRuntimeConstants = Constants.ServiceRuntimeConstants;

var versionsEndpointPath = '\\\\.\\pipe\\versionsEndpointPath';
var goalStatePath = '\\\\.\\pipe\\goalStatePath';
var roleEnvironmentPath = 'roleEnvironmentPath';
var currentStatePath = '\\\\.\\pipe\\currentStatePath';

var runtimeKernel = RuntimeKernel.getKernel();

var originalWaRuntimeEndpoint;
var inputPipeReadDataStub;
var inputFileReadDataStub;
var sandbox;

function setupVersionEndpoint () {
  if (!inputPipeReadDataStub) {
    inputPipeReadDataStub = sandbox.stub(runtimeKernel.namedPipeInputChannel, '_readData');
  }

  inputPipeReadDataStub.withArgs(versionsEndpointPath).yields(undefined,
    "<?xml version=\"1.0\" encoding=\"utf-8\"?>" +
    "<RuntimeServerDiscovery xmlns:xsi=\"http://www.w3.org/2001/XMLSchema-instance\"" +
    "xmlns:xsd=\"http://www.w3.org/2001/XMLSchema\">" +
    "<RuntimeServerEndpoints>" +
    "<RuntimeServerEndpoint version=\"2011-03-08\" path=\"" + goalStatePath + "\" />" +
    "</RuntimeServerEndpoints>" +
    "</RuntimeServerDiscovery>"
  );
}

function setupGoalStateEndpoint () {
  if (!inputPipeReadDataStub) {
    inputPipeReadDataStub = sandbox.stub(runtimeKernel.namedPipeInputChannel, '_readData');
  }

  inputPipeReadDataStub.withArgs(goalStatePath).yields(undefined,
    "<?xml version=\"1.0\" encoding=\"utf-8\"?>" +
    "<GoalState xmlns:xsi=\"http://www.w3.org/2001/XMLSchema-instance\"" +
    "xmlns:xsd=\"http://www.w3.org/2001/XMLSchema\">" +
    "<Incarnation>1</Incarnation>" +
    "<ExpectedState>Started</ExpectedState>" +
    "<RoleEnvironmentPath>" + roleEnvironmentPath + "</RoleEnvironmentPath>" +
    "<CurrentStateEndpoint>" + currentStatePath + "</CurrentStateEndpoint>" +
    "<Deadline>9999-12-31T23:59:59.9999999</Deadline>" +
    "</GoalState>"
  );
}

suite('roleenvironment-tests', function () {
  setup(function (done) {
    // Set windows azure runtime endpoint
    originalWaRuntimeEndpoint = process.env['WaRuntimeEndpoint'];
    process.env['WaRuntimeEndpoint'] = versionsEndpointPath;

    sandbox = sinon.sandbox.create();

    done();
  });

  teardown(function (done) {
    process.env['WaRuntimeEndpoint'] = originalWaRuntimeEndpoint;

    sandbox.restore();

    inputPipeReadDataStub = null;
    inputFileReadDataStub = null;

    // Force refresh between UTs by resetting the runtimeClient
    azure.RoleEnvironment.runtimeClient = null;
    runtimeKernel.protocol1RuntimeGoalStateClient.endpoint = null;
    runtimeKernel.protocol1RuntimeGoalStateClient.currentEnvironmentData = null;
    runtimeKernel.protocol1RuntimeGoalStateClient.currentGoalState = null;

    if (path.existsSync(versionsEndpointPath)) {
      fs.unlinkSync(versionsEndpointPath);
    }

    if (path.existsSync(goalStatePath)) {
      fs.unlinkSync(goalStatePath);
    }

    if (path.existsSync(currentStatePath)) {
      fs.unlinkSync(currentStatePath);
    }

    if (path.existsSync(roleEnvironmentPath)) {
      fs.unlinkSync(roleEnvironmentPath);
    }

    done();
  });

  test('eventEmitter', function (done) {
    // No event listeners registered yet
    assert.strictEqual(azure.RoleEnvironment.listeners(ServiceRuntimeConstants.CHANGED).length, 0);

    // Register one event listener
    var listener = function () { };

    azure.RoleEnvironment.on(ServiceRuntimeConstants.CHANGED, listener);
    assert.strictEqual(azure.RoleEnvironment.listeners(ServiceRuntimeConstants.CHANGED).length, 1);

    // Remove the event listener
    azure.RoleEnvironment.removeListener(ServiceRuntimeConstants.CHANGED, listener);
    assert.strictEqual(azure.RoleEnvironment.listeners(ServiceRuntimeConstants.CHANGED).length, 0);

    done();
  });

  test('isAvailable', function (done) {
    // Test 1 - Is not available
    azure.RoleEnvironment.isAvailable(function (error1, isAvailable1) {
      assert.notStrictEqual(error1, undefined);
      assert.notEqual(error1.code, null);
      assert.strictEqual(isAvailable1, false);

      // Test 2 - Is available
      setupVersionEndpoint();
      setupGoalStateEndpoint();

      inputFileReadDataStub = sandbox.stub(runtimeKernel.fileInputChannel, '_readData');
      inputFileReadDataStub.withArgs(roleEnvironmentPath).yields(undefined,
        "<?xml version=\"1.0\" encoding=\"utf-8\"?>" +
        "<RoleEnvironment xmlns:xsi=\"http://www.w3.org/2001/XMLSchema-instance\"" +
        "xmlns:xsd=\"http://www.w3.org/2001/XMLSchema\">" +
        "<Deployment id=\"deploymentId\" emulated=\"false\" />" +
        "<CurrentInstance id=\"instanceId\" roleName=\"roleName\" faultDomain=\"0\" updateDomain=\"0\">" +
        "<ConfigurationSettings />" +
        "<LocalResources>" +
        "<LocalResource name=\"DiagnosticStore\" path=\"diagnosticStorePath\" sizeInMB=\"4096\" />" +
        "</LocalResources>" +
        "<Endpoints>" +
        "<Endpoint name=\"HttpIn\" address=\"10.114.250.21\" port=\"80\" protocol=\"tcp\" />" +
        "</Endpoints>" +
        "</CurrentInstance>" +
        "<Roles />" +
        "</RoleEnvironment>"
      );

      azure.RoleEnvironment.isAvailable(function (error2, isAvailable2) {
        assert.strictEqual(error2, undefined);
        assert.strictEqual(isAvailable2, true);

        done();
      });
    });
  });

  test('getLocalResourcesNoGoalStateNamedPipe', function (done) {
    assert.throws(
      azure.RoleEnvironment.getLocalResources(function () { }),
      Error
    );

    done();
  });

  test('getDeploymentId', function (done) {
    setupVersionEndpoint();
    setupGoalStateEndpoint();

    inputFileReadDataStub = sandbox.stub(runtimeKernel.fileInputChannel, '_readData');
    inputFileReadDataStub.withArgs(roleEnvironmentPath).yields(undefined,
      "<?xml version=\"1.0\" encoding=\"utf-8\"?>" +
      "<RoleEnvironment xmlns:xsi=\"http://www.w3.org/2001/XMLSchema-instance\"" +
      "xmlns:xsd=\"http://www.w3.org/2001/XMLSchema\">" +
      "<Deployment id=\"newDeploymentId\" emulated=\"false\" />" +
      "<CurrentInstance id=\"instanceId\" roleName=\"roleName\" faultDomain=\"0\" updateDomain=\"0\">" +
      "<ConfigurationSettings />" +
      "<LocalResources>" +
      "<LocalResource name=\"DiagnosticStore\" path=\"diagnosticStorePath\" sizeInMB=\"4096\" />" +
      "</LocalResources>" +
      "<Endpoints>" +
      "<Endpoint name=\"HttpIn\" address=\"10.114.250.21\" port=\"80\" protocol=\"tcp\" />" +
      "</Endpoints>" +
      "</CurrentInstance>" +
      "<Roles />" +
      "</RoleEnvironment>"
    );

    azure.RoleEnvironment.getDeploymentId(function (error, id) {
      assert.strictEqual(error, undefined);
      assert.strictEqual(id, 'newDeploymentId');

      done();
    });
  });

  test('getLocalResources', function (done) {
    setupVersionEndpoint();
    setupGoalStateEndpoint();

    inputFileReadDataStub = sandbox.stub(runtimeKernel.fileInputChannel, '_readData');
    inputFileReadDataStub.withArgs(roleEnvironmentPath).yields(undefined,
      "<?xml version=\"1.0\" encoding=\"utf-8\"?>" +
      "<RoleEnvironment xmlns:xsi=\"http://www.w3.org/2001/XMLSchema-instance\"" +
      "xmlns:xsd=\"http://www.w3.org/2001/XMLSchema\">" +
      "<Deployment id=\"deploymentId\" emulated=\"false\" />" +
      "<CurrentInstance id=\"instanceId\" roleName=\"roleName\" faultDomain=\"0\" updateDomain=\"0\">" +
      "<ConfigurationSettings />" +
      "<LocalResources>" +
      "<LocalResource name=\"DiagnosticStore\" path=\"diagnosticStorePath\" sizeInMB=\"4096\" />" +
      "</LocalResources>" +
      "<Endpoints>" +
      "<Endpoint name=\"HttpIn\" address=\"10.114.250.21\" port=\"80\" protocol=\"tcp\" />" +
      "</Endpoints>" +
      "</CurrentInstance>" +
      "<Roles />" +
      "</RoleEnvironment>"
    );

    azure.RoleEnvironment.getLocalResources(function (error, localResources) {
      assert.strictEqual(error, undefined);
      assert.notEqual(localResources, null);
      assert.notEqual(localResources['DiagnosticStore'], null);
      assert.strictEqual(localResources['DiagnosticStore']['path'], 'diagnosticStorePath');
      assert.strictEqual(localResources['DiagnosticStore']['sizeInMB'], '4096');

      done();
    });
  });

  test('getRoles', function (done) {
    setupVersionEndpoint();
    setupGoalStateEndpoint();

    inputFileReadDataStub = sandbox.stub(runtimeKernel.fileInputChannel, '_readData');
    inputFileReadDataStub.withArgs(roleEnvironmentPath).yields(undefined,
      "<?xml version=\"1.0\" encoding=\"utf-8\"?>" +
      "<RoleEnvironment xmlns:xsi=\"http://www.w3.org/2001/XMLSchema-instance\"" +
      "xmlns:xsd=\"http://www.w3.org/2001/XMLSchema\">" +
      "<Deployment id=\"deploymentId\" emulated=\"false\" />" +
      "<CurrentInstance id=\"instanceId\" roleName=\"role1\" faultDomain=\"0\" updateDomain=\"0\">" +
      "<ConfigurationSettings />" +
      "<LocalResources />" +
      "<Endpoints>" +
      "<Endpoint name=\"HttpIn\" address=\"10.114.250.21\" port=\"80\" protocol=\"tcp\" />" +
      "</Endpoints>" +
      "</CurrentInstance>" +
      "<Roles>" +
      "<Role name=\"role1\">" +
      "<Instances>" +
      "<Instance id=\"role1instance1\" faultDomain=\"0\" updateDomain=\"0\">" +
      "<Endpoints>" +
      "<Endpoint name=\"MyInternalEndpoint1\" address=\"127.255.0.0\" port=\"20000\" protocol=\"tcp\" />" +
      "</Endpoints>" +
      "</Instance>" +
      "</Instances>" +
      "</Role>" +
      "<Role name=\"role2\">" +
      "<Instances>" +
      "<Instance id=\"role2instance1\" faultDomain=\"0\" updateDomain=\"0\">" +
      "<Endpoints>" +
      "<Endpoint name=\"MyInternalEndpoint2\" address=\"127.255.0.2\" port=\"20002\" protocol=\"tcp\" />" +
      "</Endpoints>" +
      "</Instance>" +
      "<Instance id=\"role2instance2\" faultDomain=\"0\" updateDomain=\"0\">" +
      "<Endpoints>" +
      "<Endpoint name=\"MyInternalEndpoint3\" address=\"127.255.0.3\" port=\"20002\" protocol=\"tcp\" />" +
      "<Endpoint name=\"MyInternalEndpoint4\" address=\"127.255.0.3\" port=\"20004\" protocol=\"tcp\" />" +
      "</Endpoints>" +
      "</Instance>" +
      "</Instances>" +
      "</Role>" +
      "</Roles>" +
      "</RoleEnvironment>"
    );

    azure.RoleEnvironment.getRoles(function (error, roles) {
      assert.equal(error, null);
      assert.notEqual(roles, null);
      assert.notEqual(roles['role1'], null);
      assert.notEqual(roles['role1']['role1instance1'], null);

      assert.notEqual(roles['role2'], null);
      assert.notEqual(roles['role2']['role2instance1'], null);
      assert.notEqual(roles['role2']['role2instance2'], null);

      done();
    });
  });

  test('_calculateChanges', function (done) {
    setupVersionEndpoint();
    setupGoalStateEndpoint();

    inputFileReadDataStub = sandbox.stub(runtimeKernel.fileInputChannel, '_readData');
    inputFileReadDataStub.withArgs(roleEnvironmentPath).yields(undefined,
      "<?xml version=\"1.0\" encoding=\"utf-8\"?>" +
      "<RoleEnvironment xmlns:xsi=\"http://www.w3.org/2001/XMLSchema-instance\"" +
      "xmlns:xsd=\"http://www.w3.org/2001/XMLSchema\">" +
      "<Deployment id=\"deploymentId\" emulated=\"false\" />" +
      "<CurrentInstance id=\"instanceId\" roleName=\"role1\" faultDomain=\"0\" updateDomain=\"0\">" +
      "<ConfigurationSettings />" +
      "<LocalResources />" +
      "<Endpoints>" +
      "<Endpoint name=\"HttpIn\" address=\"10.114.250.21\" port=\"80\" protocol=\"tcp\" />" +
      "</Endpoints>" +
      "</CurrentInstance>" +
      "<Roles>" +
      "<Role name=\"role1\">" +
      "<Instances>" +
      "<Instance id=\"role1instance1\" faultDomain=\"0\" updateDomain=\"0\">" +
      "<Endpoints>" +
      "<Endpoint name=\"MyInternalEndpoint1\" address=\"127.255.0.0\" port=\"20000\" protocol=\"tcp\" />" +
      "</Endpoints>" +
      "</Instance>" +
      "</Instances>" +
      "</Role>" +
      "<Role name=\"role2\">" +
      "<Instances>" +
      "<Instance id=\"role2instance1\" faultDomain=\"0\" updateDomain=\"0\">" +
      "<Endpoints>" +
      "<Endpoint name=\"MyInternalEndpoint2\" address=\"127.255.0.2\" port=\"20002\" protocol=\"tcp\" />" +
      "</Endpoints>" +
      "</Instance>" +
      "<Instance id=\"role2instance2\" faultDomain=\"0\" updateDomain=\"0\">" +
      "<Endpoints>" +
      "<Endpoint name=\"MyInternalEndpoint3\" address=\"127.255.0.3\" port=\"20002\" protocol=\"tcp\" />" +
      "<Endpoint name=\"MyInternalEndpoint4\" address=\"127.255.0.3\" port=\"20004\" protocol=\"tcp\" />" +
      "</Endpoints>" +
      "</Instance>" +
      "</Instances>" +
      "</Role>" +
      "</Roles>" +
      "</RoleEnvironment>"
    );

    // do first call to get environment data
    azure.RoleEnvironment.getRoles(function (error, roles) {
      assert.strictEqual(error, undefined);
      assert.notEqual(roles, null);

      // explicitly call calculate changes to reread and compare to previous environment data
      azure.RoleEnvironment._calculateChanges(function (calculateChangesError, changes) {
        assert.strictEqual(calculateChangesError, undefined);
        assert.notEqual(changes, null);
        assert.equal(changes.length, 0);

        done();
      });
    });
  });

  test('requestRecycle', function (done) {
    setupVersionEndpoint();
    setupGoalStateEndpoint();

    inputFileReadDataStub = sandbox.stub(runtimeKernel.fileInputChannel, '_readData');
    inputFileReadDataStub.withArgs(roleEnvironmentPath).yields(undefined,
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
      "</RoleEnvironment>"
    );

    var outputFileReadDataStub = sandbox.stub(runtimeKernel.namedPipeOutputChannel, 'writeOutputChannel');
    outputFileReadDataStub.yields(undefined);

    azure.RoleEnvironment.requestRecycle(function (error) {
      assert.equal(error, null);

      outputFileReadDataStub.calledWith(
        currentStatePath,
        '<?xml version="1.0" encoding="utf-8" standalone="yes"?>' +
        '<CurrentState><StatusLease ClientId="' + azure.RoleEnvironment.clientId + '">' +
        '<Acquire><Incarnation>1</Incarnation>' +
        '<Status>' + ServiceRuntimeConstants.RoleStatus.RECYCLE + '</Status>' +
        '<StatusDetail>' + ServiceRuntimeConstants.RoleStatus.RECYCLE + '</StatusDetail>' +
        '<Expiration>9999-12-31T23:59:59.999Z</Expiration>' +
        '</Acquire>' +
        '</StatusLease>' +
        '</CurrentState>'
      );

      done();
    });
  });

  test('startedChangedNotifications', function (done) {
    var versionsXml = "<?xml version=\"1.0\" encoding=\"utf-8\"?>" +
      "<RuntimeServerDiscovery xmlns:xsi=\"http://www.w3.org/2001/XMLSchema-instance\"" +
      "xmlns:xsd=\"http://www.w3.org/2001/XMLSchema\">" +
      "<RuntimeServerEndpoints>" +
      "<RuntimeServerEndpoint version=\"2011-03-08\" path=\"" + goalStatePath + "\" />" +
      "</RuntimeServerEndpoints>" +
      "</RuntimeServerDiscovery>";

    var goalStateXml = "<?xml version=\"1.0\" encoding=\"utf-8\"?>" +
      "<GoalState xmlns:xsi=\"http://www.w3.org/2001/XMLSchema-instance\"" +
      "xmlns:xsd=\"http://www.w3.org/2001/XMLSchema\">" +
      "<Incarnation>1</Incarnation>" +
      "<ExpectedState>Started</ExpectedState>" +
      "<RoleEnvironmentPath>" + roleEnvironmentPath + "</RoleEnvironmentPath>" +
      "<CurrentStateEndpoint>" + currentStatePath + "</CurrentStateEndpoint>" +
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

    serverVersions.listen(versionsEndpointPath);

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

    serverGoalState.listen(goalStatePath);

    // Stub role environment file
    inputFileReadDataStub = sandbox.stub(runtimeKernel.fileInputChannel, '_readData');
    inputFileReadDataStub.withArgs(roleEnvironmentPath).yields(undefined, environmentData);

    // Stub output channel
    var outputFileReadDataStub = sandbox.stub(runtimeKernel.namedPipeOutputChannel, 'writeOutputChannel');
    outputFileReadDataStub.returns();

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
    azure.RoleEnvironment.getDeploymentId(function (error, id) {
      // Update to incarnation 2
      goalStateXml = "<?xml version=\"1.0\" encoding=\"utf-8\"?>" +
        "<GoalState xmlns:xsi=\"http://www.w3.org/2001/XMLSchema-instance\"" +
        "xmlns:xsd=\"http://www.w3.org/2001/XMLSchema\">" +
        "<Incarnation>2</Incarnation>" +
        "<ExpectedState>Started</ExpectedState>" +
        "<RoleEnvironmentPath>" + roleEnvironmentPath + "</RoleEnvironmentPath>" +
        "<CurrentStateEndpoint>" + currentStatePath + "</CurrentStateEndpoint>" +
        "<Deadline>9999-12-31T23:59:59.9999999</Deadline>" +
        "</GoalState>";

      inputFileReadDataStub.withArgs(roleEnvironmentPath).yields(
        undefined, 
        "<?xml version=\"1.0\" encoding=\"utf-8\"?>" +
        "<RoleEnvironment xmlns:xsi=\"http://www.w3.org/2001/XMLSchema-instance\"" +
        "xmlns:xsd=\"http://www.w3.org/2001/XMLSchema\">" +
        "<Deployment id=\"deploymentId\" emulated=\"false\" />" +
        "<CurrentInstance id=\"test\" roleName=\"test\" faultDomain=\"0\" updateDomain=\"1\">" +
        "<ConfigurationSettings />" +
        "<LocalResources />" +
        "<Endpoints />" +
        "</CurrentInstance>" +
        "<Roles />" +
        "</RoleEnvironment>"
      );

      assert.equal(error, null);
      assert.notEqual(id, null);
    });
  });

  test('stoppedChangedNotifications', function (done) {
    var versionsXml = "<?xml version=\"1.0\" encoding=\"utf-8\"?>" +
      "<RuntimeServerDiscovery xmlns:xsi=\"http://www.w3.org/2001/XMLSchema-instance\"" +
      "xmlns:xsd=\"http://www.w3.org/2001/XMLSchema\">" +
      "<RuntimeServerEndpoints>" +
      "<RuntimeServerEndpoint version=\"2011-03-08\" path=\"" + goalStatePath + "\" />" +
      "</RuntimeServerEndpoints>" +
      "</RuntimeServerDiscovery>";

    var goalStateXml = "<?xml version=\"1.0\" encoding=\"utf-8\"?>" +
      "<GoalState xmlns:xsi=\"http://www.w3.org/2001/XMLSchema-instance\"" +
      "xmlns:xsd=\"http://www.w3.org/2001/XMLSchema\">" +
      "<Incarnation>1</Incarnation>" +
      "<ExpectedState>Started</ExpectedState>" +
      "<RoleEnvironmentPath>" + roleEnvironmentPath + "</RoleEnvironmentPath>" +
      "<CurrentStateEndpoint>" + currentStatePath + "</CurrentStateEndpoint>" +
      "<Deadline>9999-12-31T23:59:59.9999999</Deadline>" +
      "</GoalState>";

    var environmentData = "<?xml version=\"1.0\" encoding=\"utf-8\"?>" +
      "<RoleEnvironment xmlns:xsi=\"http://www.w3.org/2001/XMLSchema-instance\"" +
      "xmlns:xsd=\"http://www.w3.org/2001/XMLSchema\">" +
      "<Deployment id=\"thisdeploymentId\" emulated=\"false\" />" +
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

    serverVersions.listen(versionsEndpointPath);

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

    serverGoalState.listen(goalStatePath);

    // Stub role environment file
    inputFileReadDataStub = sandbox.stub(runtimeKernel.fileInputChannel, '_readData');
    inputFileReadDataStub.withArgs(roleEnvironmentPath).yields(undefined, environmentData);

    // Stub output channel
    var outputFileReadDataStub = sandbox.stub(runtimeKernel.namedPipeOutputChannel, 'writeOutputChannel');
    outputFileReadDataStub.returns();

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
    azure.RoleEnvironment.getDeploymentId(function (error, id) {
      // Update to incarnation 2
      goalStateXml = "<?xml version=\"1.0\" encoding=\"utf-8\"?>" +
        "<GoalState xmlns:xsi=\"http://www.w3.org/2001/XMLSchema-instance\"" +
        "xmlns:xsd=\"http://www.w3.org/2001/XMLSchema\">" +
        "<Incarnation>2</Incarnation>" +
        "<ExpectedState>Stopped</ExpectedState>" +
        "<RoleEnvironmentPath>" + roleEnvironmentPath + "</RoleEnvironmentPath>" +
        "<CurrentStateEndpoint>" + currentStatePath + "</CurrentStateEndpoint>" +
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
      assert.notEqual(id, null);
    });
  });

  test('clearStatus', function (done) {
    setupVersionEndpoint();
    setupGoalStateEndpoint();

    inputFileReadDataStub = sandbox.stub(runtimeKernel.fileInputChannel, '_readData');
    inputFileReadDataStub.withArgs(roleEnvironmentPath).yields(undefined,
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
      "</RoleEnvironment>"
    );

    var outputFileReadDataStub = sandbox.stub(runtimeKernel.namedPipeOutputChannel, 'writeOutputChannel');
    outputFileReadDataStub.yields(undefined);

    azure.RoleEnvironment.clearStatus(function (error) {
      assert.strictEqual(error, undefined);

      outputFileReadDataStub.calledWith(
        currentStatePath,
        '<?xml version="1.0" encoding="utf-8" standalone="yes"?>' +
        '<CurrentState>' +
        '<StatusLease ClientId="' + azure.RoleEnvironment.clientId + '">' +
        '<Release/>' +
        '</StatusLease>' +
        '</CurrentState>'
      );

      done();
    });
  });

  test('setStatus', function (done) {
    setupVersionEndpoint();
    setupGoalStateEndpoint();

    inputFileReadDataStub = sandbox.stub(runtimeKernel.fileInputChannel, '_readData');
    inputFileReadDataStub.withArgs(roleEnvironmentPath).yields(undefined,
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
      "</RoleEnvironment>"
    );

    var outputFileReadDataStub = sandbox.stub(runtimeKernel.namedPipeOutputChannel, 'writeOutputChannel');
    outputFileReadDataStub.yields(undefined);

    azure.RoleEnvironment.setStatus(
      ServiceRuntimeConstants.RoleInstanceStatus.READY,
      new Date(2012, 1, 1, 10, 10, 10, 0), function (error1) {

      assert.strictEqual(error1, undefined);
      
      outputFileReadDataStub.calledWith(
        currentStatePath,
        '<?xml version="1.0" encoding="utf-8" standalone="yes"?>' +
        '<CurrentState>' +
        '<StatusLease ClientId="' + azure.RoleEnvironment.clientId + '">' +
        '<Acquire>' +
        '<Incarnation>1</Incarnation>' +
        '<Status>Started</Status>' +
        '<StatusDetail>Started</StatusDetail>' +
        '<Expiration>2012-02-01T18:10:10.000Z</Expiration>' +
        '</Acquire>' +
        '</StatusLease>' +
        '</CurrentState>'
      );

      azure.RoleEnvironment.setStatus(
        ServiceRuntimeConstants.RoleInstanceStatus.BUSY,
        new Date(2012, 1, 1, 10, 10, 10, 0), function (error2) {

        assert.strictEqual(error2, undefined);

        outputFileReadDataStub.calledWith(
          currentStatePath,
          '<?xml version="1.0" encoding="utf-8" standalone="yes"?>' +
          '<CurrentState>' +
          '<StatusLease ClientId="' + azure.RoleEnvironment.clientId + '">' +
          '<Acquire>' +
          '<Incarnation>1</Incarnation>' +
          '<Status>Busy</Status>' +
          '<StatusDetail>Busy</StatusDetail>' +
          '<Expiration>2012-02-01T18:10:10.000Z</Expiration>' +
          '</Acquire>' +
          '</StatusLease>' +
          '</CurrentState>'
        );

        done();
      });
    });
  });
});