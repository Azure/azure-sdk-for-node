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
.post('/certificates?api-version=2018-12-01.8.0', '*')
  .reply(201, "", { 'transfer-encoding': 'chunked',
  location: 'https://test3.westcentralus.batch.azure.com/certificates(ThumbprintAlgorithm=sha1,Thumbprint=cff2ab63c8c955aaf71989efa641b906558d9fb7)',
  server: 'Microsoft-HTTPAPI/2.0',
  'request-id': 'c6385cff-c836-4d26-8f95-1cb3f71ca542',
  'strict-transport-security': 'max-age=31536000; includeSubDomains',
  'x-content-type-options': 'nosniff',
  dataserviceversion: '3.0',
  dataserviceid: 'https://test3.westcentralus.batch.azure.com/certificates(ThumbprintAlgorithm=sha1,Thumbprint=cff2ab63c8c955aaf71989efa641b906558d9fb7)',
  date: 'Tue, 11 Dec 2018 18:27:20 GMT',
  connection: 'close' });
 return result; },
function (nock) { 
var result = 
nock('https://test3.westcentralus.batch.azure.com:443')
  .filteringRequestBody(function (path) { return '*';})
.post('/certificates?api-version=2018-12-01.8.0', '*')
  .reply(201, "", { 'transfer-encoding': 'chunked',
  location: 'https://test3.westcentralus.batch.azure.com/certificates(ThumbprintAlgorithm=sha1,Thumbprint=cff2ab63c8c955aaf71989efa641b906558d9fb7)',
  server: 'Microsoft-HTTPAPI/2.0',
  'request-id': 'c6385cff-c836-4d26-8f95-1cb3f71ca542',
  'strict-transport-security': 'max-age=31536000; includeSubDomains',
  'x-content-type-options': 'nosniff',
  dataserviceversion: '3.0',
  dataserviceid: 'https://test3.westcentralus.batch.azure.com/certificates(ThumbprintAlgorithm=sha1,Thumbprint=cff2ab63c8c955aaf71989efa641b906558d9fb7)',
  date: 'Tue, 11 Dec 2018 18:27:20 GMT',
  connection: 'close' });
 return result; }]];