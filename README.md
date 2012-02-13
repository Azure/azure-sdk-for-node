<h1>Windows Azure SDK for Node.js</h1>
<p>This project provides a set of Node.js packages that make it easy to access
the Windows Azure storage and queue services. For documentation on how
to host Node.js applications on Windows Azure, please see the
<a href="http://www.windowsazure.com/en-us/develop/nodejs/">Windows Azure
Node.js Developer Center</a>.</p>

<h1>Features</h1>
<ul>
    <li>Tables
        <ul>
            <li>create and delete tables</li>
            <li>create, query, insert, update, merge, and delete entities</li>
    </li>
    <li>Blobs
        <ul>
            <li>create, list, and delete containers, work with container metadata
            and permissions, list blobs in container</li>
            <li>create block and page blobs (from a stream, a file, or a string),
            work with blob blocks and pages, delete blobs</li>
            <li>work with blob properties, metadata, leases, snapshot a blob</li>
    </li>
    <li>Queues
        <ul>
            <li>create, list, and delete queues, and work with queue metadata</li>
            <li>create, get, peek, update, delete messages</li>
    </li>
</ul>

<h1>Getting Started</h1>
<h2>Download Source Code</h2>
<p>To get the source code of the SDK via <strong>git</strong> just type:<br/>
<pre>git clone https://github.com/WindowsAzure/azure-sdk-for-node.git<br/>cd ./azure-sdk-for-node</pre>
</p>

<h2>Download Package</h2>
<p>Alternatively, to get the source code via the Node Package Manager (npm), type<br/>
<pre>npm install azure</pre>
<p>You can use these packages against the cloud Windows Azure Services, or against
the local Storage Emulator.</p>
<ol>
    <li>To use the cloud services, you need to first create an account with
    Windows Azure. You need to set the AZURE_STORAGE_ACCOUNT and the AZURE_STORAGE_ACCESS_KEY
    environment variables to the storage account name and primary access key you
    obtain from the Azure Portal.</li>
    <li>To use the Storage Emulator, make sure the latest version of the
    Windows Azure SDK is installed on the machine, and set the EMULATED environment
    variable to any value ("true", "1", etc.)</li>
</ol>

<h1>Usage</h1>
<h2>Table Storage</h2>
<p>To ensure a table exists, call <strong>createTableIfNotExists</strong>:</p>
<pre>
var tableService = azure.createTableService();
tableService.createTableIfNotExists('tasktable', function(error){
    if(!error){
        // Table exists
    }
});
</pre>
<p>A new entity can be added by calling <strong>insertEntity</strong>:</p>
<pre>
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
</pre>
<p>The method <strong>queryEntity</strong> can then be used to fetch the entity that was just inserted:</p>
<pre>
var tableService = azure.createTableService();
tableService.queryEntity('tasktable', 'tasksSeattle', '1', function(error, serverEntity){
    if(!error){
        // Entity available in serverEntity variable
    }
});
</pre> 
<h2>Blob Storage</h2>
<p>The <strong>createContainerIfNotExists</strong> method can be used to create a 
container in which to store a blob:</p>
<pre>
var blobService = azure.createBlobService();
blobService.createContainerIfNotExists('taskcontainer', {publicAccessLevel : 'blob'}, function(error){
    if(!error){
        // Container exists and is public
    }
});
</pre>
<p>To upload a file (assuming it is called task1-upload.txt, it contains the exact text "hello world" (no quotation marks), and it is placed in the same folder as the script below), the method <strong>createBlockBlobFromStream</strong> can be used:</p>
<pre>
var blobService = azure.createBlobService();
blobService.createBlockBlobFromStream('taskcontainer', 'task1', fs.createReadStream('task1-upload.txt'), 11, function(error){
    if(!error){
        // Blob uploaded
    }
});
</pre>
<p>To download the blob and write it to the file system, the <strong>getBlobToStream</strong> method can be used:</p>
<pre>
var blobService = azure.createBlobService();
blobService.getBlobToStream('taskcontainer', 'task1', fs.createWriteStream('task1-download.txt'), function(error, serverBlob){
    if(!error){
        // Blob available in serverBlob.blob variable
    }
});
</pre>
<h2>Storage Queues</h2>
<p>The <strong>createQueueIfNotExists</strong> method can be used to ensure a queue exists:</p>
<pre>
var queueService = azure.createQueueService();
queueService.createQueueIfNotExists('taskqueue', function(error){
    if(!error){
        // Queue exists
    }
});
</pre>
<p>The <strong>createMessage</strong> method can then be called to insert the message into the queue:</p>
<pre>
var queueService = azure.createQueueService();
queueService.createMessage('taskqueue', "Hello world!", function(error){
    if(!error){
        // Message inserted
    }
});
</pre>
<p>It is then possible to call the <strong>getMessage</strong> method, process the message and then call <strong>deleteMessage</strong> inside the callback. This two-step process ensures messages don't get lost when they are removed from the queue.</p>
<pre>
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
</pre>
<h2>ServiceBus Queues</h2>
<p>ServiceBus Queues are an alternative to Storage Queues that might be useful in scenarios where more advanced messaging features are needed (larger message sizes, message ordering, single-operaiton destructive reads, scheduled delivery) using push-style delivery (using long polling).</p>
<p>The <strong>createQueueIfNotExists</strong> method can be used to ensure a queue exists:</p>
<pre>
var serviceBusService = azure.createServiceBusService();
serviceBusService.createQueueIfNotExists('taskqueue', function(error){
    if(!error){
        // Queue exists
    }
});
</pre>
<p>The <strong>sendQueueMessage</strong> method can then be called to insert the message into the queue:</p>
<pre>
var serviceBusService = azure.createServiceBusService();
serviceBusService.sendQueueMessage('taskqueue', 'Hello world!', function(
    if(!error){
        // Message sent
     }
});
</pre>
<p>It is then possible to call the <strong>receiveQueueMessage</strong> method to dequeue the message.</p>
<pre>
var serviceBusService = azure.createServiceBusService();
serviceBusService.receiveQueueMessage('taskqueue', function(error, serverMessage){
    if(!error){
        // Process the message
    }
});
</pre>
<h2>ServiceBus Topics</h2>
<p>ServiceBus topics are an abstraction on top of ServiceBus Queues that make pub/sub scenarios easy to implement.</p>
<p>The <strong>createTopicIfNotExists</strong> method can be used to create a server-side topic:</p>
<pre>
var serviceBusService = azure.createServiceBusService();
serviceBusService.createTopicIfNotExists('taskdiscussion', function(error){
    if(!error){
        // Topic exists
    }
});
</pre>
<p>The <strong>sendTopicMessage</strong> method can be used to send a message to a topic:</p>
<pre>
var serviceBusService = azure.createServiceBusService();
serviceBusService.sendTopicMessage('taskdiscussion', 'Hello world!', function(error){
    if(!error){
        // Message sent
    }
});
</pre>
<p>A client can then create a subscription and start consuming messages by calling the <strong>createSubscription</strong> method followed by the <strong>receiveSubscriptionMessage</strong> method. Please note that any messages sent before the subscription is created will not be received.</p>
<pre>
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
</pre>
<p><strong>For more examples please see the <a href="http://www.windowsazure.com/en-us/develop/nodejs/">
Windows Azure Node.js Developer Center</a>.</strong></p>

<h1>Need Help?</h1>
<p>Be sure to check out the Windows Azure <a href="http://go.microsoft.com/fwlink/?LinkId=234489">
Developer Forums on Stack Overflow</a> if you have trouble with the provided code.</p>

<h1>Contribute Code or Provide Feedback</h1>
<p>If you would like to become an active contributor to this project please follow the instructions provided in <a href="http://windowsazure.github.com/guidelines.html">Windows Azure Projects Contribution Guidelines</a>.</p>
<p>If you encounter any bugs with the library please file an issue in the <a href="https://github.com/WindowsAzure/azure-sdk-for-node/issues">Issues</a> section of the project.</p>

<h1>Learn More</h1>
<a href="http://www.windowsazure.com/en-us/develop/nodejs/">Windows Azure Node.js Developer Center</a>
