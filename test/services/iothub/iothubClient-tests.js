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
            client = new IoTHubClient(suite.credentials, suite.subscriptionId, null);
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


    describe('IoTHub Lifecycle Test', function () {
        it('should check if the iothub name exists', function (done) {

            var operationInputs = {
                name: resourceName
            };

            client.iotHubResource.checkNameAvailability(operationInputs, function (err, result, request, response) {
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
                client.iotHubResource.deleteMethod(resourceGroupName, resourceName, null, function (err, result, request, response) {
                    should.not.exist(err);
                    done();
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
            client.iotHubResource.createOrUpdate(resourceGroupName, resourceName, iotHubCreateParams, null, function (err, result, request, response) {
                should.not.exist(err);
                done();
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
            client.iotHubResource.createOrUpdate(resourceGroupName, resourceName, iotHubUpdateParams, null, function (err, result, request, response) {
                should.not.exist(err);
                done();
            });
        });

        it('should get the iothub description successfully', function (done) {
            client.iotHubResource.get(resourceGroupName, resourceName, null, function (err, result, request, response) {
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
            client.iotHubResource.listByResourceGroup(resourceGroupName, null, function (err, result, request, response) {
                should.not.exist(err);
                should.exist(result);
                response.statusCode.should.equal(200);
                done();
            });
        });

        it('should get the iothub quota metric successfully', function (done) {
            client.iotHubResource.getQuotaMetrics(resourceGroupName, resourceName, null, function (err, result, request, response) {
                should.not.exist(err);
                should.exist(result);
                response.statusCode.should.equal(200);
                done();
            });
        });

        /* Enable this after the fix in the service has been deployed
        it('should get the iothub stats successfully', function (done) {
            client.iotHubResource.getStats(resourceGroupName, resourceName, null, function (err, result, request, response) {
                should.not.exist(err);
                should.exist(result);
                response.statusCode.should.equal(200);
                result.totalDeviceCount.should.be.equal(0);
                result.enabledDeviceCount.should.be.equal(0);
                result.disabledDeviceCount.should.be.equal(0);
                done();
            });
        });*/

        it('should get the valid iothub skus successfully', function (done) {
            client.iotHubResource.getValidSkus(resourceGroupName, resourceName, null, function (err, result, request, response) {
                should.not.exist(err);
                should.exist(result);
                response.statusCode.should.equal(200);
                done();
            });
        });

        it('should get all the iothub keys successfully', function (done) {
            client.iotHubResource.listKeys(resourceGroupName, resourceName, null, function (err, result, request, response) {
                should.not.exist(err);
                should.exist(result);
                response.statusCode.should.equal(200);
                done();
            });
        });

        it('should get a specific iothub key successfully', function (done) {
            client.iotHubResource.getKeysForKeyName(resourceGroupName, resourceName, 'iothubowner', null, function (err, result, request, response) {
                should.not.exist(err);
                should.exist(result);
                response.statusCode.should.equal(200);
                result.keyName.should.equal('iothubowner');
                done();
            });
        });

        it('should get all the eventhub consumer groups successfully', function (done) {
            client.iotHubResource.listEventHubConsumerGroups(resourceGroupName, resourceName, 'events', null, function (err, result, request, response) {
                should.not.exist(err);
                should.exist(result);
                response.statusCode.should.equal(200);
                done();
            });
        });

        it('should add an eventhub consumer group successfully', function (done) {
            client.iotHubResource.createEventHubConsumerGroup(resourceGroupName, resourceName, eventsEndpointName, consumerGroupName, null, function (err, result, request, response) {
                should.not.exist(err);
                should.exist(result);
                response.statusCode.should.equal(200);
                result.name.should.equal(consumerGroupName)
                done();
            });
        });

        it('should get a single eventhub consumer group successfully', function (done) {
            client.iotHubResource.getEventHubConsumerGroup(resourceGroupName, resourceName, eventsEndpointName, consumerGroupName, null, function (err, result, request, response) {
                should.not.exist(err);
                should.exist(result);
                response.statusCode.should.equal(200);
                result.name.should.equal(consumerGroupName)
                done();
            });
        });

        it('should delete an eventhub consumer group successfully', function (done) {
            client.iotHubResource.deleteEventHubConsumerGroup(resourceGroupName, resourceName, eventsEndpointName, consumerGroupName, null, function (err, result, request, response) {
                should.not.exist(err);
                response.statusCode.should.equal(200);
                done();
            });
        });

    });

    describe('Get All IoTHubs in subscription', function () {
        it('should get the iothub descriptions for all hubs in a subscription successfully', function (done) {

            client.iotHubResource.listBySubscription(null, function (err, result, request, response) {
                should.not.exist(err);
                should.exist(result);
                response.statusCode.should.equal(200);
                done();
            });
        });
    });
});