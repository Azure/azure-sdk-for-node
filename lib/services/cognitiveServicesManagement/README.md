---
uid: azure-arm-cognitiveservices
summary: *content

---
# Microsoft Azure SDK for Node.js - CognitiveServicesManagementClient
This project provides a Node.js package for accessing Azure. Right now it supports:
- **Node.js version 6.x.x or higher**

## Features


## How to Install

```bash
npm install azure-arm-cognitiveservices
```

## How to use

### Authentication, client creation and getProperties accounts as an example.

```javascript
const msRestAzure = require("ms-rest-azure");
const CognitiveServicesManagementClient = require("azure-arm-cognitiveservices");
msRestAzure.interactiveLogin().then((creds) => {
    const subscriptionId = "<Subscription_Id>";
    const client = new CognitiveServicesManagementClient(creds, subscriptionId);
    const resourceGroupName = "testresourceGroupName";
    const accountName = "testaccountName";
    return client.accounts.getProperties(resourceGroupName, accountName).then((result) => {
      console.log("The result is:");
      console.log(result);
    });
}).catch((err) => {
  console.log('An error ocurred:');
  console.dir(err, {depth: null, colors: true});
});

## Related projects

- [Microsoft Azure SDK for Node.js](https://github.com/Azure/azure-sdk-for-node)
