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
* @param {string} [baseUri]                         The base uri.
* @return {WebSiteManagementClient}                 A new WebSiteManagementClient object.
*/
exports.createWebSiteManagementClient = function (credentials, baseUri) {
  return new exports.WebSiteManagementClient.WebSiteManagementClient(credentials, baseUri);
};

var WebsiteManagementService = require('./websitemanagementservice');
exports.WebsiteManagementService = WebsiteManagementService;

var WebSiteExtensionsClient = require('./webSiteExtensionsClient');
exports.WebSiteExtensionsClient = WebSiteExtensionsClient;

/**
* Creates a new {@link WebSiteExtensionsClient} object.
*
* @param {string} siteName                          The site name.
* @param {string} credentials.username              The username.
* @param {string} credentials.password              The password.
* @param {string} [baseUri]                         The base uri.
* @return {WebSiteManagementClient}                 A new WebSiteManagementClient object.
*/
exports.createWebSiteExtensionsClient = function (siteName, credentials, baseUri) {
  return new exports.WebSiteExtensionsClient.WebSiteExtensionsClient(siteName, credentials, baseUri);
};

/**
* Creates a new {@link WebsiteManagementService} object.
*
* @deprecated Use {@link createWebSiteManagementClient} instead.
*
* @param {string} subscriptionId          The subscription ID for the account.
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
* @return {WebsiteManagementService}                A new WebsitemanagementService object.
*/
exports.createWebsiteManagementService = function (subscriptionId, authentication, hostOptions) {
  return new WebsiteManagementService(subscriptionId, authentication, hostOptions);
};

/**
* ScmService client exports.
* @ignore
*/

var ScmService = require('./scmservice');
exports.ScmService = ScmService;

/**
* Creates a new {@link ScmService} object.
*
* @deprecated Use {@link createWebSiteExtensionsClient} instead.
*
* @param {object} authentication          The authentication object for the client.
*                                         You must use a auth/pass for basic authentication.
* @param {string} [authentication.user]   The basic authentication username.
* @param {string} [authentication.pass]   The basic authentication password.
* @param {object} [hostOptions]           The host options to override defaults.
* @param {string} [hostOptions.host]      The SCM repository endpoint.
* @return {ScmService}                    A new WebsitemanagementService object.
*/
exports.createScmService = function (authentication, hostOptions) {
  return new ScmService(authentication, hostOptions);
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

var BasicAuthenticationCloudCredentials = require('./credentials/basicAuthenticationCloudCredentials');

/**
* Creates a new BasicAuthenticationCloudCredentials object.
* Either a pair of cert / key values need to be pass or a pem file location.
*
* @param {string} credentials.username            The username.
* @param {string} credentials.password            The password.
* @return {BasicAuthenticationCloudCredentials}
*/
exports.createBasicAuthenticationCloudCredentials = function (credentials) {
  return new BasicAuthenticationCloudCredentials(credentials);
};