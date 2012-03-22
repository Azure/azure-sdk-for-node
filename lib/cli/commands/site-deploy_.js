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


var url = require('url');
var querystring = require('querystring');
var Channel = require('../channel');



var child_process = require('child_process');

exports.init = function (cli) {
    var log = cli.output;
    var site = cli.category('site');

    var deploy = site.command('push [name]')
        .description('Publish the current directory as web site via git')
        .option('-s, --subscription <id>', 'use the subscription id')
        .execute(function (name, options, _) {

            //    log.json(url.parse('http://a:b@c.com/d?e#f'));

            var context = {
                subscription: cli.category('account').lookupSubscriptionId(options.subscription),
                site: {
                    name: name
                }
            };
            site.lookupSiteName(context, _);
            site.lookupSiteWebSpace(context, _);
            var siteConfig = site.doSiteConfigGet(context, _);
            var repositoryData = site.doRepositoryGet(context, _);
            var repositoryUrl = url.parse(repositoryData);

            repositoryUrl.pathname = context.site.name + '.git';
            repositoryUrl.auth = querystring.escape('$' + context.site.name) + ':' + querystring.escape(siteConfig.PublishingPassword);
            repositoryUrl.protocol = 'http:';
            delete repositoryUrl.host;

            var result = exec('git push ' + url.format(repositoryUrl) + ' HEAD:master -f', _);
            (result.stdout + result.stderr).split('\n').forEach(function (line) {
                log.data(line.replace(/:\/\/[^@]*@/, '://...@'));
            });
        });

    function exec(cmd, cb) {
        child_process.exec(cmd, function (err, stdout, stderr) {
            cb(err, { 
                stdout:stdout,
                stderr:stderr
            });
        });
    }

    //    deploy.command('list')
    //        .description('Show deployment history')
    //        .action(function () { });

    //    deploy.command('activate')
    //        .description('Reactivate a specific deployment')
    //        .action(function () { });
};
