// This file has been autogenerated.

exports.setEnvironment = function() {
  process.env['AZURE_TEST_LOCATION'] = 'northeurope';
  process.env['AZURE_SUBSCRIPTION_ID'] = '00000000-0000-0000-0000-000000000000';
};

exports.scopes = [[function (nock) { 
var result = 
nock('http://management.azure.com:443')
  .filteringRequestBody(function (path) { return '*';})
.put('/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/nodeTestGroup1941/providers/Microsoft.BatchAI/workspaces/workspace/experiments/experiment/jobs/job4?api-version=2018-05-01', '*')
  .reply(202, "", { 'cache-control': 'no-cache',
  pragma: 'no-cache',
  expires: '-1',
  location: 'https://management.azure.com/subscriptions/00000000-0000-0000-0000-000000000000/providers/Microsoft.BatchAI/locations/northeurope/operationstatuses/f8872669-0e6e-4047-9997-f8d1716aeea7?api-version=2018-05-01',
  'retry-after': '15',
  'request-id': 'b005c549-ce35-487a-bd05-ff2cccf7ac62',
  'strict-transport-security': 'max-age=31536000; includeSubDomains',
  'x-content-type-options': 'nosniff',
  'azure-asyncoperation': 'https://management.azure.com/subscriptions/00000000-0000-0000-0000-000000000000/providers/Microsoft.BatchAI/locations/northeurope/operationresults/f8872669-0e6e-4047-9997-f8d1716aeea7?api-version=2018-05-01',
  'x-ms-ratelimit-remaining-subscription-writes': '1199',
  server: 'Microsoft-HTTPAPI/2.0',
  'x-ms-request-id': '5745f8da-493a-4c4e-ab28-c9cef74c9389',
  'x-ms-correlation-request-id': '5745f8da-493a-4c4e-ab28-c9cef74c9389',
  'x-ms-routing-request-id': 'WESTUS:20180614T035532Z:5745f8da-493a-4c4e-ab28-c9cef74c9389',
  date: 'Thu, 14 Jun 2018 03:55:31 GMT',
  connection: 'close',
  'content-length': '0' });
 return result; },
function (nock) { 
var result = 
nock('https://management.azure.com:443')
  .filteringRequestBody(function (path) { return '*';})
.put('/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/nodeTestGroup1941/providers/Microsoft.BatchAI/workspaces/workspace/experiments/experiment/jobs/job4?api-version=2018-05-01', '*')
  .reply(202, "", { 'cache-control': 'no-cache',
  pragma: 'no-cache',
  expires: '-1',
  location: 'https://management.azure.com/subscriptions/00000000-0000-0000-0000-000000000000/providers/Microsoft.BatchAI/locations/northeurope/operationstatuses/f8872669-0e6e-4047-9997-f8d1716aeea7?api-version=2018-05-01',
  'retry-after': '15',
  'request-id': 'b005c549-ce35-487a-bd05-ff2cccf7ac62',
  'strict-transport-security': 'max-age=31536000; includeSubDomains',
  'x-content-type-options': 'nosniff',
  'azure-asyncoperation': 'https://management.azure.com/subscriptions/00000000-0000-0000-0000-000000000000/providers/Microsoft.BatchAI/locations/northeurope/operationresults/f8872669-0e6e-4047-9997-f8d1716aeea7?api-version=2018-05-01',
  'x-ms-ratelimit-remaining-subscription-writes': '1199',
  server: 'Microsoft-HTTPAPI/2.0',
  'x-ms-request-id': '5745f8da-493a-4c4e-ab28-c9cef74c9389',
  'x-ms-correlation-request-id': '5745f8da-493a-4c4e-ab28-c9cef74c9389',
  'x-ms-routing-request-id': 'WESTUS:20180614T035532Z:5745f8da-493a-4c4e-ab28-c9cef74c9389',
  date: 'Thu, 14 Jun 2018 03:55:31 GMT',
  connection: 'close',
  'content-length': '0' });
 return result; },
function (nock) { 
var result = 
nock('http://management.azure.com:443')
  .get('/subscriptions/00000000-0000-0000-0000-000000000000/providers/Microsoft.BatchAI/locations/northeurope/operationresults/f8872669-0e6e-4047-9997-f8d1716aeea7?api-version=2018-05-01')
  .reply(200, "{\"id\":\"https://management.azure.com/subscriptions/00000000-0000-0000-0000-000000000000/providers/Microsoft.BatchAI/locations/northeurope/operationresults/f8872669-0e6e-4047-9997-f8d1716aeea7\",\"name\":\"f8872669-0e6e-4047-9997-f8d1716aeea7\",\"status\":\"Succeeded\",\"startTime\":\"2018-06-14T03:55:32.018Z\",\"endTime\":\"2018-06-14T03:55:33.07Z\",\"properties\":{\"resourceId\":\"00000000-0000-0000-0000-000000000000$nodetestgroup1941$workspace$experiment$job4\"}}", { 'cache-control': 'no-cache',
  pragma: 'no-cache',
  'content-length': '445',
  'content-type': 'application/json; charset=utf-8',
  expires: '-1',
  'x-ms-request-id': '3cbbedc5-4f98-4579-b762-b1eae307bbef',
  'request-id': 'bc581dc2-e8c9-4ea1-8b9d-924e4d86fdd5',
  'strict-transport-security': 'max-age=31536000; includeSubDomains',
  'x-content-type-options': 'nosniff',
  'x-ms-ratelimit-remaining-subscription-reads': '14999',
  server: 'Microsoft-HTTPAPI/2.0',
  'x-ms-correlation-request-id': '3cbbedc5-4f98-4579-b762-b1eae307bbef',
  'x-ms-routing-request-id': 'WESTUS:20180614T035603Z:3cbbedc5-4f98-4579-b762-b1eae307bbef',
  date: 'Thu, 14 Jun 2018 03:56:02 GMT',
  connection: 'close' });
 return result; },
function (nock) { 
var result = 
nock('https://management.azure.com:443')
  .get('/subscriptions/00000000-0000-0000-0000-000000000000/providers/Microsoft.BatchAI/locations/northeurope/operationresults/f8872669-0e6e-4047-9997-f8d1716aeea7?api-version=2018-05-01')
  .reply(200, "{\"id\":\"https://management.azure.com/subscriptions/00000000-0000-0000-0000-000000000000/providers/Microsoft.BatchAI/locations/northeurope/operationresults/f8872669-0e6e-4047-9997-f8d1716aeea7\",\"name\":\"f8872669-0e6e-4047-9997-f8d1716aeea7\",\"status\":\"Succeeded\",\"startTime\":\"2018-06-14T03:55:32.018Z\",\"endTime\":\"2018-06-14T03:55:33.07Z\",\"properties\":{\"resourceId\":\"00000000-0000-0000-0000-000000000000$nodetestgroup1941$workspace$experiment$job4\"}}", { 'cache-control': 'no-cache',
  pragma: 'no-cache',
  'content-length': '445',
  'content-type': 'application/json; charset=utf-8',
  expires: '-1',
  'x-ms-request-id': '3cbbedc5-4f98-4579-b762-b1eae307bbef',
  'request-id': 'bc581dc2-e8c9-4ea1-8b9d-924e4d86fdd5',
  'strict-transport-security': 'max-age=31536000; includeSubDomains',
  'x-content-type-options': 'nosniff',
  'x-ms-ratelimit-remaining-subscription-reads': '14999',
  server: 'Microsoft-HTTPAPI/2.0',
  'x-ms-correlation-request-id': '3cbbedc5-4f98-4579-b762-b1eae307bbef',
  'x-ms-routing-request-id': 'WESTUS:20180614T035603Z:3cbbedc5-4f98-4579-b762-b1eae307bbef',
  date: 'Thu, 14 Jun 2018 03:56:02 GMT',
  connection: 'close' });
 return result; },
function (nock) { 
var result = 
nock('http://management.azure.com:443')
  .get('/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/nodeTestGroup1941/providers/Microsoft.BatchAI/workspaces/workspace/experiments/experiment/jobs/job4?api-version=2018-05-01')
  .reply(200, "{\"id\":\"/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/nodetestgroup1941/providers/Microsoft.BatchAI/workspaces/workspace/experiments/experiment/jobs/job4\",\"name\":\"job4\",\"type\":\"Microsoft.BatchAI/workspaces/experiments/jobs\",\"properties\":{\"experimentName\":\"experiment\",\"schedulingPriority\":\"normal\",\"cluster\":{\"id\":\"/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/nodetestgroup1941/providers/Microsoft.BatchAI/workspaces/workspace/clusters/cluster\"},\"jobOutputDirectoryPathSegment\":\"00000000-0000-0000-0000-000000000000/nodetestgroup1941/workspaces/workspace/experiments/experiment/jobs/job4/13886bb2-4cc4-440f-b2e2-869d87ecbf2b\",\"nodeCount\":1,\"mountVolumes\":{\"azureBlobFileSystems\":[{\"accountName\":\"testacc9969\",\"containerName\":\"azcontainer\",\"credentials\":{},\"relativeMountPath\":\"azcs\"}]},\"toolType\":\"custom\",\"customToolkitSettings\":{\"commandLine\":\"echo hello from job; echo job > $AZ_BATCHAI_OUTPUT_OUTPUT/job.txt\"},\"jobPreparation\":{\"commandLine\":\"echo hello from job preparation; echo prep > $AZ_BATCHAI_OUTPUT_OUTPUT/prep.txt\"},\"stdOutErrPathPrefix\":\"$AZ_BATCHAI_MOUNT_ROOT/azfs\",\"outputDirectories\":[{\"id\":\"OUTPUT\",\"pathPrefix\":\"$AZ_BATCHAI_JOB_MOUNT_ROOT/azcs\"}],\"constraints\":{\"maxWallClockTime\":\"P7D\"},\"creationTime\":\"2018-06-14T03:55:32.003Z\",\"provisioningState\":\"succeeded\",\"provisioningStateTransitionTime\":\"2018-06-14T03:55:33.055Z\",\"executionState\":\"succeeded\",\"executionStateTransitionTime\":\"2018-06-14T03:55:53.992Z\",\"executionInfo\":{\"startTime\":\"2018-06-14T03:55:38.507Z\",\"endTime\":\"2018-06-14T03:55:53.992Z\",\"exitCode\":0}}}", { 'cache-control': 'no-cache',
  pragma: 'no-cache',
  'content-length': '1579',
  'content-type': 'application/json; charset=utf-8',
  expires: '-1',
  'last-modified': 'Thu, 14 Jun 2018 03:55:32 GMT',
  etag: '"0x8D5D1AAAD021921"',
  'x-ms-request-id': '297743a6-8952-42f4-a21d-c47099f160cf',
  'request-id': 'be443e4a-3daf-4a87-8445-4f3682a1049a',
  'strict-transport-security': 'max-age=31536000; includeSubDomains',
  'x-content-type-options': 'nosniff',
  'x-ms-ratelimit-remaining-subscription-reads': '14999',
  server: 'Microsoft-HTTPAPI/2.0',
  'x-ms-correlation-request-id': '297743a6-8952-42f4-a21d-c47099f160cf',
  'x-ms-routing-request-id': 'WESTUS:20180614T035605Z:297743a6-8952-42f4-a21d-c47099f160cf',
  date: 'Thu, 14 Jun 2018 03:56:04 GMT',
  connection: 'close' });
 return result; },
function (nock) { 
var result = 
nock('https://management.azure.com:443')
  .get('/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/nodeTestGroup1941/providers/Microsoft.BatchAI/workspaces/workspace/experiments/experiment/jobs/job4?api-version=2018-05-01')
  .reply(200, "{\"id\":\"/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/nodetestgroup1941/providers/Microsoft.BatchAI/workspaces/workspace/experiments/experiment/jobs/job4\",\"name\":\"job4\",\"type\":\"Microsoft.BatchAI/workspaces/experiments/jobs\",\"properties\":{\"experimentName\":\"experiment\",\"schedulingPriority\":\"normal\",\"cluster\":{\"id\":\"/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/nodetestgroup1941/providers/Microsoft.BatchAI/workspaces/workspace/clusters/cluster\"},\"jobOutputDirectoryPathSegment\":\"00000000-0000-0000-0000-000000000000/nodetestgroup1941/workspaces/workspace/experiments/experiment/jobs/job4/13886bb2-4cc4-440f-b2e2-869d87ecbf2b\",\"nodeCount\":1,\"mountVolumes\":{\"azureBlobFileSystems\":[{\"accountName\":\"testacc9969\",\"containerName\":\"azcontainer\",\"credentials\":{},\"relativeMountPath\":\"azcs\"}]},\"toolType\":\"custom\",\"customToolkitSettings\":{\"commandLine\":\"echo hello from job; echo job > $AZ_BATCHAI_OUTPUT_OUTPUT/job.txt\"},\"jobPreparation\":{\"commandLine\":\"echo hello from job preparation; echo prep > $AZ_BATCHAI_OUTPUT_OUTPUT/prep.txt\"},\"stdOutErrPathPrefix\":\"$AZ_BATCHAI_MOUNT_ROOT/azfs\",\"outputDirectories\":[{\"id\":\"OUTPUT\",\"pathPrefix\":\"$AZ_BATCHAI_JOB_MOUNT_ROOT/azcs\"}],\"constraints\":{\"maxWallClockTime\":\"P7D\"},\"creationTime\":\"2018-06-14T03:55:32.003Z\",\"provisioningState\":\"succeeded\",\"provisioningStateTransitionTime\":\"2018-06-14T03:55:33.055Z\",\"executionState\":\"succeeded\",\"executionStateTransitionTime\":\"2018-06-14T03:55:53.992Z\",\"executionInfo\":{\"startTime\":\"2018-06-14T03:55:38.507Z\",\"endTime\":\"2018-06-14T03:55:53.992Z\",\"exitCode\":0}}}", { 'cache-control': 'no-cache',
  pragma: 'no-cache',
  'content-length': '1579',
  'content-type': 'application/json; charset=utf-8',
  expires: '-1',
  'last-modified': 'Thu, 14 Jun 2018 03:55:32 GMT',
  etag: '"0x8D5D1AAAD021921"',
  'x-ms-request-id': '297743a6-8952-42f4-a21d-c47099f160cf',
  'request-id': 'be443e4a-3daf-4a87-8445-4f3682a1049a',
  'strict-transport-security': 'max-age=31536000; includeSubDomains',
  'x-content-type-options': 'nosniff',
  'x-ms-ratelimit-remaining-subscription-reads': '14999',
  server: 'Microsoft-HTTPAPI/2.0',
  'x-ms-correlation-request-id': '297743a6-8952-42f4-a21d-c47099f160cf',
  'x-ms-routing-request-id': 'WESTUS:20180614T035605Z:297743a6-8952-42f4-a21d-c47099f160cf',
  date: 'Thu, 14 Jun 2018 03:56:04 GMT',
  connection: 'close' });
 return result; },
function (nock) { 
var result = 
nock('http://management.azure.com:443')
  .get('/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/nodeTestGroup1941/providers/Microsoft.BatchAI/workspaces/workspace/experiments/experiment/jobs/job4?api-version=2018-05-01')
  .reply(200, "{\"id\":\"/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/nodetestgroup1941/providers/Microsoft.BatchAI/workspaces/workspace/experiments/experiment/jobs/job4\",\"name\":\"job4\",\"type\":\"Microsoft.BatchAI/workspaces/experiments/jobs\",\"properties\":{\"experimentName\":\"experiment\",\"schedulingPriority\":\"normal\",\"cluster\":{\"id\":\"/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/nodetestgroup1941/providers/Microsoft.BatchAI/workspaces/workspace/clusters/cluster\"},\"jobOutputDirectoryPathSegment\":\"00000000-0000-0000-0000-000000000000/nodetestgroup1941/workspaces/workspace/experiments/experiment/jobs/job4/13886bb2-4cc4-440f-b2e2-869d87ecbf2b\",\"nodeCount\":1,\"mountVolumes\":{\"azureBlobFileSystems\":[{\"accountName\":\"testacc9969\",\"containerName\":\"azcontainer\",\"credentials\":{},\"relativeMountPath\":\"azcs\"}]},\"toolType\":\"custom\",\"customToolkitSettings\":{\"commandLine\":\"echo hello from job; echo job > $AZ_BATCHAI_OUTPUT_OUTPUT/job.txt\"},\"jobPreparation\":{\"commandLine\":\"echo hello from job preparation; echo prep > $AZ_BATCHAI_OUTPUT_OUTPUT/prep.txt\"},\"stdOutErrPathPrefix\":\"$AZ_BATCHAI_MOUNT_ROOT/azfs\",\"outputDirectories\":[{\"id\":\"OUTPUT\",\"pathPrefix\":\"$AZ_BATCHAI_JOB_MOUNT_ROOT/azcs\"}],\"constraints\":{\"maxWallClockTime\":\"P7D\"},\"creationTime\":\"2018-06-14T03:55:32.003Z\",\"provisioningState\":\"succeeded\",\"provisioningStateTransitionTime\":\"2018-06-14T03:55:33.055Z\",\"executionState\":\"succeeded\",\"executionStateTransitionTime\":\"2018-06-14T03:55:53.992Z\",\"executionInfo\":{\"startTime\":\"2018-06-14T03:55:38.507Z\",\"endTime\":\"2018-06-14T03:55:53.992Z\",\"exitCode\":0}}}", { 'cache-control': 'no-cache',
  pragma: 'no-cache',
  'content-length': '1579',
  'content-type': 'application/json; charset=utf-8',
  expires: '-1',
  'last-modified': 'Thu, 14 Jun 2018 03:55:32 GMT',
  etag: '"0x8D5D1AAAD021921"',
  'x-ms-request-id': 'acfa7476-a779-4433-8dee-aeb73fe5120f',
  'request-id': '2bcc80da-3cb9-4181-9183-ccf740f8c1bc',
  'strict-transport-security': 'max-age=31536000; includeSubDomains',
  'x-content-type-options': 'nosniff',
  'x-ms-ratelimit-remaining-subscription-reads': '14999',
  server: 'Microsoft-HTTPAPI/2.0',
  'x-ms-correlation-request-id': 'acfa7476-a779-4433-8dee-aeb73fe5120f',
  'x-ms-routing-request-id': 'WESTUS:20180614T035621Z:acfa7476-a779-4433-8dee-aeb73fe5120f',
  date: 'Thu, 14 Jun 2018 03:56:20 GMT',
  connection: 'close' });
 return result; },
function (nock) { 
var result = 
nock('https://management.azure.com:443')
  .get('/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/nodeTestGroup1941/providers/Microsoft.BatchAI/workspaces/workspace/experiments/experiment/jobs/job4?api-version=2018-05-01')
  .reply(200, "{\"id\":\"/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/nodetestgroup1941/providers/Microsoft.BatchAI/workspaces/workspace/experiments/experiment/jobs/job4\",\"name\":\"job4\",\"type\":\"Microsoft.BatchAI/workspaces/experiments/jobs\",\"properties\":{\"experimentName\":\"experiment\",\"schedulingPriority\":\"normal\",\"cluster\":{\"id\":\"/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/nodetestgroup1941/providers/Microsoft.BatchAI/workspaces/workspace/clusters/cluster\"},\"jobOutputDirectoryPathSegment\":\"00000000-0000-0000-0000-000000000000/nodetestgroup1941/workspaces/workspace/experiments/experiment/jobs/job4/13886bb2-4cc4-440f-b2e2-869d87ecbf2b\",\"nodeCount\":1,\"mountVolumes\":{\"azureBlobFileSystems\":[{\"accountName\":\"testacc9969\",\"containerName\":\"azcontainer\",\"credentials\":{},\"relativeMountPath\":\"azcs\"}]},\"toolType\":\"custom\",\"customToolkitSettings\":{\"commandLine\":\"echo hello from job; echo job > $AZ_BATCHAI_OUTPUT_OUTPUT/job.txt\"},\"jobPreparation\":{\"commandLine\":\"echo hello from job preparation; echo prep > $AZ_BATCHAI_OUTPUT_OUTPUT/prep.txt\"},\"stdOutErrPathPrefix\":\"$AZ_BATCHAI_MOUNT_ROOT/azfs\",\"outputDirectories\":[{\"id\":\"OUTPUT\",\"pathPrefix\":\"$AZ_BATCHAI_JOB_MOUNT_ROOT/azcs\"}],\"constraints\":{\"maxWallClockTime\":\"P7D\"},\"creationTime\":\"2018-06-14T03:55:32.003Z\",\"provisioningState\":\"succeeded\",\"provisioningStateTransitionTime\":\"2018-06-14T03:55:33.055Z\",\"executionState\":\"succeeded\",\"executionStateTransitionTime\":\"2018-06-14T03:55:53.992Z\",\"executionInfo\":{\"startTime\":\"2018-06-14T03:55:38.507Z\",\"endTime\":\"2018-06-14T03:55:53.992Z\",\"exitCode\":0}}}", { 'cache-control': 'no-cache',
  pragma: 'no-cache',
  'content-length': '1579',
  'content-type': 'application/json; charset=utf-8',
  expires: '-1',
  'last-modified': 'Thu, 14 Jun 2018 03:55:32 GMT',
  etag: '"0x8D5D1AAAD021921"',
  'x-ms-request-id': 'acfa7476-a779-4433-8dee-aeb73fe5120f',
  'request-id': '2bcc80da-3cb9-4181-9183-ccf740f8c1bc',
  'strict-transport-security': 'max-age=31536000; includeSubDomains',
  'x-content-type-options': 'nosniff',
  'x-ms-ratelimit-remaining-subscription-reads': '14999',
  server: 'Microsoft-HTTPAPI/2.0',
  'x-ms-correlation-request-id': 'acfa7476-a779-4433-8dee-aeb73fe5120f',
  'x-ms-routing-request-id': 'WESTUS:20180614T035621Z:acfa7476-a779-4433-8dee-aeb73fe5120f',
  date: 'Thu, 14 Jun 2018 03:56:20 GMT',
  connection: 'close' });
 return result; },
function (nock) { 
var result = 
nock('http://management.azure.com:443')
  .post('/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/nodeTestGroup1941/providers/Microsoft.BatchAI/workspaces/workspace/experiments/experiment/jobs/job4/listOutputFiles?api-version=2018-05-01&outputdirectoryid=stdouterr')
  .reply(200, "{\"value\":[{\"name\":\"execution.log\",\"fileType\":\"file\",\"downloadUrl\":\"https://testacc9969.file.core.windows.net/azfileshare/00000000-0000-0000-0000-000000000000/nodetestgroup1941/workspaces/workspace/experiments/experiment/jobs/job4/13886bb2-4cc4-440f-b2e2-869d87ecbf2b/stdouterr/execution.log?sv=2016-05-31&sr=f&sig=zeAkgEP1uUCATwBLVQ39vEAj9Mvi1eAoxcYiqXqoeks%3D&se=2018-06-14T04%3A56%3A22Z&sp=rl\",\"properties\":{\"lastModified\":\"2018-06-14T03:55:53Z\",\"contentLength\":8973}},{\"name\":\"stderr-job_prep.txt\",\"fileType\":\"file\",\"downloadUrl\":\"https://testacc9969.file.core.windows.net/azfileshare/00000000-0000-0000-0000-000000000000/nodetestgroup1941/workspaces/workspace/experiments/experiment/jobs/job4/13886bb2-4cc4-440f-b2e2-869d87ecbf2b/stdouterr/stderr-job_prep.txt?sv=2016-05-31&sr=f&sig=JgiavIQa%2Fk1K57SCvIpv1o04shUnsa9lQuaUwjyCeu0%3D&se=2018-06-14T04%3A56%3A22Z&sp=rl\",\"properties\":{\"lastModified\":\"2018-06-14T03:55:52Z\",\"contentLength\":0}},{\"name\":\"stderr.txt\",\"fileType\":\"file\",\"downloadUrl\":\"https://testacc9969.file.core.windows.net/azfileshare/00000000-0000-0000-0000-000000000000/nodetestgroup1941/workspaces/workspace/experiments/experiment/jobs/job4/13886bb2-4cc4-440f-b2e2-869d87ecbf2b/stdouterr/stderr.txt?sv=2016-05-31&sr=f&sig=%2FhsC02h9PNXZ41cTeRJFniKhQ09X9cepRuoGN%2FQ2LkQ%3D&se=2018-06-14T04%3A56%3A22Z&sp=rl\",\"properties\":{\"lastModified\":\"2018-06-14T03:55:53Z\",\"contentLength\":0}},{\"name\":\"stdout-job_prep.txt\",\"fileType\":\"file\",\"downloadUrl\":\"https://testacc9969.file.core.windows.net/azfileshare/00000000-0000-0000-0000-000000000000/nodetestgroup1941/workspaces/workspace/experiments/experiment/jobs/job4/13886bb2-4cc4-440f-b2e2-869d87ecbf2b/stdouterr/stdout-job_prep.txt?sv=2016-05-31&sr=f&sig=HtQHat220vSL57ne7lXUBLLtgQephccW3snmwH5uXTQ%3D&se=2018-06-14T04%3A56%3A22Z&sp=rl\",\"properties\":{\"lastModified\":\"2018-06-14T03:55:52Z\",\"contentLength\":27}},{\"name\":\"stdout.txt\",\"fileType\":\"file\",\"downloadUrl\":\"https://testacc9969.file.core.windows.net/azfileshare/00000000-0000-0000-0000-000000000000/nodetestgroup1941/workspaces/workspace/experiments/experiment/jobs/job4/13886bb2-4cc4-440f-b2e2-869d87ecbf2b/stdouterr/stdout.txt?sv=2016-05-31&sr=f&sig=TZCyCDz999zwJy8XXB5cbw%2FcEEwfrHUP5eDmYjLPsNc%3D&se=2018-06-14T04%3A56%3A22Z&sp=rl\",\"properties\":{\"lastModified\":\"2018-06-14T03:55:53Z\",\"contentLength\":15}}]}", { 'cache-control': 'no-cache',
  pragma: 'no-cache',
  'content-length': '2326',
  'content-type': 'application/json; charset=utf-8',
  expires: '-1',
  'x-ms-request-id': '16b3e9df-ad75-42bc-b9aa-927734c7d7ec',
  'request-id': '276a7635-e347-4b41-8828-3236d9f1e3a1',
  'strict-transport-security': 'max-age=31536000; includeSubDomains',
  'x-content-type-options': 'nosniff',
  'x-ms-ratelimit-remaining-subscription-reads': '14999',
  server: 'Microsoft-HTTPAPI/2.0',
  'x-ms-correlation-request-id': '16b3e9df-ad75-42bc-b9aa-927734c7d7ec',
  'x-ms-routing-request-id': 'WESTUS:20180614T035622Z:16b3e9df-ad75-42bc-b9aa-927734c7d7ec',
  date: 'Thu, 14 Jun 2018 03:56:22 GMT',
  connection: 'close' });
 return result; },
function (nock) { 
var result = 
nock('https://management.azure.com:443')
  .post('/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/nodeTestGroup1941/providers/Microsoft.BatchAI/workspaces/workspace/experiments/experiment/jobs/job4/listOutputFiles?api-version=2018-05-01&outputdirectoryid=stdouterr')
  .reply(200, "{\"value\":[{\"name\":\"execution.log\",\"fileType\":\"file\",\"downloadUrl\":\"https://testacc9969.file.core.windows.net/azfileshare/00000000-0000-0000-0000-000000000000/nodetestgroup1941/workspaces/workspace/experiments/experiment/jobs/job4/13886bb2-4cc4-440f-b2e2-869d87ecbf2b/stdouterr/execution.log?sv=2016-05-31&sr=f&sig=zeAkgEP1uUCATwBLVQ39vEAj9Mvi1eAoxcYiqXqoeks%3D&se=2018-06-14T04%3A56%3A22Z&sp=rl\",\"properties\":{\"lastModified\":\"2018-06-14T03:55:53Z\",\"contentLength\":8973}},{\"name\":\"stderr-job_prep.txt\",\"fileType\":\"file\",\"downloadUrl\":\"https://testacc9969.file.core.windows.net/azfileshare/00000000-0000-0000-0000-000000000000/nodetestgroup1941/workspaces/workspace/experiments/experiment/jobs/job4/13886bb2-4cc4-440f-b2e2-869d87ecbf2b/stdouterr/stderr-job_prep.txt?sv=2016-05-31&sr=f&sig=JgiavIQa%2Fk1K57SCvIpv1o04shUnsa9lQuaUwjyCeu0%3D&se=2018-06-14T04%3A56%3A22Z&sp=rl\",\"properties\":{\"lastModified\":\"2018-06-14T03:55:52Z\",\"contentLength\":0}},{\"name\":\"stderr.txt\",\"fileType\":\"file\",\"downloadUrl\":\"https://testacc9969.file.core.windows.net/azfileshare/00000000-0000-0000-0000-000000000000/nodetestgroup1941/workspaces/workspace/experiments/experiment/jobs/job4/13886bb2-4cc4-440f-b2e2-869d87ecbf2b/stdouterr/stderr.txt?sv=2016-05-31&sr=f&sig=%2FhsC02h9PNXZ41cTeRJFniKhQ09X9cepRuoGN%2FQ2LkQ%3D&se=2018-06-14T04%3A56%3A22Z&sp=rl\",\"properties\":{\"lastModified\":\"2018-06-14T03:55:53Z\",\"contentLength\":0}},{\"name\":\"stdout-job_prep.txt\",\"fileType\":\"file\",\"downloadUrl\":\"https://testacc9969.file.core.windows.net/azfileshare/00000000-0000-0000-0000-000000000000/nodetestgroup1941/workspaces/workspace/experiments/experiment/jobs/job4/13886bb2-4cc4-440f-b2e2-869d87ecbf2b/stdouterr/stdout-job_prep.txt?sv=2016-05-31&sr=f&sig=HtQHat220vSL57ne7lXUBLLtgQephccW3snmwH5uXTQ%3D&se=2018-06-14T04%3A56%3A22Z&sp=rl\",\"properties\":{\"lastModified\":\"2018-06-14T03:55:52Z\",\"contentLength\":27}},{\"name\":\"stdout.txt\",\"fileType\":\"file\",\"downloadUrl\":\"https://testacc9969.file.core.windows.net/azfileshare/00000000-0000-0000-0000-000000000000/nodetestgroup1941/workspaces/workspace/experiments/experiment/jobs/job4/13886bb2-4cc4-440f-b2e2-869d87ecbf2b/stdouterr/stdout.txt?sv=2016-05-31&sr=f&sig=TZCyCDz999zwJy8XXB5cbw%2FcEEwfrHUP5eDmYjLPsNc%3D&se=2018-06-14T04%3A56%3A22Z&sp=rl\",\"properties\":{\"lastModified\":\"2018-06-14T03:55:53Z\",\"contentLength\":15}}]}", { 'cache-control': 'no-cache',
  pragma: 'no-cache',
  'content-length': '2326',
  'content-type': 'application/json; charset=utf-8',
  expires: '-1',
  'x-ms-request-id': '16b3e9df-ad75-42bc-b9aa-927734c7d7ec',
  'request-id': '276a7635-e347-4b41-8828-3236d9f1e3a1',
  'strict-transport-security': 'max-age=31536000; includeSubDomains',
  'x-content-type-options': 'nosniff',
  'x-ms-ratelimit-remaining-subscription-reads': '14999',
  server: 'Microsoft-HTTPAPI/2.0',
  'x-ms-correlation-request-id': '16b3e9df-ad75-42bc-b9aa-927734c7d7ec',
  'x-ms-routing-request-id': 'WESTUS:20180614T035622Z:16b3e9df-ad75-42bc-b9aa-927734c7d7ec',
  date: 'Thu, 14 Jun 2018 03:56:22 GMT',
  connection: 'close' });
 return result; },
function (nock) { 
var result = 
nock('http://management.azure.com:443')
  .post('/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/nodeTestGroup1941/providers/Microsoft.BatchAI/workspaces/workspace/experiments/experiment/jobs/job4/listOutputFiles?api-version=2018-05-01&outputdirectoryid=OUTPUT')
  .reply(200, "{\"value\":[{\"name\":\"job.txt\",\"fileType\":\"file\",\"downloadUrl\":\"https://testacc9969.blob.core.windows.net/azcontainer/00000000-0000-0000-0000-000000000000/nodetestgroup1941/workspaces/workspace/experiments/experiment/jobs/job4/13886bb2-4cc4-440f-b2e2-869d87ecbf2b/outputs/job.txt?sv=2016-05-31&sr=b&sig=ay%2FfkYUhLaj1sUIaRMD3PN6Jr4pYbeSS8J7%2BJe7U1Lk%3D&se=2018-06-14T04%3A56%3A22Z&sp=rl\",\"properties\":{\"lastModified\":\"2018-06-14T03:55:53Z\",\"contentLength\":4}},{\"name\":\"prep.txt\",\"fileType\":\"file\",\"downloadUrl\":\"https://testacc9969.blob.core.windows.net/azcontainer/00000000-0000-0000-0000-000000000000/nodetestgroup1941/workspaces/workspace/experiments/experiment/jobs/job4/13886bb2-4cc4-440f-b2e2-869d87ecbf2b/outputs/prep.txt?sv=2016-05-31&sr=b&sig=%2FC8LqiMg4gNzr6z0hd4HSIWCUjPxOo7Ap%2BRWgnOKaAQ%3D&se=2018-06-14T04%3A56%3A22Z&sp=rl\",\"properties\":{\"lastModified\":\"2018-06-14T03:55:52Z\",\"contentLength\":5}}]}", { 'cache-control': 'no-cache',
  pragma: 'no-cache',
  'content-length': '909',
  'content-type': 'application/json; charset=utf-8',
  expires: '-1',
  'x-ms-request-id': '0e4a0d31-97ac-4ab9-800f-8511865f99f2',
  'request-id': '14bf7447-f856-4e2b-bcc2-b9bebfaba959',
  'strict-transport-security': 'max-age=31536000; includeSubDomains',
  'x-content-type-options': 'nosniff',
  'x-ms-ratelimit-remaining-subscription-reads': '14999',
  server: 'Microsoft-HTTPAPI/2.0',
  'x-ms-correlation-request-id': '0e4a0d31-97ac-4ab9-800f-8511865f99f2',
  'x-ms-routing-request-id': 'WESTUS:20180614T035622Z:0e4a0d31-97ac-4ab9-800f-8511865f99f2',
  date: 'Thu, 14 Jun 2018 03:56:22 GMT',
  connection: 'close' });
 return result; },
function (nock) { 
var result = 
nock('https://management.azure.com:443')
  .post('/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/nodeTestGroup1941/providers/Microsoft.BatchAI/workspaces/workspace/experiments/experiment/jobs/job4/listOutputFiles?api-version=2018-05-01&outputdirectoryid=OUTPUT')
  .reply(200, "{\"value\":[{\"name\":\"job.txt\",\"fileType\":\"file\",\"downloadUrl\":\"https://testacc9969.blob.core.windows.net/azcontainer/00000000-0000-0000-0000-000000000000/nodetestgroup1941/workspaces/workspace/experiments/experiment/jobs/job4/13886bb2-4cc4-440f-b2e2-869d87ecbf2b/outputs/job.txt?sv=2016-05-31&sr=b&sig=ay%2FfkYUhLaj1sUIaRMD3PN6Jr4pYbeSS8J7%2BJe7U1Lk%3D&se=2018-06-14T04%3A56%3A22Z&sp=rl\",\"properties\":{\"lastModified\":\"2018-06-14T03:55:53Z\",\"contentLength\":4}},{\"name\":\"prep.txt\",\"fileType\":\"file\",\"downloadUrl\":\"https://testacc9969.blob.core.windows.net/azcontainer/00000000-0000-0000-0000-000000000000/nodetestgroup1941/workspaces/workspace/experiments/experiment/jobs/job4/13886bb2-4cc4-440f-b2e2-869d87ecbf2b/outputs/prep.txt?sv=2016-05-31&sr=b&sig=%2FC8LqiMg4gNzr6z0hd4HSIWCUjPxOo7Ap%2BRWgnOKaAQ%3D&se=2018-06-14T04%3A56%3A22Z&sp=rl\",\"properties\":{\"lastModified\":\"2018-06-14T03:55:52Z\",\"contentLength\":5}}]}", { 'cache-control': 'no-cache',
  pragma: 'no-cache',
  'content-length': '909',
  'content-type': 'application/json; charset=utf-8',
  expires: '-1',
  'x-ms-request-id': '0e4a0d31-97ac-4ab9-800f-8511865f99f2',
  'request-id': '14bf7447-f856-4e2b-bcc2-b9bebfaba959',
  'strict-transport-security': 'max-age=31536000; includeSubDomains',
  'x-content-type-options': 'nosniff',
  'x-ms-ratelimit-remaining-subscription-reads': '14999',
  server: 'Microsoft-HTTPAPI/2.0',
  'x-ms-correlation-request-id': '0e4a0d31-97ac-4ab9-800f-8511865f99f2',
  'x-ms-routing-request-id': 'WESTUS:20180614T035622Z:0e4a0d31-97ac-4ab9-800f-8511865f99f2',
  date: 'Thu, 14 Jun 2018 03:56:22 GMT',
  connection: 'close' });
 return result; }]];