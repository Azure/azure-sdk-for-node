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


var fs = require('fs');
var azure = require('../../azure');
var utils = require('../utils');
var cert = require('../cert');
var common = require('../common');

exports.init = function (cli) {
  var service = cli.category('service')
    .description('Commands to manage your Azure cloud services');

  var logger = cli.output;

  service.command('list')
    .whiteListPowershell()
    .description('List Azure cloud services')
    .option('-s, --subscription <id>', 'use the subscription id')
    .execute(function (options, callback) {
      var channel = utils.createServiceManagementService(cli.category('account').lookupSubscriptionId(options.subscription),
        cli.category('account'), logger);

      var progress = cli.progress('Fetching cloud services');
      utils.doServiceManagementOperation(channel, 'listHostedServices', function (error, response) {
        progress.end();
        if (!error) {
          if (response.body.length > 0) {
            logger.table(response.body, function (row, item) {
              row.cell('Name', item.ServiceName);
              row.cell('Status', item.HostedServiceProperties.Status);
            });
          } else {
            if (logger.format().json) {
              logger.json([]);
            } else {
              logger.info('No cloud services found');
            }
          }
        }
        callback(error);
      });
    });

  service.command('delete <name>')
    .whiteListPowershell()
    .description('Delete Azure cloud service')
    .option('-s, --subscription <id>', 'use the subscription id')
    .execute(function (name, options, callback) {
      var channel = utils.createServiceManagementService(cli.category('account').lookupSubscriptionId(options.subscription),
        cli.category('account'), logger);

      var progress = cli.progress('Deleting cloud service');
      utils.doServiceManagementOperation(channel, 'deleteHostedService', name, function (error, response) {
        progress.end();
        callback(error);
      });
    });

  service.command('portal [name]')
    .whiteListPowershell()
    .description('Opens the portal in a browser to manage your cloud services')
    .execute(function (name, options, callback) {
      var url = utils.getPortalUrl() + '#Workspaces/CloudServicesExtension/';
      url += name ? 'CloudService/' + name + '/dashboard' : 'list';

      common.launchBrowser(url);
    });
  
  cert.init(cli, service);
};

