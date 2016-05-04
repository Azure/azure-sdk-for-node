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
  fs.existsSync(path.join(__dirname, './../../lib/azure.js'));
  azure = require('./../../lib/azure');
} catch (error) {
  azure = require('azure');
}

var topic = 'topic_1';
var subscription = 'subscription_1';

var serviceBusClient = azure.createServiceBusService();

var messageCount = 0;

function createSubscriptionAndSend(callback) {
  serviceBusClient.createTopicIfNotExists(topic, function (error, result, response) {
    if (error) {
      console.log(error);
    } else {
      console.log('Created the topic ' + topic);
      // The MatchAll filter is the default filter that is used if no filter is specified
      serviceBusClient.createSubscription(topic, subscription, function (error, result, response) {
        if (error) {
          console.log(error);
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
  serviceBusClient.sendTopicMessage(topic, 'message' + messageCount, function (error, result, response) {
    console.log('Message %d sent', messageCount);
    messageCount++;
  });
}

function receiveMessages() {
  serviceBusClient.receiveSubscriptionMessage(topic, subscription, {
    timeoutIntervalInS: 55
  }, function (error, message, response) {
    if (error) {
      console.log(error);
    } else {
      // Message received and deleted
      console.log('Message received. Content: \n%s', message.body);
    }
    receiveMessages();
  });
}

// Initiate the publisher part
createSubscriptionAndSend(function () {
  // Execute the receiver part
  receiveMessages();
});
