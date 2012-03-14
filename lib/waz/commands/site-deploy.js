
var fs = require('fs');
var pfx2pem = require('../../util/certificates/pkcs').pfx2pem;
var Channel = require('../channel');

exports.init = function (waz) {

    var deploy = waz.category('site').category('deploy')
        .description('Manage site deployments.');

    deploy.command('list')
        .description('Show deployment history')
        .action(function () { });

    deploy.command('activate')
        .description('Reactivate a specific deployment')
        .action(function () { });
};
