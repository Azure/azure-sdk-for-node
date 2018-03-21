# Microsoft Azure SDK for Node.js - DataMigrationServiceClient
This project provides a Node.js package for accessing Azure. Right now it supports:
- **Node.js version 6.x.x or higher**

## Features


## How to Install

```bash
npm install azure-arm-datamigration
```

## How to use

### Authentication, client creation and listSkus resourceSkus as an example.

```javascript
import * as msRest from "ms-rest";
import { DataMigrationServiceClient, DataMigrationServiceModels } from "azure-arm-datamigration";
const subscriptionId = "<Subscription_Id>";
const token = "<access_token>";
const creds = new msRest.TokenCredentials(token);
const client = new DataMigrationServiceClient(creds, subscriptionId);
client.resourceSkus.listSkus().then((result) => {
  console.log("The result is:");
  console.log(result);
}).catch((err) => {
  console.log('An error ocurred:');
  console.dir(err, {depth: null, colors: true});
});

## Related projects

- [Microsoft Azure SDK for Node.js](https://github.com/Azure/azure-sdk-for-node)
