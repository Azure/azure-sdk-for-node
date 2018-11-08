---
uid: azure-applicationinsights-query
summary: *content

---
# Microsoft Azure SDK for Node.js - ApplicationInsightsDataClient
This project provides a Node.js package for accessing Azure. Right now it supports:
- **Node.js version 6.x.x or higher**

## Features


## How to Install

```bash
npm install azure-applicationinsights-query
```

## How to use

### Authentication, client creation and get metrics as an example.

```javascript
const msRest = require("ms-rest");
const ApplicationInsightsDataClient = require("azure-applicationinsights-query");
const token = "<access_token>";
const creds = new msRest.TokenCredentials(token);
const subscriptionId = "<Subscription_Id>";
const client = new ApplicationInsightsDataClient(creds, subscriptionId);
const appId = "testappId";
const metricId = "requests/count";
const timespan = "testtimespan";
const interval = "P1Y2M3DT4H5M6S";
const aggregation = ["min"];
const segment = ["applicationBuild"];
const top = 1;
const orderby = "testorderby";
const filter = "testfilter";
client.metrics.get(appId, metricId, timespan, interval, aggregation, segment, top, orderby, filter).then((result) => {
  console.log("The result is:");
  console.log(result);
}).catch((err) => {
  console.log('An error occurred:');
  console.dir(err, {depth: null, colors: true});
});

## Related projects

- [Microsoft Azure SDK for Node.js](https://github.com/Azure/azure-sdk-for-node)
