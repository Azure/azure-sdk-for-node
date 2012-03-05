
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
        .option('-s, --space <name>', 'use the space name')
        .action(function (name, options) {

            var subscription = options.subscription || waz.category('account').defaultSubscriptionId();

            channel
                .header('x-ms-version', '2011-02-25')
                .path('51ca709f-562d-4d4f-8efc-46de5833042e')
                .path('services/webspaces')
                .path(options.space || '.default')
                .path('sites')
                .path(name || '')
                .header('Content-Type', 'application/xml')
                .GET(function(err, thing) {
                        console.log(thing);
                    });
        });

    site.command('create <name>')
        .description('Initialize your Azure web site.')
        .option('-i, --subscription <id>', 'use the subscription id')
        .option('-s, --space <name>', 'use the space name')
        .action(function (name, options) {

            var subscription = options.subscription || waz.category('account').defaultSubscriptionId();

            channel
                .header('x-ms-version', '2011-02-25')
                .path(subscription)
                .path('services/webspaces')
                .path(options.space || '.default')
                .path('sites/')
                .header('Content-Type', 'application/xml')
                .POST(function(req) {
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
                    function(err, thing) {
                        console.log(thing);
                    });
        });

    site.command('delete <name>')
        .description('Delete a web site.')
        .option('-i, --subscription <id>', 'use the subscription id')
        .option('-s, --space <name>', 'use the space name')
        .action(function (name, options) {

            var subscription = options.subscription || waz.category('account').defaultSubscriptionId();

            channel
                .header('x-ms-version', '2011-02-25')
                .path(subscription)
                .path('services/webspaces')
                .path(options.space || '.default')
                .path('sites/')
                .path(name)
                .header('Content-Type', 'application/xml')
                .DELETE(function (err, thing) {
                    console.log(thing);
                });
        });

    var space = waz.category('space')
        .description('Commands to manage your Azure web spaces.');

    space.command('show [name]')
        .description('Show info about a web space.')
        .option('-i, --subscription <id>', 'use the subscription id')
        .action(function (name, options) {
            
            var subscription = options.subscription || waz.category('account').defaultSubscriptionId();

            channel
                .header('x-ms-version', '2011-02-25')
                .path(subscription)
                .path('services/webspaces')
                .path(name || '')
                .GET(function(err, thing) {
                    console.log(thing);
                });
        });

    space.command('delete <name>')
        .description('Kill a web space.')
        .option('-i, --subscription <id>', 'use the subscription id')
        .action(function (name, options) {

            var subscription = options.subscription || waz.category('account').defaultSubscriptionId();

            channel
                .header('x-ms-version', '2011-02-25')
                .path(subscription)
                .path('services/webspaces')
                .path(name)
                .DELETE(function(err, thing) {
                    console.log(thing);
                });
        });





    space.command('create <name>')
        .description('Create a web space.')
        .option('-i, --subscription <id>', 'use the subscription id')
        .option('-p, --plan <plan>', 'use the plan')
        .action(function (name, options) {
            
            var subscription = options.subscription || waz.category('account').defaultSubscriptionId();

            channel
                .header('x-ms-version', '2011-02-25')
                .path(subscription)
                .path('services/webspaces/')
                .header('Content-Type', 'application/xml')
                .POST(function(req) {
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
                    function(err, thing) {
                        console.log(thing);
                    });
        });
};
