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
* SqlManagementService client exports.
* @ignore
*/

var SqlManagementService = require('./sqlmanagementservice');
exports.SqlManagementService = SqlManagementService;

/**
* Creates a new {@link SqlManagementService} object.
*
* @param {string} subscriptionId                                       The subscription ID for the account.
* @param {object} authentication                                       The authentication object for the client.
*                                                                      You must use either keyfile/certfile or keyvalue/certvalue
*                                                                      to provide a management certificate to authenticate
*                                                                      service requests.
* @param {string} [authentication.keyfile]                             The path to a file that contains the PEM encoded key
* @param {string} [authentication.certfile]                            The path to a file that contains the PEM encoded certificate
* @param {string} [authentication.keyvalue]                            A string that contains the PEM encoded key
* @param {string} [authentication.certvalue]                           A string that contains the PEM encoded certificate
* @param {object} [hostOptions]                                        The host options to override defaults.
* @param {string} [hostOptions.host='management.core.windows.net']     The management endpoint.
* @param {string} [hostOptions.apiversion='2012-03-01']                The API vesion to be used.
* @return {SqlManagementService}                                       A new SqlManagementService object.
*/
exports.createSqlManagementService = function (subscriptionId, authentication, hostOptions) {
  return new SqlManagementService(subscriptionId, authentication, hostOptions);
};

/**
* Generated SqlManagementClient client exports.
* @ignore
*/
exports.SqlManagementClient = require('./sqlManagementClient');

/**
* Creates a new {@link SqlManagementClient} object.
*
* NOTE: These APIs are still in development and should not be used.
*
* @ignore
* @param {string} [credentials.subscriptionId]      The subscription identifier.
* @param {string} [credentials.cert]                The cert value.
* @param {string} [credentials.key]                 The key value.
* @param {string} [baseUri]                         The base uri.
* @return {SqlManagementClient}                     A new SqlManagementClient object.
*/
exports.createSqlManagementClient = function (credentials, baseUri) {
  return new exports.SqlManagementClient.SqlManagementClient(credentials, baseUri);
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