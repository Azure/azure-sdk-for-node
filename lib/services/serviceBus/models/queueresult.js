// 
// Copyright (c) Microsoft and contributors.  All rights reserved.
// 
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//   http://www.apache.org/licenses/LICENSE-2.0
// 
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// 
// See the License for the specific language governing permissions and
// limitations under the License.
// 

var resourceResult = require('./resourceresult');

var Constants = require('azure-common').Constants;
var ServiceBusConstants = Constants.ServiceBusConstants;

exports.serialize = function (resource) {
  var properties = [
    ServiceBusConstants.LOCK_DURATION,
    ServiceBusConstants.MAX_SIZE_IN_MEGABYTES,
    ServiceBusConstants.REQUIRES_DUPLICATE_DETECTION,
    ServiceBusConstants.REQUIRES_SESSION,
    ServiceBusConstants.DEFAULT_MESSAGE_TIME_TO_LIVE,
    ServiceBusConstants.DEAD_LETTERING_ON_MESSAGE_EXPIRATION,
    ServiceBusConstants.DUPLICATE_DETECTION_HISTORY_TIME_WINDOW,
    ServiceBusConstants.MAX_DELIVERY_COUNT,
    ServiceBusConstants.ENABLE_BATCHED_OPERATIONS,
    ServiceBusConstants.SIZE_IN_BYTES,
    ServiceBusConstants.MESSAGE_COUNT
  ];

  return resourceResult.serialize('QueueDescription', resource, properties);
};

exports.parse = function (xml) {
  return resourceResult.parse('QueueDescription', [ 'QueueName' ], xml);
};