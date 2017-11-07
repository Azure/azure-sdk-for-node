exports.scopes = [[function (nock) {
var result = 
nock('http://management.azure.com:443')
  .filteringRequestBody(function (path) { return '*';})
.put('/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/nodeTestGroup143/providers/Microsoft.BatchAI/clusters/cluster5?api-version=2017-09-01-preview', '*')
  .reply(202, "", { 'cache-control': 'no-cache',
  pragma: 'no-cache',
  expires: '-1',
  location: 'https://management.azure.com/subscriptions/00000000-0000-0000-0000-000000000000/providers/Microsoft.BatchAI/locations/eastus/operationstatuses/3d999d23-9016-4f86-ba13-d331d678490a?api-version=2017-09-01-preview',
  'retry-after': '15',
  'request-id': '7a6433a1-9d3e-402f-ab28-a08ddcdefaf7',
  'strict-transport-security': 'max-age=31536000; includeSubDomains',
  'x-content-type-options': 'nosniff',
  'azure-asyncoperation': 'https://management.azure.com/subscriptions/00000000-0000-0000-0000-000000000000/providers/Microsoft.BatchAI/locations/eastus/operationresults/3d999d23-9016-4f86-ba13-d331d678490a?api-version=2017-09-01-preview',
  server: 'Microsoft-HTTPAPI/2.0',
  'x-ms-ratelimit-remaining-subscription-writes': '1199',
  'x-ms-request-id': 'a8f4212b-df12-42bc-8aa1-7d933d09e521',
  'x-ms-correlation-request-id': 'a8f4212b-df12-42bc-8aa1-7d933d09e521',
  'x-ms-routing-request-id': 'WESTUS2:20171031T180006Z:a8f4212b-df12-42bc-8aa1-7d933d09e521',
  date: 'Tue, 31 Oct 2017 18:00:06 GMT',
  connection: 'close',
  'content-length': '0' });
 return result; },
function (nock) { 
var result = 
nock('https://management.azure.com:443')
  .filteringRequestBody(function (path) { return '*';})
.put('/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/nodeTestGroup143/providers/Microsoft.BatchAI/clusters/cluster5?api-version=2017-09-01-preview', '*')
  .reply(202, "", { 'cache-control': 'no-cache',
  pragma: 'no-cache',
  expires: '-1',
  location: 'https://management.azure.com/subscriptions/00000000-0000-0000-0000-000000000000/providers/Microsoft.BatchAI/locations/eastus/operationstatuses/3d999d23-9016-4f86-ba13-d331d678490a?api-version=2017-09-01-preview',
  'retry-after': '15',
  'request-id': '7a6433a1-9d3e-402f-ab28-a08ddcdefaf7',
  'strict-transport-security': 'max-age=31536000; includeSubDomains',
  'x-content-type-options': 'nosniff',
  'azure-asyncoperation': 'https://management.azure.com/subscriptions/00000000-0000-0000-0000-000000000000/providers/Microsoft.BatchAI/locations/eastus/operationresults/3d999d23-9016-4f86-ba13-d331d678490a?api-version=2017-09-01-preview',
  server: 'Microsoft-HTTPAPI/2.0',
  'x-ms-ratelimit-remaining-subscription-writes': '1199',
  'x-ms-request-id': 'a8f4212b-df12-42bc-8aa1-7d933d09e521',
  'x-ms-correlation-request-id': 'a8f4212b-df12-42bc-8aa1-7d933d09e521',
  'x-ms-routing-request-id': 'WESTUS2:20171031T180006Z:a8f4212b-df12-42bc-8aa1-7d933d09e521',
  date: 'Tue, 31 Oct 2017 18:00:06 GMT',
  connection: 'close',
  'content-length': '0' });
 return result; },
function (nock) { 
var result = 
nock('http://management.azure.com:443')
  .get('/subscriptions/00000000-0000-0000-0000-000000000000/providers/Microsoft.BatchAI/locations/eastus/operationresults/3d999d23-9016-4f86-ba13-d331d678490a?api-version=2017-09-01-preview')
  .reply(200, "{\"id\":\"https://management.azure.com/subscriptions/00000000-0000-0000-0000-000000000000/providers/Microsoft.BatchAI/locations/eastus/operationresults/3d999d23-9016-4f86-ba13-d331d678490a\",\"name\":\"3d999d23-9016-4f86-ba13-d331d678490a\",\"status\":\"InProgress\",\"startTime\":\"2017-10-31T18:00:04.83Z\"}", { 'cache-control': 'no-cache',
  pragma: 'no-cache',
  'content-length': '293',
  'content-type': 'application/json; charset=utf-8',
  expires: '-1',
  'x-ms-ratelimit-remaining-subscription-reads': '14998',
  'request-id': '310d3da5-05f7-4da5-a24a-8d352f0a3d26',
  'strict-transport-security': 'max-age=31536000; includeSubDomains',
  'x-content-type-options': 'nosniff',
  server: 'Microsoft-HTTPAPI/2.0',
  'x-ms-request-id': 'f6ef1960-e580-47ee-8c06-9a2eba95cd3d',
  'x-ms-correlation-request-id': 'f6ef1960-e580-47ee-8c06-9a2eba95cd3d',
  'x-ms-routing-request-id': 'WESTUS2:20171031T180037Z:f6ef1960-e580-47ee-8c06-9a2eba95cd3d',
  date: 'Tue, 31 Oct 2017 18:00:36 GMT',
  connection: 'close' });
 return result; },
function (nock) { 
var result = 
nock('https://management.azure.com:443')
  .get('/subscriptions/00000000-0000-0000-0000-000000000000/providers/Microsoft.BatchAI/locations/eastus/operationresults/3d999d23-9016-4f86-ba13-d331d678490a?api-version=2017-09-01-preview')
  .reply(200, "{\"id\":\"https://management.azure.com/subscriptions/00000000-0000-0000-0000-000000000000/providers/Microsoft.BatchAI/locations/eastus/operationresults/3d999d23-9016-4f86-ba13-d331d678490a\",\"name\":\"3d999d23-9016-4f86-ba13-d331d678490a\",\"status\":\"InProgress\",\"startTime\":\"2017-10-31T18:00:04.83Z\"}", { 'cache-control': 'no-cache',
  pragma: 'no-cache',
  'content-length': '293',
  'content-type': 'application/json; charset=utf-8',
  expires: '-1',
  'x-ms-ratelimit-remaining-subscription-reads': '14998',
  'request-id': '310d3da5-05f7-4da5-a24a-8d352f0a3d26',
  'strict-transport-security': 'max-age=31536000; includeSubDomains',
  'x-content-type-options': 'nosniff',
  server: 'Microsoft-HTTPAPI/2.0',
  'x-ms-request-id': 'f6ef1960-e580-47ee-8c06-9a2eba95cd3d',
  'x-ms-correlation-request-id': 'f6ef1960-e580-47ee-8c06-9a2eba95cd3d',
  'x-ms-routing-request-id': 'WESTUS2:20171031T180037Z:f6ef1960-e580-47ee-8c06-9a2eba95cd3d',
  date: 'Tue, 31 Oct 2017 18:00:36 GMT',
  connection: 'close' });
 return result; },
function (nock) { 
var result = 
nock('http://management.azure.com:443')
  .get('/subscriptions/00000000-0000-0000-0000-000000000000/providers/Microsoft.BatchAI/locations/eastus/operationresults/3d999d23-9016-4f86-ba13-d331d678490a?api-version=2017-09-01-preview')
  .reply(200, "{\"id\":\"https://management.azure.com/subscriptions/00000000-0000-0000-0000-000000000000/providers/Microsoft.BatchAI/locations/eastus/operationresults/3d999d23-9016-4f86-ba13-d331d678490a\",\"name\":\"3d999d23-9016-4f86-ba13-d331d678490a\",\"status\":\"InProgress\",\"startTime\":\"2017-10-31T18:00:04.83Z\"}", { 'cache-control': 'no-cache',
  pragma: 'no-cache',
  'content-length': '293',
  'content-type': 'application/json; charset=utf-8',
  expires: '-1',
  'x-ms-ratelimit-remaining-subscription-reads': '14997',
  'request-id': '784af36b-6465-4d75-ab92-14ce398b3007',
  'strict-transport-security': 'max-age=31536000; includeSubDomains',
  'x-content-type-options': 'nosniff',
  server: 'Microsoft-HTTPAPI/2.0',
  'x-ms-request-id': '353cc319-38ea-4be0-8660-bfe343d88f1e',
  'x-ms-correlation-request-id': '353cc319-38ea-4be0-8660-bfe343d88f1e',
  'x-ms-routing-request-id': 'WESTUS2:20171031T180108Z:353cc319-38ea-4be0-8660-bfe343d88f1e',
  date: 'Tue, 31 Oct 2017 18:01:07 GMT',
  connection: 'close' });
 return result; },
function (nock) { 
var result = 
nock('https://management.azure.com:443')
  .get('/subscriptions/00000000-0000-0000-0000-000000000000/providers/Microsoft.BatchAI/locations/eastus/operationresults/3d999d23-9016-4f86-ba13-d331d678490a?api-version=2017-09-01-preview')
  .reply(200, "{\"id\":\"https://management.azure.com/subscriptions/00000000-0000-0000-0000-000000000000/providers/Microsoft.BatchAI/locations/eastus/operationresults/3d999d23-9016-4f86-ba13-d331d678490a\",\"name\":\"3d999d23-9016-4f86-ba13-d331d678490a\",\"status\":\"InProgress\",\"startTime\":\"2017-10-31T18:00:04.83Z\"}", { 'cache-control': 'no-cache',
  pragma: 'no-cache',
  'content-length': '293',
  'content-type': 'application/json; charset=utf-8',
  expires: '-1',
  'x-ms-ratelimit-remaining-subscription-reads': '14997',
  'request-id': '784af36b-6465-4d75-ab92-14ce398b3007',
  'strict-transport-security': 'max-age=31536000; includeSubDomains',
  'x-content-type-options': 'nosniff',
  server: 'Microsoft-HTTPAPI/2.0',
  'x-ms-request-id': '353cc319-38ea-4be0-8660-bfe343d88f1e',
  'x-ms-correlation-request-id': '353cc319-38ea-4be0-8660-bfe343d88f1e',
  'x-ms-routing-request-id': 'WESTUS2:20171031T180108Z:353cc319-38ea-4be0-8660-bfe343d88f1e',
  date: 'Tue, 31 Oct 2017 18:01:07 GMT',
  connection: 'close' });
 return result; },
function (nock) { 
var result = 
nock('http://management.azure.com:443')
  .get('/subscriptions/00000000-0000-0000-0000-000000000000/providers/Microsoft.BatchAI/locations/eastus/operationresults/3d999d23-9016-4f86-ba13-d331d678490a?api-version=2017-09-01-preview')
  .reply(200, "{\"id\":\"https://management.azure.com/subscriptions/00000000-0000-0000-0000-000000000000/providers/Microsoft.BatchAI/locations/eastus/operationresults/3d999d23-9016-4f86-ba13-d331d678490a\",\"name\":\"3d999d23-9016-4f86-ba13-d331d678490a\",\"status\":\"InProgress\",\"startTime\":\"2017-10-31T18:00:04.83Z\"}", { 'cache-control': 'no-cache',
  pragma: 'no-cache',
  'content-length': '293',
  'content-type': 'application/json; charset=utf-8',
  expires: '-1',
  'x-ms-ratelimit-remaining-subscription-reads': '14996',
  'request-id': 'aeeac079-539b-4509-8edf-628558c11d49',
  'strict-transport-security': 'max-age=31536000; includeSubDomains',
  'x-content-type-options': 'nosniff',
  server: 'Microsoft-HTTPAPI/2.0',
  'x-ms-request-id': 'ee28ffda-7e25-464e-91ff-2078c14835be',
  'x-ms-correlation-request-id': 'ee28ffda-7e25-464e-91ff-2078c14835be',
  'x-ms-routing-request-id': 'WESTUS2:20171031T180140Z:ee28ffda-7e25-464e-91ff-2078c14835be',
  date: 'Tue, 31 Oct 2017 18:01:39 GMT',
  connection: 'close' });
 return result; },
function (nock) { 
var result = 
nock('https://management.azure.com:443')
  .get('/subscriptions/00000000-0000-0000-0000-000000000000/providers/Microsoft.BatchAI/locations/eastus/operationresults/3d999d23-9016-4f86-ba13-d331d678490a?api-version=2017-09-01-preview')
  .reply(200, "{\"id\":\"https://management.azure.com/subscriptions/00000000-0000-0000-0000-000000000000/providers/Microsoft.BatchAI/locations/eastus/operationresults/3d999d23-9016-4f86-ba13-d331d678490a\",\"name\":\"3d999d23-9016-4f86-ba13-d331d678490a\",\"status\":\"InProgress\",\"startTime\":\"2017-10-31T18:00:04.83Z\"}", { 'cache-control': 'no-cache',
  pragma: 'no-cache',
  'content-length': '293',
  'content-type': 'application/json; charset=utf-8',
  expires: '-1',
  'x-ms-ratelimit-remaining-subscription-reads': '14996',
  'request-id': 'aeeac079-539b-4509-8edf-628558c11d49',
  'strict-transport-security': 'max-age=31536000; includeSubDomains',
  'x-content-type-options': 'nosniff',
  server: 'Microsoft-HTTPAPI/2.0',
  'x-ms-request-id': 'ee28ffda-7e25-464e-91ff-2078c14835be',
  'x-ms-correlation-request-id': 'ee28ffda-7e25-464e-91ff-2078c14835be',
  'x-ms-routing-request-id': 'WESTUS2:20171031T180140Z:ee28ffda-7e25-464e-91ff-2078c14835be',
  date: 'Tue, 31 Oct 2017 18:01:39 GMT',
  connection: 'close' });
 return result; },
function (nock) { 
var result = 
nock('http://management.azure.com:443')
  .get('/subscriptions/00000000-0000-0000-0000-000000000000/providers/Microsoft.BatchAI/locations/eastus/operationresults/3d999d23-9016-4f86-ba13-d331d678490a?api-version=2017-09-01-preview')
  .reply(200, "{\"id\":\"https://management.azure.com/subscriptions/00000000-0000-0000-0000-000000000000/providers/Microsoft.BatchAI/locations/eastus/operationresults/3d999d23-9016-4f86-ba13-d331d678490a\",\"name\":\"3d999d23-9016-4f86-ba13-d331d678490a\",\"status\":\"InProgress\",\"startTime\":\"2017-10-31T18:00:04.83Z\"}", { 'cache-control': 'no-cache',
  pragma: 'no-cache',
  'content-length': '293',
  'content-type': 'application/json; charset=utf-8',
  expires: '-1',
  'x-ms-ratelimit-remaining-subscription-reads': '14995',
  'request-id': 'b59b351f-75a7-4f91-a526-578d5f1ba3a7',
  'strict-transport-security': 'max-age=31536000; includeSubDomains',
  'x-content-type-options': 'nosniff',
  server: 'Microsoft-HTTPAPI/2.0',
  'x-ms-request-id': '2fa1b0d4-8e2e-446b-b685-6ecf4c1480b3',
  'x-ms-correlation-request-id': '2fa1b0d4-8e2e-446b-b685-6ecf4c1480b3',
  'x-ms-routing-request-id': 'WESTUS2:20171031T180211Z:2fa1b0d4-8e2e-446b-b685-6ecf4c1480b3',
  date: 'Tue, 31 Oct 2017 18:02:10 GMT',
  connection: 'close' });
 return result; },
function (nock) { 
var result = 
nock('https://management.azure.com:443')
  .get('/subscriptions/00000000-0000-0000-0000-000000000000/providers/Microsoft.BatchAI/locations/eastus/operationresults/3d999d23-9016-4f86-ba13-d331d678490a?api-version=2017-09-01-preview')
  .reply(200, "{\"id\":\"https://management.azure.com/subscriptions/00000000-0000-0000-0000-000000000000/providers/Microsoft.BatchAI/locations/eastus/operationresults/3d999d23-9016-4f86-ba13-d331d678490a\",\"name\":\"3d999d23-9016-4f86-ba13-d331d678490a\",\"status\":\"InProgress\",\"startTime\":\"2017-10-31T18:00:04.83Z\"}", { 'cache-control': 'no-cache',
  pragma: 'no-cache',
  'content-length': '293',
  'content-type': 'application/json; charset=utf-8',
  expires: '-1',
  'x-ms-ratelimit-remaining-subscription-reads': '14995',
  'request-id': 'b59b351f-75a7-4f91-a526-578d5f1ba3a7',
  'strict-transport-security': 'max-age=31536000; includeSubDomains',
  'x-content-type-options': 'nosniff',
  server: 'Microsoft-HTTPAPI/2.0',
  'x-ms-request-id': '2fa1b0d4-8e2e-446b-b685-6ecf4c1480b3',
  'x-ms-correlation-request-id': '2fa1b0d4-8e2e-446b-b685-6ecf4c1480b3',
  'x-ms-routing-request-id': 'WESTUS2:20171031T180211Z:2fa1b0d4-8e2e-446b-b685-6ecf4c1480b3',
  date: 'Tue, 31 Oct 2017 18:02:10 GMT',
  connection: 'close' });
 return result; },
function (nock) { 
var result = 
nock('http://management.azure.com:443')
  .get('/subscriptions/00000000-0000-0000-0000-000000000000/providers/Microsoft.BatchAI/locations/eastus/operationresults/3d999d23-9016-4f86-ba13-d331d678490a?api-version=2017-09-01-preview')
  .reply(200, "{\"id\":\"https://management.azure.com/subscriptions/00000000-0000-0000-0000-000000000000/providers/Microsoft.BatchAI/locations/eastus/operationresults/3d999d23-9016-4f86-ba13-d331d678490a\",\"name\":\"3d999d23-9016-4f86-ba13-d331d678490a\",\"status\":\"Succeeded\",\"startTime\":\"2017-10-31T18:00:04.83Z\",\"endTime\":\"2017-10-31T18:02:33.266Z\",\"properties\":{\"resourceId\":\"00000000-0000-0000-0000-000000000000$nodetestgroup143$cluster5\"}}", { 'cache-control': 'no-cache',
  pragma: 'no-cache',
  'content-length': '422',
  'content-type': 'application/json; charset=utf-8',
  expires: '-1',
  'x-ms-ratelimit-remaining-subscription-reads': '14995',
  'request-id': '0b71b11e-7361-477c-9bb6-fa6e04350f7b',
  'strict-transport-security': 'max-age=31536000; includeSubDomains',
  'x-content-type-options': 'nosniff',
  server: 'Microsoft-HTTPAPI/2.0',
  'x-ms-request-id': '44d8a075-9fa5-46c2-a02a-e836dabea9cc',
  'x-ms-correlation-request-id': '44d8a075-9fa5-46c2-a02a-e836dabea9cc',
  'x-ms-routing-request-id': 'WESTUS2:20171031T180241Z:44d8a075-9fa5-46c2-a02a-e836dabea9cc',
  date: 'Tue, 31 Oct 2017 18:02:40 GMT',
  connection: 'close' });
 return result; },
function (nock) { 
var result = 
nock('https://management.azure.com:443')
  .get('/subscriptions/00000000-0000-0000-0000-000000000000/providers/Microsoft.BatchAI/locations/eastus/operationresults/3d999d23-9016-4f86-ba13-d331d678490a?api-version=2017-09-01-preview')
  .reply(200, "{\"id\":\"https://management.azure.com/subscriptions/00000000-0000-0000-0000-000000000000/providers/Microsoft.BatchAI/locations/eastus/operationresults/3d999d23-9016-4f86-ba13-d331d678490a\",\"name\":\"3d999d23-9016-4f86-ba13-d331d678490a\",\"status\":\"Succeeded\",\"startTime\":\"2017-10-31T18:00:04.83Z\",\"endTime\":\"2017-10-31T18:02:33.266Z\",\"properties\":{\"resourceId\":\"00000000-0000-0000-0000-000000000000$nodetestgroup143$cluster5\"}}", { 'cache-control': 'no-cache',
  pragma: 'no-cache',
  'content-length': '422',
  'content-type': 'application/json; charset=utf-8',
  expires: '-1',
  'x-ms-ratelimit-remaining-subscription-reads': '14995',
  'request-id': '0b71b11e-7361-477c-9bb6-fa6e04350f7b',
  'strict-transport-security': 'max-age=31536000; includeSubDomains',
  'x-content-type-options': 'nosniff',
  server: 'Microsoft-HTTPAPI/2.0',
  'x-ms-request-id': '44d8a075-9fa5-46c2-a02a-e836dabea9cc',
  'x-ms-correlation-request-id': '44d8a075-9fa5-46c2-a02a-e836dabea9cc',
  'x-ms-routing-request-id': 'WESTUS2:20171031T180241Z:44d8a075-9fa5-46c2-a02a-e836dabea9cc',
  date: 'Tue, 31 Oct 2017 18:02:40 GMT',
  connection: 'close' });
 return result; },
function (nock) { 
var result = 
nock('http://management.azure.com:443')
  .get('/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/nodeTestGroup143/providers/Microsoft.BatchAI/clusters/cluster5?api-version=2017-09-01-preview')
  .reply(200, "{\"id\":\"/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/nodetestgroup143/providers/Microsoft.BatchAI/clusters/cluster5\",\"name\":\"cluster5\",\"type\":\"Microsoft.BatchAI/Clusters\",\"location\":\"eastus\",\"properties\":{\"provisioningState\":\"succeeded\",\"allocationState\":\"steady\",\"creationTime\":\"2017-10-31T18:00:04.815Z\",\"allocationStateTransitionTime\":\"2017-10-31T18:02:35.464Z\",\"provisioningStateTransitionTime\":\"2017-10-31T18:02:33.251Z\",\"vmSize\":\"STANDARD_D1\",\"currentNodeCount\":0,\"nodeStateCounts\":{\"runningNodeCount\":0,\"idleNodeCount\":0,\"unusableNodeCount\":0,\"preparingNodeCount\":0,\"leavingNodeCount\":0},\"vmPriority\":\"dedicated\",\"scaleSettings\":{\"manual\":{\"targetNodeCount\":0,\"nodeDeallocationOption\":\"requeue\"}},\"virtualMachineConfiguration\":{\"imageReference\":{\"publisher\":\"Canonical\",\"offer\":\"UbuntuServer\",\"sku\":\"16.04-LTS\",\"version\":\"16.04.201708151\"}},\"userAccountSettings\":{\"adminUserName\":\"username\",\"adminUserSSHPublicKey\":\"ssh-rsa AAAAB3NzaC1yc2EAAAADAQABAAABAQChWiUZgIS8fgKrB4wBBjJjoA4jtyfxWRgnbcz0pNPtplH8cL8TV/AzgE3GdYjbzbKg+dej9iVETS2kwfqDK7CXPljqwluN5S3CnZqeKETqagRQ6/IMuZhttKKVhVRtKIUqJFJeJ2/YtLJzvSE3QnVi+MedrJqC/Gm6A3bhLkIFPlTU3oXfLNz/2iG5ax/FgtNd1ukvMtplNifu4c8Y9iNxjcZR7/vRZUXg3V+hd1fYCJesJC6H3hmiszqjK119slb0ie7qmGB+1+0shs2+aT7wbCuqjKLKXHhOumGfgyPDcdaOm5GPGYeM/LERCi6uOS9bWlZEE3L63QeXeb2aRoOJ has_no_private_key\"},\"nodeSetup\":{\"mountVolumes\":{\"unmanagedFileSystems\":[{\"mountCommand\":\"mount -t nfs 10.0.0.4:/mnt/data\",\"relativeMountPath\":\"nfs\"}]}},\"subnet\":{\"id\":\"/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/fileserverrg-80f32a21-1417-44d2-a711-59ae5893e069/providers/Microsoft.Network/virtualNetworks/80f32a21-1417-44d2-a711-59ae5893e069vnet/subnets/Subnet-1\"}}}", { 'cache-control': 'no-cache',
  pragma: 'no-cache',
  'content-length': '1717',
  'content-type': 'application/json; charset=utf-8',
  expires: '-1',
  'last-modified': 'Tue, 31 Oct 2017 18:00:04 GMT',
  etag: '"0x8D520893700109F"',
  'x-ms-ratelimit-remaining-subscription-reads': '14996',
  'request-id': '03f124da-37fb-4fa7-a7e0-243428dde272',
  'strict-transport-security': 'max-age=31536000; includeSubDomains',
  'x-content-type-options': 'nosniff',
  server: 'Microsoft-HTTPAPI/2.0',
  'x-ms-request-id': 'c51d6f2d-4f60-46e8-a7c9-6abf58cc41bb',
  'x-ms-correlation-request-id': 'c51d6f2d-4f60-46e8-a7c9-6abf58cc41bb',
  'x-ms-routing-request-id': 'WESTUS2:20171031T180243Z:c51d6f2d-4f60-46e8-a7c9-6abf58cc41bb',
  date: 'Tue, 31 Oct 2017 18:02:42 GMT',
  connection: 'close' });
 return result; },
function (nock) { 
var result = 
nock('https://management.azure.com:443')
  .get('/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/nodeTestGroup143/providers/Microsoft.BatchAI/clusters/cluster5?api-version=2017-09-01-preview')
  .reply(200, "{\"id\":\"/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/nodetestgroup143/providers/Microsoft.BatchAI/clusters/cluster5\",\"name\":\"cluster5\",\"type\":\"Microsoft.BatchAI/Clusters\",\"location\":\"eastus\",\"properties\":{\"provisioningState\":\"succeeded\",\"allocationState\":\"steady\",\"creationTime\":\"2017-10-31T18:00:04.815Z\",\"allocationStateTransitionTime\":\"2017-10-31T18:02:35.464Z\",\"provisioningStateTransitionTime\":\"2017-10-31T18:02:33.251Z\",\"vmSize\":\"STANDARD_D1\",\"currentNodeCount\":0,\"nodeStateCounts\":{\"runningNodeCount\":0,\"idleNodeCount\":0,\"unusableNodeCount\":0,\"preparingNodeCount\":0,\"leavingNodeCount\":0},\"vmPriority\":\"dedicated\",\"scaleSettings\":{\"manual\":{\"targetNodeCount\":0,\"nodeDeallocationOption\":\"requeue\"}},\"virtualMachineConfiguration\":{\"imageReference\":{\"publisher\":\"Canonical\",\"offer\":\"UbuntuServer\",\"sku\":\"16.04-LTS\",\"version\":\"16.04.201708151\"}},\"userAccountSettings\":{\"adminUserName\":\"username\",\"adminUserSSHPublicKey\":\"ssh-rsa AAAAB3NzaC1yc2EAAAADAQABAAABAQChWiUZgIS8fgKrB4wBBjJjoA4jtyfxWRgnbcz0pNPtplH8cL8TV/AzgE3GdYjbzbKg+dej9iVETS2kwfqDK7CXPljqwluN5S3CnZqeKETqagRQ6/IMuZhttKKVhVRtKIUqJFJeJ2/YtLJzvSE3QnVi+MedrJqC/Gm6A3bhLkIFPlTU3oXfLNz/2iG5ax/FgtNd1ukvMtplNifu4c8Y9iNxjcZR7/vRZUXg3V+hd1fYCJesJC6H3hmiszqjK119slb0ie7qmGB+1+0shs2+aT7wbCuqjKLKXHhOumGfgyPDcdaOm5GPGYeM/LERCi6uOS9bWlZEE3L63QeXeb2aRoOJ has_no_private_key\"},\"nodeSetup\":{\"mountVolumes\":{\"unmanagedFileSystems\":[{\"mountCommand\":\"mount -t nfs 10.0.0.4:/mnt/data\",\"relativeMountPath\":\"nfs\"}]}},\"subnet\":{\"id\":\"/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/fileserverrg-80f32a21-1417-44d2-a711-59ae5893e069/providers/Microsoft.Network/virtualNetworks/80f32a21-1417-44d2-a711-59ae5893e069vnet/subnets/Subnet-1\"}}}", { 'cache-control': 'no-cache',
  pragma: 'no-cache',
  'content-length': '1717',
  'content-type': 'application/json; charset=utf-8',
  expires: '-1',
  'last-modified': 'Tue, 31 Oct 2017 18:00:04 GMT',
  etag: '"0x8D520893700109F"',
  'x-ms-ratelimit-remaining-subscription-reads': '14996',
  'request-id': '03f124da-37fb-4fa7-a7e0-243428dde272',
  'strict-transport-security': 'max-age=31536000; includeSubDomains',
  'x-content-type-options': 'nosniff',
  server: 'Microsoft-HTTPAPI/2.0',
  'x-ms-request-id': 'c51d6f2d-4f60-46e8-a7c9-6abf58cc41bb',
  'x-ms-correlation-request-id': 'c51d6f2d-4f60-46e8-a7c9-6abf58cc41bb',
  'x-ms-routing-request-id': 'WESTUS2:20171031T180243Z:c51d6f2d-4f60-46e8-a7c9-6abf58cc41bb',
  date: 'Tue, 31 Oct 2017 18:02:42 GMT',
  connection: 'close' });
 return result; }]];