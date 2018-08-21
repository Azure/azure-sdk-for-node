# Microsoft Azure SDK for Node.js - Cognitive Services Computer Vision

This project provides a Node.js package that makes it easy to work with the Microsoft Azure Cognitive Services Computer Vision API. Right now it supports:
- **Node.js version: 6.x or higher**


## How to Install

```bash
npm install azure-cognitiveservices-computervision
```

## How to use

### Create a Cognitive Services Account(ex. Computer Vision)

```javascript
  const msRestAzure = require('ms-rest-azure');
  const CognitiveServicesManagement = require('azure-arm-cognitiveservices');
  const SubscriptionId = 'your-subscription-key';
  const ResourceGroup = 'your-resource-group-name';
  const ResourceName = 'resource-name';
  let client;
  let createAccount = msRestAzure.interactiveLogin().then((credentials) => {
    client = new CognitiveServicesManagement(credentials, SubscriptionId);
    return client.accounts.create(ResourceGroup, ResourceName, {
      sku: {
        name: 'F0'
      },
      kind: 'ComputerVision',
      location: 'westus',
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
    return client.accounts.listKeys(ResourceGroup, ResourceName);
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

### Computer Vision API

 ```javascript
 const ComputerVisionClient = require('azure-cognitiveservices-computervision');

 let client = new ComputerVisionClient(credentials, 'https://westus.api.cognitive.microsoft.com');
 let fileStream = require('fs').createReadStream('pathToSomeImage.jpg');
 client.analyzeImageInStreamWithHttpOperationResponse(fileStream, {
   visualFeatures: ['Categories', 'Tags', 'Description']
 }).then((response) => {
   console.log(response.body.tags);
   console.log(response.body.description.captions[0]);
 }).catch((err) => {
   throw err;
 });
 ```

## More Detailed Information

https://azure.microsoft.com/en-us/try/cognitive-services/ under "Vision"

## Related Projects

- [Microsoft Azure SDK for Node.js](https://github.com/Azure/azure-sdk-for-node)
- [AutoRest](https://github.com/Azure/autorest)