// This file has been autogenerated.

exports.setEnvironment = function() {
  process.env['AZURE_SUBSCRIPTION_ID'] = 'dummy';
};

exports.scopes = [[function (nock) { 
var result = 
nock('http://management.azure.com:443')
  .get('/providers/Microsoft.Intune/locations/hostName?api-version=2015-01-14-preview')
  .reply(200, "{\"id\":\"/providers/Microsoft.Intune/locations/hostName\",\"type\":\"Microsoft.Intune/locations\",\"name\":\"hostname\",\"properties\":{\"hostName\":\"fef.msua06\"}}", { 'cache-control': 'no-cache',
  pragma: 'no-cache',
  'content-length': '148',
  'content-type': 'application/json; charset=utf-8',
  expires: '-1',
  'x-ms-ratelimit-remaining-tenant-reads': '14998',
  'x-ms-request-id': '376950f4-d47e-47a8-a71b-6ec480c1c73f',
  server: 'Microsoft-HTTPAPI/2.0',
  'x-ms-correlation-request-id': '1ca094fa-b481-449b-ab3b-a5e2d9eae18c',
  'x-ms-routing-request-id': 'WESTUS:20151204T223613Z:1ca094fa-b481-449b-ab3b-a5e2d9eae18c',
  'strict-transport-security': 'max-age=31536000; includeSubDomains',
  date: 'Fri, 04 Dec 2015 22:36:13 GMT',
  connection: 'close' });
 return result; },
function (nock) { 
var result = 
nock('https://management.azure.com:443')
  .get('/providers/Microsoft.Intune/locations/hostName?api-version=2015-01-14-preview')
  .reply(200, "{\"id\":\"/providers/Microsoft.Intune/locations/hostName\",\"type\":\"Microsoft.Intune/locations\",\"name\":\"hostname\",\"properties\":{\"hostName\":\"fef.msua06\"}}", { 'cache-control': 'no-cache',
  pragma: 'no-cache',
  'content-length': '148',
  'content-type': 'application/json; charset=utf-8',
  expires: '-1',
  'x-ms-ratelimit-remaining-tenant-reads': '14998',
  'x-ms-request-id': '376950f4-d47e-47a8-a71b-6ec480c1c73f',
  server: 'Microsoft-HTTPAPI/2.0',
  'x-ms-correlation-request-id': '1ca094fa-b481-449b-ab3b-a5e2d9eae18c',
  'x-ms-routing-request-id': 'WESTUS:20151204T223613Z:1ca094fa-b481-449b-ab3b-a5e2d9eae18c',
  'strict-transport-security': 'max-age=31536000; includeSubDomains',
  date: 'Fri, 04 Dec 2015 22:36:13 GMT',
  connection: 'close' });
 return result; }]];