---
uid: azure-arm-servicemap
summary: *content

---
**This SDK will be deprecated next year and will be replaced by a new TypeScript-based isomorphic SDK (found at https://github.com/Azure/azure-sdk-for-js) which works on Node.js and browsers.**
## Microsoft Azure SDK for Node.js - ServicemapManagementClient
This project provides a Node.js package for accessing Azure. Right now it supports:
- **Node.js version 6.x.x or higher**

### Features


### How to Install

```bash
npm install azure-arm-servicemap
```

### How to use

#### Authentication, client creation and listByWorkspace machines as an example.

```javascript
const msRestAzure = require("ms-rest-azure");
const ServicemapManagementClient = require("azure-arm-servicemap");
msRestAzure.interactiveLogin().then((creds) => {
    const subscriptionId = "<Subscription_Id>";
    const client = new ServicemapManagementClient(creds, subscriptionId);
    const resourceGroupName = "testresourceGroupName";
    const workspaceName = "testworkspaceName";
    const live = true;
    const startTime = new Date().toISOString();
    const endTime = new Date().toISOString();
    const timestamp = new Date().toISOString();
    const top = 1;
    return client.machines.listByWorkspace(resourceGroupName, workspaceName, live, startTime, endTime, timestamp, top).then((result) => {
      console.log("The result is:");
      console.log(result);
    });
}).catch((err) => {
  console.log('An error occurred:');
  console.dir(err, {depth: null, colors: true});
});

### Related projects

- [Microsoft Azure SDK for Node.js](https://github.com/Azure/azure-sdk-for-node)
