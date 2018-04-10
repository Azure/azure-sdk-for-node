---
uid: azure-arm-containerregistry
summary: *content

---
# Microsoft Azure SDK for Node.js - ContainerRegistryManagementClient
This project provides a Node.js package for accessing Azure. Right now it supports:
- **Node.js version 6.x.x or higher**

## Features


## How to Install

```bash
npm install azure-arm-containerregistry
```

## How to use

### Authentication, client creation and get registries as an example.

```javascript
const msRestAzure = require("ms-rest-azure");
const ContainerRegistryManagementClient = require("azure-arm-containerregistry");
msRestAzure.interactiveLogin().then((creds) => {
    const subscriptionId = "<Subscription_Id>";
    const client = new ContainerRegistryManagementClient(creds, subscriptionId);
    const resourceGroupName = "testresourceGroupName";
    const registryName = "testregistryName";
    return client.registries.get(resourceGroupName, registryName).then((result) => {
      console.log("The result is:");
      console.log(result);
    });
}).catch((err) => {
  console.log('An error ocurred:');
  console.dir(err, {depth: null, colors: true});
});

## Related projects

- [Microsoft Azure SDK for Node.js](https://github.com/Azure/azure-sdk-for-node)
