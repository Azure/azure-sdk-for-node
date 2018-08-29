---
uid: azure-arm-resourcehealth
summary: *content

---
# Microsoft Azure SDK for Node.js - MicrosoftResourceHealth
This project provides a Node.js package for accessing Azure. Right now it supports:
- **Node.js version 6.x.x or higher**

## Features


## How to Install

```bash
npm install azure-arm-resourcehealth
```

## How to use

### Authentication, client creation and listBySubscriptionId availabilityStatuses as an example.

```javascript
const msRestAzure = require("ms-rest-azure");
const MicrosoftResourceHealth = require("azure-arm-resourcehealth");
msRestAzure.interactiveLogin().then((creds) => {
    const subscriptionId = "<Subscription_Id>";
    const client = new MicrosoftResourceHealth(creds, subscriptionId);
    const filter = "testfilter";
    const expand = "testexpand";
    return client.availabilityStatuses.listBySubscriptionId(filter, expand).then((result) => {
      console.log("The result is:");
      console.log(result);
    });
}).catch((err) => {
  console.log('An error occurred:');
  console.dir(err, {depth: null, colors: true});
});

## Related projects

- [Microsoft Azure SDK for Node.js](https://github.com/Azure/azure-sdk-for-node)
