---
uid: azure-arm-storagesync
summary: *content

---
# Microsoft Azure SDK for Node.js - ServerManagement
This project provides a Node.js package for accessing Azure. Right now it supports:
- **Node.js version 6.x.x or higher**

## Features


## How to Install

```bash
npm install azure-arm-storagesync
```

## How to use

### Authentication, client creation and get gateway as an example.

```javascript
const msRestAzure = require("ms-rest-azure");
const ServerManagement = require("azure-arm-storagesync");
msRestAzure.interactiveLogin().then((creds) => {
    const subscriptionId = "<Subscription_Id>";
    const client = new ServerManagement(creds, subscriptionId);
    const resourceGroupName = "testresourceGroupName";
    const gatewayName = "testgatewayName";
    const expand = "status";
    return client.gateway.get(resourceGroupName, gatewayName, expand).then((result) => {
      console.log("The result is:");
      console.log(result);
    });
}).catch((err) => {
  console.log('An error occurred:');
  console.dir(err, {depth: null, colors: true});
});

## Related projects

- [Microsoft Azure SDK for Node.js](https://github.com/Azure/azure-sdk-for-node)
