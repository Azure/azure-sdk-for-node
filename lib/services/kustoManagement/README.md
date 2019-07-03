---
uid: azure-arm-kusto
summary: *content

---
**This SDK will be deprecated next year and will be replaced by a new TypeScript-based isomorphic SDK (found at https://www.npmjs.com/package/@azure/arm-kusto) which works on Node.js and browsers.**
**See https://aka.ms/azure-sdk-for-js-migration to learn more.**
## Microsoft Azure SDK for Node.js - KustoManagementClient

This project provides a Node.js package for accessing Azure. Right now it supports:
- **Node.js version 6.x.x or higher**

### Features


### How to Install

```bash
npm install azure-arm-kusto
```

### How to use

#### Authentication, client creation, and get clusters as an example.

```javascript
const msRestAzure = require("ms-rest-azure");
const KustoManagementClient = require("azure-arm-kusto");
msRestAzure.interactiveLogin().then((creds) => {
  const subscriptionId = "<Subscription_Id>";
  const client = new KustoManagementClient(creds, subscriptionId);
  const resourceGroupName = "testresourceGroupName";
  const clusterName = "testclusterName";

  return client.clusters.get(resourceGroupName, clusterName).then((result) => {
    console.log("The result is:");
    console.log(result);
  });
}).catch((err) => {
  console.log('An error occurred:');
  console.dir(err, {depth: null, colors: true});
});
```
### Related projects

- [Microsoft Azure SDK for Node.js](https://github.com/Azure/azure-sdk-for-node)


![Impressions](https://azure-sdk-impressions.azurewebsites.net/api/impressions/azure-sdk-for-node%2Flib%2Fservices%2FkustoManagement%2FREADME.png)
