// This file has been autogenerated.

exports.setEnvironment = function() {
  process.env['AZURE_TEST_LOCATION'] = 'japaneast';
  process.env['AZURE_AUTOSTORAGE'] = 'testaccountfornode';
  process.env['AZURE_SUBSCRIPTION_ID'] = 'f30ef677-64a9-4768-934f-5fbbc0e1ad27';
};

exports.scopes = [[function (nock) { 
var result = 
nock('https://management.azure.com:443')
  .filteringRequestBody(function (path) { return '*';})
.patch('/subscriptions/f30ef677-64a9-4768-934f-5fbbc0e1ad27/resourceGroups/default-azurebatch-japaneast/providers/Microsoft.Batch/batchAccounts/batchtestnodesdk/applications/my_application_id?api-version=2020-05-01', '*')
  .reply(200, "{\"type\":\"Microsoft.Batch/batchAccounts/applications\",\"id\":\"/subscriptions/f30ef677-64a9-4768-934f-5fbbc0e1ad27/resourceGroups/default-azurebatch-japaneast/providers/Microsoft.Batch/batchAccounts/batchtestnodesdk/applications/my_application_id\",\"name\":\"my_application_id\",\"etag\":\"W/\\\"0x8D8084FB3BAEDFC\\\"\",\"properties\":{\"displayName\":\"my_updated_name\",\"allowUpdates\":false,\"defaultVersion\":\"v1.0\"}}", { 'cache-control': 'no-cache',
  pragma: 'no-cache',
  'content-length': '396',
  'content-type': 'application/json; charset=utf-8',
  expires: '-1',
  'last-modified': 'Thu, 04 Jun 2020 06:22:48 GMT',
  etag: 'W/"0x8D8084FB3BAEDFC"',
  'x-ms-correlation-request-id': 'edf56bbf-77ee-48ce-9b3e-cad1db83efe9',
  'x-ms-request-id': '367cf272-ec5e-4fb3-a8f8-7aac84913a87',
  'strict-transport-security': 'max-age=31536000; includeSubDomains',
  'x-content-type-options': 'nosniff',
  'x-ms-ratelimit-remaining-subscription-writes': '1199',
  server: 'Microsoft-HTTPAPI/2.0',
  'x-ms-routing-request-id':
   'WESTUS:20200604T062248Z:edf56bbf-77ee-48ce-9b3e-cad1db83efe9',
  date: 'Thu, 04 Jun 2020 06:22:48 GMT',
  connection: 'close' });
 return result; }]];