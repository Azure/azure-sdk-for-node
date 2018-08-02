import * as msRest from "ms-rest-js";
import * as msRestAzure from "ms-rest-azure-js";
import * as msRestNodeAuth from "ms-rest-nodeauth";
import { ApplicationInsightsDataClient, ApplicationInsightsDataModels, ApplicationInsightsDataMappers } from "azure-applicationinsights-query";

var options = {
  tokenAudience: 'https://api.applicationinsights.io'
}

msRestNodeAuth.loginWithServicePrincipalSecretWithAuthResponse(
  '997631f8-3a55-4bb2-81b2-c0972b222260',
  'JqpYUbOfQ1cxWZi/nB749xufzfexyTWjJwIMzqrW7To=',
  '72f988bf-86f1-41af-91ab-2d7cd011db47',
  options).then(
  (err, credentials) => {
    if (err) throw err
    // ..use the client instance to access service resources.
    const client = new ApplicationInsightsDataClient.ApplicationInsightsDataClient(credentials);

    const appId = '578f0e27-12e9-4631-bc02-50b965da2633';
    var body = {
      query: 'availabilityResults | getschema',
      timespan: 'P2D'
    };

    client.query.execute(appId, body).then((result) => {
      console.log('The result is:');
      console.log('Columns:')      
      console.log(result.tables[0].rows.length)
      console.log(result.tables[0].columns)
      console.log('Rows:')
      console.log(result.tables[0].rows);
    }).catch((err) => {
      console.log('An error occurred:');
      console.dir(err, {depth: null, colors: true});
    });
  }
);
