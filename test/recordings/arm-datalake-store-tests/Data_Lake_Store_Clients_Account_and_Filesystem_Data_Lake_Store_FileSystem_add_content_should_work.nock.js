// This file has been autogenerated.

exports.setEnvironment = function() {
  process.env['AZURE_TEST_LOCATION'] = 'East US 2';
  process.env['AZURE_TEST_RESOURCE_GROUP'] = 'xplattestadlarg05';
  process.env['AZURE_SUBSCRIPTION_ID'] = '04319d6d-4a66-4701-bb2f-e7dbbd9ae4db';
};

exports.scopes = [[function (nock) { 
var result = 
nock('http://xplattestadls363.azuredatalakestore.net:443')
  .filteringRequestBody(function (path) { return '*';})
.post('/webhdfs/v1/adlssdkfolder01%2Femptyfile.txt?syncFlag=CLOSE&append=true&op=APPEND&api-version=2016-11-01', '*')
  .reply(200, "", { 'cache-control': 'no-cache, no-cache, no-store, max-age=0',
  pragma: 'no-cache',
  expires: '-1',
  'x-ms-request-id': '71c95260-7a1d-4462-9cec-78815c68f84a',
  'x-ms-webhdfs-version': '17.04.22.00',
  status: '0x0',
  'x-content-type-options': 'nosniff',
  'strict-transport-security': 'max-age=15724800; includeSubDomains',
  date: 'Tue, 25 Jul 2017 17:39:57 GMT',
  connection: 'close',
  'content-length': '0' });
 return result; },
function (nock) { 
var result = 
nock('https://xplattestadls363.azuredatalakestore.net:443')
  .filteringRequestBody(function (path) { return '*';})
.post('/webhdfs/v1/adlssdkfolder01%2Femptyfile.txt?syncFlag=CLOSE&append=true&op=APPEND&api-version=2016-11-01', '*')
  .reply(200, "", { 'cache-control': 'no-cache, no-cache, no-store, max-age=0',
  pragma: 'no-cache',
  expires: '-1',
  'x-ms-request-id': '71c95260-7a1d-4462-9cec-78815c68f84a',
  'x-ms-webhdfs-version': '17.04.22.00',
  status: '0x0',
  'x-content-type-options': 'nosniff',
  'strict-transport-security': 'max-age=15724800; includeSubDomains',
  date: 'Tue, 25 Jul 2017 17:39:57 GMT',
  connection: 'close',
  'content-length': '0' });
 return result; },
function (nock) { 
var result = 
nock('http://xplattestadls363.azuredatalakestore.net:443')
  .get('/webhdfs/v1/adlssdkfolder01%2Femptyfile.txt?op=GETFILESTATUS&api-version=2016-11-01')
  .reply(200, "{\"FileStatus\":{\"length\":22,\"pathSuffix\":\"\",\"type\":\"FILE\",\"blockSize\":268435456,\"accessTime\":1501004394732,\"modificationTime\":1501004397000,\"replication\":1,\"permission\":\"770\",\"owner\":\"e994d55d-2464-4c73-b5e1-40e3c9894434\",\"group\":\"e994d55d-2464-4c73-b5e1-40e3c9894434\",\"msExpirationTime\":0,\"aclBit\":false}}", { 'cache-control': 'no-cache, no-cache, no-store, max-age=0',
  pragma: 'no-cache',
  'content-type': 'application/json; charset=utf-8',
  expires: '-1',
  'x-ms-request-id': '961d7176-6d8f-4910-86b4-4fde8de3cb1a',
  'x-ms-webhdfs-version': '17.04.22.00',
  status: '0x0',
  'x-content-type-options': 'nosniff',
  'strict-transport-security': 'max-age=15724800; includeSubDomains',
  date: 'Tue, 25 Jul 2017 17:39:56 GMT',
  connection: 'close',
  'content-length': '305' });
 return result; },
function (nock) { 
var result = 
nock('https://xplattestadls363.azuredatalakestore.net:443')
  .get('/webhdfs/v1/adlssdkfolder01%2Femptyfile.txt?op=GETFILESTATUS&api-version=2016-11-01')
  .reply(200, "{\"FileStatus\":{\"length\":22,\"pathSuffix\":\"\",\"type\":\"FILE\",\"blockSize\":268435456,\"accessTime\":1501004394732,\"modificationTime\":1501004397000,\"replication\":1,\"permission\":\"770\",\"owner\":\"e994d55d-2464-4c73-b5e1-40e3c9894434\",\"group\":\"e994d55d-2464-4c73-b5e1-40e3c9894434\",\"msExpirationTime\":0,\"aclBit\":false}}", { 'cache-control': 'no-cache, no-cache, no-store, max-age=0',
  pragma: 'no-cache',
  'content-type': 'application/json; charset=utf-8',
  expires: '-1',
  'x-ms-request-id': '961d7176-6d8f-4910-86b4-4fde8de3cb1a',
  'x-ms-webhdfs-version': '17.04.22.00',
  status: '0x0',
  'x-content-type-options': 'nosniff',
  'strict-transport-security': 'max-age=15724800; includeSubDomains',
  date: 'Tue, 25 Jul 2017 17:39:56 GMT',
  connection: 'close',
  'content-length': '305' });
 return result; }]];