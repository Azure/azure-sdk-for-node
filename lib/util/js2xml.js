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
var xmlbuilder = require('xmlbuilder');
var _ = require('underscore');

var azureutil = require('./util');
var Constants = require('./constants');

exports = module.exports;

/*
* Writes a single property for an entry or complex type.
*
* @param {object} parentElement         Parent DOM element under which the property should be added.
* @param {string} name                  Property name.
* @param {object} value                 Property value.
* @return {object} The current DOM element.
*/
function _writeElementValue(parentElement, name, value) {
  var ignored = false;
  var propertyTagName = name;

  if (!azureutil.stringIsEmpty(value) &&
      _.isObject(value) &&
      !_.isDate(value)) {

    if (Array.isArray(value) && value.length > 0) {
      // Example: 
      // JSON: element: [ { property1: 'hi there' }, { property2: 'hello there' } ]
      // XML: <element><property1>hi there</property1></element><element><property2>hello there</property2></element>

      Object.keys(value).forEach(function (i) {
        parentElement = _writeElementValue(parentElement, name, value[i]);
      });

      // For an array no element was actually added at this level, so skip uping level.
      ignored = true;
    } else if (value[Constants.XML_METADATA_MARKER] !== undefined &&
      value[Constants.XML_VALUE_MARKER] !== undefined) {
      // Example: 
      // JSON: element: { '$': { 'm:type' = 'Edm.String' }, '_': 'hi there' }
      // XML: <element m:type="Edm.String">hi there</element>

      parentElement = parentElement.ele(propertyTagName);
      if (!azureutil.stringIsEmpty(value[Constants.XML_VALUE_MARKER])) {
        if (azureutil.stringStartsWith(value[Constants.XML_VALUE_MARKER], '<![CDATA[')) {
          parentElement = parentElement.raw(value[Constants.XML_VALUE_MARKER]);
        } else {
          parentElement = parentElement.txt(value[Constants.XML_VALUE_MARKER]);
        }
      }
    } else {
      // Example: 
      // JSON: element: { '$': { 'metadata' = 'value' }, 'property1': 'hi there', 'property2': 'hello there' }
      // XML: <element metadata="value"><property1>hi there</property1><property2>hello there</property2></element>

      parentElement = parentElement.ele(propertyTagName);
      for (var propertyName in value) {
        if (propertyName !== Constants.XML_METADATA_MARKER && value.hasOwnProperty(propertyName)) {
          parentElement = _writeElementValue(parentElement, propertyName, value[propertyName]);
        }
      }
    }
  } else {
    parentElement = parentElement.ele(propertyTagName);
    if (!azureutil.stringIsEmpty(value)) {
      if (azureutil.stringStartsWith(value.toString().trim(), '<![CDATA[')) {
        parentElement = parentElement.raw(value.toString());
      } else {
        parentElement = parentElement.txt(value.toString());
      }
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
}

exports.serialize = function (entity) {
  if (azureutil.objectKeysLength(entity) !== 1) {
    throw new Error('Invalid XML root element.');
  }

  var doc = xmlbuilder.create();

  var rootElementName = azureutil.objectFirstKey(entity);

  doc = doc.begin(rootElementName, { version: '1.0', encoding: 'utf-8', standalone: 'yes' });

  if (entity[rootElementName][Constants.XML_METADATA_MARKER]) {
    for (var metadata in entity[rootElementName][Constants.XML_METADATA_MARKER]) {
      if (entity[rootElementName][Constants.XML_METADATA_MARKER].hasOwnProperty(metadata)) {
        doc.att(metadata, entity[rootElementName][Constants.XML_METADATA_MARKER][metadata]);
      }
    }
  }

  for (var attribute in entity[rootElementName]) {
    if (attribute !== Constants.XML_METADATA_MARKER && entity[rootElementName].hasOwnProperty(attribute)) {
      doc = _writeElementValue(doc, attribute, entity[rootElementName][attribute]);
    }
  }

  doc = doc.doc();

  return doc.toString();
};

exports._writeElementValue = _writeElementValue;