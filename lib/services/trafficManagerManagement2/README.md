---
uid: azure-arm-trafficmanager
summary: *content

---
# Microsoft Azure SDK for Node.js - TrafficManagerManagementClient
This project provides a Node.js package for accessing Azure. Right now it supports:
- **Node.js version 6.x.x or higher**

## Features


## How to Install

```bash
npm install azure-arm-trafficmanager
```

## How to use

### Authentication, client creation and get endpoints as an example.

```javascript
const msRestAzure = require("ms-rest-azure");
const TrafficManagerManagementClient = require("azure-arm-trafficmanager");
msRestAzure.interactiveLogin().then((creds) => {
    const subscriptionId = "<Subscription_Id>";
    const client = new TrafficManagerManagementClient(creds, subscriptionId);
    const resourceGroupName = "testresourceGroupName";
    const profileName = "testprofileName";
    const endpointType = "testendpointType";
    const endpointName = "testendpointName";
    return client.endpoints.get(resourceGroupName, profileName, endpointType, endpointName).then((result) => {
      console.log("The result is:");
      console.log(result);
    });
}).catch((err) => {
  console.log('An error occurred:');
  console.dir(err, {depth: null, colors: true});
});

## Related projects

- [Microsoft Azure SDK for Node.js](https://github.com/Azure/azure-sdk-for-node)
