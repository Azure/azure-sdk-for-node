---
uid: azure-cognitiveservices-customvision-prediction
summary: *content

---
**This SDK will be deprecated next year and will be replaced by a new TypeScript-based isomorphic SDK (found at https://www.npmjs.com/package/@azure/cognitiveservices-customvision-prediction) which works on Node.js and browsers.**
**See https://aka.ms/azure-sdk-for-js-migration to learn more.**
## Microsoft Azure SDK for Node.js - PredictionAPIClient

This project provides a Node.js package for accessing Azure. Right now it supports:
- **Node.js version 6.x.x or higher**

### Features


### How to Install

```bash
npm install azure-cognitiveservices-customvision-prediction
```

### How to use

#### Authentication, client creation, and classifyImageUrl  as an example.

```javascript
const msRest = require("ms-rest");
const PredictionAPIClient = require("azure-cognitiveservices-customvision-prediction");
const token = "<access_token>";
const creds = new msRest.TokenCredentials(token);
const subscriptionId = "<Subscription_Id>";
const client = new PredictionAPIClient(creds, subscriptionId);
const projectId = "ec7b1657-199d-4d8a-bbb2-89a11a42e02a";
const publishedName = "testpublishedName";
const imageUrl = {
  url: "testurl"
};
const application = "testapplication";

client.classifyImageUrl(projectId, publishedName, imageUrl, application).then((result) => {
  console.log("The result is:");
  console.log(result);
}).catch((err) => {
  console.log('An error occurred:');
  console.dir(err, {depth: null, colors: true});
});
```

### Related projects

- [Microsoft Azure SDK for Node.js](https://github.com/Azure/azure-sdk-for-node)
