# Microsoft Azure SDK for Node.js - SqlManagementClient
This project provides a Node.js package for accessing Azure. Right now it supports:
- **Node.js version 6.x.x or higher**

## Features


## How to Install

```bash
npm install azure-arm-sql
```

## How to use

### Authentication, client creation and get recoverableDatabases as an example.

```javascript
const msRestAzure = require("ms-rest-azure");
const SqlManagementClient = require("azure-arm-sql");
msRestAzure.interactiveLogin().then((creds) => {
    const subscriptionId = "<Subscription_Id>";
    const client = new SqlManagementClient(creds, subscriptionId);
    const resourceGroupName = "testresourceGroupName";
    const serverName = "testserverName";
    const databaseName = "testdatabaseName";
    return client.recoverableDatabases.get(resourceGroupName, serverName, databaseName).then((result) => {
      console.log("The result is:");
      console.log(result);
    });
}).catch((err) => {
  console.log('An error ocurred:');
  console.dir(err, {depth: null, colors: true});
});

## Related projects

- [Microsoft Azure SDK for Node.js](https://github.com/Azure/azure-sdk-for-node)
