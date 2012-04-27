/**
* Copyright 2011 Microsoft Corporation
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

exports.init = function (cli) {
  var cloudService = cli.category('cloud-service')
    .description('Commands to manage your Azure cloud services');
    
  var logger = cli.output;
    
  cloudService.command('list')
    .description('List Azure cloud services')
    .option('-i, --subscription <id>', 'use the subscription id')
    .execute(function(options, callback) {
      var channel = utils.createServiceManagementService(cli.category('account').lookupSubscriptionId(options.subscription),
        cli.category('account'), logger);

      var progress = cli.progress('Fetching cloud services');
      utils.doServiceManagementOperation(channel, 'listHostedServices', function(error, response) {
        progress.end();
        if (!error) {
          logger.table(response.body, function (row, item) {
            row.cell('Name', item.ServiceName);
            row.cell('Status', item.HostedServiceProperties.Status);
          });
        }
        callback(error);
      });
    });
    
  cloudService.command('delete <name>')
    .description('Delete Azure cloud service')
    .option('-i, --subscription <id>', 'use the subscription id')
    .execute(function(name, options, callback) {
      var channel = utils.createServiceManagementService(cli.category('account').lookupSubscriptionId(options.subscription),
        cli.category('account'), logger);

      var progress = cli.progress('Deleting cloud service');
      utils.doServiceManagementOperation(channel, 'deleteHostedService', name, function(error, response) {
        progress.end();
        callback(error);
      });
    });
};