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


var common = require('../common');
var fs = require('fs');
var path = require('path');
var xml2js = require('xml2js');
var assert = require('assert');
var pfx2pem = require('../../util/certificates/pkcs').pfx2pem;

exports.init = function (cli) {

    var log = cli.output;

    var account = cli.category('account')
        .description('Manage your account information and publish settings');


    account.command('download')
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
        .description('Import a publishsettings file for your account')
        .action(function (publishSettingsFile) {
            log.info('Importing publish settings file', publishSettingsFile);

            var wazPath = path.join(homeFolder(), '.azure');
            var wazPublishSettingsFilePath = path.join(wazPath, 'publishSettings.xml');
            var wazManagementCertificatePfxFilePath = path.join(wazPath, 'managementCertificate.pfx');
            var wazManagementCertificatePemFilePath = path.join(wazPath, 'managementCertificate.pem');

            var parser = new xml2js.Parser();
            parser.on('end', processSettings);
            try {
                var readBuffer = fs.readFileSync(publishSettingsFile);
                parser.parseString(readBuffer);
            } catch (err) {
                log.error('Unable to read publish settings file');
                log.error(err);
            }
            function processSettings(settings) {
                var attribs = settings.PublishProfile['@'];
                var subs = settings.PublishProfile.Subscription;
                if (subs === 'undefined') {
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
                var pem = pfx2pem(pfx);

                log.verbose('Storing account information at', wazPath);
                fs.stat(wazPath, function (err, stat) {
                    if (err) {
                        fs.mkdirSync(wazPath, 502); //0766
                    } else {
                        //assert.equal(stat.isDirectory());
                    }
                    var reader = fs.createReadStream(publishSettingsFile, { flags: 'r' });
                    log.silly('Writing to file', wazPublishSettingsFilePath);
                    var writer = fs.createWriteStream(wazPublishSettingsFilePath, { flags: 'w', mode: 384 }); // 0600
                    reader.pipe(writer);
                    reader.on('end', function () {
                        log.silly('Writing to file', wazManagementCertificatePemFilePath);
                        var writer = fs.createWriteStream(wazManagementCertificatePemFilePath, { flags: 'w', mode: 384 }); // 0600
                        writer.write(pem, pem.toString());
                        writer.end();

                        log.silly('Writing to file', wazManagementCertificatePfxFilePath);
                        writer = fs.createWriteStream(wazManagementCertificatePfxFilePath, { flags: 'w', mode: 384 }); // 0600
                        writer.write(pfx, pfx.toString());
                        writer.end();

                        if (subs.length !== 0) {
                            log.info('Setting default subscription to:', subs[0]['@'].Name);
                            var config = account.readConfig();
                            config.subscription = subs[0]['@'].Id;
                            account.writeConfig(config);
                        }
                        log.warn('The \'' + publishSettingsFile + '\' file contains sensitive information.');
                        log.warn('Remember to delete it now that it has been imported.');
                        log.info('Account publish settings imported successfully');
                    });
                });
            }
        });

    account.command('clear')
        .description('Remove any of the stored account info stored by import')
        .action(function () {
            console.log('Clearing account info.');
        });


    account.readPublishSettings = function () {
        var wazPath = path.join(homeFolder(), '.azure');
        var wazPublishSettingsFilePath = path.join(wazPath, 'publishSettings.xml');

        var publishSettings = {};

        var parser = new xml2js.Parser();
        parser.on('end', function (result) { publishSettings = result; });
        try {
            log.silly('Reading publish settings', wazPublishSettingsFilePath);
            var readBuffer = fs.readFileSync(wazPublishSettingsFilePath);
            parser.parseString(readBuffer);
        } catch (err) {
            log.error('Unable to read publish settings file');
            log.error(err);
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

        return subscription;
    };

    account.managementCertificate = function () {
        var wazPath = path.join(homeFolder(), '.azure');
        var wazManagementCertificateFilePath = path.join(wazPath, 'managementCertificate.pem');
        log.silly('Reading cert', wazManagementCertificateFilePath);
        return fs.readFileSync(wazManagementCertificateFilePath);
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
};
