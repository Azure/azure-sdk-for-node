# Microsoft Azure SDK for Node.js - PostgreSQL Management

This project provides a Node.js package that makes it easy to manage Microsoft
Azure PostgreSQL Resources. Right now it supports:
- **Node.js version: 6.x.x or higher**

## How to Install

```bash
npm install azure-arm-postgresql
```

## How to Use

### Listing servers

```javascript
const msRestAzure = require('ms-rest-azure');
const PostgreSQLManagementClient = require('azure-arm-postgresql');

const subscriptionID = '<subscription id>';
const resourceGroup = '<resource group name>';

msRestAzure.interactiveLogin().then((credentials) => {
  let client = new PostgreSQLManagementClient(credentials, subscriptionID);
  return client.servers.listByResourceGroup(resourceGroup);
}).then((servers) => {
  console.log('List of servers:');
  console.dir(servers, {depth: null, colors: true});
}).catch((err) => {
  console.log('An error ocurred');
  console.dir(err, {depth: null, colors: true});
});
```

### Creating a server

```javascript
const msRestAzure = require('ms-rest-azure');
const PostgreSQLManagementClient = require('azure-arm-postgresql');

const subscriptionID = '<subscription id>';
const resourceGroup = '<resource group name>';
const serverName = '<server name>'; // must be globally unique

msRestAzure.interactiveLogin().then((credentials) => {
  let client = new PostgreSQLManagementClient(credentials, subscriptionID);
  return client.servers.createOrUpdate(resourceGroup, serverName, {
    location: 'eastus',
    properties: {
      createMode: 'Default',
      administratorLogin: 'postgres',
      administratorLoginPassword: 'F00Bar!!'
    }
  });
}).then((server) => {
  console.log('Server:');
  console.dir(server, {depth: null, colors: true});
}).catch((err) => {
  console.log('An error ocurred');
  console.dir(err, {depth: null, colors: true});
});
```

### Listing databases

```javascript
const msRestAzure = require('ms-rest-azure');
const PostgreSQLManagementClient = require('azure-arm-postgresql');

const subscriptionID = '<subscription id>';
const resourceGroup = '<resource group name>';
const serverName = '<server name>';

msRestAzure.interactiveLogin().then((credentials) => {
  let client = new PostgreSQLManagementClient(credentials, subscriptionID);
  return client.databases.listByServer(resourceGroup, serverName);
}).then((databases) => {
  console.log('List of databases:');
  console.dir(databases, {depth: null, colors: true});
}).catch((err) => {
  console.log('An error ocurred');
  console.dir(err, {depth: null, colors: true});
});
```

### Creating a database

```javascript
const msRestAzure = require('ms-rest-azure');
const PostgreSQLManagementClient = require('azure-arm-postgresql');

const subscriptionID = '<subscription id>';
const resourceGroup = '<resource group name>';
const serverName = '<server name>';
const databaseName = '<database name>';

msRestAzure.interactiveLogin().then((credentials) => {
  let client = new PostgreSQLManagementClient(credentials, subscriptionID);
  return client.databases.createOrUpdate(resourceGroup, serverName, databaseName, {});
}).then((database) => {
  console.log('Database:');
  console.dir(database, {depth: null, colors: true});
}).catch((err) => {
  console.log('An error ocurred');
  console.dir(err, {depth: null, colors: true});
});
```

### Deleting a database

```javascript
const msRestAzure = require('ms-rest-azure');
const PostgreSQLManagementClient = require('azure-arm-postgresql');

const subscriptionID = '<subscription id>';
const resourceGroup = '<resource group name>';
const serverName = '<server name>';
const databaseName = '<database name>';

msRestAzure.interactiveLogin().then((credentials) => {
  let client = new PostgreSQLManagementClient(credentials, subscriptionID);
  return client.databases.deleteMethod(resourceGroup, serverName, databaseName);
}).then(() => {
  console.log('Database deleted');
}).catch((err) => {
  console.log('An error ocurred');
  console.dir(err, {depth: null, colors: true});
});
```

### Deleting a server

```javascript
const msRestAzure = require('ms-rest-azure');
const PostgreSQLManagementClient = require('azure-arm-postgresql');

const subscriptionID = '<subscription id>';
const resourceGroup = '<resource group name>';
const serverName = '<server name>';

msRestAzure.interactiveLogin().then((credentials) => {
  let client = new PostgreSQLManagementClient(credentials, subscriptionID);
  return client.servers.deleteMethod(resourceGroup, serverName);
}).then(() => {
  console.log('Server deleted');
}).catch((err) => {
  console.log('An error ocurred');
  console.dir(err, {depth: null, colors: true});
});
```

## Related projects

- [Microsoft Azure SDK for Node.js](https://github.com/Azure/azure-sdk-for-node)


![Impressions](https://azure-sdk-impressions.azurewebsites.net/api/impressions/azure-sdk-for-node%2Flib%2Fservices%2FpostgresqlManagement%2FREADME.png)
