# Windows Azure SDK for Node.js - Monitoring

This project provides a Node.js package that makes it easy to manage Windows Azure Monitoring. Right now it supports:
- **Node.js version: 0.6.15 or higher**
- **API version: 2012-03-01**

## Features

- TBD

## How to Install

```bash
npm install azure-monitoring
```

## How to Use

### Authentication

This library support management certificate authentication. To authenticate the library for the REST API calls, you need to
* Have a management certificate set up in your Windows Azure subscription. You can do this by
  * Either uploading a certificate in the [Windows Azure management portal](https://manage.windowsazure.com).
  * Or use the [Windows Azure Xplat-CLI](https://github.com/WindowsAzure/azure-sdk-tools-xplat).
* Obtain the .pem file of your certificate. If you used [Windows Azure Xplat-CLI](https://github.com/WindowsAzure/azure-sdk-tools-xplat) to set it up. You can run ``azure account cert export`` to get the .pem file.
* Open the .pem file in a text editor to get the **cert value** and **key value**.

### Create the SqlManagementClient

```javascript
var fs            = require('fs'),
    monitoring = require('azure-monitoring');

var metricsClient = monitoring.createMetricsClient(monitoring.createCertificateCloudCredentials({
  subscriptionId: '<your subscription id>',
  pem: fs.readFileSync('<your pem file>')
}));

var autoScaleClient = monitoring.createAutoScaleClient(monitoring.createCertificateCloudCredentials({
  subscriptionId: '<your subscription id>',
  pem: fs.readFileSync('<your pem file>')
}));

var alertsClient = monitoring.createAlertsClient(monitoring.createCertificateCloudCredentials({
  subscriptionId: '<your subscription id>',
  pem: fs.readFileSync('<your pem file>')
}));
```

## Related projects

- [Windows Azure SDK for Node.js](https://github.com/WindowsAzure/azure-sdk-for-node)
