# Microsoft Azure SDK for Node.js - Cognitive Services Language

This project provides a Node.js rollup package that makes it easy to work with the Microsoft Azure Cognitive Services Language APIs. Right now it supports:
- **Node.js version: 6.x or higher**


## How to Install

```bash
npm install azure-cognitiveservices-language
```

## How to use

### Create a Cognitive Services Account(ex. Text Analytics)

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
      kind: "TextAnalytics",
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

### Text Analytics API

 ```javascript
 const language = require('azure-cognitiveservices-language');

 let client = new language.TextAnalyticsAPIClient(credentials);
 let input = {
    documents: [
        {
        'id': "1",
        'text': "I had a wonderful experience! The rooms were wonderful and the staff was helpful."
        }
    ]
 }
 let operation = client.detectLanguage(input)
 operation.then(function (result){
   console.log(result.documents[0].detectedLanguages[0].name);
   console.log(result.documents[0].detectedLanguages[0].score);
 }).catch(function (err){
   throw err;
 });
 ```

## More Detailed Information

https://azure.microsoft.com/en-us/try/cognitive-services/ under "Language"

## Related Projects

- [Microsoft Azure SDK for Node.js](https://github.com/Azure/azure-sdk-for-node)
- [AutoRest](https://github.com/Azure/autorest)
