
var fs = require('fs');
var pfx2pem = require('../../util/certificates/pkcs').pfx2pem;
var Channel = require('../channel');

exports.init = function (waz) {

    var log = waz.output;

    function getChannel() {
        var pem = waz.category('account').managementCertificate();

        var channel = new Channel({
            host: 'umapi-new.rdfetest.dnsdemo4.com',
            port: 8443,
            key: pem,
            cert: pem
        }).header('x-ms-version', '2011-02-25');

        return channel;
    }

    var site = waz.category('site')
        .description('Commands to manage your Azure web sites.');

    site.command('list')
        .description('List your Azure web sites.')
        .option('-s, --subscription <id>', 'use the subscription id')
        .action(function (options) {


            var subscription = options.subscription || waz.category('account').defaultSubscriptionId();

            log.info('Listing your Azure web sites');
            log.verbose('Subscription ', subscription);

            getChannel()
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
        .action(function (name, options) {

            var parameters = {
                subscription: options.subscription || waz.category('account').defaultSubscriptionId(),
                site: {
                    name: name
                }
            };

            log.info('Showing details for site');
            log.verbose('Parameters', parameters);

            site.doSiteGet(parameters, function (siteData) {
                site.doSiteConfigGet(parameters, function (configData) {
                    site.doRepositoryGet(parameters, function (repositoryData) {
                        logEachData('Site', siteData);
                        logEachData('Config', configData);
                        log.data('Repository', clean(repositoryData));
                    });
                });
            });
        });

    site.command('create <name>')
        .description('Create a new Azure web site and local directory.')
        .option('-s, --subscription <id>', 'use the subscription id')
        .option('--location <location>', 'the geographic region to create the website')
        .option('--hostname <hostname>', 'custom host name to use')
        .action(function (name, options) {

            var parameters = {
                subscription: options.subscription || waz.category('account').defaultSubscriptionId(),
                site: {
                    name: name,
                    location: options.location,
                    hostname: options.hostname
                }
            };

            site.doSitesPost(parameters, function () {
                site.doRepositoryPost(parameters, function () {
                    site.doRepositoryGet(parameters, function (repo) {
                        site.doRepositoryGet(parameters, function (account) {
                            log.help('To start adding content to the website, type in the following:\n      git init\n    git add .');
                            log.help('  git init');
                            log.help('  git add .');
                            log.help('  git commit -m "initial commit"');
                            log.help('  git remote add azure http://{UserName}@repository-{Name}.antintdublin.dnsremap.com/git');
                            log.help('  git push azure master');
                        });
                    });
                });
            });
        });

    site.command('delete <name>')
        .description('Delete a web site.')
        .option('-s, --subscription <id>', 'use the subscription id')
        .action(function (name, options) {

            var subscription = options.subscription || waz.category('account').defaultSubscriptionId();

            getChannel()
                .path(subscription)
                .path('services/webspaces/ctpwebspace/sites/')
                .path(name)
                .DELETE(function (err, thing) {
                    console.log(thing);
                });
        });


    site.command('start <name>')
        .description('Start a web site.')
        .option('-s, --subscription <id>', 'use the subscription id')
        .action(function (name, options) {

            var subscription = options.subscription || waz.category('account').defaultSubscriptionId();

            getChannel()
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

            getChannel()
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
    // fundamental operations

    site.doSitesPost = function (options, done, failed) {
        log.info('Creating a new web site');
        log.verbose('Subscription', options.subscription);
        log.verbose('Parameters', options.site);

        getChannel()
            .path(options.subscription)
            .path('services/webspaces/ctpwebspace/sites/')
            .header('Content-Type', 'application/xml')
            .POST(
                writers.Site.xml(options.site),
                function (err, result) {
                    if (err) {
                        log.error('Failed to create site');
                        log.error(err.Message);
                        log.verbose('Error', clean(err));
                        if (failed) failed(err, result);
                    } else {
                        log.info('Created website at ', clean(result).HostNames);
                        log.verbose('Site', clean(result));
                        if (done) done(result);
                    }
                });
    };

    site.doRepositoryPost = function (options, done, failed) {
        log.info('Initializing repository');
        log.verbose('Subscription', options.subscription);
        log.verbose('Site', options.site.name);

        getChannel()
            .path(options.subscription)
            .path('services/webspaces/ctpwebspace/sites/')
            .path(options.site.name)
            .path('repository')
            .POST(
                "",
                function (err, result) {
                    if (err) {
                        log.error('Failed to initialize repository');
                        log.error(err.Message);
                        log.verbose('Error', clean(err));
                        if (failed) failed(err, result);
                    } else {
                        log.info('Repository initialized');
                        if (done) done(result);
                    }
                });
    };

    site.doSiteGet = function (options, done, failed) {
        getChannel()
            .path(options.subscription)
            .path('services/webspaces/ctpwebspace/sites')
            .path(options.site.name)
            .GET(
                function (err, result) {
                    if (err) {
                        log.error('Failed to get site info');
                        log.error(err.Message);
                        log.verbose('Error', clean(err));
                        if (failed) failed(err, result);
                    } else {
                        log.verbose('Site', clean(result));
                        if (done) done(result);
                    }
                });
    };

    site.doSiteConfigGet = function (options, done, failed) {
        getChannel()
            .path(options.subscription)
            .path('services/webspaces/ctpwebspace/sites')
            .path(options.site.name)
            .path('config')
            .GET(
                function (err, result) {
                    if (err) {
                        log.error('Failed to get site config info');
                        log.error(err.Message);
                        log.verbose('Error', clean(err));
                        if (failed) failed(err, result);
                    } else {
                        log.verbose('SiteConfig', clean(result));
                        if (done) done(result);
                    }
                });
    };

    site.doRepositoryGet = function (options, done, failed) {
        getChannel()
            .path(options.subscription)
            .path('services/webspaces/ctpwebspace/sites')
            .path(options.site.name)
            .path('repository')
            .GET(
                function (err, result) {
                    if (err) {
                        log.error('Failed to get repository info');
                        log.error(err.Message);
                        log.verbose('Error', clean(err));
                        if (failed) failed(err, result);
                    } else {
                        log.verbose('Repository', clean(result));
                        if (done) done(result);
                    }
                });
    };


    /////////////////
    // helper methods

    var writers = {
        Site: {
            xml: function (site) {
                return function (req) {
                    req.write('<Site xmlns="http://schemas.microsoft.com/windowsazure">');
                    req.write('<HostNames>');
                    req.write('<string xmlns="http://schemas.microsoft.com/2003/10/Serialization/Arrays">');
                    req.write(site.name + '.antint0.antares-test.windows-int.net');
                    req.write('</string>');
                    //                    req.write('<string xmlns="http://schemas.microsoft.com/2003/10/Serialization/Arrays">');
                    //                    req.write('www.' + site.name + '.antint0.antares-test.windows-int.net');
                    //                    req.write('</string>');
                    if (site.hostname) {
                        req.write('<string xmlns="http://schemas.microsoft.com/2003/10/Serialization/Arrays">');
                        req.write(site.hostname);
                        req.write('</string>');
                    }
                    req.write('</HostNames>');
                    req.write('<Name>');
                    req.write(site.name);
                    req.write('</Name>');
                    req.write('</Site>');

                    req.end();
                };
            }
        }
    };

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
                if (prop === '#' || prop === 'string' || prop.substring(prop.length - 7) === ':string') {
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

    function logEachData(title, data) {
        var cleaned = clean(data);
        for (var property in cleaned) {
            log.data(title + ' ' + property, cleaned[property]);
        }
    }
};
