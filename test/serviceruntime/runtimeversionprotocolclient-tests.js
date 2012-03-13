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

var NamedPipeInputChannel = require('../../lib/serviceruntime/namedpipeinputchannel');
var RuntimeVersionProtocolClient = require('../../lib/serviceruntime/runtimeversionprotocolclient');

suite('runtimeversionprotocolclient-tests', function () {
  test('GetVersionMapSingle', function (done) {
    var inputChannel = new NamedPipeInputChannel();
    inputChannel.readData = function (name, callback) {
      callback(undefined,
      "<?xml version=\"1.0\" encoding=\"utf-8\"?>" +
      "<RuntimeServerDiscovery xmlns:xsi=\"http://www.w3.org/2001/XMLSchema-instance\"" +
      "xmlns:xsd=\"http://www.w3.org/2001/XMLSchema\">" +
      "<RuntimeServerEndpoints>" +
      "<RuntimeServerEndpoint version=\"2011-03-08\" path=\"SomePath.GoalState\" />" +
      "</RuntimeServerEndpoints>" +
      "</RuntimeServerDiscovery>");
    };

    var runtimeVersionProtocolClient = new RuntimeVersionProtocolClient(inputChannel);
    runtimeVersionProtocolClient.getVersionMap('', function (error, versions) {
      assert.equal(error, null);
      assert.notEqual(versions, null);
      assert.equal(versions["2011-03-08"], "SomePath.GoalState");

      done();
    });
  });

  test('GetVersionMapArray', function (done) {
    var inputChannel = new NamedPipeInputChannel();
    inputChannel.readData = function (name, callback) {
      callback(undefined,
      "<?xml version=\"1.0\" encoding=\"utf-8\"?>" +
      "<RuntimeServerDiscovery xmlns:xsi=\"http://www.w3.org/2001/XMLSchema-instance\"" +
      "xmlns:xsd=\"http://www.w3.org/2001/XMLSchema\">" +
      "<RuntimeServerEndpoints>" +
      "<RuntimeServerEndpoint version=\"2011-03-08\" path=\"SomePath.GoalState\" />" +
      "<RuntimeServerEndpoint version=\"2011-08-08\" path=\"SomeOtherPath.GoalState\" />" +
      "</RuntimeServerEndpoints>" +
      "</RuntimeServerDiscovery>");
    };

    var runtimeVersionProtocolClient = new RuntimeVersionProtocolClient(inputChannel);
    runtimeVersionProtocolClient.getVersionMap('', function (error, versions) {
      assert.equal(error, null);
      assert.notEqual(versions, null);
      assert.equal(versions["2011-03-08"], "SomePath.GoalState");
      assert.equal(versions["2011-08-08"], "SomeOtherPath.GoalState");

      done();
    });
  });
});
