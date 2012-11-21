# Windows Azure SDK for Node.js

This project provides a Node.js package that makes it easy to access Windows Azure Services like Table Storage and Service Bus. 

# Library Features

* Tables
    * create and delete tables
    * create, query, insert, update, merge, and delete entities
* Blobs
    * create, list, and delete containers, work with container metadata and permissions, list blobs in container
    * create block and page blobs (from a stream, a file, or a string), work with blob blocks and pages, delete blobs
    * work with blob properties, metadata, leases, snapshot a blob
* Storage Queues
    * create, list, and delete queues, and work with queue metadata
    * create, get, peek, update, delete messages
* Service Bus
    * Queues: create, list and delete queues; create, list, and delete subscriptions; send, receive, unlock and delete messages
    * Topics: create, list, and delete topics; create, list, and delete rules
* Service Runtime
    * discover addresses and ports for the endpoints of other role instances in your service
    * get configuration settings and access local resources
    * get role instance information for current role and other role instances
    * query and set the status of the current role

# Getting Started
## Download Source Code

To get the source code of the SDK via **git** just type:

    git clone https://github.com/WindowsAzure/azure-sdk-for-node.git
    cd ./azure-sdk-for-node

## Install the npm package

You can install the azure npm package directly.

    npm install azure

You can use these packages against the cloud Windows Azure Services, or against
the local Storage Emulator (with the exception of Service Bus features).

1. To use the cloud services, you need to first create an account with Windows Azure. To use the storage services, you need to set the AZURE_STORAGE_ACCOUNT and the AZURE_STORAGE_ACCESS_KEY environment variables to the storage account name and primary access key you obtain from the Azure Portal. To use Service Bus, you need to set the AZURE_SERVICEBUS_NAMESPACE and the AZURE_SERVICEBUS_ACCESS_KEY environment variables to the service bus namespace and the default key you obtain from the Azure Portal.
2. To use the Storage Emulator, make sure the latest version of the Windows Azure SDK is installed on the machine, and set the EMULATED environment variable to any value ("true", "1", etc.)

# Usage
## Table Storage

To ensure a table exists, call **createTableIfNotExists**:

```Javascript
var tableService = azure.createTableService();
tableService.createTableIfNotExists('tasktable', function(error){
    if(!error){
        // Table exists
    }
});
```
A new entity can be added by calling **insertEntity**:

```Javascript
var tableService = azure.createTableService(),
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
var tableService = azure.createTableService();
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
var blobService = azure.createBlobService();
blobService.createContainerIfNotExists('taskcontainer', {publicAccessLevel : 'blob'}, function(error){
    if(!error){
        // Container exists and is public
    }
});
```

To upload a file (assuming it is called task1-upload.txt, it contains the exact text "hello world" (no quotation marks), and it is placed in the same folder as the script below), the method **createBlockBlobFromStream** can be used:

```Javascript
var blobService = azure.createBlobService();
blobService.createBlockBlobFromStream('taskcontainer', 'task1', fs.createReadStream('task1-upload.txt'), 11, function(error){
    if(!error){
        // Blob uploaded
    }
});
```

To download the blob and write it to the file system, the **getBlobToStream** method can be used:

```Javascript
var blobService = azure.createBlobService();
blobService.getBlobToStream('taskcontainer', 'task1', fs.createWriteStream('task1-download.txt'), function(error, serverBlob){
    if(!error){
        // Blob available in serverBlob.blob variable
    }
});
```

## Storage Queues

The **createQueueIfNotExists** method can be used to ensure a queue exists:

```Javascript
var queueService = azure.createQueueService();
queueService.createQueueIfNotExists('taskqueue', function(error){
    if(!error){
        // Queue exists
    }
});
```

The **createMessage** method can then be called to insert the message into the queue:

```Javascript
var queueService = azure.createQueueService();
queueService.createMessage('taskqueue', "Hello world!", function(error){
    if(!error){
        // Message inserted
    }
});
```

It is then possible to call the **getMessage** method, process the message and then call **deleteMessage** inside the callback. This two-step process ensures messages don't get lost when they are removed from the queue.

```Javascript
var queueService = azure.createQueueService(),
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

## Service Bus Queues

Service Bus Queues are an alternative to Storage Queues that might be useful in scenarios where more advanced messaging features are needed (larger message sizes, message ordering, single-operaiton destructive reads, scheduled delivery) using push-style delivery (using long polling).

The **createQueueIfNotExists** method can be used to ensure a queue exists:

```Javascript
var serviceBusService = azure.createServiceBusService();
serviceBusService.createQueueIfNotExists('taskqueue', function(error){
    if(!error){
        // Queue exists
    }
});
```

The **sendQueueMessage** method can then be called to insert the message into the queue:

```Javascript
var serviceBusService = azure.createServiceBusService();
serviceBusService.sendQueueMessage('taskqueue', 'Hello world!', function(
    if(!error){
        // Message sent
     }
});
```

It is then possible to call the **receiveQueueMessage** method to dequeue the message.

```Javascript
var serviceBusService = azure.createServiceBusService();
serviceBusService.receiveQueueMessage('taskqueue', function(error, serverMessage){
    if(!error){
        // Process the message
    }
});
```

## Service Bus Topics

Service Bus topics are an abstraction on top of Service Bus Queues that make pub/sub scenarios easy to implement.

The **createTopicIfNotExists** method can be used to create a server-side topic:

```Javascript
var serviceBusService = azure.createServiceBusService();
serviceBusService.createTopicIfNotExists('taskdiscussion', function(error){
    if(!error){
        // Topic exists
    }
});
```

The **sendTopicMessage** method can be used to send a message to a topic:

```Javascript
var serviceBusService = azure.createServiceBusService();
serviceBusService.sendTopicMessage('taskdiscussion', 'Hello world!', function(error){
    if(!error){
        // Message sent
    }
});
```

A client can then create a subscription and start consuming messages by calling the **createSubscription** method followed by the **receiveSubscriptionMessage** method. Please note that any messages sent before the subscription is created will not be received.

```Javascript
var serviceBusService = azure.createServiceBusService(),
    topic = 'taskdiscussion',
    subscription = 'client1';

serviceBusService.createSubscription(topic, subscription, function(error1){
    if(!error1){
        // Subscription created

        serviceBusService.receiveSubscriptionMessage(topic, subscription, function(error2, serverMessage){
            if(!error2){
                // Process message
            }
        });
     }
});
```

## Service Runtime

The Service Runtime allows you to interact with the machine environment where the current role is running. Please note that these commands will only work if your code is running in a worker role inside the Azure emulator or in the cloud.

The **isAvailable** method lets you determine whether the service runtime endpoint is running on the local machine.  It is good practice to enclose any code that 
uses service runtime in the isAvailable callback.

```JavaScript
azure.RoleEnvironment.isAvailable(function(error, available) {
    if (available) {
        // Place your calls to service runtime here
    }
});
```

The **getConfigurationSettings** method lets you obtain values from the role's .cscfg file.

```Javascript
azure.RoleEnvironment.getConfigurationSettings(function(error, settings) {
    if (!error) {
        // You can get the value of setting "setting1" via settings['setting1']
    }        
});
```

The **getLocalResources** method lets you find the path to defined local storage resources for the current role.  For example, the DiagnosticStore 
resource which is defined for every role provides a location for runtime diagnostics and logs.

```Javascript
azure.RoleEnvironment.getLocalResources(function(error, resources) {
    if(!error){
        // You can get the path to the role's diagnostics store via 
        // resources['DiagnosticStore']['path']
    }
});
```

The **getCurrentRoleInstance** method lets you obtain information about endpoints defined for the current role instance:

```JavaScript
azure.RoleEnvironment.getCurrentRoleInstance(function(error, instance) {
    if (!error && instance['endpoints']) {
        // You can get information about "endpoint1" such as its address and port via
        // instance['endpoints']['endpoint1']['address'] and instance['endpoints']['endpoint1']['port']
    }
});
```

The **getRoles** method lets you obtain information about endpoints in role instances running on other machines:

```Javascript
azure.RoleEnvironment.getRoles(function(error, roles) {
    if(!error){
        // You can get information about "instance1" of "role1" via roles['role1']['instance1']
    } 
});
```

**For more examples please see the [Windows Azure Node.js Developer Center](http://www.windowsazure.com/en-us/develop/nodejs)**

# Need Help?

Be sure to check out the Windows Azure [Developer Forums on Stack Overflow](http://go.microsoft.com/fwlink/?LinkId=234489) if you have trouble with the provided code.

# Contribute Code or Provide Feedback

If you would like to become an active contributor to this project please follow the instructions provided in [Windows Azure Projects Contribution Guidelines](http://windowsazure.github.com/guidelines.html).

If you encounter any bugs with the library please file an issue in the [Issues](https://github.com/WindowsAzure/azure-sdk-for-node/issues) section of the project.

# Learn More

For documentation on how to host Node.js applications on Windows Azure, please see the [Windows Azure Node.js Developer Center](http://www.windowsazure.com/en-us/develop/nodejs/).

For documentation on the Azure cross platform CLI tool for Mac and Linux, please see our readme [here] (http://github.com/windowsazure/azure-sdk-tools-xplat)

Check out our new IRC channel on freenode, node-azure.