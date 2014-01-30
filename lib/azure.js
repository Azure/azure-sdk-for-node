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
 * Table client exports.
 * @ignore
 */

var TableService = require('./services/table/tableservice');
exports.TableService = TableService;

exports.TableQuery = require('./services/table/tablequery');

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

var SqlService = require('./services/sql/sqlservice');
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

var azureManagement = require('azure-mgmt');
var ServiceManagementService = azureManagement.ServiceManagementService;
exports.ServiceManagementService = ServiceManagementService;

/**
* Creates a new {@link ServiceManagementService} object.
*
* @deprecated Use {@link createServiceManagementClient} instead.
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
* @return {ServiceManagementService}                                   A new ServiceManagement object.
*/
exports.createServiceManagementService = azureManagement.createServiceManagementService;

/**
* SqlManagementService client exports.
* @ignore
*/
var azureSql = require('azure-mgmt-sql');
var SqlManagementService = azureSql.SqlManagementService;
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
exports.createSqlManagementService = azureSql.createSqlManagementService;

/**
* HDInsightService client exports.
* @ignore
*/
var HDInsightService = require('./services/hdinsight/hdinsightservice');
exports.HDInsightService = HDInsightService;

/**
* Creates a new {@link HDInsightService} object.
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
* @return {HDInsightService}                                           A new HDInsightService object.
*/
exports.createHDInsightService = function (subscriptionId, authentication, hostOptions) {
  return new HDInsightService(subscriptionId, authentication, hostOptions);
};

/**
* ServiceBusManagementService client exports.
* @ignore
*/

var azureServiceBus = require('azure-mgmt-sb');
var ServiceBusManagementService = azureServiceBus.ServiceBusManagementService;
exports.ServiceBusManagementService = ServiceBusManagementService;

/**
* Creates a new {@link ServiceBusManagementService} object.
*
* @deprecated Use {@link createServiceBusManagementClient} instead.
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
* @return {ServiceBusManagementService}                                A new ServiceBusManagementService object.
*/
exports.createServiceBusManagementService = azureServiceBus.createServiceBusManagementService;

/**
* WebsiteManagementService client exports.
* @ignore
*/

var azureWebSite = require('azure-mgmt-website');
var WebsiteManagementService = azureWebSite.WebsiteManagementService;
exports.WebsiteManagementService = WebsiteManagementService;

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
* @return {WebsiteManagementService}                                   A new WebsitemanagementService object.
*/
exports.createWebsiteManagementService = azureWebSite.createWebsiteManagementService;

/**
* Generated ManagementClient client exports.
* @ignore
*/
exports.ManagementClient = azureManagement.ManagementClient;

/**
* Creates a new {@link ManagementClient} object.
*
* @param {object} credentials                       The credentials object (typically, a CertificateCloudCredentials instance)
* @param {string} credentials.subscriptionId        The subscription identifier.
* @param {string} [credentials.cert]                The cert value.
* @param {string} [credentials.key]                 The key value.
* @param {string} [credentials.pem]                 The PEM file data.
* @param {string} [baseUri]                         The base uri.
* @return {ManagementClient}                        A new ManagementClient object.
*/
exports.createManagementClient = azureManagement.createManagementClient;

/**
* Generated VirtualNetworkManagementClient client exports.
* @ignore
*/

var azureVirtualNetwork = require('azure-mgmt-vnet');
exports.VirtualNetworkManagementClient = azureVirtualNetwork.VirtualNetworkManagementClient;

/**
* Creates a new {@link VirtualNetworkManagementClient} object.
*
* @param {object} credentials                       The credentials object (typically, a CertificateCloudCredentials instance)
* @param {string} credentials.subscriptionId        The subscription identifier.
* @param {string} [credentials.cert]                The cert value.
* @param {string} [credentials.key]                 The key value.
* @param {string} [credentials.pem]                 The PEM file data.
* @param {string} [baseUri]                         The base uri.
* @return {VirtualNetworkManagementClient}          A new VirtualNetworkManagementClient object.
*/
exports.createVirtualNetworkManagementClient = azureVirtualNetwork.createVirtualNetworkManagementClient;

/**
* Generated VirtualNetworkClient client exports.
* @ignore
*/
exports.SqlManagementClient = azureSql.SqlManagementClient;

/**
* Creates a new {@link SqlClient} object.
*
* @param {string} [credentials.subscriptionId]      The subscription identifier.
* @param {string} [credentials.cert]                The cert value.
* @param {string} [credentials.key]                 The key value.
* @param {string} [baseUri]                         The base uri.
* @return {SqlClient}                               A new SqlClient object.
*/
exports.createSqlManagementClient = azureSql.createSqlManagementClient;

/**
* Generated StorageManagementClient client exports.
* @ignore
*/
var azureStorage = require('azure-mgmt-storage');
exports.StorageManagementClient = azureStorage.StorageManagementClient;

/**
* Creates a new {@link StorageManagementClient} object.
*
* @param {object} credentials                       The credentials object (typically, a CertificateCloudCredentials instance)
* @param {string} credentials.subscriptionId        The subscription identifier.
* @param {string} [credentials.cert]                The cert value.
* @param {string} [credentials.key]                 The key value.
* @param {string} [credentials.pem]                 The PEM file data.
* @param {string} [baseUri]                         The base uri.
* @return {StorageManagementClient}                 A new StorageManagementClient object.
*/
exports.createStorageManagementClient = azureStorage.createStorageManagementClient;

/**
* Generated StoreClient client exports.
* @ignore
*/
// TODO: uncomment when store is published
// var azureStore = require('azure-mgmt-store');
// exports.StoreManagementClient = azureStore.StoreManagementClient;

/**
* Creates a new {@link StoreManagementClient} object.
*
* @param {object} credentials                       The credentials object (typically, a CertificateCloudCredentials instance)
* @param {string} credentials.subscriptionId        The subscription identifier.
* @param {string} [credentials.cert]                The cert value.
* @param {string} [credentials.key]                 The key value.
* @param {string} [credentials.pem]                 The PEM file data.
* @param {string} [baseUri]                         The base uri.
* @return {StoreManagementClient}                   A new StoreManagementClient object.
*/
// TODO: uncomment when store is published
// exports.createStoreManagementClient = azureStore.createStoreManagementClient;

/**
* Generated SubscriptionClient client exports.
* @ignore
*/
// TODO: uncomment when subscription is published
// var azureSubscription = require('azure-mgmt-subscription');
// exports.SubscriptionClient = azureSubscription.SubscriptionClient;

/**
* Creates a new {@link SubscriptionClient} object.
*
* @param {object} credentials                       The credentials object (typically, a CertificateCloudCredentials instance)
* @param {string} credentials.subscriptionId        The subscription identifier.
* @param {string} [credentials.cert]                The cert value.
* @param {string} [credentials.key]                 The key value.
* @param {string} [credentials.pem]                 The PEM file data.
* @param {string} [baseUri]                         The base uri.
* @return {SubscriptionClient}                      A new SubscriptionClient object.
*/
// TODO: uncomment when subscription is published
// exports.createSubscriptionClient = azureSubscription.createSubscriptionClient;

/**
* Generated WebsiteManagementService client exports.
* @ignore
*/
exports.WebSiteManagementClient = azureWebSite.WebSiteManagementClient;

exports.WebSiteExtensionsClient = azureWebSite.WebSiteExtensionsClient;

/**
* Creates a new {@link WebSiteManagementClient} object.
*
* @param {object} credentials                       The credentials object (typically, a CertificateCloudCredentials instance)
* @param {string} credentials.subscriptionId        The subscription identifier.
* @param {string} [credentials.cert]                The cert value.
* @param {string} [credentials.key]                 The key value.
* @param {string} [credentials.pem]                 The PEM file data.
* @param {string} [baseUri]                         The base uri.
* @return {WebSiteManagementClient}                 A new WebSiteManagementClient object.
*/
exports.createWebSiteManagementClient = azureWebSite.createWebSiteManagementClient;

/**
* Creates a new {@link WebSiteExtensionsClient} object.
*
* @param {string} siteName                          The site name.
* @param {string} credentials.username              The username.
* @param {string} credentials.password              The password.
* @param {string} [baseUri]                         The base uri.
* @return {WebSiteManagementClient}                 A new WebSiteManagementClient object.
*/
exports.createWebSiteExtensionsClient = azureWebSite.createWebSiteExtensionsClient;

/**
* ScmService client exports.
* @ignore
*/

exports.ScmService = azureWebSite.ScmService;

/**
* Creates a new {@link ScmService} object.
*
* @param {object} authentication          The authentication object for the client.
*                                         You must use a auth/pass for basic authentication.
* @param {string} [authentication.user]   The basic authentication username.
* @param {string} [authentication.pass]   The basic authentication password.
* @param {object} [hostOptions]           The host options to override defaults.
* @param {string} [hostOptions.host]      The SCM repository endpoint.
* @return {ScmService}                    A new WebsitemanagementService object.
*/
exports.createScmService = azureWebSite.createScmService;

/**
* Generated ComputeManagementClient client exports.
* @ignore
*/
var azureCompute = require('azure-mgmt-compute');
exports.ComputeManagementClient = azureCompute.ComputeManagementClient;

/**
* Creates a new {@link ComputeManagementClient} object.
*
* @param {object} credentials                       The credentials object (typically, a CertificateCloudCredentials instance)
* @param {string} credentials.subscriptionId        The subscription identifier.
* @param {string} [credentials.cert]                The cert value.
* @param {string} [credentials.key]                 The key value.
* @param {string} [credentials.pem]                 The PEM file data.
* @param {string} [baseUri]                         The base uri.
* @return {ComputeManagementClient}                 A new ComputeManagementClient object.
*/
exports.createComputeManagementClient = azureCompute.createComputeManagementClient;

/**
* Generated ServiceBusManagementClient client exports.
* @ignore
*/
exports.ServiceBusManagementClient = azureServiceBus.ServiceBusManagementClient;

/**
* Creates a new {@link ServiceBusManagementClient} object.
*
* @param {object} credentials                       The credentials object (typically, a CertificateCloudCredentials instance)
* @param {string} credentials.subscriptionId        The subscription identifier.
* @param {string} [credentials.cert]                The cert value.
* @param {string} [credentials.key]                 The key value.
* @param {string} [credentials.pem]                 The PEM file data.
* @param {string} [baseUri]                         The base uri.
* @return {ServiceBusManagementClient}              A new ServiceBusManagementClient object.
*/
exports.createServiceBusManagementClient = azureServiceBus.createServiceBusManagementClient;

/**
* Generated SchedulerManagementClient client exports.
* @ignore
*/
// TODO: uncomment when scheduler management is published
// var azureSchedulerManagement = require('azure-mgmt-scheduler');
// exports.SchedulerManagementClient = azureSchedulerManagement.SchedulerManagementClient;

/**
* Creates a new {@link SchedulerManagementClient} object.
*
* @param {object} credentials                       The credentials object (typically, a CertificateCloudCredentials instance)
* @param {string} credentials.subscriptionId        The subscription identifier.
* @param {string} [credentials.cert]                The cert value.
* @param {string} [credentials.key]                 The key value.
* @param {string} [credentials.pem]                 The PEM file data.
* @param {string} [baseUri]                         The base uri.
* @return {SchedulerManagementClient}               A new SchedulerManagementClient object.
*/
// TODO: uncomment when scheduler management is published
// exports.createSchedulerManagementClient = azureSchedulerManagement.createSchedulerManagementClient;

/**
* Generated SchedulerClient client exports.
* @ignore
*/
// TODO: uncomment when scheduler is published
// var azureScheduler = require('azure-scheduler');
// exports.SchedulerClient = azureScheduler.SchedulerClient;

/**
* Creates a new {@link SchedulerClient} object.
*
* @param {object} credentials                       The credentials object (typically, a CertificateCloudCredentials instance)
* @param {string} credentials.subscriptionId        The subscription identifier.
* @param {string} [credentials.cert]                The cert value.
* @param {string} [credentials.key]                 The key value.
* @param {string} [credentials.pem]                 The PEM file data.
* @param {string} [baseUri]                         The base uri.
* @return {SchedulerClient}                         A new SchedulerClient object.
*/
// TODO: uncomment when scheduler is published
// exports.createSchedulerClient = azureScheduler.createSchedulerClient;

/**
* Service Runtime exports.
* @ignore
*/

exports.RoleEnvironment = require('./serviceruntime/roleenvironment');

var azureCommon = require('azure-common');

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
exports.createCertificateCloudCredentials = azureCommon.createCertificateCloudCredentials;

/**
* Creates a new BasicAuthenticationCloudCredentials object.
* Either a pair of cert / key values need to be pass or a pem file location.
*
* @param {string} credentials.username            The username.
* @param {string} credentials.password            The password.
* @return {BasicAuthenticationCloudCredentials}
*/
exports.createBasicAuthenticationCloudCredentials = azureWebSite.createBasicAuthenticationCloudCredentials;

exports.Constants = azureCommon.Constants;
exports.ServiceClient = azureCommon.ServiceClient;
exports.ServiceClientConstants = azureCommon.ServiceClientConstants;
exports.ConnectionStringParser = azureCommon.ConnectionStringParser;
exports.Logger = azureCommon.Logger;
exports.WebResource = azureCommon.WebResource;
exports.Validate = azureCommon.validate;
exports.date = azureCommon.date;

exports.ServiceSettings = azureCommon.ServiceSettings;
exports.ServiceBusSettings = azureCommon.ServiceBusSettings;
exports.ServiceManagementSettings = azureCommon.ServiceManagementSettings;
exports.StorageServiceSettings = azureCommon.StorageServiceSettings;

// Credentials
exports.CertificateCloudCredentials = azureCommon.CertificateCloudCredentials;
exports.TokenCloudCredentials = azureCommon.TokenCloudCredentials;
exports.SharedAccessSignature = require('./services/blob/internal/sharedaccesssignature');
exports.SharedKey = require('./services/blob/internal/sharedkey');
exports.SharedKeyLite = require('./services/blob/internal/sharedkeylite');
exports.SharedKeyTable = require('./services/table/internal/sharedkeytable');
exports.SharedKeyLiteTable = require('./services/table/internal/sharedkeylitetable');

// Other filters
exports.LinearRetryPolicyFilter = azureCommon.LinearRetryPolicyFilter;
exports.ExponentialRetryPolicyFilter = azureCommon.ExponentialRetryPolicyFilter;
exports.UserAgentFilter = azureCommon.UserAgentFilter;
exports.ProxyFilter = azureCommon.ProxyFilter;
exports.LogFilter = azureCommon.LogFilter;

/** 
* Check if the application is running in the Windows Azure Emulator.
* @property {boolean} isEmulated   `true` if the application is running in the emulator; otherwise, `false`.
*/
exports.isEmulated = function (host) {
  return azureCommon.ServiceClient.isEmulated(host);
};

/*
* Configuration
*/

var sdkconfig = azureCommon.SdkConfig;
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