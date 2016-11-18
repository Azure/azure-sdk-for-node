## Getting Started with Azure Service Bus

Whether an application or service runs in the cloud or on premises, it often needs to interact with other applications or services. To provide a broadly useful way to do this, Azure offers Service Bus. This article takes a look at this technology, describing what it is and why you might want to use it.

Let's get started using Azure Service Bus.

### How to Install

```bash
npm install azure-sb
```

### The basics of producers and consumers

```node
var azure = require('azure-sb');

function checkForMessages(sbService, queueName, callback) {
  sbService.receiveQueueMessage(queueName, { isPeekLock: true }, function (err, lockedMessage) {
    if (err) {
      if (err === 'No messages to receive') {
        console.log('No messages');
      } else {
        callback(err);
      }
    } else {
      callback(null, lockedMessage);
    }
  });
}

function checkMessageCount(queueName){
    sbService.getQueue(queueName, function(err, queue){
        if (err) {
            console.log('Error on get queue length: ', err);
        } else {
            // length of queue (active messages ready to read)
            var length = queue.CountDetails['d2p1:ActiveMessageCount'];
            console.log(length + ' messages currently in the queue');
            return length;
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
   setInterval(checkMessageCount.bind(null, queueName), 1000);
  }
});
```

### The Get Queue Details

```node
    //Get details on a queue from the queue object
    function getQueue(queueName){
        sbService.getQueue(queueName, function(err, queue){
        if (err) {
            console.log('Error on get queue: ', err);
        } else {
            console.log(queue);
            return queue;
        })
    }
```

The queue object contains a number of useful bits of information on the queue:
```json
{
    "LockDuration": "PT30S",
    "MaxSizeInMegabytes": "5120",
    "RequiresDuplicateDetection": "false",
    "RequiresSession": "false",
    "DefaultMessageTimeToLive": "P9999D",
    "DeadLetteringOnMessageExpiration": "true",
    "DuplicateDetectionHistoryTimeWindow": "PT10M",
    "MaxDeliveryCount": "10",
    "EnableBatchedOperations": "true",
    "SizeInBytes": "0",
    "MessageCount": "0",
    "IsAnonymousAccessible": "false",
    "AuthorizationRules": {
        "AuthorizationRule": {
            "ClaimType": "SharedAccessKey",
            "ClaimValue": "None",
            "Rights": {
                "AccessRights": [
                    "Manage",
                    "Send",
                    "Listen"
                ]
            },
            "CreatedTime": "2016-02-16T02:19:28.8148647Z",
            "ModifiedTime": "2016-02-16T02:19:28.8148647Z",
            "KeyName": "yourSASrole",
            "PrimaryKey": "***",
            "SecondaryKey": "***"
        }
    },
    "Status": "Active",
    "CreatedAt": "2016-02-15T00:11:12.9543904Z",
    "UpdatedAt": "2016-02-16T02:19:27.9576641Z",
    "AccessedAt": "2016-02-16T20:40:30.3668995Z",
    "SupportOrdering": "true",
    "CountDetails": {
        "d2p1:ActiveMessageCount": "0",
        "d2p1:DeadLetterMessageCount": "0",
        "d2p1:ScheduledMessageCount": "0",
        "d2p1:TransferMessageCount": "0",
        "d2p1:TransferDeadLetterMessageCount": "0"
    },
    "AutoDeleteOnIdle": "P10675199DT2H48M5.4775807S",
    "EntityAvailabilityStatus": "Available",
    "_": {
        "ContentRootElement": "QueueDescription",
        "id": "https://yourSBNamespace.servicebus.windows.net/yourqueue?api-version=2016-07",
        "title": "yourqueue",
        "published": "2016-02-15T00:11:14Z",
        "updated": "2016-02-16T02:19:28Z",
        "author": {
            "name": "yourSBNamespace"
        },
        "link": ""
    },
    "QueueName": "yourqueue"
}
```