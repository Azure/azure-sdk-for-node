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
var cagg = require('../callbackAggregator');

exports.init = function (cli) {
  var vm = cli.category('cert')
    .description('Commands to manage your Azure certificates');
    
  var logger = cli.output;
    
  vm.command('list')
    .description('List Azure certificates')
    .option('-i, --subscription <id>', 'use the subscription id')
    .option('-d, --dns-prefix <name>', 'only show certs for this DNS prefix')
    .execute(function(options, callback) {
      var channel = utils.createServiceManagementService(cli.category('account').lookupSubscriptionId(options.subscription),
        cli.category('account'), logger);
        
      var certs = [];
        
      function listCerts(hostedService, callback) {
        utils.doServiceManagementOperation(channel, 'listCertificates', hostedService, function(error, response) {
          callback(error, response, hostedService);
        });
      };

      function printResults() {
        if (certs.length > 0) {
          logger.table(certs, function (row, item) {
            if (item.service) {
              row.cell('Service', item.service);
            }

            row.cell('Thumbprint', item.cert.Thumbprint);
            row.cell('Algorithm', item.cert.ThumbprintAlgorithm);
          });
        } else {
          logger.info('No certificates found');
        }
        
        callback();
      };

      var progress;
      if (!options.hostedService) {
        progress = cli.progress('Fetching cloud services');
        utils.doServiceManagementOperation(channel, 'listHostedServices', function(error, response) {
          progress.end();
          if (!error) {
            var pending = 0;
            var hostedServices = response.body;
            progress = cli.progress('Fetching certificates');
            
            function forEachService(error, response, service) {
              pending--;
              if (pending === 0) {
                progress.end();
              }

              if (!error) {
                var serviceCerts = response.body;
                for (var j = 0; j < serviceCerts.length; j++) {
                  certs.push({
                    service: service,
                    cert: serviceCerts[j]
                  });
                }
                
                if (pending === 0) {
                  printResults();
                }
              } else {
                callback(error);
              }
            };

            for (var i = 0; i < hostedServices.length; i++) {
              var hostedService = hostedServices[i].ServiceName;
              pending++;
              listCerts(hostedService, forEachService);
            }
          } else {
            callback(error);
          }
        });
      } else {
        progress = cli.progress('Fetching certificates');
        listCerts(options.hostedService, function(error, response) {
          progress.end();
          var serviceCerts = response.body;
          for (var i = 0; i < serviceCerts.length; i++) {
            certs.push({ cert: serviceCerts[i] });
          }
          
          printResults();
        });
      }
    });
    
  vm.command('create <dns-prefix> <file> <format> [password]')
    .usage('<dns-prefix> <file> <format> [password]')
    .description('Upload certificate')
    .option('-i, --subscription <id>', 'use the subscription id')
    .execute(function(dnsPrefix, file, format, password, options, callback) {
      if (!password && password !== '') {
        cli.password('Cert password: ', '*', function(pwd){
          password = pwd;
          process.stdin.pause();
          createCert();
        });
      } else {
        createCert();
      }
      
      function createCert() {
        var channel = utils.createServiceManagementService(cli.category('account').lookupSubscriptionId(options.subscription),
          cli.category('account'), logger);

        var data = fs.readFileSync(file);
         
        var progress = cli.progress('Creating certificate');
        utils.doServiceManagementOperation(channel, 'addCertificate', dnsPrefix, data, format, password, function(error, response) {
          progress.end();
          callback(error);
        });
      }
    });

  vm.command('delete <thumbprint>')
    .description('Delete certificate')
    .option('-i, --subscription <id>', 'use the subscription id')
    .option('-d, --dns-prefix <name>', 'only look for certs for this DNS prefix')
    .execute(function(thumbprint, options, callback) {
     
    var channel = utils.createServiceManagementService(cli.category('account').lookupSubscriptionId(options.subscription),
      cli.category('account'), logger);

    var progress = cli.progress('Deleting certificate');
    if (options.dnsPrefix) {
      utils.doServiceManagementOperation(channel, 'deleteCertificate', options.dnsPrefix, 'sha1', thumbprint, function(error, response) {
        progress.end();
        callback(error);
      });
      return;
    }
    utils.doServiceManagementOperation(channel, 'listHostedServices', function(error, response) {
      if (error) {
        callback(error);
        return;
      }

      var deleted = 0;
      var hardError = null;
      var caagg = cagg.callbackAndAggregator(function() {
        progress.end();
        var error = hardError ? hardError : (deleted ? undefined : 'Thumbprint not found within this subscription');
        callback(error);
      });
      var hostedServices = response.body;
      for (var i = 0; i < hostedServices.length; i++) {
        var dnsPrefix = hostedServices[i].ServiceName;
        logger.silly('Trying DNS prefix: ' + dnsPrefix);
        (function() { // create a closure to capture dnsPrefix in callback
          var curName = dnsPrefix;
          var caagCallback = caagg.getCallback(dnsPrefix); // insert name
          utils.doServiceManagementOperation(channel, 'deleteCertificate', dnsPrefix, 'sha1', thumbprint,
              function(error, response) {
            if (error && error.code !== 'ResourceNotFound') {
              hardError = hardError || error;
              logger.verbose(curName + ' : error ' + error.code);
            } else {
              deleted += !error;
              (!error ? logger.info : logger.verbose)(curName + (error ? ' : no such cert' : ' : cert deleted'));
            }
            caagCallback(); // do not pass errors because we don't want to stop on them
          });
        })();
      }
    });
  });
};

