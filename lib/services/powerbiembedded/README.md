# Microsoft Azure SDK for Node.js - Power BI Embedded

This project provides a Node.js package for managing Azure Power BI Embedded.

## Features
- Manage Power BI Embedded:
  1. Create new Workspace Collection
  2. Get workspace collections by subscription
  3. Get workspace collections by resource group
  4. Get workspace collection by resource group & name
  5. Get access keys for workspace collection
  6. Regenerate access key for workspace collection
  7. Get workspaces within workspace collection

## How to Install
```bash
npm install azure-arm-powerbiembedded
```

## How to Use

### Initialize the client managing Power BI

```javascript
var msRestAzure = require('ms-rest-azure');
var PowerBIEmbeddedManagementClient = require('azure-arm-powerbiembedded');
  
// Create an Power BI Embedded Client
var subscriptionId = '<subscription-id>';
var credentials = new msRestAzure.UserTokenCredentials('your-client-id', 'your-domain', 'your-username', 'your-password', 'your-redirect-uri');
var client = new PowerBIEmbeddedManagementClient(credentials, subscriptionId);
```

### Create new Workspace Collection
```javascript
const creationOptions = {
  location: "southcentral",
  tags: {
    key1: 'value1',
    key2: 'value2'
  },
  sku: {
    name: "S1",
    teir: "Standard"
  }
};

client.workspaceCollections.create(resourceGroupName, workspaceCollectionName, creationOptions, (error, result, request, response) => {
  ...
});
```
`workspaceCollection`:
```javascript
{
  id: "...",
  name: "...",
  type: "...",
  location: "...",
  tags: { ... },
  sku: {
    name: "S1",
    teir: "Standard"
  },
  properties: {
    ...
  }
}
```

### Update Workspace Collection
```javascript
const updateBody = {
  tags: {
    newTag: 'newValue',
    removeTag: ''
  }
};

client.workspaceCollections.update(resourceGroupName, workspaceCollectionName, updateBody, (error, result, request, response) => {
  ...
});
```

### Delete Workspace Collection
```javascript
client.workspaceCollections.deleteMethod(resourceGroupName, workspaceCollectionName, (error, result, request, response) => {
  ...
});
```

### Get workspace collections by subscription
```javascript
client.workspaceCollections.listBySubscription((error, result, request, response) => {
  ...
});
```

### Get workspace collections by resource group
```javascript
client.workspaceCollections.listByResourceGroup(resourceGroupName, (error, result, request, response) => {
  ...
});
```

### Get workspace collection by resource group & workspace collection name
```javascript
client.workspaceCollections.getByName(resourceGroupName, workspaceCollectionName, (error, result, request, response) => {
  ...
});
```

### Get access keys for workspace collection
```javascript
client.workspaceCollections.getAccessKeys(resourceGroupName, workspaceCollectionName, (error, result, request, response) => {
  ...
});
```
`accessKeys`:
```javascript
{
  key1: "...",
  key2: "..."
}
```

### Regenerate access key for workspace collection
```javascript
const body = {
  keyName: "key1"
};

client.workspaceCollections.regenerateKey(resourceGroupName, workspaceCollectionName, body, (error, result, request, response) => {
  ...
});
```
`accessKeys`:
```javascript
{
  key1: "...", // Regenerated
  key2: "..."
}
```

### Get workspaces within workspace collection
```javascript
client.workspaces.list(resourceGroupName, workspaceCollectionName, (error, result, request, response) => {
  ...
});
```
`workspaces`:
```javascript
[
  {
    id: "...",
    name: "...",
    type: "...",
    properties: { ... }
  },
  {
    id: "...",
    name: "...",
    type: "...",
    properties: { ... }
  },
  ...
]
```

## Related projects

- [Microsoft Azure SDK for Node.js](https://github.com/Azure/azure-sdk-for-node)
- [AutoRest](https://github.com/Azure/autorest)