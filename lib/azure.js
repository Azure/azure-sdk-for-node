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
* @param {string} [storageAccountOrConnectionString]  The storage account or the connection string.
* @param {string} [storageAccessKey]                  The storage access key.
* @param {string} [host]                              The host address.
* @param {object} [authenticationProvider]            The authentication provider.
*/
exports.createTableService = function (storageAccountOrConnectionString, storageAccessKey, host, authenticationProvider) {
  return new TableService(storageAccountOrConnectionString, storageAccessKey, host, authenticationProvider);
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
* @param {string} [storageAccountOrConnectionString]  The storage account or the connection string.
* @param {string} [storageAccessKey]                  The storage access key.
* @param {string} [host]                              The host address.
* @param {object} [authenticationProvider]            The authentication provider.
*/
exports.createBlobService = function (storageAccountOrConnectionString, storageAccessKey, host, authenticationProvider) {
  return new BlobService(storageAccountOrConnectionString, storageAccessKey, host, authenticationProvider);
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
* @param {string} [storageAccountOrConnectionString]  The storage account or the connection string.
* @param {string} [storageAccessKey]                  The storage access key.
* @param {string} [host]                              The host address.
* @param {object} [authenticationProvider]            The authentication provider.
*/
exports.createQueueService = function (storageAccountOrConnectionString, storageAccessKey, host, authenticationProvider) {
  return new QueueService(storageAccountOrConnectionString, storageAccessKey, host, authenticationProvider);
};

/**
* Service Bus client exports.
*/

var ServiceBusService = require('./services/serviceBus/servicebusservice');
exports.ServiceBusService = ServiceBusService;

/**
* Creates a new ServiceBusService object.
*
* @param {string} [namespaceOrConnectionString]  The service bus namespace.
* @param {string} [accessKey]                    The password.
* @param {string} [issuer]                       The issuer.
* @param {string} [acsNamespace]                 The acs namespace. Usually the same as the sb namespace with "-sb" suffix.
* @param {string} [host]                         The host address.
* @param {object} [authenticationProvider]       The authentication provider.
*/
exports.createServiceBusService = function (namespaceOrConnectionString, accessKey, issuer, acsNamespace, host, authenticationProvider) {
  return new ServiceBusService(namespaceOrConnectionString, accessKey, issuer, acsNamespace, host, authenticationProvider);
};

/**
* ServiceManagement client exports.
*/

var ServiceManagementService = require('./services/serviceManagement/servicemanagementservice');
exports.ServiceManagementService = ServiceManagementService;

/**
* Creates a new ServiceManagementService object.
*
* @param {string} subscriptionId          The subscription ID for the account.
* @param {string} authentication          The authentication object for the client.
*                                         {
*                                            keyfile: 'path to .pem',
*                                            certfile: 'path to .pem',
*                                            keyvalue: privatekey value,
*                                            certvalue: public cert value
*                                         }
* @param {string} hostOptions             The host options to override defaults.
*                                         {
*                                            host: 'management.core.windows.net',
*                                            apiversion: '2012-03-01',
*                                            serializetype: 'XML'
*                                         }
*/
exports.createServiceManagementService = function(subscriptionId, authentication, hostOptions) {
  return new ServiceManagementService(subscriptionId, authentication, hostOptions);
};

/**
* Service Runtime exports.
*/

exports.RoleEnvironment = require('./serviceruntime/roleenvironment');

/**
* Other exports.
*/

exports.WebResource = require('./http/webresource');
exports.ServiceClient = require('./services/core/serviceclient');
exports.ServiceManagementClient = require('./services/core/servicemanagementclient');
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
exports.ConnectionStringParser = require('./services/core/connectionstringparser');
exports.ServiceSettings = require('./services/core/servicesettings');
exports.StorageServiceSettings = require('./services/core/storageservicesettings');
exports.ServiceBusSettings = require('./services/core/servicebussettings');
exports.ServiceManagementSettings = require('./services/core/servicemanagementsettings');
exports.Validate = require('./util/validate');

/*
* Convenience functions.
*/
exports.isEmulated = function (host) {
  return exports.ServiceClient.isEmulated(host);
};
