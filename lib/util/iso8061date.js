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

/**
* Formats a date into an iso 8061 string.
*
* @param {date}    date The date to format.
* @param {bool}    skipMilliseconds Boolean value indicating if the miliseconds part of the date should not be included.
* @param {integer} millisecondsPading Number of digits to left pad the miliseconds.
* @return {string} The date formated in the ISO 8061 date format.
* @deprecated use date.toISOString() instead
*/
exports.format = function (date, skipMilliseconds) {
  if (skipMilliseconds) {
    var rounded = Math.floor(date.getTime() / 1000) * 1000;
    return new Date(rounded).toISOString();
  }
  return date.toISOString();
};

/**
* Parses an ISO 8061 date string into a date object.
*
* @param {string} stringDateTime The string with the date to parse in the ISO 8061 format.
* @return {date} The parsed date.
* @deprecated use new Date(stringDateTime) instead
*/
exports.parse = function (stringDateTime) {
  return new Date(stringDateTime);
};
