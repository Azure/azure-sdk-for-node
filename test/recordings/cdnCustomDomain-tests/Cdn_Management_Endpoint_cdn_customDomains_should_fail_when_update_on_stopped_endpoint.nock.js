// This file has been autogenerated.

exports.setEnvironment = function() {
  process.env['AZURE_TEST_LOCATION'] = 'West US';
  process.env['AZURE_SUBSCRIPTION_ID'] = 'b4871d65-b439-4433-8702-08fa2cc15808';
};

exports.scopes = [[function (nock) { 
var result = 
nock('http://management.azure.com:443')
  .filteringRequestBody(function (path) { return '*';})
.patch('/subscriptions/b4871d65-b439-4433-8702-08fa2cc15808/resourceGroups/cdnTestGroup7502/providers/Microsoft.Cdn/profiles/cdnTestProfile3526/endpoints/testEndpoint-6029da3a-835e-4506-b4ea-bd5375165cdf/customDomains/cdnTestCustomDomain6768?api-version=2015-06-01', '*')
  .reply(400, "{\r\n  \"error\": {\r\n    \"code\": \"BadRequest\",\r\n    \"message\": \"Update is not allowed for custom domain.\"\r\n  }\r\n}", { 'cache-control': 'no-cache',
  pragma: 'no-cache',
  'content-length': '109',
  'content-type': 'application/json; charset=utf-8',
  'content-language': 'en-US',
  expires: '-1',
  'x-ms-request-id': 'ab0b6525-b6b6-4b66-8db4-f67e48b4bd73',
  'x-ms-client-request-id': '086317b2-2379-4fe3-b6c9-d976f7b40bb3',
  'strict-transport-security': 'max-age=31536000; includeSubDomains',
  server: 'Microsoft-IIS/8.5',
  'x-aspnet-version': '4.0.30319',
  'x-powered-by': 'ASP.NET',
  'x-ms-ratelimit-remaining-subscription-writes': '1198',
  'x-ms-correlation-request-id': 'dcd412bb-d362-4569-89fb-bec311fe024d',
  'x-ms-routing-request-id': 'CENTRALUS:20160301T223736Z:dcd412bb-d362-4569-89fb-bec311fe024d',
  date: 'Tue, 01 Mar 2016 22:37:35 GMT',
  connection: 'close' });
 return result; },
function (nock) { 
var result = 
nock('https://management.azure.com:443')
  .filteringRequestBody(function (path) { return '*';})
.patch('/subscriptions/b4871d65-b439-4433-8702-08fa2cc15808/resourceGroups/cdnTestGroup7502/providers/Microsoft.Cdn/profiles/cdnTestProfile3526/endpoints/testEndpoint-6029da3a-835e-4506-b4ea-bd5375165cdf/customDomains/cdnTestCustomDomain6768?api-version=2015-06-01', '*')
  .reply(400, "{\r\n  \"error\": {\r\n    \"code\": \"BadRequest\",\r\n    \"message\": \"Update is not allowed for custom domain.\"\r\n  }\r\n}", { 'cache-control': 'no-cache',
  pragma: 'no-cache',
  'content-length': '109',
  'content-type': 'application/json; charset=utf-8',
  'content-language': 'en-US',
  expires: '-1',
  'x-ms-request-id': 'ab0b6525-b6b6-4b66-8db4-f67e48b4bd73',
  'x-ms-client-request-id': '086317b2-2379-4fe3-b6c9-d976f7b40bb3',
  'strict-transport-security': 'max-age=31536000; includeSubDomains',
  server: 'Microsoft-IIS/8.5',
  'x-aspnet-version': '4.0.30319',
  'x-powered-by': 'ASP.NET',
  'x-ms-ratelimit-remaining-subscription-writes': '1198',
  'x-ms-correlation-request-id': 'dcd412bb-d362-4569-89fb-bec311fe024d',
  'x-ms-routing-request-id': 'CENTRALUS:20160301T223736Z:dcd412bb-d362-4569-89fb-bec311fe024d',
  date: 'Tue, 01 Mar 2016 22:37:35 GMT',
  connection: 'close' });
 return result; }]];