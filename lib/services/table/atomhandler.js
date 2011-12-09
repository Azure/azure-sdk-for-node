/**
* Copyright 2011 Microsoft Corporation
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
var xmlbuilder = require('xmlbuilder');

var azureutil = require('../../util/util');
var ISO8061Date = require('../../util/iso8061date');

// Expose 'AtomHandler'.
exports = module.exports = AtomHandler;

function AtomHandler(nsMeta, nsData) {
  this.nsMeta = nsMeta;
  this.nsData = nsData;
}

AtomHandler.prototype.parse = function (entityXml) {
  var entity = {};

  if (entityXml.id) {
    entity.id = entityXml.id;
  }

  if (entityXml.link && entityXml.link['@'] && entityXml.link['@'].href) {
    entity.link = entityXml.link['@'].href;
  }

  if (entityXml.updated) {
    entity.updated = entityXml.updated;
  }

  if (entityXml['@'] && entityXml['@'][xmlQualifyXmlTagName('etag', this.nsMeta)]) {
    entity.etag = entityXml['@'][xmlQualifyXmlTagName('etag', this.nsMeta)];
  }

  var propertiesXmlTag = xmlQualifyXmlTagName('properties', this.nsMeta);

  if (entityXml.content && entityXml.content[propertiesXmlTag]) {
    for (var property in entityXml.content[propertiesXmlTag]) {
      var propertyName = property;
      if (property.indexOf(this.nsData) !== -1) {
        propertyName = property.substr(2, property.length - 2);
      }

      if (entityXml.content[propertiesXmlTag][property]['@']) {
        setProperty(
                entity,
                propertyName,
                entityXml.content[propertiesXmlTag][property]['#'],
                entityXml.content[propertiesXmlTag][property]['@'][xmlQualifyXmlTagName('type', this.nsMeta)]);
      } else if (azureutil.isEmptyObject(entityXml.content[propertiesXmlTag][property])) {
        // Empty properties are represented as an empty string.
        entity[propertyName] = '';
      } else {
        entity[propertyName] = entityXml.content[propertiesXmlTag][property];
      }
    }
  }

  return entity;
};

AtomHandler.prototype.serialize = function (entity) {
  var doc = xmlbuilder.create();

  doc = doc.begin('entry', { version: '1.0', encoding: 'utf-8', standalone: 'yes' })
      .att('xmlns', 'http://www.w3.org/2005/Atom')
      .att('xmlns:m', 'http://schemas.microsoft.com/ado/2007/08/dataservices/metadata')
      .att('xmlns:d', 'http://schemas.microsoft.com/ado/2007/08/dataservices')
      .ele('title')
      .up()
      .ele('updated')
        .txt(ISO8061Date.format(new Date()))
      .up()
      .ele('author')
        .ele('name')
        .up()
      .up()
      .ele('id')
      .up()
      .ele('content')
        .att('type', 'application/xml')
        .ele(xmlQualifyXmlTagName('properties', this.nsMeta));

  doc = writeAtomEntryProperties(doc, entity, this.nsMeta, this.nsData);

  doc = doc
        .up()
      .up().doc();

  return doc.toString();
};

/**
* Sets an entity property based on its target name, value and type.
*
* @param {object} entity       The entity descriptor where to set the property.
* @param {string} propertyName The target property name.
* @param {object} value        The property value.
* @param {string} type         The name of the property's type.
*/
function setProperty(entity, propertyName, value, type) {
  switch (type) {
      case "Edm.Binary":
        entity[propertyName] = value;
        break;
      case "Edm.Boolean":
        entity[propertyName] = value === 'true';
        break;
      case "Edm.Byte":
        entity[propertyName] = value;
        break;
      case "Edm.DateTime":
      case "Edm.DateTimeOffset":
        entity[propertyName] = new Date(value);
        break;
      case "Edm.Decimal":
      case "Edm.Double":
        entity[propertyName] = parseFloat(value);
        break;
      case "Edm.Guid":
        entity[propertyName] = value;
        break;
      case "Edm.Int16":
      case "Edm.Int32":
      case "Edm.Int64":
        entity[propertyName] = parseInt(value, 10);
        break;
      case "Edm.SByte":
      case "Edm.Single":
      case "Edm.String":
      case "Edm.Time":
        entity[propertyName] = value;
        break;
      default:
        entity[propertyName] = value;
        break;
  }
}

/**
* Qualifies an XML tag name with the specified prefix.
* This operates at the lexical level - there is no awareness of in-scope prefixes.
*
* @param {string} name      Element name.
* @param {string} prefix    Prefix to use, possibly null.
* @return {string} The qualified tag name.
*/
var xmlQualifyXmlTagName = function (name, prefix) {
  if (prefix) {
    return prefix + ":" + name;
  }

  return name;
};

/**
* Writes the properties of an entry or complex type.
* 
* @param {object} parentElement   Parent DOM element under which the properties should be added.
* @param {object} entry           Data object to write.
* @return {object} The current DOM element.
*/
var writeAtomEntryProperties = function (parentElement, entry, nsMeta, nsData) {
  var name, value;
  for (name in entry) {
    value = entry[name];

    parentElement = writeAtomEntryProperty(parentElement, name, value, nsMeta, nsData);
  }

  return parentElement;
};

/*
* Writes a single property for an entry or complex type.
*
* @param {object} parentElement         Parent DOM element under which the property should be added.
* @param {string} name                  Property name.
* @param {object} value                 Property value.
* @return {object} The current DOM element.
*/
var writeAtomEntryProperty = function (parentElement, name, value, nsMeta, nsData) {
  var ignored = false;
  var propertyTypeAttribute = xmlQualifyXmlTagName("type", nsMeta);
  var propertyNullAttribute = xmlQualifyXmlTagName("null", nsMeta);

  if (name.toLowerCase() !== 'id' &&
      name.toLowerCase() !== 'link' &&
      name.toLowerCase() !== 'updated' &&
      name.toLowerCase() !== 'etag' &&
      name.toLowerCase() !== 'timestamp') {

    var propertyTagName = xmlQualifyXmlTagName(name, nsData);
    var propertyType = null;
    if (!azureutil.isEmptyString(value) &&
        typeof value === 'object') {

      if (value['#']) {
        // Value + type
        propertyType = value['@'].type;
        parentElement = parentElement.ele(propertyTagName)
          .txt(convertToAtomPropertyText(value['#'], propertyType));
      } else if (isDate(value)) {
        parentElement = parentElement.ele(propertyTagName)
          .txt(convertToAtomPropertyText(value, "Edm.DateTime"));
      } else {
        // Ignoring complex elements
        ignored = true;
      }
    } else {
      parentElement = parentElement.ele(propertyTagName);
      if (!azureutil.isEmptyString(value)) {
        parentElement = parentElement.txt(convertToAtomPropertyText(value, "Edm.String"));
      }
    }

    if (value === null) {
      parentElement = parentElement.att(propertyNullAttribute, "true");
    }

    if (propertyType) {
      parentElement = parentElement.att(propertyTypeAttribute, propertyType);
    }

    if (value && value['@']) {
      // include the metadata
      var attributeList = value['@'];
      for (var attribute in attributeList) {
        if (attribute !== 'type') {
          parentElement = parentElement.att(xmlQualifyXmlTagName(attribute, nsMeta), attributeList[attribute]);
        }
      }
    }

    if (!ignored) {
      parentElement = parentElement.up();
    }
  }

  return parentElement;
};

/**
* Converts a typed value from the specified target type into a text value.
*
* @param {object}   value         Typed value to convert.
* @param {object}   targetType    Name of type to convert to.
* @return {string} The converted value as text.
*/
var convertToAtomPropertyText = function (value, targetType) {
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
var isDate = function (value) {
    return Object.prototype.toString.call(value) === "[object Date]";
};

/**
* Formats a value by invoking .toString() on it.
* @param {object} value Value to format.
* @return {string} The formatted text.
*/
var formatToString = function (value) {
  return value.toString();
};

// Property type formatters are serializers that convert typed values into strings.
var propertyTypeFormatters = {
  "Edm.Binary": formatToString,
  "Edm.Boolean": formatToString,
  "Edm.Byte": formatToString,
  "Edm.DateTime": formatToString,
  "Edm.DateTimeOffset": formatToString,
  "Edm.Decimal": formatToString,
  "Edm.Double": formatToString,
  "Edm.Guid": formatToString,
  "Edm.Int16": formatToString,
  "Edm.Int32": formatToString,
  "Edm.Int64": formatToString,
  "Edm.SByte": formatToString,
  "Edm.Single": formatToString,
  "Edm.String": formatToString,
  "Edm.Time": formatToString
};
