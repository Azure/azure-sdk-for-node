---
uid: azure-arm-visualstudio
summary: *content

---
# Microsoft Azure SDK for Node.js - VisualStudioResourceProviderClient
This project provides a Node.js package for accessing Azure. Right now it supports:
- **Node.js version 6.x.x or higher**

## Features


## How to Install

```bash
npm install azure-arm-visualstudio
```

## How to use

### Authentication, client creation and list operations as an example.

```javascript
const msRestAzure = require("ms-rest-azure");
const VisualStudioResourceProviderClient = require("azure-arm-visualstudio");
msRestAzure.interactiveLogin().then((creds) => {
    const subscriptionId = "<Subscription_Id>";
    const client = new VisualStudioResourceProviderClient(creds, subscriptionId);
    return client.operations.list().then((result) => {
      console.log("The result is:");
      console.log(result);
    });
}).catch((err) => {
  console.log('An error occurred:');
  console.dir(err, {depth: null, colors: true});
});

## Related projects

- [Microsoft Azure SDK for Node.js](https://github.com/Azure/azure-sdk-for-node)
