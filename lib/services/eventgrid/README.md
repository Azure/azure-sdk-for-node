# Microsoft Azure SDK for Node.js - EventGrid

This project provides a Node.js package for accessing the Azure PAS. Right now it supports:
- **Node.js version: 6.x.x or higher**

## How to Install

```bash
npm install azure-eventgrid
```

## How to Use

### Authentication, client creation and listing topicTypes as an example

 ```javascript
 var uuid = require('uuid').v4;
 var msRestAzure = require('ms-rest-azure');
 var EventGridManagementClient = require("azure-arm-eventgrid");
 var EventGridClient = require("azure-eventgrid");
 
 // Interactive Login
 // It provides a url and code that needs to be copied and pasted in a browser and authenticated over there. If successful, 
 // the user will get a DeviceTokenCredentials object.
 msRestAzure.interactiveLogin(function(err, credentials) {
  // Created the management client
  let EGMClient = new EventGridManagementClient(credentials, 'your-subscription-id');
  let topicResponse;
  // created an enventgrid topic
  return EGMClient.topics.createOrUpdate('resourceGroup', 'topic1', { location: 'westus' }).then((topicResponse) => {
    return Promise.resolve(console.log('Created topic ', topicResponse));
  }).then(() => {
    // listed the access keys
    return EGMClient.topics.listSharedAccessKeys('resourceGroup', 'topic1')
  }).then((accessKeys) => {
    // created the dataplane client that will be used to publish events
    let topicCreds = new msRestAzure.TopicCredentials(accessKeys.key1);
    let EGClient = new EventGridClient(topicCreds, 'your-subscription-id');
    let topicHostName = topicResponse.endpoint; //ex: 'topic1.westus.eventgrid.azure.net'
    let events = [
      {
        id: uuid(),
        subject: 'TestSubject',
        dataVersion: '1.0',
        eventType: 'Microsoft.MockPublisher.TestEvent',
        data: {
          field1: 'value1',
          filed2: 'value2'
        }
      }
    ];
    return EGClient.publishEvents(topicHostName, events);
  }).then((result) => {
    return Promise.resolve(console.log('Published events successfully.'));
   });
  }).catch((err) => {
   console.log('An error ocurred');
   console.dir(err, {depth: null, colors: true});
  });
});
```

## Related projects

- [Microsoft Azure SDK for Node.js](https://github.com/Azure/azure-sdk-for-node)
