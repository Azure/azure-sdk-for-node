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
var crypto = require('crypto');
var pfx2pem = require('../../util/certificates/pkcs').pfx2pem;
var Channel = require('../channel');
var async = require('async');
var utils = require('../utils');
var constants = require('../constants');
var cacheUtils = require('../cacheUtils');

var connectionStringParser = require('../../services/core/connectionstringparser');
var linkedRevisionControl = require('../linkedrevisioncontrol');

exports.init = function (cli) {

  var log = cli.output;
  var site = cli.category('site');
  var siteConfig = site.category('config')
    .description('Commands to manage your site configurations');

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

  siteConfig.command('list [name]')
    .usage('[options] [name]')
    .description('Show your site application settings')
    .option('-s, --subscription <id>', 'use the subscription id')
    .execute(function (name, options, _) {
      var context = {
        subscription: cli.category('account').lookupSubscriptionId(options.subscription),
        site: {
          name: name
        }
      };

      site.lookupSiteNameAndWebSpace(context, _);

      var siteConfigurations = site.doSiteConfigGet(context, _);
      if (siteConfigurations.AppSettings.NameValuePair) {
        if (siteConfigurations.AppSettings.NameValuePair.Name) {
          siteConfigurations.AppSettings.NameValuePair = [ siteConfigurations.AppSettings.NameValuePair ];
        }

        log.table(siteConfigurations.AppSettings.NameValuePair, function (row, item) {
          row.cell('Name', item.Name);
          row.cell('Value', item.Value);
        });
      } else {
        log.info('No app settings defined yet. You can define app settings using "azure site config set <name>=<value>.');
      }
    });

  siteConfig.command('add <keyvaluepair> [name]')
    .usage('[options] <keyvaluepair> [name]')
    .description('Adds an application setting for your site')
    .option('-s, --subscription <id>', 'use the subscription id')
    .execute(function (keyvaluepair, name, options, _) {
      var context = {
        subscription: cli.category('account').lookupSubscriptionId(options.subscription),
        site: {
          name: name
        },
        keyvaluepair: keyvaluepair
      };

      var settings = connectionStringParser.parse(context.keyvaluepair);

      site.lookupSiteNameAndWebSpace(context, _);
      var siteConfigurations = site.doSiteConfigGet(context, _);

      if (Object.keys(settings).length > 0) {
        if (!siteConfigurations.AppSettings.NameValuePair) {
          siteConfigurations.AppSettings.NameValuePair = [ ];
        } else if (siteConfigurations.AppSettings.NameValuePair.Name) {
          siteConfigurations.AppSettings.NamevaluePair = [ siteConfigurations.AppSettings.NamevaluePair ];
        }

        for (var setting in settings) {
          if (settings.hasOwnProperty(setting)) {
            if (siteConfigurations.AppSettings.NameValuePair.some(function (kvp) {
              return kvp.Name === setting;
            })) {
              // add should throw if any of the added kvp already exists
              throw new Error('Application setting with key "' + setting + '" already exists.');
            }

            siteConfigurations.AppSettings.NameValuePair.push({
              Name: setting,
              Value: settings[setting]
            });
          }
        }
      }

      site.doSiteConfigPUT(siteConfigurations, context, _);
    });

  siteConfig.command('clear <key> [name]')
    .usage('[options] <key> [name]')
    .description('Clears an application setting for your site')
    .option('-s, --subscription <id>', 'use the subscription id')
    .execute(function (key, name, options, _) {
      var context = {
        subscription: cli.category('account').lookupSubscriptionId(options.subscription),
        site: {
          name: name
        },
        key: key
      };

      site.lookupSiteNameAndWebSpace(context, _);
      var siteConfigurations = site.doSiteConfigGet(context, _);

      var found = false;
      if (siteConfigurations.AppSettings.NameValuePair) {
        var settings = siteConfigurations.AppSettings.NameValuePair;
        if (settings.Name) {
          settings = [ settings ];
        }

        for (var i = 0; i < settings.length; i++) {
          if (settings[i].Name === key) {
            settings.splice(i, 1);
            found = true;
            i--;
          }
        }

        if (found) {
          siteConfigurations.AppSettings.NameValuePair = settings;
          site.doSiteConfigPUT(siteConfigurations, context, _);
        }
      }

      if (!found) {
        throw Error('Application setting with key "' + key + '" does not exist.')
      }
    });

  siteConfig.command('get <key> [name]')
    .usage('[options] <key> [name]')
    .description('Gets an application setting for your site')
    .option('-s, --subscription <id>', 'use the subscription id')
    .execute(function (key, name, options, _) {
      var context = {
        subscription: cli.category('account').lookupSubscriptionId(options.subscription),
        site: {
          name: name
        },
        key: key
      };

      site.lookupSiteNameAndWebSpace(context, _);
      var siteConfigurations = site.doSiteConfigGet(context, _);

      var found = false;
      if (siteConfigurations.AppSettings.NameValuePair) {
        var settings = siteConfigurations.AppSettings.NameValuePair;
        if (settings.Name) {
          settings = [ settings ];
        }

        for (var i = 0; i < settings.length; i++) {
          if (settings[i].Name === key) {
            log.data('Value: ', settings[i].Value);
            return;
          }
        }
      }

      if (!found) {
        throw Error('Application setting with key "' + key + '" does not exist.')
      }
    });
};
