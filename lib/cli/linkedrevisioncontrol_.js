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

exports.LinkedRevisionControlClient = LinkedRevisionControlClient;
exports.GithubClient = GithubClient;
exports.GitClient = GitClient;

function LinkedRevisionControlClient(cli) {
  this.cli = cli;
}

LinkedRevisionControlClient.getRepository = function (repositories, remoteUri) {
  var parsedRepositoryUri = url.parse(remoteUri);
  var pathParts = parsedRepositoryUri.pathname.split('/');
  if (pathParts.length === 3) {
    var owner = pathParts[1];
    var name = pathParts[2].split('.')[0];
    var localRepositories = repositories.filter(function (repository) {
      return repository.name === name && repository.owner.login === owner;
    });

    if (localRepositories && localRepositories.length > 0) {
      return localRepositories[0];
    }
  }

  return null;
};

LinkedRevisionControlClient.prototype.determineIfCurrentDirectoryIsGitWorkingTree = function (context, _) {
  this.cli.output.silly('determineIfCurrentDirectoryIsGitWorkingTree');

  try {
    var isInsideWorkTree = this._exec('git rev-parse --git-dir', _);
    var lines = isInsideWorkTree.stdout + isInsideWorkTree.stderr;
    if (!context.flags) {
      context.flags = { };
    }

    context.flags.isGitWorkingTree = lines.split('\n').some(function (line) {
      return line === '.git';
    });
  } catch (err) {
    context.flags.isGitWorkingTree = false;
  }
};

LinkedRevisionControlClient.prototype.initGitOnCurrentDirectory = function (context, scaffold, _) {
  this.cli.output.silly('initGitOnCurrentDirectoryIfNeeded');
  if (context.flags.isGitWorkingTree) {
    return;
  }

  this.cli.output.info('Executing `git init`');
  this._exec('git init', _);

  if (scaffold && !utils.pathExistsSync('.gitignore')) {
    this.cli.output.info('Creating default .gitignore file');
    fs.writeFile('.gitignore', 'node_modules\nazure_error', _);
  }

  context.flags.isGitWorkingTree = true;
};

LinkedRevisionControlClient.prototype._exec = function (cmd, cb) {
  child_process.exec(cmd, function (err, stdout, stderr) {
    cb(err, {
      stdout: stdout,
      stderr: stderr
    });
  });
};

function GitClient(cli) {
  GitClient.super_.call(this, cli);
}

util.inherits(GitClient, LinkedRevisionControlClient);

GitClient.prototype.init = function (context, _) {
  this.determineIfCurrentDirectoryIsGitWorkingTree(context, _);
  this.initGitOnCurrentDirectory(context, true, _);
};

GitClient.prototype.deploy = function (context, _) {
  // Do nothing
};

function GithubClient(cli) {
  GithubClient.super_.call(this, cli);

  this.client = new GitHubApi({ version: "3.0.0" });
}

util.inherits(GithubClient, LinkedRevisionControlClient);

GithubClient.prototype.authenticate = function (context, _) {
  this.ensureCredentials(context, _);

  this.client.authenticate({
    type: "basic",
    username: context.username,
    password: context.password
  });
};

GithubClient.prototype.authenticateAuth = function(context, _) {
  this.ensureCredentials(context, _);

  this.client.authenticate({
    type: "basic",
    username: context.username,
    password: context.password
  });

  // Get auth token and switch authentication to oauth
  var oauthToken = this.client.oauth.createAuthorization({ user: context.username }, _);
  this.client.authenticate({
    type: "oauth",
    token: oauthToken.token
  });
};

GithubClient.prototype.ensureCredentials = function (context, _) {
  if (!context.username || !context.password) {
    this.cli.output.help('Enter your github credentials');
  }

  if (!context.username) {
    context.username = prompt(this.cli, 'Username: ', _);
  }

  if (!context.password) {
    context.password = promptPassword(this.cli, 'Password: ', _);
  }
};

GithubClient.prototype.init = function (context, _) {
  this.authenticate(context, _);

  this.determineIfCurrentDirectoryIsGitWorkingTree(context, _);
  this.initGitOnCurrentDirectory(context, false, _);

  var repositories = this.getRepositories(context.username, _);

  if (!context.remoteUri) {
    // Look for git repository in local git remotes
    context.remoteUri = this._getRemoteUri(_);
  }

  if (context.remoteUri) {
    context.repository = LinkedRevisionControlClient.getRepository(repositories, context.remoteUri);
  }

  if ((context.flags && context.flags.forceRepositorySelection) || !context.repository) {
    // Look for git repository in github
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
  var hookUrl = url.format(parsedRepositoryUri).replace('https://%24', 'https://$');
  context.lvcClient.createOrUpdateHook(context.repository.owner.login,
    context.repository.name,
    hookUrl,
    _);

  var parsedCloneUrl = url.parse(context.repository.clone_url);
  parsedCloneUrl.auth = context.username;
  var gitUri = url.format(parsedCloneUrl);

  if (context.remoteUri && context.remoteUri.toLowerCase() !== gitUri.toLowerCase()) {
    context.remoteUri = null;

    var azureRemote = this._getRemote('azure', _);
    if (azureRemote) {
      this.cli.output.verbose('Removing existing azure remote alias');
      this._exec('git remote rm azure', _);
    }
  }

  if (!context.remoteUri) {
    // create the remote repo locally
    this.cli.output.info('Executing `git remote add azure ' + gitUri + '`');
    this._exec('git remote add azure ' + gitUri, _);
  }
};

GithubClient.prototype.getRepositories = function (username, _) {
  var progress = this.cli.progress('Retrieving repositories');
  var userRepos = [];

  function sortFunction (repositoryA, repositoryB) {
    return repositoryA.full_name.toLowerCase()
      .localeCompare(repositoryB.full_name.toLowerCase());
  };

  function filterPrivate (repository) {
    return repository['private'] !== true;
  };

  try {
    userRepos = this.client.repos.getFromUser({ user: username }, _)
      .filter(filterPrivate)
      .sort(sortFunction);

    var orgs = this.client.orgs.getFromUser({ user: username }, _);
    if (orgs) {
      var orgRepos = [];
      for (var i in orgs) {
        if (orgs.hasOwnProperty(i)) {
          var org = orgs[i];
          if (org.login) {
            var repos = this.client.repos.getFromOrg({ org: org.login, sort: 'updated', desc: 'desc' }, _);

            orgRepos = orgRepos.concat(repos);
          }
        }
      }
    }
    orgRepos = orgRepos.filter(filterPrivate).sort(sortFunction);

    userRepos = userRepos.concat(orgRepos);
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
      insecure_ssl: '1',
      content_type: 'form'
    }
  };

  var hooks = this.getHooks(username, repository, _);
  var parsedDeployUri = url.parse(deployUri);
  var existingHook = hooks.filter(function (hook) {
    if (hook.config) {
      return hook.name === 'web' &&
             url.parse(hook.config.url).hostname.toLowerCase() === parsedDeployUri.hostname.toLowerCase();
    }

    return false;
  })[0];

  if (existingHook) {
    // check if full url is also the same
    if (existingHook.config.url.toLowerCase() !== hook.config.url.toLowerCase()) {
      existingHook.config.url = hook.config.url;
      existingHook.user = username;
      existingHook.repo = repository;
      existingHook = this.updateHook(existingHook, _);
      this.testHook(existingHook, _);
    } else {
      this.cli.output.info('Link already established');
    }
  } else {
    hook = this.createHook(hook, _);
    hook.user = username;
    hook.repo = repository;
    this.testHook(hook, _);
  }
};

GithubClient.prototype.createHook = function (hook, _) {
  var progress = this.cli.progress('Creating new hook');

  try {
    return this.client.repos.createHook(hook, _);
  } finally {
    progress.end();
  }
};

GithubClient.prototype.updateHook = function (hook, _) {
  var progress = this.cli.progress('Updating hook');

  try {
    return this.client.repos.updateHook(hook, _);
  } finally {
    progress.end();
  }
};

GithubClient.prototype.testHook = function (hook, _) {
  var progress = this.cli.progress('Testing hook');

  try {
    this.client.repos.testHook(hook, _);
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

GithubClient.prototype._getRemoteUri = function (_) {
  var progress = this.cli.progress('Retrieving local git repositories');
  var originUri = null;

  try {
    originUri = this._getRemote('azure', _);
    if (!originUri) {
      originUri = this._getRemote('origin', _);
    }
  } finally {
    progress.end();
  }

  return originUri;
};

GithubClient.prototype._getRemote = function (name, _) {
  var remotes = this._exec('git remote -v', _);
  var origin = (remotes.stdout + remotes.stderr).split('\n').filter(function (item) {
    return item.split('\t').some(function (it) {
      return it === name;
    });
  });

  if (origin && origin.length > 0) {
    return origin[0].split('\t')[1].split(' ')[0];
  }

  return null;
};

function choose(cli, data, callback) {
  cli.choose(data, function (x) { callback(undefined, x); });
}

function prompt(cli, label, callback) {
  cli.prompt(label, function (x) { callback(undefined, x); });
}

function promptPassword(cli, label, callback) {
  cli.passwordOnce(label, function (x) { callback(undefined, x); });
}