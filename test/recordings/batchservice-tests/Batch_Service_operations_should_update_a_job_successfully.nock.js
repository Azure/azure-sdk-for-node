// This file has been autogenerated.

exports.setEnvironment = function() {
  process.env['AZURE_BATCH_ACCOUNT'] = 'test3';
  process.env['AZURE_BATCH_ENDPOINT'] = 'https://test3.westcentralus.batch.azure.com';
  process.env['AZURE_SUBSCRIPTION_ID'] = 'f30ef677-64a9-4768-934f-5fbbc0e1ad27';
};

exports.scopes = [[function (nock) { 
var result = 
nock('http://test3.westcentralus.batch.azure.com:443')
  .filteringRequestBody(function (path) { return '*';})
.put('/jobs/HelloWorldJobNodeSDKTest?api-version=2018-12-01.8.0', '*')
  .reply(200, "", { 'transfer-encoding': 'chunked',
  'last-modified': 'Tue, 11 Dec 2018 18:44:48 GMT',
  etag: '0x8D65F98BA87DA55',
  server: 'Microsoft-HTTPAPI/2.0',
  'request-id': '779424ed-d3a6-49c3-b9a5-d8ac2b5f30e6',
  'strict-transport-security': 'max-age=31536000; includeSubDomains',
  'x-content-type-options': 'nosniff',
  dataserviceversion: '3.0',
  dataserviceid: 'https://test3.westcentralus.batch.azure.com/jobs/HelloWorldJobNodeSDKTest',
  date: 'Tue, 11 Dec 2018 18:44:48 GMT',
  connection: 'close' });
 return result; },
function (nock) { 
var result = 
nock('https://test3.westcentralus.batch.azure.com:443')
  .filteringRequestBody(function (path) { return '*';})
.put('/jobs/HelloWorldJobNodeSDKTest?api-version=2018-12-01.8.0', '*')
  .reply(200, "", { 'transfer-encoding': 'chunked',
  'last-modified': 'Tue, 11 Dec 2018 18:44:48 GMT',
  etag: '0x8D65F98BA87DA55',
  server: 'Microsoft-HTTPAPI/2.0',
  'request-id': '779424ed-d3a6-49c3-b9a5-d8ac2b5f30e6',
  'strict-transport-security': 'max-age=31536000; includeSubDomains',
  'x-content-type-options': 'nosniff',
  dataserviceversion: '3.0',
  dataserviceid: 'https://test3.westcentralus.batch.azure.com/jobs/HelloWorldJobNodeSDKTest',
  date: 'Tue, 11 Dec 2018 18:44:48 GMT',
  connection: 'close' });
 return result; }]];