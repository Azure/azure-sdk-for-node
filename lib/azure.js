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

var storage = require('azure-storage');

var TableService = storage.TableService;
exports.TableService = TableService;

exports.TableQuery = storage.TableQuery;

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

var BlobService = storage.BlobService;
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
var QueueService = storage.QueueService;
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

var azureSb = require('azure-sb');
var ServiceBusService = azureSb.ServiceBusService;
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
exports.createServiceBusService = azureSb.createServiceBusService;

/**
* Notification hub client exports.
* @ignore
*/

var NotificationHubService = azureSb.NotificationHubService;
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
exports.createNotificationHubService = azureSb.createNotificationHubService;

/**
* Wrap service exports.
* @ignore
*/

var WrapService = azureSb.WrapService;
exports.WrapService = WrapService;

/**
* Creates a new WrapService object.
*
* @param {string} acsHost                 The access control host.
* @param {string} [issuer]                The service bus issuer.
* @param {string} [accessKey]             The service bus issuer password.
*/
exports.createWrapService = azureSb.createWrapService;

/**
* Generated ManagementClient client exports.
* @ignore
*/

var azureManagement = require('azure-mgmt');
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
* SqlManagementService client exports.
* @ignore
*/
var azureSqlMgmt = require('azure-mgmt-sql');
var SqlManagementService = azureSqlMgmt.SqlManagementService;
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
exports.createSqlManagementService = azureSqlMgmt.createSqlManagementService;

/**
* SQL service exports.
* @ignore
*/

var SqlService = azureSqlMgmt.SqlService;
exports.SqlService = SqlService;

/**
*
* Creates a new SqlService object
* @class
* The SqlService object allows you to perform management operations against databases
* created using Microsoft Azure SQL Database.
* @constructor
* @param {string} serverName                   The SQL server name.
* @param {string} administratorLogin           The SQL Server administrator login.
* @param {string} administratorLoginPassword   The SQL Server administrator login password.
* @param {string} [host]                       The host for the service.
* @param {string} [acsHost]                    The acs host.
* @param {object} [authenticationProvider]     The authentication provider.
*/
exports.createSqlService = azureSqlMgmt.createSqlService;


/**
* HDInsightService client exports.
* @ignore
*/
var azureHDInsight = require('azure-mgmt-hdinsight');
var HDInsightService = azureHDInsight.HDInsightService;

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
exports.createHDInsightService = azureHDInsight.createHDInsightService;

/**
* Generated ServiceBusManagementClient client exports.
* @ignore
*/

var azureServiceBus = require('azure-mgmt-sb');
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
* WebsiteManagementService client exports.
* @ignore
*/

var azureWebSite2 = require('azure-rm-website');

// TODO: rename to simply WebSiteManagementClient once RDFE goes away
/**
* Generated WebsiteManagementCLient client exports.
* @ignore
*/
exports.WebSiteManagementClient2 = azureWebSite2.WebSiteManagementClient;

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
exports.createWebSiteManagementClient2 = azureWebSite2.createWebSiteManagementClient;

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
* Generated NetworkManagementClient client exports.
* @ignore
*/

var azureNetwork = require('azure-mgmt-vnet');
exports.NetworkManagementClient = azureNetwork.NetworkManagementClient;

/**
* Creates a new {@link NetworkManagementClient} object.
*
* @param {object} credentials                       The credentials object (typically, a CertificateCloudCredentials instance)
* @param {string} credentials.subscriptionId        The subscription identifier.
* @param {string} [credentials.cert]                The cert value.
* @param {string} [credentials.key]                 The key value.
* @param {string} [credentials.pem]                 The PEM file data.
* @param {string} [baseUri]                         The base uri.
* @return {NetworkManagementClient}          A new NetworkManagementClient object.
*/
exports.createNetworkManagementClient = azureNetwork.createNetworkManagementClient;

/**
* Generated SqlManagementClient client exports.
* @ignore
*/
exports.SqlManagementClient = azureSqlMgmt.SqlManagementClient;

/**
* Creates a new {@link SqlClient} object.
*
* @param {string} [credentials.subscriptionId]      The subscription identifier.
* @param {string} [credentials.cert]                The cert value.
* @param {string} [credentials.key]                 The key value.
* @param {string} [baseUri]                         The base uri.
* @return {SqlClient}                               A new SqlClient object.
*/
exports.createSqlManagementClient = azureSqlMgmt.createSqlManagementClient;

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

var azureSubscription = require('azure-mgmt-subscription');
exports.SubscriptionClient = azureSubscription.SubscriptionClient;

/**
* Creates a new {@link SubscriptionClient} object.
*
* @param {object} credentials                       The credentials object (typically, a TokenCloudCredentials instance)
* @param {string} [baseUri]                         The base uri.
* @return {SubscriptionClient}                      A new SubscriptionClient object.
*/
exports.createSubscriptionClient = azureSubscription.createSubscriptionClient;

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
* Generated ResourceManagementClient client exports.
* @ignore
*/
var resourceManagement = require('azure-mgmt-resource');
exports.ResourceManagementClient = resourceManagement.ResourceManagementClient;

/**
* Creates a new {@link ResourceManagementClient} object.
*
* @param {string} [credentials.subscriptionId]      The subscription identifier.
* @param {string} [credentials.token]               The access token.
* @param {string} [baseUri]                         The base uri.
* @return {ResourceManagementClient}                A new ResourceManagementClient object.
*/
exports.createResourceManagementClient = resourceManagement.createResourceManagementClient;

exports.createResourceIdentity = resourceManagement.createResourceIdentity;

/**
* Generated GalleryClient client exports.
* @ignore
*/
var gallery = require('azure-gallery');
exports.GalleryClient = gallery.GalleryClient;

/**
* Creates a new {@link GalleryClient} object.
*
* @param {object} credentials            The credentials object (typically, a TokenCloudCredentials instance)
* @param {string} [baseUri]              The base uri
* @param {Array} [filters]               Extra filters to attach to the client
* @return {GalleryClient}                A new GalleryClient object.
*/
exports.createGalleryClient = gallery.createGalleryClient;

/**
* Generated SchedulerManagementClient client exports.
* @ignore
*/
var azureSchedulerManagement = require('azure-mgmt-scheduler');
exports.SchedulerManagementClient = azureSchedulerManagement.SchedulerManagementClient;

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
exports.createSchedulerManagementClient = azureSchedulerManagement.createSchedulerManagementClient;

/**
* Generated SchedulerClient client exports.
* @ignore
*/
var azureScheduler = require('azure-scheduler');
exports.SchedulerClient = azureScheduler.SchedulerClient;

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
exports.createSchedulerClient = azureScheduler.createSchedulerClient;

/**
* Generated monitoring client exports.
* @ignore
*/
var azureMonitoring = require('azure-monitoring');

exports.EventsClient = azureMonitoring.EventsClient;

/**
* Creates a new {@link EventsClient} object.
*
* @param {object} credentials            The credentials, typically a TokenCloudCredential
* @param {string} [baseUri]              The base uri.
* @param {array} [filters]               Extra request filters to add
* @return {EventsClient}                A new EventsClient object.
*/
exports.createEventsClient = azureMonitoring.createEventsClient;

exports.AlertsClient = azureMonitoring.AlertsClient;

/**
* Creates a new {@link AlertsClient} object.
*
* @param {object} credentials                       The credentials object (typically, a CertificateCloudCredentials instance)
* @param {string} credentials.subscriptionId        The subscription identifier.
* @param {string} [credentials.cert]                The cert value.
* @param {string} [credentials.key]                 The key value.
* @param {string} [credentials.pem]                 The PEM file data.
* @param {string} [baseUri]                         The base uri.
* @return {AlertsClient}                            A new AlertsClient object.
*/
// TODO: uncomment when monitoring is published
// exports.createAlertsClient = azureMonitoring.createAlertsClient;

/**
* Generated AutoScaleClient client exports.
* @ignore
*/
exports.AutoScaleClient = azureMonitoring.AutoScaleClient;

/**
* Creates a new {@link AutoScaleClient} object.
*
* @param {object} credentials                       The credentials object (typically, a CertificateCloudCredentials instance)
* @param {string} credentials.subscriptionId        The subscription identifier.
* @param {string} [credentials.cert]                The cert value.
* @param {string} [credentials.key]                 The key value.
* @param {string} [credentials.pem]                 The PEM file data.
* @param {string} [baseUri]                         The base uri.
* @return {AutoScaleClient}                         A new AutoScaleClient object.
*/
exports.createAutoScaleClient = azureMonitoring.createAutoScaleClient;

/**
* Generated MetricsClient client exports.
* @ignore
*/
exports.MetricsClient = azureMonitoring.MetricsClient;

/**
* Creates a new {@link MetricsClient} object.
*
* @param {object} credentials                       The credentials object (typically, a CertificateCloudCredentials instance)
* @param {string} credentials.subscriptionId        The subscription identifier.
* @param {string} [credentials.cert]                The cert value.
* @param {string} [credentials.key]                 The key value.
* @param {string} [credentials.pem]                 The PEM file data.
* @param {string} [baseUri]                         The base uri.
* @return {MetricsClient}                           A new MetricsClient object.
*/
exports.createMetricsClient = azureMonitoring.createMetricsClient;

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
exports.AnonymousCloudCredentials = azureCommon.AnonymousCloudCredentials;
exports.SharedAccessSignature = storage.SharedAccessSignature;
exports.SharedKey = storage.SharedKey;
exports.SharedKeyLite = storage.SharedKeyLite;
exports.SharedKeyTable = storage.SharedKeyTable;
exports.SharedKeyLiteTable = storage.SharedKeyLiteTable;

// Other filters
exports.LinearRetryPolicyFilter = azureCommon.LinearRetryPolicyFilter;
exports.ExponentialRetryPolicyFilter = azureCommon.ExponentialRetryPolicyFilter;
exports.UserAgentFilter = azureCommon.UserAgentFilter;
exports.ProxyFilter = azureCommon.ProxyFilter;
exports.LogFilter = azureCommon.LogFilter;

/**
* Check if the application is running in the Microsoft Azure Emulator.
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
exports.configure = azureCommon.configure;
exports.dumpConfig = exports.dumpConfig;
