# Azure SDK for Node.js

[![NPM version](https://badge.fury.io/js/azure.png)](http://badge.fury.io/js/azure) [![Build Status](https://travis-ci.org/Azure/azure-sdk-for-node.png?branch=master)](https://travis-ci.org/Azure/azure-sdk-for-node)

This project provides a Node.js package that makes it easy to consume and manage Microsoft Azure Services.
## Non-Interactive Authentication
If you need to create an automation account for non interactive or scripting scenarios then please take a look at the documentation over [here](./Documentation/Authentication.md).

## Install from npm

We provide both fine-grained modules for different Microsoft Azure services which you can install separately, and an all-up module which contains everything.

**Notice**: we haven't provided fine-grained modules for every supported Microsoft Azure services yet. This will come soon.

### Install the all-up module

```
npm install azure
```
&nbsp;

### Install individual modules

| **Azure Services**                                                                |
| :-----------------------------------------------------------------------------    | :---------------------------      |
| [Gallery](http://azure.microsoft.com/en-us/marketplace/)                          | `npm install azure-gallery`       |
| [Graph](https://azure.microsoft.com/en-us/services/active-directory/)             | `npm install azure-graph`         |
| [Key Vault](http://azure.microsoft.com/en-us/services/key-vault/)                 | `npm install azure-keyvault`      |
| [Monitoring](https://msdn.microsoft.com/library/azure/dn306639.aspx)              | `npm install azure-monitoring`    |
| [Scheduler](http://azure.microsoft.com/en-us/services/scheduler/)                 | `npm install azure-scheduler`     |
| [Service Fabric](https://azure.microsoft.com/en-us/services/service-fabric/)      | `npm install azure-servicefabric` |
| [Service Bus](http://azure.microsoft.com/en-us/services/service-bus/)             | `npm install azure-sb`            |
| [Storage](http://azure.microsoft.com/en-us/services/storage/)                     | `npm install azure-storage`       |
| [Batch](https://azure.microsoft.com/en-us/services/batch/)                        | `npm install azure-batch`         |
| &nbsp;                                                                            |                                   |
| **Azure Resource Management (ARM)**                                                                                         |
| [API Apps](http://azure.microsoft.com/en-us/services/app-service/api/)            | `npm install azure-arm-apiapp`    |
| [Authorization](https://azure.microsoft.com/en-us/documentation/articles/role-based-access-control-configure/) | `npm install azure-arm-authorization`    |
| [CDN](https://azure.microsoft.com/en-us/services/cdn/)                            | `npm install azure-arm-cdn`|
| [Compute](http://azure.microsoft.com/en-us/services/virtual-machines/)            | `npm install azure-arm-compute`|
| [Datalake Analytics](https://azure.microsoft.com/en-us/services/data-lake-analytics/) | `azure-arm-datalake-analytics`       |
| [Datalake Storage](https://azure.microsoft.com/en-us/services/data-lake-store/)   | `azure-arm-datalake-storage`       |
| [DNS](http://azure.microsoft.com/en-us/services/dns/)                             | `npm install azure-arm-dns`       |
| [Insights](https://msdn.microsoft.com/en-us/library/azure/dn931943.aspx)          | `npm install azure-arm-insights`  |
| [Key Vault](http://azure.microsoft.com/en-us/services/key-vault/)                 | `npm install azure-arm-keyvault`  |
| [Redis Cache](https://azure.microsoft.com/en-us/services/cache/)                  | `npm install azure-arm-rediscache`   |
| [Resource Manager](https://azure.microsoft.com/en-us/documentation/articles/resource-group-overview/)    | `npm install azure-arm-resource`  |
| [Storage](http://azure.microsoft.com/en-us/services/storage/)                     | `npm install azure-arm-storage`   |
| [Traffic Manager](http://azure.microsoft.com/en-us/services/traffic-manager/)     | `npm install azure-arm-trafficManager`|
| [Virtual Networks](http://azure.microsoft.com/en-us/services/virtual-network/)    | `npm install azure-arm-network`   |
| [WebApps (WebSites)](http://azure.microsoft.com/en-us/services/app-service/web/)  | `npm install azure-arm-website`   |
| [Batch](https://azure.microsoft.com/en-us/services/batch/)                        | `npm install azure-arm-batch`     |
| &nbsp;                                                                            |                                   |
| **Azure Service Management (ASM)**                                                                                          |
| [Compute](http://azure.microsoft.com/en-us/services/virtual-machines/)            |  `npm install azure-asm-compute`  |
| [HDInsight](http://azure.microsoft.com/en-us/services/hdinsight/)                 | `npm install azure-asm-hdinsight` |
| [Service Bus](http://azure.microsoft.com/en-us/services/service-bus/)             | `npm install azure-asm-sb`        |
| [Service Manager](https://msdn.microsoft.com/en-us/library/azure/ee460799.aspx)   | `npm install azure-asm-mgmt`      |
| [Store](http://azure.microsoft.com/en-us/marketplace/)                            | `npm install azure-asm-store`     |
| [Scheduler](http://azure.microsoft.com/en-us/services/scheduler/)                 | `npm install azure-asm-scheduler` |
| [SQL Database](http://azure.microsoft.com/en-us/services/sql-database/)           | `npm install azure-asm-sql`       |
| [Storage](http://azure.microsoft.com/en-us/services/storage/)                     | `npm install azure-asm-storage`   |
| [Subscriptions](https://msdn.microsoft.com/en-us/library/azure/gg715315.aspx)     | `npm install azure-asm-subscription`|
| [Traffic Manager](http://azure.microsoft.com/en-us/services/traffic-manager/)     | `npm install azure-asm-trafficManager`  |
| [Virtual Networks](http://azure.microsoft.com/en-us/services/virtual-network/)    | `npm install azure-asm-network`   |
| [WebSites](http://azure.microsoft.com/en-us/services/app-service/web/)            | `npm install azure-asm-website`   |
| &nbsp;                                                                            |                                   |
| **Base Libraries**                                                                |                                   |
| Common Functionality (for ASM & ARM clients generated from old code generator)    | `npm install azure-common`        |
| Common Functionality for ARM clients generated from Autorest (Generic)            | `npm install ms-rest`             |
| Common Functionality for ARM clients generated from Autorest (Azure)              | `npm install ms-rest-azure`       |

## Need Help?

* [Read the docs](http://azure.github.io/azure-sdk-for-node)
* [Open an issue in GitHub](http://github.com/azure/azure-sdk-for-node)
* [Microsoft Azure Forums on MSDN and Stack Overflow](http://go.microsoft.com/fwlink/?LinkId=234489)

## Related Projects

* [Azure CLI](http://github.com/azure/azure-xplat-cli)

## Contribute

* If you would like to become an active contributor to this project please follow the instructions provided in [Microsoft Azure Projects Contribution Guidelines](http://azure.github.io/guidelines/).

### Getting Started Developing
Want to get started hacking on the code, super! Follow the following instructions to get up and running. These
instructions expect you have Git and a supported version of Node installed.

1. Fork it
2. Git Clone your fork (`git clone {your repo}`)
3. Move into sdk directory (`cd azure-sdk-for-node`)
4. Install all dependencies (`npm install`)
5. Run the tests (`npm test`). You should see all tests passing.

### Contributing Code to the Project
You found something you'd like to change, great! Please submit a pull request and we'll do our best to work with you to
get your code included into the project.

1. Commit your changes (`git commit -am 'Add some feature'`)
2. Push to the branch (`git push origin my-new-feature`)
3. Create new Pull Request
