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

var assert = require('assert');

// Test includes
var testutil = require('../../util/util');
var queuetestutil = require('../../util/queue-test-utils');

// Lib includes
var azure = testutil.libRequire('azure');
var azureutil = testutil.libRequire('util/util');

var ServiceClient = azure.ServiceClient;
var Constants = azure.Constants;
var HttpConstants = Constants.HttpConstants;

var queueService;
var queueNames = [];
var queueNamesPrefix = 'queue';

var testPrefix = 'queueservice-tests';
var numberTests = 12;

suite('queueservice-tests', function () {
  setup(function (done) {
    queuetestutil.setUpTest(testPrefix, function (err, newQueueService) {
      queueService = newQueueService;
      done();
    });
  });

  teardown(function (done) {
    queuetestutil.tearDownTest(numberTests, queueService, testPrefix, done);
  });

  test('GetServiceProperties', function (done) {
    queueService.getServiceProperties(function (error, serviceProperties) {
      assert.equal(error, null);
      assert.notEqual(serviceProperties, null);

      if (serviceProperties) {
        assert.notEqual(serviceProperties.Logging, null);
        if (serviceProperties.Logging) {
          assert.notEqual(serviceProperties.Logging.RetentionPolicy);
          assert.notEqual(serviceProperties.Logging.Version);
        }

        if (serviceProperties.Metrics) {
          assert.notEqual(serviceProperties.Metrics, null);
          assert.notEqual(serviceProperties.Metrics.RetentionPolicy);
          assert.notEqual(serviceProperties.Metrics.Version);
        }
      }

      done();
    });
  });

  test('SetServiceProperties', function (done) {
    queueService.getServiceProperties(function (error, serviceProperties) {
      assert.equal(error, null);

      serviceProperties.Logging.Read = true;
      queueService.setServiceProperties(serviceProperties, function (error2) {
        assert.equal(error2, null);

        queueService.getServiceProperties(function (error3, serviceProperties2) {
          assert.equal(error3, null);
          assert.equal(serviceProperties2.Logging.Read, true);

          done();
        });
      });
    });
  });

  test('CreateQueue', function (done) {
    var queueName = testutil.generateId(queueNamesPrefix, queueNames, queuetestutil.isMocked);
    var metadata = { 'class': 'test' };

    // Create
    queueService.createQueue(queueName, { metadata: metadata }, function (createError, queue, createResponse) {
      assert.equal(createError, null);
      assert.notEqual(queue, null);
      assert.ok(createResponse.isSuccessful);
      assert.equal(createResponse.statusCode, HttpConstants.HttpResponseCodes.CREATED_CODE);

      assert.ok(queue);
      if (createResponse.queue) {
        assert.ok(queue.name);
        assert.equal(queue.name, queueName);

        assert.ok(queue.metadata);
        assert.equal(queue.metadata['class'], metadata['class']);
      }

      // Get
      queueService.getQueueMetadata(queueName, function (getError, getQueue, getResponse) {
        assert.equal(getError, null);
        assert.ok(getResponse.isSuccessful);
        assert.equal(getResponse.statusCode, HttpConstants.HttpResponseCodes.OK_CODE);

        assert.ok(getQueue);
        if (getQueue) {
          assert.ok(getQueue.name);
          assert.equal(getQueue.name, queueName);

          assert.ok(getQueue.metadata);
          assert.equal(getQueue.metadata['class'], metadata['class']);
        }

        // Delete
        queueService.deleteQueue(queueName, function (deleteError, deleted, deleteResponse) {
          assert.equal(deleteError, null);
          assert.equal(deleted, true);
          assert.ok(deleteResponse.isSuccessful);
          assert.equal(deleteResponse.statusCode, HttpConstants.HttpResponseCodes.NO_CONTENT_CODE);

          done();
        });
      });
    });
  });

  test('CreateQueueIfNotExists', function (done) {
    var queueName = testutil.generateId(queueNamesPrefix, queueNames, queuetestutil.isMocked);
    var metadata = { 'class': 'test' };

    // Create
    queueService.createQueue(queueName, { metadata: metadata }, function (createError, queue, createResponse) {
      assert.equal(createError, null);
      assert.notEqual(queue, null);
      assert.ok(createResponse.isSuccessful);
      assert.equal(createResponse.statusCode, HttpConstants.HttpResponseCodes.CREATED_CODE);

      assert.ok(queue);
      if (createResponse.queue) {
        assert.ok(queue.name);
        assert.equal(queue.name, queueName);

        assert.ok(queue.metadata);
        assert.equal(queue.metadata['class'], metadata['class']);
      }

      // Try creating again
      queueService.createQueueIfNotExists(queueName, { metadata: metadata }, function (createError2, queueCreated2) {
        assert.equal(createError2, null);
        assert.equal(queueCreated2, false);

        done();
      });
    });
  });

  test('ListQueues', function (done) {
    var queueName1 = testutil.generateId(queueNamesPrefix, queueNames, queuetestutil.isMocked);
    var queueName2 = testutil.generateId(queueNamesPrefix, queueNames, queuetestutil.isMocked);
    var metadata = { 'class': 'test' };

    queueService.listQueues({ 'include': 'metadata' }, function (listErrorEmpty, queuesEmpty) {
      assert.equal(listErrorEmpty, null);
      assert.notEqual(queuesEmpty, null);
      if (queuesEmpty) {
        assert.equal(queuesEmpty.length, 0);
      }

      queueService.createQueue(queueName1, function (createError1, queue1, createResponse1) {
        assert.equal(createError1, null);
        assert.notEqual(queue1, null);
        assert.ok(createResponse1.isSuccessful);
        assert.equal(createResponse1.statusCode, HttpConstants.HttpResponseCodes.CREATED_CODE);

        queueService.createQueue(queueName2, { metadata: metadata }, function (createError2, queue2, createResponse2) {
          assert.equal(createError2, null);
          assert.notEqual(queue2, null);
          assert.ok(createResponse2.isSuccessful);
          assert.equal(createResponse2.statusCode, HttpConstants.HttpResponseCodes.CREATED_CODE);

          queueService.listQueues({ 'include': 'metadata' }, function (listError, queues, nextMarker, listResponse) {
            assert.equal(listError, null);
            assert.notEqual(queues, null);
            assert.ok(listResponse.isSuccessful);
            assert.equal(listResponse.statusCode, HttpConstants.HttpResponseCodes.OK_CODE);

            assert.ok(queues);

            var entries = 0;
            for (var queue in queues) {
              var currentQueue = queues[queue];

              if (currentQueue.name === queueName1) {
                entries += 1;
              }
              else if (currentQueue.name === queueName2) {
                entries += 2;
                assert.equal(currentQueue.metadata['class'], metadata['class']);
              }
            }

            assert.equal(entries, 3);

            done();
          });
        });
      });
    });
  });

  test('CreateMessage', function (done) {
    var queueName = testutil.generateId(queueNamesPrefix, queueNames, queuetestutil.isMocked);
    var messageText1 = 'hi there';
    var messageText2 = 'bye there';

    // Create Queue
    queueService.createQueue(queueName, function (createError1, queue1, createResponse1) {
      assert.equal(createError1, null);
      assert.notEqual(queue1, null);
      assert.ok(createResponse1.isSuccessful);
      assert.equal(createResponse1.statusCode, HttpConstants.HttpResponseCodes.CREATED_CODE);

      // Create message
      queueService.createMessage(queueName, messageText1, function (createMessageError, message, createMessageResponse) {
        assert.equal(createMessageError, null);
        assert.ok(createMessageResponse.isSuccessful);
        assert.equal(createMessageResponse.statusCode, HttpConstants.HttpResponseCodes.CREATED_CODE);

        // Create another message
        queueService.createMessage(queueName, messageText2, function (createMessageError2, message2, createMessageResponse2) {
          assert.equal(createMessageError, null);
          assert.ok(createMessageResponse2.isSuccessful);
          assert.equal(createMessageResponse2.statusCode, HttpConstants.HttpResponseCodes.CREATED_CODE);

          // Peek message
          queueService.peekMessages(queueName, function (peekError, queueMessages, peekResponse) {
            assert.equal(peekError, null);
            assert.notEqual(queueMessages, null);

            var queueMessage = queueMessages[0];
            if (queueMessage) {
              assert.ok(queueMessage['messageid']);
              assert.ok(queueMessage['insertiontime']);
              assert.ok(queueMessage['expirationtime']);
              assert.equal(queueMessage.messagetext, messageText1);
            }

            assert.ok(peekResponse.isSuccessful);
            assert.equal(peekResponse.statusCode, HttpConstants.HttpResponseCodes.OK_CODE);

            // Get messages
            queueService.getMessages(queueName, function (getError, getQueueMessages, getResponse) {
              assert.equal(getError, null);
              assert.notEqual(getQueueMessages, null);
              assert.equal(getQueueMessages.length, 1);
              assert.ok(getResponse.isSuccessful);
              assert.equal(getResponse.statusCode, HttpConstants.HttpResponseCodes.OK_CODE);

              var getQueueMessage = getQueueMessages[0];
              assert.equal(getQueueMessage.messagetext, messageText1);

              // Delete message
              queueService.deleteMessage(queueName, getQueueMessage.messageid, getQueueMessage.popreceipt, function (deleteError, deleted, deleteResponse) {
                assert.equal(deleteError, null);
                assert.equal(deleted, true);
                assert.ok(deleteResponse.isSuccessful);
                assert.equal(deleteResponse.statusCode, HttpConstants.HttpResponseCodes.NO_CONTENT_CODE);

                // Get messages again
                queueService.getMessages(queueName, function (getError2, getQueueMessages2, getResponse2) {
                  assert.equal(getError2, null);
                  assert.notEqual(getQueueMessages2, null);
                  assert.ok(getResponse2.isSuccessful);
                  assert.equal(getResponse2.statusCode, HttpConstants.HttpResponseCodes.OK_CODE);

                  var getQueueMessage2 = getQueueMessages2[0];
                  assert.equal(getQueueMessage2.messagetext, messageText2);

                  // Clear messages
                  queueService.clearMessages(queueName, function (clearError, clearResponse) {
                    assert.equal(clearError, null);
                    assert.ok(clearResponse.isSuccessful);
                    assert.equal(clearResponse.statusCode, HttpConstants.HttpResponseCodes.NO_CONTENT_CODE);

                    // Get message again should yield empty
                    queueService.getMessages(queueName, function (getError3, getQueueMessage3, getResponse3) {
                      assert.equal(getError3, null);
                      assert.ok(getResponse3.isSuccessful);
                      assert.equal(getResponse3.statusCode, HttpConstants.HttpResponseCodes.OK_CODE);

                      assert.equal(getQueueMessage3.length, 0);

                      done();
                    });
                  });
                });
              });
            });
          });
        });
      });
    });
  });

  test('CreateEmptyMessage', function (done) {
    var queueName = testutil.generateId(queueNamesPrefix, queueNames, queuetestutil.isMocked);

    // Create Queue
    queueService.createQueue(queueName, function (createError1) {
      assert.equal(createError1, null);

      // Create message
      queueService.createMessage(queueName, '', function (createMessageError, message, createMessageResponse) {
        assert.equal(createMessageError, null);
        assert.equal(createMessageResponse.statusCode, HttpConstants.HttpResponseCodes.CREATED_CODE);

        done();
      });
    });
  });

  test('SetQueueMetadataName', function (done) {
    var queueName = testutil.generateId(queueNamesPrefix, queueNames, queuetestutil.isMocked);
    var metadata = { '\Uc8fc\Uba39\Uc774\Uc6b4\Ub2e4': 'test' };

    queueService.createQueue(queueName, function (createError) {
      assert.equal(createError, null);

      // unicode headers are valid
      queueService.setQueueMetadata(queueName, metadata, function (setError) {
        assert.equal(setError, null);
        done();
      });
    });
  });

  test('SetQueueMetadata', function (done) {
    var queueName = testutil.generateId(queueNamesPrefix, queueNames, queuetestutil.isMocked);
    var metadata = { 'class': 'test' };

    queueService.createQueue(queueName, function (createError) {
      assert.equal(createError, null);

      queueService.setQueueMetadata(queueName, metadata, function (setError) {
        assert.equal(setError, null);

        queueService.getQueueMetadata(queueName, function (getError, queue) {
          assert.equal(getError, null);

          assert.notEqual(queue, null);
          if (queue) {
            assert.notEqual(queue.metadata, null);

            assert.equal(queue.metadata.class, 'test');

            done();
          }
        });
      });
    });
  });

  test('GetMessages', function (done) {
    var queueName = testutil.generateId(queueNamesPrefix, queueNames, queuetestutil.isMocked);

    queueService.createQueue(queueName, function (createError) {
      assert.equal(createError, null);

      queueService.getMessages(queueName, function (error, emptyMessages) {
        assert.equal(error, null);
        assert.notEqual(emptyMessages, null);
        assert.equal(emptyMessages.length, 0);

        queueService.createMessage(queueName, 'msg1', function (error1) {
          assert.equal(error1, null);

          queueService.createMessage(queueName, 'msg2', function (error2) {
            assert.equal(error2, null);

            queueService.getMessages(queueName, { peekonly: true }, function (error3, messages) {
              assert.equal(error3, null);

              assert.notEqual(messages, null);
              if (messages) {
                // By default only one is returned
                assert.equal(messages.length, 1);
                assert.equal(messages[0].messagetext, 'msg1');
              }

              queueService.getMessages(queueName, { numofmessages: 2 }, function (error4, messages2) {
                assert.equal(error4, null);
                assert.notEqual(messages2, null);

                if (messages2) {
                  assert.equal(messages2.length, 2);
                }

                done();
              });
            });
          });
        });
      });
    });
  });

  test('UpdateMessage', function (done) {
    var queueName = testutil.generateId(queueNamesPrefix, queueNames, queuetestutil.isMocked);

    queueService.createQueue(queueName, function (error) {
      assert.equal(error, null);

      queueService.createMessage(queueName, 'hi there', function (error2) {
        assert.equal(error2, null);

        queueService.getMessages(queueName, function (error3, messages) {
          assert.equal(error2, null);
          assert.notEqual(messages, null);
          var message = messages[0];

          queueService.updateMessage(queueName, message.messageid, message.popreceipt, 10, { messagetext: 'bye there' }, function (error4) {
            assert.equal(error4, null);

            done();
          });
        });
      });
    });
  });

  test('UpdateMessageEncodingPopReceipt', function (done) {
    var queueName = testutil.generateId(queueNamesPrefix, queueNames, queuetestutil.isMocked);

    // no messages in the queue try to update a message should give fail to update instead of blowing up on authentication
    queueService.updateMessage(queueName, 'mymsg', 'AgAAAAEAAACucgAAvMW8+dqjzAE=', 10, { messagetext: 'bye there' }, function (error) {
      assert.notEqual(error, null);
      assert.equal(error.code, Constants.QueueErrorCodeStrings.QUEUE_NOT_FOUND);

      done();
    });
  });

  test('storageConnectionStrings', function (done) {
    var key = 'AhlzsbLRkjfwObuqff3xrhB2yWJNh1EMptmcmxFJ6fvPTVX3PZXwrG2YtYWf5DPMVgNsteKStM5iBLlknYFVoA==';
    var connectionString = 'DefaultEndpointsProtocol=https;AccountName=myaccount;AccountKey=' + key;
    var queueService = azure.createQueueService(connectionString);

    assert.equal(queueService.storageAccount, 'myaccount');
    assert.equal(queueService.storageAccessKey, key);
    assert.equal(queueService.protocol, 'https://');

    done();
  });

  test('storageConnectionStringsDevStore', function (done) {
    var connectionString = 'UseDevelopmentStorage=true';
    var queueService = azure.createQueueService(connectionString);

    assert.equal(queueService.storageAccount, ServiceClient.DEVSTORE_STORAGE_ACCOUNT);
    assert.equal(queueService.storageAccessKey, ServiceClient.DEVSTORE_STORAGE_ACCESS_KEY);
    assert.equal(queueService.protocol, 'http://');
    assert.equal(queueService.host, '127.0.0.1');
    assert.equal(queueService.port, '10001');

    done();
  });
});
