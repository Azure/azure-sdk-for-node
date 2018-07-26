---
uid: azure-arm-commerce
summary: *content

---
# Microsoft Azure SDK for Node.js - UsageManagementClient
This project provides a Node.js package for accessing Azure. Right now it supports:
- **Node.js version 6.x.x or higher**

## Features


## How to Install

```bash
npm install azure-arm-commerce
```

## How to use

### Authentication, client creation and list usageAggregates as an example.

```javascript
const msRestAzure = require("ms-rest-azure");
const UsageManagementClient = require("azure-arm-commerce");
msRestAzure.interactiveLogin().then((creds) => {
    const subscriptionId = "<Subscription_Id>";
    const client = new UsageManagementClient(creds, subscriptionId);
    const reportedStartTime = new Date().toISOString();
    const reportedEndTime = new Date().toISOString();
    const showDetails = true;
    const aggregationGranularity = "Daily";
    const continuationToken = "testcontinuationToken";
    return client.usageAggregates.list(reportedStartTime, reportedEndTime, showDetails, aggregationGranularity, continuationToken).then((result) => {
      console.log("The result is:");
      console.log(result);
    });
}).catch((err) => {
  console.log('An error ocurred:');
  console.dir(err, {depth: null, colors: true});
});

## Related projects

- [Microsoft Azure SDK for Node.js](https://github.com/Azure/azure-sdk-for-node)
