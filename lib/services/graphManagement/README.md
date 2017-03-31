# Microsoft Azure SDK for Node.js - Graph Management

This project provides a Node.js package that makes it easy to manage MicrosoftGraph Resources. Right now it supports:
- **Node.js version: 6.x.x or higher**

## How to Install

```bash
npm install azure-graph
```

## How to use

### Authentication, client creation and listing users as an example

##### Interactive Login
 ```javascript
 var msRestAzure = require('ms-rest-azure');
 var graphRbacManagementClient = require('azure-graph');

 // It provides a url and code that needs to be copied and pasted in a browser and authenticated over there. If successful, 
 // the user will get a DeviceTokenCredentials object.

 //Note: You need to explicitly specify the tokenAudience as graph and the your domain (tenantId) in which the AD Graph exists. 
 //      This needs to be done only for working graph clients. For other ARM clients specifying this information is not required.
 var tenantId='abcd-efgh-ijk-lmno-12345';
 // Enter your tenant ID here which can be found from your Azure AD URL
 // Eg. https://manage.windowsazure.com/example.com#Workspaces/ActiveDirectoryExtension/Directory/<TenantId>/users
 
 msRestAzure.interactiveLogin({ tokenAudience: 'graph', domain: tenantId }, function (err, credentials, subscriptions) {
  if (err) console.log(err);
  var client = new graphRbacManagementClient(credentials, tenantId);
  var userParams = {
    accountEnabled: true,
    userPrincipalName: 'OfficialStark@<yourdomain.com>', //please add your domain over here
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
    client.users.list(function (err, result, request, response) {
      if (err) return console.log(err);
      console.log(result);
      client.users.deleteMethod(userObjectId, function (err, result, request, response) {
        if (err) return console.log(err);
        console.log(result);
      });
    });
  });
 });
```

##### Login with username and password (organizational accounts)
```javascript
 var msRestAzure = require('ms-rest-azure');
 var graphRbacManagementClient = require('azure-graph');
 var tenantId='abcd-efgh-ijk-lmno-12345';
 // Enter your tenant ID here which can be found from your Azure AD URL
 // Eg. https://manage.windowsazure.com/example.com#Workspaces/ActiveDirectoryExtension/Directory/<TenantId>/users
 
 msRestAzure.loginWithUsernamePassword('username@contosocorp.onmicrosoft.com', 'your-password', { tokenAudience: 'graph', domain: tenantId }, function (err, credentials, subscriptions) {
  if (err) console.log(err);
  var client = new graphRbacManagementClient(credentials, tenantId);
  var userParams = {
    accountEnabled: true,
    userPrincipalName: 'OfficialStark@<yourdomain.com>', //please add your domain over here
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
    client.users.list(function (err, result, request, response) {
      if (err) return console.log(err);
      console.log(result);
      client.users.deleteMethod(userObjectId, function (err, result, request, response) {
        if (err) return console.log(err);
        console.log(result);
      });
    });
  });
 });
```

##### Login with serviceprincipal and secret
```javascript
 var msRestAzure = require('ms-rest-azure');
 var graphRbacManagementClient = require('azure-graph');
 var tenantId='abcd-efgh-ijk-lmno-12345';
 // Enter your tenant ID here which can be found from your Azure AD URL
 // Eg. https://manage.windowsazure.com/example.com#Workspaces/ActiveDirectoryExtension/Directory/<TenantId>/users
 
 msRestAzure.loginWithServicePrincipalSecret('clientId', 'application-secret', tenantId, { tokenAudience: 'graph' }, function (err, credentials, subscriptions) {
  if (err) console.log(err);
  var client = new graphRbacManagementClient(credentials, tenantId);
  var userParams = {
    accountEnabled: true,
    userPrincipalName: 'OfficialStark@<yourdomain.com>', //please add your domain over here
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
    client.users.list(function (err, result, request, response) {
      if (err) return console.log(err);
      console.log(result);
      client.users.deleteMethod(userObjectId, function (err, result, request, response) {
        if (err) return console.log(err);
        console.log(result);
      });
    });
  });
 });
 ```

- [Microsoft Azure SDK for Node.js](https://github.com/Azure/azure-sdk-for-node)
