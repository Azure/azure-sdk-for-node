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
var EventEmitter = require('events').EventEmitter;
var util = require('util');

var Constants = require('../util/constants');
var ServiceRuntimeConstants = Constants.ServiceRuntimeConstants;

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
  this.closeOnRead = true;
}

util.inherits(Protocol1RuntimeGoalStateClient, EventEmitter);

Protocol1RuntimeGoalStateClient.prototype.getCurrentGoalState = function (callback) {
  var self = this;
  this._ensureGoalStateRetrieved(function (error) {
    if (!error) {
      callback(error, self.currentGoalState);
    } else {
      callback(error);
    }
  });
};

Protocol1RuntimeGoalStateClient.prototype.getRoleEnvironmentData = function (callback) {
  var self = this;
  this._ensureGoalStateRetrieved(function (error) {
    if (!error) {
      if (!self.currentEnvironmentData) {
        self.fileInputChannel.readInputChannel(self.currentGoalState.roleEnvironmentPath, true, function (readError, data) {
          if (!readError) {
            self.currentEnvironmentData = self.roleEnvironmentDataDeserializer.deserialize(data);
            callback(readError, self.currentEnvironmentData);
          } else {
            callback(readError);
          }
        });
      } else {
        callback(undefined, self.currentEnvironmentData);
      }
    } else {
      callback(error);
    }
  });
};

Protocol1RuntimeGoalStateClient.prototype._ensureGoalStateRetrieved = function (callback) {
  if (!this.currentGoalState) {
    this._ensurePolling(callback);
  } else {
    callback();
  }
};

Protocol1RuntimeGoalStateClient.prototype._ensurePolling = function (callback) {
  var currentCallback = callback;
  var self = this;

  self.namedPipeInputChannel.closeOnRead = self.closeOnRead;
  self.namedPipeInputChannel.readInputChannel(self.endpoint, true, function (error, data) {
    if (error) {
      if (currentCallback) {
        currentCallback(error);
      }
    } else if (data) {
      self.currentGoalState = self.goalStateDeserializer.deserialize(data);

      // reset environment data to force refresh
      if (self.currentEnvironmentData) {
        self.currentEnvironmentData = null;
      }

      self.currentStateClient.endpoint = self.currentGoalState.currentStateEndpoint;

      // if callback available invoke it to return immediately
      if (currentCallback) {
        currentCallback();
        currentCallback = null;
      } else {
        // no call back means this is looping for the second time and so there's
        // a re-read that triggers a changed event
        self.emit(ServiceRuntimeConstants.CHANGED, self.currentGoalState);
      }
    }
  });
};

module.exports = Protocol1RuntimeGoalStateClient;