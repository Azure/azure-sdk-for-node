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

var InsightsClient = require('./insightsClient');
exports.InsightsClient = InsightsClient;

var InsightsManagementClient = require('./insightsManagementClient');
exports.InsightsManagementClient = InsightsManagementClient;

/**
* Creates a new {@link InsightsManagementClient} object.
*
* @param {string} [credentials.token]               The access token.
* @param {string} [baseUri]                         The base uri.
* @return {InsightsManagementClient}                A new InsightsManagementClient object.
*/
exports.createInsightsManagementClient = function (credentials, baseUri) {
  return new exports.InsightsManagementClient.InsightsManagementClient(credentials, baseUri);
};

/**
* Creates a new {@link InsightsClient} object.
*
* @param {string} [credentials.token]               The access token.
* @param {string} [baseUri]                         The base uri.
* @return {InsightsClient}                          A new InsightsClient object.
*/
exports.createInsightsClient = function (credentials, baseUri) {
  return new exports.InsightsClient.InsightsClient(credentials, baseUri);
};
