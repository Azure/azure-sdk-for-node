---
uid: azure-cognitiveservices-visualsearch
summary: *content

---
**This SDK will be deprecated next year and will be replaced by a new TypeScript-based isomorphic SDK (found at https://github.com/Azure/azure-sdk-for-js) which works on Node.js and browsers.**
## Microsoft Azure SDK for Node.js - VisualSearchClient

This project provides a Node.js package for accessing Azure. Right now it supports:
- **Node.js version 6.x.x or higher**

### Features


### How to Install

```bash
npm install azure-cognitiveservices-visualsearch
```

### How to use

#### Authentication, client creation, and visualSearch images as an example.

```javascript
const msRest = require("ms-rest");
const VisualSearchClient = require("azure-cognitiveservices-visualsearch");
const token = "<access_token>";
const creds = new msRest.TokenCredentials(token);
const subscriptionId = "<Subscription_Id>";
const client = new VisualSearchClient(creds, subscriptionId);
const acceptLanguage = "testacceptLanguage";
const contentType = "testcontentType";
const userAgent = "testuserAgent";
const clientId = "testclientId";
const clientIp = "testclientIp";
const location = "westus";
const market = "testmarket";
const safeSearch = "Off";
const setLang = "testsetLang";
const knowledgeRequest = "testknowledgeRequest";
const image = new ReadableStream();

client.images.visualSearch(acceptLanguage, contentType, userAgent, clientId, clientIp, location, market, safeSearch, setLang, knowledgeRequest, image).then((result) => {
  console.log("The result is:");
  console.log(result);
}).catch((err) => {
  console.log('An error occurred:');
  console.dir(err, {depth: null, colors: true});
});
```

### Related projects

- [Microsoft Azure SDK for Node.js](https://github.com/Azure/azure-sdk-for-node)
