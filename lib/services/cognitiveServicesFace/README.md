---
uid: azure-cognitiveservices-face
summary: *content

---
**This SDK will be deprecated next year and will be replaced by a new TypeScript-based isomorphic SDK (found at https://github.com/Azure/azure-sdk-for-js) which works on Node.js and browsers.**
## Microsoft Azure SDK for Node.js - FaceClient
This project provides a Node.js package for accessing Azure. Right now it supports:
- **Node.js version 6.x.x or higher**

### Features


### How to Install

```bash
npm install azure-cognitiveservices-face
```

### How to use

#### Authentication, client creation and list personGroupPerson as an example.

```javascript
const msRest = require("ms-rest");
const FaceClient = require("azure-cognitiveservices-face");
const token = "<access_token>";
const creds = new msRest.TokenCredentials(token);
const subscriptionId = "<Subscription_Id>";
const client = new FaceClient(creds, subscriptionId);
const personGroupId = "testpersonGroupId";
const start = "teststart";
const top = 1;
client.personGroupPerson.list(personGroupId, start, top).then((result) => {
  console.log("The result is:");
  console.log(result);
}).catch((err) => {
  console.log('An error occurred:');
  console.dir(err, {depth: null, colors: true});
});

### Related projects

- [Microsoft Azure SDK for Node.js](https://github.com/Azure/azure-sdk-for-node)
