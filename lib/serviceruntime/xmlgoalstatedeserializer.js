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

function XmlGoalStateDeserializer() {}

XmlGoalStateDeserializer.prototype.deserialize = function (xml) {
  if (!xml) {
    throw new Error('Invalid goal state');
  }

  var goalState = {};

  goalState.incarnation = xml[ServiceRuntimeConstants.GOAL_STATE][ServiceRuntimeConstants.INCARNATION][0];
  goalState.expectedState = xml[ServiceRuntimeConstants.GOAL_STATE][ServiceRuntimeConstants.EXPECTED_STATE][0];
  goalState.roleEnvironmentPath = xml[ServiceRuntimeConstants.GOAL_STATE][ServiceRuntimeConstants.ROLE_ENVIRONMENT_PATH][0];
  goalState.deadline = xml[ServiceRuntimeConstants.GOAL_STATE][ServiceRuntimeConstants.DEADLINE][0];
  goalState.currentStateEndpoint = xml[ServiceRuntimeConstants.GOAL_STATE][ServiceRuntimeConstants.CURRENT_STATE_ENDPOINT][0];

  return goalState;
};

module.exports = XmlGoalStateDeserializer;