# Microsoft Azure SDK for Node.js - IoT Hub

This project provides a Node.js package that makes it easy to manage Microsoft Azure Iot Hub Resources.Right now it supports:
- **Node.js version: 6.x.x or higher**

## How to Install

```bash
npm install azure-arm-iothub
```
## How to Use

### Authentication, client creation and listing iotHubs in a subscription as an example

 ```javascript

  var msRestAzure = require('ms-rest-azure');
  var IoTHubClient = require('azure-arm-iothub');

  // Interactive Login
  msRestAzure.interactiveLogin(function(err, credentials) 
	{
    var client = new IoTHubClient(credentials, 'your-subscription-id');
    client.iotHubResource.listBySubscription(function (err, result, request, response)
    {
      if (err)
      {
        console.log(err);
      }

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

  client.iotHubResource.checkNameAvailability(resourceName, operationInputs, function (err, result, request, response)
  {
    if (err)
    {
      console.log(err);
    }

    console.log(result);
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
	  ipFilterRules: [
		 {
			filterName: "ipfilterrule",
			action: "accept",
			ipMask: "0.0.0.0/0"
		 }
		],
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
    if (err)
    {
      console.log(err);
    }

    console.log(result);
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
      ipFilterRules: [
        {
           filterName: "ipfilterrule2",
           action: "reject",
           ipMask: "192.168.0.0/10"
        }
      ],
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
    if (err)
    {
      console.log(err);
    }

    console.log(result);
  });

```

## Get an IoT Hub Description

```javascript

  client.iotHubResource.get(resourceGroupName, resourceName, function (err, result, request, response)
  {
    if (err)
    {
      console.log(err);
    }

    console.log(result);
  });

```

## Delete an IoT Hub 

```javascript

  client.iotHubResource.deleteMethod(resourceGroupName, resourceName, function (err, result, request, response)
  {
    if (err)
    {
      console.log(err);
    }

    console.log(result);
  });

```


## Get all IoT Hub Descriptions in a resourcegroup

```javascript

  client.iotHubResource.listByResourceGroup(resourceGroupName, function (err, result, request, response)
  {
    if (err)
    {
      console.log(err);
    }

    console.log(result);
  });

```

## Get IoT Hub Quota Metrics 

```javascript

  client.iotHubResource.getQuotaMetrics(resourceGroupName, resourceName, function (err, result, request, response)
  {
    if (err)
    {
      console.log(err);
    }

    console.log(result);
  });

```

## Get Valid IoT Hub Skus

```javascript

  client.iotHubResource.getValidSkus(resourceGroupName, resourceName, function (err, result, request, response)
  {
    if (err)
    {
      console.log(err);
    }

    console.log(result);
  });

```

## Get All IoT Hub Keys

```javascript

  client.iotHubResource.listKeys(resourceGroupName, resourceName, function (err, result, request, response)
  {
    if (err)
    {
      console.log(err);
    }

    console.log(result);
  });

```

## Get a specific IoT Hub Key

```javascript

  client.iotHubResource.getKeysForKeyName(resourceGroupName, resourceName, 'iothubowner', function (err, result, request, response)
  {
    if (err)
    {
      console.log(err);
    }

    console.log(result);
  });

```

## Get all eventhub consumer groups

```javascript

  client.iotHubResource.listEventHubConsumerGroups(resourceGroupName, resourceName, 'events', function (err, result, request, response)
  {
    if (err)
    {
      console.log(err);
    }

    console.log(result);
  });

```

## Add an eventhub consumer group

```javascript

  client.iotHubResource.createEventHubConsumerGroup(resourceGroupName, resourceName, eventsEndpointName, consumerGroupName, function (err, result, request, response)
  {
    if (err)
    {
      console.log(err);
    }

    console.log(result);
  });

```

## Get an eventhub consumer group

```javascript

  client.iotHubResource.getEventHubConsumerGroup(resourceGroupName, resourceName, eventsEndpointName, consumerGroupName, function (err, result, request, response)
  {
    if (err)
    {
      console.log(err);
    }

    console.log(result);
  });

```

## Delete an eventhub consumer group

```javascript

  client.iotHubResource.deleteEventHubConsumerGroup(resourceGroupName, resourceName, eventsEndpointName, consumerGroupName, function (err, result, request, response)
  {
    if (err)
    {
      console.log(err);
    }

    console.log(result);
  });

```
## Related projects

- [Microsoft Azure SDK for Node.js - All-up](https://github.com/WindowsAzure/azure-sdk-for-node)
