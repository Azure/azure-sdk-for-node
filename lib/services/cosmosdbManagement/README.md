---
uid: azure-arm-cosmosdb
summary: *content

---
# Microsoft Azure SDK for Node.js - CosmosDBManagementClient
This project provides a Node.js package for accessing Azure. Right now it supports:
- **Node.js version 6.x.x or higher**

## Features


## How to Install

```bash
npm install azure-arm-cosmosdb
```

## How to use

### Authentication, client creation and get databaseAccounts as an example.

```javascript
const msRestAzure = require("ms-rest-azure");
const CosmosDBManagementClient = require("azure-arm-cosmosdb");
msRestAzure.interactiveLogin().then((creds) => {
    const subscriptionId = "<Subscription_Id>";
    const client = new CosmosDBManagementClient(creds, subscriptionId);
    const resourceGroupName = "testresourceGroupName";
    const accountName = "testaccountName";
    return client.databaseAccounts.get(resourceGroupName, accountName).then((result) => {
      console.log("The result is:");
      console.log(result);
    });
}).catch((err) => {
  console.log('An error ocurred:');
  console.dir(err, {depth: null, colors: true});
});

## Related projects

- [Microsoft Azure SDK for Node.js](https://github.com/Azure/azure-sdk-for-node)
