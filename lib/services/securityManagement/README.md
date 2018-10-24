---
uid: azure-arm-security
summary: *content

---
# Microsoft Azure SDK for Node.js - SecurityCenter
This project provides a Node.js package for accessing Azure. Right now it supports:
- **Node.js version 6.x.x or higher**

## Features


## How to Install

```bash
npm install azure-arm-security
```

## How to use

### Authentication, client creation and list pricings as an example.

```javascript
const msRestAzure = require("ms-rest-azure");
const SecurityCenter = require("azure-arm-security");
msRestAzure.interactiveLogin().then((creds) => {
    const subscriptionId = "<Subscription_Id>";
    const client = new SecurityCenter(creds, subscriptionId);
    return client.pricings.list().then((result) => {
      console.log("The result is:");
      console.log(result);
    });
}).catch((err) => {
  console.log('An error occurred:');
  console.dir(err, {depth: null, colors: true});
});

## Related projects

- [Microsoft Azure SDK for Node.js](https://github.com/Azure/azure-sdk-for-node)
