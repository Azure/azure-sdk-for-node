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
var Constants = require('../../../util/constants');
var HeaderConstants = Constants.HeaderConstants;

function LeaseResult(container, blob, id, time) {
  if (container) {
    this.container = container;
  }

  if (blob) {
    this.blob = blob;
  }

  if (id) {
    this.id = id;
  }

  if (time) {
    this.time = time;
  }
}

LeaseResult.prototype.getPropertiesFromHeaders = function (headers) {
  var self = this;

  var setPropertyFromHeaders = function (leaseProperty, headerProperty) {
    if (!self[leaseProperty] && headers[headerProperty.toLowerCase()]) {
      self[leaseProperty] = headers[headerProperty.toLowerCase()];
    }
  };

  setPropertyFromHeaders('id', HeaderConstants.LEASE_ID_HEADER);
  setPropertyFromHeaders('time', HeaderConstants.LEASE_TIME_HEADER);
};

module.exports = LeaseResult;