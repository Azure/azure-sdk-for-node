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
var DataLakeAnalyticsManagementClient = require('./dataLakeAnalyticsManagementClient');
var DataLakeAnalyticsCatalogManagementClient = require('./dataLakeAnalyticsCatalogManagementClient');
var DataLakeAnalyticsJobManagementClient = require('./dataLakeAnalyticsJobManagementClient');

exports.DataLakeAnalyticsJobManagementClient = DataLakeAnalyticsJobManagementClient;
exports.DataLakeAnalyticsCatalogManagementClient = DataLakeAnalyticsCatalogManagementClient;
exports.DataLakeAnalyticsManagementClient = DataLakeAnalyticsManagementClient;

/**
* Creates a new {@link DataLakeAnalyticsManagementClient} object.
*
* NOTE: These APIs are still in development and should not be used.
*
* @param {string} [credentials.subscriptionId]      The subscription identifier.
* @param {string} [credentials.token]               The access token.
* @param {string} [baseUri]                         The base uri.
* @param {array}  [filters]                         Optional array of service filters
* @return {DataLakeAnalyticsManagementClient}          A new DataLakeAnalyticsManagementClient object.
*/
exports.createDataLakeAnalyticsManagementClient = function (credentials, baseUri, filters) {
  return new exports.DataLakeAnalyticsManagementClient.DataLakeAnalyticsManagementClient(credentials, baseUri, filters);
};

/**
* Creates a new {@link DataLakeAnalyticsCatalogManagementClient} object.
*
* NOTE: These APIs are still in development and should not be used.
*
* @param {string} [credentials.subscriptionId]      The subscription identifier.
* @param {string} [credentials.token]               The access token.
* @param {string} [baseUri]                         The base uri.
* @param {array}  [filters]                         Optional array of service filters
* @return {DataLakeAnalyticsCatalogManagementClient}          A new DataLakeAnalyticsCatalogManagementClient object.
*/
exports.createDataLakeAnalyticsCatalogManagementClient = function (credentials, baseUri, filters) {
  return new exports.DataLakeAnalyticsCatalogManagementClient.DataLakeAnalyticsCatalogManagementClient(credentials, baseUri, filters);
};

/**
* Creates a new {@link DataLakeAnalyticsJobManagementClient} object.
*
* NOTE: These APIs are still in development and should not be used.
*
* @param {string} [credentials.subscriptionId]      The subscription identifier.
* @param {string} [credentials.token]               The access token.
* @param {string} [baseUri]                         The base uri.
* @param {array}  [filters]                         Optional array of service filters
* @return {DataLakeAnalyticsJobManagementClient}          A new DataLakeAnalyticsJobManagementClient object.
*/
exports.createDataLakeAnalyticsJobManagementClient = function (credentials, baseUri, filters) {
  return new exports.DataLakeAnalyticsJobManagementClient.DataLakeAnalyticsJobManagementClient(credentials, baseUri, filters);
};
