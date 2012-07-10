/**
* Copyright (c) Microsoft.  All rights reserved.
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*   http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/

var fs = require('fs');
if (!fs.existsSync) {
  fs.existsSync = require('path').existsSync;
}

var azure;
if (fs.existsSync('./../../lib/azure.js')) {
  azure = require('./../../lib/azure');
} else {
  azure = require('azure');
}

var util = require('util');

var topic = 'topicsample';
var subscription1 = 'subscription1';
var subscription2 = 'subscription2';

var serviceBusClient = azure.createServiceBusService();

function createTopic() {
  // Step 0: Create topic.
  serviceBusClient.createTopic(topic, function (error) {
    if (error) {
      console.log(error);
    } else {
      console.log('Created the topic ' + topic);
      createSubscriptions();
    }
  });
}

function createSubscriptions() {
  // Step 1: Create subscriptions.
  serviceBusClient.createSubscription(topic, subscription1, function (error1) {
    if (error1) {
      console.log(error1);
    } else {
      serviceBusClient.createSubscription(topic, subscription2, function (error2) {
        if (error2) {
          console.log(error2);
        } else {
          sendMessages();
        }
      });
    }
  });
}

function sendMessages() {
  // Step 2: Send a few messages to later be consumed.
  serviceBusClient.sendTopicMessage(topic, 'Send Message Works', function(error1) {
    if (error1) {
      console.log(error1);
    } else {
      console.log('Sent first Message');
      serviceBusClient.sendTopicMessage(topic, 'Send Message Still Works', function (error2) {
        if (error2) {
          console.log(error2);
        } else {
          console.log('Sent Second Message');
          receiveMessagesSubscription1();
        }
      });
    }
  });
}

function receiveMessagesSubscription1() {
  // Step 3: Receive the messages for subscription 1.
  serviceBusClient.receiveSubscriptionMessage(topic, subscription1, function (error1, message1) {
    if (error1) {
      console.log(error1);
    } else {
      console.log(message1.body);
      serviceBusClient.receiveSubscriptionMessage(topic, subscription1, function (error2, message2) {
        if (error2) {
          console.log(error2);
        } else {
          console.log(message2.body);
          receiveMessagesSubscription2();
        }
      });
    }
  });
}

function receiveMessagesSubscription2() {
  // Step 3: Receive the messages for subscription 2.
  serviceBusClient.receiveSubscriptionMessage(topic, subscription2, function (error1, message1) {
    if (error1) {
      console.log(error1);
    } else {
      console.log(message1.body);
      serviceBusClient.receiveSubscriptionMessage(topic, subscription2, function (error2, message2) {
        if (error2) {
          console.log(error2);
        } else {
          console.log(message2.body);
        }
      });
    }
  });
}

var arguments = process.argv;

if (arguments.length > 3) {
  console.log('Incorrect number of arguments');
}
else if (arguments.length == 3) {
  // Adding a third argument on the command line, whatever it is, will delete the container before running the sample.
  serviceBusClient.deleteTopic(topic, function (error) {
    if (error) {
      console.log(error);
    } else {
      createTopic();
    }
  });
}
else {
  createTopic();
}