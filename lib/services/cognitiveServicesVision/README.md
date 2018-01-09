# Microsoft Azure SDK for Node.js - Cognitive Services Vision

This project provides a Node.js rollup package that makes it easy to work with the Microsoft Azure Cognitive Services Vision APIs. Right now it supports:
- **Node.js version: 6.x or higher**


## How to Install

```bash
npm install azure-cognitiveservices-vision
```

## How to use

### Create a Cognitive Services Account(ex. Computer Vision)

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
      kind: "ComputerVision",
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

### Computer Vision API

 ```javascript
 const vision = require('azure-cognitiveservices-vision');

 let client = new vision.ComputerVisionAPIClient(credentials);
 let fileStream = fs.createReadStream('pathToSomeImage.jpg');
 client.analyzeImageInStreamWithHttpOperationResponse(fileStream, {
   visualFeatures: ["Categories", "Tags", "Description"]
 }).then((response) => {
   console.log(response.body.tags);
   console.log(response.body.description.captions[0]);
 }).catch((err) => {
   throw err;
 });
 ```

 ### Face API

 ```javascript
 let fileStream = fs.createReadStream('pathToSomeImage.jpg');
 client.face.detectInStreamWithHttpOperationResponse(fileStream, {
   returnFaceId: true,
   returnFaceAttributes: 'age,gender,headPose,smile,facialHair,glasses,emotion,hair,makeup,occlusion,accessories,exposure,noise'
 }).then((httpResponse) => {
   console.log(httpResponse.response.body);
 }).catch((err) => {
   throw err;
 });
 ```

## More Detailed Information

https://azure.microsoft.com/en-us/try/cognitive-services/ under "Vision"

## Related Projects

- [Microsoft Azure SDK for Node.js](https://github.com/Azure/azure-sdk-for-node)
- [AutoRest](https://github.com/Azure/autorest)