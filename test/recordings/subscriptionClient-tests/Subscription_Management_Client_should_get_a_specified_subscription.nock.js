// This file has been autogenerated.

exports.setEnvironment = function() {
  process.env['AZURE_SUBSCRIPTION_ID'] = '3ca49042-782a-4cc9-89b5-ee1b487fe115';
};

exports.scopes = [[function (nock) { 
var result = 
nock('http://management.azure.com:443')
  .get('/subscriptions/3ca49042-782a-4cc9-89b5-ee1b487fe115?api-version=2015-11-01')
  .reply(200, "{\"id\":\"/subscriptions/3ca49042-782a-4cc9-89b5-ee1b487fe115\",\"subscriptionId\":\"3ca49042-782a-4cc9-89b5-ee1b487fe115\",\"displayName\":\"AzSdkCore1\",\"state\":\"Enabled\",\"subscriptionPolicies\":{\"locationPlacementId\":\"Public_2014-09-01\",\"quotaId\":\"PayAsYouGo_2014-09-01\"}}", { 'cache-control': 'no-cache',
  pragma: 'no-cache',
  'content-type': 'application/json; charset=utf-8',
  expires: '-1',
  'x-ms-ratelimit-remaining-subscription-reads': '14998',
  'x-ms-request-id': '2a2a1501-3d24-4fd1-8456-85e29037a0da',
  'x-ms-correlation-request-id': '2a2a1501-3d24-4fd1-8456-85e29037a0da',
  'x-ms-routing-request-id': 'WESTUS:20160127T030134Z:2a2a1501-3d24-4fd1-8456-85e29037a0da',
  'strict-transport-security': 'max-age=31536000; includeSubDomains',
  date: 'Wed, 27 Jan 2016 03:01:33 GMT',
  connection: 'close',
  'content-length': '262' });
 return result; },
function (nock) { 
var result = 
nock('https://management.azure.com:443')
  .get('/subscriptions/3ca49042-782a-4cc9-89b5-ee1b487fe115?api-version=2015-11-01')
  .reply(200, "{\"id\":\"/subscriptions/3ca49042-782a-4cc9-89b5-ee1b487fe115\",\"subscriptionId\":\"3ca49042-782a-4cc9-89b5-ee1b487fe115\",\"displayName\":\"AzSdkCore1\",\"state\":\"Enabled\",\"subscriptionPolicies\":{\"locationPlacementId\":\"Public_2014-09-01\",\"quotaId\":\"PayAsYouGo_2014-09-01\"}}", { 'cache-control': 'no-cache',
  pragma: 'no-cache',
  'content-type': 'application/json; charset=utf-8',
  expires: '-1',
  'x-ms-ratelimit-remaining-subscription-reads': '14998',
  'x-ms-request-id': '2a2a1501-3d24-4fd1-8456-85e29037a0da',
  'x-ms-correlation-request-id': '2a2a1501-3d24-4fd1-8456-85e29037a0da',
  'x-ms-routing-request-id': 'WESTUS:20160127T030134Z:2a2a1501-3d24-4fd1-8456-85e29037a0da',
  'strict-transport-security': 'max-age=31536000; includeSubDomains',
  date: 'Wed, 27 Jan 2016 03:01:33 GMT',
  connection: 'close',
  'content-length': '262' });
 return result; }]];