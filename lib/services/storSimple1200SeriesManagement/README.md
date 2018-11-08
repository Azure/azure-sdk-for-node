---
uid: azure-arm-storsimple1200series
summary: *content

---
# Microsoft Azure SDK for Node.js - StorSimpleManagementClient
This project provides a Node.js package for accessing Azure. Right now it supports:
- **Node.js version 6.x.x or higher**

## Features


## How to Install

```bash
npm install azure-arm-storsimple1200series
```

## How to use

### Authentication, client creation and list managers as an example.

```javascript
const msRestAzure = require("ms-rest-azure");
const StorSimpleManagementClient = require("azure-arm-storsimple1200series");
msRestAzure.interactiveLogin().then((creds) => {
    const subscriptionId = "<Subscription_Id>";
    const client = new StorSimpleManagementClient(creds, subscriptionId);
    return client.managers.list().then((result) => {
      console.log("The result is:");
      console.log(result);
    });
}).catch((err) => {
  console.log('An error occurred:');
  console.dir(err, {depth: null, colors: true});
});

## Related projects

- [Microsoft Azure SDK for Node.js](https://github.com/Azure/azure-sdk-for-node)
