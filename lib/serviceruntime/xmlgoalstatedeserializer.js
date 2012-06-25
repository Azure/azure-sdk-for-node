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
var Constants = require('../util/constants');
var ServiceRuntimeConstants = Constants.ServiceRuntimeConstants;

// Expose 'XmlGoalStateDeserializer'.
exports = module.exports = XmlGoalStateDeserializer;

function XmlGoalStateDeserializer() { }

XmlGoalStateDeserializer.prototype.deserialize = function (xml) {
  if (!xml) {
    throw new Error('Invalid goal state');
  }

  var goalState = {};

  goalState.incarnation = xml[ServiceRuntimeConstants.INCARNATION];
  goalState.expectedState = xml[ServiceRuntimeConstants.EXPECTED_STATE];
  goalState.roleEnvironmentPath = xml[ServiceRuntimeConstants.ROLE_ENVIRONMENT_PATH];
  goalState.deadline = xml[ServiceRuntimeConstants.DEADLINE];
  goalState.currentStateEndpoint = xml[ServiceRuntimeConstants.CURRENT_STATE_ENDPOINT];

  return goalState;
};