---
uid: azure-arm-consumption
summary: *content

---
# Microsoft Azure SDK for Node.js - ConsumptionManagementClient
This project provides a Node.js package for accessing Azure. Right now it supports:
- **Node.js version 6.x.x or higher**

## Features


## How to Install

```bash
npm install azure-arm-consumption
```

## How to use

### Authentication, client creation and list usageDetails as an example.

```javascript
const msRestAzure = require("ms-rest-azure");
const ConsumptionManagementClient = require("azure-arm-consumption");
msRestAzure.interactiveLogin().then((creds) => {
    const subscriptionId = "<Subscription_Id>";
    const client = new ConsumptionManagementClient(creds, subscriptionId);
    const expand = "testexpand";
    const filter = "testfilter";
    const skiptoken = "testskiptoken";
    const top = 1;
    const apply = "testapply";
    return client.usageDetails.list(expand, filter, skiptoken, top, apply).then((result) => {
      console.log("The result is:");
      console.log(result);
    });
}).catch((err) => {
  console.log('An error ocurred:');
  console.dir(err, {depth: null, colors: true});
});

## Related projects

- [Microsoft Azure SDK for Node.js](https://github.com/Azure/azure-sdk-for-node)
