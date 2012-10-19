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

var url = require('url');

var LinkedRevisionControl = require('../linkedrevisioncontrol.js');

exports.init = function (cli) {

  var log = cli.output;
  var site = cli.category('site');
  var scm = site.category('deployment');

  scm.command('github [name]')
    .whiteListPowershell()
    .usage('[options] [name]')
    .description('Links a website to a github account for deployment')
    .option('-s, --subscription <id>', 'use the subscription id')
    .option('-u, --username <user>', 'The username')
    .option('-up, --pass <pass>', 'The password')
    .execute(function (name, options, _) {
      var context = {
        subscription: cli.category('account').lookupSubscriptionId(options.subscription),
        site: {
          name: name
        }
      };

      // Fetch site and repository data
      scm.ensureRepositoryUri(context, _);
      promptForGithubCredentials(_);
      context.lvcClient.init(context, _);
      context.lvcClient.deploy(context, _);

      function promptForGithubCredentials(_) {
        log.help('Enter your github credentials');

        if (options.username) {
          context.username = options.username;
        } else {
          context.username = prompt('Username: ', _);
        }

        if (options.pass) {
          context.password = options.pass;
        } else {
          context.password = promptPassword('Password: ', _);
        }

        context.lvcClient = LinkedRevisionControl.createClient(cli, 'github');
        context.lvcClient.authenticate(context.username, context.password);
      }
    });

  function prompt(label, callback) {
    cli.prompt(label, function (x) { callback(undefined, x); });
  }

  function promptPassword(label, callback) {
    cli.passwordOnce(label, function (x) { callback(undefined, x); });
  }
};