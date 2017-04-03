# Microsoft Azure SDK for Node.js - Gallery

This project provides a Node.js package for accessing the Azure ServiceBus service.


## How to Install

```bash
npm install azure-sb
```

## How to Use

```node
var azure = require('azure-sb');

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

function processMessage(sbService, err, lockedMsg) {
  if (err) {
    console.log('Error on Rx: ', err);
  } else {
    console.log('Rx: ', lockedMsg);
    sbService.deleteMessage(lockedMsg, function(err2) {
      if (err2) {
        console.log('Failed to delete message: ', err2);
      } else {
        console.log('Deleted message.');
      }
    })
  }
}

var idx = 0;
function sendMessages(sbService, queueName) {
  var msg = 'Message # ' + (++idx);
  sbService.sendQueueMessage(queueName, msg, function (err) {
   if (err) {
     console.log('Failed Tx: ', err);
   } else {
     console.log('Sent ' + msg);
   }
  });
}

var connStr = process.argv[2] || process.env.CONNECTION_STRING;
if (!connStr) throw new Error('Must provide connection string');
var queueName = 'sbqtest';

console.log('Connecting to ' + connStr + ' queue ' + queueName);
var sbService = azure.createServiceBusService(connStr);
sbService.createQueueIfNotExists(queueName, function (err) {
  if (err) {
   console.log('Failed to create queue: ', err);
  } else {
   setInterval(checkForMessages.bind(null, sbService, queueName, processMessage.bind(null, sbService)), 5000);
   setInterval(sendMessages.bind(null, sbService, queueName), 15000);
  }
});
```
Thanks to [@noodlefrenzy](https://github.com/noodlefrenzy) for the great example. The original is [here](https://github.com/noodlefrenzy/node-cerulean/blob/master/examples/servicebus_send_receive.js).

## Related projects

- [Microsoft Azure SDK for Node.js](https://github.com/WindowsAzure/azure-sdk-for-node)
