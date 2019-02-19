---
uid: azure-cognitiveservices-anomalyfinder
summary: *content

---
**This SDK will be deprecated next year and will be replaced by a new TypeScript-based isomorphic SDK (found at https://github.com/Azure/azure-sdk-for-js) which works on Node.js and browsers.**
## Microsoft Azure SDK for Node.js - AnomalyFinderClient

This project provides a Node.js package for accessing Azure. Right now it supports:
- **Node.js version 6.x.x or higher**

### Features


### How to Install

```bash
npm install azure-cognitiveservices-anomalyfinder
```

### How to use

#### Authentication, client creation, and entireDetect  as an example.

```javascript
const msRest = require("ms-rest");
const AnomalyFinderClient = require("azure-cognitiveservices-anomalyfinder");
const token = "<access_token>";
const creds = new msRest.TokenCredentials(token);
const subscriptionId = "<Subscription_Id>";
const client = new AnomalyFinderClient(creds, subscriptionId);
const body = {
  series: [{
    timestamp: new Date().toISOString(),
    value: 1.01
  }],
  granularity: "yearly",
  customInterval: 1,
  period: 1,
  maxAnomalyRatio: 1.01,
  sensitivity: 1
};

client.entireDetect(body).then((result) => {
  console.log("The result is:");
  console.log(result);
}).catch((err) => {
  console.log('An error occurred:');
  console.dir(err, {depth: null, colors: true});
});
```

### Related projects

- [Microsoft Azure SDK for Node.js](https://github.com/Azure/azure-sdk-for-node)
