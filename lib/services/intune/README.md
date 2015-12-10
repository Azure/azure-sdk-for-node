# Microsoft Azure SDK for Node.js - Intune

This project provides a Node.js package that makes it easy to manage Microsoft Intune Resources. Right now it supports:
- **Node.js version: 5.0.0 or higher**
- **API version: 2015-01-14**

## Features

 - TODO

## How to Install

```bash
npm install azure-arm-intune
```

## How to Use

### Create an Intune resource management client

```javascript
    var msRestAzure = require('ms-rest-azure');
    var IntuneResourceManagementClient = require('azure-arm-intune');

    var credentials = new msRestAzure.UserTokenCredentials(clientId, username, password, subscriptionId);
    var client = new IntuneResourceManagementClient(credentials);

    // Get account location
    var location;
    client.getLocationByHostName(null, function(error, result, request, response) {
        if(error){
          // Handle
        }

        location = result.hostName;

        // Make a call for any resources, e.g. query policies
        client.ios.getMAMPolicies(location, null, null, null, null, function(error, result, request, response) {
              if(error){
                // Handle
              }

              // Do something with results
        });
    });
```

## Related projects

- [Microsoft Azure SDK for Node.js - All-up](https://github.com/WindowsAzure/azure-sdk-for-node)
