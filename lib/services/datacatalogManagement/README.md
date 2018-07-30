---
uid: azure-arm-datacatalog
summary: *content

---
# Microsoft Azure SDK for Node.js - DataCatalogRestClient
This project provides a Node.js package for accessing Azure. Right now it supports:
- **Node.js version 6.x.x or higher**

## Features


## How to Install

```bash
npm install azure-arm-datacatalog
```

## How to use

### Authentication, client creation and list aDCOperations as an example.

```javascript
const msRestAzure = require("ms-rest-azure");
const DataCatalogRestClient = require("azure-arm-datacatalog");
msRestAzure.interactiveLogin().then((creds) => {
    const subscriptionId = "<Subscription_Id>";
    const client = new DataCatalogRestClient(creds, subscriptionId);
    return client.aDCOperations.list().then((result) => {
      console.log("The result is:");
      console.log(result);
    });
}).catch((err) => {
  console.log('An error ocurred:');
  console.dir(err, {depth: null, colors: true});
});

## Related projects

- [Microsoft Azure SDK for Node.js](https://github.com/Azure/azure-sdk-for-node)
