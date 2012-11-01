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
var child_process = require('child_process');
var utils = require('../utils');
var constants = require('../constants');
var cacheUtils = require('../cacheUtils');

exports.init = function(cli) {

  var log = cli.output;
  var site = cli.category('site');
  var scm = site.category('deployment');
  var repository = site.category('repository')
    .description('Commands to manage your git repository');

  repository.command('branch <branch> [name]>')
    .whiteListPowershell()
    .usage('<branch> [name] [options]')
    .description('set your repository branch')
    .option('-s, --subscription <id>', 'use the subscription id')
    .execute(function(branch, name, options, _) {
      var context = {
        subscription: cli.category('account').lookupSubscriptionId(options.subscription),
        settingKey: 'branch',
        settingValue: branch,
        site: { name: name }
      };

      var repositoryUri = site.ensureRepositoryUri(context, _);
      if (repositoryUri) {
        doSettingsSet(context, _);
      } else {
        log.error('Repository is not setup');
      }
    });

  repository.command('delete [name]')
    .whiteListPowershell()
    .usage('[name] [options]')
    .description('Delete your repository')
    .option('-s, --subscription <id>', 'use the subscription id')
    .option('-q, --quiet', 'quiet mode, do not ask for delete confirmation')
    .execute(function(name, options, _) {
      var context = {
        subscription: cli.category('account').lookupSubscriptionId(options.subscription),
        site: { name: name }
      };

      var repositoryUri = site.ensureRepositoryUri(context, _);
      if (repositoryUri) {
        if (!options.quiet && !site.confirm('Delete repository?  (y/n) ', _)) {
          return;
        }

        doDeleteRepository(context, _);
        site.doRepositoryDelete(context, _);
      } else {
        log.error('Repository is not setup');
      }
    });

  function doSettingsGet(context, _) {
    var channel = scm.getScmChannel(context)
            .path('settings');
    if (context.settingKey !== undefined) {
      channel.path(context.settingKey);
    }

    var progress = cli.progress('Retrieving repository ' + (context.settingKey ? (context.settingKey + ' ') : '') + 'settings');
    try {
      return channel.GET(_);
    } finally {
      progress.end();
    }
  };
  repository.doSettingsGet = doSettingsGet;

  function doSettingsSet(context, _) {
    var channel = scm.getScmChannel(context)
            .path('settings');
    var data = {
      key: context.settingKey,
      value: context.settingValue
    };

    var progress = cli.progress('Setting ' + context.settingKey + ' to ' + context.settingValue);
    try {
      return channel.header('content-type', 'application/json').POST(JSON.stringify(data), _);
    } finally {
      progress.end();
    }
  };

  function doDeleteRepository(context, _) {
    var channel = scm.getScmChannel(context)
            .path('live/scm');

    var progress = cli.progress('Cleaning up repository files');
    try {
      return channel.DELETE(_);
    } finally {
      progress.end();
    }
  };
};
