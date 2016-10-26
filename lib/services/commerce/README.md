# Microsoft Azure SDK for Node.js - Commerce Usage Aggregates

This project provides a Node.js package that makes it easy to consume the usage for a subscription.

## How to Install

```bash
npm install azure-arm-commerce
```
## How to Use

### Authentication, client creation and listing usage aggregates as an example

 ```javascript
 var msRestAzure = require('ms-rest-azure');
 var UsageManagementClient = require('azure-arm-commerce');

 // Interactive Login
 // It provides a url and code that needs to be copied and pasted in a browser and authenticated over there. If successful, 
 // the user will get a DeviceTokenCredentials object.
 msRestAzure.interactiveLogin(function(err, credentials, subscriptions) {
  var client = new UsageManagementClient(credentials, 'your-subscription-id');
  var usageOptions = {
    showDetails: true,
    granularity: 'Daily'
  };
  client.usageAggregates.list('2016-05-01', '2016-10-01', usageOptions, function(err, result, request, response) {
    if (err) { console.log(err); return; }
    console.log(result);
  });
 });
 ```