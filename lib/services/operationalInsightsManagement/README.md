---
uid: azure-arm-operationalinsights
summary: *content

---
# Microsoft Azure SDK for Node.js - OperationalInsightsManagementClient
This project provides a Node.js package for accessing Azure. Right now it supports:
- **Node.js version 6.x.x or higher**

## Features


## How to Install

```bash
npm install azure-arm-operationalinsights
```

## How to use

### Authentication, client creation and get linkedServices as an example.

```javascript
const msRestAzure = require("ms-rest-azure");
const OperationalInsightsManagementClient = require("azure-arm-operationalinsights");
msRestAzure.interactiveLogin().then((creds) => {
    const subscriptionId = "<Subscription_Id>";
    const client = new OperationalInsightsManagementClient(creds, subscriptionId);
    const resourceGroupName = "testresourceGroupName";
    const workspaceName = "testworkspaceName";
    const linkedServiceName = "testlinkedServiceName";
    return client.linkedServices.get(resourceGroupName, workspaceName, linkedServiceName).then((result) => {
      console.log("The result is:");
      console.log(result);
    });
}).catch((err) => {
  console.log('An error occurred:');
  console.dir(err, {depth: null, colors: true});
});

## Related projects

- [Microsoft Azure SDK for Node.js](https://github.com/Azure/azure-sdk-for-node)
