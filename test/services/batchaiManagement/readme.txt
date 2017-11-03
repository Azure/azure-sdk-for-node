Test Configuration Instructions
================================


In Live Mode
-------------

- First create a Service Principal for the subscription you wish to test against.
  Follow the instructions here on creating a Service Principal using the Azure CLI:
  https://github.com/Azure/azure-sdk-for-node/blob/master/Documentation/Authentication.md

- Once the Service Principal is configured, set the following env variables.

    AZURE_SUBSCRIPTION_ID:  Azure subscription GUID
    CLIENT_ID: The Service Principal Application ID
    APPLICATION_SECRET: The password configured for the AAD Application
    DOMAIN: Tenant (e.g. microsoft.com)
    NOCK_OFF: Set to true
    
- The tests are configured by default to run with in eastus, using a resource group of
  'default-azurebatch-japaneast'. To change this location set:
    
    AZURE_TEST_LOCATION: Location name
    
- The tests require a storage account to be configured. Using the CLI:
    First, make sure the subscription is registered with Microsoft.Storage:
    >> azure provider register -s <subscription id> -n Microsoft.Storage
    
    Next, create a storage account:
    >> azure storage account create -l <location> -g <resource group> --type LRS -s <subscription id> <storage account name>
    
   The tests have been configured against a <storage account name> of nodesdkteststorage. If you have set up
   a different name, then set:
   
    AZURE_AUTOSTORAGE: Your storage account name
   

In Capture Mode
---------------

- The same auth configuration as above.
- set NOCK_OFF to <blank>
- set AZURE_NOCK_RECORD to true
- When in capture mode, the recording configuration (Subscription, location, storage account name),
  should be automatically updated in records/batchManagement/suite.batchmanagementservice-tests.nock.js


In Replay Mode
---------------

- set NOCK_OFF to <blank>
- set AZURE_NOCK_RECORD to <blank>
