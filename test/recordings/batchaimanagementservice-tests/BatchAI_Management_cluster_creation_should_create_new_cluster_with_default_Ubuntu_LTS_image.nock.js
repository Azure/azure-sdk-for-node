exports.scopes = [[function (nock) {
var result = 
nock('http://management.azure.com:443')
  .filteringRequestBody(function (path) { return '*';})
.put('/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/nodeTestGroup143/providers/Microsoft.BatchAI/clusters/cluster1?api-version=2017-09-01-preview', '*')
  .reply(202, "", { 'cache-control': 'no-cache',
  pragma: 'no-cache',
  expires: '-1',
  location: 'https://management.azure.com/subscriptions/00000000-0000-0000-0000-000000000000/providers/Microsoft.BatchAI/locations/eastus/operationstatuses/4cf48000-4933-4f24-a55c-9c81e6dfdfe7?api-version=2017-09-01-preview',
  'retry-after': '15',
  'request-id': 'b742d300-928b-4c77-aaad-503de9770623',
  'strict-transport-security': 'max-age=31536000; includeSubDomains',
  'x-content-type-options': 'nosniff',
  'azure-asyncoperation': 'https://management.azure.com/subscriptions/00000000-0000-0000-0000-000000000000/providers/Microsoft.BatchAI/locations/eastus/operationresults/4cf48000-4933-4f24-a55c-9c81e6dfdfe7?api-version=2017-09-01-preview',
  server: 'Microsoft-HTTPAPI/2.0',
  'x-ms-ratelimit-remaining-subscription-writes': '1199',
  'x-ms-request-id': '1e145b69-0de2-4caa-838b-58fd7d0f42be',
  'x-ms-correlation-request-id': '1e145b69-0de2-4caa-838b-58fd7d0f42be',
  'x-ms-routing-request-id': 'WESTUS2:20171031T175750Z:1e145b69-0de2-4caa-838b-58fd7d0f42be',
  date: 'Tue, 31 Oct 2017 17:57:50 GMT',
  connection: 'close',
  'content-length': '0' });
 return result; },
function (nock) { 
var result = 
nock('https://management.azure.com:443')
  .filteringRequestBody(function (path) { return '*';})
.put('/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/nodeTestGroup143/providers/Microsoft.BatchAI/clusters/cluster1?api-version=2017-09-01-preview', '*')
  .reply(202, "", { 'cache-control': 'no-cache',
  pragma: 'no-cache',
  expires: '-1',
  location: 'https://management.azure.com/subscriptions/00000000-0000-0000-0000-000000000000/providers/Microsoft.BatchAI/locations/eastus/operationstatuses/4cf48000-4933-4f24-a55c-9c81e6dfdfe7?api-version=2017-09-01-preview',
  'retry-after': '15',
  'request-id': 'b742d300-928b-4c77-aaad-503de9770623',
  'strict-transport-security': 'max-age=31536000; includeSubDomains',
  'x-content-type-options': 'nosniff',
  'azure-asyncoperation': 'https://management.azure.com/subscriptions/00000000-0000-0000-0000-000000000000/providers/Microsoft.BatchAI/locations/eastus/operationresults/4cf48000-4933-4f24-a55c-9c81e6dfdfe7?api-version=2017-09-01-preview',
  server: 'Microsoft-HTTPAPI/2.0',
  'x-ms-ratelimit-remaining-subscription-writes': '1199',
  'x-ms-request-id': '1e145b69-0de2-4caa-838b-58fd7d0f42be',
  'x-ms-correlation-request-id': '1e145b69-0de2-4caa-838b-58fd7d0f42be',
  'x-ms-routing-request-id': 'WESTUS2:20171031T175750Z:1e145b69-0de2-4caa-838b-58fd7d0f42be',
  date: 'Tue, 31 Oct 2017 17:57:50 GMT',
  connection: 'close',
  'content-length': '0' });
 return result; },
function (nock) { 
var result = 
nock('http://management.azure.com:443')
  .get('/subscriptions/00000000-0000-0000-0000-000000000000/providers/Microsoft.BatchAI/locations/eastus/operationresults/4cf48000-4933-4f24-a55c-9c81e6dfdfe7?api-version=2017-09-01-preview')
  .reply(200, "{\"id\":\"https://management.azure.com/subscriptions/00000000-0000-0000-0000-000000000000/providers/Microsoft.BatchAI/locations/eastus/operationresults/4cf48000-4933-4f24-a55c-9c81e6dfdfe7\",\"name\":\"4cf48000-4933-4f24-a55c-9c81e6dfdfe7\",\"status\":\"Succeeded\",\"startTime\":\"2017-10-31T17:57:49.254Z\",\"endTime\":\"2017-10-31T17:57:50.676Z\",\"properties\":{\"resourceId\":\"00000000-0000-0000-0000-000000000000$nodetestgroup143$cluster1\"}}", { 'cache-control': 'no-cache',
  pragma: 'no-cache',
  'content-length': '423',
  'content-type': 'application/json; charset=utf-8',
  expires: '-1',
  'x-ms-ratelimit-remaining-subscription-reads': '14997',
  'request-id': '6bfa2011-38a8-46d2-9be9-f5bca01fc05b',
  'strict-transport-security': 'max-age=31536000; includeSubDomains',
  'x-content-type-options': 'nosniff',
  server: 'Microsoft-HTTPAPI/2.0',
  'x-ms-request-id': 'd59d9159-d5e0-4feb-894f-5df984332c6a',
  'x-ms-correlation-request-id': 'd59d9159-d5e0-4feb-894f-5df984332c6a',
  'x-ms-routing-request-id': 'WESTUS2:20171031T175821Z:d59d9159-d5e0-4feb-894f-5df984332c6a',
  date: 'Tue, 31 Oct 2017 17:58:21 GMT',
  connection: 'close' });
 return result; },
function (nock) { 
var result = 
nock('https://management.azure.com:443')
  .get('/subscriptions/00000000-0000-0000-0000-000000000000/providers/Microsoft.BatchAI/locations/eastus/operationresults/4cf48000-4933-4f24-a55c-9c81e6dfdfe7?api-version=2017-09-01-preview')
  .reply(200, "{\"id\":\"https://management.azure.com/subscriptions/00000000-0000-0000-0000-000000000000/providers/Microsoft.BatchAI/locations/eastus/operationresults/4cf48000-4933-4f24-a55c-9c81e6dfdfe7\",\"name\":\"4cf48000-4933-4f24-a55c-9c81e6dfdfe7\",\"status\":\"Succeeded\",\"startTime\":\"2017-10-31T17:57:49.254Z\",\"endTime\":\"2017-10-31T17:57:50.676Z\",\"properties\":{\"resourceId\":\"00000000-0000-0000-0000-000000000000$nodetestgroup143$cluster1\"}}", { 'cache-control': 'no-cache',
  pragma: 'no-cache',
  'content-length': '423',
  'content-type': 'application/json; charset=utf-8',
  expires: '-1',
  'x-ms-ratelimit-remaining-subscription-reads': '14997',
  'request-id': '6bfa2011-38a8-46d2-9be9-f5bca01fc05b',
  'strict-transport-security': 'max-age=31536000; includeSubDomains',
  'x-content-type-options': 'nosniff',
  server: 'Microsoft-HTTPAPI/2.0',
  'x-ms-request-id': 'd59d9159-d5e0-4feb-894f-5df984332c6a',
  'x-ms-correlation-request-id': 'd59d9159-d5e0-4feb-894f-5df984332c6a',
  'x-ms-routing-request-id': 'WESTUS2:20171031T175821Z:d59d9159-d5e0-4feb-894f-5df984332c6a',
  date: 'Tue, 31 Oct 2017 17:58:21 GMT',
  connection: 'close' });
 return result; },
function (nock) { 
var result = 
nock('http://management.azure.com:443')
  .get('/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/nodeTestGroup143/providers/Microsoft.BatchAI/clusters/cluster1?api-version=2017-09-01-preview')
  .reply(200, "{\"id\":\"/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/nodetestgroup143/providers/Microsoft.BatchAI/clusters/cluster1\",\"name\":\"cluster1\",\"type\":\"Microsoft.BatchAI/Clusters\",\"location\":\"eastus\",\"properties\":{\"provisioningState\":\"succeeded\",\"allocationState\":\"steady\",\"creationTime\":\"2017-10-31T17:57:49.238Z\",\"allocationStateTransitionTime\":\"2017-10-31T17:57:52.884Z\",\"provisioningStateTransitionTime\":\"2017-10-31T17:57:50.66Z\",\"vmSize\":\"STANDARD_D1\",\"currentNodeCount\":0,\"nodeStateCounts\":{\"runningNodeCount\":0,\"idleNodeCount\":0,\"unusableNodeCount\":0,\"preparingNodeCount\":0,\"leavingNodeCount\":0},\"vmPriority\":\"dedicated\",\"scaleSettings\":{\"manual\":{\"targetNodeCount\":0,\"nodeDeallocationOption\":\"requeue\"}},\"virtualMachineConfiguration\":{\"imageReference\":{\"publisher\":\"Canonical\",\"offer\":\"UbuntuServer\",\"sku\":\"16.04-LTS\",\"version\":\"16.04.201708151\"}},\"userAccountSettings\":{\"adminUserName\":\"username\",\"adminUserSSHPublicKey\":\"ssh-rsa AAAAB3NzaC1yc2EAAAADAQABAAABAQChWiUZgIS8fgKrB4wBBjJjoA4jtyfxWRgnbcz0pNPtplH8cL8TV/AzgE3GdYjbzbKg+dej9iVETS2kwfqDK7CXPljqwluN5S3CnZqeKETqagRQ6/IMuZhttKKVhVRtKIUqJFJeJ2/YtLJzvSE3QnVi+MedrJqC/Gm6A3bhLkIFPlTU3oXfLNz/2iG5ax/FgtNd1ukvMtplNifu4c8Y9iNxjcZR7/vRZUXg3V+hd1fYCJesJC6H3hmiszqjK119slb0ie7qmGB+1+0shs2+aT7wbCuqjKLKXHhOumGfgyPDcdaOm5GPGYeM/LERCi6uOS9bWlZEE3L63QeXeb2aRoOJ has_no_private_key\"}}}", { 'cache-control': 'no-cache',
  pragma: 'no-cache',
  'content-length': '1346',
  'content-type': 'application/json; charset=utf-8',
  expires: '-1',
  'last-modified': 'Tue, 31 Oct 2017 17:57:49 GMT',
  etag: '"0x8D52088E630BE2A"',
  'x-ms-ratelimit-remaining-subscription-reads': '14996',
  'request-id': '043f6b77-f16b-4345-9f5b-6d82edb0f3ae',
  'strict-transport-security': 'max-age=31536000; includeSubDomains',
  'x-content-type-options': 'nosniff',
  server: 'Microsoft-HTTPAPI/2.0',
  'x-ms-request-id': '9715cfa8-91e3-45bf-acc4-e928caca96bd',
  'x-ms-correlation-request-id': '9715cfa8-91e3-45bf-acc4-e928caca96bd',
  'x-ms-routing-request-id': 'WESTUS2:20171031T175822Z:9715cfa8-91e3-45bf-acc4-e928caca96bd',
  date: 'Tue, 31 Oct 2017 17:58:22 GMT',
  connection: 'close' });
 return result; },
function (nock) { 
var result = 
nock('https://management.azure.com:443')
  .get('/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/nodeTestGroup143/providers/Microsoft.BatchAI/clusters/cluster1?api-version=2017-09-01-preview')
  .reply(200, "{\"id\":\"/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/nodetestgroup143/providers/Microsoft.BatchAI/clusters/cluster1\",\"name\":\"cluster1\",\"type\":\"Microsoft.BatchAI/Clusters\",\"location\":\"eastus\",\"properties\":{\"provisioningState\":\"succeeded\",\"allocationState\":\"steady\",\"creationTime\":\"2017-10-31T17:57:49.238Z\",\"allocationStateTransitionTime\":\"2017-10-31T17:57:52.884Z\",\"provisioningStateTransitionTime\":\"2017-10-31T17:57:50.66Z\",\"vmSize\":\"STANDARD_D1\",\"currentNodeCount\":0,\"nodeStateCounts\":{\"runningNodeCount\":0,\"idleNodeCount\":0,\"unusableNodeCount\":0,\"preparingNodeCount\":0,\"leavingNodeCount\":0},\"vmPriority\":\"dedicated\",\"scaleSettings\":{\"manual\":{\"targetNodeCount\":0,\"nodeDeallocationOption\":\"requeue\"}},\"virtualMachineConfiguration\":{\"imageReference\":{\"publisher\":\"Canonical\",\"offer\":\"UbuntuServer\",\"sku\":\"16.04-LTS\",\"version\":\"16.04.201708151\"}},\"userAccountSettings\":{\"adminUserName\":\"username\",\"adminUserSSHPublicKey\":\"ssh-rsa AAAAB3NzaC1yc2EAAAADAQABAAABAQChWiUZgIS8fgKrB4wBBjJjoA4jtyfxWRgnbcz0pNPtplH8cL8TV/AzgE3GdYjbzbKg+dej9iVETS2kwfqDK7CXPljqwluN5S3CnZqeKETqagRQ6/IMuZhttKKVhVRtKIUqJFJeJ2/YtLJzvSE3QnVi+MedrJqC/Gm6A3bhLkIFPlTU3oXfLNz/2iG5ax/FgtNd1ukvMtplNifu4c8Y9iNxjcZR7/vRZUXg3V+hd1fYCJesJC6H3hmiszqjK119slb0ie7qmGB+1+0shs2+aT7wbCuqjKLKXHhOumGfgyPDcdaOm5GPGYeM/LERCi6uOS9bWlZEE3L63QeXeb2aRoOJ has_no_private_key\"}}}", { 'cache-control': 'no-cache',
  pragma: 'no-cache',
  'content-length': '1346',
  'content-type': 'application/json; charset=utf-8',
  expires: '-1',
  'last-modified': 'Tue, 31 Oct 2017 17:57:49 GMT',
  etag: '"0x8D52088E630BE2A"',
  'x-ms-ratelimit-remaining-subscription-reads': '14996',
  'request-id': '043f6b77-f16b-4345-9f5b-6d82edb0f3ae',
  'strict-transport-security': 'max-age=31536000; includeSubDomains',
  'x-content-type-options': 'nosniff',
  server: 'Microsoft-HTTPAPI/2.0',
  'x-ms-request-id': '9715cfa8-91e3-45bf-acc4-e928caca96bd',
  'x-ms-correlation-request-id': '9715cfa8-91e3-45bf-acc4-e928caca96bd',
  'x-ms-routing-request-id': 'WESTUS2:20171031T175822Z:9715cfa8-91e3-45bf-acc4-e928caca96bd',
  date: 'Tue, 31 Oct 2017 17:58:22 GMT',
  connection: 'close' });
 return result; }]];
 exports.randomTestIdsGenerated = function() { return [,'testacc9517'];};