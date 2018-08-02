# Microsoft Azure SDK for isomorphic javascript - ApplicationInsightsDataClient
This project provides an isomorphic javascript package for accessing Azure. Right now it supports:
- node.js version 6.x.x or higher
- browser javascript

## How to Install

- nodejs
```
npm install azure-applicationinsights-query
```
- browser
```html
<script type="text/javascript" src="https://raw.githubusercontent.com/Azure/azure-sdk-for-js/master/lib/services/azure-applicationinsights-query/applicationInsightsDataClientBundle.js"></script>
```

## How to use

### nodejs - Authentication, client creation and get metrics as an example written in TypeScript.

```javascript
import * as msRest from "ms-rest-js";
import * as msRestAzure from "ms-rest-azure-js";
import * as msRestNodeAuth from "ms-rest-nodeauth";
import { ApplicationInsightsDataClient, ApplicationInsightsDataModels, ApplicationInsightsDataMappers } from "azure-applicationinsights-query";
const subscriptionId = process.env["AZURE_SUBSCRIPTION_ID"];

msRestNodeAuth.interactiveLogin().then((creds) => {
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
  });
}).catch((err) => {
  console.log('An error ocurred:');
  console.dir(err, {depth: null, colors: true});
});
```

### browser - Authentication, client creation and get metrics as an example written in javascript.

- index.html
```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <title>My Todos</title>
    <script type="text/javascript" src="https://raw.githubusercontent.com/Azure/ms-rest-js/master/msRestBundle.js"></script>
    <script type="text/javascript" src="https://raw.githubusercontent.com/Azure/ms-rest-js/master/msRestAzureBundle.js"></script>
    <script type="text/javascript" src="https://raw.githubusercontent.com/Azure/azure-sdk-for-js/master/lib/services/azure-applicationinsights-query/applicationInsightsDataClientBundle.js"></script>
    <script type="text/javascript">
      document.write('hello world');
      const subscriptionId = "<Subscription_Id>";
      const token = "<access_token>";
      const creds = new msRest.TokenCredentials(token);
      const client = new ApplicationInsightsDataClient(creds, undefined, subscriptionId);
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
        console.log('An error ocurred:');
        console.dir(err, { depth: null, colors: true});
      });
    </script>
  </head>
  <body>
  </body>
</html>
```

# Related projects
 - [Microsoft Azure SDK for Javascript](https://github.com/Azure/azure-sdk-for-js)
