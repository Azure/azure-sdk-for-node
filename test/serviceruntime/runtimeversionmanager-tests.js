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
var sinon = require('sinon');

// Test includes
var testutil = require('../util/util');

// Lib includes
var NamedPipeInputChannel = testutil.libRequire('serviceruntime/namedpipeinputchannel');
var RuntimeVersionProtocolClient = testutil.libRequire('serviceruntime/runtimeversionprotocolclient');
var RuntimeVersionManager = testutil.libRequire('serviceruntime/runtimeversionmanager');

suite('runtimeversionmanager-tests', function () {
  test('getRuntimeClient', function (done) {
    var versionsEndpointPath = 'versionsEndpointPath';

    var inputChannel = new NamedPipeInputChannel();
    var stub = sinon.stub(inputChannel, '_readData');
    stub.withArgs(versionsEndpointPath).callsArgWith(1, undefined,
      "<?xml version=\"1.0\" encoding=\"utf-8\"?>" +
      "<RuntimeServerDiscovery xmlns:xsi=\"http://www.w3.org/2001/XMLSchema-instance\"" +
      "xmlns:xsd=\"http://www.w3.org/2001/XMLSchema\">" +
      "<RuntimeServerEndpoints>" +
      "<RuntimeServerEndpoint version=\"2011-03-08\" path=\"SomePath.GoalState\" />" +
      "</RuntimeServerEndpoints>" +
      "</RuntimeServerDiscovery>"
    );

    var runtimeVersionProtocolClient = new RuntimeVersionProtocolClient(inputChannel);
    var runtimeKernel = {
      getGoalStateClient: function () { return {}; },
      getCurrentStateClient: function () { return {}; }
    };

    var runtimeVersionManager = new RuntimeVersionManager(runtimeVersionProtocolClient, runtimeKernel);
    runtimeVersionManager.getRuntimeClient(versionsEndpointPath, function (error, runtimeClient) {
      assert.equal(error, undefined);
      assert.notEqual(runtimeClient, null);

      done();
    });
  });
});