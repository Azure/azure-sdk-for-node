// This file has been autogenerated.

exports.setEnvironment = function() {
  process.env['AZURE_TEST_LOCATION'] = 'West US';
  process.env['AZURE_SUBSCRIPTION_ID'] = 'b4871d65-b439-4433-8702-08fa2cc15808';
};

exports.scopes = [[function (nock) { 
var result = 
nock('http://management.azure.com:443')
  .filteringRequestBody(function (path) { return '*';})
.put('/subscriptions/b4871d65-b439-4433-8702-08fa2cc15808/resourceGroups/cdnTestGroup7502/providers/Microsoft.Cdn/profiles/cdnTestProfile3526?api-version=2015-06-01', '*')
  .reply(201, "{\r\n  \"name\":\"cdnTestProfile3526\",\"id\":\"/subscriptions/b4871d65-b439-4433-8702-08fa2cc15808/resourcegroups/cdnTestGroup7502/providers/Microsoft.Cdn/profiles/cdnTestProfile3526\",\"type\":\"Microsoft.Cdn/profiles\",\"tags\":{\r\n    \"tag1\":\"val1\",\"tag2\":\"val2\"\r\n  },\"location\":\"WestUs\",\"properties\":{\r\n    \"provisioningState\":\"Creating\",\"resourceState\":\"Creating\",\"sku\":{\r\n      \"name\":\"Standard\"\r\n    }\r\n  }\r\n}", { 'cache-control': 'no-cache',
  pragma: 'no-cache',
  'content-length': '400',
  'content-type': 'application/json; odata.metadata=minimal',
  expires: '-1',
  'retry-after': '10',
  'x-ms-request-id': 'f72651a4-1bdb-49dd-9622-0e0e27580d6f',
  'x-ms-client-request-id': '36f9318e-b206-462b-b61d-4be3f27769b3',
  'azure-asyncoperation': 'https://management.azure.com/subscriptions/b4871d65-b439-4433-8702-08fa2cc15808/resourcegroups/cdnTestGroup7502/providers/Microsoft.Cdn/operationresults/3273a68f-ec92-4e27-9635-5687ae7454b8?api-version=2015-06-01',
  'odata-version': '4.0',
  'strict-transport-security': 'max-age=31536000; includeSubDomains',
  server: 'Microsoft-IIS/8.5',
  'x-aspnet-version': '4.0.30319',
  'x-powered-by': 'ASP.NET',
  'x-ms-ratelimit-remaining-subscription-writes': '1199',
  'x-ms-correlation-request-id': '13187bfb-770b-4847-ac53-22e507cd9c83',
  'x-ms-routing-request-id': 'CENTRALUS:20160301T223239Z:13187bfb-770b-4847-ac53-22e507cd9c83',
  date: 'Tue, 01 Mar 2016 22:32:38 GMT',
  connection: 'close' });
 return result; },
function (nock) { 
var result = 
nock('https://management.azure.com:443')
  .filteringRequestBody(function (path) { return '*';})
.put('/subscriptions/b4871d65-b439-4433-8702-08fa2cc15808/resourceGroups/cdnTestGroup7502/providers/Microsoft.Cdn/profiles/cdnTestProfile3526?api-version=2015-06-01', '*')
  .reply(201, "{\r\n  \"name\":\"cdnTestProfile3526\",\"id\":\"/subscriptions/b4871d65-b439-4433-8702-08fa2cc15808/resourcegroups/cdnTestGroup7502/providers/Microsoft.Cdn/profiles/cdnTestProfile3526\",\"type\":\"Microsoft.Cdn/profiles\",\"tags\":{\r\n    \"tag1\":\"val1\",\"tag2\":\"val2\"\r\n  },\"location\":\"WestUs\",\"properties\":{\r\n    \"provisioningState\":\"Creating\",\"resourceState\":\"Creating\",\"sku\":{\r\n      \"name\":\"Standard\"\r\n    }\r\n  }\r\n}", { 'cache-control': 'no-cache',
  pragma: 'no-cache',
  'content-length': '400',
  'content-type': 'application/json; odata.metadata=minimal',
  expires: '-1',
  'retry-after': '10',
  'x-ms-request-id': 'f72651a4-1bdb-49dd-9622-0e0e27580d6f',
  'x-ms-client-request-id': '36f9318e-b206-462b-b61d-4be3f27769b3',
  'azure-asyncoperation': 'https://management.azure.com/subscriptions/b4871d65-b439-4433-8702-08fa2cc15808/resourcegroups/cdnTestGroup7502/providers/Microsoft.Cdn/operationresults/3273a68f-ec92-4e27-9635-5687ae7454b8?api-version=2015-06-01',
  'odata-version': '4.0',
  'strict-transport-security': 'max-age=31536000; includeSubDomains',
  server: 'Microsoft-IIS/8.5',
  'x-aspnet-version': '4.0.30319',
  'x-powered-by': 'ASP.NET',
  'x-ms-ratelimit-remaining-subscription-writes': '1199',
  'x-ms-correlation-request-id': '13187bfb-770b-4847-ac53-22e507cd9c83',
  'x-ms-routing-request-id': 'CENTRALUS:20160301T223239Z:13187bfb-770b-4847-ac53-22e507cd9c83',
  date: 'Tue, 01 Mar 2016 22:32:38 GMT',
  connection: 'close' });
 return result; },
function (nock) { 
var result = 
nock('http://management.azure.com:443')
  .get('/subscriptions/b4871d65-b439-4433-8702-08fa2cc15808/resourcegroups/cdnTestGroup7502/providers/Microsoft.Cdn/operationresults/3273a68f-ec92-4e27-9635-5687ae7454b8?api-version=2015-06-01')
  .reply(200, "{\r\n  \"status\":\"Succeeded\",\"error\":{\r\n    \"code\":\"None\",\"message\":null\r\n  }\r\n}", { 'cache-control': 'no-cache',
  pragma: 'no-cache',
  'content-length': '77',
  'content-type': 'application/json; odata.metadata=minimal; odata.streaming=true',
  expires: '-1',
  'x-ms-request-id': 'c963fdeb-d595-48cc-91d7-a4d2032e87a8',
  'x-ms-client-request-id': '2abff016-e123-4049-a737-7f101f2023e7',
  'odata-version': '4.0',
  'strict-transport-security': 'max-age=31536000; includeSubDomains',
  server: 'Microsoft-IIS/8.5',
  'x-aspnet-version': '4.0.30319',
  'x-powered-by': 'ASP.NET',
  'x-ms-ratelimit-remaining-subscription-reads': '14999',
  'x-ms-correlation-request-id': 'ce72aeaa-6f49-4918-a319-7f13901c548e',
  'x-ms-routing-request-id': 'WESTUS:20160301T223317Z:ce72aeaa-6f49-4918-a319-7f13901c548e',
  date: 'Tue, 01 Mar 2016 22:33:17 GMT',
  connection: 'close' });
 return result; },
function (nock) { 
var result = 
nock('https://management.azure.com:443')
  .get('/subscriptions/b4871d65-b439-4433-8702-08fa2cc15808/resourcegroups/cdnTestGroup7502/providers/Microsoft.Cdn/operationresults/3273a68f-ec92-4e27-9635-5687ae7454b8?api-version=2015-06-01')
  .reply(200, "{\r\n  \"status\":\"Succeeded\",\"error\":{\r\n    \"code\":\"None\",\"message\":null\r\n  }\r\n}", { 'cache-control': 'no-cache',
  pragma: 'no-cache',
  'content-length': '77',
  'content-type': 'application/json; odata.metadata=minimal; odata.streaming=true',
  expires: '-1',
  'x-ms-request-id': 'c963fdeb-d595-48cc-91d7-a4d2032e87a8',
  'x-ms-client-request-id': '2abff016-e123-4049-a737-7f101f2023e7',
  'odata-version': '4.0',
  'strict-transport-security': 'max-age=31536000; includeSubDomains',
  server: 'Microsoft-IIS/8.5',
  'x-aspnet-version': '4.0.30319',
  'x-powered-by': 'ASP.NET',
  'x-ms-ratelimit-remaining-subscription-reads': '14999',
  'x-ms-correlation-request-id': 'ce72aeaa-6f49-4918-a319-7f13901c548e',
  'x-ms-routing-request-id': 'WESTUS:20160301T223317Z:ce72aeaa-6f49-4918-a319-7f13901c548e',
  date: 'Tue, 01 Mar 2016 22:33:17 GMT',
  connection: 'close' });
 return result; },
function (nock) { 
var result = 
nock('http://management.azure.com:443')
  .get('/subscriptions/b4871d65-b439-4433-8702-08fa2cc15808/resourceGroups/cdnTestGroup7502/providers/Microsoft.Cdn/profiles/cdnTestProfile3526?api-version=2015-06-01')
  .reply(200, "{\r\n  \"name\":\"cdnTestProfile3526\",\"id\":\"/subscriptions/b4871d65-b439-4433-8702-08fa2cc15808/resourcegroups/cdnTestGroup7502/providers/Microsoft.Cdn/profiles/cdnTestProfile3526\",\"type\":\"Microsoft.Cdn/profiles\",\"tags\":{\r\n    \"tag1\":\"val1\",\"tag2\":\"val2\"\r\n  },\"location\":\"WestUs\",\"properties\":{\r\n    \"provisioningState\":\"Succeeded\",\"resourceState\":\"Active\",\"sku\":{\r\n      \"name\":\"Standard\"\r\n    }\r\n  }\r\n}", { 'cache-control': 'no-cache',
  pragma: 'no-cache',
  'content-length': '399',
  'content-type': 'application/json; odata.metadata=minimal; odata.streaming=true',
  expires: '-1',
  'x-ms-request-id': 'b8ad1e94-4c6c-4dfc-9913-0cb1da57022a',
  'x-ms-client-request-id': '2b798eb9-750d-42a0-8d3f-f5e272d38c41',
  'odata-version': '4.0',
  'strict-transport-security': 'max-age=31536000; includeSubDomains',
  server: 'Microsoft-IIS/8.5',
  'x-aspnet-version': '4.0.30319',
  'x-powered-by': 'ASP.NET',
  'x-ms-ratelimit-remaining-subscription-reads': '14997',
  'x-ms-correlation-request-id': 'e8490c45-7163-4db9-b3bc-8a3fbb3cd6bc',
  'x-ms-routing-request-id': 'WESTUS:20160301T223326Z:e8490c45-7163-4db9-b3bc-8a3fbb3cd6bc',
  date: 'Tue, 01 Mar 2016 22:33:25 GMT',
  connection: 'close' });
 return result; },
function (nock) { 
var result = 
nock('https://management.azure.com:443')
  .get('/subscriptions/b4871d65-b439-4433-8702-08fa2cc15808/resourceGroups/cdnTestGroup7502/providers/Microsoft.Cdn/profiles/cdnTestProfile3526?api-version=2015-06-01')
  .reply(200, "{\r\n  \"name\":\"cdnTestProfile3526\",\"id\":\"/subscriptions/b4871d65-b439-4433-8702-08fa2cc15808/resourcegroups/cdnTestGroup7502/providers/Microsoft.Cdn/profiles/cdnTestProfile3526\",\"type\":\"Microsoft.Cdn/profiles\",\"tags\":{\r\n    \"tag1\":\"val1\",\"tag2\":\"val2\"\r\n  },\"location\":\"WestUs\",\"properties\":{\r\n    \"provisioningState\":\"Succeeded\",\"resourceState\":\"Active\",\"sku\":{\r\n      \"name\":\"Standard\"\r\n    }\r\n  }\r\n}", { 'cache-control': 'no-cache',
  pragma: 'no-cache',
  'content-length': '399',
  'content-type': 'application/json; odata.metadata=minimal; odata.streaming=true',
  expires: '-1',
  'x-ms-request-id': 'b8ad1e94-4c6c-4dfc-9913-0cb1da57022a',
  'x-ms-client-request-id': '2b798eb9-750d-42a0-8d3f-f5e272d38c41',
  'odata-version': '4.0',
  'strict-transport-security': 'max-age=31536000; includeSubDomains',
  server: 'Microsoft-IIS/8.5',
  'x-aspnet-version': '4.0.30319',
  'x-powered-by': 'ASP.NET',
  'x-ms-ratelimit-remaining-subscription-reads': '14997',
  'x-ms-correlation-request-id': 'e8490c45-7163-4db9-b3bc-8a3fbb3cd6bc',
  'x-ms-routing-request-id': 'WESTUS:20160301T223326Z:e8490c45-7163-4db9-b3bc-8a3fbb3cd6bc',
  date: 'Tue, 01 Mar 2016 22:33:25 GMT',
  connection: 'close' });
 return result; },
function (nock) { 
var result = 
nock('http://management.azure.com:443')
  .filteringRequestBody(function (path) { return '*';})
.put('/subscriptions/b4871d65-b439-4433-8702-08fa2cc15808/resourceGroups/cdnTestGroup7502/providers/Microsoft.Cdn/profiles/cdnTestProfile3526/endpoints/testEndpoint-6029da3a-835e-4506-b4ea-bd5375165cdf?api-version=2015-06-01', '*')
  .reply(201, "{\r\n  \"name\":\"testEndpoint-6029da3a-835e-4506-b4ea-bd5375165cdf\",\"id\":\"/subscriptions/b4871d65-b439-4433-8702-08fa2cc15808/resourcegroups/cdnTestGroup7502/providers/Microsoft.Cdn/profiles/cdnTestProfile3526/endpoints/testEndpoint-6029da3a-835e-4506-b4ea-bd5375165cdf\",\"type\":\"Microsoft.Cdn/profiles/endpoints\",\"tags\":{\r\n    \"tag1\":\"val1\"\r\n  },\"location\":\"WestUs\",\"properties\":{\r\n    \"hostName\":\"testEndpoint-6029da3a-835e-4506-b4ea-bd5375165cdf.azureedge.net\",\"originHostHeader\":null,\"provisioningState\":\"Creating\",\"resourceState\":\"Creating\",\"isHttpAllowed\":true,\"isHttpsAllowed\":true,\"queryStringCachingBehavior\":\"IgnoreQueryString\",\"originPath\":null,\"origins\":[\r\n      {\r\n        \"name\":\"newname\",\"properties\":{\r\n          \"hostName\":\"newname.azureedge.net\",\"httpPort\":null,\"httpsPort\":null\r\n        }\r\n      }\r\n    ],\"contentTypesToCompress\":[\r\n      \r\n    ],\"isCompressionEnabled\":false\r\n  }\r\n}", { 'cache-control': 'no-cache',
  pragma: 'no-cache',
  'content-length': '897',
  'content-type': 'application/json; odata.metadata=minimal',
  expires: '-1',
  'retry-after': '10',
  'x-ms-request-id': '35f7bb2b-4c79-48d0-ac1b-32a6844f0582',
  'x-ms-client-request-id': 'e7bf870a-a8d3-4663-a015-2a40cc9a6cf9',
  'azure-asyncoperation': 'https://management.azure.com/subscriptions/b4871d65-b439-4433-8702-08fa2cc15808/resourcegroups/cdnTestGroup7502/providers/Microsoft.Cdn/operationresults/da77299b-f04f-4847-bff8-3764aa5998a1?api-version=2015-06-01',
  'odata-version': '4.0',
  'strict-transport-security': 'max-age=31536000; includeSubDomains',
  server: 'Microsoft-IIS/8.5',
  'x-aspnet-version': '4.0.30319',
  'x-powered-by': 'ASP.NET',
  'x-ms-ratelimit-remaining-subscription-writes': '1197',
  'x-ms-correlation-request-id': '3e96b426-e82c-42ae-a2a5-46048b1cae00',
  'x-ms-routing-request-id': 'WESTUS:20160301T223336Z:3e96b426-e82c-42ae-a2a5-46048b1cae00',
  date: 'Tue, 01 Mar 2016 22:33:36 GMT',
  connection: 'close' });
 return result; },
function (nock) { 
var result = 
nock('https://management.azure.com:443')
  .filteringRequestBody(function (path) { return '*';})
.put('/subscriptions/b4871d65-b439-4433-8702-08fa2cc15808/resourceGroups/cdnTestGroup7502/providers/Microsoft.Cdn/profiles/cdnTestProfile3526/endpoints/testEndpoint-6029da3a-835e-4506-b4ea-bd5375165cdf?api-version=2015-06-01', '*')
  .reply(201, "{\r\n  \"name\":\"testEndpoint-6029da3a-835e-4506-b4ea-bd5375165cdf\",\"id\":\"/subscriptions/b4871d65-b439-4433-8702-08fa2cc15808/resourcegroups/cdnTestGroup7502/providers/Microsoft.Cdn/profiles/cdnTestProfile3526/endpoints/testEndpoint-6029da3a-835e-4506-b4ea-bd5375165cdf\",\"type\":\"Microsoft.Cdn/profiles/endpoints\",\"tags\":{\r\n    \"tag1\":\"val1\"\r\n  },\"location\":\"WestUs\",\"properties\":{\r\n    \"hostName\":\"testEndpoint-6029da3a-835e-4506-b4ea-bd5375165cdf.azureedge.net\",\"originHostHeader\":null,\"provisioningState\":\"Creating\",\"resourceState\":\"Creating\",\"isHttpAllowed\":true,\"isHttpsAllowed\":true,\"queryStringCachingBehavior\":\"IgnoreQueryString\",\"originPath\":null,\"origins\":[\r\n      {\r\n        \"name\":\"newname\",\"properties\":{\r\n          \"hostName\":\"newname.azureedge.net\",\"httpPort\":null,\"httpsPort\":null\r\n        }\r\n      }\r\n    ],\"contentTypesToCompress\":[\r\n      \r\n    ],\"isCompressionEnabled\":false\r\n  }\r\n}", { 'cache-control': 'no-cache',
  pragma: 'no-cache',
  'content-length': '897',
  'content-type': 'application/json; odata.metadata=minimal',
  expires: '-1',
  'retry-after': '10',
  'x-ms-request-id': '35f7bb2b-4c79-48d0-ac1b-32a6844f0582',
  'x-ms-client-request-id': 'e7bf870a-a8d3-4663-a015-2a40cc9a6cf9',
  'azure-asyncoperation': 'https://management.azure.com/subscriptions/b4871d65-b439-4433-8702-08fa2cc15808/resourcegroups/cdnTestGroup7502/providers/Microsoft.Cdn/operationresults/da77299b-f04f-4847-bff8-3764aa5998a1?api-version=2015-06-01',
  'odata-version': '4.0',
  'strict-transport-security': 'max-age=31536000; includeSubDomains',
  server: 'Microsoft-IIS/8.5',
  'x-aspnet-version': '4.0.30319',
  'x-powered-by': 'ASP.NET',
  'x-ms-ratelimit-remaining-subscription-writes': '1197',
  'x-ms-correlation-request-id': '3e96b426-e82c-42ae-a2a5-46048b1cae00',
  'x-ms-routing-request-id': 'WESTUS:20160301T223336Z:3e96b426-e82c-42ae-a2a5-46048b1cae00',
  date: 'Tue, 01 Mar 2016 22:33:36 GMT',
  connection: 'close' });
 return result; },
function (nock) { 
var result = 
nock('http://management.azure.com:443')
  .get('/subscriptions/b4871d65-b439-4433-8702-08fa2cc15808/resourcegroups/cdnTestGroup7502/providers/Microsoft.Cdn/operationresults/da77299b-f04f-4847-bff8-3764aa5998a1?api-version=2015-06-01')
  .reply(200, "{\r\n  \"status\":\"Succeeded\",\"error\":{\r\n    \"code\":\"None\",\"message\":null\r\n  }\r\n}", { 'cache-control': 'no-cache',
  pragma: 'no-cache',
  'content-length': '77',
  'content-type': 'application/json; odata.metadata=minimal; odata.streaming=true',
  expires: '-1',
  'x-ms-request-id': 'a54d28a4-e5a9-4420-a6c9-d5a7cc620886',
  'x-ms-client-request-id': '1194e0cc-9b48-4d1f-8a07-fc42d6151c43',
  'odata-version': '4.0',
  'strict-transport-security': 'max-age=31536000; includeSubDomains',
  server: 'Microsoft-IIS/8.5',
  'x-aspnet-version': '4.0.30319',
  'x-powered-by': 'ASP.NET',
  'x-ms-ratelimit-remaining-subscription-reads': '14999',
  'x-ms-correlation-request-id': '1266e1c8-119f-4be3-9b8c-0ab372f59690',
  'x-ms-routing-request-id': 'WESTUS:20160301T223415Z:1266e1c8-119f-4be3-9b8c-0ab372f59690',
  date: 'Tue, 01 Mar 2016 22:34:14 GMT',
  connection: 'close' });
 return result; },
function (nock) { 
var result = 
nock('https://management.azure.com:443')
  .get('/subscriptions/b4871d65-b439-4433-8702-08fa2cc15808/resourcegroups/cdnTestGroup7502/providers/Microsoft.Cdn/operationresults/da77299b-f04f-4847-bff8-3764aa5998a1?api-version=2015-06-01')
  .reply(200, "{\r\n  \"status\":\"Succeeded\",\"error\":{\r\n    \"code\":\"None\",\"message\":null\r\n  }\r\n}", { 'cache-control': 'no-cache',
  pragma: 'no-cache',
  'content-length': '77',
  'content-type': 'application/json; odata.metadata=minimal; odata.streaming=true',
  expires: '-1',
  'x-ms-request-id': 'a54d28a4-e5a9-4420-a6c9-d5a7cc620886',
  'x-ms-client-request-id': '1194e0cc-9b48-4d1f-8a07-fc42d6151c43',
  'odata-version': '4.0',
  'strict-transport-security': 'max-age=31536000; includeSubDomains',
  server: 'Microsoft-IIS/8.5',
  'x-aspnet-version': '4.0.30319',
  'x-powered-by': 'ASP.NET',
  'x-ms-ratelimit-remaining-subscription-reads': '14999',
  'x-ms-correlation-request-id': '1266e1c8-119f-4be3-9b8c-0ab372f59690',
  'x-ms-routing-request-id': 'WESTUS:20160301T223415Z:1266e1c8-119f-4be3-9b8c-0ab372f59690',
  date: 'Tue, 01 Mar 2016 22:34:14 GMT',
  connection: 'close' });
 return result; },
function (nock) { 
var result = 
nock('http://management.azure.com:443')
  .get('/subscriptions/b4871d65-b439-4433-8702-08fa2cc15808/resourceGroups/cdnTestGroup7502/providers/Microsoft.Cdn/profiles/cdnTestProfile3526/endpoints/testEndpoint-6029da3a-835e-4506-b4ea-bd5375165cdf?api-version=2015-06-01')
  .reply(200, "{\r\n  \"name\":\"testEndpoint-6029da3a-835e-4506-b4ea-bd5375165cdf\",\"id\":\"/subscriptions/b4871d65-b439-4433-8702-08fa2cc15808/resourcegroups/cdnTestGroup7502/providers/Microsoft.Cdn/profiles/cdnTestProfile3526/endpoints/testEndpoint-6029da3a-835e-4506-b4ea-bd5375165cdf\",\"type\":\"Microsoft.Cdn/profiles/endpoints\",\"tags\":{\r\n    \"tag1\":\"val1\"\r\n  },\"location\":\"WestUs\",\"properties\":{\r\n    \"hostName\":\"testEndpoint-6029da3a-835e-4506-b4ea-bd5375165cdf.azureedge.net\",\"originHostHeader\":null,\"provisioningState\":\"Succeeded\",\"resourceState\":\"Running\",\"isHttpAllowed\":true,\"isHttpsAllowed\":true,\"queryStringCachingBehavior\":\"IgnoreQueryString\",\"originPath\":null,\"origins\":[\r\n      {\r\n        \"name\":\"newname\",\"properties\":{\r\n          \"hostName\":\"newname.azureedge.net\",\"httpPort\":null,\"httpsPort\":null\r\n        }\r\n      }\r\n    ],\"contentTypesToCompress\":[\r\n      \r\n    ],\"isCompressionEnabled\":false\r\n  }\r\n}", { 'cache-control': 'no-cache',
  pragma: 'no-cache',
  'content-length': '897',
  'content-type': 'application/json; odata.metadata=minimal; odata.streaming=true',
  expires: '-1',
  'x-ms-request-id': 'ea81d9b3-708d-477f-9ffe-6c22a7b32cc2',
  'x-ms-client-request-id': '746570e3-517d-4528-a6ca-386363434226',
  'odata-version': '4.0',
  'strict-transport-security': 'max-age=31536000; includeSubDomains',
  server: 'Microsoft-IIS/8.5',
  'x-aspnet-version': '4.0.30319',
  'x-powered-by': 'ASP.NET',
  'x-ms-ratelimit-remaining-subscription-reads': '14998',
  'x-ms-correlation-request-id': '4272d5bd-49dc-461f-af2e-e1c14fcc6fb4',
  'x-ms-routing-request-id': 'WESTUS:20160301T223424Z:4272d5bd-49dc-461f-af2e-e1c14fcc6fb4',
  date: 'Tue, 01 Mar 2016 22:34:23 GMT',
  connection: 'close' });
 return result; },
function (nock) { 
var result = 
nock('https://management.azure.com:443')
  .get('/subscriptions/b4871d65-b439-4433-8702-08fa2cc15808/resourceGroups/cdnTestGroup7502/providers/Microsoft.Cdn/profiles/cdnTestProfile3526/endpoints/testEndpoint-6029da3a-835e-4506-b4ea-bd5375165cdf?api-version=2015-06-01')
  .reply(200, "{\r\n  \"name\":\"testEndpoint-6029da3a-835e-4506-b4ea-bd5375165cdf\",\"id\":\"/subscriptions/b4871d65-b439-4433-8702-08fa2cc15808/resourcegroups/cdnTestGroup7502/providers/Microsoft.Cdn/profiles/cdnTestProfile3526/endpoints/testEndpoint-6029da3a-835e-4506-b4ea-bd5375165cdf\",\"type\":\"Microsoft.Cdn/profiles/endpoints\",\"tags\":{\r\n    \"tag1\":\"val1\"\r\n  },\"location\":\"WestUs\",\"properties\":{\r\n    \"hostName\":\"testEndpoint-6029da3a-835e-4506-b4ea-bd5375165cdf.azureedge.net\",\"originHostHeader\":null,\"provisioningState\":\"Succeeded\",\"resourceState\":\"Running\",\"isHttpAllowed\":true,\"isHttpsAllowed\":true,\"queryStringCachingBehavior\":\"IgnoreQueryString\",\"originPath\":null,\"origins\":[\r\n      {\r\n        \"name\":\"newname\",\"properties\":{\r\n          \"hostName\":\"newname.azureedge.net\",\"httpPort\":null,\"httpsPort\":null\r\n        }\r\n      }\r\n    ],\"contentTypesToCompress\":[\r\n      \r\n    ],\"isCompressionEnabled\":false\r\n  }\r\n}", { 'cache-control': 'no-cache',
  pragma: 'no-cache',
  'content-length': '897',
  'content-type': 'application/json; odata.metadata=minimal; odata.streaming=true',
  expires: '-1',
  'x-ms-request-id': 'ea81d9b3-708d-477f-9ffe-6c22a7b32cc2',
  'x-ms-client-request-id': '746570e3-517d-4528-a6ca-386363434226',
  'odata-version': '4.0',
  'strict-transport-security': 'max-age=31536000; includeSubDomains',
  server: 'Microsoft-IIS/8.5',
  'x-aspnet-version': '4.0.30319',
  'x-powered-by': 'ASP.NET',
  'x-ms-ratelimit-remaining-subscription-reads': '14998',
  'x-ms-correlation-request-id': '4272d5bd-49dc-461f-af2e-e1c14fcc6fb4',
  'x-ms-routing-request-id': 'WESTUS:20160301T223424Z:4272d5bd-49dc-461f-af2e-e1c14fcc6fb4',
  date: 'Tue, 01 Mar 2016 22:34:23 GMT',
  connection: 'close' });
 return result; },
function (nock) { 
var result = 
nock('http://management.azure.com:443')
  .get('/subscriptions/b4871d65-b439-4433-8702-08fa2cc15808/resourceGroups/cdnTestGroup7502/providers/Microsoft.Cdn/profiles/cdnTestProfile3526/endpoints/testEndpoint-6029da3a-835e-4506-b4ea-bd5375165cdf/customDomains?api-version=2015-06-01')
  .reply(200, "{\r\n  \"value\":[\r\n    \r\n  ]\r\n}", { 'cache-control': 'no-cache',
  pragma: 'no-cache',
  'content-length': '28',
  'content-type': 'application/json; odata.metadata=minimal; odata.streaming=true',
  expires: '-1',
  'x-ms-request-id': '28d2a8c7-6217-4589-a894-4c7a57bb6f32',
  'x-ms-client-request-id': '91a462c8-0917-478e-a2ee-ba73834e8765',
  'odata-version': '4.0',
  'strict-transport-security': 'max-age=31536000; includeSubDomains',
  server: 'Microsoft-IIS/8.5',
  'x-aspnet-version': '4.0.30319',
  'x-powered-by': 'ASP.NET',
  'x-ms-ratelimit-remaining-subscription-reads': '14996',
  'x-ms-correlation-request-id': 'd120b8a9-9645-4990-899f-80f4d3706d7e',
  'x-ms-routing-request-id': 'WESTUS:20160301T223432Z:d120b8a9-9645-4990-899f-80f4d3706d7e',
  date: 'Tue, 01 Mar 2016 22:34:32 GMT',
  connection: 'close' });
 return result; },
function (nock) { 
var result = 
nock('https://management.azure.com:443')
  .get('/subscriptions/b4871d65-b439-4433-8702-08fa2cc15808/resourceGroups/cdnTestGroup7502/providers/Microsoft.Cdn/profiles/cdnTestProfile3526/endpoints/testEndpoint-6029da3a-835e-4506-b4ea-bd5375165cdf/customDomains?api-version=2015-06-01')
  .reply(200, "{\r\n  \"value\":[\r\n    \r\n  ]\r\n}", { 'cache-control': 'no-cache',
  pragma: 'no-cache',
  'content-length': '28',
  'content-type': 'application/json; odata.metadata=minimal; odata.streaming=true',
  expires: '-1',
  'x-ms-request-id': '28d2a8c7-6217-4589-a894-4c7a57bb6f32',
  'x-ms-client-request-id': '91a462c8-0917-478e-a2ee-ba73834e8765',
  'odata-version': '4.0',
  'strict-transport-security': 'max-age=31536000; includeSubDomains',
  server: 'Microsoft-IIS/8.5',
  'x-aspnet-version': '4.0.30319',
  'x-powered-by': 'ASP.NET',
  'x-ms-ratelimit-remaining-subscription-reads': '14996',
  'x-ms-correlation-request-id': 'd120b8a9-9645-4990-899f-80f4d3706d7e',
  'x-ms-routing-request-id': 'WESTUS:20160301T223432Z:d120b8a9-9645-4990-899f-80f4d3706d7e',
  date: 'Tue, 01 Mar 2016 22:34:32 GMT',
  connection: 'close' });
 return result; }]];