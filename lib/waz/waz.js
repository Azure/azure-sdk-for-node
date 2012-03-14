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


waz.categories = {};

waz.category = function (name) {
    var category = waz.categories[name];
    if (!waz.categories[name]) {
        category = waz.categories[name] = new commander.Command();
        category.name = name;
        category.helpInformation = categoryHelpInformation;
        enableNestedCommands(category);
    }
    return category;
}

function enableNestedCommands(command) {
    command.option('-v, --verbose', 'use verbose output');

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

        if (!waz.categories[category]) {
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

function rootHelpInformation() {
    log.info('            )      (        '.red);
    log.info('   (     ( /(      )\\ )     '.red);
    log.info('   )\\    )\\())  ( (()/((    '.red);
    log.info('((((_)( ((_)\\   )\\ /(_))\\   '.red);
    log.info(' )\\ '.red + '_'.cyan + ' )\\ '.red + '_'.cyan + '(('.red + '_'.cyan + ') (('.red + '_'.cyan + ')'.red + '_'.cyan + '))(('.red + '_'.cyan + ')  '.red);
    log.info(' (_)'.red + '_\\'.cyan + '(_)'.red + '_  / | | | _ \\ __| '.cyan);
    log.info('  / _ \\  / /| |_| |   / _|  '.cyan);
    log.info(' /_/ \\_\\/___|\\___/|_|_\\___| by Microsoft'.cyan);


    for (var name in this.categories) {
        var cat = this.categories[name];
        log.help('');
        log.help(cat.description().cyan);
        cat.commands.forEach(function (cmd) {
            log.help(' ', cat.name + ' ' + cmd.name + ' ' + cmd.usage());
        });
    }

    optionsHelpInformation(this);
//    log.help('');
//    log.help('Options:');
//    var ops = this.optionHelp().split('\n');
//    for(var x in ops){
//        log.help(' ', ops[x]);
//    }
    return "";
};

function categoryHelpInformation() {
    log.help(this.description());
    this.commands.forEach(function (cmd) {
        log.help('');
        log.help(cmd.description().cyan);
        log.help(' ', cmd.parent.name + ' ' + cmd.name + ' ' + cmd.usage());
    });

    optionsHelpInformation(this);
    return "";
};

function commandHelpInformation() {
    //log.help('command help');
    log.help(this.description());
    log.help('');
    log.help('Usage:', this.parent.name + ' ' + this.name + ' ' + this.usage());
//    log.help('');
//    log.help('Options:');
//    this.optionHelp().split('\n').forEach(function (line) { log.help(' ', line); });

    optionsHelpInformation(this);
    return "";
}

function optionsHelpInformation(cmd) {
    log.help('');
    log.help('Options:');
    cmd.optionHelp().split('\n').forEach(function (line) { log.help(' ', line); });
//    var ops = cmd.optionHelp().split('\n');
//    for (var x in ops) {
//        log.help(' ', ops[x]);
//    }
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
