---
uid: azure-arm-recoveryservicesbackup
summary: *content

---
# Microsoft Azure SDK for Node.js - RecoveryServicesBackupClient
This project provides a Node.js package for accessing Azure. Right now it supports:
- **Node.js version 6.x.x or higher**

## Features


## How to Install

```bash
npm install azure-arm-recoveryservicesbackup
```

## How to use

### Authentication, client creation and get protectionIntent as an example.

```javascript
const msRestAzure = require("ms-rest-azure");
const RecoveryServicesBackupClient = require("azure-arm-recoveryservicesbackup");
msRestAzure.interactiveLogin().then((creds) => {
    const subscriptionId = "<Subscription_Id>";
    const client = new RecoveryServicesBackupClient(creds, subscriptionId);
    const vaultName = "testvaultName";
    const resourceGroupName = "testresourceGroupName";
    const fabricName = "testfabricName";
    const intentObjectName = "testintentObjectName";
    return client.protectionIntent.get(vaultName, resourceGroupName, fabricName, intentObjectName).then((result) => {
      console.log("The result is:");
      console.log(result);
    });
}).catch((err) => {
  console.log('An error occurred:');
  console.dir(err, {depth: null, colors: true});
});

## Related projects

- [Microsoft Azure SDK for Node.js](https://github.com/Azure/azure-sdk-for-node)
