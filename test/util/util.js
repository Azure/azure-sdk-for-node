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

var testCase = require('nodeunit').testCase;

var util = require('../../lib/util/util');

var exports = module.exports;

exports.generateId = function (prefix, currentList) {
  if (!currentList) {
    currentList = [];
  }

  while (true) {
    var newNumber = prefix + Math.floor(Math.random() * 10000);
    if (currentList.indexOf(newNumber) === -1) {
      currentList.push(newNumber);
      return newNumber;
    }
  }
};

exports.randomFromTo = function (from, to) {
  return Math.floor(Math.random() * (to - from + 1) + from);
};