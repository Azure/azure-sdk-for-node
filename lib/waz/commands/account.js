
var fs = require('fs');
var path = require('path');
var xml2js = require('xml2js');
var assert = require('assert');
var pfx2pem = require('../../util/certificates/pkcs').pfx2pem;

exports.init = function (waz) {

    var log = waz.output;

    var account = waz.category('account')
        .description('Manage your account information and publish settings on the current machine.');


    account.command('info')
        .description('Display the current account info.')
        .action(function () {
            console.log('Displaying account info');
        });

    account.command('download')
        .description('Download or import a publishsettings file for your Azure account.')
        .action(function (publishSettingsFile) {
            console.log('downloading: ', publishSettingsFile);
        });

    account.command('import <file>')
        .description('Download or import a publishsettings file for your Azure account.')
        .action(function (publishSettingsFile) {
            log.info('Importing publish settings file', publishSettingsFile);

            var wazPath = path.join(process.env.HOME, '.waz');
            var wazPushlishSettingsFilePath = path.join(wazPath, 'publishSettings.xml');
            var wazManagementCertificateFilePath = path.join(wazPath, 'managementCertificate.pem');

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
                        log.info('Profile applies to subscription');
                        log.data('  Name:', subs[index]['@'].Name);
                        log.data('  Id:', subs[index]['@'].Id);
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
                    log.silly('Writing to file', wazPushlishSettingsFilePath);
                    var writer = fs.createWriteStream(wazPushlishSettingsFilePath, { flags: 'w', mode: 0600 });
                    reader.pipe(writer);
                    reader.on('end', function () {
                        log.silly('Writing to file', wazManagementCertificateFilePath);

                        var writer = fs.createWriteStream(wazManagementCertificateFilePath, { flags: 'w', mode: 0600 });
                        writer.write(pem, pem.toString());
                        writer.end();

                        log.info('Account publish settings imported successfully');
                    });
                });
            }
        });

    account.command('clear')
        .description('Remove any of the stored account info stored by import.')
        .action(function () {
            console.log('Clearing account info.');
        });

    account.defaultSubscriptionId = function () {
        return '51ca709f-562d-4d4f-8efc-46de5833042e';
    };

};
