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
  var scm = site.category('deployment')
    .description('Commands to manage your git deployments');

  function getScmChannel(context) {
    var parts = url.parse(context.repositoryUri);
    var channel = new Channel({
      host: parts.hostname,
      port: (parts.port && parseInt(parts.port, 10)) || (/https/i.test(parts.protocol) ? 443 : 80),
      auth: context.repositoryAuth
    });

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
  scm.getScmChannel = getScmChannel;

  scm.command('list [name]')
    .whiteListPowershell()
    .usage('[options] [name]')
    .description('List your git deployments')
    .option('-s, --subscription <id>', 'use the subscription id')
    .option('-m, --max <count>', 'limit the maximum number of results')
    .execute(function (name, options, _) {
      var context = {
        subscription: cli.category('account').lookupSubscriptionId(options.subscription),
        maxItems: options.max,
        site: {
          name: name
        }
      };

      var repositoryUri = ensureRepositoryUri(context, _);
      if (repositoryUri) {
        listDeployments(context, _);
      } else {
        log.error('Repository is not setup');
      }
    });

  scm.command('show <commitId> [name]')
    .whiteListPowershell()
    .usage('[options] <commitId> [name]')
    .description('Show your git deployment')
    .option('-s, --subscription <id>', 'use the subscription id')
    .option('-d, --details', 'display log details')
    .execute(function (commitId, name, options, _) {
      var context = {
        subscription: cli.category('account').lookupSubscriptionId(options.subscription),
        shortId: commitId,
        site: {
          name: name
        }
      };

      if (!(context.id = cacheUtils.readCommitId(context, _))) {
        return log.error('deployment with ' + commitId + ' does not exist');
      }

      var repositoryUri = ensureRepositoryUri(context, _);
      if (repositoryUri) {
        var deployment = scm.doDeploymentGet(context, _);

        if (log.format().json) {
          var data = deployment;
          if (options.details) {
            data.logs = getLogDetails(context, _);
          }

          log.json(data);
        } else {
          site.logEachData('info', deployment);
          if (options.details) {
            var logs = getLogDetails(context, _);
            for (var i = 0; i < logs.length; ++i) {
              displayLog(logs[i]);
              if (logs[i].details) {
                var details = logs[i].details;
                for (var j = 0; j < details.length; ++j) {
                  displayLog(details[j]);
                }
              }
            }
          } else {
            log.help('To see more details, specify -d or --details option');
          }
        }
      } else {
        log.error('Repository is not setup');
      }
    });

  scm.command('redeploy <commitId> [name]')
    .whiteListPowershell()
    .usage('[options] <commitId> [name]')
    .description('Redeploy your git deployment')
    .option('-s, --subscription <id>', 'use the subscription id')
    .option('-q, --quiet', 'quiet mode, do not ask for redeploy confirmation')
    .execute(function (commitId, name, options, _) {
      var context = {
        subscription: cli.category('account').lookupSubscriptionId(options.subscription),
        shortId: commitId,
        site: {
          name: name
        }
      };

      if (!(context.id = cacheUtils.readCommitId(context, _))) {
        return log.error('deployment with ' + commitId + ' does not exist');
      }

      var repositoryUri = ensureRepositoryUri(context, _);
      if (repositoryUri) {
        if (!options.quiet && !site.confirm('Reploy deployment with ' + context.shortId + ' id?  (y/n) ', _)) {
          return;
        }
        scm.doDeploymentPut(context, _);
        listDeployments(context, _);
      } else {
        log.error('Repository is not setup');
      }
    });

  scm.doDeploymentsGet = function (context, _) {
    var maxItems = parseInt(context.maxItems, 10);
    if (!maxItems || maxItems <= 0) {
      maxItems = 20;
    }

    var channel = getScmChannel(context)
            .path('deployments')
            .query('$orderby', 'ReceivedTime desc')
            .query('$top', maxItems);

    var progress = cli.progress('Enumerating deployments');
    try {
      var deployments = ensureShortCommitId(channel.GET(_));
      cacheUtils.saveCommitIds(context, deployments, _);
      return deployments.map(formatDeployment);
    } finally {
      progress.end();
    }
  };

  scm.doDeploymentGet = function (context, _) {
    var channel = getScmChannel(context)
            .path('deployments')
            .path(context.id);
    var progress = cli.progress('Retrieving deployment info');
    try {
      return formatDeployment(channel.GET(_));
    } finally {
      progress.end();
    }
  };

  scm.doDeploymentPut = function (context, _) {
    var channel = getScmChannel(context)
            .path('deployments')
            .path(context.id);
    var progress = cli.progress('Redeploying deployment');
    try {
      return channel.PUT(null, _);
    } finally {
      progress.end();
    }
  };

  scm.doLogGet = function (context, _) {
    var channel = getScmChannel(context)
            .path('deployments')
            .path(context.id)
            .path('log');
    var progress = cli.progress('Retrieving deployment log info');
    try {
      var logs = channel.GET(_);
      return logs.map(formatLog);
    } finally {
      progress.end();
    }
  };

  function listDeployments(context, _) {
    var deployments = scm.doDeploymentsGet(context, _);
    var authorLength = 0, messageLength = 0;
    if (deployments && deployments.length) {
      log.table(deployments, function (row, deployment) {
        row.cell('Time', deployment.start_time);
        row.cell('Commit id', deployment.shortId);
        row.cell('Status', deployment.status);
        authorLength = Math.max(deployment.author.length, authorLength);
        row.cell('Author', deployment.author, null, Math.min(authorLength, 15));
        messageLength = Math.max(deployment.message.length, messageLength);
        row.cell('Message', deployment.message, null, Math.min(messageLength, 40));
      });
    } else {
      log.info('No git deployment found');
    }
  }

  function getLogDetails(context, _) {
    var results,
        logs = scm.doLogGet(context, _);
    if (logs && logs.length) {
      var progress = cli.progress('Retrieving log details');
      try {
        results = async.map(logs, function (log, _) {
          if (log.hasDetails) {
            var details = getScmChannel(context)
              .path('deployments')
              .path(context.id)
              .path('log')
              .path(log.id)
              .GET(_);
            return details.map(formatLog);
          }
        }, _);
      } finally {
        progress.end();
      }

      for (var i = 0; i < logs.length; ++i) {
        if (results[i]) {
          logs[i].details = results[i];
        }
      }

      return logs;
    } else {
      log.info('deployment has no detail');
      return [];
    }
  }

  function displayLog(item) {
    if (item.type === 'Warning') {
      log.warn(item.short_time + ' ' + item.message);
    } else if (item.type === 'Error') {
      log.error(item.short_time + ' ' + item.message);
    } else {
      log.data(item.short_time + ' ' + item.message);
    }
  }

  function fromJsonDate(str) {
    return eval(str.replace(/\/Date\((.*)[+].*\)\//gi, "new Date($1)"));
  }

  function formatDate(dt) {
    var date = dt.getDate(),
        month = dt.getMonth() + 1;
    date = (date < 10 ? "0" : "") + date;
    month = (month < 10 ? "0" : "") + month;
    return dt.getFullYear() + "-" + month + "-" + date + " " + dt.toLocaleTimeString();
  }

  function dateTimeText(str) {
    return formatDate(fromJsonDate(str));
  }

  function deploymentStatusText(status) {
    switch (status) {
      case 0: return 'Pending';
      case 1: return 'Building';
      case 2: return 'Deploying';
      case 3: return 'Failed';
      case 4: return 'Success';
      default: return 'Unknown';
    }
  }

  function logTypeText(type) {
    switch (type) {
      case 0: return 'Message';
      case 1: return 'Warning';
      case 2: return 'Error';
      default: return 'Unknown';
    }
  }

  function ensureShortCommitId(deployments) {
    return deployments.map(function (deployment) {
      deployment.shortId = deployment.id.substr(0, 10);
      return deployment;
    });
  }

  function ensureRepositoryUri(context, _) {
    var siteData = site.lookupSiteNameAndWebSpace(context, _);
    var repositoryUri = siteData && site.getRepositoryUri(siteData);
    if (!repositoryUri) {
      siteData = site.doSiteGet(context, _);
      repositoryUri = site.getRepositoryUri(siteData);
    }
    if (repositoryUri) {
      context.repositoryAuth = site.getRepositoryAuth(siteData);
      return context.repositoryUri = repositoryUri;
    }
  }
  scm.ensureRepositoryUri = ensureRepositoryUri;

  function formatDeployment(deployment) {
    var timeProperties = ['end_time', 'last_success_end_time', 'received_time', 'start_time'];
    for (var i = 0; i < timeProperties.length; ++i) {
      if (deployment[timeProperties[i]]) {
        deployment[timeProperties[i]] = dateTimeText(deployment[timeProperties[i]]);
      }
    }
    deployment.complete = (!!deployment.complete).toString();
    deployment.status = deployment.active ? 'Active' : deploymentStatusText(deployment.status);
    deployment.message = deployment.message.replace(/\s*(.*)\s*?/g, "$1");
    delete deployment.active;
    delete deployment.status_text;
    delete deployment.url;
    delete deployment.log_url;
    return deployment;
  }

  function formatLog(log) {
    log.hasDetails = !!log.details_url;
    log.log_time = log.log_time && dateTimeText(log.log_time);
    log.short_time = log.log_time && log.log_time.replace(/.* +(.*)/g, "$1");
    log.type = logTypeText(log.type);
    log.shortId = log.id.substr(0, 10);
    delete log.details_url;
    return log;
  }
};
