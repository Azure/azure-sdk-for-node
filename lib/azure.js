/**
* Copyright 2011 Microsoft Corporation
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

var exports = module.exports;

/**
 * Table client exports.
 */

var TableService = require('./services/table/tableservice');
exports.TableService = TableService;

/**
* Creates a new TableService object.
* If no storageaccount or storageaccesskey are provided, the AZURE_STORAGE_ACCOUNT and AZURE_STORAGE_ACCESS_KEY environment variables will be used.
*
* @param {string} [storageAccount]          The storage account.
* @param {string} [storageAccessKey]        The storage access key.
* @param {string} [host]                    The host address.
* @param {object} [authenticationProvider]  The authentication provider.
*/
exports.createTableService = function (storageAccount, storageAccessKey, host, authenticationProvider) {
  return new TableService(storageAccount, storageAccessKey, host, authenticationProvider);
};

/**
 * Blob client exports.
 */

var BlobService = require('./services/blob/blobservice');
exports.BlobService = BlobService;

/**
* Creates a new BlobService object.
* If no storageaccount or storageaccesskey are provided, the AZURE_STORAGE_ACCOUNT and AZURE_STORAGE_ACCESS_KEY environment variables will be used.
*
* @param {string} [storageAccount]          The storage account.
* @param {string} [storageAccessKey]        The storage access key.
* @param {string} [host]                    The host address.
* @param {object} [authenticationProvider]  The authentication provider.
*/
exports.createBlobService = function (storageAccount, storageAccessKey, host, authenticationProvider) {
  return new BlobService(storageAccount, storageAccessKey, host, authenticationProvider);
};

/**
 * Queue client exports.
 */

var QueueService = require('./services/queue/queueservice');
exports.QueueService = QueueService;

/**
* Creates a new QueueService object.
* If no storageAccount or storageAccessKey are provided, the AZURE_STORAGE_ACCOUNT and AZURE_STORAGE_ACCESS_KEY 
* environment variables will be used.
*
* @param {string} [storageAccount]          The storage account.
* @param {string} [storageAccessKey]        The storage access key.
* @param {string} [host]                    The host address.
* @param {object} [authenticationProvider]  The authentication provider.
*/
exports.createQueueService = function (storageAccount, storageAccessKey, host, authenticationProvider) {
  return new QueueService(storageAccount, storageAccessKey, host, authenticationProvider);
};

/**
* Service Bus client exports.
*/

var ServiceBusService = require('./services/serviceBus/servicebusservice');
exports.ServiceBusService = ServiceBusService;

/**
* Creates a new ServiceBusService object.
*
* @param {string} [namespace]               The service bus namespace.
* @param {string} [accessKey]               The password.
* @param {string} [issuer]                  The issuer.
* @param {string} [acsNamespace]            The acs namespace. Usually the same as the sb namespace with "-sb" suffix.
* @param {string} [host]                    The host address.
* @param {object} [authenticationProvider]  The authentication provider.
*/
exports.createServiceBusService = function (namespace, accessKey, issuer, acsNamespace, host, authenticationProvider) {
  return new ServiceBusService(namespace, accessKey, issuer, acsNamespace, host, authenticationProvider);
};

/**
* Service Runtime exports.
*/

exports.RoleEnvironment = require('./serviceruntime/roleenvironment');

/**
* Other exports.
*/

exports.ServiceClient = require('./services/core/serviceclient');
exports.TableQuery = require('./services/table/tablequery');
exports.BatchServiceClient = require('./services/table/batchserviceclient');
exports.Constants = require('./util/constants');
exports.LinearRetryPolicyFilter = require('./services/core/linearretrypolicyfilter');
exports.ExponentialRetryPolicyFilter = require('./services/core/exponentialretrypolicyfilter');
exports.SharedAccessSignature = require('./services/blob/sharedaccesssignature');
exports.SharedKey = require('./services/blob/sharedkey');
exports.SharedKeyLite = require('./services/blob/sharedkeylite');
exports.SharedKeyTable = require('./services/table/sharedkeytable');
exports.SharedKeyLiteTable = require('./services/table/sharedkeylitetable');
exports.ISO8061Date = require('./util/iso8061date');
exports.Logger = require('./diagnostics/logger');

/*
* Convenience functions.
*/
exports.isEmulated = function (host) {
  return exports.ServiceClient.isEmulated(host);
};
