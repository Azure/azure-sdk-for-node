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

var WebSiteManagementClient = require('./webSiteManagementClient');
exports.WebSiteManagementClient = WebSiteManagementClient;

/**
* Creates a new {@link WebSiteManagementClient} object.
*
* @param {string} [credentials.subscriptionId]      The subscription identifier.
* @param {string} [credentials.cert]                The cert value.
* @param {string} [credentials.key]                 The key value.
* @param {array}  [filters]                         Optional array of service filters
* @param {string} [baseUri]                         The base uri.
* @return {WebSiteManagementClient}                 A new WebSiteManagementClient object.
*/
exports.createWebSiteManagementClient = function (credentials, baseUri, filters) {
  return new exports.WebSiteManagementClient.WebSiteManagementClient(credentials, baseUri, filters);
};