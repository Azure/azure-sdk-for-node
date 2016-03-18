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

## List Node Agent SKUs

```javascript
options.accountListNodeAgentSkusOptions = { maxresults : 1 };

client.account.listNodeAgentSkus(options, function (error, result) {
    
    var loop = function (nextLink) {
        if (nextLink !== null && nextLink !== undefined) {
            testClient.account.listNodeAgentSkusNext(nextLink, function (err, res) {
                console.log(res);
                loop(res['odata.nextLink']);
            });
        }
    };

    should.not.exist(error);
    console.log(result);
    loop(result['odata.nextLink'])
});
```

## Detailed Sample
A detailed sample for something, something can be found  [here](https://github.com/Azure/azure-sdk-for-node/blob/autorest/examples/batch/some-sample.js).
