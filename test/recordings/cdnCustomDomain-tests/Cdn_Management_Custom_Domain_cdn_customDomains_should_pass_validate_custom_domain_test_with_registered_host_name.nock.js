// This file has been autogenerated.

exports.setEnvironment = function() {
  process.env['AZURE_TEST_LOCATION'] = 'West US';
  process.env['AZURE_SUBSCRIPTION_ID'] = '06adb0b3-baaa-4e5f-9df6-ca770f7902cd';
};

exports.scopes = [[function (nock) { 
var result = 
nock('http://api-dogfood.resources.windows-int.net:443')
  .filteringRequestBody(function (path) { return '*';})
.post('/subscriptions/06adb0b3-baaa-4e5f-9df6-ca770f7902cd/resourceGroups/cdnTestGroup7583/providers/Microsoft.Cdn/profiles/cdnTestProfile7066/endpoints/testEndpoint-4436d201-109c-4944-a0ad-0322de415c38/validateCustomDomain?api-version=2016-04-02', '*')
  .reply(200, "{\r\n  \"customDomainValidated\":true,\"message\":null,\"reason\":null\r\n}", { 'cache-control': 'no-cache',
  pragma: 'no-cache',
  'content-length': '65',
  'content-type': 'application/json; odata.metadata=minimal',
  expires: '-1',
  'x-ms-request-id': '0273ef16-81fe-4c98-9f64-3fcec47cb91e',
  'x-ms-client-request-id': '53af3f17-3e62-4263-9b2d-6de030c4e517',
  'odata-version': '4.0',
  'strict-transport-security': 'max-age=31536000; includeSubDomains',
  server: 'Microsoft-IIS/8.5',
  'x-aspnet-version': '4.0.30319',
  'x-powered-by': 'ASP.NET',
  'x-ms-ratelimit-remaining-subscription-writes': '1199',
  'x-ms-correlation-request-id': '3f29a755-a304-4610-a806-4caf71f70936',
  'x-ms-routing-request-id': 'CENTRALUS:20160425T232816Z:3f29a755-a304-4610-a806-4caf71f70936',
  date: 'Mon, 25 Apr 2016 23:28:16 GMT',
  connection: 'close' });
 return result; },
function (nock) { 
var result = 
nock('https://api-dogfood.resources.windows-int.net:443')
  .filteringRequestBody(function (path) { return '*';})
.post('/subscriptions/06adb0b3-baaa-4e5f-9df6-ca770f7902cd/resourceGroups/cdnTestGroup7583/providers/Microsoft.Cdn/profiles/cdnTestProfile7066/endpoints/testEndpoint-4436d201-109c-4944-a0ad-0322de415c38/validateCustomDomain?api-version=2016-04-02', '*')
  .reply(200, "{\r\n  \"customDomainValidated\":true,\"message\":null,\"reason\":null\r\n}", { 'cache-control': 'no-cache',
  pragma: 'no-cache',
  'content-length': '65',
  'content-type': 'application/json; odata.metadata=minimal',
  expires: '-1',
  'x-ms-request-id': '0273ef16-81fe-4c98-9f64-3fcec47cb91e',
  'x-ms-client-request-id': '53af3f17-3e62-4263-9b2d-6de030c4e517',
  'odata-version': '4.0',
  'strict-transport-security': 'max-age=31536000; includeSubDomains',
  server: 'Microsoft-IIS/8.5',
  'x-aspnet-version': '4.0.30319',
  'x-powered-by': 'ASP.NET',
  'x-ms-ratelimit-remaining-subscription-writes': '1199',
  'x-ms-correlation-request-id': '3f29a755-a304-4610-a806-4caf71f70936',
  'x-ms-routing-request-id': 'CENTRALUS:20160425T232816Z:3f29a755-a304-4610-a806-4caf71f70936',
  date: 'Mon, 25 Apr 2016 23:28:16 GMT',
  connection: 'close' });
 return result; }]];