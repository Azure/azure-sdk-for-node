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

'use strict';

var common = require('azure-common');
var ApiAppManagementClient = require('./apiAppManagementClient');
var getDeploymentTemplate = require('./getDeploymentTemplate');

exports.ApiAppManagementClient = ApiAppManagementClient.ApiAppManagementClient;

//
// New up a dummy client so we can get at the TemplateOperations
// prototype and attach our custom method to it.
//
var dummyClient = new exports.ApiAppManagementClient(
  new common.TokenCloudCredentials({subscriptionId: '0', token: '0'}),
    'https://dummy.example');
getDeploymentTemplate.attachGetDeploymentTemplate(dummyClient);

/**
* Create a new {@link ApiAppManagementClient} object.
*
* @param {object} credentials The credentials object (typically, a TokenCloudCredentials instance).
* @param {string} [baseUri]                         Optional base uri, defaults to production Azure
* @param {array}  [filters]                         Optional array of service filters
* @return {ApiAppManagementClient}                  A new ApiAppManagementClient object.
*/
exports.createApiAppManagementClient = function (credentials, baseUri, filters)
{
  return new exports.ApiAppManagementClient(credentials, baseUri, filters);
};

// Convenience exports so calling code doesn't explicitly have to import common

/**
* Creates a new TokenCloudCredentials object.
*
* @constructor
* @param {string} credentials.subscriptionId      The subscription identifier.
* @param {string} credentials.authorizationScheme The authorization scheme.
* @param {string} credentials.token               The token.
*/
exports.TokenCloudCredentials = common.TokenCloudCredentials;
