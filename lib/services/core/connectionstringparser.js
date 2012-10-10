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

// Expose 'ConnectionStringParser'.
exports = module.exports = ConnectionStringParser;

ConnectionStringParser.parse = function (connectionString) {
  var connectionStringParser = new ConnectionStringParser(connectionString);
  return connectionStringParser._parse();
};

/**
* Creates a new 'ConnectionString' instance.
*
* @constructor
* @param {number} connectionString The connection string to be parsed.
*/
function ConnectionStringParser(connectionString) {
  this._connectionString = connectionString;
}

ConnectionStringParser.prototype._parse = function () {
  var parts = this._connectionString.split(';');
  var parsedConnectionString = { };

  parts.forEach(function (part) {
    part = part.trim();

    if (part) {
      var currentKVP = part.split('=');
      if (currentKVP.length === 2) {
        parsedConnectionString[currentKVP[0].toLowerCase()] = currentKVP[1];
      } else {
        throw new Error('Invalid connection string');
      }
    }
  });

  return parsedConnectionString;
};