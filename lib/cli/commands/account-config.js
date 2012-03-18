
var fs = require('fs');
var path = require('path');
var xml2js = require('xml2js');
var assert = require('assert');
var pfx2pem = require('../../util/certificates/pkcs').pfx2pem;

exports.init = function (cli) {

    var log = cli.output;

    var account = cli.category('account');

    var config = account.category('config')
        .description('Manage settings in your config file.');

    config.command('list')
        .description('Display config settings.')
        .action(function (options) {
            log.info('Displaying config settings');

            var cfg = account.readConfig();

            log.table(cfg, function (row, name) {
                row.cell('Setting', name);
                row.cell('Value', cfg[name]);
            });
        });

    config.command('set <name> <value>')
        .description('Change a config setting.')
        .action(function (name, value, options) {
            log.info('Setting \'' + name + '\' to value \'' + value + '\'');
            var cfg = account.readConfig();
            cfg[name] = value;
            account.writeConfig(cfg);
            log.info('Changes saved.');
        });


};
