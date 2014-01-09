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

var _ = require('underscore');
var url = require('url');

var azureCommon = require('azure-common');
var Constants = azureCommon.Constants;
var atomHandler = azureCommon.atomHandler;

exports = module.exports;

function setName(entry, nameProperty) {
  var parsedUrl = url.parse(entry[Constants.ATOM_METADATA_MARKER].id);
  var parts = parsedUrl.pathname.split('/');

  for (var i = 0; (i * 2) < (parts.length - 1); i++) {
    entry[nameProperty[i]] = parts[(i * 2) + 1];
  }
}

exports.serialize = function (resourceName, resource, properties) {
  var content = {};
  content[resourceName] = {
    '$': {
      'xmlns:i': 'http://www.w3.org/2001/XMLSchema-instance',
      'xmlns': 'http://schemas.microsoft.com/netservices/2010/10/servicebus/connect'
    }
  };

  if (resource) {
    // Sort properties according to what is allowed by the service
    _.each(properties, function (property) {
      if (!_.isUndefined(resource[property])) {
        content[resourceName][property] = resource[property];
      }
    });
  }

  return atomHandler.serializeEntry(content);
};

exports.parse = function (resourceName, nameProperty, xml) {
  var result = atomHandler.parse(xml);

  if (_.isArray(result)) {
    _.each(result, function (entry) {
      setName(entry, nameProperty);
    });
  } else {
    setName(result, nameProperty);
  }

  return result;
};