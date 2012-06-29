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

var Constants = require('../util/constants');
var ServiceRuntimeConstants = Constants.ServiceRuntimeConstants;

// Expose 'RuntimeVersionProtocolClient'.
exports = module.exports = RuntimeVersionProtocolClient;

function RuntimeVersionProtocolClient(inputChannel) {
  this.inputChannel = inputChannel;
}

RuntimeVersionProtocolClient.prototype.getVersionMap = function (connectionPath, callback) {
  this.inputChannel.readInputChannel(connectionPath, true, function (error, data) {
    if (error) {
      callback(error);
    } else {
      var versions = {};

      if (data[ServiceRuntimeConstants.RUNTIME_SERVER_ENDPOINTS] &&
          data[ServiceRuntimeConstants.RUNTIME_SERVER_ENDPOINTS][ServiceRuntimeConstants.RUNTIME_SERVER_ENDPOINT]) {

        var endpoints = data[ServiceRuntimeConstants.RUNTIME_SERVER_ENDPOINTS][ServiceRuntimeConstants.RUNTIME_SERVER_ENDPOINT];
        if (!Array.isArray(endpoints)) {
          endpoints = [endpoints];
        }

        for (var endpoint in endpoints) {
          var currentEndpoint = endpoints[endpoint];
          versions[currentEndpoint[Constants.XML_METADATA_MARKER].version] = currentEndpoint[Constants.XML_METADATA_MARKER].path;
        }
      }

      callback(undefined, versions);
    }
  });
};