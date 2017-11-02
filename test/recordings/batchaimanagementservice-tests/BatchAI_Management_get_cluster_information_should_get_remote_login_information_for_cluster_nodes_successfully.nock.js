exports.scopes = [[function (nock) {
var result = 
nock('http://management.azure.com:443')
  .post('/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/nodeTestGroup143/providers/Microsoft.BatchAI/clusters/cluster/listRemoteLoginInformation?api-version=2017-09-01-preview')
  .reply(200, "{\"value\":[{\"nodeId\":\"tvm-3657382398_1-20171031t175151z\",\"ipAddress\":\"13.82.102.121\",\"port\":50000}]}", { 'cache-control': 'no-cache',
  pragma: 'no-cache',
  'content-length': '99',
  'content-type': 'application/json; charset=utf-8',
  expires: '-1',
  'x-ms-ratelimit-remaining-subscription-reads': '14994',
  'request-id': 'de971df6-c7d4-4abd-9af2-1bf9c8388c25',
  'strict-transport-security': 'max-age=31536000; includeSubDomains',
  'x-content-type-options': 'nosniff',
  server: 'Microsoft-HTTPAPI/2.0',
  'x-ms-request-id': '4ac27575-3de6-4b8a-ab93-f62e1730cc00',
  'x-ms-correlation-request-id': '4ac27575-3de6-4b8a-ab93-f62e1730cc00',
  'x-ms-routing-request-id': 'WESTUS2:20171031T180537Z:4ac27575-3de6-4b8a-ab93-f62e1730cc00',
  date: 'Tue, 31 Oct 2017 18:05:36 GMT',
  connection: 'close' });
 return result; },
function (nock) { 
var result = 
nock('https://management.azure.com:443')
  .post('/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/nodeTestGroup143/providers/Microsoft.BatchAI/clusters/cluster/listRemoteLoginInformation?api-version=2017-09-01-preview')
  .reply(200, "{\"value\":[{\"nodeId\":\"tvm-3657382398_1-20171031t175151z\",\"ipAddress\":\"13.82.102.121\",\"port\":50000}]}", { 'cache-control': 'no-cache',
  pragma: 'no-cache',
  'content-length': '99',
  'content-type': 'application/json; charset=utf-8',
  expires: '-1',
  'x-ms-ratelimit-remaining-subscription-reads': '14994',
  'request-id': 'de971df6-c7d4-4abd-9af2-1bf9c8388c25',
  'strict-transport-security': 'max-age=31536000; includeSubDomains',
  'x-content-type-options': 'nosniff',
  server: 'Microsoft-HTTPAPI/2.0',
  'x-ms-request-id': '4ac27575-3de6-4b8a-ab93-f62e1730cc00',
  'x-ms-correlation-request-id': '4ac27575-3de6-4b8a-ab93-f62e1730cc00',
  'x-ms-routing-request-id': 'WESTUS2:20171031T180537Z:4ac27575-3de6-4b8a-ab93-f62e1730cc00',
  date: 'Tue, 31 Oct 2017 18:05:36 GMT',
  connection: 'close' });
 return result; }]];