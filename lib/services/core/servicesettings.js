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

var util = require('../../util/util');

var ConnectionStringParser = require('./connectionstringparser');

exports = module.exports;

/**
* Throws an exception if the connection string format does not match any of the
* available formats.
* 
* @param {string} connectionString The invalid formatted connection string.
* 
* @return none
*/
exports.noMatch = function (connectionString) {
  throw new Error('The provided connection string ' + connectionString + ' does not have complete configuration settings.');
};

/**
* Parses the connection string and then validate that the parsed keys belong to
* the $validSettingKeys
* 
* @param {string} connectionString The user provided connection string.
* 
* @return {array} The tokenized connection string keys. 
*/
exports.parseAndValidateKeys = function (connectionString, validKeys) {
  var tokenizedSettings = ConnectionStringParser.parse(connectionString);

  // Assure that all given keys are valid.
  for (var key in tokenizedSettings) {
    if (!util.inArrayInsensitive(key, validKeys)) {
      throw new Error('Invalid connection string setting key ' + key);
    }
  }

  return tokenizedSettings;
};