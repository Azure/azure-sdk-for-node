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

var commander = require('commander');
var fs = require('fs');
var path = require('path');
var tty = require('tty');
var util = require('util');

var log = require('winston');
var colors = require('colors');
var eyes = require('eyes');
var Table = require('easy-table');

require('./patch-winston');

// Install global unhandled exception handler to make unexpected errors more user-friendly.
if (!process.env.AZURE_DEBUG || process.env.AZURE_DEBUG !== '1') {
    process.on('uncaughtException', function (err) {
        clearProgress();
        
        var loggedFullError = false;
        if (err.message) {
            log.error(err.message);
        } else if (err.Message) {
            log.error(err.Message);
        } else {
            log.json('error', err);
            loggedFullError = true;
        }

        if (!loggedFullError) {
            if (err.stack) {
                log.verbose('stack', err.stack);
            }

            log.json('silly', err);
        }
        
        cli.exit('error', null, 1);
    });
}

///////////////////////////
// prepare output logger

// use cli output settings by default
log.cli();

log.format = function(options) {
    var transport = log['default'].transports.console;  
    if (arguments.length === 0) {
        return {
            json: transport.json,
            terse: transport.terse,
            level: transport.level,
            logo: log.format.logo
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
    if (options.logo) {
        log.format.logo = options.logo;
    }
};


log.json = function (level, data) {
    if (arguments.length == 1) {
        data = level;
        level = 'data';
    }
    if (log.format().json) {
        log.log(level, typeof data, data);
    } else {
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
        log.log(level, 'table', data);
    } else {
        var table = new Table();
        table.LeftPadder = Table.LeftPadder;
        table.padLeft = Table.padLeft;
        table.RightPadder = Table.RightPadder;
        table.padRight = Table.padRight;

        if (data && data.forEach) {
            data.forEach(function (item) { transform(table, item); table.newLine(); });
        } else if (data) {
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
};

// prepare root cli command
var cli = new commander.Command();

var progressChars = ['-', '\\', '|', '/'];
var progressIndex = 0;
var activeProgressTimer;

function drawAndUpdateProgress() {
    fs.writeSync(2, '\r');
    process.stderr.write(progressChars[progressIndex].cyan);

    progressIndex = progressIndex + 1;
    if (progressIndex == progressChars.length) {
      progressIndex = 0;
    }
}

function clearProgress() {
    fs.writeSync(2, '\r');
    fs.writeSync(2, clearBuffer);
    fs.writeSync(2, '\r');
}

var clearBuffer = new Buffer(79, 'utf8');
clearBuffer.fill(' ');
clearBuffer = clearBuffer.toString();

cli.progress = function(label) {
    if (log.format().level === 'verbose' || log.format().level === 'silly') {
        log.verbose(label);
        return { end: function() {} };
    }

    // Clear the console
    fs.writeSync(2, '\r');
    fs.writeSync(2, clearBuffer);
    
    // Draw initial progress
    drawAndUpdateProgress();
    
    // Draw label
    if (label) {
        fs.writeSync(2, ' ' + label);
    }
    
    activeProgressTimer = setInterval(function() {
        drawAndUpdateProgress();
    }, 200);

    return {
        end: function() {
            clearInterval(activeProgressTimer);
            activeProgressTimer = null;
            
            clearProgress();
        }
    };
};

cli.output = log;
enableNestedCommands(cli);


cli.exit = function (level, message, exitCode) {
    if (message) {
        log.log(level, message);
    }
    process.exit(exitCode);
};

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
            } else if (raw[i] === '-v' || raw[i] === '--verbose') {
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
            if (command.categories[category].args.length === 0) {
                args.push('-h');
                command.categories[category].parse(args);
            }
        }
    });
}

// Allow cli.password to accept empty passwords
commander.Command.prototype.password = function(str, mask, fn){
    var self = this
      , buf = '';

    // default mask
    if ('function' === typeof mask) {
        fn = mask;
        mask = '';
    }

    process.stdin.resume();
    tty.setRawMode(true);
    process.stdout.write(str);

    // keypress
    process.stdin.on('keypress', function(c, key){
        if (key && 'enter' === key.name) {
            console.log();
            process.stdin.removeAllListeners('keypress');
            tty.setRawMode(false);
            fn(buf);
            return;
        }

        if (key && key.ctrl && 'c' === key.name) {
            console.log('%s', buf);
            process.exit();
        }

        process.stdout.write(mask);
        buf += c;
    }).resume();
};


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
                } else if (err.Message) {
                    log.error(err.Message);
                    log.json('verbose', err);
                } else {
                    log.error(err);
                }

                cli.exit('error', self.fullName().bold + ' command ' + 'failed'.red.bold, 1);
            } else {
                cli.exit('info', self.fullName().bold + ' command ' + 'OK'.green.bold, 0);
            }
        }
    });
};




//////////////////////////////
// override help subsystem

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
    if (log.format().logo === 'fire') {
        log.info('            )      (        '.red);
        log.info('   (     ( /(      )\\ )     '.red);
        log.info('   )\\    )\\())  ( (()/((    '.red);
        log.info('((((_)( ((_)\\   )\\ /(_))\\   '.red);
        log.info(' )\\ '.red + '_'.cyan + ' )\\ '.red + '_'.cyan + '(('.red + '_'.cyan + ') (('.red + '_'.cyan + ')'.red + '_'.cyan + '))(('.red + '_'.cyan + ')  '.red);
        log.info(' (_)'.red + '_\\'.cyan + '(_)'.red + '_  / | | | _ \\ __| '.cyan);
        log.info('  / _ \\  / /| |_| |   / _| '.cyan);
        log.info(' /_/ \\_\\/___|\\___/|_|_\\___| '.cyan);
        log.info('');
    } else if (log.format().logo === 'clouds') {
        log.info('         _    _____   _ ___ ___'.cyan);
        log.info('        /_\\  |_  / | | | _ \\ __|'.cyan);
        log.info('  _ ___'.grey+'/ _ \\'.cyan+'__'.grey+'/ /| |_| |   / _|'.cyan+'___ _ _'.grey);
        log.info('(___  '.grey+'/_/ \\_\\/___|\\___/|_|_\\___|'.cyan+' _'.grey+'tm'.cyan+'__)'.grey);
        log.info('   (_______ _ _)         _ ______ _)_ _ '.grey);
        log.info('          (______________ _ )   (___ _ _)'.grey);
        log.info('');
    } else if (log.format().logo === 'on') {
        log.info('   _    _____   _ ___ ___ '.cyan);
        log.info('  /_\\  |_  / | | | _ \\ __|'.cyan);
        log.info(' / _ \\  / /| |_| |   / _| '.cyan);
        log.info('/_/ \\_\\/___|\\___/|_|_\\___|'.cyan);
        log.info('');
    }
    log.info('Windows Azure: Microsoft\'s Cloud Platform');


    helpCommands(this);
    helpCategories(this);
    helpOptions(this);
    return '';
}

function categoryHelpInformation() {
    log.help(this.description());
    helpCommands(this);
    helpCategories(this);
    helpOptions(this);
    return '';
}

function commandHelpInformation() {
    log.help(this.description());
    log.help('');
    log.help('Usage:', this.fullName() + ' ' + this.usage());
    helpOptions(this);
    return '';
}

function helpCategories(parent) {
    for (var name in parent.categories) {
        var cat = parent.categories[name];
        log.help('');
        log.help(cat.description().cyan);
        for (var index in cat.commands) {
            var cmd = cat.commands[index];
            log.help(' ', cmd.fullName() + ' ' + cmd.usage());
        }
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



//////////////////////////////
// load command plugins

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

function harvestModules() {
    var basePath = path.dirname(__filename);
    
    var walkPath = path.join(basePath, '../../node_modules');
    var harvestPaths = [walkPath];

    while(path.basename(walkPath) === 'node_modules' && path.dirname(walkPath) !== 'npm') {
        var nextPath = path.join(walkPath, '../..');
        if (nextPath === walkPath) {
            break;
        }
        harvestPaths.push(nextPath);
        walkPath = nextPath;
    }

    var modules = [];
    harvestPaths.forEach(function(harvestPath) {
        modules = modules.concat(scan(harvestPath));
    });

    modules.forEach(function(module) {
        module.plugin.init(cli);
    });

    function scan(scanPath) {
        var results = fs.readdirSync(scanPath);

        results = results.map(function(moduleName) {
            return {
                moduleName: moduleName,
                modulePath: path.join(scanPath, moduleName)
            };
        });

        results = results.filter(function(item) {
            item.moduleStat = fs.statSync(item.modulePath);
            return item.moduleStat.isDirectory();
        });

        results = results.filter(function(item) {
            item.packagePath = path.join(item.modulePath, 'package.json');
            item.packageStat = path.existsSync(item.packagePath) ? fs.statSync(item.packagePath) : undefined;
            return item.packageStat && item.packageStat.isFile();
        });

        results = results.filter(function(item) {
            try {
                item.packageInfo = JSON.parse(fs.readFileSync(item.packagePath));
                return item.packageInfo && item.packageInfo.plugins && item.packageInfo.plugins['azure-cli'];
            }
            catch(err) {
                return false;
            }
        });

        results = flatten(results.map(function(item) {
            var plugins = item.packageInfo.plugins['azure-cli'];
            if (typeof plugins !== 'array') {
                plugins = [plugins];
            }
            
            return plugins.map(function(relativePath) {
                return {
                    context: item,
                    pluginPath: path.join(item.modulePath, relativePath)
                };
            });
        }));
        
        results = results.filter(function(item) {
            item.plugin = require(item.pluginPath);
            return item.plugin.init;
        });

        return results;
    }

    function flatten(arrays) {        
        var result = [];
        arrays.forEach(function(array) {
            result = result.concat(array);
        });
        return result;
    }
}

harvestPlugins();
harvestModules();

exports = module.exports = cli;
