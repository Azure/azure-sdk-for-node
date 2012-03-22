
var url = require('url');
var querystring = require('querystring');
var Channel = require('../channel');

return;

var child_process = require('child_process');

exports.init = function (cli) {
    var log = cli.output;
    var site = cli.category('site');
    
    var deploy = site.command('push <name>')
        .description('Publish the current directory as web site via git')
        .option('-s, --subscription <id>', 'use the subscription id')
        .execute(function (name, options, _) {

            log.json(url.parse('http://a:b@c.com/d?e#f'));

            var context = {
                subscription: cli.category('account').lookupSubscriptionId(options.subscription),
                site: {
                    name: name
                }
            };

            site.lookupSiteWebSpace(context, _);
            var siteConfig = site.doSiteConfigGet(context, _);
            var repositoryData = site.doRepositoryGet(context, _);
            var repositoryUrl = url.parse(repositoryData);

            repositoryUrl.pathname = name + '.git';
            repositoryUrl.auth = querystring.escape('$' + name) + ':' + querystring.escape(siteConfig.PublishingPassword);
            repositoryUrl.protocol = 'http:';
            delete repositoryUrl.host;
            log.json(url.format(repositoryUrl));

            log.json(siteConfig);
            log.json(repositoryData);
            log.json(repositoryUrl);
        });

    //    deploy.command('list')
    //        .description('Show deployment history')
    //        .action(function () { });

    //    deploy.command('activate')
    //        .description('Reactivate a specific deployment')
    //        .action(function () { });
};
