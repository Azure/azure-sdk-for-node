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

var check = require('validator').check;

exports = module.exports;

/**
* Creates a anonymous function that check if the given uri is valid or not.
* 
* @param {string} uri The uri to validate.
* @return {function}
*/
exports.isValidUri = function (uri) {
  try {
    // Check will throw if it is not valid.
    check(uri).isUrl(); 
    return true;
  } catch (e) {
    throw new Error('The provided URI "' + uri + '" is invalid.');
  }
};

/**
* Creates a anonymous function that check if a given key is base 64 encoded.
* 
* @param {string} key The key to validate.
* @return {function}
*/
exports.isBase64Encoded = function (key) {
  var isValidBase64String = key.match('^([A-Za-z0-9+/]{4})*([A-Za-z0-9+/]{4}|[A-Za-z0-9+/]{3}=|[A-Za-z0-9+/]{2}==)$');

  if (isValidBase64String) {
    return true;
  } else {
    throw new Error('The provided account key ' + key + ' is not a valid base64 string.');
  }
};