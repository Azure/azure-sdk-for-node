# Windows Azure SDK for Node.js - SQL Database Management

This project provides a Node.js package that makes it easy to manage Windows Azure SQL Database. Right now it supports:
- **Node.js version: 0.6.15 or higher**
- **API version: 2012-03-01**

## Features

- Manage server
- Manage database
- Manage firewall rule
- Manage service objective
- Manage database copy
- Manage database operation
- Manage DAC (dedicated administrator connection)

## How to Install

```bash
npm install azure-mgmt-sql
```

## How to Use

### Authentication

This library support management certificate authentication. To authenticate the library for the REST API calls, you need to
* Have a management certificate set up in your Windows Azure subscription. You can do this by
  * Either uploading a certificate in the [Windows Azure management portal](https://manage.windowsazure.com).
  * Or use the [Windows Azure Xplat-CLI](https://github.com/WindowsAzure/azure-sdk-tools-xplat).
* Obtain the .pem file of your certificate. If you used [Windows Azure Xplat-CLI](https://github.com/WindowsAzure/azure-sdk-tools-xplat) to set it up. You can run ``azure account cert export`` to get the .pem file.
* Open the .pem file in a text editor to get the **cert value** and **key value**.

### Create the SqlManagementClient

```javascript
var fs            = require('fs'),
    sqlManagement = require('azure-mgmt-sql');

var sqlManagementClient = sqlManagement.createSqlManagementClient(sqlManagement.createCertificateCloudCredentials({
  subscriptionId: '<your subscription id>',
  pem: fs.readFileSync('<your pem file>')
}));
```

### Manage Database

```javascript
var sqlDatabaseName = "database01";

// Create a SQL database server.
sqlManagementClient.servers.create({
  administratorUserName: "<your admin user name>",
  administratorPassword: "<your admin password>",
  location: "West US"
}, function (err, result) {
  if (err) {
    console.error(err);
  } else {
    sqlServerName = result.serverName;
    console.info(result);

    // Create a SQL database.
    sqlManagementClient.databases.create(result.serverName, {
      name: sqlDatabaseName,
      edition: common.Constants.SqlAzureConstants.WEB_EDITION,
      collationName: common.Constants.SqlAzureConstants.DEFAULT_COLLATION_NAME,
      maximumDatabaseSizeInGB: common.Constants.SqlAzureConstants.WEB_1GB
    }, function (err, result) {
      if (err) {
        console.error(err);
      } else {
        console.info(result);
      }
    });
  }
});
```

## Related projects

- [Windows Azure SDK for Node.js](https://github.com/WindowsAzure/azure-sdk-for-node)
