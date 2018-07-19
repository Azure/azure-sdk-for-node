---
uid: azure-arm-dns
summary: *content

---
# Microsoft Azure SDK for Node.js - DnsManagementClient
This project provides a Node.js package for accessing Azure. Right now it supports:
- **Node.js version 6.x.x or higher**

## Features


## How to Install

```bash
npm install azure-arm-dns
```

## How to use

### Authentication, client creation and get recordSets as an example.

```javascript
const msRestAzure = require("ms-rest-azure");
const DnsManagementClient = require("azure-arm-dns");
msRestAzure.interactiveLogin().then((creds) => {
    const subscriptionId = "<Subscription_Id>";
    const client = new DnsManagementClient(creds, subscriptionId);
    const resourceGroupName = "testresourceGroupName";
    const zoneName = "testzoneName";
    const relativeRecordSetName = "testrelativeRecordSetName";
    const recordType = "A";
    return client.recordSets.get(resourceGroupName, zoneName, relativeRecordSetName, recordType).then((result) => {
      console.log("The result is:");
      console.log(result);
    });
}).catch((err) => {
  console.log('An error ocurred:');
  console.dir(err, {depth: null, colors: true});
});

## Related projects

- [Microsoft Azure SDK for Node.js](https://github.com/Azure/azure-sdk-for-node)
