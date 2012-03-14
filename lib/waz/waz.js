var commander = require('commander');
var fs = require('fs');
var path = require('path');
var colors = require('colors');

var waz = new commander.Command();

var log = waz.output = require('winston');

log.setLevel = function (level) {
    waz.output.remove(waz.output.transports.Console);
    waz.output.add(waz.output.transports.Console, { level: level });
    waz.output.cli();
};

log.setLevel('info');


function enableNestedCommands(command) {
    command.option('-v, --verbose', 'use verbose output');

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
        var category = '*';
        for (var i = 0, len = raw.length; i < len; ++i) {
            if (raw[i] === '-v' || raw[i] === '--verbose') {
                ++verbose;
            } else if (category === '*') {
                category = raw[i];
            } else {
                args.push(raw[i]);
            }
        }
        if (verbose == 1) {
            log.setLevel('verbose');
        } else if (verbose >= 2) {
            log.setLevel('silly');
        }

        if (!command.categories[category]) {
            log.error("Unknown command", category);
        } else {
            command.categories[category].parse(args);
            if (command.categories[category].args.length == 0) {
                args.push('-h');
                command.categories[category].parse(args);
            }
        }
    });
}



enableNestedCommands(waz);

waz.helpInformation = rootHelpInformation;
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

var commandsPath = path.join(path.dirname(__filename), 'commands');
var commandFiles = fs.readdirSync(commandsPath);

for (var i = 0; i < commandFiles.length; i++) {
    var commandFile = path.join(commandsPath, commandFiles[i]);
    if (!fs.statSync(commandFile).isFile()) {
        continue;
    }
    require(commandFile).init(waz);
}

exports = module.exports = waz;
