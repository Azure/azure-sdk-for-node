# Microsoft Azure SDK for Node.js - Subscription Management

This project provides a Node.js package that makes it easy to manage Microsoft Azure subscription. Right now it supports:
- **Node.js version: 0.6.15 or higher**
- **API version: 2013-08-01**

## Features

- Manage subscription

## How to Install

```bash
npm install azure-asm-subscription
```

## How to Use

### Authentication

This library support management certificate authentication. To authenticate the library for the REST API calls, you need to
* Have a management certificate set up in your Microsoft Azure subscription. You can do this by
  * Either uploading a certificate in the [Microsoft Azure management portal](https://manage.windowsazure.com).
  * Or use the [Microsoft Azure Xplat-CLI](https://github.com/Azure/azure-xplat-cli).
* Obtain the .pem file of your certificate. If you used [Microsoft Azure Xplat-CLI](https://github.com/Azure/azure-xplat-cli) to set it up. You can run ``azure account cert export`` to get the .pem file.
* Open the .pem file in a text editor and **certvalue** and **keyvalue**.

### Create the SubscriptionClient

```javascript
var subscriptionManagement = require('azure-asm-subscription');

var subscriptionClient = subscriptionManagement.createSubscriptionClient({
  subscriptionId: '<your subscription id>',
  certvalue: "<your management certificate value>",
  keyvalue: "<your management certificate key value>"
});
```

### Manage Subscription

## Related projects

- [Microsoft Azure SDK for Node.js - All-up](https://github.com/WindowsAzure/azure-sdk-for-node)
