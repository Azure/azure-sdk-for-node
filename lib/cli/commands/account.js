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
var pfx2pem = require('../../util/certificates/pkcs').pfx2pem;
var keyFiles = require('../keyFiles');

exports.init = function (cli) {
  var log = cli.output;

  var account = cli.category('account')
        .description('Manage your account information and publish settings');

  account.command('download')
        .whiteListPowershell()
        .description('Launch a browser to download your publishsettings file')
        .execute(function (options, callback) {
          try {
            var url = 'https://windows.azure-preview.com/download/publishprofile.aspx';
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
          var pemPath = path.join(azureDir(), 'managementCertificate.pem');
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
              processSettings(publishSettings);
            } else {
              convertPfx(readBuffer);
            }
          }

          callback();

          function convertPfx(pfx) {
            var pem = pfx2pem(pfx);
            var name = path.join(azureDir(), 'managementCertificate.pem');
            utils.writeFileSyncMode(name, pem.toString(), 'utf8');
            log.verbose('Converted PFX data to ' + name);
          }

          function processSettings(settings) {
            var attribs = settings.PublishProfile['@'];
            var subs = settings.PublishProfile.Subscription;
            if (typeof subs === 'undefined' || subs === undefined) {
              subs = [];
            } else if (typeof (subs[0]) === 'undefined') {
              subs = [subs];
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

            var publishSettingsFilePath = path.join(azureDir(), 'publishSettings.xml');

            log.verbose('Storing account information at', publishSettingsFilePath);
            utils.writeFileSyncMode(publishSettingsFilePath, readBuffer); // folder already created by convertPfx()
            if (subs.length !== 0) {
              log.info('Setting default subscription to:', subs[0]['@'].Name);
              var config = account.readConfig();
              config.subscription = subs[0]['@'].Id;
              account.writeConfig(config);
            }
            log.warn('The \'' + publishSettingsFilePath + '\' file contains sensitive information.');
            log.warn('Remember to delete it now that it has been imported.');
            log.info('Account publish settings imported successfully');
          }
        });

  account.command('clear')
        .whiteListPowershell()
        .description('Remove any of the stored account info stored by import')
        .action(function () {
          log.info('Clearing account info.');
        });

  account.readPublishSettings = function () {
    var wazPublishSettingsFilePath = path.join(azureDir(), 'publishSettings.xml');

    var publishSettings = {};

    var parser = new xml2js.Parser();
    parser.on('end', function (result) { publishSettings = result; });
    try {
      log.silly('Reading publish settings', wazPublishSettingsFilePath);
      var readBuffer = fs.readFileSync(wazPublishSettingsFilePath);
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
    var pemFile = path.join(azureDir(), 'managementCertificate.pem');
    log.silly('Reading pem', pemFile);
    return keyFiles.readFromFile(pemFile);
  };

  function homeFolder() {
    if (process.env.HOME !== undefined) {
      return process.env.HOME;
    }
    if (process.env.HOMEDRIVE && process.env.HOMEPATH) {
      return process.env.HOMEDRIVE + process.env.HOMEPATH;
    }
    throw new Error('No HOME path available');
  }

  function azureDir() {
    var dir = path.join(homeFolder(), '.azure');

    if (!path.existsSync(dir)) {
      fs.mkdirSync(dir, 502); // 0766
    }

    return dir;
  }
};
