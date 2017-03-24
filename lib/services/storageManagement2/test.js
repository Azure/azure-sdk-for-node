'use strict';

var msRestAzure = require('ms-rest-azure');
var storageManagementClient = require('./lib/storageManagementClient');

// Interactive Login
var spn = process.env['CLIENT_ID'];
var domain = process.env['DOMAIN'];
var secret = process.env['APPLICATION_SECRET'];
var subscriptionId = process.env['AZURE_SUBSCRIPTION_ID'];
msRestAzure.loginWithServicePrincipalSecret(spn, secret, domain, function (err, credentials) {
  var client = new storageManagementClient(credentials, subscriptionId);
  let name = 'foo';
  //calling the method in traditional callback style
  client.storageAccounts.checkNameAvailability(name, function (err, result, request, response) {
    if (err) return console.log(err);
    console.log(result);
  });
  
  //calling the method in promise style
  client.storageAccounts.checkNameAvailability(name).then(function (result) {
    console.log(result);
  }).catch(function (err) {
    console.log(err);
  });

  //calling the method in promise style where the returned result is the HttpOperationResponse wrapper.
  client.storageAccounts.checkNameAvailabilityWithHttpOperationResponse(name).then(function (httpOperationResponse) {
    console.log(httpOperationResponse);
  }).catch(function (err) {
    console.log(err);
  });
});