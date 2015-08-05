## Install from npm

We provide both fine-grained modules for different Microsoft Azure services which you can install separately, and an
all-up module which contains everything.

### Install the all-up module

`npm install azure`

**Note**: the all-up module will often lag behind the fine-grained modules. If you want the latest and greatest, include
the fine-grained modules individually.

### Install individual modules

| **Azure Services**                                                                |
| :-----------------------------------------------------------------------------    | :---------------------------      |
| [Gallery](http://azure.microsoft.com/en-us/marketplace/)                          | `npm install azure-gallery`       |
| [Key Vault](http://azure.microsoft.com/en-us/services/key-vault/)                 | `npm install azure-keyvault`      |
| [Monitoring](https://msdn.microsoft.com/library/azure/dn306639.aspx)              | `npm install azure-monitoring`    |
| [Scheduler](http://azure.microsoft.com/en-us/services/scheduler/)                 | `npm install azure-scheduler`     |
| [Service Bus](http://azure.microsoft.com/en-us/services/service-bus/)             | `npm install azure-sb`            |
| [Storage](http://azure.microsoft.com/en-us/services/storage/)                     | `npm install azure-storage`       |
| &nbsp;                                                                            |                                   |
| **Azure Resource Management**                                                                                         |
| [API Apps](http://azure.microsoft.com/en-us/services/app-service/api/)            | `npm install azure-arm-apiapp`    |
| [Authorization](https://azure.microsoft.com/en-us/documentation/articles/role-based-access-control-configure/) | `npm install azure-arm-authorization`    |
| [Compute](http://azure.microsoft.com/en-us/services/virtual-machines/)            | `npm install azure-arm-compute`|
| [Resource Manager](https://azure.microsoft.com/en-us/documentation/articles/resource-group-overview/)    | `npm install azure-arm-resource`  |
| [DNS](http://azure.microsoft.com/en-us/services/dns/)                             | `npm install azure-arm-dns`       |
| [Insights](https://msdn.microsoft.com/en-us/library/azure/dn931943.aspx)          | `npm install azure-arm-insights`  |
| [Key Vault](http://azure.microsoft.com/en-us/services/key-vault/)                 | `npm install azure-arm-keyvault`  |
| [Virtual Networks](http://azure.microsoft.com/en-us/services/virtual-network/)    | `npm install azure-arm-network`   |
| [Storage](http://azure.microsoft.com/en-us/services/storage/)                     | `npm install azure-arm-storage`   |
| [Traffic Manager](http://azure.microsoft.com/en-us/services/traffic-manager/)     | `npm install azure-arm-trafficManager`|
| [WebApps (WebSites)](http://azure.microsoft.com/en-us/services/app-service/web/)  | `npm install azure-arm-website`   |
| &nbsp;                                                                            |                                   |
| **Azure Service Management**                                                                                          |
| [Compute](http://azure.microsoft.com/en-us/services/virtual-machines/)            |  `npm install azure-asm-compute`  |
| [HDInsight](http://azure.microsoft.com/en-us/services/hdinsight/)                 | `npm install azure-asm-hdinsight` |
| [Service Bus](http://azure.microsoft.com/en-us/services/service-bus/)             | `npm install azure-asm-sb`        |
| [Service Manager](https://msdn.microsoft.com/en-us/library/azure/ee460799.aspx)   | `npm install azure-asm-mgmt`      |
| [Store](http://azure.microsoft.com/en-us/marketplace/)                            | `npm install azure-asm-store`     |
| [Scheduler](http://azure.microsoft.com/en-us/services/scheduler/)                 | `npm install azure-asm-scheduler` |
| [SQL Database](http://azure.microsoft.com/en-us/services/sql-database/)           | `npm install azure-asm-sql`       |
| [Storage](http://azure.microsoft.com/en-us/services/storage/)                     | `npm install azure-asm-storage`   |
| [Subscriptions](https://msdn.microsoft.com/en-us/library/azure/gg715315.aspx)     | `npm install azure-asm-subscription`|
| [Traffic Manager](http://azure.microsoft.com/en-us/services/traffic-manager/)     | `npm install azure-asm-trafficManager`|
| [Virtual Networks](http://azure.microsoft.com/en-us/services/virtual-network/)    | `npm install azure-asm-network`   |
| [WebSites](http://azure.microsoft.com/en-us/services/app-service/web/)            | `npm install azure-asm-website`   |
| &nbsp;                                                                            |                                   |
| **Base Libraries**                                                                |                                   |
| Common SDK Functionality                                                          | `npm install azure-common`        |
