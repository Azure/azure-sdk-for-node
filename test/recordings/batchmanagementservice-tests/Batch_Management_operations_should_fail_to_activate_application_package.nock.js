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
.post('/subscriptions/f30ef677-64a9-4768-934f-5fbbc0e1ad27/resourceGroups/default-azurebatch-japaneast/providers/Microsoft.Batch/batchAccounts/batchtestnodesdk/applications/my_application_id/versions/v2.0/activate?api-version=2020-05-01', '*')
  .reply(409, "{\"error\":{\"code\":\"ApplicationPackageBlobNotFound\",\"message\":\"No blob could be found for the specified application package.\\nRequestId:a8a08f8a-b792-4fe0-a74d-f63266dd9033\\nTime:2020-06-04T06:22:46.3905677Z\",\"target\":\"BatchAccount\"}}", { 'cache-control': 'no-cache',
  pragma: 'no-cache',
  'content-length': '232',
  'content-type': 'application/json; charset=utf-8',
  expires: '-1',
  'x-ms-correlation-request-id': 'f6864195-896b-44de-8284-45839a14cb91',
  'x-ms-request-id': 'a8a08f8a-b792-4fe0-a74d-f63266dd9033',
  'strict-transport-security': 'max-age=31536000; includeSubDomains',
  'x-content-type-options': 'nosniff',
  'x-ms-ratelimit-remaining-subscription-writes': '1199',
  server: 'Microsoft-HTTPAPI/2.0',
  'x-ms-routing-request-id':
   'WESTUS:20200604T062246Z:f6864195-896b-44de-8284-45839a14cb91',
  date: 'Thu, 04 Jun 2020 06:22:45 GMT',
  connection: 'close' });
 return result; }]];