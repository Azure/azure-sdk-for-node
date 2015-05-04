# Microsoft Azure SDK for Node.js - Web Site Management

This project provides a Node.js package that makes it easy to manage Microsoft Azure Web Site. Right now it supports:
- **Node.js version: 0.6.15 or higher**
- **API version: 2013-08-01**

## Features

- Manage web space
- Manage web site
- Manage web farm

## How to Install

```bash
npm install azure-asm-website
```

## How to Use

### Authentication

This library support management certificate authentication. To authenticate the library for the REST API calls, you need to
* Have a management certificate set up in your Microsoft Azure subscription. You can do this by
  * Either uploading a certificate in the [Microsoft Azure management portal](https://manage.windowsazure.com).
  * Or use the [Microsoft Azure Xplat-CLI](https://github.com/Azure/azure-xplat-cli).
* Obtain the .pem file of your certificate. If you used [Microsoft Azure Xplat-CLI](https://github.com/Azure/azure-xplat-cli) to set it up. You can run ``azure account cert export`` to get the .pem file.

### Create the WebSiteManagementClient

```javascript
var fs                = require('fs'),
    webSiteManagement = require('azure-asm-website');

var webSiteManagementClient = webSiteManagement.createWebsiteManagementClient(webSiteManagement.createCertificateCloudCredentials({
  subscriptionId: '<your subscription id>',
  pem: fs.readFileSync('<your pem file>')
}));
```

### Manage Web Site

```javascript
var webSiteName = "website01";

// Get all the available webspaces under a subscription.
webSiteManagementClient.webSpaces.list(function (err, result) {
    if (err) {
    console.error(err);
  } else {
    console.info(result);
  }
});

// Create a web site.
webSiteManagementClient.webSites.create("westuswebspace", {
  name: webSiteName,
  hostNames: [webSiteName + ".azurewebsites.net"],
  webSpaceName: "westuswebspace"
}, function (err, result) {
  if (err) {
    console.error(err);
  } else {
    console.info(result);
  }
});
```

## Related projects

- [Microsoft Azure SDK for Node.js - All-up](https://github.com/WindowsAzure/azure-sdk-for-node)
