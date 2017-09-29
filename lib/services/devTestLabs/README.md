# Microsoft Azure SDK for Node.js - DevTest Labs Management

This project provides a Node.js package that makes it easy to manage Microsoft Azure DevTest Labs. Right now it supports:
- **Node.js version: 6.x.x or higher**

## How to Install

```bash
npm install azure-arm-devtestlabs
```
## How to Use

### Authentication, client creation and getting properties of a lab as an example

 ```javascript
 var msRestAzure = require('ms-rest-azure');
 var DevTestLabsClient = require('azure-arm-devtestlabs');

 // Interactive Login
 // It provides a url and code that needs to be copied and pasted in a browser and authenticated over there. If successful, 
 // the user will get a DeviceTokenCredentials object.
 msRestAzure.interactiveLogin(function(err, credentials) {
  var client = new DevTestLabsClient(credentials, 'your-subscription-id');
  client.labs.get('name of the resource group', 'name of the lab', function(err, result, request, response) {
    if (err) console.log(err);
    console.log(result);
  });
 });
 ```

## Related projects

- [Microsoft Azure SDK for Node.js - All-up](https://github.com/WindowsAzure/azure-sdk-for-node)
