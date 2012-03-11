
var fs = require('fs');
var pfx2pem = require('../../util/certificates/pkcs').pfx2pem;
var Channel = require('../channel');

exports.init = function (waz) {

    var log = waz.output;

    var pem = pfx2pem(fs.readFileSync('client-x509-rsa.pfx'));

    var channel = new Channel({
        host: 'umapi-new.rdfetest.dnsdemo4.com',
        port: 8443,
        key: pem,
        cert: pem
    }).header('x-ms-version', '2011-02-25');


    var site = waz.category('site')
        .description('Commands to manage your Azure web sites.');

    site.command('list')
        .description('List your Azure web sites.')
        .option('-s, --subscription <id>', 'use the subscription id')
        .option('-v, --verbose', 'use verbose output')
        .action(function (options) {

            if (options.verbose) {
                log.setLevel('verbose');
            }

            var subscription = options.subscription || waz.category('account').defaultSubscriptionId();

            log.info('Listing your Azure web sites');
            log.verbose('Subscription ', subscription);

            channel
                .path(subscription)
                .path('services/webspaces/ctpwebspace/sites/')
                .GET(function (err, data) {
                    if (err) {
                        log.error(err.Message);
                        log.verbose('Error', clean(err));
                    }
                    else {
                        for (var index in data.Site) {
                            log.data('Site', {
                                Name: data.Site[index].Name,
                                State: data.Site[index].State,
                                UsageState: data.Site[index].UsageState
                            });
                            log.verbose('Site', clean(data.Site[index]));
                        }
                    }
                });
        });

    site.command('show <name>')
        .description('List your Azure web sites.')
        .option('-s, --subscription <id>', 'use the subscription id')
        .option('-v, --verbose', 'use verbose output')
        .action(function (name, options) {

            if (options.verbose) {
                log.remove(log.transports.Console);
                log.add(log.transports.Console, { level: 'verbose' });
                log.cli();
            }

            log.info('Listing your Azure web sites');

            var subscription = options.subscription || waz.category('account').defaultSubscriptionId();

            channel
                .path(subscription)
                .path('services/webspaces/ctpwebspace/sites')
                .path(name)
                .GET(function (err, data) {
                    if (err) {
                        log.error(err.Message);
                        log.verbose('Error', clean(err));
                    }
                    else {
                        log.data('Site', {
                            Name: data.Name,
                            State: data.State,
                            UsageState: data.UsageState
                        });
                        log.verbose('Response', clean(data));
                    }
                });
        });

    site.command('create <name>')
        .description('Initialize your Azure web site.')
        .option('-s, --subscription <id>', 'use the subscription id')
        .action(function (name, options) {

            var subscription = options.subscription || waz.category('account').defaultSubscriptionId();

            channel
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
        .option('-s, --subscription <id>', 'use the subscription id')
        .action(function (name, options) {

            var subscription = options.subscription || waz.category('account').defaultSubscriptionId();

            channel
                .path(subscription)
                .path('services/webspaces/ctpwebspace/sites/')
                .path(name)
                .DELETE(function (err, thing) {
                    console.log(thing);
                });
        });


    site.command('repo <name>')
        .description('Testing site repo.')
        .option('-s, --subscription <id>', 'use the subscription id')
        .action(function (name, options) {

            var subscription = options.subscription || waz.category('account').defaultSubscriptionId();

            channel
                .path(subscription)
                .path('services/webspaces/ctpwebspace/sites/')
                .path(name)
                .path('repository')
                .GET(function (err, thing) {
                    console.log(thing);
                });
        });

    site.command('repo-kill <name>')
        .description('Testing site repo.')
        .option('-s, --subscription <id>', 'use the subscription id')
        .action(function (name, options) {

            var subscription = options.subscription || waz.category('account').defaultSubscriptionId();

            channel
                .path(subscription)
                .path('services/webspaces/ctpwebspace/sites/')
                .path(name)
                .path('repository')
                .DELETE(function (err, thing) {
                    console.log(thing);
                });
        });

    site.command('repo-init <name>')
        .description('Testing site repo.')
        .option('-s, --subscription <id>', 'use the subscription id')
        .action(function (name, options) {

            var subscription = options.subscription || waz.category('account').defaultSubscriptionId();

            channel
                .path(subscription)
                .path('services/webspaces/ctpwebspace/sites/')
                .path(name)
                .path('repository')
                .POST(function (req) {
                    req.end();
                }, function (err, thing) {
                    console.log(thing);
                });
        });

    site.command('start <name>')
        .description('Start a web site.')
        .option('-s, --subscription <id>', 'use the subscription id')
        .action(function (name, options) {

            var subscription = options.subscription || waz.category('account').defaultSubscriptionId();

            channel
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
        .description('Stop a web site.')
        .option('-s, --subscription <id>', 'use the subscription id')
        .action(function (name, options) {

            var subscription = options.subscription || waz.category('account').defaultSubscriptionId();

            channel
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

    /////////////////
    // helper methods

    function clean(source) {
        if (typeof (source) === 'string') {
            return source;
        }

        var target = {};
        var hasString = false;
        var hasNonString = false;
        var stringValue = '';

        for (var prop in source) {
            if (prop == '@') {
                continue;
            } else {
                if (prop === 'string' || prop.substring(prop.length - 7) === ':string') {
                    hasString = true;
                    stringValue = source[prop];
                } else {
                    hasNonString = true;
                }
                target[prop] = clean(source[prop]);
            }
        }
        if (hasString && !hasNonString) {
            return stringValue;
        }
        return target;
    }

};
