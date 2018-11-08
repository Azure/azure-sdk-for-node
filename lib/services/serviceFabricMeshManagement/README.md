---
uid: azure-arm-servicefabricmesh
summary: *content

---
# Microsoft Azure SDK for Node.js - ServiceFabricMeshManagementClient
This project provides a Node.js package for accessing Azure. Right now it supports:
- **Node.js version 6.x.x or higher**

## Features


## How to Install

```bash
npm install azure-arm-servicefabricmesh
```

## How to use

### Authentication, client creation and list operations as an example.

```javascript
const msRestAzure = require("ms-rest-azure");
const ServiceFabricMeshManagementClient = require("azure-arm-servicefabricmesh");
msRestAzure.interactiveLogin().then((creds) => {
    const subscriptionId = "<Subscription_Id>";
    const client = new ServiceFabricMeshManagementClient(creds, subscriptionId);
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
