# Microsoft Azure SDK for Node.js - NotificationHubs Management

This project provides a Node.js package that makes it easy to manage Microsoft Azure NotificationHubs Resources.Right now it supports:
- **Node.js version: 6.x.x or higher**
- **API Version: 2016-03-01**

## How to Install

```bash
npm install azure-arm-notificationhubs
```
## How to Use

### Authentication, client creation and listing notificationHubs associated with a namespace in a resource group as an example

 ```javascript
 var msRestAzure = require('ms-rest-azure');
 var notificationHubsClient = require('azure-arm-notificationhubs');

 // Interactive Login
 // It provides a url and code that needs to be copied and pasted in a browser and authenticated over there. If successful, 
 // the user will get a DeviceTokenCredentials object.
 msRestAzure.interactiveLogin(function(err, credentials) {
  var client = new notificationHubsClient(credentials, 'your-subscription-id');
  client.notificationHubs.list(resourceGroupName, namespaceName, function(err, result, request, response) {
    if (err) console.log(err);
    console.log(result);
  });
 });
 ```


 #### Managing a Namespace

```javascript
var groupName = 'myResourceGroup';
var namespaceName = 'myNamespace';
var namespaceLocation = "South Central US"
//Create a Namespace

var createNamespaceParameters = {
  location: namespaceLocation,
  tags: {
    tag1: 'value1',
    tag2: 'value2'
  }
};

console.info('Creating Namespace...');
client.namespaces.createOrUpdate(groupName, namespaceName, createNamespaceParameters, function (err, result, request, response) {
  if (err) throw err;
  console.info('Namespace created: ' + JSON.stringify(result, null, ' '));
});


//Get properties of an active Namespace

console.info('Get namespace...');
client.namespaces.get(groupName, namespaceName, function (err, result, request, response) {
  if (err) throw err;
  console.info('Namespace properties: ' + JSON.stringify(result, null, ' '));
});


//list all Namespaces within a resource group

console.info('Getting Namespaces within a resource group...');
client.namespaces.list(groupName, function (err, result, request, response) {
  if (err) throw err;
  console.info('Namespaces: ' + JSON.stringify(result, null, ' '));
});

//list all Namespaces within your subscription

console.info('Getting Namespaces within a subscription...');
client.namespaces.listAll(function (err, result, request, response) {
  if (err) throw err;
  console.info('Namespaces: ' + JSON.stringify(result, null, ' '));
});

//Create Namespace authorization rule

var authRuleParameter = {
  location: namespaceLocation,
  name: authorizationRuleName,
  rights: ['Listen', 'Send']
};

client.namespaces.createOrUpdateAuthorizationRule(groupName, namespaceName, authorizationRuleName, authRuleParameter, function (err, result, request, response) {
  if (err) throw err;
  console.info('Namespace Authorization Rule: ' + JSON.stringify(result, null, ' '));
});

//show primary and secondary keys of the Namespace

console.info('Getting Namespace keys...');
client.namespaces.listKeys(groupName, namespaceName, authorizationRuleName, function (err, result, request, response) {
  if (err) throw err;
  console.info('Namespace Authorization Rule keys: ' + JSON.stringify(result, null, ' '));
});


//regenerate  keys of the cache

regenerateKeyParameter = {
  policyKey: 'primary KEY'
};

console.info('Regenerating Namespace keys...');
client.namespaces.regenerateKeys(groupName, namespaceName, authorizationRuleName, regenerateKeyParameter, function (err, result, request, response) {
  if (err) throw err;
  console.info('Namespace primary key regenerated');
  console.info('Regenerated Namespace keys: ' + JSON.stringify(result, null, ' '));
});
```

#### Managing a Namespace and NotificationHubs

```javascript
var createNotificationHubParameters = {
  location: namespaceLocation,
  wnsCredential: {
    packageSid: 'ms-app://s-1-15-2-1817505189-427745171-3213743798-2985869298-800724128-1004923984-4143860699',
    secretKey: 'w7TBprR-THIS-IS-DUMMY-KEYAzSYFhp',
    windowsLiveEndpoint: 'http://pushtestservice.cloudapp.net/LiveID/accesstoken.srf'
  }
};

//Create a NotificationHub

console.info('Creating NotificationHub...');

client.notificationHubs.createOrUpdate(groupName, namespaceName, notificationHubName, createNotificationHubParameters, function (err, result, request, response) {

  if (err) throw err;
  console.info('NotificationHub created: ' + JSON.stringify(result, null, ' '));
});

//Get all NotificationHubs
console.info("Get all Notification Hubs");
client.notificationHubs.list(groupName, namespaceName, function (err, result, request, response) {
  if (err) throw err;
  console.info('Get all NotificationHub created: ' + JSON.stringify(result, null, ' '));
});

//Get NotificationHub PNS credentials
console.info("Get the PNS credentials");
client.notificationHubs.getPnsCredentials(groupName, namespaceName, notificationHubName, function (err, result, request, response) {
  if (err) throw err;
  console.info('NotificationHub PNS credentials: ' + JSON.stringify(result, null, ' '));
});
```


## Related projects

- [Microsoft Azure SDK for Node.js - All-up](https://github.com/WindowsAzure/azure-sdk-for-node)
- [AutoRest](https://github.com/Azure/autorest)
