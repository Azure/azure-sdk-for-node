// This file has been autogenerated.

exports.setEnvironment = function() {
  process.env['AZURE_TEST_LOCATION'] = 'West US';
  process.env['AZURE_SUBSCRIPTION_ID'] = '3ca49042-782a-4cc9-89b5-ee1b487fe115';
};

exports.scopes = [[function (nock) { 
var result = 
nock('http://management.azure.com:443')
  .get('/subscriptions/3ca49042-782a-4cc9-89b5-ee1b487fe115/providers/Microsoft.Compute/locations/westus/publishers/Microsoft.Compute/artifacttypes/vmextension/types/VMAccessAgent/versions/2.0?api-version=2017-12-01')
  .reply(200, "{\r\n  \"properties\": {\r\n    \"operatingSystem\": \"Windows\",\r\n    \"computeRole\": \"IaaS\",\r\n    \"vmScaleSetEnabled\": false,\r\n    \"supportsMultipleExtensions\": false\r\n  },\r\n  \"location\": \"westus\",\r\n  \"name\": \"2.0\",\r\n  \"id\": \"/Subscriptions/3ca49042-782a-4cc9-89b5-ee1b487fe115/Providers/Microsoft.Compute/Locations/westus/Publishers/Microsoft.Compute/ArtifactTypes/VMExtension/Types/VMAccessAgent/Versions/2.0\"\r\n}", { 'cache-control': 'no-cache',
  pragma: 'no-cache',
  'content-length': '405',
  'content-type': 'application/json; charset=utf-8',
  expires: '-1',
  'strict-transport-security': 'max-age=31536000; includeSubDomains',
  'x-ms-request-id': '1b06e180-d6f9-40ff-ba2b-90b2e232f6eb',
  server: 'Microsoft-HTTPAPI/2.0, Microsoft-HTTPAPI/2.0',
  'x-ms-ratelimit-remaining-subscription-reads': '14993',
  'x-ms-correlation-request-id': '6761cf4c-d839-4d90-8849-bddbf88f7a59',
  'x-ms-routing-request-id': 'WESTUS:20160315T015812Z:6761cf4c-d839-4d90-8849-bddbf88f7a59',
  date: 'Tue, 15 Mar 2016 01:58:11 GMT',
  connection: 'close' });
 return result; },
function (nock) { 
var result = 
nock('https://management.azure.com:443')
  .get('/subscriptions/3ca49042-782a-4cc9-89b5-ee1b487fe115/providers/Microsoft.Compute/locations/westus/publishers/Microsoft.Compute/artifacttypes/vmextension/types/VMAccessAgent/versions/2.0?api-version=2017-12-01')
  .reply(200, "{\r\n  \"properties\": {\r\n    \"operatingSystem\": \"Windows\",\r\n    \"computeRole\": \"IaaS\",\r\n    \"vmScaleSetEnabled\": false,\r\n    \"supportsMultipleExtensions\": false\r\n  },\r\n  \"location\": \"westus\",\r\n  \"name\": \"2.0\",\r\n  \"id\": \"/Subscriptions/3ca49042-782a-4cc9-89b5-ee1b487fe115/Providers/Microsoft.Compute/Locations/westus/Publishers/Microsoft.Compute/ArtifactTypes/VMExtension/Types/VMAccessAgent/Versions/2.0\"\r\n}", { 'cache-control': 'no-cache',
  pragma: 'no-cache',
  'content-length': '405',
  'content-type': 'application/json; charset=utf-8',
  expires: '-1',
  'strict-transport-security': 'max-age=31536000; includeSubDomains',
  'x-ms-request-id': '1b06e180-d6f9-40ff-ba2b-90b2e232f6eb',
  server: 'Microsoft-HTTPAPI/2.0, Microsoft-HTTPAPI/2.0',
  'x-ms-ratelimit-remaining-subscription-reads': '14993',
  'x-ms-correlation-request-id': '6761cf4c-d839-4d90-8849-bddbf88f7a59',
  'x-ms-routing-request-id': 'WESTUS:20160315T015812Z:6761cf4c-d839-4d90-8849-bddbf88f7a59',
  date: 'Tue, 15 Mar 2016 01:58:11 GMT',
  connection: 'close' });
 return result; }]];