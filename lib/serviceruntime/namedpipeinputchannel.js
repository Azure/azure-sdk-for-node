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

// Module dependencies.
var net = require('net');
var xml2js = require('xml2js');

// Expose 'NamedPipeInputChannel'.
exports = module.exports = NamedPipeInputChannel;

function NamedPipeInputChannel() {
  this.closeOnRead = true;
}

NamedPipeInputChannel.prototype.readInputChannel = function (name, parseXml, callback) {
  this._readData(name, function (error, data) {
    if (!error) {
      var parts = data.toString().split('\r\n');

      var xml;
      // If there is more than one part (and the \r\n wasnt the final marker).
      if (parts.length > 1 && parts[1].length > 0) {
        xml = parts[1];
      } else {
        xml = parts[0];
      }

      if (parseXml) {
        var parser = new xml2js.Parser();
        error = null;
        parser.on('error', function (e) { error = e; });
        parser.parseString(xml);

        if (parser.resultObject) {
          xml = parser.resultObject;
        }
      }

      if (error) {
        error.fileName = name;
      }

      callback(error, xml);
    } else {
      error.fileName = name;
      callback(error);
    }
  });
};

NamedPipeInputChannel.prototype._readData = function (name, callback) {
  var self = this;
  var client = net.connect(name);
  client.on('data', function (data) {
    if (self.closeOnRead) {
      client.end();
    }

    callback(undefined, data);
  });

  client.on('error', function (error) {
    callback(error);
  });
};