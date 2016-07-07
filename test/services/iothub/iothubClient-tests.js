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
var IoTHubClient = require('../../../lib/services/iothub/lib/iothubClient');
var testPrefix = 'iothub-tests';
var resourceGroupName = 'nodetestrg';
var resourceName = 'nodeTestHub';
var location = 'eastus';
var operationId;
var subscriptionId;
var iotHubExists = false;
var maxRetryCount = 120;
var retryIntervalInSeconds = 5;
var url = require('url');
var consumerGroupName = 'testconsumergroup';
var eventsEndpointName = 'events';

describe('IoTHub', function () {
  
  before(function (done) {
    suite = new SuiteBase(this, testPrefix);
    suite.setupSuite(function () {
        client = new IoTHubClient(suite.credentials, null);
        subscriptionId = suite.subscriptionId;
    });

      if (suite.isPlayback) {
        client.longRunningOperationRetryTimeout = 0;
      }

      suite.createResourcegroup(resourceGroupName, location, function (err, result) {
          should.not.exist(err);
      });

      done();
  });
  
  after(function (done) {
    suite.teardownSuite(done);
  });
  
  beforeEach(function (done) {
    suite.setupTest(done);
  });
  
  afterEach(function (done) {
    suite.baseTeardownTest(done);
  });


  describe('Get IoTHub Operations', function () {
      it('should get the iothub operations successfully', function (done) {
        client.iotHubResource.getResourceProviderOperations(null, function (err, result, request, response) {
            should.not.exist(err);
            should.exist(result);
            response.statusCode.should.equal(200);
            done();
        });
      });
  });

  describe('IoTHub Lifecycle Test', function () {
      it('should check if the iothub name exists', function (done) {

          var operationInputs = {
              name: resourceName
          };

          client.iotHubResource.checkIotHubNameAvailability(subscriptionId, operationInputs, null, function (err, result, request, response) {
              should.not.exist(err);
              if (!result.nameAvailable) {
                  iotHubExists = true;
                  console.log('Hub exists');
              } else {
                  console.log('Hub does not exist');
              }
              done();
          });
      });
  
        it('should delete a hub if it exists successfully', function (done) {

            if (iotHubExists) {
              console.log('Deleting existing hub');
              client.iotHubResource.deleteIotHub(resourceName, subscriptionId, resourceGroupName, null, function (err, result, request, response) {
                  should.not.exist(err);
                  operationId = response.headers['azure-asyncoperation'];
                  waitForJobCompletion(operationId, 0, false, "TimeOut", done);
              });
            } else {
                console.log('Hub does not exist. Skipping Delete');
                done();
            }
      });

      it('should create the iothub successfully', function (done) {

          var iotHubCreateParams = {
              name: resourceName,
              location: location,
              subscriptionid: subscriptionId,
              resourcegroup: resourceGroupName,
              sku: {
                  name: 'S1',
                  capacity: 2
              },
              properties: {
                  enableFileUploadNotifications: false,
                  operationsMonitoringProperties: {
                      events: {
                          "C2DCommands": "Error",
                          "DeviceTelemetry": "Error",
                          "DeviceIdentityOperations": "Error",
                          "Connections": "Error, Information"
                      }
                  },
                  "features": "None",
              }
          }

          console.log('Creating the hub');
          client.iotHubResource.createOrUpdateIotHub(subscriptionId, resourceGroupName, resourceName, iotHubCreateParams, null, function (err, result, request, response) {
              should.not.exist(err);
              response.statusCode.should.equal(201);
              operationId = response.headers['azure-asyncoperation'];
              waitForJobCompletion(operationId, 0, false, "TimeOut", done);
          });
      });

      it('should update the iothub successfully', function (done) {
          var iotHubUpdateParams = {
              name: resourceName,
              location: location,
              subscriptionid: subscriptionId,
              resourcegroup: resourceGroupName,
              sku: {
                  name: 'S1',
                  capacity: 3
              },
              properties: {
                  enableFileUploadNotifications: false,
                  operationsMonitoringProperties: {
                      events: {
                          "C2DCommands": "Error",
                          "DeviceTelemetry": "Error",
                          "DeviceIdentityOperations": "Error",
                          "Connections": "Error, Information"
                      }
                  },
                  "features": "None",
              }
          }

          console.log('Updating the hub');
          client.iotHubResource.createOrUpdateIotHub(subscriptionId, resourceGroupName, resourceName, iotHubUpdateParams, null, function (err, result, request, response) {
              should.not.exist(err);
              response.statusCode.should.equal(201);
              operationId = response.headers['azure-asyncoperation'];
              waitForJobCompletion(operationId, 0, false, "TimeOut", done);
          });
      });

      it('should get the iothub description successfully', function (done) {
          client.iotHubResource.getIotHub(resourceName, subscriptionId, resourceGroupName, null, function (err, result, request, response) {
                should.not.exist(err);
                should.exist(result);
                result.name.should.equal(resourceName);
                result.location.should.equal(location);
                result.sku.capacity.should.equal(3);
                response.statusCode.should.equal(200);
                done();
          });
      });

      it('should get the iothub descriptions for all hubs in a resource group successfully', function (done) {
          client.iotHubResource.getIotHubsForResourceGroup(subscriptionId, resourceGroupName, null, function (err, result, request, response) {
              should.not.exist(err);
              should.exist(result);
              result.value.length.should.be.above(0);
              response.statusCode.should.equal(200);
              done();
          });
      });

      it('should get the iothub quota metric successfully', function (done) {
          client.iotHubResource.getQuotaMetrics(resourceName, subscriptionId, resourceGroupName, null, function (err, result, request, response) {
              should.not.exist(err);
              should.exist(result);
              result.value.length.should.be.equal(2);
              response.statusCode.should.equal(200);
              done();
          });
      });

      it('should get the iothub stats successfully', function (done) {
          client.iotHubResource.getIotHubStats(resourceName, subscriptionId, resourceGroupName, null, function (err, result, request, response) {
              should.not.exist(err);
              should.exist(result);
              response.statusCode.should.equal(200);
              result.totalDeviceCount.should.be.equal(0);
              result.enabledDeviceCount.should.be.equal(0);
              result.disabledDeviceCount.should.be.equal(0);
              done();
          });
      });

      it('should get the valid iothub skus successfully', function (done) {
          client.iotHubResource.getValidIotHubSkus(resourceName, subscriptionId, resourceGroupName, null, function (err, result, request, response) {
              should.not.exist(err);
              should.exist(result);
              response.statusCode.should.equal(200);
              result.value.length.should.be.above(0);
              done();
          });
      });

      it('should get all the iothub keys successfully', function (done) {
          client.iotHubResource.getAllIotHubKeys(resourceName, subscriptionId, resourceGroupName, null, function (err, result, request, response) {
              should.not.exist(err);
              should.exist(result);
              response.statusCode.should.equal(200);
              result.value.length.should.be.above(0);
              done();
          });
      });

      it('should get a specific iothub key successfully', function (done) {
          client.iotHubResource.getIotHubKeysForKeyName(resourceName, 'iothubowner', subscriptionId, resourceGroupName, null, function (err, result, request, response) {
              should.not.exist(err);
              should.exist(result);
              response.statusCode.should.equal(200);
              result.keyName.should.equal('iothubowner');
              done();
          });
      });

      it('should get all the eventhub consumer groups successfully', function (done) {
          client.iotHubResource.getEventHubConsumerGroups(resourceName, 'events', subscriptionId, resourceGroupName, null, function (err, result, request, response) {
              should.not.exist(err);
              should.exist(result);
              response.statusCode.should.equal(200);
              result.value.length.should.be.above(0);
              console.log("consumer group names : " + JSON.stringify(result.value))
              done();
          });
      });

      it('should add an eventhub consumer group successfully', function (done) {
          client.iotHubResource.addEventHubConsumerGroup(resourceName, eventsEndpointName, consumerGroupName, subscriptionId, resourceGroupName, null, function (err, result, request, response) {
              should.not.exist(err);
              should.exist(result);
              response.statusCode.should.equal(200);
              result.name.should.equal(consumerGroupName)
              done();
          });
      });

      it('should get a single eventhub consumer group successfully', function (done) {
          client.iotHubResource.getEventHubConsumerGroup(resourceName, eventsEndpointName, consumerGroupName, subscriptionId, resourceGroupName, null, function (err, result, request, response) {
              should.not.exist(err);
              should.exist(result);
              response.statusCode.should.equal(200);
              result.name.should.equal(consumerGroupName)
              done();
          });
      });

      it('should delete an eventhub consumer group successfully', function (done) {
          client.iotHubResource.deleteEventHubConsumerGroup(resourceName, eventsEndpointName, consumerGroupName, subscriptionId, resourceGroupName, null, function (err, result, request, response) {
              should.not.exist(err);
              response.statusCode.should.equal(200);
              done();
          });
      });

      it('should delete the iothub successfully', function (done) {
          client.iotHubResource.deleteIotHub(resourceName, subscriptionId, resourceGroupName, null, function (err, result, request, response) {
                should.not.exist(err);
                response.statusCode.should.equal(202);
                operationId = response.headers['azure-asyncoperation'];
                waitForJobCompletion(operationId, 0, false, "TimeOut", done);
            });
      });
  });

  describe('Get All IoTHubs', function () {
      it('should get the iothub descriptions for all hubs in a subscription successfully', function (done) {

              client.iotHubResource.getIotHubsForSubscription(subscriptionId, null, function (err, result, request, response) {
                  should.not.exist(err);
                  should.exist(result);
                  result.value.length.should.be.above(0);
                  response.statusCode.should.equal(200);
                  done();
              });
      });
  });

  function sleep(time) {
      var stop = new Date().getTime();
      while (new Date().getTime() < stop + time) {
          ;
      }
  }

  function waitForJobCompletion(operationId, currentRetryCount, orchestrationFinished, status, done) {

      if (orchestrationFinished || currentRetryCount >= maxRetryCount)
      {
          status.should.equal("Succeeded");
          console.log('operation completed successfully');
          done();
      }
      else
      {
          console.log('Retry Attempt #' + currentRetryCount++);
          var absoluteOperationId = url.parse(operationId).pathname;
          var operationIdSegments = absoluteOperationId.toString().split("/");
          var operationId = operationIdSegments[operationIdSegments.length - 1];
          client.iotHubResource.getOperationResult(operationId, subscriptionId, resourceGroupName, resourceName, null, function (err, result, request, response) {
              should.not.exist(err);
              should.exist(result);
              console.log('Job status : ' + result.status);
              if (result.status == 'Succeeded' || result.status == 'Canceled' || result.status == 'Failed') {
                  status = result.status;
                  orchestrationFinished = true;
              }

              setTimeout(function () {
                  waitForJobCompletion(absoluteOperationId, currentRetryCount, orchestrationFinished, status, done);
              }, retryIntervalInSeconds * 1000);
          });
      }
  }
});