// This file has been autogenerated.

exports.setEnvironment = function() {
  process.env['AZURE_SUBSCRIPTION_ID'] = 'e0b81f36-36ba-44f7-b550-7c9344a35893';
};

exports.scopes = [[function (nock) { 
var result = 
nock('http://management.azure.com:443')
  .filteringRequestBody(function (path) { return '*';})
.put('/subscriptions/e0b81f36-36ba-44f7-b550-7c9344a35893/resourceGroups/nodetestrg/providers/Microsoft.Devices/IotHubs/nodeTestHub?api-version=2017-01-19', '*')
  .reply(201, "{\"id\":\"/subscriptions/e0b81f36-36ba-44f7-b550-7c9344a35893/resourceGroups/nodetestrg/providers/Microsoft.Devices/IotHubs/nodeTestHub\",\"name\":\"nodeTestHub\",\"type\":\"Microsoft.Devices/IotHubs\",\"location\":\"East US\",\"tags\":{},\"subscriptionid\":\"e0b81f36-36ba-44f7-b550-7c9344a35893\",\"resourcegroup\":\"nodetestrg\",\"properties\":{\"state\":\"Activating\",\"provisioningState\":\"Accepted\",\"ipFilterRules\":[{\"filterName\":\"ipfilterrule\",\"action\":\"Accept\",\"ipMask\":\"0.0.0.0/0\"}],\"routing\":{\"endpoints\":{\"serviceBusQueues\":[],\"serviceBusTopics\":[{\"connectionString\":\"Endpoint=sb://nodetestsb-ns1.servicebus.windows.net/;SharedAccessKeyName=Send;SharedAccessKey=/a0HaiPRX5zmS56up81IgqoXeb2B08K6o8vSp5mAbMA=;EntityPath=nodetestTopic1\",\"name\":\"Topic1\",\"id\":\"888fc5a3-c97e-4cd2-8752-8fb0867bc8ac\",\"subscriptionId\":\"e0b81f36-36ba-44f7-b550-7c9344a35893\",\"resourceGroup\":\"nodetestrg\"}],\"eventHubs\":[{\"connectionString\":\"Endpoint=sb://nodetesteh-ns1.servicebus.windows.net/;SharedAccessKeyName=Send;SharedAccessKey=PLv2A8zfnQ3trTbi//IYWKVygm31KTHNcrZ2GZAf+dM=;EntityPath=nodetestEH1\",\"name\":\"EH1\",\"id\":\"eb50ccd9-ac96-4792-a88b-37b392ac706c\",\"subscriptionId\":\"e0b81f36-36ba-44f7-b550-7c9344a35893\",\"resourceGroup\":\"nodetestrg\"}]},\"routes\":[{\"name\":\"Route1\",\"source\":\"DeviceMessages\",\"condition\":\"false\",\"endpointNames\":[\"EH1\"],\"isEnabled\":true},{\"name\":\"Route2\",\"source\":\"DeviceMessages\",\"condition\":\"true\",\"endpointNames\":[\"Topic1\"],\"isEnabled\":true}],\"fallbackRoute\":{\"name\":\"$fallback\",\"source\":\"DeviceMessages\",\"condition\":\"true\",\"endpointNames\":[\"events\"],\"isEnabled\":false}},\"enableFileUploadNotifications\":false,\"cloudToDevice\":{\"maxDeliveryCount\":10,\"defaultTtlAsIso8601\":\"PT1H\",\"feedback\":{\"lockDurationAsIso8601\":\"PT1M\",\"ttlAsIso8601\":\"PT1H\",\"maxDeliveryCount\":10}},\"operationsMonitoringProperties\":{\"events\":{\"C2DCommands\":\"Error\",\"DeviceTelemetry\":\"Error\",\"DeviceIdentityOperations\":\"Error\",\"Connections\":\"Error, Information\"}},\"features\":\"None\",\"generationNumber\":0},\"sku\":{\"name\":\"S1\",\"tier\":\"Standard\",\"capacity\":2}}", { 'cache-control': 'no-cache',
  pragma: 'no-cache',
  'content-length': '2002',
  'content-type': 'application/json; charset=utf-8',
  expires: '-1',
  'azure-asyncoperation': 'https://management.azure.com/subscriptions/e0b81f36-36ba-44f7-b550-7c9344a35893/resourceGroups/nodetestrg/providers/Microsoft.Devices/IotHubs/nodeTestHub/operationResults/MmZhNjY5ODAtYWRiOS00N2M2LWIzNGItOTdlNmE2NDNkODg3?api-version=2017-01-19&asyncinfo',
  server: 'Microsoft-HTTPAPI/2.0',
  'x-ms-ratelimit-remaining-subscription-resource-requests': '4999',
  'x-ms-request-id': '66cd00a5-cca6-4a7e-a5fa-d81ab3c46656',
  'x-ms-correlation-request-id': '66cd00a5-cca6-4a7e-a5fa-d81ab3c46656',
  'x-ms-routing-request-id': 'WESTUS:20170502T011404Z:66cd00a5-cca6-4a7e-a5fa-d81ab3c46656',
  'strict-transport-security': 'max-age=31536000; includeSubDomains',
  date: 'Tue, 02 May 2017 01:14:04 GMT',
  connection: 'close' });
 return result; },
function (nock) { 
var result = 
nock('https://management.azure.com:443')
  .filteringRequestBody(function (path) { return '*';})
.put('/subscriptions/e0b81f36-36ba-44f7-b550-7c9344a35893/resourceGroups/nodetestrg/providers/Microsoft.Devices/IotHubs/nodeTestHub?api-version=2017-01-19', '*')
  .reply(201, "{\"id\":\"/subscriptions/e0b81f36-36ba-44f7-b550-7c9344a35893/resourceGroups/nodetestrg/providers/Microsoft.Devices/IotHubs/nodeTestHub\",\"name\":\"nodeTestHub\",\"type\":\"Microsoft.Devices/IotHubs\",\"location\":\"East US\",\"tags\":{},\"subscriptionid\":\"e0b81f36-36ba-44f7-b550-7c9344a35893\",\"resourcegroup\":\"nodetestrg\",\"properties\":{\"state\":\"Activating\",\"provisioningState\":\"Accepted\",\"ipFilterRules\":[{\"filterName\":\"ipfilterrule\",\"action\":\"Accept\",\"ipMask\":\"0.0.0.0/0\"}],\"routing\":{\"endpoints\":{\"serviceBusQueues\":[],\"serviceBusTopics\":[{\"connectionString\":\"Endpoint=sb://nodetestsb-ns1.servicebus.windows.net/;SharedAccessKeyName=Send;SharedAccessKey=/a0HaiPRX5zmS56up81IgqoXeb2B08K6o8vSp5mAbMA=;EntityPath=nodetestTopic1\",\"name\":\"Topic1\",\"id\":\"888fc5a3-c97e-4cd2-8752-8fb0867bc8ac\",\"subscriptionId\":\"e0b81f36-36ba-44f7-b550-7c9344a35893\",\"resourceGroup\":\"nodetestrg\"}],\"eventHubs\":[{\"connectionString\":\"Endpoint=sb://nodetesteh-ns1.servicebus.windows.net/;SharedAccessKeyName=Send;SharedAccessKey=PLv2A8zfnQ3trTbi//IYWKVygm31KTHNcrZ2GZAf+dM=;EntityPath=nodetestEH1\",\"name\":\"EH1\",\"id\":\"eb50ccd9-ac96-4792-a88b-37b392ac706c\",\"subscriptionId\":\"e0b81f36-36ba-44f7-b550-7c9344a35893\",\"resourceGroup\":\"nodetestrg\"}]},\"routes\":[{\"name\":\"Route1\",\"source\":\"DeviceMessages\",\"condition\":\"false\",\"endpointNames\":[\"EH1\"],\"isEnabled\":true},{\"name\":\"Route2\",\"source\":\"DeviceMessages\",\"condition\":\"true\",\"endpointNames\":[\"Topic1\"],\"isEnabled\":true}],\"fallbackRoute\":{\"name\":\"$fallback\",\"source\":\"DeviceMessages\",\"condition\":\"true\",\"endpointNames\":[\"events\"],\"isEnabled\":false}},\"enableFileUploadNotifications\":false,\"cloudToDevice\":{\"maxDeliveryCount\":10,\"defaultTtlAsIso8601\":\"PT1H\",\"feedback\":{\"lockDurationAsIso8601\":\"PT1M\",\"ttlAsIso8601\":\"PT1H\",\"maxDeliveryCount\":10}},\"operationsMonitoringProperties\":{\"events\":{\"C2DCommands\":\"Error\",\"DeviceTelemetry\":\"Error\",\"DeviceIdentityOperations\":\"Error\",\"Connections\":\"Error, Information\"}},\"features\":\"None\",\"generationNumber\":0},\"sku\":{\"name\":\"S1\",\"tier\":\"Standard\",\"capacity\":2}}", { 'cache-control': 'no-cache',
  pragma: 'no-cache',
  'content-length': '2002',
  'content-type': 'application/json; charset=utf-8',
  expires: '-1',
  'azure-asyncoperation': 'https://management.azure.com/subscriptions/e0b81f36-36ba-44f7-b550-7c9344a35893/resourceGroups/nodetestrg/providers/Microsoft.Devices/IotHubs/nodeTestHub/operationResults/MmZhNjY5ODAtYWRiOS00N2M2LWIzNGItOTdlNmE2NDNkODg3?api-version=2017-01-19&asyncinfo',
  server: 'Microsoft-HTTPAPI/2.0',
  'x-ms-ratelimit-remaining-subscription-resource-requests': '4999',
  'x-ms-request-id': '66cd00a5-cca6-4a7e-a5fa-d81ab3c46656',
  'x-ms-correlation-request-id': '66cd00a5-cca6-4a7e-a5fa-d81ab3c46656',
  'x-ms-routing-request-id': 'WESTUS:20170502T011404Z:66cd00a5-cca6-4a7e-a5fa-d81ab3c46656',
  'strict-transport-security': 'max-age=31536000; includeSubDomains',
  date: 'Tue, 02 May 2017 01:14:04 GMT',
  connection: 'close' });
 return result; },
function (nock) { 
var result = 
nock('http://management.azure.com:443')
  .get('/subscriptions/e0b81f36-36ba-44f7-b550-7c9344a35893/resourceGroups/nodetestrg/providers/Microsoft.Devices/IotHubs/nodeTestHub/operationResults/MmZhNjY5ODAtYWRiOS00N2M2LWIzNGItOTdlNmE2NDNkODg3?api-version=2017-01-19&asyncinfo')
  .reply(200, "{\"status\":\"Running\"}", { 'cache-control': 'no-cache',
  pragma: 'no-cache',
  'content-length': '20',
  'content-type': 'application/json; charset=utf-8',
  expires: '-1',
  server: 'Microsoft-HTTPAPI/2.0',
  'x-ms-ratelimit-remaining-subscription-reads': '14948',
  'x-ms-request-id': '93e63ea0-cd17-4a7b-95b1-48f09f25821c',
  'x-ms-correlation-request-id': '93e63ea0-cd17-4a7b-95b1-48f09f25821c',
  'x-ms-routing-request-id': 'WESTUS:20170502T011435Z:93e63ea0-cd17-4a7b-95b1-48f09f25821c',
  'strict-transport-security': 'max-age=31536000; includeSubDomains',
  date: 'Tue, 02 May 2017 01:14:34 GMT',
  connection: 'close' });
 return result; },
function (nock) { 
var result = 
nock('https://management.azure.com:443')
  .get('/subscriptions/e0b81f36-36ba-44f7-b550-7c9344a35893/resourceGroups/nodetestrg/providers/Microsoft.Devices/IotHubs/nodeTestHub/operationResults/MmZhNjY5ODAtYWRiOS00N2M2LWIzNGItOTdlNmE2NDNkODg3?api-version=2017-01-19&asyncinfo')
  .reply(200, "{\"status\":\"Running\"}", { 'cache-control': 'no-cache',
  pragma: 'no-cache',
  'content-length': '20',
  'content-type': 'application/json; charset=utf-8',
  expires: '-1',
  server: 'Microsoft-HTTPAPI/2.0',
  'x-ms-ratelimit-remaining-subscription-reads': '14948',
  'x-ms-request-id': '93e63ea0-cd17-4a7b-95b1-48f09f25821c',
  'x-ms-correlation-request-id': '93e63ea0-cd17-4a7b-95b1-48f09f25821c',
  'x-ms-routing-request-id': 'WESTUS:20170502T011435Z:93e63ea0-cd17-4a7b-95b1-48f09f25821c',
  'strict-transport-security': 'max-age=31536000; includeSubDomains',
  date: 'Tue, 02 May 2017 01:14:34 GMT',
  connection: 'close' });
 return result; },
function (nock) { 
var result = 
nock('http://management.azure.com:443')
  .get('/subscriptions/e0b81f36-36ba-44f7-b550-7c9344a35893/resourceGroups/nodetestrg/providers/Microsoft.Devices/IotHubs/nodeTestHub/operationResults/MmZhNjY5ODAtYWRiOS00N2M2LWIzNGItOTdlNmE2NDNkODg3?api-version=2017-01-19&asyncinfo')
  .reply(200, "{\"status\":\"Running\"}", { 'cache-control': 'no-cache',
  pragma: 'no-cache',
  'content-length': '20',
  'content-type': 'application/json; charset=utf-8',
  expires: '-1',
  server: 'Microsoft-HTTPAPI/2.0',
  'x-ms-ratelimit-remaining-subscription-reads': '14998',
  'x-ms-request-id': '951d502d-5356-4efb-ad4c-82a7faf46b5d',
  'x-ms-correlation-request-id': '951d502d-5356-4efb-ad4c-82a7faf46b5d',
  'x-ms-routing-request-id': 'WESTUS2:20170502T011505Z:951d502d-5356-4efb-ad4c-82a7faf46b5d',
  'strict-transport-security': 'max-age=31536000; includeSubDomains',
  date: 'Tue, 02 May 2017 01:15:05 GMT',
  connection: 'close' });
 return result; },
function (nock) { 
var result = 
nock('https://management.azure.com:443')
  .get('/subscriptions/e0b81f36-36ba-44f7-b550-7c9344a35893/resourceGroups/nodetestrg/providers/Microsoft.Devices/IotHubs/nodeTestHub/operationResults/MmZhNjY5ODAtYWRiOS00N2M2LWIzNGItOTdlNmE2NDNkODg3?api-version=2017-01-19&asyncinfo')
  .reply(200, "{\"status\":\"Running\"}", { 'cache-control': 'no-cache',
  pragma: 'no-cache',
  'content-length': '20',
  'content-type': 'application/json; charset=utf-8',
  expires: '-1',
  server: 'Microsoft-HTTPAPI/2.0',
  'x-ms-ratelimit-remaining-subscription-reads': '14998',
  'x-ms-request-id': '951d502d-5356-4efb-ad4c-82a7faf46b5d',
  'x-ms-correlation-request-id': '951d502d-5356-4efb-ad4c-82a7faf46b5d',
  'x-ms-routing-request-id': 'WESTUS2:20170502T011505Z:951d502d-5356-4efb-ad4c-82a7faf46b5d',
  'strict-transport-security': 'max-age=31536000; includeSubDomains',
  date: 'Tue, 02 May 2017 01:15:05 GMT',
  connection: 'close' });
 return result; },
function (nock) { 
var result = 
nock('http://management.azure.com:443')
  .get('/subscriptions/e0b81f36-36ba-44f7-b550-7c9344a35893/resourceGroups/nodetestrg/providers/Microsoft.Devices/IotHubs/nodeTestHub/operationResults/MmZhNjY5ODAtYWRiOS00N2M2LWIzNGItOTdlNmE2NDNkODg3?api-version=2017-01-19&asyncinfo')
  .reply(200, "{\"status\":\"Running\"}", { 'cache-control': 'no-cache',
  pragma: 'no-cache',
  'content-length': '20',
  'content-type': 'application/json; charset=utf-8',
  expires: '-1',
  server: 'Microsoft-HTTPAPI/2.0',
  'x-ms-ratelimit-remaining-subscription-reads': '14977',
  'x-ms-request-id': '7309cb51-a4b0-415f-af35-bc7e5c193431',
  'x-ms-correlation-request-id': '7309cb51-a4b0-415f-af35-bc7e5c193431',
  'x-ms-routing-request-id': 'WESTUS2:20170502T011535Z:7309cb51-a4b0-415f-af35-bc7e5c193431',
  'strict-transport-security': 'max-age=31536000; includeSubDomains',
  date: 'Tue, 02 May 2017 01:15:35 GMT',
  connection: 'close' });
 return result; },
function (nock) { 
var result = 
nock('https://management.azure.com:443')
  .get('/subscriptions/e0b81f36-36ba-44f7-b550-7c9344a35893/resourceGroups/nodetestrg/providers/Microsoft.Devices/IotHubs/nodeTestHub/operationResults/MmZhNjY5ODAtYWRiOS00N2M2LWIzNGItOTdlNmE2NDNkODg3?api-version=2017-01-19&asyncinfo')
  .reply(200, "{\"status\":\"Running\"}", { 'cache-control': 'no-cache',
  pragma: 'no-cache',
  'content-length': '20',
  'content-type': 'application/json; charset=utf-8',
  expires: '-1',
  server: 'Microsoft-HTTPAPI/2.0',
  'x-ms-ratelimit-remaining-subscription-reads': '14977',
  'x-ms-request-id': '7309cb51-a4b0-415f-af35-bc7e5c193431',
  'x-ms-correlation-request-id': '7309cb51-a4b0-415f-af35-bc7e5c193431',
  'x-ms-routing-request-id': 'WESTUS2:20170502T011535Z:7309cb51-a4b0-415f-af35-bc7e5c193431',
  'strict-transport-security': 'max-age=31536000; includeSubDomains',
  date: 'Tue, 02 May 2017 01:15:35 GMT',
  connection: 'close' });
 return result; },
function (nock) { 
var result = 
nock('http://management.azure.com:443')
  .get('/subscriptions/e0b81f36-36ba-44f7-b550-7c9344a35893/resourceGroups/nodetestrg/providers/Microsoft.Devices/IotHubs/nodeTestHub/operationResults/MmZhNjY5ODAtYWRiOS00N2M2LWIzNGItOTdlNmE2NDNkODg3?api-version=2017-01-19&asyncinfo')
  .reply(200, "{\"status\":\"Running\"}", { 'cache-control': 'no-cache',
  pragma: 'no-cache',
  'content-length': '20',
  'content-type': 'application/json; charset=utf-8',
  expires: '-1',
  server: 'Microsoft-HTTPAPI/2.0',
  'x-ms-ratelimit-remaining-subscription-reads': '14977',
  'x-ms-request-id': '813e93a3-88f9-4af5-a330-208e78046f21',
  'x-ms-correlation-request-id': '813e93a3-88f9-4af5-a330-208e78046f21',
  'x-ms-routing-request-id': 'WESTUS2:20170502T011606Z:813e93a3-88f9-4af5-a330-208e78046f21',
  'strict-transport-security': 'max-age=31536000; includeSubDomains',
  date: 'Tue, 02 May 2017 01:16:06 GMT',
  connection: 'close' });
 return result; },
function (nock) { 
var result = 
nock('https://management.azure.com:443')
  .get('/subscriptions/e0b81f36-36ba-44f7-b550-7c9344a35893/resourceGroups/nodetestrg/providers/Microsoft.Devices/IotHubs/nodeTestHub/operationResults/MmZhNjY5ODAtYWRiOS00N2M2LWIzNGItOTdlNmE2NDNkODg3?api-version=2017-01-19&asyncinfo')
  .reply(200, "{\"status\":\"Running\"}", { 'cache-control': 'no-cache',
  pragma: 'no-cache',
  'content-length': '20',
  'content-type': 'application/json; charset=utf-8',
  expires: '-1',
  server: 'Microsoft-HTTPAPI/2.0',
  'x-ms-ratelimit-remaining-subscription-reads': '14977',
  'x-ms-request-id': '813e93a3-88f9-4af5-a330-208e78046f21',
  'x-ms-correlation-request-id': '813e93a3-88f9-4af5-a330-208e78046f21',
  'x-ms-routing-request-id': 'WESTUS2:20170502T011606Z:813e93a3-88f9-4af5-a330-208e78046f21',
  'strict-transport-security': 'max-age=31536000; includeSubDomains',
  date: 'Tue, 02 May 2017 01:16:06 GMT',
  connection: 'close' });
 return result; },
function (nock) { 
var result = 
nock('http://management.azure.com:443')
  .get('/subscriptions/e0b81f36-36ba-44f7-b550-7c9344a35893/resourceGroups/nodetestrg/providers/Microsoft.Devices/IotHubs/nodeTestHub/operationResults/MmZhNjY5ODAtYWRiOS00N2M2LWIzNGItOTdlNmE2NDNkODg3?api-version=2017-01-19&asyncinfo')
  .reply(200, "{\"status\":\"Running\"}", { 'cache-control': 'no-cache',
  pragma: 'no-cache',
  'content-length': '20',
  'content-type': 'application/json; charset=utf-8',
  expires: '-1',
  server: 'Microsoft-HTTPAPI/2.0',
  'x-ms-ratelimit-remaining-subscription-reads': '14958',
  'x-ms-request-id': 'c93c06d3-db40-4aec-b9e6-6aa16412a69c',
  'x-ms-correlation-request-id': 'c93c06d3-db40-4aec-b9e6-6aa16412a69c',
  'x-ms-routing-request-id': 'WESTUS:20170502T011637Z:c93c06d3-db40-4aec-b9e6-6aa16412a69c',
  'strict-transport-security': 'max-age=31536000; includeSubDomains',
  date: 'Tue, 02 May 2017 01:16:36 GMT',
  connection: 'close' });
 return result; },
function (nock) { 
var result = 
nock('https://management.azure.com:443')
  .get('/subscriptions/e0b81f36-36ba-44f7-b550-7c9344a35893/resourceGroups/nodetestrg/providers/Microsoft.Devices/IotHubs/nodeTestHub/operationResults/MmZhNjY5ODAtYWRiOS00N2M2LWIzNGItOTdlNmE2NDNkODg3?api-version=2017-01-19&asyncinfo')
  .reply(200, "{\"status\":\"Running\"}", { 'cache-control': 'no-cache',
  pragma: 'no-cache',
  'content-length': '20',
  'content-type': 'application/json; charset=utf-8',
  expires: '-1',
  server: 'Microsoft-HTTPAPI/2.0',
  'x-ms-ratelimit-remaining-subscription-reads': '14958',
  'x-ms-request-id': 'c93c06d3-db40-4aec-b9e6-6aa16412a69c',
  'x-ms-correlation-request-id': 'c93c06d3-db40-4aec-b9e6-6aa16412a69c',
  'x-ms-routing-request-id': 'WESTUS:20170502T011637Z:c93c06d3-db40-4aec-b9e6-6aa16412a69c',
  'strict-transport-security': 'max-age=31536000; includeSubDomains',
  date: 'Tue, 02 May 2017 01:16:36 GMT',
  connection: 'close' });
 return result; },
function (nock) { 
var result = 
nock('http://management.azure.com:443')
  .get('/subscriptions/e0b81f36-36ba-44f7-b550-7c9344a35893/resourceGroups/nodetestrg/providers/Microsoft.Devices/IotHubs/nodeTestHub/operationResults/MmZhNjY5ODAtYWRiOS00N2M2LWIzNGItOTdlNmE2NDNkODg3?api-version=2017-01-19&asyncinfo')
  .reply(200, "{\"status\":\"Running\"}", { 'cache-control': 'no-cache',
  pragma: 'no-cache',
  'content-length': '20',
  'content-type': 'application/json; charset=utf-8',
  expires: '-1',
  server: 'Microsoft-HTTPAPI/2.0',
  'x-ms-ratelimit-remaining-subscription-reads': '14946',
  'x-ms-request-id': 'aa2ac1db-36d2-474a-84d8-8ce0f618ee89',
  'x-ms-correlation-request-id': 'aa2ac1db-36d2-474a-84d8-8ce0f618ee89',
  'x-ms-routing-request-id': 'WESTUS:20170502T011707Z:aa2ac1db-36d2-474a-84d8-8ce0f618ee89',
  'strict-transport-security': 'max-age=31536000; includeSubDomains',
  date: 'Tue, 02 May 2017 01:17:07 GMT',
  connection: 'close' });
 return result; },
function (nock) { 
var result = 
nock('https://management.azure.com:443')
  .get('/subscriptions/e0b81f36-36ba-44f7-b550-7c9344a35893/resourceGroups/nodetestrg/providers/Microsoft.Devices/IotHubs/nodeTestHub/operationResults/MmZhNjY5ODAtYWRiOS00N2M2LWIzNGItOTdlNmE2NDNkODg3?api-version=2017-01-19&asyncinfo')
  .reply(200, "{\"status\":\"Running\"}", { 'cache-control': 'no-cache',
  pragma: 'no-cache',
  'content-length': '20',
  'content-type': 'application/json; charset=utf-8',
  expires: '-1',
  server: 'Microsoft-HTTPAPI/2.0',
  'x-ms-ratelimit-remaining-subscription-reads': '14946',
  'x-ms-request-id': 'aa2ac1db-36d2-474a-84d8-8ce0f618ee89',
  'x-ms-correlation-request-id': 'aa2ac1db-36d2-474a-84d8-8ce0f618ee89',
  'x-ms-routing-request-id': 'WESTUS:20170502T011707Z:aa2ac1db-36d2-474a-84d8-8ce0f618ee89',
  'strict-transport-security': 'max-age=31536000; includeSubDomains',
  date: 'Tue, 02 May 2017 01:17:07 GMT',
  connection: 'close' });
 return result; },
function (nock) { 
var result = 
nock('http://management.azure.com:443')
  .get('/subscriptions/e0b81f36-36ba-44f7-b550-7c9344a35893/resourceGroups/nodetestrg/providers/Microsoft.Devices/IotHubs/nodeTestHub/operationResults/MmZhNjY5ODAtYWRiOS00N2M2LWIzNGItOTdlNmE2NDNkODg3?api-version=2017-01-19&asyncinfo')
  .reply(200, "{\"status\":\"Succeeded\"}", { 'cache-control': 'no-cache',
  pragma: 'no-cache',
  'content-length': '22',
  'content-type': 'application/json; charset=utf-8',
  expires: '-1',
  server: 'Microsoft-HTTPAPI/2.0',
  'x-ms-ratelimit-remaining-subscription-reads': '14955',
  'x-ms-request-id': 'c26cff3c-874c-46bf-8958-7241d39e1b6d',
  'x-ms-correlation-request-id': 'c26cff3c-874c-46bf-8958-7241d39e1b6d',
  'x-ms-routing-request-id': 'WESTUS:20170502T011737Z:c26cff3c-874c-46bf-8958-7241d39e1b6d',
  'strict-transport-security': 'max-age=31536000; includeSubDomains',
  date: 'Tue, 02 May 2017 01:17:37 GMT',
  connection: 'close' });
 return result; },
function (nock) { 
var result = 
nock('https://management.azure.com:443')
  .get('/subscriptions/e0b81f36-36ba-44f7-b550-7c9344a35893/resourceGroups/nodetestrg/providers/Microsoft.Devices/IotHubs/nodeTestHub/operationResults/MmZhNjY5ODAtYWRiOS00N2M2LWIzNGItOTdlNmE2NDNkODg3?api-version=2017-01-19&asyncinfo')
  .reply(200, "{\"status\":\"Succeeded\"}", { 'cache-control': 'no-cache',
  pragma: 'no-cache',
  'content-length': '22',
  'content-type': 'application/json; charset=utf-8',
  expires: '-1',
  server: 'Microsoft-HTTPAPI/2.0',
  'x-ms-ratelimit-remaining-subscription-reads': '14955',
  'x-ms-request-id': 'c26cff3c-874c-46bf-8958-7241d39e1b6d',
  'x-ms-correlation-request-id': 'c26cff3c-874c-46bf-8958-7241d39e1b6d',
  'x-ms-routing-request-id': 'WESTUS:20170502T011737Z:c26cff3c-874c-46bf-8958-7241d39e1b6d',
  'strict-transport-security': 'max-age=31536000; includeSubDomains',
  date: 'Tue, 02 May 2017 01:17:37 GMT',
  connection: 'close' });
 return result; },
function (nock) { 
var result = 
nock('http://management.azure.com:443')
  .get('/subscriptions/e0b81f36-36ba-44f7-b550-7c9344a35893/resourceGroups/nodetestrg/providers/Microsoft.Devices/IotHubs/nodeTestHub?api-version=2017-01-19')
  .reply(200, "{\"id\":\"/subscriptions/e0b81f36-36ba-44f7-b550-7c9344a35893/resourceGroups/nodetestrg/providers/Microsoft.Devices/IotHubs/nodeTestHub\",\"name\":\"nodeTestHub\",\"type\":\"Microsoft.Devices/IotHubs\",\"location\":\"East US\",\"tags\":{},\"subscriptionid\":\"e0b81f36-36ba-44f7-b550-7c9344a35893\",\"resourcegroup\":\"nodetestrg\",\"etag\":\"AAAAAADp1+4=\",\"properties\":{\"state\":\"Active\",\"provisioningState\":\"Succeeded\",\"ipFilterRules\":[{\"filterName\":\"ipfilterrule\",\"action\":\"Accept\",\"ipMask\":\"0.0.0.0/0\"}],\"hostName\":\"nodeTestHub.azure-devices.net\",\"eventHubEndpoints\":{\"events\":{\"retentionTimeInDays\":1,\"partitionCount\":4,\"partitionIds\":[\"0\",\"1\",\"2\",\"3\"],\"path\":\"nodetesthub\",\"endpoint\":\"sb://iothub-ns-nodetesthu-155411-fa1c2146b4.servicebus.windows.net/\"},\"operationsMonitoringEvents\":{\"retentionTimeInDays\":1,\"partitionCount\":4,\"partitionIds\":[\"0\",\"1\",\"2\",\"3\"],\"path\":\"nodetesthub-operationmonitoring\",\"endpoint\":\"sb://iothub-ns-nodetesthu-155411-fa1c2146b4.servicebus.windows.net/\"}},\"routing\":{\"endpoints\":{\"serviceBusQueues\":[],\"serviceBusTopics\":[{\"connectionString\":\"Endpoint=sb://nodetestsb-ns1.servicebus.windows.net:5671/;SharedAccessKeyName=Send;SharedAccessKey=****;EntityPath=nodetestTopic1\",\"name\":\"Topic1\",\"id\":\"888fc5a3-c97e-4cd2-8752-8fb0867bc8ac\",\"subscriptionId\":\"e0b81f36-36ba-44f7-b550-7c9344a35893\",\"resourceGroup\":\"nodetestrg\"}],\"eventHubs\":[{\"connectionString\":\"Endpoint=sb://nodetesteh-ns1.servicebus.windows.net:5671/;SharedAccessKeyName=Send;SharedAccessKey=****;EntityPath=nodetestEH1\",\"name\":\"EH1\",\"id\":\"eb50ccd9-ac96-4792-a88b-37b392ac706c\",\"subscriptionId\":\"e0b81f36-36ba-44f7-b550-7c9344a35893\",\"resourceGroup\":\"nodetestrg\"}]},\"routes\":[{\"name\":\"Route1\",\"source\":\"DeviceMessages\",\"condition\":\"false\",\"endpointNames\":[\"EH1\"],\"isEnabled\":true},{\"name\":\"Route2\",\"source\":\"DeviceMessages\",\"condition\":\"true\",\"endpointNames\":[\"Topic1\"],\"isEnabled\":true}],\"fallbackRoute\":{\"name\":\"$fallback\",\"source\":\"DeviceMessages\",\"condition\":\"true\",\"endpointNames\":[\"events\"],\"isEnabled\":false}},\"storageEndpoints\":{\"$default\":{\"sasTtlAsIso8601\":\"PT1H\",\"connectionString\":\"\",\"containerName\":\"\"}},\"messagingEndpoints\":{\"fileNotifications\":{\"lockDurationAsIso8601\":\"PT1M\",\"ttlAsIso8601\":\"PT1H\",\"maxDeliveryCount\":10}},\"enableFileUploadNotifications\":false,\"cloudToDevice\":{\"maxDeliveryCount\":10,\"defaultTtlAsIso8601\":\"PT1H\",\"feedback\":{\"lockDurationAsIso8601\":\"PT1M\",\"ttlAsIso8601\":\"PT1H\",\"maxDeliveryCount\":10}},\"operationsMonitoringProperties\":{\"events\":{\"C2DCommands\":\"Error\",\"DeviceTelemetry\":\"Error\",\"DeviceIdentityOperations\":\"Error\",\"Connections\":\"Error, Information\",\"None\":\"None\",\"FileUploadOperations\":\"None\",\"Routes\":\"None\"}},\"features\":\"None\",\"generationNumber\":0},\"sku\":{\"name\":\"S1\",\"tier\":\"Standard\",\"capacity\":2}}", { 'cache-control': 'no-cache',
  pragma: 'no-cache',
  'content-length': '2714',
  'content-type': 'application/json; charset=utf-8',
  expires: '-1',
  server: 'Microsoft-HTTPAPI/2.0',
  'x-ms-ratelimit-remaining-subscription-reads': '14940',
  'x-ms-request-id': '56ebbf6a-4e19-419a-b545-88f664f41883',
  'x-ms-correlation-request-id': '56ebbf6a-4e19-419a-b545-88f664f41883',
  'x-ms-routing-request-id': 'WESTUS:20170502T011737Z:56ebbf6a-4e19-419a-b545-88f664f41883',
  'strict-transport-security': 'max-age=31536000; includeSubDomains',
  date: 'Tue, 02 May 2017 01:17:37 GMT',
  connection: 'close' });
 return result; },
function (nock) { 
var result = 
nock('https://management.azure.com:443')
  .get('/subscriptions/e0b81f36-36ba-44f7-b550-7c9344a35893/resourceGroups/nodetestrg/providers/Microsoft.Devices/IotHubs/nodeTestHub?api-version=2017-01-19')
  .reply(200, "{\"id\":\"/subscriptions/e0b81f36-36ba-44f7-b550-7c9344a35893/resourceGroups/nodetestrg/providers/Microsoft.Devices/IotHubs/nodeTestHub\",\"name\":\"nodeTestHub\",\"type\":\"Microsoft.Devices/IotHubs\",\"location\":\"East US\",\"tags\":{},\"subscriptionid\":\"e0b81f36-36ba-44f7-b550-7c9344a35893\",\"resourcegroup\":\"nodetestrg\",\"etag\":\"AAAAAADp1+4=\",\"properties\":{\"state\":\"Active\",\"provisioningState\":\"Succeeded\",\"ipFilterRules\":[{\"filterName\":\"ipfilterrule\",\"action\":\"Accept\",\"ipMask\":\"0.0.0.0/0\"}],\"hostName\":\"nodeTestHub.azure-devices.net\",\"eventHubEndpoints\":{\"events\":{\"retentionTimeInDays\":1,\"partitionCount\":4,\"partitionIds\":[\"0\",\"1\",\"2\",\"3\"],\"path\":\"nodetesthub\",\"endpoint\":\"sb://iothub-ns-nodetesthu-155411-fa1c2146b4.servicebus.windows.net/\"},\"operationsMonitoringEvents\":{\"retentionTimeInDays\":1,\"partitionCount\":4,\"partitionIds\":[\"0\",\"1\",\"2\",\"3\"],\"path\":\"nodetesthub-operationmonitoring\",\"endpoint\":\"sb://iothub-ns-nodetesthu-155411-fa1c2146b4.servicebus.windows.net/\"}},\"routing\":{\"endpoints\":{\"serviceBusQueues\":[],\"serviceBusTopics\":[{\"connectionString\":\"Endpoint=sb://nodetestsb-ns1.servicebus.windows.net:5671/;SharedAccessKeyName=Send;SharedAccessKey=****;EntityPath=nodetestTopic1\",\"name\":\"Topic1\",\"id\":\"888fc5a3-c97e-4cd2-8752-8fb0867bc8ac\",\"subscriptionId\":\"e0b81f36-36ba-44f7-b550-7c9344a35893\",\"resourceGroup\":\"nodetestrg\"}],\"eventHubs\":[{\"connectionString\":\"Endpoint=sb://nodetesteh-ns1.servicebus.windows.net:5671/;SharedAccessKeyName=Send;SharedAccessKey=****;EntityPath=nodetestEH1\",\"name\":\"EH1\",\"id\":\"eb50ccd9-ac96-4792-a88b-37b392ac706c\",\"subscriptionId\":\"e0b81f36-36ba-44f7-b550-7c9344a35893\",\"resourceGroup\":\"nodetestrg\"}]},\"routes\":[{\"name\":\"Route1\",\"source\":\"DeviceMessages\",\"condition\":\"false\",\"endpointNames\":[\"EH1\"],\"isEnabled\":true},{\"name\":\"Route2\",\"source\":\"DeviceMessages\",\"condition\":\"true\",\"endpointNames\":[\"Topic1\"],\"isEnabled\":true}],\"fallbackRoute\":{\"name\":\"$fallback\",\"source\":\"DeviceMessages\",\"condition\":\"true\",\"endpointNames\":[\"events\"],\"isEnabled\":false}},\"storageEndpoints\":{\"$default\":{\"sasTtlAsIso8601\":\"PT1H\",\"connectionString\":\"\",\"containerName\":\"\"}},\"messagingEndpoints\":{\"fileNotifications\":{\"lockDurationAsIso8601\":\"PT1M\",\"ttlAsIso8601\":\"PT1H\",\"maxDeliveryCount\":10}},\"enableFileUploadNotifications\":false,\"cloudToDevice\":{\"maxDeliveryCount\":10,\"defaultTtlAsIso8601\":\"PT1H\",\"feedback\":{\"lockDurationAsIso8601\":\"PT1M\",\"ttlAsIso8601\":\"PT1H\",\"maxDeliveryCount\":10}},\"operationsMonitoringProperties\":{\"events\":{\"C2DCommands\":\"Error\",\"DeviceTelemetry\":\"Error\",\"DeviceIdentityOperations\":\"Error\",\"Connections\":\"Error, Information\",\"None\":\"None\",\"FileUploadOperations\":\"None\",\"Routes\":\"None\"}},\"features\":\"None\",\"generationNumber\":0},\"sku\":{\"name\":\"S1\",\"tier\":\"Standard\",\"capacity\":2}}", { 'cache-control': 'no-cache',
  pragma: 'no-cache',
  'content-length': '2714',
  'content-type': 'application/json; charset=utf-8',
  expires: '-1',
  server: 'Microsoft-HTTPAPI/2.0',
  'x-ms-ratelimit-remaining-subscription-reads': '14940',
  'x-ms-request-id': '56ebbf6a-4e19-419a-b545-88f664f41883',
  'x-ms-correlation-request-id': '56ebbf6a-4e19-419a-b545-88f664f41883',
  'x-ms-routing-request-id': 'WESTUS:20170502T011737Z:56ebbf6a-4e19-419a-b545-88f664f41883',
  'strict-transport-security': 'max-age=31536000; includeSubDomains',
  date: 'Tue, 02 May 2017 01:17:37 GMT',
  connection: 'close' });
 return result; }]];