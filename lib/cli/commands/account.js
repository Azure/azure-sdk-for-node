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


var assert = require('assert');
var fs = require('fs');
var path = require('path');
var util = require('util');
var xml2js = require('xml2js');
var azureUtils = require('../../util/util');
var common = require('../common');
var utils = require('../utils');
var constants = require('../constants');
var pfx2pem = require('../../util/certificates/pkcs').pfx2pem;
var keyFiles = require('../keyFiles');
var cacheUtils = require('../cacheUtils');

exports.init = function (cli) {
  var log = cli.output;
  var azureDirectory = utils.azureDir();
  var pemPath = path.join(azureDirectory, 'managementCertificate.pem');
  var publishSettingsFilePath = path.join(azureDirectory, 'publishSettings.xml');

  var account = cli.category('account')
        .description('Manage your account information and publish settings');

  account.command('download')
        .whiteListPowershell()
        .description('Launch a browser to download your publishsettings file')
        .execute(function (options, callback) {
          try {
            var url = constants.DEFAULT_PUBLISHINGPROFILE_URL;
            common.launchBrowser(url);
            log.help('Save the downloaded file, then execute the command');
            log.help('  account import <file>');
            callback();
          }
          catch (err) {
            callback(err);
          }
        });

  account.command('import <file>')
        .whiteListPowershell()
        .description('Import a publishsettings file or certificate for your account')
        .execute(function (file, options, callback) {
          log.verbose('Importing file ' + file);

          // Is it a .pem file?
          var keyCertValues = keyFiles.readFromFile(file);
          var keyPresent = !!keyCertValues.key;
          var certPresent = !!keyCertValues.cert;
          if (keyPresent + certPresent === 1) {
            // Exactly one of them present.  Tell the user about the error.
            // Do not try this file as xml or pfx
            callback('File ' + file + ' needs to contain both private key and cert, but only ' +
                    (keyCertValues.key ? 'key' : 'certificate') + ' was found.');
          } else if (keyCertValues.key && keyCertValues.cert) {
            // Both key and cert are present.
            keyFiles.writeToFile(pemPath, keyCertValues);
            log.verbose('Key and cert have been written to ' + pemPath);
          } else {
            // Try to open as publishsettings or pfx.
            log.silly(file + ' does not appear to be a PEM file. Reading as publish settings file.');
            var parser = new xml2js.Parser();
            var publishSettings = null;
            parser.on('end', function (settings) { publishSettings = settings; });
            var readBuffer = fs.readFileSync(file);
            try {
              parser.parseString(readBuffer);
            } catch (err) {
              if (err.toString().indexOf('Non-whitespace before first tag') === -1) {
                // This looks like an xml parsing error, not PFX.
                callback(err);
              }

              log.silly('Unable to read file as xml publish settings file. Assuming it is pfx');
              publishSettings = null;
            }

            if (publishSettings) {
              processSettings(file, publishSettings);
            } else {
              convertPfx(readBuffer);
            }
          }

          cacheUtils.clear();
          if (publishSettings && publishSettings.PublishProfile.Subscription['@']) {
            return cli.category('site').doSpacesGet({ subscription: publishSettings.PublishProfile.Subscription['@'].Id }, 
                function(error) {
              if (error) {
                var message = error.Message;
                if (typeof message === 'string' && message.indexOf('The subscription is not authorized for this feature.') >= 0) {
                  log.silly('Error getting site locations - ignored: ', error);
                  error = undefined;
                }
              }
              callback(error);
            });
          }
          return callback();

          function convertPfx(pfx) {
            var pem = pfx2pem(pfx);
            utils.writeFileSyncMode(pemPath, pem.toString(), 'utf8');
            log.verbose('Converted PFX data to ' + pemPath);
          }

          function processSettings(file, settings) {
            if (!settings.PublishProfile ||
                !settings.PublishProfile['@'] ||
                !settings.PublishProfile['@'].ManagementCertificate) {
              throw new Error('Invalid publishSettings file. Use "azure account download" to download publishing credentials.');
            }

            var attribs = settings.PublishProfile['@'];
            var subs = settings.PublishProfile.Subscription;
            if (typeof subs === 'undefined' || subs === undefined) {
              subs = [];
            } else if (typeof (subs[0]) === 'undefined') {
              subs = [subs];
            }

            if (attribs.Url) {
              var endpointInfo = utils.validateEndpoint(attribs.Url);
              var config = account.readConfig();
              config.endpoint = endpointInfo.endpointHost;
              config.port = endpointInfo.endpointPort;
              account.writeConfig(config);
              log.info('Setting service endpoint to:', config.endpoint);
              log.info('Setting service port to:', config.port);
            }

            if (subs.length === 0) {
              log.warning('Importing profile with no subscriptions');
            }
            else {
              for (var index in subs) {
                log.info('Found subscription:', subs[index]['@'].Name);
                log.verbose('  Id:', subs[index]['@'].Id);
              }
            }

            log.verbose('Parsing management certificate');
            var pfx = new Buffer(attribs.ManagementCertificate, 'base64');
            convertPfx(pfx);

            log.verbose('Storing account information at', publishSettingsFilePath);
            utils.writeFileSyncMode(publishSettingsFilePath, readBuffer); // folder already created by convertPfx()
            if (subs.length !== 0) {
              log.info('Setting default subscription to:', subs[0]['@'].Name);
              var config = account.readConfig();
              config.subscription = subs[0]['@'].Id;
              account.writeConfig(config);
            }
            log.warn('The \'' + file + '\' file contains sensitive information.');
            log.warn('Remember to delete it now that it has been imported.');
            log.info('Account publish settings imported successfully');
          }
        });

  account.command('clear')
        .whiteListPowershell()
        .description('Remove any of the stored account info stored by import or config set')

        .action(function () {
          function deleteIfExists(file, isDir) {
            if (path.existsSync(file)) {
              log.silly('Removing ' + file);
              (isDir ? fs.rmdirSync : fs.unlinkSync)(file);
              return true;
            } else {
              log.silly(file + ' does not exist');
            }
          }
          var isDeleted = deleteIfExists(pemPath);
          isDeleted = deleteIfExists(publishSettingsFilePath) || isDeleted; // in this order only
          isDeleted = account.clearConfig() || isDeleted;
          isDeleted = cacheUtils.clear() || isDeleted;
          try {
            deleteIfExists(azureDirectory, true);
          } catch (err) {
            log.warn('Couldn\'t remove ' + azureDirectory);
          }
          log.info(isDeleted ? 'Account settings cleared successfully'
              : 'Account settings are already clear');
        });

  var affinityGroup = account.category('affinity-group')
        .description('Commands to manage your Azure affinity groups');

  affinityGroup.command('list')
        .description('List locations available for your account')
        .execute(function (options, callback) {
          listLAG('AffinityGroups', options, callback);
        });

  function listLAG(what, options, callback) {
    var channel = utils.createServiceManagementService(cli.category('account').lookupSubscriptionId(options.subscription),
        cli.category('account'), log);

    var textName = what.replace(/([A-Z])/g, ' $1').toLowerCase();
    var progress = cli.progress('Fetching' + textName);
    utils.doServiceManagementOperation(channel, 'list' + what, function (error, response) {
      progress.end();
      if (!error) {
        if (response.body.length > 0) {
          log.table(response.body, function (row, item) {
            row.cell('Name', item.Name);
            if ('DisplayName' in item) { // for location
              row.cell('Display Name', item.DisplayName);
            }
            if ('Label' in item) {
              row.cell('Label', Buffer(item.Label, 'base64').toString());
            }
            if ('Location' in item) {
              row.cell('Location', item.Location || '');
            }
          });
        } else {
          if (log.format().json) {
            log.json([]);
          } else {
            log.info('No' + textName + ' found');
          }
        }
      }
      callback(error);
    });
  }
  account.listLAG = listLAG;

  var storage = account.category('storage')
        .description('Commands to manage your Azure storage account');

  storage.command('list')
        .description('List storage accounts available for your account')
        .execute(function (options, callback) {
          var channel = utils.createServiceManagementService(cli.category('account').lookupSubscriptionId(options.subscription),
              cli.category('account'), log);

          var progress = cli.progress('Fetching storage accounts');
          utils.doServiceManagementOperation(channel, 'listStorageAccounts', function (error, response) {
            progress.end();
            if (!error) {
              if (response.body.length > 0) {
                log.table(response.body, function (row, item) {
                  row.cell('Name', item.ServiceName);
                  var storageServiceProperties = item.StorageServiceProperties;
                  if ('Label' in storageServiceProperties) {
                    row.cell('Label', Buffer(storageServiceProperties.Label, 'base64').toString());
                  }
                  if ('Location' in storageServiceProperties) {
                    row.cell('Location', storageServiceProperties.Location);
                  }
                });
              } else {
                if (log.format().json) {
                  log.json([]);
                } else {
                  log.info('No storage accounts found');
                }
              }
            }
            callback(error);
          });
        });

  account.readPublishSettings = function () {
    var publishSettings = {};

    var parser = new xml2js.Parser();
    parser.on('end', function (result) { publishSettings = result; });
    try {
      log.silly('Reading publish settings', publishSettingsFilePath);
      var readBuffer = fs.readFileSync(publishSettingsFilePath);
      parser.parseString(readBuffer);
    } catch (err) {
      // publish settings file is not expected for all scenarios
    }

    return publishSettings;
  };

  account.defaultSubscriptionId = function () {
    return account.readConfig().subscription;
  };

  account.lookupSubscriptionId = function (subscription) {
    // use default subscription if not passed as an argument
    if (subscription === undefined) {
      subscription = account.readConfig().subscription;
    }

    // load and normalize publish settings
    var publishSettings = account.readPublishSettings();

    if (publishSettings && publishSettings.PublishProfile) {
      var subs = publishSettings.PublishProfile.Subscription;
      if (subs === 'undefined') {
        subs = [];
      } else if (typeof (subs[0]) === 'undefined') {
        subs = [subs];
      }

      // use subscription id when the subscription name matches
      for (var index in subs) {
        if (subs[index]['@'].Name === subscription) {
          return subs[index]['@'].Id;
        }
      }
    }

    return subscription;
  };

  account.managementCertificate = function () {
    var pemFile = path.join(utils.azureDir(), 'managementCertificate.pem');
    log.silly('Reading pem', pemFile);
    return keyFiles.readFromFile(pemFile);
  };

  account.endpointHost = function () {
    return account.readConfig().endpoint;
  };

  account.endpointPort = function () {
    return account.readConfig().port;
  };

  account.hostNameSuffix = function () {
    return process.env.AZURE_HOSTNAME_SUFFIX || constants.DEFAULT_HOSTNAME_SUFFIX;
  };
};

