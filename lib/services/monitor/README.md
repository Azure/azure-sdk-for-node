# Microsoft Azure SDK for Node.js - Azure Monitor Management

This project provides a Node.js package that makes it easy to use the Azure Monitor API. Right now it supports:
- **Node.js version: 6.x or higher**

## How to Install

```bash
npm install azure-monitor
```

## How to Use

### Authentication, client creation and listing activityLogs as an example.

 ```javascript
 const msRestAzure = require('ms-rest-azure');
 const monitorClient = require('azure-monitor');
 
 // Interactive Login
 // It provides a url and code that needs to be copied and pasted in a browser and authenticated over there. If successful, 
 // the user will get a DeviceTokenCredentials object.
 msRestAzure.interactiveLogin().then((credentials) => {
   let client = new monitorManagementClient(credentials, 'your-subscription-id');
   return client.activityLogs.list();
 }).then((activityLogs) => {
    console.log('List of activityLogs:');
    console.dir(activityLogs, {depth: null, colors: true});
    return;
}).catch((err) => {
  console.log('An error ocurred');
  console.dir(err, {depth: null, colors: true});
  return;
});
 ```

## Related projects

- [Microsoft Azure SDK for Node.js - All-up](https://github.com/WindowsAzure/azure-sdk-for-node)
