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

'use strict';

var exports = module.exports;

/**
 * Table client exports.
 * @ignore
 */

var storage = require('azure-storage');

var TableService = storage.TableService;
exports.TableService = TableService;
exports.TableUtilities = storage.TableUtilities;
exports.TableQuery = storage.TableQuery;
exports.TableBatch = storage.TableBatch;

/**
 * Creates a new {@link TableService} object.
 * If no storageaccount or storageaccesskey are provided, the AZURE_STORAGE_ACCOUNT and AZURE_STORAGE_ACCESS_KEY environment variables will be used.
 *
 * @method
 * @param {string} [storageAccountOrConnectionString]  The storage account or the connection string.
 * @param {string} [storageAccessKey]                  The storage access key.
 * @param {string} [host]                              The host address.
 * @param {object} [authenticationProvider]            The authentication provider.
 * @return {TableService}                              A new TableService object.
 * @tutorial getting-started
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
 * @method
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
 * @method
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
 * @method
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
 * @method
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
 * @method
 * @param {string} acsHost                 The access control host.
 * @param {string} [issuer]                The service bus issuer.
 * @param {string} [accessKey]             The service bus issuer password.
 */
exports.createWrapService = azureSb.createWrapService;

/**
* Generated ManagementClient client exports.
* @ignore
*/

var azureManagement = require('azure-asm-mgmt');
exports.ManagementClient = azureManagement.ManagementClient;

/**
 * Creates a new {@link ManagementClient} object.
 *
 * @method
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
var azureSqlMgmt = require('azure-asm-sql');
var SqlManagementService = azureSqlMgmt.SqlManagementService;
exports.ASMSqlManagementService = SqlManagementService;

/**
 * Creates a new {@link SqlManagementService} object.
 * @method
 * @param {string} subscriptionId                                       The subscription ID for the account.
 * @param {object} authentication                                       The authentication object for the client.
 *                                                                     You must use either keyfile/certfile or keyvalue/certvalue
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
exports.createASMSqlManagementService = azureSqlMgmt.createSqlManagementService;

/**
 * SQL service exports.
 * @ignore
 */

var SqlService = azureSqlMgmt.SqlService;
exports.SqlService = SqlService;

/**
 *
 * Creates a new SqlService object
 *
 * The SqlService object allows you to perform management operations against databases
 * created using Microsoft Azure SQL Database.
 * @method
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
var azureHDInsight = require('azure-asm-hdinsight');
var HDInsightService = azureHDInsight.HDInsightService;

/**
 * Creates a new {@link HDInsightService} object.
 * @method
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

var azureServiceBus = require('azure-asm-sb');
exports.ServiceBusManagementClient = azureServiceBus.ServiceBusManagementClient;

/**
 * Creates a new {@link ServiceBusManagementClient} object.
 * @method
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

var azureWebSite = require('azure-asm-website');
var WebsiteManagementService = azureWebSite.WebsiteManagementService;
exports.ASMWebsiteManagementService = WebsiteManagementService;

/**
 * Creates a new {@link WebsiteManagementService} object.
 *
 * @deprecated Use {@link createWebSiteManagementClient} instead.
 * @method
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
exports.createASMWebsiteManagementService = azureWebSite.createWebsiteManagementService;

/**
 * Generated NetworkManagementClient client exports.
 * @ignore
 */

var azureNetwork = require('azure-asm-network');
exports.ASMNetworkManagementClient = azureNetwork.NetworkManagementClient;

/**
 * Creates a new {@link NetworkManagementClient} object.
 * @method
 * @param {object} credentials                       The credentials object (typically, a CertificateCloudCredentials instance)
 * @param {string} credentials.subscriptionId        The subscription identifier.
 * @param {string} [credentials.cert]                The cert value.
 * @param {string} [credentials.key]                 The key value.
 * @param {string} [credentials.pem]                 The PEM file data.
 * @param {string} [baseUri]                         The base uri.
 * @return {NetworkManagementClient}          A new NetworkManagementClient object.
 */
exports.createASMNetworkManagementClient = azureNetwork.creatNetworkManagementClient;

var asmTrafficManager = require('azure-asm-trafficmanager');
exports.ASMTrafficManagerManagementClient = asmTrafficManager.TrafficManagerManagementClient;

/**
 * Creates a new TrafficManagerManagementClient object.
 *
 * NOTE: These APIs are still in development and should not be used.
 *
 * @param {string} [credentials.subscriptionId]      The subscription identifier.
 * @param {string} [credentials.token]               The access token.
 * @param {string} [baseUri]                         The base uri.
 * @param {array}  [filters]                         Optional array of service filters
 * @return {TrafficManagerManagementClient}          A new TrafficManagerManagementClient object.
 */
exports.createASMTrafficManagerManagementClient = asmTrafficManager.createTrafficManagerManagementClient;

/**
 * Generated SqlManagementClient client exports.
 * @ignore
 */
exports.ASMSqlManagementClient = azureSqlMgmt.SqlManagementClient;

/**
 * Creates a new {@link SqlClient} object.
 * @method
 * @param {string} [credentials.subscriptionId]      The subscription identifier.
 * @param {string} [credentials.cert]                The cert value.
 * @param {string} [credentials.key]                 The key value.
 * @param {string} [baseUri]                         The base uri.
 * @return {SqlClient}                               A new SqlClient object.
 */
exports.createASMSqlManagementClient = azureSqlMgmt.createSqlManagementClient;

/**
 * Generated StorageManagementClient client exports.
 * @ignore
 */
var azureStorage = require('azure-asm-storage');
exports.ASMStorageManagementClient = azureStorage.StorageManagementClient;

/**
 * Creates a new {@link StorageManagementClient} object.
 * @method
 * @param {object} credentials                       The credentials object (typically, a CertificateCloudCredentials instance)
 * @param {string} credentials.subscriptionId        The subscription identifier.
 * @param {string} [credentials.cert]                The cert value.
 * @param {string} [credentials.key]                 The key value.
 * @param {string} [credentials.pem]                 The PEM file data.
 * @param {string} [baseUri]                         The base uri.
 * @return {StorageManagementClient}                 A new StorageManagementClient object.
 */
exports.createASMStorageManagementClient = azureStorage.createStorageManagementClient;

/**
 * Generated StoreClient client exports.
 * @ignore
 */
var azureStore = require('azure-asm-store');
exports.ASMStoreManagementClient = azureStore.StoreManagementClient;

/**
 * Creates a new {@link StoreManagementClient} object.
 * @method
 * @param {object} credentials                       The credentials object (typically, a CertificateCloudCredentials instance)
 * @param {string} credentials.subscriptionId        The subscription identifier.
 * @param {string} [credentials.cert]                The cert value.
 * @param {string} [credentials.key]                 The key value.
 * @param {string} [credentials.pem]                 The PEM file data.
 * @param {string} [baseUri]                         The base uri.
 * @return {StoreManagementClient}                   A new StoreManagementClient object.
 */
exports.createASMStoreManagementClient = azureStore.createStoreManagementClient;

/**
 * Generated SubscriptionClient client exports.
 * @ignore
 */

var azureASMSubscription = require('azure-asm-subscription');
exports.ASMSubscriptionClient = azureASMSubscription.SubscriptionClient;

/**
 * Creates a new {@link SubscriptionClient} object.
 * @method
 * @param {object} credentials                       The credentials object (typically, a TokenCloudCredentials instance)
 * @param {string} [baseUri]                         The base uri.
 * @return {SubscriptionClient}                      A new SubscriptionClient object.
 */
exports.createASMSubscriptionClient = azureASMSubscription.createSubscriptionClient;

/**
 * Generated WebsiteManagementService client exports.
 * @ignore
 */
exports.ASMWebSiteManagementClient = azureWebSite.WebSiteManagementClient;

exports.ASMWebSiteExtensionsClient = azureWebSite.WebSiteExtensionsClient;

/**
 * Creates a new {@link WebSiteManagementClient} object.
 * @method
 * @param {object} credentials                       The credentials object (typically, a CertificateCloudCredentials instance)
 * @param {string} credentials.subscriptionId        The subscription identifier.
 * @param {string} [credentials.cert]                The cert value.
 * @param {string} [credentials.key]                 The key value.
 * @param {string} [credentials.pem]                 The PEM file data.
 * @param {string} [baseUri]                         The base uri.
 * @return {WebSiteManagementClient}                 A new WebSiteManagementClient object.
 */
exports.createASMWebSiteManagementClient = azureWebSite.createWebSiteManagementClient;

/**
 * Creates a new {@link WebSiteExtensionsClient} object.
 * @method
 * @param {string} siteName                          The site name.
 * @param {string} credentials.username              The username.
 * @param {string} credentials.password              The password.
 * @param {string} [baseUri]                         The base uri.
 * @return {WebSiteManagementClient}                 A new WebSiteManagementClient object.
 */
exports.createASMWebSiteExtensionsClient = azureWebSite.createWebSiteExtensionsClient;

/**
 * ScmService client exports.
 * @ignore
 */

exports.ASMScmService = azureWebSite.ScmService;

/**
 * Creates a new {@link ScmService} object.
 * @method
 * @param {object} authentication          The authentication object for the client.
 *                                         You must use a auth/pass for basic authentication.
 * @param {string} [authentication.user]   The basic authentication username.
 * @param {string} [authentication.pass]   The basic authentication password.
 * @param {object} [hostOptions]           The host options to override defaults.
 * @param {string} [hostOptions.host]      The SCM repository endpoint.
 * @return {ScmService}                    A new WebsitemanagementService object.
 */
exports.createASMScmService = azureWebSite.createScmService;

/**
 * Generated ComputeManagementClient client exports.
 * @ignore
 */
var azureCompute = require('azure-asm-compute');
exports.ASMComputeManagementClient = azureCompute.ComputeManagementClient;

/**
 * Creates a new {@link ComputeManagementClient} object.
 * @method
 * @param {object} credentials                       The credentials object (typically, a CertificateCloudCredentials instance)
 * @param {string} credentials.subscriptionId        The subscription identifier.
 * @param {string} [credentials.cert]                The cert value.
 * @param {string} [credentials.key]                 The key value.
 * @param {string} [credentials.pem]                 The PEM file data.
 * @param {string} [baseUri]                         The base uri.
 * @return {ComputeManagementClient}                 A new ComputeManagementClient object.
 */
exports.createASMComputeManagementClient = azureCompute.createComputeManagementClient;

/**
 * Generated GalleryClient client exports.
 * @ignore
 */
var gallery = require('azure-gallery');
exports.ARMGalleryClient = gallery.GalleryClient;

/**
 * Creates a new {@link GalleryClient} object.
 * @method
 * @param {object} credentials            The credentials object (typically, a TokenCloudCredentials instance)
 * @param {string} [baseUri]              The base uri
 * @param {Array} [filters]               Extra filters to attach to the client
 * @return {GalleryClient}                A new GalleryClient object.
 */
exports.createARMGalleryClient = gallery.createGalleryClient;

/**
 * Generated SchedulerManagementClient client exports.
 * @ignore
 */
var azureSchedulerManagement = require('azure-asm-scheduler');
exports.ASMSchedulerManagementClient = azureSchedulerManagement.SchedulerManagementClient;

/**
 * Creates a new {@link SchedulerManagementClient} object.
 * @method
 * @param {object} credentials                       The credentials object (typically, a CertificateCloudCredentials instance)
 * @param {string} credentials.subscriptionId        The subscription identifier.
 * @param {string} [credentials.cert]                The cert value.
 * @param {string} [credentials.key]                 The key value.
 * @param {string} [credentials.pem]                 The PEM file data.
 * @param {string} [baseUri]                         The base uri.
 * @return {SchedulerManagementClient}               A new SchedulerManagementClient object.
 */
exports.createASMSchedulerManagementClient = azureSchedulerManagement.createSchedulerManagementClient;

/**
 * Generated SchedulerClient client exports.
 * @ignore
 */
var azureScheduler = require('azure-scheduler');
exports.SchedulerClient = azureScheduler.SchedulerClient;

/**
 * Creates a new {@link SchedulerClient} object.
 * @method
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
 * @method
 * @param {object} credentials            The credentials, typically a TokenCloudCredential
 * @param {string} [baseUri]              The base uri.
 * @param {array} [filters]               Extra request filters to add
 * @return {EventsClient}                A new EventsClient object.
 */
exports.createEventsClient = azureMonitoring.createEventsClient;

exports.AlertsClient = azureMonitoring.AlertsClient;

/**
 * Creates a new {@link AlertsClient} object.
 * @method
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
 * @method
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
 * @method
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
 * Key Vault client exports.
 * @ignore
 */
var azureKeyVault = require('azure-keyvault');

/** Identifier of the resource on which Key Vault users and service principals must authenticate.
 */
exports.KEYVAULT_RESOURCE_ID = azureKeyVault.RESOURCE_ID;

/**
 * Initializes a new instance of the KeyVaultClient class.
 * @constructor
 *
 * @param {credentials} credentials - Credentials needed for the client to connect to Azure.
 *
 * @param {object} [options] - The parameter options
 *
 * @param {Array} [options.filters] - Filters to be added to the request pipeline
 *
 * @param {object} [options.requestOptions] - Options for the underlying request object
 * {@link https://github.com/request/request#requestoptions-callback Options doc}
 *
 * @param {boolean} [options.noRetryPolicy] - If set to true, turn off default retry policy
 *
 * @param {string} [options.apiVersion] - Client Api Version.
 *
 * @param {string} [options.acceptLanguage] - Gets or sets the preferred language for the response.
 *
 * @param {number} [options.longRunningOperationRetryTimeout] - Gets or sets the retry timeout in seconds for Long Running Operations. Default value is 30.
 *
 * @param {boolean} [options.generateClientRequestId] - When set to true a unique x-ms-client-request-id value is generated and included in each request. Default is true.
 *
 */
exports.KeyVaultClient = azureKeyVault.KeyVaultClient;

/**
 * Creates a new {@linkcode KeyVaultClient} object.
 *
 * @param {object} [credentials]     The credentials, typically a {@linkcode KeyVaultCredentials} object. If null, an authentication filter must be provided.

 * @param {object} [options] - The parameter options
 *
 * @param {Array} [options.filters] - Filters to be added to the request pipeline
 *
 * @param {object} [options.requestOptions] - Options for the underlying request object
 * {@link https://github.com/request/request#requestoptions-callback Options doc}
 *
 * @param {boolean} [options.noRetryPolicy] - If set to true, turn off default retry policy
 *
 * @param {string} [options.apiVersion] - Client Api Version.
 *
 * @param {string} [options.acceptLanguage] - Gets or sets the preferred language for the response.
 *
 * @param {number} [options.longRunningOperationRetryTimeout] - Gets or sets the retry timeout in seconds for Long Running Operations. Default value is 30.
 *
 * @param {boolean} [options.generateClientRequestId] - When set to true a unique x-ms-client-request-id value is generated and included in each request. Default is true.
 *
 */
exports.createKeyVaultClient = azureKeyVault.createKeyVaultClient;

/**
 * Key Vault management client exports.
 * @ignore
 */

/**
 * Creates a new instance of the KeyVaultManagementClient.
 *
 * @param {credentials} credentials - Credentials needed for the client to connect to Azure.
 *
 * @param {string} subscriptionId - Gets subscription credentials which uniquely identify Microsoft Azure subscription. The subscription ID forms part of the URI for every service call.
 *
 * @param {object} [options] - The parameter options
 *
 * @param {Array} [options.filters] - Filters to be added to the request pipeline
 *
 * @param {object} [options.requestOptions] - Options for the underlying request object
 * {@link https://github.com/request/request#requestoptions-callback Options doc}
 *
 * @param {boolean} [options.noRetryPolicy] - If set to true, turn off default retry policy
 *
 * @param {string} [options.apiVersion] - Client Api Version.
 *
 * @param {string} [options.acceptLanguage] - Gets or sets the preferred language for the response.
 *
 * @param {number} [options.longRunningOperationRetryTimeout] - Gets or sets the retry timeout in seconds for Long Running Operations. Default value is 30.
 *
 * @param {boolean} [options.generateClientRequestId] - When set to true a unique x-ms-client-request-id value is generated and included in each request. Default is true.
 *
 */
exports.createKeyVaultManagementClient = function (credentials, subscriptionId, options) {
  const AzureKeyVaultManagement = require('azure-arm-keyvault');
  return new AzureKeyVaultManagement(credentials, subscriptionId, null, options);
};


/**
 * Service Runtime exports.
 * @ignore
 */

exports.RoleEnvironment = require('./serviceruntime/roleenvironment');

var azureCommon = require('azure-common');

/**
 * Creates a new CertificateCloudCredentials object.
 * Either a pair of cert / key values need to be pass or a pem file location.
 * @method
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
 * @method
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

/**
 * Configuration
 */
var sdkconfig = azureCommon.SdkConfig;
exports.config = sdkconfig;
exports.configure = azureCommon.configure;
exports.dumpConfig = exports.dumpConfig;

/**
 * Creates a new instance of the ARM ResourceManagementClient.
 *
 * @param {credentials} credentials - Gets Azure subscription credentials.
 *
 * @param {string} subscriptionId - Gets subscription credentials which uniquely identify Microsoft Azure subscription. The subscription ID forms part of the URI for every service call.
 *
 * @param {object} [options] - The parameter options
 *
 * @param {Array} [options.filters] - Filters to be added to the request pipeline
 *
 * @param {object} [options.requestOptions] - Options for the underlying request object
 * {@link https://github.com/request/request#requestoptions-callback Options doc}
 *
 * @param {boolean} [options.noRetryPolicy] - If set to true, turn off default retry policy
 *
 * @param {string} [options.apiVersion] - Client Api Version.
 *
 * @param {string} [options.acceptLanguage] - Gets or sets the preferred language for the response.
 *
 * @param {number} [options.longRunningOperationRetryTimeout] - Gets or sets the retry timeout in seconds for Long Running Operations. Default value is 30.
 *
 * @param {boolean} [options.generateClientRequestId] - When set to true a unique x-ms-client-request-id value is generated and included in each request. Default is true.
 *
 */
exports.createResourceManagementClient = function (credentials, subscriptionId, options) {
  const ResourceManagement = require('azure-arm-resource');
  return new ResourceManagement.ResourceManagementClient(credentials, subscriptionId, null, options);
};

/**
 * Creates a new instance of the ARM FeatureManagementClient.
 *
 * @param {credentials} credentials - Gets Azure subscription credentials.
 *
 * @param {string} subscriptionId - Gets subscription credentials which uniquely identify Microsoft Azure subscription. The subscription ID forms part of the URI for every service call.
 *
 * @param {object} [options] - The parameter options
 *
 * @param {Array} [options.filters] - Filters to be added to the request pipeline
 *
 * @param {object} [options.requestOptions] - Options for the underlying request object
 * {@link https://github.com/request/request#requestoptions-callback Options doc}
 *
 * @param {boolean} [options.noRetryPolicy] - If set to true, turn off default retry policy
 *
 * @param {string} [options.apiVersion] - Client Api Version.
 *
 * @param {string} [options.acceptLanguage] - Gets or sets the preferred language for the response.
 *
 * @param {number} [options.longRunningOperationRetryTimeout] - Gets or sets the retry timeout in seconds for Long Running Operations. Default value is 30.
 *
 * @param {boolean} [options.generateClientRequestId] - When set to true a unique x-ms-client-request-id value is generated and included in each request. Default is true.
 *
 */
exports.createFeatureManagementClient = function (credentials, subscriptionId, options) {
  const ResourceManagement = require('azure-arm-resource');
  return new ResourceManagement.FeatureClient(credentials, subscriptionId, null, options);
};

/**
 * Creates a new instance of the ARM SubscriptionManagementClient.
 *
 * @param {credentials} credentials - Gets Azure subscription credentials.
 *
 * @param {object} [options] - The parameter options
 *
 * @param {Array} [options.filters] - Filters to be added to the request pipeline
 *
 * @param {object} [options.requestOptions] - Options for the underlying request object
 * {@link https://github.com/request/request#requestoptions-callback Options doc}
 *
 * @param {boolean} [options.noRetryPolicy] - If set to true, turn off default retry policy
 *
 * @param {string} [options.apiVersion] - Client Api Version.
 *
 * @param {string} [options.acceptLanguage] - Gets or sets the preferred language for the response.
 *
 * @param {number} [options.longRunningOperationRetryTimeout] - Gets or sets the retry timeout in seconds for Long Running Operations. Default value is 30.
 *
 * @param {boolean} [options.generateClientRequestId] - When set to true a unique x-ms-client-request-id value is generated and included in each request. Default is true.
 *
 */
exports.createSubscriptionManagementClient = function (credentials, options) {
  const ResourceManagement = require('azure-arm-resource');
  return new ResourceManagement.SubscriptionClient(credentials, null, options);
};

/**
 * Creates a new instance of the ARM Resource ManagementLockClient.
 *
 * @param {credentials} credentials - Gets Azure subscription credentials.
 *
 * @param {string} subscriptionId - Gets subscription credentials which uniquely identify Microsoft Azure subscription. The subscription ID forms part of the URI for every service call.
 *
 * @param {object} [options] - The parameter options
 *
 * @param {Array} [options.filters] - Filters to be added to the request pipeline
 *
 * @param {object} [options.requestOptions] - Options for the underlying request object
 * {@link https://github.com/request/request#requestoptions-callback Options doc}
 *
 * @param {boolean} [options.noRetryPolicy] - If set to true, turn off default retry policy
 *
 * @param {string} [options.apiVersion] - Client Api Version.
 *
 * @param {string} [options.acceptLanguage] - Gets or sets the preferred language for the response.
 *
 * @param {number} [options.longRunningOperationRetryTimeout] - Gets or sets the retry timeout in seconds for Long Running Operations. Default value is 30.
 *
 * @param {boolean} [options.generateClientRequestId] - When set to true a unique x-ms-client-request-id value is generated and included in each request. Default is true.
 *
 */
exports.createResourceManagementLockClient = function (credentials, subscriptionId, options) {
  const ResourceManagement = require('azure-arm-resource');
  return new ResourceManagement.ManagementLockClient(credentials, subscriptionId, null, options);
};

/**
 * Creates a new instance of the ARM Resource ManagementLinkClient.
 *
 * @param {credentials} credentials - Gets Azure subscription credentials.
 *
 * @param {string} subscriptionId - Gets subscription credentials which uniquely identify Microsoft Azure subscription. The subscription ID forms part of the URI for every service call.
 *
 * @param {object} [options] - The parameter options
 *
 * @param {Array} [options.filters] - Filters to be added to the request pipeline
 *
 * @param {object} [options.requestOptions] - Options for the underlying request object
 * {@link https://github.com/request/request#requestoptions-callback Options doc}
 *
 * @param {boolean} [options.noRetryPolicy] - If set to true, turn off default retry policy
 *
 * @param {string} [options.apiVersion] - Client Api Version.
 *
 * @param {string} [options.acceptLanguage] - Gets or sets the preferred language for the response.
 *
 * @param {number} [options.longRunningOperationRetryTimeout] - Gets or sets the retry timeout in seconds for Long Running Operations. Default value is 30.
 *
 * @param {boolean} [options.generateClientRequestId] - When set to true a unique x-ms-client-request-id value is generated and included in each request. Default is true.
 *
 */
exports.createResourceManagementLinkClient = function (credentials, subscriptionId, options) {
  const ResourceManagement = require('azure-arm-resource');
  return new ResourceManagement.ManagementLockClient(credentials, subscriptionId, null, options);
};

/**
 * Creates a new instance of the PolicyClient class.
 *
 * @param {credentials} credentials - Credentials needed for the client to connect to Azure.
 *
 * @param {string} subscriptionId - Gets subscription credentials which uniquely identify Microsoft Azure subscription. The subscription ID forms part of the URI for every service call.
 *
 * @param {object} [options] - The parameter options
 *
 * @param {Array} [options.filters] - Filters to be added to the request pipeline
 *
 * @param {object} [options.requestOptions] - Options for the underlying request object
 * {@link https://github.com/request/request#requestoptions-callback Options doc}
 *
 * @param {boolean} [options.noRetryPolicy] - If set to true, turn off default retry policy
 *
 * @param {string} [options.apiVersion] - Client Api Version.
 *
 * @param {string} [options.acceptLanguage] - Gets or sets the preferred language for the response.
 *
 * @param {number} [options.longRunningOperationRetryTimeout] - Gets or sets the retry timeout in seconds for Long Running Operations. Default value is 30.
 *
 * @param {boolean} [options.generateClientRequestId] - When set to true a unique x-ms-client-request-id value is generated and included in each request. Default is true.
 *
 */
exports.createResourcePolicyClient = function (credentials, subscriptionId, options) {
  const ResourceManagement = require('azure-arm-resource');
  return new ResourceManagement.PolicyClient(credentials, subscriptionId, null, options);
};

/**
 * Creates a new instance of the ARM Resource ManagementGroupsClient.
 *
 * @param {credentials} credentials - Gets Azure subscription credentials.
 *
 * @param {string} subscriptionId - Gets subscription credentials which uniquely identify Microsoft Azure subscription. The subscription ID forms part of the URI for every service call.
 *
 * @param {object} [options] - The parameter options
 *
 * @param {Array} [options.filters] - Filters to be added to the request pipeline
 *
 * @param {object} [options.requestOptions] - Options for the underlying request object
 * {@link https://github.com/request/request#requestoptions-callback Options doc}
 *
 * @param {boolean} [options.noRetryPolicy] - If set to true, turn off default retry policy
 *
 * @param {string} [options.apiVersion] - Client Api Version.
 *
 * @param {string} [options.acceptLanguage] - Gets or sets the preferred language for the response.
 *
 * @param {number} [options.longRunningOperationRetryTimeout] - Gets or sets the retry timeout in seconds for Long Running Operations. Default value is 30.
 *
 * @param {boolean} [options.generateClientRequestId] - When set to true a unique x-ms-client-request-id value is generated and included in each request. Default is true.
 *
 */
exports.createResourceManagementGroupsClient = function (credentials, subscriptionId, options) {
  const ResourceManagement = require('azure-arm-resource');
  return new ResourceManagement.ManagementGroupsClient(credentials, subscriptionId, null, options);
};

/**
 * Creates a new instance of the ARM StorageManagementClient.
 *
 * @param {credentials} credentials - Gets Azure subscription credentials.
 *
 * @param {string} subscriptionId - Gets subscription credentials which uniquely identify Microsoft Azure subscription. The subscription ID forms part of the URI for every service call.
 *
 * @param {object} [options] - The parameter options
 *
 * @param {Array} [options.filters] - Filters to be added to the request pipeline
 *
 * @param {object} [options.requestOptions] - Options for the underlying request object
 * {@link https://github.com/request/request#requestoptions-callback Options doc}
 *
 * @param {boolean} [options.noRetryPolicy] - If set to true, turn off default retry policy
 *
 * @param {string} [options.apiVersion] - Client Api Version.
 *
 * @param {string} [options.acceptLanguage] - Gets or sets the preferred language for the response.
 *
 * @param {number} [options.longRunningOperationRetryTimeout] - Gets or sets the retry timeout in seconds for Long Running Operations. Default value is 30.
 *
 * @param {boolean} [options.generateClientRequestId] - When set to true a unique x-ms-client-request-id value is generated and included in each request. Default is true.
 *
 */
exports.createStorageManagementClient = function (credentials, subscriptionId, options) {
  const AzureARMStorage = require('azure-arm-storage');
  return new AzureARMStorage(credentials, subscriptionId, null, options);
};

/**
 * Creates a new instance of the ARM NetworkManagementClient.
 *
 * @param {credentials} credentials - Gets Azure subscription credentials.
 *
 * @param {string} subscriptionId - Gets subscription credentials which uniquely identify Microsoft Azure subscription. The subscription ID forms part of the URI for every service call.
 *
 * @param {object} [options] - The parameter options
 *
 * @param {Array} [options.filters] - Filters to be added to the request pipeline
 *
 * @param {object} [options.requestOptions] - Options for the underlying request object
 * {@link https://github.com/request/request#requestoptions-callback Options doc}
 *
 * @param {boolean} [options.noRetryPolicy] - If set to true, turn off default retry policy
 *
 * @param {string} [options.apiVersion] - Client Api Version.
 *
 * @param {string} [options.acceptLanguage] - Gets or sets the preferred language for the response.
 *
 * @param {number} [options.longRunningOperationRetryTimeout] - Gets or sets the retry timeout in seconds for Long Running Operations. Default value is 30.
 *
 * @param {boolean} [options.generateClientRequestId] - When set to true a unique x-ms-client-request-id value is generated and included in each request. Default is true.
 *
 */
exports.createNetworkManagementClient = function (credentials, subscriptionId, options) {
  const AzureARMNetwork = require('azure-arm-network');
  return new AzureARMNetwork(credentials, subscriptionId, null, options);
};

/**
 * Creates a new instance of the ARM ComputeManagementClient.
 *
 * @param {credentials} credentials - Gets Azure subscription credentials.
 *
 * @param {string} subscriptionId - Gets subscription credentials which uniquely identify Microsoft Azure subscription. The subscription ID forms part of the URI for every service call.
 *
 * @param {object} [options] - The parameter options
 *
 * @param {Array} [options.filters] - Filters to be added to the request pipeline
 *
 * @param {object} [options.requestOptions] - Options for the underlying request object
 * {@link https://github.com/request/request#requestoptions-callback Options doc}
 *
 * @param {boolean} [options.noRetryPolicy] - If set to true, turn off default retry policy
 *
 * @param {string} [options.apiVersion] - Client Api Version.
 *
 * @param {string} [options.acceptLanguage] - Gets or sets the preferred language for the response.
 *
 * @param {number} [options.longRunningOperationRetryTimeout] - Gets or sets the retry timeout in seconds for Long Running Operations. Default value is 30.
 *
 * @param {boolean} [options.generateClientRequestId] - When set to true a unique x-ms-client-request-id value is generated and included in each request. Default is true.
 *
 */
exports.createComputeManagementClient = function (credentials, subscriptionId, options) {
  const AzureARMCompute = require('azure-arm-compute');
  return new AzureARMCompute(credentials, subscriptionId, null, options);
};

/**
 * Creates a new instance of the ARM RedisCacheManagementClient.
 *
 * @param {credentials} credentials - Gets Azure subscription credentials.
 *
 * @param {string} subscriptionId - Gets subscription credentials which uniquely identify Microsoft Azure subscription. The subscription ID forms part of the URI for every service call.
 *
 * @param {object} [options] - The parameter options
 *
 * @param {Array} [options.filters] - Filters to be added to the request pipeline
 *
 * @param {object} [options.requestOptions] - Options for the underlying request object
 * {@link https://github.com/request/request#requestoptions-callback Options doc}
 *
 * @param {boolean} [options.noRetryPolicy] - If set to true, turn off default retry policy
 *
 * @param {string} [options.apiVersion] - Client Api Version.
 *
 * @param {string} [options.acceptLanguage] - Gets or sets the preferred language for the response.
 *
 * @param {number} [options.longRunningOperationRetryTimeout] - Gets or sets the retry timeout in seconds for Long Running Operations. Default value is 30.
 *
 * @param {boolean} [options.generateClientRequestId] - When set to true a unique x-ms-client-request-id value is generated and included in each request. Default is true.
 *
 */
exports.createRedisCacheManagementClient = function (credentials, subscriptionId, options) {
  const AzureARMRedis = require('azure-arm-rediscache');
  return new AzureARMRedis(credentials, subscriptionId, null, options);
};

/**
 * Creates a new instance of the ARM WebsiteManagementClient.
 *
 * @param {credentials} credentials - Gets Azure subscription credentials.
 *
 * @param {string} subscriptionId - Gets subscription credentials which uniquely identify Microsoft Azure subscription. The subscription ID forms part of the URI for every service call.
 *
 * @param {object} [options] - The parameter options
 *
 * @param {Array} [options.filters] - Filters to be added to the request pipeline
 *
 * @param {object} [options.requestOptions] - Options for the underlying request object
 * {@link https://github.com/request/request#requestoptions-callback Options doc}
 *
 * @param {boolean} [options.noRetryPolicy] - If set to true, turn off default retry policy
 *
 * @param {string} [options.apiVersion] - Client Api Version.
 *
 * @param {string} [options.acceptLanguage] - Gets or sets the preferred language for the response.
 *
 * @param {number} [options.longRunningOperationRetryTimeout] - Gets or sets the retry timeout in seconds for Long Running Operations. Default value is 30.
 *
 * @param {boolean} [options.generateClientRequestId] - When set to true a unique x-ms-client-request-id value is generated and included in each request. Default is true.
 *
 */
exports.createWebsiteManagementClient = function (credentials, subscriptionId, options) {
  const AzureARMWebSite = require('azure-arm-website');
  return new AzureARMWebSite(credentials, subscriptionId, null, options);
};

/**
 * Creates a new instance of the ARM GraphRbacManagementClient class.
 *
 * @param {credentials} credentials - Gets Azure subscription credentials.
 *
 * @param {string} tenantID - Gets or sets the tenant Id.
 *
 * @param {object} [options] - The parameter options
 *
 * @param {Array} [options.filters] - Filters to be added to the request pipeline
 *
 * @param {object} [options.requestOptions] - Options for the underlying request object
 * {@link https://github.com/request/request#requestoptions-callback Options doc}
 *
 * @param {boolean} [options.noRetryPolicy] - If set to true, turn off default retry policy
 *
 * @param {string} [options.apiVersion] - Client Api Version.
 *
 * @param {string} [options.acceptLanguage] - Gets or sets the preferred language for the response.
 *
 * @param {number} [options.longRunningOperationRetryTimeout] - Gets or sets the retry timeout in seconds for Long Running Operations. Default value is 30.
 *
 * @param {boolean} [options.generateClientRequestId] - When set to true a unique x-ms-client-request-id value is generated and included in each request. Default is true.
 */
exports.createGraphManagementClient = function (credentials, tenantId, options) {
  let AzureGraph = require('azure-graph');
  return new AzureGraph(credentials, tenantId, null, options);
};

/**
 * Creates a new instance of the ARM CdnManagementClient.
 *
 * @param {credentials} credentials - Gets Azure subscription credentials.
 *
 * @param {string} subscriptionId - Gets subscription credentials which uniquely identify Microsoft Azure subscription. The subscription ID forms part of the URI for every service call.
 *
 * @param {object} [options] - The parameter options
 *
 * @param {Array} [options.filters] - Filters to be added to the request pipeline
 *
 * @param {object} [options.requestOptions] - Options for the underlying request object
 * {@link https://github.com/request/request#requestoptions-callback Options doc}
 *
 * @param {boolean} [options.noRetryPolicy] - If set to true, turn off default retry policy
 *
 * @param {string} [options.apiVersion] - Client Api Version.
 *
 * @param {string} [options.acceptLanguage] - Gets or sets the preferred language for the response.
 *
 * @param {number} [options.longRunningOperationRetryTimeout] - Gets or sets the retry timeout in seconds for Long Running Operations. Default value is 30.
 *
 * @param {boolean} [options.generateClientRequestId] - When set to true a unique x-ms-client-request-id value is generated and included in each request. Default is true.
 *
 */
exports.createCdnManagementClient = function (credentials, subscriptionId, options) {
  const AzureARMCdn = require('azure-arm-cdn');
  return new AzureARMCdn(credentials, subscriptionId, null, options);
};

/**
 * Creates a new instance of the ARM AuthorizationManagementClient.
 *
 * @param {credentials} credentials - Gets Azure subscription credentials.
 *
 * @param {string} subscriptionId - Gets subscription credentials which uniquely identify Microsoft Azure subscription. The subscription ID forms part of the URI for every service call.
 *
 * @param {object} [options] - The parameter options
 *
 * @param {Array} [options.filters] - Filters to be added to the request pipeline
 *
 * @param {object} [options.requestOptions] - Options for the underlying request object
 * {@link https://github.com/request/request#requestoptions-callback Options doc}
 *
 * @param {boolean} [options.noRetryPolicy] - If set to true, turn off default retry policy
 *
 * @param {string} [options.apiVersion] - Client Api Version.
 *
 * @param {string} [options.acceptLanguage] - Gets or sets the preferred language for the response.
 *
 * @param {number} [options.longRunningOperationRetryTimeout] - Gets or sets the retry timeout in seconds for Long Running Operations. Default value is 30.
 *
 * @param {boolean} [options.generateClientRequestId] - When set to true a unique x-ms-client-request-id value is generated and included in each request. Default is true.
 *
 */
exports.createAuthorizationManagementClient = function (credentials, subscriptionId, options) {
  const AzureARMAuthorization = require('azure-arm-authorization');
  return new AzureARMAuthorization(credentials, subscriptionId, null, options);
};

/**
 * Creates a new instance of the DnsManagementClient class.
 *
 * @param {credentials} credentials - Gets Azure subscription credentials.
 *
 * @param {string} subscriptionId - Gets subscription credentials which uniquely identify Microsoft Azure subscription. The subscription ID forms part of the URI for every service call.
 *
 * @param {object} [options] - The parameter options
 *
 * @param {Array} [options.filters] - Filters to be added to the request pipeline
 *
 * @param {object} [options.requestOptions] - Options for the underlying request object
 * {@link https://github.com/request/request#requestoptions-callback Options doc}
 *
 * @param {boolean} [options.noRetryPolicy] - If set to true, turn off default retry policy
 *
 * @param {string} [options.apiVersion] - Client Api Version.
 *
 * @param {string} [options.acceptLanguage] - Gets or sets the preferred language for the response.
 *
 * @param {number} [options.longRunningOperationRetryTimeout] - Gets or sets the retry timeout in seconds for Long Running Operations. Default value is 30.
 *
 * @param {boolean} [options.generateClientRequestId] - When set to true a unique x-ms-client-request-id value is generated and included in each request. Default is true.
 *
 */
exports.createDnsManagementClient = function (credentials, subscriptionId, options) {
  const AzureARMDns = require('azure-arm-dns');
  return new AzureARMDns(credentials, subscriptionId, null, options);
};

var AzureARMHDInsight = require('azure-arm-hdinsight');
exports.ARMHDInsightManagementClient = AzureARMHDInsight.HDInsightManagementClient;
/**
 * Creates a new HDInsightManagementClient object
 * The HDInsightManagementClient object is used to perform cluster CRUD operations on the Microsoft Azure HDInsight Service.
 *
 * @param {string} [credentials.subscriptionId]      The subscription identifier.
 * @param {string} [credentials.token]               The access token.
 * @param {string} [baseUri]                         The base uri.
 * @param {array}  [filters]                         Optional array of service filters
 * @return {HDInsightManagementClient}               A new HDInsightManagementClient object.
 */
exports.createARMHDInsightManagementClient = AzureARMHDInsight.createHDInsightManagementClient;

var AzureARMHDInsightJobs = require('azure-arm-hdinsight-jobs');
exports.ARMHDInsightJobManagementClient = AzureARMHDInsightJobs.HDInsightJobManagementClient;
/**
 * Creates a new HDInsightJobManagementClient object
 * The HDInsightJobManagementClient object is used to submit jobs on the Microsoft Azure HDInsight Service.
 *
 * @param {string} [credentials.subscriptionId]      The subscription identifier.
 * @param {string} [credentials.token]               The access token.
 * @param {string} [baseUri]                         The base uri.
 * @param {array}  [filters]                         Optional array of service filters
 * @return {HDInsightJobManagementClient}            A new HDInsightJobManagementClient object.
 */
exports.createARMHDInsightJobManagementClient = AzureARMHDInsightJobs.createHDInsightJobManagementClient;

/**
 * Initializes a new instance of the CommerceManagementClient class.
 * @constructor
 *
 * @param {credentials} credentials - Credentials needed for the client to connect to Azure.
 *
 * @param {string} subscriptionId - It uniquely identifies Microsoft Azure subscription. The subscription ID forms part of the URI for every service call.
 *
 * @param {object} [options] - The parameter options
 *
 * @param {Array} [options.filters] - Filters to be added to the request pipeline
 *
 * @param {object} [options.requestOptions] - Options for the underlying request object
 * {@link https://github.com/request/request#requestoptions-callback Options doc}
 *
 * @param {boolean} [options.noRetryPolicy] - If set to true, turn off default retry policy
 *
 * @param {string} [options.apiVersion] - Client Api Version.
 *
 * @param {string} [options.acceptLanguage] - Gets or sets the preferred language for the response.
 *
 * @param {number} [options.longRunningOperationRetryTimeout] - Gets or sets the retry timeout in seconds for Long Running Operations. Default value is 30.
 *
 * @param {boolean} [options.generateClientRequestId] - When set to true a unique x-ms-client-request-id value is generated and included in each request. Default is true.
 */
exports.createCommerceManagementClient = function (credentials, subscriptionId, options) {
  const AzureARMCommerce = require('azure-arm-commerce');
  return new AzureARMCommerce(credentials, subscriptionId, null, options);
};

/**
 * Creates a new instance of the MonitorManagementClient class.
 *
 * @param {credentials} credentials - Credentials needed for the client to connect to Azure.
 *
 * @param {string} subscriptionId - The Azure subscription Id.
 *
 * @param {object} [options] - The parameter options
 *
 * @param {Array} [options.filters] - Filters to be added to the request pipeline
 *
 * @param {object} [options.requestOptions] - Options for the underlying request object
 * {@link https://github.com/request/request#requestoptions-callback Options doc}
 *
 * @param {boolean} [options.noRetryPolicy] - If set to true, turn off default retry policy
 *
 * @param {string} [options.acceptLanguage] - Gets or sets the preferred language for the response.
 *
 * @param {number} [options.longRunningOperationRetryTimeout] - Gets or sets the retry timeout in seconds for Long Running Operations. Default value is 30.
 *
 * @param {boolean} [options.generateClientRequestId] - When set to true a unique x-ms-client-request-id value is generated and included in each request. Default is true.
 */
 exports.createMonitorManagementClient = function (credentials, subscriptionId, options) {
  const MonitorManagementClient = require('azure-arm-monitor');
  return new MonitorManagementClient(credentials, subscriptionId, null, options);
 };

/**
 * Creates a new instance of the DataLakeAnalyticsJobManagementClient class.
 *
 * @param {credentials} credentials - Gets Azure subscription credentials.
 *
 * @param {object} [options] - The parameter options
 *
 * @param {string} [options.adlaJobDnsSuffix] - Gets the DNS suffix used as the base for all Azure Data Lake Analytics Job service requests. Default value: 'azuredatalakeanalytics.net'
 *
 * @param {Array} [options.filters] - Filters to be added to the request pipeline
 *
 * @param {object} [options.requestOptions] - Options for the underlying request object
 * {@link https://github.com/request/request#requestoptions-callback Options doc}
 *
 * @param {boolean} [options.noRetryPolicy] - If set to true, turn off default retry policy
 *
 * @param {string} [options.apiVersion] - Client Api Version.
 *
 * @param {string} [options.acceptLanguage] - Gets or sets the preferred language for the response.
 *
 * @param {number} [options.longRunningOperationRetryTimeout] - Gets or sets the retry timeout in seconds for Long Running Operations. Default value is 30.
 *
 * @param {boolean} [options.generateClientRequestId] - When set to true a unique x-ms-client-request-id value is generated and included in each request. Default is true.
 *
 */
exports.createDataLakeAnalyticsJobManagementClient = function (credentials, options) {
  let AzureARMDatalakeAnalytics = require('azure-arm-datalake-analytics');
  return new AzureARMDatalakeAnalytics.DataLakeAnalyticsJobClient(credentials, options);
};

/**
 * Creates a new instance of the DataLakeAnalyticsCatalogManagementClient class.
 *
 * @param {credentials} credentials - Gets Azure subscription credentials.
 *
 * @param {object} [options] - The parameter options
 *
 * @param {string} [options.adlaCatalogDnsSuffix] - Gets the DNS suffix used as the base for all Azure Data Lake Analytics Catalog service requests. Default value: 'azuredatalakeanalytics.net'
 *
 * @param {Array} [options.filters] - Filters to be added to the request pipeline
 *
 * @param {object} [options.requestOptions] - Options for the underlying request object
 * {@link https://github.com/request/request#requestoptions-callback Options doc}
 *
 * @param {boolean} [options.noRetryPolicy] - If set to true, turn off default retry policy
 *
 * @param {string} [options.apiVersion] - Client Api Version.
 *
 * @param {string} [options.acceptLanguage] - Gets or sets the preferred language for the response.
 *
 * @param {number} [options.longRunningOperationRetryTimeout] - Gets or sets the retry timeout in seconds for Long Running Operations. Default value is 30.
 *
 * @param {boolean} [options.generateClientRequestId] - When set to true a unique x-ms-client-request-id value is generated and included in each request. Default is true.
 *
 */
exports.createDataLakeAnalyticsCatalogManagementClient = function (credentials, options) {
  let AzureARMDatalakeAnalytics = require('azure-arm-datalake-analytics');
  return new AzureARMDatalakeAnalytics.DataLakeAnalyticsCatalogClient(credentials, options);
};

/**
 * Creates a new instance of the DataLakeAnalyticsAccountManagementClient class.
 *
 * @param {credentials} credentials - Gets Azure subscription credentials.
 *
 * @param {string} subscriptionId - Gets subscription credentials which uniquely identify Microsoft Azure subscription. The subscription ID forms part of the URI for every service call.
 *
 * @param {object} [options] - The parameter options
 *
 * @param {Array} [options.filters] - Filters to be added to the request pipeline
 *
 * @param {object} [options.requestOptions] - Options for the underlying request object
 * {@link https://github.com/request/request#requestoptions-callback Options doc}
 *
 * @param {boolean} [options.noRetryPolicy] - If set to true, turn off default retry policy
 *
 * @param {string} [options.apiVersion] - Client Api Version.
 *
 * @param {string} [options.acceptLanguage] - Gets or sets the preferred language for the response.
 *
 * @param {number} [options.longRunningOperationRetryTimeout] - Gets or sets the retry timeout in seconds for Long Running Operations. Default value is 30.
 *
 * @param {boolean} [options.generateClientRequestId] - When set to true a unique x-ms-client-request-id value is generated and included in each request. Default is true.
 *
 */
exports.createDataLakeAnalyticsAccountManagementClient = function (credentials, subscriptionId, options) {
  let AzureARMDatalakeAnalytics = require('azure-arm-datalake-analytics');
  return new AzureARMDatalakeAnalytics.DataLakeAnalyticsAccountClient(credentials, subscriptionId, options);
};

/**
 * Creates a new instance of the DataLakeStoreAccountManagementClient class.
 *
 * @param {credentials} credentials - Gets Azure subscription credentials.
 *
 * @param {string} subscriptionId - Gets subscription credentials which uniquely identify Microsoft Azure subscription. The subscription ID forms part of the URI for every service call.
 *
 * @param {object} [options] - The parameter options
 *
 * @param {Array} [options.filters] - Filters to be added to the request pipeline
 *
 * @param {object} [options.requestOptions] - Options for the underlying request object
 * {@link https://github.com/request/request#requestoptions-callback Options doc}
 *
 * @param {boolean} [options.noRetryPolicy] - If set to true, turn off default retry policy
 *
 * @param {string} [options.apiVersion] - Client Api Version.
 *
 * @param {string} [options.acceptLanguage] - Gets or sets the preferred language for the response.
 *
 * @param {number} [options.longRunningOperationRetryTimeout] - Gets or sets the retry timeout in seconds for Long Running Operations. Default value is 30.
 *
 * @param {boolean} [options.generateClientRequestId] - When set to true a unique x-ms-client-request-id value is generated and included in each request. Default is true.
 *
 */
exports.createDataLakeStoreAccountManagementClient = function (credentials, subscriptionId, options) {
  let AzureARMDatalakeStore = require('azure-arm-datalake-store');
  return new AzureARMDatalakeStore.DataLakeStoreAccountClient(credentials, subscriptionId, options);
};

/**
 * Creates a new instance of the DataLakeStoreFileSystemManagementClient class.
 *
 * @param {credentials} credentials - Gets Azure subscription credentials.
 *
 * @param {object} [options] - The parameter options
 *
 * @param {string} [options.adlsFileSystemDnsSuffix] - Gets the URI used as the base for all cloud service requests. Default value: 'azuredatalakestore.net'
 *
 * @param {Array} [options.filters] - Filters to be added to the request pipeline
 *
 * @param {object} [options.requestOptions] - Options for the underlying request object
 * {@link https://github.com/request/request#requestoptions-callback Options doc}
 *
 * @param {boolean} [options.noRetryPolicy] - If set to true, turn off default retry policy
 *
 * @param {string} [options.apiVersion] - Client Api Version.
 *
 * @param {string} [options.acceptLanguage] - Gets or sets the preferred language for the response.
 *
 * @param {number} [options.longRunningOperationRetryTimeout] - Gets or sets the retry timeout in seconds for Long Running Operations. Default value is 30.
 *
 * @param {boolean} [options.generateClientRequestId] - When set to true a unique x-ms-client-request-id value is generated and included in each request. Default is true.
 *
 */
exports.createDataLakeStoreFileSystemManagementClient = function (credentials, options) {
  let AzureARMDatalakeStore = require('azure-arm-datalake-store');
  return new AzureARMDatalakeStore.DataLakeStoreFileSystemClient(credentials, options);
};

/**
 * Creates a new instance of the ARM BatchManagementClient.
 *
 * @param {credentials} credentials - Gets Azure subscription credentials.
 *
 * @param {string} subscriptionId - Gets subscription credentials which uniquely identify Microsoft Azure subscription. The subscription ID forms part of the URI for every service call.
 *
 * @param {object} [options] - The parameter options
 *
 * @param {Array} [options.filters] - Filters to be added to the request pipeline
 *
 * @param {object} [options.requestOptions] - Options for the underlying request object
 * {@link https://github.com/request/request#requestoptions-callback Options doc}
 *
 * @param {boolean} [options.noRetryPolicy] - If set to true, turn off default retry policy
 *
 * @param {string} [options.apiVersion] - Client Api Version.
 *
 * @param {string} [options.acceptLanguage] - Gets or sets the preferred language for the response.
 *
 * @param {number} [options.longRunningOperationRetryTimeout] - Gets or sets the retry timeout in seconds for Long Running Operations. Default value is 30.
 *
 * @param {boolean} [options.generateClientRequestId] - When set to true a unique x-ms-client-request-id value is generated and included in each request. Default is true.
 *
 */
exports.createBatchManagementClient = function (credentials, subscriptionId, options) {
  const AzureBatch = require('azure-arm-batch');
  return new AzureBatch(credentials, subscriptionId, null, options);
};

/**
 * Creates a new instance of the BatchServiceClient.
 *
 * @param {credentials} credentials - Gets Azure subscription credentials.
 *
 * @param {string} [baseUri] - The base URI of the service.
 *
 * @param {object} [options] - The parameter options
 *
 * @param {Array} [options.filters] - Filters to be added to the request pipeline
 *
 * @param {object} [options.requestOptions] - Options for the underlying request object
 * {@link https://github.com/request/request#requestoptions-callback Options doc}
 *
 * @param {boolean} [options.noRetryPolicy] - If set to true, turn off default retry policy
 *
 * @param {string} [options.apiVersion] - Client Api Version.
 *
 * @param {string} [options.acceptLanguage] - Gets or sets the preferred language for the response.
 *
 * @param {number} [options.longRunningOperationRetryTimeout] - Gets or sets the retry timeout in seconds for Long Running Operations. Default value is 30.
 *
 * @param {boolean} [options.generateClientRequestId] - When set to true a unique x-ms-client-request-id value is generated and included in each request. Default is true.
 *
 */
exports.createBatchServiceClient = function (credentials, baseUri, options) {
  let AzureBatchService = require('azure-batch');
  return new AzureBatchService.ServiceClient(credentials, baseUri, options);
};

/**
 * Creates a new instance of the ServerManagementClient.
 *
 * @param {credentials} credentials - Gets Azure subscription credentials.
 *
 * @param {string} subscriptionId - Gets subscription credentials which uniquely identify Microsoft Azure subscription. The subscription ID forms part of the URI for every service call.
 *
 * @param {object} [options] - The parameter options
 *
 * @param {Array} [options.filters] - Filters to be added to the request pipeline
 *
 * @param {object} [options.requestOptions] - Options for the underlying request object
 * {@link https://github.com/request/request#requestoptions-callback Options doc}
 *
 * @param {boolean} [options.noRetryPolicy] - If set to true, turn off default retry policy
 *
 * @param {string} [options.apiVersion] - Client Api Version.
 *
 * @param {string} [options.acceptLanguage] - Gets or sets the preferred language for the response.
 *
 * @param {number} [options.longRunningOperationRetryTimeout] - Gets or sets the retry timeout in seconds for Long Running Operations. Default value is 30.
 *
 * @param {boolean} [options.generateClientRequestId] - When set to true a unique x-ms-client-request-id value is generated and included in each request. Default is true.
 *
 */
exports.createServerManagementClient = function (credentials, subscriptionId, options) {
  const AzureServerManagement = require('azure-arm-servermanagement');
  return new AzureServerManagement(credentials, subscriptionId, null, options);
};

/**
 * Creates a new instance of the PowerBIEmbeddedManagementClient.
 *
 * @param {credentials} credentials - Gets Azure subscription credentials.
 *
 * @param {string} subscriptionId - Gets subscription credentials which uniquely identify Microsoft Azure subscription. The subscription ID forms part of the URI for every service call.
 *
 * @param {object} [options] - The parameter options
 *
 * @param {Array} [options.filters] - Filters to be added to the request pipeline
 *
 * @param {object} [options.requestOptions] - Options for the underlying request object
 * {@link https://github.com/request/request#requestoptions-callback Options doc}
 *
 * @param {boolean} [options.noRetryPolicy] - If set to true, turn off default retry policy
 *
 * @param {string} [options.apiVersion] - Client Api Version.
 *
 * @param {string} [options.acceptLanguage] - Gets or sets the preferred language for the response.
 *
 * @param {number} [options.longRunningOperationRetryTimeout] - Gets or sets the retry timeout in seconds for Long Running Operations. Default value is 30.
 *
 * @param {boolean} [options.generateClientRequestId] - When set to true a unique x-ms-client-request-id value is generated and included in each request. Default is true.
 *
 */
exports.createPowerBIEmbeddedManagementClient = function (credentials, subscriptionId, options) {
  const AzurePowerBIEmbeddedManagementClient = require('azure-arm-powerbiembedded');
  return new AzurePowerBIEmbeddedManagementClient(credentials, subscriptionId, null, options);
};

/**
 * Creates a new instance of the NotificationHubsManagementClient.
 *
 * @param {credentials} credentials - Gets Azure subscription credentials.
 *
 * @param {string} subscriptionId - Gets subscription credentials which uniquely identify Microsoft Azure subscription. The subscription ID forms part of the URI for every service call.
 *
 * @param {object} [options] - The parameter options
 *
 * @param {Array} [options.filters] - Filters to be added to the request pipeline
 *
 * @param {object} [options.requestOptions] - Options for the underlying request object
 * {@link https://github.com/request/request#requestoptions-callback Options doc}
 *
 * @param {boolean} [options.noRetryPolicy] - If set to true, turn off default retry policy
 *
 * @param {string} [options.apiVersion] - Client Api Version.
 *
 * @param {string} [options.acceptLanguage] - Gets or sets the preferred language for the response.
 *
 * @param {number} [options.longRunningOperationRetryTimeout] - Gets or sets the retry timeout in seconds for Long Running Operations. Default value is 30.
 *
 * @param {boolean} [options.generateClientRequestId] - When set to true a unique x-ms-client-request-id value is generated and included in each request. Default is true.
 *
 */
exports.createNotificationHubsManagementClient = function (credentials, subscriptionId, options) {
  const AzureNotificationHubsManagementClient = require('azure-arm-notificationhubs');
  return new AzureNotificationHubsManagementClient(credentials, subscriptionId, null, options);
};

/**
 * Creates a new instance of the IotHubManagementClient.
 *
 * @param {credentials} credentials - Gets Azure subscription credentials.
 *
 * @param {string} subscriptionId - Gets subscription credentials which uniquely identify Microsoft Azure subscription. The subscription ID forms part of the URI for every service call.
 *
 * @param {object} [options] - The parameter options
 *
 * @param {Array} [options.filters] - Filters to be added to the request pipeline
 *
 * @param {object} [options.requestOptions] - Options for the underlying request object
 * {@link https://github.com/request/request#requestoptions-callback Options doc}
 *
 * @param {boolean} [options.noRetryPolicy] - If set to true, turn off default retry policy
 *
 * @param {string} [options.apiVersion] - Client Api Version.
 *
 * @param {string} [options.acceptLanguage] - Gets or sets the preferred language for the response.
 *
 * @param {number} [options.longRunningOperationRetryTimeout] - Gets or sets the retry timeout in seconds for Long Running Operations. Default value is 30.
 *
 * @param {boolean} [options.generateClientRequestId] - When set to true a unique x-ms-client-request-id value is generated and included in each request. Default is true.
 *
 */
exports.createIotHubManagementClient = function (credentials, subscriptionId, options) {
  const AzureIotHubManagementClient = require('azure-arm-iothub');
  return new AzureIotHubManagementClient(credentials, subscriptionId, null, options);
};

/**
 * Creates a new instance of the IotHubManagementClient.
 *
 * @param {credentials} credentials - Gets Azure subscription credentials.
 *
 * @param {string} subscriptionId - Gets subscription credentials which uniquely identify Microsoft Azure subscription. The subscription ID forms part of the URI for every service call.
 *
 * @param {object} [options] - The parameter options
 *
 * @param {Array} [options.filters] - Filters to be added to the request pipeline
 *
 * @param {object} [options.requestOptions] - Options for the underlying request object
 * {@link https://github.com/request/request#requestoptions-callback Options doc}
 *
 * @param {boolean} [options.noRetryPolicy] - If set to true, turn off default retry policy
 *
 * @param {string} [options.apiVersion] - Client Api Version.
 *
 * @param {string} [options.acceptLanguage] - Gets or sets the preferred language for the response.
 *
 * @param {number} [options.longRunningOperationRetryTimeout] - Gets or sets the retry timeout in seconds for Long Running Operations. Default value is 30.
 *
 * @param {boolean} [options.generateClientRequestId] - When set to true a unique x-ms-client-request-id value is generated and included in each request. Default is true.
 *
 */
exports.createDevTestLabsClient = function (credentials, subscriptionId, options) {
  const AzureDevTestLabsClient = require('azure-arm-devtestlabs');
  return new AzureDevTestLabsClient(credentials, subscriptionId, null, options);
};

/**
 * Creates a new instance of the TrafficManagerManagementClient.
 *
 * @param {credentials} credentials - Gets Azure subscription credentials.
 *
 * @param {string} subscriptionId - Gets subscription credentials which uniquely identify Microsoft Azure subscription. The subscription ID forms part of the URI for every service call.
 *
 * @param {object} [options] - The parameter options
 *
 * @param {Array} [options.filters] - Filters to be added to the request pipeline
 *
 * @param {object} [options.requestOptions] - Options for the underlying request object
 * {@link https://github.com/request/request#requestoptions-callback Options doc}
 *
 * @param {boolean} [options.noRetryPolicy] - If set to true, turn off default retry policy
 *
 * @param {string} [options.apiVersion] - Client Api Version.
 *
 * @param {string} [options.acceptLanguage] - Gets or sets the preferred language for the response.
 *
 * @param {number} [options.longRunningOperationRetryTimeout] - Gets or sets the retry timeout in seconds for Long Running Operations. Default value is 30.
 *
 * @param {boolean} [options.generateClientRequestId] - When set to true a unique x-ms-client-request-id value is generated and included in each request. Default is true.
 *
 */
exports.createTrafficManagerManagementClient = function (credentials, subscriptionId, options) {
  const AzureTrafficManagerManagementClient = require('azure-arm-trafficmanager');
  return new AzureTrafficManagerManagementClient(credentials, subscriptionId, null, options);
};

/**
 * Creates a new instance of the AnalysisServicesManagementClient.
 *
 * @param {credentials} credentials - Credentials needed for the client to connect to Azure.
 *
 * @param {string} subscriptionId - A unique identifier of a Microsoft Azure subscription. The subscription id forms part of the URI for every service call.
 *
 * @param {object} [options] - The parameter options
 *
 * @param {Array} [options.filters] - Filters to be added to the request pipeline
 *
 * @param {object} [options.requestOptions] - Options for the underlying request object
 * {@link https://github.com/request/request#requestoptions-callback Options doc}
 *
 * @param {boolean} [options.noRetryPolicy] - If set to true, turn off default retry policy
 *
 * @param {string} [options.apiVersion] - Client API Version.
 *
 * @param {string} [options.acceptLanguage] - Gets or sets the preferred language for the response.
 *
 * @param {number} [options.longRunningOperationRetryTimeout] - Gets or sets the retry timeout in seconds for Long Running Operations. Default value is 30.
 *
 * @param {boolean} [options.generateClientRequestId] - When set to true a unique x-ms-client-request-id value is generated and included in each request. Default is true.
 *
 */
exports.createAnalysisServicesManagementClient = function (credentials, subscriptionId, options) {
  const AnalysisServicesManagementClient = require('azure-arm-analysisservices');
  return new AnalysisServicesManagementClient(credentials, subscriptionId, null, options);
};

/**
 * Creates a new instance of the AdvisorManagementClient.
 *
 * @param {credentials} credentials - Credentials needed for the client to connect to Azure.
 *
 * @param {string} subscriptionId - The Azure subscription ID.
 *
 * @param {object} [options] - The parameter options
 *
 * @param {Array} [options.filters] - Filters to be added to the request pipeline
 *
 * @param {object} [options.requestOptions] - Options for the underlying request object
 * {@link https://github.com/request/request#requestoptions-callback Options doc}
 *
 * @param {boolean} [options.noRetryPolicy] - If set to true, turn off default retry policy
 *
 * @param {string} [options.apiVersion] - The version of the API to be used with the client request.
 *
 * @param {string} [options.acceptLanguage] - Gets or sets the preferred language for the response.
 *
 * @param {number} [options.longRunningOperationRetryTimeout] - Gets or sets the retry timeout in seconds for Long Running Operations. Default value is 30.
 *
 * @param {boolean} [options.generateClientRequestId] - When set to true a unique x-ms-client-request-id value is generated and included in each request. Default is true.
 *
 */
exports.createAdvisorManagementClient = function (credentials, subscriptionId, options) {
  const AdvisorManagementClient = require('azure-arm-advisor');
  return new AdvisorManagementClient(credentials, subscriptionId, null, options);
};

/**
 * Initializes a new instance of the AutomationManagementClient.
 *
 * @param {credentials} credentials - Credentials needed for the client to connect to Azure.
 *
 * @param {string} subscriptionId - Gets subscription credentials which uniquely identify Microsoft Azure subscription. The subscription ID forms part of the URI for every service call.
 *
 * @param {object} [options] - The parameter options
 *
 * @param {Array} [options.filters] - Filters to be added to the request pipeline
 *
 * @param {object} [options.requestOptions] - Options for the underlying request object
 * {@link https://github.com/request/request#requestoptions-callback Options doc}
 *
 * @param {boolean} [options.noRetryPolicy] - If set to true, turn off default retry policy
 *
 * @param {string} [options.acceptLanguage] - Gets or sets the preferred language for the response.
 *
 * @param {number} [options.longRunningOperationRetryTimeout] - Gets or sets the retry timeout in seconds for Long Running Operations. Default value is 30.
 *
 * @param {boolean} [options.generateClientRequestId] - When set to true a unique x-ms-client-request-id value is generated and included in each request. Default is true.
 *
 */
exports.createAutomationManagementClient = function (credentials, subscriptionId, options) {
  const AutomationManagementClient = require('azure-arm-automation');
  return new AutomationManagementClient(credentials, subscriptionId, null, options);
};

/**
 * Initializes a new instance of the BillingManagementClient.
 *
 * @param {credentials} credentials - Credentials needed for the client to connect to Azure.
 *
 * @param {string} subscriptionId - Azure Subscription ID.
 *
 * @param {object} [options] - The parameter options
 *
 * @param {Array} [options.filters] - Filters to be added to the request pipeline
 *
 * @param {object} [options.requestOptions] - Options for the underlying request object
 * {@link https://github.com/request/request#requestoptions-callback Options doc}
 *
 * @param {boolean} [options.noRetryPolicy] - If set to true, turn off default retry policy
 *
 * @param {string} [options.apiVersion] - Version of the API to be used with the client request. The current version is 2017-02-27-preview.
 *
 * @param {string} [options.acceptLanguage] - Gets or sets the preferred language for the response.
 *
 * @param {number} [options.longRunningOperationRetryTimeout] - Gets or sets the retry timeout in seconds for Long Running Operations. Default value is 30.
 *
 * @param {boolean} [options.generateClientRequestId] - When set to true a unique x-ms-client-request-id value is generated and included in each request. Default is true.
 *
 */
exports.createBillingManagementClient = function (credentials, subscriptionId, options) {
  const BillingManagementClient = require('azure-arm-billing');
  return new BillingManagementClient(credentials, subscriptionId, null, options);
};

/**
 * Initializes a new instance of the CognitiveServicesManagementClient class.
 *
 * @param {credentials} credentials - Credentials needed for the client to connect to Azure.
 *
 * @param {string} subscriptionId - Azure Subscription ID.
 *
 * @param {object} [options] - The parameter options
 *
 * @param {Array} [options.filters] - Filters to be added to the request pipeline
 *
 * @param {object} [options.requestOptions] - Options for the underlying request object
 * {@link https://github.com/request/request#requestoptions-callback Options doc}
 *
 * @param {boolean} [options.noRetryPolicy] - If set to true, turn off default retry policy
 *
 * @param {string} [options.apiVersion] - Version of the API to be used with the client request. Current version is 2016-02-01-preview
 *
 * @param {string} [options.acceptLanguage] - Gets or sets the preferred language for the response.
 *
 * @param {number} [options.longRunningOperationRetryTimeout] - Gets or sets the retry timeout in seconds for Long Running Operations. Default value is 30.
 *
 * @param {boolean} [options.generateClientRequestId] - When set to true a unique x-ms-client-request-id value is generated and included in each request. Default is true.
 *
 */
exports.createCognitiveServicesManagementClient = function (credentials, subscriptionId, options) {
  const CognitiveServicesManagementClient = require('azure-arm-cognitiveservices');
  return new CognitiveServicesManagementClient(credentials, subscriptionId, null, options);
};

/**
 * Initializes a new instance of the ContainerRegistryManagementClient class.
 *
 * @param {credentials} credentials - Credentials needed for the client to connect to Azure.
 *
 * @param {string} subscriptionId - The Microsoft Azure subscription ID.
 *
 * @param {object} [options] - The parameter options
 *
 * @param {Array} [options.filters] - Filters to be added to the request pipeline
 *
 * @param {object} [options.requestOptions] - Options for the underlying request object
 * {@link https://github.com/request/request#requestoptions-callback Options doc}
 *
 * @param {boolean} [options.noRetryPolicy] - If set to true, turn off default retry policy
 *
 * @param {string} [options.apiVersion] - The client API version.
 *
 * @param {string} [options.acceptLanguage] - Gets or sets the preferred language for the response.
 *
 * @param {number} [options.longRunningOperationRetryTimeout] - Gets or sets the retry timeout in seconds for Long Running Operations. Default value is 30.
 *
 * @param {boolean} [options.generateClientRequestId] - When set to true a unique x-ms-client-request-id value is generated and included in each request. Default is true.
 *
 */
exports.createContainerRegistryManagementClient = function (credentials, subscriptionId, options) {
  const ContainerRegistryManagementClient = require('azure-arm-containerregistry');
  return new ContainerRegistryManagementClient(credentials, subscriptionId, null, options);
};

/**
 * Initializes a new instance of the ContainerInstanceManagementClient class.
 *
 * @param {credentials} credentials - Credentials needed for the client to connect to Azure.
 *
 * @param {string} subscriptionId - The Microsoft Azure subscription ID.
 *
 * @param {object} [options] - The parameter options
 *
 * @param {Array} [options.filters] - Filters to be added to the request pipeline
 *
 * @param {object} [options.requestOptions] - Options for the underlying request object
 * {@link https://github.com/request/request#requestoptions-callback Options doc}
 *
 * @param {boolean} [options.noRetryPolicy] - If set to true, turn off default retry policy
 *
 * @param {string} [options.apiVersion] - The client API version.
 *
 * @param {string} [options.acceptLanguage] - Gets or sets the preferred language for the response.
 *
 * @param {number} [options.longRunningOperationRetryTimeout] - Gets or sets the retry timeout in seconds for Long Running Operations. Default value is 30.
 *
 * @param {boolean} [options.generateClientRequestId] - When set to true a unique x-ms-client-request-id value is generated and included in each request. Default is true.
 *
 */
exports.createContainerInstanceManagementClient = function (credentials, subscriptionId, options) {
  const ContainerInstanceManagementClient = require('azure-arm-containerinstance');
  return new ContainerInstanceManagementClient(credentials, subscriptionId, null, options);
};

/**
 * Initializes a new instance of the ContainerServiceManagementClient class.
 *
 * @param {credentials} credentials - Credentials needed for the client to connect to Azure.
 *
 * @param {string} subscriptionId - The Microsoft Azure subscription ID.
 *
 * @param {object} [options] - The parameter options
 *
 * @param {Array} [options.filters] - Filters to be added to the request pipeline
 *
 * @param {object} [options.requestOptions] - Options for the underlying request object
 * {@link https://github.com/request/request#requestoptions-callback Options doc}
 *
 * @param {boolean} [options.noRetryPolicy] - If set to true, turn off default retry policy
 *
 * @param {string} [options.apiVersion] - The client API version.
 *
 * @param {string} [options.acceptLanguage] - Gets or sets the preferred language for the response.
 *
 * @param {number} [options.longRunningOperationRetryTimeout] - Gets or sets the retry timeout in seconds for Long Running Operations. Default value is 30.
 *
 * @param {boolean} [options.generateClientRequestId] - When set to true a unique x-ms-client-request-id value is generated and included in each request. Default is true.
 *
 */
exports.createContainerServiceManagementClient = function (credentials, subscriptionId, options) {
  const ContainerServiceManagementClient = require('azure-arm-containerservice');
  return new ContainerServiceManagementClient(credentials, subscriptionId, null, options);
};

/**
 * Initializes a new instance of the CustomerInsightsManagementClient class.
 *
 * @param {credentials} credentials - Credentials needed for the client to connect to Azure.
 *
 * @param {string} subscriptionId - Gets subscription credentials which uniquely identify Microsoft Azure subscription. The subscription ID forms part of the URI for every service call.
 *
 * @param {object} [options] - The parameter options
 *
 * @param {Array} [options.filters] - Filters to be added to the request pipeline
 *
 * @param {object} [options.requestOptions] - Options for the underlying request object
 * {@link https://github.com/request/request#requestoptions-callback Options doc}
 *
 * @param {boolean} [options.noRetryPolicy] - If set to true, turn off default retry policy
 *
 * @param {string} [options.apiVersion] - Client Api Version.
 *
 * @param {string} [options.acceptLanguage] - Gets or sets the preferred language for the response.
 *
 * @param {number} [options.longRunningOperationRetryTimeout] - Gets or sets the retry timeout in seconds for Long Running Operations. Default value is 30.
 *
 * @param {boolean} [options.generateClientRequestId] - When set to true a unique x-ms-client-request-id value is generated and included in each request. Default is true.
 *
 */
exports.createCustomerInsightsManagementClient = function (credentials, subscriptionId, options) {
  const CustomerInsightsManagementClient = require('azure-arm-customerinsights');
  return new CustomerInsightsManagementClient(credentials, subscriptionId, null, options);
};

/**
 * Initializes a new instance of the DocumentdbManagementClient class.
 *
 * @param {credentials} credentials - Credentials needed for the client to connect to Azure.
 *
 * @param {string} subscriptionId - Azure subscription ID.
 *
 * @param {object} [options] - The parameter options
 *
 * @param {Array} [options.filters] - Filters to be added to the request pipeline
 *
 * @param {object} [options.requestOptions] - Options for the underlying request object
 * {@link https://github.com/request/request#requestoptions-callback Options doc}
 *
 * @param {boolean} [options.noRetryPolicy] - If set to true, turn off default retry policy
 *
 * @param {string} [options.apiVersion] - Version of the API to be used with the client request. The current version is 2015-04-08.
 *
 * @param {string} [options.acceptLanguage] - Gets or sets the preferred language for the response.
 *
 * @param {number} [options.longRunningOperationRetryTimeout] - Gets or sets the retry timeout in seconds for Long Running Operations. Default value is 30.
 *
 * @param {boolean} [options.generateClientRequestId] - When set to true a unique x-ms-client-request-id value is generated and included in each request. Default is true.
 *
 */
exports.createDocumentdbManagementClient = function (credentials, subscriptionId, options) {
  const DocumentdbManagementClient = require('azure-arm-documentdb');
  return new DocumentdbManagementClient(credentials, subscriptionId, null, options);
};

/**
 * Initializes a new instance of the EventHubManagementClient class.
 *
 * @param {credentials} credentials - Credentials needed for the client to connect to Azure.
 *
 * @param {string} subscriptionId - Subscription credentials that uniquely identify a Microsoft Azure subscription. The subscription ID forms part of the URI for every service call.
 *
 * @param {object} [options] - The parameter options
 *
 * @param {Array} [options.filters] - Filters to be added to the request pipeline
 *
 * @param {object} [options.requestOptions] - Options for the underlying request object
 * {@link https://github.com/request/request#requestoptions-callback Options doc}
 *
 * @param {boolean} [options.noRetryPolicy] - If set to true, turn off default retry policy
 *
 * @param {string} [options.apiVersion] - Client API Version.
 *
 * @param {string} [options.acceptLanguage] - Gets or sets the preferred language for the response.
 *
 * @param {number} [options.longRunningOperationRetryTimeout] - Gets or sets the retry timeout in seconds for Long Running Operations. Default value is 30.
 *
 * @param {boolean} [options.generateClientRequestId] - When set to true a unique x-ms-client-request-id value is generated and included in each request. Default is true.
 *
 */
exports.createEventHubManagementClient = function (credentials, subscriptionId, options) {
  const EventHubManagementClient = require('azure-arm-eventhub');
  return new EventHubManagementClient(credentials, subscriptionId, null, options);
};

/**
 * Initializes a new instance of the LogicManagementClient.
 *
 * @param {credentials} credentials - Credentials needed for the client to connect to Azure.
 *
 * @param {string} subscriptionId - The subscription id.
 *
 * @param {object} [options] - The parameter options
 *
 * @param {Array} [options.filters] - Filters to be added to the request pipeline
 *
 * @param {object} [options.requestOptions] - Options for the underlying request object
 * {@link https://github.com/request/request#requestoptions-callback Options doc}
 *
 * @param {boolean} [options.noRetryPolicy] - If set to true, turn off default retry policy
 *
 * @param {string} [options.apiVersion] - The API version.
 *
 * @param {string} [options.acceptLanguage] - Gets or sets the preferred language for the response.
 *
 * @param {number} [options.longRunningOperationRetryTimeout] - Gets or sets the retry timeout in seconds for Long Running Operations. Default value is 30.
 *
 * @param {boolean} [options.generateClientRequestId] - When set to true a unique x-ms-client-request-id value is generated and included in each request. Default is true.
 *
 */
exports.createLogicManagementClient = function (credentials, subscriptionId, options) {
  const LogicManagementClient = require('azure-arm-logic');
  return new LogicManagementClient(credentials, subscriptionId, null, options);
};

/**
 * Initializes a new instance of the MachineLearningWebServicesManagementClient class.
 *
 * @param {credentials} credentials - Credentials needed for the client to connect to Azure.
 *
 * @param {string} subscriptionId - The Azure subscription ID.
 *
 * @param {object} [options] - The parameter options
 *
 * @param {Array} [options.filters] - Filters to be added to the request pipeline
 *
 * @param {object} [options.requestOptions] - Options for the underlying request object
 * {@link https://github.com/request/request#requestoptions-callback Options doc}
 *
 * @param {boolean} [options.noRetryPolicy] - If set to true, turn off default retry policy
 *
 * @param {string} [options.apiVersion] - The version of the Microsoft.MachineLearning resource provider API to use.
 *
 * @param {string} [options.acceptLanguage] - Gets or sets the preferred language for the response.
 *
 * @param {number} [options.longRunningOperationRetryTimeout] - Gets or sets the retry timeout in seconds for Long Running Operations. Default value is 30.
 *
 * @param {boolean} [options.generateClientRequestId] - When set to true a unique x-ms-client-request-id value is generated and included in each request. Default is true.
 *
 */
exports.createMachineLearningWebServicesManagementClient = function (credentials, subscriptionId, options) {
  let MachineLearningWebServicesManagementClient = require('azure-arm-machinelearning').WebServicesManagementClient;
  return new MachineLearningWebServicesManagementClient(credentials, subscriptionId, null, options);
};

/**
 * Initializes a new instance of the MachineLearningCommitmentPlansManagementClient class.
 *
 * @param {credentials} credentials - Credentials needed for the client to connect to Azure.
 *
 * @param {string} subscriptionId - Azure Subscription ID.
 *
 * @param {object} [options] - The parameter options
 *
 * @param {Array} [options.filters] - Filters to be added to the request pipeline
 *
 * @param {object} [options.requestOptions] - Options for the underlying request object
 * {@link https://github.com/request/request#requestoptions-callback Options doc}
 *
 * @param {boolean} [options.noRetryPolicy] - If set to true, turn off default retry policy
 *
 * @param {string} [options.apiVersion] - The version of the Microsoft.MachineLearning resource provider API to use.
 *
 * @param {string} [options.acceptLanguage] - Gets or sets the preferred language for the response.
 *
 * @param {number} [options.longRunningOperationRetryTimeout] - Gets or sets the retry timeout in seconds for Long Running Operations. Default value is 30.
 *
 * @param {boolean} [options.generateClientRequestId] - When set to true a unique x-ms-client-request-id value is generated and included in each request. Default is true.
 *
 */
exports.createMachineLearningCommitmentPlansManagementClient = function (credentials, subscriptionId, options) {
  let MachineLearningCommitmentPlansManagementClient = require('azure-arm-machinelearning').CommitmentPlansManagementClient;
  return new MachineLearningCommitmentPlansManagementClient(credentials, subscriptionId, null, options);
};

/**
 * Initializes a new instance of the MediaServicesManagementClient class.
 *
 * @param {credentials} credentials - Credentials needed for the client to connect to Azure.
 *
 * @param {string} subscriptionId - The unique identifier for a Microsoft Azure subscription.
 *
 * @param {object} [options] - The parameter options
 *
 * @param {Array} [options.filters] - Filters to be added to the request pipeline
 *
 * @param {object} [options.requestOptions] - Options for the underlying request object
 * {@link https://github.com/request/request#requestoptions-callback Options doc}
 *
 * @param {boolean} [options.noRetryPolicy] - If set to true, turn off default retry policy
 *
 * @param {string} [options.apiVersion] - Version of the API to be used with the client request. Current version is 2015-10-01
 *
 * @param {string} [options.acceptLanguage] - Gets or sets the preferred language for the response.
 *
 * @param {number} [options.longRunningOperationRetryTimeout] - Gets or sets the retry timeout in seconds for Long Running Operations. Default value is 30.
 *
 * @param {boolean} [options.generateClientRequestId] - When set to true a unique x-ms-client-request-id value is generated and included in each request. Default is true.
 *
 */
exports.createMediaServicesManagementClient = function (credentials, subscriptionId, options) {
  const MediaServicesManagementClient = require('azure-arm-mediaservices');
  return new MediaServicesManagementClient(credentials, subscriptionId, null, options);
};

/**
 * Initializes a new instance of the MySQLManagementClient class.
 *
 * @param {credentials} credentials - Credentials needed for the client to connect to Azure.
 *
 * @param {string} subscriptionId - The subscription ID that identifies an Azure subscription.
 *
 * @param {string} [baseUri] - The base URI of the service.
 *
 * @param {object} [options] - The parameter options
 *
 * @param {Array} [options.filters] - Filters to be added to the request pipeline
 *
 * @param {object} [options.requestOptions] - Options for the underlying request object
 * {@link https://github.com/request/request#requestoptions-callback Options doc}
 *
 * @param {boolean} [options.noRetryPolicy] - If set to true, turn off default retry policy
 *
 * @param {string} [options.apiVersion] - The API version to use for the request.
 *
 * @param {string} [options.acceptLanguage] - Gets or sets the preferred language for the response.
 *
 * @param {number} [options.longRunningOperationRetryTimeout] - Gets or sets the retry timeout in seconds for Long Running Operations. Default value is 30.
 *
 * @param {boolean} [options.generateClientRequestId] - When set to true a unique x-ms-client-request-id value is generated and included in each request. Default is true.
 *
 */
exports.createMySQLManagementClient = function (credentials, subscriptionId, baseUri, options) {
  const MySQLManagementClient = require('azure-arm-mysql');
  return new MySQLManagementClient(credentials, subscriptionId, baseUri, options);
};

/**
 * Initializes a new instance of the PostgreSQLManagementClient class.
 *
 * @param {credentials} credentials - Credentials needed for the client to connect to Azure.
 *
 * @param {string} subscriptionId - The subscription ID that identifies an Azure subscription.
 *
 * @param {string} [baseUri] - The base URI of the service.
 *
 * @param {object} [options] - The parameter options
 *
 * @param {Array} [options.filters] - Filters to be added to the request pipeline
 *
 * @param {object} [options.requestOptions] - Options for the underlying request object
 * {@link https://github.com/request/request#requestoptions-callback Options doc}
 *
 * @param {boolean} [options.noRetryPolicy] - If set to true, turn off default retry policy
 *
 * @param {string} [options.apiVersion] - The API version to use for the request.
 *
 * @param {string} [options.acceptLanguage] - Gets or sets the preferred language for the response.
 *
 * @param {number} [options.longRunningOperationRetryTimeout] - Gets or sets the retry timeout in seconds for Long Running Operations. Default value is 30.
 *
 * @param {boolean} [options.generateClientRequestId] - When set to true a unique x-ms-client-request-id value is generated and included in each request. Default is true.
 *
 */
exports.createPostgreSQLManagementClient = function (credentials, subscriptionId, baseUri, options) {
  const PostgreSQLManagementClient = require('azure-arm-postgresql');
  return new PostgreSQLManagementClient(credentials, subscriptionId, baseUri, options);
};

/**
 * Initializes a new instance of the RecoveryServicesBackupClient.
 *
 * @param {credentials} credentials - Credentials needed for the client to connect to Azure.
 *
 * @param {string} subscriptionId - The subscription ID.
 *
 * @param {object} [options] - The parameter options
 *
 * @param {Array} [options.filters] - Filters to be added to the request pipeline
 *
 * @param {object} [options.requestOptions] - Options for the underlying request object
 * {@link https://github.com/request/request#requestoptions-callback Options doc}
 *
 * @param {boolean} [options.noRetryPolicy] - If set to true, turn off default retry policy
 *
 * @param {string} [options.acceptLanguage] - Gets or sets the preferred language for the response.
 *
 * @param {number} [options.longRunningOperationRetryTimeout] - Gets or sets the retry timeout in seconds for Long Running Operations. Default value is 30.
 *
 * @param {boolean} [options.generateClientRequestId] - When set to true a unique x-ms-client-request-id value is generated and included in each request. Default is true.
 *
 */
exports.createRecoveryServicesBackupManagementClient = function (credentials, subscriptionId, options) {
  const RecoveryServicesBackupManagementClient = require('azure-arm-recoveryservicesbackup');
  return new RecoveryServicesBackupManagementClient(credentials, subscriptionId, null, options);
};

/**
 * Initializes a new instance of the RecoveryServicesManagementClient.
 *
 * @param {credentials} credentials - Credentials needed for the client to connect to Azure.
 *
 * @param {string} subscriptionId - The subscription ID.
 *
 * @param {object} [options] - The parameter options
 *
 * @param {Array} [options.filters] - Filters to be added to the request pipeline
 *
 * @param {object} [options.requestOptions] - Options for the underlying request object
 * {@link https://github.com/request/request#requestoptions-callback Options doc}
 *
 * @param {boolean} [options.noRetryPolicy] - If set to true, turn off default retry policy
 *
 * @param {string} [options.acceptLanguage] - Gets or sets the preferred language for the response.
 *
 * @param {number} [options.longRunningOperationRetryTimeout] - Gets or sets the retry timeout in seconds for Long Running Operations. Default value is 30.
 *
 * @param {boolean} [options.generateClientRequestId] - When set to true a unique x-ms-client-request-id value is generated and included in each request. Default is true.
 *
 */
exports.createRecoveryServicesManagementClient = function (credentials, subscriptionId, options) {
  const RecoveryServicesManagementClient = require('azure-arm-recoveryservices');
  return new RecoveryServicesManagementClient(credentials, subscriptionId, null, options);
};

/**
 * Initializes a new instance of the RelayManagementClient.
 *
 * @param {credentials} credentials - Credentials needed for the client to connect to Azure.
 *
 * @param {string} subscriptionId - Subscription credentials which uniquely identify Microsoft Azure subscription. The subscription ID forms part of the URI for every service call.
 *
 * @param {object} [options] - The parameter options
 *
 * @param {Array} [options.filters] - Filters to be added to the request pipeline
 *
 * @param {object} [options.requestOptions] - Options for the underlying request object
 * {@link https://github.com/request/request#requestoptions-callback Options doc}
 *
 * @param {boolean} [options.noRetryPolicy] - If set to true, turn off default retry policy
 *
 * @param {string} [options.apiVersion] - Client Api Version.
 *
 * @param {string} [options.acceptLanguage] - Gets or sets the preferred language for the response.
 *
 * @param {number} [options.longRunningOperationRetryTimeout] - Gets or sets the retry timeout in seconds for Long Running Operations. Default value is 30.
 *
 * @param {boolean} [options.generateClientRequestId] - When set to true a unique x-ms-client-request-id value is generated and included in each request. Default is true.
 *
 */
exports.createRelayManagementClient = function (credentials, subscriptionId, options) {
  const RelayManagementClient = require('azure-arm-relay');
  return new RelayManagementClient(credentials, subscriptionId, null, options);
};

/**
 * Initializes a new instance of the SchedulerManagementClient.
 *
 * @param {credentials} credentials - Credentials needed for the client to connect to Azure.
 *
 * @param {string} subscriptionId - The subscription id.
 *
 * @param {object} [options] - The parameter options
 *
 * @param {Array} [options.filters] - Filters to be added to the request pipeline
 *
 * @param {object} [options.requestOptions] - Options for the underlying request object
 * {@link https://github.com/request/request#requestoptions-callback Options doc}
 *
 * @param {boolean} [options.noRetryPolicy] - If set to true, turn off default retry policy
 *
 * @param {string} [options.apiVersion] - The API version.
 *
 * @param {string} [options.acceptLanguage] - Gets or sets the preferred language for the response.
 *
 * @param {number} [options.longRunningOperationRetryTimeout] - Gets or sets the retry timeout in seconds for Long Running Operations. Default value is 30.
 *
 * @param {boolean} [options.generateClientRequestId] - When set to true a unique x-ms-client-request-id value is generated and included in each request. Default is true.
 *
 */
exports.createSchedulerManagementClient = function (credentials, subscriptionId, options) {
  const SchedulerManagementClient = require('azure-arm-scheduler');
  return new SchedulerManagementClient(credentials, subscriptionId, null, options);
};

/**
 * Initializes a new instance of the SearchManagementClient.
 *
 * @param {credentials} credentials - Credentials needed for the client to connect to Azure.
 *
 * @param {string} subscriptionId - The unique identifier for a Microsoft Azure subscription. You can obtain this value from the Azure Resource Manager API or the portal.
 *
 * @param {object} [options] - The parameter options
 *
 * @param {Array} [options.filters] - Filters to be added to the request pipeline
 *
 * @param {object} [options.requestOptions] - Options for the underlying request object
 * {@link https://github.com/request/request#requestoptions-callback Options doc}
 *
 * @param {boolean} [options.noRetryPolicy] - If set to true, turn off default retry policy
 *
 * @param {string} [options.apiVersion] - The API version to use for each request. The current version is 2015-08-19.
 *
 * @param {string} [options.acceptLanguage] - Gets or sets the preferred language for the response.
 *
 * @param {number} [options.longRunningOperationRetryTimeout] - Gets or sets the retry timeout in seconds for Long Running Operations. Default value is 30.
 *
 * @param {boolean} [options.generateClientRequestId] - When set to true a unique x-ms-client-request-id value is generated and included in each request. Default is true.
 *
 */
exports.createSearchManagementClient = function (credentials, subscriptionId, options) {
  const SearchManagementClient = require('azure-arm-search');
  return new SearchManagementClient(credentials, subscriptionId, null, options);
};

/**
 * Initializes a new instance of the SearchIndexClient.
 *
 * @param {credentials} credentials - Credentials needed for the client to connect to Azure.
 *
 * @param {string} [baseUri] - The base URI of the service.
 *
 * @param {object} [options] - The parameter options
 *
 * @param {Array} [options.filters] - Filters to be added to the request pipeline
 *
 * @param {object} [options.requestOptions] - Options for the underlying request object
 * {@link https://github.com/request/request#requestoptions-callback Options doc}
 *
 * @param {boolean} [options.noRetryPolicy] - If set to true, turn off default retry policy
 *
 * @param {string} [options.apiVersion] - Client Api Version.
 *
 * @param {string} [options.acceptLanguage] - Gets or sets the preferred language for the response.
 *
 * @param {number} [options.longRunningOperationRetryTimeout] - Gets or sets the retry timeout in seconds for Long Running Operations. Default value is 30.
 *
 * @param {boolean} [options.generateClientRequestId] - When set to true a unique x-ms-client-request-id value is generated and included in each request. Default is true.
 *
 */
exports.createSearchIndexClient = function (credentials, subscriptionId, baseUri, options) {
  const AzureSearch = require('azure-search');
  return new AzureSearch.SearchIndexClient(credentials, subscriptionId, baseUri, options);
};

/**
 * Initializes a new instance of the SearchServiceClient.
 *
 * @param {credentials} credentials - Credentials needed for the client to connect to Azure.
 *
 * @param {string} [baseUri] - The base URI of the service.
 *
 * @param {object} [options] - The parameter options
 *
 * @param {Array} [options.filters] - Filters to be added to the request pipeline
 *
 * @param {object} [options.requestOptions] - Options for the underlying request object
 * {@link https://github.com/request/request#requestoptions-callback Options doc}
 *
 * @param {boolean} [options.noRetryPolicy] - If set to true, turn off default retry policy
 *
 * @param {string} [options.apiVersion] - Client Api Version.
 *
 * @param {string} [options.acceptLanguage] - Gets or sets the preferred language for the response.
 *
 * @param {number} [options.longRunningOperationRetryTimeout] - Gets or sets the retry timeout in seconds for Long Running Operations. Default value is 30.
 *
 * @param {boolean} [options.generateClientRequestId] - When set to true a unique x-ms-client-request-id value is generated and included in each request. Default is true.
 *
 */
exports.createSearchServiceClient = function (credentials, subscriptionId, baseUri, options) {
  const AzureSearch = require('azure-search');
  return new AzureSearch.SearchServiceClient(credentials, subscriptionId, baseUri, options);
};

/**
 * Initializes a new instance of the ServiceBusManagementClient.
 *
 * @param {credentials} credentials - Credentials needed for the client to connect to Azure.
 *
 * @param {string} subscriptionId - Subscription credentials that uniquely identify a Microsoft Azure subscription. The subscription ID forms part of the URI for every service call.
 *
 * @param {object} [options] - The parameter options
 *
 * @param {Array} [options.filters] - Filters to be added to the request pipeline
 *
 * @param {object} [options.requestOptions] - Options for the underlying request object
 * {@link https://github.com/request/request#requestoptions-callback Options doc}
 *
 * @param {boolean} [options.noRetryPolicy] - If set to true, turn off default retry policy
 *
 * @param {string} [options.apiVersion] - Client API version.
 *
 * @param {string} [options.acceptLanguage] - Gets or sets the preferred language for the response.
 *
 * @param {number} [options.longRunningOperationRetryTimeout] - Gets or sets the retry timeout in seconds for Long Running Operations. Default value is 30.
 *
 * @param {boolean} [options.generateClientRequestId] - When set to true a unique x-ms-client-request-id value is generated and included in each request. Default is true.
 *
 */
exports.createServiceBusManagementClient = function (credentials, subscriptionId, options) {
  const ServiceBusManagementClient = require('azure-arm-sb');
  return new ServiceBusManagementClient(credentials, subscriptionId, null, options);
};

/**
 * Initializes a new instance of the ServiceFabricClient.
 *
 * @param {string} apiVersion - The version of the api
 *
 * @param {string} [baseUri] - The base URI of the service.
 *
 * @param {object} [options] - The parameter options
 *
 * @param {Array} [options.filters] - Filters to be added to the request pipeline
 *
 * @param {object} [options.requestOptions] - Options for the underlying request object
 * {@link https://github.com/request/request#requestoptions-callback Options doc}
 *
 * @param {boolean} [options.noRetryPolicy] - If set to true, turn off default retry policy
 *
 * @param {number} [options.timeout] - The timeout in seconds
 *
 */
exports.createServiceFabricClient = function (options) {
  let ServiceFabricClient = require('azure-servicefabric');
  return new ServiceFabricClient(null, options);
};

/**
 * Initializes a new instance of the ServiceFabricClient.
 *
 * @param {credentials} credentials - Credentials needed for the client to connect to Azure.
 *
 * @param {string} subscriptionId - The subscription identifier
 *
 * @param {object} [options] - The parameter options
 *
 * @param {Array} [options.filters] - Filters to be added to the request pipeline
 *
 * @param {object} [options.requestOptions] - Options for the underlying request object
 * {@link https://github.com/request/request#requestoptions-callback Options doc}
 *
 * @param {boolean} [options.noRetryPolicy] - If set to true, turn off default retry policy
 *
 * @param {string} [options.apiVersion] - The version of the api
 *
 * @param {string} [options.acceptLanguage] - Gets or sets the preferred language for the response.
 *
 * @param {number} [options.longRunningOperationRetryTimeout] - Gets or sets the retry timeout in seconds for Long Running Operations. Default value is 30.
 *
 * @param {boolean} [options.generateClientRequestId] - When set to true a unique x-ms-client-request-id value is generated and included in each request. Default is true.
 *
 */
exports.createServiceFabricManagementClient = function (credentials, subscriptionId, options) {
  const ServiceFabricManagementClient = require('azure-arm-servicefabric');
  return new ServiceFabricManagementClient(credentials, subscriptionId, null, options);
};

/**
 * Initializes a new instance of the ServicemapManagementClient class.
 *
 * @param {credentials} credentials - Credentials needed for the client to connect to Azure.
 *
 * @param {string} subscriptionId - Azure subscription identifier.
 *
 * @param {object} [options] - The parameter options
 *
 * @param {Array} [options.filters] - Filters to be added to the request pipeline
 *
 * @param {object} [options.requestOptions] - Options for the underlying request object
 * {@link https://github.com/request/request#requestoptions-callback Options doc}
 *
 * @param {boolean} [options.noRetryPolicy] - If set to true, turn off default retry policy
 *
 * @param {string} [options.apiVersion] - API version.
 *
 * @param {string} [options.acceptLanguage] - Gets or sets the preferred language for the response.
 *
 * @param {number} [options.longRunningOperationRetryTimeout] - Gets or sets the retry timeout in seconds for Long Running Operations. Default value is 30.
 *
 * @param {boolean} [options.generateClientRequestId] - When set to true a unique x-ms-client-request-id value is generated and included in each request. Default is true.
 *
 */
exports.createServicemapManagementClient = function (credentials, subscriptionId, options) {
  const ServicemapManagementClient = require('azure-arm-servicemap');
  return new ServicemapManagementClient(credentials, subscriptionId, null, options);
};

/**
 * Initializes a new instance of the SqlManagementClient class.
 *
 * @param {credentials} credentials - Credentials needed for the client to connect to Azure.
 *
 * @param {string} subscriptionId - The subscription ID that identifies an Azure subscription.
 *
 * @param {object} [options] - The parameter options
 *
 * @param {Array} [options.filters] - Filters to be added to the request pipeline
 *
 * @param {object} [options.requestOptions] - Options for the underlying request object
 * {@link https://github.com/request/request#requestoptions-callback Options doc}
 *
 * @param {boolean} [options.noRetryPolicy] - If set to true, turn off default retry policy
 *
 * @param {string} [options.acceptLanguage] - Gets or sets the preferred language for the response.
 *
 * @param {number} [options.longRunningOperationRetryTimeout] - Gets or sets the retry timeout in seconds for Long Running Operations. Default value is 30.
 *
 * @param {boolean} [options.generateClientRequestId] - When set to true a unique x-ms-client-request-id value is generated and included in each request. Default is true.
 *
 */
exports.createSqlManagementClient = function (credentials, subscriptionId, options) {
  const SqlManagementClient = require('azure-arm-sql');
  return new SqlManagementClient(credentials, subscriptionId, null, options);
};

/**
 * Initializes a new instance of the StorageImportExportManagementClient.
 *
 * @param {credentials} credentials - Credentials needed for the client to connect to Azure.
 *
 * @param {string} subscriptionId - The subscription ID for the Azure user.
 *
 * @param {object} [options] - The parameter options
 *
 * @param {Array} [options.filters] - Filters to be added to the request pipeline
 *
 * @param {object} [options.requestOptions] - Options for the underlying request object
 * {@link https://github.com/request/request#requestoptions-callback Options doc}
 *
 * @param {boolean} [options.noRetryPolicy] - If set to true, turn off default retry policy
 *
 * @param {number} [options.longRunningOperationRetryTimeout] - Gets or sets the retry timeout in seconds for Long Running Operations. Default value is 30.
 *
 * @param {boolean} [options.generateClientRequestId] - When set to true a unique x-ms-client-request-id value is generated and included in each request. Default is true.
 *
 */
exports.createStorageImportExportManagementClient = function (credentials, subscriptionId, options) {
  const StorageImportExportManagementClient = require('azure-arm-storageimportexport');
  return new StorageImportExportManagementClient(credentials, subscriptionId, null, options);
};

/**
 * Create a ApiManagementClient.
 * @param {credentials} credentials - Credentials needed for the client to connect to Azure.
 * @param {string} subscriptionId - Subscription credentials which uniquely identify Microsoft Azure subscription. The subscription ID forms part of the URI for every service call.
 * @param {object} [options] - The parameter options
 * @param {Array} [options.filters] - Filters to be added to the request pipeline
 * @param {object} [options.requestOptions] - Options for the underlying request object
 * {@link https://github.com/request/request#requestoptions-callback Options doc}
 * @param {boolean} [options.noRetryPolicy] - If set to true, turn off default retry policy
 * @param {string} [options.acceptLanguage] - Gets or sets the preferred language for the response.
 * @param {number} [options.longRunningOperationRetryTimeout] - Gets or sets the retry timeout in seconds for Long Running Operations. Default value is 30.
 * @param {boolean} [options.generateClientRequestId] - When set to true a unique x-ms-client-request-id value is generated and included in each request. Default is true.
 */
exports.createApiManagementClient = function (credentials, subscriptionId, options) {
  const ApiManagementClient = require('azure-arm-apimanagement');
  return new ApiManagementClient(credentials, subscriptionId, null, options);
};

/**
 * Create a AppInsightsManagementClient.
 * @param {credentials} credentials - Credentials needed for the client to connect to Azure.
 * @param {string} subscriptionId - The Azure subscription Id.
 * @param {object} [options] - The parameter options
 * @param {Array} [options.filters] - Filters to be added to the request pipeline
 * @param {object} [options.requestOptions] - Options for the underlying request object
 * {@link https://github.com/request/request#requestoptions-callback Options doc}
 * @param {boolean} [options.noRetryPolicy] - If set to true, turn off default retry policy
 * @param {string} [options.acceptLanguage] - Gets or sets the preferred language for the response.
 * @param {number} [options.longRunningOperationRetryTimeout] - Gets or sets the retry timeout in seconds for Long Running Operations. Default value is 30.
 * @param {boolean} [options.generateClientRequestId] - When set to true a unique x-ms-client-request-id value is generated and included in each request. Default is true.
 */
exports.createAppInsightsManagementClient = function (credentials, subscriptionId, options) {
  const AppInsightsManagementClient = require('azure-arm-appinsights');
  return new AppInsightsManagementClient(credentials, subscriptionId, null, options);
};

/**
 * Create a VisualStudioResourceProviderClient.
 * @param {credentials} credentials - Credentials needed for the client to connect to Azure.
 * @param {string} subscriptionId - The Azure subscription identifier.
 * @param {object} [options] - The parameter options
 * @param {Array} [options.filters] - Filters to be added to the request pipeline
 * @param {object} [options.requestOptions] - Options for the underlying request object
 * {@link https://github.com/request/request#requestoptions-callback Options doc}
 * @param {boolean} [options.noRetryPolicy] - If set to true, turn off default retry policy
 * @param {string} [options.acceptLanguage] - Gets or sets the preferred language for the response.
 * @param {number} [options.longRunningOperationRetryTimeout] - Gets or sets the retry timeout in seconds for Long Running Operations. Default value is 30.
 * @param {boolean} [options.generateClientRequestId] - When set to true a unique x-ms-client-request-id value is generated and included in each request. Default is true.
 */
exports.createVisualStudioManagementClient = function (credentials, subscriptionId, options) {
  const VisualStudioManagementClient = require('azure-arm-visualstudio');
  return new VisualStudioManagementClient(credentials, subscriptionId, null, options);
};

/**
 * Create a StreamAnalyticsManagementClient.
 * @param {credentials} credentials - Credentials needed for the client to connect to Azure.
 * @param {string} subscriptionId - GUID which uniquely identify Microsoft Azure subscription. The subscription ID forms part of the URI for every service call.
 * @param {object} [options] - The parameter options
 * @param {Array} [options.filters] - Filters to be added to the request pipeline
 * @param {object} [options.requestOptions] - Options for the underlying request object
 * {@link https://github.com/request/request#requestoptions-callback Options doc}
 * @param {boolean} [options.noRetryPolicy] - If set to true, turn off default retry policy
 * @param {string} [options.acceptLanguage] - Gets or sets the preferred language for the response.
 * @param {number} [options.longRunningOperationRetryTimeout] - Gets or sets the retry timeout in seconds for Long Running Operations. Default value is 30.
 * @param {boolean} [options.generateClientRequestId] - When set to true a unique x-ms-client-request-id value is generated and included in each request. Default is true.
 */
exports.createStreamAnalyticsManagementClient = function (credentials, subscriptionId, options) {
  const StreamAnalyticsManagementClient = require('azure-arm-streamanalytics');
  return new StreamAnalyticsManagementClient(credentials, subscriptionId, null, options);
};

/**
 * Create a StorSimple8000SeriesManagementClient.
 * @param {credentials} credentials - Credentials needed for the client to connect to Azure.
 * @param {string} subscriptionId - The subscription id
 * @param {object} [options] - The parameter options
 * @param {Array} [options.filters] - Filters to be added to the request pipeline
 * @param {object} [options.requestOptions] - Options for the underlying request object
 * {@link https://github.com/request/request#requestoptions-callback Options doc}
 * @param {boolean} [options.noRetryPolicy] - If set to true, turn off default retry policy
 * @param {string} [options.acceptLanguage] - Gets or sets the preferred language for the response.
 * @param {number} [options.longRunningOperationRetryTimeout] - Gets or sets the retry timeout in seconds for Long Running Operations. Default value is 30.
 * @param {boolean} [options.generateClientRequestId] - When set to true a unique x-ms-client-request-id value is generated and included in each request. Default is true.
 */
exports.createStorSimple8000SeriesManagementClient = function (credentials, subscriptionId, options) {
  const StorSimple8000SeriesManagementClient = require('azure-arm-storsimple8000series');
  return new StorSimple8000SeriesManagementClient(credentials, subscriptionId, null, options);
};

/**
 * Create a SiteRecoveryManagementClient.
 * @param {credentials} credentials - Credentials needed for the client to connect to Azure.
 * @param {string} subscriptionId - The subscription Id.
 * @param {object} [options] - The parameter options
 * @param {Array} [options.filters] - Filters to be added to the request pipeline
 * @param {object} [options.requestOptions] - Options for the underlying request object
 * {@link https://github.com/request/request#requestoptions-callback Options doc}
 * @param {boolean} [options.noRetryPolicy] - If set to true, turn off default retry policy
 * @param {string} [options.acceptLanguage] - Gets or sets the preferred language for the response.
 * @param {number} [options.longRunningOperationRetryTimeout] - Gets or sets the retry timeout in seconds for Long Running Operations. Default value is 30.
 * @param {boolean} [options.generateClientRequestId] - When set to true a unique x-ms-client-request-id value is generated and included in each request. Default is true.
 */
exports.createSiteRecoveryManagementClient = function (credentials, subscriptionId, options) {
  const SiteRecoveryManagementClient = require('azure-arm-recoveryservices-siterecovery');
  return new SiteRecoveryManagementClient(credentials, subscriptionId, null, options);
};

/**
 * Create a MicrosoftResourceHealth.
 * @param {credentials} credentials - Credentials needed for the client to connect to Azure.
 * @param {string} subscriptionId - Subscription credentials which uniquely identify Microsoft Azure subscription. The subscription ID forms part of the URI for every service call.
 * @param {object} [options] - The parameter options
 * @param {Array} [options.filters] - Filters to be added to the request pipeline
 * @param {object} [options.requestOptions] - Options for the underlying request object
 * {@link https://github.com/request/request#requestoptions-callback Options doc}
 * @param {boolean} [options.noRetryPolicy] - If set to true, turn off default retry policy
 * @param {string} [options.acceptLanguage] - Gets or sets the preferred language for the response.
 * @param {number} [options.longRunningOperationRetryTimeout] - Gets or sets the retry timeout in seconds for Long Running Operations. Default value is 30.
 * @param {boolean} [options.generateClientRequestId] - When set to true a unique x-ms-client-request-id value is generated and included in each request. Default is true.
 */
exports.createResourceHealthClient = function (credentials, subscriptionId, options) {
  const ResourceHealthClient = require('azure-arm-resourcehealth');
  return new ResourceHealthClient(credentials, subscriptionId, null, options);
};

/**
 * Create a ConsumptionManagementClient.
 * @param {credentials} credentials - Credentials needed for the client to connect to Azure.
 * @param {string} subscriptionId - Azure Subscription ID.
 * @param {object} [options] - The parameter options
 * @param {Array} [options.filters] - Filters to be added to the request pipeline
 * @param {object} [options.requestOptions] - Options for the underlying request object
 * {@link https://github.com/request/request#requestoptions-callback Options doc}
 * @param {boolean} [options.noRetryPolicy] - If set to true, turn off default retry policy
 * @param {string} [options.acceptLanguage] - Gets or sets the preferred language for the response.
 * @param {number} [options.longRunningOperationRetryTimeout] - Gets or sets the retry timeout in seconds for Long Running Operations. Default value is 30.
 * @param {boolean} [options.generateClientRequestId] - When set to true a unique x-ms-client-request-id value is generated and included in each request. Default is true.
 */
exports.createConsumptionManagementClient = function (credentials, subscriptionId, options) {
  const ConsumptionManagementClient = require('azure-arm-consumption');
  return new ConsumptionManagementClient(credentials, subscriptionId, null, options);
};

/**
 * Create a DataFactoryManagementClient.
 * @param {credentials} credentials - Credentials needed for the client to connect to Azure.
 * @param {string} subscriptionId - The subscription identifier.
 * @param {object} [options] - The parameter options
 * @param {Array} [options.filters] - Filters to be added to the request pipeline
 * @param {object} [options.requestOptions] - Options for the underlying request object
 * {@link https://github.com/request/request#requestoptions-callback Options doc}
 * @param {boolean} [options.noRetryPolicy] - If set to true, turn off default retry policy
 * @param {string} [options.acceptLanguage] - Gets or sets the preferred language for the response.
 * @param {number} [options.longRunningOperationRetryTimeout] - Gets or sets the retry timeout in seconds for Long Running Operations. Default value is 30.
 * @param {boolean} [options.generateClientRequestId] - When set to true a unique x-ms-client-request-id value is generated and included in each request. Default is true.
 */
exports.createDataFactoryManagementClient = function (credentials, subscriptionId, options) {
  const DataFactoryManagementClient = require('azure-arm-datafactory');
  return new DataFactoryManagementClient(credentials, subscriptionId, null, options);
};

/**
 * Create a EventGridManagementClient.
 * @param {credentials} credentials - Credentials needed for the client to connect to Azure.
 * @param {string} subscriptionId - The subscription identifier.
 * @param {object} [options] - The parameter options
 * @param {Array} [options.filters] - Filters to be added to the request pipeline
 * @param {object} [options.requestOptions] - Options for the underlying request object
 * {@link https://github.com/request/request#requestoptions-callback Options doc}
 * @param {boolean} [options.noRetryPolicy] - If set to true, turn off default retry policy
 * @param {string} [options.acceptLanguage] - Gets or sets the preferred language for the response.
 * @param {number} [options.longRunningOperationRetryTimeout] - Gets or sets the retry timeout in seconds for Long Running Operations. Default value is 30.
 * @param {boolean} [options.generateClientRequestId] - When set to true a unique x-ms-client-request-id value is generated and included in each request. Default is true.
 */
exports.createEventGridManagementClient = function (credentials, subscriptionId, options) {
  const EventGridManagementClient = require('azure-arm-eventgrid');
  return new EventGridManagementClient(credentials, subscriptionId, null, options);
};

/**
 * Create a MachineLearningComputeManagementClient.
 * @param {credentials} credentials - Credentials needed for the client to connect to Azure.
 * @param {string} subscriptionId - The subscription identifier.
 * @param {object} [options] - The parameter options
 * @param {Array} [options.filters] - Filters to be added to the request pipeline
 * @param {object} [options.requestOptions] - Options for the underlying request object
 * {@link https://github.com/request/request#requestoptions-callback Options doc}
 * @param {boolean} [options.noRetryPolicy] - If set to true, turn off default retry policy
 * @param {string} [options.acceptLanguage] - Gets or sets the preferred language for the response.
 * @param {number} [options.longRunningOperationRetryTimeout] - Gets or sets the retry timeout in seconds for Long Running Operations. Default value is 30.
 * @param {boolean} [options.generateClientRequestId] - When set to true a unique x-ms-client-request-id value is generated and included in each request. Default is true.
 */
exports.createMachineLearningComputeManagementClient = function (credentials, subscriptionId, options) {
  const MachineLearningComputeManagementClient = require('azure-arm-machinelearningcompute');
  return new MachineLearningComputeManagementClient(credentials, subscriptionId, null, options);
};

/**
 * Create a MarketplaceOrderingAgreementsClient.
 * @param {credentials} credentials - Credentials needed for the client to connect to Azure.
 * @param {string} subscriptionId - The subscription identifier.
 * @param {object} [options] - The parameter options
 * @param {Array} [options.filters] - Filters to be added to the request pipeline
 * @param {object} [options.requestOptions] - Options for the underlying request object
 * {@link https://github.com/request/request#requestoptions-callback Options doc}
 * @param {boolean} [options.noRetryPolicy] - If set to true, turn off default retry policy
 * @param {string} [options.acceptLanguage] - Gets or sets the preferred language for the response.
 * @param {number} [options.longRunningOperationRetryTimeout] - Gets or sets the retry timeout in seconds for Long Running Operations. Default value is 30.
 * @param {boolean} [options.generateClientRequestId] - When set to true a unique x-ms-client-request-id value is generated and included in each request. Default is true.
 */
exports.createMarketplaceOrderingAgreementsClient = function (credentials, subscriptionId, options) {
  const MarketplaceOrderingAgreementsClient = require('azure-arm-marketplaceordering');
  return new MarketplaceOrderingAgreementsClient(credentials, subscriptionId, null, options);
};

/**
 * Create a MarketplaceOrderingAgreementsClient.
 * @param {credentials} credentials - Credentials needed for the client to connect to Azure.
 * @param {string} subscriptionId - The subscription identifier.
 * @param {object} [options] - The parameter options
 * @param {Array} [options.filters] - Filters to be added to the request pipeline
 * @param {object} [options.requestOptions] - Options for the underlying request object
 * {@link https://github.com/request/request#requestoptions-callback Options doc}
 * @param {boolean} [options.noRetryPolicy] - If set to true, turn off default retry policy
 * @param {string} [options.acceptLanguage] - Gets or sets the preferred language for the response.
 * @param {number} [options.longRunningOperationRetryTimeout] - Gets or sets the retry timeout in seconds for Long Running Operations. Default value is 30.
 * @param {boolean} [options.generateClientRequestId] - When set to true a unique x-ms-client-request-id value is generated and included in each request. Default is true.
 */
exports.createMarketplaceOrderingAgreementsClient = function (credentials, subscriptionId, options) {
  const MarketplaceOrderingAgreementsClient = require('azure-arm-marketplaceordering');
  return new MarketplaceOrderingAgreementsClient(credentials, subscriptionId, null, options);
};

/**
 * Create a MobileEngagementClient.
 * @param {credentials} credentials - Credentials needed for the client to connect to Azure.
 * @param {string} subscriptionId - The subscription identifier.
 * @param {object} [options] - The parameter options
 * @param {Array} [options.filters] - Filters to be added to the request pipeline
 * @param {object} [options.requestOptions] - Options for the underlying request object
 * {@link https://github.com/request/request#requestoptions-callback Options doc}
 * @param {boolean} [options.noRetryPolicy] - If set to true, turn off default retry policy
 * @param {string} [options.acceptLanguage] - Gets or sets the preferred language for the response.
 * @param {number} [options.longRunningOperationRetryTimeout] - Gets or sets the retry timeout in seconds for Long Running Operations. Default value is 30.
 * @param {boolean} [options.generateClientRequestId] - When set to true a unique x-ms-client-request-id value is generated and included in each request. Default is true.
 */
exports.createMobileEngagementClient = function (credentials, subscriptionId, options) {
  const MobileEngagementClient = require('azure-arm-mobileengagement');
  return new MobileEngagementClient(credentials, subscriptionId, null, options);
};

/**
 * Create a DomainServicesManagementClient.
 * @param {credentials} credentials - Credentials needed for the client to connect to Azure.
 * @param {string} subscriptionId - Gets subscription credentials which uniquely identify the Microsoft Azure subscription. The subscription ID forms part of the URI for every service call.
 * @param {object} [options] - The parameter options
 * @param {Array} [options.filters] - Filters to be added to the request pipeline
 * @param {object} [options.requestOptions] - Options for the underlying request object
 * {@link https://github.com/request/request#requestoptions-callback Options doc}
 * @param {boolean} [options.noRetryPolicy] - If set to true, turn off default retry policy
 * @param {string} [options.acceptLanguage] - Gets or sets the preferred language for the response.
 * @param {number} [options.longRunningOperationRetryTimeout] - Gets or sets the retry timeout in seconds for Long Running Operations. Default value is 30.
 * @param {boolean} [options.generateClientRequestId] - When set to true a unique x-ms-client-request-id value is generated and included in each request. Default is true.
 */
exports.createDomainServicesManagementClient = function (credentials, subscriptionId, options) {
  const DomainServicesManagementClient = require('azure-arm-domainservices');
  return new DomainServicesManagementClient(credentials, subscriptionId, null, options);
};

/**
 * Creates a CosmosDBManagementClient.
 * @param {credentials} credentials - Credentials needed for the client to connect to Azure.
 * @param {string} subscriptionId - Azure subscription ID.
 * @param {object} [options] - The parameter options
 * @param {Array} [options.filters] - Filters to be added to the request pipeline
 * @param {object} [options.requestOptions] - Options for the underlying request object
 * {@link https://github.com/request/request#requestoptions-callback Options doc}
 * @param {boolean} [options.noRetryPolicy] - If set to true, turn off default retry policy
 * @param {string} [options.apiVersion] - Version of the API to be used with the client request. The current version is 2015-04-08.
 * @param {string} [options.acceptLanguage] - Gets or sets the preferred language for the response.
 * @param {number} [options.longRunningOperationRetryTimeout] - Gets or sets the retry timeout in seconds for Long Running Operations. Default value is 30.
 * @param {boolean} [options.generateClientRequestId] - When set to true a unique x-ms-client-request-id value is generated and included in each request. Default is true.
 */
exports.createCosmosDBManagementClient = function (credentials, subscriptionId, options) {
  const CosmosDBManagementClient = require('azure-arm-cosmosdb');
  return new CosmosDBManagementClient(credentials, subscriptionId, null, options);
};

/** 
 * Creates a new LogAnalyticsClient for data plane access.
 * @param {credentials} credentials - Subscription credentials which uniquely identify client subscription.
 * @param {string} [baseUri] - The base URI of the service.
 * @param {object} [options] - The parameter options
 * @param {Array} [options.filters] - Filters to be added to the request pipeline
 * @param {object} [options.requestOptions] - Options for the underlying request object
 * {@link https://github.com/request/request#requestoptions-callback Options doc}
 * @param {boolean} [options.noRetryPolicy] - If set to true, turn off default retry policy
 */
exports.createLogAnalyticsClient = function (credentials, baseUri, options) {
  const LogAnalyticsClient = require('azure-loganalytics');
  return new LogAnalyticsClient(credentials, baseUri, options);
};

//runtime
var msRestAzure = require('ms-rest-azure');

/**
 * Provides a url and code that needs to be copy and pasted in a browser and authenticated over there. If successful, the user will get a
 * DeviceTokenCredentials object and the list of subscriptions associated with that userId across all the applicable tenants.
 *
 * @param {object} [options] Object representing optional parameters.
 *
 * @param {string} [options.clientId] The active directory application client id.
 * See {@link https://azure.microsoft.com/en-us/documentation/articles/active-directory-devquickstarts-dotnet/ Active Directory Quickstart for .Net}
 * for an example.
 *
 * @param {string} [options.tokenAudience] The audience for which the token is requested. Valid value is 'graph'.If tokenAudience is provided
 * then domain should also be provided its value should not be the default 'common' tenant. It must be a string (preferrably in a guid format).
 *
 * @param {string} [options.domain] The domain or tenant id containing this application. Default value is 'common'.
 *
 * @param {AzureEnvironment} [options.environment] The azure environment to authenticate with. Default environment is "Public Azure".
 *
 * @param {object} [options.tokenCache] The token cache. Default value is the MemoryCache object from adal.
 *
 * @param {object} [options.language] The language code specifying how the message should be localized to. Default value 'en-us'.
 *
 * @param {object|function} [options.userCodeResponseLogger] A logger that logs the user code response message required for interactive login. When
 * this option is specified the usercode response message will not be logged to console.
 *
 * @param {function} [optionalCallback] The optional callback.
 *
 * @returns {function | Promise} If a callback was passed as the last parameter then it returns the callback else returns a Promise.
 *
 *    {function} optionalCallback(err, credentials)
 *                 {Error}  [err]                           - The Error object if an error occurred, null otherwise.
 *                 {DeviceTokenCredentials} [credentials]   - The DeviceTokenCredentials object.
 *                 {Array}                [subscriptions]   - List of associated subscriptions across all the applicable tenants.
 *    {Promise} A promise is returned.
 *             @resolve {DeviceTokenCredentials} The DeviceTokenCredentials object.
 *             @reject {Error} - The error object.
 */
exports.interactiveLogin = msRestAzure.interactiveLogin;

/**
 * Provides a UserTokenCredentials object and the list of subscriptions associated with that userId across all the applicable tenants.
 * This method is applicable only for organizational ids that are not 2FA enabled otherwise please use interactive login.
 *
 * @param {string} username The user name for the Organization Id account.
 * @param {string} password The password for the Organization Id account.
 * @param {object} [options] Object representing optional parameters.
 * @param {string} [options.clientId] The active directory application client id.
 * See {@link https://azure.microsoft.com/en-us/documentation/articles/active-directory-devquickstarts-dotnet/ Active Directory Quickstart for .Net}
 * for an example.
 * @param {string} [options.tokenAudience] The audience for which the token is requested. Valid value is 'graph'. If tokenAudience is provided
 * then domain should also be provided and its value should not be the default 'common' tenant. It must be a string (preferrably in a guid format).
 * @param {string} [options.domain] The domain or tenant id containing this application. Default value 'common'.
 * @param {AzureEnvironment} [options.environment] The azure environment to authenticate with.
 * @param {string} [options.authorizationScheme] The authorization scheme. Default value is 'bearer'.
 * @param {object} [options.tokenCache] The token cache. Default value is the MemoryCache object from adal.
 * @param {function} [optionalCallback] The optional callback.
 *
 * @returns {function | Promise} If a callback was passed as the last parameter then it returns the callback else returns a Promise.
 *
 *    {function} optionalCallback(err, credentials)
 *                 {Error}  [err]                         - The Error object if an error occurred, null otherwise.
 *                 {UserTokenCredentials} [credentials]   - The UserTokenCredentials object.
 *                 {Array}                [subscriptions] - List of associated subscriptions across all the applicable tenants.
 *    {Promise} A promise is returned.
 *             @resolve {UserTokenCredentials} The UserTokenCredentials object.
 *             @reject {Error} - The error object.
 */
exports.loginWithServicePrincipalSecret = msRestAzure.loginWithServicePrincipalSecret;

/**
 * Provides an ApplicationTokenCredentials object and the list of subscriptions associated with that servicePrinicpalId/clientId across all the applicable tenants.
 *
 * @param {string} clientId The active directory application client id also known as the SPN (ServicePrincipal Name).
 * See {@link https://azure.microsoft.com/en-us/documentation/articles/active-directory-devquickstarts-dotnet/ Active Directory Quickstart for .Net}
 * for an example.
 * @param {string} secret The application secret for the service principal.
 * @param {string} domain The domain or tenant id containing this application.
 * @param {object} [options] Object representing optional parameters.
 * @param {string} [options.tokenAudience] The audience for which the token is requested. Valid value is 'graph'.
 * @param {AzureEnvironment} [options.environment] The azure environment to authenticate with.
 * @param {string} [options.authorizationScheme] The authorization scheme. Default value is 'bearer'.
 * @param {object} [options.tokenCache] The token cache. Default value is the MemoryCache object from adal.
 * @param {function} [optionalCallback] The optional callback.
 *
 * @returns {function | Promise} If a callback was passed as the last parameter then it returns the callback else returns a Promise.
 *
 *    {function} optionalCallback(err, credentials)
 *                 {Error}  [err]                               - The Error object if an error occurred, null otherwise.
 *                 {ApplicationTokenCredentials} [credentials]  - The ApplicationTokenCredentials object.
 *                 {Array}                [subscriptions]       - List of associated subscriptions across all the applicable tenants.
 *    {Promise} A promise is returned.
 *             @resolve {ApplicationTokenCredentials} The ApplicationTokenCredentials object.
 *             @reject {Error} - The error object.
 */
exports.loginWithUsernamePassword = msRestAzure.loginWithUsernamePassword;


/**
 * @typedef {object} AzurePublicCloudEnvironment
 * @property {string} name  'Azure',
 * @property {string} portalUrl 'http://go.microsoft.com/fwlink/?LinkId=254433',
 * @property {string} publishingProfileUrl 'http://go.microsoft.com/fwlink/?LinkId=254432',
 * @property {string} managementEndpointUrl 'https://management.core.windows.net',
 * @property {string} resourceManagerEndpointUrl 'https://management.azure.com/',
 * @property {string} sqlManagementEndpointUrl 'https://management.core.windows.net:8443/',
 * @property {string} sqlServerHostnameSuffix '.database.windows.net',
 * @property {string} galleryEndpointUrl 'https://gallery.azure.com/',
 * @property {string} activeDirectoryEndpointUrl 'https://login.microsoftonline.com/',
 * @property {string} activeDirectoryResourceId 'https://management.core.windows.net/',
 * @property {string} activeDirectoryGraphResourceId 'https://graph.windows.net/',
 * @property {string} activeDirectoryGraphApiVersion '2013-04-05',
 * @property {string} storageEndpointSuffix '.core.windows.net',
 * @property {string} keyVaultDnsSuffix '.vault.azure.net',
 * @property {string} azureDataLakeStoreFileSystemEndpointSuffix 'azuredatalakestore.net',
 * @property {string} azureDataLakeAnalyticsCatalogAndJobEndpointSuffix 'azuredatalakeanalytics.net'
 */
exports.AzurePublicCloudEnvironment = msRestAzure.AzureEnvironment.Azure;

/**
 * @typedef {object} AzureChinaCloudEnvironment
 * @property {string} name: 'AzureChina',
 * @property {string} portalUrl: 'http://go.microsoft.com/fwlink/?LinkId=301902',
 * @property {string} publishingProfileUrl: 'http://go.microsoft.com/fwlink/?LinkID=301774',
 * @property {string} managementEndpointUrl: 'https://management.core.chinacloudapi.cn',
 * @property {string} resourceManagerEndpointUrl: 'https://management.chinacloudapi.cn',
 * @property {string} sqlManagementEndpointUrl: 'https://management.core.chinacloudapi.cn:8443/',
 * @property {string} sqlServerHostnameSuffix: '.database.chinacloudapi.cn',
 * @property {string} galleryEndpointUrl: 'https://gallery.chinacloudapi.cn/',
 * @property {string} activeDirectoryEndpointUrl: 'https://login.chinacloudapi.cn/',
 * @property {string} activeDirectoryResourceId: 'https://management.core.chinacloudapi.cn/',
 * @property {string} activeDirectoryGraphResourceId: 'https://graph.chinacloudapi.cn/',
 * @property {string} activeDirectoryGraphApiVersion: '2013-04-05',
 * @property {string} storageEndpointSuffix: '.core.chinacloudapi.cn',
 * @property {string} keyVaultDnsSuffix: '.vault.azure.cn',
 * @property {string} azureDataLakeStoreFileSystemEndpointSuffix: 'N/A',
 * @property {string} azureDataLakeAnalyticsCatalogAndJobEndpointSuffix: 'N/A'
 */
exports.AzureChinaCloudEnvironment = msRestAzure.AzureEnvironment.AzureChina;

/**
 * @typedef {object} AzureGermanCloudEnvironment
 * @property {string} name: 'AzureGermanCloud',
 * @property {string} portalUrl: 'http://portal.microsoftazure.de/',
 * @property {string} publishingProfileUrl: 'https://manage.microsoftazure.de/publishsettings/index',
 * @property {string} managementEndpointUrl: 'https://management.core.cloudapi.de',
 * @property {string} resourceManagerEndpointUrl: 'https://management.microsoftazure.de',
 * @property {string} sqlManagementEndpointUrl: 'https://management.core.cloudapi.de:8443/',
 * @property {string} sqlServerHostnameSuffix: '.database.cloudapi.de',
 * @property {string} galleryEndpointUrl: 'https://gallery.cloudapi.de/',
 * @property {string} activeDirectoryEndpointUrl: 'https://login.microsoftonline.de/',
 * @property {string} activeDirectoryResourceId: 'https://management.core.cloudapi.de/',
 * @property {string} activeDirectoryGraphResourceId: 'https://graph.cloudapi.de/',
 * @property {string} activeDirectoryGraphApiVersion: '2013-04-05',
 * @property {string} storageEndpointSuffix: '.core.cloudapi.de',
 * @property {string} keyVaultDnsSuffix: '.vault.microsoftazure.de',
 * @property {string} azureDataLakeStoreFileSystemEndpointSuffix: 'N/A',
 * @property {string} azureDataLakeAnalyticsCatalogAndJobEndpointSuffix: 'N/A'
 */
exports.AzureGermanCloudEnvironment = msRestAzure.AzureEnvironment.AzureGermanCloud;

/**
 * @typedef {object} AzureUSGovernmentCloudEnvironment
 * @property {string} name: 'AzureUSGovernment',
 * @property {string} portalUrl: 'https://manage.windowsazure.us',
 * @property {string} publishingProfileUrl: 'https://manage.windowsazure.us/publishsettings/index',
 * @property {string} managementEndpointUrl: 'https://management.core.usgovcloudapi.net',
 * @property {string} resourceManagerEndpointUrl: 'https://management.usgovcloudapi.net',
 * @property {string} sqlManagementEndpointUrl: 'https://management.core.usgovcloudapi.net:8443/',
 * @property {string} sqlServerHostnameSuffix: '.database.usgovcloudapi.net',
 * @property {string} galleryEndpointUrl: 'https://gallery.usgovcloudapi.net/',
 * @property {string} activeDirectoryEndpointUrl: 'https://login.microsoftonline.com/',
 * @property {string} activeDirectoryResourceId: 'https://management.core.usgovcloudapi.net/',
 * @property {string} activeDirectoryGraphResourceId: 'https://graph.windows.net/',
 * @property {string} activeDirectoryGraphApiVersion: '2013-04-05',
 * @property {string} storageEndpointSuffix: '.core.usgovcloudapi.net',
 * @property {string} keyVaultDnsSuffix: '.vault.usgovcloudapi.net',
 * @property {string} azureDataLakeStoreFileSystemEndpointSuffix: 'N/A',
 * @property {string} azureDataLakeAnalyticsCatalogAndJobEndpointSuffix: 'N/A'
 */
exports.AzureUSGovernmentCloudEnvironment = msRestAzure.AzureEnvironment.AzureUSGovernment;

/**
 * Creates a new ApplicationTokenCredentials object.
 * See {@link https://azure.microsoft.com/en-us/documentation/articles/active-directory-devquickstarts-dotnet/ Active Directory Quickstart for .Net}
 * for detailed instructions on creating an Azure Active Directory application.
 * @constructor
 * @param {string} clientId The active directory application client id.
 * @param {string} domain The domain or tenant id containing this application.
 * @param {string} secret The authentication secret for the application.
 * @param {object} [options] Object representing optional parameters.
 * @param {string} [options.tokenAudience] The audience for which the token is requested. Valid value is 'graph'. If tokenAudience is provided
 * then domain should also be provided its value should not be the default 'common' tenant. It must be a string (preferrably in a guid format).
 * @param {AzureEnvironment} [options.environment] The azure environment to authenticate with.
 * @param {string} [options.authorizationScheme] The authorization scheme. Default value is 'bearer'.
 * @param {object} [options.tokenCache] The token cache. Default value is the MemoryCache object from adal.
 */
exports.ApplicationTokenCredentials = msRestAzure.ApplicationTokenCredentials;

/**
 * Creates a new DeviceTokenCredentials object that gets a new access token using userCodeInfo (contains user_code, device_code)
 * for authenticating user on device.
 *
 * When this credential is used, the script will provide a url and code. The user needs to copy the url and the code, paste it
 * in a browser and authenticate over there. If successful, the script will get the access token.
 *
 * @constructor
 * @param {object} [options] Object representing optional parameters.
 * @param {string} [options.username] The user name for account in the form: 'user@example.com'.
 * @param {AzureEnvironment} [options.environment] The azure environment to authenticate with. Default environment is "Azure" popularly known as "Public Azure Cloud".
 * @param {string} [options.domain] The domain or tenant id containing this application. Default value is 'common'
 * @param {string} [options.tokenAudience] The audience for which the token is requested. Valid value is 'graph'. If tokenAudience is provided
 * then domain should also be provided and its value should not be the default 'common' tenant. It must be a string (preferrably in a guid format).
 * @param {string} [options.clientId] The active directory application client id.
 * See {@link https://azure.microsoft.com/en-us/documentation/articles/active-directory-devquickstarts-dotnet/ Active Directory Quickstart for .Net}
 * for an example.
 * @param {string} [options.authorizationScheme] The authorization scheme. Default value is 'bearer'.
 * @param {object} [options.tokenCache] The token cache. Default value is the MemoryCache object from adal.
 */
exports.DeviceTokenCredentials = msRestAzure.DeviceTokenCredentials;

/**
 * Creates a new UserTokenCredentials object.
 *
 * @constructor
 * @param {string} clientId The active directory application client id.
 * See {@link https://azure.microsoft.com/en-us/documentation/articles/active-directory-devquickstarts-dotnet/ Active Directory Quickstart for .Net}
 * for an example.
 * @param {string} domain The domain or tenant id containing this application.
 * @param {string} username The user name for the Organization Id account.
 * @param {string} password The password for the Organization Id account.
 * @param {object} [options] Object representing optional parameters.
 * @param {string} [options.tokenAudience] The audience for which the token is requested. Valid value is 'graph'. If tokenAudience is provided
 * then domain should also be provided its value should not be the default 'common' tenant. It must be a string (preferrably in a guid format).
 * @param {AzureEnvironment} [options.environment] The azure environment to authenticate with.
 * @param {string} [options.authorizationScheme] The authorization scheme. Default value is 'bearer'.
 * @param {object} [options.tokenCache] The token cache. Default value is the MemoryCache object from adal.
 */
exports.UserTokenCredentials = msRestAzure.UserTokenCredentials;

/**
 * @class
 * Initializes a new instance of the Resource class.
 * @constructor
 */
exports.BaseResource = msRestAzure.BaseResource;

/**
 * @class
 * Initializes a new instance of the Generic AzureServiceClient class. This class can be used to make requests to Azure.
 * One can specify the AzureEnvironment in the options while using one of the login methods which gives you a credential object.
 * This
 * @constructor
 * @param {object} credentials - ApplicationTokenCredentials or
 * UserTokenCredentials object used for authentication.
 *
 * @param {object} options - The parameter options used by ServiceClient
 *
 * @param {string} [options.acceptLanguage] - Gets or sets the preferred language for the response.
 * Default value is: 'en-US'.
 *
 * @param {boolean} [options.generateClientRequestId] - When set to true a unique x-ms-client-request-id value
 * is generated and included in each request. Default is true.
 *
 * @param {number} [options.longRunningOperationRetryTimeout] - Gets or sets the retry timeout in seconds for
 * Long Running Operations. Default value is 30.
 *
 */
exports.AzureServiceClient = msRestAzure.AzureServiceClient;

var msRest = require('ms-rest');
exports.RequestObject = msRest.WebResource;