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
var utils = require('../utils');
var constants = require('../constants');
var cacheUtils = require('../cacheUtils');

exports.init = function (cli) {

  var log = cli.output;

  function getChannel() {
    var account = cli.category('account'),
            pem = account.managementCertificate(),
            host = process.env.AZURE_ENDPOINT_HOST || account.endpointHost() || constants.DEFAULT_MANAGEMENT_HOSTNAME,
            port = process.env.AZURE_ENDPOINT_PORT || account.endpointPort() || constants.DEFAULT_HTTPS_PORT;

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
        .whiteListPowershell()
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
            var hits = sites.filter(function (item) {
              return utils.ignoreCaseEquals(item.Name, context.site.name);
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
            var spaces = cacheUtils.readSpaces(context, _);
            if (!spaces || !spaces.length) {
              spaces = site.doSpacesGet(context, _);
            }

            if (context.site.webspace !== undefined) {
              // Map user-provided value to GeoRegion display name, if unique match exists
              var displayNameMatches = spaces.filter(function (space) {
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

            if (spaces.length === 0) {
              log.help('You must create your first web site using the Windows Azure portal.');
              log.help('Please follow these steps in the portal:');
              log.help('1. At the bottom of the page, click on New > Web Site > Quick Create');
              log.help('2. Type "' + context.site.name + '" in the URL field');
              log.help('3. Click on "Create Web Site"');
              log.help('4. Once the site has been created, click on the site name');
              log.help('5. Click on "Set up Git publishing" and create a publishing username and password. Use those credentials for all new websites you create.');
              if (confirm('Launch browser to portal now? (y/n) ', _)) {
                log.help('Launching portal.');
                var href = utils.portal();
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
            } catch (err) {
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
            if (context.flags.isGitWorkingTree) {
              var cfg = site.readConfig(_);
              cfg.name = context.site.name;
              cfg.webspace = context.site.webspace;
              site.writeConfig(cfg, _);
            }
          }

          function createSiteAndInitializeRemoteRepo(_) {
            log.silly('createSiteAndInitializeRemoteRepo');
            if (!context.flags.siteExists) {
              site.doSitesPost(context, _);
            }
            try {
              context.repo = site.doRepositoryGet(context, _);
            }
            catch (err) {
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
        .whiteListPowershell()
        .description('Opens the portal in a browser to manage your web sites')
        .execute(function (name, options, _) {

          var href = utils.portal();
          if (name) {
            href = href + '#Workspaces/WebsiteExtension/Website/' + name + '/dashboard';
          }

          common.launchBrowser(href);
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

          logEachData('Site', result[0]);
          logEachData('Config', result[1]);

          var repositoryUri = null;
          for (var i = 0; i < result[0].SiteProperties.Properties.NameValuePair.length; ++i) {
            var pair = result[0].SiteProperties.Properties.NameValuePair[i];
            if (utils.ignoreCaseEquals(pair.Name, "RepositoryUri")) {
              repositoryUri = !pair.Value['@'] && pair.Value;
              break;
            }
          }
          log.data('Repository', repositoryUri ? (clean(repositoryUri) + '/' + context.site.name + '.git') : '');
        });

  function lookupSiteName(context, _) {
    if (context.site.name !== undefined) {
      // no need to read further
      return;
    }

    var cfg = site.readConfig(_);
    if (cfg !== undefined) {
      // using the name from current location
      context.site.name = cfg.name;
      context.site.webspace = cfg.webspace;
      return;
    }

    context.site.name = prompt('Web site name: ', _);
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
    if (!context.site.webspace) {
      var site = cacheUtils.readSite(context, _);
      if (site) {
        context.site.webspace = site.WebSpace;
        return site;
      } else {
        lookupSiteWebSpace(context, _);
      }
    }
  }

  site.command('delete [name]')
        .whiteListPowershell()
        .description('Delete a web site')
        .option('-s, --subscription <id>', 'use the subscription id')
        .execute(function (name, options, _) {
          var context = {
            subscription: cli.category('account').lookupSubscriptionId(options.subscription),
            site: {
              name: name
            }
          };

          lookupSiteNameAndWebSpace(context, _);

          log.info('Deleting site', context.site.name);

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
                      req.write(context.site.name + cli.category('account').hostNameSuffix());
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
                      req.write(context.site.name + cli.category('account').hostNameSuffix());
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
    log.info('Creating a new web site at ', options.site.name + cli.category('account').hostNameSuffix());
    log.verbose('Subscription', options.subscription);
    log.verbose('Webspace', options.site.webspace);
    log.verbose('Site', options.site.name);

    var progress = cli.progress('Sending site information');
    try {
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
                      if (err) {
                        logError('Failed to create site', err);
                      } else {
                        return cacheUtils.saveSite(options, result, function (err) {
                          log.info('Created website at ', clean(result).HostNames);
                          log.verbose('Site', clean(result));
                          callback(err, result);
                        });
                      }
                      callback(err, result);
                    });
    }
    finally {
      progress.end();
    }
  };

  site.doRepositoryPost = function (options, callback) {
    log.info('Initializing repository');
    log.verbose('Subscription', options.subscription);
    log.verbose('Webspace', options.site.webspace);
    log.verbose('Site', options.site.name);

    var progress = cli.progress('Updating site information');
    try {
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
                      if (err) {
                        logError('Failed to initialize repository', err);
                      } else {
                        log.info('Repository initialized');
                      }
                      callback(err, result);
                    });
    }
    finally {
      progress.end();
    }
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
    try {
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
                      if (err) {
                        logError('Failed to get site info', err);
                        if (err.Code === 'NotFound') {
                          return cacheUtils.deleteSite(options, function () {
                            callback(err, result);
                          });
                        }
                      } else {
                        return cacheUtils.saveSite(options, result, function (err) {
                          log.verbose('Site', clean(result));
                          callback(err, result);
                        });
                      }
                      callback(err, result);
                    });
    }
    finally {
      progress.end();
    }
  };

  site.doSiteConfigGet = function (options, callback) {
    var progress = cli.progress('Retrieving site config information');
    try {
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
                      if (err) {
                        logError('Failed to get site config info', err);
                      } else {
                        log.verbose('SiteConfig', clean(result));
                      }
                      callback(err, result);
                    });
    }
    finally {
      progress.end();
    }
  };

  site.doRepositoryGet = function (options, callback) {
    var progress = cli.progress('Retrieving site repository information');
    try {
      getChannel()
                .path(options.subscription)
                .path('services')
                .path('webspaces')
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
    }
    finally {
      progress.end();
    }
  };

  site.doPublishingUsersGet = function (options, _) {
    var progress = cli.progress('Retrieving user information');
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
          req.write(site.name + cli.category('account').hostNameSuffix());
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

