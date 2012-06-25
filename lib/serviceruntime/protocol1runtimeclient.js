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

// Expose 'Protocol1RuntimeClient'.
exports = module.exports = Protocol1RuntimeClient;

function Protocol1RuntimeClient(goalStateClient, currentStateClient, endpoint) {
  EventEmitter.call(this);

  this.goalStateClient = goalStateClient;
  this.currentStateClient = currentStateClient;
  this.goalStateClient.endpoint = endpoint;

  this.currentGoalState = null;
  this.currentEnvironmentData = null;
}

util.inherits(Protocol1RuntimeClient, EventEmitter);

Protocol1RuntimeClient.prototype.getCurrentGoalState = function (callback) {
  this._addListeners();

  this.goalStateClient.getCurrentGoalState(callback);
};

Protocol1RuntimeClient.prototype.getRoleEnvironmentData = function (callback) {
  this._addListeners();

  this.goalStateClient.getRoleEnvironmentData(callback);
};

Protocol1RuntimeClient.prototype.setCurrentState = function (state, callback) {
  this._addListeners();

  this.currentStateClient.setCurrentState(state, callback);
};

Protocol1RuntimeClient.prototype._addListeners = function () {
  var self = this;
  if (this.goalStateClient.listeners(ServiceRuntimeConstants.CHANGED).length === 0) {
    this.goalStateClient.on(ServiceRuntimeConstants.CHANGED, function (currentGoalState) {
      self.emit(ServiceRuntimeConstants.CHANGED, currentGoalState);
    });
  }
};