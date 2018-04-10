---
uid: azure-arm-eventgrid
summary: *content

---
# Microsoft Azure SDK for Node.js - EventGridManagementClient
This project provides a Node.js package for accessing Azure. Right now it supports:
- **Node.js version 6.x.x or higher**

## Features


## How to Install

```bash
npm install azure-arm-eventgrid
```

## How to use

### Authentication, client creation and get eventSubscriptions as an example.

```javascript
const msRestAzure = require("ms-rest-azure");
const EventGridManagementClient = require("azure-arm-eventgrid");
msRestAzure.interactiveLogin().then((creds) => {
    const subscriptionId = "<Subscription_Id>";
    const client = new EventGridManagementClient(creds, subscriptionId);
    const scope = "testscope";
    const eventSubscriptionName = "testeventSubscriptionName";
    return client.eventSubscriptions.get(scope, eventSubscriptionName).then((result) => {
      console.log("The result is:");
      console.log(result);
    });
}).catch((err) => {
  console.log('An error occurred:');
  console.dir(err, {depth: null, colors: true});
});

## Related projects

- [Microsoft Azure SDK for Node.js](https://github.com/Azure/azure-sdk-for-node)
