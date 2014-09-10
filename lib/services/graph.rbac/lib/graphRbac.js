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

/**
* GraphRbacManagementClient client exports.
*/
var GraphRbacManagementClient = require('./graphRbacManagementClient');
exports.GraphRbacManagementClient = GraphRbacManagementClient;

/**
* Creates a new {@link GraphRbacManagementClient} object.
*
* NOTE: These APIs are still in development and should not be used.
*
* @param {string} [credentials.subscriptionId]      The subscription identifier.
* @param {string} [credentials.cert]                The cert value.
* @param {string} [credentials.key]                 The key value.
* @param {string} [baseUri]                         The base uri.
* @param {array}  [filters]                         optional array of service filters
* @return {GraphRbacManagementClient}               A new GraphRbacManagementClient object.
*/
exports.createGraphRbacManagementClient = function (credentials, baseUri, filters) {
  return new exports.GraphRbacManagementClient.GraphRbacManagementClient(credentials, baseUri, filters);
};

