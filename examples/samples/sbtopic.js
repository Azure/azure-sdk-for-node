//
// Copyright (c) Microsoft and contributors.  All rights reserved.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//   http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
//
// See the License for the specific language governing permissions and
// limitations under the License.
//

var fs = require('fs');
var path = require('path');
var azure;
try {
  fs.statSync(path.join(__dirname, './../../lib/azure.js'));
  azure = require('./../../lib/azure');
} catch (error) {
  azure = require('azure');
}

var topic = 'topicsample';
var subscription1 = 'subscription1';
var subscription2 = 'subscription2';

var serviceBusClient = azure.createServiceBusService();

function createTopic() {
  // Step 0: Create topic.
  serviceBusClient.createTopicIfNotExists(topic, function (error, topicCreated, response) {
    if (error) {
      console.log(error);
    } else {
      console.log('Created the topic %s', topic);
      createSubscriptions();
    }
  });
}

function createSubscriptions() {
  // Step 1: Create subscriptions.
  serviceBusClient.createSubscription(topic, subscription1, function (error, result, response) {
    if (error) {
      console.log(error);
    } else {
      serviceBusClient.createSubscription(topic, subscription2, function (error, result, response) {
        if (error) {
          console.log(error);
        } else {
          sendMessages();
        }
      });
    }
  });
}

function sendMessages() {
  // Step 2: Send a few messages to later be consumed.
  serviceBusClient.sendTopicMessage(topic, 'Send Message Works', function (error, response) {
    if (error) {
      console.log(error);
    } else {
      console.log('Sent first Message');
      serviceBusClient.sendTopicMessage(topic, 'Send Message Still Works', function (error, response) {
        if (error) {
          console.log(error);
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
  serviceBusClient.receiveSubscriptionMessage(topic, subscription1, function (error, message1, response) {
    if (error) {
      console.log(error);
    } else {
      console.log(message1.body);
      serviceBusClient.receiveSubscriptionMessage(topic, subscription1, function (error, message2, response) {
        if (error) {
          console.log(error);
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
  serviceBusClient.receiveSubscriptionMessage(topic, subscription2, function (error, message1, response) {
    if (error) {
      console.log(error);
    } else {
      console.log(message1.body);
      serviceBusClient.receiveSubscriptionMessage(topic, subscription2, function (error, message2, response) {
        if (error) {
          console.log(error);
        } else {
          console.log(message2.body);
        }
      });
    }
  });
}

var args = process.argv;

if (args.length > 3) {
  console.log('Incorrect number of arguments');
} else if (args.length === 3) {
  // Adding a third argument on the command line, whatever it is, will delete the container before running the sample.
  serviceBusClient.deleteTopic(topic, function (error, response) {
    if (error) {
      console.log(error);
    } else {
      createTopic();
    }
  });
} else {
  createTopic();
}
