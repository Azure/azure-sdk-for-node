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

var exports = module.exports;

var ResourceManagementClient = require('./resourceManagementClient');
exports.ResourceManagementClient = ResourceManagementClient;

/**
* Creates a new {@link ResourceManagementClient} object.
*
* @param {string} [credentials.subscriptionId]      The subscription identifier.
* @param {string} [credentials.token]               The access token.
* @param {string} [baseUri]                         The base uri.
* @return {ResourceManagementClient}                A new ResourceManagementClient object.
*/
exports.createResourceManagementClient = function (credentials, baseUri) {
  return new exports.ResourceManagementClient.ResourceManagementClient(credentials, baseUri);
};
