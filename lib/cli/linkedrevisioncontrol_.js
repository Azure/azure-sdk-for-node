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
var fs = require('fs');
var util = require('util');
var child_process = require('child_process');
var GitHubApi = require('github');

var utils = require('./utils');

exports.createClient = function (cli, name) {
  switch (name) {
    case 'github':
      return new GithubClient(cli);
      break;
    case 'git':
      return new GitClient(cli);
      break;
    default:
      throw new Error('Invalid client');
  }
};

function LinkedRevisionControlClient(cli) {
  this.cli = cli;
}

LinkedRevisionControlClient.prototype.initGitOnCurrentDirectory = function (context, _) {
  this.cli.output.silly('initGitOnCurrentDirectoryIfNeeded');
  if (context.flags.isGitWorkingTree) {
    return;
  }

  this.cli.output.info('Executing `git init`');
  exec('git init', _);

  if (!utils.pathExistsSync('.gitignore')) {
    this.cli.output.info('Creating default .gitignore file');
    fs.writeFile('.gitignore', 'node_modules\nazure_error', _);
  }

  context.flags.isGitWorkingTree = true;
};

LinkedRevisionControlClient.prototype.determineIfCurrentDirectoryIsGitWorkingTree = function (context, _) {
  this.cli.output.silly('determineIfCurrentDirectoryIsGitWorkingTree');

  try {
    var isInsideWorkTree = exec('git rev-parse --git-dir', _);
    var lines = isInsideWorkTree.stdout + isInsideWorkTree.stderr;
    context.flags.isGitWorkingTree = lines.split('\n').some(function (line) {
      return line === '.git';
    });
  } catch (err) {
    context.flags.isGitWorkingTree = false;
  }
}

function GitClient(cli) {
  GitClient.super_.call(this, cli);
}

util.inherits(GitClient, LinkedRevisionControlClient);

GitClient.prototype.init = function (context, _) {
  this.determineIfCurrentDirectoryIsGitWorkingTree(context, _);
  this.initGitOnCurrentDirectory(context, _);
};

GitClient.prototype.deploy = function (context, _) {
  // Do nothing
};

function GithubClient(cli) {
  GithubClient.super_.call(this, cli);

  this.client = new GitHubApi({ version: "3.0.0" });
}

util.inherits(GithubClient, LinkedRevisionControlClient);

GithubClient.prototype.authenticate = function (username, password) {
  this.client.authenticate({
    type: "basic",
    username: username,
    password: password
  });
};

GithubClient.prototype.init = function (context, _) {
  var repositories = this.getRepositories(context.username, _);

  context.remoteUri = this._getRemoteUri(context, _);
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
    this.cli.output.help('Choose a repository');
    context.repository = repositories[choose(this.cli, repositories.map(function (repository) {
      return repository.full_name;
    }), _)];
  }
};

GithubClient.prototype.deploy = function (context, _) {
  var parsedRepositoryUri = url.parse(context.repositoryUri);
  parsedRepositoryUri.auth = context.repositoryAuth;
  parsedRepositoryUri.pathname = '/deploy';
  var hookUrl = url.format(parsedRepositoryUri);

  context.lvcClient.createOrUpdateHook(context.repository.owner.login,
    context.repository.name,
    hookUrl,
    _);

  if (!context.remoteUri) {
    var gitUri = context.repository.git_url;

    // create the remote repo locally
    this.cli.output.info('Executing `git remote add azure ' + gitUri + '`');
    exec('git remote add azure ' + gitUri, _);
  }
};

GithubClient.prototype.getRepositories = function (username, _) {
  var progress = this.cli.progress('Retrieving repositories');
  var userRepos = [];

  try {
    userRepos = this.client.repos.getFromUser({ user: username }, _);
    var orgs = this.client.orgs.getFromUser({ user: username }, _);
    if (orgs) {
      for (var i in orgs) {
        if (orgs.hasOwnProperty(i)) {
          var org = orgs[i];
          if (org.login) {
            repos = this.client.repos.getFromOrg({ org: org.login }, _);

            userRepos = userRepos.concat(repos);
          }
        }
      }
    }
  } finally {
    progress.end();
  }

  return userRepos;
};

GithubClient.prototype.createOrUpdateHook = function (username, repository, deployUri, _) {
  var hook = {
    name: 'web',
    user: username,
    repo: repository,
    active: true,
    events: [ 'push' ],
    config: {
      url: deployUri,
      content_type: 'json'
    }
  };

  var hooks = this.getHooks(username, repository, _);
  var parsedDeployUri = url.parse(deployUri);
  var existingHook = hooks.filter(function (hook) {
    if (hook.config) {
      return hook.name === 'web' &&
             url.parse(hook.config.url).hostname === parsedDeployUri.hostname;
    }

    return false;
  })[0];

  if (existingHook) {
    // check if full url is also the same
    if (existingHook.config.url !== hook.config.url) {
      existingHook.config.url = hook.config.url;
      hook = existingHook;
      this.updateHook(hook, _);
    } else {
      this.cli.output.info('Link already established');
    }
  } else {
    this.createHook(hook, _);
  }
};

GithubClient.prototype.createHook = function (hook, _) {
  var progress = this.cli.progress('Creating new hook');

  try {
    this.client.repos.createHook(hook, _);
  } finally {
    progress.end();
  }
};

GithubClient.prototype.updateHook = function (hook, _) {
  var progress = this.cli.progress('Updating hook');

  try {
    this.client.repos.updateHook(hook, _);
  } finally {
    progress.end();
  }
};

GithubClient.prototype.getHooks = function (username, repository, _) {
  var progress = this.cli.progress('Retrieving website hooks');

  try {
    return this.client.repos.getHooks({
      user: username,
      repo: repository
    }, _);
  } finally {
    progress.end();
  }
};

GithubClient.prototype._getRemoteUri = function (context, _) {
  var progress = this.cli.progress('Retrieving local git repositories');
  var originUri = null;

  try {
    originUri = getRemote('azure', _);
    if (!originUri) {
      originUri = getRemote('origin', _);
    }
  } finally {
    progress.end();
  }

  return originUri;
};

function exec(cmd, cb) {
  child_process.exec(cmd, function (err, stdout, stderr) {
    cb(err, {
      stdout: stdout,
      stderr: stderr
    });
  });
}

function choose(cli, data, callback) {
  cli.choose(data, function (x) { callback(undefined, x); });
}

function getRemote(name, _) {
  remotes = exec('git remote -v', _);
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
