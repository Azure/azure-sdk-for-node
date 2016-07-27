# Microsoft Azure SDK for Node.js - NotificationHubs Management

This project provides a Node.js package that makes it easy to manage Microsoft Azure NotificationHubs Resources.Right now it supports:
- **Node.js version: 4.x.x or higher**

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

## Related projects

- [Microsoft Azure SDK for Node.js - All-up](https://github.com/WindowsAzure/azure-sdk-for-node)
