---
uid: azure-cognitiveservices-luis-runtime
summary: *content

---
# Microsoft Azure SDK for Node.js - LUISRuntimeClient
This project provides a Node.js package for accessing Azure. Right now it supports:
- **Node.js version 6.x.x or higher**

## Features


## How to Install

```bash
npm install azure-cognitiveservices-luis-runtime
```

## How to use

### Authentication, client creation and resolve prediction as an example.

```javascript
const msRest = require("ms-rest");
const LUISRuntimeClient = require("azure-cognitiveservices-luis-runtime");
const token = "<access_token>";
const creds = new msRest.TokenCredentials(token);
const endpoint = "<LUIS_app_endpoint>"; // e.g., https://westus.api.cognitive.microsoft.com
const client = new LUISRuntimeClient(creds, endpoint);
const appId = "testappId"; // LUIS Application ID
const query = "I need help";
const timezoneOffset = 1.01;
const verbose = true;
const staging = true;
const spellCheck = true;
const bingSpellCheckSubscriptionKey = "testbingSpellCheckSubscriptionKey";
const log = true;
client.prediction
  .resolve(appId, query, {
    timezoneOffset,
    verbose,
    staging,
    spellCheck,
    bingSpellCheckSubscriptionKey,
    log,
    customHeaders: {
      'Ocp-Apim-Subscription-Key': '<subscription-key>'
    }
  })
  .then(result => {
    console.log('The result is:');
    console.log(result);
  })
  .catch(err => {
    console.log('An error occurred:');
    console.dir(err, { depth: null, colors: true });
  });


## Related projects

- [Microsoft Azure SDK for Node.js](https://github.com/Azure/azure-sdk-for-node)
