
var fs = require('fs');
var path = require('path');
var xml2js = require('xml2js');
var assert = require('assert');
var pfx2pem = require('../../util/certificates/pkcs').pfx2pem;

exports.init = function (cli) {

    var log = cli.output;

    var account = cli.category('account')
        .description('Manage your account information and publish settings.');


    account.command('download')
        .description('Download or import a publishsettings file for your Azure account.')
        .action(function (publishSettingsFile) {
            console.log('downloading: ', publishSettingsFile);
        });

    account.command('import <file>')
        .description('Download or import a publishsettings file for your Azure account.')
        .action(function (publishSettingsFile) {
            log.info('Importing publish settings file', publishSettingsFile);

            var wazPath = path.join(process.env.HOME, '.azure');
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
                if (typeof (subs[0]) === 'undefined') {
                    subs = [subs];
                }

                if (subs.length == 0) {
                    log.warning('Importing profile with no subscriptions');
                }
                else {
                    for (var index in subs) {
                        log.info('Found subscription:', subs[index]['@'].Name);
                        //log.info('Profile applies to subscription');
                        //log.verbose('  Name:', subs[index]['@'].Name);
                        log.verbose('  Id:', subs[index]['@'].Id);
                    }
                }

                log.verbose('Parsing management certificate');
                var pfx = new Buffer(attribs.ManagementCertificate, 'base64');
                var pem = pfx2pem(pfx);

                log.verbose('Storing account information at', wazPath);
                fs.stat(wazPath, function (err, stat) {
                    if (err) {
                        fs.mkdirSync(wazPath, 0766);
                    } else {
                        //assert.equal(stat.isDirectory());
                    }
                    var reader = fs.createReadStream(publishSettingsFile, { flags: 'r' });
                    log.silly('Writing to file', wazPublishSettingsFilePath);
                    var writer = fs.createWriteStream(wazPublishSettingsFilePath, { flags: 'w', mode: 0600 });
                    reader.pipe(writer);
                    reader.on('end', function () {
                        log.silly('Writing to file', wazManagementCertificatePemFilePath);
                        var writer = fs.createWriteStream(wazManagementCertificatePemFilePath, { flags: 'w', mode: 0600 });
                        writer.write(pem, pem.toString());
                        writer.end();

                        log.silly('Writing to file', wazManagementCertificatePfxFilePath);
                        var writer = fs.createWriteStream(wazManagementCertificatePfxFilePath, { flags: 'w', mode: 0600 });
                        writer.write(pfx, pfx.toString());
                        writer.end();

                        if (subs.length != 0) {
                            log.info('Setting default subscription to:', subs[0]['@'].Name);
                            var config = account.readConfig();
                            config.subscription = subs[0]['@'].Id;
                            account.writeConfig(config);
                        }

                        log.info('Account publish settings imported successfully');
                    });
                });
            }
        });

    account.command('settings')
        .description('Display and alter the stored account defaults.')
        .option('-s, --subscription <id>', 'use the subscription id as the default')
        .action(function (options) {
            var config = account.readConfig();

            if (options.subscription) {
                log.info('Setting default subscription to', options.subscription);
                config.subscription = options.subscription;
                account.writeConfig(config);
            }

            log.table(config, function (row, name) {
                row.cell('Setting', name);
                row.cell('Value', config[name]);
            });
        });

    account.command('clear')
        .description('Remove any of the stored account info stored by import.')
        .action(function () {
            console.log('Clearing account info.');
        });


    account.readConfig = function () {
        var wazPath = path.join(process.env.HOME, '.azure');
        var wazConfigPath = path.join(wazPath, 'config.json');
        var config = {};
        log.silly('Reading config', wazConfigPath);
        if (path.existsSync(wazConfigPath)) {
            try {
                config = JSON.parse(fs.readFileSync(wazConfigPath));
            }
            catch (err) {
                log.warn('Unable to read settings');
                config = {};
            }
        }
        return config;
    };

    account.writeConfig = function (config) {
        var wazPath = path.join(process.env.HOME, '.azure');
        var wazConfigPath = path.join(wazPath, 'config.json');
        log.silly('Writing config', wazConfigPath);
        fs.writeFileSync(wazConfigPath, JSON.stringify(config));
    };

    account.defaultSubscriptionId = function () {
        return account.readConfig().subscription;
    };

    account.managementCertificate = function () {
        var wazPath = path.join(process.env.HOME, '.azure');
        var wazManagementCertificateFilePath = path.join(wazPath, 'managementCertificate.pem');
        log.silly('Reading cert', wazManagementCertificateFilePath);
        return fs.readFileSync(wazManagementCertificateFilePath);
    };

};
