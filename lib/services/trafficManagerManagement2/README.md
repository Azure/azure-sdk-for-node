# Microsoft Azure SDK for Node.js - Traffic Manager Management

This project provides a Node.js package that makes it easy to manage Microsoft Azure Traffic Manager ARM Resources. 

## How to Install

```bash
npm install azure-arm-trafficmanager
```

## How to Use

### Authentication, client creation and listing profiles in a resource group as an example

 ```javascript
 var msRestAzure = require('ms-rest-azure');
 var trafficManager = require('azure-arm-trafficmanager');
 
 // Interactive Login
 msRestAzure.interactiveLogin(function(err, credentials) {
  var client = new trafficManager(credentials, 'your-subscription-id');
  var resourceGroupName = 'test-group';
  client.profiles.listByResourceGroup(resourceGroupName, function(err, profiles, request, response) {
    if (err) console.log(err);
    profiles.map(function (profile, index, array) {
      console.log('found profile :' + profile.name);
    }));
  });
 });
 ```