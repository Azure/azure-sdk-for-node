exports.scopes = [[function (nock) {
var result = 
nock('http://management.azure.com:443')
  .filteringRequestBody(function (path) { return '*';})
.put('/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/nodeTestGroup143/providers/Microsoft.BatchAI/clusters/cluster9?api-version=2017-09-01-preview', '*')
  .reply(202, "", { 'cache-control': 'no-cache',
  pragma: 'no-cache',
  expires: '-1',
  location: 'https://management.azure.com/subscriptions/00000000-0000-0000-0000-000000000000/providers/Microsoft.BatchAI/locations/eastus/operationstatuses/a2c76fa2-809f-4964-9582-33476518dcda?api-version=2017-09-01-preview',
  'retry-after': '15',
  'request-id': '474e2e29-d4f2-4d33-b871-9317bc764cc9',
  'strict-transport-security': 'max-age=31536000; includeSubDomains',
  'x-content-type-options': 'nosniff',
  'azure-asyncoperation': 'https://management.azure.com/subscriptions/00000000-0000-0000-0000-000000000000/providers/Microsoft.BatchAI/locations/eastus/operationresults/a2c76fa2-809f-4964-9582-33476518dcda?api-version=2017-09-01-preview',
  server: 'Microsoft-HTTPAPI/2.0',
  'x-ms-ratelimit-remaining-subscription-writes': '1197',
  'x-ms-request-id': '66701f6b-d46a-42a1-af6b-57bb9bfd9060',
  'x-ms-correlation-request-id': '66701f6b-d46a-42a1-af6b-57bb9bfd9060',
  'x-ms-routing-request-id': 'WESTUS2:20171031T180426Z:66701f6b-d46a-42a1-af6b-57bb9bfd9060',
  date: 'Tue, 31 Oct 2017 18:04:25 GMT',
  connection: 'close',
  'content-length': '0' });
 return result; },
function (nock) { 
var result = 
nock('https://management.azure.com:443')
  .filteringRequestBody(function (path) { return '*';})
.put('/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/nodeTestGroup143/providers/Microsoft.BatchAI/clusters/cluster9?api-version=2017-09-01-preview', '*')
  .reply(202, "", { 'cache-control': 'no-cache',
  pragma: 'no-cache',
  expires: '-1',
  location: 'https://management.azure.com/subscriptions/00000000-0000-0000-0000-000000000000/providers/Microsoft.BatchAI/locations/eastus/operationstatuses/a2c76fa2-809f-4964-9582-33476518dcda?api-version=2017-09-01-preview',
  'retry-after': '15',
  'request-id': '474e2e29-d4f2-4d33-b871-9317bc764cc9',
  'strict-transport-security': 'max-age=31536000; includeSubDomains',
  'x-content-type-options': 'nosniff',
  'azure-asyncoperation': 'https://management.azure.com/subscriptions/00000000-0000-0000-0000-000000000000/providers/Microsoft.BatchAI/locations/eastus/operationresults/a2c76fa2-809f-4964-9582-33476518dcda?api-version=2017-09-01-preview',
  server: 'Microsoft-HTTPAPI/2.0',
  'x-ms-ratelimit-remaining-subscription-writes': '1197',
  'x-ms-request-id': '66701f6b-d46a-42a1-af6b-57bb9bfd9060',
  'x-ms-correlation-request-id': '66701f6b-d46a-42a1-af6b-57bb9bfd9060',
  'x-ms-routing-request-id': 'WESTUS2:20171031T180426Z:66701f6b-d46a-42a1-af6b-57bb9bfd9060',
  date: 'Tue, 31 Oct 2017 18:04:25 GMT',
  connection: 'close',
  'content-length': '0' });
 return result; },
function (nock) { 
var result = 
nock('http://management.azure.com:443')
  .get('/subscriptions/00000000-0000-0000-0000-000000000000/providers/Microsoft.BatchAI/locations/eastus/operationresults/a2c76fa2-809f-4964-9582-33476518dcda?api-version=2017-09-01-preview')
  .reply(200, "{\"id\":\"https://management.azure.com/subscriptions/00000000-0000-0000-0000-000000000000/providers/Microsoft.BatchAI/locations/eastus/operationresults/a2c76fa2-809f-4964-9582-33476518dcda\",\"name\":\"a2c76fa2-809f-4964-9582-33476518dcda\",\"status\":\"Succeeded\",\"startTime\":\"2017-10-31T18:04:24.647Z\",\"endTime\":\"2017-10-31T18:04:25.265Z\",\"properties\":{\"resourceId\":\"00000000-0000-0000-0000-000000000000$nodetestgroup143$cluster9\"}}", { 'cache-control': 'no-cache',
  pragma: 'no-cache',
  'content-length': '423',
  'content-type': 'application/json; charset=utf-8',
  expires: '-1',
  'x-ms-ratelimit-remaining-subscription-reads': '14999',
  'request-id': '00c4e8e9-46c5-4a9a-add1-38a4222667e8',
  'strict-transport-security': 'max-age=31536000; includeSubDomains',
  'x-content-type-options': 'nosniff',
  server: 'Microsoft-HTTPAPI/2.0',
  'x-ms-request-id': '5c95d087-9888-412a-a91a-30a791506542',
  'x-ms-correlation-request-id': '5c95d087-9888-412a-a91a-30a791506542',
  'x-ms-routing-request-id': 'WESTUS2:20171031T180457Z:5c95d087-9888-412a-a91a-30a791506542',
  date: 'Tue, 31 Oct 2017 18:04:56 GMT',
  connection: 'close' });
 return result; },
function (nock) { 
var result = 
nock('https://management.azure.com:443')
  .get('/subscriptions/00000000-0000-0000-0000-000000000000/providers/Microsoft.BatchAI/locations/eastus/operationresults/a2c76fa2-809f-4964-9582-33476518dcda?api-version=2017-09-01-preview')
  .reply(200, "{\"id\":\"https://management.azure.com/subscriptions/00000000-0000-0000-0000-000000000000/providers/Microsoft.BatchAI/locations/eastus/operationresults/a2c76fa2-809f-4964-9582-33476518dcda\",\"name\":\"a2c76fa2-809f-4964-9582-33476518dcda\",\"status\":\"Succeeded\",\"startTime\":\"2017-10-31T18:04:24.647Z\",\"endTime\":\"2017-10-31T18:04:25.265Z\",\"properties\":{\"resourceId\":\"00000000-0000-0000-0000-000000000000$nodetestgroup143$cluster9\"}}", { 'cache-control': 'no-cache',
  pragma: 'no-cache',
  'content-length': '423',
  'content-type': 'application/json; charset=utf-8',
  expires: '-1',
  'x-ms-ratelimit-remaining-subscription-reads': '14999',
  'request-id': '00c4e8e9-46c5-4a9a-add1-38a4222667e8',
  'strict-transport-security': 'max-age=31536000; includeSubDomains',
  'x-content-type-options': 'nosniff',
  server: 'Microsoft-HTTPAPI/2.0',
  'x-ms-request-id': '5c95d087-9888-412a-a91a-30a791506542',
  'x-ms-correlation-request-id': '5c95d087-9888-412a-a91a-30a791506542',
  'x-ms-routing-request-id': 'WESTUS2:20171031T180457Z:5c95d087-9888-412a-a91a-30a791506542',
  date: 'Tue, 31 Oct 2017 18:04:56 GMT',
  connection: 'close' });
 return result; },
function (nock) { 
var result = 
nock('http://management.azure.com:443')
  .get('/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/nodeTestGroup143/providers/Microsoft.BatchAI/clusters/cluster9?api-version=2017-09-01-preview')
  .reply(200, "{\"id\":\"/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/nodetestgroup143/providers/Microsoft.BatchAI/clusters/cluster9\",\"name\":\"cluster9\",\"type\":\"Microsoft.BatchAI/Clusters\",\"location\":\"eastus\",\"properties\":{\"provisioningState\":\"succeeded\",\"allocationState\":\"steady\",\"creationTime\":\"2017-10-31T18:04:24.631Z\",\"allocationStateTransitionTime\":\"2017-10-31T18:04:27.487Z\",\"provisioningStateTransitionTime\":\"2017-10-31T18:04:25.25Z\",\"vmSize\":\"STANDARD_D1\",\"currentNodeCount\":0,\"nodeStateCounts\":{\"runningNodeCount\":0,\"idleNodeCount\":0,\"unusableNodeCount\":0,\"preparingNodeCount\":0,\"leavingNodeCount\":0},\"vmPriority\":\"dedicated\",\"scaleSettings\":{\"autoScale\":{\"minimumNodeCount\":0,\"maximumNodeCount\":10,\"initialNodeCount\":0}},\"virtualMachineConfiguration\":{\"imageReference\":{\"publisher\":\"Canonical\",\"offer\":\"UbuntuServer\",\"sku\":\"16.04-LTS\",\"version\":\"16.04.201708151\"}},\"userAccountSettings\":{\"adminUserName\":\"username\",\"adminUserSSHPublicKey\":\"ssh-rsa AAAAB3NzaC1yc2EAAAADAQABAAABAQChWiUZgIS8fgKrB4wBBjJjoA4jtyfxWRgnbcz0pNPtplH8cL8TV/AzgE3GdYjbzbKg+dej9iVETS2kwfqDK7CXPljqwluN5S3CnZqeKETqagRQ6/IMuZhttKKVhVRtKIUqJFJeJ2/YtLJzvSE3QnVi+MedrJqC/Gm6A3bhLkIFPlTU3oXfLNz/2iG5ax/FgtNd1ukvMtplNifu4c8Y9iNxjcZR7/vRZUXg3V+hd1fYCJesJC6H3hmiszqjK119slb0ie7qmGB+1+0shs2+aT7wbCuqjKLKXHhOumGfgyPDcdaOm5GPGYeM/LERCi6uOS9bWlZEE3L63QeXeb2aRoOJ has_no_private_key\"}}}", { 'cache-control': 'no-cache',
  pragma: 'no-cache',
  'content-length': '1358',
  'content-type': 'application/json; charset=utf-8',
  expires: '-1',
  'last-modified': 'Tue, 31 Oct 2017 18:04:24 GMT',
  etag: '"0x8D52089D1DCE4BF"',
  'x-ms-ratelimit-remaining-subscription-reads': '14997',
  'request-id': '6976f511-6f42-417c-91f0-e8d2583b8b4d',
  'strict-transport-security': 'max-age=31536000; includeSubDomains',
  'x-content-type-options': 'nosniff',
  server: 'Microsoft-HTTPAPI/2.0',
  'x-ms-request-id': 'd5bde1d9-8338-41e5-9fe3-998ace6543eb',
  'x-ms-correlation-request-id': 'd5bde1d9-8338-41e5-9fe3-998ace6543eb',
  'x-ms-routing-request-id': 'WESTUS2:20171031T180458Z:d5bde1d9-8338-41e5-9fe3-998ace6543eb',
  date: 'Tue, 31 Oct 2017 18:04:57 GMT',
  connection: 'close' });
 return result; },
function (nock) { 
var result = 
nock('https://management.azure.com:443')
  .get('/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/nodeTestGroup143/providers/Microsoft.BatchAI/clusters/cluster9?api-version=2017-09-01-preview')
  .reply(200, "{\"id\":\"/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/nodetestgroup143/providers/Microsoft.BatchAI/clusters/cluster9\",\"name\":\"cluster9\",\"type\":\"Microsoft.BatchAI/Clusters\",\"location\":\"eastus\",\"properties\":{\"provisioningState\":\"succeeded\",\"allocationState\":\"steady\",\"creationTime\":\"2017-10-31T18:04:24.631Z\",\"allocationStateTransitionTime\":\"2017-10-31T18:04:27.487Z\",\"provisioningStateTransitionTime\":\"2017-10-31T18:04:25.25Z\",\"vmSize\":\"STANDARD_D1\",\"currentNodeCount\":0,\"nodeStateCounts\":{\"runningNodeCount\":0,\"idleNodeCount\":0,\"unusableNodeCount\":0,\"preparingNodeCount\":0,\"leavingNodeCount\":0},\"vmPriority\":\"dedicated\",\"scaleSettings\":{\"autoScale\":{\"minimumNodeCount\":0,\"maximumNodeCount\":10,\"initialNodeCount\":0}},\"virtualMachineConfiguration\":{\"imageReference\":{\"publisher\":\"Canonical\",\"offer\":\"UbuntuServer\",\"sku\":\"16.04-LTS\",\"version\":\"16.04.201708151\"}},\"userAccountSettings\":{\"adminUserName\":\"username\",\"adminUserSSHPublicKey\":\"ssh-rsa AAAAB3NzaC1yc2EAAAADAQABAAABAQChWiUZgIS8fgKrB4wBBjJjoA4jtyfxWRgnbcz0pNPtplH8cL8TV/AzgE3GdYjbzbKg+dej9iVETS2kwfqDK7CXPljqwluN5S3CnZqeKETqagRQ6/IMuZhttKKVhVRtKIUqJFJeJ2/YtLJzvSE3QnVi+MedrJqC/Gm6A3bhLkIFPlTU3oXfLNz/2iG5ax/FgtNd1ukvMtplNifu4c8Y9iNxjcZR7/vRZUXg3V+hd1fYCJesJC6H3hmiszqjK119slb0ie7qmGB+1+0shs2+aT7wbCuqjKLKXHhOumGfgyPDcdaOm5GPGYeM/LERCi6uOS9bWlZEE3L63QeXeb2aRoOJ has_no_private_key\"}}}", { 'cache-control': 'no-cache',
  pragma: 'no-cache',
  'content-length': '1358',
  'content-type': 'application/json; charset=utf-8',
  expires: '-1',
  'last-modified': 'Tue, 31 Oct 2017 18:04:24 GMT',
  etag: '"0x8D52089D1DCE4BF"',
  'x-ms-ratelimit-remaining-subscription-reads': '14997',
  'request-id': '6976f511-6f42-417c-91f0-e8d2583b8b4d',
  'strict-transport-security': 'max-age=31536000; includeSubDomains',
  'x-content-type-options': 'nosniff',
  server: 'Microsoft-HTTPAPI/2.0',
  'x-ms-request-id': 'd5bde1d9-8338-41e5-9fe3-998ace6543eb',
  'x-ms-correlation-request-id': 'd5bde1d9-8338-41e5-9fe3-998ace6543eb',
  'x-ms-routing-request-id': 'WESTUS2:20171031T180458Z:d5bde1d9-8338-41e5-9fe3-998ace6543eb',
  date: 'Tue, 31 Oct 2017 18:04:57 GMT',
  connection: 'close' });
 return result; }]];