// This file has been autogenerated.

exports.setEnvironment = function() {
  process.env['AZURE_SUBSCRIPTION_ID'] = 'e0b81f36-36ba-44f7-b550-7c9344a35893';
};

exports.scopes = [[function (nock) { 
var result = 
nock('http://management.azure.com:443')
  .filteringRequestBody(function (path) { return '*';})
.put('/subscriptions/e0b81f36-36ba-44f7-b550-7c9344a35893/resourceGroups/nodetestrg/providers/Microsoft.EventHub/namespaces/nodetestEH-NS1/eventhubs/nodetestEH1/authorizationRules/Send?api-version=2015-08-01', '*')
  .reply(200, "{\"id\":\"/subscriptions/e0b81f36-36ba-44f7-b550-7c9344a35893/resourceGroups/nodetestrg/providers/Microsoft.EventHub/namespaces/nodetestEH-NS1/eventhubs/nodetestEH1/authorizationRules/Send\",\"name\":\"Send\",\"type\":\"Microsoft.EventHub/AuthorizationRules\",\"location\":\"East US\",\"tags\":null,\"properties\":{\"rights\":[\"Send\"]}}", { 'cache-control': 'no-cache',
  pragma: 'no-cache',
  'content-length': '314',
  'content-type': 'application/json; charset=utf-8',
  expires: '-1',
  'x-ms-request-id': 'a32e95a0-5665-4839-a922-a65724d28ed6_M3_M3',
  'server-sb': 'Service-Bus-Resource-Provider/SN1',
  server: 'Service-Bus-Resource-Provider/SN1',
  'x-ms-ratelimit-remaining-subscription-writes': '1193',
  'x-ms-correlation-request-id': 'f7dfd58e-2683-4eb4-b065-803b08b6c7d4',
  'x-ms-routing-request-id': 'WESTUS:20170502T011349Z:f7dfd58e-2683-4eb4-b065-803b08b6c7d4',
  'strict-transport-security': 'max-age=31536000; includeSubDomains',
  date: 'Tue, 02 May 2017 01:13:48 GMT',
  connection: 'close' });
 return result; },
function (nock) { 
var result = 
nock('https://management.azure.com:443')
  .filteringRequestBody(function (path) { return '*';})
.put('/subscriptions/e0b81f36-36ba-44f7-b550-7c9344a35893/resourceGroups/nodetestrg/providers/Microsoft.EventHub/namespaces/nodetestEH-NS1/eventhubs/nodetestEH1/authorizationRules/Send?api-version=2015-08-01', '*')
  .reply(200, "{\"id\":\"/subscriptions/e0b81f36-36ba-44f7-b550-7c9344a35893/resourceGroups/nodetestrg/providers/Microsoft.EventHub/namespaces/nodetestEH-NS1/eventhubs/nodetestEH1/authorizationRules/Send\",\"name\":\"Send\",\"type\":\"Microsoft.EventHub/AuthorizationRules\",\"location\":\"East US\",\"tags\":null,\"properties\":{\"rights\":[\"Send\"]}}", { 'cache-control': 'no-cache',
  pragma: 'no-cache',
  'content-length': '314',
  'content-type': 'application/json; charset=utf-8',
  expires: '-1',
  'x-ms-request-id': 'a32e95a0-5665-4839-a922-a65724d28ed6_M3_M3',
  'server-sb': 'Service-Bus-Resource-Provider/SN1',
  server: 'Service-Bus-Resource-Provider/SN1',
  'x-ms-ratelimit-remaining-subscription-writes': '1193',
  'x-ms-correlation-request-id': 'f7dfd58e-2683-4eb4-b065-803b08b6c7d4',
  'x-ms-routing-request-id': 'WESTUS:20170502T011349Z:f7dfd58e-2683-4eb4-b065-803b08b6c7d4',
  'strict-transport-security': 'max-age=31536000; includeSubDomains',
  date: 'Tue, 02 May 2017 01:13:48 GMT',
  connection: 'close' });
 return result; }]];