---
uid: azure-arm-engagementfabric
summary: *content

---
**This SDK will be deprecated next year and will be replaced by a new TypeScript-based isomorphic SDK (found at https://github.com/Azure/azure-sdk-for-js) which works on Node.js and browsers.**
## Microsoft Azure SDK for Node.js - EngagementFabric
This project provides a Node.js package for accessing Azure. Right now it supports:
- **Node.js version 6.x.x or higher**

### Features


### How to Install

```bash
npm install azure-arm-engagementfabric
```

### How to use

#### Authentication, client creation and get accounts as an example.

```javascript
const msRestAzure = require("ms-rest-azure");
const EngagementFabric = require("azure-arm-engagementfabric");
msRestAzure.interactiveLogin().then((creds) => {
    const subscriptionId = "<Subscription_Id>";
    const client = new EngagementFabric(creds, subscriptionId);
    const resourceGroupName = "testresourceGroupName";
    const accountName = "testaccountName";
    return client.accounts.get(resourceGroupName, accountName).then((result) => {
      console.log("The result is:");
      console.log(result);
    });
}).catch((err) => {
  console.log('An error occurred:');
  console.dir(err, {depth: null, colors: true});
});

### Related projects

- [Microsoft Azure SDK for Node.js](https://github.com/Azure/azure-sdk-for-node)
