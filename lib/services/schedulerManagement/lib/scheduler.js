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

var SchedulerManagementClient = require('./schedulerManagementClient');
exports.SchedulerManagementClient = SchedulerManagementClient;

/**
* Creates a new {@link SchedulerManagementClient} object.
*
* NOTE: These APIs are still in development and should not be used.
*
* @param {string} [credentials.subscriptionId]      The subscription identifier.
* @param {string} [credentials.cert]                The cert value.
* @param {string} [credentials.key]                 The key value.
* @param {string} [baseUri]                         The base uri.
* @param {array}  [filters]                         Optional array of service filters
* @return {SchedulerManagementClient}               A new SchedulerManagementClient object.
*/
exports.createSchedulerManagementClient = function (credentials, baseUri, filters) {
  return new exports.SchedulerManagementClient.SchedulerManagementClient(credentials, baseUri, filters);
};

var CloudServiceManagementClient = require('./cloudServiceManagementClient');
exports.CloudServiceManagementClient = CloudServiceManagementClient;

/**
* Creates a new {@link CloudServiceManagementClient} object.
*
* @param {string} [credentials.token]               The access token.
* @param {string} [baseUri]                         The base uri.
* @return {CloudServiceManagementClient}                A new CloudServiceManagementClient object.
*/
exports.createCloudServiceManagementClient = function (credentials, baseUri) {
  return new exports.CloudServiceManagementClient.CloudServiceManagementClient(credentials, baseUri);
};

var common = require('azure-common');

/**
* Creates a new CertificateCloudCredentials object.
* Either a pair of cert / key values need to be pass or a pem file location.
*
* @param {string} credentials.subscription  The subscription identifier.
* @param {string} [credentials.cert]        The certificate.
* @param {string} [credentials.key]         The certificate key.
* @param {string} [credentials.pem]         The PEM file content.
* @return {CertificateCloudCredentials}
*/
exports.createCertificateCloudCredentials = function (credentials) {
  return new common.CertificateCloudCredentials(credentials);
};
