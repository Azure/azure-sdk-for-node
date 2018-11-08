# Microsoft Azure SDK for Node.js - Cognitive Services Content Moderator

This project provides a Node.js package that makes it easy to work with the Microsoft Azure Cognitive Services Content Moderator APIs. Right now it supports:
- **Node.js version: 6.x or higher**


## How to Install

```bash
npm install azure-cognitiveservices-contentmoderator
```

## How to use

### Create a Cognitive Services Account(ex. Content Moderator)

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
      kind: "ContentModerator",
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

 // Creating the Cognitive Services credentials
 // This requires a key corresponding to the service being used (i.e. text-analytics, etc)
 let credentials = new CognitiveServicesCredentials(serviceKey);
 ```

### Content Moderator API

 ```javascript
 const ContentModeratorAPIClient = require('azure-cognitiveservices-contentmoderator');

 let client = new ContentModeratorAPIClient(credentials, "westus.api.cognitive.microsoft.com");
 client.textModeration.screenText('eng', 'text/plain', `Is this a crap email abcdef@abcd.com, phone:
  6657789887, IP: 255.255.255.255, 1 Microsoft Way, Redmond, WA 98052`, (err, result, request, response) => {
  if (err) throw err;
  console.log(result);
  console.log(result.terms);
  console.log(result.terms.length);
  console.log(result.terms.filter(term => term.term === "crap"));
});
 ```

## More Detailed Information

https://azure.microsoft.com/en-us/try/cognitive-services/ under "Vision"

## Related Projects

- [Microsoft Azure SDK for Node.js](https://github.com/Azure/azure-sdk-for-node)
- [AutoRest](https://github.com/Azure/autorest)