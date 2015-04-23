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

var ResourceSubscriptionClient = require('./subscriptionClient');
exports.ResourceSubscriptionClient = ResourceSubscriptionClient;

/**
* Creates a new {@link ResourceSubscriptionClient} object.
*
* @param {string} [credentials.token]               The access token.
* @param {string} [baseUri]                         The base uri.
* @return {ResourceSubscriptionClient}              A new ResourceSubscriptionClient object.
*/
exports.createResourceSubscriptionClient = function (credentials, baseUri) {
  return new exports.ResourceSubscriptionClient.SubscriptionClient(credentials, baseUri);
};

var ResourceFeatureClient = require('./featureClient');
exports.ResourceFeatureClient = ResourceFeatureClient;

/**
* Creates a new {@link ResourceFeatureClient} object.
*
* @param {string} [credentials.token]               The access token.
* @param {string} [baseUri]                         The base uri.
* @return {ResourceFeatureClient}                   A new ResourceFeatureClient object.
*/
exports.createResourceFeatureClient = function (credentials, baseUri) {
  return new exports.ResourceFeatureClient.FeatureClient(credentials, baseUri);
};

function getProviderName(resourceType) {
  var firstIndex = resourceType.indexOf('/');
  var providerName;
  if (firstIndex !== -1){
    providerName = resourceType.substr(0, firstIndex);
  }
  return providerName;
}

function getResourceTypeName(resourceType) {
  var lastIndex = resourceType.lastIndexOf('/');
  var resourceTypeName;
  if (lastIndex !== -1){
    resourceTypeName = resourceType.substr(lastIndex+1);
  }
  return resourceTypeName;
}

/**
* Creates a new Resource Identity object.
*
* @param {string} name                    The resource name
* @param {string} resourceType            The resource type.
* @param {string} apiVersion              The api version.
* @param {string} [parent]                The parent resource.
* @return {object}                        The resource identity.
*/
exports.createResourceIdentity = function (name, resourceType, apiVersion, parent) {
  var identity = {
    resourceName: name,
    resourceProviderNamespace: getProviderName(resourceType),
    resourceProviderApiVersion: apiVersion,
    resourceType: getResourceTypeName(resourceType),
    parentResourcePath: !!parent ? parent : ''
  };

  return identity;
};
