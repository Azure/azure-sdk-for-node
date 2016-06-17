# Microsoft Azure SDK for Node.js - Graph Management

This project provides a Node.js package that makes it easy to manage MicrosoftGraph Resources. Right now it supports:
- **Node.js version: 4.x.x or higher**

## How to Install

```bash
npm install azure-graph
```

## How to use

### Authentication, client creation and listing users as an example

 ```javascript
 var msrestAzure = require('ms-rest-azure');
 var graphRbacManagementClient = require('azure-graph');

 // Interactive Login
 // It provides a url and code that needs to be copied and pasted in a browser and authenticated over there. If successful, 
 // the user will get a DeviceTokenCredentials object.
 msRestAzure.interactiveLogin(function(err, credentials, subscriptions) {
  var client = new graphRbacManagementClient(credentials, 'your-tenant-id');
  var userParams = {
    accountEnabled: true,
    userPrincipalName: OfficialStark@GOT.com,
    displayName: 'Jon Snow',
    mailNickname: 'OfficialStark',
    passwordProfile: {
      password: 'WinterisComing!',
      forceChangePasswordNextLogin: false
    }
  };
  client.users.create(userParams, function (err, user, request, response) {
    if (err) return console.log(err);
    console.log(user);
    var userObjectId = user.objectId;
    client.users.list(function(err, result, request, response) {
      if (err) return console.log(err);
      console.log(result);
    });
    client.users.delete(userObjectId, function (err, result, request, response) {
      if (err) return console.log(err);
      console.log(result);
    });
  })
 });
 ```

- [Microsoft Azure SDK for Node.js](https://github.com/Azure/azure-sdk-for-node)