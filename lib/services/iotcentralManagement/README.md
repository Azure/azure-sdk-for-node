---
uid: azure-arm-iotcentral
summary: *content

---
# Microsoft Azure SDK for Node.js - IotCentralClient
This project provides a Node.js package for accessing Azure. Right now it supports:
- **Node.js version 6.x.x or higher**

## Features


## How to Install

```bash
npm install azure-arm-iotcentral
```

## How to use

### Authentication, client creation and get apps as an example.

```javascript
const msRestAzure = require("ms-rest-azure");
const IotCentralClient = require("azure-arm-iotcentral");
msRestAzure.interactiveLogin().then((creds) => {
    const subscriptionId = "<Subscription_Id>";
    const client = new IotCentralClient(creds, subscriptionId);
    const resourceGroupName = "testresourceGroupName";
    const resourceName = "testresourceName";
    return client.apps.get(resourceGroupName, resourceName).then((result) => {
      console.log("The result is:");
      console.log(result);
    });
}).catch((err) => {
  console.log('An error occurred:');
  console.dir(err, {depth: null, colors: true});
});

## Related projects

- [Microsoft Azure SDK for Node.js](https://github.com/Azure/azure-sdk-for-node)
