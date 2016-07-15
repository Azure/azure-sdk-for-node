# Microsoft Azure SDK for Node.js - IoT Hub

This project provides a Node.js package that makes it easy to manage Microsoft Azure Iot Hub Resources.Right now it supports:
- **Node.js version: 4.x.x or higher**

## How to Install

```bash
npm install azure-arm-iothub
```
## How to Use

### Authentication, client creation 

 ```javascript
 var msrestAzure = require('ms-rest-azure');
 var IoTHubClient = require('azure-arm-iothub');
 
 // Interactive Login and create the IoTHub client
 msRestAzure.interactiveLogin(function(err, credentials) {
  var client = new IoTHubClient(credentials, 'your-subscription-id');
 });
 ```

## Check if an IoT Hub name is available

```javascript
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
```

## Create an IoT Hub

```javascript
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
```

## Update an IoT Hub

```javascript
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
```

## Get an IoT Hub Description

```javascript
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
```

## Delete an IoT Hub 

```javascript
      it('should delete the iothub successfully', function (done) {
          client.iotHubResource.deleteIotHub(resourceName, subscriptionId, resourceGroupName, null, function (err, result, request, response) {
                should.not.exist(err);
                response.statusCode.should.equal(202);
                operationId = response.headers['azure-asyncoperation'];
                waitForJobCompletion(operationId, 0, false, "TimeOut", done);
            });
      });
```


## Get all IoT Hub Descriptions in a resourcegroup

```javascript
      it('should get the iothub descriptions for all hubs in a resource group successfully', function (done) {
          client.iotHubResource.getIotHubsForResourceGroup(subscriptionId, resourceGroupName, null, function (err, result, request, response) {
              should.not.exist(err);
              should.exist(result);
              result.value.length.should.be.above(0);
              response.statusCode.should.equal(200);
              done();
          });
      });
```

## Get IoT Hub Quota Metrics 

```javascript
      it('should get the iothub quota metric successfully', function (done) {
          client.iotHubResource.getQuotaMetrics(resourceName, subscriptionId, resourceGroupName, null, function (err, result, request, response) {
              should.not.exist(err);
              should.exist(result);
              result.value.length.should.be.equal(2);
              response.statusCode.should.equal(200);
              done();
          });
      });

```

## Get IoT Hub Statistics 

```javascript
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
```

## Get Valid IoT Hub Skus

```javascript
      it('should get the valid iothub skus successfully', function (done) {
          client.iotHubResource.getValidIotHubSkus(resourceName, subscriptionId, resourceGroupName, null, function (err, result, request, response) {
              should.not.exist(err);
              should.exist(result);
              response.statusCode.should.equal(200);
              result.value.length.should.be.above(0);
              done();
          });
      });

```

## Get All IoT Hub Keys

```javascript
      it('should get all the iothub keys successfully', function (done) {
          client.iotHubResource.getAllIotHubKeys(resourceName, subscriptionId, resourceGroupName, null, function (err, result, request, response) {
              should.not.exist(err);
              should.exist(result);
              response.statusCode.should.equal(200);
              result.value.length.should.be.above(0);
              done();
          });
      });
```

## Get a specific IoT Hub Key

```javascript
      it('should get a specific iothub key successfully', function (done) {
          client.iotHubResource.getIotHubKeysForKeyName(resourceName, 'iothubowner', subscriptionId, resourceGroupName, null, function (err, result, request, response) {
              should.not.exist(err);
              should.exist(result);
              response.statusCode.should.equal(200);
              result.keyName.should.equal('iothubowner');
              done();
          });
      });
```

## Get all eventhub consumer groups

```javascript
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
```

## Add an eventhub consumer group

```javascript
      it('should add an eventhub consumer group successfully', function (done) {
          client.iotHubResource.addEventHubConsumerGroup(resourceName, eventsEndpointName, consumerGroupName, subscriptionId, resourceGroupName, null, function (err, result, request, response) {
              should.not.exist(err);
              should.exist(result);
              response.statusCode.should.equal(200);
              result.name.should.equal(consumerGroupName)
              done();
          });
      });
```

## Get an eventhub consumer group

```javascript
      it('should get a single eventhub consumer group successfully', function (done) {
          client.iotHubResource.getEventHubConsumerGroup(resourceName, eventsEndpointName, consumerGroupName, subscriptionId, resourceGroupName, null, function (err, result, request, response) {
              should.not.exist(err);
              should.exist(result);
              response.statusCode.should.equal(200);
              result.name.should.equal(consumerGroupName)
              done();
          });
      });
```

## Delete an eventhub consumer group

```javascript
      it('should delete an eventhub consumer group successfully', function (done) {
          client.iotHubResource.deleteEventHubConsumerGroup(resourceName, eventsEndpointName, consumerGroupName, subscriptionId, resourceGroupName, null, function (err, result, request, response) {
              should.not.exist(err);
              response.statusCode.should.equal(200);
              done();
          });
      });
```
## Related projects

- [Microsoft Azure SDK for Node.js - All-up](https://github.com/WindowsAzure/azure-sdk-for-node)
