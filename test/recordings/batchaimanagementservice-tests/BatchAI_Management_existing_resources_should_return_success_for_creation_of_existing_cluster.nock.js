exports.scopes = [[function (nock) {
var result = 
nock('http://management.azure.com:443')
  .filteringRequestBody(function (path) { return '*';})
.put('/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/nodeTestGroup143/providers/Microsoft.BatchAI/clusters/cluster?api-version=2017-09-01-preview', '*')
  .reply(200, "{\"id\":\"/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/nodeTestGroup143/providers/Microsoft.BatchAI/clusters/cluster\",\"name\":\"cluster\",\"type\":\"Microsoft.BatchAI/Clusters\",\"location\":\"eastus\",\"properties\":{\"provisioningState\":\"succeeded\",\"allocationState\":\"resizing\",\"creationTime\":\"2017-11-08T18:09:09.788Z\",\"allocationStateTransitionTime\":\"2017-11-08T18:09:10.306Z\",\"provisioningStateTransitionTime\":\"2017-11-08T18:09:10.585Z\",\"vmSize\":\"STANDARD_D1\",\"currentNodeCount\":0,\"nodeStateCounts\":{\"runningNodeCount\":0,\"idleNodeCount\":0,\"unusableNodeCount\":0,\"preparingNodeCount\":0,\"leavingNodeCount\":0},\"vmPriority\":\"dedicated\",\"scaleSettings\":{\"manual\":{\"targetNodeCount\":1,\"nodeDeallocationOption\":\"requeue\"}},\"virtualMachineConfiguration\":{\"imageReference\":{\"publisher\":\"Canonical\",\"offer\":\"UbuntuServer\",\"sku\":\"16.04-LTS\",\"version\":\"16.04.201708151\"}},\"userAccountSettings\":{\"adminUserName\":\"username\",\"adminUserSSHPublicKey\":\"ssh-rsa AAAAB3NzaC1yc2EAAAADAQABAAABAQChWiUZgIS8fgKrB4wBBjJjoA4jtyfxWRgnbcz0pNPtplH8cL8TV/AzgE3GdYjbzbKg+dej9iVETS2kwfqDK7CXPljqwluN5S3CnZqeKETqagRQ6/IMuZhttKKVhVRtKIUqJFJeJ2/YtLJzvSE3QnVi+MedrJqC/Gm6A3bhLkIFPlTU3oXfLNz/2iG5ax/FgtNd1ukvMtplNifu4c8Y9iNxjcZR7/vRZUXg3V+hd1fYCJesJC6H3hmiszqjK119slb0ie7qmGB+1+0shs2+aT7wbCuqjKLKXHhOumGfgyPDcdaOm5GPGYeM/LERCi6uOS9bWlZEE3L63QeXeb2aRoOJ has_no_private_key\"},\"nodeSetup\":{\"mountVolumes\":{\"azureFileShares\":[{\"accountName\":\"testacc5598\",\"azureFileUrl\":\"https://testacc5598.file.core.windows.net/azfileshare\",\"credentials\":{},\"relativeMountPath\":\"azfs\",\"fileMode\":\"0777\",\"directoryMode\":\"0777\"}]}}}}", { 'cache-control': 'no-cache',
  pragma: 'no-cache',
  'content-length': '1585',
  'content-type': 'application/json; charset=utf-8',
  expires: '-1',
  'last-modified': 'Wed, 08 Nov 2017 18:09:09 GMT',
  etag: '"0x8D526D3CF226349"',
  'x-ms-ratelimit-remaining-subscription-writes': '1199',
  'request-id': '5c7715e5-cc15-434e-ae1f-042d854f58e6',
  'strict-transport-security': 'max-age=31536000; includeSubDomains',
  'x-content-type-options': 'nosniff',
  server: 'Microsoft-HTTPAPI/2.0',
  'x-ms-request-id': '9dbb8369-eff2-493f-97f2-c0860bd9353c',
  'x-ms-correlation-request-id': '9dbb8369-eff2-493f-97f2-c0860bd9353c',
  'x-ms-routing-request-id': 'WESTUS2:20171108T181309Z:9dbb8369-eff2-493f-97f2-c0860bd9353c',
  date: 'Wed, 08 Nov 2017 18:13:08 GMT',
  connection: 'close' });
 return result; },
function (nock) { 
var result = 
nock('https://management.azure.com:443')
  .filteringRequestBody(function (path) { return '*';})
.put('/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/nodeTestGroup143/providers/Microsoft.BatchAI/clusters/cluster?api-version=2017-09-01-preview', '*')
  .reply(200, "{\"id\":\"/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/nodeTestGroup143/providers/Microsoft.BatchAI/clusters/cluster\",\"name\":\"cluster\",\"type\":\"Microsoft.BatchAI/Clusters\",\"location\":\"eastus\",\"properties\":{\"provisioningState\":\"succeeded\",\"allocationState\":\"resizing\",\"creationTime\":\"2017-11-08T18:09:09.788Z\",\"allocationStateTransitionTime\":\"2017-11-08T18:09:10.306Z\",\"provisioningStateTransitionTime\":\"2017-11-08T18:09:10.585Z\",\"vmSize\":\"STANDARD_D1\",\"currentNodeCount\":0,\"nodeStateCounts\":{\"runningNodeCount\":0,\"idleNodeCount\":0,\"unusableNodeCount\":0,\"preparingNodeCount\":0,\"leavingNodeCount\":0},\"vmPriority\":\"dedicated\",\"scaleSettings\":{\"manual\":{\"targetNodeCount\":1,\"nodeDeallocationOption\":\"requeue\"}},\"virtualMachineConfiguration\":{\"imageReference\":{\"publisher\":\"Canonical\",\"offer\":\"UbuntuServer\",\"sku\":\"16.04-LTS\",\"version\":\"16.04.201708151\"}},\"userAccountSettings\":{\"adminUserName\":\"username\",\"adminUserSSHPublicKey\":\"ssh-rsa AAAAB3NzaC1yc2EAAAADAQABAAABAQChWiUZgIS8fgKrB4wBBjJjoA4jtyfxWRgnbcz0pNPtplH8cL8TV/AzgE3GdYjbzbKg+dej9iVETS2kwfqDK7CXPljqwluN5S3CnZqeKETqagRQ6/IMuZhttKKVhVRtKIUqJFJeJ2/YtLJzvSE3QnVi+MedrJqC/Gm6A3bhLkIFPlTU3oXfLNz/2iG5ax/FgtNd1ukvMtplNifu4c8Y9iNxjcZR7/vRZUXg3V+hd1fYCJesJC6H3hmiszqjK119slb0ie7qmGB+1+0shs2+aT7wbCuqjKLKXHhOumGfgyPDcdaOm5GPGYeM/LERCi6uOS9bWlZEE3L63QeXeb2aRoOJ has_no_private_key\"},\"nodeSetup\":{\"mountVolumes\":{\"azureFileShares\":[{\"accountName\":\"testacc5598\",\"azureFileUrl\":\"https://testacc5598.file.core.windows.net/azfileshare\",\"credentials\":{},\"relativeMountPath\":\"azfs\",\"fileMode\":\"0777\",\"directoryMode\":\"0777\"}]}}}}", { 'cache-control': 'no-cache',
  pragma: 'no-cache',
  'content-length': '1585',
  'content-type': 'application/json; charset=utf-8',
  expires: '-1',
  'last-modified': 'Wed, 08 Nov 2017 18:09:09 GMT',
  etag: '"0x8D526D3CF226349"',
  'x-ms-ratelimit-remaining-subscription-writes': '1199',
  'request-id': '5c7715e5-cc15-434e-ae1f-042d854f58e6',
  'strict-transport-security': 'max-age=31536000; includeSubDomains',
  'x-content-type-options': 'nosniff',
  server: 'Microsoft-HTTPAPI/2.0',
  'x-ms-request-id': '9dbb8369-eff2-493f-97f2-c0860bd9353c',
  'x-ms-correlation-request-id': '9dbb8369-eff2-493f-97f2-c0860bd9353c',
  'x-ms-routing-request-id': 'WESTUS2:20171108T181309Z:9dbb8369-eff2-493f-97f2-c0860bd9353c',
  date: 'Wed, 08 Nov 2017 18:13:08 GMT',
  connection: 'close' });
 return result; }]];
 exports.randomTestIdsGenerated = function() { return [,'testacc5598'];};