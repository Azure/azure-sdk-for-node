---
uid: azure-arm-operations
summary: *content

---
# Microsoft Azure SDK for Node.js - OperationsManagementClient
This project provides a Node.js package for accessing Azure. Right now it supports:
- **Node.js version 6.x.x or higher**

## Features


## How to Install

```bash
npm install azure-arm-operations
```

## How to use

### Authentication, client creation and get solutions as an example.

```javascript
const msRestAzure = require("ms-rest-azure");
const OperationsManagementClient = require("azure-arm-operations");
msRestAzure.interactiveLogin().then((creds) => {
    const subscriptionId = "<Subscription_Id>";
    const client = new OperationsManagementClient(creds, subscriptionId);
    const resourceGroupName = "testresourceGroupName";
    const solutionName = "testsolutionName";
    return client.solutions.get(resourceGroupName, solutionName).then((result) => {
      console.log("The result is:");
      console.log(result);
    });
}).catch((err) => {
  console.log('An error occurred:');
  console.dir(err, {depth: null, colors: true});
});

## Related projects

- [Microsoft Azure SDK for Node.js](https://github.com/Azure/azure-sdk-for-node)
