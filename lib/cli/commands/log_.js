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
  var site = cli.category('site');
  var scm = site.category('deployment');
  var diagnostic = site.category('log')
    .description('Commands to download diagnostic log');

  diagnostic.command('download [name]')
    .whiteListPowershell()
    .description('Download diagnostic log')
    .option('-s, --subscription <id>', 'use the subscription id')
    .option('-o, --output <path>', 'output path, default is local folder')
    .execute(function (name, options, _) {
      var context = {
        subscription: cli.category('account').lookupSubscriptionId(options.subscription),
        path: options.output || '',
        site: {
          name: name
        }
      };

      if (!(/[.]zip$/i.test(context.path))) {
        context.path = path.join(context.path, 'diagnostics.zip');
      }

      if (path.existsSync(context.path)) {
        if (!site.confirm('Replace existing ' + context.path + '?  (y/n) ', _)) {
          return;
        }
      }

      var repositoryUri = scm.ensureRepositoryUri(context, _);
      if (repositoryUri) {
        var buf = doDownloadDiagnostic(context, _);
        log.info('Writing to ' + context.path);
        fs.writeFile(context.path, buf, _);
      } else {
        log.error('Repository is not setup');
      }
    });

  function doDownloadDiagnostic(context, _) {
    var channel = scm.getScmChannel(context)
                    .path('dump');
    var progress = cli.progress('Downloading diagnostic log');
    try {
      return channel.GET(_);
    } finally {
      progress.end();
    }
  }
};
