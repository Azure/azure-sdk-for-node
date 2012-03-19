
if (!require('streamline/module')(module)) return;

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
    var regionPrompts = regions.map(function (region) { return region.prompt; });

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
            execute('site list', function(_) {
                var parameters = {
                    subscription: cli.category('account').lookupSubscriptionId(options.subscription)
                };

                var spaces = site.doSpacesGet(parameters, _);
                var sites = site.doSitesGet(parameters, _);

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

            execute('site show', function(_) {
                var parameters = {
                    subscription: cli.category('account').lookupSubscriptionId(options.subscription),
                    site: {
                        name: name
                    }
                };

                log.info('Showing details for site');
                log.verbose('Parameters', parameters);

                var siteData = site.doSiteGet(parameters, _);
                var configData = site.doSiteConfigGet(parameters, _);
                var repositoryData = site.doRepositoryGet(parameters, _);

                logEachData('Site', siteData);
                logEachData('Config', configData);
                log.data('Repository', clean(repositoryData));
            });
        });

    function choose(data, callback) {
        cli.choose(data, function(x) {callback(null,x);});
    }

    function execute(command, impl, _) {
        log.info('Executing command ' + command.bold);
        try {
            impl(_);
            cli.exit('info', command.bold + ' command ' + 'OK'.green.bold, 0);
        }
        catch(err) {
            logError(err);
            cli.exit('error', command.bold + ' command ' + 'failed'.red.bold, -1);
        };
    }

    site.command('create <name>')
        .description('Create a new web site and local directory.')
        .option('-s, --subscription <id>', 'use the subscription id')
        .option('--location <location>', 'the geographic region to create the website')
        .option('--hostname <hostname>', 'custom host name to use')
        .action(function (name, options) {
            execute('site create', function(_) {

                var context = {
                    subscription: cli.category('account').lookupSubscriptionId(options.subscription),
                    site: {
                        name: name,
                        webspace: options.location,
                        hostname: options.hostname
                    }
                };

                if (context.site.webspace === undefined) {
                    log.help('Choose a region');
                    context.site.webspace = regions[choose(regionPrompts, _)].webspace;
                }

                site.doSitesPost(context, _);
                site.doRepositoryPost(context, _);
                var repo = site.doRepositoryGet(context, _);

                log.help('To start adding content to the website, type in the following:');
                log.help('  git init');
                log.help('  git add .');
                log.help('  git commit -m "initial commit"');
                log.help('  git remote add azure ' + repo + context.site.name + '.git');
                log.help('  git push azure master');                            
             });
        });

    function lookupSiteWebSpace(context, _) {
        log.verbose('Attempting to locate site ', context.site.name);
        var sites = site.doSitesGet(context, _);
        for(var index in sites) {
            if (sites[index].Name === context.site.name) {
                log.verbose('Site located at ', sites[index].WebSpace);
                context.site.webspace = sites[index].WebSpace;
            }
        }
        if (context.site.webspace === undefined) {
            throw new Error('Unable to locate site named ' + context.site.name);
        }
    }

    site.command('delete <name>')
        .description('Delete a web site.')
        .option('-s, --subscription <id>', 'use the subscription id')
        .action(function (name, options) {
            execute('site delete', function(_) {
                var context = {
                    subscription: cli.category('account').lookupSubscriptionId(options.subscription),
                    site: {
                        name: name
                    }
                };

                lookupSiteWebSpace(context, _);

                var result = getChannel()
                    .path(context.subscription)
                    .path('services/webspaces')
                    .path(context.site.webspace)
                    .path('sites')
                    .path(context.site.name)
                    .DELETE(_);
            });
        });


    site.command('start <name>')
        .description('Start a web site.')
        .option('-s, --subscription <id>', 'use the subscription id')
        .action(function (name, options) {
            execute('site start', function(_) {
                
                var context = {
                    subscription: cli.category('account').lookupSubscriptionId(options.subscription),
                    site: {
                        name: name
                    }
                };

                lookupSiteWebSpace(context, _);

                var result = getChannel()
                    .path(context.subscription)
                    .path('services/webspaces')
                    .path(context.site.webspace)
                    .path('sites')
                    .path(context.site.name)
                    .header('Content-Type', 'application/xml')
                    .POST(function (req) {
                        req.write('<Site xmlns="http://schemas.microsoft.com/windowsazure">');
                        req.write('<State>');
                        req.write('Running');
                        req.write('</State>');
                        req.write('</Site>');

                        req.end();
                    }, _);
            });
        });

    site.command('stop <name>')
        .description('Stop a web site.')
        .option('-s, --subscription <id>', 'use the subscription id')
        .action(function (name, options) {
        execute('site start', function(_) {
                
                var context = {
                    subscription: cli.category('account').lookupSubscriptionId(options.subscription),
                    site: {
                        name: name
                    }
                };

                lookupSiteWebSpace(context, _);

                var result = getChannel()
                    .path(context.subscription)
                    .path('services/webspaces')
                    .path(context.site.webspace)
                    .path('sites')
                    .path(context.site.name)
                    .header('Content-Type', 'application/xml')
                    .POST(function (req) {
                        req.write('<Site xmlns="http://schemas.microsoft.com/windowsazure">');
                        req.write('<State>');
                        req.write('Stopped');
                        req.write('</State>');
                        req.write('</Site>');

                        req.end();
                    }, _);
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

    site.doSpacesGet = function (options, _) {
        log.verbose('Subscription', options.subscription);

        var result = getChannel()
            .path(options.subscription)
            .path('services/webspaces/')
            .GET(_);

        log.json('silly', result);
        return toArray(result.WebSpace);
    };

    site.doSitesGet = function (options, _) {
        log.verbose('Subscription', options.subscription);

        var spaces = site.doSpacesGet(options, _);

        var channel = getChannel()
            .path(options.subscription)
            .path('services/webspaces');

        var result = async.map(
            spaces,
            function (webspace, _) {
                return channel
                    .path(webspace.Name)
                    .path('sites/')
                    .GET(_);
            },
            _);

        var sites = [];
        result.forEach(function (item) {
            sites = sites.concat(toArray(item.Site));
        });
        result = sites;

        log.json('verbose', sites);
        return sites;
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
                    callback(err, clean(result));
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
        if (arguments.length == 1) {
            err = message;
            message = undefined;
        } else {
            log.error(message);
        }

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
