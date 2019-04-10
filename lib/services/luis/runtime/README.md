---
uid: azure-cognitiveservices-luis-runtime
summary: *content

---
**This SDK will be deprecated next year and will be replaced by a new TypeScript-based isomorphic SDK (found at https://www.npmjs.com/package/@azure/cognitiveservices-luis-runtime) which works on Node.js and browsers.**
**See https://aka.ms/azure-sdk-for-js-migration to learn more.**
## Microsoft Azure SDK for Node.js - LUISRuntimeClient

This project provides a Node.js package for accessing Azure. Right now it supports:
- **Node.js version 6.x.x or higher**

### Features


### How to Install

```bash
npm install azure-cognitiveservices-luis-runtime
```

### How to use

#### Authentication, client creation, and resolve prediction as an example.

```javascript
const msRest = require("ms-rest");
const LUISRuntimeClient = require("azure-cognitiveservices-luis-runtime");
const token = "<access_token>";
const creds = new msRest.TokenCredentials(token);
const subscriptionId = "<Subscription_Id>";
const client = new LUISRuntimeClient(creds, subscriptionId);
const appId = "testappId";
const query = "testquery";
const timezoneOffset = 1.01;
const verbose = true;
const staging = true;
const spellCheck = true;
const bingSpellCheckSubscriptionKey = "testbingSpellCheckSubscriptionKey";
const log = true;

client.prediction.resolve(appId, query, timezoneOffset, verbose, staging, spellCheck, bingSpellCheckSubscriptionKey, log).then((result) => {
  console.log("The result is:");
  console.log(result);
}).catch((err) => {
  console.log('An error occurred:');
  console.dir(err, {depth: null, colors: true});
});
```

### Related projects

- [Microsoft Azure SDK for Node.js](https://github.com/Azure/azure-sdk-for-node)


![Impressions](https://azure-sdk-impressions.azurewebsites.net/api/impressions/azure-sdk-for-node%2Flib%2Fservices%2Fluis%2Fruntime%2FREADME.png)
