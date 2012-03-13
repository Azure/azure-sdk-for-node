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

// Module dependencies.
var EventEmitter = require('events').EventEmitter;
var util = require('util');

var Constants = require('../util/constants');
var ServiceRuntimeConstants = Constants.ServiceRuntimeConstants;

// Expose 'Protocol1RuntimeGoalStateClient'.
exports = module.exports = Protocol1RuntimeGoalStateClient;

function Protocol1RuntimeGoalStateClient(currentStateClient, goalStateDeserializer, roleEnvironmentDataDeserializer, namedPipeInputChannel, fileInputChannel) {
  EventEmitter.call(this);

  this.currentStateClient = currentStateClient;
  this.goalStateDeserializer = goalStateDeserializer;
  this.roleEnvironmentDataDeserializer = roleEnvironmentDataDeserializer;
  this.namedPipeInputChannel = namedPipeInputChannel;
  this.fileInputChannel = fileInputChannel;
  this.endpoint = null;

  this.currentGoalState = null;
  this.currentEnvironmentData = null;
}

util.inherits(Protocol1RuntimeGoalStateClient, EventEmitter);

Protocol1RuntimeGoalStateClient.prototype.getCurrentGoalState = function (callback) {
  var self = this;
  this.ensureGoalStateRetrieved(function (error) {
    if (!error) {
      callback(error, self.currentGoalState);
    } else {
      callback(error);
    }
  });
};

Protocol1RuntimeGoalStateClient.prototype.getRoleEnvironmentData = function (callback) {
  var self = this;
  this.ensureGoalStateRetrieved(function (error) {
    if (!error) {
      if (!self.currentEnvironmentData) {
        self.fileInputChannel.readInputChannel(self.currentGoalState.roleEnvironmentPath, true, function (readError, data) {
          self.currentEnvironmentData = self.roleEnvironmentDataDeserializer.deserialize(data);
          callback(readError, self.currentEnvironmentData);
        });
      } else {
        callback(undefined, self.currentEnvironmentData);
      }
    } else {
      callback(error);
    }
  });
};

Protocol1RuntimeGoalStateClient.prototype.ensureGoalStateRetrieved = function (callback) {
  var self = this;
  if (!self.currentGoalState) {
    self.namedPipeInputChannel.readInputChannel(self.endpoint, true, function (error, data) {
      if (error) {
        callback(error);
      } else {
        self.currentGoalState = self.goalStateDeserializer.deserialize(data);
        callback();
      }
    });
  } else {
    callback();
  }
};