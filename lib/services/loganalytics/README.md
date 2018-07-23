---
uid: azure-loganalytics
summary: *content

---
# Microsoft Azure SDK for Node.js - LogAnalyticsClient
This project provides a Node.js package for accessing Azure Log Analytics query services.
- **Node.js version 6.x.x or higher**

## How to Install

```bash
npm install azure-loganalytics
```

## How to use

### Authentication, client creation and query execution example.

```javascript
const msrestazure = require('ms-rest-azure');
const LogAnalyticsClient = require('azure-loganalytics');

var options = {
  tokenAudience: 'https://api.loganalytics.io'
}

msrestazure.loginWithServicePrincipalSecret(
  'clientId or appId',
  'secret or password',
  'AAD domain or tenantId',
  options,
  (err, credentials) => {
    if (err) throw err
    // ..use the client instance to access service resources.
    const client = new LogAnalyticsClient(creds);

    const workspaceId = 'ed6078ff-9048-4dd7-9b21-fc39e3fc7249';
    var body = {
      query: 'Heartbeat | getschema',
      timespan: 'P2D'
    };

    client.query(workspaceId, body).then((result) => {
      console.log('The result is:');
      console.log('Columns:')
      console.table(result.tables[0].columns)
      console.log('Rows:')
      console.table(result.tables[0].rows);
    }).catch((err) => {
      console.log('An error occurred:');
      console.dir(err, {depth: null, colors: true});
    });

    // Join additional workspaces in the body
    body = {
      query: 'AzureActivity | getschema',
      workspaces: ['f30c1f56-e33c-418e-b515-9212fa3b7904']
    };

    client.query(workspaceId, body).then((result) => {
      console.log('The result is:');
      console.log('Columns:')
      console.table(result.tables[0].columns)
      console.log('Rows:')
      console.table(result.tables[0].rows);
    }).catch((err) => {
      console.log('An error occurred:');
      console.dir(err, {depth: null, colors: true});
    });
  }
);
```
## Related projects

- [Microsoft Azure SDK for Node.js](https://github.com/Azure/azure-sdk-for-node)
