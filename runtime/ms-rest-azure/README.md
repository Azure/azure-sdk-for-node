# MS-Rest-Azure

Infrastructure for error handling, tracing, and http client pipeline configuration. Required by nodeJS Azure client libraries, generated using AutoRest.

- **Node.js version: 4.x.x or higher**


## How to Install

```bash
npm install ms-rest-azure
```

## Usage
```javascript
var msrestAzure = require('ms-rest-azure');
```
## Authentication

#### Interactive Login is the simplest and the best way to authenticate.
It provides a url and code that needs to be copied and pasted in a browser and authenticated over there. If successful, 
the user will get a DeviceTokenCredentials object.
```javascript
 var someAzureServiceClient = require('azure-arm-someService');
 msRestAzure.interactiveLogin(function(err, credentials) {
   if (err) return console.log(err);
   var client = new someAzureServiceClient(credentials, 'your-subscriptionId');
   client.someOperationGroup.method(param1, param2, function(err, result) {
     if (err) return console.log(err);
     return console.log(result);
   });
 });
```

#### Login with username and password
This mechanism will only work for organizational ids and ids that are not 2FA enabled.
Otherwise it is better to use the above mechanism (interactive login).
```javascript
 var someAzureServiceClient = require('azure-arm-someService');
 msRestAzure.loginWithUsernamePassword(username, password, function(err, credentials) {
   if (err) return console.log(err);
   var client = new someAzureServiceClient(credentials, 'your-subscriptionId');
   client.someOperationGroup.method(param1, param2, function(err, result) {
     if (err) return console.log(err);
     return console.log(result);
   });
 });
```

### Non-Interactive Authentication
If you need to create an automation account for non interactive or scripting scenarios then please take a look at the documentation over [here](https://github.com/Azure/azure-sdk-for-node/blob/master/Documentation/Authentication.md). Once you have created a service principal you can authenticate using the following code snippet.

#### Login with service principal name and secret
```javascript
 var someAzureServiceClient = require('azure-arm-someService');
 msRestAzure.loginWithServicePrincipalSecret(clientId, secret, domain, function(err, credentials) {
   if (err) return console.log(err);
   var client = new someAzureServiceClient(credentials, 'your-subscriptionId');
   client.someOperationGroup.method(param1, param2, function(err, result) {
     if (err) retutrn console.log(err);
     return console.log(result);
   });
 });
```
## Using the generic (authenticated) AzureServiceClient to make custom requests to Azure.
This can be very useful in doing something custom or while debugging.

### A simple client to make a request using the sendRequest() method.
To find out the power of sendRequest(), please visit [this link](http://azure.github.io/azure-sdk-for-node/ms-rest/latest/ServiceClient.html#sendRequest) for detailed documentation of supported options while sending a request.
```javascript
const msrest = require('ms-rest');
const msRestAzure = require('ms-rest-azure');
const AzureServiceClient = msRestAzure.AzureServiceClient;

const clientId = process.env['CLIENT_ID'];
const secret = process.env['APPLICATION_SECRET'];
const domain = process.env['DOMAIN']; //also known as tenantId
const subscriptionId = process.env['AZURE_SUBSCRIPTION_ID'];
var client;

//an example to list resource groups in a subscription
msRestAzure.loginWithServicePrincipalSecret(clientId, secret, domain).then((creds) => {
  client = new AzureServiceClient(creds);
  let options = {
    method: 'GET',
    url: `https://management.azure.com/subscriptions/${subscriptionId}/resourcegroups?api-version=2016-09-01`,
    headers: {
      'user-agent': 'MyTestApp/1.0'
    }
  }
  return client.sendRequest(options);
}).then((result) => {
  console.dir(result, {depth: null, colors: true});
}).catch((err) => {
  console.dir(err, {depth: null, colors: true});
});
```

## Related Projects

- [AutoRest](https://github.com/Azure/AutoRest)
