# Microsoft Azure SDK for Node.js - Cognitive Services Search

This project provides a Node.js package that makes it easy to work with Microsoft Azure Cognitive Services Entity Search API. Right now it supports:
- **Node.js version: 6.x or higher**


## How to Install

```bash
npm install azure-cognitiveservices-search
```

## How to use

### Create a Cognitive Services Bing Search Account

```javascript
  const msRestAzure = require('ms-rest-azure');
  const CognitiveServicesManagement = require("azure-arm-cognitiveservices");
  let client;
  let createAccount = msRestAzure.interactiveLogin().then((credentials) => {
    client = new CognitiveServicesManagement(credentials, suite.subscriptionId);
    return client.accounts.create('groupname', 'accountname', {
      sku: {
        name: "S1"
      },
      kind: "Bing.Search",
      location: "westus",
      properties: {}
    });
  }).catch((err) => {
    console.log('An error ocurred');
    console.dir(err, {depth: null, colors: true});
  });
```

### List the keys from the created account

```javascript
  let serviceKey;
  createAccount.then((result) => {
    return client.accounts.listKeys('groupname', 'accountname');
  }).then((result) => {
    serviceKey = result.key1;
    console.log(result.key2);
  }).catch((err) => {
    console.log('An error ocurred');
    console.dir(err, {depth: null, colors: true});
  });
```

### Create credentials

 ```javascript
 const CognitiveServicesCredentials = require('ms-rest-azure').CognitiveServicesCredentials;
 let credentials = new CognitiveServicesCredentials(serviceKey);
 ```

### Query the Entity Search API

 ```javascript
const search = require('azure-cognitiveservices-search');

let entitySearchApiClient = new search.EntitySearchAPIClient(credentials);

entitySearchApiClient.entitiesOperations.search('seahawks').then((result) => {
  console.log(result.queryContext);
  console.log(result.entities.value);
  console.log(result.entities.value[0].description);
}).catch((err) => {
  throw err;
});
```

### Query the Web Search API

 ```javascript
const search = require('azure-cognitiveservices-search');
let webSearchApiClient = new search.WebSearchAPIClient(credentials);

webSearchAPIClient.web.search('seahawks').then((result) => {
  console.log(result.queryContext);
  console.log(result.images.value);
  console.log(result.webPages.value);
  console.log(result.news.value);
}).catch((err) => {
  throw err;
})
 ```

## More Detailed Information

https://azure.microsoft.com/en-us/try/cognitive-services/ under "Search"


## Related Projects

- [Microsoft Azure SDK for Node.js](https://github.com/Azure/azure-sdk-for-node)
- [AutoRest](https://github.com/Azure/autorest)
