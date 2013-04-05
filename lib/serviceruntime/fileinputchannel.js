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
var fs = require('fs');
var xml2js = require('xml2js');

function FileInputChannel() {}

FileInputChannel.prototype.readInputChannel = function (name, parseXml, callback) {
  this._readData(name, function (error, data) {
    if (!error) {
      if (parseXml) {
        var parser = new xml2js.Parser();
        parser.on('error', function (e) { error = e; });
        parser.parseString(data);

        if (parser.resultObject) {
          data = parser.resultObject;
        }
      }

      callback(error, data);
    } else {
      callback(error);
    }
  });
};

FileInputChannel.prototype._readData = function (name, callback) {
  fs.readFile(name, callback);
};

module.exports = FileInputChannel;