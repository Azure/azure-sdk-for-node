---
uid: azure-arm-website
summary: *content

---
# Microsoft Azure SDK for Node.js - WebSiteManagementClient
This project provides a Node.js package for accessing Azure. Right now it supports:
- **Node.js version 6.x.x or higher**

## Features


## How to Install

```bash
npm install azure-arm-website
```

## How to use

### Authentication, client creation and list appServiceCertificateOrders as an example.

```javascript
const msRestAzure = require("ms-rest-azure");
const WebSiteManagementClient = require("azure-arm-website");
msRestAzure.interactiveLogin().then((creds) => {
    const subscriptionId = "<Subscription_Id>";
    const client = new WebSiteManagementClient(creds, subscriptionId);
    return client.appServiceCertificateOrders.list().then((result) => {
      console.log("The result is:");
      console.log(result);
    });
}).catch((err) => {
  console.log('An error occurred:');
  console.dir(err, {depth: null, colors: true});
});

## Related projects

- [Microsoft Azure SDK for Node.js](https://github.com/Azure/azure-sdk-for-node)


![Impressions](https://azure-sdk-impressions.azurewebsites.net/api/impressions/azure-sdk-for-node%2Flib%2Fservices%2FwebsiteManagement2%2FREADME.png)
