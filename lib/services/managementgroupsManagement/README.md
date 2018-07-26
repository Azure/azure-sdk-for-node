# Microsoft Azure SDK for Node.js - ManagementGroupsAPI
This project provides a Node.js package for accessing Azure. Right now it supports:
- **Node.js version 6.x.x or higher**

## Features


## How to Install

```bash
npm install azure-arm-managementgroups
```

## How to use

### Authentication, client creation and list managementGroups as an example.

```javascript
const msRestAzure = require("ms-rest-azure");
const ManagementGroupsAPI = require("azure-arm-managementgroups");
msRestAzure.interactiveLogin().then((creds) => {
    const subscriptionId = "<Subscription_Id>";
    const client = new ManagementGroupsAPI(creds, subscriptionId);
    const cacheControl = "testcacheControl";
    const skiptoken = "testskiptoken";
    return client.managementGroups.list(cacheControl, skiptoken).then((result) => {
      console.log("The result is:");
      console.log(result);
    });
}).catch((err) => {
  console.log('An error ocurred:');
  console.dir(err, {depth: null, colors: true});
});

## Related projects

- [Microsoft Azure SDK for Node.js](https://github.com/Azure/azure-sdk-for-node)
