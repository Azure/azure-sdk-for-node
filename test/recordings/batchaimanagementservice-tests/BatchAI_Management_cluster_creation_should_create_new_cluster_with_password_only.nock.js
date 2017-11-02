exports.scopes = [[function (nock) {
var result = 
nock('http://management.azure.com:443')
  .filteringRequestBody(function (path) { return '*';})
.put('/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/nodeTestGroup143/providers/Microsoft.BatchAI/clusters/cluster7?api-version=2017-09-01-preview', '*')
  .reply(202, "", { 'cache-control': 'no-cache',
  pragma: 'no-cache',
  expires: '-1',
  location: 'https://management.azure.com/subscriptions/00000000-0000-0000-0000-000000000000/providers/Microsoft.BatchAI/locations/eastus/operationstatuses/9d61c6a2-7d31-4e77-af55-b7b4c04f8c41?api-version=2017-09-01-preview',
  'retry-after': '15',
  'request-id': 'c9c2c763-3f30-4e9d-a6f7-ac04289654e2',
  'strict-transport-security': 'max-age=31536000; includeSubDomains',
  'x-content-type-options': 'nosniff',
  'azure-asyncoperation': 'https://management.azure.com/subscriptions/00000000-0000-0000-0000-000000000000/providers/Microsoft.BatchAI/locations/eastus/operationresults/9d61c6a2-7d31-4e77-af55-b7b4c04f8c41?api-version=2017-09-01-preview',
  server: 'Microsoft-HTTPAPI/2.0',
  'x-ms-ratelimit-remaining-subscription-writes': '1196',
  'x-ms-request-id': 'c91758e5-af13-495e-b9de-dbe5ca59015f',
  'x-ms-correlation-request-id': 'c91758e5-af13-495e-b9de-dbe5ca59015f',
  'x-ms-routing-request-id': 'WESTUS2:20171031T180319Z:c91758e5-af13-495e-b9de-dbe5ca59015f',
  date: 'Tue, 31 Oct 2017 18:03:19 GMT',
  connection: 'close',
  'content-length': '0' });
 return result; },
function (nock) { 
var result = 
nock('https://management.azure.com:443')
  .filteringRequestBody(function (path) { return '*';})
.put('/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/nodeTestGroup143/providers/Microsoft.BatchAI/clusters/cluster7?api-version=2017-09-01-preview', '*')
  .reply(202, "", { 'cache-control': 'no-cache',
  pragma: 'no-cache',
  expires: '-1',
  location: 'https://management.azure.com/subscriptions/00000000-0000-0000-0000-000000000000/providers/Microsoft.BatchAI/locations/eastus/operationstatuses/9d61c6a2-7d31-4e77-af55-b7b4c04f8c41?api-version=2017-09-01-preview',
  'retry-after': '15',
  'request-id': 'c9c2c763-3f30-4e9d-a6f7-ac04289654e2',
  'strict-transport-security': 'max-age=31536000; includeSubDomains',
  'x-content-type-options': 'nosniff',
  'azure-asyncoperation': 'https://management.azure.com/subscriptions/00000000-0000-0000-0000-000000000000/providers/Microsoft.BatchAI/locations/eastus/operationresults/9d61c6a2-7d31-4e77-af55-b7b4c04f8c41?api-version=2017-09-01-preview',
  server: 'Microsoft-HTTPAPI/2.0',
  'x-ms-ratelimit-remaining-subscription-writes': '1196',
  'x-ms-request-id': 'c91758e5-af13-495e-b9de-dbe5ca59015f',
  'x-ms-correlation-request-id': 'c91758e5-af13-495e-b9de-dbe5ca59015f',
  'x-ms-routing-request-id': 'WESTUS2:20171031T180319Z:c91758e5-af13-495e-b9de-dbe5ca59015f',
  date: 'Tue, 31 Oct 2017 18:03:19 GMT',
  connection: 'close',
  'content-length': '0' });
 return result; },
function (nock) { 
var result = 
nock('http://management.azure.com:443')
  .get('/subscriptions/00000000-0000-0000-0000-000000000000/providers/Microsoft.BatchAI/locations/eastus/operationresults/9d61c6a2-7d31-4e77-af55-b7b4c04f8c41?api-version=2017-09-01-preview')
  .reply(200, "{\"id\":\"https://management.azure.com/subscriptions/00000000-0000-0000-0000-000000000000/providers/Microsoft.BatchAI/locations/eastus/operationresults/9d61c6a2-7d31-4e77-af55-b7b4c04f8c41\",\"name\":\"9d61c6a2-7d31-4e77-af55-b7b4c04f8c41\",\"status\":\"Succeeded\",\"startTime\":\"2017-10-31T18:03:17.983Z\",\"endTime\":\"2017-10-31T18:03:18.436Z\",\"properties\":{\"resourceId\":\"00000000-0000-0000-0000-000000000000$nodetestgroup143$cluster7\"}}", { 'cache-control': 'no-cache',
  pragma: 'no-cache',
  'content-length': '423',
  'content-type': 'application/json; charset=utf-8',
  expires: '-1',
  'x-ms-ratelimit-remaining-subscription-reads': '14996',
  'request-id': 'd8e575b0-d515-4bbc-af48-bb3c1d20562e',
  'strict-transport-security': 'max-age=31536000; includeSubDomains',
  'x-content-type-options': 'nosniff',
  server: 'Microsoft-HTTPAPI/2.0',
  'x-ms-request-id': 'd3b928c2-4f32-4088-9144-b7aa82a1c243',
  'x-ms-correlation-request-id': 'd3b928c2-4f32-4088-9144-b7aa82a1c243',
  'x-ms-routing-request-id': 'WESTUS2:20171031T180350Z:d3b928c2-4f32-4088-9144-b7aa82a1c243',
  date: 'Tue, 31 Oct 2017 18:03:49 GMT',
  connection: 'close' });
 return result; },
function (nock) { 
var result = 
nock('https://management.azure.com:443')
  .get('/subscriptions/00000000-0000-0000-0000-000000000000/providers/Microsoft.BatchAI/locations/eastus/operationresults/9d61c6a2-7d31-4e77-af55-b7b4c04f8c41?api-version=2017-09-01-preview')
  .reply(200, "{\"id\":\"https://management.azure.com/subscriptions/00000000-0000-0000-0000-000000000000/providers/Microsoft.BatchAI/locations/eastus/operationresults/9d61c6a2-7d31-4e77-af55-b7b4c04f8c41\",\"name\":\"9d61c6a2-7d31-4e77-af55-b7b4c04f8c41\",\"status\":\"Succeeded\",\"startTime\":\"2017-10-31T18:03:17.983Z\",\"endTime\":\"2017-10-31T18:03:18.436Z\",\"properties\":{\"resourceId\":\"00000000-0000-0000-0000-000000000000$nodetestgroup143$cluster7\"}}", { 'cache-control': 'no-cache',
  pragma: 'no-cache',
  'content-length': '423',
  'content-type': 'application/json; charset=utf-8',
  expires: '-1',
  'x-ms-ratelimit-remaining-subscription-reads': '14996',
  'request-id': 'd8e575b0-d515-4bbc-af48-bb3c1d20562e',
  'strict-transport-security': 'max-age=31536000; includeSubDomains',
  'x-content-type-options': 'nosniff',
  server: 'Microsoft-HTTPAPI/2.0',
  'x-ms-request-id': 'd3b928c2-4f32-4088-9144-b7aa82a1c243',
  'x-ms-correlation-request-id': 'd3b928c2-4f32-4088-9144-b7aa82a1c243',
  'x-ms-routing-request-id': 'WESTUS2:20171031T180350Z:d3b928c2-4f32-4088-9144-b7aa82a1c243',
  date: 'Tue, 31 Oct 2017 18:03:49 GMT',
  connection: 'close' });
 return result; },
function (nock) { 
var result = 
nock('http://management.azure.com:443')
  .get('/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/nodeTestGroup143/providers/Microsoft.BatchAI/clusters/cluster7?api-version=2017-09-01-preview')
  .reply(200, "{\"id\":\"/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/nodetestgroup143/providers/Microsoft.BatchAI/clusters/cluster7\",\"name\":\"cluster7\",\"type\":\"Microsoft.BatchAI/Clusters\",\"location\":\"eastus\",\"properties\":{\"provisioningState\":\"succeeded\",\"allocationState\":\"steady\",\"creationTime\":\"2017-10-31T18:03:17.967Z\",\"allocationStateTransitionTime\":\"2017-10-31T18:03:20.85Z\",\"provisioningStateTransitionTime\":\"2017-10-31T18:03:18.405Z\",\"vmSize\":\"STANDARD_D1\",\"currentNodeCount\":0,\"nodeStateCounts\":{\"runningNodeCount\":0,\"idleNodeCount\":0,\"unusableNodeCount\":0,\"preparingNodeCount\":0,\"leavingNodeCount\":0},\"vmPriority\":\"dedicated\",\"scaleSettings\":{\"manual\":{\"targetNodeCount\":0,\"nodeDeallocationOption\":\"requeue\"}},\"virtualMachineConfiguration\":{\"imageReference\":{\"publisher\":\"Canonical\",\"offer\":\"UbuntuServer\",\"sku\":\"16.04-LTS\",\"version\":\"16.04.201708151\"}},\"userAccountSettings\":{\"adminUserName\":\"username\"}}}", { 'cache-control': 'no-cache',
  pragma: 'no-cache',
  'content-length': '920',
  'content-type': 'application/json; charset=utf-8',
  expires: '-1',
  'last-modified': 'Tue, 31 Oct 2017 18:03:17 GMT',
  etag: '"0x8D52089AA20C97B"',
  'x-ms-ratelimit-remaining-subscription-reads': '14873',
  'request-id': '9810a742-d086-47d4-a16c-3b59ef832a54',
  'strict-transport-security': 'max-age=31536000; includeSubDomains',
  'x-content-type-options': 'nosniff',
  server: 'Microsoft-HTTPAPI/2.0',
  'x-ms-request-id': 'fd6e483a-c36f-4b7c-ab88-e0f04c22d429',
  'x-ms-correlation-request-id': 'fd6e483a-c36f-4b7c-ab88-e0f04c22d429',
  'x-ms-routing-request-id': 'WESTUS2:20171031T180351Z:fd6e483a-c36f-4b7c-ab88-e0f04c22d429',
  date: 'Tue, 31 Oct 2017 18:03:51 GMT',
  connection: 'close' });
 return result; },
function (nock) { 
var result = 
nock('https://management.azure.com:443')
  .get('/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/nodeTestGroup143/providers/Microsoft.BatchAI/clusters/cluster7?api-version=2017-09-01-preview')
  .reply(200, "{\"id\":\"/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/nodetestgroup143/providers/Microsoft.BatchAI/clusters/cluster7\",\"name\":\"cluster7\",\"type\":\"Microsoft.BatchAI/Clusters\",\"location\":\"eastus\",\"properties\":{\"provisioningState\":\"succeeded\",\"allocationState\":\"steady\",\"creationTime\":\"2017-10-31T18:03:17.967Z\",\"allocationStateTransitionTime\":\"2017-10-31T18:03:20.85Z\",\"provisioningStateTransitionTime\":\"2017-10-31T18:03:18.405Z\",\"vmSize\":\"STANDARD_D1\",\"currentNodeCount\":0,\"nodeStateCounts\":{\"runningNodeCount\":0,\"idleNodeCount\":0,\"unusableNodeCount\":0,\"preparingNodeCount\":0,\"leavingNodeCount\":0},\"vmPriority\":\"dedicated\",\"scaleSettings\":{\"manual\":{\"targetNodeCount\":0,\"nodeDeallocationOption\":\"requeue\"}},\"virtualMachineConfiguration\":{\"imageReference\":{\"publisher\":\"Canonical\",\"offer\":\"UbuntuServer\",\"sku\":\"16.04-LTS\",\"version\":\"16.04.201708151\"}},\"userAccountSettings\":{\"adminUserName\":\"username\"}}}", { 'cache-control': 'no-cache',
  pragma: 'no-cache',
  'content-length': '920',
  'content-type': 'application/json; charset=utf-8',
  expires: '-1',
  'last-modified': 'Tue, 31 Oct 2017 18:03:17 GMT',
  etag: '"0x8D52089AA20C97B"',
  'x-ms-ratelimit-remaining-subscription-reads': '14873',
  'request-id': '9810a742-d086-47d4-a16c-3b59ef832a54',
  'strict-transport-security': 'max-age=31536000; includeSubDomains',
  'x-content-type-options': 'nosniff',
  server: 'Microsoft-HTTPAPI/2.0',
  'x-ms-request-id': 'fd6e483a-c36f-4b7c-ab88-e0f04c22d429',
  'x-ms-correlation-request-id': 'fd6e483a-c36f-4b7c-ab88-e0f04c22d429',
  'x-ms-routing-request-id': 'WESTUS2:20171031T180351Z:fd6e483a-c36f-4b7c-ab88-e0f04c22d429',
  date: 'Tue, 31 Oct 2017 18:03:51 GMT',
  connection: 'close' });
 return result; }]];