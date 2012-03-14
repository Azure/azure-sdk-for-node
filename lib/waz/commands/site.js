
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

    var site = waz.category('site')
        .description('Commands to manage your Azure web sites.');

    site.command('show [name]')
        .description('List your Azure web sites.')
        .option('-i, --subscription <id>', 'use the subscription id')
        .action(function (name, options) {

            var subscription = options.subscription || waz.category('account').defaultSubscriptionId();

            channel
                .header('x-ms-version', '2011-02-25')
                .path(subscription)
                .path('services/webspaces/ctpwebspace/sites')
                .path(name || '')
                .header('Content-Type', 'application/xml')
                .GET(function (err, thing) {
                    console.log(thing);
                });
        });

    site.command('create <name>')
        .description('Initialize your Azure web site.')
        .option('-i, --subscription <id>', 'use the subscription id')
        .action(function (name, options) {

            var subscription = options.subscription || waz.category('account').defaultSubscriptionId();

            channel
                .header('x-ms-version', '2011-02-25')
                .path(subscription)
                .path('services/webspaces/ctpwebspace/sites/')
                .header('Content-Type', 'application/xml')
                .POST(function (req) {
                    req.write('<Site xmlns="http://schemas.microsoft.com/windowsazure">');
                    req.write('<HostNames>');
                    req.write('<string xmlns="http://schemas.microsoft.com/2003/10/Serialization/Arrays">');
                    req.write(name + '.antint0.antares-test.windows-int.net');
                    req.write('</string>');
                    req.write('</HostNames>');
                    req.write('<Name>');
                    req.write(name);
                    req.write('</Name>');
                    req.write('</Site>');

                    req.end();
                },
                    function (err, thing) {
                        console.log(thing);
                    });
        });

    site.command('delete <name>')
        .description('Delete a web site.')
        .option('-i, --subscription <id>', 'use the subscription id')
        .action(function (name, options) {

            var subscription = options.subscription || waz.category('account').defaultSubscriptionId();

            channel
                .header('x-ms-version', '2011-02-25')
                .path(subscription)
                .path('services/webspaces/ctpwebspace/sites/')
                .path(name)
                .header('Content-Type', 'application/xml')
                .DELETE(function (err, thing) {
                    console.log(thing);
                });
        });


    site.command('start <name>')
        .description('Delete a web site.')
        .option('-i, --subscription <id>', 'use the subscription id')
        .action(function (name, options) {

            var subscription = options.subscription || waz.category('account').defaultSubscriptionId();

            channel
                .header('x-ms-version', '2011-02-25')
                .path(subscription)
                .path('services/webspaces/ctpwebspace/sites/')
                .path(name)
                .header('Content-Type', 'application/xml')
                .POST(function (req) {
                    req.write('<Site xmlns="http://schemas.microsoft.com/windowsazure">');
                    //                    req.write('<State>');
                    //                    req.write('Running');
                    //                    req.write('</State>');
                    req.write('</Site>');

                    req.end();
                }, function (err, thing) {
                    console.log(thing);
                });
        });

    site.command('stop <name>')
        .description('Delete a web site.')
        .option('-i, --subscription <id>', 'use the subscription id')
        .action(function (name, options) {

            var subscription = options.subscription || waz.category('account').defaultSubscriptionId();

            channel
                .header('x-ms-version', '2011-02-25')
                .path(subscription)
                .path('services/webspaces/ctpwebspace/sites/')
                .path(name)
                .header('Content-Type', 'application/xml')
                .PUT(function (req) {
                    req.write('<Site xmlns="http://schemas.microsoft.com/windowsazure">');
                    req.write('<State>');
                    req.write('Stopped');
                    req.write('</State>');
                    req.write('</Site>');

                    req.end();
                }, function (err, thing) {
                    console.log(thing);
                });
        });
};
