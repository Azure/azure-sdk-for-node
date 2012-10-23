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
      if (siteConfigurations.AppSettings.length > 0) {
        log.table(siteConfigurations.AppSettings, function (row, item) {
          row.cell('Name', item.GeoRegion);
        });
      } else {
        log.info('No app settings defined yet. You can define app settings using "azure site config set <name>=<value>.');
      }
    });

  siteConfig.command('set <keyvaluepair> [name]')
    .usage('[options] <keyvaluepair> [name]')
    .description('Sets an application setting for your site')
    .option('-s, --subscription <id>', 'use the subscription id')
    .execute(function (keyvaluepair, name, options, _) {
      var context = {
        subscription: cli.category('account').lookupSubscriptionId(options.subscription),
        site: {
          name: name
        },
        keyvaluepair: options.keyvaluepair
      };

      console.log(context);
      var setting = context.keyvaluepair.split('=');

      site.lookupSiteNameAndWebSpace(context, _);
      var siteConfigurations = site.doSiteConfigGet(context, _);
      siteConfigurations.AppSettings[setting[0]] = setting[1];

      console.log(siteConfigurations);

      var siteConfig = {
        SiteConfig: siteConfigurations
      };

      site.doSiteConfigPUT(siteConfig, context, _);
    });

  siteConfig.command('unset <key> [name]')
    .usage('[options] <keyvaluepair> [name]')
    .description('Unsets an application setting for your site')
    .option('-s, --subscription <id>', 'use the subscription id')
    .execute(function (keyvaluepair, name, options, _) {
      var context = {
        subscription: cli.category('account').lookupSubscriptionId(options.subscription),
        site: {
          name: name
        },
        keyvaluepair: options.keyvaluepair
      };

      site.lookupSiteNameAndWebSpace(context, _);

      
    });
};
