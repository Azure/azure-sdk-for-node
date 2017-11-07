exports.scopes = [[function (nock) { 
var result = 
nock('http://management.azure.com:443')
  .get('/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/nodeTestGroup143/providers/Microsoft.BatchAI/clusters/cluster?api-version=2017-09-01-preview')
  .reply(200, "{\"id\":\"/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/nodetestgroup143/providers/Microsoft.BatchAI/clusters/cluster\",\"name\":\"cluster\",\"type\":\"Microsoft.BatchAI/Clusters\",\"location\":\"eastus\",\"properties\":{\"provisioningState\":\"succeeded\",\"allocationState\":\"steady\",\"creationTime\":\"2017-10-31T17:50:34.476Z\",\"allocationStateTransitionTime\":\"2017-10-31T17:51:53.093Z\",\"provisioningStateTransitionTime\":\"2017-10-31T17:50:35.743Z\",\"vmSize\":\"STANDARD_D1\",\"currentNodeCount\":1,\"nodeStateCounts\":{\"runningNodeCount\":0,\"idleNodeCount\":1,\"unusableNodeCount\":0,\"preparingNodeCount\":0,\"leavingNodeCount\":0},\"vmPriority\":\"dedicated\",\"scaleSettings\":{\"manual\":{\"targetNodeCount\":1,\"nodeDeallocationOption\":\"requeue\"}},\"virtualMachineConfiguration\":{\"imageReference\":{\"publisher\":\"Canonical\",\"offer\":\"UbuntuServer\",\"sku\":\"16.04-LTS\",\"version\":\"16.04.201708151\"}},\"userAccountSettings\":{\"adminUserName\":\"username\",\"adminUserSSHPublicKey\":\"ssh-rsa AAAAB3NzaC1yc2EAAAADAQABAAABAQChWiUZgIS8fgKrB4wBBjJjoA4jtyfxWRgnbcz0pNPtplH8cL8TV/AzgE3GdYjbzbKg+dej9iVETS2kwfqDK7CXPljqwluN5S3CnZqeKETqagRQ6/IMuZhttKKVhVRtKIUqJFJeJ2/YtLJzvSE3QnVi+MedrJqC/Gm6A3bhLkIFPlTU3oXfLNz/2iG5ax/FgtNd1ukvMtplNifu4c8Y9iNxjcZR7/vRZUXg3V+hd1fYCJesJC6H3hmiszqjK119slb0ie7qmGB+1+0shs2+aT7wbCuqjKLKXHhOumGfgyPDcdaOm5GPGYeM/LERCi6uOS9bWlZEE3L63QeXeb2aRoOJ has_no_private_key\"},\"nodeSetup\":{\"mountVolumes\":{\"azureFileShares\":[{\"accountName\":\"testacc9517\",\"azureFileUrl\":\"https://testacc9517.file.core.windows.net/azfileshare\",\"credentials\":{},\"relativeMountPath\":\"azfs\",\"fileMode\":\"0777\",\"directoryMode\":\"0777\"}]}}}}", { 'cache-control': 'no-cache',
  pragma: 'no-cache',
  'content-length': '1582',
  'content-type': 'application/json; charset=utf-8',
  expires: '-1',
  'last-modified': 'Tue, 31 Oct 2017 17:50:34 GMT',
  etag: '"0x8D52087E30D4ADE"',
  'x-ms-ratelimit-remaining-subscription-reads': '14997',
  'request-id': '1bb89174-26c9-461a-8d89-d6e45eb27f71',
  'strict-transport-security': 'max-age=31536000; includeSubDomains',
  'x-content-type-options': 'nosniff',
  server: 'Microsoft-HTTPAPI/2.0',
  'x-ms-request-id': '8c6fd0ca-d7e7-45dd-8a09-928e86132f54',
  'x-ms-correlation-request-id': '8c6fd0ca-d7e7-45dd-8a09-928e86132f54',
  'x-ms-routing-request-id': 'WESTUS2:20171031T180535Z:8c6fd0ca-d7e7-45dd-8a09-928e86132f54',
  date: 'Tue, 31 Oct 2017 18:05:34 GMT',
  connection: 'close' });
 return result; },
function (nock) { 
var result = 
nock('https://management.azure.com:443')
  .get('/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/nodeTestGroup143/providers/Microsoft.BatchAI/clusters/cluster?api-version=2017-09-01-preview')
  .reply(200, "{\"id\":\"/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/nodetestgroup143/providers/Microsoft.BatchAI/clusters/cluster\",\"name\":\"cluster\",\"type\":\"Microsoft.BatchAI/Clusters\",\"location\":\"eastus\",\"properties\":{\"provisioningState\":\"succeeded\",\"allocationState\":\"steady\",\"creationTime\":\"2017-10-31T17:50:34.476Z\",\"allocationStateTransitionTime\":\"2017-10-31T17:51:53.093Z\",\"provisioningStateTransitionTime\":\"2017-10-31T17:50:35.743Z\",\"vmSize\":\"STANDARD_D1\",\"currentNodeCount\":1,\"nodeStateCounts\":{\"runningNodeCount\":0,\"idleNodeCount\":1,\"unusableNodeCount\":0,\"preparingNodeCount\":0,\"leavingNodeCount\":0},\"vmPriority\":\"dedicated\",\"scaleSettings\":{\"manual\":{\"targetNodeCount\":1,\"nodeDeallocationOption\":\"requeue\"}},\"virtualMachineConfiguration\":{\"imageReference\":{\"publisher\":\"Canonical\",\"offer\":\"UbuntuServer\",\"sku\":\"16.04-LTS\",\"version\":\"16.04.201708151\"}},\"userAccountSettings\":{\"adminUserName\":\"username\",\"adminUserSSHPublicKey\":\"ssh-rsa AAAAB3NzaC1yc2EAAAADAQABAAABAQChWiUZgIS8fgKrB4wBBjJjoA4jtyfxWRgnbcz0pNPtplH8cL8TV/AzgE3GdYjbzbKg+dej9iVETS2kwfqDK7CXPljqwluN5S3CnZqeKETqagRQ6/IMuZhttKKVhVRtKIUqJFJeJ2/YtLJzvSE3QnVi+MedrJqC/Gm6A3bhLkIFPlTU3oXfLNz/2iG5ax/FgtNd1ukvMtplNifu4c8Y9iNxjcZR7/vRZUXg3V+hd1fYCJesJC6H3hmiszqjK119slb0ie7qmGB+1+0shs2+aT7wbCuqjKLKXHhOumGfgyPDcdaOm5GPGYeM/LERCi6uOS9bWlZEE3L63QeXeb2aRoOJ has_no_private_key\"},\"nodeSetup\":{\"mountVolumes\":{\"azureFileShares\":[{\"accountName\":\"testacc9517\",\"azureFileUrl\":\"https://testacc9517.file.core.windows.net/azfileshare\",\"credentials\":{},\"relativeMountPath\":\"azfs\",\"fileMode\":\"0777\",\"directoryMode\":\"0777\"}]}}}}", { 'cache-control': 'no-cache',
  pragma: 'no-cache',
  'content-length': '1582',
  'content-type': 'application/json; charset=utf-8',
  expires: '-1',
  'last-modified': 'Tue, 31 Oct 2017 17:50:34 GMT',
  etag: '"0x8D52087E30D4ADE"',
  'x-ms-ratelimit-remaining-subscription-reads': '14997',
  'request-id': '1bb89174-26c9-461a-8d89-d6e45eb27f71',
  'strict-transport-security': 'max-age=31536000; includeSubDomains',
  'x-content-type-options': 'nosniff',
  server: 'Microsoft-HTTPAPI/2.0',
  'x-ms-request-id': '8c6fd0ca-d7e7-45dd-8a09-928e86132f54',
  'x-ms-correlation-request-id': '8c6fd0ca-d7e7-45dd-8a09-928e86132f54',
  'x-ms-routing-request-id': 'WESTUS2:20171031T180535Z:8c6fd0ca-d7e7-45dd-8a09-928e86132f54',
  date: 'Tue, 31 Oct 2017 18:05:34 GMT',
  connection: 'close' });
 return result; }]];