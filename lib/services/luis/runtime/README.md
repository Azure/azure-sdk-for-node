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

#### Authentication, client creation, and getVersionPrediction prediction as an example.

```javascript
const msRest = require("ms-rest");
const LUISRuntimeClient = require("azure-cognitiveservices-luis-runtime");
const token = "<access_token>";
const creds = new msRest.TokenCredentials(token);
const subscriptionId = "<Subscription_Id>";
const client = new LUISRuntimeClient(creds, subscriptionId);
const appId = "ec7b1657-199d-4d8a-bbb2-89a11a42e02a";
const versionId = "testversionId";
const predictionRequest = {
  query: "testquery",
  options: {
    datetimeReference: new Date().toISOString(),
    overridePredictions: true
  },
  externalEntities: [{
    entityName: "testentityName",
    startIndex: 1,
    entityLength: 1,
    resolution: {}
  }],
  dynamicLists: [{
    listEntityName: "testlistEntityName",
    requestLists: [{
      name: "testname",
      canonicalForm: "testcanonicalForm",
      synonyms: ["testsynonyms"]
    }]
  }]
};
const verbose = true;
const showAllIntents = true;
const log = true;

client.prediction.getVersionPrediction(appId, versionId, predictionRequest, verbose, showAllIntents, log).then((result) => {
  console.log("The result is:");
  console.log(result);
}).catch((err) => {
  console.log('An error occurred:');
  console.dir(err, {depth: null, colors: true});
});
```

### Related projects

- [Microsoft Azure SDK for Node.js](https://github.com/Azure/azure-sdk-for-node)
