# Microsoft Azure SDK for Node.js - Batch Service

This project provides a Node.js package that makes it easy to work with Microsoft Azure Batch Service. Right now it supports:
- **Node.js version: 0.10.0 or higher**

## How to Install

```bash
npm install azure-batch
```

## How to use

### Authentication

 ```javascript
 var batchCredentials = require('batchSharedKeyCredentials');
 //user authentication
 var credentials = new batchCredentials('your-account-name', 'your-account-key');
 ```

### Create the BatchServiceClient

```javascript
var batchServiceClient = require('azure-batch');
var client = new batchServiceClient(credentials, 'your-batch-endpoint');
```

## List all Jobs under account

```javascript
options = {}
options.jobListOptions = { maxResults : 10 };

client.job.list(options, function (error, result) {
    
    var loop = function (nextLink) {
        if (nextLink !== null && nextLink !== undefined) {
            testClient.job.listNext(nextLink, function (err, res) {
                console.log(res);
                loop(res.odatanextLink);
            });
        }
    };

    should.not.exist(error);
    console.log(result);
    loop(result.odatanextLink);
});
```
