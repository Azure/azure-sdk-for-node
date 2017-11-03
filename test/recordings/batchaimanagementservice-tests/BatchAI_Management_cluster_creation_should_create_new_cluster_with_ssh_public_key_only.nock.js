exports.scopes = [[function (nock) {
var result = 
nock('http://management.azure.com:443')
  .filteringRequestBody(function (path) { return '*';})
.put('/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/nodeTestGroup143/providers/Microsoft.BatchAI/clusters/cluster8?api-version=2017-09-01-preview', '*')
  .reply(202, "", { 'cache-control': 'no-cache',
  pragma: 'no-cache',
  expires: '-1',
  location: 'https://management.azure.com/subscriptions/00000000-0000-0000-0000-000000000000/providers/Microsoft.BatchAI/locations/eastus/operationstatuses/361839d7-5b86-4918-a854-94cf80bf4ae4?api-version=2017-09-01-preview',
  'retry-after': '15',
  'request-id': '7eaa88f1-68a9-4636-8681-546bf80a6d04',
  'strict-transport-security': 'max-age=31536000; includeSubDomains',
  'x-content-type-options': 'nosniff',
  'azure-asyncoperation': 'https://management.azure.com/subscriptions/00000000-0000-0000-0000-000000000000/providers/Microsoft.BatchAI/locations/eastus/operationresults/361839d7-5b86-4918-a854-94cf80bf4ae4?api-version=2017-09-01-preview',
  server: 'Microsoft-HTTPAPI/2.0',
  'x-ms-ratelimit-remaining-subscription-writes': '1199',
  'x-ms-request-id': 'af76d3da-6038-4169-8115-e3c1d461bbdd',
  'x-ms-correlation-request-id': 'af76d3da-6038-4169-8115-e3c1d461bbdd',
  'x-ms-routing-request-id': 'WESTUS2:20171031T180353Z:af76d3da-6038-4169-8115-e3c1d461bbdd',
  date: 'Tue, 31 Oct 2017 18:03:52 GMT',
  connection: 'close',
  'content-length': '0' });
 return result; },
function (nock) { 
var result = 
nock('https://management.azure.com:443')
  .filteringRequestBody(function (path) { return '*';})
.put('/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/nodeTestGroup143/providers/Microsoft.BatchAI/clusters/cluster8?api-version=2017-09-01-preview', '*')
  .reply(202, "", { 'cache-control': 'no-cache',
  pragma: 'no-cache',
  expires: '-1',
  location: 'https://management.azure.com/subscriptions/00000000-0000-0000-0000-000000000000/providers/Microsoft.BatchAI/locations/eastus/operationstatuses/361839d7-5b86-4918-a854-94cf80bf4ae4?api-version=2017-09-01-preview',
  'retry-after': '15',
  'request-id': '7eaa88f1-68a9-4636-8681-546bf80a6d04',
  'strict-transport-security': 'max-age=31536000; includeSubDomains',
  'x-content-type-options': 'nosniff',
  'azure-asyncoperation': 'https://management.azure.com/subscriptions/00000000-0000-0000-0000-000000000000/providers/Microsoft.BatchAI/locations/eastus/operationresults/361839d7-5b86-4918-a854-94cf80bf4ae4?api-version=2017-09-01-preview',
  server: 'Microsoft-HTTPAPI/2.0',
  'x-ms-ratelimit-remaining-subscription-writes': '1199',
  'x-ms-request-id': 'af76d3da-6038-4169-8115-e3c1d461bbdd',
  'x-ms-correlation-request-id': 'af76d3da-6038-4169-8115-e3c1d461bbdd',
  'x-ms-routing-request-id': 'WESTUS2:20171031T180353Z:af76d3da-6038-4169-8115-e3c1d461bbdd',
  date: 'Tue, 31 Oct 2017 18:03:52 GMT',
  connection: 'close',
  'content-length': '0' });
 return result; },
function (nock) { 
var result = 
nock('http://management.azure.com:443')
  .get('/subscriptions/00000000-0000-0000-0000-000000000000/providers/Microsoft.BatchAI/locations/eastus/operationresults/361839d7-5b86-4918-a854-94cf80bf4ae4?api-version=2017-09-01-preview')
  .reply(200, "{\"id\":\"https://management.azure.com/subscriptions/00000000-0000-0000-0000-000000000000/providers/Microsoft.BatchAI/locations/eastus/operationresults/361839d7-5b86-4918-a854-94cf80bf4ae4\",\"name\":\"361839d7-5b86-4918-a854-94cf80bf4ae4\",\"status\":\"Succeeded\",\"startTime\":\"2017-10-31T18:03:51.355Z\",\"endTime\":\"2017-10-31T18:03:51.855Z\",\"properties\":{\"resourceId\":\"00000000-0000-0000-0000-000000000000$nodetestgroup143$cluster8\"}}", { 'cache-control': 'no-cache',
  pragma: 'no-cache',
  'content-length': '423',
  'content-type': 'application/json; charset=utf-8',
  expires: '-1',
  'x-ms-ratelimit-remaining-subscription-reads': '14994',
  'request-id': '9aa99a59-d693-477a-b3f7-01b9d8b1673c',
  'strict-transport-security': 'max-age=31536000; includeSubDomains',
  'x-content-type-options': 'nosniff',
  server: 'Microsoft-HTTPAPI/2.0',
  'x-ms-request-id': '28672e2c-d7a3-4845-ba28-2e7f6089e8a2',
  'x-ms-correlation-request-id': '28672e2c-d7a3-4845-ba28-2e7f6089e8a2',
  'x-ms-routing-request-id': 'WESTUS2:20171031T180423Z:28672e2c-d7a3-4845-ba28-2e7f6089e8a2',
  date: 'Tue, 31 Oct 2017 18:04:23 GMT',
  connection: 'close' });
 return result; },
function (nock) { 
var result = 
nock('https://management.azure.com:443')
  .get('/subscriptions/00000000-0000-0000-0000-000000000000/providers/Microsoft.BatchAI/locations/eastus/operationresults/361839d7-5b86-4918-a854-94cf80bf4ae4?api-version=2017-09-01-preview')
  .reply(200, "{\"id\":\"https://management.azure.com/subscriptions/00000000-0000-0000-0000-000000000000/providers/Microsoft.BatchAI/locations/eastus/operationresults/361839d7-5b86-4918-a854-94cf80bf4ae4\",\"name\":\"361839d7-5b86-4918-a854-94cf80bf4ae4\",\"status\":\"Succeeded\",\"startTime\":\"2017-10-31T18:03:51.355Z\",\"endTime\":\"2017-10-31T18:03:51.855Z\",\"properties\":{\"resourceId\":\"00000000-0000-0000-0000-000000000000$nodetestgroup143$cluster8\"}}", { 'cache-control': 'no-cache',
  pragma: 'no-cache',
  'content-length': '423',
  'content-type': 'application/json; charset=utf-8',
  expires: '-1',
  'x-ms-ratelimit-remaining-subscription-reads': '14994',
  'request-id': '9aa99a59-d693-477a-b3f7-01b9d8b1673c',
  'strict-transport-security': 'max-age=31536000; includeSubDomains',
  'x-content-type-options': 'nosniff',
  server: 'Microsoft-HTTPAPI/2.0',
  'x-ms-request-id': '28672e2c-d7a3-4845-ba28-2e7f6089e8a2',
  'x-ms-correlation-request-id': '28672e2c-d7a3-4845-ba28-2e7f6089e8a2',
  'x-ms-routing-request-id': 'WESTUS2:20171031T180423Z:28672e2c-d7a3-4845-ba28-2e7f6089e8a2',
  date: 'Tue, 31 Oct 2017 18:04:23 GMT',
  connection: 'close' });
 return result; },
function (nock) { 
var result = 
nock('http://management.azure.com:443')
  .get('/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/nodeTestGroup143/providers/Microsoft.BatchAI/clusters/cluster8?api-version=2017-09-01-preview')
  .reply(200, "{\"id\":\"/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/nodetestgroup143/providers/Microsoft.BatchAI/clusters/cluster8\",\"name\":\"cluster8\",\"type\":\"Microsoft.BatchAI/Clusters\",\"location\":\"eastus\",\"properties\":{\"provisioningState\":\"succeeded\",\"allocationState\":\"steady\",\"creationTime\":\"2017-10-31T18:03:51.333Z\",\"allocationStateTransitionTime\":\"2017-10-31T18:03:54.355Z\",\"provisioningStateTransitionTime\":\"2017-10-31T18:03:51.839Z\",\"vmSize\":\"STANDARD_D1\",\"currentNodeCount\":0,\"nodeStateCounts\":{\"runningNodeCount\":0,\"idleNodeCount\":0,\"unusableNodeCount\":0,\"preparingNodeCount\":0,\"leavingNodeCount\":0},\"vmPriority\":\"dedicated\",\"scaleSettings\":{\"manual\":{\"targetNodeCount\":0,\"nodeDeallocationOption\":\"requeue\"}},\"virtualMachineConfiguration\":{\"imageReference\":{\"publisher\":\"Canonical\",\"offer\":\"UbuntuServer\",\"sku\":\"16.04-LTS\",\"version\":\"16.04.201708151\"}},\"userAccountSettings\":{\"adminUserName\":\"username\",\"adminUserSSHPublicKey\":\"ssh-rsa AAAAB3NzaC1yc2EAAAADAQABAAABAQChWiUZgIS8fgKrB4wBBjJjoA4jtyfxWRgnbcz0pNPtplH8cL8TV/AzgE3GdYjbzbKg+dej9iVETS2kwfqDK7CXPljqwluN5S3CnZqeKETqagRQ6/IMuZhttKKVhVRtKIUqJFJeJ2/YtLJzvSE3QnVi+MedrJqC/Gm6A3bhLkIFPlTU3oXfLNz/2iG5ax/FgtNd1ukvMtplNifu4c8Y9iNxjcZR7/vRZUXg3V+hd1fYCJesJC6H3hmiszqjK119slb0ie7qmGB+1+0shs2+aT7wbCuqjKLKXHhOumGfgyPDcdaOm5GPGYeM/LERCi6uOS9bWlZEE3L63QeXeb2aRoOJ has_no_private_key\"}}}", { 'cache-control': 'no-cache',
  pragma: 'no-cache',
  'content-length': '1347',
  'content-type': 'application/json; charset=utf-8',
  expires: '-1',
  'last-modified': 'Tue, 31 Oct 2017 18:03:51 GMT',
  etag: '"0x8D52089BE03F5E2"',
  'x-ms-ratelimit-remaining-subscription-reads': '14995',
  'request-id': 'ac33eb59-65fe-4c5b-8744-425688fb08c4',
  'strict-transport-security': 'max-age=31536000; includeSubDomains',
  'x-content-type-options': 'nosniff',
  server: 'Microsoft-HTTPAPI/2.0',
  'x-ms-request-id': '38bdcfd4-864c-4e27-a2ef-d09cb055ee7d',
  'x-ms-correlation-request-id': '38bdcfd4-864c-4e27-a2ef-d09cb055ee7d',
  'x-ms-routing-request-id': 'WESTUS2:20171031T180424Z:38bdcfd4-864c-4e27-a2ef-d09cb055ee7d',
  date: 'Tue, 31 Oct 2017 18:04:24 GMT',
  connection: 'close' });
 return result; },
function (nock) { 
var result = 
nock('https://management.azure.com:443')
  .get('/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/nodeTestGroup143/providers/Microsoft.BatchAI/clusters/cluster8?api-version=2017-09-01-preview')
  .reply(200, "{\"id\":\"/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/nodetestgroup143/providers/Microsoft.BatchAI/clusters/cluster8\",\"name\":\"cluster8\",\"type\":\"Microsoft.BatchAI/Clusters\",\"location\":\"eastus\",\"properties\":{\"provisioningState\":\"succeeded\",\"allocationState\":\"steady\",\"creationTime\":\"2017-10-31T18:03:51.333Z\",\"allocationStateTransitionTime\":\"2017-10-31T18:03:54.355Z\",\"provisioningStateTransitionTime\":\"2017-10-31T18:03:51.839Z\",\"vmSize\":\"STANDARD_D1\",\"currentNodeCount\":0,\"nodeStateCounts\":{\"runningNodeCount\":0,\"idleNodeCount\":0,\"unusableNodeCount\":0,\"preparingNodeCount\":0,\"leavingNodeCount\":0},\"vmPriority\":\"dedicated\",\"scaleSettings\":{\"manual\":{\"targetNodeCount\":0,\"nodeDeallocationOption\":\"requeue\"}},\"virtualMachineConfiguration\":{\"imageReference\":{\"publisher\":\"Canonical\",\"offer\":\"UbuntuServer\",\"sku\":\"16.04-LTS\",\"version\":\"16.04.201708151\"}},\"userAccountSettings\":{\"adminUserName\":\"username\",\"adminUserSSHPublicKey\":\"ssh-rsa AAAAB3NzaC1yc2EAAAADAQABAAABAQChWiUZgIS8fgKrB4wBBjJjoA4jtyfxWRgnbcz0pNPtplH8cL8TV/AzgE3GdYjbzbKg+dej9iVETS2kwfqDK7CXPljqwluN5S3CnZqeKETqagRQ6/IMuZhttKKVhVRtKIUqJFJeJ2/YtLJzvSE3QnVi+MedrJqC/Gm6A3bhLkIFPlTU3oXfLNz/2iG5ax/FgtNd1ukvMtplNifu4c8Y9iNxjcZR7/vRZUXg3V+hd1fYCJesJC6H3hmiszqjK119slb0ie7qmGB+1+0shs2+aT7wbCuqjKLKXHhOumGfgyPDcdaOm5GPGYeM/LERCi6uOS9bWlZEE3L63QeXeb2aRoOJ has_no_private_key\"}}}", { 'cache-control': 'no-cache',
  pragma: 'no-cache',
  'content-length': '1347',
  'content-type': 'application/json; charset=utf-8',
  expires: '-1',
  'last-modified': 'Tue, 31 Oct 2017 18:03:51 GMT',
  etag: '"0x8D52089BE03F5E2"',
  'x-ms-ratelimit-remaining-subscription-reads': '14995',
  'request-id': 'ac33eb59-65fe-4c5b-8744-425688fb08c4',
  'strict-transport-security': 'max-age=31536000; includeSubDomains',
  'x-content-type-options': 'nosniff',
  server: 'Microsoft-HTTPAPI/2.0',
  'x-ms-request-id': '38bdcfd4-864c-4e27-a2ef-d09cb055ee7d',
  'x-ms-correlation-request-id': '38bdcfd4-864c-4e27-a2ef-d09cb055ee7d',
  'x-ms-routing-request-id': 'WESTUS2:20171031T180424Z:38bdcfd4-864c-4e27-a2ef-d09cb055ee7d',
  date: 'Tue, 31 Oct 2017 18:04:24 GMT',
  connection: 'close' });
 return result; }]];