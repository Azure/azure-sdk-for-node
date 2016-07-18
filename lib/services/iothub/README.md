# Microsoft Azure SDK for Node.js - IoT Hub

This project provides a Node.js package that makes it easy to manage Microsoft Azure Iot Hub Resources.Right now it supports:
- **Node.js version: 4.x.x or higher**

## How to Install

```bash
npm install azure-arm-iothub
```
## How to Use

### Authentication, client creation and listing iotHubs in a subscription as an example

 ```javascript

  var msRestAzure = require('ms-rest-azure');
  var storageManagementClient = require('azure-arm-storage');

  // Interactive Login
  msRestAzure.interactiveLogin(function(err, credentials) 
	{
    var client = new storageManagementClient(credentials, 'your-subscription-id');
    client.iotHubResource.listBySubscription(function (err, result, request, response)
    {
      if (err) console.log(err);
      console.log(result);
    });
  });

 ```

## Check if an IoT Hub name is available

```javascript

  var operationInputs = 
  {
    name: resourceName
  };

  client.iotHubResource.checkNameAvailability(operationInputs, function (err, result, request, response)
  {
    should.not.exist(err);
    if (!result.nameAvailable)
    {
      iotHubExists = true;
    } 
  }

```

## Create an IoT Hub

```javascript

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
      operationsMonitoringProperties:
      {
        events:
        {
          "C2DCommands": "Error",
          "DeviceTelemetry": "Error",
          "DeviceIdentityOperations": "Error",
          "Connections": "Error, Information"
        }
      },
      "features": "None",
    }
  }

  client.iotHubResource.createOrUpdate(resourceGroupName, resourceName, iotHubCreateParams, function (err, result, request, response)
  {
    should.not.exist(err);
    result.sku.capacity.should.equal(2);
    result.name.should.equal(resourceName);
  });

```

## Update an IoT Hub

```javascript

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
      operationsMonitoringProperties:
      {
        events:
        {
          "C2DCommands": "Error",
          "DeviceTelemetry": "Error",
          "DeviceIdentityOperations": "Error",
          "Connections": "Error, Information"
        }
      },
      "features": "None",
    }
  }

  client.iotHubResource.createOrUpdate(resourceGroupName, resourceName, iotHubUpdateParams, function (err, result, request, response)
  {
    should.not.exist(err);
    result.sku.capacity.should.equal(3);
    result.name.should.equal(resourceName);
  });

```

## Get an IoT Hub Description

```javascript

  client.iotHubResource.get(resourceGroupName, resourceName, function (err, result, request, response)
  {
    should.not.exist(err);
    should.exist(result);
    result.name.should.equal(resourceName);
    result.location.should.equal(location);
    result.sku.capacity.should.equal(3);
    response.statusCode.should.equal(200);
  });

```

## Delete an IoT Hub 

```javascript

  client.iotHubResource.deleteMethod(resourceGroupName, resourceName, function (err, result, request, response)
  {
    should.not.exist(err);
  });

```


## Get all IoT Hub Descriptions in a resourcegroup

```javascript

  client.iotHubResource.listByResourceGroup(resourceGroupName, function (err, result, request, response)
  {
    should.not.exist(err);
    should.exist(result);
    response.statusCode.should.equal(200);
    result.length.should.be.above(0);
  });

```

## Get IoT Hub Quota Metrics 

```javascript

  client.iotHubResource.getQuotaMetrics(resourceGroupName, resourceName, function (err, result, request, response)
  {
    should.not.exist(err);
    should.exist(result);
    response.statusCode.should.equal(200);
    result[0].name.should.equal('TotalMessages');
    result[0].currentValue.should.equal(0);
    result[0].maxValue.should.equal(800000);
    result[1].name.should.equal('TotalDeviceCount');
    result[1].currentValue.should.equal(0);
    result[1].maxValue.should.equal(500000);
  });

```

## Get Valid IoT Hub Skus

```javascript

  client.iotHubResource.getValidSkus(resourceGroupName, resourceName, function (err, result, request, response)
  {
    should.not.exist(err);
    should.exist(result);
    response.statusCode.should.equal(200);
    result.length.should.be.equal(3);
    result[0].resourceType.should.equal("Microsoft.Devices/IotHubs");
    result[0].sku.name.should.equal("S1");
  });

```

## Get All IoT Hub Keys

```javascript

  client.iotHubResource.listKeys(resourceGroupName, resourceName, function (err, result, request, response)
  {
    should.not.exist(err);
    should.exist(result);
    response.statusCode.should.equal(200);
    result.length.should.be.above(0);
    result[0].keyName.should.equal('iothubowner');
  });

```

## Get a specific IoT Hub Key

```javascript

  client.iotHubResource.getKeysForKeyName(resourceGroupName, resourceName, 'iothubowner', function (err, result, request, response)
  {
    should.not.exist(err);
    should.exist(result);
    response.statusCode.should.equal(200);
    result.keyName.should.equal('iothubowner');
  });

```

## Get all eventhub consumer groups

```javascript

  client.iotHubResource.listEventHubConsumerGroups(resourceGroupName, resourceName, 'events', function (err, result, request, response)
  {
    should.not.exist(err);
    should.exist(result);
    response.statusCode.should.equal(200);
    result.length.should.be.above(0);
    result[0].should.be.equal('$Default');
  });

```

## Add an eventhub consumer group

```javascript

  client.iotHubResource.createEventHubConsumerGroup(resourceGroupName, resourceName, eventsEndpointName, consumerGroupName, function (err, result, request, response)
  {
    should.not.exist(err);
    should.exist(result);
    response.statusCode.should.equal(200);
    result.name.should.equal(consumerGroupName);
  });

```

## Get an eventhub consumer group

```javascript

  client.iotHubResource.getEventHubConsumerGroup(resourceGroupName, resourceName, eventsEndpointName, consumerGroupName, function (err, result, request, response)
  {
    should.not.exist(err);
    should.exist(result);
    response.statusCode.should.equal(200);
    result.name.should.equal(consumerGroupName);
  });

```

## Delete an eventhub consumer group

```javascript

  client.iotHubResource.deleteEventHubConsumerGroup(resourceGroupName, resourceName, eventsEndpointName, consumerGroupName, function (err, result, request, response)
  {
    should.not.exist(err);
    response.statusCode.should.equal(200);
  });

```
## Related projects

- [Microsoft Azure SDK for Node.js - All-up](https://github.com/WindowsAzure/azure-sdk-for-node)
