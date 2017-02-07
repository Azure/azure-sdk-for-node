'use strict';

var msRest = require('ms-rest');
var msRestAzure = require('ms-rest-azure');

// TODO: Initialize these variables
var clientId;
var domain;
var secret;

msRestAzure.loginWithServicePrincipalSecret(clientId, secret, domain, function(err, credentials){
    if (err) return console.log(err);

    // TODO: Write your application logic here.
});
