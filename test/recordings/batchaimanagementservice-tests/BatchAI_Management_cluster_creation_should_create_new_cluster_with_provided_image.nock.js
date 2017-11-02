exports.scopes = [[function (nock) {
var result = 
nock('http://management.azure.com:443')
  .filteringRequestBody(function (path) { return '*';})
.put('/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/nodeTestGroup143/providers/Microsoft.BatchAI/clusters/cluster2?api-version=2017-09-01-preview', '*')
  .reply(202, "", { 'cache-control': 'no-cache',
  pragma: 'no-cache',
  expires: '-1',
  location: 'https://management.azure.com/subscriptions/00000000-0000-0000-0000-000000000000/providers/Microsoft.BatchAI/locations/eastus/operationstatuses/1978d2cf-edc2-4095-b650-483e44045c85?api-version=2017-09-01-preview',
  'retry-after': '15',
  'request-id': 'dae1bb5b-503a-49d0-8b75-1013edc0be5b',
  'strict-transport-security': 'max-age=31536000; includeSubDomains',
  'x-content-type-options': 'nosniff',
  'azure-asyncoperation': 'https://management.azure.com/subscriptions/00000000-0000-0000-0000-000000000000/providers/Microsoft.BatchAI/locations/eastus/operationresults/1978d2cf-edc2-4095-b650-483e44045c85?api-version=2017-09-01-preview',
  server: 'Microsoft-HTTPAPI/2.0',
  'x-ms-ratelimit-remaining-subscription-writes': '1199',
  'x-ms-request-id': '215a8308-7879-4365-96f1-d8cee1ab2fb2',
  'x-ms-correlation-request-id': '215a8308-7879-4365-96f1-d8cee1ab2fb2',
  'x-ms-routing-request-id': 'WESTUS2:20171031T175824Z:215a8308-7879-4365-96f1-d8cee1ab2fb2',
  date: 'Tue, 31 Oct 2017 17:58:24 GMT',
  connection: 'close',
  'content-length': '0' });
 return result; },
function (nock) { 
var result = 
nock('https://management.azure.com:443')
  .filteringRequestBody(function (path) { return '*';})
.put('/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/nodeTestGroup143/providers/Microsoft.BatchAI/clusters/cluster2?api-version=2017-09-01-preview', '*')
  .reply(202, "", { 'cache-control': 'no-cache',
  pragma: 'no-cache',
  expires: '-1',
  location: 'https://management.azure.com/subscriptions/00000000-0000-0000-0000-000000000000/providers/Microsoft.BatchAI/locations/eastus/operationstatuses/1978d2cf-edc2-4095-b650-483e44045c85?api-version=2017-09-01-preview',
  'retry-after': '15',
  'request-id': 'dae1bb5b-503a-49d0-8b75-1013edc0be5b',
  'strict-transport-security': 'max-age=31536000; includeSubDomains',
  'x-content-type-options': 'nosniff',
  'azure-asyncoperation': 'https://management.azure.com/subscriptions/00000000-0000-0000-0000-000000000000/providers/Microsoft.BatchAI/locations/eastus/operationresults/1978d2cf-edc2-4095-b650-483e44045c85?api-version=2017-09-01-preview',
  server: 'Microsoft-HTTPAPI/2.0',
  'x-ms-ratelimit-remaining-subscription-writes': '1199',
  'x-ms-request-id': '215a8308-7879-4365-96f1-d8cee1ab2fb2',
  'x-ms-correlation-request-id': '215a8308-7879-4365-96f1-d8cee1ab2fb2',
  'x-ms-routing-request-id': 'WESTUS2:20171031T175824Z:215a8308-7879-4365-96f1-d8cee1ab2fb2',
  date: 'Tue, 31 Oct 2017 17:58:24 GMT',
  connection: 'close',
  'content-length': '0' });
 return result; },
function (nock) { 
var result = 
nock('http://management.azure.com:443')
  .get('/subscriptions/00000000-0000-0000-0000-000000000000/providers/Microsoft.BatchAI/locations/eastus/operationresults/1978d2cf-edc2-4095-b650-483e44045c85?api-version=2017-09-01-preview')
  .reply(200, "{\"id\":\"https://management.azure.com/subscriptions/00000000-0000-0000-0000-000000000000/providers/Microsoft.BatchAI/locations/eastus/operationresults/1978d2cf-edc2-4095-b650-483e44045c85\",\"name\":\"1978d2cf-edc2-4095-b650-483e44045c85\",\"status\":\"Succeeded\",\"startTime\":\"2017-10-31T17:58:23.148Z\",\"endTime\":\"2017-10-31T17:58:23.679Z\",\"properties\":{\"resourceId\":\"00000000-0000-0000-0000-000000000000$nodetestgroup143$cluster2\"}}", { 'cache-control': 'no-cache',
  pragma: 'no-cache',
  'content-length': '423',
  'content-type': 'application/json; charset=utf-8',
  expires: '-1',
  'x-ms-ratelimit-remaining-subscription-reads': '14994',
  'request-id': '9b6eadb7-809c-4b74-85a7-3511f9c82c1d',
  'strict-transport-security': 'max-age=31536000; includeSubDomains',
  'x-content-type-options': 'nosniff',
  server: 'Microsoft-HTTPAPI/2.0',
  'x-ms-request-id': 'e28f0daf-8322-46c9-a59a-05f29e07e758',
  'x-ms-correlation-request-id': 'e28f0daf-8322-46c9-a59a-05f29e07e758',
  'x-ms-routing-request-id': 'WESTUS2:20171031T175856Z:e28f0daf-8322-46c9-a59a-05f29e07e758',
  date: 'Tue, 31 Oct 2017 17:58:55 GMT',
  connection: 'close' });
 return result; },
function (nock) { 
var result = 
nock('https://management.azure.com:443')
  .get('/subscriptions/00000000-0000-0000-0000-000000000000/providers/Microsoft.BatchAI/locations/eastus/operationresults/1978d2cf-edc2-4095-b650-483e44045c85?api-version=2017-09-01-preview')
  .reply(200, "{\"id\":\"https://management.azure.com/subscriptions/00000000-0000-0000-0000-000000000000/providers/Microsoft.BatchAI/locations/eastus/operationresults/1978d2cf-edc2-4095-b650-483e44045c85\",\"name\":\"1978d2cf-edc2-4095-b650-483e44045c85\",\"status\":\"Succeeded\",\"startTime\":\"2017-10-31T17:58:23.148Z\",\"endTime\":\"2017-10-31T17:58:23.679Z\",\"properties\":{\"resourceId\":\"00000000-0000-0000-0000-000000000000$nodetestgroup143$cluster2\"}}", { 'cache-control': 'no-cache',
  pragma: 'no-cache',
  'content-length': '423',
  'content-type': 'application/json; charset=utf-8',
  expires: '-1',
  'x-ms-ratelimit-remaining-subscription-reads': '14994',
  'request-id': '9b6eadb7-809c-4b74-85a7-3511f9c82c1d',
  'strict-transport-security': 'max-age=31536000; includeSubDomains',
  'x-content-type-options': 'nosniff',
  server: 'Microsoft-HTTPAPI/2.0',
  'x-ms-request-id': 'e28f0daf-8322-46c9-a59a-05f29e07e758',
  'x-ms-correlation-request-id': 'e28f0daf-8322-46c9-a59a-05f29e07e758',
  'x-ms-routing-request-id': 'WESTUS2:20171031T175856Z:e28f0daf-8322-46c9-a59a-05f29e07e758',
  date: 'Tue, 31 Oct 2017 17:58:55 GMT',
  connection: 'close' });
 return result; },
function (nock) { 
var result = 
nock('http://management.azure.com:443')
  .get('/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/nodeTestGroup143/providers/Microsoft.BatchAI/clusters/cluster2?api-version=2017-09-01-preview')
  .reply(200, "{\"id\":\"/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/nodetestgroup143/providers/Microsoft.BatchAI/clusters/cluster2\",\"name\":\"cluster2\",\"type\":\"Microsoft.BatchAI/Clusters\",\"location\":\"eastus\",\"properties\":{\"provisioningState\":\"succeeded\",\"allocationState\":\"steady\",\"creationTime\":\"2017-10-31T17:58:23.132Z\",\"allocationStateTransitionTime\":\"2017-10-31T17:58:26.223Z\",\"provisioningStateTransitionTime\":\"2017-10-31T17:58:23.648Z\",\"vmSize\":\"STANDARD_D1\",\"currentNodeCount\":0,\"nodeStateCounts\":{\"runningNodeCount\":0,\"idleNodeCount\":0,\"unusableNodeCount\":0,\"preparingNodeCount\":0,\"leavingNodeCount\":0},\"vmPriority\":\"dedicated\",\"scaleSettings\":{\"manual\":{\"targetNodeCount\":0,\"nodeDeallocationOption\":\"requeue\"}},\"virtualMachineConfiguration\":{\"imageReference\":{\"publisher\":\"microsoft-ads\",\"offer\":\"linux-data-science-vm-ubuntu\",\"sku\":\"linuxdsvmubuntu\",\"version\":\"latest\"}},\"userAccountSettings\":{\"adminUserName\":\"username\",\"adminUserSSHPublicKey\":\"ssh-rsa AAAAB3NzaC1yc2EAAAADAQABAAABAQChWiUZgIS8fgKrB4wBBjJjoA4jtyfxWRgnbcz0pNPtplH8cL8TV/AzgE3GdYjbzbKg+dej9iVETS2kwfqDK7CXPljqwluN5S3CnZqeKETqagRQ6/IMuZhttKKVhVRtKIUqJFJeJ2/YtLJzvSE3QnVi+MedrJqC/Gm6A3bhLkIFPlTU3oXfLNz/2iG5ax/FgtNd1ukvMtplNifu4c8Y9iNxjcZR7/vRZUXg3V+hd1fYCJesJC6H3hmiszqjK119slb0ie7qmGB+1+0shs2+aT7wbCuqjKLKXHhOumGfgyPDcdaOm5GPGYeM/LERCi6uOS9bWlZEE3L63QeXeb2aRoOJ has_no_private_key\"}}}", { 'cache-control': 'no-cache',
  pragma: 'no-cache',
  'content-length': '1364',
  'content-type': 'application/json; charset=utf-8',
  expires: '-1',
  'last-modified': 'Tue, 31 Oct 2017 17:58:23 GMT',
  etag: '"0x8D52088FA64924E"',
  'x-ms-ratelimit-remaining-subscription-reads': '14996',
  'request-id': 'bd6f9d7c-ee13-443f-87b6-bc1539986a3f',
  'strict-transport-security': 'max-age=31536000; includeSubDomains',
  'x-content-type-options': 'nosniff',
  server: 'Microsoft-HTTPAPI/2.0',
  'x-ms-request-id': '9f5f01a1-6f99-4f1f-a22f-306dbf7016a1',
  'x-ms-correlation-request-id': '9f5f01a1-6f99-4f1f-a22f-306dbf7016a1',
  'x-ms-routing-request-id': 'WESTUS2:20171031T175856Z:9f5f01a1-6f99-4f1f-a22f-306dbf7016a1',
  date: 'Tue, 31 Oct 2017 17:58:56 GMT',
  connection: 'close' });
 return result; },
function (nock) { 
var result = 
nock('https://management.azure.com:443')
  .get('/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/nodeTestGroup143/providers/Microsoft.BatchAI/clusters/cluster2?api-version=2017-09-01-preview')
  .reply(200, "{\"id\":\"/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/nodetestgroup143/providers/Microsoft.BatchAI/clusters/cluster2\",\"name\":\"cluster2\",\"type\":\"Microsoft.BatchAI/Clusters\",\"location\":\"eastus\",\"properties\":{\"provisioningState\":\"succeeded\",\"allocationState\":\"steady\",\"creationTime\":\"2017-10-31T17:58:23.132Z\",\"allocationStateTransitionTime\":\"2017-10-31T17:58:26.223Z\",\"provisioningStateTransitionTime\":\"2017-10-31T17:58:23.648Z\",\"vmSize\":\"STANDARD_D1\",\"currentNodeCount\":0,\"nodeStateCounts\":{\"runningNodeCount\":0,\"idleNodeCount\":0,\"unusableNodeCount\":0,\"preparingNodeCount\":0,\"leavingNodeCount\":0},\"vmPriority\":\"dedicated\",\"scaleSettings\":{\"manual\":{\"targetNodeCount\":0,\"nodeDeallocationOption\":\"requeue\"}},\"virtualMachineConfiguration\":{\"imageReference\":{\"publisher\":\"microsoft-ads\",\"offer\":\"linux-data-science-vm-ubuntu\",\"sku\":\"linuxdsvmubuntu\",\"version\":\"latest\"}},\"userAccountSettings\":{\"adminUserName\":\"username\",\"adminUserSSHPublicKey\":\"ssh-rsa AAAAB3NzaC1yc2EAAAADAQABAAABAQChWiUZgIS8fgKrB4wBBjJjoA4jtyfxWRgnbcz0pNPtplH8cL8TV/AzgE3GdYjbzbKg+dej9iVETS2kwfqDK7CXPljqwluN5S3CnZqeKETqagRQ6/IMuZhttKKVhVRtKIUqJFJeJ2/YtLJzvSE3QnVi+MedrJqC/Gm6A3bhLkIFPlTU3oXfLNz/2iG5ax/FgtNd1ukvMtplNifu4c8Y9iNxjcZR7/vRZUXg3V+hd1fYCJesJC6H3hmiszqjK119slb0ie7qmGB+1+0shs2+aT7wbCuqjKLKXHhOumGfgyPDcdaOm5GPGYeM/LERCi6uOS9bWlZEE3L63QeXeb2aRoOJ has_no_private_key\"}}}", { 'cache-control': 'no-cache',
  pragma: 'no-cache',
  'content-length': '1364',
  'content-type': 'application/json; charset=utf-8',
  expires: '-1',
  'last-modified': 'Tue, 31 Oct 2017 17:58:23 GMT',
  etag: '"0x8D52088FA64924E"',
  'x-ms-ratelimit-remaining-subscription-reads': '14996',
  'request-id': 'bd6f9d7c-ee13-443f-87b6-bc1539986a3f',
  'strict-transport-security': 'max-age=31536000; includeSubDomains',
  'x-content-type-options': 'nosniff',
  server: 'Microsoft-HTTPAPI/2.0',
  'x-ms-request-id': '9f5f01a1-6f99-4f1f-a22f-306dbf7016a1',
  'x-ms-correlation-request-id': '9f5f01a1-6f99-4f1f-a22f-306dbf7016a1',
  'x-ms-routing-request-id': 'WESTUS2:20171031T175856Z:9f5f01a1-6f99-4f1f-a22f-306dbf7016a1',
  date: 'Tue, 31 Oct 2017 17:58:56 GMT',
  connection: 'close' });
 return result; }]];