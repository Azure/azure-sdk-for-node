
var fs = require('fs');
var path = require('path');
var xml2js = require('xml2js');
var assert = require('assert');
var pfx2pem = require('../../util/certificates/pkcs').pfx2pem;

exports.init = function (cli) {

    var log = cli.output;

    var account = cli.category('account');

    var config = cli.category('config')
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


    config.readConfig = function () {
        var wazPath = path.join(homeFolder(), '.azure');
        var wazConfigPath = path.join(wazPath, 'config.json');
        var cfg = {};
        log.silly('Reading config', wazConfigPath);

        if (path.existsSync(wazConfigPath)) {
            try {
                cfg = JSON.parse(fs.readFileSync(wazConfigPath));
            }
            catch (err) {
                log.warn('Unable to read settings');
                cfg = {};
            }
            log.json('silly', cfg);
        }
        return cfg;
    };

    config.writeConfig = function (cfg) {
        var wazPath = path.join(homeFolder(), '.azure');
        var wazConfigPath = path.join(wazPath, 'config.json');

        if (!path.existsSync(wazPath)) {
            log.silly('Creating folder', wazPath);
            fs.mkdirSync(wazPath, 0766);
        }
        log.silly('Writing config', wazConfigPath);
        fs.writeFileSync(wazConfigPath, JSON.stringify(cfg));
    };

    // added temporarily for back-compat
    cli.category('account').readConfig = config.readConfig;
    cli.category('account').writeConfig = config.writeConfig;

    // apply any persistant switches at load-time
    function applyGlobalSettings() {
        var cfg = config.readConfig();
        if (!cfg) {
            return;
        }
        if (cfg.labels === 'off') {
            log.format({ terse: true });
        }
    }

    applyGlobalSettings();

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
