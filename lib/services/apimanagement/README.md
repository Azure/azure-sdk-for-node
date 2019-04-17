---
uid: azure-arm-apimanagement
summary: *content

---
**This SDK will be deprecated next year and will be replaced by a new TypeScript-based isomorphic SDK (found at https://www.npmjs.com/package/@azure/arm-apimanagement) which works on Node.js and browsers.**
**See https://aka.ms/azure-sdk-for-js-migration to learn more.**
## Microsoft Azure SDK for Node.js - ApiManagementClient

This project provides a Node.js package for accessing Azure. Right now it supports:
- **Node.js version 6.x.x or higher**

### Features


### How to Install

```bash
npm install azure-arm-apimanagement
```

### How to use

#### Authentication, client creation, and listByService api as an example.

```javascript
const msRestAzure = require("ms-rest-azure");
const ApiManagementClient = require("azure-arm-apimanagement");
msRestAzure.interactiveLogin().then((creds) => {
  const subscriptionId = "<Subscription_Id>";
  const client = new ApiManagementClient(creds, subscriptionId);
  const resourceGroupName = "testresourceGroupName";
  const serviceName = "testserviceName";
  const filter = "testfilter";
  const top = 1;
  const skip = 1;
  const tags = "testtags";
  const expandApiVersionSet = true;

  return client.api.listByService(resourceGroupName, serviceName, filter, top, skip, tags, expandApiVersionSet).then((result) => {
    console.log("The result is:");
    console.log(result);
  });
}).catch((err) => {
  console.log('An error occurred:');
  console.dir(err, {depth: null, colors: true});
});
```
### Related projects

- [Microsoft Azure SDK for Node.js](https://github.com/Azure/azure-sdk-for-node)
