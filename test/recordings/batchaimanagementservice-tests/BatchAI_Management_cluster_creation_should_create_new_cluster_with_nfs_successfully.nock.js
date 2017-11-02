exports.scopes = [[function (nock) {
var result = 
nock('http://management.azure.com:443')
  .filteringRequestBody(function (path) { return '*';})
.put('/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/nodeTestGroup143/providers/Microsoft.BatchAI/clusters/cluster4?api-version=2017-09-01-preview', '*')
  .reply(202, "", { 'cache-control': 'no-cache',
  pragma: 'no-cache',
  expires: '-1',
  location: 'https://management.azure.com/subscriptions/00000000-0000-0000-0000-000000000000/providers/Microsoft.BatchAI/locations/eastus/operationstatuses/5b4adcee-a0ae-43a2-bd6e-d331d1a7d88a?api-version=2017-09-01-preview',
  'retry-after': '15',
  'request-id': '67184508-2b45-474f-b63f-cc385e5b442c',
  'strict-transport-security': 'max-age=31536000; includeSubDomains',
  'x-content-type-options': 'nosniff',
  'azure-asyncoperation': 'https://management.azure.com/subscriptions/00000000-0000-0000-0000-000000000000/providers/Microsoft.BatchAI/locations/eastus/operationresults/5b4adcee-a0ae-43a2-bd6e-d331d1a7d88a?api-version=2017-09-01-preview',
  server: 'Microsoft-HTTPAPI/2.0',
  'x-ms-ratelimit-remaining-subscription-writes': '1198',
  'x-ms-request-id': 'e3db9c2f-aeb4-47cc-8883-5681eed68607',
  'x-ms-correlation-request-id': 'e3db9c2f-aeb4-47cc-8883-5681eed68607',
  'x-ms-routing-request-id': 'WESTUS2:20171031T175932Z:e3db9c2f-aeb4-47cc-8883-5681eed68607',
  date: 'Tue, 31 Oct 2017 17:59:32 GMT',
  connection: 'close',
  'content-length': '0' });
 return result; },
function (nock) { 
var result = 
nock('https://management.azure.com:443')
  .filteringRequestBody(function (path) { return '*';})
.put('/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/nodeTestGroup143/providers/Microsoft.BatchAI/clusters/cluster4?api-version=2017-09-01-preview', '*')
  .reply(202, "", { 'cache-control': 'no-cache',
  pragma: 'no-cache',
  expires: '-1',
  location: 'https://management.azure.com/subscriptions/00000000-0000-0000-0000-000000000000/providers/Microsoft.BatchAI/locations/eastus/operationstatuses/5b4adcee-a0ae-43a2-bd6e-d331d1a7d88a?api-version=2017-09-01-preview',
  'retry-after': '15',
  'request-id': '67184508-2b45-474f-b63f-cc385e5b442c',
  'strict-transport-security': 'max-age=31536000; includeSubDomains',
  'x-content-type-options': 'nosniff',
  'azure-asyncoperation': 'https://management.azure.com/subscriptions/00000000-0000-0000-0000-000000000000/providers/Microsoft.BatchAI/locations/eastus/operationresults/5b4adcee-a0ae-43a2-bd6e-d331d1a7d88a?api-version=2017-09-01-preview',
  server: 'Microsoft-HTTPAPI/2.0',
  'x-ms-ratelimit-remaining-subscription-writes': '1198',
  'x-ms-request-id': 'e3db9c2f-aeb4-47cc-8883-5681eed68607',
  'x-ms-correlation-request-id': 'e3db9c2f-aeb4-47cc-8883-5681eed68607',
  'x-ms-routing-request-id': 'WESTUS2:20171031T175932Z:e3db9c2f-aeb4-47cc-8883-5681eed68607',
  date: 'Tue, 31 Oct 2017 17:59:32 GMT',
  connection: 'close',
  'content-length': '0' });
 return result; },
function (nock) { 
var result = 
nock('http://management.azure.com:443')
  .get('/subscriptions/00000000-0000-0000-0000-000000000000/providers/Microsoft.BatchAI/locations/eastus/operationresults/5b4adcee-a0ae-43a2-bd6e-d331d1a7d88a?api-version=2017-09-01-preview')
  .reply(200, "{\"id\":\"https://management.azure.com/subscriptions/00000000-0000-0000-0000-000000000000/providers/Microsoft.BatchAI/locations/eastus/operationresults/5b4adcee-a0ae-43a2-bd6e-d331d1a7d88a\",\"name\":\"5b4adcee-a0ae-43a2-bd6e-d331d1a7d88a\",\"status\":\"Succeeded\",\"startTime\":\"2017-10-31T17:59:31.056Z\",\"endTime\":\"2017-10-31T17:59:32.197Z\",\"properties\":{\"resourceId\":\"00000000-0000-0000-0000-000000000000$nodetestgroup143$cluster4\"}}", { 'cache-control': 'no-cache',
  pragma: 'no-cache',
  'content-length': '423',
  'content-type': 'application/json; charset=utf-8',
  expires: '-1',
  'x-ms-ratelimit-remaining-subscription-reads': '14996',
  'request-id': '4ce893d6-b323-4193-9ab1-767fe8fa0c9d',
  'strict-transport-security': 'max-age=31536000; includeSubDomains',
  'x-content-type-options': 'nosniff',
  server: 'Microsoft-HTTPAPI/2.0',
  'x-ms-request-id': 'f6387387-8f01-450e-9642-82d062c6e647',
  'x-ms-correlation-request-id': 'f6387387-8f01-450e-9642-82d062c6e647',
  'x-ms-routing-request-id': 'WESTUS2:20171031T180003Z:f6387387-8f01-450e-9642-82d062c6e647',
  date: 'Tue, 31 Oct 2017 18:00:03 GMT',
  connection: 'close' });
 return result; },
function (nock) { 
var result = 
nock('https://management.azure.com:443')
  .get('/subscriptions/00000000-0000-0000-0000-000000000000/providers/Microsoft.BatchAI/locations/eastus/operationresults/5b4adcee-a0ae-43a2-bd6e-d331d1a7d88a?api-version=2017-09-01-preview')
  .reply(200, "{\"id\":\"https://management.azure.com/subscriptions/00000000-0000-0000-0000-000000000000/providers/Microsoft.BatchAI/locations/eastus/operationresults/5b4adcee-a0ae-43a2-bd6e-d331d1a7d88a\",\"name\":\"5b4adcee-a0ae-43a2-bd6e-d331d1a7d88a\",\"status\":\"Succeeded\",\"startTime\":\"2017-10-31T17:59:31.056Z\",\"endTime\":\"2017-10-31T17:59:32.197Z\",\"properties\":{\"resourceId\":\"00000000-0000-0000-0000-000000000000$nodetestgroup143$cluster4\"}}", { 'cache-control': 'no-cache',
  pragma: 'no-cache',
  'content-length': '423',
  'content-type': 'application/json; charset=utf-8',
  expires: '-1',
  'x-ms-ratelimit-remaining-subscription-reads': '14996',
  'request-id': '4ce893d6-b323-4193-9ab1-767fe8fa0c9d',
  'strict-transport-security': 'max-age=31536000; includeSubDomains',
  'x-content-type-options': 'nosniff',
  server: 'Microsoft-HTTPAPI/2.0',
  'x-ms-request-id': 'f6387387-8f01-450e-9642-82d062c6e647',
  'x-ms-correlation-request-id': 'f6387387-8f01-450e-9642-82d062c6e647',
  'x-ms-routing-request-id': 'WESTUS2:20171031T180003Z:f6387387-8f01-450e-9642-82d062c6e647',
  date: 'Tue, 31 Oct 2017 18:00:03 GMT',
  connection: 'close' });
 return result; },
function (nock) { 
var result = 
nock('http://management.azure.com:443')
  .get('/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/nodeTestGroup143/providers/Microsoft.BatchAI/clusters/cluster4?api-version=2017-09-01-preview')
  .reply(200, "{\"id\":\"/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/nodetestgroup143/providers/Microsoft.BatchAI/clusters/cluster4\",\"name\":\"cluster4\",\"type\":\"Microsoft.BatchAI/Clusters\",\"location\":\"eastus\",\"properties\":{\"provisioningState\":\"succeeded\",\"allocationState\":\"steady\",\"creationTime\":\"2017-10-31T17:59:31.04Z\",\"allocationStateTransitionTime\":\"2017-10-31T17:59:34.294Z\",\"provisioningStateTransitionTime\":\"2017-10-31T17:59:32.166Z\",\"vmSize\":\"STANDARD_D1\",\"currentNodeCount\":0,\"nodeStateCounts\":{\"runningNodeCount\":0,\"idleNodeCount\":0,\"unusableNodeCount\":0,\"preparingNodeCount\":0,\"leavingNodeCount\":0},\"vmPriority\":\"dedicated\",\"scaleSettings\":{\"manual\":{\"targetNodeCount\":0,\"nodeDeallocationOption\":\"requeue\"}},\"virtualMachineConfiguration\":{\"imageReference\":{\"publisher\":\"Canonical\",\"offer\":\"UbuntuServer\",\"sku\":\"16.04-LTS\",\"version\":\"16.04.201708151\"}},\"userAccountSettings\":{\"adminUserName\":\"username\",\"adminUserSSHPublicKey\":\"ssh-rsa AAAAB3NzaC1yc2EAAAADAQABAAABAQChWiUZgIS8fgKrB4wBBjJjoA4jtyfxWRgnbcz0pNPtplH8cL8TV/AzgE3GdYjbzbKg+dej9iVETS2kwfqDK7CXPljqwluN5S3CnZqeKETqagRQ6/IMuZhttKKVhVRtKIUqJFJeJ2/YtLJzvSE3QnVi+MedrJqC/Gm6A3bhLkIFPlTU3oXfLNz/2iG5ax/FgtNd1ukvMtplNifu4c8Y9iNxjcZR7/vRZUXg3V+hd1fYCJesJC6H3hmiszqjK119slb0ie7qmGB+1+0shs2+aT7wbCuqjKLKXHhOumGfgyPDcdaOm5GPGYeM/LERCi6uOS9bWlZEE3L63QeXeb2aRoOJ has_no_private_key\"},\"nodeSetup\":{\"mountVolumes\":{\"fileServers\":[{\"fileServer\":{\"id\":\"/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/nodetestgroup143/providers/Microsoft.BatchAI/fileservers/nfs\"},\"relativeMountPath\":\"nfs\",\"mountOptions\":\"rw\"}]}},\"subnet\":{\"id\":\"/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/fileserverrg-80f32a21-1417-44d2-a711-59ae5893e069/providers/Microsoft.Network/virtualNetworks/80f32a21-1417-44d2-a711-59ae5893e069vnet/subnets/Subnet-1\"}}}", { 'cache-control': 'no-cache',
  pragma: 'no-cache',
  'content-length': '1828',
  'content-type': 'application/json; charset=utf-8',
  expires: '-1',
  'last-modified': 'Tue, 31 Oct 2017 17:59:31 GMT',
  etag: '"0x8D5208922DE78D9"',
  'x-ms-ratelimit-remaining-subscription-reads': '14890',
  'request-id': '6a4d9995-12c4-495d-bf6e-c9d1e97168c1',
  'strict-transport-security': 'max-age=31536000; includeSubDomains',
  'x-content-type-options': 'nosniff',
  server: 'Microsoft-HTTPAPI/2.0',
  'x-ms-request-id': '8885a9f6-fef2-4db2-a3ef-338d1a54c69e',
  'x-ms-correlation-request-id': '8885a9f6-fef2-4db2-a3ef-338d1a54c69e',
  'x-ms-routing-request-id': 'WESTUS2:20171031T180004Z:8885a9f6-fef2-4db2-a3ef-338d1a54c69e',
  date: 'Tue, 31 Oct 2017 18:00:04 GMT',
  connection: 'close' });
 return result; },
function (nock) { 
var result = 
nock('https://management.azure.com:443')
  .get('/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/nodeTestGroup143/providers/Microsoft.BatchAI/clusters/cluster4?api-version=2017-09-01-preview')
  .reply(200, "{\"id\":\"/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/nodetestgroup143/providers/Microsoft.BatchAI/clusters/cluster4\",\"name\":\"cluster4\",\"type\":\"Microsoft.BatchAI/Clusters\",\"location\":\"eastus\",\"properties\":{\"provisioningState\":\"succeeded\",\"allocationState\":\"steady\",\"creationTime\":\"2017-10-31T17:59:31.04Z\",\"allocationStateTransitionTime\":\"2017-10-31T17:59:34.294Z\",\"provisioningStateTransitionTime\":\"2017-10-31T17:59:32.166Z\",\"vmSize\":\"STANDARD_D1\",\"currentNodeCount\":0,\"nodeStateCounts\":{\"runningNodeCount\":0,\"idleNodeCount\":0,\"unusableNodeCount\":0,\"preparingNodeCount\":0,\"leavingNodeCount\":0},\"vmPriority\":\"dedicated\",\"scaleSettings\":{\"manual\":{\"targetNodeCount\":0,\"nodeDeallocationOption\":\"requeue\"}},\"virtualMachineConfiguration\":{\"imageReference\":{\"publisher\":\"Canonical\",\"offer\":\"UbuntuServer\",\"sku\":\"16.04-LTS\",\"version\":\"16.04.201708151\"}},\"userAccountSettings\":{\"adminUserName\":\"username\",\"adminUserSSHPublicKey\":\"ssh-rsa AAAAB3NzaC1yc2EAAAADAQABAAABAQChWiUZgIS8fgKrB4wBBjJjoA4jtyfxWRgnbcz0pNPtplH8cL8TV/AzgE3GdYjbzbKg+dej9iVETS2kwfqDK7CXPljqwluN5S3CnZqeKETqagRQ6/IMuZhttKKVhVRtKIUqJFJeJ2/YtLJzvSE3QnVi+MedrJqC/Gm6A3bhLkIFPlTU3oXfLNz/2iG5ax/FgtNd1ukvMtplNifu4c8Y9iNxjcZR7/vRZUXg3V+hd1fYCJesJC6H3hmiszqjK119slb0ie7qmGB+1+0shs2+aT7wbCuqjKLKXHhOumGfgyPDcdaOm5GPGYeM/LERCi6uOS9bWlZEE3L63QeXeb2aRoOJ has_no_private_key\"},\"nodeSetup\":{\"mountVolumes\":{\"fileServers\":[{\"fileServer\":{\"id\":\"/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/nodetestgroup143/providers/Microsoft.BatchAI/fileservers/nfs\"},\"relativeMountPath\":\"nfs\",\"mountOptions\":\"rw\"}]}},\"subnet\":{\"id\":\"/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/fileserverrg-80f32a21-1417-44d2-a711-59ae5893e069/providers/Microsoft.Network/virtualNetworks/80f32a21-1417-44d2-a711-59ae5893e069vnet/subnets/Subnet-1\"}}}", { 'cache-control': 'no-cache',
  pragma: 'no-cache',
  'content-length': '1828',
  'content-type': 'application/json; charset=utf-8',
  expires: '-1',
  'last-modified': 'Tue, 31 Oct 2017 17:59:31 GMT',
  etag: '"0x8D5208922DE78D9"',
  'x-ms-ratelimit-remaining-subscription-reads': '14890',
  'request-id': '6a4d9995-12c4-495d-bf6e-c9d1e97168c1',
  'strict-transport-security': 'max-age=31536000; includeSubDomains',
  'x-content-type-options': 'nosniff',
  server: 'Microsoft-HTTPAPI/2.0',
  'x-ms-request-id': '8885a9f6-fef2-4db2-a3ef-338d1a54c69e',
  'x-ms-correlation-request-id': '8885a9f6-fef2-4db2-a3ef-338d1a54c69e',
  'x-ms-routing-request-id': 'WESTUS2:20171031T180004Z:8885a9f6-fef2-4db2-a3ef-338d1a54c69e',
  date: 'Tue, 31 Oct 2017 18:00:04 GMT',
  connection: 'close' });
 return result; }]];