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

var suite;
var client;
var should = require('should');
var util = require('util');
var msRestAzure = require('ms-rest-azure');
var SuiteBase = require('../../framework/suite-base');
var IoTHubClient = require('../../../lib/services/iothub/lib/iotHubClient');
var testPrefix = 'iothub-tests';
var resourceGroupName = 'nodetestrg';
var resourceName = 'nodeTestHub';
var location = 'East US';
var operationId;
var subscriptionId;
var iotHubExists = false;
var maxRetryCount = 120;
var retryIntervalInSeconds = 5;
var url = require('url');
var consumerGroupName = 'testconsumergroup';
var eventsEndpointName = 'events';

var ehClient;
var ehNamespaceName = 'nodetestEH-NS1';
var externalEH1Name = 'nodetestEH1';
var externalEH2Name = 'nodetestEH2';
var ehLocation = 'East US';
var ehTier = 'Standard';
var ehAuthRuleName = 'Send';
var routingEH1ConnectionString;
var routingEH2ConnectionString;
var EventHubManagementClient = require('../../../lib/services/eventHubManagement/lib/eventHubManagementClient');

var sbClient;
var sbNamespaceName = 'nodetestSB-NS1';
var externalTopic1Name = 'nodetestTopic1';
var externalQueue1Name = 'nodetestQueue1';
var sbLocation = 'East US';
var sbAuthRuleName = 'Send';
var routingTopic11ConnectionString;
var routingQueue1ConnectionString;
var ServiceBusManagementClient = require('../../../lib/services/serviceBusManagement2/lib/serviceBusManagementClient');

describe('IoTHub', function () {

    before(function(done) {
        suite = new SuiteBase(this, testPrefix);
        suite.setupSuite(function() {
            client = new IoTHubClient(suite.credentials, suite.subscriptionId);
            // create EventHubClient to test routing 
            ehClient = new EventHubManagementClient(suite.credentials, suite.subscriptionId);
            // create ServiceBusClient to test routing 
            sbClient = new ServiceBusManagementClient(suite.credentials, suite.subscriptionId);
            subscriptionId = suite.subscriptionId;
        });

        if (suite.isPlayback) {
            client.longRunningOperationRetryTimeout = 0;
            ehClient.longRunningOperationRetryTimeout = 0;
            sbClient.longRunningOperationRetryTimeout = 0;
        }

        suite.createResourcegroup(resourceGroupName, location, function(err, result) {
            should.not.exist(err);
            done();
        });
    });

    after(function(done) {
        suite.teardownSuite(done);
    });

    beforeEach(function(done) {
        suite.setupTest(done);
    });

    afterEach(function(done) {
        suite.baseTeardownTest(done);
    });


  describe('IoTHub Lifecycle Test Suite', function () {
      it('should check if the iothub name exists', function(done) {
          var operationInputs =
          {
              name: resourceName
          };

          client.iotHubResource.checkNameAvailability(resourceName, operationInputs, function(err, result, request, response) {
              should.not.exist(err);
              if (!result.nameAvailable) {
                  iotHubExists = true;
              }
              done();
          });
      });

      it('should delete a hub if it exists successfully', function(done) {
          if (iotHubExists) {
              client.iotHubResource.deleteMethod(resourceGroupName, resourceName, function(err, result, request, response) {
                  should.not.exist(err);
                  done();
              });
          } else {
              done();
          }
      });

      it('should delete external eventhub namespace if it exists successfully', function (done) {
          // delete EH namespace
          ehClient.namespaces.deleteMethod(resourceGroupName, ehNamespaceName, function (err, nameSpace, request, response) {
              should.not.exist(err);
              done();
          });
      });

      it('should delete external servicebus namespace if it exists successfully', function (done) {
          // delete SB namespace
          sbClient.namespaces.deleteMethod(resourceGroupName, sbNamespaceName, function (err, nameSpace, request, response) {
              should.not.exist(err);
              done();
          });
      });

      it('should create a new external eventhub namespace for routing EH', function (done) {
          // create EH namespace
          var ehNameSpaceParameters = {
              location: ehLocation,
              sku: {
                  name: ehTier,
                  tier: ehTier
              }
          }
          ehClient.namespaces.createOrUpdate(resourceGroupName, ehNamespaceName, ehNameSpaceParameters, function(err, nameSpace, request, response) {
              should.not.exist(err);
              done();
          });
      });

      it('should create a new external servicebus namespace for routing Topics/Queues', function (done) {
          // create SB namespace
          var sbNameSpaceParameters = {
              location: sbLocation
          }
          sbClient.namespaces.createOrUpdate(resourceGroupName, sbNamespaceName, sbNameSpaceParameters, function (err, nameSpace, request, response) {
              should.not.exist(err);
              done();
          });
      });

      it('should create a new external eventhub EH1 to test routing', function(done) {
          // create EventHub
          var ehParameters = {
              location: ehLocation,
              name: externalEH1Name
          };
          ehClient.eventHubs.createOrUpdate(resourceGroupName, ehNamespaceName, externalEH1Name, ehParameters, function (err, eventHub, request, response) {
              should.not.exist(err);
              done();
          });
      });

      it('should add an auth rule to external routing eventhub EH 1', function(done) {
          var ehAuthRuleParameters = {
              name: ehAuthRuleName,
              rights: [
                  'Send'
              ]
          }
          ehClient.eventHubs.createOrUpdateAuthorizationRule(resourceGroupName, ehNamespaceName, externalEH1Name, ehAuthRuleName, ehAuthRuleParameters, function (err, authRule, request, response) {
              should.not.exist(err);
              done();
          });
      });

      it('retrieve connection string for external routing eventhub EH 1', function(done) {
          ehClient.eventHubs.listKeys(resourceGroupName, ehNamespaceName, externalEH1Name, ehAuthRuleName, function(err, authRules, request, response) {
              should.not.exist(err);
              routingEH1ConnectionString = authRules.primaryConnectionString;
              done();
          });
      });

      it('should create a new external Topic to test routing', function(done) {
          // create Topic
          var topicParameters = {
              location: sbLocation,
              name: externalTopic1Name
          };
          sbClient.topics.createOrUpdate(resourceGroupName, sbNamespaceName, externalTopic1Name, topicParameters, function (err, topic, request, response) {
              should.not.exist(err);
              done();
          });
      });

      it('should add an auth rule to external routing topic - Topic1', function(done) {
          var sbAuthRuleParameters = {
              name: sbAuthRuleName,
              rights: [
                  'Send'
              ]
          }
          sbClient.topics.createOrUpdateAuthorizationRule(resourceGroupName, sbNamespaceName, externalTopic1Name, sbAuthRuleName, sbAuthRuleParameters, function (err, authRule, request, response) {
              should.not.exist(err);
              done();
          });
      });

      it('retrieve connection string for external routing topic - Topic1', function(done) {
          sbClient.topics.listKeys(resourceGroupName, sbNamespaceName, externalTopic1Name, sbAuthRuleName, function (err, authRules, request, response) {
              should.not.exist(err);
              routingTopic1ConnectionString = authRules.primaryConnectionString;
              done();
          });
      });

      it('should create the iothub successfully', function(done) {
          var iotHubCreateParams =
          {
              name: resourceName,
              location: location,
              subscriptionid: subscriptionId,
              resourcegroup: resourceGroupName,
              sku:
              {
                  name: 'S1',
                  capacity: 2
              },
              properties:
              {
                  enableFileUploadNotifications: false,
                  ipFilterRules: [
                      {
                          filterName: 'ipfilterrule',
                          action: 'Accept',
                          ipMask: '0.0.0.0/0'
                      }
                  ],
                  operationsMonitoringProperties:
                  {
                      events:
                      {
                          'C2DCommands': 'Error',
                          'DeviceTelemetry': 'Error',
                          'DeviceIdentityOperations': 'Error',
                          'Connections': 'Error, Information'
                      }
                  },
                  routing:
                  {
                      endpoints:
                      {
                          serviceBusTopics: [
                              {
                                  name: 'Topic1',
                                  connectionString: routingTopic1ConnectionString,
                                  subscriptionId: subscriptionId,
                                  resourceGroup: resourceGroupName
                              }
                          ],
                          eventHubs: [
                              {
                                  name: 'EH1',
                                  connectionString: routingEH1ConnectionString,
                                  subscriptionId: subscriptionId,
                                  resourceGroup: resourceGroupName
                              }
                          ]
                      },
                      routes: [
                          {
                              name: 'Route1',
                              source: 'DeviceMessages',
                              condition: 'false',
                              endpointNames: [
                                  'EH1'
                              ],
                              isEnabled: true
                          },
                          {
                              name: 'Route2',
                              source: 'DeviceMessages',
                              condition: 'true',
                              endpointNames: [
                                 'Topic1'
                              ],
                              isEnabled: true
                          }
                      ]
                  },
                  "features": "None",
              }
          }

          client.iotHubResource.createOrUpdate(resourceGroupName, resourceName, iotHubCreateParams, function(err, result, request, response) {
              should.not.exist(err);
              result.sku.capacity.should.equal(2);
              result.name.should.equal(resourceName);
              result.properties.ipFilterRules.length.should.equal(1);
              result.properties.ipFilterRules[0].filterName.should.equal('ipfilterrule');
              result.properties.ipFilterRules[0].action.should.equal('Accept');
              result.properties.ipFilterRules[0].ipMask.should.equal('0.0.0.0/0');
              result.properties.routing.endpoints.eventHubs.length.should.equal(1);
              result.properties.routing.endpoints.eventHubs[0].name.should.equal('EH1');
              result.properties.routing.endpoints.serviceBusTopics.length.should.equal(1);
              result.properties.routing.endpoints.serviceBusTopics[0].name.should.equal('Topic1');
              result.properties.routing.routes.length.should.equal(2);
              result.properties.routing.routes[0].name.should.equal('Route1');
              result.properties.routing.routes[1].name.should.equal('Route2');
              done();
          });
      });

      it('should create a new external eventhub EH2 to test routing', function (done) {
          // create EventHub
          var ehParameters = {
              location: ehLocation,
              name: externalEH2Name
          };
          ehClient.eventHubs.createOrUpdate(resourceGroupName, ehNamespaceName, externalEH2Name, ehParameters, function (err, eventHub, request, response) {
              should.not.exist(err);
              done();
          });
      });

      it('should add an auth rule to external routing eventhub EH 2', function (done) {
          var ehAuthRuleParameters = {
              name: ehAuthRuleName,
              rights: [
                  'Send'
              ]
          }
          ehClient.eventHubs.createOrUpdateAuthorizationRule(resourceGroupName, ehNamespaceName, externalEH2Name, ehAuthRuleName, ehAuthRuleParameters, function (err, authRule, request, response) {
              should.not.exist(err);
              done();
          });
      });

      it('retrieve connection string for external routing eventhub EH 2', function (done) {
          ehClient.eventHubs.listKeys(resourceGroupName, ehNamespaceName, externalEH2Name, ehAuthRuleName, function (err, authRules, request, response) {
              should.not.exist(err);
              routingEH2ConnectionString = authRules.primaryConnectionString;
              done();
          });
      });

      it('should create a new external Queue to test routing', function (done) {
          // create Queue
          var queueParameters = {
              location: sbLocation,
              name: externalQueue1Name
          };
          sbClient.queues.createOrUpdate(resourceGroupName, sbNamespaceName, externalQueue1Name, queueParameters, function (err, queue, request, response) {
              should.not.exist(err);
              done();
          });
      });

      it('should add an auth rule to external routing queue - Queue1', function (done) {
          var sbAuthRuleParameters = {
              name: sbAuthRuleName,
              rights: [
                  'Send'
              ]
          }
          sbClient.queues.createOrUpdateAuthorizationRule(resourceGroupName, sbNamespaceName, externalQueue1Name, sbAuthRuleName, sbAuthRuleParameters, function (err, authRule, request, response) {
              should.not.exist(err);
              done();
          });
      });

      it('retrieve connection string for external routing queue - Queue1', function (done) {
          sbClient.queues.listKeys(resourceGroupName, sbNamespaceName, externalQueue1Name, sbAuthRuleName, function (err, authRules, request, response) {
              should.not.exist(err);
              routingQueue1ConnectionString = authRules.primaryConnectionString;
              done();
          });
      });

      it('should update the iothub successfully', function(done) {
          var iotHubUpdateParams =
          {
              name: resourceName,
              location: location,
              subscriptionid: subscriptionId,
              resourcegroup: resourceGroupName,
              sku:
              {
                  name: 'S1',
                  capacity: 3
              },
              properties:
              {
                  enableFileUploadNotifications: false,
                  ipFilterRules: [
                      {
                          filterName: 'ipfilterrule2',
                          action: 'Reject',
                          ipMask: '192.168.0.0/10'
                      }
                  ],
                  operationsMonitoringProperties:
                  {
                      events:
                      {
                          'C2DCommands': 'Error',
                          'DeviceTelemetry': 'Error',
                          'DeviceIdentityOperations': 'Error',
                          'Connections': 'Error, Information'
                      }
                  },
                  routing:
                  {
                      endpoints:
                      {
                          serviceBusQueues: [
                              {
                                  name: 'Queue1',
                                  connectionString: routingQueue1ConnectionString,
                                  subscriptionId: subscriptionId,
                                  resourceGroup: resourceGroupName
                              }
                          ],
                          eventHubs: [
                              {
                                  name: 'EH2',
                                  connectionString: routingEH2ConnectionString,
                                  subscriptionId: subscriptionId,
                                  resourceGroup: resourceGroupName
                              }
                          ]
                      },
                      routes: [
                          {
                              name: 'Route3',
                              source: 'DeviceMessages',
                              condition: 'false',
                              endpointNames: [
                                  'EH2'
                              ],
                              isEnabled: true
                          },
                          {
                              name: 'Route4',
                              source: 'DeviceMessages',
                              condition: 'true',
                              endpointNames: [
                                  'Queue1'
                              ],
                              isEnabled: true
                          }
                      ]
                  },
                  "features": "None",
              }
          }

          client.iotHubResource.createOrUpdate(resourceGroupName, resourceName, iotHubUpdateParams, function(err, result, request, response) {
              should.not.exist(err);
              result.sku.capacity.should.equal(3);
              result.name.should.equal(resourceName);
              result.properties.ipFilterRules.length.should.equal(1);
              result.properties.ipFilterRules[0].filterName.should.equal('ipfilterrule2');
              result.properties.ipFilterRules[0].action.should.equal('Reject');
              result.properties.ipFilterRules[0].ipMask.should.equal('192.168.0.0/10');
              result.properties.routing.endpoints.serviceBusQueues.length.should.equal(1);
              result.properties.routing.endpoints.serviceBusQueues[0].name.should.equal('Queue1');
              result.properties.routing.endpoints.eventHubs.length.should.equal(1);
              result.properties.routing.endpoints.eventHubs[0].name.should.equal('EH2');
              result.properties.routing.routes.length.should.equal(2);
              result.properties.routing.routes[0].name.should.equal('Route3');
              result.properties.routing.routes[1].name.should.equal('Route4');
              done();
          });
      });

      it('should get the iothub description successfully', function(done) {
          client.iotHubResource.get(resourceGroupName, resourceName, function(err, result, request, response) {
              should.not.exist(err);
              should.exist(result);
              result.name.should.equal(resourceName);
              result.location.should.equal(location);
              result.sku.capacity.should.equal(3);
              response.statusCode.should.equal(200);
              done();
          });
      });

      it('should get the iothub descriptions for all hubs in a resource group successfully', function(done) {
          client.iotHubResource.listByResourceGroup(resourceGroupName, function(err, result, request, response) {
              should.not.exist(err);
              should.exist(result);
              response.statusCode.should.equal(200);
              result.length.should.be.above(0);
              done();
          });
      });

      it.skip('should get the iothub quota metric successfully', function(done) {
          client.iotHubResource.getQuotaMetrics(resourceGroupName, resourceName, function(err, result, request, response) {
              should.not.exist(err);
              should.exist(result);
              response.statusCode.should.equal(200);
              result[0].name.should.equal('TotalMessages');
              result[0].currentValue.should.equal(0);
              result[0].maxValue.should.equal(1200000);
              result[1].name.should.equal('TotalDeviceCount');
              result[1].currentValue.should.equal(0);
              result[1].maxValue.should.equal(500000);
              done();
          });
      });

      it.skip('should get the iothub stats successfully', function(done) {
          client.iotHubResource.getStats(resourceGroupName, resourceName, function(err, result, request, response) {
              should.not.exist(err);
              should.exist(result);
              response.statusCode.should.equal(200);
              result.totalDeviceCount.should.be.equal(0);
              result.enabledDeviceCount.should.be.equal(0);
              result.disabledDeviceCount.should.be.equal(0);
              done();
          });
      });

      it('should get the valid iothub skus successfully', function(done) {
          client.iotHubResource.getValidSkus(resourceGroupName, resourceName, function(err, result, request, response) {
              should.not.exist(err);
              should.exist(result);
              response.statusCode.should.equal(200);
              result.length.should.be.equal(3);
              result[0].resourceType.should.equal("Microsoft.Devices/IotHubs");
              result[0].sku.name.should.equal("S1");
              done();
          });
      });

      it('should get all the iothub keys successfully', function(done) {
          client.iotHubResource.listKeys(resourceGroupName, resourceName, function(err, result, request, response) {
              should.not.exist(err);
              should.exist(result);
              response.statusCode.should.equal(200);
              result.length.should.be.above(0);
              result[0].keyName.should.equal('iothubowner');
              done();
          });
      });

      it('should get a specific iothub key successfully', function(done) {
          client.iotHubResource.getKeysForKeyName(resourceGroupName, resourceName, 'iothubowner', function(err, result, request, response) {
              should.not.exist(err);
              should.exist(result);
              response.statusCode.should.equal(200);
              result.keyName.should.equal('iothubowner');
              done();
          });
      });

      it.skip('should get all the eventhub consumer groups successfully', function(done) {
          client.iotHubResource.listEventHubConsumerGroups(resourceGroupName, resourceName, 'events', function(err, result, request, response) {
              should.not.exist(err);
              should.exist(result);
              response.statusCode.should.equal(200);
              result.length.should.be.above(0);
              result[0].should.be.equal('$Default');
              done();
          });
      });

      it('should add an eventhub consumer group successfully', function(done) {
          client.iotHubResource.createEventHubConsumerGroup(resourceGroupName, resourceName, eventsEndpointName, consumerGroupName, function(err, result, request, response) {
              should.not.exist(err);
              should.exist(result);
              response.statusCode.should.equal(200);
              result.name.should.equal(consumerGroupName);
              done();
          });
      });

      it('should get a single eventhub consumer group successfully', function(done) {
          client.iotHubResource.getEventHubConsumerGroup(resourceGroupName, resourceName, eventsEndpointName, consumerGroupName, function(err, result, request, response) {
              should.not.exist(err);
              should.exist(result);
              response.statusCode.should.equal(200);
              result.name.should.equal(consumerGroupName);
              done();
          });
      });

      it('should delete an eventhub consumer group successfully', function(done) {
          client.iotHubResource.deleteEventHubConsumerGroup(resourceGroupName, resourceName, eventsEndpointName, consumerGroupName, function(err, result, request, response) {
              should.not.exist(err);
              response.statusCode.should.equal(200);
              done();
          });
      });
/*
       // commenting delete scenario from node as it may fail due to external dependencies like portal being open e.t.c
      it('should delete the iothub successfully', function (done)
      {
        client.iotHubResource.deleteMethod(resourceGroupName, resourceName, function (err, result, request, response)
        {
          should.not.exist(err);
          done();
        });
      });
 */
  });

    describe('Get All IoTHubs in subscription', function() {
        it('should get the iothub descriptions for all hubs in a subscription successfully', function(done) {
            client.iotHubResource.listBySubscription(function(err, result, request, response) {
                should.not.exist(err);
                should.exist(result);
                response.statusCode.should.equal(200);
                result.length.should.be.above(0);
                done();
            });
        });
    });
});