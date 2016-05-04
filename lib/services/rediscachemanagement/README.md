# Microsoft Azure SDK for Node.js - Redis

This project provides a Node.js package for accessing the Azure Redis Cache Client. Right now it supports:
- **Node.js version: 0.10.0 or higher**
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
var msRestAzure = require('ms-rest-azure');
var AzureMgmtRedisCache = require('azure-arm-rediscache');
  
// Create an Azure Redis Cache Management client.
  var credentials = new msRestAzure.UserTokenCredentials('your-client-id', 'your-domain', 'your-username', 'your-password', 'your-redirect-uri');
  client = new AzureMgmtRedisCache(credentials, 'your-subscription-id');

  var resourceGroup = 'myResourceGroup';
  var cacheName = 'myNewCache';

//Create an Azure Redis Cache

  var skuProperties = {
		  capacity : 1,
		  family : C,
		  name : 'Standard'
	  };
		  
  var parameters = {
		  location:'West US',
		  redisVersion : '3.0',
      enableNonSslPort : false,
      sku : skuProperties
	  };
  
  console.info('Creating cache...');
  client.redis.createOrUpdate(resourceGroup, cacheName, parameters, function (err, result) {
    if (err) throw err;
    console.info('Cache created: ' + JSON.stringify(result, null, ' '));
  });


//Show properties of an existing Azure Redis Cache

  console.info('Getting cache properties...');
  client.redis.get(resourceGroup, cacheName, function (err, result) {
    if (err) throw err;
    console.info('Cache properties: ' + JSON.stringify(result, null, ' '));
  });


//list all caches within a resource group

  console.info('Getting caches within a resource group...');
  client.redis.listByResourceGroup(resourceGroup, function (err, result) {
    if (err) throw err;
    console.info('Caches: ' + JSON.stringify(result, null, ' '));
  });

//list all caches within your subscription

  console.info('Getting caches within a subscription...');
  client.redis.list(function (err, result) {
    if (err) throw err;
    console.info('Caches: ' + JSON.stringify(result, null, ' '));
  });

//show primary and secondary keys of the cache

  console.info('Getting cache keys...');
  client.redis.listKeys(resourceGroup, cacheName, function (err, result) {
    if (err) throw err;
    console.info('Cache keys: ' + JSON.stringify(result, null, ' '));
  });


//regenerate  keys of the cache
  
  var keytype = 'Primary';
  console.info('Getting cache keys...');
  client.redis.regenerateKey(resourceGroup, cacheName, keytype, function (err, result) {
    if (err) throw err;
    console.info('Cache primary key regenerated');
    console.info('Regenerated Cache keys: ' + JSON.stringify(result, null, ' '));
  });
```

## Related projects

- [Microsoft Azure SDK for Node.js](https://github.com/Azure/azure-sdk-for-node)
- [AutoRest](https://github.com/Azure/autorest)