---
uid: azure-arm-devtestlabs
summary: *content

---
# Microsoft Azure SDK for Node.js - DevTestLabsClient
This project provides a Node.js package for accessing Azure. Right now it supports:
- **Node.js version 6.x.x or higher**

## Features


## How to Install

```bash
npm install azure-arm-devtestlabs
```

## How to use

### Authentication, client creation and list providerOperations as an example.

```javascript
const msRestAzure = require("ms-rest-azure");
const DevTestLabsClient = require("azure-arm-devtestlabs");
msRestAzure.interactiveLogin().then((creds) => {
    const subscriptionId = "<Subscription_Id>";
    const client = new DevTestLabsClient(creds, subscriptionId);
    return client.providerOperations.list().then((result) => {
      console.log("The result is:");
      console.log(result);
    });
}).catch((err) => {
  console.log('An error ocurred:');
  console.dir(err, {depth: null, colors: true});
});

## Related projects

- [Microsoft Azure SDK for Node.js](https://github.com/Azure/azure-sdk-for-node)
