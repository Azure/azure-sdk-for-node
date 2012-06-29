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
var AtomHandler = require('../../../util/atomhandler');
var ISO8061Date = require('../../../util/iso8061date');
var Constants = require('../../../util/constants');
var ServiceBusConstants = Constants.ServiceBusConstants;
var HeaderConstants = Constants.HeaderConstants;

// Expose 'EntityResult'.
exports = module.exports = EntityResult;

function EntityResult() { }

EntityResult.serialize = function (entity) {
  var properties = {};

  for (var name in entity) {
    if (name.toLowerCase() !== 'id' &&
        name.toLowerCase() !== 'link' &&
        name.toLowerCase() !== 'updated' &&
        name.toLowerCase() !== 'etag' &&
        name.toLowerCase() !== 'timestamp') {

      if (entity[name] &&
          entity[name][Constants.XML_METADATA_MARKER] &&
          entity[name][Constants.XML_METADATA_MARKER].type) {

        properties[AtomHandler.NSDATA + ':' + name] = entity[name];
        properties[AtomHandler.NSDATA + ':' + name][Constants.XML_METADATA_MARKER][AtomHandler.NSMETA + ':type'] = properties[AtomHandler.NSDATA + ':' + name][Constants.XML_METADATA_MARKER].type;

        delete properties[AtomHandler.NSDATA + ':' + name][Constants.XML_METADATA_MARKER].type;
      }
      else {
        properties[AtomHandler.NSDATA + ':' + name] = entity[name];
      }
    }
  }

  var atomEntity = {
    'title': '',
    'updated': ISO8061Date.format(new Date()),
    'author': {
      name: ''
    },
    'id': entity.id ? entity.id : '',
    'content': {
      '@': { type: 'application/xml' }
    }
  };

  atomEntity.content[AtomHandler.NSMETA + ':properties'] = properties;

  var atomHandler = new AtomHandler();
  var xml = atomHandler.serialize(atomEntity);

  return xml;
};

EntityResult.parse = function (entityXml) {
  var atomHandler = new AtomHandler();
  var entity = atomHandler.parse(entityXml);

  return entity;
};