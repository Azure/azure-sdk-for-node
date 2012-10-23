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

var azureutil = require('./util');
var Constants = require('./constants');

exports = module.exports;

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

/*
* Writes a single property for an entry or complex type.
*
* @param {object} parentElement         Parent DOM element under which the property should be added.
* @param {string} name                  Property name.
* @param {object} value                 Property value.
* @return {object} The current DOM element.
*/
function _writeElementValue (parentElement, name, value) {
  var ignored = false;
  var propertyTagName = name;

  if (!azureutil.stringIsEmpty(value) &&
      typeof value === 'object' &&
      !_isDate(value)) {

    if (Array.isArray(value) && value.length > 0) {
      for (var i in value) {
        if (value.hasOwnProperty(i)) {
          parentElement = _writeElementValue(parentElement, name, value[i]);
        }
      }

      // For an array no element was actually added at this level, so skip uping level.
      ignored = true;
    } else if (typeof value === 'object') {
      parentElement = parentElement.ele(propertyTagName);
      for (var propertyName in value) {
        if (propertyName !== Constants.XML_METADATA_MARKER && value.hasOwnProperty(propertyName)) {
          parentElement = _writeElementValue(parentElement, propertyName, value[propertyName]);
        }
      }
    } else {
      // Ignoring complex elements
      ignored = true;
    }
  } else {
    parentElement = parentElement.ele(propertyTagName);
    if (!azureutil.stringIsEmpty(value)) {
      parentElement = parentElement.txt(formatToString(value));
    }
  }

  if (value && value[Constants.XML_METADATA_MARKER]) {
    // include the metadata
    var attributeList = value[Constants.XML_METADATA_MARKER];
    for (var attribute in attributeList) {
      if (attributeList.hasOwnProperty(attribute)) {
        parentElement = parentElement.att(attribute, attributeList[attribute]);
      }
    }
  }

  if (!ignored) {
    parentElement = parentElement.up();
  }

  return parentElement;
}

/*
* Checks whether the specified value is a Date object.
* @param {string} value   Value to check.
* @return {bool} true if the value is a Date object; false otherwise.
*/
function _isDate (value) {
  return Object.prototype.toString.call(value) === "[object Date]";
}

/**
* Formats a value by invoking .toString() on it.
* @param {object} value Value to format.
* @return {string} The formatted text.
*/
function formatToString(value) {
  return value.toString();
}