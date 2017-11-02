exports.scopes = [[function (nock) {
var result = 
nock('http://management.azure.com:443')
  .filteringRequestBody(function (path) { return '*';})
.put('/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/nodeTestGroup143/providers/Microsoft.BatchAI/jobs/job2?api-version=2017-09-01-preview', '*')
  .reply(202, "", { 'cache-control': 'no-cache',
  pragma: 'no-cache',
  expires: '-1',
  location: 'https://management.azure.com/subscriptions/00000000-0000-0000-0000-000000000000/providers/Microsoft.BatchAI/locations/eastus/operationstatuses/7ee91065-5707-4c21-9435-fe8043c00b67?api-version=2017-09-01-preview',
  'retry-after': '15',
  'request-id': '54831355-d971-4f14-858d-f2d3e63d1a85',
  'strict-transport-security': 'max-age=31536000; includeSubDomains',
  'x-content-type-options': 'nosniff',
  'azure-asyncoperation': 'https://management.azure.com/subscriptions/00000000-0000-0000-0000-000000000000/providers/Microsoft.BatchAI/locations/eastus/operationresults/7ee91065-5707-4c21-9435-fe8043c00b67?api-version=2017-09-01-preview',
  server: 'Microsoft-HTTPAPI/2.0',
  'x-ms-ratelimit-remaining-subscription-writes': '1199',
  'x-ms-request-id': 'f00f1bd6-95c6-46e2-acd5-3ca1f2251572',
  'x-ms-correlation-request-id': 'f00f1bd6-95c6-46e2-acd5-3ca1f2251572',
  'x-ms-routing-request-id': 'WESTUS2:20171031T180628Z:f00f1bd6-95c6-46e2-acd5-3ca1f2251572',
  date: 'Tue, 31 Oct 2017 18:06:28 GMT',
  connection: 'close',
  'content-length': '0' });
 return result; },
function (nock) { 
var result = 
nock('https://management.azure.com:443')
  .filteringRequestBody(function (path) { return '*';})
.put('/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/nodeTestGroup143/providers/Microsoft.BatchAI/jobs/job2?api-version=2017-09-01-preview', '*')
  .reply(202, "", { 'cache-control': 'no-cache',
  pragma: 'no-cache',
  expires: '-1',
  location: 'https://management.azure.com/subscriptions/00000000-0000-0000-0000-000000000000/providers/Microsoft.BatchAI/locations/eastus/operationstatuses/7ee91065-5707-4c21-9435-fe8043c00b67?api-version=2017-09-01-preview',
  'retry-after': '15',
  'request-id': '54831355-d971-4f14-858d-f2d3e63d1a85',
  'strict-transport-security': 'max-age=31536000; includeSubDomains',
  'x-content-type-options': 'nosniff',
  'azure-asyncoperation': 'https://management.azure.com/subscriptions/00000000-0000-0000-0000-000000000000/providers/Microsoft.BatchAI/locations/eastus/operationresults/7ee91065-5707-4c21-9435-fe8043c00b67?api-version=2017-09-01-preview',
  server: 'Microsoft-HTTPAPI/2.0',
  'x-ms-ratelimit-remaining-subscription-writes': '1199',
  'x-ms-request-id': 'f00f1bd6-95c6-46e2-acd5-3ca1f2251572',
  'x-ms-correlation-request-id': 'f00f1bd6-95c6-46e2-acd5-3ca1f2251572',
  'x-ms-routing-request-id': 'WESTUS2:20171031T180628Z:f00f1bd6-95c6-46e2-acd5-3ca1f2251572',
  date: 'Tue, 31 Oct 2017 18:06:28 GMT',
  connection: 'close',
  'content-length': '0' });
 return result; },
function (nock) { 
var result = 
nock('http://management.azure.com:443')
  .get('/subscriptions/00000000-0000-0000-0000-000000000000/providers/Microsoft.BatchAI/locations/eastus/operationresults/7ee91065-5707-4c21-9435-fe8043c00b67?api-version=2017-09-01-preview')
  .reply(200, "{\"id\":\"https://management.azure.com/subscriptions/00000000-0000-0000-0000-000000000000/providers/Microsoft.BatchAI/locations/eastus/operationresults/7ee91065-5707-4c21-9435-fe8043c00b67\",\"name\":\"7ee91065-5707-4c21-9435-fe8043c00b67\",\"status\":\"Succeeded\",\"startTime\":\"2017-10-31T18:06:28.383Z\",\"endTime\":\"2017-10-31T18:06:29.477Z\",\"properties\":{\"resourceId\":\"00000000-0000-0000-0000-000000000000$nodetestgroup143$job2\"}}", { 'cache-control': 'no-cache',
  pragma: 'no-cache',
  'content-length': '419',
  'content-type': 'application/json; charset=utf-8',
  expires: '-1',
  'x-ms-ratelimit-remaining-subscription-reads': '14995',
  'request-id': 'cc16a4b3-6aa6-4c65-9237-0308454a9957',
  'strict-transport-security': 'max-age=31536000; includeSubDomains',
  'x-content-type-options': 'nosniff',
  server: 'Microsoft-HTTPAPI/2.0',
  'x-ms-request-id': '01187cda-bc87-4107-b1d1-3908b4f34b7a',
  'x-ms-correlation-request-id': '01187cda-bc87-4107-b1d1-3908b4f34b7a',
  'x-ms-routing-request-id': 'WESTUS2:20171031T180659Z:01187cda-bc87-4107-b1d1-3908b4f34b7a',
  date: 'Tue, 31 Oct 2017 18:06:59 GMT',
  connection: 'close' });
 return result; },
function (nock) { 
var result = 
nock('https://management.azure.com:443')
  .get('/subscriptions/00000000-0000-0000-0000-000000000000/providers/Microsoft.BatchAI/locations/eastus/operationresults/7ee91065-5707-4c21-9435-fe8043c00b67?api-version=2017-09-01-preview')
  .reply(200, "{\"id\":\"https://management.azure.com/subscriptions/00000000-0000-0000-0000-000000000000/providers/Microsoft.BatchAI/locations/eastus/operationresults/7ee91065-5707-4c21-9435-fe8043c00b67\",\"name\":\"7ee91065-5707-4c21-9435-fe8043c00b67\",\"status\":\"Succeeded\",\"startTime\":\"2017-10-31T18:06:28.383Z\",\"endTime\":\"2017-10-31T18:06:29.477Z\",\"properties\":{\"resourceId\":\"00000000-0000-0000-0000-000000000000$nodetestgroup143$job2\"}}", { 'cache-control': 'no-cache',
  pragma: 'no-cache',
  'content-length': '419',
  'content-type': 'application/json; charset=utf-8',
  expires: '-1',
  'x-ms-ratelimit-remaining-subscription-reads': '14995',
  'request-id': 'cc16a4b3-6aa6-4c65-9237-0308454a9957',
  'strict-transport-security': 'max-age=31536000; includeSubDomains',
  'x-content-type-options': 'nosniff',
  server: 'Microsoft-HTTPAPI/2.0',
  'x-ms-request-id': '01187cda-bc87-4107-b1d1-3908b4f34b7a',
  'x-ms-correlation-request-id': '01187cda-bc87-4107-b1d1-3908b4f34b7a',
  'x-ms-routing-request-id': 'WESTUS2:20171031T180659Z:01187cda-bc87-4107-b1d1-3908b4f34b7a',
  date: 'Tue, 31 Oct 2017 18:06:59 GMT',
  connection: 'close' });
 return result; },
function (nock) { 
var result = 
nock('http://management.azure.com:443')
  .get('/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/nodeTestGroup143/providers/Microsoft.BatchAI/jobs/job2?api-version=2017-09-01-preview')
  .reply(200, "{\"id\":\"/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/nodetestgroup143/providers/Microsoft.BatchAI/jobs/job2\",\"name\":\"job2\",\"type\":\"Microsoft.BatchAI/Jobs\",\"properties\":{\"priority\":0,\"cluster\":{\"id\":\"/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/nodetestgroup143/providers/Microsoft.BatchAI/clusters/cluster\"},\"nodeCount\":1,\"containerSettings\":{\"imageSourceRegistry\":{\"image\":\"ubuntu\"}},\"toolType\":\"custom\",\"customToolkitSettings\":{\"commandLine\":\"echo hello from job\"},\"jobPreparation\":{\"commandLine\":\"echo hello from job preparation\"},\"stdOutErrPathPrefix\":\"$AZ_BATCHAI_MOUNT_ROOT/azfs\",\"constraints\":{\"maxWallClockTime\":\"P7D\"},\"creationTime\":\"2017-10-31T18:06:28.367Z\",\"provisioningState\":\"succeeded\",\"provisioningStateTransitionTime\":\"2017-10-31T18:06:29.461Z\",\"executionState\":\"succeeded\",\"executionStateTransitionTime\":\"2017-10-31T18:07:01.004Z\",\"executionInfo\":{\"startTime\":\"2017-10-31T18:06:30.558Z\",\"endTime\":\"2017-10-31T18:07:01.004Z\",\"exitCode\":0}}}", { 'cache-control': 'no-cache',
  pragma: 'no-cache',
  'content-length': '1000',
  'content-type': 'application/json; charset=utf-8',
  expires: '-1',
  'last-modified': 'Tue, 31 Oct 2017 18:06:28 GMT',
  etag: '"0x8D5208A1B9D814B"',
  'x-ms-ratelimit-remaining-subscription-reads': '14998',
  'request-id': '4bfd4f4d-51f2-4645-8ffe-3fa2ff8b9b72',
  'strict-transport-security': 'max-age=31536000; includeSubDomains',
  'x-content-type-options': 'nosniff',
  server: 'Microsoft-HTTPAPI/2.0',
  'x-ms-request-id': 'f151989f-04b5-4204-81b4-da192beb3adc',
  'x-ms-correlation-request-id': 'f151989f-04b5-4204-81b4-da192beb3adc',
  'x-ms-routing-request-id': 'WESTUS2:20171031T180701Z:f151989f-04b5-4204-81b4-da192beb3adc',
  date: 'Tue, 31 Oct 2017 18:07:00 GMT',
  connection: 'close' });
 return result; },
function (nock) { 
var result = 
nock('https://management.azure.com:443')
  .get('/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/nodeTestGroup143/providers/Microsoft.BatchAI/jobs/job2?api-version=2017-09-01-preview')
  .reply(200, "{\"id\":\"/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/nodetestgroup143/providers/Microsoft.BatchAI/jobs/job2\",\"name\":\"job2\",\"type\":\"Microsoft.BatchAI/Jobs\",\"properties\":{\"priority\":0,\"cluster\":{\"id\":\"/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/nodetestgroup143/providers/Microsoft.BatchAI/clusters/cluster\"},\"nodeCount\":1,\"containerSettings\":{\"imageSourceRegistry\":{\"image\":\"ubuntu\"}},\"toolType\":\"custom\",\"customToolkitSettings\":{\"commandLine\":\"echo hello from job\"},\"jobPreparation\":{\"commandLine\":\"echo hello from job preparation\"},\"stdOutErrPathPrefix\":\"$AZ_BATCHAI_MOUNT_ROOT/azfs\",\"constraints\":{\"maxWallClockTime\":\"P7D\"},\"creationTime\":\"2017-10-31T18:06:28.367Z\",\"provisioningState\":\"succeeded\",\"provisioningStateTransitionTime\":\"2017-10-31T18:06:29.461Z\",\"executionState\":\"succeeded\",\"executionStateTransitionTime\":\"2017-10-31T18:07:01.004Z\",\"executionInfo\":{\"startTime\":\"2017-10-31T18:06:30.558Z\",\"endTime\":\"2017-10-31T18:07:01.004Z\",\"exitCode\":0}}}", { 'cache-control': 'no-cache',
  pragma: 'no-cache',
  'content-length': '1000',
  'content-type': 'application/json; charset=utf-8',
  expires: '-1',
  'last-modified': 'Tue, 31 Oct 2017 18:06:28 GMT',
  etag: '"0x8D5208A1B9D814B"',
  'x-ms-ratelimit-remaining-subscription-reads': '14998',
  'request-id': '4bfd4f4d-51f2-4645-8ffe-3fa2ff8b9b72',
  'strict-transport-security': 'max-age=31536000; includeSubDomains',
  'x-content-type-options': 'nosniff',
  server: 'Microsoft-HTTPAPI/2.0',
  'x-ms-request-id': 'f151989f-04b5-4204-81b4-da192beb3adc',
  'x-ms-correlation-request-id': 'f151989f-04b5-4204-81b4-da192beb3adc',
  'x-ms-routing-request-id': 'WESTUS2:20171031T180701Z:f151989f-04b5-4204-81b4-da192beb3adc',
  date: 'Tue, 31 Oct 2017 18:07:00 GMT',
  connection: 'close' });
 return result; },
function (nock) { 
var result = 
nock('http://management.azure.com:443')
  .get('/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/nodeTestGroup143/providers/Microsoft.BatchAI/jobs/job2?api-version=2017-09-01-preview')
  .reply(200, "{\"id\":\"/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/nodetestgroup143/providers/Microsoft.BatchAI/jobs/job2\",\"name\":\"job2\",\"type\":\"Microsoft.BatchAI/Jobs\",\"properties\":{\"priority\":0,\"cluster\":{\"id\":\"/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/nodetestgroup143/providers/Microsoft.BatchAI/clusters/cluster\"},\"nodeCount\":1,\"containerSettings\":{\"imageSourceRegistry\":{\"image\":\"ubuntu\"}},\"toolType\":\"custom\",\"customToolkitSettings\":{\"commandLine\":\"echo hello from job\"},\"jobPreparation\":{\"commandLine\":\"echo hello from job preparation\"},\"stdOutErrPathPrefix\":\"$AZ_BATCHAI_MOUNT_ROOT/azfs\",\"constraints\":{\"maxWallClockTime\":\"P7D\"},\"creationTime\":\"2017-10-31T18:06:28.367Z\",\"provisioningState\":\"succeeded\",\"provisioningStateTransitionTime\":\"2017-10-31T18:06:29.461Z\",\"executionState\":\"succeeded\",\"executionStateTransitionTime\":\"2017-10-31T18:07:01.004Z\",\"executionInfo\":{\"startTime\":\"2017-10-31T18:06:30.558Z\",\"endTime\":\"2017-10-31T18:07:01.004Z\",\"exitCode\":0}}}", { 'cache-control': 'no-cache',
  pragma: 'no-cache',
  'content-length': '1000',
  'content-type': 'application/json; charset=utf-8',
  expires: '-1',
  'last-modified': 'Tue, 31 Oct 2017 18:06:28 GMT',
  etag: '"0x8D5208A1B9D814B"',
  'x-ms-ratelimit-remaining-subscription-reads': '14995',
  'request-id': '790e32fd-56f9-4864-b0b4-945e6aad218a',
  'strict-transport-security': 'max-age=31536000; includeSubDomains',
  'x-content-type-options': 'nosniff',
  server: 'Microsoft-HTTPAPI/2.0',
  'x-ms-request-id': '3b7bcbd2-7762-460b-b5f6-ae6478b47a0a',
  'x-ms-correlation-request-id': '3b7bcbd2-7762-460b-b5f6-ae6478b47a0a',
  'x-ms-routing-request-id': 'WESTUS2:20171031T180717Z:3b7bcbd2-7762-460b-b5f6-ae6478b47a0a',
  date: 'Tue, 31 Oct 2017 18:07:16 GMT',
  connection: 'close' });
 return result; },
function (nock) { 
var result = 
nock('https://management.azure.com:443')
  .get('/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/nodeTestGroup143/providers/Microsoft.BatchAI/jobs/job2?api-version=2017-09-01-preview')
  .reply(200, "{\"id\":\"/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/nodetestgroup143/providers/Microsoft.BatchAI/jobs/job2\",\"name\":\"job2\",\"type\":\"Microsoft.BatchAI/Jobs\",\"properties\":{\"priority\":0,\"cluster\":{\"id\":\"/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/nodetestgroup143/providers/Microsoft.BatchAI/clusters/cluster\"},\"nodeCount\":1,\"containerSettings\":{\"imageSourceRegistry\":{\"image\":\"ubuntu\"}},\"toolType\":\"custom\",\"customToolkitSettings\":{\"commandLine\":\"echo hello from job\"},\"jobPreparation\":{\"commandLine\":\"echo hello from job preparation\"},\"stdOutErrPathPrefix\":\"$AZ_BATCHAI_MOUNT_ROOT/azfs\",\"constraints\":{\"maxWallClockTime\":\"P7D\"},\"creationTime\":\"2017-10-31T18:06:28.367Z\",\"provisioningState\":\"succeeded\",\"provisioningStateTransitionTime\":\"2017-10-31T18:06:29.461Z\",\"executionState\":\"succeeded\",\"executionStateTransitionTime\":\"2017-10-31T18:07:01.004Z\",\"executionInfo\":{\"startTime\":\"2017-10-31T18:06:30.558Z\",\"endTime\":\"2017-10-31T18:07:01.004Z\",\"exitCode\":0}}}", { 'cache-control': 'no-cache',
  pragma: 'no-cache',
  'content-length': '1000',
  'content-type': 'application/json; charset=utf-8',
  expires: '-1',
  'last-modified': 'Tue, 31 Oct 2017 18:06:28 GMT',
  etag: '"0x8D5208A1B9D814B"',
  'x-ms-ratelimit-remaining-subscription-reads': '14995',
  'request-id': '790e32fd-56f9-4864-b0b4-945e6aad218a',
  'strict-transport-security': 'max-age=31536000; includeSubDomains',
  'x-content-type-options': 'nosniff',
  server: 'Microsoft-HTTPAPI/2.0',
  'x-ms-request-id': '3b7bcbd2-7762-460b-b5f6-ae6478b47a0a',
  'x-ms-correlation-request-id': '3b7bcbd2-7762-460b-b5f6-ae6478b47a0a',
  'x-ms-routing-request-id': 'WESTUS2:20171031T180717Z:3b7bcbd2-7762-460b-b5f6-ae6478b47a0a',
  date: 'Tue, 31 Oct 2017 18:07:16 GMT',
  connection: 'close' });
 return result; },
function (nock) { 
var result = 
nock('http://management.azure.com:443')
  .post('/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/nodeTestGroup143/providers/Microsoft.BatchAI/jobs/job2/listOutputFiles?api-version=2017-09-01-preview&outputdirectoryid=stdouterr')
  .reply(200, "{\"value\":[{\"name\":\"stderr-job_prep.txt\",\"downloadUrl\":\"https://testacc9517.file.core.windows.net/azfileshare/00000000-0000-0000-0000-000000000000/nodetestgroup143/jobs/job2/8c97e757-7178-4430-b7de-c835a2af91fe/stderr-job_prep.txt?sv=2016-05-31&sr=f&sig=Ty2XQFoCBwHFqX5vYKikBEaTuzcwF8sHcvf3jiwVf1o%3D&se=2017-10-31T19%3A07%3A17Z&sp=rl\",\"properties\":{\"lastModified\":\"2017-10-31T18:07:00Z\",\"contentLength\":0}},{\"name\":\"stderr.txt\",\"downloadUrl\":\"https://testacc9517.file.core.windows.net/azfileshare/00000000-0000-0000-0000-000000000000/nodetestgroup143/jobs/job2/8c97e757-7178-4430-b7de-c835a2af91fe/stderr.txt?sv=2016-05-31&sr=f&sig=K%2ByX1cyxHkRbxVjm2lKwTvAE067gMCmdknmNgzH%2BpkE%3D&se=2017-10-31T19%3A07%3A17Z&sp=rl\",\"properties\":{\"lastModified\":\"2017-10-31T18:07:01Z\",\"contentLength\":0}},{\"name\":\"stdout-job_prep.txt\",\"downloadUrl\":\"https://testacc9517.file.core.windows.net/azfileshare/00000000-0000-0000-0000-000000000000/nodetestgroup143/jobs/job2/8c97e757-7178-4430-b7de-c835a2af91fe/stdout-job_prep.txt?sv=2016-05-31&sr=f&sig=vmdDL%2FPzn4MgCEKOB14EAIKZZ0dChHiUX9kpZiZXOEs%3D&se=2017-10-31T19%3A07%3A17Z&sp=rl\",\"properties\":{\"lastModified\":\"2017-10-31T18:07:00Z\",\"contentLength\":27}},{\"name\":\"stdout.txt\",\"downloadUrl\":\"https://testacc9517.file.core.windows.net/azfileshare/00000000-0000-0000-0000-000000000000/nodetestgroup143/jobs/job2/8c97e757-7178-4430-b7de-c835a2af91fe/stdout.txt?sv=2016-05-31&sr=f&sig=rHgmgkqJa7Pf9gM%2BeqwtSEDP0nVhvN1eJtLs0zuLGZE%3D&se=2017-10-31T19%3A07%3A17Z&sp=rl\",\"properties\":{\"lastModified\":\"2017-10-31T18:07:01Z\",\"contentLength\":15}}]}", { 'cache-control': 'no-cache',
  pragma: 'no-cache',
  'content-length': '1573',
  'content-type': 'application/json; charset=utf-8',
  expires: '-1',
  'x-ms-ratelimit-remaining-subscription-reads': '14997',
  'request-id': '8c15b56d-73a9-48d8-a651-cd07ef63856c',
  'strict-transport-security': 'max-age=31536000; includeSubDomains',
  'x-content-type-options': 'nosniff',
  server: 'Microsoft-HTTPAPI/2.0',
  'x-ms-request-id': '915a7640-b4ce-436a-a6cb-f9761246fd7a',
  'x-ms-correlation-request-id': '915a7640-b4ce-436a-a6cb-f9761246fd7a',
  'x-ms-routing-request-id': 'WESTUS2:20171031T180718Z:915a7640-b4ce-436a-a6cb-f9761246fd7a',
  date: 'Tue, 31 Oct 2017 18:07:18 GMT',
  connection: 'close' });
 return result; },
function (nock) { 
var result = 
nock('https://management.azure.com:443')
  .post('/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/nodeTestGroup143/providers/Microsoft.BatchAI/jobs/job2/listOutputFiles?api-version=2017-09-01-preview&outputdirectoryid=stdouterr')
  .reply(200, "{\"value\":[{\"name\":\"stderr-job_prep.txt\",\"downloadUrl\":\"https://testacc9517.file.core.windows.net/azfileshare/00000000-0000-0000-0000-000000000000/nodetestgroup143/jobs/job2/8c97e757-7178-4430-b7de-c835a2af91fe/stderr-job_prep.txt?sv=2016-05-31&sr=f&sig=Ty2XQFoCBwHFqX5vYKikBEaTuzcwF8sHcvf3jiwVf1o%3D&se=2017-10-31T19%3A07%3A17Z&sp=rl\",\"properties\":{\"lastModified\":\"2017-10-31T18:07:00Z\",\"contentLength\":0}},{\"name\":\"stderr.txt\",\"downloadUrl\":\"https://testacc9517.file.core.windows.net/azfileshare/00000000-0000-0000-0000-000000000000/nodetestgroup143/jobs/job2/8c97e757-7178-4430-b7de-c835a2af91fe/stderr.txt?sv=2016-05-31&sr=f&sig=K%2ByX1cyxHkRbxVjm2lKwTvAE067gMCmdknmNgzH%2BpkE%3D&se=2017-10-31T19%3A07%3A17Z&sp=rl\",\"properties\":{\"lastModified\":\"2017-10-31T18:07:01Z\",\"contentLength\":0}},{\"name\":\"stdout-job_prep.txt\",\"downloadUrl\":\"https://testacc9517.file.core.windows.net/azfileshare/00000000-0000-0000-0000-000000000000/nodetestgroup143/jobs/job2/8c97e757-7178-4430-b7de-c835a2af91fe/stdout-job_prep.txt?sv=2016-05-31&sr=f&sig=vmdDL%2FPzn4MgCEKOB14EAIKZZ0dChHiUX9kpZiZXOEs%3D&se=2017-10-31T19%3A07%3A17Z&sp=rl\",\"properties\":{\"lastModified\":\"2017-10-31T18:07:00Z\",\"contentLength\":27}},{\"name\":\"stdout.txt\",\"downloadUrl\":\"https://testacc9517.file.core.windows.net/azfileshare/00000000-0000-0000-0000-000000000000/nodetestgroup143/jobs/job2/8c97e757-7178-4430-b7de-c835a2af91fe/stdout.txt?sv=2016-05-31&sr=f&sig=rHgmgkqJa7Pf9gM%2BeqwtSEDP0nVhvN1eJtLs0zuLGZE%3D&se=2017-10-31T19%3A07%3A17Z&sp=rl\",\"properties\":{\"lastModified\":\"2017-10-31T18:07:01Z\",\"contentLength\":15}}]}", { 'cache-control': 'no-cache',
  pragma: 'no-cache',
  'content-length': '1573',
  'content-type': 'application/json; charset=utf-8',
  expires: '-1',
  'x-ms-ratelimit-remaining-subscription-reads': '14997',
  'request-id': '8c15b56d-73a9-48d8-a651-cd07ef63856c',
  'strict-transport-security': 'max-age=31536000; includeSubDomains',
  'x-content-type-options': 'nosniff',
  server: 'Microsoft-HTTPAPI/2.0',
  'x-ms-request-id': '915a7640-b4ce-436a-a6cb-f9761246fd7a',
  'x-ms-correlation-request-id': '915a7640-b4ce-436a-a6cb-f9761246fd7a',
  'x-ms-routing-request-id': 'WESTUS2:20171031T180718Z:915a7640-b4ce-436a-a6cb-f9761246fd7a',
  date: 'Tue, 31 Oct 2017 18:07:18 GMT',
  connection: 'close' });
 return result; }]];