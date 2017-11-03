exports.scopes = [[function (nock) {
var result = 
nock('http://management.azure.com:443')
  .filteringRequestBody(function (path) { return '*';})
.put('/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/nodeTestGroup143/providers/Microsoft.BatchAI/jobs/job3?api-version=2017-09-01-preview', '*')
  .reply(202, "", { 'cache-control': 'no-cache',
  pragma: 'no-cache',
  expires: '-1',
  location: 'https://management.azure.com/subscriptions/00000000-0000-0000-0000-000000000000/providers/Microsoft.BatchAI/locations/eastus/operationstatuses/565b8238-b8a7-44cd-a58e-7b554925c604?api-version=2017-09-01-preview',
  'retry-after': '15',
  'request-id': '27547b21-5c1d-434b-80c8-43a6dbc5c7fe',
  'strict-transport-security': 'max-age=31536000; includeSubDomains',
  'x-content-type-options': 'nosniff',
  'azure-asyncoperation': 'https://management.azure.com/subscriptions/00000000-0000-0000-0000-000000000000/providers/Microsoft.BatchAI/locations/eastus/operationresults/565b8238-b8a7-44cd-a58e-7b554925c604?api-version=2017-09-01-preview',
  server: 'Microsoft-HTTPAPI/2.0',
  'x-ms-ratelimit-remaining-subscription-writes': '1199',
  'x-ms-request-id': '133322a6-429a-4ba6-af07-313658cb4922',
  'x-ms-correlation-request-id': '133322a6-429a-4ba6-af07-313658cb4922',
  'x-ms-routing-request-id': 'WESTUS2:20171031T180720Z:133322a6-429a-4ba6-af07-313658cb4922',
  date: 'Tue, 31 Oct 2017 18:07:19 GMT',
  connection: 'close',
  'content-length': '0' });
 return result; },
function (nock) { 
var result = 
nock('https://management.azure.com:443')
  .filteringRequestBody(function (path) { return '*';})
.put('/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/nodeTestGroup143/providers/Microsoft.BatchAI/jobs/job3?api-version=2017-09-01-preview', '*')
  .reply(202, "", { 'cache-control': 'no-cache',
  pragma: 'no-cache',
  expires: '-1',
  location: 'https://management.azure.com/subscriptions/00000000-0000-0000-0000-000000000000/providers/Microsoft.BatchAI/locations/eastus/operationstatuses/565b8238-b8a7-44cd-a58e-7b554925c604?api-version=2017-09-01-preview',
  'retry-after': '15',
  'request-id': '27547b21-5c1d-434b-80c8-43a6dbc5c7fe',
  'strict-transport-security': 'max-age=31536000; includeSubDomains',
  'x-content-type-options': 'nosniff',
  'azure-asyncoperation': 'https://management.azure.com/subscriptions/00000000-0000-0000-0000-000000000000/providers/Microsoft.BatchAI/locations/eastus/operationresults/565b8238-b8a7-44cd-a58e-7b554925c604?api-version=2017-09-01-preview',
  server: 'Microsoft-HTTPAPI/2.0',
  'x-ms-ratelimit-remaining-subscription-writes': '1199',
  'x-ms-request-id': '133322a6-429a-4ba6-af07-313658cb4922',
  'x-ms-correlation-request-id': '133322a6-429a-4ba6-af07-313658cb4922',
  'x-ms-routing-request-id': 'WESTUS2:20171031T180720Z:133322a6-429a-4ba6-af07-313658cb4922',
  date: 'Tue, 31 Oct 2017 18:07:19 GMT',
  connection: 'close',
  'content-length': '0' });
 return result; },
function (nock) { 
var result = 
nock('http://management.azure.com:443')
  .get('/subscriptions/00000000-0000-0000-0000-000000000000/providers/Microsoft.BatchAI/locations/eastus/operationresults/565b8238-b8a7-44cd-a58e-7b554925c604?api-version=2017-09-01-preview')
  .reply(200, "{\"id\":\"https://management.azure.com/subscriptions/00000000-0000-0000-0000-000000000000/providers/Microsoft.BatchAI/locations/eastus/operationresults/565b8238-b8a7-44cd-a58e-7b554925c604\",\"name\":\"565b8238-b8a7-44cd-a58e-7b554925c604\",\"status\":\"Succeeded\",\"startTime\":\"2017-10-31T18:07:20.299Z\",\"endTime\":\"2017-10-31T18:07:21.049Z\",\"properties\":{\"resourceId\":\"00000000-0000-0000-0000-000000000000$nodetestgroup143$job3\"}}", { 'cache-control': 'no-cache',
  pragma: 'no-cache',
  'content-length': '419',
  'content-type': 'application/json; charset=utf-8',
  expires: '-1',
  'x-ms-ratelimit-remaining-subscription-reads': '14995',
  'request-id': 'c4714703-4374-4670-99a5-6872febb67c7',
  'strict-transport-security': 'max-age=31536000; includeSubDomains',
  'x-content-type-options': 'nosniff',
  server: 'Microsoft-HTTPAPI/2.0',
  'x-ms-request-id': 'b2216b71-020e-4bb9-b8c9-ba6fe6faa9e4',
  'x-ms-correlation-request-id': 'b2216b71-020e-4bb9-b8c9-ba6fe6faa9e4',
  'x-ms-routing-request-id': 'WESTUS2:20171031T180751Z:b2216b71-020e-4bb9-b8c9-ba6fe6faa9e4',
  date: 'Tue, 31 Oct 2017 18:07:50 GMT',
  connection: 'close' });
 return result; },
function (nock) { 
var result = 
nock('https://management.azure.com:443')
  .get('/subscriptions/00000000-0000-0000-0000-000000000000/providers/Microsoft.BatchAI/locations/eastus/operationresults/565b8238-b8a7-44cd-a58e-7b554925c604?api-version=2017-09-01-preview')
  .reply(200, "{\"id\":\"https://management.azure.com/subscriptions/00000000-0000-0000-0000-000000000000/providers/Microsoft.BatchAI/locations/eastus/operationresults/565b8238-b8a7-44cd-a58e-7b554925c604\",\"name\":\"565b8238-b8a7-44cd-a58e-7b554925c604\",\"status\":\"Succeeded\",\"startTime\":\"2017-10-31T18:07:20.299Z\",\"endTime\":\"2017-10-31T18:07:21.049Z\",\"properties\":{\"resourceId\":\"00000000-0000-0000-0000-000000000000$nodetestgroup143$job3\"}}", { 'cache-control': 'no-cache',
  pragma: 'no-cache',
  'content-length': '419',
  'content-type': 'application/json; charset=utf-8',
  expires: '-1',
  'x-ms-ratelimit-remaining-subscription-reads': '14995',
  'request-id': 'c4714703-4374-4670-99a5-6872febb67c7',
  'strict-transport-security': 'max-age=31536000; includeSubDomains',
  'x-content-type-options': 'nosniff',
  server: 'Microsoft-HTTPAPI/2.0',
  'x-ms-request-id': 'b2216b71-020e-4bb9-b8c9-ba6fe6faa9e4',
  'x-ms-correlation-request-id': 'b2216b71-020e-4bb9-b8c9-ba6fe6faa9e4',
  'x-ms-routing-request-id': 'WESTUS2:20171031T180751Z:b2216b71-020e-4bb9-b8c9-ba6fe6faa9e4',
  date: 'Tue, 31 Oct 2017 18:07:50 GMT',
  connection: 'close' });
 return result; },
function (nock) { 
var result = 
nock('http://management.azure.com:443')
  .get('/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/nodeTestGroup143/providers/Microsoft.BatchAI/jobs/job3?api-version=2017-09-01-preview')
  .reply(200, "{\"id\":\"/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/nodetestgroup143/providers/Microsoft.BatchAI/jobs/job3\",\"name\":\"job3\",\"type\":\"Microsoft.BatchAI/Jobs\",\"properties\":{\"priority\":0,\"cluster\":{\"id\":\"/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/nodetestgroup143/providers/Microsoft.BatchAI/clusters/cluster\"},\"nodeCount\":1,\"toolType\":\"custom\",\"customToolkitSettings\":{\"commandLine\":\"ping localhost\"},\"stdOutErrPathPrefix\":\"$AZ_BATCHAI_MOUNT_ROOT/azfs\",\"constraints\":{\"maxWallClockTime\":\"P7D\"},\"creationTime\":\"2017-10-31T18:07:20.28Z\",\"provisioningState\":\"succeeded\",\"provisioningStateTransitionTime\":\"2017-10-31T18:07:21.017Z\",\"executionState\":\"running\",\"executionStateTransitionTime\":\"2017-10-31T18:07:22.903Z\",\"executionInfo\":{\"startTime\":\"2017-10-31T18:07:22.772Z\"}}}", { 'cache-control': 'no-cache',
  pragma: 'no-cache',
  'content-length': '812',
  'content-type': 'application/json; charset=utf-8',
  expires: '-1',
  'last-modified': 'Tue, 31 Oct 2017 18:07:20 GMT',
  etag: '"0x8D5208A3A8ECB6D"',
  'x-ms-ratelimit-remaining-subscription-reads': '14984',
  'request-id': '3beb514a-2a2d-46e6-a866-25fae36841ac',
  'strict-transport-security': 'max-age=31536000; includeSubDomains',
  'x-content-type-options': 'nosniff',
  server: 'Microsoft-HTTPAPI/2.0',
  'x-ms-request-id': '6831b28c-20b8-4a00-b6e4-5d4a851ab9ed',
  'x-ms-correlation-request-id': '6831b28c-20b8-4a00-b6e4-5d4a851ab9ed',
  'x-ms-routing-request-id': 'WESTUS2:20171031T180752Z:6831b28c-20b8-4a00-b6e4-5d4a851ab9ed',
  date: 'Tue, 31 Oct 2017 18:07:52 GMT',
  connection: 'close' });
 return result; },
function (nock) { 
var result = 
nock('https://management.azure.com:443')
  .get('/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/nodeTestGroup143/providers/Microsoft.BatchAI/jobs/job3?api-version=2017-09-01-preview')
  .reply(200, "{\"id\":\"/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/nodetestgroup143/providers/Microsoft.BatchAI/jobs/job3\",\"name\":\"job3\",\"type\":\"Microsoft.BatchAI/Jobs\",\"properties\":{\"priority\":0,\"cluster\":{\"id\":\"/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/nodetestgroup143/providers/Microsoft.BatchAI/clusters/cluster\"},\"nodeCount\":1,\"toolType\":\"custom\",\"customToolkitSettings\":{\"commandLine\":\"ping localhost\"},\"stdOutErrPathPrefix\":\"$AZ_BATCHAI_MOUNT_ROOT/azfs\",\"constraints\":{\"maxWallClockTime\":\"P7D\"},\"creationTime\":\"2017-10-31T18:07:20.28Z\",\"provisioningState\":\"succeeded\",\"provisioningStateTransitionTime\":\"2017-10-31T18:07:21.017Z\",\"executionState\":\"running\",\"executionStateTransitionTime\":\"2017-10-31T18:07:22.903Z\",\"executionInfo\":{\"startTime\":\"2017-10-31T18:07:22.772Z\"}}}", { 'cache-control': 'no-cache',
  pragma: 'no-cache',
  'content-length': '812',
  'content-type': 'application/json; charset=utf-8',
  expires: '-1',
  'last-modified': 'Tue, 31 Oct 2017 18:07:20 GMT',
  etag: '"0x8D5208A3A8ECB6D"',
  'x-ms-ratelimit-remaining-subscription-reads': '14984',
  'request-id': '3beb514a-2a2d-46e6-a866-25fae36841ac',
  'strict-transport-security': 'max-age=31536000; includeSubDomains',
  'x-content-type-options': 'nosniff',
  server: 'Microsoft-HTTPAPI/2.0',
  'x-ms-request-id': '6831b28c-20b8-4a00-b6e4-5d4a851ab9ed',
  'x-ms-correlation-request-id': '6831b28c-20b8-4a00-b6e4-5d4a851ab9ed',
  'x-ms-routing-request-id': 'WESTUS2:20171031T180752Z:6831b28c-20b8-4a00-b6e4-5d4a851ab9ed',
  date: 'Tue, 31 Oct 2017 18:07:52 GMT',
  connection: 'close' });
 return result; },
function (nock) { 
var result = 
nock('http://management.azure.com:443')
  .get('/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/nodeTestGroup143/providers/Microsoft.BatchAI/jobs/job3?api-version=2017-09-01-preview')
  .reply(200, "{\"id\":\"/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/nodetestgroup143/providers/Microsoft.BatchAI/jobs/job3\",\"name\":\"job3\",\"type\":\"Microsoft.BatchAI/Jobs\",\"properties\":{\"priority\":0,\"cluster\":{\"id\":\"/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/nodetestgroup143/providers/Microsoft.BatchAI/clusters/cluster\"},\"nodeCount\":1,\"toolType\":\"custom\",\"customToolkitSettings\":{\"commandLine\":\"ping localhost\"},\"stdOutErrPathPrefix\":\"$AZ_BATCHAI_MOUNT_ROOT/azfs\",\"constraints\":{\"maxWallClockTime\":\"P7D\"},\"creationTime\":\"2017-10-31T18:07:20.28Z\",\"provisioningState\":\"succeeded\",\"provisioningStateTransitionTime\":\"2017-10-31T18:07:21.017Z\",\"executionState\":\"running\",\"executionStateTransitionTime\":\"2017-10-31T18:07:22.903Z\",\"executionInfo\":{\"startTime\":\"2017-10-31T18:07:22.772Z\"}}}", { 'cache-control': 'no-cache',
  pragma: 'no-cache',
  'content-length': '812',
  'content-type': 'application/json; charset=utf-8',
  expires: '-1',
  'last-modified': 'Tue, 31 Oct 2017 18:07:20 GMT',
  etag: '"0x8D5208A3A8ECB6D"',
  'x-ms-ratelimit-remaining-subscription-reads': '14997',
  'request-id': '1dd7b5b3-3ec4-4ca2-83ed-13f80b0cc744',
  'strict-transport-security': 'max-age=31536000; includeSubDomains',
  'x-content-type-options': 'nosniff',
  server: 'Microsoft-HTTPAPI/2.0',
  'x-ms-request-id': '16414929-ac13-492f-afaa-0bef4bc72f9e',
  'x-ms-correlation-request-id': '16414929-ac13-492f-afaa-0bef4bc72f9e',
  'x-ms-routing-request-id': 'WESTUS2:20171031T180808Z:16414929-ac13-492f-afaa-0bef4bc72f9e',
  date: 'Tue, 31 Oct 2017 18:08:08 GMT',
  connection: 'close' });
 return result; },
function (nock) { 
var result = 
nock('https://management.azure.com:443')
  .get('/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/nodeTestGroup143/providers/Microsoft.BatchAI/jobs/job3?api-version=2017-09-01-preview')
  .reply(200, "{\"id\":\"/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/nodetestgroup143/providers/Microsoft.BatchAI/jobs/job3\",\"name\":\"job3\",\"type\":\"Microsoft.BatchAI/Jobs\",\"properties\":{\"priority\":0,\"cluster\":{\"id\":\"/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/nodetestgroup143/providers/Microsoft.BatchAI/clusters/cluster\"},\"nodeCount\":1,\"toolType\":\"custom\",\"customToolkitSettings\":{\"commandLine\":\"ping localhost\"},\"stdOutErrPathPrefix\":\"$AZ_BATCHAI_MOUNT_ROOT/azfs\",\"constraints\":{\"maxWallClockTime\":\"P7D\"},\"creationTime\":\"2017-10-31T18:07:20.28Z\",\"provisioningState\":\"succeeded\",\"provisioningStateTransitionTime\":\"2017-10-31T18:07:21.017Z\",\"executionState\":\"running\",\"executionStateTransitionTime\":\"2017-10-31T18:07:22.903Z\",\"executionInfo\":{\"startTime\":\"2017-10-31T18:07:22.772Z\"}}}", { 'cache-control': 'no-cache',
  pragma: 'no-cache',
  'content-length': '812',
  'content-type': 'application/json; charset=utf-8',
  expires: '-1',
  'last-modified': 'Tue, 31 Oct 2017 18:07:20 GMT',
  etag: '"0x8D5208A3A8ECB6D"',
  'x-ms-ratelimit-remaining-subscription-reads': '14997',
  'request-id': '1dd7b5b3-3ec4-4ca2-83ed-13f80b0cc744',
  'strict-transport-security': 'max-age=31536000; includeSubDomains',
  'x-content-type-options': 'nosniff',
  server: 'Microsoft-HTTPAPI/2.0',
  'x-ms-request-id': '16414929-ac13-492f-afaa-0bef4bc72f9e',
  'x-ms-correlation-request-id': '16414929-ac13-492f-afaa-0bef4bc72f9e',
  'x-ms-routing-request-id': 'WESTUS2:20171031T180808Z:16414929-ac13-492f-afaa-0bef4bc72f9e',
  date: 'Tue, 31 Oct 2017 18:08:08 GMT',
  connection: 'close' });
 return result; },
function (nock) { 
var result = 
nock('http://management.azure.com:443')
  .post('/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/nodeTestGroup143/providers/Microsoft.BatchAI/jobs/job3/terminate?api-version=2017-09-01-preview')
  .reply(202, "", { 'cache-control': 'no-cache',
  pragma: 'no-cache',
  expires: '-1',
  location: 'https://management.azure.com/subscriptions/00000000-0000-0000-0000-000000000000/providers/Microsoft.BatchAI/locations/eastus/operationstatuses/f032422d-617a-4d3f-854e-f9967da0ccc1?api-version=2017-09-01-preview',
  'retry-after': '15',
  'request-id': 'e9d79678-62e1-4cbc-96a4-f6ee67cd5d3e',
  'strict-transport-security': 'max-age=31536000; includeSubDomains',
  'x-content-type-options': 'nosniff',
  'azure-asyncoperation': 'https://management.azure.com/subscriptions/00000000-0000-0000-0000-000000000000/providers/Microsoft.BatchAI/locations/eastus/operationresults/f032422d-617a-4d3f-854e-f9967da0ccc1?api-version=2017-09-01-preview',
  server: 'Microsoft-HTTPAPI/2.0',
  'x-ms-ratelimit-remaining-subscription-writes': '1198',
  'x-ms-request-id': 'd60eb22f-ad11-4cd5-bd4e-b2a3e616f6cf',
  'x-ms-correlation-request-id': 'd60eb22f-ad11-4cd5-bd4e-b2a3e616f6cf',
  'x-ms-routing-request-id': 'WESTUS2:20171031T180809Z:d60eb22f-ad11-4cd5-bd4e-b2a3e616f6cf',
  date: 'Tue, 31 Oct 2017 18:08:09 GMT',
  connection: 'close',
  'content-length': '0' });
 return result; },
function (nock) { 
var result = 
nock('https://management.azure.com:443')
  .post('/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/nodeTestGroup143/providers/Microsoft.BatchAI/jobs/job3/terminate?api-version=2017-09-01-preview')
  .reply(202, "", { 'cache-control': 'no-cache',
  pragma: 'no-cache',
  expires: '-1',
  location: 'https://management.azure.com/subscriptions/00000000-0000-0000-0000-000000000000/providers/Microsoft.BatchAI/locations/eastus/operationstatuses/f032422d-617a-4d3f-854e-f9967da0ccc1?api-version=2017-09-01-preview',
  'retry-after': '15',
  'request-id': 'e9d79678-62e1-4cbc-96a4-f6ee67cd5d3e',
  'strict-transport-security': 'max-age=31536000; includeSubDomains',
  'x-content-type-options': 'nosniff',
  'azure-asyncoperation': 'https://management.azure.com/subscriptions/00000000-0000-0000-0000-000000000000/providers/Microsoft.BatchAI/locations/eastus/operationresults/f032422d-617a-4d3f-854e-f9967da0ccc1?api-version=2017-09-01-preview',
  server: 'Microsoft-HTTPAPI/2.0',
  'x-ms-ratelimit-remaining-subscription-writes': '1198',
  'x-ms-request-id': 'd60eb22f-ad11-4cd5-bd4e-b2a3e616f6cf',
  'x-ms-correlation-request-id': 'd60eb22f-ad11-4cd5-bd4e-b2a3e616f6cf',
  'x-ms-routing-request-id': 'WESTUS2:20171031T180809Z:d60eb22f-ad11-4cd5-bd4e-b2a3e616f6cf',
  date: 'Tue, 31 Oct 2017 18:08:09 GMT',
  connection: 'close',
  'content-length': '0' });
 return result; },
function (nock) { 
var result = 
nock('http://management.azure.com:443')
  .get('/subscriptions/00000000-0000-0000-0000-000000000000/providers/Microsoft.BatchAI/locations/eastus/operationresults/f032422d-617a-4d3f-854e-f9967da0ccc1?api-version=2017-09-01-preview')
  .reply(200, "{\"id\":\"https://management.azure.com/subscriptions/00000000-0000-0000-0000-000000000000/providers/Microsoft.BatchAI/locations/eastus/operationresults/f032422d-617a-4d3f-854e-f9967da0ccc1\",\"name\":\"f032422d-617a-4d3f-854e-f9967da0ccc1\",\"status\":\"InProgress\",\"startTime\":\"2017-10-31T18:08:09.239Z\"}", { 'cache-control': 'no-cache',
  pragma: 'no-cache',
  'content-length': '294',
  'content-type': 'application/json; charset=utf-8',
  expires: '-1',
  'x-ms-ratelimit-remaining-subscription-reads': '14996',
  'request-id': 'ab635ae5-7c35-4932-b5d8-53e7f9718113',
  'strict-transport-security': 'max-age=31536000; includeSubDomains',
  'x-content-type-options': 'nosniff',
  server: 'Microsoft-HTTPAPI/2.0',
  'x-ms-request-id': 'ff22e0dd-33df-47e9-a7c3-e25be5db0422',
  'x-ms-correlation-request-id': 'ff22e0dd-33df-47e9-a7c3-e25be5db0422',
  'x-ms-routing-request-id': 'WESTUS2:20171031T180840Z:ff22e0dd-33df-47e9-a7c3-e25be5db0422',
  date: 'Tue, 31 Oct 2017 18:08:40 GMT',
  connection: 'close' });
 return result; },
function (nock) { 
var result = 
nock('https://management.azure.com:443')
  .get('/subscriptions/00000000-0000-0000-0000-000000000000/providers/Microsoft.BatchAI/locations/eastus/operationresults/f032422d-617a-4d3f-854e-f9967da0ccc1?api-version=2017-09-01-preview')
  .reply(200, "{\"id\":\"https://management.azure.com/subscriptions/00000000-0000-0000-0000-000000000000/providers/Microsoft.BatchAI/locations/eastus/operationresults/f032422d-617a-4d3f-854e-f9967da0ccc1\",\"name\":\"f032422d-617a-4d3f-854e-f9967da0ccc1\",\"status\":\"InProgress\",\"startTime\":\"2017-10-31T18:08:09.239Z\"}", { 'cache-control': 'no-cache',
  pragma: 'no-cache',
  'content-length': '294',
  'content-type': 'application/json; charset=utf-8',
  expires: '-1',
  'x-ms-ratelimit-remaining-subscription-reads': '14996',
  'request-id': 'ab635ae5-7c35-4932-b5d8-53e7f9718113',
  'strict-transport-security': 'max-age=31536000; includeSubDomains',
  'x-content-type-options': 'nosniff',
  server: 'Microsoft-HTTPAPI/2.0',
  'x-ms-request-id': 'ff22e0dd-33df-47e9-a7c3-e25be5db0422',
  'x-ms-correlation-request-id': 'ff22e0dd-33df-47e9-a7c3-e25be5db0422',
  'x-ms-routing-request-id': 'WESTUS2:20171031T180840Z:ff22e0dd-33df-47e9-a7c3-e25be5db0422',
  date: 'Tue, 31 Oct 2017 18:08:40 GMT',
  connection: 'close' });
 return result; },
function (nock) { 
var result = 
nock('http://management.azure.com:443')
  .get('/subscriptions/00000000-0000-0000-0000-000000000000/providers/Microsoft.BatchAI/locations/eastus/operationresults/f032422d-617a-4d3f-854e-f9967da0ccc1?api-version=2017-09-01-preview')
  .reply(200, "{\"id\":\"https://management.azure.com/subscriptions/00000000-0000-0000-0000-000000000000/providers/Microsoft.BatchAI/locations/eastus/operationresults/f032422d-617a-4d3f-854e-f9967da0ccc1\",\"name\":\"f032422d-617a-4d3f-854e-f9967da0ccc1\",\"status\":\"Succeeded\",\"startTime\":\"2017-10-31T18:08:09.239Z\",\"endTime\":\"2017-10-31T18:09:09.906Z\",\"properties\":{\"resourceId\":\"00000000-0000-0000-0000-000000000000$nodetestgroup143$job3\"}}", { 'cache-control': 'no-cache',
  pragma: 'no-cache',
  'content-length': '419',
  'content-type': 'application/json; charset=utf-8',
  expires: '-1',
  'x-ms-ratelimit-remaining-subscription-reads': '14995',
  'request-id': '5fe1e1c5-f92c-4657-8473-adbcb5112ddd',
  'strict-transport-security': 'max-age=31536000; includeSubDomains',
  'x-content-type-options': 'nosniff',
  server: 'Microsoft-HTTPAPI/2.0',
  'x-ms-request-id': '9cdf5f3f-621c-4da1-b11d-cbb9a9fb96ce',
  'x-ms-correlation-request-id': '9cdf5f3f-621c-4da1-b11d-cbb9a9fb96ce',
  'x-ms-routing-request-id': 'WESTUS2:20171031T180911Z:9cdf5f3f-621c-4da1-b11d-cbb9a9fb96ce',
  date: 'Tue, 31 Oct 2017 18:09:10 GMT',
  connection: 'close' });
 return result; },
function (nock) { 
var result = 
nock('https://management.azure.com:443')
  .get('/subscriptions/00000000-0000-0000-0000-000000000000/providers/Microsoft.BatchAI/locations/eastus/operationresults/f032422d-617a-4d3f-854e-f9967da0ccc1?api-version=2017-09-01-preview')
  .reply(200, "{\"id\":\"https://management.azure.com/subscriptions/00000000-0000-0000-0000-000000000000/providers/Microsoft.BatchAI/locations/eastus/operationresults/f032422d-617a-4d3f-854e-f9967da0ccc1\",\"name\":\"f032422d-617a-4d3f-854e-f9967da0ccc1\",\"status\":\"Succeeded\",\"startTime\":\"2017-10-31T18:08:09.239Z\",\"endTime\":\"2017-10-31T18:09:09.906Z\",\"properties\":{\"resourceId\":\"00000000-0000-0000-0000-000000000000$nodetestgroup143$job3\"}}", { 'cache-control': 'no-cache',
  pragma: 'no-cache',
  'content-length': '419',
  'content-type': 'application/json; charset=utf-8',
  expires: '-1',
  'x-ms-ratelimit-remaining-subscription-reads': '14995',
  'request-id': '5fe1e1c5-f92c-4657-8473-adbcb5112ddd',
  'strict-transport-security': 'max-age=31536000; includeSubDomains',
  'x-content-type-options': 'nosniff',
  server: 'Microsoft-HTTPAPI/2.0',
  'x-ms-request-id': '9cdf5f3f-621c-4da1-b11d-cbb9a9fb96ce',
  'x-ms-correlation-request-id': '9cdf5f3f-621c-4da1-b11d-cbb9a9fb96ce',
  'x-ms-routing-request-id': 'WESTUS2:20171031T180911Z:9cdf5f3f-621c-4da1-b11d-cbb9a9fb96ce',
  date: 'Tue, 31 Oct 2017 18:09:10 GMT',
  connection: 'close' });
 return result; },
function (nock) { 
var result = 
nock('http://management.azure.com:443')
  .get('/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/nodeTestGroup143/providers/Microsoft.BatchAI/jobs/job3?api-version=2017-09-01-preview')
  .reply(200, "{\"id\":\"/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/nodetestgroup143/providers/Microsoft.BatchAI/jobs/job3\",\"name\":\"job3\",\"type\":\"Microsoft.BatchAI/Jobs\",\"properties\":{\"priority\":0,\"cluster\":{\"id\":\"/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/nodetestgroup143/providers/Microsoft.BatchAI/clusters/cluster\"},\"nodeCount\":1,\"toolType\":\"custom\",\"customToolkitSettings\":{\"commandLine\":\"ping localhost\"},\"stdOutErrPathPrefix\":\"$AZ_BATCHAI_MOUNT_ROOT/azfs\",\"constraints\":{\"maxWallClockTime\":\"P7D\"},\"creationTime\":\"2017-10-31T18:07:20.28Z\",\"provisioningState\":\"succeeded\",\"provisioningStateTransitionTime\":\"2017-10-31T18:07:21.017Z\",\"executionState\":\"failed\",\"executionStateTransitionTime\":\"2017-10-31T18:09:09.89Z\",\"executionInfo\":{\"startTime\":\"2017-10-31T18:07:22.772Z\",\"endTime\":\"2017-10-31T18:09:09.89Z\",\"errors\":[{\"code\":\"JobTerminate\",\"message\":\"The specified job has been terminated by the user\"}]}}}", { 'cache-control': 'no-cache',
  pragma: 'no-cache',
  'content-length': '943',
  'content-type': 'application/json; charset=utf-8',
  expires: '-1',
  'last-modified': 'Tue, 31 Oct 2017 18:07:20 GMT',
  etag: '"0x8D5208A3A8ECB6D"',
  'x-ms-ratelimit-remaining-subscription-reads': '14994',
  'request-id': 'bd84181f-d4d7-41cd-9c4c-792899d22398',
  'strict-transport-security': 'max-age=31536000; includeSubDomains',
  'x-content-type-options': 'nosniff',
  server: 'Microsoft-HTTPAPI/2.0',
  'x-ms-request-id': '0075b426-9b94-43ac-92d3-01c6455dbfe6',
  'x-ms-correlation-request-id': '0075b426-9b94-43ac-92d3-01c6455dbfe6',
  'x-ms-routing-request-id': 'WESTUS2:20171031T180912Z:0075b426-9b94-43ac-92d3-01c6455dbfe6',
  date: 'Tue, 31 Oct 2017 18:09:12 GMT',
  connection: 'close' });
 return result; },
function (nock) { 
var result = 
nock('https://management.azure.com:443')
  .get('/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/nodeTestGroup143/providers/Microsoft.BatchAI/jobs/job3?api-version=2017-09-01-preview')
  .reply(200, "{\"id\":\"/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/nodetestgroup143/providers/Microsoft.BatchAI/jobs/job3\",\"name\":\"job3\",\"type\":\"Microsoft.BatchAI/Jobs\",\"properties\":{\"priority\":0,\"cluster\":{\"id\":\"/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/nodetestgroup143/providers/Microsoft.BatchAI/clusters/cluster\"},\"nodeCount\":1,\"toolType\":\"custom\",\"customToolkitSettings\":{\"commandLine\":\"ping localhost\"},\"stdOutErrPathPrefix\":\"$AZ_BATCHAI_MOUNT_ROOT/azfs\",\"constraints\":{\"maxWallClockTime\":\"P7D\"},\"creationTime\":\"2017-10-31T18:07:20.28Z\",\"provisioningState\":\"succeeded\",\"provisioningStateTransitionTime\":\"2017-10-31T18:07:21.017Z\",\"executionState\":\"failed\",\"executionStateTransitionTime\":\"2017-10-31T18:09:09.89Z\",\"executionInfo\":{\"startTime\":\"2017-10-31T18:07:22.772Z\",\"endTime\":\"2017-10-31T18:09:09.89Z\",\"errors\":[{\"code\":\"JobTerminate\",\"message\":\"The specified job has been terminated by the user\"}]}}}", { 'cache-control': 'no-cache',
  pragma: 'no-cache',
  'content-length': '943',
  'content-type': 'application/json; charset=utf-8',
  expires: '-1',
  'last-modified': 'Tue, 31 Oct 2017 18:07:20 GMT',
  etag: '"0x8D5208A3A8ECB6D"',
  'x-ms-ratelimit-remaining-subscription-reads': '14994',
  'request-id': 'bd84181f-d4d7-41cd-9c4c-792899d22398',
  'strict-transport-security': 'max-age=31536000; includeSubDomains',
  'x-content-type-options': 'nosniff',
  server: 'Microsoft-HTTPAPI/2.0',
  'x-ms-request-id': '0075b426-9b94-43ac-92d3-01c6455dbfe6',
  'x-ms-correlation-request-id': '0075b426-9b94-43ac-92d3-01c6455dbfe6',
  'x-ms-routing-request-id': 'WESTUS2:20171031T180912Z:0075b426-9b94-43ac-92d3-01c6455dbfe6',
  date: 'Tue, 31 Oct 2017 18:09:12 GMT',
  connection: 'close' });
 return result; }]];