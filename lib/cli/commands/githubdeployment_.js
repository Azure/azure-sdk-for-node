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

var LinkedRevisionControl = require('../linkedrevisioncontrol.js');

exports.init = function (cli) {

  var log = cli.output;
  var site = cli.category('site');
  var scm = site.category('deployment');

  scm.command('github [name]')
    .whiteListPowershell()
    .usage('[options] [name]')
    .description('Redeploy your git deployment')
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
      promptForCredentials(_);
      promptForRepository(_);
      linkRemoteGitRepo(_);
      addRemoteToLocalGitRepo(_);

      function promptForCredentials(_) {
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
      }

      function promptForRepository(_) {
        var repositories = context.lvcClient.getRepositories(context.username, _);

        context.remoteUri = scm.doGetRemoteUri(context, _);
        if (context.remoteUri) {
          var parsedRepositoryUri = url.parse(context.remoteUri);
          var pathParts = parsedRepositoryUri.pathname.split('/');
          if (pathParts.length === 3) {
            var owner = pathParts[1];
            var name = pathParts[2].split('.')[0];
            var localRepositories = repositories.filter(function (repository) {
              return repository.name === name && repository.owner.login === owner;
            });

            if (localRepositories && localRepositories.length > 0) {
              context.repository = localRepositories[0];
            }
          }
        }

        if (!context.repository) {
          log.help('Choose a repository');
          context.repository = repositories[choose(repositories.map(function (repository) {
            return repository.full_name;
          }), _)];
        }
      }

      function linkRemoteGitRepo(_) {
        var parsedRepositoryUri = url.parse(context.repositoryUri);
        parsedRepositoryUri.auth = context.repositoryAuth;
        parsedRepositoryUri.pathname = '/deploy';
        var hookUrl = url.format(parsedRepositoryUri);

        context.lvcClient.createOrUpdateHook(context.repository.owner.login,
          context.repository.name,
          hookUrl,
          _);
      }

      function addRemoteToLocalGitRepo(_) {
        if (context.remoteUri) {
          return;
        }

        var gitUri = context.repository.git_url;

        // create the remote repo locally
        log.info('Executing `git remote add azure ' + gitUri + '`');
        exec('git remote add azure ' + gitUri, _);
      }
    });

  scm.doGetRemoteUri = function (context, _) {
    var progress = cli.progress('Retrieving local git repositories');
    var originUri = null;

    try {
      function getRemote(name, _) {
        var remotes = exec('git remote -v', _);
        var origin = (remotes.stdout + remotes.stderr).split('\n').filter(function (item) {
          return item.split('\t').some(function (it) {
            return it === name;
          });
        });

        if (origin && origin.length > 0) {
          return origin[0].split('\t')[1].split(' ')[0];
        }

        return null;
      }

      originUri = getRemote('azure', _);
      if (!originUri) {
        originUri = getRemote('origin', _);
      }
    } finally {
      progress.end();
    }

    return originUri;
  };

  function prompt(label, callback) {
    cli.prompt(label, function (x) { callback(undefined, x); });
  }

  function promptPassword(label, callback) {
    cli.passwordOnce(label, function (x) { callback(undefined, x); });
  }

  function choose(data, callback) {
    cli.choose(data, function (x) { callback(undefined, x); });
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