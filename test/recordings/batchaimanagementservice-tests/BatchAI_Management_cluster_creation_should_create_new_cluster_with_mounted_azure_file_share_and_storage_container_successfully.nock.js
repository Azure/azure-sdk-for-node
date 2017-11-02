exports.scopes = [[function (nock) {
var result = 
nock('http://management.azure.com:443')
  .filteringRequestBody(function (path) { return '*';})
.put('/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/nodeTestGroup143/providers/Microsoft.BatchAI/clusters/cluster3?api-version=2017-09-01-preview', '*')
  .reply(202, "", { 'cache-control': 'no-cache',
  pragma: 'no-cache',
  expires: '-1',
  location: 'https://management.azure.com/subscriptions/00000000-0000-0000-0000-000000000000/providers/Microsoft.BatchAI/locations/eastus/operationstatuses/3583972d-c15b-4ce2-a215-7e1a06672e66?api-version=2017-09-01-preview',
  'retry-after': '15',
  'request-id': '5b478f1b-3da9-468c-8ba5-576663a9a4ef',
  'strict-transport-security': 'max-age=31536000; includeSubDomains',
  'x-content-type-options': 'nosniff',
  'azure-asyncoperation': 'https://management.azure.com/subscriptions/00000000-0000-0000-0000-000000000000/providers/Microsoft.BatchAI/locations/eastus/operationresults/3583972d-c15b-4ce2-a215-7e1a06672e66?api-version=2017-09-01-preview',
  server: 'Microsoft-HTTPAPI/2.0',
  'x-ms-ratelimit-remaining-subscription-writes': '1198',
  'x-ms-request-id': 'd38f139d-db92-4d3e-a331-3201f11e754c',
  'x-ms-correlation-request-id': 'd38f139d-db92-4d3e-a331-3201f11e754c',
  'x-ms-routing-request-id': 'WESTUS2:20171031T175859Z:d38f139d-db92-4d3e-a331-3201f11e754c',
  date: 'Tue, 31 Oct 2017 17:58:58 GMT',
  connection: 'close',
  'content-length': '0' });
 return result; },
function (nock) { 
var result = 
nock('https://management.azure.com:443')
  .filteringRequestBody(function (path) { return '*';})
.put('/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/nodeTestGroup143/providers/Microsoft.BatchAI/clusters/cluster3?api-version=2017-09-01-preview', '*')
  .reply(202, "", { 'cache-control': 'no-cache',
  pragma: 'no-cache',
  expires: '-1',
  location: 'https://management.azure.com/subscriptions/00000000-0000-0000-0000-000000000000/providers/Microsoft.BatchAI/locations/eastus/operationstatuses/3583972d-c15b-4ce2-a215-7e1a06672e66?api-version=2017-09-01-preview',
  'retry-after': '15',
  'request-id': '5b478f1b-3da9-468c-8ba5-576663a9a4ef',
  'strict-transport-security': 'max-age=31536000; includeSubDomains',
  'x-content-type-options': 'nosniff',
  'azure-asyncoperation': 'https://management.azure.com/subscriptions/00000000-0000-0000-0000-000000000000/providers/Microsoft.BatchAI/locations/eastus/operationresults/3583972d-c15b-4ce2-a215-7e1a06672e66?api-version=2017-09-01-preview',
  server: 'Microsoft-HTTPAPI/2.0',
  'x-ms-ratelimit-remaining-subscription-writes': '1198',
  'x-ms-request-id': 'd38f139d-db92-4d3e-a331-3201f11e754c',
  'x-ms-correlation-request-id': 'd38f139d-db92-4d3e-a331-3201f11e754c',
  'x-ms-routing-request-id': 'WESTUS2:20171031T175859Z:d38f139d-db92-4d3e-a331-3201f11e754c',
  date: 'Tue, 31 Oct 2017 17:58:58 GMT',
  connection: 'close',
  'content-length': '0' });
 return result; },
function (nock) { 
var result = 
nock('http://management.azure.com:443')
  .get('/subscriptions/00000000-0000-0000-0000-000000000000/providers/Microsoft.BatchAI/locations/eastus/operationresults/3583972d-c15b-4ce2-a215-7e1a06672e66?api-version=2017-09-01-preview')
  .reply(200, "{\"id\":\"https://management.azure.com/subscriptions/00000000-0000-0000-0000-000000000000/providers/Microsoft.BatchAI/locations/eastus/operationresults/3583972d-c15b-4ce2-a215-7e1a06672e66\",\"name\":\"3583972d-c15b-4ce2-a215-7e1a06672e66\",\"status\":\"Succeeded\",\"startTime\":\"2017-10-31T17:58:57.379Z\",\"endTime\":\"2017-10-31T17:58:58.144Z\",\"properties\":{\"resourceId\":\"00000000-0000-0000-0000-000000000000$nodetestgroup143$cluster3\"}}", { 'cache-control': 'no-cache',
  pragma: 'no-cache',
  'content-length': '423',
  'content-type': 'application/json; charset=utf-8',
  expires: '-1',
  'x-ms-ratelimit-remaining-subscription-reads': '14997',
  'request-id': 'bad42754-193d-4198-ae66-6f3f22ef6de4',
  'strict-transport-security': 'max-age=31536000; includeSubDomains',
  'x-content-type-options': 'nosniff',
  server: 'Microsoft-HTTPAPI/2.0',
  'x-ms-request-id': 'a75b3fb3-df56-4d42-b453-ab6adebbe8d6',
  'x-ms-correlation-request-id': 'a75b3fb3-df56-4d42-b453-ab6adebbe8d6',
  'x-ms-routing-request-id': 'WESTUS2:20171031T175929Z:a75b3fb3-df56-4d42-b453-ab6adebbe8d6',
  date: 'Tue, 31 Oct 2017 17:59:29 GMT',
  connection: 'close' });
 return result; },
function (nock) { 
var result = 
nock('https://management.azure.com:443')
  .get('/subscriptions/00000000-0000-0000-0000-000000000000/providers/Microsoft.BatchAI/locations/eastus/operationresults/3583972d-c15b-4ce2-a215-7e1a06672e66?api-version=2017-09-01-preview')
  .reply(200, "{\"id\":\"https://management.azure.com/subscriptions/00000000-0000-0000-0000-000000000000/providers/Microsoft.BatchAI/locations/eastus/operationresults/3583972d-c15b-4ce2-a215-7e1a06672e66\",\"name\":\"3583972d-c15b-4ce2-a215-7e1a06672e66\",\"status\":\"Succeeded\",\"startTime\":\"2017-10-31T17:58:57.379Z\",\"endTime\":\"2017-10-31T17:58:58.144Z\",\"properties\":{\"resourceId\":\"00000000-0000-0000-0000-000000000000$nodetestgroup143$cluster3\"}}", { 'cache-control': 'no-cache',
  pragma: 'no-cache',
  'content-length': '423',
  'content-type': 'application/json; charset=utf-8',
  expires: '-1',
  'x-ms-ratelimit-remaining-subscription-reads': '14997',
  'request-id': 'bad42754-193d-4198-ae66-6f3f22ef6de4',
  'strict-transport-security': 'max-age=31536000; includeSubDomains',
  'x-content-type-options': 'nosniff',
  server: 'Microsoft-HTTPAPI/2.0',
  'x-ms-request-id': 'a75b3fb3-df56-4d42-b453-ab6adebbe8d6',
  'x-ms-correlation-request-id': 'a75b3fb3-df56-4d42-b453-ab6adebbe8d6',
  'x-ms-routing-request-id': 'WESTUS2:20171031T175929Z:a75b3fb3-df56-4d42-b453-ab6adebbe8d6',
  date: 'Tue, 31 Oct 2017 17:59:29 GMT',
  connection: 'close' });
 return result; },
function (nock) { 
var result = 
nock('http://management.azure.com:443')
  .get('/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/nodeTestGroup143/providers/Microsoft.BatchAI/clusters/cluster3?api-version=2017-09-01-preview')
  .reply(200, "{\"id\":\"/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/nodetestgroup143/providers/Microsoft.BatchAI/clusters/cluster3\",\"name\":\"cluster3\",\"type\":\"Microsoft.BatchAI/Clusters\",\"location\":\"eastus\",\"properties\":{\"provisioningState\":\"succeeded\",\"allocationState\":\"steady\",\"creationTime\":\"2017-10-31T17:58:57.363Z\",\"allocationStateTransitionTime\":\"2017-10-31T17:59:00.179Z\",\"provisioningStateTransitionTime\":\"2017-10-31T17:58:58.129Z\",\"vmSize\":\"STANDARD_D1\",\"currentNodeCount\":0,\"nodeStateCounts\":{\"runningNodeCount\":0,\"idleNodeCount\":0,\"unusableNodeCount\":0,\"preparingNodeCount\":0,\"leavingNodeCount\":0},\"vmPriority\":\"dedicated\",\"scaleSettings\":{\"manual\":{\"targetNodeCount\":0,\"nodeDeallocationOption\":\"requeue\"}},\"virtualMachineConfiguration\":{\"imageReference\":{\"publisher\":\"Canonical\",\"offer\":\"UbuntuServer\",\"sku\":\"16.04-LTS\",\"version\":\"16.04.201708151\"}},\"userAccountSettings\":{\"adminUserName\":\"username\",\"adminUserSSHPublicKey\":\"ssh-rsa AAAAB3NzaC1yc2EAAAADAQABAAABAQChWiUZgIS8fgKrB4wBBjJjoA4jtyfxWRgnbcz0pNPtplH8cL8TV/AzgE3GdYjbzbKg+dej9iVETS2kwfqDK7CXPljqwluN5S3CnZqeKETqagRQ6/IMuZhttKKVhVRtKIUqJFJeJ2/YtLJzvSE3QnVi+MedrJqC/Gm6A3bhLkIFPlTU3oXfLNz/2iG5ax/FgtNd1ukvMtplNifu4c8Y9iNxjcZR7/vRZUXg3V+hd1fYCJesJC6H3hmiszqjK119slb0ie7qmGB+1+0shs2+aT7wbCuqjKLKXHhOumGfgyPDcdaOm5GPGYeM/LERCi6uOS9bWlZEE3L63QeXeb2aRoOJ has_no_private_key\"},\"nodeSetup\":{\"mountVolumes\":{\"azureFileShares\":[{\"accountName\":\"testacc9517\",\"azureFileUrl\":\"https://testacc9517.file.core.windows.net/azfileshare\",\"credentials\":{},\"relativeMountPath\":\"azfs\",\"fileMode\":\"0777\",\"directoryMode\":\"0777\"}],\"azureBlobFileSystems\":[{\"accountName\":\"testacc9517\",\"containerName\":\"azcontainer\",\"credentials\":{},\"relativeMountPath\":\"azcs\"}]}}}}", { 'cache-control': 'no-cache',
  pragma: 'no-cache',
  'content-length': '1713',
  'content-type': 'application/json; charset=utf-8',
  expires: '-1',
  'last-modified': 'Tue, 31 Oct 2017 17:58:57 GMT',
  etag: '"0x8D520890ECBBE12"',
  'x-ms-ratelimit-remaining-subscription-reads': '14995',
  'request-id': 'd9101273-b891-4355-8af1-b7e3e2df9241',
  'strict-transport-security': 'max-age=31536000; includeSubDomains',
  'x-content-type-options': 'nosniff',
  server: 'Microsoft-HTTPAPI/2.0',
  'x-ms-request-id': '1e48a9e8-fbbc-4ea1-aaf1-5fc37fae2637',
  'x-ms-correlation-request-id': '1e48a9e8-fbbc-4ea1-aaf1-5fc37fae2637',
  'x-ms-routing-request-id': 'WESTUS2:20171031T175930Z:1e48a9e8-fbbc-4ea1-aaf1-5fc37fae2637',
  date: 'Tue, 31 Oct 2017 17:59:29 GMT',
  connection: 'close' });
 return result; },
function (nock) { 
var result = 
nock('https://management.azure.com:443')
  .get('/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/nodeTestGroup143/providers/Microsoft.BatchAI/clusters/cluster3?api-version=2017-09-01-preview')
  .reply(200, "{\"id\":\"/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/nodetestgroup143/providers/Microsoft.BatchAI/clusters/cluster3\",\"name\":\"cluster3\",\"type\":\"Microsoft.BatchAI/Clusters\",\"location\":\"eastus\",\"properties\":{\"provisioningState\":\"succeeded\",\"allocationState\":\"steady\",\"creationTime\":\"2017-10-31T17:58:57.363Z\",\"allocationStateTransitionTime\":\"2017-10-31T17:59:00.179Z\",\"provisioningStateTransitionTime\":\"2017-10-31T17:58:58.129Z\",\"vmSize\":\"STANDARD_D1\",\"currentNodeCount\":0,\"nodeStateCounts\":{\"runningNodeCount\":0,\"idleNodeCount\":0,\"unusableNodeCount\":0,\"preparingNodeCount\":0,\"leavingNodeCount\":0},\"vmPriority\":\"dedicated\",\"scaleSettings\":{\"manual\":{\"targetNodeCount\":0,\"nodeDeallocationOption\":\"requeue\"}},\"virtualMachineConfiguration\":{\"imageReference\":{\"publisher\":\"Canonical\",\"offer\":\"UbuntuServer\",\"sku\":\"16.04-LTS\",\"version\":\"16.04.201708151\"}},\"userAccountSettings\":{\"adminUserName\":\"username\",\"adminUserSSHPublicKey\":\"ssh-rsa AAAAB3NzaC1yc2EAAAADAQABAAABAQChWiUZgIS8fgKrB4wBBjJjoA4jtyfxWRgnbcz0pNPtplH8cL8TV/AzgE3GdYjbzbKg+dej9iVETS2kwfqDK7CXPljqwluN5S3CnZqeKETqagRQ6/IMuZhttKKVhVRtKIUqJFJeJ2/YtLJzvSE3QnVi+MedrJqC/Gm6A3bhLkIFPlTU3oXfLNz/2iG5ax/FgtNd1ukvMtplNifu4c8Y9iNxjcZR7/vRZUXg3V+hd1fYCJesJC6H3hmiszqjK119slb0ie7qmGB+1+0shs2+aT7wbCuqjKLKXHhOumGfgyPDcdaOm5GPGYeM/LERCi6uOS9bWlZEE3L63QeXeb2aRoOJ has_no_private_key\"},\"nodeSetup\":{\"mountVolumes\":{\"azureFileShares\":[{\"accountName\":\"testacc9517\",\"azureFileUrl\":\"https://testacc9517.file.core.windows.net/azfileshare\",\"credentials\":{},\"relativeMountPath\":\"azfs\",\"fileMode\":\"0777\",\"directoryMode\":\"0777\"}],\"azureBlobFileSystems\":[{\"accountName\":\"testacc9517\",\"containerName\":\"azcontainer\",\"credentials\":{},\"relativeMountPath\":\"azcs\"}]}}}}", { 'cache-control': 'no-cache',
  pragma: 'no-cache',
  'content-length': '1713',
  'content-type': 'application/json; charset=utf-8',
  expires: '-1',
  'last-modified': 'Tue, 31 Oct 2017 17:58:57 GMT',
  etag: '"0x8D520890ECBBE12"',
  'x-ms-ratelimit-remaining-subscription-reads': '14995',
  'request-id': 'd9101273-b891-4355-8af1-b7e3e2df9241',
  'strict-transport-security': 'max-age=31536000; includeSubDomains',
  'x-content-type-options': 'nosniff',
  server: 'Microsoft-HTTPAPI/2.0',
  'x-ms-request-id': '1e48a9e8-fbbc-4ea1-aaf1-5fc37fae2637',
  'x-ms-correlation-request-id': '1e48a9e8-fbbc-4ea1-aaf1-5fc37fae2637',
  'x-ms-routing-request-id': 'WESTUS2:20171031T175930Z:1e48a9e8-fbbc-4ea1-aaf1-5fc37fae2637',
  date: 'Tue, 31 Oct 2017 17:59:29 GMT',
  connection: 'close' });
 return result; }]];