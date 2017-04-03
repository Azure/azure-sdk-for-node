# Microsoft Azure SDK for Node.js - SchedulerManagement

This project provides a Node.js package that makes it easy to manage Microsoft Azure Scheduler.
## API-Version: 2016-04-01
## Minimum node.js version >= 6.x.x

## How to Install

```bash
npm install azure-arm-scheduler
```

## How to Use

### Authentication, client creation and listing zones as an example

 ```javascript
 const msRestAzure = require('ms-rest-azure');
 const SchedulerManagement = require("azure-arm-scheduler");
 
 // Interactive Login
 // It provides a url and code that needs to be copied and pasted in a browser and authenticated over there. If successful, 
 // the user will get a DeviceTokenCredentials object.
 msRestAzure.interactiveLogin().then((credentials) => {
   let client = new SchedulerManagement(credentials, 'your-subscription-id');
   return client.zones.list();
 }).then((zones) => {
  console.log('List of zones:');
  console.dir(zones, {depth: null, colors: true});
}).catch((err) => {
   console.log('An error ocurred');
   console.dir(err, {depth: null, colors: true});
 });
```

## Related projects

- [Microsoft Azure SDK for Node.js](https://github.com/Azure/azure-sdk-for-node)