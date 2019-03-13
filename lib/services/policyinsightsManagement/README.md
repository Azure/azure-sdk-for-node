---
uid: azure-arm-policyinsights
summary: *content

---
**This SDK will be deprecated next year and will be replaced by a new TypeScript-based isomorphic SDK (found at https://www.npmjs.com/package/@azure/arm-policyinsights) which works on Node.js and browsers.**
**See https://aka.ms/azure-sdk-for-js-migration to learn more.**
## Microsoft Azure SDK for Node.js - PolicyInsightsClient

This project provides a Node.js package for accessing Azure. Right now it supports:
- **Node.js version 6.x.x or higher**

### Features


### How to Install

```bash
npm install azure-arm-policyinsights
```

### How to use

#### Authentication, client creation, and listForManagementGroup remediations as an example.

```javascript
const msRestAzure = require("ms-rest-azure");
const PolicyInsightsClient = require("azure-arm-policyinsights");
msRestAzure.interactiveLogin().then((creds) => {
  const subscriptionId = "<Subscription_Id>";
  const client = new PolicyInsightsClient(creds, subscriptionId);
  const managementGroupId = "testmanagementGroupId";
  const top = 1;
  const filter = "testfilter";

  return client.remediations.listForManagementGroup(managementGroupId, top, filter).then((result) => {
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
