
var fs = require('fs');
var pfx2pem = require('../../util/certificates/pkcs').pfx2pem;
var Channel = require('../channel');
var async = require('async');

exports.init = function (cli) {

    var log = cli.output;

    var regions = [
        {
            prompt: 'South Central US',
            webspace: 'southcentraluswebspace',
            location: 'SouthCentralUS1',
            plan: 'VirtualDedicatedPlan'
        },
        {
            prompt: 'North Europe',
            webspace: 'northeuropewebspace',
            location: 'NorthEurope1',
            plan: 'VirtualDedicatedPlan'
        },
    ];

    function getChannel() {
        var pem = cli.category('account').managementCertificate();

        var channel = new Channel({
            host: 'umapi-tc2.rdfetest.dnsdemo4.com',
            port: 8443,
            key: pem,
            cert: pem
        }).header('x-ms-version', '2011-02-25');

        return channel;
    }


    var site = cli.category('site')
        .description('Commands to manage your web sites.');


    site.command('list')
        .description('List your web sites.')
        .option('-s, --subscription <id>', 'use the subscription id')
        .action(function (options) {

            log.info('Listing your web sites');

            var parameters = {
                subscription: cli.category('account').lookupSubscriptionId(options.subscription)
            };

            site.doSitesGet(
                parameters,
                function (sites) {
                    log.table(sites, function (row, site) {
                        row.cell('Name', site.Name);
                        row.cell('State', site.State);
                        row.cell('Host names', clean(site).HostNames);
                    });
                });

        });


    site.command('show <name>')
        .description('Show details for a web sites.')
        .option('-s, --subscription <id>', 'use the subscription id')
        .action(function (name, options) {

            var parameters = {
                subscription: cli.category('account').lookupSubscriptionId(options.subscription),
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
        .description('Create a new web site and local directory.')
        .option('-s, --subscription <id>', 'use the subscription id')
        .option('--location <location>', 'the geographic region to create the website')
        .option('--hostname <hostname>', 'custom host name to use')
        .action(function (name, options) {

            log.help('Choose a location');
            cli.choose(regions.map(function (x) { return x.prompt; }), function (regionIndex) {

                var parameters = {
                    subscription: cli.category('account').lookupSubscriptionId(options.subscription),
                    site: {
                        name: name,
                        webspace: regions[regionIndex].webspace,
                        hostname: options.hostname
                    }
                };

                site.doSitesPost(parameters, function (err) {
                    if (err) {
                        return cli.exit('error', 'Command failed', -1);
                    }
                    site.doRepositoryPost(parameters, function (err) {
                        if (err) {
                            return cli.exit('error', 'Command failed', -1);
                        }
                        site.doRepositoryGet(parameters, function (err, repo) {
                            if (err) {
                                return cli.exit('error', 'Command failed', -1);
                            }
                            log.help('To start adding content to the website, type in the following:');
                            log.help('  git init');
                            log.help('  git add .');
                            log.help('  git commit -m "initial commit"');
                            log.help('  git remote add azure ' + repo + parameters.site.name + '.git');
                            log.help('  git push azure master');

                            cli.exit('info', 'Success', 0);
                        });
                    });
                });
            });

        });

    site.command('delete <name>')
        .description('Delete a web site.')
        .option('-s, --subscription <id>', 'use the subscription id')
        .action(function (name, options) {

            var subscription = cli.category('account').lookupSubscriptionId(options.subscription);


            getChannel()
                .path(subscription)
                .path('services/webspaces/northeuropewebspace/sites/')
                .path(name)
                .DELETE(function (err, thing) {
                    console.log(thing);
                });
        });


    site.command('start <name>')
        .description('Start a web site.')
        .option('-s, --subscription <id>', 'use the subscription id')
        .action(function (name, options) {

            var subscription = cli.category('account').lookupSubscriptionId(options.subscription);

            getChannel()
                .path(subscription)
                .path('services/webspaces/northeuropewebspace/sites/')
                .path(name)
                .header('Content-Type', 'application/xml')
                .POST(function (req) {
                    req.write('<Site xmlns="http://schemas.microsoft.com/windowsazure">');
                    req.write('<State>');
                    req.write('Running');
                    req.write('</State>');
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

            var subscription = cli.category('account').lookupSubscriptionId(options.subscription);


            getChannel()
                .path(subscription)
                .path('services/webspaces/northeuropewebspace/sites/')
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

    site.doSitesPost = function (options, callback) {
        log.info('Creating a new web site');
        log.verbose('Subscription', options.subscription);
        log.verbose('Webspace', options.site.webspace);
        log.verbose('Site', options.site.name);

        getChannel()
            .path(options.subscription)
            .path('services/webspaces')
            .path(options.site.webspace)
            .path('sites/')
            .header('Content-Type', 'application/xml')
            .POST(
                writers.Site.xml(options.site),
                function (err, result) {
                    if (err) {
                        logError('Failed to create site', err);
                    } else {
                        log.info('Created website at ', clean(result).HostNames);
                        log.verbose('Site', clean(result));
                    }
                    callback(err, result);
                });
    };

    site.doRepositoryPost = function (options, callback) {
        log.info('Initializing repository');
        log.verbose('Subscription', options.subscription);
        log.verbose('Webspace', options.site.webspace);
        log.verbose('Site', options.site.name);

        getChannel()
            .path(options.subscription)
            .path('services/webspaces')
            .path(options.site.webspace)
            .path('sites')
            .path(options.site.name)
            .path('repository')
            .POST(
                "",
                function (err, result) {
                    if (err) {
                        logError('Failed to initialize repository', err);
                    } else {
                        log.info('Repository initialized');
                    }
                    callback(err, result);
                });
    };

    site.doSitesGet = function (options, callback) {
        log.verbose('Subscription', options.subscription);

        var channel = getChannel()
            .path(options.subscription)
            .path('services/webspaces');

        async.map(
            regions,
            function (region, result) {
                channel
                    .path(region.webspace)
                    .path('sites/')
                    .GET(result);
            },
            function (err, result) {
                if (err) {
                    logError('Failed to get site info', err);
                } else {
                    var sites = [];
                    result.forEach(function (item) {
                        sites = sites.concat(toArray(item.Site));
                    });
                    result = sites;

                    log.json('verbose', result);
                }
                callback(err, result);
            });
    };

    site.doSiteGet = function (options, callback) {
        getChannel()
            .path(options.subscription)
            .path('services/webspaces')
            .path(options.site.webspace)
            .path('sites')
            .path(options.site.name)
            .GET(
                function (err, result) {
                    if (err) {
                        logError('Failed to get site info', err);
                    } else {
                        log.verbose('Site', clean(result));
                    }
                    callback(err, result);
                });
    };

    site.doSiteConfigGet = function (options, callback) {
        getChannel()
            .path(options.subscription)
            .path('services/webspaces')
            .path(options.site.webspace)
            .path('sites')
            .path(options.site.name)
            .path('config')
            .GET(
                function (err, result) {
                    if (err) {
                        logError('Failed to get site config info', err);
                    } else {
                        log.verbose('SiteConfig', clean(result));
                    }
                    callback(err, result);
                });
    };

    site.doRepositoryGet = function (options, callback) {
        getChannel()
            .path(options.subscription)
            .path('services/webspaces')
            .path(options.site.webspace)
            .path('sites')
            .path(options.site.name)
            .path('repository')
            .GET(
                function (err, result) {
                    if (err) {
                        logError('Failed to get repository info', err);
                    } else {
                        log.verbose('Repository', clean(result));
                    }
                    callback(err, result);
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
                    req.write(site.name + '.antdir0.antares-test.windows-int.net');
                    req.write('</string>');

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

    function logError(message, err) {
        log.error(message);
        if (err) {
            if (err.message) {
                log.error(err.message);
                log.verbose('stack', err.stack);
                log.json('silly', err);
            }
            else if (err.Message) {
                log.error(err.Message);
                log.json('verbose', clean(err));
            }
            else {
                log.error(err);
            }
        }
    }

    function isArray(testObject) {
        return testObject && !(testObject.propertyIsEnumerable('length')) && typeof testObject === 'object' && typeof testObject.length === 'number';
    }

    function toArray(testObject) {
        return isArray(testObject) ? testObject : typeof testObject === 'undefined' ? [] : [testObject];
    }

};
