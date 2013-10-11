# Windows Azure SDK for Node.js [![Build Status](https://travis-ci.org/WindowsAzure/azure-sdk-for-node.png?branch=master)](https://travis-ci.org/WindowsAzure/azure-sdk-for-node)

This project provides a Node.js package that makes it easy to access Windows Azure Services like Table Storage, Service Management or Service Bus. 

# Library Features

<table>
  <thead>
    <th>Service Name</th>
    <th>Supported Versions</th>
    <th>Documentation</th>
  </thead>
  <tbody>
    <tr><td>Blob</td><td>2012-02-12</td><td><a href="#link">Documentation</a></td></tr>
    <tr><td>Cloud Services</td><td>2012-10-10</td><td><a href="#link">Documentation</a></td></tr>
    <tr><td>Queue</td><td>2011-08-18</td><td><a href="#link">Documentation</a></td></tr>
    <tr><td>Notification Hubs</td><td>2013-07</td><td><a href="#link">Documentation</a></td></tr>
    <tr><td>Service Bus</td><td>2013-07</td><td><a href="#link">Documentation</a></td></tr>
    <tr><td>SQL Server Management</td><td>2012-10-10</td><td><a href="#link">Documentation</a></td></tr>
    <tr><td>Virtual Machines</td><td>2012-10-10</td><td><a href="#link">Documentation</a></td></tr>
    <tr><td>Table</td><td>2011-08-18</td><td><a href="#link">Documentation</a></td></tr>
    <tr><td>Web Sites</td><td>2012-10-10</td><td><a href="#link">Documentation</a></td></tr>
    <tr><td>Web Sites Deployment</td><td>N/A</td><td><a href="#link">Documentation</a></td></tr>
  </tbody>
</table>

# Getting Started
## Download Source Code

To get the source code of the SDK via **git** just type:

    git clone https://github.com/WindowsAzure/azure-sdk-for-node.git
    cd ./azure-sdk-for-node

## Install the npm package

You can install the azure npm package directly.

    npm install azure

You can use these packages against the cloud Windows Azure Services, or against
the local Storage Emulator (with the exception of Service Bus features).

1. To use the cloud services, you need to first create an account with Windows Azure. To use the storage services, you need to set the AZURE_STORAGE_ACCOUNT and the AZURE_STORAGE_ACCESS_KEY environment variables to the storage account name and primary access key you obtain from the Azure Portal. To use Service Bus, you need to set the AZURE_SERVICEBUS_NAMESPACE and the AZURE_SERVICEBUS_ACCESS_KEY environment variables to the service bus namespace and the default key you obtain from the Azure Portal.
2. To use the Storage Emulator, make sure the latest version of the Windows Azure SDK is installed on the machine, and set the EMULATED environment variable to any value ("true", "1", etc.)

# Usage

To following example shows how to create a table service, and create a table using the SDK:

```Javascript
var tableService = azure.createTableService();
tableService.createTableIfNotExists('tasktable', function(error){
    if(!error){
        // Table exists
    }
});
```

**For more examples please see the [Windows Azure Node.js Developer Center](http://www.windowsazure.com/en-us/develop/nodejs)**

# Need Help?

Be sure to check out the Windows Azure [Developer Forums on Stack Overflow](http://go.microsoft.com/fwlink/?LinkId=234489) if you have trouble with the provided code.

# Contribute Code or Provide Feedback

If you would like to become an active contributor to this project please follow the instructions provided in [Windows Azure Projects Contribution Guidelines](http://windowsazure.github.com/guidelines.html).

If you encounter any bugs with the library please file an issue in the [Issues](https://github.com/WindowsAzure/azure-sdk-for-node/issues) section of the project.

# Learn More

For documentation on how to host Node.js applications on Windows Azure, please see the [Windows Azure Node.js Developer Center](http://www.windowsazure.com/en-us/develop/nodejs/).

For documentation on the Azure cross platform CLI tool for Mac and Linux, please see our readme [here] (http://github.com/windowsazure/azure-sdk-tools-xplat)

Check out our new IRC channel on freenode, node-azure.
