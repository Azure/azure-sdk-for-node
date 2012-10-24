/**
* Copyright (c) Microsoft.  All rights reserved.
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

var common = require('../common');
var fs = require('fs');
var path = require('path');
var url = require('url');
var util = require('util');
var crypto = require('crypto');
var pfx2pem = require('../../util/certificates/pkcs').pfx2pem;
var Channel = require('../channel');
var async = require('async');
var child_process = require('child_process');
var utils = require('../utils');
var constants = require('../constants');
var cacheUtils = require('../cacheUtils');
var js2xml = require('../../util/js2xml');

var linkedRevisionControl = require('../linkedrevisioncontrol');

exports.init = function (cli) {

  var log = cli.output;

  function getChannel() {
    var account = cli.category('account');
    var managementEndpoint = url.parse(utils.getManagementEndpointUrl(account.managementEndpointUrl()));
    var pem = account.managementCertificate();
    var host = managementEndpoint.hostname;
    var port = managementEndpoint.port;

    var channel = new Channel({
      host: host,
      port: port,
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
        .whiteListPowershell()
        .description('List your web sites')
        .option('-s, --subscription <id>', 'use the subscription id')
        .execute(function (options, _) {
          var parameters = {
            subscription: cli.category('account').lookupSubscriptionId(options.subscription)
          };

          var sites = site.doSitesGet(parameters, _);

          if (sites && sites.length > 0) {
            for (var s in sites) {
              sites[s] = clean(sites[s]);
            }

            log.table(sites, function (row, s) {
              row.cell('Name', s.Name);
              row.cell('State', s.State);
              row.cell('Host names', s.HostNames);
            });
          } else {
            log.info('No sites created yet. You can create new sites using "azure site create" or through the portal.');
          }
        });

  function choose(data, callback) {
    cli.choose(data, function (x) { callback(undefined, x); });
  }
  function prompt(label, callback) {
    cli.prompt(label, function (x) { callback(undefined, x); });
  }
  function confirm(label, callback) {
    cli.confirm(label, function (x) {
      if (!x) {
        log.warn('The operation was cancelled by the user');
      }
      callback(undefined, x);
    });
  }
  site.confirm = confirm;

  site.command('create [name]')
        .whiteListPowershell()
        .description('Create a new web site')
        .option('-s, --subscription <id>', 'use the subscription id')
        .option('--location <location>', 'the geographic region to create the website')
        .option('--hostname <hostname>', 'custom host name to use')
        .option('--git', 'configure git on web site and local folder')
        .option('-pu, --publishingUsername <publishingUsername>', 'The publishing username for git')
        .option('--github', 'configure github on web site and local folder')
        .option('-u, --username <user>', 'The github username')
        .option('-up, --pass <pass>', 'The github password')
        .option('-r, --repository <repository>', 'The github repository full name (i.e. user/repository)')
        .execute(function (nameArg, options, _) {
          var context = {
            subscription: cli.category('account').lookupSubscriptionId(options.subscription),
            git: options.git,
            site: {
              name: nameArg,
              webspace: options.location,
              hostname: options.hostname
            },
            publishingUser: options.publishingUsername,
            github: {
              username: options.username,
              password: options.pass,
              repositoryFullName: options.repository
            },
            flags: { }
          };

          if (options.git && options.github) {
            throw new Error('Please run the command with either --git or --github options. Not both.')
          }

          // Start by creating the site
          promptForSiteName(_);
          determineIfSiteExists(_);
          promptForLocation(_);
          createSite(_);

          // Init git / github linking
          if (options.git || options.github) {
            if (options.github) {
              context.lvcClient = linkedRevisionControl.createClient(cli, 'github');
            } else if (options.git) {
              context.lvcClient = linkedRevisionControl.createClient(cli, 'git');
            }

            context.lvcClient.init(context, _);

            // Scaffold
            copyIisNodeWhenServerJsPresent(_);
            updateLocalConfigWithSiteName(_);

            initializeRemoteRepo(_);

            if (options.git) {
              addRemoteToLocalGitRepo(_);
            } else if (options.github) {
              site.ensureRepositoryUri(context, _);
            }

            context.lvcClient.deploy(context, _);
          }

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
            var hits = sites.filter(function (item) {
              return utils.ignoreCaseEquals(item.Name, context.site.name);
            });

            if (hits.length === 1) {
              log.info('Updating existing site');
              context.flags.siteExists = true;
              if (context.site.webspace === undefined) {
                context.site.webspace = hits[0].WebSpace;
                log.verbose('Existing site location is ', context.site.webspace)
              } else {
                ensureSpaces(context, _);
                var displayNameMatches = context.spaces.filter(function (space) {
                  return space.GeoRegion === context.site.webspace;
                })[0];

                if (displayNameMatches && displayNameMatches.Name !== hits[0].WebSpace) {
                  throw new Error('Expected location ' + context.site.webspace + ' but was ' + displayNameMatches.GeoRegion);
                }
              }
            }
          }

          function promptForLocation(_) {
            log.silly('promptForLocation');
            ensureSpaces(context, _);

            if (context.site.webspace !== undefined) {
              // Map user-provided value to GeoRegion display name, if unique match exists
              var displayNameMatches = context.spaces.filter(function (space) {
                return space.GeoRegion === context.site.webspace;
              });

              if (displayNameMatches.length === 1) {
                context.site.webspace = displayNameMatches[0].Name;
              }
            }

            if (context.site.webspace !== undefined) {
              // Don't prompt if location has been inferred or provided
              return;
            }

            if (context.spaces.length === 0) {
              portalCreateSiteInstruction(context, _);
              throw new Error('First site must be created on portal');
            } else if (context.spaces.length == 1) {
              context.site.webspace = context.spaces[0].Name;
              log.info('Using location', context.spaces[0].GeoRegion);
            } else {
              log.help('Choose a region');
              context.site.webspace = context.spaces[choose(context.spaces.map(function (space) {
                return space.GeoRegion;
              }), _)].Name;
            }
          }

          function copyIisNodeWhenServerJsPresent(_) {
            log.silly('copyWebConfigWhenServerJsPresent');
            if (!utils.pathExistsSync('iisnode.yml') && (utils.pathExistsSync('server.js') || utils.pathExistsSync('app.js'))) {
              log.info('Creating default iisnode.yml file');
              var sourcePath = path.join(__dirname, '../templates/node/iisnode.yml');
              fs.writeFile('iisnode.yml', fs.readFile(sourcePath, _), _);
            }
          }

          function updateLocalConfigWithSiteName(_) {
            log.silly('updateLocalConfigWithSiteName');
            if (context.flags.isGitWorkingTree) {
              var cfg = site.readConfig(_);
              cfg.name = context.site.name;
              cfg.webspace = context.site.webspace;
              site.writeConfig(cfg, _);
            }
          }

          function createSite(_) {
            log.silly('createSite');
            if (!context.flags.siteExists) {
              site.doSitesPost(context, _);
            }
          }

          function initializeRemoteRepo(_) {
            log.silly('InitializeRemoteRepo');
            if (!context.flags.siteExists) {
              site.doRepositoryPost(context, _);
              context.repo = site.doRepositoryGet(context, _);
            } else {
              context.repo = site.doRepositoryGet(context, _);
              if (!context.repo) {
                site.doRepositoryPost(context, _);
                context.repo = site.doRepositoryGet(context, _);
              }
            }

            log.silly('context.repo', context.repo);
          }

          function addRemoteToLocalGitRepo(_) {
            log.silly('addRemoteToLocalGitRepo');
            if (!context.flags.isGitWorkingTree) {
              log.info('To create a local git repository to publish to the remote site, please rerun this command with the --git flag: "azure site create ' + ((context.site && context.site.name) || '{site name}') + ' --git".')
              return;
            }

            if (!context.publishingUser) {
              context.publishingUsers = site.doPublishingUsersGet(context, _);
              context.publishingUser = getPublishingUser(context, _);
            }

            log.verbose('Detecting git and local git folder');
            var remotes = exec('git remote', _);
            var azureExists = (remotes.stdout + remotes.stderr).split('\n').some(function (item) {
              return item === 'azure';
            });

            if (azureExists) {
              log.verbose('Removing existing azure remote alias');
              exec('git remote rm azure', _);
            }

            var gitUri = getGitUri(context.repo, context.site.name, context.publishingUser);
            log.info('Executing `git remote add azure ' + gitUri + '`');
            exec('git remote add azure ' + gitUri, _);
          }

          function ensureSpaces(context, _) {
            if (!context.spaces) {
              context.spaces = cacheUtils.readSpaces(context, _);
              if (!context.spaces || !context.spaces.length) {
                context.spaces = context.site.doSpacesGet(context, _);
              }
            }
          }
        });

  function portalCreateSiteInstruction(context, _) {
    log.help('You must create your first web site using the Windows Azure portal.');
    log.help('Please follow these steps in the portal:');
    log.help('1. At the bottom of the page, click on New > Web Site > Quick Create');
    log.help('2. Type "' + ((context.site && context.site.name) || '{site name}') + '" in the URL field');
    log.help('3. Click on "Create Web Site"');
    log.help('4. Once the site has been created, click on the site name');
    log.help('5. Click on "Set up Git publishing" or "Reset deployment credentials" and setup a publishing username and password. Use those credentials for all new websites you create.');
    if (context.git) {
      log.help('6. Back in the console window, rerun this command by typing "azure site create {site name} --git"');
    }

    if (confirm('Launch browser to portal now? (y/n) ', _)) {
      log.help('Launching portal.');
      var href = utils.getPortalUrl();
      common.launchBrowser(href);
    }
  }

  function getPublishingUser(context, _) {
    var publishingUsers = toArray(context.publishingUsers);
    var filters = publishingUsers.filter(function (item) {
      return typeof item === 'string' && item.length <= 64;
    });

    if (filters.length === 0) {
      portalGitInitInstruction(context, _);
      throw new Error('Git credentials needs to be setup on the portal');
    } else if (publishingUsers.length === 1 && filters.length === 1) {
      return filters[0];
    }

    log.help('Please provide the username for Git deployment.');
    log.help('If you don\'t have one, please configure it in the management portal.');
    return prompt('Publishing username: ', _);
  }

  function portalGitInitInstruction(context, _) {
    log.help('You must create your git publishing credentials using the Windows Azure portal.');
    log.help('Please follow these steps in the portal:');
    log.help('1. In the menu on the left select "Web Sites"');
    log.help('2. Click on the site named "' + ((context.site && context.site.name) || '{site name}') + '" or any other site');
    log.help('3. Click on "Set up Git publishing" or "Reset deployment credentials" and setup a publishing username and password. Use those credentials for all new websites you create.');
    if (context.git) {
      log.help('4. Back in the console window, rerun this command by typing "azure site create {site name} --git"');
    }

    if (confirm('Launch browser to portal now? (y/n) ', _)) {
      log.help('Launching portal.');
      var href = utils.getPortalUrl();
      common.launchBrowser(href);
    }
  }

  var location = site.category('location')
        .description('Commands to manage your Azure locations');

  location.command('list')
        .whiteListPowershell()
        .description('List locations available for your account')
        .execute(function (options, _) {
          var context = {
            subscription: cli.category('account').lookupSubscriptionId(options.subscription)
          };

          var spaces = site.doSpacesGet(context, _);
          if (spaces && spaces.length) {
            for (var s in spaces) {
              spaces[s] = clean(spaces[s]);
            }

            log.table(spaces, function (row, item) {
              row.cell('Name', item.GeoRegion);
            });
          } else {
            portalCreateSiteInstruction(context, _);
          }
        });

  site.command('portal [name]')
        .whiteListPowershell()
        .description('Opens the portal in a browser to manage your web sites')
        .option("-r, --realm <realm>", "specifies organization used for login")
        .execute(function (name, options, _) {

          var href = url.parse(utils.getPortalUrl(), true);
          delete href.search;
          delete href.path;
          if (name) {
            href.hash = '#Workspaces/WebsiteExtension/Website/' + name + '/dashboard';
          }

          if(options && options.realm){
            href.query.whr = options.realm;
          }
          targetUrl = url.format(href);
          common.launchBrowser(targetUrl);
        });

  site.command('browse [name]')
        .whiteListPowershell()
        .description('Open your web site in a browser.')
        .option('-s, --subscription <id>', 'use the subscription id')
        .execute(function (name, options, _) {

          var context = {
            subscription: cli.category('account').lookupSubscriptionId(options.subscription),
            site: {
              name: name
            }
          };

          var cache = lookupSiteNameAndWebSpace(context, _);
          var siteData = clean(cache || site.doSiteGet(context, _));

          var href = 'http://' + toArray(siteData.HostNames)[0];

          common.launchBrowser(href);
        });

  site.command('show [name]')
        .whiteListPowershell()
        .description('Show details for a web site')
        .option('-s, --subscription <id>', 'use the subscription id')
        .execute(function (name, options, _) {
          var context = {
            subscription: cli.category('account').lookupSubscriptionId(options.subscription),
            site: {
              name: name
            }
          };

          lookupSiteNameAndWebSpace(context, _);

          log.info('Showing details for site');
          log.verbose('Parameters', context);

          var result = async.parallel([
            function (_) { return site.doSiteGet(context, _); },
            function (_) { return site.doSiteConfigGet(context, _); }
            ],
            _);

          var repositoryUri = getRepositoryUri(result[0]);
          var gitUri = repositoryUri ? getGitUri(repositoryUri, context.site.name) : 'none';
          var settings = [];
          if (repositoryUri) {
            site.ensureRepositoryUri(context, _);
            settings = site.category('repository').doSettingsGet(context, _);
          }

          if (log.format().json) {
            var data = {
              site: clean(result[0]),
              config: clean(result[1]),
              gitRepositoryUri: gitUri,
              settings: settings
            };

            log.json(data);
          } else {
            logEachData('Site', result[0]);
            logEachData('Config', result[1]);

            log.data('GitRepositoryUri', gitUri);
            for (var index in settings) {
              log.data('Settings' + ' ' + settings[index].Key, settings[index].Value);
            }
          }
        });

  function lookupSiteName(context, _) {
    if (context.site.name !== undefined) {
      // no need to read further
      return;
    }

    var cfg = site.readConfig(_);
    if (cfg && cfg.name) {
      // using the name from current location
      context.site.name = cfg.name;
      context.site.webspace = cfg.webspace;
      return;
    }

    context.site.name = prompt('Web site name: ', _);

    if (!context.site.name) {
      throw new Error('Invalid site name');
    }
  }

  function lookupSiteWebSpace(context, _) {
    log.verbose('Attempting to locate site ', context.site.name);
    var sites = site.doSitesGet(context, _);
    for (var index in sites) {
      if (utils.ignoreCaseEquals(sites[index].Name, context.site.name)) {
        log.verbose('Site located at ', sites[index].WebSpace);
        context.site.webspace = sites[index].WebSpace;
      }
    }
    if (context.site.webspace === undefined) {
      throw new Error('Unable to locate site named ' + context.site.name);
    }
  }

  function lookupSiteNameAndWebSpace(context, _) {
    lookupSiteName(context, _);
    var cache = cacheUtils.readSite(context, _);
    if (cache || context.site.webspace) {
      context.site.webspace = (cache && cache.WebSpace) || context.site.webspace;
      return cache;
    }
    lookupSiteWebSpace(context, _);
  }

  site.lookupSiteNameAndWebSpace = lookupSiteNameAndWebSpace;

  function getRepositoryUri(siteData) {
    if (siteData.SiteProperties.Properties) {
      for (var i = 0; i < siteData.SiteProperties.Properties.NameValuePair.length; ++i) {
        var pair = siteData.SiteProperties.Properties.NameValuePair[i];
        if (utils.ignoreCaseEquals(pair.Name, "RepositoryUri")) {
          if (typeof pair.Value === 'string') {
            if (!endsWith(pair.Value, '/')) {
              // Make sure there is a trailing slash
              pair.Value += '/';
            }

            return pair.Value;
          } else {
            return null;
          }
        }
      }
    }

    return null;
  }

  site.getRepositoryUri = getRepositoryUri;

  function getGitUri(repositoryUri, siteName, auth) {
    var repoUrl = url.parse(repositoryUri);

    if (auth) {
      repoUrl.auth = auth;
    }

    var sitePath = siteName + '.git';

    if (!endsWith(repoUrl.path, '/')) {
      // Make sure trailing slash exists
      repoUrl.path += '/';
    }
    repoUrl.path += sitePath;

    if (!endsWith(repoUrl.pathname, '/')) {
      // Make sure trailing slash exists
      repoUrl.pathname += '/';
    }
    repoUrl.pathname += sitePath;

    return url.format(repoUrl);
  }

  function getRepositoryAuth(siteData) {
    var userName, password;
    for (var i = 0; i < siteData.SiteProperties.Properties.NameValuePair.length; ++i) {
      var pair = siteData.SiteProperties.Properties.NameValuePair[i];
      if (utils.ignoreCaseEquals(pair.Name, "PublishingUsername")) {
        userName = pair.Value;
      } else if (utils.ignoreCaseEquals(pair.Name, "PublishingPassword")) {
        password = pair.Value;
      }
    }
    return userName && (userName + ":" + password);
  }
  site.getRepositoryAuth = getRepositoryAuth;

  function ensureRepositoryUri(context, _) {
    var siteData = site.lookupSiteNameAndWebSpace(context, _);
    var repositoryUri = siteData && site.getRepositoryUri(siteData);
    if (!repositoryUri) {
      siteData = site.doSiteGet(context, _);
      repositoryUri = site.getRepositoryUri(siteData);
    }
    if (repositoryUri) {
      context.repositoryAuth = site.getRepositoryAuth(siteData);
      return context.repositoryUri = repositoryUri;
    }
  }
  site.ensureRepositoryUri = ensureRepositoryUri;

  site.command('delete [name]')
        .whiteListPowershell()
        .description('Delete a web site')
        .option('-s, --subscription <id>', 'use the subscription id')
        .option('-q, --quiet', 'quiet mode, do not ask for delete confirmation')
        .execute(function (name, options, _) {
          var context = {
            subscription: cli.category('account').lookupSubscriptionId(options.subscription),
            site: {
              name: name
            }
          };

          lookupSiteNameAndWebSpace(context, _);

          log.info('Deleting site', context.site.name);
          if (!options.quiet && !confirm('Delete ' + context.site.name + ' site?  (y/n) ', _)) {
            return;
          }

          var progress = cli.progress('Deleting site');
          try {
            var result = getChannel()
                    .path(context.subscription)
                    .path('services')
                    .path('webspaces')
                    .path(context.site.webspace)
                    .path('sites')
                    .path(context.site.name)
                    .DELETE(_);
            cacheUtils.deleteSite(context, _);
          }
          finally {
            progress.end();
          }
          log.info('Site ' + context.site.name + ' has been deleted');
        });


  site.command('start [name]')
        .whiteListPowershell()
        .description('Start a web site')
        .option('-s, --subscription <id>', 'use the subscription id')
        .execute(function (name, options, _) {
          var context = {
            subscription: cli.category('account').lookupSubscriptionId(options.subscription),
            site: {
              name: name
            }
          };

          lookupSiteNameAndWebSpace(context, _);

          log.info('Starting site', context.site.name);

          var progress = cli.progress('Updating site state');
          try {
            var result = getChannel()
                    .path(context.subscription)
                    .path('services')
                    .path('webspaces')
                    .path(context.site.webspace)
                    .path('sites')
                    .path(context.site.name)
                    .header('Content-Type', 'application/xml')
                    .PUT(function (req) {
                      req.write('<Site xmlns="http://schemas.microsoft.com/windowsazure">');
                      req.write('<HostNames>');
                      req.write('<string xmlns="http://schemas.microsoft.com/2003/10/Serialization/Arrays">');
                      req.write(context.site.name + utils.getHostNameSuffix());
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
          }
          finally {
            progress.end();
          }

          log.info('Site ' + context.site.name + ' has been started');
        });

  site.command('stop [name]')
        .whiteListPowershell()
        .description('Stop a web site')
        .option('-s, --subscription <id>', 'use the subscription id')
        .execute(function (name, options, _) {
          var context = {
            subscription: cli.category('account').lookupSubscriptionId(options.subscription),
            site: {
              name: name
            }
          };

          lookupSiteNameAndWebSpace(context, _);

          log.info('Stopping site', context.site.name);

          var progress = cli.progress('Updating site state');
          try {
            var result = getChannel()
                    .path(context.subscription)
                    .path('services')
                    .path('webspaces')
                    .path(context.site.webspace)
                    .path('sites')
                    .path(context.site.name)
                    .header('Content-Type', 'application/xml')
                    .PUT(function (req) {
                      req.write('<Site xmlns="http://schemas.microsoft.com/windowsazure">');
                      req.write('<HostNames>');
                      req.write('<string xmlns="http://schemas.microsoft.com/2003/10/Serialization/Arrays">');
                      req.write(context.site.name + utils.getHostNameSuffix());
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
          }
          finally {
            progress.end();
          }

          log.info('Site ' + context.site.name + ' has been stopped');
        });


  /////////////////
  // config and settings

  site.readConfig = function (_) {
    return {
      name: site.readConfigValue('azure.site.name', _),
      webspace: site.readConfigValue('azure.site.webspace', _)
    };
  };

  site.writeConfig = function (cfg, _) {
    site.writeConfigValue('azure.site.name', cfg.name, _);
    site.writeConfigValue('azure.site.webspace', cfg.webspace, _);
  };

  site.readConfigValue = function (name, _) {
    try {
      var result = exec('git config --get ' + name, _);
      return (result.stdout + result.stderr).trim();
    }
    catch (err) {
      log.silly('Unable to read config', err);
      return '';
    }
  };

  site.writeConfigValue = function (name, value, _) {
    exec('git config ' + name + ' ' + value, _);
  };


  /////////////////
  // remote api operations

  site.doSitesPost = function (options, callback) {
    log.info('Creating a new web site at ' + options.site.name + utils.getHostNameSuffix());
    log.verbose('Subscription', options.subscription);
    log.verbose('Webspace', options.site.webspace);
    log.verbose('Site', options.site.name);

    var progress = cli.progress('Sending site information');
    getChannel()
              .path(options.subscription)
              .path('services')
              .path('webspaces')
              .path(options.site.webspace)
              .path('sites')
              .header('Content-Type', 'application/xml')
              .POST(
                  writers.Site.xml(options.site),
                  function (err, result) {
                    progress.end();
                    if (err) {
                      logError('Failed to create site', err);
                    } else {
                      return cacheUtils.saveSite(options, result, function (err) {
                        log.info('Created website at ' + clean(result).HostNames);
                        log.verbose('Site', clean(result));
                        return callback(err, result);
                      });
                    }

                    if (err && typeof err.Message !== 'string') {
                      return callback('Invalid service request', result);
                    } else {
                      return callback(err, result);
                    }
                  });
  };

  site.doRepositoryPost = function (options, callback) {
    log.info('Initializing remote Azure repository');
    log.verbose('Subscription', options.subscription);
    log.verbose('Webspace', options.site.webspace);
    log.verbose('Site', options.site.name);

    var progress = cli.progress('Updating site information');
    getChannel()
              .path(options.subscription)
              .path('services')
              .path('webspaces')
              .path(options.site.webspace)
              .path('sites')
              .path(options.site.name)
              .path('repository')
              .POST(
                  "",
                  function (err, result) {
                    progress.end();
                    if (err) {
                      logError('Failed to initialize repository', err);
                    } else {
                      log.info('Remote azure repository initialized');
                    }
                    return callback(err, result);
                  });
  };

  site.doRepositoryDelete = function(options, callback) {
    log.verbose('Subscription', options.subscription);
    log.verbose('Webspace', options.site.webspace);
    log.verbose('Site', options.site.name);

    var progress = cli.progress('Updating site information');
    getChannel()
      .path(options.subscription)
      .path('services')
      .path('webspaces')
      .path(options.site.webspace)
      .path('sites')
      .path(options.site.name)
      .path('repository')
      .DELETE(
        function(err, result) {
          progress.end();
          if (err) {
            logError('Failed to delete repository', err);
          } else {
            log.info('Repository deleted');
          }
          return callback(err, result);
      });
  };

  site.doSpacesGet = function (options, _) {
    log.verbose('Subscription', options.subscription);

    var progress = cli.progress('Enumerating locations');
    try {
      var result = getChannel()
                .path(options.subscription)
                .path('services')
                .path('webspaces')
                .path('')
                .GET(_);

      log.json('silly', result);
      var spaces = toArray(result.WebSpace);
      cacheUtils.saveSpaces(options, spaces, _);
      return spaces;
    }
    finally {
      progress.end();
    }
  };

  site.doSitesGet = function (options, _) {
    log.verbose('Subscription', options.subscription);

    var spaces = site.doSpacesGet(options, _);

    var channel = getChannel()
            .path(options.subscription)
            .path('services')
            .path('webspaces');

    var progress = cli.progress('Enumerating sites');
    try {
      var result = async.map(
                spaces,
                function (webspace, _) {
                  return channel
                        .path(webspace.Name)
                        .path('sites')
                        .path('')
                        .query('propertiesToInclude', 'repositoryuri,publishingpassword,publishingusername')
                        .GET(_);
                },
                _);

      var sites = [];
      result.forEach(function (item) {
        sites = sites.concat(toArray(item.Site));
      });
      result = sites;

      log.json('verbose', sites);
      cacheUtils.saveSites(options, result, _);
      return sites;
    }
    finally {
      progress.end();
    }
  };

  site.doSiteGet = function (options, callback) {
    var progress = cli.progress('Retrieving site information');
    getChannel()
              .path(options.subscription)
              .path('services')
              .path('webspaces')
              .path(options.site.webspace)
              .path('sites')
              .path(options.site.name)
              .query('propertiesToInclude', 'repositoryuri,publishingpassword,publishingusername')
              .GET(
                  function (err, result) {
                    progress.end();
                    if (err) {
                      logError('Failed to get site info', err);
                      if (err.Code === 'NotFound') {
                        return cacheUtils.deleteSite(options, function () {
                          return callback(err, result);
                        });
                      }
                    } else {
                      return cacheUtils.saveSite(options, result, function (err) {
                        log.verbose('Site', clean(result));
                        return callback(err, result);
                      });
                    }
                    return callback(err, result);
                  });
  };

  site.doSiteConfigGet = function (options, callback) {
    var progress = cli.progress('Retrieving site config information');
    getChannel()
              .path(options.subscription)
              .path('services')
              .path('webspaces')
              .path(options.site.webspace)
              .path('sites')
              .path(options.site.name)
              .path('config')
              .GET(
                  function (err, result) {
                    progress.end();
                    if (err) {
                      logError('Failed to get site config info', err);
                    } else {
                      log.verbose('SiteConfig', clean(result));
                    }
                    return callback(err, result);
                  });
  };

  site.doSiteConfigPUT = function (config, options, _) {
    var progress = cli.progress('Updating site config information');

    if (!config.SiteConfig) {
      config = { SiteConfig: config };
    }

    var xmlConfig = js2xml.serialize(config);
    getChannel()
              .path(options.subscription)
              .path('services')
              .path('webspaces')
              .path(options.site.webspace)
              .path('sites')
              .path(options.site.name)
              .path('config')
              .PUT(function (req) {
                req.write(xmlConfig);
                req.end();
              }, _);
  };

  site.doRepositoryGet = function (options, _) {
    var siteData = site.doSiteGet(options, _);
    return getRepositoryUri(siteData);
  };

  site.doPublishingUsersGet = function (options, _) {
    var progress = cli.progress('Retrieving user information');
    try {
      try {
        var publishingUsers = clean(getChannel()
                  .path(options.subscription)
                  .path('services')
                  .path('webspaces')
                  .path('')
                  .query('properties', 'publishingUsers')
                  .GET(_));

        log.verbose('PublishingUsers', publishingUsers);
        return publishingUsers;
      }
      catch (e) {
        return [ '', '' ];
      }
    }
    finally {
      progress.end();
    }
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
          req.write(site.name + utils.getHostNameSuffix());
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
  site.logEachData = logEachData;

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
