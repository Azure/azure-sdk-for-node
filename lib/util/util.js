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

var fs = require('fs');
var path = require('path');
var _ = require('underscore');
_.mixin(require('underscore.string'));

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
* Returns the number of keys (properties) in an object.
*
* @param {object} value The object which keys are to be counted.
* @return {number} The number of keys in the object.
*/
exports.objectKeysLength = function (value) {
  if (!value) {
    return 0;
  }

  return _.keys(value).length;
};

/**
* Returns the name of the first property in an object.
*
* @param {object} value The object which key is to be returned.
* @return {number} The name of the first key in the object.
*/
exports.objectFirstKey = function (value) {
  if (value) {
    for (var key in value) {
      return key;
    }
  }

  // Object has no properties
  return null;
};

/**
* Checks if a value is null or undefined.
*
* @param {object} value The value to check for null or undefined.
* @return {bool} True if the value is null or undefined, false otherwise.
*/
exports.objectIsNull = function (value) {
  return _.isNull(value) || _.isUndefined(value);
};

/**
* Checks if an object is empty.
*
* @param {object} object The object to check if it is null.
* @return {bool} True if the object is empty, false otherwise.
*/
exports.objectIsEmpty = function (object) {
  return _.isEmpty(object);
};

/**
* Checks if an object is a string.
*
* @param {object} object The object to check if it is a string.
* @return {bool} True if the object is a strign, false otherwise.
*/
exports.objectIsString = function (object) {
  return _.isString(object);
};

/**
* Checks if a value is an empty string, null or undefined.
*
* @param {object} value The value to check for an empty string, null or undefined.
* @return {bool} True if the value is an empty string, null or undefined, false otherwise.
*/
exports.stringIsEmpty = function (value) {
  return _.isNull(value) || _.isUndefined(value) || value === '';
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
* @param {string}       text      The string to assert.
* @param {string}       prefix    The string prefix.
* @return {Bool} True if the string starts with the prefix; false otherwise.
*/
exports.stringStartsWith = function (text, prefix) {
  if (_.isNull(prefix)) {
    return true;
  }

  return _.startsWith(text, prefix);
};

/**
* Determines if a string ends with another.
*
* @param {string}       text      The string to assert.
* @param {string}       suffix    The string suffix.
* @return {Bool} True if the string ends with the suffix; false otherwise.
*/
exports.stringEndsWith = function (text, suffix) {
  if (_.isNull(suffix)) {
    return true;
  }

  return _.endsWith(text, suffix);
};

/**
* Determines if a string contains an integer number.
*
* @param {string}       text      The string to assert.
* @return {Bool} True if the string contains an integer number; false otherwise.
*/
exports.stringIsInt = function (value) {
  if (!value) {
    return false;
  }

  var intValue = parseInt(value, 10);
  return intValue.toString().length === value.length &&
         intValue === parseFloat(value);
};

/**
* Determines if a string contains a float number.
*
* @param {string}       text      The string to assert.
* @return {Bool} True if the string contains a float number; false otherwise.
*/
exports.stringIsFloat = function(value) {
  if (!value) {
    return false;
  }

  var floatValue = parseFloat(value);
  return floatValue.toString().length === value.length &&
         parseInt(value, 10) !== floatValue;
};

/**
* Determines if a string contains a number.
*
* @param {string}       text      The string to assert.
* @return {Bool} True if the string contains a number; false otherwise.
*/
exports.stringIsNumber = function(value) {
  return !isNaN(value);
};

/**
* Determines if a date object is valid.
*
* @param {Date} date The date to test
* @return {Bool} True if the date is valid; false otherwise.
*/
exports.stringIsDate = function(date) {
  if (Object.prototype.toString.call(date) !== "[object Date]") {
    return false;
  }

  return !isNaN(date.getTime());
};

/**
* Merges multiple objects.
*
* @param {object} object The objects to be merged
* @return {object} The merged object.
*/
exports.merge = function () {
  return _.extend.apply(this, arguments);
};

/**
* Checks if a value exists in an array. The comparison is done in a case
* insensitive manner.
* 
* @param {string} needle     The searched value.
* @param {array}  haystack   The array.
* 
* @static
* 
* @return {boolean}
*/
exports.inArrayInsensitive = function (needle, haystack) {
  return _.contains(_.map(haystack, function (h) { return h.toLowerCase() }), needle.toLowerCase());
};

/**
* Returns the specified value of the key passed from object and in case that
* this key doesn't exist, the default value is returned. The key matching is
* done in a case insensitive manner.
*
* @param {string} key      The array key.
* @param {object} haystack The object to be used.
* @param {mix}    default  The value to return if $key is not found in $array.
* 
* @static
* 
* @return mix
*/
exports.tryGetValueInsensitive = function (key, haystack, defaultValue) {
  for (var i in haystack) {
    if (i.toString().toLowerCase() === key.toString().toLowerCase()) {
      return haystack[i];
    }
  }

  return defaultValue;
};

exports.pathExistsSync = fs.existsSync
  ? fs.existsSync
  : path.existsSync;