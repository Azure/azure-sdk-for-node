
var fs = require('fs');
var pfx2pem = require('../../util/certificates/pkcs').pfx2pem;
var Channel = require('../channel');


exports.init = function (waz) {

    var pem = pfx2pem(fs.readFileSync('client-x509-rsa.pfx'));

    var channel = new Channel({
        host: 'umapi-new.rdfetest.dnsdemo4.com',
        port: 8443,
        key: pem,
        cert: pem
    });

    var space = waz.category('space')
        .description('Commands to manage your Azure web spaces.');

    space.command('show [name]')
        .description('Show info about a web space.')
        .option('-s, --subscription <id>', 'use the subscription id')
        .action(function (name, options) {

            var subscription = options.subscription || waz.category('account').defaultSubscriptionId();

            channel
                .header('x-ms-version', '2011-02-25')
                .path(subscription)
                .path('services/webspaces')
                .path(name || '')
                .GET(function (err, thing) {
                    console.log(thing);
                });
        });

    space.command('delete <name>')
        .description('Kill a web space.')
        .option('-s, --subscription <id>', 'use the subscription id')
        .action(function (name, options) {

            var subscription = options.subscription || waz.category('account').defaultSubscriptionId();

            channel
                .header('x-ms-version', '2011-02-25')
                .path(subscription)
                .path('services/webspaces')
                .path(name)
                .DELETE(function (err, thing) {
                    console.log(thing);
                });
        });





    space.command('create <name>')
        .description('Create a web space.')
        .option('-s, --subscription <id>', 'use the subscription id')
        .option('-p, --plan <plan>', 'use the plan')
        .action(function (name, options) {

            var subscription = options.subscription || waz.category('account').defaultSubscriptionId();

            channel
                .header('x-ms-version', '2011-02-25')
                .path(subscription)
                .path('services/webspaces/')
                .header('Content-Type', 'application/xml')
                .POST(function (req) {
                    req.write('<WebSpace xmlns="http://schemas.microsoft.com/windowsazure">');
                    req.write('<Name>');
                    req.write(name);
                    req.write('</Name>');
                    req.write('<Plan>');
                    req.write(options.plan || 'Plan 1');
                    req.write('</Plan>');
                    req.write('<Subscription>');
                    req.write(subscription);
                    req.write('</Subscription>');
                    req.write('</WebSpace>');

                    req.end();
                },
                    function (err, thing) {
                        console.log(thing);
                    });
        });
};
