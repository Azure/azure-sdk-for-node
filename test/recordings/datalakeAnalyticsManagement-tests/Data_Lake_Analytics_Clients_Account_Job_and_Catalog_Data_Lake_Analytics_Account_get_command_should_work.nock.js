// This file has been autogenerated.

exports.setEnvironment = function() {
  process.env['AZURE_TEST_LOCATION'] = 'East US 2';
  process.env['AZURE_TEST_RESOURCE_GROUP'] = 'xplattestadlarg05';
  process.env['AZURE_SUBSCRIPTION_ID'] = '2aa30309-3723-4112-bd0b-79e9f65fc52d';
};

exports.scopes = [[function (nock) { 
var result = 
nock('http://management.azure.com:443')
  .get('/subscriptions/2aa30309-3723-4112-bd0b-79e9f65fc52d/resourceGroups/xplattestadlarg05/providers/Microsoft.DataLakeAnalytics/accounts/xplattestadla8758?api-version=2016-11-01')
  .reply(200, "{\"properties\":{\"defaultDataLakeStoreAccount\":\"xplattestadls9781\",\"dataLakeStoreAccounts\":[{\"properties\":{\"suffix\":\"azuredatalakestore.net\"},\"name\":\"xplattestadls9781\"}],\"storageAccounts\":[],\"maxDegreeOfParallelism\":30,\"maxJobCount\":3,\"systemMaxDegreeOfParallelism\":250,\"systemMaxJobCount\":20,\"queryStoreRetention\":30,\"hiveMetastores\":[],\"currentTier\":\"Consumption\",\"newTier\":\"Consumption\",\"provisioningState\":\"Succeeded\",\"state\":\"Active\",\"endpoint\":\"xplattestadla8758.azuredatalakeanalytics.net\",\"accountId\":\"f56f735f-f37b-4907-9166-f289488f08fd\",\"creationTime\":\"2016-12-20T02:38:26.0739051Z\",\"lastModifiedTime\":\"2016-12-20T02:38:26.0739051Z\"},\"location\":\"eastus2\",\"tags\":null,\"id\":\"/subscriptions/2aa30309-3723-4112-bd0b-79e9f65fc52d/resourceGroups/xplattestadlarg05/providers/Microsoft.DataLakeAnalytics/accounts/xplattestadla8758\",\"name\":\"xplattestadla8758\",\"type\":\"Microsoft.DataLakeAnalytics/accounts\"}", { 'cache-control': 'no-cache',
  pragma: 'no-cache',
  'content-length': '907',
  'content-type': 'application/json',
  expires: '-1',
  'x-ms-request-id': '6808ecf9-4dca-4482-b964-202305dec3fc',
  'x-content-type-options': 'nosniff',
  server: 'Microsoft-IIS/8.5',
  'x-aspnet-version': '4.0.30319',
  'x-powered-by': 'ASP.NET',
  'x-ms-ratelimit-remaining-subscription-reads': '14973',
  'x-ms-correlation-request-id': '9f393e9e-af81-4935-ab49-c38caabeb15e',
  'x-ms-routing-request-id': 'JAPANEAST:20161220T024141Z:9f393e9e-af81-4935-ab49-c38caabeb15e',
  'strict-transport-security': 'max-age=31536000; includeSubDomains',
  date: 'Tue, 20 Dec 2016 02:41:41 GMT',
  connection: 'close' });
 return result; },
function (nock) { 
var result = 
nock('https://management.azure.com:443')
  .get('/subscriptions/2aa30309-3723-4112-bd0b-79e9f65fc52d/resourceGroups/xplattestadlarg05/providers/Microsoft.DataLakeAnalytics/accounts/xplattestadla8758?api-version=2016-11-01')
  .reply(200, "{\"properties\":{\"defaultDataLakeStoreAccount\":\"xplattestadls9781\",\"dataLakeStoreAccounts\":[{\"properties\":{\"suffix\":\"azuredatalakestore.net\"},\"name\":\"xplattestadls9781\"}],\"storageAccounts\":[],\"maxDegreeOfParallelism\":30,\"maxJobCount\":3,\"systemMaxDegreeOfParallelism\":250,\"systemMaxJobCount\":20,\"queryStoreRetention\":30,\"hiveMetastores\":[],\"currentTier\":\"Consumption\",\"newTier\":\"Consumption\",\"provisioningState\":\"Succeeded\",\"state\":\"Active\",\"endpoint\":\"xplattestadla8758.azuredatalakeanalytics.net\",\"accountId\":\"f56f735f-f37b-4907-9166-f289488f08fd\",\"creationTime\":\"2016-12-20T02:38:26.0739051Z\",\"lastModifiedTime\":\"2016-12-20T02:38:26.0739051Z\"},\"location\":\"eastus2\",\"tags\":null,\"id\":\"/subscriptions/2aa30309-3723-4112-bd0b-79e9f65fc52d/resourceGroups/xplattestadlarg05/providers/Microsoft.DataLakeAnalytics/accounts/xplattestadla8758\",\"name\":\"xplattestadla8758\",\"type\":\"Microsoft.DataLakeAnalytics/accounts\"}", { 'cache-control': 'no-cache',
  pragma: 'no-cache',
  'content-length': '907',
  'content-type': 'application/json',
  expires: '-1',
  'x-ms-request-id': '6808ecf9-4dca-4482-b964-202305dec3fc',
  'x-content-type-options': 'nosniff',
  server: 'Microsoft-IIS/8.5',
  'x-aspnet-version': '4.0.30319',
  'x-powered-by': 'ASP.NET',
  'x-ms-ratelimit-remaining-subscription-reads': '14973',
  'x-ms-correlation-request-id': '9f393e9e-af81-4935-ab49-c38caabeb15e',
  'x-ms-routing-request-id': 'JAPANEAST:20161220T024141Z:9f393e9e-af81-4935-ab49-c38caabeb15e',
  'strict-transport-security': 'max-age=31536000; includeSubDomains',
  date: 'Tue, 20 Dec 2016 02:41:41 GMT',
  connection: 'close' });
 return result; }]];