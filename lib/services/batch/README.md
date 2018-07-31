---
uid: azure-batch
summary: *content

---
# Microsoft Azure SDK for Node.js - Batch Service

This project provides a Node.js package that makes it easy to work with Microsoft Azure Batch Service. Right now it supports:
- **Node.js version: 6.x.x or higher**

Please check details on [API reference documents](http://azure.github.io/azure-sdk-for-node/azure-batch/latest/).

## How to Install

```bash
npm install azure-batch
```

## How to use

### Authentication

 ```javascript
 var batch = require('azure-batch');

 //user authentication
 var credentials = new batch.SharedKeyCredentials('your-account-name', 'your-account-key');
 ```

### Create the BatchServiceClient

```javascript

var client = new batch.ServiceClient(credentials, 'your-batch-endpoint');
```

## List all Jobs under account

```javascript
let options = {}
options.jobListOptions = { maxResults : 10 };

function loop(nextLink) {
  if (nextLink !== null && nextLink !== undefined) {
    return client.job.listNext(nextLink).then((res) => {
      console.dir(res, {depth: null, colors: true});
      return loop(res.odatanextLink);
    });
  }
  return Promise.resolve();
};


client.job.list(options).then((result) => {
  console.dir(result, {depth: null, colors: true});
}).then((result) => {
  return loop(result.odatanextLink);
}).catch((err) => {
  console.log('An error occurred.');
  console.dir(err, {depth: null, colors: true});
});
```
