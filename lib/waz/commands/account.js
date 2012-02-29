
exports.init = function(waz) {

    var account = waz.category('account')
        .description('Manage your account information and publish settings on the current machine.');

    account.command('info')
        .description('Display the current account info.')
        .action(function() {
            console.log('Displaying account info');
        });
    
    account.command('import [publishsettings-file]')
        .description('Download or import a publishsettings file for your Azure account.')
        .action(function(publishSettingsFile) {
            console.log('importing: ', publishSettingsFile);
        });
        
    account.command('clear')
        .description('Remove any of the stored account info stored by import.')
        .action(function() {
            console.log('Clearing account info.');
        });

};
