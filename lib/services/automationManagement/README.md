---
uid: azure-arm-automation
summary: *content

---
# Microsoft Azure SDK for Node.js - AutomationClient
This project provides a Node.js package for accessing Azure. Right now it supports:
- **Node.js version 6.x.x or higher**

## Features


## How to Install

```bash
npm install azure-arm-automation
```

## How to use

### Authentication, client creation and get automationAccount as an example.

```javascript
const msRestAzure = require("ms-rest-azure");
const AutomationClient = require("azure-arm-automation");
msRestAzure.interactiveLogin().then((creds) => {
    const subscriptionId = "<Subscription_Id>";
    const client = new AutomationClient(creds, subscriptionId);
    const resourceGroupName = "testresourceGroupName";
    const automationAccountName = "testautomationAccountName";
    return client.automationAccount.get(resourceGroupName, automationAccountName).then((result) => {
      console.log("The result is:");
      console.log(result);
    });
}).catch((err) => {
  console.log('An error ocurred:');
  console.dir(err, {depth: null, colors: true});
});

## Related projects

- [Microsoft Azure SDK for Node.js](https://github.com/Azure/azure-sdk-for-node)
