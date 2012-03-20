var commander = require('commander');
var fs = require('fs');
var path = require('path');

var log = require('winston');
var colors = require('colors');
var eyes = require('eyes');
var Table = require('easy-table');

require('./patch-winston');


var cli = new commander.Command();
cli.output = log;

cli.exit = function (level, message, exitCode) {
    log.log(level, message);
    process.exit(exitCode);
};


log.format = function(options) {
    var transport = log.default.transports.console;
    
    if (arguments.length == 0) {
        return {
            json: transport.json,
            terse: transport.terse,
            level: transport.level,
        };
    }
    
    if (options.json) {
        log.padLevels = false;
        log.stripColors = true;
        transport.json = true;
    }
    if (options.terse) {
        log.padLevels = false;
        transport.terse = true;
    }
    if (options.level) {
        transport.level = options.level;
    }
};
log.cli();

log.json = function (level, data) {
    if (arguments.length == 1) {
        data = level;
        level = 'data';
    }
    if (log.format().json) {
        log.log(level, typeof data, data);
    }
    else {
        var lines = eyes.inspect(data, level, { stream: false });
        lines.split('\n').forEach(function (line) {
            // eyes all is "cyan" by default, so this property accessor will 
            // fix the entry/exit color codes of the line. it's needed because we're
            // splitting the eyes formatting and inserting winston formatting where it
            // wasn't before.
            log.log(level, line[eyes.defaults.styles.all]);
        });
    }
};


log.table = function (level, data, transform) {
    if (arguments.length == 2) {
        transform = data;
        data = level;
        level = 'data';
    }
    if (log.format().json) {
        log.log(level, "table", data);
    }
    else {
        var table = new Table();
        table.LeftPadder = Table.LeftPadder;
        table.padLeft = Table.padLeft;
        table.RightPadder = Table.RightPadder;
        table.padRight = Table.padRight;

        if (data && data.forEach) {
            data.forEach(function (item) { transform(table, item); table.newLine(); });
        }
        else if (data) {
            for (var item in data) {
                transform(table, item);
                table.newLine();
            }
        }

        var lines = table.toString();
        lines.substring(0, lines.length - 1).split('\n').forEach(function (line) {
            log.log(level, line);
        });
    }
}



function enableNestedCommands(command) {
    command.option('-v, --verbose', 'use verbose output');
    command.option('--json', 'use json output');

    command.categories = {};

    command.category = function (name) {
        var category = command.categories[name];
        if (!command.categories[name]) {
            category = command.categories[name] = new commander.Command();
            category.parent = this;
            category.name = name;
            category.helpInformation = categoryHelpInformation;
            enableNestedCommands(category);
        }
        return category;
    };

    command.on('*', function () {
        var args = command.rawArgs.slice(0, 2);
        var raw = command.normalize(command.rawArgs.slice(2));

        var verbose = 0;
        var json = 0;
        var category = '*';
        for (var i = 0, len = raw.length; i < len; ++i) {
            if (raw[i] === '--json') {
                ++json;
            }
            else if (raw[i] === '-v' || raw[i] === '--verbose') {
                ++verbose;
            } else if (category === '*') {
                category = raw[i];
            } else {
                args.push(raw[i]);
            }
        }

        if (verbose || json) {
            var opts = {};
            if (json) {
                opts.json = true;
            }
            if (verbose == 1) {
                opts.level = 'verbose';
            }
            if (verbose >= 2) {
                opts.level = 'silly';
            }
            log.format(opts);
        }

        if (!command.categories[category]) {
            log.error('\'' + category + '\' is not an azure command. See \'azure help\'.');
        } else {
            command.categories[category].parse(args);
            if (command.categories[category].args.length == 0) {
                args.push('-h');
                command.categories[category].parse(args);
            }
        }
    });
}


commander.Command.prototype.execute = function (fn) {
    var self = this;
    return self.action(function () {
        log.info('Executing command ' + self.fullName().bold);

        try {
            var args = [];
            for (var i = 0; i != arguments.length; ++i) {
                args.push(arguments[i]);
            }
            args.push(callback);
            fn.apply(this, args);
        }
        catch (err) {
            callback(err);
        }

        function callback(err) {
            if (err) {
                if (err.message) {
                    log.error(err.message);
                    //log.verbose('stack', err.stack);
                    log.json('silly', err);
                }
                else if (err.Message) {
                    log.error(err.Message);
                    log.json('verbose', err);
                }
                else {
                    log.error(err);
                }

                cli.exit('error', self.fullName().bold + ' command ' + 'failed'.red.bold, -1);
            } else {
                cli.exit('info', self.fullName().bold + ' command ' + 'OK'.green.bold, 0);
            }
        }
    });
};


enableNestedCommands(cli);

cli.helpInformation = rootHelpInformation;
commander.Command.prototype.helpInformation = commandHelpInformation;
commander.Command.prototype.fullName = function () {
    var name = this.name;
    var scan = this.parent;
    while (scan.parent !== undefined) {
        name = scan.name + ' ' + name;
        scan = scan.parent;
    }
    return name;
};

function rootHelpInformation() {
    log.info('            )      (        '.red);
    log.info('   (     ( /(      )\\ )     '.red);
    log.info('   )\\    )\\())  ( (()/((    '.red);
    log.info('((((_)( ((_)\\   )\\ /(_))\\   '.red);
    log.info(' )\\ '.red + '_'.cyan + ' )\\ '.red + '_'.cyan + '(('.red + '_'.cyan + ') (('.red + '_'.cyan + ')'.red + '_'.cyan + '))(('.red + '_'.cyan + ')  '.red);
    log.info(' (_)'.red + '_\\'.cyan + '(_)'.red + '_  / | | | _ \\ __| '.cyan);
    log.info('  / _ \\  / /| |_| |   / _| '.cyan);
    log.info(' /_/ \\_\\/___|\\___/|_|_\\___| '.cyan);
    log.info('');
    log.info('Windows Azure: Microsoft\'s Cloud Platform');


    helpCommands(this);
    helpCategories(this);
    helpOptions(this);
    return "";
};

function categoryHelpInformation() {
    log.help(this.description());
    helpCommands(this);
    helpCategories(this);
    helpOptions(this);
    return "";
};

function commandHelpInformation() {
    log.help(this.description());
    log.help('');
    log.help('Usage:', this.fullName() + ' ' + this.usage());
    helpOptions(this);
    return "";
}

function helpCategories(parent) {
    for (var name in parent.categories) {
        var cat = parent.categories[name];
        log.help('');
        log.help(cat.description().cyan);
        cat.commands.forEach(function (cmd) {
            log.help(' ', cmd.fullName() + ' ' + cmd.usage());
        });
        helpCategories(cat);
        for (var subCat in cat.categories) {
            helpCategories(cat.categories[subCat]);
            //log.help(' ', cat.categories[subCat].fullName() + ' ...');
        }
    }
}

function helpCommands(parent) {
    parent.commands.forEach(function (cmd) {
        log.help('');
        log.help(cmd.description().cyan);
        log.help(' ', cmd.fullName() + ' ' + cmd.usage());
    });
}

function helpOptions(cmd) {
    log.help('');
    log.help('Options:');
    cmd.optionHelp().split('\n').forEach(function (line) { log.help(' ', line); });
}

function harvestPlugins() {
    function scan(scanPath) {
        var results = fs.readdirSync(scanPath);

        results = results.filter(function (filePath) {
            if (filePath.substring(0, 5) === 'tmp--') {
                return false;
            }
            if (filePath.substring(filePath.length - 4) === '_.js') {
                return false;
            }
            return true;
        });

        // combine file path
        results = results.map(function (fileName) {
            return path.join(scanPath, fileName);
        });

        // skip directories
        results = results.filter(function (filePath) {
            return fs.statSync(filePath).isFile();
        });

        // load modules
        results = results.map(function (filePath) {
            return require(filePath);
        });

        // look for exports.init
        results = results.filter(function (entry) {
            return entry.init !== undefined;
        });
        return results;
    }

    var basePath = path.dirname(__filename);
    var plugins = scan(path.join(basePath, 'commands'));
    plugins.forEach(function (plugin) { plugin.init(cli); });
}

harvestPlugins();

exports = module.exports = cli;
