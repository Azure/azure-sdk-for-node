// This file has been autogenerated.

exports.scopes = [[function (nock) { 
var result = 
nock('https://ciserversdk.table.core.windows.net:443')
  .filteringRequestBody(function (path) { return '*';})
.post('/Tables', '*')
  .reply(201, "<?xml version=\"1.0\" encoding=\"utf-8\" standalone=\"yes\"?>\r\n<entry xml:base=\"https://ciserversdk.table.core.windows.net/\" xmlns:d=\"http://schemas.microsoft.com/ado/2007/08/dataservices\" xmlns:m=\"http://schemas.microsoft.com/ado/2007/08/dataservices/metadata\" xmlns=\"http://www.w3.org/2005/Atom\">\r\n  <id>https://ciserversdk.table.core.windows.net/Tables('tableservice1')</id>\r\n  <title type=\"text\"></title>\r\n  <updated>2013-06-21T21:49:24Z</updated>\r\n  <author>\r\n    <name />\r\n  </author>\r\n  <link rel=\"edit\" title=\"Tables\" href=\"Tables('tableservice1')\" />\r\n  <category term=\"ciserversdk.Tables\" scheme=\"http://schemas.microsoft.com/ado/2007/08/dataservices/scheme\" />\r\n  <content type=\"application/xml\">\r\n    <m:properties>\r\n      <d:TableName>tableservice1</d:TableName>\r\n    </m:properties>\r\n  </content>\r\n</entry>", { 'cache-control': 'no-cache',
  'transfer-encoding': 'chunked',
  'content-type': 'application/atom+xml;charset=utf-8',
  location: 'https://ciserversdk.table.core.windows.net/Tables(\'tableservice1\')',
  server: 'Windows-Azure-Table/1.0 Microsoft-HTTPAPI/2.0',
  'x-ms-request-id': '0ee2fe49-356f-4903-b2ee-1fcf7e857550',
  'x-ms-version': '2011-08-18',
  date: 'Fri, 21 Jun 2013 21:49:24 GMT' });
 return result; },
function (nock) { 
var result = 
nock('https://ciserversdk.table.core.windows.net:443')
  .filteringRequestBody(function (path) { return '*';})
.post('/tableservice1', '*')
  .reply(201, "<?xml version=\"1.0\" encoding=\"utf-8\" standalone=\"yes\"?>\r\n<entry xml:base=\"https://ciserversdk.table.core.windows.net/\" xmlns:d=\"http://schemas.microsoft.com/ado/2007/08/dataservices\" xmlns:m=\"http://schemas.microsoft.com/ado/2007/08/dataservices/metadata\" m:etag=\"W/&quot;datetime'2013-06-21T21%3A49%3A25.6069504Z'&quot;\" xmlns=\"http://www.w3.org/2005/Atom\">\r\n  <id>https://ciserversdk.table.core.windows.net/tableservice1(PartitionKey='%E2%92%88%E2%91%A0%E2%85%AB%E3%84%A8%E3%84%A9',RowKey='%E2%92%88%E2%91%A0%E2%85%AB%E3%84%A8%E3%84%A9')</id>\r\n  <title type=\"text\"></title>\r\n  <updated>2013-06-21T21:49:25Z</updated>\r\n  <author>\r\n    <name />\r\n  </author>\r\n  <link rel=\"edit\" title=\"tableservice1\" href=\"tableservice1(PartitionKey='%E2%92%88%E2%91%A0%E2%85%AB%E3%84%A8%E3%84%A9',RowKey='%E2%92%88%E2%91%A0%E2%85%AB%E3%84%A8%E3%84%A9')\" />\r\n  <category term=\"ciserversdk.tableservice1\" scheme=\"http://schemas.microsoft.com/ado/2007/08/dataservices/scheme\" />\r\n  <content type=\"application/xml\">\r\n    <m:properties>\r\n      <d:PartitionKey>⒈①Ⅻㄨㄩ</d:PartitionKey>\r\n      <d:RowKey>⒈①Ⅻㄨㄩ</d:RowKey>\r\n      <d:Timestamp m:type=\"Edm.DateTime\">2013-06-21T21:49:25.6069504Z</d:Timestamp>\r\n      <d:Value>test</d:Value>\r\n    </m:properties>\r\n  </content>\r\n</entry>", { 'cache-control': 'no-cache',
  'transfer-encoding': 'chunked',
  'content-type': 'application/atom+xml;charset=utf-8',
  etag: 'W/"datetime\'2013-06-21T21%3A49%3A25.6069504Z\'"',
  location: 'https://ciserversdk.table.core.windows.net/tableservice1(PartitionKey=\'%E2%92%88%E2%91%A0%E2%85%AB%E3%84%A8%E3%84%A9\',RowKey=\'%E2%92%88%E2%91%A0%E2%85%AB%E3%84%A8%E3%84%A9\')',
  server: 'Windows-Azure-Table/1.0 Microsoft-HTTPAPI/2.0',
  'x-ms-request-id': '2b1e8fd2-abff-4401-842f-237b2c91b4d8',
  'x-ms-version': '2011-08-18',
  date: 'Fri, 21 Jun 2013 21:49:24 GMT' });
 return result; },
function (nock) { 
var result = 
nock('https://ciserversdk.table.core.windows.net:443')
  .get('/tableservice1(PartitionKey=%27%E2%92%88%E2%91%A0%E2%85%AB%E3%84%A8%E3%84%A9%27,RowKey=%27%E2%92%88%E2%91%A0%E2%85%AB%E3%84%A8%E3%84%A9%27)')
  .reply(200, "<?xml version=\"1.0\" encoding=\"utf-8\" standalone=\"yes\"?>\r\n<entry xml:base=\"https://ciserversdk.table.core.windows.net/\" xmlns:d=\"http://schemas.microsoft.com/ado/2007/08/dataservices\" xmlns:m=\"http://schemas.microsoft.com/ado/2007/08/dataservices/metadata\" m:etag=\"W/&quot;datetime'2013-06-21T21%3A49%3A25.6069504Z'&quot;\" xmlns=\"http://www.w3.org/2005/Atom\">\r\n  <id>https://ciserversdk.table.core.windows.net/tableservice1(PartitionKey='%E2%92%88%E2%91%A0%E2%85%AB%E3%84%A8%E3%84%A9',RowKey='%E2%92%88%E2%91%A0%E2%85%AB%E3%84%A8%E3%84%A9')</id>\r\n  <title type=\"text\"></title>\r\n  <updated>2013-06-21T21:49:24Z</updated>\r\n  <author>\r\n    <name />\r\n  </author>\r\n  <link rel=\"edit\" title=\"tableservice1\" href=\"tableservice1(PartitionKey='%E2%92%88%E2%91%A0%E2%85%AB%E3%84%A8%E3%84%A9',RowKey='%E2%92%88%E2%91%A0%E2%85%AB%E3%84%A8%E3%84%A9')\" />\r\n  <category term=\"ciserversdk.tableservice1\" scheme=\"http://schemas.microsoft.com/ado/2007/08/dataservices/scheme\" />\r\n  <content type=\"application/xml\">\r\n    <m:properties>\r\n      <d:PartitionKey>⒈①Ⅻㄨㄩ</d:PartitionKey>\r\n      <d:RowKey>⒈①Ⅻㄨㄩ</d:RowKey>\r\n      <d:Timestamp m:type=\"Edm.DateTime\">2013-06-21T21:49:25.6069504Z</d:Timestamp>\r\n      <d:Value>test</d:Value>\r\n    </m:properties>\r\n  </content>\r\n</entry>", { 'cache-control': 'no-cache',
  'transfer-encoding': 'chunked',
  'content-type': 'application/atom+xml;charset=utf-8',
  etag: 'W/"datetime\'2013-06-21T21%3A49%3A25.6069504Z\'"',
  server: 'Windows-Azure-Table/1.0 Microsoft-HTTPAPI/2.0',
  'x-ms-request-id': 'f007230c-dfd7-4dcd-b677-fb819ade3b15',
  'x-ms-version': '2011-08-18',
  date: 'Fri, 21 Jun 2013 21:49:24 GMT' });
 return result; },
function (nock) { 
var result = 
nock('https://ciserversdk.table.core.windows.net:443')
  .get('/Tables')
  .reply(200, "<?xml version=\"1.0\" encoding=\"utf-8\" standalone=\"yes\"?>\r\n<feed xml:base=\"https://ciserversdk.table.core.windows.net/\" xmlns:d=\"http://schemas.microsoft.com/ado/2007/08/dataservices\" xmlns:m=\"http://schemas.microsoft.com/ado/2007/08/dataservices/metadata\" xmlns=\"http://www.w3.org/2005/Atom\">\r\n  <title type=\"text\">Tables</title>\r\n  <id>https://ciserversdk.table.core.windows.net/Tables</id>\r\n  <updated>2013-06-21T21:49:26Z</updated>\r\n  <link rel=\"self\" title=\"Tables\" href=\"Tables\" />\r\n  <entry>\r\n    <id>https://ciserversdk.table.core.windows.net/Tables('tableservice1')</id>\r\n    <title type=\"text\"></title>\r\n    <updated>2013-06-21T21:49:26Z</updated>\r\n    <author>\r\n      <name />\r\n    </author>\r\n    <link rel=\"edit\" title=\"Tables\" href=\"Tables('tableservice1')\" />\r\n    <category term=\"ciserversdk.Tables\" scheme=\"http://schemas.microsoft.com/ado/2007/08/dataservices/scheme\" />\r\n    <content type=\"application/xml\">\r\n      <m:properties>\r\n        <d:TableName>tableservice1</d:TableName>\r\n      </m:properties>\r\n    </content>\r\n  </entry>\r\n</feed>", { 'cache-control': 'no-cache',
  'transfer-encoding': 'chunked',
  'content-type': 'application/atom+xml;charset=utf-8',
  server: 'Windows-Azure-Table/1.0 Microsoft-HTTPAPI/2.0',
  'x-ms-request-id': 'fddfa365-e3e7-45f1-b53d-d0dc0c01c23e',
  'x-ms-version': '2011-08-18',
  date: 'Fri, 21 Jun 2013 21:49:25 GMT' });
 return result; },
function (nock) { 
var result = 
nock('https://ciserversdk.table.core.windows.net:443')
  .delete('/Tables(%27tableservice1%27)')
  .reply(204, "", { 'cache-control': 'no-cache',
  'content-length': '0',
  server: 'Windows-Azure-Table/1.0 Microsoft-HTTPAPI/2.0',
  'x-ms-request-id': '6eb3bfeb-2ccb-45d0-92e8-7bfbd0f3836a',
  'x-ms-version': '2011-08-18',
  date: 'Fri, 21 Jun 2013 21:49:24 GMT' });
 return result; }],
[function (nock) { 
var result = 
nock('https://ciserversdk.table.core.windows.net:443')
  .filteringRequestBody(function (path) { return '*';})
.post('/Tables', '*')
  .reply(201, "<?xml version=\"1.0\" encoding=\"utf-8\" standalone=\"yes\"?>\r\n<entry xml:base=\"https://ciserversdk.table.core.windows.net/\" xmlns:d=\"http://schemas.microsoft.com/ado/2007/08/dataservices\" xmlns:m=\"http://schemas.microsoft.com/ado/2007/08/dataservices/metadata\" xmlns=\"http://www.w3.org/2005/Atom\">\r\n  <id>https://ciserversdk.table.core.windows.net/Tables('tableservice2')</id>\r\n  <title type=\"text\"></title>\r\n  <updated>2013-06-21T21:49:26Z</updated>\r\n  <author>\r\n    <name />\r\n  </author>\r\n  <link rel=\"edit\" title=\"Tables\" href=\"Tables('tableservice2')\" />\r\n  <category term=\"ciserversdk.Tables\" scheme=\"http://schemas.microsoft.com/ado/2007/08/dataservices/scheme\" />\r\n  <content type=\"application/xml\">\r\n    <m:properties>\r\n      <d:TableName>tableservice2</d:TableName>\r\n    </m:properties>\r\n  </content>\r\n</entry>", { 'cache-control': 'no-cache',
  'transfer-encoding': 'chunked',
  'content-type': 'application/atom+xml;charset=utf-8',
  location: 'https://ciserversdk.table.core.windows.net/Tables(\'tableservice2\')',
  server: 'Windows-Azure-Table/1.0 Microsoft-HTTPAPI/2.0',
  'x-ms-request-id': '0957464d-76a6-4399-93bf-79ebace955a9',
  'x-ms-version': '2011-08-18',
  date: 'Fri, 21 Jun 2013 21:49:26 GMT' });
 return result; },
function (nock) { 
var result = 
nock('https://ciserversdk.table.core.windows.net:443')
  .filteringRequestBody(function (path) { return '*';})
.post('/tableservice2', '*')
  .reply(201, "<?xml version=\"1.0\" encoding=\"utf-8\" standalone=\"yes\"?>\r\n<entry xml:base=\"https://ciserversdk.table.core.windows.net/\" xmlns:d=\"http://schemas.microsoft.com/ado/2007/08/dataservices\" xmlns:m=\"http://schemas.microsoft.com/ado/2007/08/dataservices/metadata\" m:etag=\"W/&quot;datetime'2013-06-21T21%3A49%3A26.8864387Z'&quot;\" xmlns=\"http://www.w3.org/2005/Atom\">\r\n  <id>https://ciserversdk.table.core.windows.net/tableservice2(PartitionKey='part1',RowKey='row1')</id>\r\n  <title type=\"text\"></title>\r\n  <updated>2013-06-21T21:49:26Z</updated>\r\n  <author>\r\n    <name />\r\n  </author>\r\n  <link rel=\"edit\" title=\"tableservice2\" href=\"tableservice2(PartitionKey='part1',RowKey='row1')\" />\r\n  <category term=\"ciserversdk.tableservice2\" scheme=\"http://schemas.microsoft.com/ado/2007/08/dataservices/scheme\" />\r\n  <content type=\"application/xml\">\r\n    <m:properties>\r\n      <d:PartitionKey>part1</d:PartitionKey>\r\n      <d:RowKey>row1</d:RowKey>\r\n      <d:Timestamp m:type=\"Edm.DateTime\">2013-06-21T21:49:26.8864387Z</d:Timestamp>\r\n      <d:field>my field</d:field>\r\n      <d:otherfield>my other field</d:otherfield>\r\n      <d:otherprops>my properties</d:otherprops>\r\n      <d:gb18030 xml:space=\"preserve\">𡬁𠻝𩂻耨鬲, 㑜䊑㓣䟉䋮䦓, ᡨᠥ᠙ᡰᢇ᠘ᠶ, ࿋ཇ࿂ོ༇ྒ, ꃌꈗꈉꋽ, Uighur, ᥗᥩᥬᥜᥦ </d:gb18030>\r\n    </m:properties>\r\n  </content>\r\n</entry>", { 'cache-control': 'no-cache',
  'transfer-encoding': 'chunked',
  'content-type': 'application/atom+xml;charset=utf-8',
  etag: 'W/"datetime\'2013-06-21T21%3A49%3A26.8864387Z\'"',
  location: 'https://ciserversdk.table.core.windows.net/tableservice2(PartitionKey=\'part1\',RowKey=\'row1\')',
  server: 'Windows-Azure-Table/1.0 Microsoft-HTTPAPI/2.0',
  'x-ms-request-id': 'b7d0bc19-612f-4cad-a6f0-b68a6841c6a0',
  'x-ms-version': '2011-08-18',
  date: 'Fri, 21 Jun 2013 21:49:25 GMT' });
 return result; },
function (nock) { 
var result = 
nock('https://ciserversdk.table.core.windows.net:443')
  .get('/tableservice2()')
  .reply(200, "<?xml version=\"1.0\" encoding=\"utf-8\" standalone=\"yes\"?>\r\n<feed xml:base=\"https://ciserversdk.table.core.windows.net/\" xmlns:d=\"http://schemas.microsoft.com/ado/2007/08/dataservices\" xmlns:m=\"http://schemas.microsoft.com/ado/2007/08/dataservices/metadata\" xmlns=\"http://www.w3.org/2005/Atom\">\r\n  <title type=\"text\">tableservice2</title>\r\n  <id>https://ciserversdk.table.core.windows.net/tableservice2</id>\r\n  <updated>2013-06-21T21:49:25Z</updated>\r\n  <link rel=\"self\" title=\"tableservice2\" href=\"tableservice2\" />\r\n  <entry m:etag=\"W/&quot;datetime'2013-06-21T21%3A49%3A26.8864387Z'&quot;\">\r\n    <id>https://ciserversdk.table.core.windows.net/tableservice2(PartitionKey='part1',RowKey='row1')</id>\r\n    <title type=\"text\"></title>\r\n    <updated>2013-06-21T21:49:25Z</updated>\r\n    <author>\r\n      <name />\r\n    </author>\r\n    <link rel=\"edit\" title=\"tableservice2\" href=\"tableservice2(PartitionKey='part1',RowKey='row1')\" />\r\n    <category term=\"ciserversdk.tableservice2\" scheme=\"http://schemas.microsoft.com/ado/2007/08/dataservices/scheme\" />\r\n    <content type=\"application/xml\">\r\n      <m:properties>\r\n        <d:PartitionKey>part1</d:PartitionKey>\r\n        <d:RowKey>row1</d:RowKey>\r\n        <d:Timestamp m:type=\"Edm.DateTime\">2013-06-21T21:49:26.8864387Z</d:Timestamp>\r\n        <d:field>my field</d:field>\r\n        <d:otherfield>my other field</d:otherfield>\r\n        <d:otherprops>my properties</d:otherprops>\r\n        <d:gb18030 xml:space=\"preserve\">𡬁𠻝𩂻耨鬲, 㑜䊑㓣䟉䋮䦓, ᡨᠥ᠙ᡰᢇ᠘ᠶ, ࿋ཇ࿂ོ༇ྒ, ꃌꈗꈉꋽ, Uighur, ᥗᥩᥬᥜᥦ </d:gb18030>\r\n      </m:properties>\r\n    </content>\r\n  </entry>\r\n</feed>", { 'cache-control': 'no-cache',
  'transfer-encoding': 'chunked',
  'content-type': 'application/atom+xml;charset=utf-8',
  server: 'Windows-Azure-Table/1.0 Microsoft-HTTPAPI/2.0',
  'x-ms-request-id': '3c1dcf42-fc6d-44cd-a8c7-d350a0933b6d',
  'x-ms-version': '2011-08-18',
  date: 'Fri, 21 Jun 2013 21:49:25 GMT' });
 return result; },
function (nock) { 
var result = 
nock('https://ciserversdk.table.core.windows.net:443')
  .get('/Tables')
  .reply(200, "<?xml version=\"1.0\" encoding=\"utf-8\" standalone=\"yes\"?>\r\n<feed xml:base=\"https://ciserversdk.table.core.windows.net/\" xmlns:d=\"http://schemas.microsoft.com/ado/2007/08/dataservices\" xmlns:m=\"http://schemas.microsoft.com/ado/2007/08/dataservices/metadata\" xmlns=\"http://www.w3.org/2005/Atom\">\r\n  <title type=\"text\">Tables</title>\r\n  <id>https://ciserversdk.table.core.windows.net/Tables</id>\r\n  <updated>2013-06-21T21:49:26Z</updated>\r\n  <link rel=\"self\" title=\"Tables\" href=\"Tables\" />\r\n  <entry>\r\n    <id>https://ciserversdk.table.core.windows.net/Tables('tableservice2')</id>\r\n    <title type=\"text\"></title>\r\n    <updated>2013-06-21T21:49:26Z</updated>\r\n    <author>\r\n      <name />\r\n    </author>\r\n    <link rel=\"edit\" title=\"Tables\" href=\"Tables('tableservice2')\" />\r\n    <category term=\"ciserversdk.Tables\" scheme=\"http://schemas.microsoft.com/ado/2007/08/dataservices/scheme\" />\r\n    <content type=\"application/xml\">\r\n      <m:properties>\r\n        <d:TableName>tableservice2</d:TableName>\r\n      </m:properties>\r\n    </content>\r\n  </entry>\r\n</feed>", { 'cache-control': 'no-cache',
  'transfer-encoding': 'chunked',
  'content-type': 'application/atom+xml;charset=utf-8',
  server: 'Windows-Azure-Table/1.0 Microsoft-HTTPAPI/2.0',
  'x-ms-request-id': '57eddeb3-257d-408b-a22f-37670a6bf2a1',
  'x-ms-version': '2011-08-18',
  date: 'Fri, 21 Jun 2013 21:49:25 GMT' });
 return result; },
function (nock) { 
var result = 
nock('https://ciserversdk.table.core.windows.net:443')
  .delete('/Tables(%27tableservice2%27)')
  .reply(204, "", { 'cache-control': 'no-cache',
  'content-length': '0',
  server: 'Windows-Azure-Table/1.0 Microsoft-HTTPAPI/2.0',
  'x-ms-request-id': 'e1894e57-aa5b-405d-ba8a-670bbf05b2f5',
  'x-ms-version': '2011-08-18',
  date: 'Fri, 21 Jun 2013 21:49:25 GMT' });
 return result; }]];