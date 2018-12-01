# Azure SDK for Node.js

| Component | Build Status |
| --------- | ------ |
| Management Libraries | [![Build Status](https://travis-ci.org/Azure/azure-sdk-for-node.png?branch=master)](https://travis-ci.org/Azure/azure-sdk-for-node) |
| Client Libraries | [![Build Status](https://dev.azure.com/azure-sdk/public/_apis/build/status/azure-sdk-for-node.client)](https://dev.azure.com/azure-sdk/public/_build/latest?definitionId=33) |

This project provides Node.js packages that makes it easy to consume and manage Microsoft Azure Services.

If you are new to Azure and Node.js, see [Azure for Node.js developers](https://docs.microsoft.com/en-us/javascript/azure).

For documentation specific to the Azure SDK Node.js packages, see the [Azure Node SDK Reference](https://docs.microsoft.com/en-us/javascript/api/overview/azure).

## Usage

To install an individual Node.js package, look up the [package name](#azure-service-modules) and use npm to install it into your project.

For example to install the Storage package, you would run:

```shell
$ npm install azure-storage
```

Note: You can install all the packages in this SDK by using `npm install azure`. This will include [helper](#base-libraries) modules (`ms-rest-azure`) as well as all of the individual modules. This organization method also allows for submodules (and peer dependent modules) to always be in sync with each other.

## Supported services

This SDK has support for:

- Azure services (packages with the naming convention of `azure-<servicename>`).
- [ARM services](#azure-resource-management-arm) (packages with the naming convention of `azure-arm-*`)
- Legacy [ASM services](#azure-service-management-asm) (packages with the naming convention of `azure-asm-*`)

## Documentation

Documentation of the supported SDKs can be found at two places:

- [https://azure.github.io/azure-sdk-for-node](https://azure.github.io/azure-sdk-for-node) - This website primarily provides SDK documentation for
  - ASM based services (azure-**asm**-*)
  - Older data plane SDKs like `azure-sb`, `azure-scheduler`, `azure-storage-legacy`, `azure-monitoring`, etc.
  - Runtime SDKs like `ms-rest`, `ms-rest-azure`, `azure-common`
- [https://aka.ms/azure-node-sdk](https://aka.ms/azure-node-sdk) - This website primarily provides SDK documentation for
  - ARM based services (azure-**arm**-*)
  - Newer data plane SDKs like `azure-batch`, `azure-graph`, etc.

## Authenticating

There are three ways to authenticate against Azure while using the management plane (azure-**arm**-*) SDKs and the `azure-graph` SDK, use
[this guide](./Documentation/Authentication.md) to determine which method to use.

## Azure service modules

| **Package** | **Description** | **Documentation** |
| -------------| ---------------| ----------------- |
| [azure-gallery](https://www.npmjs.com/package/azure-gallery) | Access to the [Azure Marketplace](https://azure.microsoft.com/en-us/marketplace/)| [azure-gallery package](https://docs.microsoft.com/en-us/javascript/api/azure-gallery)|
| [azure-graph](https://www.npmjs.com/package/azure-graph) | Access to [Azure Active Directory](https://azure.microsoft.com/en-us/services/active-directory/) | [Azure Active Directory modules](https://docs.microsoft.com/en-us/javascript/api/overview/azure/activedirectory)|
| [azure-keyvault](https://www.npmjs.com/package/azure-keyvault) | Integrate with [Key Vault](https://azure.microsoft.com/en-us/services/key-vault/)| [Azure Key Vault modules](https://docs.microsoft.com/en-us/javascript/api/overview/azure/key-vault)|
| [azure-monitoring](https://www.npmjs.com/package/azure-monitoring) | [Azure Monitoring](https://docs.microsoft.com/azure/monitoring-and-diagnostics/monitoring-overview) | [azure-monitoring package](https://docs.microsoft.com/en-us/javascript/api/azure-monitoring) |
| [azure-scheduler](https://www.npmjs.com/package/azure-scheduler) | Create jobs with [Azure Scheduler](https://azure.microsoft.com/en-us/services/scheduler/) | [Azure Scheduler modules](https://docs.microsoft.com/en-us/javascript/api/overview/azure/scheduler)|
| [azure-servicefabric](https://www.npmjs.com/package/azure-servicefabric) | [Azure Service Fabric](https://azure.microsoft.com/en-us/services/service-fabric/) | [Azure Service Fabric modules](https://docs.microsoft.com/en-us/javascript/api/overview/azure/service-fabric) |
| [azure-sb](https://www.npmjs.com/package/azure-sb) | [Service Bus](https://azure.microsoft.com/en-us/services/service-bus/) | [Azure Service Bus modules](https://docs.microsoft.com/en-us/javascript/api/overview/azure/service-bus)|
| [azure-storage](https://www.npmjs.com/package/azure-storage) | [Storage](https://azure.microsoft.com/en-us/services/storage/) | [Azure Storage modules](https://docs.microsoft.com/javascript/api/overview/azure/storage)|
| [azure-batch](https://www.npmjs.com/package/azure-batch)| [Azure Batch](https://azure.microsoft.com/en-us/services/batch/) processing | [azure-batch package](https://docs.microsoft.com/en-us/javascript/api/azure-batch)|

>Note: If there is a Microsoft Azure service that doesn't have a package yet, [open an issue](https://github.com/Azure/azure-sdk-for-node/issues) so that we may prioritize it in the backlog.

## Azure Resource Management (ARM)

| **Service** | **Install Command** |
| --- | --- |
| [Advisor](https://docs.microsoft.com/en-us/rest/api/advisor/) | `npm install azure-arm-advisor`    |
| [API Management](https://docs.microsoft.com/en-us/rest/api/apimanagement/) | `npm install azure-arm-apimanagement`    |
| [App Insights](https://docs.microsoft.com/en-us/rest/api/application-insights/) | `npm install azure-arm-appinsights`    |
| [Automation](https://docs.microsoft.com/en-us/azure/automation/) | `npm install azure-arm-automation`    |
| [Authorization](https://azure.microsoft.com/en-us/documentation/articles/role-based-access-control-configure/) | `npm install azure-arm-authorization`    |
| [Batch](https://azure.microsoft.com/en-us/services/batch/)                        | `npm install azure-arm-batch`     |
| [Batch AI](https://docs.microsoft.com/en-us/azure/batch-ai/)                       | `npm install azure-arm-batchai`   |
| [Billing](https://docs.microsoft.com/en-us/azure/billing/billing-usage-rate-card-overview) | `npm install azure-arm-billing`    |
| [CDN](https://azure.microsoft.com/en-us/services/cdn/)                            | `npm install azure-arm-cdn`|
| [CognitiveServices](https://azure.microsoft.com/en-us/services/cognitive-services/) | `npm install azure-arm-cognitiveservices`    |
| [ContainerInstance](https://docs.microsoft.com/en-us/rest/api/container-instances/) | `npm install azure-arm-containerinstance`    |
| [CosmosDB](https://docs.microsoft.com/en-us/rest/api/documentdbresourceprovider/) | `npm install azure-arm-cosmosdb`    |
| [Commerce/Usage](https://azure.microsoft.com/en-us/documentation/articles/billing-usage-rate-card-overview/)                            | `npm install azure-arm-commerce`|
| [Container Registry](https://azure.microsoft.com/en-us/services/container-registry/)                            | `npm install azure-arm-containerregistry`|
| [CustomerInsights](https://docs.microsoft.com/en-us/dynamics365/customer-insights/ref/progref) | `npm install azure-arm-customerinsights`    |
| [Compute](https://azure.microsoft.com/en-us/services/virtual-machines/)            | `npm install azure-arm-compute`|
| [Datafactory](https://azure.microsoft.com/en-us/services/datafactory/) | `npm install azure-arm-datafactory`    |
| [Data Lake Analytics](https://azure.microsoft.com/en-us/services/data-lake-analytics/) | `npm install azure-arm-datalake-analytics`       |
| [Data Lake Store](https://azure.microsoft.com/en-us/services/data-lake-store/)   | `npm install azure-arm-datalake-store`       |
| [DevTest Labs](https://azure.microsoft.com/en-us/services/devtest-lab/)           | `npm install azure-arm-devtestlabs`       |
| [DNS](https://azure.microsoft.com/en-us/services/dns/)                             | `npm install azure-arm-dns`       |
| [DomainServices](https://docs.microsoft.com/en-us/azure/active-directory-domain-services/) | `npm install azure-arm-domainservices`    |
| [EventGrid](https://azure.microsoft.com/en-us/services/eventgrid/) | `npm install azure-arm-eventgrid`    |
| [EventHubs](https://azure.microsoft.com/en-us/services/event-hubs/)               | `npm install azure-arm-eventhub`  |
| [HDInsight](https://azure.microsoft.com/en-us/services/hdinsight/)                 | `npm install azure-arm-hdinsight` |
| [HDInsightJobs](https://msdn.microsoft.com/en-us/library/azure/mt613023.aspx)     | `npm install azure-arm-hdinsight-jobs` |
| [Insights](https://msdn.microsoft.com/en-us/library/azure/dn931943.aspx)          | `npm install azure-arm-insights`  |
| [IotHub](https://azure.microsoft.com/en-us/documentation/services/iot-hub/)       | `npm install azure-arm-iothub`  |
| [Key Vault](https://azure.microsoft.com/en-us/services/key-vault/)                 | `npm install azure-arm-keyvault`  |
| [Logic Apps](https://azure.microsoft.com/en-us/services/logic-apps/)           | `npm install azure-arm-logic`       |
| [Machine Learning](https://azure.microsoft.com/en-us/services/machine-learning/)           | `npm install azure-arm-machinelearning`       |
| [Machine Learning Compute](https://azure.microsoft.com/en-us/services/machine-learning/)           | `npm install azure-arm-machinelearningcompute`       |
| [Media Services](https://azure.microsoft.com/en-us/services/media-services/)           | `npm install azure-arm-mediaservices`       |
| [Mobile Engagement](https://docs.microsoft.com/en-us/azure/mobile-engagement/)           | `npm install azure-arm-mobileengagement`       |
| [Monitor Management](https://docs.microsoft.com/en-us/rest/api/monitor/)           | `npm install azure-arm-monitor`       |
| [Notification Hubs](https://azure.microsoft.com/en-us/documentation/services/notification-hubs/)                 | `npm install azure-arm-notificationhubs`  |
| [Operations Management](https://docs.microsoft.com/en-us/azure/operations-management-suite/)           | `npm install azure-arm-operations`       |
| [Operational Insights](https://azure.microsoft.com/en-us/resources/videos/azure-operational-insights-overview/)           | `npm install azure-arm-operationalinsights`       |
| [PowerBi Embedded](https://azure.microsoft.com/en-us/services/power-bi-embedded/) | `npm install azure-arm-powerbiembedded`  |
| [RecoveryServices](https://azure.microsoft.com/en-us/services/site-recovery/)                             | `npm install azure-arm-recoveryservices`       |
| [RecoveryServices Backup](https://azure.microsoft.com/en-us/services/site-recovery/)                             | `npm install azure-arm-recoveryservicesbackup`       |
| [RecoveryServices SiteRecovery](https://docs.microsoft.com/en-us/rest/api/site-recovery/)           | `npm install azure-arm-recoveryservices-siterecovery`       |
| [Redis Cache](https://azure.microsoft.com/en-us/services/cache/)                  | `npm install azure-arm-rediscache`   |
| [Relay](https://docs.microsoft.com/en-us/azure/service-bus-relay/relay-what-is-it)                  | `npm install azure-arm-relay`   |
| [Resource Health](https://docs.microsoft.com/en-us/rest/api/resourcehealth/)                  | `npm install azure-arm-resourcehealth`   |
| [Resource Manager](https://azure.microsoft.com/en-us/documentation/articles/resource-group-overview/)    | `npm install azure-arm-resource`  |
| [Scheduler](https://azure.microsoft.com/en-us/documentation/articles/resource-group-overview/)    | `npm install azure-arm-scheduler`  |
| [Search](https://azure.microsoft.com/en-us/services/search/)    | `npm install azure-arm-search`  |
| [ServerManagement](https://azure.microsoft.com/en-us/documentation/articles/resource-group-overview/)    | `npm install azure-arm-servermanagement`  |
| [Servicebus](https://msdn.microsoft.com/en-us/library/mt639375.aspx)    | `npm install azure-arm-sb`  |
| [Service Fabric](https://azure.microsoft.com/en-us/services/service-fabric/)    | `npm install azure-arm-servicefabric`  |
| [Storage](https://azure.microsoft.com/en-us/services/storage/)                     | `npm install azure-arm-storage`   |
| [Storage Import-Export](https://docs.microsoft.com/en-us/azure/storage/storage-import-export-service)                     | `npm install azure-arm-storageimportexport`   |
| [StorSimple 8000 series](https://docs.microsoft.com/en-us/azure/storsimple/storsimple-overview)                     | `npm install azure-arm-storsimple8000series`   |
| [Stream Analytics](https://docs.microsoft.com/en-us/rest/api/streamanalytics/)                     | `npm install azure-arm-streamanalytics`   |
| [SQL](https://azure.microsoft.com/en-us/services/sql-database/)                     | `npm install azure-arm-sql`   |
| [Traffic Manager](https://azure.microsoft.com/en-us/services/traffic-manager/)     | `npm install azure-arm-trafficmanager`|
| [Virtual Networks](https://azure.microsoft.com/en-us/services/virtual-network/)    | `npm install azure-arm-network`   |
| [Visual Studio](https://docs.microsoft.com/en-us/rest/api/)    | `npm install azure-arm-visualstudio`   |
| [WebApps (WebSites)](https://azure.microsoft.com/en-us/services/app-service/web/)  | `npm install azure-arm-website`   |

## Azure Service Management (ASM)

| **Service** | **Install Command** |
| --- | --- |
| [Compute](https://azure.microsoft.com/en-us/services/virtual-machines/)            |  `npm install azure-asm-compute`  |
| [HDInsight](https://azure.microsoft.com/en-us/services/hdinsight/)                 | `npm install azure-asm-hdinsight` |
| [Service Bus](https://azure.microsoft.com/en-us/services/service-bus/)             | `npm install azure-asm-sb`        |
| [Service Manager](https://msdn.microsoft.com/en-us/library/azure/ee460799.aspx)   | `npm install azure-asm-mgmt`      |
| [Store](https://azure.microsoft.com/en-us/marketplace/)                            | `npm install azure-asm-store`     |
| [Scheduler](https://azure.microsoft.com/en-us/services/scheduler/)                 | `npm install azure-asm-scheduler` |
| [SQL Database](https://azure.microsoft.com/en-us/services/sql-database/)           | `npm install azure-asm-sql`       |
| [Storage](https://azure.microsoft.com/en-us/services/storage/)                     | `npm install azure-asm-storage`   |
| [Subscriptions](https://msdn.microsoft.com/en-us/library/azure/gg715315.aspx)     | `npm install azure-asm-subscription`|
| [Traffic Manager](https://azure.microsoft.com/en-us/services/traffic-manager/)     | `npm install azure-asm-trafficmanager`  |
| [Virtual Networks](https://azure.microsoft.com/en-us/services/virtual-network/)    | `npm install azure-asm-network`   |
| [WebSites](https://azure.microsoft.com/en-us/services/app-service/web/)            | `npm install azure-asm-website`   |

## Base Libraries

| **Library** | **Install Command** |
| --- | --- |
| Common Functionality (for ASM & ARM clients)                                      | `npm install azure-common`        |
| Common Functionality for ARM clients generated from Autorest (Generic)            | `npm install ms-rest`             |
| Common Functionality for ARM clients generated from Autorest (Azure)              | `npm install ms-rest-azure`       |

## Need Help?

* [Read the docs](https://aka.ms/azure-node-sdk)
* [Open an issue in GitHub](https://github.com/azure/azure-sdk-for-node)
* [Microsoft Azure Forums on MSDN and Stack Overflow](https://go.microsoft.com/fwlink/?LinkId=234489)

## Related Projects

* [Azure CLI](https://github.com/azure/azure-cli)

## License

This project is licensed under MIT and Apache-2.0.

- "MIT" license is usually used for the client libraries generated using [Autorest](https://github.com/Azure/Autorest) that are targeting ARM (V2 version of Azure REST API). The license can be found in "LICENSE.MIT.txt" file in this repository.
- "Apache-2.0" license is usually used for the client libraries generated using an internal code generator that are targeting ASM (V1 version of Azure REST API). The license can be found in "LICENSE.Apache.txt" file in this repository.

## Contribute

This project has adopted the [Microsoft Open Source Code of Conduct](https://opensource.microsoft.com/codeofconduct/).

For more information see the [Code of Conduct FAQ](https://opensource.microsoft.com/codeofconduct/faq/) or contact [opencode@microsoft.com](mailto:opencode@microsoft.com) with any additional questions or comments.

If you would like to become an active contributor to this project please follow the instructions provided in [Microsoft Open Source Guidelines](https://opensource.microsoft.com/resources).

### Getting Started Developing

Want to get started hacking on the code, super! Follow the following instructions to get up and running. These
instructions expect you have Git and a supported version of Node installed.

1. Fork it
2. Git Clone your fork (`git clone {your repo}`)
3. Move into SDK directory (`cd azure-sdk-for-node`)
4. Install all dependencies (`npm install`)
5. Run the tests (`npm test`). You should see all tests passing.

### Contributing Code to the Project

You found something you'd like to change, great! Please submit a pull request and we'll do our best to work with you to
get your code included into the project.

1. Commit your changes (`git commit -am 'Add some feature'`)
2. Push to the branch (`git push origin my-new-feature`)
3. Create new Pull Request