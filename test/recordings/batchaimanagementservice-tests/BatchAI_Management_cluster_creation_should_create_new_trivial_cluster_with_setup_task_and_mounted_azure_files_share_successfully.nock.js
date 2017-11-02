exports.scopes = [[function (nock) {
var result = 
nock('http://management.azure.com:443')
  .filteringRequestBody(function (path) { return '*';})
.put('/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/nodeTestGroup143/providers/Microsoft.BatchAI/clusters/cluster6?api-version=2017-09-01-preview', '*')
  .reply(202, "", { 'cache-control': 'no-cache',
  pragma: 'no-cache',
  expires: '-1',
  location: 'https://management.azure.com/subscriptions/00000000-0000-0000-0000-000000000000/providers/Microsoft.BatchAI/locations/eastus/operationstatuses/91268713-06c0-4b7c-a41d-1878ed2db313?api-version=2017-09-01-preview',
  'retry-after': '15',
  'request-id': '659e33b0-0b1c-47de-bbbf-184d79053311',
  'strict-transport-security': 'max-age=31536000; includeSubDomains',
  'x-content-type-options': 'nosniff',
  'azure-asyncoperation': 'https://management.azure.com/subscriptions/00000000-0000-0000-0000-000000000000/providers/Microsoft.BatchAI/locations/eastus/operationresults/91268713-06c0-4b7c-a41d-1878ed2db313?api-version=2017-09-01-preview',
  server: 'Microsoft-HTTPAPI/2.0',
  'x-ms-ratelimit-remaining-subscription-writes': '1198',
  'x-ms-request-id': '93ff294e-443d-4a91-ae46-526060f80b80',
  'x-ms-correlation-request-id': '93ff294e-443d-4a91-ae46-526060f80b80',
  'x-ms-routing-request-id': 'WESTUS2:20171031T180245Z:93ff294e-443d-4a91-ae46-526060f80b80',
  date: 'Tue, 31 Oct 2017 18:02:44 GMT',
  connection: 'close',
  'content-length': '0' });
 return result; },
function (nock) { 
var result = 
nock('https://management.azure.com:443')
  .filteringRequestBody(function (path) { return '*';})
.put('/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/nodeTestGroup143/providers/Microsoft.BatchAI/clusters/cluster6?api-version=2017-09-01-preview', '*')
  .reply(202, "", { 'cache-control': 'no-cache',
  pragma: 'no-cache',
  expires: '-1',
  location: 'https://management.azure.com/subscriptions/00000000-0000-0000-0000-000000000000/providers/Microsoft.BatchAI/locations/eastus/operationstatuses/91268713-06c0-4b7c-a41d-1878ed2db313?api-version=2017-09-01-preview',
  'retry-after': '15',
  'request-id': '659e33b0-0b1c-47de-bbbf-184d79053311',
  'strict-transport-security': 'max-age=31536000; includeSubDomains',
  'x-content-type-options': 'nosniff',
  'azure-asyncoperation': 'https://management.azure.com/subscriptions/00000000-0000-0000-0000-000000000000/providers/Microsoft.BatchAI/locations/eastus/operationresults/91268713-06c0-4b7c-a41d-1878ed2db313?api-version=2017-09-01-preview',
  server: 'Microsoft-HTTPAPI/2.0',
  'x-ms-ratelimit-remaining-subscription-writes': '1198',
  'x-ms-request-id': '93ff294e-443d-4a91-ae46-526060f80b80',
  'x-ms-correlation-request-id': '93ff294e-443d-4a91-ae46-526060f80b80',
  'x-ms-routing-request-id': 'WESTUS2:20171031T180245Z:93ff294e-443d-4a91-ae46-526060f80b80',
  date: 'Tue, 31 Oct 2017 18:02:44 GMT',
  connection: 'close',
  'content-length': '0' });
 return result; },
function (nock) { 
var result = 
nock('http://management.azure.com:443')
  .get('/subscriptions/00000000-0000-0000-0000-000000000000/providers/Microsoft.BatchAI/locations/eastus/operationresults/91268713-06c0-4b7c-a41d-1878ed2db313?api-version=2017-09-01-preview')
  .reply(200, "{\"id\":\"https://management.azure.com/subscriptions/00000000-0000-0000-0000-000000000000/providers/Microsoft.BatchAI/locations/eastus/operationresults/91268713-06c0-4b7c-a41d-1878ed2db313\",\"name\":\"91268713-06c0-4b7c-a41d-1878ed2db313\",\"status\":\"Succeeded\",\"startTime\":\"2017-10-31T18:02:43.494Z\",\"endTime\":\"2017-10-31T18:02:44.088Z\",\"properties\":{\"resourceId\":\"00000000-0000-0000-0000-000000000000$nodetestgroup143$cluster6\"}}", { 'cache-control': 'no-cache',
  pragma: 'no-cache',
  'content-length': '423',
  'content-type': 'application/json; charset=utf-8',
  expires: '-1',
  'x-ms-ratelimit-remaining-subscription-reads': '14996',
  'request-id': '72d3dd4e-dc01-4146-b35b-ee80824de4ad',
  'strict-transport-security': 'max-age=31536000; includeSubDomains',
  'x-content-type-options': 'nosniff',
  server: 'Microsoft-HTTPAPI/2.0',
  'x-ms-request-id': 'f817005a-10aa-4c9e-a871-e3139e5bd683',
  'x-ms-correlation-request-id': 'f817005a-10aa-4c9e-a871-e3139e5bd683',
  'x-ms-routing-request-id': 'WESTUS2:20171031T180315Z:f817005a-10aa-4c9e-a871-e3139e5bd683',
  date: 'Tue, 31 Oct 2017 18:03:15 GMT',
  connection: 'close' });
 return result; },
function (nock) { 
var result = 
nock('https://management.azure.com:443')
  .get('/subscriptions/00000000-0000-0000-0000-000000000000/providers/Microsoft.BatchAI/locations/eastus/operationresults/91268713-06c0-4b7c-a41d-1878ed2db313?api-version=2017-09-01-preview')
  .reply(200, "{\"id\":\"https://management.azure.com/subscriptions/00000000-0000-0000-0000-000000000000/providers/Microsoft.BatchAI/locations/eastus/operationresults/91268713-06c0-4b7c-a41d-1878ed2db313\",\"name\":\"91268713-06c0-4b7c-a41d-1878ed2db313\",\"status\":\"Succeeded\",\"startTime\":\"2017-10-31T18:02:43.494Z\",\"endTime\":\"2017-10-31T18:02:44.088Z\",\"properties\":{\"resourceId\":\"00000000-0000-0000-0000-000000000000$nodetestgroup143$cluster6\"}}", { 'cache-control': 'no-cache',
  pragma: 'no-cache',
  'content-length': '423',
  'content-type': 'application/json; charset=utf-8',
  expires: '-1',
  'x-ms-ratelimit-remaining-subscription-reads': '14996',
  'request-id': '72d3dd4e-dc01-4146-b35b-ee80824de4ad',
  'strict-transport-security': 'max-age=31536000; includeSubDomains',
  'x-content-type-options': 'nosniff',
  server: 'Microsoft-HTTPAPI/2.0',
  'x-ms-request-id': 'f817005a-10aa-4c9e-a871-e3139e5bd683',
  'x-ms-correlation-request-id': 'f817005a-10aa-4c9e-a871-e3139e5bd683',
  'x-ms-routing-request-id': 'WESTUS2:20171031T180315Z:f817005a-10aa-4c9e-a871-e3139e5bd683',
  date: 'Tue, 31 Oct 2017 18:03:15 GMT',
  connection: 'close' });
 return result; },
function (nock) { 
var result = 
nock('http://management.azure.com:443')
  .get('/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/nodeTestGroup143/providers/Microsoft.BatchAI/clusters/cluster6?api-version=2017-09-01-preview')
  .reply(200, "{\"id\":\"/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/nodetestgroup143/providers/Microsoft.BatchAI/clusters/cluster6\",\"name\":\"cluster6\",\"type\":\"Microsoft.BatchAI/Clusters\",\"location\":\"eastus\",\"properties\":{\"provisioningState\":\"succeeded\",\"allocationState\":\"steady\",\"creationTime\":\"2017-10-31T18:02:43.478Z\",\"allocationStateTransitionTime\":\"2017-10-31T18:02:46.507Z\",\"provisioningStateTransitionTime\":\"2017-10-31T18:02:44.072Z\",\"vmSize\":\"STANDARD_D1\",\"currentNodeCount\":0,\"nodeStateCounts\":{\"runningNodeCount\":0,\"idleNodeCount\":0,\"unusableNodeCount\":0,\"preparingNodeCount\":0,\"leavingNodeCount\":0},\"vmPriority\":\"dedicated\",\"scaleSettings\":{\"manual\":{\"targetNodeCount\":0,\"nodeDeallocationOption\":\"requeue\"}},\"virtualMachineConfiguration\":{\"imageReference\":{\"publisher\":\"Canonical\",\"offer\":\"UbuntuServer\",\"sku\":\"16.04-LTS\",\"version\":\"16.04.201708151\"}},\"userAccountSettings\":{\"adminUserName\":\"username\",\"adminUserSSHPublicKey\":\"ssh-rsa AAAAB3NzaC1yc2EAAAADAQABAAABAQChWiUZgIS8fgKrB4wBBjJjoA4jtyfxWRgnbcz0pNPtplH8cL8TV/AzgE3GdYjbzbKg+dej9iVETS2kwfqDK7CXPljqwluN5S3CnZqeKETqagRQ6/IMuZhttKKVhVRtKIUqJFJeJ2/YtLJzvSE3QnVi+MedrJqC/Gm6A3bhLkIFPlTU3oXfLNz/2iG5ax/FgtNd1ukvMtplNifu4c8Y9iNxjcZR7/vRZUXg3V+hd1fYCJesJC6H3hmiszqjK119slb0ie7qmGB+1+0shs2+aT7wbCuqjKLKXHhOumGfgyPDcdaOm5GPGYeM/LERCi6uOS9bWlZEE3L63QeXeb2aRoOJ has_no_private_key\"},\"nodeSetup\":{\"setupTask\":{\"commandLine\":\"echo Hello\",\"environmentVariables\":[{\"name\":\"ENVIRONMENT_VARIABLE_1\",\"value\":\"Value1\"},{\"name\":\"ENVIRONMENT_VARIABLE_2\",\"value\":\"Value2\"}],\"runElevated\":true,\"stdOutErrPathPrefix\":\"$AZ_BATCHAI_MOUNT_ROOT/azfs\"},\"mountVolumes\":{\"azureFileShares\":[{\"accountName\":\"testacc9517\",\"azureFileUrl\":\"https://testacc9517.file.core.windows.net/azfileshare\",\"credentials\":{},\"relativeMountPath\":\"azfs\",\"fileMode\":\"0777\",\"directoryMode\":\"0777\"}]}}}}", { 'cache-control': 'no-cache',
  pragma: 'no-cache',
  'content-length': '1823',
  'content-type': 'application/json; charset=utf-8',
  expires: '-1',
  'last-modified': 'Tue, 31 Oct 2017 18:02:43 GMT',
  etag: '"0x8D52089959233FA"',
  'x-ms-ratelimit-remaining-subscription-reads': '14996',
  'request-id': '14fd14fc-cadd-4458-bccb-da83b0a9e4a2',
  'strict-transport-security': 'max-age=31536000; includeSubDomains',
  'x-content-type-options': 'nosniff',
  server: 'Microsoft-HTTPAPI/2.0',
  'x-ms-request-id': 'd08319f7-c38c-4d91-a8ca-01ad0b3ae4b2',
  'x-ms-correlation-request-id': 'd08319f7-c38c-4d91-a8ca-01ad0b3ae4b2',
  'x-ms-routing-request-id': 'WESTUS2:20171031T180316Z:d08319f7-c38c-4d91-a8ca-01ad0b3ae4b2',
  date: 'Tue, 31 Oct 2017 18:03:15 GMT',
  connection: 'close' });
 return result; },
function (nock) { 
var result = 
nock('https://management.azure.com:443')
  .get('/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/nodeTestGroup143/providers/Microsoft.BatchAI/clusters/cluster6?api-version=2017-09-01-preview')
  .reply(200, "{\"id\":\"/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/nodetestgroup143/providers/Microsoft.BatchAI/clusters/cluster6\",\"name\":\"cluster6\",\"type\":\"Microsoft.BatchAI/Clusters\",\"location\":\"eastus\",\"properties\":{\"provisioningState\":\"succeeded\",\"allocationState\":\"steady\",\"creationTime\":\"2017-10-31T18:02:43.478Z\",\"allocationStateTransitionTime\":\"2017-10-31T18:02:46.507Z\",\"provisioningStateTransitionTime\":\"2017-10-31T18:02:44.072Z\",\"vmSize\":\"STANDARD_D1\",\"currentNodeCount\":0,\"nodeStateCounts\":{\"runningNodeCount\":0,\"idleNodeCount\":0,\"unusableNodeCount\":0,\"preparingNodeCount\":0,\"leavingNodeCount\":0},\"vmPriority\":\"dedicated\",\"scaleSettings\":{\"manual\":{\"targetNodeCount\":0,\"nodeDeallocationOption\":\"requeue\"}},\"virtualMachineConfiguration\":{\"imageReference\":{\"publisher\":\"Canonical\",\"offer\":\"UbuntuServer\",\"sku\":\"16.04-LTS\",\"version\":\"16.04.201708151\"}},\"userAccountSettings\":{\"adminUserName\":\"username\",\"adminUserSSHPublicKey\":\"ssh-rsa AAAAB3NzaC1yc2EAAAADAQABAAABAQChWiUZgIS8fgKrB4wBBjJjoA4jtyfxWRgnbcz0pNPtplH8cL8TV/AzgE3GdYjbzbKg+dej9iVETS2kwfqDK7CXPljqwluN5S3CnZqeKETqagRQ6/IMuZhttKKVhVRtKIUqJFJeJ2/YtLJzvSE3QnVi+MedrJqC/Gm6A3bhLkIFPlTU3oXfLNz/2iG5ax/FgtNd1ukvMtplNifu4c8Y9iNxjcZR7/vRZUXg3V+hd1fYCJesJC6H3hmiszqjK119slb0ie7qmGB+1+0shs2+aT7wbCuqjKLKXHhOumGfgyPDcdaOm5GPGYeM/LERCi6uOS9bWlZEE3L63QeXeb2aRoOJ has_no_private_key\"},\"nodeSetup\":{\"setupTask\":{\"commandLine\":\"echo Hello\",\"environmentVariables\":[{\"name\":\"ENVIRONMENT_VARIABLE_1\",\"value\":\"Value1\"},{\"name\":\"ENVIRONMENT_VARIABLE_2\",\"value\":\"Value2\"}],\"runElevated\":true,\"stdOutErrPathPrefix\":\"$AZ_BATCHAI_MOUNT_ROOT/azfs\"},\"mountVolumes\":{\"azureFileShares\":[{\"accountName\":\"testacc9517\",\"azureFileUrl\":\"https://testacc9517.file.core.windows.net/azfileshare\",\"credentials\":{},\"relativeMountPath\":\"azfs\",\"fileMode\":\"0777\",\"directoryMode\":\"0777\"}]}}}}", { 'cache-control': 'no-cache',
  pragma: 'no-cache',
  'content-length': '1823',
  'content-type': 'application/json; charset=utf-8',
  expires: '-1',
  'last-modified': 'Tue, 31 Oct 2017 18:02:43 GMT',
  etag: '"0x8D52089959233FA"',
  'x-ms-ratelimit-remaining-subscription-reads': '14996',
  'request-id': '14fd14fc-cadd-4458-bccb-da83b0a9e4a2',
  'strict-transport-security': 'max-age=31536000; includeSubDomains',
  'x-content-type-options': 'nosniff',
  server: 'Microsoft-HTTPAPI/2.0',
  'x-ms-request-id': 'd08319f7-c38c-4d91-a8ca-01ad0b3ae4b2',
  'x-ms-correlation-request-id': 'd08319f7-c38c-4d91-a8ca-01ad0b3ae4b2',
  'x-ms-routing-request-id': 'WESTUS2:20171031T180316Z:d08319f7-c38c-4d91-a8ca-01ad0b3ae4b2',
  date: 'Tue, 31 Oct 2017 18:03:15 GMT',
  connection: 'close' });
 return result; }]];