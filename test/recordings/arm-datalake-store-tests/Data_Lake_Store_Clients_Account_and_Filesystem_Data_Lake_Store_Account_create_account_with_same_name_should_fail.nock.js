// This file has been autogenerated.

exports.setEnvironment = function() {
  process.env['AZURE_TEST_LOCATION'] = 'East US 2';
  process.env['AZURE_TEST_RESOURCE_GROUP'] = 'xplattestadlsrg01';
  process.env['AZURE_SUBSCRIPTION_ID'] = '53d9063d-87ae-4ea8-be90-3686c3b8669f';
};

exports.scopes = [[function (nock) { 
var result = 
nock('http://management.azure.com:443')
  .filteringRequestBody(function (path) { return '*';})
.put('/subscriptions/53d9063d-87ae-4ea8-be90-3686c3b8669f/resourceGroups/xplattestadls1164/providers/Microsoft.DataLakeStore/accounts/xplattestadls7774?api-version=2016-11-01', '*')
  .reply(409, "{\"error\":{\"code\":\"ResourceConflicted\",\"message\":\"Resource Name belongs to another resource.\"}}", { 'cache-control': 'no-cache',
  pragma: 'no-cache',
  'content-length': '94',
  'content-type': 'application/json',
  expires: '-1',
  'x-ms-request-id': 'fceac2d9-dadf-44a3-b728-6c27d9fc7faf',
  'x-content-type-options': 'nosniff',
  server: 'Microsoft-IIS/8.5',
  'x-aspnet-version': '4.0.30319',
  'x-powered-by': 'ASP.NET',
  'x-ms-ratelimit-remaining-subscription-writes': '1199',
  'x-ms-correlation-request-id': 'c865cdaf-d56e-48f8-a8d6-aa494cfa82a7',
  'x-ms-routing-request-id': 'CENTRALUS:20170316T234020Z:c865cdaf-d56e-48f8-a8d6-aa494cfa82a7',
  'strict-transport-security': 'max-age=31536000; includeSubDomains',
  date: 'Thu, 16 Mar 2017 23:40:19 GMT',
  connection: 'close' });
 return result; },
function (nock) { 
var result = 
nock('https://management.azure.com:443')
  .filteringRequestBody(function (path) { return '*';})
.put('/subscriptions/53d9063d-87ae-4ea8-be90-3686c3b8669f/resourceGroups/xplattestadls1164/providers/Microsoft.DataLakeStore/accounts/xplattestadls7774?api-version=2016-11-01', '*')
  .reply(409, "{\"error\":{\"code\":\"ResourceConflicted\",\"message\":\"Resource Name belongs to another resource.\"}}", { 'cache-control': 'no-cache',
  pragma: 'no-cache',
  'content-length': '94',
  'content-type': 'application/json',
  expires: '-1',
  'x-ms-request-id': 'fceac2d9-dadf-44a3-b728-6c27d9fc7faf',
  'x-content-type-options': 'nosniff',
  server: 'Microsoft-IIS/8.5',
  'x-aspnet-version': '4.0.30319',
  'x-powered-by': 'ASP.NET',
  'x-ms-ratelimit-remaining-subscription-writes': '1199',
  'x-ms-correlation-request-id': 'c865cdaf-d56e-48f8-a8d6-aa494cfa82a7',
  'x-ms-routing-request-id': 'CENTRALUS:20170316T234020Z:c865cdaf-d56e-48f8-a8d6-aa494cfa82a7',
  'strict-transport-security': 'max-age=31536000; includeSubDomains',
  date: 'Thu, 16 Mar 2017 23:40:19 GMT',
  connection: 'close' });
 return result; }]];