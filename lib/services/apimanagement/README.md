---
uid: azure-arm-apimanagement
summary: *content

---
# Microsoft Azure SDK for Node.js - ApiManagementClient
This project provides a Node.js package for accessing Azure. Right now it supports:
- **Node.js version 6.x.x or higher**

## Features


## How to Install

```bash
npm install azure-arm-apimanagement
```

## How to use

### Authentication, client creation and listByService policy as an example.

```javascript
const msRestAzure = require("ms-rest-azure");
const ApiManagementClient = require("azure-arm-apimanagement");
msRestAzure.interactiveLogin().then((creds) => {
    const subscriptionId = "<Subscription_Id>";
    const client = new ApiManagementClient(creds, subscriptionId);
    const resourceGroupName = "testresourceGroupName";
    const serviceName = "testserviceName";
    const scope = "Tenant";
    return client.policy.listByService(resourceGroupName, serviceName, scope).then((result) => {
      console.log("The result is:");
      console.log(result);
    });
}).catch((err) => {
  console.log('An error ocurred:');
  console.dir(err, {depth: null, colors: true});
});

## Related projects

- [Microsoft Azure SDK for Node.js](https://github.com/Azure/azure-sdk-for-node)
