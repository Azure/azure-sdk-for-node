# Microsoft Azure SDK for Node.js - ACEProvisioningManagementPartnerAPI
This project provides a Node.js package for accessing Azure. Right now it supports:
- **Node.js version 6.x.x or higher**

## Features


## How to Install

```bash
npm install azure-arm-managementpartner
```

## How to use

### Authentication, client creation and get partner as an example.

```javascript
const msRestAzure = require("ms-rest-azure");
const ACEProvisioningManagementPartnerAPI = require("azure-arm-managementpartner");
msRestAzure.interactiveLogin().then((creds) => {
    const subscriptionId = "<Subscription_Id>";
    const client = new ACEProvisioningManagementPartnerAPI(creds, subscriptionId);
    const partnerId = "testpartnerId";
    return client.partner.get(partnerId).then((result) => {
      console.log("The result is:");
      console.log(result);
    });
}).catch((err) => {
  console.log('An error ocurred:');
  console.dir(err, {depth: null, colors: true});
});

## Related projects

- [Microsoft Azure SDK for Node.js](https://github.com/Azure/azure-sdk-for-node)
