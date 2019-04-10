---
uid: azure-arm-marketplaceordering
summary: *content

---
**This SDK will be deprecated next year and will be replaced by a new TypeScript-based isomorphic SDK (found at https://www.npmjs.com/package/@azure/arm-marketplaceordering) which works on Node.js and browsers.**
**See https://aka.ms/azure-sdk-for-js-migration to learn more.**
## Microsoft Azure SDK for Node.js - MarketplaceOrderingAgreements

This project provides a Node.js package for accessing Azure. Right now it supports:
- **Node.js version 6.x.x or higher**

### Features


### How to Install

```bash
npm install azure-arm-marketplaceordering
```

### How to use

#### Authentication, client creation, and get marketplaceAgreements as an example.

```javascript
const msRestAzure = require("ms-rest-azure");
const MarketplaceOrderingAgreements = require("azure-arm-marketplaceordering");
msRestAzure.interactiveLogin().then((creds) => {
  const subscriptionId = "<Subscription_Id>";
  const client = new MarketplaceOrderingAgreements(creds, subscriptionId);
  const publisherId = "testpublisherId";
  const offerId = "testofferId";
  const planId = "testplanId";

  return client.marketplaceAgreements.get(publisherId, offerId, planId).then((result) => {
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
