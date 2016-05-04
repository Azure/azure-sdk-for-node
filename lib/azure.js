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
 * Creates a new {@link KeyVaultClient} object.
 * @method
 * @param {object} credentials The credentials object (typically, a TokenCloudCredentials instance).
 * @param {string} [baseUri] The vault base URI, used only for operations that doesn't receive a full URI
 *                           (see description of each operation).
 * @param {object[]} [filters] Extra filters to attach to the client.
 * @return {KeyVaultClient} A new KeyVaultClient object.
 */
exports.KeyVaultClient = azureKeyVault.KeyVaultClient;

/**
* Creates a new {@link KeyVaultClient} object.
* @method
* @param {object} credentials                       The credentials object (typically, a CertificateCloudCredentials instance)
* @param {string} credentials.subscriptionId        The subscription identifier.
* @param {string} [credentials.cert]                The cert value.
* @param {string} [credentials.key]                 The key value.
* @param {string} [credentials.pem]                 The PEM file data.
* @param {string} [baseUri]                         The base uri.
* @return {KeyVaultClient}                          A new KeyVaultClient object.
*/
exports.createKeyVaultClient = azureKeyVault.createKeyVaultClient;

/**
 * Key Vault management client exports.
 * @ignore
 */
var azureMgmtKeyVault = require('azure-arm-keyvault');

/**
 * Creates a new {@link KeyVaultManagementClient} object.
 * @method
 * @param {object} credentials The credentials object (typically, a TokenCloudCredentials instance).
 * @param {string} [baseUri] The Azure management URI. If not informed, the value "https://management.azure.com" is used.
 * @param {object[]} [filters] Extra filters to attach to the client.
 * @return {KeyVaultManagementClient} A new KeyVaultManagementClient object.
 */
exports.KeyVaultManagementClient = azureMgmtKeyVault.KeyVaultManagementClient;

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

/*
* Configuration
*/

var sdkconfig = azureCommon.SdkConfig;
exports.config = sdkconfig;
exports.configure = azureCommon.configure;
exports.dumpConfig = exports.dumpConfig;

var resourceManagement = require('azure-arm-resource');
exports.ResourceManagementClient = resourceManagement.ResourceManagementClient;
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
  return new resourceManagement.ResourceManagementClient(credentials, subscriptionId, null, options);
};

exports.ARMFeatureClient = resourceManagement.FeatureClient;
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
exports.createARMFeatureManagementClient = function (credentials, subscriptionId, options) {
  return new resourceManagement.FeatureClient(credentials, subscriptionId, null, options);
};

exports.ARMSubscriptionClient = resourceManagement.SubscriptionClient;
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
exports.createARMSubscriptionManagementClient = function (credentials, options) {
  return new resourceManagement.SubscriptionClient(credentials, null, options);
};

exports.ARMManagementLockClient = resourceManagement.ManagementLockClient;
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
  return new resourceManagement.ManagementLockClient(credentials, subscriptionId, null, options);
};

var azureARMStorage = require('azure-arm-storage');
exports.ARMStorageManagementClient = azureARMStorage;

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
exports.createARMStorageManagementClient = function (credentials, subscriptionId, options) {
  return new azureARMStorage(credentials, subscriptionId, null, options);
};

var azureARMNetwork = require('azure-arm-network');
exports.ARMNetworkManagementClient = azureARMNetwork;

/**
 * Creates a new instance of the ARM NetworkManagementClient.
 * @constructor
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
exports.createARMNetworkManagementClient = function (credentials, subscriptionId, options) {
  return new azureARMNetwork(credentials, subscriptionId, null, options);
};

var azureARMCompute = require('azure-arm-compute');
exports.ARMComputeManagementClient = azureARMCompute;

/**
 * Creates a new instance of the ARM ComputeManagementClient.
 * @constructor
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
exports.createARMComputeManagementClient = function (credentials, subscriptionId, options) {
  return new azureARMCompute(credentials, subscriptionId, null, options);
};

var azureARMRedis = require('azure-arm-rediscache');
exports.ARMRedisCacheManagementClient = azureARMRedis;

/**
 * Creates a new instance of the ARM RedisCacheManagementClient.
 * @constructor
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
exports.createARMRedisCacheManagementClient = function (credentials, subscriptionId, options) {
  return new azureARMRedis(credentials, subscriptionId, null, options);
};

var azureARMWebSite = require('azure-arm-website');
exports.ARMWebSiteManagementClient = azureARMWebSite;
/**
 * Creates a new instance of the ARM WebsiteManagementClient.
 * @constructor
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
exports.createARMWebsiteManagementClient = function (credentials, subscriptionId, options) {
  return new azureARMWebSite(credentials, subscriptionId, null, options);
};

var azureGraph = require('azure-graph');
exports.GraphManagementClient = azureGraph;
/**
 * Creates a new instance of the ARM GraphRbacManagementClient class.
 * @constructor
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
  return new azureGraph(credentials, tenantId, null, options);
};

var azureARMCdn = require('azure-arm-cdn');
exports.ARMCdnManagementClient = azureARMCdn;
/**
 * Creates a new instance of the ARM CdnManagementClient.
 * @constructor
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
exports.createARMCdnManagementClient = function (credentials, subscriptionId, options) {
  return new azureARMCdn(credentials, subscriptionId, null, options);
};

/*var azureARMAuthorization = require('azure-arm-authorization');
exports.ARMAuthorizationManagementClient = azureARMAuthorization;*/
/**
 * Creates a new instance of the ARM AuthorizationManagementClient.
 * @constructor
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
/*exports.createARMAuthorizationManagementClient = function (credentials, subscriptionId, options) {
  return new azureARMAuthorization(credentials, subscriptionId, null, options);
};*/

var azureARMDns = require('azure-arm-dns');
exports.ARMDnsManagementClient = azureARMDns.DnsManagementClient;
/**
* Creates a new {@link DnsManagementClient} object.
*
* NOTE: These APIs are still in development and should not be used.
*
* @param {string} [credentials.subscriptionId]      The subscription identifier.
* @param {string} [credentials.token]               The access token.
* @param {string} [baseUri]                         The base uri.
* @param {array}  [filters]                         Optional array of service filters
* @return {DnsManagementClient}          A new DnsManagementClient object.
*/
exports.createARMDnsManagementClient = azureARMDns.createDnsManagementClient;

var azureARMHDInsight = require('azure-arm-hdinsight');
exports.ARMHDInsightManagementClient = azureARMHDInsight.HDInsightManagementClient;
/**
* Creates a new HDInsightManagementClient object 
* @class
* The HDInsightManagementClient class is used to perform cluster CRUD operations on the Microsoft Azure HDInsight Service.
*
* @param {string} [credentials.subscriptionId]      The subscription identifier.
* @param {string} [credentials.token]               The access token.
* @param {string} [baseUri]                         The base uri.
* @param {array}  [filters]                         Optional array of service filters
* @return {HDInsightManagementClient}               A new HDInsightManagementClient object.
*/
exports.createARMHDInsightManagementClient = azureARMHDInsight.createHDInsightManagementClient;

var azureARMHDInsightJobs = require('azure-arm-hdinsight-jobs');
exports.ARMHDInsightJobManagementClient = azureARMHDInsightJobs.HDInsightJobManagementClient;
/**
* Creates a new HDInsightJobManagementClient object 
* @class
* The HDInsightJobManagementClient class is used to submit jobs on the Microsoft Azure HDInsight Service.
*
* @param {string} [credentials.subscriptionId]      The subscription identifier.
* @param {string} [credentials.token]               The access token.
* @param {string} [baseUri]                         The base uri.
* @param {array}  [filters]                         Optional array of service filters
* @return {HDInsightJobManagementClient}            A new HDInsightJobManagementClient object.
*/
exports.createARMHDInsightJobManagementClient = azureARMHDInsightJobs.createHDInsightJobManagementClient;

var azureARMCommerce = require('azure-arm-commerce');
exports.ARMCommerceManagementClient = azureARMCommerce.UsageAggregationManagementClient;
/**
* Creates a new CommerceManagementClient object.
*
* @param {string} [credentials.subscriptionId]      The subscription identifier.
* @param {string} [baseUri]                         The base uri.
* @param {array}  [filters]                         Optional array of service filters
* @return {UsageAggregationManagementClient}        A new UsageAggregationManagementClient object.
*/
exports.createARMCommerceManagementClient = azureARMCommerce.createUsageAggregationManagementClient;

var azureARMInsights = require('azure-arm-insights');
exports.ARMInsightsManagementClient = azureARMInsights.InsightsManagementClient;
exports.InsightsClient = azureARMInsights.InsightsClient;
/**
* Creates a new {@link InsightsManagementClient} object.
*
* @param {string} [credentials.token]               The access token.
* @param {string} [baseUri]                         The base uri.
* @return {InsightsManagementClient}                A new InsightsManagementClient object.
*/
exports.createARMInsightsManagementClient = azureARMInsights.createInsightsManagementClient;
/**
* Creates a new {@link InsightsClient} object.
*
* @param {string} [credentials.token]               The access token.
* @param {string} [baseUri]                         The base uri.
* @return {InsightsClient}                          A new InsightsClient object.
*/
exports.createInsightsClient = azureARMInsights.createInsightsClient;

/*var azureARMDatalakeAnalytics = require('azure-arm-datalake-analytics');
exports.DataLakeAnalyticsAccountClient = azureARMDatalakeAnalytics.DataLakeAnalyticsAccountClient;
exports.DataLakeAnalyticsJobClient = azureARMDatalakeAnalytics.DataLakeAnalyticsJobClient;
exports.DataLakeAnalyticsCatalogClient = azureARMDatalakeAnalytics.DataLakeAnalyticsCatalogClient;*/

/**
 * Creates a new instance of the DataLakeAnalyticsJobManagementClient class.
 * @constructor
 *
 * @param {credentials} credentials - Gets Azure subscription credentials.
 *
 * @param {string} subscriptionId - Gets subscription credentials which uniquely identify Microsoft Azure subscription. The subscription ID forms part of the URI for every service call.
 *
 * @param {string} adlaJobDnsSuffix - Gets the DNS suffix used as the base for all Azure Data Lake Analytics Job service requests.
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
/*exports.createDataLakeAnalyticsJobManagementClient = function (credentials, subscriptionId, adlaJobDnsSuffix, options) {
  return new azureARMDatalakeAnalytics.DataLakeAnalyticsJobClient(credentials, subscriptionId, adlaJobDnsSuffix, options);
};*/

/**
 * Creates a new instance of the DataLakeAnalyticsCatalogManagementClient class.
 * @constructor
 *
 * @param {credentials} credentials - Gets Azure subscription credentials.
 *
 * @param {string} subscriptionId - Gets subscription credentials which uniquely identify Microsoft Azure subscription. The subscription ID forms part of the URI for every service call.
 *
 * @param {string} adlaCatalogDnsSuffix - Gets the DNS suffix used as the base for all Azure Data Lake Analytics Catalog service requests.
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
/*exports.createDataLakeAnalyticsCatalogManagementClient = function (credentials, subscriptionId, adlaCatalogDnsSuffix, options) {
  return new azureARMDatalakeAnalytics.DataLakeAnalyticsCatalogClient(credentials, subscriptionId, adlaCatalogDnsSuffix, options);
};*/

/**
 * Creates a new instance of the DataLakeAnalyticsAccountManagementClient class.
 * @constructor
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
/*exports.createDataLakeAnalyticsAccountManagementClient = function(credentials, subscriptionId, options) {
  return new azureARMDatalakeAnalytics.DataLakeAnalyticsAccountClient(credentials, subscriptionId, options);
};

var azureARMDatalakeStore = require('azure-arm-datalake-store');
exports.DatalakeStoreAccountClient = azureARMDatalakeStore.DataLakeStoreAccountClient;
exports.DataLakeStoreFileSystemClient = azureARMDatalakeStore.DataLakeStoreFileSystemClient;*/

/**
 * Creates a new instance of the DataLakeStoreAccountManagementClient class.
 * @constructor
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
/*exports.createDataLakeStoreAccountManagementClient = function (credentials, subscriptionId, options) {
  return new azureARMDatalakeStore.DataLakeStoreAccountClient(credentials, subscriptionId, options);
};*/

/**
 * Creates a new instance of the DataLakeStoreFileSystemManagementClient class.
 * @constructor
 *
 * @param {credentials} credentials - Gets Azure subscription credentials.
 *
 * @param {string} subscriptionId - Gets subscription credentials which uniquely identify Microsoft Azure subscription. The subscription ID forms part of the URI for every service call.
 *
 * @param {string} adlsFileSystemDnsSuffix - Gets the URI used as the base for all cloud service requests.
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
/*exports.DataLakeStoreFileSystemManagementClient = function(credentials, subscriptionId, adlsFileSystemDnsSuffix, options) {
  return new azureARMDatalakeStore.DataLakeStoreFileSystemClient(credentials, subscriptionId, adlsFileSystemDnsSuffix, options);
};*/

var azureBatch = require('azure-arm-batch');
exports.BatchManagementClient = azureBatch;

/**
 * Creates a new instance of the ARM BatchManagementClient.
 * @constructor
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
  return new azureBatch(credentials, subscriptionId, null, options);
};

var azureBatchService = require('azure-batch');
exports.BatchServiceClient = azureBatchService;

/**
 * Creates a new instance of the BatchServiceClient.
 * @constructor
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
  return new azureBatchService(credentials, baseUri, options);
};
