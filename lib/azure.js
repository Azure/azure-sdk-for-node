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

var azureutil = require('./util/util');

var nodeVersion = azureutil.getNodeVersion();
if (nodeVersion.major === 0 && nodeVersion.minor > 8 && !(nodeVersion.minor > 10 || (nodeVersion.minor === 10 && nodeVersion.patch >= 3))) {
  throw new Error('The Windows Azure node SDK does not work with node versions > 0.8.22 and < 0.10.3. Please upgrade to node >= 0.10.3');
}

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
* Notification hub client exports.
*/

var NotificationHubService = require('./services/serviceBus/notificationhubservice');
exports.NotificationHubService = NotificationHubService;

/**
* Creates a new NotificationHubService object.
*
* @param {string} hubName                         The notification hub name.
* @param {string} [endpointOrConnectionString]    The service bus endpoint or connection string.
* @param {string} [sharedAccessKeyName]           The notification hub shared access key name.
* @param {string} [sharedAccessKeyValue]          The notification hub shared access key value.
*/
exports.createNotificationHubService = function (hubName, endpointOrConnectionString, sharedAccessKeyName, sharedAccessKeyValue) {
  return new NotificationHubService(hubName, endpointOrConnectionString, sharedAccessKeyName, sharedAccessKeyValue);
};

/**
* SqlService client exports.
*/

var SqlService = require('./services/sqlAzure/sqlservice');
exports.SqlService = SqlService;

/**
* Creates a new SqlManagementService object.
*
* @param {string} serverName                   The SQL server name.
* @param {string} administratorLogin           The SQL Server administrator login.
* @param {string} administratorLoginPassword   The SQL Server administrator login password.
* @param {string} [host]                       The host for the service.
* @param {string} [acsHost]                    The acs host.
* @param {object} [authenticationProvider]     The authentication provider.
*/
exports.createSqlService = function (serverName, administratorLogin, administratorLoginPassword, host, acsHost, authenticationProvider) {
  return new SqlService(serverName, administratorLogin, administratorLoginPassword, host, acsHost, authenticationProvider);
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
exports.createServiceManagementService = function (subscriptionId, authentication, hostOptions) {
  return new ServiceManagementService(subscriptionId, authentication, hostOptions);
};

/**
* SqlManagementService client exports.
*/

var SqlManagementService = require('./services/serviceManagement/sqlmanagementservice');
exports.SqlManagementService = SqlManagementService;

/**
* Creates a new SqlManagementService object.
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
exports.createSqlManagementService = function (subscriptionId, authentication, hostOptions) {
  return new SqlManagementService(subscriptionId, authentication, hostOptions);
};

/**
* ServiceBusManagementService client exports.
*/

var ServiceBusManagementService = require('./services/serviceManagement/servicebusmanagementservice');
exports.ServiceBusManagementService = ServiceBusManagementService;

/**
* Creates a new ServiceBusManagementService object.
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
exports.createServiceBusManagementService = function (subscriptionId, authentication, hostOptions) {
  return new ServiceBusManagementService(subscriptionId, authentication, hostOptions);
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
exports.SharedAccessSignature = require('./services/blob/internal/sharedaccesssignature');
exports.SharedKey = require('./services/blob/internal/sharedkey');
exports.SharedKeyLite = require('./services/blob/internal/sharedkeylite');
exports.SharedKeyTable = require('./services/table/internal/sharedkeytable');
exports.SharedKeyLiteTable = require('./services/table/internal/sharedkeylitetable');
// deprecated
exports.ISO8061Date = require('./util/iso8061date');
exports.Logger = require('./diagnostics/logger');
exports.ConnectionStringParser = require('./services/core/connectionstringparser');
exports.ServiceSettings = require('./services/core/servicesettings');
exports.StorageServiceSettings = require('./services/core/storageservicesettings');
exports.ServiceBusSettings = require('./services/core/servicebussettings');
exports.ServiceManagementSettings = require('./services/core/servicemanagementsettings');
exports.Validate = require('./util/validate');

exports.date = require('./util/date');
exports.namespaceNameIsValid = require('./services/serviceManagement/models/namevalidation');

/*
* Convenience functions.
*/
exports.isEmulated = function (host) {
  return exports.ServiceClient.isEmulated(host);
};
