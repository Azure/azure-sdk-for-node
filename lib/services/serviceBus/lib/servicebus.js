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
* Service Bus client exports.
* @ignore
*/

var ServiceBusService = require('./servicebusservice');
exports.ServiceBusService = ServiceBusService;

/**
* Creates a new {@link ServiceBusService} object.
*
* @param {string} [configOrNamespaceOrConnectionString]  The service bus namespace or other config information.
* @param {string} [accessKey]                    The password.
* @param {string} [issuer]                       The issuer.
* @param {string} [acsNamespace]                 The acs namespace. Usually the same as the sb namespace with "-sb" suffix.
* @param {string} [host]                         The host address.
* @param {object} [authenticationProvider]       The authentication provider.
* @return {ServiceBusService}                    A new ServiceBusService object.
*/
exports.createServiceBusService = function (configOrNamespaceOrConnectionString, accessKey, issuer, acsNamespace, host, authenticationProvider) {
  return new ServiceBusService(configOrNamespaceOrConnectionString, accessKey, issuer, acsNamespace, host, authenticationProvider);
};

/**
* Notification hub client exports.
* @ignore
*/

var NotificationHubService = require('./notificationhubservice');
exports.NotificationHubService = NotificationHubService;

/**
* Creates a new {@link NotificationHubService} object.
*
* @param {string} hubName                         The notification hub name.
* @param {string} [endpointOrConnectionString]    The service bus endpoint or connection string.
* @param {string} [sharedAccessKeyName]           The notification hub shared access key name.
* @param {string} [sharedAccessKeyValue]          The notification hub shared access key value.
* @return {NotificationHubService}                A new NotificationHubService object.
*/
exports.createNotificationHubService = function (hubName, endpointOrConnectionString, sharedAccessKeyName, sharedAccessKeyValue) {
  return new NotificationHubService(hubName, endpointOrConnectionString, sharedAccessKeyName, sharedAccessKeyValue);
};

/**
* Wrap service exports.
* @ignore
*/

var WrapService = require('./wrapservice');
exports.WrapService = WrapService;

/**
* Creates a new WrapService object.
*
* @param {string} acsHost                 The access control host.
* @param {string} [issuer]                The service bus issuer.
* @param {string} [accessKey]             The service bus issuer password.
*/
exports.createWrapService = function (acsHost, issuer, accessKey) {
	return new WrapService(acsHost, issuer, accessKey);
};