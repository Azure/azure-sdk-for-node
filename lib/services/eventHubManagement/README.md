# Microsoft Azure SDK for Node.js - EventHubManagement

This project provides a Node.js package that makes it easy to manage Azure EventHub Resources. Right now it supports:
- **Node.js version: 6.0.0 or higher**

## How to Install

```bash
npm install azure-arm-eventhub
```

## How to Use

### Authentication, client creation and getting information about an eventhub as an example

 ```javascript
 var msRestAzure = require('ms-rest-azure');
 var EventHubManagement = require('azure-arm-eventhub');
 
 // Interactive Login
 msRestAzure.interactiveLogin(function(err, credentials) {
  var client = new EventHubManagement(credentials, 'your-subscription-id');
  var resourceGroupName = 'testRG';
  var namespaceName = 'testNS';
  var eventHubName = 'testEH';
  client.eventHubs.get(resourceGroupName, namespaceName, eventHubName, function(err, eventHubs, request, response) {
    if (err) {
      console.log(err);
    } else {
      eventHubs.map(function (hub, index, array) {
        console.log('found hub :' + hub.name);
      }));
    }
  });
 });
 ```

## Related projects

- [Microsoft Azure SDK for Node.js - All-up](https://github.com/WindowsAzure/azure-sdk-for-node)
