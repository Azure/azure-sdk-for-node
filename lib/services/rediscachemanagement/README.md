# Microsoft Azure SDK for Node.js - Redis

This project provides a Node.js package for accessing the Azure Redis Cache Client. Right now it supports:
- **Node.js version: 0.6.15 or higher**
- **API version: **

## Features
- Manage Redis Cache: create, update, delete, list, get, regenerate key and get-key.

## How to Install

```bash
npm install azure-arm-rediscache
```

## How to Use

### Initialise the client and managing Redis Cache

```javascript
var AzureCommon       = require('azure-common');
var AzureMgmtRedisCache = require('azure-arm-rediscache');
  
// Create an Azure Redis Cache Management client.
  client = new AzureMgmtRedisCache.createRedisCacheManagementClient(new common.TokenCloudCredentials({
  subscriptionId: "<your subscription id>",
  token: "<your token here>"
}));

  var resourceGroup = 'myResourceGroup';
  var cacheName = 'myNewCache';

//Create an Azure Redis Cache

  var skuProperties = {
		  capacity : 1,
		  family : C,
		  name : 'Standard'
	  };
	  
  var redisProperties = {
			  redisVersion : '3.0',
			  enableNonSslPort : false,
			  sku : skuProperties
		  };
		  
  var parameters = {
		  location:'West US',
		  properties : redisProperties
	  };
  
  console.info('Creating cache...');
  client.redis.createOrUpdate(resourceGroup, cacheName, parameters, function (err, result) {
    if (err) throw err;
    console.info('Cache created: ' + JSON.stringify(result.resource, null, ' '));
  });


//Show properties of an existing Azure Redis Cache

  console.info('Getting cache properties...');
  client.redis.get(resourceGroup, cacheName, function (err, result) {
    if (err) throw err;
    console.info('Cache properties: ' + JSON.stringify(result.resource, null, ' '));
  });


//list all caches within a resource group

  console.info('Getting caches...');
  client.redis.list(resourceGroup, function (err, result) {
    if (err) throw err;
    console.info('Caches: ' + JSON.stringify(result.value, null, ' '));
  });


//show primary and secondary keys of the cache

  console.info('Getting cache keys...');
  client.redis.listKeys(resourceGroup, cacheName, function (err, result) {
    if (err) throw err;
    console.info('Cache keys: ' + JSON.stringify(result, null, ' '));
  });


//regenerate  keys of the cache
  var parameters = {
		  keyType:'Primary',
	  };
	  
  console.info('Getting cache keys...');
  client.redis.regenerateKey(resourceGroup, cacheName, parameters, function (err, result) {
    if (err) throw err;
    console.info('Cache primary key regenerated');
  });
```

## Related projects

- [Microsoft Azure SDK for Node.js](https://github.com/Azure/azure-sdk-for-node)