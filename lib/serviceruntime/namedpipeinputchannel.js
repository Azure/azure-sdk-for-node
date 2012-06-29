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
var net = require('net');
var xml2js = require('xml2js');

// Expose 'NamedPipeInputChannel'.
exports = module.exports = NamedPipeInputChannel;

function NamedPipeInputChannel() {
  this.closeOnRead = true;
  this.client = null;
}

NamedPipeInputChannel.prototype.readInputChannel = function (name, parseXml, callback) {
  var callbackError = function (error) {
    error.fileName = name;
    callback(error);
  };

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
        callbackError(error);
      } else {
        callback(undefined, xml);
      }
    } else {
      callbackError(error);
    }
  });
};

NamedPipeInputChannel.prototype.end = function () {
  this.client.end();
};

NamedPipeInputChannel.prototype._readData = function (name, callback) {
  var self = this;

  self.client = net.connect(name);
  self.client.on('data', function (data) {
    if (self.closeOnRead) {
      self.client.end();
    }

    callback(undefined, data);
  });

  self.client.on('error', function (error) {
    callback(error);
  });
};