# Microsoft Azure SDK for Node.js - Legacy Storage

This project provides a Node.js package that lets you consume Azure storage services.
This package exists to provide back compatibility with previous versions of the azure
sdk for node.
- **API version: 2013-03-01**

## Features

- Blob client
- Table Store client
- Queue client

## How to Install

```bash
npm install azure-storage-legacy
```

## How to Use

## Usage

### Table Storage

To ensure a table exists, call **createTableIfNotExists**:

```Javascript
var tableService = storage.createTableService();
tableService.createTableIfNotExists('tasktable', function(error){
    if(!error){
        // Table exists
    }
});
```
A new entity can be added by calling **insertEntity**:

```Javascript
var tableService = storage.createTableService(),
    task1 = {
        PartitionKey : 'tasksSeattle',
        RowKey: '1',
        Description: 'Take out the trash',
        DueDate: new Date(2011, 12, 14, 12)
    };
tableService.insertEntity('tasktable', task1, function(error){
    if(!error){
        // Entity inserted
    }
});
```

The method **queryEntity** can then be used to fetch the entity that was just inserted:

```Javascript
var tableService = storage.createTableService();
tableService.queryEntity('tasktable', 'tasksSeattle', '1', function(error, serverEntity){
    if(!error){
        // Entity available in serverEntity variable
    }
});
```

## Blob Storage

The **createContainerIfNotExists** method can be used to create a
container in which to store a blob:

```Javascript
var blobService = storage.createBlobService();
blobService.createContainerIfNotExists('taskcontainer', {publicAccessLevel : 'blob'}, function(error){
    if(!error){
        // Container exists and is public
    }
});
```

To upload a file (assuming it is called task1-upload.txt and it is placed in the same folder as the script below), the method **createBlob** can be used. This method will return a writable stream which can be writen to, for instance, through piping:

```Javascript
var blobService = storage.createBlobService();

fs.createReadStream('task1-upload.txt').pipe(blobService.createBlob('taskcontainer', 'task1', storage.Constants.BlobConstants.BlobTypes.BLOCK));
```

To download the blob and write it to the file system, a similar **getBlob** method can be used:

```Javascript
var blobService = storage.createBlobService();

blobService.getBlob('taskcontainer', 'task1').pipe(fs.createWriteStream('task1-download.txt'));
```

To create a SAS URL you can use the **getBlobUrl** method. Additionally you can use the **date** helper functions to easily create a SAS that expires at some point relative to the current time.

```Javascript
var blobService = storage.createBlobService();

//create a SAS that expires in an hour
var sharedAccessPolicy = {
    AccessPolicy: {
        Expiry: storage.date.minutesFromNow(60);
    }
};

var sasUrl = blobService.getBlobUrl(containerName, blobName, sharedAccessPolicy);
```

## Storage Queues

The **createQueueIfNotExists** method can be used to ensure a queue exists:

```Javascript
var queueService = storage.createQueueService();
queueService.createQueueIfNotExists('taskqueue', function(error){
    if(!error){
        // Queue exists
    }
});
```

The **createMessage** method can then be called to insert the message into the queue:

```Javascript
var queueService = storage.createQueueService();
queueService.createMessage('taskqueue', 'Hello world!', function(error){
    if(!error){
        // Message inserted
    }
});
```

It is then possible to call the **getMessage** method, process the message and then call **deleteMessage** inside the callback. This two-step process ensures messages don't get lost when they are removed from the queue.

```Javascript
var queueService = storage.createQueueService(),
    queueName = 'taskqueue';
queueService.getMessages(queueName, function(error, serverMessages){
    if(!error){
        // Process the message in less than 30 seconds, the message
        // text is available in serverMessages[0].messagetext

        queueService.deleteMessage(queueName, serverMessages[0].messageid, serverMessages[0].popreceipt, function(error){
            if(!error){
                // Message deleted
            }
        });
    }
});
```

## Related projects

- [Microsoft Azure SDK for Node.js](https://github.com/WindowsAzure/azure-sdk-for-node)
- [Microsoft Azure SDK for Node.js - Storage Blob](https://github.com/WindowsAzure/azure-sdk-for-node/tree/master/lib/services/blob)
- [Microsoft Azure SDK for Node.js - Storage Table](https://github.com/WindowsAzure/azure-sdk-for-node/tree/master/lib/services/table)
- [Microsoft Azure SDK for Node.js - Storage Queue](https://github.com/WindowsAzure/azure-sdk-for-node/tree/master/lib/services/queue)
