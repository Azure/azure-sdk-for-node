/**
* Copyright 2011 Microsoft Corporation
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*   http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/


//if (!require('streamline/module')(module)) return;

var common = require('../common');
var fs = require('fs');
var path = require('path');
var url = require('url');
var crypto = require('crypto');
var pfx2pem = require('../../util/certificates/pkcs').pfx2pem;
var Channel = require('../channel');
var async = require('async');
var child_process = require('child_process');


exports.init = function (cli) {

    var log = cli.output;

    function getChannel() {
        var pem = cli.category('account').managementCertificate();

        var channel = new Channel({
            host: 'umapi-preview.core.windows-int.net',
            port: 8443,
            key: pem.key,
            cert: pem.cert
        }).header('x-ms-version', '2011-02-25');

        var proxyString =
            process.env.HTTPS_PROXY ||
            process.env.https_proxy ||
            process.env.ALL_PROXY ||
            process.env.all_proxy;

        if (proxyString !== undefined) {
            var proxyUrl = url.parse(proxyString);
            if (proxyUrl.protocol !== 'http:' &&
                proxyUrl.protocol !== 'https:') {
                // fall-back parsing support XXX_PROXY=host:port environment variable values
                proxyUrl = url.parse('http://' + proxyString);
            }

            channel = channel.add({ proxy: proxyUrl });
        }

        return channel;
    }


    var site = cli.category('site')
        .description('Commands to manage your web sites');


    site.command('list')
        .description('List your web sites')
        .option('-s, --subscription <id>', 'use the subscription id')
        .execute(function (options, _) {
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

    function choose(data, callback) {
        cli.choose(data, function (x) { callback(undefined, x); });
    }
    function prompt(label, callback) {
        cli.prompt(label, function (x) { callback(undefined, x); });
    }
    function confirm(label, callback) {
        cli.confirm(label, function (x) { callback(undefined, x); });
    }


    site.command('create [name]')
        .description('Create a new web site and local directory')
        .option('-s, --subscription <id>', 'use the subscription id')
        .option('--location <location>', 'the geographic region to create the website')
        .option('--hostname <hostname>', 'custom host name to use')
        .option('--git', 'configure git on web site and local folder')
        .execute(function (nameArg, options, _) {
            var context = {
                subscription: cli.category('account').lookupSubscriptionId(options.subscription),
                site: {
                    name: nameArg,
                    webspace: options.location,
                    hostname: options.hostname
                },
                flags: {
                }
            };

            promptForSiteName(_);
            determineIfSiteExists(_);
            promptForLocation(_);
            determineIfCurrentDirectoryIsGitWorkingTree(_);
            initGitOnCurrentDirectory(_);
            copyWebConfigWhenServerJsPresent(_);
            updateLocalConfigWithSiteName(_);
            createSiteAndInitializeRemoteRepo(_);
            addRemoteToLocalGitRepo(_);
            
            function promptForSiteName(_) {
                log.silly('promptForSiteName');
                if (context.site.name === undefined) {
                    log.help('Need a site name');
                    context.site.name = prompt('Name: ', _);
                }
            }

            function determineIfSiteExists(_) {
                log.silly('determineIfSiteExists');
                var sites = site.doSitesGet(context, _);
                var hits = sites.filter(function(item) {
                   return item.Name === context.site.name; 
                });
                if (hits.length === 1) {
                    log.info('Updating existing site');
                    context.flags.siteExists = true;
                    if (context.site.webspace === undefined) {
                        context.site.webspace = hits[0].WebSpace;
                        log.verbose('Existing site location is ', context.site.webspace)
                    } else if (context.site.webspace !== hits[0].WebSpace) {
                        throw new Error('Expected location ' + context.site.webspace + ' but was ' + hits[0].WebSpace);
                    }
                }
            }
            
            function promptForLocation(_) {
                log.silly('promptForLocation');
                var spaces = site.doSpacesGet(context, _);

                if (spaces.length === 0) {
                    log.help('You must create your first web site using the Windows Azure portal.');
                    log.help('Please follow these steps in the portal:');
                    log.help('1. At the bottom of the page, click on New > Web Site > Quick Create');
                    log.help('2. Type "{whatever they supplied as the name}" in the URL field');
                    log.help('3. Click on "Create Web Site"');
                    log.help('4. Once the site has been created, click on the site name');
                    log.help('5. Click on "Set up Git publishing" and create a publishing username and password. Use those credentials for all new websites you create.');
                    if (confirm('Launch browser to portal now? (y/n) ', _)) {
                        log.help('Launching portal.');
                        var href = 'https://windows.azure-test.net/';
                        common.launchBrowser(href);
                    }
                    throw new Error('First site must be created on portal');
                } else if (spaces.length == 1) {
                    context.site.webspace = spaces[0].Name;
                    log.info('Using location', context.site.webspace);
                } else {
                    log.help('Choose a region');
                    context.site.webspace = spaces[choose(spaces.map(function (space) {
                        return space.GeoRegion;
                    }), _)].Name;
                }                
            }
            
            function determineIfCurrentDirectoryIsGitWorkingTree(_) {
                log.silly('determineIfCurrentDirectoryIsGitWorkingTree');

                try {
                    var isInsideWorkTree = exec('git rev-parse --is-inside-work-tree', _);
                    var lines = isInsideWorkTree.stdout + isInsideWorkTree.stderr;
                    context.flags.isGitWorkingTree = lines.split('\n').some(function (line) {
                        return line === 'true';
                    });
                } catch(err) {
                    context.flags.isGitWorkingTree = false;
                }
            }
            
            function initGitOnCurrentDirectory(_) {
                log.silly('initGitOnCurrentDirectoryIfNeeded');
                if (context.flags.isGitWorkingTree) {
                    return;
                }
                
                if (!options.git) {
                    return;
                }
                
                log.info('Executing `git init`');
                exec('git init', _);
                
                if (!path.existsSync('.gitignore')) {
                    log.info('Creating default .gitignore file');
                    fs.writeFile('.gitignore', 'node_modules', _);
                }
                
                context.flags.isGitWorkingTree = true;
            }
            
            function copyWebConfigWhenServerJsPresent(_) {
                log.silly('copyWebConfigWhenServerJsPresent');
                if (!path.existsSync('web.config') && path.existsSync('server.js')) {
                    log.info('Creating default web.config file');
                    var sourcePath = path.join(__dirname, '../templates/node/web.config');
                    fs.writeFile('web.config', fs.readFile(sourcePath, _), _);
                }
            }
            
            function updateLocalConfigWithSiteName(_) {
                log.silly('updateLocalConfigWithSiteName');
            }
            
            function createSiteAndInitializeRemoteRepo(_) {
                log.silly('createSiteAndInitializeRemoteRepo');
                if (!context.flags.siteExists) {
                    site.doSitesPost(context, _);
                }
                try {
                    context.repo = site.doRepositoryGet(context, _);
                }
                catch(err) {
                    site.doRepositoryPost(context, _);
                    context.repo = site.doRepositoryGet(context, _);                
                }
                log.silly('context.repo', context.repo);
            }

            function addRemoteToLocalGitRepo(_) {
                log.silly('addRemoteToLocalGitRepo');
                if (!context.flags.isGitWorkingTree) {
                    return;
                }
                var publishingUsers = site.doPublishingUsersGet(context, _);
                var publishingUser = toArray(publishingUsers)[0];
                if (publishingUser === undefined || publishingUser.length > 64) {
                    log.help('You will also need to provide publishing username and credentials on the portal.');
                    log.help('For now, please provide a username for git remote');
                    publishingUser = prompt('Publishing username ', _);
                }

                var repoUrl = url.parse(context.repo + context.site.name + '.git');
                repoUrl.protocol = 'http:';
                repoUrl.auth = publishingUser;


                log.verbose('Detecting git and local git folder');
                var remotes = exec('git remote', _);
                var azureExists = (remotes.stdout + remotes.stderr).split('\n').some(function (item) {
                    return item === 'azure';
                });

                if (azureExists) {
                    log.verbose('Removing existing azure remote alias');
                    exec('git remote rm azure', _);
                }

                log.info('Executing `git remote add azure ' + url.format(repoUrl) + '`');
                exec('git remote add azure ' + url.format(repoUrl), _)
            }
        });

    site.command('portal [name]')
        .description('Opens the portal in a browser to manage your web sites')
        .execute(function (name, options, _) {

            var href = 'https://windows.azure-test.net/';
            if (name) {
                href = href + '#Workspaces/WebsiteExtension/Website/' + name + '/dashboard';
            }

            common.launchBrowser(href);
        });

    site.command('browse [name]')
        .description('Open your web site in a browser.')
        .option('-s, --subscription <id>', 'use the subscription id')
        .execute(function (name, options, _) {

            var context = {
                subscription: cli.category('account').lookupSubscriptionId(options.subscription),
                site: {
                    name: name
                }
            };
            lookupSiteName(context, _);
            lookupSiteWebSpace(context, _);
            var siteData = clean(site.doSiteGet(context, _));

            var href = 'http://' + toArray(siteData.HostNames)[0];

            common.launchBrowser(href);
        });

    site.command('show [name]')
        .description('Show details for a web sites')
        .option('-s, --subscription <id>', 'use the subscription id')
        .execute(function (name, options, _) {
            var context = {
                subscription: cli.category('account').lookupSubscriptionId(options.subscription),
                site: {
                    name: name
                }
            };

            lookupSiteName(context, _);
            lookupSiteWebSpace(context, _);

            log.info('Showing details for site');
            log.verbose('Parameters', context);

            var siteData = site.doSiteGet(context, _);
            var configData = site.doSiteConfigGet(context, _);
            var repositoryData = site.doRepositoryGet(context, _);

            logEachData('Site', siteData);
            logEachData('Config', configData);
            log.data('Repository', clean(repositoryData));
        });

    function lookupSiteName(context, _) {
        if (context.site.name !== undefined) {
            // no need to read further
            return;
        }

        var cfg = site.readConfig();
        if (cfg !== undefined) {
            // using the name from current location
            context.site.name = cfg.name;
            return;
        }

        context.site.name = prompt('Web site name: ', _);
    }
    site.lookupSiteName = lookupSiteName;

    function lookupSiteWebSpace(context, _) {
        log.verbose('Attempting to locate site ', context.site.name);
        var sites = site.doSitesGet(context, _);
        for (var index in sites) {
            if (sites[index].Name === context.site.name) {
                log.verbose('Site located at ', sites[index].WebSpace);
                context.site.webspace = sites[index].WebSpace;
            }
        }
        if (context.site.webspace === undefined) {
            throw new Error('Unable to locate site named ' + context.site.name);
        }
    }
    site.lookupSiteWebSpace = lookupSiteWebSpace;

    site.command('delete [name]')
        .description('Delete a web site')
        .option('-s, --subscription <id>', 'use the subscription id')
        .execute(function (name, options, _) {
            var context = {
                subscription: cli.category('account').lookupSubscriptionId(options.subscription),
                site: {
                    name: name
                }
            };

            lookupSiteName(context, _);
            lookupSiteWebSpace(context, _);

            log.info('Deleting site', context.site.name);

            var result = getChannel()
                .path(context.subscription)
                .path('services/webspaces')
                .path(context.site.webspace)
                .path('sites')
                .path(context.site.name)
                .DELETE(_);

            log.info('Site ' + context.site.name + ' has been deleted');
        });


    site.command('start [name]')
        .description('Start a web site')
        .option('-s, --subscription <id>', 'use the subscription id')
        .execute(function (name, options, _) {
            var context = {
                subscription: cli.category('account').lookupSubscriptionId(options.subscription),
                site: {
                    name: name
                }
            };

            lookupSiteName(context, _);
            lookupSiteWebSpace(context, _);

            log.info('Starting site', context.site.name);

            var result = getChannel()
                .path(context.subscription)
                .path('services/webspaces')
                .path(context.site.webspace)
                .path('sites')
                .path(context.site.name)
                .header('Content-Type', 'application/xml')
                .PUT(function (req) {
                    req.write('<Site xmlns="http://schemas.microsoft.com/windowsazure">');
                    req.write('<HostNames>');
                    req.write('<string xmlns="http://schemas.microsoft.com/2003/10/Serialization/Arrays">');
                    req.write(context.site.name + '.antdf0.antares-test.windows-int.net');
                    req.write('</string>');
                    req.write('</HostNames>');
                    req.write('<Name>');
                    req.write(context.site.name);
                    req.write('</Name>');
                    req.write('<State>');
                    req.write('Running');
                    req.write('</State>');
                    req.write('</Site>');

                    req.end();
                }, _);

            log.info('Site ' + context.site.name + ' has been started');
        });

    site.command('stop [name]')
        .description('Stop a web site')
        .option('-s, --subscription <id>', 'use the subscription id')
        .execute(function (name, options, _) {
            var context = {
                subscription: cli.category('account').lookupSubscriptionId(options.subscription),
                site: {
                    name: name
                }
            };

            lookupSiteName(context, _);
            lookupSiteWebSpace(context, _);

            log.info('Stopping site', context.site.name);

            var result = getChannel()
                .path(context.subscription)
                .path('services/webspaces')
                .path(context.site.webspace)
                .path('sites')
                .path(context.site.name)
                .header('Content-Type', 'application/xml')
                .PUT(function (req) {
                    req.write('<Site xmlns="http://schemas.microsoft.com/windowsazure">');
                    req.write('<HostNames>');
                    req.write('<string xmlns="http://schemas.microsoft.com/2003/10/Serialization/Arrays">');
                    req.write(context.site.name + '.antdf0.antares-test.windows-int.net');
                    req.write('</string>');
                    req.write('</HostNames>');
                    req.write('<Name>');
                    req.write(context.site.name);
                    req.write('</Name>');
                    req.write('<State>');
                    req.write('Stopped');
                    req.write('</State>');
                    req.write('</Site>');

                    req.end();
                }, _);

            log.info('Site ' + context.site.name + ' has been stopped');
        });


    /////////////////
    // config and settings

    site.findConfig = function () {
        function filenameEndsWithConfig(filename) {
            return endsWith(filename, '.config');
        }

        var scanFolder = process.cwd();
        while (true) {
            var azureFolder = path.join(scanFolder, '.azure');

            // probe for config if azure folder exists
            if (path.existsSync(azureFolder) &&
                fs.statSync(azureFolder).isDirectory()) {

                // find a single .config file
                var files = fs.readdirSync(azureFolder);
                files = files.filter(filenameEndsWithConfig);

                // return full path if it exists
                if (files.length == 1) {
                    var hit = path.join(azureFolder, files[0]);
                    log.silly('Found local config', hit);
                    return hit;
                }
            }

            // recurse upwards, or return null when that's no longer possible
            try {
                var parentFolder = path.dirname(scanFolder);
                if (parentFolder === scanFolder || !path.exists(scanFolder)) {
                    return undefined;
                }
            }
            catch (err) {
                return undefined;
            }
        }
    };

    site.initConfig = function (config) {
        var baseFolder = process.cwd();
        var azureFolder = path.join(baseFolder, '.azure');
        var baseName = crypto.randomBytes(16).toString('hex');
        var configPath = path.join(azureFolder, baseName + '.config');
        if (!path.exists(azureFolder)) {
            log.silly('Creating folder', azureFolder);
            fs.mkdirSync(azureFolder);
        }
        log.silly('Writing file', configPath);
        var configText = JSON.stringify(config);
        fs.writeFileSync(configPath, configText);
    };

    site.readConfig = function () {
        var configPath = site.findConfig();
        if (configPath === undefined) {
            log.verbose('No site .azure/*.config file locate at current directory');
            return undefined;
        }

        log.silly('Reading file', configPath);
        var configText = fs.readFileSync(configPath);
        var config = JSON.parse(configText);
        log.json('silly', 'Site config', config);
        return config;
    };

    site.writeConfig = function (config) {
        var configPath = site.findConfig();
        if (configPath === undefined) {
            log.verbose('No site .azure/*.config file locate at current directory');
            return undefined;
        }
        log.silly('Writing file', configPath);
        var configText = JSON.stringify(config);
        fs.writeFileSync(configPath, configText);
    };



    /////////////////
    // remote api operations

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
                    if (result) {
                        log.verbose('Repository', clean(result));
                    }
                    callback(err, clean(result));
                });
    };

    site.doPublishingUsersGet = function (options, _) {
        var publishingUsers = clean(getChannel()
            .path(options.subscription)
            .path('services/webspaces/')
            .query('properties', 'publishingUsers')
            .GET(_));

        log.verbose('PublishingUsers', publishingUsers);
        return publishingUsers;
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
                    req.write(site.name + '.antdf0.antares-test.windows-int.net');
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
                //                log.error(err.message);
                log.verbose('stack', err.stack);
                log.json('silly', err);
            }
            else if (err.Message) {
                //                log.error(err.Message);
                log.json('verbose', clean(err));
            }
            else {
                //                log.error(err);
            }
        }
    }

    function isArray(testObject) {
        return testObject && !(testObject.propertyIsEnumerable('length')) && typeof testObject === 'object' && typeof testObject.length === 'number';
    }

    function toArray(testObject) {
        return isArray(testObject) ? testObject : typeof testObject === 'undefined' ? [] : [testObject];
    }

    function endsWith(str, suffix) {
        return str.indexOf(suffix, str.length - suffix.length) !== -1;
    }

    function exec(cmd, cb) {
        child_process.exec(cmd, function (err, stdout, stderr) {
            cb(err, {
                stdout: stdout,
                stderr: stderr
            });
        });
    }
};
