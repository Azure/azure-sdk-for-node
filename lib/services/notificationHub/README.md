# Microsoft Azure SDK for Node.js - Gallery

This project provides a Node.js package for accessing the Azure ServiceBus service.


## How to Install

```bash
npm install azure-notificationhub
```

## How to Use

```node
var notificationHub = require('azure-notificationhub');

var connectionString = "{Replace with Connection String}";
var hubName = "{Replace with Hub Name}"

var notificationHubClient = new notificationHub(hubName, connectionString)

var payload = {
    data: {
      msg: 'Hello!'
    }
  };
  notificationHubClient.gcm.send(null, payload, function(error){
    if(!error){
      console.log( "Message Sent" )
    }
    else{
        console.log(error)
    }
  });

![Impressions](https://azure-sdk-impressions.azurewebsites.net/api/impressions/azure-sdk-for-node%2Flib%2Fservices%2FserviceBus%2FREADME.png)
