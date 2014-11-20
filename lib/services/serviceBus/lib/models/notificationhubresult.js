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

exports.serialize = function (resource) {
  var inputProperties = {
    wns: 'WnsCredential',
    apns: 'ApnsCredential',
    gcm: 'GcmCredential',
    mpns: 'MpnsCredential'
  };

  var properties = [];

  var formattedResource = null;
  if (resource) {
    formattedResource = {};

    Object.keys(inputProperties).forEach(function (inputProperty) {
      var property = inputProperties[inputProperty];
      properties.push(property);

      if (resource[inputProperty]) {
        formattedResource[property] = {
          Properties: {
            Property: []
          }
        };

        Object.keys(resource[inputProperty]).forEach(function (propertyName) {
          formattedResource[property]['Properties']['Property'].push({
            Name: propertyName,
            Value: resource[inputProperty][propertyName]
          });
        });
      }
    });
  }

  return resourceResult.serialize('NotificationHubDescription', formattedResource, properties);
};

exports.parse = function (xml) {
  return resourceResult.parse('NotificationHubDescription', [ 'NotificationHubName' ], xml);
};