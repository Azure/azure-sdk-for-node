// This file has been autogenerated.

exports.setEnvironment = function() {
  process.env['AZURE_BATCH_ACCOUNT'] = 'test3';
  process.env['AZURE_BATCH_ENDPOINT'] = 'https://test3.westcentralus.batch.azure.com';
  process.env['AZURE_SUBSCRIPTION_ID'] = 'f30ef677-64a9-4768-934f-5fbbc0e1ad27';
};

exports.scopes = [[function (nock) { 
var result = 
nock('http://test3.westcentralus.batch.azure.com:443')
  .delete('/certificates(thumbprintAlgorithm=sha1,thumbprint=cff2ab63c8c955aaf71989efa641b906558d9fb7)?api-version=2018-12-01.8.0')
  .reply(202, "", { 'transfer-encoding': 'chunked',
  server: 'Microsoft-HTTPAPI/2.0',
  'request-id': '72c4deb8-6133-426b-942a-a7623b100e5c',
  'strict-transport-security': 'max-age=31536000; includeSubDomains',
  'x-content-type-options': 'nosniff',
  dataserviceversion: '3.0',
  date: 'Tue, 11 Dec 2018 18:48:41 GMT',
  connection: 'close' });
 return result; },
function (nock) { 
var result = 
nock('https://test3.westcentralus.batch.azure.com:443')
  .delete('/certificates(thumbprintAlgorithm=sha1,thumbprint=cff2ab63c8c955aaf71989efa641b906558d9fb7)?api-version=2018-12-01.8.0')
  .reply(202, "", { 'transfer-encoding': 'chunked',
  server: 'Microsoft-HTTPAPI/2.0',
  'request-id': '72c4deb8-6133-426b-942a-a7623b100e5c',
  'strict-transport-security': 'max-age=31536000; includeSubDomains',
  'x-content-type-options': 'nosniff',
  dataserviceversion: '3.0',
  date: 'Tue, 11 Dec 2018 18:48:41 GMT',
  connection: 'close' });
 return result; }]];