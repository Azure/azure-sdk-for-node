// This file has been autogenerated.

exports.setEnvironment = function() {
  process.env['AZURE_SUBSCRIPTION_ID'] = 'e0b81f36-36ba-44f7-b550-7c9344a35893';
};

exports.scopes = [[function (nock) { 
var result = 
nock('http://management.azure.com:443')
  .get('/subscriptions/e0b81f36-36ba-44f7-b550-7c9344a35893/resourceGroups/nodetestrg/providers/Microsoft.Devices/IotHubs/nodeTestHub/eventHubEndpoints/events/ConsumerGroups/testconsumergroup?api-version=2017-01-19')
  .reply(200, "{\"tags\":null,\"id\":\"/subscriptions/e0b81f36-36ba-44f7-b550-7c9344a35893/resourceGroups/nodetestrg/providers/Microsoft.Devices/IotHubs/nodeTestHub\",\"name\":\"testconsumergroup\"}", { 'cache-control': 'no-cache',
  pragma: 'no-cache',
  'content-length': '173',
  'content-type': 'application/json; charset=utf-8',
  expires: '-1',
  server: 'Microsoft-HTTPAPI/2.0',
  'x-ms-ratelimit-remaining-subscription-reads': '14943',
  'x-ms-request-id': 'fe8b4ce8-d473-48cc-9533-7f487b6a03c6',
  'x-ms-correlation-request-id': 'fe8b4ce8-d473-48cc-9533-7f487b6a03c6',
  'x-ms-routing-request-id': 'WESTUS:20170502T011942Z:fe8b4ce8-d473-48cc-9533-7f487b6a03c6',
  'strict-transport-security': 'max-age=31536000; includeSubDomains',
  date: 'Tue, 02 May 2017 01:19:41 GMT',
  connection: 'close' });
 return result; },
function (nock) { 
var result = 
nock('https://management.azure.com:443')
  .get('/subscriptions/e0b81f36-36ba-44f7-b550-7c9344a35893/resourceGroups/nodetestrg/providers/Microsoft.Devices/IotHubs/nodeTestHub/eventHubEndpoints/events/ConsumerGroups/testconsumergroup?api-version=2017-01-19')
  .reply(200, "{\"tags\":null,\"id\":\"/subscriptions/e0b81f36-36ba-44f7-b550-7c9344a35893/resourceGroups/nodetestrg/providers/Microsoft.Devices/IotHubs/nodeTestHub\",\"name\":\"testconsumergroup\"}", { 'cache-control': 'no-cache',
  pragma: 'no-cache',
  'content-length': '173',
  'content-type': 'application/json; charset=utf-8',
  expires: '-1',
  server: 'Microsoft-HTTPAPI/2.0',
  'x-ms-ratelimit-remaining-subscription-reads': '14943',
  'x-ms-request-id': 'fe8b4ce8-d473-48cc-9533-7f487b6a03c6',
  'x-ms-correlation-request-id': 'fe8b4ce8-d473-48cc-9533-7f487b6a03c6',
  'x-ms-routing-request-id': 'WESTUS:20170502T011942Z:fe8b4ce8-d473-48cc-9533-7f487b6a03c6',
  'strict-transport-security': 'max-age=31536000; includeSubDomains',
  date: 'Tue, 02 May 2017 01:19:41 GMT',
  connection: 'close' });
 return result; }]];