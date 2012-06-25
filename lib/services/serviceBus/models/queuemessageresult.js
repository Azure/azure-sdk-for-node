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
var util = require('util');

var azureutil = require('../../../util/util');
var RFC1123 = require('../../../util/rfc1123date');

var Constants = require('../../../util/constants');
var ServiceBusConstants = Constants.ServiceBusConstants;
var HeaderConstants = Constants.HeaderConstants;

// Expose 'QueueMessageResult'.
exports = module.exports = QueueMessageResult;

function QueueMessageResult() { }

QueueMessageResult.parse = function (responseObject) {
  var queueMessageResult = new QueueMessageResult();

  queueMessageResult.body = responseObject.body;

  if (responseObject.headers[HeaderConstants.BROKER_PROPERTIES_HEADER]) {
    queueMessageResult.brokerProperties = {};

    var brokerProperties = JSON.parse(responseObject.headers[HeaderConstants.BROKER_PROPERTIES_HEADER]);
    for (var property in brokerProperties) {
      queueMessageResult.brokerProperties[property] = brokerProperties[property];
    }
  }

  // Process custom properties
  var customProperties = null;
  for (var header in responseObject.headers) {
    // Excluded known standard response headers
    if (header !== HeaderConstants.CONTENT_TYPE &&
        header !== HeaderConstants.BROKER_PROPERTIES_HEADER &&
        header !== HeaderConstants.TRANSFER_ENCODING_HEADER &&
        header !== HeaderConstants.SERVER_HEADER &&
        header !== HeaderConstants.LOCATION_HEADER &&
        header !== HeaderConstants.DATE) {

      // Assume custom property
      if (!customProperties) {
        customProperties = {};
      }

      customProperties[header] = QueueMessageResult._propertyFromString(responseObject.headers[header]);
    }
  }

  if (responseObject.headers[HeaderConstants.LOCATION_HEADER]) {
    queueMessageResult.location = responseObject.headers[HeaderConstants.LOCATION_HEADER];
  }

  if (responseObject.headers[HeaderConstants.CONTENT_TYPE]) {
    queueMessageResult.contentType = responseObject.headers[HeaderConstants.CONTENT_TYPE];
  }

  if (customProperties) {
    queueMessageResult.customProperties = customProperties;
  }

  return queueMessageResult;
};

QueueMessageResult._propertyFromString = function (value) {
  if (value === null) {
    return null;
  }

  if (azureutil.stringStartsWith(value, "\"") && azureutil.stringEndsWith(value, "\"")) {
    var text = value.substr(1, value.length - 2);
    if (QueueMessageResult.isRFC1123(text)) {
      return RFC1123.parse(text);
    }

    return text;
  } else if (value === 'true') {
    return true;
  } else if (value === 'false') {
    return false;
  } else if (azureutil.stringIsInt(value)) {
    return parseInt(value, 10);
  } else {
    return parseFloat(value);
  }
};

QueueMessageResult.isRFC1123 = function (value) {
  var date = new Date(value);
  return azureutil.stringIsDate(date);
};