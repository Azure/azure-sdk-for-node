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

var exports = module.exports;

/**
* Generates an unique identifier using a prefix, based on a currentList and repeatable or not depending on the isMocked flag.
*
* @param {string} prefix          The prefix to use in the identifier.
* @param {array}  currentList     The current list of identifiers.
* @param {bool}   isMocked        Boolean flag indicating if the test is mocked or not.
* @return {string} A new unique identifier.
*/
exports.generateId = function (prefix, currentList, isMocked) {
  if (!currentList) {
    currentList = [];
  }

  while (true) {
    var newNumber;
    if (isMocked) {
      // Predictable
      newNumber = prefix + (currentList.length + 1);
      currentList.push(newNumber);

      return newNumber;
    } else {
      // Random
      newNumber = prefix + Math.floor(Math.random() * 10000);
      if (currentList.indexOf(newNumber) === -1) {
        currentList.push(newNumber);

        return newNumber;
      }
    }
  }
};

exports.randomFromTo = function (from, to) {
  return Math.floor(Math.random() * (to - from + 1) + from);
};

exports.libFolder = function () {
  return process.env['AZURE_LIB_PATH'] ? process.env['AZURE_LIB_PATH'] : 'lib';
};

exports.libRequire = function (path) {
  return require('../../' + exports.libFolder() + '/' + path);
};