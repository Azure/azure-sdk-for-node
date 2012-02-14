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
* Formats a date into an iso 8061 string.
*
* @param {date} date The date to format.
* @return {string} The date formated in the ISO 8061 date format.
*/
exports.format = function (date) {
  return [
        date.getUTCFullYear(),
        '-',
        leftPadTwo(date.getUTCMonth() + 1),
        '-',
        leftPadTwo(date.getUTCDate()),
        'T',
        leftPadTwo(date.getUTCHours()),
        ':',
        leftPadTwo(date.getUTCMinutes()),
        ':',
        leftPadTwo(date.getUTCSeconds()),
        '.',
        leftPadThree(date.getUTCMilliseconds()),
        'Z'
    ].join('');
};

/**
* Parses an ISO 8061 date string into a date object.
*
* @param {string} stringDateTime The string with the date to parse in the ISO 8061 format.
* @return {date} The parsed date.
*/
exports.parse = function (stringDateTime) {
  var parts = stringDateTime.split('T');
  var ymd = parts[0].split('-');
  var time = parts[1].split('.');
  var hms = time[0].split(':');
  var ms = time[1].split('Z');

  var date = new Date(Date.UTC(
    parseInt(ymd[0], 10),
    parseInt(ymd[1], 10) - 1,
    parseInt(ymd[2], 10),
    parseInt(hms[0], 10),
    parseInt(hms[1], 10),
    parseInt(hms[2], 10),
    parseInt(rightPadThree(ms[0].substr(0,3)), 10)));

  return date;
};

var leftPadTwo = function (n) {
  return (n < 10 ? '0' : '') + n;
};

var leftPadThree = function (n) {
  var currentN = '' + n;
  while (currentN.length < 3) {
    currentN = '0' + currentN;
  }

  return currentN;
};

var rightPadThree = function (n) {
  var currentN = '' + n;
  while (currentN.length < 3) {
    currentN = currentN + '0';
  }

  return currentN;
};
