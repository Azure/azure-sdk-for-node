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

var GitHubApi = require('github');

exports.createClient = function (cli, name) {
  switch (name) {
    case 'github':
      return new GithubClient(cli);
      break;
    default:
      throw new Error('Invalid client');
  }
};

function GithubClient(cli) {
  this.cli = cli;
  this.client = new GitHubApi({ version: "3.0.0" });
}

GithubClient.prototype.authenticate = function (username, password) {
  this.client.authenticate({
    type: "basic",
    username: context.username,
    password: context.password
  });
};

GithubClient.prototype.getRepositories = function (username, _) {
  var progress = this.cli.progress('Retrieving repositories');
  var userRepos = [];

  try {
    userRepos = this.client.repos.getFromUser({ user: username }, _);
    var orgs = this.client.user.getOrgs({ user: username }, _);
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
  context.hook = {
    name: 'web',
    user: context.repository.owner.login,
    repo: context.repository.name,
    active: true,
    events: [ 'push' ],
    config: {
      url: hookUrl,
      content_type: 'json'
    }
  };

  var hooks = scm.doGetHooks(context, _);
  var existingHook = hooks.filter(function (hook) {
    if (hook.config) {
      return hook.name === 'web' &&
             url.parse(hook.config.url).hostname === parsedRepositoryUri.hostname;
    }

    return false;
  })[0];

  if (existingHook) {
    // check if full url is also the same
    if (existingHook.config.url !== context.hook.config.url) {
      existingHook.config.url = context.hook.config.url;
      context.hook = existingHook;
      scm.doUpdateHook(context, _);
    } else {
      log.info('Link already established');
    }
  } else {
    scm.doCreateHook(context, _);
  }
};

GithubClient.prototype.createHook = function (hook, _) {
  var progress = cli.progress('Creating new hook');

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
      repo: crepository
    }, _);
  } finally {
    progress.end();
  }
};