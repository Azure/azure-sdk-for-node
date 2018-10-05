---
uid: azure-arm-deploymentmanager
summary: *content

---
# Microsoft Azure SDK for Node.js - AzureDeploymentManager
This project provides a Node.js package for accessing Azure. Right now it supports:
- **Node.js version 6.x.x or higher**

## Features


## How to Install

```bash
npm install azure-arm-deploymentmanager
```

## How to use

### Authentication, client creation and get serviceTopologies as an example.

```javascript
const msRestAzure = require("ms-rest-azure");
const AzureDeploymentManager = require("azure-arm-deploymentmanager");
msRestAzure.interactiveLogin().then((creds) => {
    const subscriptionId = "<Subscription_Id>";
    const client = new AzureDeploymentManager(creds, subscriptionId);
    const resourceGroupName = "testresourceGroupName";
    const serviceTopologyName = "testserviceTopologyName";
    return client.serviceTopologies.get(resourceGroupName, serviceTopologyName).then((result) => {
      console.log("The result is:");
      console.log(result);
    });
}).catch((err) => {
  console.log('An error occurred:');
  console.dir(err, {depth: null, colors: true});
});

## Related projects

- [Microsoft Azure SDK for Node.js](https://github.com/Azure/azure-sdk-for-node)
