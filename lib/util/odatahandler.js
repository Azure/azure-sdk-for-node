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
var atomHandler = require('./atomhandler');

var azureutil = require('./util');
var Constants = require('./constants');
var edmType = require('./edmtype');

function OdataHandler(nsMeta, nsData) {
  this.nsMeta = nsMeta;
  if (this.nsMeta === undefined) {
    this.nsMeta = OdataHandler.NSMETA;
  }

  this.nsData = nsData;
  if (this.nsData === undefined) {
    this.nsData = OdataHandler.NSDATA;
  }
}

OdataHandler.NSMETA = 'm';
OdataHandler.NSDATA = 'd';

OdataHandler.prototype.parse = function (entityXml, innerTag) {
  if (!innerTag) {
    innerTag = Constants.ATOM_PROPERTIES_MARKER;
  }

  var entity = {};

  function setEntityRootProperty (name, value) {
    if (!entity['_']) {
      entity['_'] = {};
    }

    entity['_'][name] = value;
  }

  if (entityXml) {
    if (entityXml.id) {
      setEntityRootProperty('id', entityXml.id);
    }

    if (entityXml.link &&
        entityXml.link[Constants.XML_METADATA_MARKER] &&
        entityXml.link[Constants.XML_METADATA_MARKER].href) {

      setEntityRootProperty('link', entityXml.link[Constants.XML_METADATA_MARKER].href);
    }

    if (entityXml.updated) {
      setEntityRootProperty('updated', entityXml.updated);
    }

    if (entityXml[Constants.XML_METADATA_MARKER] &&
        entityXml[Constants.XML_METADATA_MARKER][this._xmlQualifyXmlTagName('etag', this.nsMeta)]) {

      setEntityRootProperty('etag', entityXml[Constants.XML_METADATA_MARKER][this._xmlQualifyXmlTagName('etag', this.nsMeta)]);
    }

    var propertiesXmlTag = this._xmlQualifyXmlTagName(innerTag, this.nsMeta);
    if (entityXml.content && entityXml.content[propertiesXmlTag]) {
      for (var property in entityXml.content[propertiesXmlTag]) {
        if (entityXml.content[propertiesXmlTag].hasOwnProperty(property)) {
          var propertyName = property;
          if (azureutil.stringStartsWith(propertyName, this.nsData + ':')) {
            propertyName = property.substr(2, property.length - 2);
          }

          if (property !== Constants.XML_METADATA_MARKER) {
            if (azureutil.objectIsEmpty(entityXml.content[propertiesXmlTag][property])) {
              // Empty properties are represented as an empty string.
              entity[propertyName] = '';
            } else if (entityXml.content[propertiesXmlTag][property][Constants.XML_METADATA_MARKER] !== undefined &&
                entityXml.content[propertiesXmlTag][property][Constants.XML_METADATA_MARKER][this._xmlQualifyXmlTagName('null', this.nsMeta)] &&
                entityXml.content[propertiesXmlTag][property][Constants.XML_METADATA_MARKER][this._xmlQualifyXmlTagName('null', this.nsMeta)] === 'true') {
              entity[propertyName] = null;
            } else if (entityXml.content[propertiesXmlTag][property][Constants.XML_VALUE_MARKER] !== undefined) {
              // Has an entry for value
              if (entityXml.content[propertiesXmlTag][property][Constants.XML_METADATA_MARKER] &&
                entityXml.content[propertiesXmlTag][property][Constants.XML_METADATA_MARKER][this._xmlQualifyXmlTagName('type', this.nsMeta)]) {
                // Has metadata for type
                this._setProperty(
                  entity,
                  propertyName,
                  entityXml.content[propertiesXmlTag][property][Constants.XML_VALUE_MARKER],
                  entityXml.content[propertiesXmlTag][property][Constants.XML_METADATA_MARKER][this._xmlQualifyXmlTagName('type', this.nsMeta)]);
              } else {
                // The situation where a value marker exists and no type / null metadata marker exists shouldn't happen, but, just in case ...
                entity[propertyName] = entityXml.content[propertiesXmlTag][property][Constants.XML_VALUE_MARKER];
              }
            } else {
              entity[propertyName] = entityXml.content[propertiesXmlTag][property];
            }
          }
        }
      }
    }
  }

  return entity;
};

/**
* Qualifies an XML tag name with the specified prefix.
* This operates at the lexical level - there is no awareness of in-scope prefixes.
*
* @param {string} name      Element name.
* @param {string} prefix    Prefix to use, possibly null.
* @return {string} The qualified tag name.
*/
OdataHandler.prototype._xmlQualifyXmlTagName = function (name, prefix) {
  if (prefix) {
    return prefix + ':' + name;
  }

  return name;
};

/**
* Sets an entity property based on its target name, value and type.
*
* @param {object} entity       The entity descriptor where to set the property.
* @param {string} propertyName The target property name.
* @param {object} value        The property value.
* @param {string} type         The name of the property's type.
*/
OdataHandler.prototype._setProperty = function (entity, propertyName, value, type) {
  entity[propertyName] = edmType.unserializeValue(type, value);
};

/*
* Serializes an entity to an Odata (Atom based) payload.
*
* The following formats are accepted:
* - { stringValue: { '$': { type: 'Edm.String' }, '_': 'my string' }, myInt: { '$': { type: 'Edm.Int32' }, '_': 3 } }
* - { stringValue: 'my string', myInt: 3 }
*/
OdataHandler.prototype.serialize = function (entity, skipType) {
  var properties = {};

  Object.keys(entity).forEach(function (name) {
    if (name !== '_') {
      properties[OdataHandler.NSDATA + ':' + name] = { };
      properties[OdataHandler.NSDATA + ':' + name][Constants.XML_METADATA_MARKER] = {};

      var propertyType = null;
      var propertyValue = null;

      if (entity[name] &&
          entity[name][Constants.XML_METADATA_MARKER] !== undefined &&
          entity[name][Constants.XML_METADATA_MARKER].type !== undefined) {

        propertyType = entity[name][Constants.XML_METADATA_MARKER].type;
        if (entity[name][Constants.XML_VALUE_MARKER] !== undefined) {
          propertyValue = edmType.serializeValue(propertyType, entity[name][Constants.XML_VALUE_MARKER]);
        }
      }
      else {
        if (entity[name] !== undefined && entity[name] !== null) {
          propertyType = edmType.propertyType(entity[name]);
        }

        propertyValue = edmType.serializeValue(propertyType, entity[name]);
      }

      properties[OdataHandler.NSDATA + ':' + name][Constants.XML_VALUE_MARKER] = propertyValue;

      if (!skipType && propertyType !== null) {
        properties[OdataHandler.NSDATA + ':' + name][Constants.XML_METADATA_MARKER][OdataHandler.NSMETA + ':type'] = propertyType;
      }

      if (azureutil.stringIsEmpty(propertyValue)) {
        properties[OdataHandler.NSDATA + ':' + name][Constants.XML_METADATA_MARKER][OdataHandler.NSMETA + ':null'] = true;
      }
    }
  });

  return atomHandler.serializeEntry({ 'm:properties': properties }, [
    {
      key: OdataHandler.NSDATA,
      url: 'http://schemas.microsoft.com/ado/2007/08/dataservices'
    },
    {
      key: OdataHandler.NSMETA,
      url: 'http://schemas.microsoft.com/ado/2007/08/dataservices/metadata'
    }
  ]);
};

module.exports = OdataHandler;