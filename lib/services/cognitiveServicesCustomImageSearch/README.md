---
uid: azure-cognitiveservices-customimagesearch
summary: *content

---
# Microsoft Azure SDK for Node.js - CustomImageSearchAPIClient
This project provides a Node.js package for accessing Azure. Right now it supports:
- **Node.js version 6.x.x or higher**

## Features


## How to Install

```bash
npm install azure-cognitiveservices-customimagesearch
```

## How to use

### Authentication, client creation and imageSearch customInstance as an example.

```javascript
const msRest = require("ms-rest");
const CustomImageSearchAPIClient = require("azure-cognitiveservices-customimagesearch");
const token = "<access_token>";
const creds = new msRest.TokenCredentials(token);
const subscriptionId = "<Subscription_Id>";
const client = new CustomImageSearchAPIClient(creds, subscriptionId);
const customConfig = 1;
const query = "testquery";
const acceptLanguage = "testacceptLanguage";
const userAgent = "testuserAgent";
const clientId = "testclientId";
const clientIp = "testclientIp";
const location = "westus";
const aspect = "All";
const color = "ColorOnly";
const countryCode = "testcountryCode";
const count = 1;
const freshness = "Day";
const height = 1;
const id = "testid";
const imageContent = "Face";
const imageType = "AnimatedGif";
const license = "All";
const market = "testmarket";
const maxFileSize = 1;
const maxHeight = 1;
const maxWidth = 1;
const minFileSize = 1;
const minHeight = 1;
const minWidth = 1;
const offset = 1;
const safeSearch = "Off";
const size = "All";
const setLang = "testsetLang";
const width = 1;
client.customInstance.imageSearch(customConfig, query, acceptLanguage, userAgent, clientId, clientIp, location, aspect, color, countryCode, count, freshness, height, id, imageContent, imageType, license, market, maxFileSize, maxHeight, maxWidth, minFileSize, minHeight, minWidth, offset, safeSearch, size, setLang, width).then((result) => {
  console.log("The result is:");
  console.log(result);
}).catch((err) => {
  console.log('An error occurred:');
  console.dir(err, {depth: null, colors: true});
});

## Related projects

- [Microsoft Azure SDK for Node.js](https://github.com/Azure/azure-sdk-for-node)
