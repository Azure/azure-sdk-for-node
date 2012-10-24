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

var connectionStringParser = require('../../services/core/connectionstringparser');
var linkedRevisionControl = require('../linkedrevisioncontrol');

exports.init = function (cli) {

  var log = cli.output;
  var site = cli.category('site');
  var siteConfig = site.category('config')
    .description('Commands to manage your site configurations');

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
        siteConfigurations.AppSettings = getSettings(siteConfigurations.AppSettings);

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
        siteConfigurations.AppSettings = getSettings(siteConfigurations.AppSettings);

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
        siteConfigurations.AppSettings = getSettings(siteConfigurations.AppSettings);

        for (var i = 0; i < siteConfigurations.AppSettings.NameValuePair.length; i++) {
          if (siteConfigurations.AppSettings.NameValuePair[i].Name === key) {
            siteConfigurations.AppSettings.NameValuePair.splice(i, 1);
            found = true;
            i--;
          }
        }

        if (found) {
          if (siteConfigurations.AppSettings.NameValuePair.length === 0) {
            siteConfigurations.AppSettings = { };
          }

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
        siteConfigurations.AppSettings = getSettings(siteConfigurations.AppSettings);

        for (var i = 0; i < siteConfigurations.AppSettings.NameValuePair.length; i++) {
          if (siteConfigurations.AppSettings.NameValuePair[i].Name === key) {
            log.data('Value: ', siteConfigurations.AppSettings.NameValuePair[i].Value);
            return;
          }
        }
      }

      if (!found) {
        throw Error('Application setting with key "' + key + '" does not exist.')
      }
    });

  function getSettings(appSettings) {
    if (!appSettings.NameValuePair) {
      appSettings.NameValuePair = [ ];
    } else if (appSettings.NameValuePair.Name) {
      appSettings.NameValuePair = [ appSettings.NameValuePair ];
    }

    return appSettings;
  };
};
