# Microsoft Azure SDK for Node.js - ServicebusManagement

This project provides a Node.js package that makes it easy to manage Azure Servicebus Resources. Right now it supports:
- **Node.js version: 6.x or higher**

## How to Install

```bash
npm install azure-arm-sb
```

## How to Use

### Authentication, client creation and listing namespaces within a subscription as an example

 ```javascript
 var msRestAzure = require('ms-rest-azure');
 var ServicebusManagement = require('azure-arm-sb');
 
 // Interactive Login
 msRestAzure.interactiveLogin(function(err, credentials) {
  var client = new ServicebusManagement(credentials, 'your-subscription-id');
  client.namespaces.listBySubscription(function(err, namespaces, request, response) {
    if (err) {
      console.log(err);
    } else {
      namespaces.map(function (ns, index, array) {
        console.log('found ns :' + ns.name);
      }));
    }
  });
 });
 ```

## Related projects

- [Microsoft Azure SDK for Node.js - All-up](https://github.com/WindowsAzure/azure-sdk-for-node)
