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
  this.log = cli.output;
}

/**
* Returns a specific repository based on its github full name.
*
* @param {array}  repositories         The list of github repositories.
* @param {string} remoteFullName       The repository full name.
* 
*/
LinkedRevisionControlClient._getRepository = function (repositories, remoteFullName) {
  return repositories.filter(function (repository) {
    return repository.full_name === remoteFullName;
  })[0];
};

/**
* Returns a specific repository based on its github clone uri.
*
* @param {array}  repositories         The list of github repositories.
* @param {string} remoteUri            The repository clone url.
* 
*/
LinkedRevisionControlClient._getRepositoryCloneUrl = function (repositories, remoteUri) {
  return repositories.filter(function (repository) {
    return repositoryMatchUri(repository, remoteUri);
  })[0];
};

function repositoryMatchUri (repository, remoteUri) {
  var cleanUri = url.parse(remoteUri);
  // Make sure there is no auth when comparing
  delete cleanUri.auth;
  cleanUri = url.format(cleanUri);

  return repository.clone_url.toLowerCase() === cleanUri.toLowerCase()
      || repository.html_url.toLowerCase() === cleanUri.toLowerCase()
      || repository.ssh_url.toLowerCase() === cleanUri.toLowerCase()
      || repository.git_url.toLowerCase() === cleanUri.toLowerCase();
};

/**
* Determines if the current directory is within a git repository tree.
*/
LinkedRevisionControlClient.prototype.determineIfCurrentDirectoryIsGitWorkingTree = function (context, _) {
  this.log.silly('determineIfCurrentDirectoryIsGitWorkingTree');

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

/**
* Initializes a git repository in the current directory.
*/
LinkedRevisionControlClient.prototype.initGitOnCurrentDirectory = function (context, scaffold, _) {
  this.log.silly('initGitOnCurrentDirectoryIfNeeded');
  if (context.flags.isGitWorkingTree) {
    return;
  }

  this.log.info('Executing `git init`');
  this._exec('git init', _);

  if (scaffold && !utils.pathExistsSync('.gitignore')) {
    this.log.info('Creating default .gitignore file');
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
    username: context.github.username,
    password: context.github.password
  });
};

GithubClient.prototype.authenticateAuth = function(context, _) {
  this.ensureCredentials(context, _);

  this.client.authenticate({
    type: "basic",
    username: context.github.username,
    password: context.github.password
  });

  // Get auth token and switch authentication to oauth
  var oauthToken = this.client.oauth.createAuthorization({ user: context.github.username }, _);
  this.client.authenticate({
    type: "oauth",
    token: oauthToken.token
  });
};

GithubClient.prototype.ensureCredentials = function (context, _) {
  if (!context.github) {
    context.github = { };
  }

  if (!context.github.username || !context.github.password) {
    this.log.help('Enter your github credentials');
  }

  if (!context.github.username) {
    context.github.username = prompt(this.cli, 'Username: ', _);
  }

  if (!context.github.password) {
    context.github.password = promptPassword(this.cli, 'Password: ', _);
  }
};

GithubClient.prototype.init = function (context, _) {
  this.authenticate(context, _);

  // Initialize local git artifacts
  this.determineIfCurrentDirectoryIsGitWorkingTree(context, _);
  this.initGitOnCurrentDirectory(context, false, _);

  // Find github repository
  var repositories = this.getRepositories(context.github.username, _);
  if (context.github.repositoryFullName) {
    // Match the repository passed as parameter
    // against the list of github repositories for the current github user
    context.github.repository = LinkedRevisionControlClient._getRepository(repositories, context.github.repositoryFullName);
    if (!context.github.repository) {
      this.log.info('Invalid repository ' + context.github.repositoryFullName);
    }
  } else if (!(context.flags && context.flags.forceRepositorySelection)) {
    // Unless the user forced the command to prompt for repository or passed a repository 
    // as a parameter, try to find a github repository as a remote on the local folder
    // before actually prompting
    var remoteUris = this._getRemoteUris(_);

    if (remoteUris.length === 1) {
      context.github.repository = LinkedRevisionControlClient._getRepositoryCloneUrl(repositories, remoteUris[0]);
    } else if (remoteUris.length > 0) {
      // filter repositories to reduce prompt options
      repositories = repositories.filter(function (repository) {
        return remoteUris.some(function (remoteUri) {
          return repositoryMatchUri(repository, remoteUri);
        });
      });
    }
  }

  if (!context.github.repository) {
    // If there is no repository already determined, prompt the user to pick one
    this.log.help('Choose a repository (or hit ctrl-c to exit)');
    context.github.repository = repositories[choose(this.cli, repositories.map(function (repository) {
      return repository.full_name;
    }), _)];
  }
};

GithubClient.prototype.deploy = function (context, _) {
  // Add / update hook and trigger it
  context.lvcClient.createOrUpdateHook(context.github.repository.owner.login,
    context.github.repository.name,
    context.repositoryUri,
    context.repositoryAuth,
    _);
};

GithubClient.prototype.getRepositories = function (username, _) {
  var progress = this.cli.progress('Retrieving repositories');
  var userRepos = [];

  function sortByFullName (repositoryA, repositoryB) {
    return repositoryA.full_name.toLowerCase()
      .localeCompare(repositoryB.full_name.toLowerCase());
  };

  function filterPrivate (repository) {
    return repository['private'] !== true;
  };

  try {
    userRepos = this.client.repos.getFromUser({ user: username }, _)
      .filter(filterPrivate)
      .sort(sortByFullName);

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
    orgRepos = orgRepos.filter(filterPrivate).sort(sortByFullName);

    userRepos = userRepos.concat(orgRepos);
  } finally {
    progress.end();
  }

  return userRepos;
};

GithubClient.prototype.createOrUpdateHook = function (username, repository, websitesRepositoryUri, websitesRepositoryAuth, _) {
  // Build the current deploy URI for the hook to be created / updated
  var parsedRepositoryUri = url.parse(websitesRepositoryUri);
  parsedRepositoryUri.auth = websitesRepositoryAuth;
  parsedRepositoryUri.pathname = '/deploy';

  // Url format always encoded the auth part and since it is required that the URL matches
  // exactly what the portal also creates, it is required to revert back the encoding of the '$'
  // character to the unencoded form.
  var deployUri = url.format(parsedRepositoryUri).replace('https://%24', 'https://$');

  // Determine if a hook for the same website already existed in the targeted github repository
  var hooks = this.getHooks(username, repository, _);
  var existingHook = hooks.filter(function (hook) {
    if (hook.config) {
      return hook.name === 'web' &&
             url.parse(hook.config.url).hostname.toLowerCase() === parsedRepositoryUri.hostname.toLowerCase();
    }

    return false;
  })[0];

  if (existingHook) {
    // check if full uri is also the same
    if (existingHook.config.url.toLowerCase() !== deployUri.toLowerCase()) {
      existingHook.config.url = deployUri;
      existingHook.user = username;
      existingHook.repo = repository;
      existingHook = this.updateHook(existingHook, _);
      existingHook.user = username;
      existingHook.repo = repository;
      this.testHook(existingHook, _);
    } else {
      this.log.info('Link already established');
    }
  } else {
    // Initialize a new hook 
    var newHook = {
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

    newHook = this.createHook(newHook, _);
    newHook.user = username;
    newHook.repo = repository;
    this.testHook(newHook, _);
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

GithubClient.prototype._getRemoteUris = function (_) {
  var progress = this.cli.progress('Retrieving local git repositories');
  var remoteUris = [ ];
  try {
    var remotes = this._exec('git remote -v', _);
    remoteUris = (remotes.stdout + remotes.stderr).split('\n')
      .filter(function (line) {
        return line.length > 0;
      })
      .map(function (item) {
        return item.split('\t')[1].split(' ')[0];
      });

    remoteUris = removeDuplicates(remoteUris);
  } finally {
    progress.end();
  }

  return remoteUris;
};

function removeDuplicates (array) {
  return array.filter(function(elem, pos) {
    return array.indexOf(elem) === pos;
  });
}

function choose(cli, data, callback) {
  cli.choose(data, function (x) { callback(undefined, x); });
}

function prompt(cli, label, callback) {
  cli.prompt(label, function (x) { callback(undefined, x); });
}

function promptPassword(cli, label, callback) {
  cli.passwordOnce(label, function (x) { callback(undefined, x); });
}