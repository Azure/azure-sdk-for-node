
exports.init = function(waz) {

    var site = waz.category('site')
        .description('Commands to manage your Azure web sites.');
    
    site.command('list')
        .description('List your Azure web sites.')
        .option('-s, --subscription <id>', 'use the subscription id')
        .action(function() {
            console.log('this is your list');
        });
        
    site.command('init <site-name>')
        .description('Initialize your Azure web site.')
        .option('-s, --subscription <id>', 'use the subscription id')
        .action(function(siteName, options) {
            console.log('creating your site \'%s\'', siteName);
            if (options.subscription) {
                console.log('using subscription \'%s\'', options.subscription);                
            }
        });
};
