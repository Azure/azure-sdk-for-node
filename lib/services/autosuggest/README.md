---
uid: azure-cognitiveservices-autosuggest
summary: *content

---
# Microsoft Azure SDK for Node.js - AutoSuggestAPIClient
This project provides a Node.js package for accessing Azure. Right now it supports:
- **Node.js version 6.x.x or higher**

## Features


## How to Install

```bash
npm install azure-cognitiveservices-autosuggest
```

## How to use

### Authentication, client creation and autoSuggest  as an example.

```javascript
const msRestAzure = require("ms-rest-azure");
const AutoSuggestAPIClient = require("azure-cognitiveservices-autosuggest");
msRestAzure.interactiveLogin().then((creds) => {
    const subscriptionId = "<Subscription_Id>";
    const client = new AutoSuggestAPIClient(creds, subscriptionId);
    const query = "testquery";
    const acceptLanguage = "testacceptLanguage";
    const pragma = "testpragma";
    const userAgent = "testuserAgent";
    const clientId = "testclientId";
    const clientIp = "testclientIp";
    const location = "westus";
    const countryCode = "testcountryCode";
    const market = "testmarket";
    const safeSearch = "Off";
    const setLang = "testsetLang";
    const responseFormat = ["Json"];
    return client.autoSuggest(query, acceptLanguage, pragma, userAgent, clientId, clientIp, location, countryCode, market, safeSearch, setLang, responseFormat).then((result) => {
      console.log("The result is:");
      console.log(result);
    });
}).catch((err) => {
  console.log('An error occurred:');
  console.dir(err, {depth: null, colors: true});
});

## Related projects

- [Microsoft Azure SDK for Node.js](https://github.com/Azure/azure-sdk-for-node)
