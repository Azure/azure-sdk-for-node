// This file has been autogenerated.

exports.setEnvironment = function() {
  process.env['AZURE_SUBSCRIPTION_ID'] = 'e0b81f36-36ba-44f7-b550-7c9344a35893';
};

exports.scopes = [[function (nock) { 
var result = 
nock('http://management.azure.com:443')
  .filteringRequestBody(function (path) { return '*';})
.put('/subscriptions/e0b81f36-36ba-44f7-b550-7c9344a35893/resourceGroups/nodetestrg/providers/Microsoft.EventHub/namespaces/nodetestEH-NS1?api-version=2015-08-01', '*')
  .reply(200, "{\"id\":\"/subscriptions/e0b81f36-36ba-44f7-b550-7c9344a35893/resourceGroups/nodetestrg/providers/Microsoft.EventHub/namespaces/nodetestEH-NS1\",\"name\":\"nodetestEH-NS1\",\"type\":\"Microsoft.EventHub/namespaces\",\"location\":\"East US\",\"kind\":\"EventHub\",\"sku\":{\"name\":\"Standard\",\"tier\":\"Standard\"},\"tags\":null,\"properties\":{\"provisioningState\":\"Unknown\",\"metricId\":\"e0b81f36-36ba-44f7-b550-7c9344a35893:nodetesteh-ns1\",\"enabled\":false,\"namespaceType\":\"EventHub\",\"messagingSku\":2}}", { 'cache-control': 'no-cache',
  pragma: 'no-cache',
  'content-length': '469',
  'content-type': 'application/json; charset=utf-8',
  expires: '-1',
  'x-ms-request-id': 'aa56818b-a6e6-4c7d-9319-b1548bfbb36b_M1_M1',
  'server-sb': 'Service-Bus-Resource-Provider/SN1',
  server: 'Service-Bus-Resource-Provider/SN1',
  'x-ms-ratelimit-remaining-subscription-writes': '1197',
  'x-ms-correlation-request-id': 'e8fcc4ed-ce01-471c-aed3-9bb6344d72da',
  'x-ms-routing-request-id': 'WESTUS:20170502T011230Z:e8fcc4ed-ce01-471c-aed3-9bb6344d72da',
  'strict-transport-security': 'max-age=31536000; includeSubDomains',
  date: 'Tue, 02 May 2017 01:12:30 GMT',
  connection: 'close' });
 return result; },
function (nock) { 
var result = 
nock('https://management.azure.com:443')
  .filteringRequestBody(function (path) { return '*';})
.put('/subscriptions/e0b81f36-36ba-44f7-b550-7c9344a35893/resourceGroups/nodetestrg/providers/Microsoft.EventHub/namespaces/nodetestEH-NS1?api-version=2015-08-01', '*')
  .reply(200, "{\"id\":\"/subscriptions/e0b81f36-36ba-44f7-b550-7c9344a35893/resourceGroups/nodetestrg/providers/Microsoft.EventHub/namespaces/nodetestEH-NS1\",\"name\":\"nodetestEH-NS1\",\"type\":\"Microsoft.EventHub/namespaces\",\"location\":\"East US\",\"kind\":\"EventHub\",\"sku\":{\"name\":\"Standard\",\"tier\":\"Standard\"},\"tags\":null,\"properties\":{\"provisioningState\":\"Unknown\",\"metricId\":\"e0b81f36-36ba-44f7-b550-7c9344a35893:nodetesteh-ns1\",\"enabled\":false,\"namespaceType\":\"EventHub\",\"messagingSku\":2}}", { 'cache-control': 'no-cache',
  pragma: 'no-cache',
  'content-length': '469',
  'content-type': 'application/json; charset=utf-8',
  expires: '-1',
  'x-ms-request-id': 'aa56818b-a6e6-4c7d-9319-b1548bfbb36b_M1_M1',
  'server-sb': 'Service-Bus-Resource-Provider/SN1',
  server: 'Service-Bus-Resource-Provider/SN1',
  'x-ms-ratelimit-remaining-subscription-writes': '1197',
  'x-ms-correlation-request-id': 'e8fcc4ed-ce01-471c-aed3-9bb6344d72da',
  'x-ms-routing-request-id': 'WESTUS:20170502T011230Z:e8fcc4ed-ce01-471c-aed3-9bb6344d72da',
  'strict-transport-security': 'max-age=31536000; includeSubDomains',
  date: 'Tue, 02 May 2017 01:12:30 GMT',
  connection: 'close' });
 return result; },
function (nock) { 
var result = 
nock('http://management.azure.com:443')
  .get('/subscriptions/e0b81f36-36ba-44f7-b550-7c9344a35893/resourceGroups/nodetestrg/providers/Microsoft.EventHub/namespaces/nodetestEH-NS1?api-version=2015-08-01')
  .reply(200, "{\"id\":\"/subscriptions/e0b81f36-36ba-44f7-b550-7c9344a35893/resourceGroups/nodetestrg/providers/Microsoft.EventHub/namespaces/nodetestEH-NS1\",\"name\":\"nodetestEH-NS1\",\"type\":\"Microsoft.EventHub/namespaces\",\"location\":\"East US\",\"kind\":\"EventHub\",\"sku\":{\"name\":\"Standard\",\"tier\":\"Standard\",\"capacity\":1},\"tags\":{},\"properties\":{\"provisioningState\":\"Succeeded\",\"metricId\":\"e0b81f36-36ba-44f7-b550-7c9344a35893:nodetesteh-ns1\",\"status\":\"Active\",\"createdAt\":\"2017-05-02T01:12:31.267Z\",\"serviceBusEndpoint\":\"https://nodetestEH-NS1.servicebus.windows.net:443/\",\"enabled\":true,\"critical\":false,\"scaleUnit\":\"BL3-510\",\"dataCenter\":\"BL3\",\"updatedAt\":\"2017-05-02T01:12:56.203Z\",\"eventHubEnabled\":true,\"namespaceType\":\"EventHub\",\"messagingSku\":2}}", { 'cache-control': 'no-cache',
  pragma: 'no-cache',
  'content-length': '732',
  'content-type': 'application/json; charset=utf-8',
  expires: '-1',
  'x-ms-request-id': '7c768a6a-772d-4757-9497-52ce0c58f03b_M7_M7',
  'server-sb': 'Service-Bus-Resource-Provider/SN1',
  server: 'Service-Bus-Resource-Provider/SN1',
  'x-ms-ratelimit-remaining-subscription-reads': '14944',
  'x-ms-correlation-request-id': '7c472895-69a2-4f2c-8030-d87d42c8a5b0',
  'x-ms-routing-request-id': 'WESTUS:20170502T011301Z:7c472895-69a2-4f2c-8030-d87d42c8a5b0',
  'strict-transport-security': 'max-age=31536000; includeSubDomains',
  date: 'Tue, 02 May 2017 01:13:00 GMT',
  connection: 'close' });
 return result; },
function (nock) { 
var result = 
nock('https://management.azure.com:443')
  .get('/subscriptions/e0b81f36-36ba-44f7-b550-7c9344a35893/resourceGroups/nodetestrg/providers/Microsoft.EventHub/namespaces/nodetestEH-NS1?api-version=2015-08-01')
  .reply(200, "{\"id\":\"/subscriptions/e0b81f36-36ba-44f7-b550-7c9344a35893/resourceGroups/nodetestrg/providers/Microsoft.EventHub/namespaces/nodetestEH-NS1\",\"name\":\"nodetestEH-NS1\",\"type\":\"Microsoft.EventHub/namespaces\",\"location\":\"East US\",\"kind\":\"EventHub\",\"sku\":{\"name\":\"Standard\",\"tier\":\"Standard\",\"capacity\":1},\"tags\":{},\"properties\":{\"provisioningState\":\"Succeeded\",\"metricId\":\"e0b81f36-36ba-44f7-b550-7c9344a35893:nodetesteh-ns1\",\"status\":\"Active\",\"createdAt\":\"2017-05-02T01:12:31.267Z\",\"serviceBusEndpoint\":\"https://nodetestEH-NS1.servicebus.windows.net:443/\",\"enabled\":true,\"critical\":false,\"scaleUnit\":\"BL3-510\",\"dataCenter\":\"BL3\",\"updatedAt\":\"2017-05-02T01:12:56.203Z\",\"eventHubEnabled\":true,\"namespaceType\":\"EventHub\",\"messagingSku\":2}}", { 'cache-control': 'no-cache',
  pragma: 'no-cache',
  'content-length': '732',
  'content-type': 'application/json; charset=utf-8',
  expires: '-1',
  'x-ms-request-id': '7c768a6a-772d-4757-9497-52ce0c58f03b_M7_M7',
  'server-sb': 'Service-Bus-Resource-Provider/SN1',
  server: 'Service-Bus-Resource-Provider/SN1',
  'x-ms-ratelimit-remaining-subscription-reads': '14944',
  'x-ms-correlation-request-id': '7c472895-69a2-4f2c-8030-d87d42c8a5b0',
  'x-ms-routing-request-id': 'WESTUS:20170502T011301Z:7c472895-69a2-4f2c-8030-d87d42c8a5b0',
  'strict-transport-security': 'max-age=31536000; includeSubDomains',
  date: 'Tue, 02 May 2017 01:13:00 GMT',
  connection: 'close' });
 return result; }]];