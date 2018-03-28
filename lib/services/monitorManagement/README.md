# Microsoft Azure SDK for Node.js - MonitorManagementClient
This project provides a Node.js package for accessing Azure. Right now it supports:
- **Node.js version 6.x.x or higher**

## Features


## How to Install

```bash
npm install azure-arm-monitor
```

## How to use

### Authentication, client creation and listByResourceGroup autoscaleSettings as an example.

```javascript
const msRestAzure = require("ms-rest-azure");
const MonitorManagementClient = require("azure-arm-monitor");
msRestAzure.interactiveLogin().then((creds) => {
    const subscriptionId = "<Subscription_Id>";
    const client = new MonitorManagementClient(creds, subscriptionId);
    const resourceGroupName = "testresourceGroupName";
    return client.autoscaleSettings.listByResourceGroup(resourceGroupName).then((result) => {
      console.log("The result is:");
      console.log(result);
    });
}).catch((err) => {
  console.log('An error ocurred:');
  console.dir(err, {depth: null, colors: true});
});

## Related projects

- [Microsoft Azure SDK for Node.js](https://github.com/Azure/azure-sdk-for-node)
