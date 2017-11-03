exports.scopes = [[function (nock) {
var result = 
nock('http://management.azure.com:443')
  .filteringRequestBody(function (path) { return '*';})
.put('/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/nodeTestGroup143/providers/Microsoft.BatchAI/clusters/cluster10?api-version=2017-09-01-preview', '*')
  .reply(202, "", { 'cache-control': 'no-cache',
  pragma: 'no-cache',
  expires: '-1',
  location: 'https://management.azure.com/subscriptions/00000000-0000-0000-0000-000000000000/providers/Microsoft.BatchAI/locations/eastus/operationstatuses/8eae7de8-e672-41de-8b4f-e52569d300d3?api-version=2017-09-01-preview',
  'retry-after': '15',
  'request-id': '5ecf650f-e561-4348-9b59-d2ab0ea14a66',
  'strict-transport-security': 'max-age=31536000; includeSubDomains',
  'x-content-type-options': 'nosniff',
  'azure-asyncoperation': 'https://management.azure.com/subscriptions/00000000-0000-0000-0000-000000000000/providers/Microsoft.BatchAI/locations/eastus/operationresults/8eae7de8-e672-41de-8b4f-e52569d300d3?api-version=2017-09-01-preview',
  server: 'Microsoft-HTTPAPI/2.0',
  'x-ms-ratelimit-remaining-subscription-writes': '1199',
  'x-ms-request-id': '7aa00e9b-3a8f-496a-a72e-16122df3741b',
  'x-ms-correlation-request-id': '7aa00e9b-3a8f-496a-a72e-16122df3741b',
  'x-ms-routing-request-id': 'WESTUS2:20171031T180500Z:7aa00e9b-3a8f-496a-a72e-16122df3741b',
  date: 'Tue, 31 Oct 2017 18:05:00 GMT',
  connection: 'close',
  'content-length': '0' });
 return result; },
function (nock) { 
var result = 
nock('https://management.azure.com:443')
  .filteringRequestBody(function (path) { return '*';})
.put('/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/nodeTestGroup143/providers/Microsoft.BatchAI/clusters/cluster10?api-version=2017-09-01-preview', '*')
  .reply(202, "", { 'cache-control': 'no-cache',
  pragma: 'no-cache',
  expires: '-1',
  location: 'https://management.azure.com/subscriptions/00000000-0000-0000-0000-000000000000/providers/Microsoft.BatchAI/locations/eastus/operationstatuses/8eae7de8-e672-41de-8b4f-e52569d300d3?api-version=2017-09-01-preview',
  'retry-after': '15',
  'request-id': '5ecf650f-e561-4348-9b59-d2ab0ea14a66',
  'strict-transport-security': 'max-age=31536000; includeSubDomains',
  'x-content-type-options': 'nosniff',
  'azure-asyncoperation': 'https://management.azure.com/subscriptions/00000000-0000-0000-0000-000000000000/providers/Microsoft.BatchAI/locations/eastus/operationresults/8eae7de8-e672-41de-8b4f-e52569d300d3?api-version=2017-09-01-preview',
  server: 'Microsoft-HTTPAPI/2.0',
  'x-ms-ratelimit-remaining-subscription-writes': '1199',
  'x-ms-request-id': '7aa00e9b-3a8f-496a-a72e-16122df3741b',
  'x-ms-correlation-request-id': '7aa00e9b-3a8f-496a-a72e-16122df3741b',
  'x-ms-routing-request-id': 'WESTUS2:20171031T180500Z:7aa00e9b-3a8f-496a-a72e-16122df3741b',
  date: 'Tue, 31 Oct 2017 18:05:00 GMT',
  connection: 'close',
  'content-length': '0' });
 return result; },
function (nock) { 
var result = 
nock('http://management.azure.com:443')
  .get('/subscriptions/00000000-0000-0000-0000-000000000000/providers/Microsoft.BatchAI/locations/eastus/operationresults/8eae7de8-e672-41de-8b4f-e52569d300d3?api-version=2017-09-01-preview')
  .reply(200, "{\"id\":\"https://management.azure.com/subscriptions/00000000-0000-0000-0000-000000000000/providers/Microsoft.BatchAI/locations/eastus/operationresults/8eae7de8-e672-41de-8b4f-e52569d300d3\",\"name\":\"8eae7de8-e672-41de-8b4f-e52569d300d3\",\"status\":\"Succeeded\",\"startTime\":\"2017-10-31T18:04:59.053Z\",\"endTime\":\"2017-10-31T18:05:00.601Z\",\"properties\":{\"resourceId\":\"00000000-0000-0000-0000-000000000000$nodetestgroup143$cluster10\"}}", { 'cache-control': 'no-cache',
  pragma: 'no-cache',
  'content-length': '424',
  'content-type': 'application/json; charset=utf-8',
  expires: '-1',
  'x-ms-ratelimit-remaining-subscription-reads': '14997',
  'request-id': '0b2aff7e-ebc6-44a2-b3d9-b7e58d3338e2',
  'strict-transport-security': 'max-age=31536000; includeSubDomains',
  'x-content-type-options': 'nosniff',
  server: 'Microsoft-HTTPAPI/2.0',
  'x-ms-request-id': '385014c6-789e-4fcd-b471-c634ad9a175f',
  'x-ms-correlation-request-id': '385014c6-789e-4fcd-b471-c634ad9a175f',
  'x-ms-routing-request-id': 'WESTUS2:20171031T180531Z:385014c6-789e-4fcd-b471-c634ad9a175f',
  date: 'Tue, 31 Oct 2017 18:05:30 GMT',
  connection: 'close' });
 return result; },
function (nock) { 
var result = 
nock('https://management.azure.com:443')
  .get('/subscriptions/00000000-0000-0000-0000-000000000000/providers/Microsoft.BatchAI/locations/eastus/operationresults/8eae7de8-e672-41de-8b4f-e52569d300d3?api-version=2017-09-01-preview')
  .reply(200, "{\"id\":\"https://management.azure.com/subscriptions/00000000-0000-0000-0000-000000000000/providers/Microsoft.BatchAI/locations/eastus/operationresults/8eae7de8-e672-41de-8b4f-e52569d300d3\",\"name\":\"8eae7de8-e672-41de-8b4f-e52569d300d3\",\"status\":\"Succeeded\",\"startTime\":\"2017-10-31T18:04:59.053Z\",\"endTime\":\"2017-10-31T18:05:00.601Z\",\"properties\":{\"resourceId\":\"00000000-0000-0000-0000-000000000000$nodetestgroup143$cluster10\"}}", { 'cache-control': 'no-cache',
  pragma: 'no-cache',
  'content-length': '424',
  'content-type': 'application/json; charset=utf-8',
  expires: '-1',
  'x-ms-ratelimit-remaining-subscription-reads': '14997',
  'request-id': '0b2aff7e-ebc6-44a2-b3d9-b7e58d3338e2',
  'strict-transport-security': 'max-age=31536000; includeSubDomains',
  'x-content-type-options': 'nosniff',
  server: 'Microsoft-HTTPAPI/2.0',
  'x-ms-request-id': '385014c6-789e-4fcd-b471-c634ad9a175f',
  'x-ms-correlation-request-id': '385014c6-789e-4fcd-b471-c634ad9a175f',
  'x-ms-routing-request-id': 'WESTUS2:20171031T180531Z:385014c6-789e-4fcd-b471-c634ad9a175f',
  date: 'Tue, 31 Oct 2017 18:05:30 GMT',
  connection: 'close' });
 return result; },
function (nock) { 
var result = 
nock('http://management.azure.com:443')
  .get('/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/nodeTestGroup143/providers/Microsoft.BatchAI/clusters/cluster10?api-version=2017-09-01-preview')
  .reply(200, "{\"id\":\"/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/nodetestgroup143/providers/Microsoft.BatchAI/clusters/cluster10\",\"name\":\"cluster10\",\"type\":\"Microsoft.BatchAI/Clusters\",\"location\":\"eastus\",\"properties\":{\"provisioningState\":\"succeeded\",\"allocationState\":\"steady\",\"creationTime\":\"2017-10-31T18:04:59.038Z\",\"allocationStateTransitionTime\":\"2017-10-31T18:05:02.879Z\",\"provisioningStateTransitionTime\":\"2017-10-31T18:05:00.585Z\",\"vmSize\":\"STANDARD_D1\",\"currentNodeCount\":0,\"nodeStateCounts\":{\"runningNodeCount\":0,\"idleNodeCount\":0,\"unusableNodeCount\":0,\"preparingNodeCount\":0,\"leavingNodeCount\":0},\"vmPriority\":\"dedicated\",\"scaleSettings\":{\"manual\":{\"targetNodeCount\":0,\"nodeDeallocationOption\":\"requeue\"}},\"virtualMachineConfiguration\":{\"imageReference\":{\"publisher\":\"Canonical\",\"offer\":\"UbuntuServer\",\"sku\":\"16.04-LTS\",\"version\":\"16.04.201708151\"}},\"userAccountSettings\":{\"adminUserName\":\"username\",\"adminUserSSHPublicKey\":\"ssh-rsa AAAAB3NzaC1yc2EAAAADAQABAAABAQChWiUZgIS8fgKrB4wBBjJjoA4jtyfxWRgnbcz0pNPtplH8cL8TV/AzgE3GdYjbzbKg+dej9iVETS2kwfqDK7CXPljqwluN5S3CnZqeKETqagRQ6/IMuZhttKKVhVRtKIUqJFJeJ2/YtLJzvSE3QnVi+MedrJqC/Gm6A3bhLkIFPlTU3oXfLNz/2iG5ax/FgtNd1ukvMtplNifu4c8Y9iNxjcZR7/vRZUXg3V+hd1fYCJesJC6H3hmiszqjK119slb0ie7qmGB+1+0shs2+aT7wbCuqjKLKXHhOumGfgyPDcdaOm5GPGYeM/LERCi6uOS9bWlZEE3L63QeXeb2aRoOJ has_no_private_key\"}}}", { 'cache-control': 'no-cache',
  pragma: 'no-cache',
  'content-length': '1349',
  'content-type': 'application/json; charset=utf-8',
  expires: '-1',
  'last-modified': 'Tue, 31 Oct 2017 18:04:59 GMT',
  etag: '"0x8D52089E65EEF3F"',
  'x-ms-ratelimit-remaining-subscription-reads': '14993',
  'request-id': 'f8ef0f55-5b4a-476a-83bb-113f82c1269b',
  'strict-transport-security': 'max-age=31536000; includeSubDomains',
  'x-content-type-options': 'nosniff',
  server: 'Microsoft-HTTPAPI/2.0',
  'x-ms-request-id': '6f18a91f-c4be-4298-bbac-f7fd5150ced1',
  'x-ms-correlation-request-id': '6f18a91f-c4be-4298-bbac-f7fd5150ced1',
  'x-ms-routing-request-id': 'WESTUS2:20171031T180532Z:6f18a91f-c4be-4298-bbac-f7fd5150ced1',
  date: 'Tue, 31 Oct 2017 18:05:31 GMT',
  connection: 'close' });
 return result; },
function (nock) { 
var result = 
nock('https://management.azure.com:443')
  .get('/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/nodeTestGroup143/providers/Microsoft.BatchAI/clusters/cluster10?api-version=2017-09-01-preview')
  .reply(200, "{\"id\":\"/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/nodetestgroup143/providers/Microsoft.BatchAI/clusters/cluster10\",\"name\":\"cluster10\",\"type\":\"Microsoft.BatchAI/Clusters\",\"location\":\"eastus\",\"properties\":{\"provisioningState\":\"succeeded\",\"allocationState\":\"steady\",\"creationTime\":\"2017-10-31T18:04:59.038Z\",\"allocationStateTransitionTime\":\"2017-10-31T18:05:02.879Z\",\"provisioningStateTransitionTime\":\"2017-10-31T18:05:00.585Z\",\"vmSize\":\"STANDARD_D1\",\"currentNodeCount\":0,\"nodeStateCounts\":{\"runningNodeCount\":0,\"idleNodeCount\":0,\"unusableNodeCount\":0,\"preparingNodeCount\":0,\"leavingNodeCount\":0},\"vmPriority\":\"dedicated\",\"scaleSettings\":{\"manual\":{\"targetNodeCount\":0,\"nodeDeallocationOption\":\"requeue\"}},\"virtualMachineConfiguration\":{\"imageReference\":{\"publisher\":\"Canonical\",\"offer\":\"UbuntuServer\",\"sku\":\"16.04-LTS\",\"version\":\"16.04.201708151\"}},\"userAccountSettings\":{\"adminUserName\":\"username\",\"adminUserSSHPublicKey\":\"ssh-rsa AAAAB3NzaC1yc2EAAAADAQABAAABAQChWiUZgIS8fgKrB4wBBjJjoA4jtyfxWRgnbcz0pNPtplH8cL8TV/AzgE3GdYjbzbKg+dej9iVETS2kwfqDK7CXPljqwluN5S3CnZqeKETqagRQ6/IMuZhttKKVhVRtKIUqJFJeJ2/YtLJzvSE3QnVi+MedrJqC/Gm6A3bhLkIFPlTU3oXfLNz/2iG5ax/FgtNd1ukvMtplNifu4c8Y9iNxjcZR7/vRZUXg3V+hd1fYCJesJC6H3hmiszqjK119slb0ie7qmGB+1+0shs2+aT7wbCuqjKLKXHhOumGfgyPDcdaOm5GPGYeM/LERCi6uOS9bWlZEE3L63QeXeb2aRoOJ has_no_private_key\"}}}", { 'cache-control': 'no-cache',
  pragma: 'no-cache',
  'content-length': '1349',
  'content-type': 'application/json; charset=utf-8',
  expires: '-1',
  'last-modified': 'Tue, 31 Oct 2017 18:04:59 GMT',
  etag: '"0x8D52089E65EEF3F"',
  'x-ms-ratelimit-remaining-subscription-reads': '14993',
  'request-id': 'f8ef0f55-5b4a-476a-83bb-113f82c1269b',
  'strict-transport-security': 'max-age=31536000; includeSubDomains',
  'x-content-type-options': 'nosniff',
  server: 'Microsoft-HTTPAPI/2.0',
  'x-ms-request-id': '6f18a91f-c4be-4298-bbac-f7fd5150ced1',
  'x-ms-correlation-request-id': '6f18a91f-c4be-4298-bbac-f7fd5150ced1',
  'x-ms-routing-request-id': 'WESTUS2:20171031T180532Z:6f18a91f-c4be-4298-bbac-f7fd5150ced1',
  date: 'Tue, 31 Oct 2017 18:05:31 GMT',
  connection: 'close' });
 return result; },
function (nock) { 
var result = 
nock('http://management.azure.com:443')
  .filteringRequestBody(function (path) { return '*';})
.patch('/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/nodeTestGroup143/providers/Microsoft.BatchAI/clusters/cluster10?api-version=2017-09-01-preview', '*')
  .reply(200, "{\"id\":\"/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/nodetestgroup143/providers/Microsoft.BatchAI/clusters/cluster10\",\"name\":\"cluster10\",\"type\":\"Microsoft.BatchAI/Clusters\",\"location\":\"eastus\",\"properties\":{\"provisioningState\":\"succeeded\",\"allocationState\":\"steady\",\"creationTime\":\"2017-10-31T18:04:59.038Z\",\"allocationStateTransitionTime\":\"2017-10-31T18:05:02.879Z\",\"provisioningStateTransitionTime\":\"2017-10-31T18:05:00.585Z\",\"vmSize\":\"STANDARD_D1\",\"currentNodeCount\":0,\"nodeStateCounts\":{\"runningNodeCount\":0,\"idleNodeCount\":0,\"unusableNodeCount\":0,\"preparingNodeCount\":0,\"leavingNodeCount\":0},\"vmPriority\":\"dedicated\",\"scaleSettings\":{\"manual\":{\"targetNodeCount\":1,\"nodeDeallocationOption\":\"requeue\"}},\"virtualMachineConfiguration\":{\"imageReference\":{\"publisher\":\"Canonical\",\"offer\":\"UbuntuServer\",\"sku\":\"16.04-LTS\",\"version\":\"16.04.201708151\"}},\"userAccountSettings\":{\"adminUserName\":\"username\",\"adminUserSSHPublicKey\":\"ssh-rsa AAAAB3NzaC1yc2EAAAADAQABAAABAQChWiUZgIS8fgKrB4wBBjJjoA4jtyfxWRgnbcz0pNPtplH8cL8TV/AzgE3GdYjbzbKg+dej9iVETS2kwfqDK7CXPljqwluN5S3CnZqeKETqagRQ6/IMuZhttKKVhVRtKIUqJFJeJ2/YtLJzvSE3QnVi+MedrJqC/Gm6A3bhLkIFPlTU3oXfLNz/2iG5ax/FgtNd1ukvMtplNifu4c8Y9iNxjcZR7/vRZUXg3V+hd1fYCJesJC6H3hmiszqjK119slb0ie7qmGB+1+0shs2+aT7wbCuqjKLKXHhOumGfgyPDcdaOm5GPGYeM/LERCi6uOS9bWlZEE3L63QeXeb2aRoOJ has_no_private_key\"}}}", { 'cache-control': 'no-cache',
  pragma: 'no-cache',
  'content-length': '1349',
  'content-type': 'application/json; charset=utf-8',
  expires: '-1',
  'last-modified': 'Tue, 31 Oct 2017 18:04:59 GMT',
  etag: '"0x8D52089E65EEF3F"',
  'x-ms-ratelimit-remaining-subscription-writes': '1197',
  'request-id': '5d664945-f2cd-4313-8ca1-444431e108a2',
  'strict-transport-security': 'max-age=31536000; includeSubDomains',
  'x-content-type-options': 'nosniff',
  server: 'Microsoft-HTTPAPI/2.0',
  'x-ms-request-id': '85855150-4a16-4ed3-9182-ac5333c76a87',
  'x-ms-correlation-request-id': '85855150-4a16-4ed3-9182-ac5333c76a87',
  'x-ms-routing-request-id': 'WESTUS2:20171031T180533Z:85855150-4a16-4ed3-9182-ac5333c76a87',
  date: 'Tue, 31 Oct 2017 18:05:32 GMT',
  connection: 'close' });
 return result; },
function (nock) { 
var result = 
nock('https://management.azure.com:443')
  .filteringRequestBody(function (path) { return '*';})
.patch('/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/nodeTestGroup143/providers/Microsoft.BatchAI/clusters/cluster10?api-version=2017-09-01-preview', '*')
  .reply(200, "{\"id\":\"/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/nodetestgroup143/providers/Microsoft.BatchAI/clusters/cluster10\",\"name\":\"cluster10\",\"type\":\"Microsoft.BatchAI/Clusters\",\"location\":\"eastus\",\"properties\":{\"provisioningState\":\"succeeded\",\"allocationState\":\"steady\",\"creationTime\":\"2017-10-31T18:04:59.038Z\",\"allocationStateTransitionTime\":\"2017-10-31T18:05:02.879Z\",\"provisioningStateTransitionTime\":\"2017-10-31T18:05:00.585Z\",\"vmSize\":\"STANDARD_D1\",\"currentNodeCount\":0,\"nodeStateCounts\":{\"runningNodeCount\":0,\"idleNodeCount\":0,\"unusableNodeCount\":0,\"preparingNodeCount\":0,\"leavingNodeCount\":0},\"vmPriority\":\"dedicated\",\"scaleSettings\":{\"manual\":{\"targetNodeCount\":1,\"nodeDeallocationOption\":\"requeue\"}},\"virtualMachineConfiguration\":{\"imageReference\":{\"publisher\":\"Canonical\",\"offer\":\"UbuntuServer\",\"sku\":\"16.04-LTS\",\"version\":\"16.04.201708151\"}},\"userAccountSettings\":{\"adminUserName\":\"username\",\"adminUserSSHPublicKey\":\"ssh-rsa AAAAB3NzaC1yc2EAAAADAQABAAABAQChWiUZgIS8fgKrB4wBBjJjoA4jtyfxWRgnbcz0pNPtplH8cL8TV/AzgE3GdYjbzbKg+dej9iVETS2kwfqDK7CXPljqwluN5S3CnZqeKETqagRQ6/IMuZhttKKVhVRtKIUqJFJeJ2/YtLJzvSE3QnVi+MedrJqC/Gm6A3bhLkIFPlTU3oXfLNz/2iG5ax/FgtNd1ukvMtplNifu4c8Y9iNxjcZR7/vRZUXg3V+hd1fYCJesJC6H3hmiszqjK119slb0ie7qmGB+1+0shs2+aT7wbCuqjKLKXHhOumGfgyPDcdaOm5GPGYeM/LERCi6uOS9bWlZEE3L63QeXeb2aRoOJ has_no_private_key\"}}}", { 'cache-control': 'no-cache',
  pragma: 'no-cache',
  'content-length': '1349',
  'content-type': 'application/json; charset=utf-8',
  expires: '-1',
  'last-modified': 'Tue, 31 Oct 2017 18:04:59 GMT',
  etag: '"0x8D52089E65EEF3F"',
  'x-ms-ratelimit-remaining-subscription-writes': '1197',
  'request-id': '5d664945-f2cd-4313-8ca1-444431e108a2',
  'strict-transport-security': 'max-age=31536000; includeSubDomains',
  'x-content-type-options': 'nosniff',
  server: 'Microsoft-HTTPAPI/2.0',
  'x-ms-request-id': '85855150-4a16-4ed3-9182-ac5333c76a87',
  'x-ms-correlation-request-id': '85855150-4a16-4ed3-9182-ac5333c76a87',
  'x-ms-routing-request-id': 'WESTUS2:20171031T180533Z:85855150-4a16-4ed3-9182-ac5333c76a87',
  date: 'Tue, 31 Oct 2017 18:05:32 GMT',
  connection: 'close' });
 return result; },
function (nock) { 
var result = 
nock('http://management.azure.com:443')
  .filteringRequestBody(function (path) { return '*';})
.patch('/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/nodeTestGroup143/providers/Microsoft.BatchAI/clusters/cluster10?api-version=2017-09-01-preview', '*')
  .reply(200, "{\"id\":\"/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/nodetestgroup143/providers/Microsoft.BatchAI/clusters/cluster10\",\"name\":\"cluster10\",\"type\":\"Microsoft.BatchAI/Clusters\",\"location\":\"eastus\",\"properties\":{\"provisioningState\":\"succeeded\",\"allocationState\":\"steady\",\"creationTime\":\"2017-10-31T18:04:59.038Z\",\"allocationStateTransitionTime\":\"2017-10-31T18:05:02.879Z\",\"provisioningStateTransitionTime\":\"2017-10-31T18:05:00.585Z\",\"vmSize\":\"STANDARD_D1\",\"currentNodeCount\":0,\"nodeStateCounts\":{\"runningNodeCount\":0,\"idleNodeCount\":0,\"unusableNodeCount\":0,\"preparingNodeCount\":0,\"leavingNodeCount\":0},\"vmPriority\":\"dedicated\",\"scaleSettings\":{\"autoScale\":{\"minimumNodeCount\":0,\"maximumNodeCount\":10,\"initialNodeCount\":0}},\"virtualMachineConfiguration\":{\"imageReference\":{\"publisher\":\"Canonical\",\"offer\":\"UbuntuServer\",\"sku\":\"16.04-LTS\",\"version\":\"16.04.201708151\"}},\"userAccountSettings\":{\"adminUserName\":\"username\",\"adminUserSSHPublicKey\":\"ssh-rsa AAAAB3NzaC1yc2EAAAADAQABAAABAQChWiUZgIS8fgKrB4wBBjJjoA4jtyfxWRgnbcz0pNPtplH8cL8TV/AzgE3GdYjbzbKg+dej9iVETS2kwfqDK7CXPljqwluN5S3CnZqeKETqagRQ6/IMuZhttKKVhVRtKIUqJFJeJ2/YtLJzvSE3QnVi+MedrJqC/Gm6A3bhLkIFPlTU3oXfLNz/2iG5ax/FgtNd1ukvMtplNifu4c8Y9iNxjcZR7/vRZUXg3V+hd1fYCJesJC6H3hmiszqjK119slb0ie7qmGB+1+0shs2+aT7wbCuqjKLKXHhOumGfgyPDcdaOm5GPGYeM/LERCi6uOS9bWlZEE3L63QeXeb2aRoOJ has_no_private_key\"}}}", { 'cache-control': 'no-cache',
  pragma: 'no-cache',
  'content-length': '1361',
  'content-type': 'application/json; charset=utf-8',
  expires: '-1',
  'last-modified': 'Tue, 31 Oct 2017 18:04:59 GMT',
  etag: '"0x8D52089E65EEF3F"',
  'x-ms-ratelimit-remaining-subscription-writes': '1199',
  'request-id': '4be1b44d-5bfe-45e4-a550-1fbe82194e0a',
  'strict-transport-security': 'max-age=31536000; includeSubDomains',
  'x-content-type-options': 'nosniff',
  server: 'Microsoft-HTTPAPI/2.0',
  'x-ms-request-id': 'd0e2d482-ab46-44bd-a8c7-6bcbc6235193',
  'x-ms-correlation-request-id': 'd0e2d482-ab46-44bd-a8c7-6bcbc6235193',
  'x-ms-routing-request-id': 'WESTUS2:20171031T180534Z:d0e2d482-ab46-44bd-a8c7-6bcbc6235193',
  date: 'Tue, 31 Oct 2017 18:05:34 GMT',
  connection: 'close' });
 return result; },
function (nock) { 
var result = 
nock('https://management.azure.com:443')
  .filteringRequestBody(function (path) { return '*';})
.patch('/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/nodeTestGroup143/providers/Microsoft.BatchAI/clusters/cluster10?api-version=2017-09-01-preview', '*')
  .reply(200, "{\"id\":\"/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/nodetestgroup143/providers/Microsoft.BatchAI/clusters/cluster10\",\"name\":\"cluster10\",\"type\":\"Microsoft.BatchAI/Clusters\",\"location\":\"eastus\",\"properties\":{\"provisioningState\":\"succeeded\",\"allocationState\":\"steady\",\"creationTime\":\"2017-10-31T18:04:59.038Z\",\"allocationStateTransitionTime\":\"2017-10-31T18:05:02.879Z\",\"provisioningStateTransitionTime\":\"2017-10-31T18:05:00.585Z\",\"vmSize\":\"STANDARD_D1\",\"currentNodeCount\":0,\"nodeStateCounts\":{\"runningNodeCount\":0,\"idleNodeCount\":0,\"unusableNodeCount\":0,\"preparingNodeCount\":0,\"leavingNodeCount\":0},\"vmPriority\":\"dedicated\",\"scaleSettings\":{\"autoScale\":{\"minimumNodeCount\":0,\"maximumNodeCount\":10,\"initialNodeCount\":0}},\"virtualMachineConfiguration\":{\"imageReference\":{\"publisher\":\"Canonical\",\"offer\":\"UbuntuServer\",\"sku\":\"16.04-LTS\",\"version\":\"16.04.201708151\"}},\"userAccountSettings\":{\"adminUserName\":\"username\",\"adminUserSSHPublicKey\":\"ssh-rsa AAAAB3NzaC1yc2EAAAADAQABAAABAQChWiUZgIS8fgKrB4wBBjJjoA4jtyfxWRgnbcz0pNPtplH8cL8TV/AzgE3GdYjbzbKg+dej9iVETS2kwfqDK7CXPljqwluN5S3CnZqeKETqagRQ6/IMuZhttKKVhVRtKIUqJFJeJ2/YtLJzvSE3QnVi+MedrJqC/Gm6A3bhLkIFPlTU3oXfLNz/2iG5ax/FgtNd1ukvMtplNifu4c8Y9iNxjcZR7/vRZUXg3V+hd1fYCJesJC6H3hmiszqjK119slb0ie7qmGB+1+0shs2+aT7wbCuqjKLKXHhOumGfgyPDcdaOm5GPGYeM/LERCi6uOS9bWlZEE3L63QeXeb2aRoOJ has_no_private_key\"}}}", { 'cache-control': 'no-cache',
  pragma: 'no-cache',
  'content-length': '1361',
  'content-type': 'application/json; charset=utf-8',
  expires: '-1',
  'last-modified': 'Tue, 31 Oct 2017 18:04:59 GMT',
  etag: '"0x8D52089E65EEF3F"',
  'x-ms-ratelimit-remaining-subscription-writes': '1199',
  'request-id': '4be1b44d-5bfe-45e4-a550-1fbe82194e0a',
  'strict-transport-security': 'max-age=31536000; includeSubDomains',
  'x-content-type-options': 'nosniff',
  server: 'Microsoft-HTTPAPI/2.0',
  'x-ms-request-id': 'd0e2d482-ab46-44bd-a8c7-6bcbc6235193',
  'x-ms-correlation-request-id': 'd0e2d482-ab46-44bd-a8c7-6bcbc6235193',
  'x-ms-routing-request-id': 'WESTUS2:20171031T180534Z:d0e2d482-ab46-44bd-a8c7-6bcbc6235193',
  date: 'Tue, 31 Oct 2017 18:05:34 GMT',
  connection: 'close' });
 return result; }]];