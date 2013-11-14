// 
// Copyright (c) Microsoft and contributors.  All rights reserved.
// 
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//   http://www.apache.org/licenses/LICENSE-2.0
// 
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// 
// See the License for the specific language governing permissions and
// limitations under the License.
// 

// Module dependencies.
var Protocol1RuntimeClient = require('./protocol1runtimeclient');

function RuntimeVersionManager(runtimeVersionProtocolClient, runtimeKernel) {
  this.protocolClient = runtimeVersionProtocolClient;
  this.runtimeKernel = runtimeKernel;

  var self = this;
  var runtimeClientFactory = {
    getVersion: function () {
      return '2011-03-08';
    },

    createRuntimeClient: function (path) {
      return new Protocol1RuntimeClient(
        self.runtimeKernel.getGoalStateClient(),
        self.runtimeKernel.getCurrentStateClient(),
        path);
    }
  };

  this.supportedVersionList = [ runtimeClientFactory ];
}

RuntimeVersionManager.prototype.getRuntimeClient = function (versionEndpoint, callback) {
  var self = this;

  self.protocolClient.getVersionMap(versionEndpoint, function (error, versionMap) {
    if (error) {
      callback(error);
    } else {
      for (var i in self.supportedVersionList) {
        if (self.supportedVersionList.hasOwnProperty(i)) {
          var factory = self.supportedVersionList[i];

          if (versionMap[factory.getVersion()]) {
            callback(undefined, factory.createRuntimeClient(versionMap[factory.getVersion()]));
            return;
          }
        }
      }

      callback('Server does not support any known protocol versions.');
    }
  });
};

module.exports = RuntimeVersionManager;