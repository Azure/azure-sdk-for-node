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

var topic = 'topic_1';
var subscription = 'subscription_1';

var serviceBusClient = azure.createServiceBusService();

var messageCount = 0;

function createSubscriptionAndSend(callback) {
  serviceBusClient.createTopic(topic, function (error) {
    if (error) {
      console.log(error);
    } else {
      console.log('Created the topic ' + topic);
      serviceBusClient.createSubscription(topic, subscription, function (error2) {
        if (error2) {
          console.log(error2);
        } else {
          console.log('Created subscription ' + subscription);

          // Send a new message every 30 seconds.
          setInterval(sendMessage, 30000);
          callback();
        }
      })
    }
  });
}

function sendMessage() {
  // Send a message to the topic
  serviceBusClient.sendTopicMessage(topic, 'message' + messageCount, function (error) {
    console.log('Message ' + messageCount + ' sent');
    messageCount++;
  });
}

function receiveMessages() {
  serviceBusClient.receiveSubscriptionMessage(topic, subscription, { timeoutIntervalInS: 55 } , function (error, message) {
    if (error) {
      console.log(error);
    } else {
      console.log('Message received. Content:');
      console.log(message);
    }

    receiveMessages();
  });
}

// Initiate the publisher part
createSubscriptionAndSend(function () {
  // Execute the receiver part
  receiveMessages();
});