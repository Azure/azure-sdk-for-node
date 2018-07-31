---
uid: azure-arm-devspaces
summary: *content

---
# Microsoft Azure SDK for Node.js - DevSpacesManagementClient
This project provides a Node.js package for accessing Azure. Right now it supports:
- **Node.js version 6.x.x or higher**

## Features


## How to Install

```bash
npm install azure-arm-devspaces
```

## How to use

### Authentication, client creation and get controllers as an example.

```javascript
const msRestAzure = require("ms-rest-azure");
const DevSpacesManagementClient = require("azure-arm-devspaces");
msRestAzure.interactiveLogin().then((creds) => {
    const subscriptionId = "<Subscription_Id>";
    const client = new DevSpacesManagementClient(creds, subscriptionId);
    const resourceGroupName = "testresourceGroupName";
    const name = "testname";
    return client.controllers.get(resourceGroupName, name).then((result) => {
      console.log("The result is:");
      console.log(result);
    });
}).catch((err) => {
  console.log('An error occurred:');
  console.dir(err, {depth: null, colors: true});
});

## Related projects

- [Microsoft Azure SDK for Node.js](https://github.com/Azure/azure-sdk-for-node)
