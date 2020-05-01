# Microsoft Azure SDK for Node.js - Gallery

This project provides a Node.js package for accessing the Azure ServiceBus service.


## How to Install

```bash
npm install azure-notificationhub
```

## How to Use

```node
var azure = require('azure-notificationhub');

function checkForMessages(sbService, queueName, callback) {
  sbService.receiveQueueMessage(queueName, { isPeekLock: true }, function (err, lockedMessage) {
    if (err) {
      if (err == 'No messages to receive') {
        console.log('No messages');
      } else {
        callback(err);
      }
    } else {
      callback(null, lockedMessage);
    }
  });
}

![Impressions](https://azure-sdk-impressions.azurewebsites.net/api/impressions/azure-sdk-for-node%2Flib%2Fservices%2FserviceBus%2FREADME.png)
