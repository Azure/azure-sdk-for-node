## 2018.06.24 version 2.3.1-preview
* Added client library for Log Analytics

## 2018.06.12 version 2.3.0-preview
* Updated dependencies based on `npm audit` warnings
* Removed deprecated `azure-monitor` from `azure` package

## 2017.10.11 version 2.2.1-preview
* Restricting dependency on "moment" from "^2.18.1" to "~2.18.1" due to bugs in 2.19.0. Updated packages are:
  * azure
  * azure-batch
  * azure-monitor
  * azure-arm-monitor
  * azure-asm-website
  * ms-rest
  * ms-rest-azure

## 2017.09.29 version 2.2.0-preview
* Added **new** client libraries for following ARM services:
  * Api Management ([azure-arm-apimanagement](https://www.npmjs.com/search?q=azure-arm-apimanagement))
  * AppInsights Management ([azure-arm-appinsights](https://www.npmjs.com/search?q=azure-arm-appinsights))
  * Consumption Management ([azure-arm-consumption](https://www.npmjs.com/search?q=azure-arm-consumption))
  * ContainerInstance Management ([azure-arm-containerinstance](https://www.npmjs.com/search?q=azure-arm-containerinstance))
  * Datafactory Management ([azure-arm-datafactory](https://www.npmjs.com/search?q=azure-arm-datafactory))
  * DomainServices Management ([azure-arm-domainservices](https://www.npmjs.com/search?q=azure-arm-domainservices))
  * EventGrid Management ([azure-arm-eventgrid](https://www.npmjs.com/search?q=azure-arm-eventgrid))
  * MachineLearningCompute Management ([azure-arm-machinelearningcompute](https://www.npmjs.com/search?q=azure-machinelearningcompute))
  * Mobile Engagement([azure-arm-mobileengagement](https://www.npmjs.com/search?q=azure-mobileengagement))
  * Monitor Management ([azure-arm-monitor](https://www.npmjs.com/search?q=azure-arm-monitor))
  * Monitor ([azure-monitor](https://www.npmjs.com/search?q=azure-monitor))
  * Operations Management ([azure-arm-operations](https://www.npmjs.com/search?q=azure-arm-operations))
  * Recoveryservices Site Recovery Management ([azure-arm-recoveryservices-siterecovery](https://www.npmjs.com/search?q=azure-arm-recoveryservices-siterecovery))
  * ResourceHealth Management ([azure-arm-resourcehealth](https://www.npmjs.com/search?q=azure-arm-resourcehealth))
  * Storsimple8000series Management ([azure-arm-storsimple8000series](https://www.npmjs.com/search?q=azure-arm-storsimple8000series))
  * StreamAnalytics Management ([azure-arm-streamanalytics](https://www.npmjs.com/search?q=azure-arm-streamanalytics))
  * VisualStudio Management ([azure-arm-visualstudio](https://www.npmjs.com/search?q=azure-arm-visualstudio))
* **Deprecated some** client libraries:
  * [azure-arm-intune](https://www.npmjs.com/search?q=azure-arm-intune) has been deprecated as the service has been deprecated.
  * [azure-arm-insights](https://www.npmjs.com/search?q=azure-arm-insights) and [azure-insights](https://www.npmjs.com/search?q=azure-insights) have been deprecated and replaced with [azure-arm-monitor](https://www.npmjs.com/search?q=azure-arm-monitor)(https://www.npmjs.com/search?q=azure-arm-monitor).
  * [azure-arm-documentdb](https://www.npmjs.com/search?q=azure-arm-documentdb) has been deprecated and replaced with [azure-arm-cosmosdb](https://www.npmjs.com/search?q=azure-arm-cosmosdb).
* **Runtime** (ms-rest and ms-rest-azure) updates:
  * Added support for MSI Authentication. #2224
  * Added support for authentication using service principal from auth file. #2225
  * Updated urls for different Azure Endpoints as necessary. #2245, #2247
  * Added support for automatic RP registration by adding a filter in the request pipeline.
  * Updated AzureServiceClientOptions type definitions.
  * Fixed the issue of "authentication_pending" error in interactiveLogin #2002

## 2017.04.03 version 2.0.0-preview
* Updated type definition (.d.ts) files for all the packages and improved typescript support.
* Added Promise support for all the APIs. For each callback based API, we now have an overloaded method that returns a Promise.
* Moved Javascript code to ES6 syntax.
* **Minimum required node.js version is 6.10**
* Added a new vscode extension named [Azure Node Essentials](https://marketplace.visualstudio.com/items?itemName=azuresdkteam.azurenodeessentials) to help you easily interact with Azure.
* Improved the loading time of rollup azure package
* Added client libraries for following ARM services
  * Advisor Management ([azure-arm-advisor](https://www.npmjs.com/search?q=azure-arm-advisor))
  * Automation Management ([azure-arm-automation](https://www.npmjs.com/search?q=azure-arm-automation))
  * Billing Management ([azure-arm-billing](https://www.npmjs.com/search?q=azure-arm-billing))
  * Cognitive Services Management ([azure-arm-cognitiveservices](https://www.npmjs.com/search?q=azure-arm-cognitiveservices))
  * Container Registry Management ([azure-arm-containerregistry](https://www.npmjs.com/search?q=azure-arm-containerregistry))
  * Customer Insights Management ([azure-arm-customerinsights](https://www.npmjs.com/search?q=azure-arm-customerinsights))
  * DocumentDB Management ([azure-arm-documentdb](https://www.npmjs.com/search?q=azure-arm-documentdb))
  * Logic Management ([azure-arm-logic](https://www.npmjs.com/search?q=azure-arm-logic))
  * Machine Learning Management ([azure-arm-machinelearning](https://www.npmjs.com/search?q=azure-arm-machinelearning))
  * Media Services Management ([azure-arm-mediaservices](https://www.npmjs.com/search?q=azure-arm-mediaservices))
  * Operational Insights Management ([azure-arm-operationalinsights](https://www.npmjs.com/search?q=azure-arm-operationalinsights))
  * Recovery Services Backup Management ([azure-arm-recoveryservicesbackup](https://www.npmjs.com/search?q=azure-arm-recoveryservicesbackup))
  * Recovery Services Management ([azure-arm-recoveryservices](https://www.npmjs.com/search?q=azure-arm-recoveryservices))
  * Relay Management ([azure-arm-relay](https://www.npmjs.com/search?q=azure-arm-relay))
  * Scheduler Management ([azure-arm-scheduler](https://www.npmjs.com/search?q=azure-arm-scheduler))
  * Search Management ([azure-arm-search](https://www.npmjs.com/search?q=azure-arm-search))
  * ServiceFabric Management ([azure-arm-servicefabric](https://www.npmjs.com/search?q=azure-arm-servicefabric))
  * ServiceMap Management ([azure-arm-servicemap](https://www.npmjs.com/search?q=azure-arm-servicemap))
  * SQL Management ([azure-arm-sql](https://www.npmjs.com/search?q=azure-arm-sql))
  * Storage Import Export Management ([azure-arm-storageimportexport](https://www.npmjs.com/search?q=azure-arm-storageimportexport))
* Runtime (ms-rest and ms-rest-azure)
  * Updated d.ts files for ms-rest and ms-rest-azure
  * All the login methods (interactiveLogin, loginWithServicePrincipalSecret, loginWithUsernamePassword) now support callbacks as well as Promises.
  * Added support to send (a generic request, or a generic long running request (that polls)) using the authenticated base client in the runtime

## 2016.09.07 Version 1.2.0-preview
* Added client libraries for following ARM services
  * Servicebus management
  * Trafficmanager
  * Powerbiembedded
  * Eventhub management
  * IotHub Management
* Regenerated following services with the latest (api-version) swagger spec
  * KeyVaultManagement and KeyVault data plane
  * ResourceManagement
  * DevTestLabs
  * NotificationHubManagement
  * Commerce
* Removed ApiAppManagement library as the service is no longer deployed on Azure
* Updated the rollup file (lib/azure.js) to be in sync with the latest changes
* Updated License Info
  * All the Autorest generated client libraries are under MIT license
  * All the old codegenerator generated client libraries are under Apache-2.0
* Bumped up the request library to 2.74.0

## 2015.03.25 Version 0.10.5
* Used newer 'request' package version of '2.45.0'
* Updated website client lib to accept status code of 200 on 'createPublishingUser'
* Updated compute client readme file

## 2015.02.09 Version 0.10.4
* regenerate client lib code for the latest service api

## 2015.01.21 Version 0.10.3
* Added option to overwrite the http agent
* Minor script fixes

## 2014.12.02 Version 0.10.2
* Documentation link fixes for servicebus management client
* Fixed CertificateCloudCredentials to accept the pem as buffer or string
* Updated travis.yml
* Updated null and undefined check for several attributes in separate modules

## 2014.11.07 Version 0.10.1
* Fixed parsing of sql db error messages with xml namespace
* Implemented Renew-Lock for Message in ServiceBus

## 2014.10.02 Version 0.10.0
* Switch to use "azure-storage" from "azure-storage-legacy"
* Fix retry logic on http status code 408

## 2014.09.10 Version 0.9.16
* Release new azure authorization clients
* Release new subscription client of azure resource management
* Better odata error parsing in azure common package

## 2014.08.12 Version 0.9.15
* Fixed dependencies in the azure-sb module

## 2014.08.11 Version 0.9.14
* Bug fixes to notification hub client
* Updated repo pointers in package.json files

## 2014.07.30 Version 0.9.13
* Updates to service management clients
* Fixes to notification hub client
* Separated out service bus, and hdinsight management into separate modules
* Obsolete service management APIs removed

## 2014.07.02 Version 0.9.11
* Updated service management clients

## 2014.06.23 Version 0.9.10
* Bug fix for url filter creation

## 2014.06.19 Version 0.9.9
* ARM website wrappers
* Various bug fixes in management packages
* Helper constructor for resource identifiers

## 2014.06.03 Version 0.9.8
* Fix for blob streaming
* Split out storage into azure-storage-legacy module
* fix for apns notification hub payload format
* updated all service clients to support overriding timeouts
* Test suite fixes

## 2014.05.02 Version 0.9.7
* Updated all service clients with codegen fixes
* Exposing some cert management functions from azure-common

## 2014.04.29 Version 0.9.6
* Fixing missing dependencies in submodules

## 2014.04.29 Version 0.9.5
* Turning on monitoring and scheduler features in rollup package
* Fixing references to monitoring client in azure.js

## 2014.04.29 Version 0.9.4
* Added Monitoring and Scheduler clients
* Regeneration / update of all management clients
* Trimming extra spaces in urls
* Added "skipEncoding" option when writing blobs
* Returning status codes on management library errors

## 2014.01.30 Version 0.8.1
* Added web jobs APIs
* Support for expiration in template messages in Notification Hubs

## 2014.01.15 Version 0.8.0
* Added the Preview Service Management libraries as separate modules
* Added ability to consume PEM files directly from the Service Management libraries
* Added support for createOrUpdate and createRegistrationId in the Notification Hubs libraries

## 2014.01.10 Version 0.7.19
* Lock validator version

## 2013.11.27 Version 0.7.18
* Lock xmlbuilder version

## 2013.11.5 Version 0.7.17
* Added getBlob and createBlob operations that support stream piping
* Added compute, management, network, serviceBus, sql, storage management, store and subscription preview wrappers
* Multiple bugfixes

## 2013.10.16 Version 0.7.16
* Improved API documentation
* Updated Virtual Machines API to 2013-06-01
* Added website management preview wrappers
* Multiple bugfixes

## 2013.08.19 Version 0.7.15
* Multiple storage fixes
* Fix issue with Notification Hubs template message sending

## 2013.08.12 Version 0.7.14
* Multiple storage fixes
* Documentation improvements
* Added support for large blobs upload / download

## 2013.08.08 Version 0.7.13
* Lock request version

## 2013.07.29 Version 0.7.12
* Added MPNS support
* Added Service management vnet operations support

## 2013.07.10 Version 0.7.11
* Hooked up new configuration system to storage APIs
* Support for AZURE_STORAGE_CONNECTION_STRING environment variable
* Included API for websites management
* Fixed UTF-8 support in table batch submit

## 2013.06.26 Version 0.7.10
* Various fixes in storage APIs

## 2013.06.19 Version 0.7.9
* First part of new SDK configuration system
* Support for AZURE_SERVICEBUS_CONNECTION_STRING environment variable
* Updated SAS generation logic to include version number
* Infrastructure support for creating passwordless VMs

## 2013.06.13 Version 0.7.8
* Updates to HDInsight operations

## 2013.06.06 Version 0.7.7
* Added support for Android notification through Service Bus Notification Hubs
* Support prefixes when listing tables
* Support '$logs' as a valid blob container name to support reading diagnostic information
* Fix for network configuration serialization for subnets

## 2013.05.30 Version 0.7.6
* Added list, delete and create cluster operations for HD Insight.

## 2013.05.15 Version 0.7.5
* Fixed registration hubs issue with requiring access key when shared key was provided.
* Fixed registration hubs issue with listByTag, Channel and device token

## 2013.05.09 Version 0.7.4
* Fixed encoding issue with partition and row keys in table storage query

## 2013.05.01 Version 0.7.3
* Fixed issue #680: BlobService.getBlobUrl puts permissions in sas url even if not given
* Changes to test suite & sdk to run in other environments
* Notification hubs registrations
* Support in ServiceManagementClient for role reboot and reimage

## 2013.04.05 Version 0.7.2
* Removing workaround for SSL issue and forcing node version to be outside the > 0.8 && < 0.10.3 range where the issue occurs

## 2013.04.03 Version 0.7.1
* Adding (limited) support for node 0.10
* Fixing issue regarding registering providers when using websites or mobiles services

## 2013.03.25 Version 0.7.0
* Breaking change: Primitive types will be stored for table storage.
* Adding support for creating and deleting affinity groups
* Replacing http-mock by nock and making all tests use it by default
* Adding notification hubs messages for WNS and APNS
* Add Strict SSL validation for server certificates
* Add support for creating subscriptions that expire

## 2013.03.12 Version 0.6.11
* Added constraint to package.json to restrict to node versions < 0.9.

## 2013.02.11 Version 0.6.10
* Added helper date.* functions for generating SAS expirations (secondsFromNow, minutesFromNow, hoursFromNow, daysFromNow)
* Added SQL classes for managing SQL Servers, Databases and Firewall rules
* Updating to use latest xml2js

## 2012.12.12 Version 0.6.9
* Exporting WebResource, Client classes from package to support CLI.
* Install message updated to remind users the CLI is now a separate package.

## 2012.11.20 Version 0.6.8
 * CLI functionality has been pulled out into a new "azure-cli" module. See https://github.com/Azure/azure-xplat-cli for details.
 * Add support for sb: in ServiceBus connection strings.
 * Add functions to ServiceManagement for managing storage accounts.
 * Merged #314 from @smarx for allowing empty partition keys on the client.
 * Merged #447 from @anodejs for array enumeration and exception on batch response.
 * Various other fixes

## 2012.10.15 Version 0.6.7
 * Adding connection strings support for storage and service bus
 * Fixing issue with EMULATED and explicit variables making the later more relevant
 * Adding Github support
 * Adding website application settings support

## 2012.10.12 Version 0.6.6
 * Using fixed version of commander.js to avoid bug in commander.js 1.0.5

## 2012.10.01 Version 0.6.5
 * Bugfixing

## 2012.09.18 Version 0.6.4
 * Multiple Bugfixes around blob streaming

## 2012.09.09 Version 0.6.3
 * Fixing issue with xml2js

## 2012.08.15 Version 0.6.2
 * Multiple Bugfixes

## 2012.07.02 Version 0.6.1
 * Multiple Bugfixes
 * Adding subscription setting and listing functionality.

## 2012.06.06 Version 0.6.0
 * Adding CLI tool
 * Multiple Bugfixes

## 2012.04.19 Version 0.5.3
 * Service Runtime Wrappers
 * Multiple Bugfixes
 * Unit tests converted to mocha and code coverage made easy through JSCoverage

## 2012.02.10 Version 0.5.2
 * Service Bus Wrappers
 * Storage Services UT run against a mock server.
 * Node.exe version requirement lowered to raise compatibility.
 * Multiple Bugfixes

## 2011.12.14 Version 0.5.1
 * Multiple bug fixes

## 2011.12.09 Version 0.5.0
 * Initial Release
