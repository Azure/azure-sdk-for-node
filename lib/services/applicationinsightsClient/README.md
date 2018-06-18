---
uid: azure-applicationinsights
summary: *content

---
# Microsoft Azure SDK for Node.js - ApplicationInsightsDataClient
This project provides a Node.js package for accessing Azure. Right now it supports:
- **Node.js version 6.x.x or higher**

## Features


## How to Install

```bash
npm install azure-applicationinsights
```

## How to use

### Authentication, client creation and query execute as an example.

```javascript
const msrestazure = require('ms-rest-azure');
const ApplicationInsightsDataClient = require('azure-applicationinsights');

var options = {
  tokenAudience: 'https://api.applicationinsights.io'
}

msrestazure.loginWithServicePrincipalSecret(
  'clientId or appId',
  'secret or password',
  'AAD domain or tenantId',
  options,
  (err, credentials) => {
    if (err) throw err
    // ..use the client instance to access service resources.
    const client = new ApplicationInsightsDataClient(credentials);

    const appId = 'ed6078ff-9048-4dd7-9b21-fc39e3fc7249';
    var body = {
      query: 'availabilityResults | summarize count() by name, location, duration | order by duration desc | take 10',
      timespan: 'P2D'
    };

    client.query.execute(appId, body).then((result, err) => {
      console.log('The result is:');
      console.log('Columns:')
      console.log(result.tables[0].columns)
      console.log('Rows:')
      console.log(result.tables[0].rows);
    }).catch((err) => {
      console.log('An error occurred:');
      console.dir(err, {depth: null, colors: true});
    });
  }
);
```

## Related projects

- [Microsoft Azure SDK for Node.js - ApplicationInsightsDataClient](#microsoft-azure-sdk-for-nodejs---applicationinsightsdataclient)
  - [Features](#features)
  - [How to Install](#how-to-install)
  - [How to use](#how-to-use)
    - [Authentication, client creation and query execute as an example.](#authentication--client-creation-and-query-execute-as-an-example)
  - [Related projects](#related-projects)
