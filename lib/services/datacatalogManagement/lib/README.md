# Microsoft Azure SDK for Node.js - DataCatalogRestClient
This project provides a Node.js package for accessing Azure. Right now it supports:
- **Node.js version 6.x.x or higher**

## Features


## How to Install

```bash
npm install
```

## How to use

### Authentication, client creation and list aDCOperations as an example.

```javascript
import * as msRest from "ms-rest";
import { DataCatalogRestClient, DataCatalogRestModels } from "azure-arm-datacatalog";
const subscriptionId = "<Subscription_Id>";
const token = "<access_token>";
const creds = new msRest.TokenCredentials(token);
const client = new DataCatalogRestClient(creds, subscriptionId);
client.aDCOperations.list().then((result) => {
  console.log("The result is:");
  console.log(result);
}).catch((err) => {
  console.log('An error ocurred:');
  console.dir(err, {depth: null, colors: true});
});

## Related projects

- [Microsoft Azure SDK for Node.js](https://github.com/Azure/azure-sdk-for-node)
