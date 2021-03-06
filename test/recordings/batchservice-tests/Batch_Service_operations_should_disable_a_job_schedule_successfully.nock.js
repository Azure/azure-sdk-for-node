// This file has been autogenerated.

exports.setEnvironment = function() {
  process.env['AZURE_BATCH_ACCOUNT'] = 'test4';
  process.env['AZURE_BATCH_ENDPOINT'] = 'https://test4.japaneast.batch.azure.com';
  process.env['AZURE_SUBSCRIPTION_ID'] = 'f30ef677-64a9-4768-934f-5fbbc0e1ad27';
};

exports.scopes = [[function (nock) { 
var result = 
nock('https://test4.japaneast.batch.azure.com:443')
  .post('/jobschedules/NodeSDKTestSchedule/disable?api-version=2020-03-01.11.0')
  .reply(204, "", { 'content-length': '0',
  'last-modified': 'Sat, 21 Mar 2020 04:36:27 GMT',
  etag: '0x8D7CD516B6DB053',
  server: 'Microsoft-HTTPAPI/2.0',
  'request-id': '9224dac6-a43a-4569-ab9e-afb870c1fd87',
  'strict-transport-security': 'max-age=31536000; includeSubDomains',
  'x-content-type-options': 'nosniff',
  dataserviceversion: '3.0',
  dataserviceid:
   'https://test4.japaneast.batch.azure.com/jobschedules/NodeSDKTestSchedule/disable',
  date: 'Sat, 21 Mar 2020 04:36:27 GMT',
  connection: 'close' });
 return result; }]];