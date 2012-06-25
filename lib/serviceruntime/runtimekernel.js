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

// Module dependencies.
var FileInputChannel = require('./fileinputchannel');

var NamedPipeInputChannel = require('./namedpipeinputchannel');
var NamedPipeOutputChannel = require('./namedpipeoutputchannel');

var Protocol1RuntimeCurrentStateClient = require('./protocol1runtimecurrentstateclient');
var Protocol1RuntimeGoalStateClient = require('./protocol1runtimegoalstateclient');

var RuntimeVersionProtocolClient = require('./runtimeversionprotocolclient');
var RuntimeVersionManager = require('./runtimeversionmanager');

var GoalStateDeserializer = require('./goalstatedeserializer');
var XmlRoleEnvironmentDataDeserializer = require('./xmlroleenvironmentdatadeserializer');
var XmlCurrentStateSerializer = require('./xmlcurrentstateserializer');

// Expose 'RuntimeKernel'.
exports = module.exports = RuntimeKernel;

var theKernel;

function RuntimeKernel() {
  this.currentStateSerializer = new XmlCurrentStateSerializer();
  this.goalStateDeserializer = new GoalStateDeserializer();
  this.namedPipeOutputChannel = new NamedPipeOutputChannel();
  this.namedPipeInputChannel = new NamedPipeInputChannel();
  this.fileInputChannel = new FileInputChannel();

  this.protocol1RuntimeCurrentStateClient = new Protocol1RuntimeCurrentStateClient(this.currentStateSerializer, this.namedPipeOutputChannel);

  this.roleEnvironmentDataDeserializer = new XmlRoleEnvironmentDataDeserializer();
  this.protocol1RuntimeGoalStateClient = new Protocol1RuntimeGoalStateClient(this.protocol1RuntimeCurrentStateClient,
    this.goalStateDeserializer, this.roleEnvironmentDataDeserializer, this.namedPipeInputChannel, this.fileInputChannel);

  this.runtimeVersionProtocolClient = new RuntimeVersionProtocolClient(this.namedPipeInputChannel);
  this.runtimeVersionManager = new RuntimeVersionManager(this.runtimeVersionProtocolClient, this);
}

RuntimeKernel.getKernel = function () {
  if (!theKernel) {
    theKernel = new RuntimeKernel();
  }

  return theKernel;
};

RuntimeKernel.prototype.getGoalStateClient = function () {
  return this.protocol1RuntimeGoalStateClient;
};

RuntimeKernel.prototype.getCurrentStateClient = function () {
  return this.protocol1RuntimeCurrentStateClient;
};

RuntimeKernel.prototype.getRuntimeVersionManager = function () {
  return this.runtimeVersionManager;
};