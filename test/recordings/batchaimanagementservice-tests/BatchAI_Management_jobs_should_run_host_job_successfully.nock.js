exports.scopes = [[function (nock) {
var result = 
nock('http://management.azure.com:443')
  .filteringRequestBody(function (path) { return '*';})
.put('/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/nodeTestGroup143/providers/Microsoft.BatchAI/jobs/job1?api-version=2017-09-01-preview', '*')
  .reply(202, "", { 'cache-control': 'no-cache',
  pragma: 'no-cache',
  expires: '-1',
  location: 'https://management.azure.com/subscriptions/00000000-0000-0000-0000-000000000000/providers/Microsoft.BatchAI/locations/eastus/operationstatuses/d7602ee6-682e-4bcb-a8c2-005187b115d1?api-version=2017-09-01-preview',
  'retry-after': '15',
  'request-id': '456a45bd-47f7-4168-886f-f1a44b8d739a',
  'strict-transport-security': 'max-age=31536000; includeSubDomains',
  'x-content-type-options': 'nosniff',
  'azure-asyncoperation': 'https://management.azure.com/subscriptions/00000000-0000-0000-0000-000000000000/providers/Microsoft.BatchAI/locations/eastus/operationresults/d7602ee6-682e-4bcb-a8c2-005187b115d1?api-version=2017-09-01-preview',
  server: 'Microsoft-HTTPAPI/2.0',
  'x-ms-ratelimit-remaining-subscription-writes': '1198',
  'x-ms-request-id': '71323dbd-5124-46f5-8fb5-949ca5d76cfe',
  'x-ms-correlation-request-id': '71323dbd-5124-46f5-8fb5-949ca5d76cfe',
  'x-ms-routing-request-id': 'WESTUS2:20171031T180538Z:71323dbd-5124-46f5-8fb5-949ca5d76cfe',
  date: 'Tue, 31 Oct 2017 18:05:38 GMT',
  connection: 'close',
  'content-length': '0' });
 return result; },
function (nock) { 
var result = 
nock('https://management.azure.com:443')
  .filteringRequestBody(function (path) { return '*';})
.put('/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/nodeTestGroup143/providers/Microsoft.BatchAI/jobs/job1?api-version=2017-09-01-preview', '*')
  .reply(202, "", { 'cache-control': 'no-cache',
  pragma: 'no-cache',
  expires: '-1',
  location: 'https://management.azure.com/subscriptions/00000000-0000-0000-0000-000000000000/providers/Microsoft.BatchAI/locations/eastus/operationstatuses/d7602ee6-682e-4bcb-a8c2-005187b115d1?api-version=2017-09-01-preview',
  'retry-after': '15',
  'request-id': '456a45bd-47f7-4168-886f-f1a44b8d739a',
  'strict-transport-security': 'max-age=31536000; includeSubDomains',
  'x-content-type-options': 'nosniff',
  'azure-asyncoperation': 'https://management.azure.com/subscriptions/00000000-0000-0000-0000-000000000000/providers/Microsoft.BatchAI/locations/eastus/operationresults/d7602ee6-682e-4bcb-a8c2-005187b115d1?api-version=2017-09-01-preview',
  server: 'Microsoft-HTTPAPI/2.0',
  'x-ms-ratelimit-remaining-subscription-writes': '1198',
  'x-ms-request-id': '71323dbd-5124-46f5-8fb5-949ca5d76cfe',
  'x-ms-correlation-request-id': '71323dbd-5124-46f5-8fb5-949ca5d76cfe',
  'x-ms-routing-request-id': 'WESTUS2:20171031T180538Z:71323dbd-5124-46f5-8fb5-949ca5d76cfe',
  date: 'Tue, 31 Oct 2017 18:05:38 GMT',
  connection: 'close',
  'content-length': '0' });
 return result; },
function (nock) { 
var result = 
nock('http://management.azure.com:443')
  .get('/subscriptions/00000000-0000-0000-0000-000000000000/providers/Microsoft.BatchAI/locations/eastus/operationresults/d7602ee6-682e-4bcb-a8c2-005187b115d1?api-version=2017-09-01-preview')
  .reply(200, "{\"id\":\"https://management.azure.com/subscriptions/00000000-0000-0000-0000-000000000000/providers/Microsoft.BatchAI/locations/eastus/operationresults/d7602ee6-682e-4bcb-a8c2-005187b115d1\",\"name\":\"d7602ee6-682e-4bcb-a8c2-005187b115d1\",\"status\":\"Succeeded\",\"startTime\":\"2017-10-31T18:05:38.072Z\",\"endTime\":\"2017-10-31T18:05:39.405Z\",\"properties\":{\"resourceId\":\"00000000-0000-0000-0000-000000000000$nodetestgroup143$job1\"}}", { 'cache-control': 'no-cache',
  pragma: 'no-cache',
  'content-length': '419',
  'content-type': 'application/json; charset=utf-8',
  expires: '-1',
  'x-ms-ratelimit-remaining-subscription-reads': '14999',
  'request-id': '0a44f073-00b8-4c45-b0d5-7b7959c2a6e8',
  'strict-transport-security': 'max-age=31536000; includeSubDomains',
  'x-content-type-options': 'nosniff',
  server: 'Microsoft-HTTPAPI/2.0',
  'x-ms-request-id': 'baaa4dae-73c9-440d-ae54-aff823e2ebee',
  'x-ms-correlation-request-id': 'baaa4dae-73c9-440d-ae54-aff823e2ebee',
  'x-ms-routing-request-id': 'WESTUS2:20171031T180609Z:baaa4dae-73c9-440d-ae54-aff823e2ebee',
  date: 'Tue, 31 Oct 2017 18:06:09 GMT',
  connection: 'close' });
 return result; },
function (nock) { 
var result = 
nock('https://management.azure.com:443')
  .get('/subscriptions/00000000-0000-0000-0000-000000000000/providers/Microsoft.BatchAI/locations/eastus/operationresults/d7602ee6-682e-4bcb-a8c2-005187b115d1?api-version=2017-09-01-preview')
  .reply(200, "{\"id\":\"https://management.azure.com/subscriptions/00000000-0000-0000-0000-000000000000/providers/Microsoft.BatchAI/locations/eastus/operationresults/d7602ee6-682e-4bcb-a8c2-005187b115d1\",\"name\":\"d7602ee6-682e-4bcb-a8c2-005187b115d1\",\"status\":\"Succeeded\",\"startTime\":\"2017-10-31T18:05:38.072Z\",\"endTime\":\"2017-10-31T18:05:39.405Z\",\"properties\":{\"resourceId\":\"00000000-0000-0000-0000-000000000000$nodetestgroup143$job1\"}}", { 'cache-control': 'no-cache',
  pragma: 'no-cache',
  'content-length': '419',
  'content-type': 'application/json; charset=utf-8',
  expires: '-1',
  'x-ms-ratelimit-remaining-subscription-reads': '14999',
  'request-id': '0a44f073-00b8-4c45-b0d5-7b7959c2a6e8',
  'strict-transport-security': 'max-age=31536000; includeSubDomains',
  'x-content-type-options': 'nosniff',
  server: 'Microsoft-HTTPAPI/2.0',
  'x-ms-request-id': 'baaa4dae-73c9-440d-ae54-aff823e2ebee',
  'x-ms-correlation-request-id': 'baaa4dae-73c9-440d-ae54-aff823e2ebee',
  'x-ms-routing-request-id': 'WESTUS2:20171031T180609Z:baaa4dae-73c9-440d-ae54-aff823e2ebee',
  date: 'Tue, 31 Oct 2017 18:06:09 GMT',
  connection: 'close' });
 return result; },
function (nock) { 
var result = 
nock('http://management.azure.com:443')
  .get('/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/nodeTestGroup143/providers/Microsoft.BatchAI/jobs/job1?api-version=2017-09-01-preview')
  .reply(200, "{\"id\":\"/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/nodetestgroup143/providers/Microsoft.BatchAI/jobs/job1\",\"name\":\"job1\",\"type\":\"Microsoft.BatchAI/Jobs\",\"properties\":{\"priority\":0,\"cluster\":{\"id\":\"/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/nodetestgroup143/providers/Microsoft.BatchAI/clusters/cluster\"},\"nodeCount\":1,\"toolType\":\"custom\",\"customToolkitSettings\":{\"commandLine\":\"echo hello from job\"},\"jobPreparation\":{\"commandLine\":\"echo hello from job preparation\"},\"stdOutErrPathPrefix\":\"$AZ_BATCHAI_MOUNT_ROOT/azfs\",\"outputDirectories\":[{\"id\":\"MODEL\",\"pathPrefix\":\"$AZ_BATCHAI_MOUNT_ROOT/azfs\",\"pathSuffix\":\"model\",\"type\":\"custom\",\"createNew\":true}],\"environmentVariables\":[{\"name\":\"ENVIRONMENT_VARIABLE_1\",\"value\":\"Value1\"},{\"name\":\"ENVIRONMENT_VARIABLE_2\",\"value\":\"Value2\"}],\"constraints\":{\"maxWallClockTime\":\"P7D\"},\"creationTime\":\"2017-10-31T18:05:38.056Z\",\"provisioningState\":\"succeeded\",\"provisioningStateTransitionTime\":\"2017-10-31T18:05:39.358Z\",\"executionState\":\"succeeded\",\"executionStateTransitionTime\":\"2017-10-31T18:05:42.545Z\",\"executionInfo\":{\"startTime\":\"2017-10-31T18:05:40.285Z\",\"endTime\":\"2017-10-31T18:05:42.545Z\",\"exitCode\":0}}}", { 'cache-control': 'no-cache',
  pragma: 'no-cache',
  'content-length': '1198',
  'content-type': 'application/json; charset=utf-8',
  expires: '-1',
  'last-modified': 'Tue, 31 Oct 2017 18:05:38 GMT',
  etag: '"0x8D52089FDA0AF28"',
  'x-ms-ratelimit-remaining-subscription-reads': '14995',
  'request-id': '8bb65ff6-1579-4912-aece-fb72cf663fd9',
  'strict-transport-security': 'max-age=31536000; includeSubDomains',
  'x-content-type-options': 'nosniff',
  server: 'Microsoft-HTTPAPI/2.0',
  'x-ms-request-id': '4f03d774-8e79-4e3e-99bc-a72967da2403',
  'x-ms-correlation-request-id': '4f03d774-8e79-4e3e-99bc-a72967da2403',
  'x-ms-routing-request-id': 'WESTUS2:20171031T180610Z:4f03d774-8e79-4e3e-99bc-a72967da2403',
  date: 'Tue, 31 Oct 2017 18:06:09 GMT',
  connection: 'close' });
 return result; },
function (nock) { 
var result = 
nock('https://management.azure.com:443')
  .get('/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/nodeTestGroup143/providers/Microsoft.BatchAI/jobs/job1?api-version=2017-09-01-preview')
  .reply(200, "{\"id\":\"/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/nodetestgroup143/providers/Microsoft.BatchAI/jobs/job1\",\"name\":\"job1\",\"type\":\"Microsoft.BatchAI/Jobs\",\"properties\":{\"priority\":0,\"cluster\":{\"id\":\"/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/nodetestgroup143/providers/Microsoft.BatchAI/clusters/cluster\"},\"nodeCount\":1,\"toolType\":\"custom\",\"customToolkitSettings\":{\"commandLine\":\"echo hello from job\"},\"jobPreparation\":{\"commandLine\":\"echo hello from job preparation\"},\"stdOutErrPathPrefix\":\"$AZ_BATCHAI_MOUNT_ROOT/azfs\",\"outputDirectories\":[{\"id\":\"MODEL\",\"pathPrefix\":\"$AZ_BATCHAI_MOUNT_ROOT/azfs\",\"pathSuffix\":\"model\",\"type\":\"custom\",\"createNew\":true}],\"environmentVariables\":[{\"name\":\"ENVIRONMENT_VARIABLE_1\",\"value\":\"Value1\"},{\"name\":\"ENVIRONMENT_VARIABLE_2\",\"value\":\"Value2\"}],\"constraints\":{\"maxWallClockTime\":\"P7D\"},\"creationTime\":\"2017-10-31T18:05:38.056Z\",\"provisioningState\":\"succeeded\",\"provisioningStateTransitionTime\":\"2017-10-31T18:05:39.358Z\",\"executionState\":\"succeeded\",\"executionStateTransitionTime\":\"2017-10-31T18:05:42.545Z\",\"executionInfo\":{\"startTime\":\"2017-10-31T18:05:40.285Z\",\"endTime\":\"2017-10-31T18:05:42.545Z\",\"exitCode\":0}}}", { 'cache-control': 'no-cache',
  pragma: 'no-cache',
  'content-length': '1198',
  'content-type': 'application/json; charset=utf-8',
  expires: '-1',
  'last-modified': 'Tue, 31 Oct 2017 18:05:38 GMT',
  etag: '"0x8D52089FDA0AF28"',
  'x-ms-ratelimit-remaining-subscription-reads': '14995',
  'request-id': '8bb65ff6-1579-4912-aece-fb72cf663fd9',
  'strict-transport-security': 'max-age=31536000; includeSubDomains',
  'x-content-type-options': 'nosniff',
  server: 'Microsoft-HTTPAPI/2.0',
  'x-ms-request-id': '4f03d774-8e79-4e3e-99bc-a72967da2403',
  'x-ms-correlation-request-id': '4f03d774-8e79-4e3e-99bc-a72967da2403',
  'x-ms-routing-request-id': 'WESTUS2:20171031T180610Z:4f03d774-8e79-4e3e-99bc-a72967da2403',
  date: 'Tue, 31 Oct 2017 18:06:09 GMT',
  connection: 'close' });
 return result; },
function (nock) { 
var result = 
nock('http://management.azure.com:443')
  .get('/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/nodeTestGroup143/providers/Microsoft.BatchAI/jobs/job1?api-version=2017-09-01-preview')
  .reply(200, "{\"id\":\"/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/nodetestgroup143/providers/Microsoft.BatchAI/jobs/job1\",\"name\":\"job1\",\"type\":\"Microsoft.BatchAI/Jobs\",\"properties\":{\"priority\":0,\"cluster\":{\"id\":\"/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/nodetestgroup143/providers/Microsoft.BatchAI/clusters/cluster\"},\"nodeCount\":1,\"toolType\":\"custom\",\"customToolkitSettings\":{\"commandLine\":\"echo hello from job\"},\"jobPreparation\":{\"commandLine\":\"echo hello from job preparation\"},\"stdOutErrPathPrefix\":\"$AZ_BATCHAI_MOUNT_ROOT/azfs\",\"outputDirectories\":[{\"id\":\"MODEL\",\"pathPrefix\":\"$AZ_BATCHAI_MOUNT_ROOT/azfs\",\"pathSuffix\":\"model\",\"type\":\"custom\",\"createNew\":true}],\"environmentVariables\":[{\"name\":\"ENVIRONMENT_VARIABLE_1\",\"value\":\"Value1\"},{\"name\":\"ENVIRONMENT_VARIABLE_2\",\"value\":\"Value2\"}],\"constraints\":{\"maxWallClockTime\":\"P7D\"},\"creationTime\":\"2017-10-31T18:05:38.056Z\",\"provisioningState\":\"succeeded\",\"provisioningStateTransitionTime\":\"2017-10-31T18:05:39.358Z\",\"executionState\":\"succeeded\",\"executionStateTransitionTime\":\"2017-10-31T18:05:42.545Z\",\"executionInfo\":{\"startTime\":\"2017-10-31T18:05:40.285Z\",\"endTime\":\"2017-10-31T18:05:42.545Z\",\"exitCode\":0}}}", { 'cache-control': 'no-cache',
  pragma: 'no-cache',
  'content-length': '1198',
  'content-type': 'application/json; charset=utf-8',
  expires: '-1',
  'last-modified': 'Tue, 31 Oct 2017 18:05:38 GMT',
  etag: '"0x8D52089FDA0AF28"',
  'x-ms-ratelimit-remaining-subscription-reads': '14997',
  'request-id': 'f3fe9388-d950-472c-9306-4dfdd8a41bdb',
  'strict-transport-security': 'max-age=31536000; includeSubDomains',
  'x-content-type-options': 'nosniff',
  server: 'Microsoft-HTTPAPI/2.0',
  'x-ms-request-id': '7dfd67c7-d39e-4608-be44-8740a83a5028',
  'x-ms-correlation-request-id': '7dfd67c7-d39e-4608-be44-8740a83a5028',
  'x-ms-routing-request-id': 'WESTUS2:20171031T180625Z:7dfd67c7-d39e-4608-be44-8740a83a5028',
  date: 'Tue, 31 Oct 2017 18:06:25 GMT',
  connection: 'close' });
 return result; },
function (nock) { 
var result = 
nock('https://management.azure.com:443')
  .get('/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/nodeTestGroup143/providers/Microsoft.BatchAI/jobs/job1?api-version=2017-09-01-preview')
  .reply(200, "{\"id\":\"/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/nodetestgroup143/providers/Microsoft.BatchAI/jobs/job1\",\"name\":\"job1\",\"type\":\"Microsoft.BatchAI/Jobs\",\"properties\":{\"priority\":0,\"cluster\":{\"id\":\"/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/nodetestgroup143/providers/Microsoft.BatchAI/clusters/cluster\"},\"nodeCount\":1,\"toolType\":\"custom\",\"customToolkitSettings\":{\"commandLine\":\"echo hello from job\"},\"jobPreparation\":{\"commandLine\":\"echo hello from job preparation\"},\"stdOutErrPathPrefix\":\"$AZ_BATCHAI_MOUNT_ROOT/azfs\",\"outputDirectories\":[{\"id\":\"MODEL\",\"pathPrefix\":\"$AZ_BATCHAI_MOUNT_ROOT/azfs\",\"pathSuffix\":\"model\",\"type\":\"custom\",\"createNew\":true}],\"environmentVariables\":[{\"name\":\"ENVIRONMENT_VARIABLE_1\",\"value\":\"Value1\"},{\"name\":\"ENVIRONMENT_VARIABLE_2\",\"value\":\"Value2\"}],\"constraints\":{\"maxWallClockTime\":\"P7D\"},\"creationTime\":\"2017-10-31T18:05:38.056Z\",\"provisioningState\":\"succeeded\",\"provisioningStateTransitionTime\":\"2017-10-31T18:05:39.358Z\",\"executionState\":\"succeeded\",\"executionStateTransitionTime\":\"2017-10-31T18:05:42.545Z\",\"executionInfo\":{\"startTime\":\"2017-10-31T18:05:40.285Z\",\"endTime\":\"2017-10-31T18:05:42.545Z\",\"exitCode\":0}}}", { 'cache-control': 'no-cache',
  pragma: 'no-cache',
  'content-length': '1198',
  'content-type': 'application/json; charset=utf-8',
  expires: '-1',
  'last-modified': 'Tue, 31 Oct 2017 18:05:38 GMT',
  etag: '"0x8D52089FDA0AF28"',
  'x-ms-ratelimit-remaining-subscription-reads': '14997',
  'request-id': 'f3fe9388-d950-472c-9306-4dfdd8a41bdb',
  'strict-transport-security': 'max-age=31536000; includeSubDomains',
  'x-content-type-options': 'nosniff',
  server: 'Microsoft-HTTPAPI/2.0',
  'x-ms-request-id': '7dfd67c7-d39e-4608-be44-8740a83a5028',
  'x-ms-correlation-request-id': '7dfd67c7-d39e-4608-be44-8740a83a5028',
  'x-ms-routing-request-id': 'WESTUS2:20171031T180625Z:7dfd67c7-d39e-4608-be44-8740a83a5028',
  date: 'Tue, 31 Oct 2017 18:06:25 GMT',
  connection: 'close' });
 return result; },
function (nock) { 
var result = 
nock('http://management.azure.com:443')
  .post('/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/nodeTestGroup143/providers/Microsoft.BatchAI/jobs/job1/listOutputFiles?api-version=2017-09-01-preview&outputdirectoryid=stdouterr')
  .reply(200, "{\"value\":[{\"name\":\"stderr-job_prep.txt\",\"downloadUrl\":\"https://testacc9517.file.core.windows.net/azfileshare/00000000-0000-0000-0000-000000000000/nodetestgroup143/jobs/job1/5d0c4027-09a7-48c3-889a-20e99a18f0e8/stderr-job_prep.txt?sv=2016-05-31&sr=f&sig=i8rGcuQMEMZ0TpLCfgCRjo%2F3BLXUQBE15py19rQ451c%3D&se=2017-10-31T19%3A06%3A24Z&sp=rl\",\"properties\":{\"lastModified\":\"2017-10-31T18:05:41Z\",\"contentLength\":0}},{\"name\":\"stderr.txt\",\"downloadUrl\":\"https://testacc9517.file.core.windows.net/azfileshare/00000000-0000-0000-0000-000000000000/nodetestgroup143/jobs/job1/5d0c4027-09a7-48c3-889a-20e99a18f0e8/stderr.txt?sv=2016-05-31&sr=f&sig=234xB9PDPuzMY8GGttFZCGO9X7VWikrNrTNu5OTjS7c%3D&se=2017-10-31T19%3A06%3A24Z&sp=rl\",\"properties\":{\"lastModified\":\"2017-10-31T18:05:42Z\",\"contentLength\":0}},{\"name\":\"stdout-job_prep.txt\",\"downloadUrl\":\"https://testacc9517.file.core.windows.net/azfileshare/00000000-0000-0000-0000-000000000000/nodetestgroup143/jobs/job1/5d0c4027-09a7-48c3-889a-20e99a18f0e8/stdout-job_prep.txt?sv=2016-05-31&sr=f&sig=QHqEYxMHzhi6bBgq7bJh9m4kN0GWYi8i4y2QNyq1e1o%3D&se=2017-10-31T19%3A06%3A24Z&sp=rl\",\"properties\":{\"lastModified\":\"2017-10-31T18:05:42Z\",\"contentLength\":27}},{\"name\":\"stdout.txt\",\"downloadUrl\":\"https://testacc9517.file.core.windows.net/azfileshare/00000000-0000-0000-0000-000000000000/nodetestgroup143/jobs/job1/5d0c4027-09a7-48c3-889a-20e99a18f0e8/stdout.txt?sv=2016-05-31&sr=f&sig=r9I4XzhRwijxLWY6kOrQ8ApuBakUHB2pCOVGVh9y%2F7E%3D&se=2017-10-31T19%3A06%3A24Z&sp=rl\",\"properties\":{\"lastModified\":\"2017-10-31T18:05:42Z\",\"contentLength\":15}}]}", { 'cache-control': 'no-cache',
  pragma: 'no-cache',
  'content-length': '1569',
  'content-type': 'application/json; charset=utf-8',
  expires: '-1',
  'x-ms-ratelimit-remaining-subscription-reads': '14996',
  'request-id': '5cd93031-0033-4b38-a4de-a3bf37f2eb4f',
  'strict-transport-security': 'max-age=31536000; includeSubDomains',
  'x-content-type-options': 'nosniff',
  server: 'Microsoft-HTTPAPI/2.0',
  'x-ms-request-id': '7561a568-54d1-4870-a09d-62576af43882',
  'x-ms-correlation-request-id': '7561a568-54d1-4870-a09d-62576af43882',
  'x-ms-routing-request-id': 'WESTUS2:20171031T180626Z:7561a568-54d1-4870-a09d-62576af43882',
  date: 'Tue, 31 Oct 2017 18:06:26 GMT',
  connection: 'close' });
 return result; },
function (nock) { 
var result = 
nock('https://management.azure.com:443')
  .post('/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/nodeTestGroup143/providers/Microsoft.BatchAI/jobs/job1/listOutputFiles?api-version=2017-09-01-preview&outputdirectoryid=stdouterr')
  .reply(200, "{\"value\":[{\"name\":\"stderr-job_prep.txt\",\"downloadUrl\":\"https://testacc9517.file.core.windows.net/azfileshare/00000000-0000-0000-0000-000000000000/nodetestgroup143/jobs/job1/5d0c4027-09a7-48c3-889a-20e99a18f0e8/stderr-job_prep.txt?sv=2016-05-31&sr=f&sig=i8rGcuQMEMZ0TpLCfgCRjo%2F3BLXUQBE15py19rQ451c%3D&se=2017-10-31T19%3A06%3A24Z&sp=rl\",\"properties\":{\"lastModified\":\"2017-10-31T18:05:41Z\",\"contentLength\":0}},{\"name\":\"stderr.txt\",\"downloadUrl\":\"https://testacc9517.file.core.windows.net/azfileshare/00000000-0000-0000-0000-000000000000/nodetestgroup143/jobs/job1/5d0c4027-09a7-48c3-889a-20e99a18f0e8/stderr.txt?sv=2016-05-31&sr=f&sig=234xB9PDPuzMY8GGttFZCGO9X7VWikrNrTNu5OTjS7c%3D&se=2017-10-31T19%3A06%3A24Z&sp=rl\",\"properties\":{\"lastModified\":\"2017-10-31T18:05:42Z\",\"contentLength\":0}},{\"name\":\"stdout-job_prep.txt\",\"downloadUrl\":\"https://testacc9517.file.core.windows.net/azfileshare/00000000-0000-0000-0000-000000000000/nodetestgroup143/jobs/job1/5d0c4027-09a7-48c3-889a-20e99a18f0e8/stdout-job_prep.txt?sv=2016-05-31&sr=f&sig=QHqEYxMHzhi6bBgq7bJh9m4kN0GWYi8i4y2QNyq1e1o%3D&se=2017-10-31T19%3A06%3A24Z&sp=rl\",\"properties\":{\"lastModified\":\"2017-10-31T18:05:42Z\",\"contentLength\":27}},{\"name\":\"stdout.txt\",\"downloadUrl\":\"https://testacc9517.file.core.windows.net/azfileshare/00000000-0000-0000-0000-000000000000/nodetestgroup143/jobs/job1/5d0c4027-09a7-48c3-889a-20e99a18f0e8/stdout.txt?sv=2016-05-31&sr=f&sig=r9I4XzhRwijxLWY6kOrQ8ApuBakUHB2pCOVGVh9y%2F7E%3D&se=2017-10-31T19%3A06%3A24Z&sp=rl\",\"properties\":{\"lastModified\":\"2017-10-31T18:05:42Z\",\"contentLength\":15}}]}", { 'cache-control': 'no-cache',
  pragma: 'no-cache',
  'content-length': '1569',
  'content-type': 'application/json; charset=utf-8',
  expires: '-1',
  'x-ms-ratelimit-remaining-subscription-reads': '14996',
  'request-id': '5cd93031-0033-4b38-a4de-a3bf37f2eb4f',
  'strict-transport-security': 'max-age=31536000; includeSubDomains',
  'x-content-type-options': 'nosniff',
  server: 'Microsoft-HTTPAPI/2.0',
  'x-ms-request-id': '7561a568-54d1-4870-a09d-62576af43882',
  'x-ms-correlation-request-id': '7561a568-54d1-4870-a09d-62576af43882',
  'x-ms-routing-request-id': 'WESTUS2:20171031T180626Z:7561a568-54d1-4870-a09d-62576af43882',
  date: 'Tue, 31 Oct 2017 18:06:26 GMT',
  connection: 'close' });
 return result; }]];