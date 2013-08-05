/*
* @copyright
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

require('./util/patch-xmlbuilder');

var nodeVersion = azureutil.getNodeVersion();
if (nodeVersion.major === 0 && nodeVersion.minor > 8 && !(nodeVersion.minor > 10 || (nodeVersion.minor === 10 && nodeVersion.patch >= 3))) {
  throw new Error('The Windows Azure node SDK does not work with node versions > 0.8.22 and < 0.10.3. Please upgrade to node >= 0.10.3');
}

/**
 * Table client exports.
 * @ignore
 */

var TableService = require('./services/table/tableservice');
exports.TableService = TableService;

/**
* Creates a new {@link TableService} object.
* If no storageaccount or storageaccesskey are provided, the AZURE_STORAGE_ACCOUNT and AZURE_STORAGE_ACCESS_KEY environment variables will be used.
*
* @param {string} [storageAccountOrConnectionString]  The storage account or the connection string.
* @param {string} [storageAccessKey]                  The storage access key.
* @param {string} [host]                              The host address.
* @param {object} [authenticationProvider]            The authentication provider.
* @return {TableService}                              A new TableService object.
*
*/
exports.createTableService = function (storageAccountOrConnectionString, storageAccessKey, host, authenticationProvider) {
  return new TableService(storageAccountOrConnectionString, storageAccessKey, host, authenticationProvider);
};

/**
 * Blob client exports.
 * @ignore
 */

var BlobService = require('./services/blob/blobservice');
exports.BlobService = BlobService;

/**
* Creates a new {@link BlobService} object.
* If no storageaccount or storageaccesskey are provided, the AZURE_STORAGE_ACCOUNT and AZURE_STORAGE_ACCESS_KEY environment variables will be used.
*
* @param {string} [storageAccountOrConnectionString]  The storage account or the connection string.
* @param {string} [storageAccessKey]                  The storage access key.
* @param {string} [host]                              The host address.
* @param {object} [authenticationProvider]            The authentication provider.
* @return {BlobService}                               A new BlobService object.
*/
exports.createBlobService = function (storageAccountOrConnectionString, storageAccessKey, host, authenticationProvider) {
  return new BlobService(storageAccountOrConnectionString, storageAccessKey, host, authenticationProvider);
};

/**
 * Queue client exports.
 * @ignore
 */
var QueueService = require('./services/queue/queueservice');
exports.QueueService = QueueService;

/**
* Creates a new {@link QueueService} object.
* If no storageAccount or storageAccessKey are provided, the AZURE_STORAGE_ACCOUNT and AZURE_STORAGE_ACCESS_KEY
* environment variables will be used.
*
* @param {string} [storageAccountOrConnectionString]  The storage account or the connection string.
* @param {string} [storageAccessKey]                  The storage access key.
* @param {string} [host]                              The host address.
* @param {object} [authenticationProvider]            The authentication provider.
* @return {QueueService}                              A new QueueService object.
*/
exports.createQueueService = function (storageAccountOrConnectionString, storageAccessKey, host, authenticationProvider) {
  return new QueueService(storageAccountOrConnectionString, storageAccessKey, host, authenticationProvider);
};

/**
* Service Bus client exports.
* @ignore
*/

var ServiceBusService = require('./services/serviceBus/servicebusservice');
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

var NotificationHubService = require('./services/serviceBus/notificationhubservice');
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
* SqlService client exports.
* @ignore
*/

var SqlService = require('./services/sqlAzure/sqlservice');
exports.SqlService = SqlService;

/**
* Creates a new {@link SqlManagementService} object.
*
* @param {string} serverName                   The SQL server name.
* @param {string} administratorLogin           The SQL Server administrator login.
* @param {string} administratorLoginPassword   The SQL Server administrator login password.
* @param {string} [host]                       The host for the service.
* @param {string} [acsHost]                    The acs host.
* @param {object} [authenticationProvider]     The authentication provider.
* @return {SqlManagementService}               A new SqlManagementService object.
*/
exports.createSqlService = function (serverName, administratorLogin, administratorLoginPassword, host, acsHost, authenticationProvider) {
  return new SqlService(serverName, administratorLogin, administratorLoginPassword, host, acsHost, authenticationProvider);
};

/**
* ServiceManagement client exports.
* @ignore
*/

var ServiceManagementService = require('./services/serviceManagement/servicemanagementservice');
exports.ServiceManagementService = ServiceManagementService;

/**
* Creates a new {@link ServiceManagementService} object.
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
* @return {ServiceManagementService}                A new ServiceManagement object.
*/
exports.createServiceManagementService = function (subscriptionId, authentication, hostOptions) {
  return new ServiceManagementService(subscriptionId, authentication, hostOptions);
};

/**
* SqlManagementService client exports.
* @ignore
*/

var SqlManagementService = require('./services/serviceManagement/sqlmanagementservice');
exports.SqlManagementService = SqlManagementService;

/**
* Creates a new {@link SqlManagementService} object.
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
* @return {SqlManagementService}                    A new SqlManagementService object.
*/
exports.createSqlManagementService = function (subscriptionId, authentication, hostOptions) {
  return new SqlManagementService(subscriptionId, authentication, hostOptions);
};

/**
* HDInsightService client exports.
* @ignore
*/
var HDInsightService = require('./services/serviceManagement/hdinsightservice');
exports.HDInsightService = HDInsightService;

/**
* Creates a new {@link HDInsightService} object.
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
* @return {HDInsightService}                        A new HDInsightService object.
*/
exports.createHDInsightService = function (subscriptionId, authentication, hostOptions) {
  return new HDInsightService(subscriptionId, authentication, hostOptions);
};

/**
* ServiceBusManagementService client exports.
* @ignore
*/

var ServiceBusManagementService = require('./services/serviceManagement/servicebusmanagementservice');
exports.ServiceBusManagementService = ServiceBusManagementService;

/**
* Creates a new {@link ServiceBusManagementService} object.
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
* @return {ServiceBusManagementService}             A new ServiceBusManagementService object.
*/
exports.createServiceBusManagementService = function (subscriptionId, authentication, hostOptions) {
  return new ServiceBusManagementService(subscriptionId, authentication, hostOptions);
};

/**
* WebsiteManagementService client exports.
* @ignore
*/

var WebsiteManagementService = require('./services/serviceManagement/websitemanagementservice');
exports.WebsiteManagementService = WebsiteManagementService;

/**
* Creates a new {@link WebsiteManagementService} object.
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
* Service Runtime exports.
* @ignore
*/

exports.RoleEnvironment = require('./serviceruntime/roleenvironment');

/**
* Other exports.
* @ignore
*/

exports.WebResource = require('./http/webresource');
exports.ServiceClient = require('./services/core/serviceclient');
exports.ServiceManagementClient = require('./services/core/servicemanagementclient');
exports.TableQuery = require('./services/table/tablequery');
exports.BatchServiceClient = require('./services/table/batchserviceclient');
exports.Constants = require('./util/constants');
exports.ServiceClientConstants = require('./services/core/serviceclientconstants');
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

/** 
* Check if the application is running in the Windows Azure Emulator.
* @property {boolean} isEmulated   `true` if the application is running in the emulator; otherwise, `false`.
*/
exports.isEmulated = function (host) {
  return exports.ServiceClient.isEmulated(host);
};

/*
* Configuration
*/

var sdkconfig = require('./util/sdkconfig');
exports.config = sdkconfig;
exports.configure = function (env, configCallback) {
  if (arguments.length === 1) {
    sdkconfig.configure(env);
  } else {
    sdkconfig.configure(env, configCallback);
  }
};

exports.dumpConfig = function () {
  console.log();
  sdkconfig.environments.forEach(function (e) {
    console.log('Environment', e);
    var env = sdkconfig(e);
    env.settings.forEach(function (setting) {
      console.log('    ', setting, ':', env.get(setting));
    });
  });
};
