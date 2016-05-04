# Microsoft Azure SDK for Node.js - Batch Management

This project provides a Node.js package that makes it easy to manage Microsoft Azure Batch Resources. Right now it supports:
- **Node.js version: 0.10.0 or higher**

## How to Install

```bash
npm install azure-arm-batch
```

## How to use

### Authentication

 ```javascript
 var msrestAzure = require('ms-rest-azure');
 //user authentication
 var credentials = new msRestAzure.UserTokenCredentials('your-client-id', 'your-domain', 'your-username', 'your-password', 'your-redirect-uri');
 //service principal authentication
 var credentials = new msRestAzure.ApplicationTokenCredentials('your-client-id', 'your-domain', 'your-secret');
 ```

### Create the BatchManagementClient

```javascript
var batchManagementClient = require('azure-arm-batch');
var client = new batchManagementClient(credentials, 'your-subscription-id');
```

## List Accounts

```javascript
client.account.list('resourceGrp', function (err, result, request, response) { 
    should.not.exist(err); 
    should.exist(result); 
    result.length.should.be.above(0); 
    response.statusCode.should.equal(200); 
    done(); 
  }); 
}); 
```

