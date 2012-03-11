
var fs = require('fs');
var path = require('path');
var assert = require('assert');

exports.init = function (waz) {

    var account = waz.category('account')
        .description('Manage your account information and publish settings on the current machine.');


    account.defaultSubscriptionId = function () {
        return '51ca709f-562d-4d4f-8efc-46de5833042e';
    };


    account.command('info')
        .description('Display the current account info.')
        .action(function () {
            console.log('Displaying account info');
        });

    account.command('download')
        .description('Download or import a publishsettings file for your Azure account.')
        .action(function (publishSettingsFile) {
            console.log('importing: ', publishSettingsFile);
        });

    account.command('import <file>')
        .description('Download or import a publishsettings file for your Azure account.')
        .action(function (publishSettingsFile) {
            console.log('importing: ', publishSettingsFile);

            var wazPath = path.join(process.env.HOME, '.waz');

            var targetFilePath = path.join(wazPath, 'publishSettings.xml');

            fs.stat(wazPath, function (err, stat) {
                console.log(stat);
                if (err) {
                    fs.mkdirSync(wazPath, 0766);
                } else {
                    //assert.equal(stat.isDirectory());
                }

                // host owin->aspnet
                //   builder.RunAspNet()

                var reader = fs.createReadStream(publishSettingsFile, { flags: 'r' });
                var writer = fs.createWriteStream(targetFilePath, { flags: 'w', mode: 0600 });
                reader.pipe(writer);
            });
        });

    account.command('clear')
        .description('Remove any of the stored account info stored by import.')
        .action(function () {
            console.log('Clearing account info.');
        });

};
