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
