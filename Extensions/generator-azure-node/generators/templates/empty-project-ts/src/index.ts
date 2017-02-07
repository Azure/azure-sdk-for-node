import * as msRest from 'ms-rest';
import * as msRestAzure from 'ms-rest-azure';

// TODO: Initialize these variables
let clientId: string;
let domain: string;
let secret: string;
let options: string;

msRestAzure.loginWithServicePrincipalSecret(clientId, secret, domain, options, function(err, credentials){
    if (err) return console.log(err);

    // TODO: Write your application logic here.
});