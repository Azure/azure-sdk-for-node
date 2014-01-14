# Windows Azure SDK for Node.js

[![NPM version](https://badge.fury.io/js/azure.png)](http://badge.fury.io/js/azure) [![Build Status](https://travis-ci.org/WindowsAzure/azure-sdk-for-node.png?branch=master)](https://travis-ci.org/WindowsAzure/azure-sdk-for-node)

This project provides a Node.js package that makes it easy to consume and manage Windows Azure Services.

# Features

* Storage
    * Blob
    * Table
    * Storage Queue
* Service Bus
    * Queue
    * Topic
    * Notification Hub
* Service Runtime
* [Core management](https://github.com/WindowsAzure/azure-sdk-for-node/blob/master/lib/services/management/README.md)
* [Compute management](https://github.com/WindowsAzure/azure-sdk-for-node/blob/master/lib/services/computeManagement/README.md)
    * Virtual Machine
    * Cloud Service
* [Web Site management](https://github.com/WindowsAzure/azure-sdk-for-node/blob/master/lib/services/webSiteManagement/README.md)
* [Virtual Network managment](https://github.com/WindowsAzure/azure-sdk-for-node/blob/dev/lib/services/networkManagement/README.md)
* [Storage Account management](https://github.com/WindowsAzure/azure-sdk-for-node/blob/master/lib/services/storageManagement/README.md)
* [SQL Database management](https://github.com/WindowsAzure/azure-sdk-for-node/blob/master/lib/services/sqlManagement/README.md)
* [Service Bus management](https://github.com/WindowsAzure/azure-sdk-for-node/blob/master/lib/services/serviceBusManagement/README.md)
* HDInsight management

# Getting Started

## Install from npm

We provide both fine-grained modules for different Windows Azure services which you can install separately, and an all-up module which contains everything.

**Notice**: we haven't provided fine-grained modules for every supported Windows Azure services yet. This will come soon.

### Install the all-up module

```
npm install azure
```

### Install the fine-grained modules

* Core management: ``npm install azure-mgmt``
* Compute management: ``npm install azure-mgmt-compute``
* Web Site management: ``npm install azure-mgmt-website``
* Virtual Network managment: ``npm install azure-mgmt-vnet``
* Storage Account management: ``npm install azure-mgmt-storage``
* SQL Database management: ``npm install azure-mgmt-sql``
* Service Bus management: ``npm install azure-mgmt-sb``

## Usage

### Table Storage

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

To upload a file (assuming it is called task1-upload.txt and it is placed in the same folder as the script below), the method **createBlob** can be used. This method will return a writable stream which can be writen to, for instance, through piping:

```Javascript
var blobService = azure.createBlobService();

fs.createReadStream('task1-upload.txt').pipe(blobService.createBlob('taskcontainer', 'task1', azure.Constants.BlobConstants.BlobTypes.BLOCK));
```

To download the blob and write it to the file system, a similar **getBlob** method can be used:

```Javascript
var blobService = azure.createBlobService();

blobService.getBlob('taskcontainer', 'task1').pipe(fs.createWriteStream('task1-download.txt'));
```

To create a SAS URL you can use the **getBlobUrl** method. Additionally you can use the **date** helper functions to easily create a SAS that expires at some point relative to the current time.

```Javascript
var blobService = azure.createBlobService();

//create a SAS that expires in an hour
var sharedAccessPolicy = {
    AccessPolicy: {
        Expiry: azure.date.minutesFromNow(60);
    }
};

var sasUrl = blobService.getBlobUrl(containerName, blobName, sharedAccessPolicy);
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
queueService.createMessage('taskqueue', 'Hello world!', function(error){
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


## Notification Hubs

Notification hubs allow you to send notifications to WNS, APNS, GCM, and MPNS receivers.

To create a notification hub, use the method **createNotificationHub**.

```JavaScript
var serviceBusService = azure.createServiceBusService();

serviceBusService.createNotificationHub('hubName', function (err) {
    if (!err) {
        // Notification hub created successfully
    }
});
```

To send notification using native format to the notification hub use the methods of the **wns**, **apns**, **gcm**, **mpns** objects. For a full reference on WNS method templates, check http://msdn.microsoft.com/en-us/library/windows/apps/hh779725.aspx.
To send template (cross-platform) notifications use the send method on the **NotificationHubService** class.

```JavaScript
var notificationHubService = azure.createNotificationHubService('hubName');

// WNS notification
notificationHubService.wns.sendTileSquarePeekImageAndText01(
    null,
    {
        image1src: 'http://foobar.com/dog.jpg',
        image1alt: 'A dog',
        text1: 'This is a dog',
        text2: 'The dog is nice',
        text3: 'The dog bites',
        text4: 'Beware of dog'
    },
    function (error) {
        if (!error) {
            // message sent successfully
        }
    });

// APNS notification
notificationHubService.apns.send(
    null,
    {
        alert: 'This is my toast message for iOS!',
        expiry: expiryDate
    },
    function (error) {
        if (!error) {
            // message sent successfully
        }
    });

// GCM notification
notificationHubService.gcm.send(
    null,
    {
        data: { message: 'Here is a message' }
    },
    function (error) {
        if (!error) {
            //message send successfully
        }
    });

// MPNS notification
notificationHubService.mpns.sendToast(
    null,
    {
        text1: 'A dog',
        text2: 'This is a dog'
    },
    function (error) {
        if (!error) {
            //message send successfully
        }
    });

// template notification
notificationHubService.send(
    null,
    {
        message: 'This is my template notification',
        goesTo: 'all registrations irrespective of the platform'
    },
    function (error) {
        if (!error) {
            //message send successfully
        }
    });

```

To create registrations (for both native and template notifications), use the creation methods in the **wns**, **apns**, **gcm**, **mpns**. To retrieve, update and delete existing registrations, use the following methods in NotificationHubService: **getRegistration**, **listRegistrations**, **listRegistrationsByTag**, **updateRegistration**, and **deleteRegistration**.

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

# Need Help?

* [Windows Azure Forums on MSDN and Stack Overflow](http://go.microsoft.com/fwlink/?LinkId=234489)
* IRC channel on freenode: node-azure

# Learn More

* [Windows Azure Node.js Developer Center](http://www.windowsazure.com/en-us/develop/nodejs/)
* [API reference](http://dl.windowsazure.com/nodedocs/)
* [Windows Azure Cross-Platform CLI](http://github.com/windowsazure/azure-sdk-tools-xplat)

# Contribute

* If you would like to become an active contributor to this project please follow the instructions provided in [Windows Azure Projects Contribution Guidelines](http://windowsazure.github.com/guidelines.html).
* If you encounter any bugs with the library please file an issue in the [Issues](https://github.com/WindowsAzure/azure-sdk-for-node/issues) section of the project.
