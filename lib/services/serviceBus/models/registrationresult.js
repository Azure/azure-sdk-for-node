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

var atomHandler = require('../../../util/atomhandler');

exports.serialize = function (type, resource, properties) {
  var content = {};
  content['RegistrationDescription'] = resource;
  content['RegistrationDescription']['$'] = {
    'xmlns:i': 'http://www.w3.org/2001/XMLSchema-instance',
    'i:type': type,
    'xmlns': 'http://schemas.microsoft.com/netservices/2010/10/servicebus/connect'
  };

  return atomHandler.serializeEntry(content, null, properties);
};

exports.parse = function (xml) {
  return atomHandler.parse(xml);
};