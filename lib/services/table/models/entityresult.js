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
var OdataHandler = require('../../../util/odatahandler');
var Constants = require('../../../util/constants');

exports = module.exports;

exports.serialize = function (entity) {
  var properties = {};

  for (var name in entity) {
    if (name !== '_') {

      if (entity[name] &&
          entity[name][Constants.XML_METADATA_MARKER] &&
          entity[name][Constants.XML_METADATA_MARKER].type) {

        properties[OdataHandler.NSDATA + ':' + name] = entity[name];
        properties[OdataHandler.NSDATA + ':' + name][Constants.XML_METADATA_MARKER][OdataHandler.NSMETA + ':type'] = properties[OdataHandler.NSDATA + ':' + name][Constants.XML_METADATA_MARKER].type;

        delete properties[OdataHandler.NSDATA + ':' + name][Constants.XML_METADATA_MARKER].type;
      }
      else {
        properties[OdataHandler.NSDATA + ':' + name] = entity[name];
      }
    }
  }

  var atomEntity = {
    'title': '',
    'updated': new Date().toISOString(),
    'author': {
      name: ''
    },
    'id': entity.id ? entity.id : '',
    'content': {
      '$': { type: 'application/xml' }
    }
  };

  atomEntity.content[OdataHandler.NSMETA + ':properties'] = properties;

  var odataHandler = new OdataHandler();
  return odataHandler.serialize(atomEntity);
};

exports.parse = function (entityXml) {
  var odataHandler = new OdataHandler();
  return odataHandler.parse(entityXml);
};