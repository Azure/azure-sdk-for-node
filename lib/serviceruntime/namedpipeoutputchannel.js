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

// Expose 'NamedPipeOutputChannel'.
exports = module.exports = NamedPipeOutputChannel;

function NamedPipeOutputChannel() { }

NamedPipeOutputChannel.prototype.writeOutputChannel = function (name, data, callback) {
  var client = net.connect(name);
  client.end(data);

  if (callback) {
    callback();
  }
};