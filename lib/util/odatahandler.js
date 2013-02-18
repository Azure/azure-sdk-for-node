﻿/**
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
var _ = require('underscore');
var xmlbuilder = require('xmlbuilder');

var azureutil = require('./util');
var ISO8061Date = require('./iso8061date');
var Constants = require('./constants');

/**
* Formats a value by invoking .toString() on it.
* @param {object} value Value to format.
* @return {string} The formatted text.
*/
function formatToString(value) {
  return value.toString();
}

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

  if (entityXml) {
    if (entityXml.id) {
      entity.id = entityXml.id;
    }

    if (entityXml.link &&
        entityXml.link[Constants.XML_METADATA_MARKER] &&
        entityXml.link[Constants.XML_METADATA_MARKER].href) {

      entity.link = entityXml.link[Constants.XML_METADATA_MARKER].href;
    }

    if (entityXml.updated) {
      entity.updated = entityXml.updated;
    }

    if (entityXml[Constants.XML_METADATA_MARKER] &&
        entityXml[Constants.XML_METADATA_MARKER][this._xmlQualifyXmlTagName('etag', this.nsMeta)]) {

      entity.etag = entityXml[Constants.XML_METADATA_MARKER][this._xmlQualifyXmlTagName('etag', this.nsMeta)];
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
  switch (type) {
  case 'Edm.Binary':
    entity[propertyName] = value;
    break;
  case 'Edm.Boolean':
    entity[propertyName] = value === 'true' || value === '1';
    break;
  case 'Edm.Byte':
    entity[propertyName] = value;
    break;
  case 'Edm.DateTime':
  case 'Edm.DateTimeOffset':
    entity[propertyName] = ISO8061Date.parse(value);
    break;
  case 'Edm.Decimal':
  case 'Edm.Double':
    entity[propertyName] = parseFloat(value);
    break;
  case 'Edm.Guid':
    entity[propertyName] = value;
    break;
  case 'Edm.Int16':
  case 'Edm.Int32':
  case 'Edm.Int64':
    entity[propertyName] = parseInt(value, 10);
    break;
  case 'Edm.SByte':
  case 'Edm.Single':
  case 'Edm.String':
  case 'Edm.Time':
    entity[propertyName] = value;
    break;
  default:
    entity[propertyName] = value;
    break;
  }
};

OdataHandler.prototype.serialize = function (entity) {
  var self = this;
  var doc = xmlbuilder.create();

  doc = doc.begin('entry', { version: '1.0', encoding: 'utf-8', standalone: 'yes' })
    .att('xmlns', 'http://www.w3.org/2005/Atom');

  if (this.nsMeta) {
    doc = doc.att('xmlns:' + this.nsMeta, 'http://schemas.microsoft.com/ado/2007/08/dataservices/metadata');
  }

  if (this.nsData) {
    doc = doc.att('xmlns:' + this.nsData, 'http://schemas.microsoft.com/ado/2007/08/dataservices');
  }

  Object.keys(entity).forEach(function (attribute) {
    doc = self._writeAtomEntryValue(doc, attribute, entity[attribute]);
  });

  doc = doc.doc();

  return doc.toString();
};

/*
* Writes a single property for an entry or complex type.
*
* @param {object} parentElement         Parent DOM element under which the property should be added.
* @param {string} name                  Property name.
* @param {object} value                 Property value.
* @return {object} The current DOM element.
*/
OdataHandler.prototype._writeAtomEntryValue = function (parentElement, name, value) {
  var ignored = false;
  var propertyTagName = name;

  if (!azureutil.stringIsEmpty(value) &&
      typeof value === 'object') {

    if (!azureutil.objectIsNull(value[Constants.XML_VALUE_MARKER]) &&
        !azureutil.objectIsNull(value[Constants.XML_METADATA_MARKER]) &&
        !azureutil.objectIsNull(value[Constants.XML_METADATA_MARKER][this._xmlQualifyXmlTagName('type', this.nsMeta)])) {

      // Primitive value + type
      var propertyType = value[Constants.XML_METADATA_MARKER].type;
      parentElement = parentElement.ele(propertyTagName);

      if (!azureutil.stringIsEmpty(value[Constants.XML_VALUE_MARKER])) {
        parentElement = parentElement.txt(this._convertToAtomPropertyText(value[Constants.XML_VALUE_MARKER], propertyType));
      } else if (azureutil.stringStartsWith(propertyTagName, this.nsData + ':')) {
        // If the property is data, we may need to mark it as null
        parentElement.att(this._xmlQualifyXmlTagName('null', this.nsMeta), 'true');
      }
    } else if (this._isDate(value)) {
      parentElement = parentElement.ele(propertyTagName)
        .txt(this._convertToAtomPropertyText(value, 'Edm.DateTime'));
    } else if (Array.isArray(value) && value.length > 0) {
      _.each(value, function (currentValue) {
        parentElement = this._writeAtomEntryValue(parentElement, name, currentValue);
      });

      // For an array no element was actually added at this level, so skip uping level.
      ignored = true;
    } else if (typeof value === 'object') {
      parentElement = parentElement.ele(propertyTagName);
      for (var propertyName in value) {
        if (propertyName !== Constants.XML_METADATA_MARKER) {
          parentElement = this._writeAtomEntryValue(parentElement, propertyName, value[propertyName]);
        }
      }
    } else {
      // Ignoring complex elements
      ignored = true;
    }
  } else {
    parentElement = parentElement.ele(propertyTagName);
    if (!azureutil.stringIsEmpty(value)) {
      parentElement = parentElement.txt(this._convertToAtomPropertyText(value, 'Edm.String'));
    } else if (azureutil.stringStartsWith(propertyTagName, this.nsData + ':')) {
      // If the property is data, we may need to mark it as null
      parentElement.att(this._xmlQualifyXmlTagName('null', this.nsMeta), 'true');
    }
  }

  if (value && value[Constants.XML_METADATA_MARKER]) {
    // include the metadata
    var attributeList = value[Constants.XML_METADATA_MARKER];
    Object.keys(attributeList).forEach(function (attribute) {
      parentElement = parentElement.att(attribute, attributeList[attribute]);
    });
  }

  if (!ignored) {
    parentElement = parentElement.up();
  }

  return parentElement;
};

// Property type formatters are serializers that convert typed values into strings.
var propertyTypeFormatters = {
  'Edm.Binary': formatToString,
  'Edm.Boolean': formatToString,
  'Edm.Byte': formatToString,
  'Edm.DateTime': formatToString,
  'Edm.DateTimeOffset': formatToString,
  'Edm.Decimal': formatToString,
  'Edm.Double': formatToString,
  'Edm.Guid': formatToString,
  'Edm.Int16': formatToString,
  'Edm.Int32': formatToString,
  'Edm.Int64': formatToString,
  'Edm.SByte': formatToString,
  'Edm.Single': formatToString,
  'Edm.String': formatToString,
  'Edm.Time': formatToString
};

/**
* Converts a typed value from the specified target type into a text value.
*
* @param {object}   value         Typed value to convert.
* @param {object}   targetType    Name of type to convert to.
* @return {string} The converted value as text.
*/
OdataHandler.prototype._convertToAtomPropertyText = function (value, targetType) {
  if (value && targetType) {
    var converter = propertyTypeFormatters[targetType];
    if (converter) {
      value = converter(value);
    }
  }

  return value;
};

/*
* Checks whether the specified value is a Date object.
* @param {string} value   Value to check.
* @return {bool} true if the value is a Date object; false otherwise.
*/
OdataHandler.prototype._isDate = function (value) {
  return Object.prototype.toString.call(value) === '[object Date]';
};

module.exports = OdataHandler;