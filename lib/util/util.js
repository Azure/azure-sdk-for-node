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

/**
* Encodes an URI.
*
* @param {string} uri The URI to be encoded.
* @return {string} The encoded URI.
*/
exports.encodeUri = function (uri) {
  return encodeURIComponent(uri)
    .replace(/!/g, '%21')
    .replace(/'/g, '%27')
    .replace(/\(/g, '%28')
    .replace(/\)/g, '%29')
    .replace(/\*/g, '%2A');
};

/**
* Checks if a value is null or undefined.
*
* @param {object} value The value to check for null or undefined.
* @return {bool} True if the value is null or undefined, false otherwise.
*/
exports.isNull = function (value) {
  return (value === null || value === undefined);
};

/**
* Checks if a value is an empty string, null or undefined.
*
* @param {object} value The value to check for an empty string, null or undefined.
* @return {bool} True if the value is an empty string, null or undefined, false otherwise.
*/
exports.isEmptyString = function (value) {
  return (value === null || value === undefined || value === '');
};

/**
* Checks if an object is empty.
*
* @param {object} object The object to check if it is null.
* @return {bool} True if the object is empty, false otherwise.
*/
exports.isEmptyObject = function(object) {
  for (var i in object) {
    return false;
  }

  return true;
};

/**
* Formats a text replacing '?' by the arguments.
*
* @param {string}       text      The string where the ? should be replaced.
* @param {array}        arguments Value(s) to insert in question mark (?) parameters.
* @return {string}
*/
exports.stringFormat = function (text) {
  if (arguments.length > 1) {
    for (var i = 0; text.indexOf('?') !== -1; i++) {
      text = text.replace('?', arguments[i + 1]);
    }
  }

  return text;
};

/**
* Determines if a string starts with another.
*
* @param {string}       text      The string to test.
* @param {string}       prefix    The string prefix.
* @return {Bool} True if the string starts with the prefix; false otherwise.
*/
exports.stringStartsWith = function (text, prefix) {
  if (!text) {
    return false;
  }

  if (!prefix) {
    return true;
  }

  return text.indexOf(prefix) === 0;
};

/**
* Determines if a string starts ends with another.
*
* @param {string}       text      The string to test.
* @param {string}       suffix    The string suffix.
* @return {Bool} True if the string ends with the suffix; false otherwise.
*/
exports.stringEndsWith = function (text, suffix) {
  if (!text) {
    return false;
  }

  if (!suffix) {
    return true;
  }

  return text.lastIndexOf(suffix) === (text.length - suffix.length);
};

/**
* Determines if a string contains an integer number.
*
* @param {string}       text      The string to test.
* @return {Bool} True if the string contains an integer number; false otherwise.
*/
exports.isInt = function (value) {
  if (!value) {
    return false;
  }

  var intValue = parseInt(value);
  return intValue.toString().length === value.length &&
         intValue === parseFloat(value);
};

/**
* Determines if a string contains a float number.
*
* @param {string}       text      The string to test.
* @return {Bool} True if the string contains a float number; false otherwise.
*/
exports.isFloat = function(value) {
  if (!value) {
    return false;
  }

  var floatValue = parseFloat(value);
  return floatValue.toString().length === value.length &&
         parseInt(value) !== floatValue;
};

/**
* Determines if a string contains a number.
*
* @param {string}       text      The string to test.
* @return {Bool} True if the string contains a number; false otherwise.
*/
exports.isNumber = function(value) {
  return !isNaN(value);
};

/**
* Determines if a date object is valid.
*
* @param {Date} date The date to test
* @return {Bool} True if the date is valid; false otherwise.
*/
exports.isValidDate = function(date) {
  if (Object.prototype.toString.call(date) !== "[object Date]") {
    return false;
  }

  return !isNaN(date.getTime());
};