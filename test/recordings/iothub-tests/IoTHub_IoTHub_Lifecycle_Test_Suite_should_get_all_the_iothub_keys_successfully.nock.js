// This file has been autogenerated.

exports.setEnvironment = function() {
  process.env['AZURE_SUBSCRIPTION_ID'] = 'e0b81f36-36ba-44f7-b550-7c9344a35893';
};

exports.scopes = [[function (nock) { 
var result = 
nock('http://management.azure.com:443')
  .post('/subscriptions/e0b81f36-36ba-44f7-b550-7c9344a35893/resourceGroups/nodetestrg/providers/Microsoft.Devices/IotHubs/nodeTestHub/listkeys?api-version=2017-01-19')
  .reply(200, "{\"value\":[{\"keyName\":\"iothubowner\",\"primaryKey\":\"4E3k3LptWwmARQcReBM5Osx/iLUChsrDkemek5tbs8o=\",\"secondaryKey\":\"69kCIq7sVfKpRSpKAT79BcJEMcgg7zDGhn5JH9x7jYQ=\",\"rights\":\"RegistryWrite, ServiceConnect, DeviceConnect\"},{\"keyName\":\"service\",\"primaryKey\":\"+P081yHt7a3vKLnp92OWXIPXe8ZaYcCnzPX9jbXcPeU=\",\"secondaryKey\":\"8Qh6/fb3GK/xSSkUglHJ1sb8gJuQaCCcb/cfP68wD0k=\",\"rights\":\"ServiceConnect\"},{\"keyName\":\"device\",\"primaryKey\":\"9tjhgR2sUN57oK8XnYR5fn+bfUPMI9iDS30Upt4m13M=\",\"secondaryKey\":\"GK2oYj7qlkmNwrpRXp4eaql6gQ+wIE9KpdakWjnRxgY=\",\"rights\":\"DeviceConnect\"},{\"keyName\":\"registryRead\",\"primaryKey\":\"Jqar97+uEgqAcRp7Bu+Y/a5kmAnbRWXL3JzdiGh2lhw=\",\"secondaryKey\":\"vYXS19mP4cmI7iOWluhJu/GeMYZy/Ume2atXfOHUs9w=\",\"rights\":\"RegistryRead\"},{\"keyName\":\"registryReadWrite\",\"primaryKey\":\"MTLUCuxMiwjzqFvNsngZtg7S6DsUUopuNw/xoOCrYrI=\",\"secondaryKey\":\"Lnp7TMNBnWeNvNZHJhZjDXXr+a0ffflsfEhUB8QtgtU=\",\"rights\":\"RegistryWrite\"}]}", { 'cache-control': 'no-cache',
  pragma: 'no-cache',
  'content-length': '905',
  'content-type': 'application/json; charset=utf-8',
  expires: '-1',
  server: 'Microsoft-HTTPAPI/2.0',
  'x-ms-ratelimit-remaining-subscription-writes': '1196',
  'x-ms-request-id': 'e15c3389-317e-4d25-bbf1-dce5f16d4e30',
  'x-ms-correlation-request-id': 'e15c3389-317e-4d25-bbf1-dce5f16d4e30',
  'x-ms-routing-request-id': 'WESTUS:20170502T011937Z:e15c3389-317e-4d25-bbf1-dce5f16d4e30',
  'strict-transport-security': 'max-age=31536000; includeSubDomains',
  date: 'Tue, 02 May 2017 01:19:36 GMT',
  connection: 'close' });
 return result; },
function (nock) { 
var result = 
nock('https://management.azure.com:443')
  .post('/subscriptions/e0b81f36-36ba-44f7-b550-7c9344a35893/resourceGroups/nodetestrg/providers/Microsoft.Devices/IotHubs/nodeTestHub/listkeys?api-version=2017-01-19')
  .reply(200, "{\"value\":[{\"keyName\":\"iothubowner\",\"primaryKey\":\"4E3k3LptWwmARQcReBM5Osx/iLUChsrDkemek5tbs8o=\",\"secondaryKey\":\"69kCIq7sVfKpRSpKAT79BcJEMcgg7zDGhn5JH9x7jYQ=\",\"rights\":\"RegistryWrite, ServiceConnect, DeviceConnect\"},{\"keyName\":\"service\",\"primaryKey\":\"+P081yHt7a3vKLnp92OWXIPXe8ZaYcCnzPX9jbXcPeU=\",\"secondaryKey\":\"8Qh6/fb3GK/xSSkUglHJ1sb8gJuQaCCcb/cfP68wD0k=\",\"rights\":\"ServiceConnect\"},{\"keyName\":\"device\",\"primaryKey\":\"9tjhgR2sUN57oK8XnYR5fn+bfUPMI9iDS30Upt4m13M=\",\"secondaryKey\":\"GK2oYj7qlkmNwrpRXp4eaql6gQ+wIE9KpdakWjnRxgY=\",\"rights\":\"DeviceConnect\"},{\"keyName\":\"registryRead\",\"primaryKey\":\"Jqar97+uEgqAcRp7Bu+Y/a5kmAnbRWXL3JzdiGh2lhw=\",\"secondaryKey\":\"vYXS19mP4cmI7iOWluhJu/GeMYZy/Ume2atXfOHUs9w=\",\"rights\":\"RegistryRead\"},{\"keyName\":\"registryReadWrite\",\"primaryKey\":\"MTLUCuxMiwjzqFvNsngZtg7S6DsUUopuNw/xoOCrYrI=\",\"secondaryKey\":\"Lnp7TMNBnWeNvNZHJhZjDXXr+a0ffflsfEhUB8QtgtU=\",\"rights\":\"RegistryWrite\"}]}", { 'cache-control': 'no-cache',
  pragma: 'no-cache',
  'content-length': '905',
  'content-type': 'application/json; charset=utf-8',
  expires: '-1',
  server: 'Microsoft-HTTPAPI/2.0',
  'x-ms-ratelimit-remaining-subscription-writes': '1196',
  'x-ms-request-id': 'e15c3389-317e-4d25-bbf1-dce5f16d4e30',
  'x-ms-correlation-request-id': 'e15c3389-317e-4d25-bbf1-dce5f16d4e30',
  'x-ms-routing-request-id': 'WESTUS:20170502T011937Z:e15c3389-317e-4d25-bbf1-dce5f16d4e30',
  'strict-transport-security': 'max-age=31536000; includeSubDomains',
  date: 'Tue, 02 May 2017 01:19:36 GMT',
  connection: 'close' });
 return result; }]];