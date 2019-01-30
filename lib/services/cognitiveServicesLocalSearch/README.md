---
uid: azure-cognitiveservices-localsearch
summary: *content

---
**This SDK will be deprecated next year and will be replaced by a new TypeScript-based isomorphic SDK (found at https://github.com/Azure/azure-sdk-for-js) which works on Node.js and browsers.**
## Microsoft Azure SDK for Node.js - LocalSearchClient

This project provides a Node.js package for accessing Azure. Right now it supports:
- **Node.js version 6.x.x or higher**

### Features


### How to Install

```bash
npm install azure-cognitiveservices-localsearch
```

### How to use

#### Authentication, client creation, and search local as an example.

```javascript
const msRest = require("ms-rest");
const LocalSearchClient = require("azure-cognitiveservices-localsearch");
const token = "<access_token>";
const creds = new msRest.TokenCredentials(token);
const subscriptionId = "<Subscription_Id>";
const client = new LocalSearchClient(creds, subscriptionId);
const query = "testquery";
const acceptLanguage = "testacceptLanguage";
const pragma = "testpragma";
const userAgent = "testuserAgent";
const clientId = "testclientId";
const clientIp = "testclientIp";
const location = "westus";
const countryCode = "testcountryCode";
const market = "testmarket";
const localCategories = "testlocalCategories";
const localCircularView = "testlocalCircularView";
const localMapView = "testlocalMapView";
const count = "testcount";
const first = "testfirst";
const responseFormat = ["Json"];
const safeSearch = "Off";
const setLang = "testsetLang";

client.local.search(query, acceptLanguage, pragma, userAgent, clientId, clientIp, location, countryCode, market, localCategories, localCircularView, localMapView, count, first, responseFormat, safeSearch, setLang).then((result) => {
  console.log("The result is:");
  console.log(result);
}).catch((err) => {
  console.log('An error occurred:');
  console.dir(err, {depth: null, colors: true});
});
```

### Related projects

- [Microsoft Azure SDK for Node.js](https://github.com/Azure/azure-sdk-for-node)
