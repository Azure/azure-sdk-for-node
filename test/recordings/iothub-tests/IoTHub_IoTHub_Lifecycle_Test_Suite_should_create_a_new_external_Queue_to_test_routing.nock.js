// This file has been autogenerated.

exports.setEnvironment = function() {
  process.env['AZURE_SUBSCRIPTION_ID'] = 'e0b81f36-36ba-44f7-b550-7c9344a35893';
};

exports.scopes = [[function (nock) { 
var result = 
nock('http://management.azure.com:443')
  .filteringRequestBody(function (path) { return '*';})
.put('/subscriptions/e0b81f36-36ba-44f7-b550-7c9344a35893/resourceGroups/nodetestrg/providers/Microsoft.ServiceBus/namespaces/nodetestSB-NS1/queues/nodetestQueue1?api-version=2017-04-01', '*')
  .reply(200, "{\"id\":\"/subscriptions/e0b81f36-36ba-44f7-b550-7c9344a35893/resourceGroups/nodetestrg/providers/Microsoft.ServiceBus/namespaces/nodetestSB-NS1/queues/nodetestQueue1\",\"name\":\"nodetestQueue1\",\"type\":\"Microsoft.ServiceBus/Queues\",\"location\":\"East US\",\"tags\":null,\"properties\":{\"lockDuration\":\"00:01:00\",\"maxSizeInMegabytes\":1024,\"requiresDuplicateDetection\":false,\"requiresSession\":false,\"defaultMessageTimeToLive\":\"10675199.02:48:05.4775807\",\"deadLetteringOnMessageExpiration\":false,\"duplicateDetectionHistoryTimeWindow\":\"00:10:00\",\"maxDeliveryCount\":10,\"enableBatchedOperations\":true,\"sizeInBytes\":0,\"messageCount\":0,\"isAnonymousAccessible\":false,\"status\":\"Active\",\"createdAt\":\"2017-05-02T19:51:36.86Z\",\"updatedAt\":\"2017-05-02T19:51:36.987Z\",\"supportOrdering\":true,\"autoDeleteOnIdle\":\"10675199.02:48:05.4775807\",\"enablePartitioning\":false,\"entityAvailabilityStatus\":\"Available\",\"enableExpress\":false}}", { 'cache-control': 'no-cache',
  pragma: 'no-cache',
  'content-length': '899',
  'content-type': 'application/json; charset=utf-8',
  expires: '-1',
  'x-ms-request-id': 'e55f73d8-3854-4a9f-a6b3-af0347d8f8e1_M4_M4',
  'server-sb': 'Service-Bus-Resource-Provider/SN1',
  server: 'Service-Bus-Resource-Provider/SN1',
  'x-ms-ratelimit-remaining-subscription-writes': '1199',
  'x-ms-correlation-request-id': 'feacc14f-0caf-4dba-b1f4-4bba4321a55f',
  'x-ms-routing-request-id': 'WESTUS:20170502T195135Z:feacc14f-0caf-4dba-b1f4-4bba4321a55f',
  'strict-transport-security': 'max-age=31536000; includeSubDomains',
  date: 'Tue, 02 May 2017 19:51:35 GMT',
  connection: 'close' });
 return result; },
function (nock) { 
var result = 
nock('https://management.azure.com:443')
  .filteringRequestBody(function (path) { return '*';})
.put('/subscriptions/e0b81f36-36ba-44f7-b550-7c9344a35893/resourceGroups/nodetestrg/providers/Microsoft.ServiceBus/namespaces/nodetestSB-NS1/queues/nodetestQueue1?api-version=2017-04-01', '*')
  .reply(200, "{\"id\":\"/subscriptions/e0b81f36-36ba-44f7-b550-7c9344a35893/resourceGroups/nodetestrg/providers/Microsoft.ServiceBus/namespaces/nodetestSB-NS1/queues/nodetestQueue1\",\"name\":\"nodetestQueue1\",\"type\":\"Microsoft.ServiceBus/Queues\",\"location\":\"East US\",\"tags\":null,\"properties\":{\"lockDuration\":\"00:01:00\",\"maxSizeInMegabytes\":1024,\"requiresDuplicateDetection\":false,\"requiresSession\":false,\"defaultMessageTimeToLive\":\"10675199.02:48:05.4775807\",\"deadLetteringOnMessageExpiration\":false,\"duplicateDetectionHistoryTimeWindow\":\"00:10:00\",\"maxDeliveryCount\":10,\"enableBatchedOperations\":true,\"sizeInBytes\":0,\"messageCount\":0,\"isAnonymousAccessible\":false,\"status\":\"Active\",\"createdAt\":\"2017-05-02T19:51:36.86Z\",\"updatedAt\":\"2017-05-02T19:51:36.987Z\",\"supportOrdering\":true,\"autoDeleteOnIdle\":\"10675199.02:48:05.4775807\",\"enablePartitioning\":false,\"entityAvailabilityStatus\":\"Available\",\"enableExpress\":false}}", { 'cache-control': 'no-cache',
  pragma: 'no-cache',
  'content-length': '899',
  'content-type': 'application/json; charset=utf-8',
  expires: '-1',
  'x-ms-request-id': 'e55f73d8-3854-4a9f-a6b3-af0347d8f8e1_M4_M4',
  'server-sb': 'Service-Bus-Resource-Provider/SN1',
  server: 'Service-Bus-Resource-Provider/SN1',
  'x-ms-ratelimit-remaining-subscription-writes': '1199',
  'x-ms-correlation-request-id': 'feacc14f-0caf-4dba-b1f4-4bba4321a55f',
  'x-ms-routing-request-id': 'WESTUS:20170502T195135Z:feacc14f-0caf-4dba-b1f4-4bba4321a55f',
  'strict-transport-security': 'max-age=31536000; includeSubDomains',
  date: 'Tue, 02 May 2017 19:51:35 GMT',
  connection: 'close' });
 return result; }]];