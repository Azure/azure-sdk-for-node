---
uid: azure-arm-machinelearningcompute
summary: *content

---
# Microsoft Azure SDK for Node.js - MachineLearningComputeManagementClient
This project provides a Node.js package for accessing Azure. Right now it supports:
- **Node.js version 6.x.x or higher**

## Features


## How to Install

```bash
npm install azure-arm-machinelearningcompute
```

## How to use

### Authentication, client creation and get operationalizationClusters as an example.

```javascript
const msRestAzure = require("ms-rest-azure");
const MachineLearningComputeManagementClient = require("azure-arm-machinelearningcompute");
msRestAzure.interactiveLogin().then((creds) => {
    const subscriptionId = "<Subscription_Id>";
    const client = new MachineLearningComputeManagementClient(creds, subscriptionId);
    const resourceGroupName = "testresourceGroupName";
    const clusterName = "testclusterName";
    return client.operationalizationClusters.get(resourceGroupName, clusterName).then((result) => {
      console.log("The result is:");
      console.log(result);
    });
}).catch((err) => {
  console.log('An error occurred:');
  console.dir(err, {depth: null, colors: true});
});

## Related projects

- [Microsoft Azure SDK for Node.js](https://github.com/Azure/azure-sdk-for-node)
