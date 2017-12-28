# Microsoft Azure SDK for Node.js - Cognitive Services Spellcheck

This project provides a Node.js package that makes it easy to work with the Microsoft Azure Cognitive Services Spellcheck APIs. Right now it supports:
- **Node.js version: 6.x or higher**


## How to Install

```bash
npm install azure-cognitiveservices-spellcheck
```

## How to use

### Create a Cognitive Services Account(ex. Spell Check)

```javascript
  const msRestAzure = require('ms-rest-azure');
  const CognitiveServicesManagement = require("azure-arm-cognitiveservices");
  let client;
  let createAccount = msRestAzure.interactiveLogin().then((credentials) => {
    client = new CognitiveServicesManagement(credentials, suite.subscriptionId);
    return client.accounts.create('groupname', 'accountname', {
      sku: {
        name: "F0"
      },
      kind: "Bing.SpellCheck",
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

### Spellcheck API

 ```javascript
 const SpellCheckAPIClient = require('azure-cognitiveservices-spellcheck');

 let client = new SpellCheckAPIClient(credentials);
 let options = {
   text: 'cognituve services'
 };
 client.spellChecker(options, (err, result, request, response) => {
   if (err) throw err;
   console.log(result.flaggedTokens[0].token);
   console.log(result.flaggedTokens[0].suggestions[0].suggestion);
 });
 ```

## More Detailed Information

https://azure.microsoft.com/en-us/try/cognitive-services/ under "Language"

## Related Projects

- [Microsoft Azure SDK for Node.js](https://github.com/Azure/azure-sdk-for-node)
- [AutoRest](https://github.com/Azure/autorest)
