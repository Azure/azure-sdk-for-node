---
uid: azure-arm-mariadb
summary: *content

---
**This SDK will be deprecated next year and will be replaced by a new TypeScript-based isomorphic SDK (found at https://www.npmjs.com/package/@azure/arm-mariadb) which works on Node.js and browsers.**
**See https://aka.ms/azure-sdk-for-js-migration to learn more.**
## Microsoft Azure SDK for Node.js - MariaDBManagementClient

This project provides a Node.js package for accessing Azure. Right now it supports:
- **Node.js version 6.x.x or higher**

### Features


### How to Install

```bash
npm install azure-arm-mariadb
```

### How to use

#### Authentication, client creation, and get servers as an example.

```javascript
const msRestAzure = require("ms-rest-azure");
const MariaDBManagementClient = require("azure-arm-mariadb");
msRestAzure.interactiveLogin().then((creds) => {
  const subscriptionId = "<Subscription_Id>";
  const client = new MariaDBManagementClient(creds, subscriptionId);
  const resourceGroupName = "testresourceGroupName";
  const serverName = "testserverName";

  return client.servers.get(resourceGroupName, serverName).then((result) => {
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


![Impressions](https://azure-sdk-impressions.azurewebsites.net/api/impressions/azure-sdk-for-node%2Flib%2Fservices%2FmariadbManagement%2FREADME.png)
