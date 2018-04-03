---
uid: azure-arm-batch
summary: *content

---
# Microsoft Azure SDK for Node.js - BatchManagementClient
This project provides a Node.js package for accessing Azure. Right now it supports:
- **Node.js version 6.x.x or higher**

## Features


## How to Install

```bash
npm install azure-arm-batch
```

## How to use

### Authentication, client creation and get batchAccount as an example.

```javascript
const msRestAzure = require("ms-rest-azure");
const BatchManagementClient = require("azure-arm-batch");
msRestAzure.interactiveLogin().then((creds) => {
    const subscriptionId = "<Subscription_Id>";
    const client = new BatchManagementClient(creds, subscriptionId);
    const resourceGroupName = "testresourceGroupName";
    const accountName = "testaccountName";
    return client.batchAccount.get(resourceGroupName, accountName).then((result) => {
      console.log("The result is:");
      console.log(result);
    });
}).catch((err) => {
  console.log('An error occurred:');
  console.dir(err, {depth: null, colors: true});
});

## Related projects

- [Microsoft Azure SDK for Node.js](https://github.com/Azure/azure-sdk-for-node)
