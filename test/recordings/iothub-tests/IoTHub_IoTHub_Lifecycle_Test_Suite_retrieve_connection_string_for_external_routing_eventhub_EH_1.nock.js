// This file has been autogenerated.

exports.setEnvironment = function() {
  process.env['AZURE_SUBSCRIPTION_ID'] = 'e0b81f36-36ba-44f7-b550-7c9344a35893';
};

exports.scopes = [[function (nock) { 
var result = 
nock('http://management.azure.com:443')
  .post('/subscriptions/e0b81f36-36ba-44f7-b550-7c9344a35893/resourceGroups/nodetestrg/providers/Microsoft.EventHub/namespaces/nodetestEH-NS1/eventhubs/nodetestEH1/authorizationRules/Send/ListKeys?api-version=2015-08-01')
  .reply(200, "{\"primaryConnectionString\":\"Endpoint=sb://nodetesteh-ns1.servicebus.windows.net/;SharedAccessKeyName=Send;SharedAccessKey=/zvH3XrqbsPbW8pMoewvKlV4yTa2Tl2IaLoQlnEkQA4=;EntityPath=nodetestEH1\",\"secondaryConnectionString\":\"Endpoint=sb://nodetesteh-ns1.servicebus.windows.net/;SharedAccessKeyName=Send;SharedAccessKey=Naw1iiRvCB0DQfS8YbGqyCkSkUJeFC1zTAnSQXseI4w=;EntityPath=nodetestEH1\",\"primaryKey\":\"/zvH3XrqbsPbW8pMoewvKlV4yTa2Tl2IaLoQlnEkQA4=\",\"secondaryKey\":\"Naw1iiRvCB0DQfS8YbGqyCkSkUJeFC1zTAnSQXseI4w=\",\"keyName\":\"Send\"}", { 'cache-control': 'no-cache',
  pragma: 'no-cache',
  'content-length': '522',
  'content-type': 'application/json; charset=utf-8',
  expires: '-1',
  'x-ms-request-id': '8664bccc-3a5c-4dce-9aa9-94c5b3bcba27_M0_M0',
  'server-sb': 'Service-Bus-Resource-Provider/SN1',
  server: 'Service-Bus-Resource-Provider/SN1',
  'x-ms-ratelimit-remaining-subscription-writes': '1198',
  'x-ms-correlation-request-id': '4ffbc386-0ead-4bee-8b95-d7cd3a4059b9',
  'x-ms-routing-request-id': 'WESTUS2:20170502T194627Z:4ffbc386-0ead-4bee-8b95-d7cd3a4059b9',
  'strict-transport-security': 'max-age=31536000; includeSubDomains',
  date: 'Tue, 02 May 2017 19:46:27 GMT',
  connection: 'close' });
 return result; },
function (nock) { 
var result = 
nock('https://management.azure.com:443')
  .post('/subscriptions/e0b81f36-36ba-44f7-b550-7c9344a35893/resourceGroups/nodetestrg/providers/Microsoft.EventHub/namespaces/nodetestEH-NS1/eventhubs/nodetestEH1/authorizationRules/Send/ListKeys?api-version=2015-08-01')
  .reply(200, "{\"primaryConnectionString\":\"Endpoint=sb://nodetesteh-ns1.servicebus.windows.net/;SharedAccessKeyName=Send;SharedAccessKey=/zvH3XrqbsPbW8pMoewvKlV4yTa2Tl2IaLoQlnEkQA4=;EntityPath=nodetestEH1\",\"secondaryConnectionString\":\"Endpoint=sb://nodetesteh-ns1.servicebus.windows.net/;SharedAccessKeyName=Send;SharedAccessKey=Naw1iiRvCB0DQfS8YbGqyCkSkUJeFC1zTAnSQXseI4w=;EntityPath=nodetestEH1\",\"primaryKey\":\"/zvH3XrqbsPbW8pMoewvKlV4yTa2Tl2IaLoQlnEkQA4=\",\"secondaryKey\":\"Naw1iiRvCB0DQfS8YbGqyCkSkUJeFC1zTAnSQXseI4w=\",\"keyName\":\"Send\"}", { 'cache-control': 'no-cache',
  pragma: 'no-cache',
  'content-length': '522',
  'content-type': 'application/json; charset=utf-8',
  expires: '-1',
  'x-ms-request-id': '8664bccc-3a5c-4dce-9aa9-94c5b3bcba27_M0_M0',
  'server-sb': 'Service-Bus-Resource-Provider/SN1',
  server: 'Service-Bus-Resource-Provider/SN1',
  'x-ms-ratelimit-remaining-subscription-writes': '1198',
  'x-ms-correlation-request-id': '4ffbc386-0ead-4bee-8b95-d7cd3a4059b9',
  'x-ms-routing-request-id': 'WESTUS2:20170502T194627Z:4ffbc386-0ead-4bee-8b95-d7cd3a4059b9',
  'strict-transport-security': 'max-age=31536000; includeSubDomains',
  date: 'Tue, 02 May 2017 19:46:27 GMT',
  connection: 'close' });
 return result; }]];