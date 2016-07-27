# Microsoft Azure SDK for Node.js - Batch Service

This project provides a Node.js package that makes it easy to work with Microsoft Azure Batch Service. Right now it supports:
- **Node.js version: 4.x.x or higher**

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
options = {}
options.jobListOptions = { maxResults : 10 };

client.job.list(options, function (error, result) {
    
    var loop = function (nextLink) {
        if (nextLink !== null && nextLink !== undefined) {
            client.job.listNext(nextLink, function (err, res) {
                console.log(res);
                loop(res.odatanextLink);
            });
        }
    };

    console.log(result);
    loop(result.odatanextLink);
});
```
